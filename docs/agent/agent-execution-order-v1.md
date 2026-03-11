# Agent Execution Order v1

Status: Active
Scope: YES/NO repository autonomous operations

## Canonical order
0. **Nurse Agent** (continuous health rounds)
1. **Strategic Intelligence Agent**
   - identifies highest-leverage opportunity
2. **Architecture Agent**
   - validates boundaries, layering, and scope fit
3. **Build Agent**
   - implements scoped changes in feature branch
4. **Stability Agent**
   - runs deterministic test/quality gates
5. **Documentation Agent**
   - updates usage/runbooks/reports/traceability
6. **Noah (Orchestrator)**
   - final review, PR management, merge sequencing, state sync

## Mandatory gates
- No Build step before Architecture validation for runtime changes.
- No merge before Stability validation.
- No cycle completion before Documentation update (when behavior changed).

## Cycle templates

### Runtime change cycle
Strategic -> Architecture -> Build -> Stability -> Documentation -> Noah

### Docs-only cycle
Strategic -> Documentation -> Stability (link/reference checks as needed) -> Noah

### Incident hotfix cycle
Stability (incident detect) -> Architecture (scope guard) -> Build -> Stability -> Documentation -> Noah

## Escalation rules
Escalate to human before merge when:
- dependency changes are introduced
- architecture boundaries are altered
- production/deployment risk is unclear
- test stability regresses

## Completion criteria
A cycle is complete when:
- PR merged (or deferred with explicit rationale)
- main synced
- status artifact updated
- blockers and next actions logged


## Reactive triage
Doctor Agent activates instantly on incidents and drives minimal-fix triage before Build execution.
