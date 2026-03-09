import { Answer, LoadedPack, ResolveResult } from './types';

export function resolveNextInPack(pack: LoadedPack, question_id: string, answer: Answer): ResolveResult {
  if (answer !== 'yes' && answer !== 'no') {
    throw new Error('Invalid answer: must be yes|no');
  }

  const q = pack.questionMap.get(question_id);
  if (!q) throw new Error(`Question not found: ${question_id}`);

  const target = answer === 'yes' ? q.yes : q.no;

  if (target === 'end') return { kind: 'end' };
  if (target.startsWith('artifact_')) return { kind: 'artifact', artifact_trigger: target };

  if (!pack.questionMap.has(target)) {
    throw new Error(`Transition target missing: ${target}`);
  }

  return { kind: 'question', next_question_id: target };
}
