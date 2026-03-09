import { createEmptyProfile, getSignal, updateProfileFromEvent } from '../update';
import { mapQuestionToSignal } from '../model';

function assert(cond: boolean, msg: string) {
  if (!cond) throw new Error(msg);
}

const base = {
  event_id: 'evt_1',
  timestamp: new Date().toISOString(),
  session_id: 's_1',
  user_id: 'u_1',
} as const;

// profile creation
const p0 = createEmptyProfile('u_1');
assert(p0.user_id === 'u_1', 'profile creation failed');
assert(p0.event_count === 0, 'event_count init failed');

// confidence increase
let p = createEmptyProfile('u_1');
p = updateProfileFromEvent(p, {
  ...base,
  event_type: 'answer.recorded',
  question_id: 'q_create',
  answer: 'yes',
  input_mode: 'tap',
  latency_ms: 120,
});
assert(getSignal(p, 'create_interest') === 0.1, 'yes delta failed');

// confidence decrease
p = updateProfileFromEvent(p, {
  ...base,
  event_id: 'evt_2',
  event_type: 'answer.recorded',
  question_id: 'q_create',
  answer: 'no',
  input_mode: 'tap',
  latency_ms: 120,
});
assert(getSignal(p, 'create_interest') === 0.05, 'no delta failed');

// score clamping high
for (let i = 0; i < 20; i++) {
  p = updateProfileFromEvent(p, {
    ...base,
    event_id: `evt_h_${i}`,
    event_type: 'answer.recorded',
    question_id: 'q_create',
    answer: 'yes',
    input_mode: 'tap',
    latency_ms: 1,
  });
}
assert(getSignal(p, 'create_interest') <= 1, 'upper clamp failed');

// score clamping low
for (let i = 0; i < 40; i++) {
  p = updateProfileFromEvent(p, {
    ...base,
    event_id: `evt_l_${i}`,
    event_type: 'answer.recorded',
    question_id: 'q_create',
    answer: 'no',
    input_mode: 'tap',
    latency_ms: 1,
  });
}
assert(getSignal(p, 'create_interest') >= 0, 'lower clamp failed');

// signal mapping
assert(mapQuestionToSignal('q_art') === 'art_interest', 'signal mapping failed');

// multi-event updates + event_count
const p2 = createEmptyProfile('u_2');
let p3 = updateProfileFromEvent(p2, {
  ...base,
  event_id: 'evt_3',
  user_id: 'u_2',
  event_type: 'question.presented',
  question_id: 'q_image',
  question_text: 'Would you like it to be an image?',
  channel: 'push',
});
p3 = updateProfileFromEvent(p3, {
  ...base,
  event_id: 'evt_4',
  user_id: 'u_2',
  event_type: 'answer.recorded',
  question_id: 'q_image',
  answer: 'yes',
  input_mode: 'tap',
  latency_ms: 20,
});
assert(p3.event_count === 2, 'multi-event count failed');
assert(getSignal(p3, 'image_preference') === 0.1, 'multi-event signal failed');

console.log('memory engine tests passed');
