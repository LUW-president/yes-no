import { computeConfidenceTimeline } from '../memory-engine/confidence.js';
import { evaluateGuardReportFromEvents } from '../memory-engine/confidenceGuard.js';
import { evaluateDecisionGateFromEvents } from '../memory-engine/decisionGate.js';
import { ProtocolStreamEvent } from '../protocol/index.js';

export type EffectLabel = 'stabilize' | 'clarify' | 'confirm';

export type ImprovementRecommendation = {
  pattern: string;
  rule_chain: string;
  expected_effect: EffectLabel;
};

export function recommendFollowupFromEvents(events: ProtocolStreamEvent[]): ImprovementRecommendation {
  const timeline = computeConfidenceTimeline(events);
  const guard = evaluateGuardReportFromEvents(events);
  const gate = evaluateDecisionGateFromEvents(events);
  const finalConfidence = timeline.length ? timeline[timeline.length - 1].confidence : 0;

  if (gate.gate_result === 'NO_GO' || guard.final_status === 'REVIEW') {
    return {
      pattern: 'Stability recovery: ask 2 binary clarifiers (intent, constraint), then re-check readiness.',
      rule_chain: `confidence=${finalConfidence.toFixed(2)} -> guard=${guard.final_status} -> gate=${gate.gate_result}`,
      expected_effect: 'stabilize',
    };
  }

  const hasReversal = timeline.some((s) => s.reasons.includes('REVERSAL_DETECTED'));
  if (hasReversal || guard.final_status === 'SLOW_DOWN') {
    return {
      pattern: 'Clarification follow-up: reframe current question with explicit either/or criterion.',
      rule_chain: `confidence=${finalConfidence.toFixed(2)} -> guard=${guard.final_status} -> gate=${gate.gate_result}`,
      expected_effect: 'clarify',
    };
  }

  return {
    pattern: 'Confirmation follow-up: ask one commitment yes/no to lock the direction.',
    rule_chain: `confidence=${finalConfidence.toFixed(2)} -> guard=${guard.final_status} -> gate=${gate.gate_result}`,
    expected_effect: 'confirm',
  };
}
