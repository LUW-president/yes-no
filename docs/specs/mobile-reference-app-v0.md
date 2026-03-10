# mobile-reference-app-v0

## purpose
Create the first minimal interactive YES/NO mobile interface using the mobile adapter to drive deterministic sessions.

## minimal UI structure
- full-screen black background
- single centered question block
- two large actions: YES / NO
- optional small status/footer line

## question display model
- render one question at a time
- replace previous question on each transition
- no multi-threaded chat history in v0

## YES / NO interaction model
- primary buttons: YES, NO
- strict binary input only
- ignore other input modes in v0

## session lifecycle
1. start session via adapter
2. render question
3. submit yes/no
4. render next question/artifact/end
5. show completion state

## adapter integration
- use `adapters/mobile/mobileAdapter.ts`
- methods:
  - `startSession`
  - `submitAnswer`
  - `getSessionState`

## artifact display path
- when `artifact` returned, show artifact card/type
- present accept/reject action in-app for next phase extension

## future gesture UI considerations
- map circle gesture -> yes
- map cross gesture -> no
- keep binary contract unchanged
