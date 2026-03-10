# Prototype Demo Runbook v0

## purpose
Provide a clear, repeatable runbook for demonstrating the native mobile prototype consistently across internal sessions.

## prerequisites
- repository cloned and dependencies installed (`npm install`)
- local bridge service available
- prototype branch/build synced with main baseline
- terminal access for running bridge and prototype commands

## startup sequence
1. start bridge service:
   - `npm run bridge:dev`
2. in a new terminal, start native prototype:
   - `npm run prototype:native`
3. verify first question screen renders before beginning demo narration

## demo flow
1. introduce YES/NO interaction principle (binary only)
2. answer first question using tap-style input (`yes`/`no`)
3. continue one-question-at-a-time progression
4. trigger artifact path intentionally
5. demonstrate artifact decision prompt
6. complete session and show completion state

## expected screens
- Question Screen
  - header: `YES/NO`
  - current question text
  - actions: `[ YES ] [ NO ]`
- Artifact Screen
  - `ARTIFACT`
  - artifact type
  - prompt: `Accept this artifact?`
- Completion Screen
  - `SESSION COMPLETE`
  - optional continuation prompt

## expected artifact path
Recommended deterministic path during demo:
- answer sequence should reach artifact proposal (`artifact_*`)
- artifact screen appears with accept/reject prompt
- continue to completion after decision input

## completion flow
- show terminal completion screen
- briefly restate outcome: full session lifecycle executed successfully
- if needed, restart prototype for next viewer/demo pass

## troubleshooting notes
- if bridge is not running: restart with `npm run bridge:dev`
- if prototype stalls: restart prototype process and begin new session
- if unexpected state appears: verify latest main sync and rerun test suite
- if input not recognized: use explicit `yes`/`no` fallback (tap simulation)

## success criteria
Demo is successful when:
- startup completes without runtime errors
- question screen appears and accepts binary input
- artifact path is reached and displayed
- completion screen is reached
- flow remains deterministic and aligned with prototype scope
