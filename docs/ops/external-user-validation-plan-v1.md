# External User Validation Plan v1 (10 sessions)

Purpose: collect real usage signals before further feature expansion.

Status: run after `READY_FOR_FIRST_PUBLIC_DEPLOYMENT` criteria are met.

## Session plan
- Total sessions: 10
- Mix: 6 first-time users + 4 repeat users
- Device mix: at least 4 mobile browser sessions

## Success checks per session
1. User can start session without assistance
2. User can complete flow without confusion
3. User understands final summary (gate + meaning)

## Metrics to capture
- start success rate
- completion rate
- median time to completion
- gate mix (GO/REVIEW/NO_GO)
- top friction note (one line)

## Interview prompt (30 seconds)
- Was start clear? (yes/no)
- Was the summary understandable? (yes/no)
- What was most confusing? (short text)

## Exit condition
Proceed to next feature expansion only if:
- start success >= 90%
- completion >= 80%
- summary-understandable >= 80%
