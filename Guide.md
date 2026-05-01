# ElectionEdu Build and Submission Guide

This guide explains how to move ElectionEdu from a good first submission to a stronger second submission, with special focus on Google Services and test coverage.

## 1. What To Fix First

Do these before adding new features:

1. Make the public repo reproducible.
2. Commit `requirements.txt` if README or Dockerfile references it.
3. Fix Dockerfile paths so they match `backend/`, not stale `app/`.
4. Remove generated files from Git tracking.
5. Fix lint and failing tests.
6. Confirm the deployed chat endpoint returns useful Gemini answers.

Suggested commands:

```powershell
git status --short --branch
python -m pytest -q -p no:cacheprovider
cd web
npm run lint
npm test -- --run
npm run build
```

## 2. Google Developer Knowledge MCP Setup

Use Google Developer Knowledge MCP inside Antigravity so agents can retrieve current official Google docs while implementing Google services.

Reference:

- https://developers.google.com/knowledge/mcp

### Antigravity setup

1. In Antigravity, open the Agent pane.
2. Open MCP Servers.
3. Open raw config.
4. Add:

```json
{
  "mcpServers": {
    "google-developer-knowledge": {
      "serverUrl": "https://developerknowledge.googleapis.com/mcp"
    }
  }
}
```

5. Refresh MCP servers.
6. Ask the agent a Google docs question, such as:

```text
Use Google Developer Knowledge MCP to find the current recommended way to call Gemini with Google Search grounding from Python.
```

If configured correctly, the agent should call a Developer Knowledge MCP tool such as `search_documents`.

### When to use it

Use it before implementing:

- Gemini Grounding with Google Search.
- Google Maps Geocoding.
- Firebase Auth.
- Firestore.
- Cloud Run.
- Secret Manager.
- Cloud Logging.
- Firestore Security Rules.

## 3. Managed Database MCP Setup

Google Cloud announced managed MCP servers for databases including Firestore, Cloud SQL, Spanner, AlloyDB, and Bigtable.

Reference:

- https://cloud.google.com/blog/products/databases/managed-mcp-servers-for-google-cloud-databases

For ElectionEdu, Firestore is the best fit because the app needs lightweight user progress, quiz scores, checklist state, and language preference.

### Use Firestore MCP for developer workflow

Use the managed Firestore MCP server to help agents:

- Inspect progress document structure.
- Generate Firestore Security Rules.
- Troubleshoot permission errors.
- Validate query patterns.
- Confirm IAM-based access.
- Review Cloud Audit Logs behavior.

Do not expose MCP directly to end users. End users interact with Firestore through the app.

## 4. Recommended Google Service Integrations

### 4.1 Gemini Grounding with Google Search

Why:

- Raises Google Services score.
- Fixes trust and recency.
- Gives citations for current election questions.

Implementation steps:

1. Update Gemini client code in `backend/services/gemini.py`.
2. Add a grounded answer path for chat questions.
3. Extract grounding/citation metadata.
4. Return citations in `/api/chat`.
5. Show source chips in the frontend.
6. Add tests for success, fallback, and no-source behavior.

User-visible result:

- Chat responses include official source links.
- The app can explain that answers are grounded.

### 4.2 Google Maps Platform

Why:

- Adds location-aware voter help.
- Easy to demonstrate in UI.

Implementation steps:

1. Enable Maps Geocoding API.
2. Store the API key in Secret Manager.
3. Add `backend/connectors/google_maps.py`.
4. Add `/api/location/geocode`.
5. Add `open_maps_url` to polling/location responses.
6. Add "Open in Google Maps" button in the polling page.
7. Cache geocoding results.

Tests:

- Successful geocode.
- No result.
- Timeout.
- API key missing.

### 4.3 Firebase Auth and Firestore

Why:

- Makes the app persistent and more realistic.
- Shows another Google service beyond Gemini.

Implementation steps:

1. Enable Firebase for the Google Cloud project.
2. Enable anonymous authentication.
3. Create a Firestore database.
4. Add a progress document:

```text
users/{uid}/progress/current
```

5. Store:

```json
{
  "completed_modules": [],
  "quiz_scores": {},
  "checklist": {},
  "preferred_locale": "en",
  "updated_at": "server timestamp"
}
```

6. Add Security Rules so users can only read/write their own progress.
7. Add UI badges for saved module and quiz progress.

Tests:

- Progress writes when signed in.
- Progress falls back gracefully when offline.
- UI still works if Firestore is unavailable.

### 4.4 Secret Manager

Why:

- Strengthens security evidence.
- Prevents accidental key leaks.

Store:

- `GEMINI_API_KEY` or Vertex credentials.
- `GOOGLE_MAPS_API_KEY`.
- `FIREBASE_CONFIG` if using backend-mediated config.
- `DATA_GOV_IN_KEY`.

README should explain that local `.env.example` contains placeholders only.

## 5. Test Coverage Plan

### Backend

Add or fix tests for:

- Health endpoint.
- Sources endpoint.
- Eligibility rules.
- Chat fallback.
- Chat citations.
- Quiz fallback.
- Maps connector.
- Firestore adapter if backend mediated.

Suggested tools:

- `pytest`
- `pytest-asyncio`
- `httpx.AsyncClient`
- monkeypatch for external calls

Coverage target:

```text
80% backend line coverage
```

### Frontend

Add or fix tests for:

- Home page render.
- Chat drawer send/fallback.
- Eligibility flow.
- Polling page Maps link.
- Sources page Google services table.
- Quiz completion.
- Progress saved badge.

Suggested tools:

- Vitest
- Testing Library
- MSW or fetch mocks

Coverage target:

```text
80% frontend line coverage
```

## 6. CI Plan

Add GitHub Actions with these jobs:

1. Backend lint and tests.
2. Frontend lint and tests.
3. Frontend build.
4. Docker build.
5. Repo size check.
6. Secret scan.

Minimum commands:

```powershell
python -m pytest -q -p no:cacheprovider
cd web
npm run lint
npm test -- --run
npm run build
```

## 7. README Evidence To Add

Add a "Google Services Used" section:

| Service | Use |
|---|---|
| Cloud Run | Hosts the full-stack app |
| Gemini | Assistant, quiz, summaries, translations |
| Google Search Grounding | Current answers with citations |
| Google Maps Platform | Location and map links |
| Firebase Auth | Anonymous user sessions |
| Firestore | Saved progress and checklist |
| Secret Manager | API key storage |
| Cloud Logging | Observability |
| Developer Knowledge MCP | Official Google docs during development |
| Firestore MCP | Agent-assisted database work |

Add a "Testing" section:

```text
Backend: pytest
Frontend: Vitest + Testing Library
Latest status: paste final passing command output summary
Coverage target: 80%
```

## 8. Submission Checklist

Before final submission:

- Public GitHub repo opens without login.
- Only one branch exists.
- Repo size is below 10 MB.
- README setup works from a fresh clone.
- Dockerfile builds from a fresh clone.
- Cloud Run app opens.
- `/api/health` returns 200.
- Chat returns useful answer, not generic error.
- Tests pass.
- README includes Google services and MCP explanation.
- No secrets are committed.

## 9. Suggested Final Submission Story

Use this wording in README or blog:

```text
ElectionEdu uses Gemini with Google Search grounding for verified civic answers, Google Maps Platform for location-aware voter help, Firebase and Firestore for saved learning progress, and Cloud Run for deployment. During development, Google Developer Knowledge MCP was used inside Antigravity to retrieve official Google documentation, while the managed Firestore MCP workflow supports database and security-rule iteration with IAM and auditability.
```

This is much stronger than saying only "uses Gemini." It shows a complete Google ecosystem and directly addresses the Google Services score.
