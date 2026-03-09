import { normalizeAnswer } from '../io';
import { runSession } from '../runner';
import { __resetForTests } from '../../../engine/session-orchestrator/orchestrator';

function assert(cond: boolean, msg: string) {
  if (!cond) throw new Error(msg);
}

// yes/no validation
assert(normalizeAnswer('yes') === 'yes', 'yes normalize failed');
assert(normalizeAnswer('Y') === 'yes', 'y normalize failed');
assert(normalizeAnswer('no') === 'no', 'no normalize failed');
assert(normalizeAnswer('❌') === 'no', 'cross normalize failed');
assert(normalizeAnswer('maybe') === null, 'invalid should be null');

// session progression to end
__resetForTests();
await runSession({ userId: 'u_cli_1', packId: 'creation_v0', interactive: false, scriptedAnswers: ['no'] });

// artifact trigger handling path (yes -> yes -> yes => artifact)
__resetForTests();
await runSession({ userId: 'u_cli_2', packId: 'creation_v0', interactive: false, scriptedAnswers: ['yes', 'yes', 'yes', 'yes'] });

console.log('cli runner tests passed');
