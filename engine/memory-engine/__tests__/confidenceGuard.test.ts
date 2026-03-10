import { evaluateGuardReportFromEvents } from '../confidenceGuard';

function assert(cond: boolean, msg: string) {
  if (!cond) throw new Error(msg);
}

const events: any[] = [
  { sequence: 1, event_type: 'question.presented' },
  { sequence: 2, event_type: 'answer.submitted', answer: 'yes', latency_ms: 200 },   // step1 high
  { sequence: 3, event_type: 'answer.recorded', answer: 'yes', latency_ms: 200 },
  { sequence: 4, event_type: 'answer.submitted', answer: 'no', latency_ms: 1500 },   // step2 drop + reversal
  { sequence: 5, event_type: 'answer.recorded', answer: 'no', latency_ms: 1500 },
  { sequence: 6, event_type: 'answer.submitted', answer: 'yes', latency_ms: 1400 },  // step3 second reversal
  { sequence: 7, event_type: 'answer.recorded', answer: 'yes', latency_ms: 1400 },
  { sequence: 8, event_type: 'session.updated', stage: 'completed' },
];

const report = evaluateGuardReportFromEvents(events as any);
assert(report.findings.some((f) => f.rule === 'SUDDEN_DROP'), 'missing sudden drop finding');
assert(report.findings.some((f) => f.rule === 'REVERSAL_CLUSTER'), 'missing reversal cluster finding');
assert(report.findings.some((f) => f.rule === 'LOW_CONFIDENCE_FLOOR'), 'missing low confidence floor finding');
assert(report.final_status === 'REVIEW', 'final status should be REVIEW');

console.log('confidence guard tests passed');
