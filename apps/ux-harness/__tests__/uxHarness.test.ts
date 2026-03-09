import { normalizeHarnessInput } from '../input';
import { runHarness } from '../harness';
import { __resetForTests } from '../../../engine/session-orchestrator/orchestrator';

function assert(cond: boolean, msg: string) {
  if (!cond) throw new Error(msg);
}

// input normalization
assert(normalizeHarnessInput('yes') === 'yes', 'yes normalize failed');
assert(normalizeHarnessInput('Y') === 'yes', 'y normalize failed');
assert(normalizeHarnessInput('no') === 'no', 'no normalize failed');
assert(normalizeHarnessInput('N') === 'no', 'n normalize failed');
assert(normalizeHarnessInput('maybe') === null, 'invalid normalize failed');

// harness start + completion path
__resetForTests();
await runHarness({ userId: 'u_h_1', packId: 'creation_v0', interactive: false, scriptedAnswers: ['no'] });

// deterministic progression + artifact handling
__resetForTests();
await runHarness({ userId: 'u_h_2', packId: 'creation_v0', interactive: false, scriptedAnswers: ['yes', 'yes', 'yes', 'yes'] });

console.log('ux harness tests passed');
