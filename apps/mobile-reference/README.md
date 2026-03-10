# Mobile Reference App v0

## Purpose
A lightweight mobile-style console interface that validates YES/NO interaction flow via the mobile adapter.

## Run locally
```bash
npx tsx apps/mobile-reference/app.ts
```

## Interaction model
- Displays one question at a time
- Accepts `yes/no` or `y/n`
- Submits normalized answers through the mobile adapter
- Renders next question, artifact proposal, or completion screen

## Relation to future native mobile UI
This app is a reference interaction harness. Future native UI (iOS/Android) can reuse the same adapter/session lifecycle with richer visuals and gesture input.
