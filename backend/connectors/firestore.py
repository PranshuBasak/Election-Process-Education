"""Google Cloud Firestore connector.

Firestore stores learning progress, quiz scores, checklist state, and language
preference. It is optional in local development and tests: if the Firestore
package or credentials are unavailable, calls degrade to no-op persistence.
"""

from __future__ import annotations

import logging
import os
from typing import Any

logger = logging.getLogger(__name__)

PROJECT_ID = os.getenv("GOOGLE_CLOUD_PROJECT") or os.getenv("VERTEX_PROJECT")

try:
    from google.cloud import firestore

    db = firestore.Client(project=PROJECT_ID) if PROJECT_ID else firestore.Client()
    logger.info("Firestore client initialised for project: %s", PROJECT_ID or "default")
except Exception:
    logger.warning("Firestore client unavailable. Progress persistence is disabled.")
    firestore = None
    db = None


async def save_user_progress(user_id: str, data: dict[str, Any]) -> bool:
    """Save or update user progress in Firestore."""
    if not db:
        return False

    try:
        db.collection("users").document(user_id).set(data, merge=True)
        return True
    except Exception:
        logger.exception("Failed to save user progress")
        return False


async def get_user_progress(user_id: str) -> dict[str, Any]:
    """Retrieve user progress from Firestore."""
    if not db:
        return {}

    try:
        doc = db.collection("users").document(user_id).get()
        return doc.to_dict() if doc.exists else {}
    except Exception:
        logger.exception("Failed to get user progress")
        return {}


async def log_quiz_score(user_id: str, topic: str, score: int, total: int) -> bool:
    """Log a completed quiz score."""
    if not db or firestore is None:
        return False

    try:
        db.collection("quiz_attempts").add(
            {
                "user_id": user_id,
                "topic": topic,
                "score": score,
                "total": total,
                "timestamp": firestore.SERVER_TIMESTAMP,
            }
        )
        return True
    except Exception:
        logger.exception("Failed to log quiz score")
        return False
