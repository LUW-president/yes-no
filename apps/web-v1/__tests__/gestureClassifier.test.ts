import { classifyGesture, isCross, earlyStrokeIntent, type Stroke } from '../gestureClassifier';

function assert(cond: boolean, msg: string) {
  if (!cond) throw new Error(msg);
}

const crossStrokeA: Stroke = [
  { x: 60, y: 60 },
  { x: 80, y: 80 },
  { x: 100, y: 100 },
  { x: 120, y: 120 },
  { x: 140, y: 140 },
  { x: 165, y: 165 },
  { x: 190, y: 190 },
  { x: 220, y: 220 },
];

const crossStrokeBWithEndpointDrift: Stroke = [
  { x: 200, y: 80 },
  { x: 170, y: 110 },
  { x: 140, y: 140 },
  { x: 115, y: 165 },
  { x: 95, y: 185 },
  { x: 80, y: 200 },
  { x: 70, y: 210 },
  { x: 60, y: 220 },
  { x: 40, y: 250 },
];

const tooShortA: Stroke = [
  { x: 80, y: 80 },
  { x: 85, y: 85 },
  { x: 90, y: 90 },
];

const tooShortB: Stroke = [
  { x: 90, y: 80 },
  { x: 85, y: 85 },
  { x: 80, y: 90 },
];

assert(isCross([crossStrokeA, crossStrokeBWithEndpointDrift]), 'two-stroke cross should be recognized with endpoint drift');
assert(classifyGesture([crossStrokeA, crossStrokeBWithEndpointDrift]) === 'no', 'cross should classify as no');
assert(classifyGesture([tooShortA, tooShortB]) === 'unknown', 'very short strokes should not classify as no');

console.log('gesture classifier test passed');

const straightStrokeForEarlyNo: Stroke = [
  { x: 20, y: 20 },
  { x: 35, y: 35 },
  { x: 50, y: 50 },
  { x: 65, y: 65 },
  { x: 80, y: 80 },
  { x: 95, y: 95 },
  { x: 110, y: 110 },
  { x: 125, y: 125 },
  { x: 140, y: 140 },
  { x: 155, y: 155 },
];

const curvedStrokeForEarlyYes: Stroke = [
  { x: 150, y: 100 },
  { x: 162, y: 95 },
  { x: 175, y: 98 },
  { x: 185, y: 108 },
  { x: 192, y: 123 },
  { x: 192, y: 140 },
  { x: 185, y: 156 },
  { x: 172, y: 169 },
  { x: 156, y: 176 },
  { x: 138, y: 176 },
  { x: 121, y: 170 },
  { x: 108, y: 158 },
];

assert(earlyStrokeIntent(straightStrokeForEarlyNo) === 'no', 'early straight stroke should predict no candidate');
assert(earlyStrokeIntent(curvedStrokeForEarlyYes) === 'yes', 'early curved stroke should predict yes candidate');
