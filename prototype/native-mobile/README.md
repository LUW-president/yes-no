# Native Mobile Prototype v0 (Refined)

## Purpose
Runnable native-style prototype for YES/NO demos with improved transition consistency and lightweight bridge error handling.

## Intended demo usage
Use this prototype for controlled internal and limited external walkthroughs of the canonical flow:
- question progression
- artifact proposal (`artifact_film` path)
- completion state

## Files
- `app.ts` — prototype lifecycle driver and input loop
- `session.ts` — deterministic state transitions
- `bridge/client.ts` — bridge API client with minimal defensive errors
- `screens/*` — stable question/artifact/completion screen rendering
- `input/tapInput.ts` — strict tap normalization (`yes`/`no`)
- `input/gestureStub.ts` — non-production gesture stub mappings
- `__tests__/nativeMobilePrototype.test.ts` — deterministic lifecycle and failure-path tests

## Run locally
```bash
npm run bridge:dev
npm run prototype:native
```

## Refined behavior
- clearer screen distinction across transitions
- stable one-question-at-a-time rendering
- predictable invalid-input handling
- explicit bridge failure messages for start/answer/state issues

## Limitations (still in place)
- no real gesture recognition (stub only)
- no notifications/account system
- no production persistence/deployment
- local/internal demo environment orientation
