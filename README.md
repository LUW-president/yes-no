> **Prototype / Non-Production Notice:** YES/NO is currently a live prototype for validation and iteration.

# YES/NO

## PROJECT OVERVIEW
YES/NO is a radically simple AI interface where the system asks questions and the user answers only YES or NO. The goal is to replace complex prompts and menus with guided binary decisions.

## CORE CONCEPT
- one question at a time
- binary input only (YES / NO)
- no prompt interface
- minimal black-screen UI
- calm pacing and intentional silence

**“The questions are the product.”**

## ARCHITECTURE OVERVIEW
User Interface  
↓  
Mobile / Web Adapters  
↓  
Reference Bridge  
↓  
Session Orchestrator  
↓  
Core Engines

- protocol engine
- question engine
- memory engine

## REPOSITORY STRUCTURE
- `docs/` – specifications and product documentation
- `engine/` – core system engines
- `apps/` – reference apps and CLI tools
- `adapters/` – client adapters
- `bridge/` – API bridge layer
- `ops/` – operational tooling and runbooks

## HOW TO RUN THE SYSTEM
- `yesno run` — run the interactive CLI session flow
- `yesno harness` — run the UX harness for deterministic interaction validation
- `yesno demo` — run the deterministic no-input demo session
- `yesno status` — print the internal status dashboard (baseline/components/commands/tests)
- `yesno trace --session <session_id> | --demo` — print deterministic protocol event trace for debugging
- `yesno confidence --session <session_id>` — print deterministic confidence timeline (prototype, non-production)
- `yesno explain --session <session_id>` — explain confidence reasons from deterministic reason codes (prototype, non-production)
- `yesno guard --session <session_id>` — evaluate deterministic guard rules over confidence timeline (prototype, non-production)
- `yesno gate --session <session_id>` — evaluate deterministic decision gate result from confidence + guard signals (prototype, non-production)
- `yesno v1 [--answers yes,no,...] [--user <user_id>] [--pack <pack_id>]` — run one end-to-end deterministic session and print final decision summary (prototype, non-production)

## CURRENT BASELINE
- core engine architecture complete
- reference bridge implemented
- mobile and web adapters available
- reference apps implemented
- gesture specification defined
- interaction timing specification defined
- mobile prototype plan defined

## PRODUCT DOCUMENTS
- `docs/product/product-one-pager-v0.md`
- `docs/product/product-deck-outline-v0.md`
- `docs/specs/native-mobile-ui-spec-v0.md`
- `docs/specs/gesture-input-spec-v0.md`
- `docs/specs/interaction-timing-spec-v0.md`

## CONTRIBUTION GUIDELINES
- follow repository specs
- keep the system simple
- respect product philosophy
- open issues before large architectural changes

## CONSTRAINTS
- documentation-only update
- keep README concise
- reflect actual repo state only

## Exploratory Concepts
- `docs/concepts/README.md`

## Ops Checklists
- `docs/ops/v1-prototype-stability-checklist-v0.md`

## V1 Operations
- `docs/ops/v1-weekly-usage-loop-v0.md`
- `ops/reports/v1-weekly-metrics-template.md`

## V1 Governance
- `docs/product/v1-decision-lock-v0.md`
- `docs/agent/v1-drift-audit-v0.md`

## MVP Governance
- `docs/release/mvp-complete-checklist-v1.md`


## YES/NO Principle
The system does not decide for you.
It learns how you decide.

People often already know the answer,
but the signal is buried under noise.

## Architecture Canon
- `docs/architecture/layered-system-model-v1.md`
- `docs/product/yes-no-philosophy-v1.md`

## Product Logic Canon
- `docs/product/product-logic-canon-v1.md`

## SJ86 Canon
- `docs/product/yes-no-by-sj86-product-logic-v1.md`


## Open Source Readiness
- `CONTRIBUTING.md`
- `CODE_OF_CONDUCT.md`
- `SECURITY.md`
- `.github/ISSUE_TEMPLATE/*`
- `.github/PULL_REQUEST_TEMPLATE.md`

## Start Contributing
Start here:
- 10-minute path: `docs/ops/contributor-quickstart-10min.md`
- Contribution policy: `CONTRIBUTING.md`
- PR checklist: `.github/PULL_REQUEST_TEMPLATE.md`

New contributors can start with these issues:
- [#125 Onboarding copy clarity for first-time users (web-v1)](https://github.com/LUW-president/yes-no/issues/125)
- [#126 Validation summary: add start-hesitation metric](https://github.com/LUW-president/yes-no/issues/126)
- [#127 Summary readability polish for non-technical users](https://github.com/LUW-president/yes-no/issues/127)
- [#128 Contributor quickstart: 10-minute path](https://github.com/LUW-president/yes-no/issues/128)
- [#129 Expand web-v1 smoke tests for onboarding/start flow](https://github.com/LUW-president/yes-no/issues/129)

## Governance
- `docs/agent/philosophy-reflected-code-policy-v1.md`


## Testing
- Run all core checks: `npm run test:all`

## Validation Ops
- `docs/ops/hybrid-validation-loop-v1.md`
