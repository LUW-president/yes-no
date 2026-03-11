# Gesture Input System Specification v0

## Purpose
Define the gesture-based interaction layer for YES/NO so future mobile implementations can support natural, minimal input.

## Gesture Philosophy
Gestures must preserve core YES/NO product principles:
- radical simplicity
- binary interaction
- intuitive motion
- minimal visual feedback
- no gesture menus or complexity

## Gesture Set (v0)
Canonical gestures:

YES  
Circle gesture ⭕️

NO  
Cross gesture ❌

These gestures must map to the same engine input values:
- yes
- no

## Gesture Detection Model
Expected gesture characteristics:

Circle
- continuous circular motion
- closed loop
- clockwise or counterclockwise accepted

Cross
- two diagonal strokes
- intersecting center point

Tolerance rules should prioritize usability over precision.

## Visual Feedback
When gesture begins:
- faint glowing trace follows finger
- line fades after completion

System then resolves gesture into:
- YES or NO

## Fallback Input
If gestures fail or are disabled, fallback inputs remain:
- tap YES
- tap NO

## Engine Integration
Interaction flow:

Gesture → Mobile UI → Mobile Adapter → Bridge → Session Orchestrator

Gestures must resolve only to:
- yes
- no

No additional signals allowed.

## Future Extensions (Not in v0)
Documented for later phases only:
- voice yes/no
- Apple Pencil gesture input
- Apple Vision spatial gestures
- accessibility gesture alternatives

## Visual References
Reference assets in:
- `docs/specs/assets/`

These remain non-binding examples.

## Constraints
- specification only
- no SDKs or libraries referenced
- platform-neutral
- must preserve product philosophy


## Cross-reference
- `docs/architecture/layered-system-model-v1.md`
- `docs/product/yes-no-philosophy-v1.md`
