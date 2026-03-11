# V1 Weekly Usage Loop v0

Purpose: keep V1 improvements signal-driven without expanding core logic.

## Cadence
- 5-10 controlled sessions per week
- 1 weekly report using `ops/reports/v1-weekly-metrics-template.md`

## Required metrics
1. completion rate
2. average final confidence
3. gate distribution (GO/REVIEW/NO_GO)

## Rule
- If completion rate drops week-over-week, prioritize UX clarity fixes.
- If REVIEW/NO_GO rises above 40%, review question wording and follow-up suggestions.
- Do not add new analytical modules unless repeated signals persist for 2+ weeks.

## Data handling
- local only
- no external telemetry required
- no persistence architecture change required in this phase

Status: prototype / non-production.
