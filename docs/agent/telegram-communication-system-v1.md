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

### 1) Morning Intelligence Report
Purpose: provide a daily strategic summary before active hours.

Schedule:
- **06:08 AM EST**

Required contents:
- system status
- active projects
- signals detected in last 24h
- risks
- decisions required
- next observation window

### 2) Heartbeat
Purpose: confirm active system state and workstreams.

Schedule:
- every hour at minute `:08`
- active window: **06:08 AM – 09:08 PM EST**

Heartbeat format:
```
[NOAH] 🔋🛶 | 🖥️ YES_NO 🧭 ORBIS 🌱 Grants
```

### 3) Action Required
Purpose: request human decision/review.

Format:
```
[DOC] ⚫ Yann — please review this document.
https://docs.google.com/xxxxx
```

### 4) Prototype Ready
Purpose: notify deliverable readiness.

Format:
```
[ORBIS] 🟢 Yann — prototype ready.
Open:
https://github.com/xxxxx
```

### 5) Discovery Signal
Purpose: notify high-value research signal.

Format:
```
[DISCOVERY] 💡 Potential interaction signal detected.
Report prepared.
```

### 6) Alert
Purpose: notify risks/blockers/system issues.

Format:
```
[STABILITY] 🚧 Dependency risk detected.
```

### 7) Completion
Purpose: notify task/project completion.

Format:
```
[ARCH] 🔵 Architecture review complete.
```

### 8) Full Execution Mode
Purpose: acknowledge autonomous high-throughput execution mode and set notification boundaries.

Format:
```
[NOAH] Copy that. Full execution mode engaged. ⚡

Operating constraints:
• autonomous cycles
• no approval waits
• review/merge/close sequencing
• continuous stability + validation checks
• immediate corrective action on any regression

I will only notify on:
1) milestone reached
2) blocker detected
3) critical decision/risk

No stop. Continuous forward. 🛶
```

## Quiet hours
Between:
- **10:00 PM – 06:08 AM EST**

Rule:
- do not send any messages during quiet hours.

## Alert priority rules
The following signals are high-priority events:
- ☎️ human intervention required
- 🚧 risk detected
- 🛑 blocked task
- 💡 discovery signal
- 🟢 prototype ready
- Full Execution Mode exception notifications (milestone reached, blocker detected, critical decision/risk)

During quiet hours, these events are not sent immediately; they must be logged and included in the next Morning Intelligence Report.

## Event storage and next-report rule
All alerts, discoveries, and notable events must be stored and summarized in the next Morning Intelligence report.

Summary expectation:
- event type
- time window
- impact
- required follow-up/decision

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
