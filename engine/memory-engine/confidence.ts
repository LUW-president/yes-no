import { ProtocolStreamEvent } from '../protocol';

export type ConfidenceReasonCode =
  | 'LATENCY_FAST'
  | 'LATENCY_MEDIUM'
  | 'LATENCY_SLOW'
  | 'REVERSAL_DETECTED'
  | 'CONSISTENCY_LOW'
  | 'CONSISTENCY_MEDIUM'
  | 'CONSISTENCY_HIGH'
  | 'SESSION_STABLE_COMPLETION';

export type ConfidenceStep = {
  step: number;
  sequence: number;
  confidence: number;
  reasons: ConfidenceReasonCode[];
};

function clamp(v: number): number {
  if (v < 0) return 0;
  if (v > 1) return 1;
  return Number(v.toFixed(2));
}

function latencyAdjustment(latencyMs: number): { delta: number; code: ConfidenceReasonCode } {
  if (latencyMs <= 300) return { delta: 0.04, code: 'LATENCY_FAST' };
  if (latencyMs <= 1200) return { delta: 0.02, code: 'LATENCY_MEDIUM' };
  return { delta: -0.03, code: 'LATENCY_SLOW' };
}

function consistencyAdjustment(yesCount: number, noCount: number): { delta: number; code: ConfidenceReasonCode } {
  const total = yesCount + noCount;
  if (total === 0) return { delta: 0, code: 'CONSISTENCY_LOW' };
  const ratio = Math.max(yesCount, noCount) / total;
  if (ratio >= 0.8) return { delta: 0.03, code: 'CONSISTENCY_HIGH' };
  if (ratio >= 0.6) return { delta: 0.01, code: 'CONSISTENCY_MEDIUM' };
  return { delta: -0.02, code: 'CONSISTENCY_LOW' };
}

export function computeConfidenceTimeline(events: ProtocolStreamEvent[]): ConfidenceStep[] {
  const ordered = [...events].sort((a, b) => a.sequence - b.sequence);

  const timeline: ConfidenceStep[] = [];
  let confidence = 0.5;
  let yesCount = 0;
  let noCount = 0;
  let prevAnswer: 'yes' | 'no' | null = null;
  let step = 0;

  for (const event of ordered) {
    if (event.event_type === 'answer.submitted') {
      step += 1;
      const reasons: ConfidenceReasonCode[] = [];

      const latency = latencyAdjustment(event.latency_ms);
      confidence += latency.delta;
      reasons.push(latency.code);

      if (prevAnswer && prevAnswer !== event.answer) {
        confidence -= 0.05;
        reasons.push('REVERSAL_DETECTED');
      }

      if (event.answer === 'yes') yesCount += 1;
      else noCount += 1;
      prevAnswer = event.answer;

      const consistency = consistencyAdjustment(yesCount, noCount);
      confidence += consistency.delta;
      reasons.push(consistency.code);

      timeline.push({
        step,
        sequence: event.sequence,
        confidence: clamp(confidence),
        reasons,
      });
    }

    if (
      (event.event_type === 'session.updated' && event.stage === 'completed') ||
      (event.event_type === 'session.closed' && event.close_reason === 'completed')
    ) {
      step += 1;
      confidence += 0.08;
      timeline.push({
        step,
        sequence: event.sequence,
        confidence: clamp(confidence),
        reasons: ['SESSION_STABLE_COMPLETION'],
      });
      break;
    }
  }

  return timeline;
}
