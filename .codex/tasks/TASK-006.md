# Task: Helpers, copy/export, autosave

---
id: TASK-006
status: done
priority: P2
story_id: STORY-002
component: Web.UI
assignee: codex
story_fingerprint: 3c08d892181b4e9737d935bb25dfc9adb98a5078
design_fingerprint: e56ffe408e966d38857c3aca19fd1e481ffa409e
depends_on: [TASK-004]
---

## Summary
Add hashtag/mention helpers with de-duplication, copy-to-clipboard per platform, export all as JSON, and autosave via local storage.

## Details
- Suggest tags/mentions; prevent duplicates; provide clear UI for insertion.
- One-click copy per platform and export aggregated JSON.
- Autosave edits and restore on reload.
 - Export places JSON link/download and offers import for session restore.

## Test Plan
- Success: helpers insert/de-duplicate; copy/export works; autosave persists.
- Negative: local storage unavailable → fail gracefully.
- Accessibility: buttons/controls operable via keyboard.
 - Import: rehydrate from exported JSON restores all editors.

## Log
- 2025-09-18T16:19:09Z — Builder (codex) claimed task; status -> in_progress.
- 2025-09-18T16:39:31Z — Builder (codex) delivered helper UI, export/import, and autosave updates; status -> review.
- 2025-09-18T16:42:57Z — Tester (codex) unable to record coverage (missing `@vitest/coverage-v8`), task set to blocked.
- 2025-09-18T16:45:35Z — Tester (codex) installed coverage dependency and resumed validation; status -> review.
- 2025-09-18T16:47:17Z — Tester (codex) ran UI suite with coverage (statements 92.53%, lines 92.53%); Tester PASS.
- 2025-09-18T16:51:27Z — Integrator (codex) updated lineage, changelog, marked task done, and flipped STORY-002 to done.
- 2025-09-20T22:13:10Z — Builder (codex) reopened task to align UI character counts with backend; status -> in_progress.
- 2025-09-20T22:13:50Z — Builder (codex) delivered surrogate-safe counter and regression tests; status -> review.
- 2025-09-20T13:17:10Z — Integrator (codex) recorded lineage/changelog for surrogate-safe counter and marked task done.

---
status: done
assignee: codex
artifact_fingerprints:
  package-lock.json: 56cca89438d39dcd826fe8f649142b540fd34d204a6af995988799d494a9d37c
  package.json: 92950ca11d7f10521cf1d2570e83815096f45f30a6d7f4c1e94deda9fe1e4e49
  src/ui/App.jsx: 5a28c3c4c1eba3b813c1cfbf8fc61ec8df94b2b0ea5df1e0cfc93dddf135a296
  src/ui/components/DraftEditors.jsx: 14ead75d2e52f3881aef69608e4f608ba102e81b27684c52c5098b5a9db12cff
  tests/ui/draft-editors.test.jsx: 07565983b7d8fd56ddfa046c352e2b7c2620a7c89bc2858cea2b03ba4c6aad76
  vite.config.mjs: 42e348bf03341c542d1a7bf0873c06f1050a78c3506042512b68c19ef434bb2d
review_baseline_sha: 0c8fa706711931a03fb2e73478f2e0ed2a0893a1631f2b4ad8834e331747f240

Changelog:
- Surface lowercase helper buttons per platform and guard duplication while keeping copy feedback.
- Persist drafts in local storage, export JSON with download link, and restore imported drafts via resilient file parsing.
- Align UI character counter with backend surrogate-aware counting and cover multi-byte regression.

tester_pass: true
last_test_run_ts: 2025-09-20T13:16:07Z
