import { classifyGesture, isCross, predictEarlyIntent, type Stroke } from '../gestureClassifier';

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

const earlyStraight: Stroke = [
  { x: 40, y: 40 },
  { x: 60, y: 60 },
  { x: 80, y: 80 },
  { x: 100, y: 100 },
  { x: 120, y: 120 },
  { x: 140, y: 140 },
  { x: 160, y: 160 },
];

const earlyCurved: Stroke = [
  { x: 150, y: 80 },
  { x: 170, y: 82 },
  { x: 188, y: 92 },
  { x: 200, y: 110 },
  { x: 202, y: 130 },
  { x: 192, y: 148 },
  { x: 174, y: 160 },
];

assert(predictEarlyIntent(earlyStraight) === 'no', 'straight early segment should predict no candidate');
assert(predictEarlyIntent(earlyCurved) === 'yes', 'curved early segment should predict yes candidate');

console.log('gesture classifier test passed');
