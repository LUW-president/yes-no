import { evaluateDecisionGateFromEvents } from '../decisionGate';

function assert(cond: boolean, msg: string) {
  if (!cond) throw new Error(msg);
}

const goEvents: any[] = [
  { sequence: 1, event_type: 'question.presented' },
  { sequence: 2, event_type: 'answer.submitted', answer: 'yes', latency_ms: 200 },
  { sequence: 3, event_type: 'answer.recorded', answer: 'yes', latency_ms: 200 },
  { sequence: 4, event_type: 'answer.submitted', answer: 'yes', latency_ms: 250 },
  { sequence: 5, event_type: 'answer.recorded', answer: 'yes', latency_ms: 250 },
  { sequence: 6, event_type: 'session.updated', stage: 'completed' },
];

const reviewEvents: any[] = [
  { sequence: 1, event_type: 'question.presented' },
  { sequence: 2, event_type: 'answer.submitted', answer: 'yes', latency_ms: 300 },
  { sequence: 3, event_type: 'answer.recorded', answer: 'yes', latency_ms: 300 },
  { sequence: 4, event_type: 'answer.submitted', answer: 'yes', latency_ms: 1100 },
  { sequence: 5, event_type: 'answer.recorded', answer: 'yes', latency_ms: 1100 },
];

const noGoEvents: any[] = [
  { sequence: 1, event_type: 'question.presented' },
  { sequence: 2, event_type: 'answer.submitted', answer: 'yes', latency_ms: 200 },
  { sequence: 3, event_type: 'answer.recorded', answer: 'yes', latency_ms: 200 },
  { sequence: 4, event_type: 'answer.submitted', answer: 'no', latency_ms: 1700 },
  { sequence: 5, event_type: 'answer.recorded', answer: 'no', latency_ms: 1700 },
  { sequence: 6, event_type: 'answer.submitted', answer: 'yes', latency_ms: 1800 },
  { sequence: 7, event_type: 'answer.recorded', answer: 'yes', latency_ms: 1800 },
];

const go = evaluateDecisionGateFromEvents(goEvents as any);
const review = evaluateDecisionGateFromEvents(reviewEvents as any);
const noGo = evaluateDecisionGateFromEvents(noGoEvents as any);

assert(go.gate_result === 'GO', 'go scenario should produce GO');
assert(review.gate_result === 'REVIEW', 'review scenario should produce REVIEW');
assert(noGo.gate_result === 'NO_GO', 'no-go scenario should produce NO_GO');

console.log('decision gate tests passed');
