"""ECI Schedule & Press-Note connector — www.eci.gov.in

Scrapes election schedule tables and press releases.
Powers: Interactive Timeline, election_timeline intent.
"""

from __future__ import annotations

import logging
import re

import httpx

logger = logging.getLogger(__name__)

BASE = "https://www.eci.gov.in"
TIMEOUT = 20


async def fetch_latest_schedule(query: str = "") -> list[dict]:
    """Fetch the latest election schedule from ECI."""
    try:
        async with httpx.AsyncClient(timeout=TIMEOUT, follow_redirects=True) as c:
            r = await c.get(f"{BASE}/schedule-of-elections")
            r.raise_for_status()
            html = r.text

        # Simple regex-based extraction of table rows
        rows = _parse_schedule_table(html)
        if rows:
            return rows
    except Exception:
        logger.exception("Failed to fetch ECI schedule")

    # Fallback: return known phases of Indian general election process
    return _fallback_schedule()


async def fetch_registration_info(query: str = "") -> dict:
    """Return registration guidance."""
    return {
        "title": "How to Register as a Voter in India",
        "steps": [
            "Visit https://voters.eci.gov.in or download the Voter Helpline app.",
            "Click on 'Register as a New Voter' and fill Form 6 online.",
            "Upload a passport-size photograph and supporting documents (age proof, address proof).",
            "Submit the form. You will receive a reference number.",
            "Track your application status using the reference number.",
            "Once approved, your name will appear in the electoral roll and you will receive your EPIC (Voter ID).",
        ],
        "source_url": "https://voters.eci.gov.in",
    }


def _parse_schedule_table(html: str) -> list[dict]:
    """Best-effort extraction of schedule data from HTML."""
    rows: list[dict] = []
    # Look for table rows
    tr_pattern = re.compile(r"<tr[^>]*>(.*?)</tr>", re.DOTALL | re.IGNORECASE)
    td_pattern = re.compile(r"<td[^>]*>(.*?)</td>", re.DOTALL | re.IGNORECASE)
    tag_strip = re.compile(r"<[^>]+>")

    for tr_match in tr_pattern.finditer(html):
        cells = [
            tag_strip.sub("", c).strip()
            for c in td_pattern.findall(tr_match.group(1))
        ]
        if len(cells) >= 3 and cells[0]:
            rows.append({
                "phase": cells[0],
                "date": cells[1] if len(cells) > 1 else "",
                "description": cells[2] if len(cells) > 2 else "",
                "source_url": f"{BASE}/schedule-of-elections",
            })

    return rows


def _fallback_schedule() -> list[dict]:
    """Static fallback timeline of generic Indian election phases."""
    source = "https://www.eci.gov.in"
    return [
        {"phase": "Announcement", "start": "", "end": "",
         "description": "Election Commission announces election dates, Model Code of Conduct comes into effect.",
         "source_url": source},
        {"phase": "Nomination", "start": "", "end": "",
         "description": "Candidates file nomination papers with the Returning Officer.",
         "source_url": source},
        {"phase": "Scrutiny", "start": "", "end": "",
         "description": "Nomination papers are scrutinised for validity.",
         "source_url": source},
        {"phase": "Withdrawal", "start": "", "end": "",
         "description": "Last date for candidates to withdraw nominations.",
         "source_url": source},
        {"phase": "Campaigning", "start": "", "end": "",
         "description": "Political parties and candidates campaign. Campaigning ends 48 hours before polling.",
         "source_url": source},
        {"phase": "Polling", "start": "", "end": "",
         "description": "Voters cast their votes at designated polling stations using EVMs.",
         "source_url": source},
        {"phase": "Counting", "start": "", "end": "",
         "description": "Votes are counted. EVM results are tallied with VVPAT slips.",
         "source_url": source},
        {"phase": "Results", "start": "", "end": "",
         "description": "Results are declared. Winning candidates are announced.",
         "source_url": source},
    ]
