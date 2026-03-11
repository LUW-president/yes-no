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


## V1 Prototype Stability
- `docs/ops/v1-prototype-stability-checklist-v0.md`

## Exploratory Concepts
- `docs/concepts/README.md`
