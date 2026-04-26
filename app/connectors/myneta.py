"""MyNeta (ADR) connector — myneta.info

On-demand deep-link generator. No bulk scraping per ToU.
Powers: Candidate Background drawer, tell_me_about_candidate intent.
"""

from __future__ import annotations

import logging

logger = logging.getLogger(__name__)

BASE = "https://www.myneta.info"


def candidate_url(election_slug: str, candidate_id: str) -> str:
    """Generate a deep link to a candidate's affidavit page."""
    return f"{BASE}/{election_slug}/candidate.php?candidate_id={candidate_id}"


def election_summary_url(election_slug: str = "LokSabha2024") -> str:
    """Generate a link to the election summary page."""
    return f"{BASE}/{election_slug}/index.php?action=summary&subAction=candidates_analyzed&sort=candidate"


async def get_candidate_info(query: str) -> dict:
    """Return guidance and link for candidate lookup.

    We do NOT scrape MyNeta in bulk. Instead we provide deep links
    and let users navigate to the official source.
    """
    return {
        "message": (
            f"For detailed candidate information including criminal records, "
            f"financial declarations, and affidavits, please visit MyNeta: "
            f"{election_summary_url()}"
        ),
        "search_tip": (
            "You can search for candidates by name, constituency, or party "
            "on the MyNeta website."
        ),
        "source_url": BASE,
        "election_summary": election_summary_url(),
    }
