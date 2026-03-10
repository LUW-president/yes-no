# Gesture Recognition Prototype v0 — YES/NO

## purpose
Implement the first controlled prototype of circle/cross gesture recognition inside the native mobile prototype while preserving tap fallback and deterministic demo stability.

## implementation scope
Included:
- prototype gesture input module
- circle/cross detection heuristics
- yes/no normalization output path
- visual feedback prototype behavior
- session integration with fallback path

Excluded:
- production-grade gesture engine
- personalization and adaptive gesture tuning
- non-binary gesture vocabulary

## gesture input module plan
- create a dedicated prototype gesture module under `prototype/native-mobile/input/`
- accept raw stroke/touch path samples
- return normalized decision result or unrecognized state

## circle detection plan
- detect near-closed loop path
- evaluate continuity and closure threshold
- allow clockwise/counterclockwise variants
- tolerate imperfect user drawing

## cross detection plan
- detect two diagonal stroke segments
- verify central intersection proximity
- tolerate moderate angle and position variance

## yes/no normalization path
- recognized circle -> `yes`
- recognized cross -> `no`
- unrecognized -> no answer emitted, fallback path engaged

## fallback tap behavior
- tap YES/NO remains always available
- gesture failure must never block progression
- fallback prompt remains concise and clear

## visual feedback prototype plan
- render faint gesture trace during input
- fade trace after recognition attempt
- resolve with minimal YES/NO acknowledgment
- avoid clutter or heavy animation

## integration with native prototype
- wire gesture module into prototype input routing (`app.ts`/input layer)
- keep session transitions in `session.ts`
- preserve bridge submission contract (yes/no only)

## test plan
- circle path recognized as yes
- cross path recognized as no
- noisy/invalid paths rejected
- tap fallback path remains functional
- deterministic full lifecycle regression remains passing

## demo stability safeguards
- default canonical demo still executable via tap input
- gesture path failures degrade gracefully to tap fallback
- no change to orchestrator/bridge decision semantics

## prototype success criteria
- gesture prototype recognizes circle/cross reliably enough for controlled demos
- no ambiguity in yes/no resolution
- tap fallback remains stable
- artifact/completion demo path remains deterministic
