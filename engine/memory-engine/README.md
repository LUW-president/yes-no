# engine/memory-engine

## Purpose
Compute deterministic preference confidence signals from protocol events.

## Relationship to protocol events
- Ingests `question.presented`, `answer.recorded`, and artifact events.
- Updates numeric user signals with bounded deterministic deltas.

## Influence on question selection
The question engine can read signal strengths to prioritize which question branch should be surfaced next.
