# repo-cleanup-v0

## purpose
Perform a lightweight repository hygiene pass to improve documentation consistency, remove stale placeholders, and verify structural alignment.

## scope
- documentation consistency checks
- removal of clearly unused placeholders
- internal link validation
- naming consistency verification

## review checklist
1. unused `.gitkeep` files
   - identify directories where `.gitkeep` is no longer needed because files now exist
   - remove only redundant placeholders
2. outdated references in docs
   - scan `README.md`, `docs/`, `ops/` for stale phase names/paths
   - update references to current baseline state
3. duplicate spec mentions
   - detect repeated references across docs causing confusion
   - keep one canonical reference location where possible
4. broken internal documentation links
   - verify all local markdown links resolve to existing files
   - fix paths and anchors where needed
5. directory naming consistency
   - confirm naming patterns are consistent (`kebab-case`, folder intent clarity)
   - document any exceptions intentionally kept

## execution approach
- run non-destructive scans first
- apply minimal, auditable edits
- avoid feature changes or architecture changes

## deliverables
- cleaned documentation references
- removed redundant placeholder files (if any)
- link integrity report summary
- consistency notes in commit summary

## validation
- re-run full baseline test suite after cleanup
- ensure no runtime/behavioral code changes introduced

## output format
- DONE
- BLOCKED
- NEXT
- APPROVAL_NEEDED
