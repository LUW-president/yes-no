# Native Mobile Prototype v0 (Gesture Refinement + Demo Hardening)

## Purpose
Runnable native-style YES/NO prototype with refined prototype-level gesture recognition and hardened demo behavior.

## Gesture behavior (prototype scope)
- circle (or `c`) resolves to YES
- cross (or `x`) resolves to NO
- imperfect circles/crosses are tolerated within conservative heuristics
- unrecognized gestures are rejected cleanly and require retry/fallback

## Demo-safe usage guidance
- canonical deterministic demo path remains tap-safe: YES -> YES -> NO -> artifact_film -> completion
- gesture path is supported, but tap remains recommended fallback in live demos
- keep input simple (`yes/no`, `y/n`, `circle/cross`)

## Limitations of recognition heuristics
- heuristic and prototype-only (not production gesture engine)
- no personalization/adaptive calibration
- no non-binary gesture vocabulary

## Tap fallback recommendation
Always use tap fallback when gesture input is not recognized. Gesture failures must not block session progression.

## Run locally
```bash
npm run bridge:dev
npm run prototype:native
```
