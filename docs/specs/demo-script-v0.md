# demo-script-v0

## purpose
Provide a deterministic, no-input demo flow that runs a complete YES/NO session for demos and CI validation.

## deterministic answer sequence design
- fixed sequence array (example): `yes, yes, yes, yes`
- sequence selected by demo profile (`artifact_path`, `end_path`)
- no randomness in v0

## demo command structure
- `yesno demo --pack <pack_id>`
- optional: `--path artifact|end`

## session lifecycle
1. start session
2. present first question
3. auto-apply next deterministic answer
4. continue until artifact or end
5. close session

## artifact demonstration path
- default demo path targets artifact trigger (`artifact_image` in creation_v0)
- prints artifact proposal and acceptance path

## integration with orchestrator
- uses `startSession` and `recordAnswer`
- no duplicated transition logic
- relies on protocol events emitted by orchestrator

## console output format
- step blocks:
  - `QUESTION` + text
  - `ANSWER` + yes/no
  - `EVENT` + event_type + timestamp
- terminal states:
  - `ARTIFACT PROPOSED` + type
  - `SESSION COMPLETE`
