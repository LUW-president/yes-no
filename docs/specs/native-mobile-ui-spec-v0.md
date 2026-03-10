# Native Mobile UI Specification v0

## Purpose
This document defines the canonical native mobile interface for the YES/NO system, aligned with the product philosophy and current engine baseline.

## Product Philosophy Constraints
The mobile UI must preserve the following constraints:
- radical simplicity
- one question at a time
- binary interaction only
- no prompt interface
- no menus or complex navigation
- black screen aesthetic
- silence and timing are part of the experience

## Screen Model
The v0 interface contains exactly three screens:
1. Question Screen
2. Artifact Proposal Screen
3. Session Complete Screen

No additional screens should exist in v0.

## Black-Screen Visual Rules
- background: pure black
- typography: minimal, centered
- question text large and readable
- no decorative UI elements
- no visible navigation controls

## One-Question Display Model
Question screen structure:

CENTER AREA  
Question text

BOTTOM AREA  
Two interaction zones:

YES  
NO

Only one question is visible at a time.

## YES / NO Interaction Model
Input models:

Primary:  
Tap YES / NO buttons

Future:  
gesture-based circle / cross input

Both must normalize to:
- yes
- no

## Artifact Display Model
When an artifact is proposed, display:

ARTIFACT  
<artifact_type>

Prompt:

Accept this artifact?

YES / NO

## Session Completion Model
When the session ends, display:

SESSION COMPLETE

Optional message:

Would you like to create something else?

YES / NO

## Future Gesture Input
Future gesture system mapping:
- Circle gesture → YES
- Cross gesture → NO

These gestures must map to the same engine inputs.

## Engine Integration
Integration chain:

Mobile UI → Mobile Adapter → Bridge → Session Orchestrator → Engines

## Constraints
- specification only
- no UI frameworks referenced
- must remain platform-neutral
- must preserve product philosophy
