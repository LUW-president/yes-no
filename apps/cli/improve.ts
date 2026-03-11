import { recommendFollowupFromEvents } from '../../engine/question-engine/improvementPolicy';
import { getSessionEventStream } from '../../engine/session-orchestrator';

function getArg(flag: string, argv: string[]): string | undefined {
  const idx = argv.indexOf(flag);
  if (idx >= 0 && argv[idx + 1]) return argv[idx + 1];
  return undefined;
}

export function formatImproveOutput(rec: { pattern: string; rule_chain: string; expected_effect: string }): string {
  return [
    'SESSION IMPROVEMENT PLAN',
    '',
    `pattern: ${rec.pattern}`,
    `rule chain: ${rec.rule_chain}`,
    `expected effect: ${rec.expected_effect}`,
  ].join('\n');
}

export async function improveCommand(argv: string[] = []): Promise<void> {
  const sessionId = getArg('--session', argv);
  if (!sessionId) {
    console.log('Usage: yesno improve --session <session_id>');
    return;
  }

  const events = getSessionEventStream(sessionId);
  const rec = recommendFollowupFromEvents(events);
  console.log(formatImproveOutput(rec));
}
