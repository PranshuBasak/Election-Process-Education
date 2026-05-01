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


from backend.connectors import google_maps

async def search_polling_station(query: str) -> dict | None:
    """Search polling station — geocodes the area and provides a link."""
    if not query:
        return None
        
    try:
        lat, lng, maps_url = await google_maps.geocode_address(query)
        return {
            "name": f"Polling Stations near {query}",
            "address": query,
            "lat": lat,
            "lng": lng,
            "open_maps_url": maps_url,
            "message": (
                f"I've found the general area for '{query}'. "
                "Please verify the exact booth number on your voter slip or "
                "at https://voters.eci.gov.in."
            ),
            "source_url": "https://voters.eci.gov.in",
        }
    except Exception:
        logger.exception("Polling station search failed")
        return {
            "message": "Unable to locate the area. Please try a more specific address or pincode.",
            "source_url": "https://voters.eci.gov.in",
        }


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
