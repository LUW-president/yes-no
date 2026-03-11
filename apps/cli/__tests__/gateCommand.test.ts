import { formatGateOutput } from '../gate';

function assert(cond: boolean, msg: string) {
  if (!cond) throw new Error(msg);
}

const output = formatGateOutput({
  final_confidence: 0.74,
  guard_status: 'CONTINUE',
  primary_reason: 'CONSISTENCY_HIGH',
  gate_result: 'GO',
});

const lines = output.split('\n').filter(Boolean);
assert(lines[0] === 'SESSION DECISION GATE', 'header mismatch');
assert(lines[1] === 'final confidence: 0.74', 'final confidence line mismatch');
assert(lines[2] === 'guard status: CONTINUE', 'guard status line mismatch');
assert(lines[3] === 'primary reason: CONSISTENCY_HIGH', 'primary reason line mismatch');
assert(lines[4] === 'GATE RESULT: GO', 'gate result line mismatch');

console.log('gate command tests passed');
