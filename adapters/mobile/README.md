# Mobile Adapter v0

## Purpose
Provide a minimal mobile-facing client wrapper around the Reference App Bridge API.

## Endpoints used
- POST /session/start
- POST /session/answer
- GET /session/:session_id

## Example usage
```ts
const adapter = new MobileAdapter();
const started = await adapter.startSession('u1', 'creation_v0');
const next = await adapter.submitAnswer(started.session_id, 'yes');
const state = await adapter.getSessionState(started.session_id);
```

## UI integration
A mobile UI layer calls adapter methods and renders `question`, `artifact`, and `status` outputs.
