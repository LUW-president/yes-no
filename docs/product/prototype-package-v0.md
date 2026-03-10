# Prototype Package v0 — YES/NO

## purpose
Create a single coherent package of current YES/NO prototype materials so internal stakeholders can review, run, and present the project consistently.

## included materials
- native mobile prototype implementation (`prototype/native-mobile/`)
- prototype implementation spec (`docs/specs/native-mobile-prototype-implementation-v0.md`)
- native mobile UI spec (`docs/specs/native-mobile-ui-spec-v0.md`)
- gesture input spec (`docs/specs/gesture-input-spec-v0.md`)
- interaction timing spec (`docs/specs/interaction-timing-spec-v0.md`)

## demo assets
- visual reference assets: `docs/specs/assets/`
- deterministic path target: `artifact_film` from `creation_v0`
- status snapshot via `yesno status`

## prototype commands
- `npm run bridge:dev`
- `npm run prototype:native`
- `npm run yesno:demo`
- `npm run yesno:status`
- `npm run test:prototype:native`

## walkthrough script reference
- `docs/product/prototype-walkthrough-script-v0.md`

## runbook reference
- `ops/runbooks/prototype-demo-runbook-v0.md`

## current limitations
- prototype is minimal and non-production
- no real gesture recognition (stub only)
- no account/auth system
- no notification layer
- local environment oriented

## recommended internal sharing flow
1. Share this package doc as the index.
2. Share the walkthrough script for presenter consistency.
3. Share runbook for operator execution steps.
4. Run live demo using canonical command sequence.
5. Capture feedback tied to milestone roadmap v1.
