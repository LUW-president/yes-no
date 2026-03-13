# Gesture Telemetry Rollup

## Purpose
Summarize gesture runtime events into counts and rates.

Events expected in log input:
- `gesture_detected_yes`
- `gesture_detected_no`
- `gesture_unknown_retry`
- `gesture_submitted`

## Run
```bash
npm run telemetry:gesture -- ops/telemetry/runtime-events.log
```

If no path is provided, default input is:
- `ops/telemetry/runtime-events.log`

## Output fields
- `gesture_detected_yes`
- `gesture_detected_no`
- `gesture_unknown_retry`
- `gesture_submitted`
- `yesRate` (share of YES among detected yes/no)
- `noRate` (share of NO among detected yes/no)
- `retryRate` (share of unknown retries over all gesture outcomes)

## Interpretation
- Lower `retryRate` generally indicates better gesture recognition stability.
- Track `retryRate` trend over cycles; rising values indicate input friction/regression.
