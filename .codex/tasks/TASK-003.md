# Task: BriefForm + PlatformSelector (UI)

---
id: TASK-003
status: done
priority: P2
story_id: STORY-001
component: Web.UI
assignee: codex
story_fingerprint: 3ddabbb86fbfe60295dee737b58829c9a1741d39
design_fingerprint: e56ffe408e966d38857c3aca19fd1e481ffa409e
depends_on: []
---

## Summary
Scaffold a lightweight React + Vite app with responsive BriefForm and PlatformSelector, validation, and submit to `/api/generate`.

## Details
- Bootstrap project with Vite + React, TypeScript optional.
- Scripts: `./scripts/install`, `./scripts/lint`, `./scripts/test`, `./scripts/run` (dev), `./scripts/build` (prod).
- Env: add `.env.example` (UI base URL, API base); document in README.
- Mobile‑first layout; touch targets ≥ 44px; keyboard accessible.
- Fields: objective, audience, key messages, CTA, platforms, tone.
- Disable submit when invalid; show API errors.
- Build: produce static assets in `dist/` to be served by the API container.

## Test Plan
- Success: valid form posts and renders drafts placeholder/cards.
- Boundary: validation on empty/overlong fields; platform selection required.
- Negative: API 400/500 surfaces message; no crash.
- Accessibility: basic tab order and label association.
 - Dev UX: `./scripts/run` starts UI with hot reload; proxy to API works.

## Log
- 2025-09-18T13:10:00Z — Builder (codex) claimed task; status -> in_progress.
- 2025-09-18T13:15:00Z — Builder (codex) blocked: requires adding Vite/React scaffolding files outside permitted directories (package.json, vite.config.js).
- 2025-09-18T13:20:00Z — Builder (codex) resumed after approval to modify root-level config.
- 2025-09-18T13:53:00Z — Builder (codex) completed UI scaffold and moved task to review.
- 2025-09-18T14:00:19Z — Reviewer (codex) flagged env config gap and dependency classification; status -> blocked.
- 2025-09-18T14:43:45Z — Builder (codex) resumed to address reviewer feedback on dependencies and env config.
- 2025-09-18T14:45:40Z — Builder (codex) updated env config/dep classifications and returned task to review.
- 2025-09-18T14:49:40Z — Integrator (codex) recorded lineage, flipped task to done, and updated changelog.

---
status: done
assignee: codex
artifact_fingerprints:
  .gitignore: 03542fa3cc6502af66dc34199a1265bec5bb7b5486602b37fd457763c69f3431
  eslint.config.mjs: 66874bdf881d968fc3b95e17c1b8cd4ad0bc28547045ccdb6c30abb9a0493b67
  index.html: df4163f99b8989ccf28301118d61da546cd05762a54055e8ecc621fe1b80eacc
  .env.example: b9df85d262a5332023633444155cdc25dc15912f18983a4c9f35e5546630b943
  package-lock.json: 1580418366c29790a4e4c75a0a4befc1f457e8fb7c03207f2d6735e151960285
  package.json: 07c875e3c33b6e8e003e285fc098eb15cb672c7d25cc1038209b1c504e952be5
  scripts/build: e385de69881bb49a71f1048130d653b41628aea304c50e6726982a5a1cdd5fe3
  scripts/install: 0636abae16ee86dd5927d430869522ca8ffe518dc653e3c1116db333b7c96801
  scripts/lint: 6b72b100ac7f2195430b0a0f154d18764d692080ab8a5a5b9d2707c7d7c0bdec
  scripts/run: 0c134d2347b94793df6cd9a42174fa9bb83ddc365defd92fe73aa9e9399df3e8
  scripts/test: 46ed2b44ede0c9b1c56fd51cad6b45f70ba61b83f94dae9e25305cedc5b16680
  src/ui/App.jsx: b24dd9b4ef9c5e23151457032228bcd6f8cae51a89e49a9b2c44c159ebf08525
  src/ui/components/BriefForm.jsx: 3085476949299b796c1b7b6f741bbafac446cbf3747c652e3110cf65ebd0e8ac
  src/ui/components/PlatformSelector.jsx: b95f4a5f88d85f93d9da68f14697eccff29e3faf9b17c45f8cf5906f0ea75c08
  src/ui/main.jsx: 83aeeea6ff5cc0f3a1cec8cf09da3c191c6461585579c64f7e642609f9fe7b32
  src/ui/styles.css: df0025bb5751f0accccccf45e7a5a9e7df4be406a04e036fc0b0e09cc8c37d8a
  tests/ui/brief-form.test.jsx: 2b175cd21afa1978242f4193d1ebb1e1d254abd7252e9e3a1ba4ab25a940cc11
  vite.config.mjs: 7f52632f59179245f0631af585bb234cb27d216fa3434371de5a956e83bf8d8a
  vitest.setup.js: 91a3c8962a0edcb956206a501d943fe99e1c78c6d4d8b5c9a948a3362c75978c
review_baseline_sha: bcf98e9f892b50555508e264c6989e4dbc03fdeea9fffcbe20e95aaf23eb25c1

Changelog:
- Scaffolded a Vite-powered React UI with accessible brief form, tone selector, and per-platform checkboxes.
- Added API integration with validation, error handling, and drafts preview cards.
- Introduced UI-focused vitest suite and npm-based scripts for install, lint, test, run, and build.

tester_pass: true
last_test_run_ts: 2025-09-18T14:48:28Z
