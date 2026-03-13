# Black Glass Covenant — Gesture Architecture v1

## 1. Experiential Principle
question → gesture → answer → clarity

## 2. Gesture Covenant
- Circle = YES
- Cross = NO
- Any other input = UNKNOWN (retry only)

## 3. System Boundary
Gesture layer = pure input adapter only
(no state, no business logic, no side effects)

## 4. Event Flow
pointerdown
→ trace capture
→ normalize
→ classify
→ 'yes' | 'no'
→ decision engine

## 5. Safety Invariants
- UNKNOWN → retry prompt only (never submit)
- Decision engine receives only 'yes' or 'no'
- Gesture layer cannot mutate engine state
- Debug fallback controls preserved behind flag
