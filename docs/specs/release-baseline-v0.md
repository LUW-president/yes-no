# release-baseline-v0

## purpose
Create the first stable YES/NO project baseline for internal demos and future deterministic iteration.

## included components
- protocol v0
- question engine v0
- memory engine v0
- session orchestrator v0
- CLI packaging (`yesno run`, `yesno harness`, `yesno demo`)
- reference app bridge (HTTP)
- mobile reference app (console)
- web reference app (console)

## command matrix
- `yesno run`
- `yesno harness`
- `yesno demo`
- `npm run bridge:dev`
- `npm run mobile:reference`
- `npm run web:reference`

## demo flow
1. start bridge (optional for adapter-driven flows)
2. run `yesno demo` for deterministic session walkthrough
3. run mobile/web reference apps to validate interaction models

## local run instructions
1. install deps: `npm install`
2. run tests: `npm run test:protocol` ... full matrix
3. run core demo: `npx tsx apps/cli/yesno.ts demo`
4. run bridge: `npm run bridge:dev`
5. run adapters clients via reference apps

## test baseline
- protocol tests
- question engine tests
- memory engine tests
- orchestrator tests
- cli/ux tests
- demo tests
- bridge tests
- mobile/web adapter tests
- mobile/web reference app tests

## known limitations
- reference UIs are console-only
- no production auth/network hardening in bridge v0
- no artifact accept/reject UI controls yet
- minimal error-handling and persistence guarantees

## next milestone recommendations
- add artifact decision endpoint + UI controls
- add persistent session store
- add browser-native reference UI shell
- package versioned release notes + smoke scripts
