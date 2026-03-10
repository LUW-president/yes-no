import { computeConfidenceTimeline } from '../confidence';

function assert(cond: boolean, msg: string) {
  if (!cond) throw new Error(msg);
}

const events: any[] = [
  { sequence: 1, event_type: 'question.presented' },
  { sequence: 2, event_type: 'answer.submitted', answer: 'yes', latency_ms: 250 },
  { sequence: 3, event_type: 'answer.recorded', answer: 'yes', latency_ms: 250 },
  { sequence: 4, event_type: 'answer.submitted', answer: 'yes', latency_ms: 900 },
  { sequence: 5, event_type: 'answer.recorded', answer: 'yes', latency_ms: 900 },
  { sequence: 6, event_type: 'answer.submitted', answer: 'no', latency_ms: 1400 },
  { sequence: 7, event_type: 'answer.recorded', answer: 'no', latency_ms: 1400 },
  { sequence: 8, event_type: 'session.updated', stage: 'completed' },
];

const timeline = computeConfidenceTimeline(events as any);

assert(timeline.length === 4, 'timeline should include 3 answer steps + final completion step');
assert(timeline[0].step === 1 && timeline[0].confidence === 0.57, 'step1 confidence mismatch');
assert(timeline[1].step === 2 && timeline[1].confidence === 0.62, 'step2 confidence mismatch');
assert(timeline[2].step === 3 && timeline[2].confidence === 0.55, 'step3 confidence mismatch');
assert(timeline[3].step === 4 && timeline[3].confidence === 0.63, 'final confidence mismatch');
assert(timeline[2].reasons.includes('REVERSAL_DETECTED'), 'step3 should include reversal reason');

console.log('confidence model tests passed');
