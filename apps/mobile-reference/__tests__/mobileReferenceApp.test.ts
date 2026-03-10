import { normalizeInput, tapNo, tapYes } from '../input';
import { renderArtifact, renderComplete, renderQuestion } from '../render';
import { MobileReferenceSession } from '../session';

function assert(cond: boolean, msg: string) {
  if (!cond) throw new Error(msg);
}

class MockAdapter {
  private idx = 0;
  async startSession() {
    return { session_id: 'm1', question: 'Would you like to create something?', status: 'active' };
  }
  async submitAnswer(_sid: string, _answer: 'yes' | 'no') {
    this.idx += 1;
    if (this.idx === 1) return { session_id: 'm1', question: 'Would you like to create an art project?', status: 'active' };
    if (this.idx === 2) return { session_id: 'm1', artifact: 'artifact_film', status: 'active' };
    return { session_id: 'm1', status: 'completed' };
  }
  async getSessionState(_sid: string) {
    if (this.idx === 1) return { session_id: 'm1', question: 'Would you like to create an art project?', status: 'active' };
    if (this.idx === 2) return { session_id: 'm1', question: '', artifact: 'artifact_film', status: 'active' };
    return { session_id: 'm1', question: '', status: 'completed' };
  }
}

// input normalization
assert(normalizeInput('yes') === 'yes', 'yes normalization failed');
assert(normalizeInput('y') === 'yes', 'y normalization failed');
assert(normalizeInput('no') === 'no', 'no normalization failed');
assert(normalizeInput('n') === 'no', 'n normalization failed');
assert(tapYes() === 'yes', 'tap yes failed');
assert(tapNo() === 'no', 'tap no failed');

// rendering
assert(renderQuestion('Q?').includes('QUESTION\nQ?'), 'question render failed');
assert(renderArtifact('film').includes('ARTIFACT PROPOSED\nfilm'), 'artifact render failed');
assert(renderComplete().includes('SESSION COMPLETE'), 'complete render failed');

// session start + progression + artifact + completion
const session = new MobileReferenceSession(new MockAdapter() as any);
const s0 = await session.start('u', 'creation_v0');
assert(s0.session_id === 'm1', 'session start failed');
assert(!!s0.question, 'missing initial question');

const s1 = await session.answer('yes');
assert(!!s1.question && s1.status === 'active', 'question progression failed');

const s2 = await session.answer('yes');
assert(s2.artifact === 'artifact_film', 'artifact path failed');

const s3 = await session.answer('no');
assert(s3.status === 'completed', 'session completion failed');

console.log('mobile reference app tests passed');
