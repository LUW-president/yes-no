# NOAH Telegram Communication System v1

## Purpose
Establish a standardized communication protocol for Noah and all agents to send clear, concise, and structured notifications through Telegram.

Messages must be mobile-readable and immediately indicate:
- which agent is speaking
- system state
- active project
- required human action (if any)

This protocol applies to:
- Noah
- Architecture Agent
- Documentation Agent
- Stability Agent
- ORBIS Agent
- Discovery Agent

## Agent identification rules
Every message must begin with the speaking agent tag.

Format:
- `[AGENT]`

Valid agent tags:
- `[NOAH]`
- `[ORBIS]`
- `[ARCH]`
- `[DOC]`
- `[STABILITY]`
- `[DISCOVERY]`

Example:
- `[ORBIS] 🧠 Research analysis running.`

## Emoji signal language

### System Activity
- 🔋 system active
- 🪫 system idle
- 🧠 deep analysis
- ⚡ heavy processing
- 🛶 running efficiently

### Projects / Context
- 🖥️ software project
- 🧭 ORBIS research
- 🏠 real estate project
- 🌱 non-profit / grants
- 📊 data analysis

### Development Status
- 🚦 prototype stage
- 🔴 no prototype
- 🟡 prototype in progress
- 🟢 prototype ready
- 🔵 project completed

### Alerts
- ☎️ human intervention required
- ⚫ review requested
- 🚧 risk detected
- ⚠️ warning
- 🛑 blocked task

### Signals
- 💡 discovery signal detected

### Communication
- 📎 document ready
- 📬 report delivered
- 🔜 information incoming

## Message formats

### Base format
`[AGENT] EMOJI MESSAGE`
`(optional explanation)`
`(optional link)`

### Example
`[DOC] ⚫ Yann — please review this document.`
`https://docs.google.com/xxxxx`

## Message types

### 1) Heartbeat
Purpose: confirm active system state and workstreams.

Frequency: every 2 hours.

Full format:
```
[NOAH] 🔋🛶

Active workstreams
🖥️ YES_NO
🧭 ORBIS
🏠 RealEstate
🌱 GrantApplications

Signals: none

Next observation: 2h
```

Compact format:
```
[NOAH] 🔋🛶 | 🖥️ YES_NO 🧭 ORBIS 🌱 Grants | Next 2h
```

### 2) Action Required
Purpose: request human decision/review.

Format:
```
[DOC] ⚫ Yann — please review this document.
https://docs.google.com/xxxxx
```

### 3) Prototype Ready
Purpose: notify deliverable readiness.

Format:
```
[ORBIS] 🟢 Yann — prototype ready.
Open:
https://github.com/xxxxx
```

### 4) Discovery Signal
Purpose: notify high-value research signal.

Format:
```
[DISCOVERY] 💡 Potential interaction signal detected.
Report prepared.
```

### 5) Alert
Purpose: notify risks/blockers/system issues.

Format:
```
[STABILITY] 🚧 Dependency risk detected.
```

### 6) Completion
Purpose: notify task/project completion.

Format:
```
[ARCH] 🔵 Architecture review complete.
```

## Heartbeat schedule
- Standard cadence: every 2 hours
- Must include current workstreams and next observation timing
- Use compact format when possible for mobile readability

## Alert priority rules
The following signals must be sent immediately (do not wait for heartbeat):
- ☎️ human intervention required
- 🚧 risk detected
- 🛑 blocked task
- 💡 discovery signal
- 🟢 prototype ready

## Mobile readability rule
Messages must be:
- short
- structured
- readable in under 3 seconds

Preferred compact pattern:
`[NOAH] 🔋🛶 | 🖥️ YES_NO 🧭 ORBIS 🌱 Grants`

## Examples
- `[ORBIS] 🧠 Running spatial interaction research.`
- `[DOC] ⚫ Yann — check this document.`
  `https://docs.google.com/xxxxx`
- `[DISCOVERY] 💡 ORBIS interaction signal detected.`
