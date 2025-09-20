# Changelog

## 2025-09-20
- STORY-001 / TASK-001 (shadow:f560dc37eac99907f4ad410f8a8f9a96d6a9b1e0c40e42cadbdba9e2ba70ed53): Integrated OpenAI-compatible draft generation with Azure-friendly URL handling, LLM fallback logging, and added deterministic unit coverage (92.53% statements).
- STORY-002 / TASK-006 (shadow:0c8fa706711931a03fb2e73478f2e0ed2a0893a1631f2b4ad8834e331747f240): Synced UI character counters with backend surrogate-aware limits and added emoji-heavy regression tests to keep editors aligned.

## 2025-09-18
- STORY-001 / TASK-001 (shadow:f560dc37eac99907f4ad410f8a8f9a96d6a9b1e0c40e42cadbdba9e2ba70ed53): Harden generator API by returning `400 invalid_json` on malformed bodies and recomputing draft fit on updates; refreshed unit coverage (85%).
- STORY-001 / TASK-002 (shadow:af4b0bcd5857b5580d1acec935bf6bf5e404f5cd36fa579f356f4157464990a3): Added platform templates with tone presets, tightened validation/metrics, and extended unit suite (coverage 100%).
- STORY-001 / TASK-003 (shadow:bcf98e9f892b50555508e264c6989e4dbc03fdeea9fffcbe20e95aaf23eb25c1): Shipped Vite/React brief UI with platform selector, tone presets, configurable API base, and accompanying vitest coverage plus npm workflow scripts.
- STORY-002 / TASK-004 (shadow:2fcebb7609108cdd5a46cdbb75f5549f872b992e4c182507f3871175d348162b): Added per-platform draft editors with live counts/alerts, preserved manual edits across regenerations, and expanded UI test coverage.
- STORY-002 / TASK-005 (shadow:04ac7ada7b8e6acc05993ff579ecbd60efa22c8774730243832019e9c4128dd2): Enabled tone-specific resuggestions with diff hints and strict tone validation while keeping manual edits intact.
- STORY-002 / TASK-006 (shadow:fdb0ff7dc644a697d3d382b2efd31bfb3d49de8dd5bab299df9a7fa96ec1c62f): Delivered hashtag/mention helpers, local autosave, drafts export/import, and enforced UI coverage via Vitest v8.
