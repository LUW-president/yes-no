import { evaluateDecisionGateFromEvents } from '../../engine/memory-engine/decisionGate';
import { getSessionEventStream } from '../../engine/session-orchestrator';

function getArg(flag: string, argv: string[]): string | undefined {
  const idx = argv.indexOf(flag);
  if (idx >= 0 && argv[idx + 1]) return argv[idx + 1];
  return undefined;
}

export function formatGateOutput(report: {
  final_confidence: number;
  guard_status: string;
  primary_reason: string;
  gate_result: string;
}): string {
  return [
    'SESSION DECISION GATE',
    '',
    `final confidence: ${report.final_confidence.toFixed(2)}`,
    `guard status: ${report.guard_status}`,
    `primary reason: ${report.primary_reason}`,
    '',
    `GATE RESULT: ${report.gate_result}`,
  ].join('\n');
}

export async function gateCommand(argv: string[] = []): Promise<void> {
  const sessionId = getArg('--session', argv);
  if (!sessionId) {
    console.log('Usage: yesno gate --session <session_id>');
    return;
  }

  const events = getSessionEventStream(sessionId);
  const report = evaluateDecisionGateFromEvents(events);
  console.log(formatGateOutput(report));
}
