# packaging-v0

## purpose
Provide a single runnable command (`yesno`) for local execution of runner and harness flows.

## command structure
- `yesno run [--user <user_id>] [--pack <pack_id>]`
- `yesno harness [--user <user_id>] [--pack <pack_id>]`

## bin entrypoint design
- `bin/yesno` shell entrypoint
- delegates to `apps/cli-runner/index.ts` and `apps/ux-harness/index.ts`
- dispatch by first argument (`run` | `harness`)

## Node execution strategy
- use `tsx` for local TypeScript execution in v0
- avoid build step for early iteration

## package.json configuration
- `bin` map: `"yesno": "bin/yesno"`
- scripts:
  - `yesno:run`
  - `yesno:harness`
  - test scripts for all modules

## developer run instructions
1. `npm install`
2. `npm run yesno:run -- --user test_user --pack creation_v0`
3. `npm run yesno:harness -- --user test_user --pack creation_v0`

## future npm distribution path
- add build output (`dist/`) and compiled JS bin
- publish under scoped package (`@yesno/cli`)
- preserve command compatibility (`yesno run`, `yesno harness`)
