# Expo Shell v0 — YES/NO

Minimal Expo/React Native shell for YES/NO that sits on the existing bridge/session architecture.

## What this slice includes
- launch/entry state
- question screen (black screen + YES/NO taps)
- bridge calls to start/answer session
- basic artifact and completion states

## How to run locally
1. From `expo-shell/`:
   - `npm install`
   - `npm run start`
2. Ensure YES/NO bridge is running from repo root:
   - `npm run bridge:dev`

## LOCAL TESTING AND DEPLOYMENT PATH
- first step = run locally
- second step = test on own phone (Expo Go by scanning QR in terminal)
- third step = make an internal test build later
- public deployment is not part of this phase

## What comes after local testing
- validate one controlled internal walkthrough with stable question flow
- collect focused clarity/interaction feedback
- refine shell only where repeated signals appear

## Out of scope (this phase)
- accounts/auth
- notifications
- analytics
- advanced gestures
- production backend hardening
- app store preparation/packaging
- any non-binary interaction expansion

## Deployment posture
Not deploying publicly now. This is an internal prototype shell layer.
