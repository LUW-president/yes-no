# native-mobile-prototype-plan-v0

## purpose
Define the first runnable native mobile prototype that demonstrates the YES/NO interaction model using the existing engine, bridge, and mobile adapter.

## prototype scope
- single-user local prototype flow
- one-question-at-a-time binary interaction
- artifact proposal and completion states
- bridge-backed session control via adapter

## minimal screen architecture
- Question Screen
- Artifact Proposal Screen
- Session Complete Screen
- optional transient fallback state for delayed responses

## gesture and tap input support
- tap YES/NO supported in prototype baseline
- gesture circle/cross can be included as experimental input path
- all inputs normalize strictly to `yes` / `no`

## bridge communication model
- prototype UI communicates only through mobile adapter
- mobile adapter communicates with bridge endpoints:
  - `POST /session/start`
  - `POST /session/answer`
  - `GET /session/:session_id`
- no direct engine calls from UI layer

## session lifecycle in prototype
1. start session (`creation_v0`)
2. render current question
3. capture yes/no input
4. submit answer through adapter
5. render next question or artifact
6. render completion state

## artifact display model
- show artifact type in dedicated artifact state view
- present binary accept/reject action pattern for prototype continuity
- preserve minimal black-screen visual language

## prototype success criteria
- deterministic question progression
- reliable yes/no input normalization
- stable bridge communication for full session
- artifact state reachable and renderable
- completion state reachable without errors

## limitations of prototype
- not production mobile app
- minimal visual design and no advanced transitions
- limited persistence/recovery behavior
- no full gesture recognition guarantees in v0 plan

## next iteration milestones
- stabilize native interaction latency
- formalize gesture recognition implementation
- add artifact decision persistence
- add lightweight telemetry for session diagnostics
