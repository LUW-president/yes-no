# Native Mobile Prototype Plan v0

## Purpose
This document defines the first working mobile prototype of the YES/NO experience.

The prototype must demonstrate:
- one-question interaction
- YES / NO binary responses
- gesture and tap input
- integration with the existing system (bridge + adapters + orchestrator)

## Prototype Scope
Included:
- black-screen question interface
- YES / NO interaction
- tap input
- placeholder gesture input layer
- artifact proposal screen
- session completion screen
- connection to bridge API

Not included:
- account system
- push notifications
- production persistence
- analytics
- onboarding flows
- design polish

## Minimal Screen Architecture
1. Question Screen  
Displays the question and YES / NO interaction zones.

2. Artifact Screen  
Displays artifact proposal and accept/reject prompt.

3. Session Complete Screen  
Displays session completion message.

No additional screens.

## Input Model
Supported inputs:

Tap YES / NO (required)

Gesture input (optional prototype stub):
- Circle → YES
- Cross → NO

Gesture recognition can be simulated in the prototype.

## Bridge Communication Model
Request flow:

Mobile Prototype  
↓  
Mobile Adapter  
↓  
Reference Bridge  
↓  
Session Orchestrator  
↓  
Engines

Endpoints used:
- POST /session/start
- POST /session/answer
- GET /session/:session_id

## Session Lifecycle
Prototype session flow:

Start Session  
↓  
Display Question  
↓  
User Input (YES / NO)  
↓  
Send Answer  
↓  
Receive Next State

Possible states:
- Next Question
- Artifact Proposed
- Session Complete

## Artifact Display Model
When artifact is proposed, display:

ARTIFACT  
<artifact type>

Prompt:

Accept this artifact?

YES / NO

## Prototype Success Criteria
The prototype is successful if:
- a session can start
- questions display correctly
- YES / NO input works
- session progresses correctly
- artifact proposals display
- session completes

## Limitations
- no real gesture recognition yet
- console bridge environment
- minimal UI styling
- no production backend
- local testing only

## Next Iteration Milestones
- SwiftUI native implementation
- gesture recognition engine
- real mobile UI design pass
- notification system
- persistent user profile

## Constraints
- specification only
- no mobile SDKs referenced
- platform-neutral language
- preserve product philosophy
