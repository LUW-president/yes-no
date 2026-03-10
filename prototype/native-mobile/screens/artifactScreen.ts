export function renderArtifactScreen(artifactType: string): string {
  return [
    'ARTIFACT',
    artifactType,
    '',
    'Accept this artifact?',
    '',
    '[ YES ] [ NO ]',
  ].join('\n');
}
