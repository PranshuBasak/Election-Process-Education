# API and Google Services Specification

This document defines the ElectionEdu backend API, external connectors, Google services, and MCP workflow planned for the next submission.

## 1. API Principles

- Every route returns JSON.
- Every factual response includes source metadata when available.
- External services are isolated under `backend/connectors/`.
- LLM calls are isolated under `backend/services/gemini.py`.
- User-facing errors should be helpful and non-technical.
- No route should expose secrets, stack traces, or raw upstream payloads.

## 2. Current API Surface

| Method | Path | Purpose |
|---|---|---|
| GET | `/api/health` | Service health check |
| POST | `/api/chat` | Main assistant response |
| GET | `/api/timeline` | Election timeline data |
| GET | `/api/learn` | Learning module list |
| GET | `/api/learn/{slug}` | Learning module details |
| GET | `/api/glossary` | Glossary term list |
| GET | `/api/glossary/{term}` | Single glossary term |
| POST | `/api/quiz` | Generate or return quiz questions |
| GET | `/api/polling?q=` | Polling/location helper |
| POST | `/api/eligibility` | Eligibility check |
| GET | `/api/elector/{epic}` | EPIC lookup helper |
| GET | `/api/sources` | Source transparency page |

## 3. Proposed API Additions

### 3.1 Chat with grounding metadata

`POST /api/chat`

Request:

```json
{
  "message": "What is Form 6?",
  "locale": "en",
  "session_id": "optional-session-id"
}
```

Response:

```json
{
  "reply": "Form 6 is used by eligible citizens to apply for voter registration...",
  "intent": "how_to_register",
  "grounding": {
    "provider": "gemini_google_search",
    "used": true,
    "fallback": false
  },
  "citations": [
    {
      "title": "Voters' Services Portal",
      "url": "https://voters.eci.gov.in"
    }
  ]
}
```

Acceptance criteria:

- If Gemini fails, return a clear fallback.
- If no verified source is available, do not invent facts.
- If Google Search grounding is used, expose citations to the UI.

### 3.2 Maps-assisted location lookup

`GET /api/location/geocode?q=Lucknow`

Response:

```json
{
  "query": "Lucknow",
  "formatted_address": "Lucknow, Uttar Pradesh, India",
  "lat": 26.8467,
  "lng": 80.9462,
  "open_maps_url": "https://www.google.com/maps/search/?api=1&query=26.8467,80.9462",
  "source": "google_maps_geocoding"
}
```

`GET /api/polling?q=Lucknow` should include the `open_maps_url` field when a location is resolved.

Acceptance criteria:

- Maps API key is read from Secret Manager or environment.
- Responses are cached.
- The frontend shows "Open in Google Maps."

### 3.3 Progress persistence

`GET /api/progress/{user_id}`

Response:

```json
{
  "completed_modules": ["voter-registration"],
  "quiz_scores": {
    "eligibility": 4
  },
  "checklist": {
    "checkedEligibility": true,
    "foundPollingStation": false
  },
  "preferred_locale": "en"
}
```

`PUT /api/progress/{user_id}`

Request:

```json
{
  "completed_modules": ["voter-registration", "evm-vvpat"],
  "quiz_scores": {
    "eligibility": 4
  },
  "checklist": {
    "checkedEligibility": true,
    "foundPollingStation": true
  },
  "preferred_locale": "hi"
}
```

Implementation options:

- Frontend directly uses Firebase Auth + Firestore.
- Backend mediates Firestore writes using Google Cloud credentials.

Preferred for this project:

- Frontend Firebase Auth anonymous sign-in.
- Firestore client SDK for progress.
- Firestore Security Rules restrict users to their own document.

## 4. Google Services Matrix

| Service | Runtime or workflow | Purpose | Visible to judges |
|---|---|---|---|
| Cloud Run | Runtime | Host React + FastAPI app | Yes, live URL |
| Gemini API / Vertex AI | Runtime | Chat, classification, quiz, translation | Yes, chat UI |
| Grounding with Google Search | Runtime | Current/cited answers | Yes, source chips |
| Google Maps Platform | Runtime | Geocoding and map links | Yes, polling/location UI |
| Firebase Auth | Runtime | Anonymous user identity | Yes, saved progress |
| Firestore | Runtime | Learning progress and checklist | Yes, progress persistence |
| Secret Manager | Runtime infrastructure | Store API keys | README evidence |
| Cloud Logging | Runtime infrastructure | Observability | README evidence |
| Developer Knowledge MCP | Developer workflow | Official Google docs inside Antigravity/Gemini CLI | README/Guide evidence |
| Firestore managed MCP | Developer workflow | Agent-assisted database/schema/rules work | README/Guide evidence |

## 5. MCP Specification

### 5.1 Google Developer Knowledge MCP

Use this MCP server to retrieve official Google documentation while building Google integrations.

Server URL:

```text
https://developerknowledge.googleapis.com/mcp
```

Antigravity config:

```json
{
  "mcpServers": {
    "google-developer-knowledge": {
      "serverUrl": "https://developerknowledge.googleapis.com/mcp"
    }
  }
}
```

Main tools:

- `search_documents`: search official Google developer documentation.
- `get_documents`: retrieve full document content from search results.
- `answer_query`: preview grounded answer over the Developer Knowledge corpus.

Use it for:

- Gemini grounding implementation.
- Maps Geocoding implementation.
- Firebase/Firestore setup.
- Cloud Run deployment issues.
- Secret Manager setup.
- Testing and security guidance for Google services.

Do not use it for:

- User-facing election answers.
- Non-Google source retrieval.
- Private data lookup.

### 5.2 Managed database MCP for Firestore

Use the Firestore managed MCP server for developer and agent operations:

- Inspect collection shape.
- Validate progress document design.
- Troubleshoot Firestore rules.
- Generate safe query examples.
- Confirm IAM and audit logging.

Runtime users should not call MCP directly. The app should use Firestore through Firebase SDK or backend Google Cloud client libraries.

Security requirements:

- IAM-first access.
- No shared database passwords.
- Cloud Audit Logs enabled.
- Least-privilege service accounts.

## 6. Connectors

| Connector | File | External service | Purpose |
|---|---|---|---|
| Gemini | `backend/services/gemini.py` | Gemini API / Vertex AI | LLM calls |
| Search grounding | `backend/services/gemini.py` | Gemini Google Search tool | Cited current answers |
| ECI schedule | `backend/connectors/eci_schedule.py` | ECI | Timelines and registration info |
| ECI results | `backend/connectors/eci_results.py` | ECI Results | Current results |
| ECI voter | `backend/connectors/eci_voter.py` | Voters' Services Portal | Polling and EPIC |
| Google Maps | `backend/connectors/google_maps.py` | Maps Geocoding API | Location resolution |
| Google Civic | `backend/connectors/google_civic.py` | Civic Information API | Fallback representative lookup |
| data.gov.in | `backend/connectors/data_gov_in.py` | data.gov.in | Historical datasets |
| Wikipedia | `backend/connectors/wiki.py` | Wikipedia REST | Glossary fallback |

## 7. Schemas

### Citation

```json
{
  "title": "string",
  "url": "string"
}
```

### GroundingInfo

```json
{
  "provider": "gemini_google_search | eci | static | none",
  "used": true,
  "fallback": false
}
```

### LocationResult

```json
{
  "query": "string",
  "formatted_address": "string",
  "lat": 0,
  "lng": 0,
  "open_maps_url": "string",
  "source": "google_maps_geocoding"
}
```

### ProgressDocument

```json
{
  "completed_modules": ["string"],
  "quiz_scores": {
    "topic": 0
  },
  "checklist": {
    "checkedEligibility": true,
    "foundPollingStation": false
  },
  "preferred_locale": "en",
  "updated_at": "2026-05-02T00:00:00Z"
}
```

## 8. Test Plan by API

| Route/module | Required tests |
|---|---|
| `/api/health` | returns 200 and version |
| `/api/chat` | Gemini success, Gemini failure, citation extraction, grounding flag |
| `/api/eligibility` | under 18, non-Indian, eligible with EPIC, eligible without EPIC |
| `/api/polling` | empty query, Maps success, Maps failure fallback |
| `/api/location/geocode` | valid address, no result, API timeout |
| `/api/quiz` | static fallback, Gemini JSON parse failure |
| `/api/sources` | includes Google services and official election sources |
| Firestore adapter | read progress, write progress, permission failure, offline fallback |

## 9. Error Contract

All recoverable failures should return:

```json
{
  "error": {
    "code": "SERVICE_UNAVAILABLE",
    "message": "The official source is temporarily unavailable. Please try again later.",
    "source": "google_maps"
  }
}
```

Do not leak:

- API keys.
- Full upstream stack traces.
- Raw service-account details.
- Full user personal data in logs.

## 10. Documentation Evidence

The README should include a compact table:

| Google service | Where used | Why it matters |
|---|---|---|
| Cloud Run | Hosting | Public live deployment |
| Gemini | Chat/quiz/translation | Smart assistant |
| Search Grounding | Chat citations | Current verified answers |
| Maps | Polling help | Location-aware usability |
| Firestore | Progress | Persistent real-world app |
| Developer Knowledge MCP | Build workflow | Official Google docs |
| Firestore MCP | Database workflow | Agentic cloud database development |
