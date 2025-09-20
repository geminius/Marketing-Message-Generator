# Builder Log

task_id: TASK-006
status: review
summary: Align the DraftEditors character counter with backend surrogate-aware counting and add regression coverage for multi-byte glyphs.

tests_run:
- ./scripts/test
- CI=true npm run test -- --coverage

notes:
- Reused backend counting approach (`Array.from`) to keep UI and server fit warnings consistent for emoji-heavy drafts.
- Added a deterministic test that drives the editor with a multi-byte payload via `fireEvent.change` to avoid userEvent surrogate splitting.
