import { loadPackFromPath } from './packLoader';
import { resolveNextInPack } from './resolver';
import { Answer, LoadedPack, ResolveResult } from './types';

const packs = new Map<string, LoadedPack>();
let activePackId: string | null = null;

export function loadPack(path: string): LoadedPack {
  const pack = loadPackFromPath(path);
  packs.set(pack.pack_id, pack);
  activePackId = pack.pack_id;
  return pack;
}

export function getFirstQuestion(pack_id: string) {
  const pack = packs.get(pack_id);
  if (!pack) throw new Error(`Pack not found: ${pack_id}`);
  return pack.questions[0];
}

export function resolveNext(question_id: string, answer: Answer): ResolveResult {
  if (!activePackId) throw new Error('Pack not found: no active pack loaded');
  const pack = packs.get(activePackId);
  if (!pack) throw new Error('Pack not found: active pack missing');
  return resolveNextInPack(pack, question_id, answer);
}

export * from './types';
export * from './packLoader';
export * from './resolver';
