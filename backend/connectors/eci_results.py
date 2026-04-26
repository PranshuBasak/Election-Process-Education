"""ECI Results portal connector — results.eci.gov.in

Powers: Live Results screen, homepage status strip, current_results intent.
"""

from __future__ import annotations

import logging

import httpx

logger = logging.getLogger(__name__)

# Active election slug — update per cycle (kept in sources.yaml at runtime)
ACTIVE_SLUG = "PcResultGenJune2024"
BASE = "https://results.eci.gov.in"
TIMEOUT = 15


async def _get_json(path: str) -> dict | list | None:
    url = f"{BASE}/{path}"
    try:
        async with httpx.AsyncClient(timeout=TIMEOUT) as c:
            r = await c.get(url)
            r.raise_for_status()
            return r.json()
    except Exception:
        logger.exception("ECI results fetch failed: %s", url)
        return None


async def fetch_overview(query: str = "") -> dict | None:
    """Fetch election overview (seat tally, party standings)."""
    data = await _get_json(f"{ACTIVE_SLUG}/election-overview.json")
    if data is None:
        return {
            "message": "Live results are currently unavailable. Visit https://results.eci.gov.in for the latest data.",
            "source_url": "https://results.eci.gov.in",
        }
    return {
        "overview": data,
        "source_url": f"{BASE}/{ACTIVE_SLUG}/election-overview.json",
    }


async def fetch_statewise(state_code: str) -> dict | None:
    """Fetch state-wise results."""
    return await _get_json(f"{ACTIVE_SLUG}/statewise{state_code}.json")


async def fetch_constituency(pc_code: str) -> dict | None:
    """Fetch constituency-wise results."""
    return await _get_json(f"{ACTIVE_SLUG}/Constituencywise{pc_code}.json")


async def fetch_partywise(state_code: str) -> dict | None:
    """Fetch party-wise results for a state."""
    return await _get_json(f"{ACTIVE_SLUG}/partywiseresult-{state_code}.json")
