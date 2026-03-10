export function renderQuestionScreen(questionText: string): string {
  return [
    '--------------------------------',
    'YES/NO',
    '--------------------------------',
    '',
    questionText,
    '',
    '[ YES ] [ NO ]',
  ].join('\n');
}
