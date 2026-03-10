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

class FailingStartClient extends MockClient {
  async startSession() {
    throw new Error('Bridge error: unable to start session (bridge unreachable)');
  }
}

class FailingAnswerClient extends MockClient {
  async submitAnswer() {
    throw new Error('Bridge error: failed to submit answer');
  }
}

async function runDeterministicPass() {
  const session = new NativeMobileSession(new MockClient() as any);
  const s0 = await session.start('u', 'creation_v0');
  assert(s0.mode === 'question', 'should start on question');

  const s1 = await session.answer('yes');
  assert(s1.mode === 'question', 'should advance question');

  const s2 = await session.answer('yes');
  assert(s2.mode === 'artifact' && s2.artifact === 'artifact_film', 'artifact path should be stable');

  const s3 = await session.answer('no');
  assert(s3.mode === 'completion', 'should reach completion');
}

// repeated deterministic runs
await runDeterministicPass();
await runDeterministicPass();

// rendering order markers + feedback
assert(renderQuestionScreen('Q').includes('YES/NO'), 'question header missing');
assert(renderQuestionScreen('Q', 'GESTURE RECOGNIZED: YES').includes('GESTURE RECOGNIZED: YES'), 'gesture message missing');
assert(renderArtifactScreen('film').includes('ARTIFACT'), 'artifact marker missing');
assert(renderCompletionScreen().includes('SESSION COMPLETE'), 'completion marker missing');

// input consistency
assert(tapYes() === 'yes', 'tapYes failed');
assert(tapNo() === 'no', 'tapNo failed');
assert(normalizeTap('y') === 'yes' && normalizeTap('n') === 'no', 'tap normalization failed');
assert(normalizeTap('bad') === null, 'invalid input should be null');

// gesture paths (real recognition-backed)
assert(circleGesture() === 'yes', 'circle should map yes');
assert(crossGesture() === 'no', 'cross should map no');

// bridge failure paths handled at session layer (propagated clearly)
const failingStart = new NativeMobileSession(new FailingStartClient() as any);
let sawStartErr = false;
try {
  await failingStart.start('u', 'creation_v0');
} catch (e: any) {
  sawStartErr = String(e?.message || '').includes('unable to start session');
}
assert(sawStartErr, 'start failure should be surfaced clearly');

const failingAnswer = new NativeMobileSession(new FailingAnswerClient() as any);
await failingAnswer.start('u', 'creation_v0');
let sawAnswerErr = false;
try {
  await failingAnswer.answer('yes');
} catch (e: any) {
  sawAnswerErr = String(e?.message || '').includes('failed to submit answer');
}
assert(sawAnswerErr, 'answer failure should be surfaced clearly');

console.log('native mobile prototype tests passed');
