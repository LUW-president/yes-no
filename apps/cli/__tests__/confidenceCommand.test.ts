import { formatConfidenceOutput } from '../confidence';

function assert(cond: boolean, msg: string) {
  if (!cond) throw new Error(msg);
}

const output = formatConfidenceOutput('s_1', [
  { step: 2, confidence: 0.66, reasons: ['CONSISTENCY_MEDIUM'] },
  { step: 1, confidence: 0.58, reasons: ['LATENCY_FAST', 'CONSISTENCY_HIGH'] },
  { step: 3, confidence: 0.74, reasons: ['SESSION_STABLE_COMPLETION'] },
] as any);

const lines = output.split('\n').filter(Boolean);
assert(lines[0] === 'SESSION CONFIDENCE TRACE', 'header missing');
assert(lines[1].startsWith('step 2 -> confidence 0.66'), 'ordered timeline output mismatch');
assert(lines[3].startsWith('step 3 -> confidence 0.74'), 'timeline line mismatch');
assert(lines[4].startsWith('final -> confidence 0.74'), 'final line mismatch');

console.log('confidence command tests passed');
