# ElectionEdu

ElectionEdu is an India-focused civic education assistant for voters, first-time voters, and students. It explains voter eligibility, registration, polling stations, election timelines, glossary terms, quizzes, and verified sources through a React + FastAPI app powered by Google services.

Live app: https://election-edu-852805379097.asia-south1.run.app/  
GitHub: https://github.com/PranshuBasak/Election-Process-Education

## Chosen Vertical

Election education / civic technology for Indian citizens.

## Approach

The app combines rule-based civic flows with a grounded AI assistant:

- FastAPI exposes `/api/*` endpoints for chat, learning modules, quizzes, eligibility, polling help, sources, and progress.
- React + Vite provides the web interface.
- Gemini classifies user intent, generates explanations, and creates quizzes.
- Google Search grounding is supported through the current `google-genai` SDK path when credentials are configured.
- Google Maps Platform powers geocoding and "Open in Google Maps" links for location-aware voter help.
- Firestore is used as optional persistence for learning progress, quiz scores, checklist state, and language preference.
- Official election sources such as ECI, Voters' Services Portal, ECI Results, data.gov.in, and Wikipedia fallback sources are exposed through backend connectors.

## Google Services Used

| Service | Where used | Why it matters |
|---|---|---|
| Cloud Run | Full-stack deployment | Public HTTPS live app |
| Gemini API / Vertex AI | Chat, quiz, definitions, translation | Smart dynamic assistant |
| Google Search Grounding | Chat answer path | Current answers with citations |
| Google Maps Platform | Geocoding and map links | Location-aware voter help |
| Firestore | Progress API | Persistent learning/checklist state |
| Secret Manager | Deployment configuration | Keeps keys out of the repo |
| Cloud Logging | Cloud Run observability | Debugging and audit trail |
| Google Developer Knowledge MCP | Development workflow | Official Google docs inside Antigravity/gemini cli |
| Firestore managed MCP | Development workflow | Agent-assisted schema/rules/debugging |

## Tech Stack

### Frontend

- Vite + React
- TypeScript
- Tailwind CSS
- Vitest + Testing Library
- Lucide icons

### Backend

- Python 3.11+
- FastAPI
- Pydantic v2
- httpx
- Gemini SDKs: `google-genai`, `google-generativeai`, `google-cloud-aiplatform`
- Optional Firestore client

## Local Setup

### Prerequisites

- Node.js 18+
- Python 3.11+
- Google Cloud project if using Gemini, Maps, or Firestore

### Install

```powershell
git clone https://github.com/PranshuBasak/Election-Process-Education.git
cd Election-Process-Education

python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt

cd web
npm install
```

Create a local `.env` from `.env.example` and fill only the services you want to test.

## Run Locally

Start backend:

```powershell
$env:PYTHONPATH="."
python -m uvicorn backend.main:app --reload --port 8000
```

Start frontend:

```powershell
cd web
npm run dev
```

Open `http://localhost:5173`.

## API Highlights

- `GET /api/health`
- `POST /api/chat`
- `GET /api/learn`
- `GET /api/learn/{slug}`
- `GET /api/glossary`
- `POST /api/quiz`
- `GET /api/polling?q=Mumbai`
- `GET /api/location/geocode?q=Mumbai`
- `POST /api/eligibility`
- `GET /api/sources`
- `GET /api/progress/{user_id}`
- `PUT /api/progress/{user_id}`

## Testing

Backend:

```powershell
python -m pytest -q -p no:cacheprovider
```

Frontend:

```powershell
cd web
npm run lint
npm test -- --run
npm run build
```

Latest local verification:

- Backend: 9 tests passed
- Frontend: 51 tests passed
- Lint: passed
- Vite production build: passed

## Deployment

The app is designed for a single Cloud Run service:

- Vite builds the frontend into `web/dist`.
- FastAPI serves `/api/*`.
- FastAPI mounts the React build when `web/dist` exists.
- Runtime secrets should come from Cloud Run environment variables or Secret Manager.

Example:

```powershell
gcloud run deploy election-edu `
  --source . `
  --region asia-south1 `
  --allow-unauthenticated
```

## Assumptions

- This app is for Indian election education, not US voter workflows.
- Polling lookup should be treated as guidance only; users should verify exact booth details through their voter slip or https://voters.eci.gov.in.
- Firestore persistence is optional locally and degrades gracefully if credentials are unavailable.
- No election datasets are bundled into the repo.

## Repository Hygiene

- Single public branch: `main`
- No `node_modules`, build output, coverage output, Python caches, or local `.env` files committed
- `.env.example` contains placeholders only
