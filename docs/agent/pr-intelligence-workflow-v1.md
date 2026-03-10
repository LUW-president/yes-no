# PR Intelligence Workflow v1

## Purpose
Automatically analyze every new pull request and produce a structured PR analysis for safer review sequencing.

## Scope
This workflow is **analysis-only**.

It does:
- inspect PR metadata and changed files
- classify PR type
- infer likely dependencies between open PRs
- estimate risk level
- recommend merge position/order

It does **not**:
- merge PRs automatically
- modify repository contents automatically
- change dependencies

## Analysis fields
For each PR, detect and report:
1. **PR #**
2. **Change type**: documentation / governance / runtime / research
3. **Scope**: key files/areas modified
4. **Risk level**: low / medium / high
5. **Dependencies**: inferred PR dependencies or sequence constraints
6. **Suggested merge position**: recommended ordering index

## Classification rules

### Change type
- **documentation**: only docs, markdown, readme, policy docs
- **governance**: process rules, operating constitutions, workflow policy docs
- **runtime**: source code affecting execution behavior
- **research**: exploratory/research-cycle findings without runtime delivery

If multiple categories apply, use primary category + secondary note.

### Scope detection
- enumerate modified paths
- group by domain:
  - `docs/`
  - `apps/`
  - `packages/`
  - config/workflow files
- identify overlap with other open PRs

### Dependency inference
Mark a PR as dependent when:
- it updates/extends files introduced by another open PR
- its title/body indicates follow-up/refinement of another PR
- semantic order is required (e.g., base protocol before schedule refinements)

### Risk model
- **Low**: docs-only, isolated scope, no behavior changes
- **Medium**: cross-cutting docs/governance changes affecting process, ambiguous overlap
- **High**: runtime modifications, dependency updates, broad or conflicting changes

## Suggested merge ordering logic
1. Merge foundational governance/baseline docs first.
2. Merge base protocol/framework docs before refinements.
3. Merge independent research docs after foundational governance unless urgent.
4. Merge oldest/high-drift PRs last unless they unblock critical dependencies.
5. If two PRs conflict in scope, require manual review before ordering.

## Output format
Use concise Telegram/mobile-friendly structure:

```text
[NOAH] 🔍 PR Intelligence

PR #<number>
Type: <type>
Scope: <summary>
Risk: <low|medium|high>
Dependencies: <none|list>
Suggested merge position: <n>
```

For multi-PR snapshots:

```text
[NOAH] 🔍 PR Intelligence Summary
1) PR #A — <type> — Risk <level>
2) PR #B — <type> — Risk <level>
...
Recommended order: #A -> #B -> #C
```

## Operating constraints
- analysis-only
- no automatic merging
- no automatic repository modification
- no dependency changes

## Human gate
All merge decisions remain human-approved.
The workflow provides recommendation, not authority.
