import { formatTraceOutput } from '../trace';

function assert(cond: boolean, msg: string) {
  if (!cond) throw new Error(msg);
}

const output = formatTraceOutput('s_1', [
  { sequence: 3, event_type: 'session.updated', stage: 'question', answered_count: 1 },
  { sequence: 1, event_type: 'question.presented', question_id: 'q_1' },
  { sequence: 2, event_type: 'answer.submitted', answer: 'yes' },
] as any);

const lines = output.split('\n').filter(Boolean);
assert(lines[0].startsWith('SESSION TRACE'), 'missing header');
assert(lines[1].startsWith('1 question.presented'), 'line 1 must be first event');
assert(lines[2].startsWith('2 answer.submitted'), 'line 2 must be second event');
assert(lines[3].startsWith('3 session.updated'), 'line 3 must be third event');

console.log('trace command tests passed');
