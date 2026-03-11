# Multi-Agent Orchestration Policy v1

## Agent roster
- Noah (orchestrator)
- Architecture Agent
- Documentation Agent
- Stability Agent
- ORBIS Agent
- Discovery Agent
- Build Agent

## 1) Invocation rules
- Architecture Agent: boundary checks, layer integrity, drift detection
- Documentation Agent: coherence, references, readability, consistency
- Stability Agent: command/run reliability, test-surface health
- ORBIS Agent: spatial research and exploratory concept cycles
- Discovery Agent
- Build Agent: cross-cycle signal synthesis and prototype-candidate extraction

## 2) Parallel vs sequential analysis
- Parallel: independent audits across architecture/docs/stability/research domains
- Sequential: synthesis and decision staging under Noah after all inputs are collected

## 3) Conflict resolution protocol
- Noah resolves conflicts by priority order:
  1. safety/governance constraints
  2. implemented-runtime truth
  3. documented architecture boundaries
  4. optional research direction
- unresolved conflicts escalate to human approval

## 4) Synthesis format
All cycle outputs should include:
- findings by agent
- common signals
- risks
- low-risk proposals
- items requiring approval

## 5) Handoff contracts
- agents produce analysis/proposals only unless explicitly authorized otherwise
- Noah validates scope, applies gates, and manages PR workflow
- no direct agent-driven runtime modification without explicit approval

## Reference pipeline
Strategic Intelligence -> Architecture -> Build -> Stability -> Documentation -> Noah

## Ordered execution source of truth
See: `docs/agent/agent-execution-order-v1.md`
