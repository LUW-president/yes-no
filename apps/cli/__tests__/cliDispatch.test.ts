import { dispatchCommand, usageMessage } from '../dispatch';

function assert(cond: boolean, msg: string) {
  if (!cond) throw new Error(msg);
}

async function main() {
  const invalid = await dispatchCommand('unknown');
  assert(invalid.kind === 'usage', 'unknown command should return usage');
  assert(usageMessage().includes('YES/NO CLI'), 'usage message missing header');
  assert(usageMessage().includes('yesno status'), 'usage missing status command');

  const runMapped = await dispatchCommand('run', ['--test-noexec']);
  assert(runMapped.kind === 'ok' && runMapped.command === 'run', 'run dispatch mapping failed');

  const harnessMapped = await dispatchCommand('harness', ['--test-noexec']);
  assert(harnessMapped.kind === 'ok' && harnessMapped.command === 'harness', 'harness dispatch mapping failed');

  const demoMapped = await dispatchCommand('demo', ['--test-noexec']);
  assert(demoMapped.kind === 'ok' && demoMapped.command === 'demo', 'demo dispatch mapping failed');

  const statusMapped = await dispatchCommand('status', ['--test-noexec']);
  assert(statusMapped.kind === 'ok' && statusMapped.command === 'status', 'status dispatch mapping failed');

  console.log('cli dispatch tests passed');
}

main().catch((e) => {
  console.error(e?.message || e);
  process.exit(1);
});
