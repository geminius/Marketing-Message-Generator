# Builder Run Log — 2025-09-18T04:02:28Z

## Task
- TASK-001 — Service.Generator — Generator API endpoint

## Actions
- Adjusted HTTP error handling to translate JSON parse failures into 400 responses via `mapError` in `src/server.js`.
- Recomputed draft validation on every `PUT /api/drafts/{id}` call and rejected invalid payloads in `src/handler.js`.
- Extended `tests/unit/api.test.js` to verify error mapping and enforced fit recomputation.
- Updated task artifact fingerprints and changelog once fixes landed.

## Tests
- `./scripts/test`

## How to Run Locally
- `chmod +x scripts/*`
- `./scripts/test`
- `./scripts/run`

NEXT: run Tester (04_tester.md) for TASK-001
