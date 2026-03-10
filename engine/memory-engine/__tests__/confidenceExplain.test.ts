import { buildConfidenceExplanation } from '../confidenceExplain';

function assert(cond: boolean, msg: string) {
  if (!cond) throw new Error(msg);
}

const events: any[] = [
  { sequence: 1, event_type: 'question.presented' },
  { sequence: 2, event_type: 'answer.submitted', answer: 'yes', latency_ms: 200 },
  { sequence: 3, event_type: 'answer.recorded', answer: 'yes', latency_ms: 200 },
  { sequence: 4, event_type: 'answer.submitted', answer: 'no', latency_ms: 1300 },
  { sequence: 5, event_type: 'answer.recorded', answer: 'no', latency_ms: 1300 },
  { sequence: 6, event_type: 'session.updated', stage: 'completed' },
];

const rows = buildConfidenceExplanation(events as any);
assert(rows.length === 3, 'should produce 3 explanation steps');
assert(rows[0].reason === 'LATENCY_FAST', 'step1 reason mismatch');
assert(rows[1].reason === 'REVERSAL_DETECTED', 'step2 reason mismatch');
assert(rows[2].reason === 'SESSION_STABLE_COMPLETION', 'step3 reason mismatch');
assert(rows[2].confidence === 0.55, 'final confidence mismatch');

console.log('confidence explanation tests passed');
