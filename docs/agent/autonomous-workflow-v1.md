# Autonomous Workflow v1 — YES/NO

## 1) Agent operating rules
- Prefer documentation before implementation when scope is uncertain.
- Never expand product scope without explicit human instruction.
- Open PRs for all changes; do not bypass review flow.
- Avoid modifying multiple subsystems in one phase.
- Keep concept-stage language explicit for non-implemented systems.
- Preserve YES/NO minimal philosophy (binary, one-question, low-clutter).
- Keep external sharing posture conservative unless explicitly changed.

## 2) Safe autonomous tasks
Allowed without additional approval when low-risk:
- documentation improvement and consistency fixes
- repository hygiene and link/reference cleanup
- runbook/process clarifications
- architecture validation notes
- test coverage extensions that do not alter runtime behavior

## 3) Tasks requiring human approval
Require explicit approval before execution:
- runtime code behavior changes
- dependency additions/upgrades outside approved scope
- architecture changes across core layers
- new subsystem implementation (including ORBIS runtime work)
- sharing-scope expansion (public/external posture changes)
- destructive cleanup beyond trivial/recoverable edits

## 4) Working method
1. Audit current state.
2. Propose bounded plan.
3. Execute smallest safe slice.
4. Validate relevant tests/command paths.
5. Report exactly what changed and why.

## 5) Scope safety checklist (before execution)
- Is it documentation-only or low-risk maintenance?
- Does it preserve YES/NO product philosophy?
- Does it avoid concept-to-implementation misrepresentation?
- Does it avoid new dependencies and runtime drift?
- Is PR-based review path preserved?
