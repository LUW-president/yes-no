# Reference App Bridge v0

## Purpose
Expose a minimal deterministic API for external clients (mobile/web) to drive YES/NO sessions.

## Endpoints
- `POST /session/start`
- `POST /session/answer`
- `GET /session/:session_id`

## Example curl
Start:
```bash
curl -s -X POST http://localhost:3000/session/start \
  -H 'Content-Type: application/json' \
  -d '{"user_id":"u1","pack_id":"creation_v0"}'
```

Answer:
```bash
curl -s -X POST http://localhost:3000/session/answer \
  -H 'Content-Type: application/json' \
  -d '{"session_id":"<id>","answer":"yes"}'
```

State:
```bash
curl -s http://localhost:3000/session/<id>
```

## Client interaction model
Mobile/web clients call start, submit answer, and state endpoints while keeping UI thin and deterministic.
