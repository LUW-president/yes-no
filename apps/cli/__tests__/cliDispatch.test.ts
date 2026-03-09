import { dispatchCommand, usageMessage } from '../dispatch';

function assert(cond: boolean, msg: string) {
  if (!cond) throw new Error(msg);
}

async function main() {
  const invalid = await dispatchCommand('unknown');
  assert(invalid.kind === 'usage', 'unknown command should return usage');
  assert(usageMessage().includes('YES/NO CLI'), 'usage message missing header');

  const runMapped = await dispatchCommand('run', ['--test-noexec']);
  assert(runMapped.kind === 'ok' && runMapped.command === 'run', 'run dispatch mapping failed');

  const harnessMapped = await dispatchCommand('harness', ['--test-noexec']);
  assert(harnessMapped.kind === 'ok' && harnessMapped.command === 'harness', 'harness dispatch mapping failed');

  console.log('cli dispatch tests passed');
}

main().catch((e) => {
  console.error(e?.message || e);
  process.exit(1);
});
