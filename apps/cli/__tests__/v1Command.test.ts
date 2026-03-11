import { __resetForTests } from '../../../engine/session-orchestrator';
import { formatV1SummaryOutput, v1Command } from '../v1';

function assert(cond: boolean, msg: string) {
  if (!cond) throw new Error(msg);
}

function testFormatOutput() {
  const output = formatV1SummaryOutput({
    final_confidence: 0.74,
    explanation: [{ explanation: 'Signals stayed consistent.' }, { explanation: 'No reversal detected.' }],
    guard: {
      final_status: 'CONTINUE',
      findings: [{ rule: 'REVERSAL_DELTA', recommendation: 'Confirm the latest answer.' }],
    },
    improve: {
      pattern: 'consistent_yes',
      rule_chain: 'affirm > confirm',
      expected_effect: 'confirm',
    },
    gate: {
      result: 'GO',
      primary_reason: 'CONSISTENCY_HIGH',
    },
  });

  const lines = output.split('\n');
  assert(lines[0] === 'SESSION DECISION SUMMARY (V1 PROTOTYPE / NON-PRODUCTION)', 'summary header mismatch');
  assert(lines.includes('final confidence: 0.74'), 'final confidence line mismatch');
  assert(lines.includes('guard status: CONTINUE'), 'guard status line mismatch');
  assert(lines.includes('- REVERSAL_DELTA: Confirm the latest answer.'), 'guard finding line mismatch');
  assert(lines.includes('gate result: GO (CONSISTENCY_HIGH)'), 'gate line mismatch');
}

async function testNonInteractiveSmokePath() {
  __resetForTests();
  const printed: string[] = [];
  await v1Command(['--answers', 'yes,yes,yes'], {
    print: (line) => printed.push(line),
    readLine: async () => 'yes',
  });

  const combined = printed.join('\n');
  assert(combined.includes('YES/NO V1 SESSION (prototype / non-production)'), 'missing v1 session intro');
  assert(combined.includes('question: Would you like to create something?'), 'missing first question');
  assert(combined.includes('artifact proposed: artifact_image'), 'missing artifact output');
  assert(combined.includes('SESSION DECISION SUMMARY (V1 PROTOTYPE / NON-PRODUCTION)'), 'missing summary header');
  assert(combined.includes('gate result:'), 'missing gate result line');
}

async function main() {
  testFormatOutput();
  await testNonInteractiveSmokePath();
  console.log('v1 command tests passed');
}

main().catch((e) => {
  console.error(e?.message || e);
  process.exit(1);
});
