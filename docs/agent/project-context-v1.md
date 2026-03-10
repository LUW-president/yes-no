# Project Context v1 — YES/NO

## 1. Project Overview
YES/NO is a minimal decision interface built around one core interaction: the system asks one question at a time and the user responds only with YES or NO. The repository is designed to prove that binary decision flow can reduce prompt friction, improve clarity, and create a calmer interaction model than traditional text-heavy AI interfaces.

The project combines implemented product layers (engines, bridge, adapters, prototype surfaces, Expo shell) with tightly scoped concept exploration. The conceptual work exists to stabilize long-term architecture thinking without pretending those concepts are shipped.

The central thesis remains: **the questions are the product**. Everything in this repository should reinforce that simplicity, not dilute it.

## 2. Current Implemented System
What exists and runs today:
- YES/NO core engines and orchestrator flow
- bridge API for session start/answer/state
- CLI surfaces (`yesno run`, `yesno harness`, `yesno demo`, `yesno status`)
- native-style prototype flow
- Expo shell first implementation slice (SDK 54)
- runbooks, demo scripts, pilot and feedback docs

Repository structure (high level):
- `engine/` — protocol/question/memory/orchestrator logic
- `bridge/` — reference bridge layer
- `adapters/` — mobile/web adapter wrappers
- `apps/` — CLI + reference app surfaces
- `prototype/` — native-style prototype layer
- `expo-shell/` — app-like Expo shell
- `docs/`, `ops/` — specs, product docs, runbooks, control docs

Important: these are implemented and testable now; use them as current truth.

## 3. Conceptual Layer: ORBIS
ORBIS is an exploratory spatial interaction concept where users would aim a device toward real-world/global targets.

Key concept: directional interaction using azimuth/elevation, lock moments, and spatial orientation workflows.

**ORBIS is NOT implemented in this repository.** It is currently concept documentation only.

Reference:
- `docs/concepts/orbis-v0.md`

## 4. Core Mathematical Engine
The Global Direction Engine defines the geospatial math foundation for spatial orientation concepts:
- LLH -> ECEF -> ENU transformations
- azimuth calculation
- elevation calculation
- sensor inputs (GPS, heading, motion)

This engine is the physical/mathematical base for future spatial interaction thinking, not an active product runtime in current YES/NO implementation.

Reference:
- `docs/specs/global-direction-engine-v0.md`

## 5. Architecture Layers
Three conceptual layers:

**Layer 1 — YES/NO**  
Decision interface (implemented).

**Layer 2 — ORBIS**  
Spatial interaction system (conceptual only).

**Layer 3 — Global Direction Engine**  
Geospatial math foundation (architectural/spec layer; not shipped runtime).

Current status clarity:
- Implemented today: Layer 1
- Conceptual/architectural documentation: Layers 2 and 3

## 6. YES/NO -> ORBIS Interaction Model
Proposed handoff model (future concept):

Conversation  
↓  
YES/NO decision  
↓  
If spatial action required  
↓  
Launch ORBIS

YES/NO remains conversational and minimal; ORBIS would handle spatial interaction if/when implemented.

Reference:
- `docs/concepts/yesno-orbis-handoff-v0.md`

## 7. Privacy Principles
Intended privacy posture:
- no location history by default
- minimal data capture
- explicit consent before spatial targeting/handoff
- snapshot links ephemeral by design

These principles are guardrails for future spatial features and should be preserved in all architecture decisions.

## 8. Agent Rules
When operating autonomously in this repository:
- Never claim ORBIS is implemented.
- Do not expand product scope without explicit instruction.
- Treat ORBIS as exploratory concept documentation.
- Preserve the minimal nature of YES/NO.
- Prefer documentation-first alignment before feature expansion.
- Keep sharing posture conservative and controlled.
- Avoid architectural changes without approval.

## 9. Repository Philosophy
This project prioritizes:
- clarity
- minimalism
- architectural discipline

The repository favors documenting intent, constraints, and boundaries before adding complexity. Expansion is acceptable only when coherence, stability, and scope control are preserved.
