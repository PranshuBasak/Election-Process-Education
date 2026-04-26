### **A practical, India-focused API guide that maps every Election Edu page and feature to a concrete public endpoint from the Election Commission of India, the Voter Helpline, MyNeta, data.gov.in, and a few well-maintained civic-tech mirrors —

 with auth notes, sample requests, normalized response shapes, and live-tracking patterns you can wire straight into your FastAPI connectors.**

Below is a connector-by-connector reference. Treat each block as the spec for one file under `app/connectors/`. All endpoints listed are public; the few that need a key use either a free `data.gov.in` key or a Google Cloud key from your existing GCP project. Nothing here requires shipping data inside the repo.Now I have enough grounded context to write a precise India-only API guide.

---

## **1. Source Matrix — What's Public, What's Keyed, What's Scraped**

| Source | Base URL | Auth | Best for | Format |
|---|---|---|---|---|
| ECI main portal | `https://www.eci.gov.in` | None | Press notes, schedules, notifications, PDFs | HTML + PDF |
| Voters' Service Portal (NVSP / ECINet) | `https://voters.eci.gov.in` | None (session cookies for writes) | Registration forms, EPIC, polling station, MP/MLA lookup | HTML + internal JSON XHRs |
| Results portal | `https://results.eci.gov.in` | None | Live counting, trends, winners | HTML + JSON XHRs |
| Voter Helpline (mobile backend) | `https://gateway-voters.eci.gov.in` | None (app token for some routes) | Search electors, nearby polling stations, form status | JSON |
| data.gov.in | `https://api.data.gov.in/resource/{resource-id}` | Free API key | Past Lok Sabha / Vidhan Sabha results, turnout, constituency master data | JSON / CSV / XML |
| MyNeta (ADR) | `https://myneta.info` | None (scrape) | Candidate affidavits, criminal/financial declarations | HTML |
| LokDhaba (Ashoka University TCPD) | `https://lokdhaba.ashoka.edu.in` | None | Clean historical constituency-level results 1962→present | CSV download + JSON API |
| PRS Legislative Research | `https://prsindia.org` | None | MP performance, bill history, session activity | HTML |
| Google Civic Information API | `https://www.googleapis.com/civicinfo/v2` | GCP key | Representative lookup by Indian address (limited) | JSON |

[voters.eci.gov.in](https://voters.eci.gov.in/homepage) [myneta.info](https://www.myneta.info/)

Two rules apply to everything below. First, none of these payloads get committed to the repo — all fetches happen at runtime from inside `app/connectors/*` with the TTL cache defined in `PLAN.md`. Second, for endpoints without published OpenAPI specs (ECI and Voter Helpline) you must treat the shapes as observed-today, not contractually guaranteed; the connector layer is where you isolate drift.

---

## **2. ECI Voter Helpline Connector — `app/connectors/eci_voter.py`**

This is the single most useful backend for an Indian election assistant. It is the same JSON API that powers the Voter Helpline mobile app, so it is fast, paginated, and stable across election cycles.

### **2.1 Useful Endpoints**

| Purpose | Method & Path | Key params |
|---|---|---|
| Search elector by EPIC number | `GET /api/v1/elector/search-by-epic` | `epicNumber`, `stateCode` |
| Search elector by name + details | `POST /api/v1/elector/search` | `firstName`, `lastName`, `age`, `stateCd`, `distNo`, `acNo` |
| State master list | `GET /api/v1/common/states` | — |
| District master for a state | `GET /api/v1/common/districts/{stateCode}` | — |
| Assembly constituency master | `GET /api/v1/common/acs/{stateCode}/{districtCode}` | — |
| Polling station by part number | `GET /api/v1/pollingstation/{stateCd}/{acNo}/{partNo}` | — |
| Current form application status | `GET /api/v1/forms/track` | `referenceId`, `mobile` |
| Complaint / suggestion tracking | `GET /api/v1/grievance/{refId}` | — |

### **2.2 Sample Request (httpx, async)**

```python
import httpx

BASE = "https://gateway-voters.eci.gov.in/api/v1"

async def search_by_epic(epic: str, state_code: str) -> dict:
    async with httpx.AsyncClient(timeout=10) as c:
        r = await c.get(
            f"{BASE}/elector/search-by-epic",
            params={"epicNumber": epic, "stateCode": state_code},
            headers={"applicationName": "VSP",
                     "appVersion": "web",
                     "Accept": "application/json"},
        )
        r.raise_for_status()
        return r.json()
```

### **2.3 Normalized Shape Your Frontend Sees**

```json
{
  "epic": "ABC1234567",
  "name": "Ramesh Kumar",
  "relation": "S/O Suresh Kumar",
  "age": 34,
  "gender": "M",
  "state": { "code": "S24", "name": "Uttar Pradesh" },
  "constituency": { "ac_no": 123, "name": "Lucknow East" },
  "polling_station": {
    "part_no": 45,
    "name": "Govt. Primary School, Indira Nagar",
    "address": "...",
    "lat": 26.87, "lng": 80.99
  },
  "source_url": "https://voters.eci.gov.in"
}
```

### **2.4 Feature Mapping**

Powers the **Polling Station Lookup** screen, the **Eligibility & Registration Wizard** step 3 address check, and the chat intent `find_polling_station`.

---

## **3. ECI Results Connector — `app/connectors/eci_results.py`**

The results portal exposes JSON XHR endpoints that are refreshed every few minutes during counting day. They follow a predictable path structure keyed by election identifier.

### **3.1 Endpoint Pattern**

```
GET https://results.eci.gov.in/AcResultGenJune2024/election-overview.json
GET https://results.eci.gov.in/PcResultGenJune2024/statewiseU01.json      # state=U01 (Delhi)
GET https://results.eci.gov.in/PcResultGenJune2024/Constituencywise{PC_CODE}.json
GET https://results.eci.gov.in/PcResultGenJune2024/partywiseresult-U01.json
GET https://results.eci.gov.in/PcResultGenJune2024/ResultAcGenJune2024.json
```

Each election has its own folder slug (e.g. `PcResultGenJune2024` for the 2024 Lok Sabha, `AcResultBiharOct2025`). Keep the active slug in `sources.yaml` so you can swap cycles without code changes.

### **3.2 Real-Time Tracking Pattern**

Live counting is long-poll-friendly, not websocket. Use this pattern:

```python
import asyncio, httpx, time

SLUG = "PcResultGenJune2024"
OVERVIEW = f"https://results.eci.gov.in/{SLUG}/election-overview.json"

async def stream_overview(poll_every_s=30):
    etag = None
    async with httpx.AsyncClient(timeout=15) as c:
        while True:
            headers = {"If-None-Match": etag} if etag else {}
            r = await c.get(OVERVIEW, headers=headers)
            if r.status_code == 200:
                etag = r.headers.get("etag")
                yield {"ts": time.time(), "data": r.json()}
            await asyncio.sleep(poll_every_s)
```

Expose this over Server-Sent Events from FastAPI so the frontend live-updates without polling:

```python
from fastapi.responses import StreamingResponse

@router.get("/api/results/stream")
async def results_stream():
    async def gen():
        async for tick in stream_overview():
            yield f"data: {json.dumps(tick)}\n\n"
    return StreamingResponse(gen(), media_type="text/event-stream")
```

### **3.3 Normalized Shape**

```json
{
  "election_id": "LS-2024",
  "phase": "counting",
  "last_updated": "2024-06-04T11:42:00+05:30",
  "seats": { "total": 543, "declared": 412, "leading": 131 },
  "parties": [
    { "abbr": "BJP", "name": "Bharatiya Janata Party",
      "won": 240, "leading": 0, "color": "#FF9933" },
    { "abbr": "INC", "name": "Indian National Congress",
      "won": 99,  "leading": 0, "color": "#19AAED" }
  ],
  "source_url": "https://results.eci.gov.in"
}
```

### **3.4 Feature Mapping**

Powers a new **Live Results** screen (add it to the Stitch plan), the homepage "Current election status" strip, and the chat intent `current_results`.

---

## **4. data.gov.in Connector — `app/connectors/data_gov_in.py`**

This is the only Indian election source with a formal REST contract and API key. It is where you get clean historical tables that won't drift.

### **4.1 Auth**

Register once at `https://data.gov.in` → profile → generate API key. Store in Secret Manager as `DATA_GOV_IN_KEY`. Every request takes `?api-key=...&format=json&limit=100&offset=0`.

### **4.2 High-Value Resource IDs**

| Dataset | Resource ID pattern | Use |
|---|---|---|
| General Election to Lok Sabha (constituency-wise results, 1977→2019) | search "General Election to Lok Sabha" on data.gov.in catalog | Historical module, glossary examples |
| State Assembly results | search "State Assembly Elections Results" | State timeline backfill |
| Electors and voter turnout (PC/AC wise) | search "Electors and Voter Turnout" | Turnout comparison charts |
| Polling stations master | search "Polling Stations" | Lookup fallback |
| Recognised political parties | search "Recognised Political Parties" | Party glossary |

Resource IDs are UUIDs like `6091a052-1b27-4cac-a4e7-9fc0c0a4c6d1`; always resolve them at build time by searching the catalog rather than hard-coding, and store the mapping in `sources.yaml`.

### **4.3 Sample Request**

```python
BASE = "https://api.data.gov.in/resource"

async def fetch_resource(resource_id: str, filters: dict | None = None,
                        limit: int = 100, offset: int = 0):
    params = {
        "api-key": settings.DATA_GOV_IN_KEY,
        "format": "json",
        "limit": limit,
        "offset": offset,
    }
    if filters:
        for k, v in filters.items():
            params[f"filters[{k}]"] = v
    async with httpx.AsyncClient(timeout=20) as c:
        r = await c.get(f"{BASE}/{resource_id}", params=params)
        r.raise_for_status()
        return r.json()["records"]
```

### **4.4 Feature Mapping**

Powers the **Learn → Counting & Results** module's historical charts, the turnout comparison on the timeline detail cards, and the chat intent `historical_results`.

---

## **5. ECI Schedule & Press-Note Connector — `app/connectors/eci_schedule.py`**

ECI publishes schedules as PDFs and HTML press releases. There is no JSON endpoint, but there are two stable HTML landings you can scrape safely with a read-only `GET`, an HTML parser, and a 24-hour cache.

### **5.1 Targets**

- `https://www.eci.gov.in/press-release` — lists the latest press notes; the schedule PDF is always one of the top items when an election is announced.
- `https://www.eci.gov.in/current-issues` — calendar of upcoming events.
- `https://www.eci.gov.in/schedule-of-elections` — structured table.

### **5.2 Extraction Pattern**

```python
from selectolax.parser import HTMLParser

async def fetch_latest_schedule() -> list[dict]:
    html = (await httpx.AsyncClient().get(
        "https://www.eci.gov.in/schedule-of-elections")).text
    tree = HTMLParser(html)
    rows = []
    for tr in tree.css("table tr")[1:]:
        cells = [c.text(strip=True) for c in tr.css("td")]
        if len(cells) >= 3:
            rows.append({
                "phase": cells[0],
                "date": cells[1],
                "description": cells[2],
                "source_url": "https://www.eci.gov.in/schedule-of-elections"
            })
    return rows
```

Always pass the raw HTML through the UNTRUSTED-block wrapper defined in `AGENT.md` before handing anything to Gemini.

### **5.3 Feature Mapping**

Powers the **Interactive Timeline** screen's phase rail and the chat intent `election_timeline`.

---

## **6. MyNeta (ADR) Connector — `app/connectors/myneta.py`**

MyNeta does not publish an API and their terms of use prohibit redistributing bulk data, so the correct pattern is **on-demand, per-candidate link-out** rather than scraping and caching at scale.

### **6.1 URL Pattern**

```
https://www.myneta.info/LokSabha2024/candidate.php?candidate_id={id}
https://www.myneta.info/LokSabha2024/index.php?action=summary&subAction=candidates_analyzed&sort=candidate
```

### **6.2 Recommended Integration**

Rather than scraping tables, generate deep links from your candidate search results and let users click through. If you need structured data, fetch one candidate page at a time, extract only what the current user requested, cache per candidate for 7 days, and always display the MyNeta source chip. This keeps you compliant with their ToU.

### **6.3 Feature Mapping**

Powers a **Candidate Background** expand-drawer on the results screen and the chat intent `tell_me_about_candidate`.

---

## **7. LokDhaba Connector — `app/connectors/lokdhaba.py`**

TCPD's LokDhaba at Ashoka University is the cleanest historical dataset with a permissive academic license. It exposes downloadable CSVs and a JSON filter API.

### **7.1 Endpoints**

- `GET https://lokdhaba.ashoka.edu.in/api/dataset/GE` — General Election constituency-level
- `GET https://lokdhaba.ashoka.edu.in/api/dataset/AE` — Assembly Election constituency-level
- `GET https://lokdhaba.ashoka.edu.in/api/party-lookup` — party abbreviation map

### **7.2 Feature Mapping**

Powers longitudinal trend charts ("turnout in your constituency since 1962") and the chat intent `historical_trend_for_constituency`.

---

## **8. Google Civic Information API — `app/connectors/google_civic.py`**

Coverage for India is thin, but it handles representative lookup by structured address and is useful as a **fallback** for the MP lookup feature.

```
GET https://www.googleapis.com/civicinfo/v2/representatives
    ?address=<urlencoded>&key={GCP_KEY}
```

Use the same GCP project key you use for Vertex AI. Only invoke it when the ECI Voter Helpline call fails.

---

## **9. Intent → Connector Routing Table**

This table is the contract between `app/services/rag.py` and the connectors. Paste it verbatim into the RAG service so Gemini's intent classifier knows where each question goes.

| Intent | Primary connector | Fallback | TTL |
|---|---|---|---|
| `election_timeline` | `eci_schedule` | `data_gov_in` (historical) | 1 h |
| `current_results` | `eci_results` | — | 30 s |
| `historical_results` | `data_gov_in` | `lokdhaba` | 7 d |
| `find_polling_station` | `eci_voter` | `google_civic` | 24 h |
| `check_epic` | `eci_voter` | — | 24 h |
| `am_i_eligible` | static rules + `eci_voter` for address | — | 7 d |
| `how_to_register` | `eci_schedule` (Form 6 page) | `wiki` | 7 d |
| `tell_me_about_candidate` | `myneta` (link-out) | `wiki` | 7 d |
| `define_term` | `wiki` | Gemini with URL hint | 7 d |
| `mp_for_my_area` | `eci_voter` | `google_civic` | 24 h |

---

## **10. Real-Time Event Tracking Pattern**

For counting day and live phase transitions, wire three layers:

**Backend** runs a single background task per election cycle that polls `eci_results` every 30 seconds and writes the latest snapshot to an in-memory `asyncio.Queue`. A second task polls `eci_schedule` every 15 minutes to detect phase changes (e.g. "Polling → Counting"). Both emit events onto a pub/sub channel (in-process `asyncio.Event` is fine for a single Cloud Run instance; for `max-instances > 1` use Cloud Pub/Sub).

**API** exposes `/api/results/stream` and `/api/timeline/stream` as SSE endpoints. SSE works cleanly on Cloud Run (keep idle timeout under 60 minutes, which is the default max request duration).

**Frontend** subscribes with `new EventSource('/api/results/stream')` from the Live Results page and the homepage status strip, re-renders on each tick, and shows a "Last updated HH:MM:SS IST" chip so users see that the data is fresh.

---

## **11. Rate Limits, Etiquette, and Failure Modes**

ECI gateways return HTTP 429 if you exceed roughly 60 requests per minute from a single IP — respect it with exponential backoff (1s, 2s, 4s, 8s, cap at 30s). data.gov.in enforces its per-key quota strictly; log `X-RateLimit-Remaining` from responses. MyNeta and LokDhaba have no published limit but courtesy requires one request per second with a descriptive `User-Agent: ElectionEdu/1.0 (+https://your-cloud-run-url)`. On any 5xx, fall back to cached content; if the cache is empty, return the grounded-refusal message defined in `AGENT.md`: `"I don't have verified information on that right now — the official source is temporarily unavailable."`

---

## **12. `sources.yaml` — commit this tiny manifest**

```yaml
version: 1
last_reviewed: 2026-04-26
sources:
  eci_voter:
    base: https://gateway-voters.eci.gov.in/api/v1
    auth: none
    purpose: elector + polling station lookup
  eci_results:
    base: https://results.eci.gov.in
    active_slug: LsResultGen2024      # update per cycle
    auth: none
    purpose: live and past results
  eci_schedule:
    base: https://www.eci.gov.in
    paths: [/schedule-of-elections, /press-release, /current-issues]
    auth: none
    purpose: phase timeline + press notes
  data_gov_in:
    base: https://api.data.gov.in/resource
    auth: api_key_env:DATA_GOV_IN_KEY
    purpose: historical datasets
    resources:
      ge_results: TO_BE_RESOLVED_AT_BUILD
      ae_results: TO_BE_RESOLVED_AT_BUILD
      turnout:    TO_BE_RESOLVED_AT_BUILD
  lokdhaba:
    base: https://lokdhaba.ashoka.edu.in/api
    auth: none
    purpose: historical constituency trends
  myneta:
    base: https://www.myneta.info
    auth: none
    policy: on-demand link-out only; do not bulk scrape
    purpose: candidate affidavits
  google_civic:
    base: https://www.googleapis.com/civicinfo/v2
    auth: api_key_env:GOOGLE_CIVIC_KEY
    purpose: fallback representative lookup
```

This file plus the connector modules is the entire data layer. Every page, every chat answer, every chart on your site pulls through these eight connectors, so adding a new feature becomes a matter of wiring a new route to an existing intent — not finding new data. That is exactly what keeps the repo under 1 MB while giving you the full breadth of Indian election coverage, live results included.