# Task: Templates and Validation

---
id: TASK-002
status: done
priority: P2
story_id: STORY-001
component: Service.Templates
assignee: codex
story_fingerprint: 3ddabbb86fbfe60295dee737b58829c9a1741d39
design_fingerprint: e56ffe408e966d38857c3aca19fd1e481ffa409e
depends_on: []
---

## Summary
Define platform profiles and validators for Instagram, Facebook, and X (character limits, handle/hashtag formats, link handling).

## Details
- Provide `getTemplate(platform)` with tone presets and formatting hints.
- Implement `validateDraft(platform, text)` with length checks and basic rule validations.

## Test Plan
- Success: each platform returns a template and validates a compliant draft.
- Boundary: texts at, just under, and just over limits; counts must match.
- Negative: unknown platform → validation/template error.
- Observability: validator emits metrics suitable for Analytics.

## Log
- 2025-09-18T04:12:00Z — Builder (codex) claimed task; status -> in_progress.
- 2025-09-18T11:26:16Z — Builder (codex) completed implementation and moved task to review.
- 2025-09-18T13:02:18Z — Integrator (codex) recorded lineage, flipped task to done, and updated changelog.

---
status: done
assignee: codex
artifact_fingerprints:
  scripts/test: a69cf09f67f306e41c9f4cc8625449313cd0db0c5abdc6633f806a353ee7f04a
  src/templates.js: 7ffd4d676b5b7df9a8d1e6e5deb6f20bd04e570ce5c649e082bd9cc2407146d0
  src/validation.js: dd1d00e9bd5594592667d9a4497f77b3ed3735ea1fa1b88aa4a349d40ca97294
  tests/unit/templates.test.js: 4e1f367e617c4bd5a1a736ef621a23375c94847b20217d72aaa47c41c07ee0ff
review_baseline_sha: af4b0bcd5857b5580d1acec935bf6bf5e404f5cd36fa579f356f4157464990a3

Changelog:
- Add structured templates with tone presets and formatting guidance for X, Instagram, and Facebook.
- Expand validation to enforce platform-specific handles/hashtags/links and emit usage metrics.
- Cover templates/validation with dedicated unit tests and include them in the test runner.

tester_pass: true
last_test_run_ts: 2025-09-18T12:35:37Z
