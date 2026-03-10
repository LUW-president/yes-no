# YES/NO -> ORBIS Handoff Model v0 (Concept)

## Purpose of the handoff model
Define a future conceptual separation of responsibilities between:
- YES/NO (conversational decision layer)
- ORBIS (spatial orientation layer)

This document clarifies boundaries; it is not an implementation claim.

## YES/NO role (conversation / decision)
YES/NO remains:
- minimal conversational interface
- one-question-at-a-time decision guide
- binary interaction contract

YES/NO handles intent clarification and decision narrowing.

## ORBIS role (spatial orientation)
ORBIS would handle:
- directional aiming interaction
- spatial lock experiences
- orientation-centric feedback

ORBIS is positioned as a spatial interaction layer, not a conversational one.

## Example interaction flow
Conceptual sequence:
1. User clarifies intent with YES/NO.
2. YES/NO identifies that spatial interaction is relevant.
3. User receives explicit handoff request.
4. On consent, interaction moves to ORBIS mode.
5. ORBIS handles aiming/lock flow.
6. Optional summary returns to YES/NO context.

## Consent requirements
Before any handoff:
- explicit user confirmation
- clear statement of what ORBIS mode does
- clear option to decline and remain in YES/NO only

## Privacy rules
- no silent location mode switching
- no hidden background spatial tracking
- no automatic sharing on lock events
- user-visible controls for session start/end

## What YES/NO must never do directly
YES/NO should not directly:
- perform spatial lock interactions
- silently access continuous orientation/location workflows
- present conceptual ORBIS capabilities as current YES/NO features

## What ORBIS would handle
ORBIS would handle:
- directional target alignment
- lock interaction states
- spatial-session UX
- orientation-specific feedback rendering

Boundary principle:
YES/NO remains a minimal conversational interface; ORBIS would handle spatial interaction.
