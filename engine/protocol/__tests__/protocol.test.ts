import { createEvent, InMemoryEventStore, validateEvent } from '../index';

function assert(condition: boolean, message: string) {
  if (!condition) throw new Error(message);
}

function assertThrows(fn: () => void, message: string) {
  let thrown = false;
  try { fn(); } catch { thrown = true; }
  if (!thrown) throw new Error(message);
}

const base = {
  event_id: 'evt_1',
  timestamp: new Date().toISOString(),
  session_id: 's_1',
  user_id: 'u_1',
};

// event creation
const e1 = createEvent({
  ...base,
  event_type: 'question.presented',
  question_id: 'q_1',
  question_text: 'Would you like to create something?',
  channel: 'push',
});
assert(e1.event_type === 'question.presented', 'event creation failed');

// validation: invalid event_type
assertThrows(
  () => validateEvent({ ...base, event_type: 'bad.type' } as any),
  'invalid event_type should throw',
);

// validation: invalid answer values
assertThrows(
  () => validateEvent({ ...base, event_type: 'answer.recorded', question_id: 'q', answer: 'maybe', input_mode: 'tap', latency_ms: 10 } as any),
  'invalid answer should throw',
);

// store append + retrieval
const store = new InMemoryEventStore();
store.appendEvent(e1);
store.appendEvent({
  ...base,
  event_id: 'evt_2',
  event_type: 'answer.recorded',
  question_id: 'q_1',
  answer: 'yes',
  input_mode: 'tap',
  latency_ms: 120,
});

assert(store.getSessionEvents('s_1').length === 2, 'session retrieval failed');
assert(store.getUserEvents('u_1').length === 2, 'user retrieval failed');

console.log('protocol tests passed');
