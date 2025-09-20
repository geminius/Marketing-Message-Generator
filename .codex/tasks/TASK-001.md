# Task: Generator API endpoint

---
id: TASK-001
status: done
priority: P2
story_id: STORY-001
component: Service.Generator
story_fingerprint: 3ddabbb86fbfe60295dee737b58829c9a1741d39
design_fingerprint: e56ffe408e966d38857c3aca19fd1e481ffa409e
depends_on: []
---

## Summary
Implement a minimal API service: POST `/api/generate` to transform a brief into per‑platform drafts using OpenAI‑compatible APIs and platform templates; add basic drafts persistence endpoints and healthcheck.

## Details
- POST `/api/generate`: Accept `{ brief, platforms: string[], tone: 'friendly'|'professional'|'witty' }`; return `{ drafts: { [platform]: { text, fit: { withinLimit, charsRemaining } } } }`.
- GET `/api/drafts?sessionId=...`: return `{ drafts: Draft[] }` from in‑memory store.
- PUT `/api/drafts/{id}`: upsert a single draft in in‑memory store (scoped by `sessionId`).
- Add `GET /health` for readiness checks.
- Enforce platform constraints via Validation; choose tone preset.

## Test Plan
- Success path: valid brief + 3 platforms → returns drafts for each with fit computed.
- Boundary: near character limits on X; ensure `withinLimit` and remaining chars correct.
- Negative: missing/empty brief → 400 with error shape.
- Drafts API: create/update via PUT, list via GET per `sessionId`.
- Observability: log generation event (Analytics stub) without leaking brief content.

## Implementation Notes
 - Stack: Node + minimal HTTP server; CORS configured for local dev.
- Config: use server‑side fixed `LLM_MODEL` via `OPENAI_API_BASE` and `OPENAI_API_KEY`; include `.env.example`.
- OpenAPI: emit/update `.codex/contracts/openapi.yaml` for the three endpoints (generate, drafts GET/PUT).
- Deployment: include `Dockerfile` and `scripts/run` to serve API and static UI (UI build under `dist/`).
 - Tests are portless via exported `handleRequest` (no socket bind). Unit tests stub LLM; optional integration tests can be added later.

---
status: done
assignee: codex
artifact_fingerprints:
  src/handler.js: c95cd13bde7467eb789a6f882aa49eeaf28182bc6789e20475bba0fbc4188d41
  src/server.js: 8f68e3c249635456eec47909166428a3c7be280f87fa8ae36b468979db403fb8
  src/generator.js: b897322deb7a365e5e88d0179cb00e38ba68fe4b0688bd16c4b1bfd72f363e7e
  src/llm.js: 06cf2e960dca123dd03844acc803f175951fc246d7dcc310a3f391ff0231c30f
  src/validation.js: 9243faf2c539eb78d92509c23db6e14555f2afaef941f70a631b2ed51182950d
  src/storage.js: b8312fd24f3d5b8e5520a88ba8f947c02e327eb9a498eb12e859d8f6e0d69355
  scripts/run: 6f15faa19fadc34e26b2ce085e44e6ac5831d4e59d222d79a759e41c43bb30f4
  scripts/test: a8101dabea4e99a9e768625aaa245f096f98ae5a209875e66056660ddb0534bf
  tests/unit/api.test.js: a1143d9eb85bfedcd771bcff4b9a031dc3178c670a2bc5bc7246e69c2b612002
  tests/unit/llm.test.js: c1a4f1d807449c580521e6b180431970e832996ed8827dcaf09b2c2231c2ca1f
  .env.example: b9df85d262a5332023633444155cdc25dc15912f18983a4c9f35e5546630b943
  .codex/contracts/openapi.yaml: a2ecae13caa5d020c7a9f9af4f4388b47c50da5b7a69c63b107745e710e740a8
review_baseline_sha: f560dc37eac99907f4ad410f8a8f9a96d6a9b1e0c40e42cadbdba9e2ba70ed53

Changelog:
- Add minimal HTTP API server with /health, POST /api/generate, drafts GET/PUT.
- Add validation and in-memory storage modules.
- Add tests, scripts/run, scripts/test, .env.example, and OpenAPI spec.
 - Refactor to portless tests via src/handler.js and update test runner.
 - Map invalid JSON requests to HTTP 400 and recompute draft fit server-side.
 - Extend LLM integration to support querystring API bases and cover Azure-style URLs.
 - Add deterministic LLM unit coverage and refresh `.env.example` placeholders.

tester_pass: true
last_test_run_ts: 2025-09-20T11:47:04Z
