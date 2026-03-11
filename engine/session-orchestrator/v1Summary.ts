import { getSessionEventStream } from './orchestrator.js';
import { computeConfidenceTimeline } from '../memory-engine/confidence.js';
import { buildConfidenceExplanation } from '../memory-engine/confidenceExplain.js';
import { evaluateGuardReportFromEvents } from '../memory-engine/confidenceGuard.js';
import { evaluateDecisionGateFromEvents } from '../memory-engine/decisionGate.js';
import { recommendFollowupFromEvents } from '../question-engine/improvementPolicy.js';

export type SessionDecisionSummary = {
  session_id: string;
  final_confidence: number;
  explanation: {
    step: number;
    confidence: number;
    reason: string;
    explanation: string;
  }[];
  guard: {
    findings: {
      step: number;
      rule: string;
      recommendation: string;
      confidence?: number;
      confidence_delta?: number;
      reason?: string;
    }[];
    final_status: 'CONTINUE' | 'SLOW_DOWN' | 'REVIEW';
  };
  improve: {
    pattern: string;
    rule_chain: string;
    expected_effect: 'stabilize' | 'clarify' | 'confirm';
  };
  gate: {
    result: 'GO' | 'REVIEW' | 'NO_GO';
    primary_reason: string;
  };
};

export function buildSessionDecisionSummary(session_id: string): SessionDecisionSummary {
  const events = getSessionEventStream(session_id);
  const timeline = computeConfidenceTimeline(events);
  const explanation = buildConfidenceExplanation(events);
  const guard = evaluateGuardReportFromEvents(events);
  const gate = evaluateDecisionGateFromEvents(events);
  const improve = recommendFollowupFromEvents(events);

  return {
    session_id,
    final_confidence: timeline.length ? timeline[timeline.length - 1].confidence : 0,
    explanation,
    guard,
    improve,
    gate: {
      result: gate.gate_result,
      primary_reason: gate.primary_reason,
    },
  };
}
