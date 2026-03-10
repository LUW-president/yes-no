import {
  __getProfile,
  __getSessionEventStream,
  __resetForTests,
  getSessionState,
  recordAnswer,
  startSession,
} from '../orchestrator';

function assert(cond: boolean, msg: string) {
  if (!cond) throw new Error(msg);
}

__resetForTests();

// session start + first question
const started = startSession('u_test', 'creation_v0');
assert(started.session.status === 'active', 'session should start active');
assert(started.question_text.length > 0, 'first question should exist');

// deterministic transition to next question
const r1 = recordAnswer(started.session, 'yes');
assert(r1.kind === 'question', 'first answer should move to next question');

// deterministic transition to artifact (q_image yes)
const r2 = recordAnswer(r1.session, 'yes'); // from q_art -> q_image
assert(r2.kind === 'question', 'second answer should move to q_image');
const r3 = recordAnswer(r2.session, 'yes'); // q_image -> artifact_image
assert(r3.kind === 'artifact', 'third answer should trigger artifact');

// session close path (new session no -> end)
const started2 = startSession('u_test_2', 'creation_v0');
const endRes = recordAnswer(started2.session, 'no');
assert(endRes.kind === 'end', 'no on q_create should end session');
assert(getSessionState(started2.session.session_id).status === 'completed', 'session should be completed');

// memory engine updates during session
const p = __getProfile('u_test');
assert(p.event_count > 0, 'profile event_count should update');
assert(p.signals.art_interest >= 0, 'profile should contain deterministic signal updates');

// event stream integration checks for new protocol events
const stream = __getSessionEventStream(started.session.session_id);
assert(stream.length > 0, 'event stream should not be empty');
assert(stream.every((e, i) => e.sequence === i + 1), 'event stream sequence must be monotonic');
assert(stream.some((e) => e.event_type === 'answer.submitted'), 'answer.submitted should be emitted');
assert(stream.some((e) => e.event_type === 'session.updated'), 'session.updated should be emitted');

console.log('session orchestrator tests passed');
