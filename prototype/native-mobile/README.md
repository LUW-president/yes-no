# Native Mobile Prototype v0 (Gesture Prototype Enabled)

## Purpose
Runnable native-style YES/NO prototype with controlled gesture recognition prototype support (circle/cross), while preserving deterministic tap fallback.

## Demo behavior
- one-question-at-a-time screen flow
- deterministic progression to artifact/completion
- supported gesture inputs:
  - `circle` (or `c`) -> YES
  - `cross` (or `x`) -> NO
- tap inputs remain default and reliable: `yes/no` (`y/n`)

## Files
- `app.ts` — prototype lifecycle driver and input routing
- `session.ts` — deterministic state transitions
- `bridge/client.ts` — bridge API client with defensive error messaging
- `input/gestureRecognition.ts` — prototype gesture recognition heuristics
- `input/gestureStub.ts` — sample stroke paths + compatibility helpers
- `input/tapInput.ts` — strict tap normalization (`yes`/`no`)
- `screens/*` — stable question/artifact/completion rendering
- `__tests__/gestureRecognition.test.ts` — gesture detection tests
- `__tests__/nativeMobilePrototype.test.ts` — lifecycle + stability tests

## Run locally
```bash
npm run bridge:dev
npm run prototype:native
```

## Prototype limitations
- gesture recognition is prototype-level heuristic, not production-grade
- no notifications/account system
- no production persistence/deployment
- local/internal demo environment orientation
