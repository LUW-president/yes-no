# Milestone Roadmap v1 — YES/NO

## current baseline summary
- Internal baseline v0 is complete and merged.
- Deterministic core stack is operational (protocol, question engine, memory engine, orchestrator).
- Interface/control surfaces are in place (CLI, demo, status dashboard, bridge, adapters, mobile/web reference apps).
- Product/UX foundation docs are established (native UI spec, gesture spec, timing spec, prototype plan).

## milestone 1: native mobile prototype
Goal:
- Deliver first runnable native mobile prototype demonstrating one-question YES/NO interaction.

Scope highlights:
- question screen, artifact screen, completion screen
- tap YES/NO support
- bridge + adapter integration path validated end-to-end

Exit criteria:
- session start/progression/completion on mobile prototype flow
- artifact state rendered reliably

## milestone 2: gesture recognition implementation
Goal:
- Implement first production-ready gesture recognition path for circle (YES) and cross (NO).

Scope highlights:
- gesture detection window + tolerance implementation
- mapping strictly to `yes`/`no`
- fallback tap path preserved

Exit criteria:
- stable gesture-to-answer mapping under defined timing constraints
- no additional signal types introduced

## milestone 3: first public demo build
Goal:
- Package a stable demo build suitable for external showing.

Scope highlights:
- curated deterministic demo path
- basic build/run documentation for external viewers
- polished but minimal interaction visuals

Exit criteria:
- reproducible demo execution without operator intervention
- clear narrative from question flow to artifact/completion

## milestone 4: developer SDK concept
Goal:
- Define and prototype a developer-facing YES/NO SDK concept.

Scope highlights:
- API surface concept for embedding question flows
- adapter/bridge integration guidance
- minimal sample integration patterns

Exit criteria:
- SDK concept doc + thin prototype proving embed model

## milestone 5: platform expansion
Goal:
- Expand YES/NO from reference product to platform layer.

Scope highlights:
- multi-surface strategy (mobile/web and future modalities)
- profile-aware decision flows
- extensible application patterns built on binary interaction core

Exit criteria:
- validated roadmap for broader platform rollout with preserved philosophy
