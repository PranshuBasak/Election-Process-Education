"""Timeline router — GET /api/timeline

Returns election phase timeline from ECI schedule connector.
"""

from __future__ import annotations

from fastapi import APIRouter

from app.models.schemas import TimelineItem
from app.connectors import eci_schedule
from app.services.cache import cache, TTL_SCHEDULE

router = APIRouter(prefix="/api", tags=["timeline"])


@router.get("/timeline", response_model=list[TimelineItem])
async def get_timeline() -> list[TimelineItem]:
    cached = cache.get("timeline:schedule")
    if cached is not None:
        return cached

    raw = await eci_schedule.fetch_latest_schedule()
    items = [
        TimelineItem(
            phase=r.get("phase", ""),
            start=r.get("start", r.get("date", "")),
            end=r.get("end", ""),
            description=r.get("description", ""),
            legal_ref=r.get("legal_ref", ""),
            source_url=r.get("source_url", ""),
        )
        for r in raw
    ]
    cache.set("timeline:schedule", items, TTL_SCHEDULE)
    return items
