# Web Reference App v0

## Purpose
A lightweight web-oriented console interface validating YES/NO interaction flow via the web adapter.

## Run locally
```bash
npx tsx apps/web-reference/app.ts
```

## Interaction model
- Displays one question at a time
- Accepts `yes/no` or `y/n`
- Submits normalized answers through the web adapter
- Renders next question, artifact proposal, or completion screen

## Relation to future browser UI
This is a reference harness for interaction/state flow. Future browser UI can reuse this session+adapter pattern with richer rendering and events.
