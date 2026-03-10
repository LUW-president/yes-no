# Concept-to-Production Promotion Framework v1

## Promotion stages
1. Concept
2. Research experiment
3. Prototype
4. Controlled pilot
5. Production candidate

## Stage requirements

### 1) Concept
- required evidence: coherent concept definition + boundaries
- blocking risks: unclear value, unclear boundaries
- required docs: concept doc + constraints
- required tests: none (analysis-only)
- approver: Noah + human sponsor

### 2) Research experiment
- required evidence: measurable experiment hypotheses
- blocking risks: no signal model, privacy ambiguity
- required docs: research cycle report
- required tests: analysis-level validation logic only
- approver: Noah + human sponsor

### 3) Prototype
- required evidence: bounded implementation plan, fallback behavior, deterministic path
- blocking risks: unstable core loop, scope creep
- required docs: prototype spec + runbook + limitation disclosure
- required tests: core path and failure-path checks
- approver: human approval required

### 4) Controlled pilot
- required evidence: repeatable demo + feedback protocol
- blocking risks: unclear disclosures, inconsistent demos
- required docs: pilot checklist, feedback template, sharing posture docs
- required tests: pre-pilot command/test checklist
- approver: human approval required

### 5) Production candidate
- required evidence: stability, security, operability, support plan
- blocking risks: unresolved critical reliability/security issues
- required docs: production-readiness set
- required tests: expanded integration/regression/security checks
- approver: human-only gate

## ORBIS example
Current ORBIS status:
- stage: Concept / Research experiment
- not implemented in runtime
- any promotion to Prototype requires explicit human approval and scoped implementation plan
