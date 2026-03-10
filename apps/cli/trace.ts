import { getSessionEventStream, recordAnswer, startSession } from '../../engine/session-orchestrator/index';

function getArg(flag: string, argv: string[]): string | undefined {
  const idx = argv.indexOf(flag);
  if (idx >= 0 && argv[idx + 1]) return argv[idx + 1];
  return undefined;
}

function payloadSummary(event: any): string {
  if (event.event_type === 'question.presented') return `question_id=${event.question_id}`;
  if (event.event_type === 'answer.submitted' || event.event_type === 'answer.recorded') return `answer=${event.answer}`;
  if (event.event_type === 'session.updated') return `stage=${event.stage} answered=${event.answered_count}`;
  if (event.event_type === 'session.closed') return `reason=${event.close_reason}`;
  if (event.event_type === 'artifact.proposed') return `artifact_id=${event.artifact_id}`;
  return '';
}

export function formatTraceOutput(sessionId: string, events: any[]): string {
  const lines = [`SESSION TRACE (${sessionId})`, ''];
  const ordered = [...events].sort((a, b) => a.sequence - b.sequence);
  for (const e of ordered) {
    lines.push(`${e.sequence} ${e.event_type} ${payloadSummary(e)}`.trim());
  }
  return lines.join('\n');
}

export async function traceCommand(argv: string[] = []): Promise<void> {
  let sessionId = getArg('--session', argv);
  const demo = argv.includes('--demo');

  if (!sessionId && demo) {
    const started = startSession('trace_user', 'creation_v0');
    const r1 = recordAnswer(started.session, 'yes');
    if (r1.kind === 'question') recordAnswer(r1.session, 'no');
    sessionId = started.session.session_id;
  }

  if (!sessionId) {
    console.log('Usage: yesno trace --session <session_id> | yesno trace --demo');
    return;
  }

  const events = getSessionEventStream(sessionId);
  console.log(formatTraceOutput(sessionId, events));
}
