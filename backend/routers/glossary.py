"""Glossary router — GET /api/glossary, GET /api/glossary/{term}

Returns election-related term definitions with AI enrichment.
"""

from __future__ import annotations

from fastapi import APIRouter, HTTPException

from backend.models.schemas import GlossaryTerm
from backend.services import gemini
from backend.connectors import wiki
from backend.services.cache import cache, TTL_GLOSSARY

router = APIRouter(prefix="/api", tags=["glossary"])

# Curated glossary terms — static for offline/no-Gemini mode
_TERMS: dict[str, GlossaryTerm] = {
    "evm": GlossaryTerm(
        term="EVM (Electronic Voting Machine)",
        definition_md="A portable electronic device used for recording votes in Indian elections. It consists of a Ballot Unit and a Control Unit. EVMs have been used in all general elections since 2004.",
        source_url="https://www.eci.gov.in",
    ),
    "vvpat": GlossaryTerm(
        term="VVPAT (Voter Verifiable Paper Audit Trail)",
        definition_md="A printer attached to the EVM that produces a slip showing the candidate's name and symbol selected by the voter. The slip is displayed for 7 seconds before dropping into a sealed box. Mandatory in all elections since 2019.",
        source_url="https://www.eci.gov.in",
    ),
    "epic": GlossaryTerm(
        term="EPIC (Electors Photo Identity Card)",
        definition_md="Also known as Voter ID card. A photo identity card issued by ECI to registered voters. It is the primary document for identification at the polling station.",
        source_url="https://voters.eci.gov.in",
    ),
    "mcc": GlossaryTerm(
        term="MCC (Model Code of Conduct)",
        definition_md="A set of guidelines issued by ECI that comes into force from the date of election announcement until results are declared. It regulates the conduct of political parties and candidates to ensure free and fair elections.",
        source_url="https://www.eci.gov.in",
    ),
    "nota": GlossaryTerm(
        term="NOTA (None Of The Above)",
        definition_md="An option on the EVM that allows voters to officially reject all candidates. Introduced by the Supreme Court in 2013 (PUCL v. Union of India). NOTA votes are counted but do not affect the result.",
        source_url="https://www.eci.gov.in",
    ),
    "lok-sabha": GlossaryTerm(
        term="Lok Sabha (House of the People)",
        definition_md="The lower house of India's Parliament. It consists of 543 elected members (plus 2 nominated Anglo-Indian members until 2020). Members are elected through direct election from single-member constituencies using the first-past-the-post system.",
        source_url="https://loksabha.nic.in",
    ),
    "rajya-sabha": GlossaryTerm(
        term="Rajya Sabha (Council of States)",
        definition_md="The upper house of India's Parliament. It has 245 members — 233 elected by state/UT legislatures and 12 nominated by the President. Members serve 6-year terms with one-third retiring every 2 years.",
        source_url="https://rajyasabha.nic.in",
    ),
    "fptp": GlossaryTerm(
        term="FPTP (First Past The Post)",
        definition_md="The electoral system used in India for Lok Sabha and state assembly elections. The candidate with the most votes in a constituency wins, regardless of whether they have a majority (50%+).",
        source_url="https://www.eci.gov.in",
    ),
    "constituency": GlossaryTerm(
        term="Constituency",
        definition_md="A defined geographical area that elects one representative. India has 543 parliamentary constituencies (for Lok Sabha) and approximately 4,120 state assembly constituencies.",
        source_url="https://www.eci.gov.in",
    ),
    "delimitation": GlossaryTerm(
        term="Delimitation",
        definition_md="The process of redrawing constituency boundaries to reflect population changes. Done by the Delimitation Commission of India. The last delimitation was based on the 2001 Census.",
        source_url="https://www.eci.gov.in",
    ),
    "blo": GlossaryTerm(
        term="BLO (Booth Level Officer)",
        definition_md="A local government official (usually a teacher or government employee) assigned to each polling booth to maintain the voter list, verify addresses, and assist with voter registration.",
        source_url="https://voters.eci.gov.in",
    ),
    "ero": GlossaryTerm(
        term="ERO (Electoral Registration Officer)",
        definition_md="An officer appointed by ECI to prepare and revise the electoral roll for a constituency. They approve or reject voter registration applications.",
        source_url="https://voters.eci.gov.in",
    ),
    "form-6": GlossaryTerm(
        term="Form 6",
        definition_md="The application form for new voter registration or inclusion of name in the electoral roll. Can be submitted online at voters.eci.gov.in or through the Voter Helpline app.",
        source_url="https://voters.eci.gov.in",
    ),
    "form-7": GlossaryTerm(
        term="Form 7",
        definition_md="The application form for objecting to the inclusion of a name in the electoral roll or for deletion of a name.",
        source_url="https://voters.eci.gov.in",
    ),
    "form-8": GlossaryTerm(
        term="Form 8",
        definition_md="The application form for correction of entries in the electoral roll (name, address, age, photo, etc.) or for transposition of entry within the same constituency.",
        source_url="https://voters.eci.gov.in",
    ),
}


@router.get("/glossary", response_model=list[GlossaryTerm])
async def list_terms() -> list[GlossaryTerm]:
    return list(_TERMS.values())


@router.get("/glossary/{term}", response_model=GlossaryTerm)
async def get_term(term: str) -> GlossaryTerm:
    key = term.lower().replace(" ", "-").replace("_", "-")

    # Check static terms first
    if key in _TERMS:
        return _TERMS[key]

    # Check cache
    cache_key = f"glossary:{key}"
    cached = cache.get(cache_key)
    if cached is not None:
        return cached

    # Try AI-generated definition
    defn = await gemini.generate_definition(term)
    wiki_data = await wiki.fetch_article(term)
    source = wiki_data.get("source_url", "https://www.eci.gov.in") if wiki_data else "https://www.eci.gov.in"

    result = GlossaryTerm(term=term, definition_md=defn, source_url=source)
    cache.set(cache_key, result, TTL_GLOSSARY)
    return result
