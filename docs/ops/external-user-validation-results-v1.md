# External User Validation Results v1

Plan reference: `docs/ops/external-user-validation-plan-v1.md`
Live URL: https://yes-no-kappa.vercel.app
Status: In progress

## Operator packet
- Session template: `ops/validation/external-user-sessions.template.jsonl`
- Working file to fill: `ops/validation/external-user-sessions.jsonl`
- Metrics summarizer: `npm run validation:summary -- ops/validation/external-user-sessions.jsonl`

## Exact per-session fields
- sessionIndex (1..10)
- participantType (`first_time` | `repeat`)
- device (`mobile` | `desktop`)
- startSuccess (true/false)
- startHesitated (true/false)
- completed (true/false)
- summaryUnderstood (true/false)
- timeToCompleteSec (number)
- gateResult (`GO` | `REVIEW` | `NO_GO`)
- frictionNote (short text)

## Current completion (honest count)
- External-user sessions completed: 0/10
- Internal/proxy checks completed: 1 (live runtime E2E probe)

## Current metrics snapshot vs thresholds
- start success rate: N/A (threshold >= 90%)
- completion rate: N/A (threshold >= 80%)
- summary-understandable rate: N/A (threshold >= 80%)
- median time to completion: N/A
- gate mix: N/A

## Top friction points (current evidence)
(Updated after topic-first-question alignment: first question copy is now topic-neutral.)

1. First-run users may still hesitate before pressing Start Session.
2. Decision-topic requirement adds context but can block users if unclear.
3. Summary is more readable now, but comprehension still needs real-user confirmation.

## Minimum human input needed now
- Run 10 real sessions and fill `ops/validation/external-user-sessions.jsonl`.
- For each session, capture the 30-second interview answers from the validation plan.

## Recommendation
GO_TO_MORE_VALIDATION


## Operator kit
- `docs/ops/external-validation-moderator-guide-v1.md`
- `docs/ops/external-validation-invite-message-v1.md`
- `docs/ops/external-validation-interview-script-v1.md`
- `docs/ops/external-validation-session-checklist-v1.md`
- `docs/ops/external-validation-runbook-v1.md`
- `ops/validation/external-user-sessions.example.jsonl` (dummy/example only)
