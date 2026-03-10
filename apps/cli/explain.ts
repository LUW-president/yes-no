import { buildConfidenceExplanation } from '../../engine/memory-engine/confidenceExplain';
import { getSessionEventStream } from '../../engine/session-orchestrator';

function getArg(flag: string, argv: string[]): string | undefined {
  const idx = argv.indexOf(flag);
  if (idx >= 0 && argv[idx + 1]) return argv[idx + 1];
  return undefined;
}

export function formatExplanationOutput(
  rows: Array<{ step: number; confidence: number; reason: string; explanation: string }>,
): string {
  const lines: string[] = ['SESSION EXPLANATION', ''];

  for (const row of rows) {
    lines.push(`step ${row.step}`);
    lines.push(`confidence: ${row.confidence.toFixed(2)}`);
    lines.push(`reason: ${row.reason}`);
    lines.push(`explanation: ${row.explanation}`);
    lines.push('');
  }

  const finalConfidence = rows.length ? rows[rows.length - 1].confidence.toFixed(2) : '0.00';
  lines.push(`FINAL CONFIDENCE: ${finalConfidence}`);

  return lines.join('\n');
}

export async function explainCommand(argv: string[] = []): Promise<void> {
  const sessionId = getArg('--session', argv);
  if (!sessionId) {
    console.log('Usage: yesno explain --session <session_id>');
    return;
  }

  const events = getSessionEventStream(sessionId);
  const rows = buildConfidenceExplanation(events);
  console.log(formatExplanationOutput(rows));
}
