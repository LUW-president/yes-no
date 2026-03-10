# native-mobile-prototype-implementation-v0

## purpose
Start the first actual runnable native-style prototype implementation for the YES/NO experience using the existing bridge, adapters, and interaction specifications as the implementation foundation.

## implementation scope
Included:
- runnable native-style prototype shell (minimal)
- question/artifact/completion screen implementations
- tap YES/NO interaction path
- gesture input stub path (non-production detection)
- bridge-backed session lifecycle

Excluded:
- production auth/account system
- push notifications
- production persistence guarantees
- analytics/instrumentation platform
- visual polish beyond prototype needs

## prototype architecture
Native-style UI layer  
↓  
mobile adapter layer (`adapters/mobile/mobileAdapter.ts`)  
↓  
reference bridge (`bridge/reference-app`)  
↓  
session orchestrator  
↓  
core engines (protocol/question/memory)

## screen implementation plan
Implement three core screens only:
1. Question Screen
2. Artifact Screen
3. Session Complete Screen

All transitions driven by adapter state responses.

## tap interaction plan
- implement YES and NO tap zones/buttons
- normalize tap actions directly to `yes` or `no`
- submit through mobile adapter only

## gesture stub integration plan
- add gesture input adapter interface/stub
- map simulated circle input -> `yes`
- map simulated cross input -> `no`
- keep fallback tap path always available

## bridge communication plan
Use adapter-mediated calls only:
- `POST /session/start`
- `POST /session/answer`
- `GET /session/:session_id`

No direct bridge calls from screen components.

## session lifecycle implementation plan
1. start session (`creation_v0`)
2. render question
3. collect tap/gesture-stub input
4. submit answer via adapter
5. render next question, artifact, or completion
6. support deterministic retry on transient fetch failure

## artifact screen implementation plan
- display artifact label/type clearly
- show binary prompt: "Accept this artifact?"
- route YES/NO response through same normalized answer path

## completion screen implementation plan
- display `SESSION COMPLETE`
- optional binary continuation prompt for prototype loop (if enabled)
- no additional navigation complexity

## local testing plan
- unit tests for state transitions and input normalization
- integration smoke run with local bridge process
- deterministic path validation (question -> artifact -> completion)
- regression run against existing repository test suite

## prototype success criteria
- runnable prototype launches locally
- session starts and progresses through adapter+bridge
- tap input fully functional
- gesture stub path mapped correctly to yes/no
- artifact screen reachable and interactive
- completion screen reachable without runtime errors
