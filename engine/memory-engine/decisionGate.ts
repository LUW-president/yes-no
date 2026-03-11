import { computeConfidenceTimeline } from './confidence';
import { evaluateConfidenceGuards } from './confidenceGuard';
import { buildConfidenceExplanation } from './confidenceExplain';
import { ProtocolStreamEvent } from '../protocol';

export type GateResult = 'GO' | 'REVIEW' | 'NO_GO';

export type DecisionGateReport = {
  final_confidence: number;
  guard_status: 'CONTINUE' | 'SLOW_DOWN' | 'REVIEW';
  primary_reason: string;
  gate_result: GateResult;
};

export function evaluateDecisionGateFromEvents(events: ProtocolStreamEvent[]): DecisionGateReport {
  const timeline = computeConfidenceTimeline(events);
  const guards = evaluateConfidenceGuards(timeline);
  const explanations = buildConfidenceExplanation(events);

  const finalConfidence = timeline.length ? timeline[timeline.length - 1].confidence : 0;
  const primaryReason = explanations.length ? explanations[explanations.length - 1].reason : 'CONSISTENCY_LOW';

  let gateResult: GateResult;

  if (finalConfidence < 0.45 || guards.final_status === 'REVIEW') {
    gateResult = 'NO_GO';
  } else if ((finalConfidence >= 0.45 && finalConfidence <= 0.69) || guards.final_status === 'SLOW_DOWN') {
    gateResult = 'REVIEW';
  } else {
    gateResult = 'GO';
  }

  return {
    final_confidence: Number(finalConfidence.toFixed(2)),
    guard_status: guards.final_status,
    primary_reason: primaryReason,
    gate_result: gateResult,
  };
}
