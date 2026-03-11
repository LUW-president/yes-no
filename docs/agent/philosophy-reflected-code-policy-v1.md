# Philosophy-Reflected Code Policy v1

Goal: ensure YES/NO by SJ86 philosophy is reflected at every step of implementation.

## Mandatory PR checks
Every PR must explicitly confirm:

1. **Binary integrity**
   - Output/action resolution remains YES/NO.

2. **User sovereignty**
   - System does not decide for the user.
   - Final action remains user-confirmed YES/NO.

3. **Determinism**
   - Same input produces same behavior.

4. **Explainability**
   - Behavior can be clearly explained.

5. **Layer alignment**
   - Change aligns with 5-layer model (or does not violate it).

6. **Signal clarity**
   - Change reduces ambiguity/noise and improves preference-signal clarity.

## Merge rule
If any mandatory check fails or is left unaddressed, PR must not merge.

## Scope note
Prototype/non-production scope remains active.
