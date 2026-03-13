# Discovery Decision Engine Preparation — QuestionNode Architecture v1

Status: Architecture preparation only (no runtime activation)

## Goal
Define a deterministic question-node structure that supports branching yes/no discovery questions before action proposals.

## Guardrails
- Do not modify gesture covenant:
  - circle = YES
  - cross = NO
  - unknown = retry only
- Do not modify decision engine behavior in this phase.
- Architecture artifacts only.

## Proposed Core Type
```ts
type BranchRef = string;

type FinalAction = {
  action_id: string;
  title: string;
  template: string;
  params?: Record<string, string>;
};

type QuestionNode = {
  node_id: string;
  question_text: string;
  yes_branch?: BranchRef;
  no_branch?: BranchRef;
  final_action?: FinalAction;
};
```

## Deterministic Rules
1. A node must have either:
   - `yes_branch` and `no_branch`, or
   - `final_action`.
2. `unknown` never advances branch; it stays on current node and retries.
3. Branch traversal uses only normalized binary answer (`yes` | `no`).
4. No probabilistic routing.

## Traversal Contract (Preparation)
```ts
function nextFromNode(node: QuestionNode, answer: 'yes'|'no'): { next_node_id?: string; final_action?: FinalAction }
```

Behavior:
- If `final_action` exists, return action.
- Else route by `yes_branch`/`no_branch`.
- Missing branch in selected direction is treated as invalid node configuration.

## Example Node Graph (MVP)
```ts
const nodes: Record<string, QuestionNode> = {
  q1: {
    node_id: 'q1',
    question_text: 'Is there something you want right now?',
    yes_branch: 'q2_food_or_not',
    no_branch: 'q2_feeling_shift',
  },
  q2_food_or_not: {
    node_id: 'q2_food_or_not',
    question_text: 'Is it related to food or drink?',
    yes_branch: 'q3_food_now',
    no_branch: 'q3_non_food',
  },
  q3_food_now: {
    node_id: 'q3_food_now',
    question_text: 'Do you want it in the next 30 minutes?',
    yes_branch: 'a_open_ubereats',
    no_branch: 'q3_non_food',
  },
  a_open_ubereats: {
    node_id: 'a_open_ubereats',
    question_text: 'Action ready',
    final_action: {
      action_id: 'open_ubereats',
      title: 'Open Uber Eats',
      template: 'Would you like me to open Uber Eats?'
    },
  },
};
```

## Integration Boundary (Future Phase)
- Gesture layer continues to emit normalized `yes`/`no` only.
- QuestionNode traversal sits between normalized answer and proposal rendering.
- Existing decision engine remains unchanged until explicitly approved.

## Validation Checklist for Future Implementation
- Node graph schema validation (no broken branch refs)
- Deterministic traversal unit tests
- Unknown-retry invariant tests
- Final action rendering tests

