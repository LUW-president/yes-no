# web-reference-app-v0

## purpose
Create a minimal web-oriented reference interface that uses the web adapter to drive deterministic YES/NO sessions.

## minimal UI structure
- simple single-page reference shell
- centered question panel
- two clear actions: YES / NO
- lightweight status region for artifact/completion

## question display model
- display one active question at a time
- replace view state on each answer response
- keep v0 intentionally minimal without chat history

## YES / NO interaction model
- button-based binary interaction
- no free-text input in v0
- normalize clicks directly to yes/no adapter calls

## session lifecycle
1. start session
2. render first question
3. submit YES/NO
4. render next question or artifact
5. show completion state

## adapter integration
- use `adapters/web/webAdapter.ts`
- methods:
  - `startSession`
  - `submitAnswer`
  - `getSessionState`

## artifact display path
- when adapter returns `artifact`, show artifact panel
- show completion action/state after artifact acceptance path in later phase

## future browser UI considerations
- keyboard shortcuts for yes/no
- gesture/cursor interaction experiments
- responsive layout for mobile browser form factors
- event trace debug panel in development mode
