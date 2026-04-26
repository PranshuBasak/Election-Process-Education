"""data.gov.in connector — historical election datasets.

Only Indian election source with a formal REST contract + API key.
Powers: Historical charts, turnout comparison, historical_results intent.
"""

from __future__ import annotations

import logging
import os

import httpx

logger = logging.getLogger(__name__)

BASE = "https://api.data.gov.in/resource"
API_KEY = os.getenv("DATA_GOV_IN_KEY", "")
TIMEOUT = 20


async def fetch_resource(
    resource_id: str,
    filters: dict | None = None,
    limit: int = 100,
    offset: int = 0,
) -> list[dict]:
    """Fetch records from a data.gov.in resource."""
    if not API_KEY:
        logger.warning("DATA_GOV_IN_KEY not set — data.gov.in calls will fail")
        return []

    params: dict = {
        "api-key": API_KEY,
        "format": "json",
        "limit": str(limit),
        "offset": str(offset),
    }
    if filters:
        for k, v in filters.items():
            params[f"filters[{k}]"] = v

    try:
        async with httpx.AsyncClient(timeout=TIMEOUT) as c:
            r = await c.get(f"{BASE}/{resource_id}", params=params)
            r.raise_for_status()
            data = r.json()
            return data.get("records", [])
    except Exception:
        logger.exception("data.gov.in fetch failed for resource=%s", resource_id)
        return []


async def fetch_general_election_results(query: str = "") -> dict:
    """Fetch general election historical results (fallback summary)."""
    # Resource IDs are dynamic; return guidance when key is absent
    if not API_KEY:
        return {
            "message": (
                "Historical election data is available at https://data.gov.in. "
                "Search for 'General Election to Lok Sabha' for constituency-level results from 1977 to present."
            ),
            "source_url": "https://data.gov.in",
        }

    # Attempt fetch with a known resource pattern
    records = await fetch_resource("ge_results_placeholder", limit=50)
    return {
        "records": records,
        "source_url": "https://data.gov.in",
    }
