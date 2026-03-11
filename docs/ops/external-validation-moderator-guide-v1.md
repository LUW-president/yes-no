# External Validation Moderator Guide v1

Scope: prototype / non-production
Goal: run one session cleanly and log it honestly.

## Per-session flow (3-5 min)
1. Open: `https://yes-no-kappa.vercel.app`
2. Ask participant to enter a real decision topic.
3. Ask participant to complete the yes/no flow with minimal guidance.
4. Capture timing from first click on **Start Session** to final summary visible.
5. Run the 30-second interview script.
6. Log one JSONL line for this session.

## Moderator rules
- Do not coach decisions.
- Do not change participant answers.
- If participant asks “what should I click?”, answer only process guidance.
- Record failures exactly; do not hide friction.

## What counts as completion
- Final summary block rendered with gate + confidence + meaning.
