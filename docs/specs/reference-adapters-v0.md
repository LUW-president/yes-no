# reference-adapters-v0

## purpose
Provide minimal client-side adapter stubs for mobile and web reference apps to consume the bridge API deterministically.

## adapter responsibilities
- abstract bridge API calls
- normalize request/response payloads
- expose simple session methods for UI layers

## mobile adapter stub design
- module: `apps/mobile-reference/adapter.ts`
- methods:
  - `startSession(userId, packId)`
  - `submitAnswer(sessionId, answer)`
  - `getSession(sessionId)`
- return typed bridge responses

## web adapter stub design
- module: `apps/web-reference/adapter.ts`
- same API as mobile adapter
- browser fetch implementation with identical contracts

## bridge API consumption model
- `POST /session/start`
- `POST /session/answer`
- `GET /session/:session_id`
- strict yes/no value contract

## session lifecycle in client
1. start session
2. render question
3. submit yes/no answer
4. render next question/artifact/end
5. poll/fetch state when needed

## future UI integration points
- black-screen question renderer
- gesture/tap input layer
- notification-triggered entry
- event-trace debug overlay (dev mode)
