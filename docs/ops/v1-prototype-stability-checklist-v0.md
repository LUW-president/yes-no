# V1 Prototype Stability Checklist v0

Status: **Prototype / Non-Production**

## Purpose
Define a deterministic pre-merge stability gate for the V1 CLI decision session wrapper.

## Required checks
1. `npm run test:v1-summary`
2. `npm run test:v1-cli`
3. `npm run test:v1-e2e`
4. `npm run test:orchestrator`

## Manual smoke checks
1. `npx tsx apps/cli/yesno.ts v1 --answers yes,yes,yes`
   - expected: artifact path + final summary
2. `npx tsx apps/cli/yesno.ts v1 --answers no`
   - expected: immediate completion + final summary
3. `npx tsx apps/cli/yesno.ts v1 --answers yes,no,yes`
   - expected: deterministic rule chain + gate result output

## Acceptance criteria
- Summary always includes:
  - final confidence
  - explanation block
  - guard status/findings
  - follow-up recommendation
  - gate result
- Output remains deterministic for fixed scripted answers.
- No persistence, dependency, or ML changes.
