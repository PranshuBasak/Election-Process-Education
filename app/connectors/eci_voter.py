"""ECI Voter Helpline connector — gateway-voters.eci.gov.in

Powers: Polling Station Lookup, Eligibility Wizard, EPIC search.
"""

from __future__ import annotations

import logging
from typing import Any

import httpx

logger = logging.getLogger(__name__)

BASE = "https://gateway-voters.eci.gov.in/api/v1"
HEADERS = {
    "applicationName": "VSP",
    "appVersion": "web",
    "Accept": "application/json",
}
TIMEOUT = 10


async def _get(path: str, params: dict | None = None) -> dict:
    async with httpx.AsyncClient(timeout=TIMEOUT) as c:
        r = await c.get(f"{BASE}{path}", params=params or {}, headers=HEADERS)
        r.raise_for_status()
        return r.json()


async def get_states() -> list[dict]:
    """Fetch master list of states."""
    try:
        data = await _get("/common/states")
        return data.get("data", data.get("states", []))
    except Exception:
        logger.exception("Failed to fetch states")
        return []


async def get_districts(state_code: str) -> list[dict]:
    """Fetch districts for a state."""
    try:
        data = await _get(f"/common/districts/{state_code}")
        return data.get("data", data.get("districts", []))
    except Exception:
        logger.exception("Failed to fetch districts for state=%s", state_code)
        return []


async def get_constituencies(state_code: str, district_code: str) -> list[dict]:
    """Fetch assembly constituencies."""
    try:
        data = await _get(f"/common/acs/{state_code}/{district_code}")
        return data.get("data", data.get("acs", []))
    except Exception:
        logger.exception("Failed to fetch ACs")
        return []


async def search_by_epic(epic_or_query: str, state_code: str = "") -> dict | None:
    """Search elector by EPIC number."""
    try:
        data = await _get(
            "/elector/search-by-epic",
            params={"epicNumber": epic_or_query, "stateCode": state_code},
        )
        return data
    except Exception:
        logger.exception("EPIC search failed for %s", epic_or_query)
        return None


async def search_polling_station(query: str) -> dict | None:
    """Search polling station — accepts address-like query or part number.

    In practice the Voter Helpline API requires stateCode/acNo/partNo.
    This wrapper attempts a best-effort lookup and returns structured data.
    """
    try:
        # The query may come from chat; we return guidance rather than
        # a direct API hit since the endpoint needs structured params.
        return {
            "message": (
                "To find your polling station, please visit https://voters.eci.gov.in "
                "and search using your EPIC number or name + address details. "
                "You can also use the Voter Helpline app available on Android and iOS."
            ),
            "source_url": "https://voters.eci.gov.in",
        }
    except Exception:
        logger.exception("Polling station search failed")
        return None


async def track_form(reference_id: str, mobile: str = "") -> dict | None:
    """Track voter registration form status."""
    try:
        params: dict[str, Any] = {"referenceId": reference_id}
        if mobile:
            params["mobile"] = mobile
        data = await _get("/forms/track", params=params)
        return data
    except Exception:
        logger.exception("Form tracking failed for ref=%s", reference_id)
        return None
