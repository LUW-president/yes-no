import { recognizeGesture } from '../input/gestureRecognition';
import { sampleCirclePath, sampleCrossPath } from '../input/gestureStub';

function assert(cond: boolean, msg: string) {
  if (!cond) throw new Error(msg);
}

const circle = recognizeGesture(sampleCirclePath());
assert(circle === 'yes', 'circle should resolve to yes');

const cross = recognizeGesture(sampleCrossPath());
assert(cross === 'no', 'cross should resolve to no');

const invalid = recognizeGesture([[{ x: 0, y: 0 }, { x: 2, y: 0 }, { x: 4, y: 0 }]]);
assert(invalid === null, 'invalid stroke should be rejected');

console.log('gesture recognition tests passed');
