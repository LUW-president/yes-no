# Vercel deploy guide — YES/NO V1 prototype wrapper

> Prototype only (non-production). This wrapper is deterministic, does not add ML, and does not introduce new persistence.

## Goal

Give Noah bot a **fully autonomous** deployment flow for Vercel with:
- zero dashboard clicking after initial setup,
- repeatable preview deployments on each push/PR,
- controlled production promotion from `main`.

## What is deployed

- Single Node serverless entrypoint: `apps/web-v1/vercel.ts`
- Browser UI on `/`
- API endpoints proxied to existing bridge/session controllers under `/api/*`

## One-time setup (human)

Run these steps once so Noah bot can deploy without manual intervention.

### 1) Create/import Vercel project

In Vercel:
- **Framework Preset:** `Other`
- **Root Directory:** `.`
- **Install Command:** `npm install`
- **Build Command:** *(leave empty)*
- **Output Directory:** *(leave empty)*
- **Development Command:** `npm run web:v1`

### 2) Link repository to Vercel project

From repo root:

```bash
vercel link --yes
```

This creates `.vercel/project.json` locally for the linked project.

### 3) Create a Vercel token for bot use

In Vercel account settings:
- create a token with deploy permissions,
- store it as GitHub Actions secret: `VERCEL_TOKEN`.

Also add:
- `VERCEL_ORG_ID`
- `VERCEL_PROJECT_ID`

You can copy org/project IDs from `.vercel/project.json` after linking.

### 4) Ensure branch strategy

- `main` => production deployment source
- feature branches / PRs => preview deployments

## Autonomous deploy workflow (Noah bot)

### Preview deployment (every PR or branch push)

Noah bot runs:

```bash
vercel pull --yes --environment=preview --token=$VERCEL_TOKEN
vercel deploy --token=$VERCEL_TOKEN
```

Result:
- unique preview URL for reviewers,
- no production impact.

### Production deployment (`main` only)

Noah bot runs:

```bash
vercel pull --yes --environment=production --token=$VERCEL_TOKEN
vercel deploy --prod --token=$VERCEL_TOKEN
```

Result:
- production alias update,
- deterministic release path.

## Recommended GitHub Actions automation

Create two workflows:

1. `vercel-preview.yml` on pull requests/push to non-main branches
2. `vercel-production.yml` on push to `main`

Minimal core steps in both workflows:

```bash
npm ci
npm run test:web-v1-smoke
npx vercel pull --yes --environment=<preview|production> --token=${VERCEL_TOKEN}
npx vercel deploy [--prod] --token=${VERCEL_TOKEN}
```

## Local verification before bot deploy

```bash
npm run web:v1
```

Then open `http://localhost:3000` and run a session with Yes/No responses.

Deterministic smoke path:

```bash
npm run test:web-v1-smoke
```

This executes a fixed answer path (`yes, yes, yes`) and verifies summary fields.

## Rollback

If a deploy regresses behavior:

1. Open Vercel project deployments.
2. Promote the previous known-good deployment.
3. Re-run smoke test against restored URL.

(If desired, Noah bot can also trigger rollback with Vercel CLI by promoting a previous deployment ID.)

## Guardrails

- Existing CLI/mobile/reference flows remain unchanged.
- Session/profile storage remains in-memory and prototype-scoped.
- Do not treat this wrapper as production-grade architecture.
- Keep the Yes/No deterministic interaction model unchanged.
