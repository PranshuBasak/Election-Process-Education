"""LokDhaba connector — lokdhaba.ashoka.edu.in (TCPD, Ashoka University).

Cleanest historical constituency-level results (1962→present).
Powers: Longitudinal trend charts, historical_trend_for_constituency intent.
"""

from __future__ import annotations

import logging

import httpx

logger = logging.getLogger(__name__)

BASE = "https://lokdhaba.ashoka.edu.in/api"
TIMEOUT = 20


async def fetch_general_elections() -> list[dict]:
    """Fetch general election dataset."""
    try:
        async with httpx.AsyncClient(timeout=TIMEOUT) as c:
            r = await c.get(f"{BASE}/dataset/GE")
            r.raise_for_status()
            return r.json()
    except Exception:
        logger.exception("LokDhaba GE fetch failed")
        return []


async def fetch_assembly_elections() -> list[dict]:
    """Fetch assembly election dataset."""
    try:
        async with httpx.AsyncClient(timeout=TIMEOUT) as c:
            r = await c.get(f"{BASE}/dataset/AE")
            r.raise_for_status()
            return r.json()
    except Exception:
        logger.exception("LokDhaba AE fetch failed")
        return []


async def fetch_party_lookup() -> list[dict]:
    """Fetch party abbreviation map."""
    try:
        async with httpx.AsyncClient(timeout=TIMEOUT) as c:
            r = await c.get(f"{BASE}/party-lookup")
            r.raise_for_status()
            return r.json()
    except Exception:
        logger.exception("LokDhaba party-lookup fetch failed")
        return []
