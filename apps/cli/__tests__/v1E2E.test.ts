import { execFileSync } from 'node:child_process';

function assert(cond: boolean, msg: string) {
  if (!cond) throw new Error(msg);
}

function runV1Session(): string {
  return execFileSync(
    'npx',
    ['tsx', 'apps/cli/yesno.ts', 'v1', '--answers', 'yes,yes,yes'],
    { encoding: 'utf8' }
  );
}

function main() {
  const first = runV1Session();
  const second = runV1Session();

  assert(first === second, 'v1 e2e output is not deterministic across runs');
  assert(first.includes('SESSION DECISION SUMMARY (V1 PROTOTYPE / NON-PRODUCTION)'), 'missing summary output');

  console.log('v1 e2e deterministic test passed');
}

main();
