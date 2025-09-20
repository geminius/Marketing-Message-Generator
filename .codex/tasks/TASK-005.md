# Task: Tone re-suggestions without losing edits

---
id: TASK-005
status: done
priority: P2
story_id: STORY-002
component: Service.Generator
assignee: codex
story_fingerprint: 3c08d892181b4e9737d935bb25dfc9adb98a5078
design_fingerprint: e56ffe408e966d38857c3aca19fd1e481ffa409e
depends_on: [TASK-001]
---

## Summary
Support tone slider to request updated suggestions while preserving manual edits in UI.

## Details
- Add API param to request tone variant per platform.
- Return suggested text and a diff hint; UI merges non-conflicting parts.

## Test Plan
- Success: changing tone returns new suggestions; manual edits remain after merge.
- Boundary: aggressive differences still preserve user changes.
- Negative: invalid tone value → 400.

## Log
- 2025-09-18T16:01:12Z — Builder (codex) claimed task; status -> in_progress.
- 2025-09-18T16:12:00Z — Builder (codex) implemented tone re-suggestions and moved task to review.
- 2025-09-18T16:13:40Z — Integrator (codex) recorded lineage, flipped task to done, and updated changelog.

---
status: done
assignee: codex
artifact_fingerprints:
  src/generator.js: fd0427f8541f3be8a95a0d98e6ea34f67f60b2a8611dd85bb206db73967a79d1
  src/handler.js: 15a0c06730c6fb746eb18f3e2e2cb9454f811fc3daf226ed37be8435ef3ec410
  tests/unit/api.test.js: 1cea41b746fb8c9ac55d97d62a0c33c153de8cb10d694168bc0e1067cce97a54
review_baseline_sha: 04ac7ada7b8e6acc05993ff579ecbd60efa22c8774730243832019e9c4128dd2

Changelog:
- Support per-platform tone overrides with diff hints to aid UI merges when regenerating drafts.
- Validate tone values and propagate suggestions without overwriting manual edits.
- Extend API tests covering tone variants and invalid tone handling.

tester_pass: true
last_test_run_ts: 2025-09-18T16:13:34Z
