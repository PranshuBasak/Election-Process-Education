"""Timeline router — GET /api/timeline

Returns election phase timeline from ECI schedule connector.
"""

from __future__ import annotations

from fastapi import APIRouter

from backend.models.schemas import TimelineItem
from backend.connectors import eci_schedule
from backend.services.cache import cache, TTL_SCHEDULE

from backend.services import i18n

router = APIRouter(prefix="/api", tags=["timeline"])


@router.get("/timeline", response_model=list[TimelineItem])
async def get_timeline(locale: str = "en") -> list[TimelineItem]:
    cache_key = f"timeline:schedule:{locale}"
    cached = cache.get(cache_key)
    if cached is not None:
        return cached

    raw = await eci_schedule.fetch_latest_schedule()
    items = []
    for r in raw:
        phase = r.get("phase", "")
        description = r.get("description", "")
        
        if locale == "hi":
            phase = await i18n.translate(phase, "hi")
            description = await i18n.translate(description, "hi")
            
        items.append(TimelineItem(
            phase=phase,
            start=r.get("start", r.get("date", "")),
            end=r.get("end", ""),
            description=description,
            legal_ref=r.get("legal_ref", ""),
            source_url=r.get("source_url", ""),
        ))
        
    cache.set(cache_key, items, TTL_SCHEDULE)
    return items
