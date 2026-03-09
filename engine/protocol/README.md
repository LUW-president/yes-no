# engine/protocol

## Purpose
Provide the foundational YES/NO event contract and validation layer.

## Event lifecycle
1. `question.presented`
2. `answer.recorded`
3. `artifact.proposed`
4. `artifact.accepted` or `artifact.rejected`
5. `session.closed`

## Integration direction
- Question engine reads protocol events to choose the next deterministic question.
- Memory engine consumes protocol events to update confidence/profile state.

## Current state
- Strict event typing
- Runtime validation
- In-memory event store for protocol testing
