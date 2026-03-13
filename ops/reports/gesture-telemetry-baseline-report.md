# Gesture Telemetry Baseline Report (v0)

## Objective
Establish an initial baseline for gesture input quality so future runs can detect recognition regressions quickly.

## Data Source
- Runtime event log: `ops/telemetry/runtime-events.log`
- Rollup tool: `ops/telemetry/gesture-rollup.ts`

## Runbook Command
```bash
npm run telemetry:gesture -- ops/telemetry/runtime-events.log
```

## Baseline Snapshot
> Status: waiting for first captured runtime gesture log in `ops/telemetry/runtime-events.log`.

| Metric | Baseline | Notes |
| --- | --- | --- |
| `gesture_detected_yes` | TBD | Raw event count |
| `gesture_detected_no` | TBD | Raw event count |
| `gesture_unknown_retry` | TBD | Raw event count |
| `gesture_submitted` | TBD | Raw event count |
| `yesRate` | TBD | YES share among detected yes/no |
| `noRate` | TBD | NO share among detected yes/no |
| `retryRate` | TBD | Unknown retries share of all gesture outcomes |

## Interpretation Guidance
- Main reliability signal: `retryRate`.
- Baseline is considered stable when `retryRate` remains flat or decreases across at least 3 consecutive runs.
- Investigate classifier or UX changes if `retryRate` increases versus baseline.
