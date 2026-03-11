import { SignalName } from './types.js';

export function clampScore(v: number): number {
  if (v < 0) return 0;
  if (v > 1) return 1;
  return Number(v.toFixed(4));
}

export function mapQuestionToSignal(question_id: string): SignalName | null {
  if (question_id.startsWith('q_create')) return 'create_interest';
  if (question_id.startsWith('q_art')) return 'art_interest';
  if (question_id.startsWith('q_film')) return 'film_interest';
  if (question_id.startsWith('q_image')) return 'image_preference';
  return null;
}

export function mapArtifactToSignal(artifact_id?: string): SignalName | null {
  if (!artifact_id) return null;
  if (artifact_id.includes('film')) return 'film_interest';
  if (artifact_id.includes('image')) return 'image_preference';
  if (artifact_id.includes('idea')) return 'idea_exploration';
  return null;
}
