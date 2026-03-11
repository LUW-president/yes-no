# YES/NO CLI Packaging Layer

## Purpose
Provide a single command surface (`yesno`) for local execution of core app flows.

## Commands
- `yesno run`
- `yesno harness`
- `yesno demo`
- `yesno status`
- `yesno trace --session <session_id> | --demo`
- `yesno confidence --session <session_id>`
- `yesno explain --session <session_id>`
- `yesno guard --session <session_id>`
- `yesno gate --session <session_id>`
- `yesno v1 [--answers yes,no,...] [--user <user_id>] [--pack <pack_id>]` (prototype, non-production)

## Developer run instructions
```bash
npx tsx apps/cli/yesno.ts run
npx tsx apps/cli/yesno.ts harness
npx tsx apps/cli/yesno.ts demo
npx tsx apps/cli/yesno.ts status
npx tsx apps/cli/yesno.ts trace --demo
npx tsx apps/cli/yesno.ts confidence --session <session_id>
npx tsx apps/cli/yesno.ts explain --session <session_id>
npx tsx apps/cli/yesno.ts guard --session <session_id>
npx tsx apps/cli/yesno.ts gate --session <session_id>
npx tsx apps/cli/yesno.ts v1 --answers yes,yes,yes
```
