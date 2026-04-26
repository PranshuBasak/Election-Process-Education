"""RAG service — routes user intents to the correct connectors.

Intent→Connector routing table (from API.md §9).
Fetches context, wraps in UNTRUSTED blocks, feeds to Gemini.
"""

from __future__ import annotations

import logging
from typing import Any

from backend.services import gemini
from backend.services.cache import cache, TTL_SCHEDULE, TTL_PROCEDURAL, TTL_GLOSSARY, TTL_RESULTS
from backend.connectors import eci_voter, eci_results, eci_schedule, data_gov_in, wiki

logger = logging.getLogger(__name__)

# Intent → (primary_connector_func, fallback_func, cache_ttl)
ROUTING_TABLE: dict[str, dict[str, Any]] = {
    "election_timeline": {
        "primary": eci_schedule.fetch_latest_schedule,
        "fallback": None,
        "ttl": TTL_SCHEDULE,
    },
    "current_results": {
        "primary": eci_results.fetch_overview,
        "fallback": None,
        "ttl": TTL_RESULTS,
    },
    "historical_results": {
        "primary": data_gov_in.fetch_general_election_results,
        "fallback": None,
        "ttl": TTL_GLOSSARY,
    },
    "find_polling_station": {
        "primary": eci_voter.search_polling_station,
        "fallback": None,
        "ttl": TTL_PROCEDURAL,
    },
    "check_epic": {
        "primary": eci_voter.search_by_epic,
        "fallback": None,
        "ttl": TTL_PROCEDURAL,
    },
    "am_i_eligible": {
        "primary": None,
        "fallback": None,
        "ttl": TTL_GLOSSARY,
    },
    "how_to_register": {
        "primary": eci_schedule.fetch_registration_info,
        "fallback": wiki.fetch_article,
        "ttl": TTL_GLOSSARY,
    },
    "define_term": {
        "primary": wiki.fetch_article,
        "fallback": None,
        "ttl": TTL_GLOSSARY,
    },
    "mp_for_my_area": {
        "primary": eci_voter.search_by_epic,
        "fallback": None,
        "ttl": TTL_PROCEDURAL,
    },
    "general_question": {
        "primary": None,
        "fallback": None,
        "ttl": TTL_PROCEDURAL,
    },
}


def _wrap_untrusted(content: str) -> str:
    """Wrap fetched content in clearly delimited UNTRUSTED block."""
    return f"--- UNTRUSTED CONTEXT START ---\n{content[:6000]}\n--- UNTRUSTED CONTEXT END ---"


async def fetch_context(intent: str, message: str) -> str:
    """Fetch context for a given intent from the appropriate connector."""
    route = ROUTING_TABLE.get(intent, ROUTING_TABLE["general_question"])

    # Check cache first
    cache_key = f"rag:{intent}:{message[:100]}"
    cached = cache.get(cache_key)
    if cached is not None:
        return cached

    context_parts: list[str] = []

    # Static context for eligibility
    if intent == "am_i_eligible":
        context_parts.append(
            "Indian Election Eligibility Rules (Source: https://www.eci.gov.in):\n"
            "1. Must be an Indian citizen.\n"
            "2. Must be 18 years of age or older on the qualifying date (1st January of the year of revision).\n"
            "3. Must be a resident of the constituency where they wish to vote.\n"
            "4. Must not be disqualified under any law (e.g., unsound mind, convicted of certain offences).\n"
            "5. Must be registered in the electoral roll and possess an EPIC (Voter ID card).\n"
            "6. Registration can be done via Form 6 online at https://voters.eci.gov.in or through the Voter Helpline app.\n"
        )

    # Try primary connector
    primary_fn = route.get("primary")
    if primary_fn is not None:
        try:
            data = await primary_fn(message)
            if data:
                context_parts.append(str(data))
        except Exception:
            logger.exception("Primary connector failed for intent=%s", intent)

    # Try fallback if primary yielded nothing
    if not context_parts:
        fallback_fn = route.get("fallback")
        if fallback_fn is not None:
            try:
                data = await fallback_fn(message)
                if data:
                    context_parts.append(str(data))
            except Exception:
                logger.exception("Fallback connector failed for intent=%s", intent)

    context = "\n\n".join(context_parts) if context_parts else ""

    if context:
        cache.set(cache_key, context, route.get("ttl", TTL_PROCEDURAL))

    return context


async def answer_question(message: str, locale: str = "en") -> dict[str, Any]:
    """Full RAG pipeline: classify → fetch context → generate answer."""
    intent = await gemini.classify_intent(message)
    context = await fetch_context(intent, message)
    result = await gemini.generate_answer(context, message, locale)
    result["intent"] = intent
    return result
