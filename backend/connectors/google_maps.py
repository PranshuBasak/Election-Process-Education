"""Google Maps Platform connector.

Used for geocoding Indian addresses and generating Google Maps links. The
connector works without an API key by returning an "Open in Google Maps" search
URL, so local demos and tests remain reliable.
"""

from __future__ import annotations

import logging
import os
from typing import Optional, Tuple
from urllib.parse import quote_plus

import httpx

logger = logging.getLogger(__name__)

GOOGLE_MAPS_API_KEY = os.getenv("GOOGLE_MAPS_API_KEY")
TIMEOUT = 10


async def geocode_address(address: str) -> Tuple[Optional[float], Optional[float], Optional[str]]:
    """Convert an address to lat/lng and return a Google Maps URL."""
    clean_address = address.strip()
    if not clean_address:
        return None, None, None

    fallback_url = f"https://www.google.com/maps/search/?api=1&query={quote_plus(clean_address)}"
    if not GOOGLE_MAPS_API_KEY:
        logger.info("GOOGLE_MAPS_API_KEY not set; returning Maps search URL only.")
        return None, None, fallback_url

    try:
        async with httpx.AsyncClient(timeout=TIMEOUT) as client:
            resp = await client.get(
                "https://maps.googleapis.com/maps/api/geocode/json",
                params={"address": clean_address, "key": GOOGLE_MAPS_API_KEY, "region": "in"},
            )
            resp.raise_for_status()
            data = resp.json()

        if data.get("status") != "OK" or not data.get("results"):
            logger.warning("Geocoding failed for address=%s status=%s", clean_address, data.get("status"))
            return None, None, fallback_url

        result = data["results"][0]
        lat = result["geometry"]["location"]["lat"]
        lng = result["geometry"]["location"]["lng"]
        place_id = result.get("place_id", "")
        maps_url = f"https://www.google.com/maps/search/?api=1&query={lat},{lng}"
        if place_id:
            maps_url += f"&query_place_id={place_id}"
        return lat, lng, maps_url
    except Exception:
        logger.exception("Error during Google Maps geocoding")
        return None, None, fallback_url


def generate_maps_url(lat: float, lng: float, label: str = "") -> str:
    """Generate a Google Maps URL for coordinates."""
    return f"https://www.google.com/maps/search/?api=1&query={lat},{lng}"
