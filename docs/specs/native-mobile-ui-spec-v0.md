# native-mobile-ui-spec-v0

## purpose
Define the first native mobile UI specification for the YES/NO experience, grounded in the implemented baseline and preserving core product philosophy.

## product philosophy constraints
- one question at a time
- binary interaction only (YES/NO)
- no prompt/chat input surface
- simplicity over feature breadth
- silence and timing remain part of UX design

## screen model
Primary screens/states:
1. Active Question Screen
2. Artifact Proposed Screen
3. Session Complete Screen

## black-screen visual rules
- default full black background
- high-contrast white typography
- minimal visual noise and no decorative components
- centered content blocks with generous spacing

## one-question display model
- render exactly one question at a time
- remove/replace prior question on transition
- no scrolling transcript in v0

## YES / NO interaction model
- two large primary actions: YES and NO
- equal visual weight for both actions
- deterministic mapping to adapter answer submission

## artifact display model
- when artifact is proposed, replace question with artifact state card
- show artifact type clearly (e.g., image/film)
- maintain binary interaction philosophy for follow-up actions in later phases

## session completion model
- terminal completion screen with concise confirmation
- no additional prompts in completion state
- optional restart action deferred to later phase

## future gesture input considerations
- map circle/affirmative gesture to YES
- map cross/negative gesture to NO
- gesture input must preserve strict binary contract

## integration points with mobile adapter and bridge
- UI calls `adapters/mobile/mobileAdapter.ts` only
- adapter consumes bridge API (`/session/start`, `/session/answer`, `/session/:session_id`)
- orchestrator remains source of truth for transitions
