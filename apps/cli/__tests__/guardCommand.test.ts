import { formatGuardOutput } from '../guard';

function assert(cond: boolean, msg: string) {
  if (!cond) throw new Error(msg);
}

const output = formatGuardOutput({
  findings: [
    {
      step: 2,
      rule: 'SUDDEN_DROP',
      confidence_delta: -0.11,
      reason: 'REVERSAL_DETECTED',
      recommendation: 'SLOW_DOWN',
    },
    {
      step: 4,
      rule: 'LOW_CONFIDENCE_FLOOR',
      confidence: 0.41,
      recommendation: 'REVIEW',
    },
  ],
  final_status: 'REVIEW',
});

const lines = output.split('\n').filter(Boolean);
assert(lines[0] === 'SESSION GUARD REPORT', 'header mismatch');
const iStep2 = lines.indexOf('step 2');
const iStep4 = lines.indexOf('step 4');
assert(iStep2 > 0 && iStep4 > iStep2, 'ordered step output mismatch');
assert(lines[lines.length - 1] === 'FINAL GUARD STATUS: REVIEW', 'final status mismatch');

console.log('guard command tests passed');
