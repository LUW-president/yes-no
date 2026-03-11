import { __resetForTests, recordAnswer, startSession } from '../orchestrator';
import { buildSessionDecisionSummary } from '../v1Summary';

function assert(cond: boolean, msg: string) {
  if (!cond) throw new Error(msg);
}

__resetForTests();

const started = startSession('v1_user', 'creation_v0');
const r1 = recordAnswer(started.session, 'yes');
if (r1.kind === 'question') {
  const r2 = recordAnswer(r1.session, 'no');
  if (r2.kind === 'question') {
    recordAnswer(r2.session, 'yes');
  }
}

const summary = buildSessionDecisionSummary(started.session.session_id);

assert(summary.session_id === started.session.session_id, 'session id mismatch');
assert(typeof summary.final_confidence === 'number', 'final confidence should be number');
assert(summary.explanation.length > 0, 'explanation should not be empty');
assert(['CONTINUE', 'SLOW_DOWN', 'REVIEW'].includes(summary.guard.final_status), 'guard status invalid');
assert(['GO', 'REVIEW', 'NO_GO'].includes(summary.gate.result), 'gate result invalid');
assert(['stabilize', 'clarify', 'confirm'].includes(summary.improve.expected_effect), 'improve effect invalid');

console.log('v1 summary tests passed');
