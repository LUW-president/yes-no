# Gesture Recognition Plan v1 — YES/NO

## purpose
Define the first real implementation plan for circle/cross gesture recognition in the YES/NO native mobile prototype.

## scope
Included:
- implement circle/cross gesture detection path in prototype context
- map recognized gestures strictly to yes/no answers
- keep tap fallback always available

Excluded:
- production-grade gesture ML stack
- non-binary gesture vocabulary
- cross-platform parity guarantees in v1

## supported gestures
- Circle gesture → YES
- Cross gesture → NO

## gesture detection approach
- collect touch path points during gesture window
- preprocess path (smoothing + normalization)
- classify using rule-based shape heuristics:
  - circle: closed loop continuity
  - cross: two intersecting diagonal strokes
- apply confidence thresholds with usability-oriented tolerance

## normalization to yes/no
- recognized circle returns `yes`
- recognized cross returns `no`
- no other output values are allowed

## fallback behavior
- if gesture recognition fails or times out, preserve tap YES/NO path
- show concise retry guidance without breaking flow
- never block session progression due to gesture failure

## UI feedback rules
- faint trace follows gesture path
- trace fades after classification
- concise resolved feedback: YES or NO
- avoid noisy animations/loaders

## prototype integration points
- `prototype/native-mobile/input/gestureStub.ts` evolves into gesture module entry
- `prototype/native-mobile/app.ts` input loop routes gesture outputs
- session lifecycle remains in `prototype/native-mobile/session.ts`
- bridge submission unchanged (`yes`/`no` only)

## testing plan
- unit tests for classifier heuristics (circle/cross/noise)
- deterministic replay tests with recorded gesture paths
- fallback behavior tests (timeout/failure -> tap path)
- regression tests for full prototype lifecycle with gesture answers

## rollout constraints
- keep architecture unchanged
- no new product features beyond gesture recognition
- maintain deterministic behavior for canonical demo path
- preserve explicit prototype limitations in docs

## success criteria
- circle and cross gestures reliably map to yes/no in prototype runs
- tap fallback remains reliable
- demo flow remains stable through artifact and completion states
- no regression in existing repository test suite
