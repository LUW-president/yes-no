# UX Harness v0

## How to run
```bash
npx tsx apps/ux-harness/index.ts harness --user test_user --pack creation_v0
```

## What it simulates
A black-screen style console YES/NO experience:
- one question at a time
- yes/no-only interaction
- artifact proposal handling
- session completion

## Engine connections
The harness uses existing engines:
- protocol
- question engine
- memory engine
- session orchestrator
