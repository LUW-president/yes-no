# Implementation Roadmap v1 — YES/NO

## 1) Current system status
What runs today:
- YES/NO core engines (protocol, question, memory) and orchestrator
- Bridge runtime and adapter communication path
- CLI command surface and deterministic demo path
- Native-style prototype flow (question -> artifact -> completion)
- Expo shell first app-like slice (SDK 54)
- Operational docs for demos, pilot execution, and feedback capture

## 2) Concept systems
Concept/documentation only (not implemented runtime):
- ORBIS spatial interaction concept
- YES/NO -> ORBIS handoff model
- Global Direction Engine as geospatial implementation foundation

**Explicit statement:** ORBIS is not currently implemented.

## 3) Implementation priorities
Priority categories:
1. YES/NO prototype stabilization
2. Bridge reliability in real-device demo environments
3. Expo shell UX consistency (minimal app-like polish)
4. ORBIS research direction (documentation/spec refinement only until explicitly approved)

## 4) Recommended development sequence
### M1 — Stabilize YES/NO prototype
- harden deterministic flow reliability
- reduce run-path friction in demos
- keep test baseline green and reproducible

### M2 — Improve mobile experience
- refine Expo shell presentation quality without scope expansion
- improve network/run instructions for real-device tests
- keep bridge contract unchanged

### M3 — Experimental spatial engine prototype (bounded)
- only after explicit approval
- isolate prototype geospatial computations from YES/NO production path
- no implicit ORBIS rollout claims

### M4 — ORBIS exploration (optional)
- concept validation and boundary docs
- consent/privacy model hardening
- implementation only under explicit scope decision

## 5) Guardrails for execution
- preserve YES/NO minimal philosophy
- avoid parallel subsystem changes in one phase
- no concept-layer claims as shipped functionality
- maintain limited external sharing posture until explicitly updated
