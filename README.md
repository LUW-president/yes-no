# YES/NO

## project overview
YES/NO is a deterministic AI interaction system built around one core rule: the system asks questions, and users respond with only YES or NO.

## core concept
- one question at a time
- binary interaction only (YES / NO)
- no prompt-writing interface
- calm, minimal experience where timing and silence matter

## architecture overview
User Interface  
↓  
Mobile Adapter / Web Adapter  
↓  
Reference Bridge  
↓  
Session Orchestrator  
↓  
Core Engines:
- protocol
- question engine
- memory engine

## repository structure
- `engine/` — protocol, question, memory, orchestrator
- `apps/` — CLI runner, UX harness, demo, mobile/web reference apps
- `bridge/reference-app/` — minimal HTTP bridge API
- `adapters/` — mobile and web bridge clients
- `ops/` — dashboard + runbooks
- `docs/specs/` — product/UX/system specs
- `docs/product/` — product narrative documents
- `docs/releases/` — release baseline docs
- `docs/ops/` — durable agent operating control layer

## how to run the system
Core:
- `yesno run`
- `yesno harness`
- `yesno demo`
- `yesno status`

Equivalent scripts:
- `npm run yesno:run`
- `npm run yesno:harness`
- `npm run yesno:demo`
- `npm run yesno:status`

Supporting services and reference apps:
- `npm run bridge:dev`
- `npm run mobile:reference`
- `npm run web:reference`

## current baseline
Internal v0 baseline is complete with deterministic engine, CLI surfaces, bridge/adapters, reference apps, status dashboard, and full passing module test matrix.

## product documents
- `docs/product/product-one-pager-v0.md`
- `docs/product/product-deck-outline-v0.md`
- `docs/specs/native-mobile-ui-spec-v0.md`
- `docs/specs/gesture-input-spec-v0.md`
- `docs/specs/interaction-timing-spec-v0.md`
- `docs/specs/native-mobile-prototype-plan-v0.md`

## contribution guidelines
- preserve core philosophy (binary, minimal, deterministic)
- keep changes phase-scoped and documented
- run full baseline tests before merge
- avoid introducing complexity without explicit approval
- follow ops control docs in `docs/ops/`
