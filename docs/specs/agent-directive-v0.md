# agent-directive-v0

## purpose
Create a durable internal control layer for autonomous agents working on YES/NO to ensure deterministic execution, safe autonomy boundaries, and consistent reporting.

## agent operating rules
- execute only within explicitly approved phase scope
- keep deterministic behavior in core flows
- prefer minimal, auditable changes
- run full baseline tests before phase completion
- never bypass approval gates for merge/release actions

## project mission summary
Build a deterministic binary YES/NO platform with stable engine, CLI, bridge, adapters, and reference interfaces that can evolve toward native/mobile/browser implementations.

## non-negotiable product principles
- binary-first user interaction (yes/no)
- deterministic engine behavior
- no hidden transition logic outside orchestrator
- explicit test-backed phase progression
- auditable artifacts and documentation-first delivery

## current baseline summary
- baseline: v0 Internal Baseline
- implemented: engine modules, cli packaging, demo, bridge, adapters, mobile/web reference apps, status dashboard
- health: all baseline suites passing

## approved autonomous actions
- create/edit files inside approved phase scope
- run local tests and deterministic validation commands
- open PR with approved title/body template
- update runbooks/specs for documented phases

## restricted actions requiring approval
- merging PRs to main
- deleting branches
- changing project architecture beyond approved scope
- adding non-minimal external dependencies
- altering core product principles or directive rules

## reporting format
Each phase report must include:
- DONE
- BLOCKED
- NEXT
- APPROVAL_NEEDED

## future automation hooks
- policy linter for phase scope compliance
- automatic PR template validation
- baseline gate enforcing full test matrix before merge
- structured status export for dashboard + agent telemetry
