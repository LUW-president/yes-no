# Vercel deploy guide — YES/NO V1 prototype wrapper

> Prototype only (non-production). This wrapper is deterministic, does not add ML, and does not introduce new persistence.

## What is deployed

- Single Node serverless entrypoint: `apps/web-v1/vercel.ts`
- Browser UI on `/`
- API endpoints proxied to existing bridge/session controllers under `/api/*`

## Exact Vercel project settings

- **Framework Preset:** `Other`
- **Root Directory:** `.`
- **Install Command:** `npm install`
- **Build Command:** *(leave empty)*
- **Output Directory:** *(leave empty)*
- **Development Command:** `npm run web:v1`

## Environment variables

No environment variables are required for this prototype wrapper.

## Local verification

```bash
npm run web:v1
```

Then open `http://localhost:3000` and run a session with Yes/No responses.

## Deterministic smoke path (fixed answers)

```bash
npm run test:web-v1-smoke
```

This executes a fixed answer path (`yes, yes, yes`) and verifies summary fields.

## Notes

- Existing CLI/mobile/reference flows are unchanged.
- Session/profile storage remains in-memory and prototype-scoped.
- Do not use this wrapper as production infrastructure.
