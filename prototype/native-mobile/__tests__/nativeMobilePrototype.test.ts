import { tapYes, tapNo } from '../input/tapInput';
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

// session starts
const session = new NativeMobileSession(new MockClient() as any);
const s0 = await session.start('u', 'creation_v0');
assert(s0.mode === 'question', 'should start on question');

// question screen renders
assert(renderQuestionScreen('Q').includes('YES/NO'), 'question screen header missing');

// tap input
assert(tapYes() === 'yes', 'tapYes failed');
assert(tapNo() === 'no', 'tapNo failed');

// gesture stubs
assert(circleGesture() === 'yes', 'circle should map yes');
assert(crossGesture() === 'no', 'cross should map no');

// progression
const s1 = await session.answer('yes');
assert(s1.mode === 'question', 'should advance to next question');

const s2 = await session.answer('yes');
assert(s2.mode === 'artifact', 'artifact screen should appear');
assert(renderArtifactScreen('film').includes('ARTIFACT'), 'artifact screen render failed');

const s3 = await session.answer('no');
assert(s3.mode === 'completion', 'completion screen should appear');
assert(renderCompletionScreen().includes('SESSION COMPLETE'), 'completion screen render failed');

console.log('native mobile prototype tests passed');
