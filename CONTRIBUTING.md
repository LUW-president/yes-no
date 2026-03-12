# Contributing to YES/NO

Thanks for contributing to YES/NO (prototype / non-production).

## Scope and philosophy
- Binary-first, deterministic behavior
- Explainable outcomes
- Small safe PRs
- No ML additions in core decision path without explicit approval

## Contribution lanes
1. UX clarity and onboarding
2. Validation tooling and operator flows
3. Test reliability and CI
4. Documentation and runbooks

## Ground rules
- Keep PRs focused and small
- Include rationale and test evidence
- Do not introduce unnecessary dependencies
- Do not change core decision logic without approval

## 10-minute contributor path
Use: `docs/ops/contributor-quickstart-10min.md`

## Local checks
Run before PR:
- `npm run test:all`

Or run individually:
- `npm run test:v1-summary`
- `npm run test:v1-cli`
- `npm run test:v1-e2e`
- `npm run test:orchestrator`
- `npm run test:web-v1-smoke` (if web touched)
