import { recordAnswer, startSession } from '../../engine/session-orchestrator';
import { readYesNo } from './io';

type RunOptions = {
  userId: string;
  packId: string;
  interactive?: boolean;
  scriptedAnswers?: Array<'yes' | 'no'>;
};

function logEvent(event_type: string): void {
  console.log('EVENT');
  console.log(event_type);
  console.log(new Date().toISOString());
}

export async function runSession(options: RunOptions): Promise<void> {
  const { userId, packId, interactive = true, scriptedAnswers = [] } = options;
  const started = startSession(userId, packId);

  console.log('QUESTION');
  console.log(started.question_text);
  console.log('INPUT');
  console.log('Type: yes / no');
  logEvent('question.presented');

  let session = started.session;
  let queue = [...scriptedAnswers];

  while (session.status === 'active') {
    const answer = interactive ? await readYesNo('> ') : queue.shift();
    if (!answer) throw new Error('No scripted answer available');

    const result = recordAnswer(session, answer);
    logEvent('answer.recorded');

    if (result.kind === 'question') {
      session = result.session;
      console.log('QUESTION');
      console.log(result.question_text);
      logEvent('question.presented');
      continue;
    }

    if (result.kind === 'artifact') {
      session = result.session;
      console.log('ARTIFACT PROPOSED');
      console.log(result.artifact_trigger);
      logEvent('artifact.proposed');

      const artifactAnswer = interactive ? await readYesNo('Accept artifact? (yes/no): ') : (queue.shift() || 'no');
      if (artifactAnswer === 'yes') {
        console.log('EVENT');
        console.log('artifact.accepted');
        console.log(new Date().toISOString());
      } else {
        console.log('EVENT');
        console.log('artifact.rejected');
        console.log(new Date().toISOString());
      }

      console.log('SESSION COMPLETE');
      console.log('EVENT');
      console.log('session.closed');
      console.log(new Date().toISOString());
      break;
    }

    if (result.kind === 'end') {
      session = result.session;
      console.log('SESSION COMPLETE');
      logEvent('session.closed');
      break;
    }
  }
}
