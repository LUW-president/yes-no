import { formatExplanationOutput } from '../explain';

function assert(cond: boolean, msg: string) {
  if (!cond) throw new Error(msg);
}

const output = formatExplanationOutput([
  {
    step: 1,
    confidence: 0.52,
    reason: 'LATENCY_FAST',
    explanation: 'user answered quickly, increasing confidence.',
  },
  {
    step: 2,
    confidence: 0.47,
    reason: 'REVERSAL_DETECTED',
    explanation: 'answer changed within session, reducing confidence.',
  },
  {
    step: 3,
    confidence: 0.74,
    reason: 'SESSION_STABLE_COMPLETION',
    explanation: 'session completed without further reversals, increasing confidence.',
  },
]);

const lines = output.split('\n').filter(Boolean);
assert(lines[0] === 'SESSION EXPLANATION', 'header mismatch');

const i1 = lines.indexOf('step 1');
const i2 = lines.indexOf('step 2');
const i3 = lines.indexOf('step 3');
assert(i1 > 0, 'step 1 missing');
assert(i2 > i1, 'step 2 ordering mismatch');
assert(i3 > i2, 'step 3 ordering mismatch');
assert(lines[lines.length - 1] === 'FINAL CONFIDENCE: 0.74', 'final confidence line mismatch');

console.log('explain command tests passed');
