# Vercel Deploy — V1 Prototype

Status: prototype / non-production.

## Vercel settings
- Framework Preset: Other
- Root Directory: `.`
- Install Command: `npm install`
- Build Command: *(empty)*
- Output Directory: *(empty)*
- Development Command: `npm run web:v1`
- Environment Variables: none

## Local verification
1. `npm run web:v1`
2. Open `http://localhost:3100`
3. `npm run test:web-v1-smoke`

## Expected behavior
- Start Session button creates a V1 session
- Yes/No answers progress session
- Final summary shows confidence + guard + gate + reason + expected effect

Prototype notice: not production-grade security/auth/telemetry.
