# interaction-timing-spec-v0

## purpose
Define temporal behavior for the YES/NO experience, including pacing between questions, gesture recognition timing, artifact reveal timing, and intentional silence intervals.

## timing philosophy
- timing must reinforce calm, focus, and clarity
- pacing should feel deliberate, not rushed
- temporal consistency supports trust and usability

## question pacing model
- show one question at a time
- after each answer, apply a short transition pause before next state
- maintain consistent pacing rhythm across session steps

## gesture recognition timing window
- begin recognition immediately on touch/gesture start
- allow a bounded capture window for circle/cross completion
- resolve quickly once confidence threshold is reached
- if unresolved within window, fail gracefully to fallback input

## artifact reveal timing
- after artifact-triggering answer, apply brief reveal delay
- then present artifact state card clearly
- avoid abrupt flashing transitions

## session completion timing
- after terminal transition, show completion state with short settle delay
- keep completion screen visible long enough for acknowledgement

## silence as UX element
- silence is intentional between states and after key transitions
- avoid excessive audio/visual interruptions
- preserve contemplative rhythm aligned with product philosophy

## fallback timing behavior
- on gesture timeout/failure, immediately expose tap YES/NO fallback
- fallback should not introduce long dead periods
- recovery timing should preserve session flow continuity

## integration with orchestrator
- timing layer wraps UI interaction around orchestrator transitions
- no change to orchestrator decision logic
- outputs still normalize strictly to yes/no before submission
