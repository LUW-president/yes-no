import { formatImproveOutput } from '../improve';

function assert(cond: boolean, msg: string) {
  if (!cond) throw new Error(msg);
}

const output = formatImproveOutput({
  pattern: 'Clarification follow-up: reframe current question with explicit either/or criterion.',
  rule_chain: 'confidence=0.57 -> guard=SLOW_DOWN -> gate=REVIEW',
  expected_effect: 'clarify',
});

const lines = output.split('\n').filter(Boolean);
assert(lines[0] === 'SESSION IMPROVEMENT PLAN', 'header mismatch');
assert(lines[1].startsWith('pattern:'), 'pattern line missing');
assert(lines[2].startsWith('rule chain:'), 'rule chain line missing');
assert(lines[3] === 'expected effect: clarify', 'effect line mismatch');

console.log('improve command tests passed');
