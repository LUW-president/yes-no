import { readFileSync } from 'node:fs';
import { LoadedPack, QuestionNode, QuestionPack } from './types.js';

function parseSimplePackYaml(raw: string): QuestionPack {
  const lines = raw.split(/\r?\n/).map((l) => l.replace(/\t/g, '  '));

  let pack_id = '';
  let version = '';
  const questions: QuestionNode[] = [];
  let current: Partial<QuestionNode> | null = null;

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;

    if (trimmed.startsWith('pack_id:')) {
      pack_id = trimmed.split(':').slice(1).join(':').trim();
      continue;
    }
    if (trimmed.startsWith('version:')) {
      version = trimmed.split(':').slice(1).join(':').trim();
      continue;
    }

    if (trimmed.startsWith('- id:')) {
      if (current) {
        questions.push(current as QuestionNode);
      }
      current = { id: trimmed.split(':').slice(1).join(':').trim() };
      continue;
    }

    if (!current) continue;

    if (trimmed.startsWith('id:')) current.id = trimmed.split(':').slice(1).join(':').trim();
    else if (trimmed.startsWith('text:')) current.text = trimmed.split(':').slice(1).join(':').trim().replace(/^"|"$/g, '');
    else if (trimmed.startsWith('yes:')) current.yes = trimmed.split(':').slice(1).join(':').trim();
    else if (trimmed.startsWith('no:')) current.no = trimmed.split(':').slice(1).join(':').trim();
  }

  if (current) questions.push(current as QuestionNode);

  return { pack_id, version, questions };
}

function validatePackShape(pack: QuestionPack): void {
  if (!pack.pack_id || !pack.version || !Array.isArray(pack.questions) || pack.questions.length === 0) {
    throw new Error('Invalid pack: missing pack_id/version/questions');
  }

  const ids = new Set<string>();
  for (const q of pack.questions) {
    if (!q.id || !q.text || !q.yes || !q.no) {
      throw new Error(`Invalid pack: question missing required fields (${q.id || 'unknown'})`);
    }
    if (ids.has(q.id)) {
      throw new Error(`Invalid pack: duplicate question id (${q.id})`);
    }
    ids.add(q.id);
  }

  for (const q of pack.questions) {
    for (const target of [q.yes, q.no]) {
      const isEnd = target === 'end';
      const isArtifact = target.startsWith('artifact_');
      const isQuestion = ids.has(target);
      if (!isEnd && !isArtifact && !isQuestion) {
        throw new Error(`Invalid pack: missing transition target (${target}) from question ${q.id}`);
      }
    }
  }
}

export function loadPackFromPath(path: string): LoadedPack {
  const raw = readFileSync(path, 'utf8');
  const pack = parseSimplePackYaml(raw);
  validatePackShape(pack);
  const questionMap = new Map<string, QuestionNode>(pack.questions.map((q) => [q.id, q]));
  return { ...pack, questionMap };
}
