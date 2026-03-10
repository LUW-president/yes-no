# Autonomous Quality Gates v1

## Mandatory pre-PR gates
1. **Doc/runtime scope check**
   - confirm planned diff does not exceed approved scope
2. **Dependency drift check**
   - verify no unintended dependency changes
3. **Command/path validation**
   - verify documented run paths match current repo state
4. **Link/reference integrity**
   - detect broken internal docs links and stale references
5. **Concept-vs-implementation consistency**
   - prevent conceptual docs from implying shipped capability
6. **Sharing-posture compliance**
   - ensure external/public language stays within approved posture

## Cannot-merge conditions
- runtime behavior changed in docs-only phase
- dependency updates without approval
- contradictory architecture claims introduced
- sharing posture expanded without approval
- unresolved critical validation failures

## Must-escalate conditions
- ambiguous instruction with potential scope impact
- conflicts between active governance docs
- unresolved concept/implementation boundary uncertainty
- evidence of architectural drift requiring policy-level decision
