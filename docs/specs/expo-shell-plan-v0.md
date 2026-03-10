# Expo Shell Plan v0 — YES/NO

## 1. Purpose
The Expo shell is a thin React Native app layer that presents YES/NO as a real mobile product experience while reusing the current backend/prototype architecture.

It is the fastest path to move from terminal-style prototype perception to app-like first-user perception.

## 2. App-like Prototype Goal
Goal: a first-time user should feel they are trying a real app, not a developer prototype.

Definition of done for this goal:
- opens like a mobile app
- immediate clear interaction surface
- one-question flow feels intentional and productized
- no visible developer/terminal noise

## 3. Minimum UI
Minimum screens:
- launch / entry
- question screen
- artifact screen
- completion screen

No extra navigation surface in v0.

## 4. Reuse from Current System
Reuse exactly:
- bridge (`bridge/reference-app`)
- session orchestrator
- question engine
- memory engine
- existing prototype flow (question → artifact → completion)
- current specs (UI, gesture, timing, prototype plans)

## 5. Fastest Implementation Path
Shortest path with Expo / React Native:
1. create minimal Expo app shell
2. implement 4-screen state flow in a single lightweight navigation stack
3. call existing bridge endpoints via thin client layer
4. map responses to existing session states
5. keep styling minimal (black background, centered text, YES/NO actions)

## 6. Bridge Communication Model
Shell calls existing endpoints only:
- `POST /session/start`
- `POST /session/answer`
- `GET /session/:session_id`

Flow:
- on entry: start session
- on each YES/NO tap: submit answer
- if needed: read session state for sync/recovery

## 7. First 10 Seconds Experience
First-time user should:
1. see a clean black screen with minimal branding/title
2. move immediately into first question
3. understand interaction instantly: two actions only (YES / NO)
4. feel calm, focused, and guided (no clutter, no loading noise)

## 8. What to Remove from the Current Developer-Oriented Experience
Hide/remove from first-user surface:
- terminal feel
- debug noise
- extra commands
- developer-style output strings/logging

## 9. First Version Scope
Include in v1 shell:
- tap yes/no
- black screen
- one question at a time
- artifact display
- completion screen

## 10. Postpone for Later
Explicitly postponed:
- full production backend
- notifications
- accounts
- analytics
- advanced gestures
- app store packaging

## 11. Success Criteria
Expo shell is good enough for first user testing when:
- app launches reliably and starts a session
- question/artifact/completion flow works end-to-end
- YES/NO taps are stable and deterministic
- no developer-facing noise leaks into user flow
- users report “this feels like an app,” not a console demo

## 12. Constraints
- planning only
- no implementation code
- keep it minimal
- preserve YES/NO philosophy
- align with current repo state
