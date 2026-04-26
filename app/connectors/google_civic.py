"""Google Civic Information API connector — fallback representative lookup.

Coverage for India is thin; used only when ECI Voter Helpline fails.
"""

from __future__ import annotations

import logging
import os

import httpx

logger = logging.getLogger(__name__)

BASE = "https://www.googleapis.com/civicinfo/v2"
API_KEY = os.getenv("GOOGLE_CIVIC_KEY", "")
TIMEOUT = 10


async def lookup_representatives(address: str) -> dict | None:
    """Lookup representatives by address."""
    if not API_KEY:
        logger.warning("GOOGLE_CIVIC_KEY not set — civic lookup unavailable")
        return None

    try:
        async with httpx.AsyncClient(timeout=TIMEOUT) as c:
            r = await c.get(
                f"{BASE}/representatives",
                params={"address": address, "key": API_KEY},
            )
            r.raise_for_status()
            return r.json()
    except Exception:
        logger.exception("Google Civic lookup failed for address=%s", address)
        return None
