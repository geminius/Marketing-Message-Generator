# Builder Run Log - 2025-09-18T15:02:41Z

## Task
- TASK-004 - Web.UI - DraftEditors with live counts

## Actions
- Added platform metadata helpers and DraftEditors component with live character counts, warnings, and textarea controls per platform.
- Updated `App` state management to preserve manual edits across regenerate calls while sourcing latest suggestions and env-configured API base.
- Expanded vitest coverage for editor behaviours (limits, tone change persistence) and refreshed styling for the new editing UI.

## Tests
- `./scripts/test`
- `./scripts/lint`
- `./scripts/build`

## How to Run Locally
- `./scripts/install`
- `./scripts/run ui`
- `./scripts/test`
- `./scripts/lint`
- `./scripts/build`

NEXT: run Tester (04_tester.md) for TASK-004
