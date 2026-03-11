# External Validation Runbook v1 (10 Sessions)

## Setup (once)
1. Copy template to working file:
   - `cp ops/validation/external-user-sessions.template.jsonl ops/validation/external-user-sessions.jsonl`
2. Open working file in editor.
3. Open this runbook + checklist side by side.

## Session mix target
- 6 first-time users
- 4 repeat users
- at least 4 mobile sessions

## Run sequence
For each session index 1..10:
1. Send invite message (`external-validation-invite-message-v1.md`).
2. Run participant through the moderator guide.
3. Run the 30-second interview script.
4. Fill exactly one JSONL object line for that session.

## After all 10
Run synthesis:
- `npm run validation:summary -- ops/validation/external-user-sessions.jsonl`

Then update:
- `docs/ops/external-user-validation-results-v1.md`
with actual metrics and top friction points.
