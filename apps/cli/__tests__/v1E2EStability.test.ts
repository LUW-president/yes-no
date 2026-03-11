import { __resetForTests } from '../../../engine/session-orchestrator';
import { v1Command } from '../v1';

function assert(cond: boolean, msg: string) {
  if (!cond) throw new Error(msg);
}

async function runScenario(answers: string): Promise<string> {
  __resetForTests();
  const printed: string[] = [];

  await v1Command(['--answers', answers], {
    print: (line) => printed.push(line),
    readLine: async () => 'yes',
  });

  return printed.join('\n');
}

async function main() {
  // Scenario A: artifact path
  const artifactFlow = await runScenario('yes,yes,yes');
  assert(artifactFlow.includes('artifact proposed:'), 'artifact scenario should propose artifact');
  assert(artifactFlow.includes('SESSION DECISION SUMMARY (V1 PROTOTYPE / NON-PRODUCTION)'), 'summary missing');
  assert(artifactFlow.includes('final confidence:'), 'final confidence missing');
  assert(artifactFlow.includes('gate result:'), 'gate result missing');

  // Scenario B: immediate end path
  const immediateEnd = await runScenario('no');
  assert(immediateEnd.includes('SESSION DECISION SUMMARY (V1 PROTOTYPE / NON-PRODUCTION)'), 'summary missing on immediate end');
  assert(immediateEnd.includes('guard status:'), 'guard status missing on immediate end');
  assert(immediateEnd.includes('follow-up recommendation:'), 'follow-up recommendation missing');

  // Scenario C: reversal-heavy path
  const reversalFlow = await runScenario('yes,no,yes');
  assert(reversalFlow.includes('rule chain:'), 'rule chain missing on reversal flow');
  assert(reversalFlow.includes('expected effect:'), 'expected effect missing on reversal flow');

  console.log('v1 e2e stability tests passed');
}

main().catch((e) => {
  console.error(e?.message || e);
  process.exit(1);
});
