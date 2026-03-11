import { applyAnswer, bootstrapSession, initialState } from '../lib/session';
import { BridgeApi } from '../lib/api';

function assert(cond: boolean, msg: string) {
  if (!cond) throw new Error(msg);
}

class MockApi extends BridgeApi {
  private step = 0;
  constructor() {
    super('http://mock.local');
  }
  async startSession() {
    return { session_id: 's1', question: 'Would you like to create something?' };
  }
  async submitAnswer(_session_id: string, _answer: 'yes' | 'no') {
    this.step += 1;
    if (this.step === 1) return { next_question: 'Would you like to create an art project?' };
    if (this.step === 2) return { artifact_proposed: 'artifact_film' };
    return { session_complete: true };
  }
  async getSummary() {
    return {
      session_id: 's1',
      final_confidence: 0.72,
      guard_status: 'CONTINUE' as const,
      gate_result: 'GO' as const,
      primary_reason: 'CONSISTENCY_HIGH',
      expected_effect: 'confirm' as const,
    };
  }
}

async function main() {
  const init = initialState();
  assert(init.mode === 'launch', 'app should bootstrap in launch state');

  const api = new MockApi();
  const s0 = await bootstrapSession(api as any, 'u', 'creation_v0');
  assert(s0.mode === 'question', 'session start should return question state');
  if (s0.mode === 'question') assert(!!s0.live_summary, 'question state should include live summary');

  const s1 = await applyAnswer(api as any, s0, 'yes');
  assert(s1.mode === 'question', 'yes/no submission should move to next question');
  if (s1.mode === 'question') assert(!!s1.live_summary, 'next question should keep live summary');

  const s2 = await applyAnswer(api as any, s1, 'yes');
  assert(s2.mode === 'artifact', 'basic state progression should reach artifact state');
  if (s2.mode === 'artifact') assert(!!s2.live_summary, 'artifact state should include live summary');

  const s3 = await applyAnswer(api as any, s2, 'yes');
  assert(s3.mode === 'completion', 'basic state progression should reach completion state');
  if (s3.mode === 'completion') {
    assert(!!s3.summary, 'completion should include summary');
    assert(s3.summary?.gate_result === 'GO', 'summary gate result mismatch');
  }

  console.log('expo shell tests passed');
}

main().catch((e) => {
  console.error(e?.message || e);
  process.exit(1);
});
