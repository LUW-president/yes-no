import { ConfidenceReasonCode, ConfidenceStep, computeConfidenceTimeline } from './confidence';
import { ProtocolStreamEvent } from '../protocol';

export type ConfidenceExplanationStep = {
  step: number;
  confidence: number;
  reason: ConfidenceReasonCode;
  explanation: string;
};

function reasonToExplanation(reason: ConfidenceReasonCode): string {
  switch (reason) {
    case 'LATENCY_FAST':
      return 'user answered quickly, increasing confidence.';
    case 'LATENCY_MEDIUM':
      return 'user answered at a moderate pace, slightly increasing confidence.';
    case 'LATENCY_SLOW':
      return 'slow response reduced confidence.';
    case 'REVERSAL_DETECTED':
      return 'answer changed within session, reducing confidence.';
    case 'CONSISTENCY_LOW':
      return 'inconsistent answer pattern reduced confidence.';
    case 'CONSISTENCY_MEDIUM':
      return 'moderate answer consistency provided a small confidence increase.';
    case 'CONSISTENCY_HIGH':
      return 'high answer consistency increased confidence.';
    case 'SESSION_STABLE_COMPLETION':
      return 'session completed without further reversals, increasing confidence.';
  }
}

function primaryReason(step: ConfidenceStep): ConfidenceReasonCode {
  if (step.reasons.includes('SESSION_STABLE_COMPLETION')) return 'SESSION_STABLE_COMPLETION';
  if (step.reasons.includes('REVERSAL_DETECTED')) return 'REVERSAL_DETECTED';
  const first = step.reasons[0];
  return first;
}

export function buildConfidenceExplanation(events: ProtocolStreamEvent[]): ConfidenceExplanationStep[] {
  const timeline = computeConfidenceTimeline(events);
  return timeline.map((step) => {
    const reason = primaryReason(step);
    return {
      step: step.step,
      confidence: step.confidence,
      reason,
      explanation: reasonToExplanation(reason),
    };
  });
}
