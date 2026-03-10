export function renderCompletionScreen(): string {
  return [
    '--------------------------------',
    'YES/NO',
    '--------------------------------',
    '',
    'SESSION COMPLETE',
    '',
    'Would you like to create something else?',
    '',
    '[ YES ] [ NO ]',
  ].join('\n');
}
