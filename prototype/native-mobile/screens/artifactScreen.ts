export function renderArtifactScreen(artifactType: string): string {
  return [
    '--------------------------------',
    'YES/NO',
    '--------------------------------',
    '',
    'ARTIFACT',
    artifactType,
    '',
    'Accept this artifact?',
    '',
    '[ YES ] [ NO ]',
  ].join('\n');
}
