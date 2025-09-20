# Reviewer Log

## Task
- TASK-001 — Generator API endpoint

## Findings
1. [BLOCKER] `POST /api/generate` returns a 500 for malformed JSON because `parseBody` rejects with `invalid_json` and the catch-all in `src/server.js:39-45` maps every error to `500 server_error`. Clients sending bad payloads should receive a 4xx; right now the server masks the client mistake as an internal failure and never surfaces `invalid_json` to the caller.
2. [BLOCKER] `PUT /api/drafts/{id}` trusts caller-supplied `fit` data. The handler copies the request body into storage and only recomputes validation when `fit` is missing (`src/handler.js:30-35`). A client can send stale or intentionally incorrect `fit` values, violating the requirement that the service enforce platform constraints.

## DoD Checklist
- IDs & fingerprints present: ✅
- Docs/contracts updated where needed: ✅ (`.codex/contracts/openapi.yaml`, `AGENTS.md`)
- Tests added/updated: ✅ (`tests/unit/api.test.js` exercises happy-path + CRUD + one negative)
- Coverage ≥ 80%: ⚠️ Not evidenced; please share coverage output or rationale.

## Recommendations
- Differentiate body-parse failures and return `400 { error: 'invalid_json' }` while reserving `500` for real server faults.
- Always recompute `fit` from the incoming draft text/platform before persisting or responding.
- Consider extending unit tests to cover malformed JSON and draft updates that exceed platform limits.
