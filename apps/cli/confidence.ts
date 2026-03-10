import { computeConfidenceTimeline } from '../../engine/memory-engine/confidence';
import { getSessionEventStream } from '../../engine/session-orchestrator';

function getArg(flag: string, argv: string[]): string | undefined {
  const idx = argv.indexOf(flag);
  if (idx >= 0 && argv[idx + 1]) return argv[idx + 1];
  return undefined;
}

export function formatConfidenceOutput(sessionId: string, timeline: Array<{ step: number; confidence: number; reasons: string[] }>): string {
  const lines = ['SESSION CONFIDENCE TRACE', ''];

  for (const row of timeline) {
    const label = `step ${row.step}`;
    lines.push(`${label} -> confidence ${row.confidence.toFixed(2)} | reasons: ${row.reasons.join(',')}`);
  }

  if (timeline.length > 0) {
    const final = timeline[timeline.length - 1];
    lines.push(`final -> confidence ${final.confidence.toFixed(2)} | reasons: ${final.reasons.join(',')}`);
  }

  return lines.join('\n');
}

export async function confidenceCommand(argv: string[] = []): Promise<void> {
  const sessionId = getArg('--session', argv);
  if (!sessionId) {
    console.log('Usage: yesno confidence --session <session_id>');
    return;
  }

  const events = getSessionEventStream(sessionId);
  const timeline = computeConfidenceTimeline(events);
  console.log(formatConfidenceOutput(sessionId, timeline));
}
