"""Steps router — GET /api/learn, GET /api/learn/{slug}

Returns learn modules and individual step-by-step guides.
"""

from __future__ import annotations

from fastapi import APIRouter, HTTPException

from app.models.schemas import LearnModule, Step

router = APIRouter(prefix="/api", tags=["learn"])

# Static learn modules — keeps repo size tiny, no DB needed.
_MODULES: list[LearnModule] = [
    LearnModule(
        slug="how-to-vote",
        title="How to Vote in India",
        icon="🗳️",
        summary="Step-by-step guide to casting your vote on election day.",
        steps=[
            Step(order=1, title="Find Your Polling Station", description_md="Use your EPIC card or the [Voter Helpline app](https://voters.eci.gov.in) to locate your assigned polling station.", who="Voter", source_url="https://voters.eci.gov.in"),
            Step(order=2, title="Check the Voter List", description_md="Verify your name appears on the electoral roll. You can search by EPIC number or name + address.", who="Voter", source_url="https://voters.eci.gov.in"),
            Step(order=3, title="Carry Valid ID", description_md="Bring your **EPIC card** (Voter ID) or any ECI-approved photo ID to the polling station.", who="Voter", source_url="https://www.eci.gov.in"),
            Step(order=4, title="Queue & Verification", description_md="Stand in the queue. The polling officer will verify your identity, ink your finger, and hand you a ballot slip.", who="Polling Officer / Voter"),
            Step(order=5, title="Cast Your Vote", description_md="Enter the voting compartment. Press the button on the **EVM** (Electronic Voting Machine) next to your chosen candidate's name and symbol. A **VVPAT** slip will confirm your choice.", who="Voter", source_url="https://www.eci.gov.in"),
            Step(order=6, title="Exit", description_md="Leave the polling station after voting. Do NOT reveal your vote to anyone.", who="Voter"),
        ],
    ),
    LearnModule(
        slug="voter-registration",
        title="Voter Registration (Form 6)",
        icon="📝",
        summary="How to register as a new voter online or offline.",
        steps=[
            Step(order=1, title="Visit the National Voter Service Portal", description_md="Go to [voters.eci.gov.in](https://voters.eci.gov.in) or download the Voter Helpline app.", who="Applicant", source_url="https://voters.eci.gov.in"),
            Step(order=2, title="Fill Form 6 Online", description_md="Click **Register as New Voter** and fill in personal details, address, and constituency.", who="Applicant"),
            Step(order=3, title="Upload Documents", description_md="Upload a passport-size photograph, age proof (birth certificate / Class 10 marksheet), and address proof.", who="Applicant"),
            Step(order=4, title="Submit & Get Reference Number", description_md="Submit the form. Note your **reference number** for tracking.", who="Applicant"),
            Step(order=5, title="BLO Verification", description_md="A Booth Level Officer (BLO) may visit your address to verify details.", who="BLO"),
            Step(order=6, title="Receive EPIC", description_md="Once approved, your name is added to the electoral roll and your EPIC is dispatched.", who="ERO", source_url="https://voters.eci.gov.in"),
        ],
    ),
    LearnModule(
        slug="evm-vvpat",
        title="Understanding EVMs & VVPAT",
        icon="🖥️",
        summary="How Electronic Voting Machines and VVPAT work in India.",
        steps=[
            Step(order=1, title="What is an EVM?", description_md="An **Electronic Voting Machine** is a portable device used to record votes electronically. It consists of a **Ballot Unit** and a **Control Unit**.", who="", source_url="https://www.eci.gov.in"),
            Step(order=2, title="How EVMs Work", description_md="The voter presses the button next to their chosen candidate on the Ballot Unit. The vote is recorded on a microchip inside the Control Unit.", who=""),
            Step(order=3, title="What is VVPAT?", description_md="**Voter Verifiable Paper Audit Trail** — a printer attached to the EVM that produces a slip showing the candidate's name and symbol. The slip is visible for 7 seconds before dropping into a sealed box.", who="", source_url="https://www.eci.gov.in"),
            Step(order=4, title="Security Features", description_md="EVMs are **standalone** (not connected to any network), use one-time programmable chips, and go through multiple rounds of testing and sealing.", who="ECI"),
        ],
    ),
    LearnModule(
        slug="model-code-of-conduct",
        title="Model Code of Conduct (MCC)",
        icon="⚖️",
        summary="Rules that parties and candidates must follow during elections.",
        steps=[
            Step(order=1, title="When Does MCC Apply?", description_md="The MCC comes into force from the date the election schedule is **announced** and remains in effect until results are declared.", who="ECI", source_url="https://www.eci.gov.in"),
            Step(order=2, title="Key Provisions", description_md="- No appeal to caste or communal feelings\n- No use of government machinery for campaigning\n- No distribution of liquor or freebies\n- Campaign silence 48 hours before polling\n- Ministers cannot announce new projects/schemes", who="Parties / Candidates"),
            Step(order=3, title="Enforcement", description_md="ECI can issue warnings, bar candidates from campaigning, and file FIRs. The MCC is not a law but is enforced through administrative orders and the Representation of the People Act.", who="ECI"),
        ],
    ),
    LearnModule(
        slug="election-commission",
        title="About the Election Commission of India",
        icon="🏛️",
        summary="Structure, powers, and role of ECI in Indian democracy.",
        steps=[
            Step(order=1, title="Constitutional Basis", description_md="ECI is established under **Article 324** of the Indian Constitution. It is an autonomous, permanent constitutional body.", who="", source_url="https://www.eci.gov.in"),
            Step(order=2, title="Composition", description_md="ECI consists of the **Chief Election Commissioner (CEC)** and two **Election Commissioners (ECs)**. They are appointed by the President.", who="President of India"),
            Step(order=3, title="Powers & Functions", description_md="- Supervise, direct, and control elections\n- Prepare electoral rolls\n- Recognize political parties and allot symbols\n- Enforce Model Code of Conduct\n- Decide election disputes (before results)", who="ECI"),
            Step(order=4, title="Independence", description_md="The CEC can only be removed by impeachment (same process as a Supreme Court judge). This ensures the Commission's independence from the executive.", who=""),
        ],
    ),
]


@router.get("/learn", response_model=list[LearnModule])
async def list_modules() -> list[LearnModule]:
    """Return all learn modules (without full steps for listing)."""
    return [
        LearnModule(slug=m.slug, title=m.title, icon=m.icon, summary=m.summary)
        for m in _MODULES
    ]


@router.get("/learn/{slug}", response_model=LearnModule)
async def get_module(slug: str) -> LearnModule:
    """Return a specific learn module with full steps."""
    for m in _MODULES:
        if m.slug == slug:
            return m
    raise HTTPException(status_code=404, detail=f"Module '{slug}' not found")
