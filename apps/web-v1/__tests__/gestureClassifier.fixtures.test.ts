import { classifyGesture, type Stroke } from '../gestureClassifier';

function assert(cond: boolean, msg: string) {
  if (!cond) throw new Error(msg);
}

function mkCircle(cx: number, cy: number, r: number, points = 48): Stroke {
  const out: Stroke = [];
  for (let i = 0; i <= points; i += 1) {
    const a = (Math.PI * 2 * i) / points;
    out.push({ x: cx + r * Math.cos(a), y: cy + r * Math.sin(a) });
  }
  return out;
}

function jitter(stroke: Stroke, amp: number): Stroke {
  return stroke.map((p, i) => ({
    x: p.x + Math.sin(i * 1.7) * amp,
    y: p.y + Math.cos(i * 1.3) * amp,
  }));
}

// circle variants
const cleanCircle = mkCircle(200, 200, 80, 52);
const jitterCircle = jitter(mkCircle(180, 170, 70, 44), 2.0);
assert(classifyGesture([cleanCircle]) === 'yes', 'clean circle should classify yes');
assert(classifyGesture([jitterCircle]) === 'yes', 'jittered circle should classify yes');

// cross variants (two strokes)
const crossA: Stroke = [
  { x: 100, y: 100 },
  { x: 130, y: 130 },
  { x: 160, y: 160 },
  { x: 190, y: 190 },
  { x: 220, y: 220 },
];
const crossB: Stroke = [
  { x: 220, y: 100 },
  { x: 190, y: 130 },
  { x: 160, y: 160 },
  { x: 130, y: 190 },
  { x: 100, y: 220 },
];
assert(classifyGesture([crossA, crossB]) === 'no', 'balanced cross should classify no');

const driftB: Stroke = [
  { x: 225, y: 98 },
  { x: 196, y: 126 },
  { x: 167, y: 157 },
  { x: 135, y: 191 },
  { x: 104, y: 227 },
];
assert(classifyGesture([crossA, driftB]) === 'no', 'endpoint drift cross should classify no');

// unknown variants
const scribble: Stroke = [
  { x: 20, y: 20 },
  { x: 33, y: 26 },
  { x: 45, y: 28 },
  { x: 57, y: 35 },
  { x: 70, y: 36 },
  { x: 81, y: 37 },
];
assert(classifyGesture([scribble]) === 'unknown', 'short scribble should stay unknown');

const shortCrossA: Stroke = [{ x: 100, y: 100 }, { x: 110, y: 110 }, { x: 120, y: 120 }];
const shortCrossB: Stroke = [{ x: 120, y: 100 }, { x: 110, y: 110 }, { x: 100, y: 120 }];
assert(classifyGesture([shortCrossA, shortCrossB]) === 'unknown', 'short cross should remain unknown');

console.log('gesture classifier fixtures v2 passed');
