import type { YesNo } from './tapInput';

export type Point = { x: number; y: number };
export type Stroke = Point[];
export type StrokePath = Stroke[];

function distance(a: Point, b: Point) {
  const dx = a.x - b.x;
  const dy = a.y - b.y;
  return Math.sqrt(dx * dx + dy * dy);
}

function bounds(points: Point[]) {
  const xs = points.map((p) => p.x);
  const ys = points.map((p) => p.y);
  const minX = Math.min(...xs);
  const maxX = Math.max(...xs);
  const minY = Math.min(...ys);
  const maxY = Math.max(...ys);
  return { minX, maxX, minY, maxY, width: Math.max(1e-6, maxX - minX), height: Math.max(1e-6, maxY - minY) };
}

function pathLength(stroke: Stroke) {
  let sum = 0;
  for (let i = 1; i < stroke.length; i++) sum += distance(stroke[i - 1], stroke[i]);
  return sum;
}

function isCircle(strokes: StrokePath): boolean {
  if (strokes.length !== 1) return false;
  const stroke = strokes[0];
  if (stroke.length < 8) return false;

  const start = stroke[0];
  const end = stroke[stroke.length - 1];
  const b = bounds(stroke);
  const diag = Math.sqrt(b.width * b.width + b.height * b.height);
  const closedLoop = distance(start, end) <= diag * 0.35;
  const ratio = b.width / b.height;
  const nearRound = ratio >= 0.6 && ratio <= 1.6;

  const length = pathLength(stroke);
  const minPerimeterLike = 2.2 * ((b.width + b.height) / 2);
  const enoughCurvature = length >= minPerimeterLike;

  return closedLoop && nearRound && enoughCurvature;
}

function lineMeta(stroke: Stroke) {
  const first = stroke[0];
  const last = stroke[stroke.length - 1];
  const dx = last.x - first.x;
  const dy = last.y - first.y;
  const slopeSign = Math.sign(dx * dy); // + for /-like depending coord, - for \
  return { first, last, dx, dy, slopeSign };
}

function intersectsCenter(a: Stroke, b: Stroke): boolean {
  const pts = [...a, ...b];
  const bb = bounds(pts);
  const cx = (bb.minX + bb.maxX) / 2;
  const cy = (bb.minY + bb.maxY) / 2;

  const am = lineMeta(a);
  const bm = lineMeta(b);
  const midA = { x: (am.first.x + am.last.x) / 2, y: (am.first.y + am.last.y) / 2 };
  const midB = { x: (bm.first.x + bm.last.x) / 2, y: (bm.first.y + bm.last.y) / 2 };

  const tol = Math.max(bb.width, bb.height) * 0.35;
  return distance(midA, { x: cx, y: cy }) <= tol && distance(midB, { x: cx, y: cy }) <= tol;
}

function isDiagonal(stroke: Stroke): boolean {
  if (stroke.length < 2) return false;
  const { dx, dy } = lineMeta(stroke);
  if (Math.abs(dx) < 1e-6) return false;
  const slopeAbs = Math.abs(dy / dx);
  return slopeAbs >= 0.4 && slopeAbs <= 3.5;
}

function isCross(strokes: StrokePath): boolean {
  if (strokes.length < 2) return false;
  const a = strokes[0];
  const b = strokes[1];
  if (!isDiagonal(a) || !isDiagonal(b)) return false;

  const am = lineMeta(a);
  const bm = lineMeta(b);
  const oppositeDiagonals = am.slopeSign !== 0 && bm.slopeSign !== 0 && am.slopeSign !== bm.slopeSign;
  if (!oppositeDiagonals) return false;

  return intersectsCenter(a, b);
}

export function recognizeGesture(strokes: StrokePath): YesNo | null {
  if (!Array.isArray(strokes) || strokes.length === 0) return null;
  if (isCircle(strokes)) return 'yes';
  if (isCross(strokes)) return 'no';
  return null;
}
