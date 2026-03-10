export type WebViewState = {
  question?: string;
  artifact?: string;
  status?: string;
};

export function renderQuestion(questionText: string): string {
  return [
    '--------------------------------',
    'YES/NO WEB',
    '--------------------------------',
    '',
    'QUESTION',
    questionText,
    '',
    'ACTIONS',
    '',
    '[ YES ] [ NO ]',
  ].join('\n');
}

export function renderArtifact(artifact: string): string {
  return [
    '--------------------------------',
    'YES/NO WEB',
    '--------------------------------',
    '',
    'ARTIFACT PROPOSED',
    artifact,
  ].join('\n');
}

export function renderComplete(): string {
  return [
    '--------------------------------',
    'YES/NO WEB',
    '--------------------------------',
    '',
    'SESSION COMPLETE',
  ].join('\n');
}

export function renderState(state: WebViewState): string {
  if (state.artifact) return renderArtifact(state.artifact);
  if (state.status === 'completed') return renderComplete();
  return renderQuestion(state.question || '');
}
