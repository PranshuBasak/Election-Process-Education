"""Pydantic v2 models for all Election Education Bot API surfaces."""

from __future__ import annotations

from pydantic import BaseModel, Field


# ── Chat ─────────────────────────────────────────────────────────────────
class ChatRequest(BaseModel):
    message: str = Field(..., min_length=1, max_length=2000)
    session_id: str = Field(default="")
    locale: str = Field(default="en", pattern=r"^(en|hi)$")


class Citation(BaseModel):
    title: str
    url: str


class ChatResponse(BaseModel):
    reply: str
    citations: list[Citation] = []
    intent: str = ""


# ── Timeline ─────────────────────────────────────────────────────────────
class TimelineItem(BaseModel):
    phase: str
    start: str
    end: str
    description: str = ""
    legal_ref: str = ""
    source_url: str = ""


# ── Learn Modules / Steps ────────────────────────────────────────────────
class Step(BaseModel):
    order: int
    title: str
    description_md: str
    who: str = ""
    source_url: str = ""


class LearnModule(BaseModel):
    slug: str
    title: str
    icon: str = ""
    summary: str = ""
    steps: list[Step] = []


# ── Glossary ─────────────────────────────────────────────────────────────
class GlossaryTerm(BaseModel):
    term: str
    definition_md: str
    source_url: str = ""


# ── Quiz ─────────────────────────────────────────────────────────────────
class QuizRequest(BaseModel):
    topic: str
    difficulty: str = Field(default="medium", pattern=r"^(easy|medium|hard)$")
    count: int = Field(default=5, ge=1, le=20)
    locale: str = Field(default="en", pattern=r"^(en|hi)$")


class QuizOption(BaseModel):
    label: str
    text: str


class QuizQuestion(BaseModel):
    question: str
    options: list[QuizOption]
    correct: str
    explanation: str = ""
    source_url: str = ""


class QuizResponse(BaseModel):
    topic: str
    questions: list[QuizQuestion]


# ── Polling Station ──────────────────────────────────────────────────────
class PollingStationResult(BaseModel):
    part_no: int = 0
    name: str = ""
    address: str = ""
    lat: float | None = None
    lng: float | None = None
    constituency: str = ""
    district: str = ""
    state: str = ""
    source_url: str = "https://voters.eci.gov.in"


# ── Eligibility ──────────────────────────────────────────────────────────
class EligibilityRequest(BaseModel):
    age: int
    nationality: str = "Indian"
    has_epic: bool = False
    epic_number: str = ""
    state_code: str = ""


class EligibilityResult(BaseModel):
    eligible: bool
    reason: str
    next_steps: list[str] = []
    source_url: str = "https://voters.eci.gov.in"


# ── Elector Info ─────────────────────────────────────────────────────────
class ElectorInfo(BaseModel):
    epic: str = ""
    name: str = ""
    relation: str = ""
    age: int = 0
    gender: str = ""
    state: str = ""
    constituency: str = ""
    polling_station: PollingStationResult | None = None
    source_url: str = "https://voters.eci.gov.in"


# ── Sources / Transparency ──────────────────────────────────────────────
class SourceInfo(BaseModel):
    name: str
    base_url: str
    purpose: str
    auth: str = "none"
    status: str = "unknown"  # ok | degraded | down | unknown


class SourcesResponse(BaseModel):
    sources: list[SourceInfo]


# ── Health ───────────────────────────────────────────────────────────────
class HealthResponse(BaseModel):
    status: str = "ok"
    version: str = "1.0.0"
