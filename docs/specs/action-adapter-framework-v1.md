# Action Adapter Framework v1

Status: Planning-only (no implementation in this cycle)
Scope: Prototype / non-production

## 1) Purpose
Define a reusable framework for connecting YES/NO to external action apps while preserving SJ86 philosophy:
- binary confirmation (YES/NO)
- deterministic behavior
- no autonomous execution

## 2) Core flow
1. Decision Assistant proposes an action.
2. User confirms with YES/NO.
3. If YES -> execute adapter action (open deep link / prefilled flow).
4. If NO -> no execution.
5. Log outcome to decision memory.

## 3) Adapter categories
Priority categories and initial targets:

1. Food
- Uber Eats
- DoorDash

2. Wellness
- Massage booking apps/providers

3. Personal care
- Hairdresser booking apps/providers

4. Home services
- Handyman booking apps/providers

5. Mobility
- Uber / Lyft

## 4) Rollout strategy
Phase A: planning/spec only
Phase B: deep-link adapters first (lowest risk)
Phase C: deterministic context triggers
Phase D: optional API integrations (auth/compliance gated)

## 5) Standard adapter contract (proposal)
```json
{
  "suggestionId": "sg_...",
  "adapter": "UBER_EATS|DOORDASH|MASSAGE|HAIRDRESSER|HANDYMAN|UBER_RIDE",
  "title": "Order food now?",
  "reason": "Signal indicates meal-related intent",
  "action": {
    "type": "OPEN_URL",
    "url": "https://www.ubereats.com/"
  },
  "requiresConfirmation": true
}
```

Confirmation event:
```json
{
  "suggestionId": "sg_...",
  "userConfirmation": "YES|NO",
  "timestamp": "ISO-8601",
  "executed": true
}
```

## 6) Safety constraints (mandatory)
- No third signal type
- Never execute without explicit YES
- Never place purchases/bookings autonomously
- Always show destination/action clearly before confirmation
- Keep kill-switch for each adapter

## 7) Determinism constraints
- Fixed rule-based trigger conditions
- Stable prompt wording per trigger pack version
- Deterministic suggestion mapping for same input state

## 8) Explainability requirements
Each suggestion must provide:
- short reason line
- source signal context (human-readable)
- explicit next step after YES or NO

## 9) Initial priority matrix
| Adapter | User value | Build complexity | Risk | Priority |
|---|---:|---:|---:|---:|
| Uber Eats | High | Low (deep link) | Low | P1 |
| DoorDash | High | Low (deep link) | Low | P1 |
| Uber Ride | Medium | Low (deep link) | Low | P2 |
| Hairdresser | Medium | Medium | Medium | P2 |
| Handyman | Medium | Medium | Medium | P2 |
| Massage | Medium | Medium | Medium | P3 |

## 10) Acceptance criteria for any adapter PR
- Uses standard contract
- Preserves YES/NO confirmation gate
- No engine logic drift
- Includes tests/logging updates where applicable
- Updates docs/runbook for operator validation
