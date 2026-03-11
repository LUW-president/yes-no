# V1 Prototype Stability Checklist (v0)

Use this checklist before sharing V1 prototype results.

## Deterministic execution
- [ ] Run `npm run test:v1-summary` and confirm deterministic final decision summary output.
- [ ] Run `npm run test:v1-cli` and confirm deterministic CLI V1 command flow.
- [ ] Run `npm run test:v1-e2e` and confirm end-to-end output is stable across repeated runs.
- [ ] Run `npm run test:orchestrator` and confirm orchestrator-level behavior remains stable.

## Manual smoke checks
- [ ] Run `yesno v1 --answers yes,yes,yes` and verify a session summary is printed.
- [ ] Run `yesno v1 --answers no,no,no` and verify guard + gate output still appears.

## Reporting hygiene
- [ ] Attach exact command outputs used for validation in PR notes.
- [ ] Note any non-deterministic or flaky behavior, even if intermittent.
- [ ] Label results as `prototype / non-production` in external communications.
