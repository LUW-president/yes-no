# Release Baseline v0

## Release Name
YES/NO Release Baseline v0

## Purpose
Consolidate the current deterministic YES/NO system into a stable, runnable, internal baseline for demos, validation, and controlled iteration.

## Included Components
- protocol
- question engine
- memory engine
- session orchestrator
- CLI runner
- UX harness
- CLI packaging layer (`yesno`)
- deterministic demo script
- reference app bridge
- mobile adapter
- web adapter
- mobile reference app
- web reference app

## Command Matrix
### Core commands
- `yesno run`
- `yesno harness`
- `yesno demo`

### Direct tsx entrypoints
- `npx tsx apps/cli/yesno.ts run`
- `npx tsx apps/cli/yesno.ts harness`
- `npx tsx apps/cli/yesno.ts demo`

### NPM scripts (current baseline)
- `npm run yesno:run`
- `npm run yesno:harness`
- `npm run yesno:demo`
- `npm run bridge:dev`
- `npm run mobile:reference`
- `npm run web:reference`
- `npm run test:protocol`
- `npm run test:question`
- `npm run test:memory`
- `npm run test:orchestrator`
- `npm run test:cli`
- `npm run test:ux`
- `npm run test:cli-dispatch`
- `npm run test:demo`
- `npm run test:bridge`
- `npm run test:adapters:mobile`
- `npm run test:adapters:web`
- `npm run test:mobile-reference`
- `npm run test:web-reference`

## Demo Flow
1. (Optional for adapter-driven flows) Start bridge.
2. Run deterministic demo (`yesno demo`) to validate end-to-end logic.
3. Run mobile reference app and execute YES/NO inputs through adapter flow.
4. Run web reference app and execute YES/NO inputs through adapter flow.
5. Confirm artifact-proposal and completion paths render correctly.

## Local Run Instructions
1. Install dependencies:
   - `npm install`
2. Validate baseline tests:
   - Run full suite from `ops/runbooks/test-baseline-runbook.md`
3. Run demo:
   - `npm run yesno:demo`
4. Run bridge (if needed):
   - `npm run bridge:dev`
5. Run mobile reference app:
   - `npm run mobile:reference`
6. Run web reference app:
   - `npm run web:reference`

## Test Baseline
The v0 baseline integrity is defined by all module suites passing:
- protocol
- question
- memory
- orchestrator
- cli runner
- ux harness
- cli dispatch
- demo
- bridge
- mobile adapter
- web adapter
- mobile reference app
- web reference app

## Known Limitations
- console/terminal-only UI
- no real mobile native UI yet
- no real browser UI yet
- no gesture recognition yet
- no notification system yet
- no production persistence yet
- no hosted deployment yet

## Next Milestone Recommendations
- Add artifact decision controls (accept/reject) across bridge + reference UIs
- Add persistent session storage and recovery paths
- Add browser-native thin UI shell and mobile-native proof app
- Add basic deployment profile (local container or hosted sandbox)
- Add smoke command for one-shot baseline validation
