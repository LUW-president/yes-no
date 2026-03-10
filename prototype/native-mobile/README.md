# Native Mobile Prototype v0

## Purpose
First runnable native-style prototype for YES/NO interaction flow using existing bridge contracts.

## Files
- `app.ts` — prototype entrypoint and lifecycle loop
- `session.ts` — session state transitions
- `bridge/client.ts` — minimal bridge API client
- `screens/*` — question/artifact/completion renderers
- `input/tapInput.ts` — tap normalization (`yes`/`no`)
- `input/gestureStub.ts` — gesture stubs (`circle`/`cross`)
- `__tests__/nativeMobilePrototype.test.ts` — deterministic lifecycle tests

## Run locally
```bash
npm run prototype:native
```

## Prototype limitations
- no real gesture recognition (stub only)
- no UI framework/native runtime yet
- no notifications/account system
- local/dev bridge environment only

## Relation to future native app
This prototype locks interaction/state behavior before full native implementation.
