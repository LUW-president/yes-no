# TypeScript Strictness Ramp Plan v0

## goal
Increase TypeScript safety in small, reversible phases without broad refactors or runtime behavior changes.

## current baseline
`tsconfig.json` currently uses:
- `strict: false`
- broad include across app/engine/adapters/prototype paths

## constraints
- docs/spec-first progression
- smallest safe changes only
- no core-logic behavior changes
- each phase must have a rollback path
- only advance when CI/tests are green

## execution model
For every phase:
1. apply one config change (or one tightly scoped exception policy)
2. run mandatory tests (`npm run test:all`)
3. if green, keep and monitor
4. if red, rollback that phase only

---

## phase 0 (this PR): planning + zero-risk guardrail
### change
- add this plan document
- enable `forceConsistentCasingInFileNames: true`

### why this flag first
- low-risk, compile-time only
- catches import-path casing drift across OS/filesystems
- typically zero runtime impact and low remediation scope

### expected impact
- likely no code edits needed unless casing mismatch exists
- prevents future platform-specific path bugs

### rollback
- remove `forceConsistentCasingInFileNames` from `tsconfig.json`

---

## phase 1: null/undefined safety foundation
### candidate flags
- `noImplicitReturns: true`
- `noFallthroughCasesInSwitch: true`

### expected impact
- surfaces missing return branches and accidental switch fallthrough
- moderate fix volume, mostly local control-flow cleanup

### rollback
- disable the specific flag(s) if noise is too high

---

## phase 2: any/typing hygiene
### candidate flags
- `noImplicitAny: true`
- `noImplicitThis: true`

### expected impact
- largest signal increase on older boundaries and helper functions
- likely requires focused type annotations in adapters/prototype edges

### rollout tactic
- fix by directory in slices (`apps/` → `engine/` → `adapters/`)
- avoid cross-repo refactors in one PR

### rollback
- revert only the recently enabled flag

---

## phase 3: full strict mode with scoped exceptions
### target
- set `strict: true`

### prerequisite
- phase 1 and 2 complete and stable

### expected impact
- enables strict family checks (`strictNullChecks`, etc.)
- may require targeted narrowing/guards on uncertain data boundaries

### exception strategy (temporary)
- allow narrow, documented `// @ts-expect-error` only with issue link
- remove exceptions incrementally in follow-up PRs

### rollback
- revert to previous phase config if churn exceeds threshold

---

## success criteria
- no runtime behavior regressions
- tests remain green at each phase
- each phase merged independently and reversible
- error count decreases monotonically between phases

## PR checklist template for each strictness phase
- [ ] one strictness increment only
- [ ] no unrelated refactor
- [ ] `npm run test:all` passed
- [ ] rollback note included in PR description
- [ ] follow-up issue created for remaining diagnostics (if any)
