# Global Direction Engine v0

## Purpose
Define the base spatial computation layer used for directional aiming from a user device toward any Earth target.

This document describes the mathematical and sensor foundations of the engine layer, independent from UI experience design.

## Mathematical foundation
The engine computes directional vectors between:
- observer position (device location)
- target position (selected global point)

Core principle:
1. Convert geodetic coordinates to a shared Earth-fixed frame.
2. Transform target vector into local observer frame.
3. Derive azimuth/elevation from local frame components.

## Coordinate systems (LLH, ECEF, ENU)
### LLH (Latitude, Longitude, Height)
Human-readable geodetic representation used for:
- GPS inputs
- user-selected targets

### ECEF (Earth-Centered, Earth-Fixed)
Cartesian global frame used for stable vector math:
- origin at Earth center
- axes fixed to Earth rotation

### ENU (East, North, Up)
Observer-local tangent frame used for directional output:
- East: local x-axis
- North: local y-axis
- Up: local z-axis

Computation path:
- LLH -> ECEF
- ECEF target-minus-observer vector -> ENU
- ENU -> azimuth/elevation

## Azimuth and elevation calculation
Given local ENU vector `(e, n, u)`:
- azimuth = `atan2(e, n)` (normalized to 0..360°)
- elevation = `atan2(u, sqrt(e^2 + n^2))`

Interpretation:
- azimuth = horizontal direction relative to local north
- elevation = vertical angle above local horizon

## Sensor inputs (GPS, heading, device motion)
Required inputs:
- GPS/position (observer LLH)
- heading/compass (world alignment)
- device motion/orientation (frame stabilization)

Practical behavior:
- heading aligns device orientation to global north reference
- motion sensors smooth short-term jitter
- position updates refresh target vector continuously

## Accuracy constraints
Directional accuracy depends on:
- GPS uncertainty
- magnetometer/heading drift
- sensor fusion quality
- local electromagnetic interference

Expected prototype limitations:
- urban canyons and indoor environments degrade stability
- high-latency sensor updates increase perceived lag
- compass calibration quality directly affects azimuth trust

## Example case (Miami -> Brussels)
Illustrative flow:
1. Observer LLH: Miami
2. Target LLH: Brussels
3. Convert both to ECEF
4. Compute target relative vector in observer ENU
5. Derive azimuth/elevation
6. Render direction cue for user aiming

The key output is not distance narration but a stable directional cue toward target.

## Module structure
Suggested logical modules:
- `geo/llhToEcef`
- `geo/ecefToEnu`
- `direction/azElFromEnu`
- `sensors/inputNormalization`
- `fusion/headingMotionStabilization`
- `validation/accuracyBudget`

Status note:
This document defines an architecture/specification layer and does not imply runtime implementation in the current YES/NO codebase.
