# Interaction Timing Specification v0

## Purpose
Timing is a core UX component of the YES/NO system.

The goal is to create a rhythm that feels thoughtful and deliberate rather than fast and reactive.

## Timing Philosophy
Guiding principles:
- slower is better than rushed
- silence is intentional
- one interaction at a time
- avoid rapid-fire questions
- the system should feel reflective

## Question Pacing Model
Baseline rule:

Answer received → short pause → next question appears.

Recommended timing:
- gesture recognition: immediate
- reflection pause: ~600ms
- next question render: after pause

Total pacing target:
~600–900ms between interactions.

## Gesture Recognition Window
Circle / Cross gesture detection window:
- Minimum: 200ms
- Maximum: 2000ms

Gestures outside this window are rejected and require retry.

## Artifact Reveal Timing
When artifact is proposed:

Sequence:
1. Answer accepted
2. Pause
3. Artifact title appears
4. Pause
5. Artifact prompt appears

Suggested timing:
- Pause 1: 600ms
- Pause 2: 400ms

## Session Completion Timing
When session completes:

Sequence:
1. Final answer received
2. Pause
3. “SESSION COMPLETE” appears

Pause suggestion:
~800ms before completion message.

## Silence as UX Element
Silent pauses are intentional and should never be replaced with loading indicators or animations.

- No progress bars.
- No spinning loaders.

Silence communicates reflection.

## Fallback Timing
If network or engine delay exceeds expected timing:

UI should wait silently up to:
- 3 seconds

If exceeded, display minimal fallback message:
- “Thinking…”

## Engine Integration
Timing flow:

User Gesture  
↓  
Mobile UI  
↓  
Adapter  
↓  
Bridge  
↓  
Session Orchestrator  
↓  
Next Question

Timing delays occur only in the UI layer.

## Constraints
- specification only
- no implementation code
- platform-neutral timing rules
- preserve product philosophy
