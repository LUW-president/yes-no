import { classifyGesture, type Stroke } from '../../apps/web-v1/gestureClassifier';

function assert(cond: boolean, msg: string) {
  if (!cond) throw new Error(msg);
}

function circlePath(): Stroke[] {
  const pts = [] as Stroke;
  const cx = 300;
  const cy = 220;
  const r = 90;
  for (let i = 0; i <= 40; i += 1) {
    const a = (Math.PI * 2 * i) / 40;
    pts.push({ x: cx + r * Math.cos(a), y: cy + r * Math.sin(a) });
  }
  return [pts];
}

function crossPath(): Stroke[] {
  const s1: Stroke = [
    { x: 180, y: 120 },
    { x: 260, y: 200 },
    { x: 340, y: 280 },
  ];
  const s2: Stroke = [
    { x: 340, y: 120 },
    { x: 260, y: 200 },
    { x: 180, y: 280 },
  ];
  return [s1, s2];
}

function randomPath(): Stroke[] {
  return [[
    { x: 50, y: 50 },
    { x: 70, y: 58 },
    { x: 90, y: 64 },
    { x: 110, y: 66 },
    { x: 128, y: 69 },
  ]];
}

const c = classifyGesture(circlePath());
assert(c === 'yes', `expected yes, got ${c}`);

const x = classifyGesture(crossPath());
assert(x === 'no', `expected no, got ${x}`);

const u = classifyGesture(randomPath());
assert(u === 'unknown', `expected unknown, got ${u}`);

console.log('gesture classifier tests passed');
