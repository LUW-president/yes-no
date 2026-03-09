# engine/question-engine

## Role of deterministic engine
The engine selects the next node in a YES/NO flow using fixed rules from a YAML content pack.

## Relation to protocol events
- `question.presented` identifies current question.
- `answer.recorded` provides yes/no decision.
- Resolver maps decision to next question, artifact trigger, or session end.

## How packs control flows
Each question node defines `yes` and `no` transitions.
Transitions can point to:
- another question id
- `end`
- `artifact_*` trigger
