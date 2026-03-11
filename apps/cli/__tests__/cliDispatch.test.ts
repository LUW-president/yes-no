import { dispatchCommand, usageMessage } from '../dispatch';

function assert(cond: boolean, msg: string) {
  if (!cond) throw new Error(msg);
}

async function main() {
  const invalid = await dispatchCommand('unknown');
  assert(invalid.kind === 'usage', 'unknown command should return usage');
  assert(usageMessage().includes('YES/NO CLI'), 'usage message missing header');
  assert(usageMessage().includes('yesno status'), 'usage missing status command');
  assert(usageMessage().includes('yesno trace'), 'usage missing trace command');
  assert(usageMessage().includes('yesno confidence'), 'usage missing confidence command');
  assert(usageMessage().includes('yesno explain'), 'usage missing explain command');
  assert(usageMessage().includes('yesno guard'), 'usage missing guard command');
  assert(usageMessage().includes('yesno gate'), 'usage missing gate command');

  const runMapped = await dispatchCommand('run', ['--test-noexec']);
  assert(runMapped.kind === 'ok' && runMapped.command === 'run', 'run dispatch mapping failed');

  const harnessMapped = await dispatchCommand('harness', ['--test-noexec']);
  assert(harnessMapped.kind === 'ok' && harnessMapped.command === 'harness', 'harness dispatch mapping failed');

  const demoMapped = await dispatchCommand('demo', ['--test-noexec']);
  assert(demoMapped.kind === 'ok' && demoMapped.command === 'demo', 'demo dispatch mapping failed');

  const statusMapped = await dispatchCommand('status', ['--test-noexec']);
  assert(statusMapped.kind === 'ok' && statusMapped.command === 'status', 'status dispatch mapping failed');

  const traceMapped = await dispatchCommand('trace', ['--test-noexec']);
  assert(traceMapped.kind === 'ok' && traceMapped.command === 'trace', 'trace dispatch mapping failed');

  const confidenceMapped = await dispatchCommand('confidence', ['--test-noexec']);
  assert(confidenceMapped.kind === 'ok' && confidenceMapped.command === 'confidence', 'confidence dispatch mapping failed');

  const explainMapped = await dispatchCommand('explain', ['--test-noexec']);
  assert(explainMapped.kind === 'ok' && explainMapped.command === 'explain', 'explain dispatch mapping failed');

  const guardMapped = await dispatchCommand('guard', ['--test-noexec']);
  assert(guardMapped.kind === 'ok' && guardMapped.command === 'guard', 'guard dispatch mapping failed');

  const gateMapped = await dispatchCommand('gate', ['--test-noexec']);
  assert(gateMapped.kind === 'ok' && gateMapped.command === 'gate', 'gate dispatch mapping failed');

  console.log('cli dispatch tests passed');
}

main().catch((e) => {
  console.error(e?.message || e);
  process.exit(1);
});
