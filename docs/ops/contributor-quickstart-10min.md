# Contributor Quickstart (10 Minutes)

> Prototype / non-production repo.

This path is for first-time contributors shipping a small docs/UI PR quickly and safely.

## 1) Setup (2 minutes)
```bash
git clone https://github.com/LUW-president/yes-no.git
cd yes-no
npm install
```

## 2) Create a branch (1 minute)
```bash
git checkout -b docs/<short-change-name>
```

Example:
```bash
git checkout -b docs/readme-onboarding-copy
```

## 3) Make a focused change (3 minutes)
- Keep scope small (single issue)
- Preserve deterministic behavior
- Keep prototype/non-production framing clear
- Do not change core decision logic without approval (`CONTRIBUTING.md`)

## 4) Run required check (2 minutes)
For docs/UI contribution examples, run web smoke:
```bash
npm run test:web-v1-smoke
```

If your change includes runtime/code changes, run full gate:
```bash
npm run test:all
```

## 5) Commit, push, open PR (2 minutes)
```bash
git add -A
git commit -m "docs: <what changed>"
git push -u origin docs/<short-change-name>
```

Open PR:
```bash
gh pr create --fill
```

Then complete the PR template checkboxes:
- `.github/PULL_REQUEST_TEMPLATE.md`
- Confirm philosophy + deterministic behavior preserved
- Include test evidence (`test:web-v1-smoke` or `test:all`)

## PR Flow Checklist
1. Link issue (example: `Closes #128`)
2. Keep PR narrowly scoped
3. Include validation command + output summary
4. Wait for CI and review
5. Merge only after checks pass

## Governance references
- `CONTRIBUTING.md`
- `docs/agent/philosophy-reflected-code-policy-v1.md`
- `README.md` (prototype context)
