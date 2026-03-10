import { runDeterministicDemo } from '../script';

function assert(cond: boolean, msg: string) {
  if (!cond) throw new Error(msg);
}

const result = await runDeterministicDemo(['yes', 'yes', 'no', 'yes']);

assert(result.completed === true, 'demo should complete');
assert(result.session_id.length > 0, 'session_id missing');
assert(result.event_count > 0, 'event_count should be > 0');
assert(result.artifact_result === 'artifact_film', 'artifact path should trigger film');

console.log('demo script tests passed');
