import { ConfidenceStep, computeConfidenceTimeline } from './confidence.js';
import { ProtocolStreamEvent } from '../protocol/index.js';

export type GuardRule = 'SUDDEN_DROP' | 'REVERSAL_CLUSTER' | 'LOW_CONFIDENCE_FLOOR';
export type GuardRecommendation = 'CONTINUE' | 'SLOW_DOWN' | 'REVIEW';

export type GuardFinding = {
  step: number;
  rule: GuardRule;
  recommendation: GuardRecommendation;
  confidence?: number;
  confidence_delta?: number;
  reason?: string;
};

export type GuardReport = {
  findings: GuardFinding[];
  final_status: GuardRecommendation;
};

const SUDDEN_DROP_THRESHOLD = -0.08;
const LOW_CONFIDENCE_FLOOR = 0.45;

function maxRecommendation(a: GuardRecommendation, b: GuardRecommendation): GuardRecommendation {
  const rank: Record<GuardRecommendation, number> = { CONTINUE: 0, SLOW_DOWN: 1, REVIEW: 2 };
  return rank[a] >= rank[b] ? a : b;
}

function collectReversalSteps(timeline: ConfidenceStep[]): number[] {
  return timeline.filter((s) => s.reasons.includes('REVERSAL_DETECTED')).map((s) => s.step);
}

export function evaluateConfidenceGuards(timeline: ConfidenceStep[]): GuardReport {
  const findings: GuardFinding[] = [];
  let final_status: GuardRecommendation = 'CONTINUE';

  for (let i = 1; i < timeline.length; i += 1) {
    const prev = timeline[i - 1];
    const curr = timeline[i];
    const delta = Number((curr.confidence - prev.confidence).toFixed(2));
    if (delta <= SUDDEN_DROP_THRESHOLD) {
      const finding: GuardFinding = {
        step: curr.step,
        rule: 'SUDDEN_DROP',
        confidence_delta: delta,
        reason: curr.reasons[0],
        recommendation: 'SLOW_DOWN',
      };
      findings.push(finding);
      final_status = maxRecommendation(final_status, finding.recommendation);
    }

    if (curr.confidence < LOW_CONFIDENCE_FLOOR) {
      const finding: GuardFinding = {
        step: curr.step,
        rule: 'LOW_CONFIDENCE_FLOOR',
        confidence: curr.confidence,
        recommendation: 'REVIEW',
      };
      findings.push(finding);
      final_status = maxRecommendation(final_status, finding.recommendation);
    }
  }

  const reversalSteps = collectReversalSteps(timeline);
  if (reversalSteps.length >= 2) {
    const finding: GuardFinding = {
      step: reversalSteps[reversalSteps.length - 1],
      rule: 'REVERSAL_CLUSTER',
      reason: 'REVERSAL_DETECTED',
      recommendation: 'REVIEW',
    };
    findings.push(finding);
    final_status = maxRecommendation(final_status, finding.recommendation);
  }

  return { findings, final_status };
}

export function evaluateGuardReportFromEvents(events: ProtocolStreamEvent[]): GuardReport {
  const timeline = computeConfidenceTimeline(events);
  return evaluateConfidenceGuards(timeline);
}
