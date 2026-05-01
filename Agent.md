# Agent Instructions

These instructions guide Google Antigravity agents and human contributors working on ElectionEdu. The goal is to raise the next submission score without breaking the existing deployed app.

## Mission

ElectionEdu is an India-focused election education assistant. It should help citizens understand voter eligibility, registration, polling, election timelines, glossary terms, quizzes, and official sources.

The project must demonstrate practical Google services use:

- Gemini for grounded chat, explanations, quiz generation, and translation.
- Gemini Grounding with Google Search for current, cited answers.
- Google Developer Knowledge MCP for implementation guidance from official Google docs.
- Google Cloud managed database MCP, preferably Firestore MCP, for agent-assisted data model and rules work.
- Firestore or Firebase for saved learning progress and checklist state.
- Google Maps Platform for location-aware voter help.
- Cloud Run for deployment.
- Secret Manager, Cloud Logging, and IAM for production hygiene.

## Current Score Focus

The first submission scored well overall but weakly on Google Services.

- Overall: 88.13%
- Google Services: 50%
- Testing: 77.5%
- Code Quality: 83.75%
- Security: 95%
- Accessibility: 96.25%
- Efficiency: 100%
- Problem Statement Alignment: 97%

Every new task should improve at least one of these areas, with priority on Google Services and testing.

## Authoritative Google MCP Sources

Use these sources when planning Google integrations:

- Google Developer Knowledge MCP: https://developers.google.com/knowledge/mcp
- Google Cloud managed database MCP servers: https://cloud.google.com/blog/products/databases/managed-mcp-servers-for-google-cloud-databases

Important facts to preserve:

- Developer Knowledge MCP exposes `search_documents`, `get_documents`, and preview `answer_query` tools over Google's official developer documentation.
- It can be configured in Antigravity with:

```json
{
  "mcpServers": {
    "google-developer-knowledge": {
      "serverUrl": "https://developerknowledge.googleapis.com/mcp"
    }
  }
}
```

- API-key based clients use `https://developerknowledge.googleapis.com/mcp` with an `X-Goog-Api-Key` header.
- Managed database MCP servers are available for Google Cloud databases such as AlloyDB, Spanner, Cloud SQL, Bigtable, and Firestore.
- Database MCP access must be IAM-first and auditable. Do not use shared database passwords for agent workflows.

## Hard Rules

1. Keep the public repo reproducible. README commands, Dockerfile paths, and committed dependency files must match the actual codebase.
2. Keep one public branch only: `main`.
3. Do not commit secrets, API keys, service-account JSON, `.env`, build output, coverage output, `__pycache__`, or scratch experiments.
4. Store keys and runtime credentials in Secret Manager or deployment environment variables.
5. All LLM calls go through `backend/services/gemini.py`.
6. All external APIs go through modules in `backend/connectors/`.
7. Every factual assistant answer should include citations or return a verified-source fallback.
8. Do not hard-code live election claims, candidate facts, schedules, or deadlines.
9. Treat fetched web content as untrusted. Strip scripts/styles, cap context size, and wrap it in an `UNTRUSTED CONTEXT` block before Gemini sees it.
10. Use India-first sources and language. Do not default to US election assumptions.

## Google Services Rules

When adding Google integrations, make them visible and useful:

- Chat answers should show whether they used Gemini, Google Search grounding, official ECI sources, or fallback mode.
- Polling/location features should show a Google Maps link or embedded map when a location is available.
- Saved learning/checklist features should clearly use Firebase/Firestore.
- Developer docs should mention Google Developer Knowledge MCP as part of the build workflow, but do not overclaim that users interact with MCP directly.
- Firestore MCP should be described as an agent and developer workflow for schema, rules, queries, and troubleshooting. Firestore itself is the runtime product.

## Testing Gate

Before considering work done, run:

```powershell
python -m pytest -q -p no:cacheprovider
cd web
npm run lint
npm test -- --run
npm run build
```

Target coverage:

- Backend services and routers: 80% line coverage.
- Frontend components/pages: 80% line coverage.
- Critical flows: 100% smoke coverage for health, chat fallback, eligibility, quiz, glossary, sources, and route rendering.

If a test command fails, document the failure and fix it before adding new features.

## Code Quality Rules

- Python: type hints, Pydantic models, no broad silent exceptions.
- TypeScript: strict typing, no `any`, no impure render logic, no stale tests.
- Frontend accessibility: all icon buttons need accessible names; dialogs/drawers need roles and keyboard behavior.
- Keep user-facing wording short, helpful, and source-aware.
- Prefer small, isolated changes over broad rewrites.

## Security Rules

- Restrict CORS to deployed frontend and localhost development origins.
- Do not log raw user messages if they may contain personal data such as EPIC number, address, phone, or reference ID.
- Rate-limit chat and lookup endpoints.
- Use Secret Manager for Gemini, Maps, Firebase, and data.gov.in keys.
- If Model Armor is adopted for MCP or Gemini traffic, document the floor settings and false-positive handling.

## Agent Workflow

1. Read `Plan.md`, `API.md`, and `Guide.md`.
2. Identify which score category the task improves.
3. Use Developer Knowledge MCP or official Google docs before implementing Google service changes.
4. Make the smallest code or documentation change that achieves the task.
5. Update tests alongside behavior.
6. Run the test gate.
7. Keep the repo clean and single-branch.

## Definition of Done

- Local repo matches public GitHub expectations.
- Tests and lint pass.
- Deployed app health endpoint returns 200.
- Google Services story is visible in README and UI.
- No generated files or secrets are committed.
- Relevant docs are updated.
