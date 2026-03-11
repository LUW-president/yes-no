import { readFileSync } from 'node:fs';

const path = process.argv[2] || 'ops/validation/external-user-sessions.jsonl';
const raw = readFileSync(path, 'utf8').trim();
const rows = raw ? raw.split('\n').map((l) => JSON.parse(l)) : [];

const completedRows = rows.filter((r) => typeof r.startSuccess === 'boolean');
const n = completedRows.length;

function pct(fn: (r: any) => boolean): string {
  if (!n) return 'N/A';
  const c = completedRows.filter(fn).length;
  return `${Math.round((c / n) * 100)}% (${c}/${n})`;
}

const times = completedRows.map((r) => r.timeToCompleteSec).filter((v) => typeof v === 'number').sort((a, b) => a - b);
const median = times.length ? times[Math.floor(times.length / 2)] : null;
const gate = { GO: 0, REVIEW: 0, NO_GO: 0 } as Record<string, number>;
for (const r of completedRows) {
  if (r.gateResult && gate[r.gateResult] !== undefined) gate[r.gateResult] += 1;
}

console.log(JSON.stringify({
  sessionsRecorded: n,
  startSuccessRate: pct((r) => r.startSuccess === true),
  completionRate: pct((r) => r.completed === true),
  summaryUnderstandableRate: pct((r) => r.summaryUnderstood === true),
  medianTimeToCompleteSec: median ?? 'N/A',
  gateMix: gate,
}, null, 2));
