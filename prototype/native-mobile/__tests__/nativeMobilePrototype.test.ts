import { tapYes, tapNo, normalizeTap } from '../input/tapInput';
import { circleGesture, crossGesture } from '../input/gestureStub';
import { renderQuestionScreen } from '../screens/questionScreen';
import { renderArtifactScreen } from '../screens/artifactScreen';
import { renderCompletionScreen } from '../screens/completionScreen';
import { NativeMobileSession } from '../session';

function assert(cond: boolean, msg: string) {
  if (!cond) throw new Error(msg);
}

class MockClient {
  step = 0;
  async startSession() {
    return { session_id: 'p1', question: 'Would you like to create something?' };
  }
  async submitAnswer(_sid: string, _ans: 'yes' | 'no') {
    this.step += 1;
    if (this.step === 1) return { session_id: 'p1', next_question: 'Would you like to create an art project?' };
    if (this.step === 2) return { session_id: 'p1', artifact_proposed: 'artifact_film' };
    return { session_id: 'p1', session_complete: true };
  }
  async getSessionState() {
    return { session_id: 'p1', status: 'active', current_question: 'fallback question' };
  }
}

async function runDeterministicPass(useGesture = false) {
  const session = new NativeMobileSession(new MockClient() as any);
  const s0 = await session.start('u', 'creation_v0');
  assert(s0.mode === 'question', 'should start on question');

  const first = await session.answer(useGesture ? circleGesture() : 'yes');
  assert(first.mode === 'question', 'should advance question');

  const second = await session.answer(useGesture ? circleGesture() : 'yes');
  assert(second.mode === 'artifact' && second.artifact === 'artifact_film', 'artifact path should be stable');

  const third = await session.answer(useGesture ? crossGesture() : 'no');
  assert(third.mode === 'completion', 'should reach completion');
}

// repeated deterministic runs (tap and gesture-backed)
await runDeterministicPass(false);
await runDeterministicPass(false);
await runDeterministicPass(true);

assert(renderQuestionScreen('Q').includes('YES/NO'), 'question header missing');
assert(renderQuestionScreen('Q', 'GESTURE RECOGNIZED: YES').includes('GESTURE RECOGNIZED: YES'), 'gesture message missing');
assert(renderArtifactScreen('film').includes('ARTIFACT'), 'artifact marker missing');
assert(renderCompletionScreen().includes('SESSION COMPLETE'), 'completion marker missing');

assert(tapYes() === 'yes', 'tapYes failed');
assert(tapNo() === 'no', 'tapNo failed');
assert(normalizeTap('y') === 'yes' && normalizeTap('n') === 'no', 'tap normalization failed');
assert(normalizeTap('bad') === null, 'invalid input should be null');

console.log('native mobile prototype tests passed');
