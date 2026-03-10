# Local Demo Runbook (Baseline v0)

## Goal
Run a clean local YES/NO demo showing deterministic engine flow and adapter-driven reference interfaces.

## 1) Start bridge (if needed)
Use this when running adapter-backed flows:
```bash
npm run bridge:dev
```
Expected:
- server starts on `http://localhost:3000`
- endpoints available: `/session/start`, `/session/answer`, `/session/:session_id`

## 2) Run deterministic demo
```bash
npm run yesno:demo
```
Expected flow:
- `DEMO START`
- question/answer progression
- `ARTIFACT PROPOSED`
- `SESSION COMPLETE`
- `EVENT TRACE`

## 3) Run mobile reference app
```bash
npm run mobile:reference
```
Expected flow:
- mobile-style question screen
- YES/NO input accepted (`yes/no`, `y/n`)
- next question or artifact state
- completion rendering when session ends

## 4) Run web reference app
```bash
npm run web:reference
```
Expected flow:
- web-style question screen
- YES/NO input accepted (`yes/no`, `y/n`)
- next question or artifact state
- completion rendering when session ends

## 5) Success criteria
A run is successful when:
- no runtime errors in CLI/adapter flow
- artifact path is reachable
- session completion state is reachable
- outputs remain deterministic for fixed input paths
