# cli-runner-v0

## purpose
Provide a minimal local CLI to run end-to-end YES/NO sessions using the session orchestrator and YAML packs.

## CLI command structure
- `yesno run --pack <pack_id> --user <user_id>`
- `yesno run --pack-path <path> --user <user_id>`

## session lifecycle in CLI
1. Initialize session via orchestrator
2. Print presented question
3. Read YES/NO input
4. Record answer and resolve next state
5. Repeat until artifact trigger or session end

## interaction model (YES / NO input)
- Accept `yes|y|⭕` as YES
- Accept `no|n|❌` as NO
- Reject other input and re-prompt

## pack loading
- Default from `content/packs/*.yaml` by `pack_id`
- Optional explicit `--pack-path`
- Fail fast on invalid/unknown pack

## event logging
- Print event stream summary to stdout
- Optional `--log-file <path>` to persist emitted events JSONL

## integration with protocol, question engine, memory engine, orchestrator
- Protocol: event creation/validation + append in event store
- Question engine: deterministic transition resolution
- Memory engine: profile updates on answer/artifact events
- Orchestrator: single runtime coordinator used by CLI loop
