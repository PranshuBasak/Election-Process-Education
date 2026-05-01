"""User progress routers.

The header-based `/api/user/progress` route keeps existing frontend calls
working. The `/api/progress/{user_id}` routes match the API guide and make the
Firestore integration easy to demonstrate.
"""

from __future__ import annotations

from typing import Any

from fastapi import APIRouter, Header
from pydantic import BaseModel, Field

from backend.connectors import firestore

router = APIRouter(prefix="/api/user", tags=["user"])
progress_router = APIRouter(prefix="/api", tags=["progress"])


class ProgressRequest(BaseModel):
    data: dict[str, Any] = Field(default_factory=dict)


@router.post("/progress")
async def save_progress(req: ProgressRequest, x_user_id: str | None = Header(default=None)) -> dict[str, Any]:
    if not x_user_id:
        return {"status": "skipped", "message": "No User-ID provided", "persisted": False}

    persisted = await firestore.save_user_progress(x_user_id, req.data)
    return {"status": "ok", "persisted": persisted}


@router.get("/progress")
async def get_progress(x_user_id: str | None = Header(default=None)) -> dict[str, Any]:
    if not x_user_id:
        return {}

    return await firestore.get_user_progress(x_user_id)


@progress_router.get("/progress/{user_id}")
async def get_progress_by_user(user_id: str) -> dict[str, Any]:
    return await firestore.get_user_progress(user_id)


@progress_router.put("/progress/{user_id}")
async def put_progress_by_user(user_id: str, req: ProgressRequest) -> dict[str, Any]:
    persisted = await firestore.save_user_progress(user_id, req.data)
    return {"status": "ok", "persisted": persisted}
