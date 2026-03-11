import { recommendFollowupFromEvents } from '../improvementPolicy';

function assert(cond: boolean, msg: string) {
  if (!cond) throw new Error(msg);
}

const noGoEvents: any[] = [
  { sequence: 1, event_type: 'question.presented' },
  { sequence: 2, event_type: 'answer.submitted', answer: 'yes', latency_ms: 200 },
  { sequence: 3, event_type: 'answer.recorded', answer: 'yes', latency_ms: 200 },
  { sequence: 4, event_type: 'answer.submitted', answer: 'no', latency_ms: 1800 },
  { sequence: 5, event_type: 'answer.recorded', answer: 'no', latency_ms: 1800 },
  { sequence: 6, event_type: 'answer.submitted', answer: 'yes', latency_ms: 1800 },
  { sequence: 7, event_type: 'answer.recorded', answer: 'yes', latency_ms: 1800 },
];

const reviewEvents: any[] = [
  { sequence: 1, event_type: 'question.presented' },
  { sequence: 2, event_type: 'answer.submitted', answer: 'yes', latency_ms: 200 },
  { sequence: 3, event_type: 'answer.recorded', answer: 'yes', latency_ms: 200 },
  { sequence: 4, event_type: 'answer.submitted', answer: 'no', latency_ms: 1400 },
  { sequence: 5, event_type: 'answer.recorded', answer: 'no', latency_ms: 1400 },
];

const goEvents: any[] = [
  { sequence: 1, event_type: 'question.presented' },
  { sequence: 2, event_type: 'answer.submitted', answer: 'yes', latency_ms: 200 },
  { sequence: 3, event_type: 'answer.recorded', answer: 'yes', latency_ms: 200 },
  { sequence: 4, event_type: 'answer.submitted', answer: 'yes', latency_ms: 250 },
  { sequence: 5, event_type: 'answer.recorded', answer: 'yes', latency_ms: 250 },
  { sequence: 6, event_type: 'session.updated', stage: 'completed' },
];

const r1 = recommendFollowupFromEvents(noGoEvents as any);
const r2 = recommendFollowupFromEvents(reviewEvents as any);
const r3 = recommendFollowupFromEvents(goEvents as any);

assert(r1.expected_effect === 'stabilize', 'NO_GO should stabilize');
assert(r2.expected_effect === 'clarify', 'reversal/review path should clarify');
assert(r3.expected_effect === 'confirm', 'GO should confirm');

console.log('improvement policy tests passed');
