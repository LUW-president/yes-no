import { __resetForTests } from '../../../engine/session-orchestrator';
import { v1Command } from '../v1';

function assert(cond: boolean, msg: string) {
  if (!cond) throw new Error(msg);
}

async function runDeterministicSession(): Promise<string> {
  __resetForTests();
  const output: string[] = [];

  await v1Command(['--answers', 'yes,yes,yes', '--user', 'stability_user', '--pack', 'creation_v0'], {
    print: (line) => output.push(line),
    readLine: async () => 'yes',
  });

  return output
    .map((line) => (line.startsWith('session: ') ? 'session: <normalized>' : line))
    .join('\n');
}

async function main() {
  const firstRun = await runDeterministicSession();
  const secondRun = await runDeterministicSession();

  assert(firstRun === secondRun, 'v1 e2e output is not deterministic across runs');
  assert(firstRun.includes('SESSION DECISION SUMMARY (V1 PROTOTYPE / NON-PRODUCTION)'), 'missing v1 summary header');
  assert(firstRun.includes('gate result:'), 'missing gate result line');

  console.log('v1 e2e stability tests passed');
}

main().catch((e) => {
  console.error(e?.message || e);
  process.exit(1);
});
