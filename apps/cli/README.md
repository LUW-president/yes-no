# YES/NO CLI Packaging Layer

## Purpose
Provide a single command surface (`yesno`) for local execution of core app flows.

## Commands
- `yesno run`
- `yesno harness`
- `yesno demo`
- `yesno status`
- `yesno trace --session <session_id> | --demo`

## Developer run instructions
```bash
npx tsx apps/cli/yesno.ts run
npx tsx apps/cli/yesno.ts harness
npx tsx apps/cli/yesno.ts demo
npx tsx apps/cli/yesno.ts status
npx tsx apps/cli/yesno.ts trace --demo
```
