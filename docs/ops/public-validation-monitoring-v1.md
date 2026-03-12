# Public Validation Monitoring v1

Track these signals per cycle:
- session starts
- completion rate
- median session time
- gate distribution (GO / REVIEW / NO_GO)
- hesitation rate

## Command sequence
```bash
npm run validation:synthetic -- --count 1000 --out ops/validation/synthetic-sessions.jsonl
npm run validation:summary -- ops/validation/synthetic-sessions.jsonl
npm run validation:summary -- ops/validation/external-user-sessions.jsonl
npm run nurse:live-health-round
npm run test:all
```

## Readiness interpretation
- Continue improvements when CI and runtime remain healthy and completion >= 95%
- Enter stability mode immediately on runtime/test regression
