# Self-Trigger Loop v1

This enables autonomous cycle triggering via GitHub Actions every 5 minutes.

## Components
- Workflow: `.github/workflows/self-trigger-loop.yml`
- Report generator: `ops/automation/selfTriggerLoopReport.ts`
- Latest report artifact (committed): `ops/reports/self-trigger-loop-latest.md`

## What it does each cycle
1. Installs dependencies
2. Runs mandatory gate:
   - `test:v1-summary`
   - `test:v1-cli`
   - `test:v1-e2e`
   - `test:orchestrator`
3. Updates loop report artifact

## Notes
- This is an external trigger mechanism that removes reliance on chat-message wakeups.
- Runtime/code improvements remain PR-governed.
