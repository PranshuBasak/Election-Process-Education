"""In-memory TTL cache for Election Education Bot.

TTLs (from PLAN.md):
  - schedules:   1 hour
  - procedural:  24 hours
  - glossary:    7 days
  - results:     30 seconds (live counting)
"""

from __future__ import annotations

import time
from typing import Any


# Pre-defined TTL buckets (seconds)
TTL_RESULTS = 30
TTL_SCHEDULE = 3600         # 1 hour
TTL_PROCEDURAL = 86_400     # 24 hours
TTL_GLOSSARY = 604_800      # 7 days


class _CacheEntry:
    __slots__ = ("value", "expires_at")

    def __init__(self, value: Any, ttl: float) -> None:
        self.value = value
        self.expires_at = time.monotonic() + ttl


class TTLCache:
    """Simple dict-backed cache with per-key TTL."""

    def __init__(self) -> None:
        self._store: dict[str, _CacheEntry] = {}

    def get(self, key: str) -> Any | None:
        entry = self._store.get(key)
        if entry is None:
            return None
        if time.monotonic() > entry.expires_at:
            del self._store[key]
            return None
        return entry.value

    def set(self, key: str, value: Any, ttl: float = TTL_PROCEDURAL) -> None:
        self._store[key] = _CacheEntry(value, ttl)

    def delete(self, key: str) -> None:
        self._store.pop(key, None)

    def clear(self) -> None:
        self._store.clear()

    def evict_expired(self) -> int:
        """Remove all expired entries. Returns count of evicted items."""
        now = time.monotonic()
        expired = [k for k, v in self._store.items() if now > v.expires_at]
        for k in expired:
            del self._store[k]
        return len(expired)


# Module-level singleton
cache = TTLCache()
