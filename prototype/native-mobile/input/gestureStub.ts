import type { YesNo } from './tapInput';
import { recognizeGesture, type StrokePath } from './gestureRecognition';

export function sampleCirclePath(): StrokePath {
  return [[
    { x: 0, y: 1 },
    { x: 0.7, y: 0.7 },
    { x: 1, y: 0 },
    { x: 0.7, y: -0.7 },
    { x: 0, y: -1 },
    { x: -0.7, y: -0.7 },
    { x: -1, y: 0 },
    { x: -0.7, y: 0.7 },
    { x: 0, y: 1 },
  ]];
}

export function sampleCrossPath(): StrokePath {
  return [
    [
      { x: -1, y: -1 },
      { x: 0, y: 0 },
      { x: 1, y: 1 },
    ],
    [
      { x: -1, y: 1 },
      { x: 0, y: 0 },
      { x: 1, y: -1 },
    ],
  ];
}

export function circleGesture(): YesNo {
  return recognizeGesture(sampleCirclePath()) ?? 'yes';
}

export function crossGesture(): YesNo {
  return recognizeGesture(sampleCrossPath()) ?? 'no';
}
