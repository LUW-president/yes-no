# ux-harness-v0

## purpose of UX harness
Provide a minimal interactive environment to simulate YES/NO black-screen interaction and run deterministic sessions end-to-end.

## interaction model (single question, YES/NO only)
- render one question at a time
- accept only YES/NO input
- reject invalid input and re-prompt
- no prompt authoring UI

## console or simple UI rendering approach
- v0: terminal-first black-style renderer (clear screen + centered question text)
- optional mode flag for plain console fallback

## event display/logging
- show per-step event summary (`event_type`, `timestamp`)
- optional verbose mode for full event payload
- optional JSONL output sink for replay/debug

## integration with CLI runner and session orchestrator
- UX harness invokes CLI runner session entrypoint
- CLI runner delegates state transitions to session orchestrator
- orchestrator emits protocol events and triggers memory updates

## future bridge to mobile/web reference apps
- keep interaction contracts identical (one-question, yes/no)
- reuse orchestrator and protocol contracts unchanged
- swap renderer only (terminal -> mobile/web)
