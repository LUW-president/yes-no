import { computeConfidenceTimeline } from '../memory-engine/confidence';
import { evaluateConfidenceGuards } from '../memory-engine/confidenceGuard';
import { evaluateDecisionGateFromEvents } from '../memory-engine/decisionGate';
import { ProtocolStreamEvent } from '../protocol';

export type EffectLabel = 'stabilize' | 'clarify' | 'confirm';

export type ImprovementRecommendation = {
  pattern: string;
  rule_chain: string;
  expected_effect: EffectLabel;
};

export function recommendFollowupFromEvents(events: ProtocolStreamEvent[]): ImprovementRecommendation {
  const timeline = computeConfidenceTimeline(events);
  const guards = evaluateConfidenceGuards(timeline);
  const gate = evaluateDecisionGateFromEvents(events);
  const finalConfidence = gate.final_confidence;

  if (gate.gate_result === 'NO_GO' || guards.final_status === 'REVIEW') {
    return {
      pattern: 'Stability recovery: ask 2 binary clarifiers (intent, constraint), then re-check readiness.',
      rule_chain: `confidence=${finalConfidence.toFixed(2)} -> guard=${guards.final_status} -> gate=${gate.gate_result}`,
      expected_effect: 'stabilize',
    };
  }

  const hasReversal = timeline.some((s) => s.reasons.includes('REVERSAL_DETECTED'));
  if (hasReversal || guards.final_status === 'SLOW_DOWN') {
    return {
      pattern: 'Clarification follow-up: reframe current question with explicit either/or criterion.',
      rule_chain: `confidence=${finalConfidence.toFixed(2)} -> guard=${guards.final_status} -> gate=${gate.gate_result}`,
      expected_effect: 'clarify',
    };
  }

  return {
    pattern: 'Confirmation follow-up: ask one commitment yes/no to lock the direction.',
    rule_chain: `confidence=${finalConfidence.toFixed(2)} -> guard=${guards.final_status} -> gate=${gate.gate_result}`,
    expected_effect: 'confirm',
  };
}
