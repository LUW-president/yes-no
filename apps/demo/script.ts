import { recordAnswer, startSession } from '../../engine/session-orchestrator';

export type DemoResult = {
  session_id: string;
  event_count: number;
  artifact_result: string | null;
  completed: boolean;
};

const DEFAULT_SEQUENCE: Array<'yes' | 'no'> = ['yes', 'yes', 'no', 'yes'];

export async function runDeterministicDemo(sequence = DEFAULT_SEQUENCE): Promise<DemoResult> {
  console.log('DEMO START');
  console.log('');

  const started = startSession('demo_user', 'creation_v0');
  let session = started.session;
  let questionText = started.question_text;

  let idx = 0;
  let eventCount = 1; // question.presented from startSession
  let artifactResult: string | null = null;

  while (session.status === 'active') {
    console.log('QUESTION');
    console.log(questionText);
    console.log('');

    const answer = sequence[idx++] ?? 'no';
    console.log('ANSWER');
    console.log(answer);
    console.log('');

    const result = recordAnswer(session, answer);
    eventCount += 1; // answer.recorded

    if (result.kind === 'question') {
      session = result.session;
      questionText = result.question_text;
      eventCount += 1; // next question.presented
      continue;
    }

    if (result.kind === 'artifact') {
      session = result.session;
      artifactResult = result.artifact_trigger;
      console.log('ARTIFACT PROPOSED');
      console.log(result.artifact_trigger.replace('artifact_', ''));
      console.log('');

      // deterministic accept artifact
      eventCount += 1; // artifact.proposed
      eventCount += 1; // artifact.accepted (demo-level acknowledgment)
      console.log('SESSION COMPLETE');
      eventCount += 1; // session.closed (demo-level completion)
      break;
    }

    if (result.kind === 'end') {
      session = result.session;
      console.log('SESSION COMPLETE');
      eventCount += 1; // session.closed
      break;
    }
  }

  console.log('');
  console.log('EVENT TRACE');
  console.log(eventCount);
  console.log(session.session_id);
  console.log(artifactResult ?? 'none');

  return {
    session_id: session.session_id,
    event_count: eventCount,
    artifact_result: artifactResult,
    completed: session.status === 'completed' || artifactResult !== null,
  };
}
