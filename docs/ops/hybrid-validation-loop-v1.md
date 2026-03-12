# Hybrid Validation Loop v1

Purpose: keep YES/NO moving without blocking on additional human sessions.

Validation model each cycle:
1. Synthetic batch (primary signal)
2. Existing real sessions (supplemental signal)
3. CI + runtime health checks

## Commands

```bash
npm run validation:synthetic -- --count 1000 --out ops/validation/synthetic-sessions.jsonl
npm run validation:summary -- ops/validation/synthetic-sessions.jsonl
npm run validation:summary -- ops/validation/external-user-sessions.jsonl
npm run test:all
npm run nurse:live-health-round
```

## Decision guidance

Proceed with improvements when:
- synthetic completion >= 95%
- synthetic start success >= 95%
- CI core tests green
- runtime health pass

Improvement priority order:
1. onboarding clarity
2. session start confidence
3. summary readability
4. deploy stability
5. documentation clarity

## Scope guardrails
- Single-session model only
- No continuous questioning
- No behavioral action triggers
- No core decision-engine changes unless stability-critical

## Reporting block
Use this format every cycle:
- DONE
- BLOCKED
- NEXT
- SYSTEM STATUS
