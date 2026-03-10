export function renderCompletionScreen(): string {
  return [
    'SESSION COMPLETE',
    '',
    'Would you like to create something else?',
    '',
    '[ YES ] [ NO ]',
  ].join('\n');
}
