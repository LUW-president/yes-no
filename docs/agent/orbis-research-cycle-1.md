# ORBIS Research Cycle 1

## 1. ORBIS research overview
This cycle explores long-term spatial interaction concepts under a strict research-only posture.

Scope is conceptual and architectural: no runtime implementation changes, no dependency changes, and no claims that ORBIS is currently shipped.

The goal is to identify meaningful spatial interaction opportunities that could, in the future, complement the YES/NO decision interface while preserving product simplicity.

## 2. Spatial interaction concepts
Exploratory concept directions:
- **Directional intent as interaction primitive**: user aims toward a real-world/global target rather than selecting from dense UI controls.
- **Lock moment UX**: a deliberate “commit” event when directional alignment is accepted.
- **Session framing**: short, bounded spatial sessions to avoid endless interaction loops.
- **Minimal visual language**: sparse cues, low clutter, and high signal-to-noise feedback.

Potential UI pattern families (concept only):
- heading ring + target bearing cue
- horizon/elevation cue with confidence bands
- lock confirmation micro-state with reversible action window

## 3. Global Direction Engine opportunities
Research opportunities grounded in `global-direction-engine-v0`:
- LLH -> ECEF -> ENU pipeline as stable core for global aiming semantics.
- Azimuth/elevation output as a universal directional contract for UI layers.
- Sensor fusion quality envelope definition:
  - GPS uncertainty tolerance
  - heading drift handling
  - motion stabilization thresholds
- Confidence scoring concept:
  - direction confidence
  - lock confidence
  - environmental interference sensitivity

These opportunities are architectural and do not imply implemented modules today.

## 4. Possible prototype directions
Conceptual, future-facing prototype candidates:
1. **Directional Sandbox Prototype**
   - visualize azimuth/elevation response from synthetic targets
   - no user data persistence
2. **Lock Interaction Study Prototype**
   - test micro-interactions around lock confirmation timing
   - compare low-feedback vs explicit-feedback patterns
3. **Handoff Simulation Prototype (YES/NO -> ORBIS)**
   - model consent-based handoff messaging only
   - verify user comprehension before spatial mode transition

All directions remain optional and require explicit approval before any implementation.

## 5. Privacy considerations
Research principles to preserve:
- explicit consent before any spatial targeting mode
- minimal data retention by default
- no hidden location history
- transparent session state (start/active/end)
- ephemeral artifacts/snapshots unless user opts in to persistence

Risk watchpoints:
- accidental over-collection of location traces
- unclear boundaries between orientation sensing and storage
- trust loss from ambiguous lock/share behavior

## 6. Long-term product opportunities
Conceptual opportunities if ORBIS matures:
- guided global orientation experiences
- location-linked creative rituals
- geospatial intention journaling with explicit consent
- developer-facing spatial interaction primitives layered on strict privacy defaults

Boundary reminder:
- YES/NO remains the implemented interaction system today.
- ORBIS remains research/concept-stage in this repository.
- Any move toward implementation requires explicit human approval and scoped planning.
