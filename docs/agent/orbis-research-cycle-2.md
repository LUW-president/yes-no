# ORBIS Research Cycle 2

## 1. ORBIS research overview
This cycle moves ORBIS research from concept narration to structured interaction experiments.

Scope remains research-only:
- documentation only
- no runtime code modifications
- no dependency changes
- ORBIS remains concept-stage

Research objective:
Evaluate how YES/NO decision moments can transition into minimal spatial interactions that are measurable, testable, and eventually prototype-able.

Primary areas:
1. directional interaction models
2. azimuth/elevation UI feedback patterns
3. lock confirmation UX
4. YES/NO -> ORBIS transition design
5. minimal spatial interaction prototypes

## 2. Spatial interaction experiments (minimum 5)

### Experiment 1 — Directional Sandbox Baseline
- **experiment name:** Directional Sandbox Baseline
- **user scenario:** User wants to orient toward a selected global location.
- **YES/NO trigger moment:** YES to “Do you want to aim toward a real location?”
- **spatial interaction:** User follows azimuth cue + simple elevation hint to align device.
- **lock interaction:** User taps LOCK when direction feels stable.
- **measurable signal:** time-to-lock, heading jitter before lock, number of re-aim attempts.
- **success metric:** >=70% sessions lock within target time window without restart.
- **comparison condition (if applicable):** no-elevation-hint variant vs azimuth+elevation variant.
- **expected user outcome:** User can complete directional targeting with low confusion.

### Experiment 2 — Lock Confirmation Timing Study
- **experiment name:** Lock Confirmation Timing Study
- **user scenario:** User reaches target direction and must confirm lock.
- **YES/NO trigger moment:** YES to “Confirm this direction now?”
- **spatial interaction:** User remains on stabilized target alignment.
- **lock interaction:** Compare immediate lock vs short hold-to-lock (e.g., 500–800ms).
- **measurable signal:** accidental locks, lock reversals, perceived confidence score.
- **success metric:** reduced accidental lock rate without increasing abandonment.
- **comparison condition (if applicable):** tap lock vs hold lock.
- **expected user outcome:** Lock feels intentional and trustworthy.

### Experiment 3 — YES/NO to ORBIS Handoff Clarity
- **experiment name:** Handoff Clarity Test
- **user scenario:** User is in YES/NO flow and receives spatial handoff prompt.
- **YES/NO trigger moment:** YES to “Would you like to continue spatially?”
- **spatial interaction:** User enters ORBIS directional mode with concise onboarding line.
- **lock interaction:** Standard lock after first successful alignment.
- **measurable signal:** handoff acceptance rate, handoff confusion points, drop-off at first spatial screen.
- **success metric:** users accurately explain mode switch in post-questionnaire.
- **comparison condition (if applicable):** verbose handoff copy vs minimal handoff copy.
- **expected user outcome:** Transition feels clear, consented, and non-surprising.

### Experiment 4 — Spatial Decision Amplification
- **experiment name:** Spatial Decision Amplification
- **user scenario:** User compares two options with directional anchors.
- **YES/NO trigger moment:** YES to “Do you want to test this decision physically?”
- **spatial interaction:** User aims/locks toward Option A then Option B target directions.
- **lock interaction:** One lock per option; optional confidence capture after each lock.
- **measurable signal:** confidence delta between options, decision completion rate, time-to-decision.
- **success metric:** higher decision confidence vs non-spatial control flow.
- **comparison condition (if applicable):** YES/NO-only decision path vs YES/NO + spatial lock path.
- **expected user outcome:** User reports clearer conviction after spatial interaction.

### Experiment 5 — ORBIS Trust Calibration Demo
- **experiment name:** Trust Calibration Demo
- **user scenario:** First-time reviewer tests whether directional output feels credible.
- **YES/NO trigger moment:** YES to “Try one guided spatial interaction?”
- **spatial interaction:** User follows minimal directional guidance to known target.
- **lock interaction:** User locks once target confidence indicator passes threshold.
- **measurable signal:** trust rating, perceived system credibility, mismatch reports (“felt wrong direction”).
- **success metric:** trust score above predefined threshold with low mismatch reports.
- **comparison condition (if applicable):** confidence indicator visible vs hidden.
- **expected user outcome:** Reviewer perceives interaction as plausible and coherent.

## 3. Measurement strategies
Recommended research instrumentation (concept-level, non-runtime commitment):
- **quantitative:**
  - time-to-lock
  - lock attempt count
  - cancellation/retry rate
  - handoff acceptance/drop-off rates
- **qualitative:**
  - first-30-second interpretation
  - confusion points
  - trust/credibility concerns
  - “would use again” signal
- **classification model:**
  - keep
  - investigate
  - ignore for now

Signal quality rules:
- prioritize repeated patterns across sessions
- avoid reacting to one-off preferences
- preserve YES/NO simplicity and scope boundaries

## 4. Prototype candidates
Candidate prototypes for future approved implementation phases:
1. **Directional Sandbox Prototype** (azimuth/elevation guidance + lock)
2. **Lock Timing Prototype** (tap vs hold confirmation)
3. **Handoff Microflow Prototype** (YES/NO -> ORBIS consent transition)
4. **Decision Amplification Prototype** (A/B directional lock comparison)
5. **Trust Calibration Micro-demo** (known target orientation confidence test)

All candidates are exploratory and require explicit implementation approval.

## 5. Privacy and trust considerations
Research guardrails:
- explicit consent before entering spatial mode
- no hidden location history collection
- minimal retained data by default
- transparent lock/session state
- roadmap honesty (do not present concept experiments as shipped features)

Trust-critical behaviors:
- clear disclosure of prototype status
- clear distinction between guidance confidence and objective certainty
- reversible interactions where practical (undo/cancel lock in study variants)

Boundary reminder:
- YES/NO remains implemented decision interface.
- ORBIS remains concept-stage research layer.
- This report defines experiments only, not runtime implementation.
