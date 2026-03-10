# Test Baseline Runbook (Baseline v0)

## Goal
Verify release baseline integrity before internal demos or merges.

## Full repository suite
Run from repo root:
```bash
npm run test:protocol
npm run test:question
npm run test:memory
npm run test:orchestrator
npm run test:cli
npm run test:ux
npm run test:cli-dispatch
npm run test:demo
npm run test:bridge
npm run test:adapters:mobile
npm run test:adapters:web
npm run test:mobile-reference
npm run test:web-reference
```

## Expected passing modules
- Engine: protocol, question, memory, orchestrator
- CLI: cli runner, ux harness, cli dispatch, demo
- Bridge: reference bridge
- Adapters: mobile adapter, web adapter
- Reference apps: mobile reference app, web reference app

## Baseline integrity gate before demos
Baseline is considered valid only if:
1. all commands above pass,
2. no regressions in deterministic paths,
3. no integration break between adapters and bridge contracts.
