export function renderQuestionScreen(questionText: string, gestureMessage?: string): string {
  const lines = [
    '--------------------------------',
    'YES/NO',
    '--------------------------------',
    '',
    questionText,
    '',
    '[ YES ] [ NO ]',
  ];

  if (gestureMessage) {
    lines.push('', gestureMessage);
  }

  return lines.join('\n');
}
