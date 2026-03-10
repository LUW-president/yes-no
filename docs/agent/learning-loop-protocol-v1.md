# Learning Loop Protocol v1

## 1) Incident capture format
Each incident note should include:
- context
- trigger
- observed failure
- impact
- immediate workaround
- root-cause hypothesis

## 2) Repeated-failure detection rules
Promote to repeated issue when:
- same failure appears in >=2 independent sessions
- same workaround recurs with no durable fix
- issue blocks core demo/validation path repeatedly

## 3) Conversion path
incident -> runbook fix -> policy update

- runbook fix: immediate operational stability guidance
- policy update: governance or quality gate strengthening when patterns persist

## 4) Memory hygiene rules
- record only actionable and verified patterns
- avoid storing noisy one-off opinions as durable policy
- tag entries by confidence (high/medium/low)

## 5) What never gets auto-learned
- product philosophy changes
- roadmap commitments
- sharing scope expansions
- architecture shifts without explicit approval
