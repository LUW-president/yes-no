# Prototype Demo Runbook v0

## Purpose
This runbook defines how to demonstrate the native mobile prototype consistently.

The goal is to ensure anyone on the project can run and present the prototype using the same flow.

## Prerequisites
- repository is up to date
- dependencies installed
- bridge available if required
- full test suite passing
- prototype commands available

## Startup Sequence
1. Update repository and install dependencies if needed.
   - `git pull`
   - `npm install`
2. Confirm baseline commands are available.
   - `npm run yesno:demo`
   - `npm run prototype:native`
3. Start bridge service (required for prototype session lifecycle).
   - `npm run bridge:dev`
4. Launch the native prototype in a separate terminal.
   - `npm run prototype:native`
5. Verify the first question screen appears before starting the demo narrative.

## Demo Flow
Canonical baseline path:
1. start session
2. first question appears
3. answer YES
4. next question appears
5. answer YES
6. next question appears
7. answer NO
8. artifact proposal appears
9. accept artifact
10. completion screen appears

## Expected Screens
Expected screen order:
1. Question Screen
2. Question Screen
3. Question Screen
4. Artifact Screen
5. Completion Screen

## Expected Artifact Path
Baseline demo target path:
- `artifact_film`

This path comes from the deterministic `creation_v0` pack.

## Completion Flow
At the end of the demo:
- completion screen appears
- optional restart prompt is visible if implemented
- demo is successful when full lifecycle completes without manual fixes

## Troubleshooting Notes
- bridge not reachable:
  - restart bridge with `npm run bridge:dev`
- session not starting:
  - verify bridge is running and retry prototype launch
- invalid command usage:
  - rerun with exact commands in Startup Sequence
- unexpected screen order:
  - restart prototype and follow canonical answer path
- failing tests before demo:
  - run full test suite and resolve failures first

## Success Criteria
Demo is successful if:
- session starts cleanly
- question flow progresses deterministically
- artifact screen appears
- completion screen appears
- no runtime errors occur

## Constraints
- documentation only
- reflect actual prototype behavior only
- no speculative flows
- keep the runbook practical and concise
