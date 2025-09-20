# Task: DraftEditors with live counts

---
id: TASK-004
status: done
priority: P2
story_id: STORY-002
component: Web.UI
assignee: codex
story_fingerprint: 3c08d892181b4e9737d935bb25dfc9adb98a5078
design_fingerprint: e56ffe408e966d38857c3aca19fd1e481ffa409e
depends_on: [TASK-002]
---

## Summary
Build per‑platform editors with live character counts and warnings; preserve edits.

## Details
- Responsive editors with count badges; warn when over limits.
- Keep user edits stable across tone changes.

## Test Plan
- Success: counts update as user types; warnings show at limits.
- Boundary: near limit; past limit; toggle tone without losing edits.
- Accessibility: editors usable via keyboard; labels and aria attributes present.

## Log
- 2025-09-18T14:51:58Z — Builder (codex) claimed task; status -> in_progress.
- 2025-09-18T15:02:41Z — Builder (codex) implemented draft editors and moved task to review.
- 2025-09-18T15:30:40Z — Integrator (codex) recorded lineage, flipped task to done, and updated changelog.

---
status: done
assignee: codex
artifact_fingerprints:
  src/ui/App.jsx: 89c86a50865433634ceb846ee7d560721065540d68af36c7f7ea578885a27328
  src/ui/components/DraftEditors.jsx: e539b4fec39bdc238663c4637bcd204fbde6e42cc1705eca03550bee507e39a8
  src/ui/platforms.js: b32d4dac79cb0aa315a8abe84338556881af6890a5aee68fd4ec964cfa9665ea
  src/ui/styles.css: 05fc60d8fda0e98efbe206c9dc0a9d75d97e524aaefd827f6f2e64a2835b2ebf
  tests/ui/draft-editors.test.jsx: f9d94f4fc29a60eb2c217d598a0e865d891d0fb7575b8c2fb8d6243fef9ec6b2
review_baseline_sha: 2fcebb7609108cdd5a46cdbb75f5549f872b992e4c182507f3871175d348162b

Changelog:
- Add persistent per-platform draft editors with live character counts and limit warnings.
- Preserve manual edits across regenerate actions while sourcing latest suggestions.
- Cover editor interactions with vitest suite and supporting UI utilities.

tester_pass: true
last_test_run_ts: 2025-09-18T15:30:04Z
