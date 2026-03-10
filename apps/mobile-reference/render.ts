export type ViewState = {
  question?: string;
  artifact?: string;
  status?: string;
};

export function renderQuestion(questionText: string): string {
  return [
    '--------------------------------',
    'YES/NO',
    '--------------------------------',
    '',
    'QUESTION',
    questionText,
    '',
    'INPUT',
    '',
    '[ YES ] [ NO ]',
  ].join('\n');
}

export function renderArtifact(artifact: string): string {
  return [
    '--------------------------------',
    'YES/NO',
    '--------------------------------',
    '',
    'ARTIFACT PROPOSED',
    artifact,
  ].join('\n');
}

export function renderComplete(): string {
  return [
    '--------------------------------',
    'YES/NO',
    '--------------------------------',
    '',
    'SESSION COMPLETE',
  ].join('\n');
}

export function renderState(state: ViewState): string {
  if (state.artifact) return renderArtifact(state.artifact);
  if (state.status === 'completed') return renderComplete();
  return renderQuestion(state.question || '');
}
