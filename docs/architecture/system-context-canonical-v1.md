# YES/NO System Context — Canonical v1

## Interaction invariant
question → gesture → answer → clarity

## Gesture covenant
- circle = YES
- cross = NO
- unknown = retry only
- unknown must never reach decision engine submission

## Session model
- single-session interaction only
- no continuous questioning
- no conversational history mode in this phase

## Protected boundaries
- no decision engine core logic changes without explicit approval
- deterministic behavior only
- no ML additions in current architecture

## Architecture stack
gesture canvas
↓
gesture classifier
↓
yes/no normalization
↓
decision engine
↓
decision summary/action

## Active phases
- Phase 5: Autonomous development (active)
- Phase 6: Experience design (initiated)
- Phase 7: Mobile app (future, approval-gated)

## Current engineering focus
1. gesture reliability improvements
2. retryRate reduction
3. classifier robustness
4. telemetry quality
5. deterministic test coverage
6. CI and repository hygiene

## Telemetry baseline events
- gesture_detected_yes
- gesture_detected_no
- gesture_unknown_retry
- gesture_submitted

Rollup metrics:
- yesRate
- noRate
- retryRate

## Runtime resilience note
A production runtime incident (FUNCTION_INVOCATION_FAILED) was resolved by correcting runtime import extensions in server path (.ts → .js), reinforcing deploy/runtime compatibility discipline.
