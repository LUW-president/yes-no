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
```
