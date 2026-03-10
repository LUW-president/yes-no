# Web Adapter v0

## Purpose
Provide a minimal web-facing client wrapper around the Reference App Bridge API.

## Endpoints used
- POST /session/start
- POST /session/answer
- GET /session/:session_id

## Example usage
```ts
const adapter = new WebAdapter();
const started = await adapter.startSession('u1', 'creation_v0');
const next = await adapter.submitAnswer(started.session_id, 'yes');
const state = await adapter.getSessionState(started.session_id);
```

## UI integration
A web UI layer calls adapter methods and renders normalized adapter outputs.
