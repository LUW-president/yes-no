import { createEvent, InMemoryEventStore, validateEvent } from '../index';

function assert(condition: boolean, message: string) {
  if (!condition) throw new Error(message);
}

function assertThrows(fn: () => void, message: string) {
  let thrown = false;
  try {
    fn();
  } catch {
    thrown = true;
  }
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

const e2 = createEvent({
  ...base,
  event_id: 'evt_2',
  event_type: 'answer.submitted',
  question_id: 'q_1',
  answer: 'yes',
  input_mode: 'tap',
  latency_ms: 120,
});
assert(e2.event_type === 'answer.submitted', 'answer.submitted creation failed');

// validation: invalid event_type
assertThrows(() => validateEvent({ ...base, event_type: 'bad.type' } as any), 'invalid event_type should throw');

// validation: invalid answer values
assertThrows(
  () =>
    validateEvent({
      ...base,
      event_type: 'answer.submitted',
      question_id: 'q',
      answer: 'maybe',
      input_mode: 'tap',
      latency_ms: 10,
    } as any),
  'invalid answer should throw',
);

// validation: session.updated
assertThrows(
  () =>
    validateEvent({
      ...base,
      event_type: 'session.updated',
      stage: 'bad-stage',
      answered_count: 1,
    } as any),
  'invalid session.updated stage should throw',
);

// store append + retrieval + deterministic sequence
const store = new InMemoryEventStore();
const s1 = store.appendEvent(e1);
const s2 = store.appendEvent(e2);
store.appendEvent({
  ...base,
  event_id: 'evt_3',
  event_type: 'session.updated',
  stage: 'question',
  answered_count: 1,
});

assert(s1.sequence === 1, 'first sequence should be 1');
assert(s2.sequence === 2, 'second sequence should be 2');
const allEvents = store.getAllEvents();
assert(allEvents.length === 3, 'all events retrieval failed');
assert(allEvents[0].sequence === 1 && allEvents[2].sequence === 3, 'event ordering failed');
assert(store.getSessionEvents('s_1').length === 3, 'session retrieval failed');
assert(store.getUserEvents('u_1').length === 3, 'user retrieval failed');

console.log('protocol tests passed');
