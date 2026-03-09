import { recordAnswer, startSession } from '../../engine/session-orchestrator';
import { readYesNo } from './input';
import { renderArtifact, renderComplete, renderEvent, renderQuestion } from './render';

type HarnessOptions = {
  userId: string;
  packId: string;
  interactive?: boolean;
  scriptedAnswers?: Array<'yes' | 'no'>;
};

export async function runHarness(options: HarnessOptions): Promise<void> {
  const { userId, packId, interactive = true, scriptedAnswers = [] } = options;
  const started = startSession(userId, packId);
  let session = started.session;

  renderQuestion(started.question_text);
  renderEvent('question.presented');

  const queue = [...scriptedAnswers];

  while (session.status === 'active') {
    const answer = interactive ? await readYesNo('> ') : queue.shift();
    if (!answer) throw new Error('No scripted answer available');

    const result = recordAnswer(session, answer);
    renderEvent('answer.recorded');

    if (result.kind === 'question') {
      session = result.session;
      renderQuestion(result.question_text);
      renderEvent('question.presented');
      continue;
    }

    if (result.kind === 'artifact') {
      session = result.session;
      renderArtifact(result.artifact_trigger);
      renderEvent('artifact.proposed');

      const artifactDecision = interactive ? await readYesNo('Accept artifact? (yes/no): ') : (queue.shift() || 'no');
      if (artifactDecision === 'yes') renderEvent('artifact.accepted');
      else renderEvent('artifact.rejected');

      renderComplete();
      renderEvent('session.closed');
      break;
    }

    if (result.kind === 'end') {
      session = result.session;
      renderComplete();
      renderEvent('session.closed');
      break;
    }
  }
}
