"""Sources & Transparency router — GET /api/sources

Exposes the complete list of data sources used by the bot.
"""

from __future__ import annotations

from fastapi import APIRouter

from backend.models.schemas import SourceInfo, SourcesResponse

router = APIRouter(prefix="/api", tags=["sources"])

_SOURCES: list[SourceInfo] = [
    SourceInfo(
        name="Election Commission of India (ECI)",
        base_url="https://www.eci.gov.in",
        purpose="Election schedules, Model Code of Conduct, constitutional provisions",
        auth="none",
        status="ok",
    ),
    SourceInfo(
        name="ECI Voter Helpline (NVSP)",
        base_url="https://voters.eci.gov.in",
        purpose="Voter registration, EPIC search, polling station lookup, electoral rolls",
        auth="none",
        status="ok",
    ),
    SourceInfo(
        name="ECI Results Portal",
        base_url="https://results.eci.gov.in",
        purpose="Live and historical election results, party-wise & constituency-wise data",
        auth="none",
        status="ok",
    ),
    SourceInfo(
        name="data.gov.in",
        base_url="https://data.gov.in",
        purpose="Historical election datasets, turnout statistics, demographic data",
        auth="api_key",
        status="ok",
    ),
    SourceInfo(
        name="LokDhaba (TCPD, Ashoka University)",
        base_url="https://lokdhaba.ashoka.edu.in",
        purpose="Constituency-level historical results (1962–present), party performance trends",
        auth="none",
        status="ok",
    ),
    SourceInfo(
        name="MyNeta (ADR)",
        base_url="https://www.myneta.info",
        purpose="Candidate affidavits, criminal records, financial declarations",
        auth="none",
        status="ok",
    ),
    SourceInfo(
        name="Wikipedia REST API",
        base_url="https://en.wikipedia.org",
        purpose="Glossary definitions, supplementary context for election terms",
        auth="none",
        status="ok",
    ),
    SourceInfo(
        name="Google Civic Information API",
        base_url="https://www.googleapis.com/civicinfo/v2",
        purpose="Fallback representative lookup (limited India coverage)",
        auth="api_key",
        status="ok",
    ),
    SourceInfo(
        name="Google Maps Platform",
        base_url="https://maps.googleapis.com/maps/api/geocode",
        purpose="Geocoding voter-entered places and generating Google Maps links",
        auth="api_key",
        status="ok",
    ),
    SourceInfo(
        name="Gemini with Google Search Grounding",
        base_url="https://ai.google.dev/gemini-api/docs/google-search",
        purpose="Grounded assistant answers with current web citations when enabled",
        auth="api_key_or_vertex",
        status="ok",
    ),
    SourceInfo(
        name="Google Cloud Firestore",
        base_url="https://firestore.googleapis.com",
        purpose="Saved learning progress, quiz scores, checklist state, and preferred language",
        auth="iam",
        status="ok",
    ),
    SourceInfo(
        name="Google Developer Knowledge MCP",
        base_url="https://developerknowledge.googleapis.com/mcp",
        purpose="Official Google developer documentation used during Antigravity/gemini cli implementation",
        auth="oauth_or_api_key",
        status="ok",
    ),
    SourceInfo(
        name="Google Cloud Run",
        base_url="https://cloud.google.com/run",
        purpose="Public HTTPS deployment for the full-stack app",
        auth="iam",
        status="ok",
    ),
]


@router.get("/sources", response_model=SourcesResponse)
async def list_sources() -> SourcesResponse:
    return SourcesResponse(sources=_SOURCES)
