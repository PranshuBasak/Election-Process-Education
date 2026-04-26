"""Polling Station & Eligibility router.

GET  /api/polling?q=...   — Polling station lookup
POST /api/eligibility     — Eligibility wizard
GET  /api/elector/{epic}  — EPIC search
"""

from __future__ import annotations

from fastapi import APIRouter

from backend.models.schemas import (
    EligibilityRequest,
    EligibilityResult,
    PollingStationResult,
)
from backend.connectors import eci_voter

router = APIRouter(prefix="/api", tags=["polling"])


@router.get("/polling")
async def polling_station(q: str = "") -> dict:
    """Search for a polling station by query string."""
    result = await eci_voter.search_polling_station(q)
    return result or {"message": "No results found. Please provide more details."}


@router.post("/eligibility", response_model=EligibilityResult)
async def check_eligibility(req: EligibilityRequest) -> EligibilityResult:
    """Check voter eligibility based on provided details."""
    # Rule-based eligibility check (no AI needed)
    if req.nationality.lower() != "indian":
        return EligibilityResult(
            eligible=False,
            reason="Only Indian citizens are eligible to vote in Indian elections.",
            next_steps=["If you are an NRI with Indian citizenship, you may still be eligible under Section 20A of the RPA 1950."],
            source_url="https://www.eci.gov.in",
        )

    if req.age < 18:
        return EligibilityResult(
            eligible=False,
            reason=f"You must be at least 18 years old to vote. You are currently {req.age} years old.",
            next_steps=[
                f"You will be eligible to vote when you turn 18.",
                "You can pre-register by filling Form 6 before the qualifying date (January 1st of the revision year).",
            ],
            source_url="https://voters.eci.gov.in",
        )

    # Eligible — check EPIC status
    next_steps = []
    if not req.has_epic:
        next_steps = [
            "Register as a voter by filling Form 6 at https://voters.eci.gov.in",
            "You can also use the Voter Helpline app on Android/iOS.",
            "Required documents: Passport-size photo, age proof, address proof.",
        ]
    else:
        next_steps = [
            "Your EPIC/Voter ID is your primary identity for voting.",
            "Verify your details on the electoral roll at https://voters.eci.gov.in",
            "Find your polling station before election day.",
        ]

    return EligibilityResult(
        eligible=True,
        reason="You meet the basic eligibility criteria to vote in Indian elections.",
        next_steps=next_steps,
        source_url="https://voters.eci.gov.in",
    )


@router.get("/elector/{epic}")
async def search_elector(epic: str, state_code: str = "") -> dict:
    """Search elector by EPIC number."""
    result = await eci_voter.search_by_epic(epic, state_code)
    return result or {"message": "No elector found with the given EPIC number."}
