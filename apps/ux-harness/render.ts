export function clearScreen(): void {
  process.stdout.write('\x1Bc');
}

export function renderQuestion(question_text: string): void {
  clearScreen();
  console.log('--------------------------------');
  console.log('YES/NO');
  console.log('--------------------------------');
  console.log('');
  console.log('QUESTION');
  console.log(question_text);
  console.log('');
  console.log('INPUT');
  console.log('⭕ yes');
  console.log('❌ no');
}

export function renderArtifact(artifact_type: string): void {
  console.log('');
  console.log('ARTIFACT');
  console.log(artifact_type);
}

export function renderComplete(): void {
  console.log('');
  console.log('SESSION COMPLETE');
}

export function renderEvent(event_type: string): void {
  console.log('');
  console.log('EVENT');
  console.log(event_type);
  console.log(new Date().toISOString());
}
