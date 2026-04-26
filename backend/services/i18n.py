"""i18n service — locale detection and Gemini-backed translation with cache."""

from __future__ import annotations

from app.services.cache import cache, TTL_GLOSSARY
from app.services import gemini


SUPPORTED_LOCALES = {"en", "hi"}
DEFAULT_LOCALE = "en"


def validate_locale(locale: str) -> str:
    """Return a supported locale or fall back to English."""
    return locale if locale in SUPPORTED_LOCALES else DEFAULT_LOCALE


async def translate(text: str, target: str = "hi") -> str:
    """Translate text with caching."""
    target = validate_locale(target)
    if target == "en":
        return text  # Source is assumed English

    cache_key = f"i18n:{target}:{hash(text)}"
    cached = cache.get(cache_key)
    if cached is not None:
        return cached

    translated = await gemini.translate_text(text, target)
    cache.set(cache_key, translated, TTL_GLOSSARY)
    return translated
