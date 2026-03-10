import { evaluateGuardReportFromEvents } from '../../engine/memory-engine/confidenceGuard';
import { getSessionEventStream } from '../../engine/session-orchestrator';

function getArg(flag: string, argv: string[]): string | undefined {
  const idx = argv.indexOf(flag);
  if (idx >= 0 && argv[idx + 1]) return argv[idx + 1];
  return undefined;
}

export function formatGuardOutput(report: {
  findings: Array<{
    step: number;
    rule: string;
    confidence_delta?: number;
    confidence?: number;
    reason?: string;
    recommendation: string;
  }>;
  final_status: string;
}): string {
  const lines: string[] = ['SESSION GUARD REPORT', ''];

  for (const f of report.findings) {
    lines.push(`step ${f.step}`);
    lines.push(`rule: ${f.rule}`);
    if (typeof f.confidence_delta === 'number') lines.push(`confidence delta: ${f.confidence_delta.toFixed(2)}`);
    if (typeof f.confidence === 'number') lines.push(`confidence: ${f.confidence.toFixed(2)}`);
    if (f.reason) lines.push(`reason: ${f.reason}`);
    lines.push(`recommendation: ${f.recommendation}`);
    lines.push('');
  }

  lines.push(`FINAL GUARD STATUS: ${report.final_status}`);
  return lines.join('\n');
}

export async function guardCommand(argv: string[] = []): Promise<void> {
  const sessionId = getArg('--session', argv);
  if (!sessionId) {
    console.log('Usage: yesno guard --session <session_id>');
    return;
  }

  const events = getSessionEventStream(sessionId);
  const report = evaluateGuardReportFromEvents(events);
  console.log(formatGuardOutput(report));
}
