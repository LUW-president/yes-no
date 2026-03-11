# Integration Spec — Uber Eats Adapter v1

Status: Planning-only (no implementation in this cycle)
Scope: Prototype / non-production

## 1) Objective
Connect YES/NO Layer 5 (Decision Assistant) to Uber Eats as an action suggestion pathway.

Core behavior:
- System proposes an Uber Eats action.
- User confirms with YES/NO.
- On YES, adapter opens Uber Eats deep link.
- On NO, no action.

## 2) Philosophy alignment (SJ86)
- Binary-only final resolution: YES/NO
- System does not decide for user
- No autonomous ordering
- Deterministic behavior
- Explainable suggestion rationale

## 3) Layer mapping
- Layer 1: user confirms suggestion via YES/NO
- Layer 2: deterministic gate/guard remains unchanged
- Layer 3: log suggestion and confirmation outcome
- Layer 4: later pattern learning (out of scope in v1)
- Layer 5: action proposal (this adapter)

## 4) MVP design (Phase 1)
Action type: `OPEN_UBEREATS`

Flow:
1. Assistant produces suggestion payload from deterministic summary context.
2. UI displays suggestion text + reason + explicit YES/NO confirm.
3. If YES: open configured Uber Eats deep link.
4. If NO: dismiss and record refusal.

No account linking required in phase 1.

## 5) Deep link strategy
Primary URL (web/app handoff):
- `https://www.ubereats.com/`

Optional deterministic query presets (later phase 2):
- cuisine
- delivery speed preference
- budget band

All presets must be explicit, static, and user-visible.

## 6) Data contract (proposal)
```json
{
  "suggestionId": "sg_...",
  "kind": "OPEN_UBEREATS",
  "title": "Order food now?",
  "reason": "Signal indicates meal-related intent",
  "url": "https://www.ubereats.com/",
  "requiresConfirmation": true
}
```

Confirmation event:
```json
{
  "suggestionId": "sg_...",
  "userConfirmation": "YES|NO",
  "timestamp": "ISO-8601"
}
```

## 7) Safety rules
- Never place an order automatically.
- Never bypass explicit YES confirmation.
- Never hide destination URL.
- Provide cancel path at all times.
- Keep adapter kill-switch available (feature flag).

## 8) Rollout plan
Phase A: docs/spec only
Phase B: internal feature-flagged prototype with static deep link
Phase C: limited operator-led validation sessions
Phase D: decide whether to expand to richer presets

## 9) Validation criteria
- Suggestion render success rate
- Confirmation capture integrity (YES/NO logged)
- Link-open success rate
- No autonomous side-effects
- User clarity feedback: “Did this suggestion feel relevant?”

## 10) Out of scope (v1)
- API-based food ordering
- Payment handling
- Account linking
- Autonomous execution
- Non-binary confirmation paths
