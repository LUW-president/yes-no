# CLI Runner v0

## Purpose
Run local end-to-end YES/NO sessions for deterministic validation.

## Run
```bash
npx tsx apps/cli-runner/index.ts run --user test_user --pack creation_v0
```

## Example session
- prints first QUESTION
- accepts yes/no input
- progresses deterministically
- may propose artifact
- ends with SESSION COMPLETE

## Notes
This runner is internal-only and uses existing protocol/question/memory/orchestrator engines.
