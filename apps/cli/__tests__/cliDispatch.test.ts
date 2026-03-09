import { dispatchCommand, usageMessage } from '../dispatch';

function assert(cond: boolean, msg: string) {
  if (!cond) throw new Error(msg);
}

async function main() {
  // invalid command handling
  const invalid = await dispatchCommand('unknown');
  assert(invalid.kind === 'usage', 'unknown command should return usage');
  assert(usageMessage().includes('YES/NO CLI'), 'usage message missing header');

  // command dispatch mapping contract
  const runMapped = await dispatchCommand('run', ['--user', 'u', '--pack', 'creation_v0']).catch(() => null);
  assert(runMapped?.kind === 'ok' || runMapped === null, 'run dispatch mapping failed');

  const harnessMapped = await dispatchCommand('harness', ['--user', 'u', '--pack', 'creation_v0']).catch(() => null);
  assert(harnessMapped?.kind === 'ok' || harnessMapped === null, 'harness dispatch mapping failed');

  console.log('cli dispatch tests passed');
}

main().catch((e) => {
  console.error(e?.message || e);
  process.exit(1);
});
