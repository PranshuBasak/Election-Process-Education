"""Wikipedia REST connector — glossary fallback.

Powers: Glossary definitions, define_term intent.
"""

from __future__ import annotations

import logging
import re

import httpx

logger = logging.getLogger(__name__)

BASE = "https://en.wikipedia.org/api/rest_v1"
TIMEOUT = 10


async def fetch_article(term: str) -> dict | None:
    """Fetch a Wikipedia summary for the given term."""
    # Normalise: title case, replace spaces with underscores
    title = term.strip().replace(" ", "_").title()
    try:
        async with httpx.AsyncClient(timeout=TIMEOUT) as c:
            r = await c.get(f"{BASE}/page/summary/{title}")
            if r.status_code == 404:
                return None
            r.raise_for_status()
            data = r.json()
            # Strip HTML from extract_html
            extract = data.get("extract", "")
            return {
                "term": term,
                "definition": extract,
                "source_url": data.get("content_urls", {}).get("desktop", {}).get("page", f"https://en.wikipedia.org/wiki/{title}"),
            }
    except Exception:
        logger.exception("Wikipedia fetch failed for term=%s", term)
        return None


async def fetch_election_term(term: str) -> str:
    """Fetch definition text for an election-related term."""
    result = await fetch_article(term)
    if result:
        return f"{result['definition']}\n\nSource: {result['source_url']}"
    return ""
