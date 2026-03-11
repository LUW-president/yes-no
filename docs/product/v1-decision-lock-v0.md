# V1 Decision Lock v0 (Noah Lead Mode)

Status: **Active**
Posture: **Prototype / Non-Production**

## Purpose
Lock V1 product decisions to prevent scope drift and keep delivery deterministic.

## Locked V1 priorities
1. Deterministic decision flow quality
2. Stability and repeatability
3. Mobile wrapper progression on existing engine
4. Privacy-first operation and clear prototype labeling

## In-scope (V1)
- Start/continue/complete yes-no decision sessions
- Final summary block:
  - confidence
  - explanation
  - guard
  - gate
  - follow-up recommendation
- CLI-first + mobile wrapper iteration
- Deterministic testing and E2E stability checks

## Deferred (Post-V1 unless blocker)
- New analytical engine modules
- Social/sharing exports
- Production release hardening
- Non-essential architecture expansion

## Guardrails
- No core engine expansion without explicit approval
- No dependency additions without explicit approval
- All changes via branch -> PR -> review
- Keep prototype/non-production language in UX/docs

## Decision quality policy
- Use existing confidence/explain/guard/gate/improve outputs
- Improvements should focus on usability and clarity before capability expansion

## Delivery policy
- Small PR slices
- Mandatory deterministic tests for changed scope
- Merge only after stability checks pass

## Current cycle objective
Deliver a stable, usable V1 wrapper and collect controlled usage signals.
