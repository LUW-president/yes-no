import { recognizeGesture } from '../input/gestureRecognition';
import { sampleCirclePath, sampleCrossPath } from '../input/gestureStub';

function assert(cond: boolean, msg: string) {
  if (!cond) throw new Error(msg);
}

const circle = recognizeGesture(sampleCirclePath());
assert(circle === 'yes', 'circle should resolve to yes');

const imperfectCircle = [[
  { x: 0, y: 1 },
  { x: 0.8, y: 0.6 },
  { x: 1.05, y: -0.1 },
  { x: 0.55, y: -0.8 },
  { x: -0.2, y: -1.0 },
  { x: -0.95, y: -0.25 },
  { x: -0.75, y: 0.6 },
  { x: -0.1, y: 0.95 },
  { x: 0.1, y: 0.9 },
]];
assert(recognizeGesture(imperfectCircle as any) === 'yes', 'imperfect circle should still resolve to yes');

const cross = recognizeGesture(sampleCrossPath());
assert(cross === 'no', 'cross should resolve to no');

const imperfectCross = [
  [
    { x: -1.1, y: -0.9 },
    { x: 0.05, y: -0.02 },
    { x: 1.0, y: 0.95 },
  ],
  [
    { x: -1.0, y: 1.0 },
    { x: 0.0, y: 0.05 },
    { x: 1.1, y: -0.9 },
  ],
];
assert(recognizeGesture(imperfectCross as any) === 'no', 'imperfect cross should still resolve to no');

const invalid = recognizeGesture([[{ x: 0, y: 0 }, { x: 2, y: 0 }, { x: 4, y: 0 }]]);
assert(invalid === null, 'invalid stroke should be rejected');

console.log('gesture recognition tests passed');
