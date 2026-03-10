# reference-app-bridge-v0

## purpose
Provide a minimal bridge layer allowing mobile/web reference apps to drive deterministic YES/NO sessions through the orchestrator.

## bridge responsibilities
- expose session lifecycle operations as app-facing functions/endpoints
- normalize app input/output payloads
- keep orchestrator as single source of truth for transitions

## API surface
- `startSession(user_id, pack_id)`
- `submitAnswer(session_id, answer)`
- `getSessionState(session_id)`
- `getSessionEvents(session_id)`

## session start endpoint
- input: `user_id`, `pack_id`
- output: `session_id`, `status`, `question_text`, `current_question_id`

## answer submission endpoint
- input: `session_id`, `answer (yes|no)`
- output variants:
  - next question
  - artifact proposed
  - session complete

## event/state retrieval
- fetch current session state
- fetch protocol event trace for rendering/debug

## integration with orchestrator
- delegate all state transitions to `engine/session-orchestrator`
- do not duplicate transition or memory logic in bridge layer

## future mobile/web usage
- mobile/web clients call bridge methods for each user interaction
- UI remains thin: render question, capture yes/no, display result
