# engine/session-orchestrator

## Orchestrator role
Coordinate the deterministic YES/NO session loop across protocol, question engine, and memory engine.

## Session lifecycle
- start session
- present first question
- record answer
- resolve next state (question / artifact / end)
- close session when terminal

## Engine interaction
- Protocol: emits validated lifecycle events
- Question engine: resolves deterministic transitions
- Memory engine: updates confidence signals from recorded/proposed events
