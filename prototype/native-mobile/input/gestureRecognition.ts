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

function centroid(points: Point[]) {
  const n = points.length || 1;
  const sx = points.reduce((s, p) => s + p.x, 0);
  const sy = points.reduce((s, p) => s + p.y, 0);
  return { x: sx / n, y: sy / n };
}

function radialVarianceScore(stroke: Stroke) {
  const c = centroid(stroke);
  const rs = stroke.map((p) => distance(p, c));
  const mean = rs.reduce((s, r) => s + r, 0) / (rs.length || 1);
  const varAbs = rs.reduce((s, r) => s + Math.abs(r - mean), 0) / (rs.length || 1);
  return mean <= 1e-6 ? 1 : varAbs / mean;
}

function isCircle(strokes: StrokePath): boolean {
  if (strokes.length !== 1) return false;
  const stroke = strokes[0];
  if (stroke.length < 8) return false;

  const start = stroke[0];
  const end = stroke[stroke.length - 1];
  const b = bounds(stroke);
  const diag = Math.sqrt(b.width * b.width + b.height * b.height);

  const closedLoop = distance(start, end) <= diag * 0.45;
  const ratio = b.width / b.height;
  const nearRound = ratio >= 0.5 && ratio <= 1.9;

  const length = pathLength(stroke);
  const perimeterLike = 2 * Math.PI * ((b.width + b.height) / 4);
  const enoughCurvature = length >= perimeterLike * 0.75;

  const radialVar = radialVarianceScore(stroke);
  const reasonablyCircular = radialVar <= 0.55;

  return closedLoop && nearRound && enoughCurvature && reasonablyCircular;
}

function lineMeta(stroke: Stroke) {
  const first = stroke[0];
  const last = stroke[stroke.length - 1];
  const dx = last.x - first.x;
  const dy = last.y - first.y;
  const slopeSign = Math.sign(dx * dy);
  return { first, last, dx, dy, slopeSign };
}

function strokeMid(stroke: Stroke) {
  const m = lineMeta(stroke);
  return { x: (m.first.x + m.last.x) / 2, y: (m.first.y + m.last.y) / 2 };
}

function isDiagonal(stroke: Stroke): boolean {
  if (stroke.length < 2) return false;
  const { dx, dy } = lineMeta(stroke);
  if (Math.abs(dx) < 1e-6 || Math.abs(dy) < 1e-6) return false;
  const slopeAbs = Math.abs(dy / dx);
  return slopeAbs >= 0.35 && slopeAbs <= 4.0;
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

  const all = [...a, ...b];
  const bb = bounds(all);
  const center = { x: (bb.minX + bb.maxX) / 2, y: (bb.minY + bb.maxY) / 2 };
  const midA = strokeMid(a);
  const midB = strokeMid(b);
  const tol = Math.max(bb.width, bb.height) * 0.42;
  const intersectsCenter = distance(midA, center) <= tol && distance(midB, center) <= tol;
  if (!intersectsCenter) return false;

  const minStrokeLen = Math.max(bb.width, bb.height) * 0.35;
  if (pathLength(a) < minStrokeLen || pathLength(b) < minStrokeLen) return false;

  return true;
}

export function recognizeGesture(strokes: StrokePath): YesNo | null {
  if (!Array.isArray(strokes) || strokes.length === 0) return null;
  if (isCircle(strokes)) return 'yes';
  if (isCross(strokes)) return 'no';
  return null;
}
