# Gesture Input Binary v1 (Plan)

Status: Planning only (no implementation in this cycle)

## 1) Goal
Reduce first-run input friction for binary decisions by allowing direct gesture input:
- circle -> yes
- cross -> no

## 2) YES/NO Philosophy Alignment (SJ86-aware)
This plan preserves the YES/NO project philosophy constraints currently enforced in repository governance:
- deterministic behavior
- explainable decision flow
- minimal complexity
- safe, reversible rollout
- no ML inference in core decision path

> Note: incorporate explicit "SJ86" wording once provided verbatim by operator to ensure exact fidelity.

## 3) Scope (Phase 1)
- Web-v1 prototype layer only
- Optional input mode; YES/NO buttons remain primary fallback
- No engine logic changes
- No persistence/schema changes

## 4) Input Model
- Gesture area captures stroke path
- Deterministic classifier maps shape to one of:
  - YES (circle)
  - NO (cross)
  - UNKNOWN
- UNKNOWN never auto-submits

## 5) Safety & UX Rules
- Show detected gesture label before submit (brief confirmation)
- User can cancel detection
- Undo remains available
- Buttons always available as fallback

## 6) Deterministic Technical Options
### Option A: Heuristic stroke metrics
- circle detection from closure ratio + curvature continuity
- cross detection from 2-stroke intersection pattern

### Option B: Template path matching
- normalize stroke path
- compare against fixed templates with deterministic thresholds

Both options avoid ML and external services.

## 7) Validation Plan
Internal acceptance targets (prototype):
- clean-stroke accuracy >= 85%
- recognition latency < 200ms on common mobile browsers
- false-positive rate low enough to keep fallback usage under 20%

User validation:
- 5-session mini pilot
- collect:
  - detection success
  - correction rate
  - perceived clarity

## 8) Risks
- false positives from noisy strokes
- device/browser pointer variance
- accidental gesture submission pressure

Mitigations:
- conservative thresholds
- UNKNOWN state + explicit fallback
- no hidden submission on ambiguous detection

## 9) Rollout Strategy
1. Docs/spec approval
2. Internal prototype behind feature flag
3. Controlled validation sessions
4. Keep tap/button path as default unless gesture passes thresholds

## 10) Out of Scope (this cycle)
- Core engine algorithm changes
- Production default gesture mode
- ML-based gesture recognition
