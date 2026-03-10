# Pilot Feedback Synthesis v0 — YES/NO

## Purpose
Define a concise method to synthesize multiple controlled pilot feedback logs into clear, low-risk product decisions without scope creep.

## Why this document now
The project now has pilot execution and feedback logging templates; this adds the missing step that turns raw notes into disciplined decisions.

## Inputs
Use only completed artifacts from controlled sessions:
- `ops/feedback/feedback-log-template-v0.md` outputs
- `docs/product/pilot-session-summary-template-v0.md` outputs
- `docs/product/internal-review-checklist-v0.md` status context
- `docs/product/external-share-readiness-v0.md` constraints

## Synthesis cadence
- Batch review every 3–5 pilot sessions
- Emergency review only for repeated critical credibility/runtime failures

## Signal model
Classify findings into three buckets:
1. Repeated high-signal (seen across multiple sessions)
2. Single-session directional (watchlist)
3. Noise / preference-only (no action)

## Decision thresholds
Promote feedback to action only when:
- repeated in at least 2+ independent sessions, and
- impacts clarity, trust, demo stability, or core interaction understanding, and
- can be addressed without violating current roadmap constraints

## Non-negotiable filters
Do not action feedback that:
- changes YES/NO core philosophy
- introduces non-binary interaction scope
- frames roadmap items as current features
- adds broad new product surface during prototype stage

## Output format (per synthesis cycle)
For each accepted action candidate:
- Issue summary
- Evidence (sessions/quotes)
- Classification (keep/investigate)
- Proposed low-risk action
- Scope impact (low/medium)
- Recommendation (apply now / queue)

## Guardrails against scope creep
- no changes from single-session pressure
- no ad-hoc feature commitments during demos
- preserve deterministic demo path and limitation disclosures

## Expected deliverable
A short internal “Pilot Feedback Synthesis Note” with:
- top repeated signals
- explicit non-actions
- recommended next low-risk refinements
