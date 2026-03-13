# First Public Deployment Checklist (v1)

Use this checklist before and after the first public YES/NO deployment.
Scope: single-session prototype mode with deterministic session summary behavior.

## Pre-deploy checks

- [ ] Confirm deployment target is the intended public environment and branch/tag is correct.
- [ ] Confirm runtime constraints remain intact:
  - single-session model only
  - no decision engine behavior changes
  - no continuous questioning loop
  - no behavioral learning / auto-trigger logic
- [ ] Run required validation tests locally:
  - `npm run test:web-v1-smoke`
  - `npm run test:v1-summary`
  - `npm run test:v1-cli`
  - `npm run test:v1-e2e`
  - `npm run test:orchestrator`
- [ ] Verify onboarding copy and summary labels are visible and human-readable in web-v1.
- [ ] Confirm public docs are updated for operators and first-time users:
  - `docs/public/how-to-run-a-decision-session.md`
  - this checklist
- [ ] Ensure rollback instructions and previous known-good deployment reference are available to operators.

## Post-deploy checks

- [ ] Load the deployed web-v1 surface and verify session can start without manual backend intervention.
- [ ] Execute a live smoke on deployed environment:
  - circle gesture -> yes submission path progresses
  - cross gesture -> no submission path progresses
  - invalid gesture -> no submission + retry guidance appears
- [ ] Verify summary endpoint returns deterministic shape with expected fields (gate result, guard status, confidence, primary reason).
- [ ] Confirm no runtime errors in server logs during a full session cycle.
- [ ] Confirm no unexpected dependency/runtime drift from the release baseline.

## Rollback trigger conditions

Trigger rollback immediately if any of the following occurs:

1. Session start or answer submission fails for a reproducible normal flow.
2. Gesture path mis-submits answers (e.g., cross incorrectly submits yes) in repeated checks.
3. Invalid gesture path auto-submits an answer instead of requiring retry.
4. Summary generation fails, returns malformed payload, or omits required decision fields.
5. Severe user-facing regression (blank UI, blocked controls, unrecoverable error state).

## Rollback action (operator quick path)

1. Stop traffic to current bad deployment (or route traffic away per platform controls).
2. Redeploy previous known-good version.
3. Re-run `npm run test:web-v1-smoke` and one live manual session check.
4. Record incident details and root cause candidate before resuming normal rollout.
