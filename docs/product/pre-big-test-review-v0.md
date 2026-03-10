# Pre-Big-Test Review v0 — YES/NO

## purpose
Provide a conservative repo-wide coherence and readiness assessment before running the big test.

## current repo coherence assessment
Overall status: **coherent and demo-ready with notes**.

The repository tells a mostly consistent story from product narrative -> specs -> runbooks -> implementation. Core command surface and prototype paths are aligned with current implementation.

## what is strong
- Clear product thesis repeated consistently (one question, binary YES/NO, minimal UI).
- Core implementation stack present and testable:
  - engines + orchestrator
  - bridge + adapters
  - native-style prototype
  - Expo shell first slice
- Ops layer is strong:
  - demo runbooks (internal + external)
  - pilot checklist
  - feedback protocol + templates
- Sharing posture is conservative and documented (limited external sharing only, explicit limitations).

## what is inconsistent
1. **Milestone language drift in a few docs**
   - Some docs still describe “native mobile refinement / gesture-driven interaction” as upcoming, while a prototype-level gesture and Expo shell slice are now implemented.
2. **Package presence vs policy**
   - `package-lock.json` remains intentionally untracked; state is known but should stay explicit to avoid future confusion.

## what is missing
- No single “big test command sheet” doc yet (currently split across runbooks/specs).
- No explicit “Expo shell + bridge on phone network” troubleshooting note consolidated in one place.

## docs/commands mismatches
### Verified command surface
- `yesno run` ✅
- `yesno harness` ✅
- `yesno demo` ✅
- `yesno status` ✅
- `npm run prototype:native` ✅
- bridge run path (`npm run bridge:dev`) ✅
- Expo shell path (`cd expo-shell && npm run start`) ✅

### Notes
- Expo shell requires bridge availability from device/network perspective during phone tests.
- `package-lock.json` is untracked by explicit current policy.

## big test readiness assessment
Assessment: **READY FOR BIG TEST WITH NOTES**.

Why:
- core flows are implemented and test-validated
- deterministic demo path works
- Expo shell first slice is operational
- external sharing/disclosure posture is documented

Notes:
- run bridge first and keep it running
- use one canonical walkthrough path for consistency
- use disclosure script before demo starts

## exact recommended big test path
1. **Baseline checks (repo root)**
   - `npm run test:cli-dispatch`
   - `npm run test:prototype:native`
   - `npm run test:prototype:gesture`
   - `npx tsx expo-shell/__tests__/expoShell.test.ts`
2. **Start backend bridge (terminal 1)**
   - `npm run bridge:dev`
3. **Run Expo shell (terminal 2)**
   - `cd expo-shell`
   - `npm install`
   - `npm run start`
4. **Execute canonical path live**
   - YES -> YES -> NO -> artifact_film -> accept -> completion
5. **Capture structured feedback immediately**
   - use `ops/feedback/feedback-log-template-v0.md`

## safe fixes applied (if any)
- None in this review pass.

## issues requiring human decision
1. Should we add one dedicated “big test quickstart” doc to reduce context-switching across multiple files?
2. Should milestone phrasing be normalized now to reflect that Expo shell first slice exists (doc-only wording update)?

## final recommendation
**READY FOR BIG TEST WITH NOTES**
