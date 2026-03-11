# V1 Public Deployment Evidence v1

Date: 2026-03-11
Live URL: https://yes-no-kappa.vercel.app
Status: Prototype / Non-Production

## Deployment action
- Production deploy executed from current `main` via Vercel CLI.

## Validation checks performed
1. Root URL loads (`HTTP 200`)
2. First-run onboarding marker present (`Decision Topic`)
3. Session start endpoint returns `session_id`
4. Yes/No answer flow completes to terminal state
5. Summary endpoint returns required fields:
   - final_confidence
   - guard_status
   - gate_result
   - primary_reason
   - expected_effect
6. Summary meaning copy is present in UI
7. Session history panel is present (local-only behavior)
8. Mandatory test gate passes:
   - test:v1-summary
   - test:v1-cli
   - test:v1-e2e
   - test:orchestrator
   - test:web-v1-smoke

## Result snapshot
- first question: "Would you like to create something?"
- terminal sample: `artifact_image`
- sample summary: `GO / CONTINUE / confidence 0.71`

## Remaining risks
- Prototype UX may still contain minor friction for first-time users.
- No production auth/abuse protections in this prototype scope.

## Recommendation
GO for first public prototype sharing (with non-production disclaimer).
