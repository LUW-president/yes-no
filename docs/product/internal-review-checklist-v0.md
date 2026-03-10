# Internal Review Checklist v0 — YES/NO

## purpose
Provide a simple internal checklist for reviewing the YES/NO prototype package before sharing it with collaborators, partners, or early investors.

## review scope
Review covers:
- product narrative clarity
- prototype execution readiness
- documentation completeness and consistency
- demo readiness and deterministic flow
- limitation transparency

## product narrative checks
- [ ] One-sentence thesis is clear and consistent across docs
- [ ] Core concept is preserved: one question, binary input, minimal interface
- [ ] “The questions are the product.” is reflected in narrative docs
- [ ] Current milestone and roadmap positioning are coherent

## prototype readiness checks
- [ ] Native prototype materials are present (`prototype/native-mobile/`)
- [ ] Prototype command(s) are documented and runnable
- [ ] Session lifecycle path is deterministic and reproducible
- [ ] Artifact path expectations are clearly documented

## documentation completeness checks
- [ ] Prototype package doc is up to date
- [ ] One-pager and deck outline reflect current baseline
- [ ] Specs (UI, gesture, timing, prototype plan) are linked and discoverable
- [ ] Runbook + walkthrough references are present and current

## demo readiness checks
- [ ] Demo startup sequence is explicit and tested
- [ ] Canonical answer path is documented (YES/YES/NO -> artifact)
- [ ] Expected screens are listed in correct order
- [ ] Presenter script is concise and aligned to prototype behavior

## limitation clarity checks
- [ ] Prototype-only status is explicit
- [ ] No production deployment claim appears
- [ ] Gesture implementation status is accurately labeled (stub/non-production)
- [ ] Local/internal usage constraints are clearly stated

## approval recommendation format
Use this format for internal sign-off:
- **Recommendation:** APPROVE / HOLD
- **Summary:** 1–3 sentence rationale
- **Blocking Issues:** bullet list (or `None`)
- **Required Fixes Before Share:** bullet list (or `None`)
- **Reviewer:** name + date
