# Nurse Live Health Round v1

Purpose: proactive production heartbeat for YES/NO V1 prototype.

Command:
- `npm run nurse:live-health-round`

Checks:
1. Root URL returns app page marker.
2. Live session start endpoint works.
3. Answer flow progresses to completion path.
4. Summary endpoint returns required fields.

CI automation:
- `.github/workflows/nurse-live-health-round.yml`
- hourly scheduled + manual dispatch.

Escalation:
- On failure, escalate to Doctor Agent with first error line + failing step.
