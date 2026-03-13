import { readFileSync } from 'node:fs';

const path = process.argv[2] || 'ops/telemetry/runtime-events.log';
const raw = readFileSync(path, 'utf8');

const counters = {
  gesture_detected_yes: 0,
  gesture_detected_no: 0,
  gesture_unknown_retry: 0,
  gesture_submitted: 0,
};

for (const line of raw.split('\n')) {
  const t = line.trim();
  if (!t.startsWith('{') || !t.endsWith('}')) continue;
  try {
    const obj = JSON.parse(t);
    const ev = obj?.event;
    if (ev && Object.prototype.hasOwnProperty.call(counters, ev)) {
      (counters as any)[ev] += 1;
    }
  } catch {
    // ignore non-JSON/non-event lines
  }
}

const detectedTotal = counters.gesture_detected_yes + counters.gesture_detected_no;
const interactionTotal = detectedTotal + counters.gesture_unknown_retry;

const pct = (n: number, d: number) => (d > 0 ? `${Math.round((n / d) * 100)}%` : 'N/A');

console.log(
  JSON.stringify(
    {
      ...counters,
      yesRate: pct(counters.gesture_detected_yes, detectedTotal),
      noRate: pct(counters.gesture_detected_no, detectedTotal),
      retryRate: pct(counters.gesture_unknown_retry, interactionTotal),
    },
    null,
    2,
  ),
);
