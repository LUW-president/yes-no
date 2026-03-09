# session-orchestrator-v0

## responsibility of orchestrator
Coordinate a deterministic execution loop across protocol, question engine, and memory engine for one active session.

## session lifecycle
1. session start
2. question presented
3. answer recorded
4. memory update
5. next question/artifact/end decision
6. session closed

## event flow
- Emit `question.presented`
- Ingest `answer.recorded`
- Emit optional `artifact.proposed`
- Emit `artifact.accepted` / `artifact.rejected` when applicable
- Emit `session.closed` on terminal state

## integration points with protocol
- Use protocol validators for all emitted events
- Persist/append events through protocol event store interface

## integration with question engine
- Load active content pack
- Resolve first question
- Resolve next transition from deterministic yes/no answer

## integration with memory engine
- Build/update profile from each ingested protocol event
- Read signal confidence for branch prioritization hooks (future-safe)

## minimal API surface
- `startSession({ session_id, user_id, pack_path })`
- `getCurrentQuestion(session_id)`
- `recordAnswer({ session_id, question_id, answer })`
- `getSessionState(session_id)`
- `closeSession(session_id, reason)`
