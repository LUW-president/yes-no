#!/usr/bin/env node

import { writeFileSync } from 'node:fs';

const args = process.argv.slice(2);

function argValue(flag, fallback) {
  const idx = args.indexOf(flag);
  if (idx === -1 || idx + 1 >= args.length) return fallback;
  return args[idx + 1];
}

const count = Math.max(1, Number(argValue('--count', '100')) || 100);
const outPath = argValue('--out', 'ops/validation/synthetic-sessions.jsonl');

function createRng(seed) {
  let state = seed >>> 0;
  return () => {
    state = (1664525 * state + 1013904223) >>> 0;
    return state / 0x100000000;
  };
}

const personas = {
  jena: {
    device: ['mobile', 'desktop'],
    deviceWeights: [0.85, 0.15],
    startHesitatedRate: 0.2,
    timeRange: [90, 180],
    gates: ['GO', 'REVIEW', 'NO_GO'],
    gateWeights: [0.55, 0.4, 0.05],
    friction: [
      'Sometimes unclear question framing at session start.',
      'Minor uncertainty about the exact framing of the first question.',
      'Fast flow overall; brief ambiguity around initial prompt intent.',
    ],
  },
  alan: {
    device: ['desktop', 'mobile'],
    deviceWeights: [0.75, 0.25],
    startHesitatedRate: 0.65,
    timeRange: [150, 300],
    gates: ['GO', 'REVIEW', 'NO_GO'],
    gateWeights: [0.25, 0.65, 0.1],
    friction: [
      'Confusion about topic framing before first answer.',
      'Needed clearer guidance on what kind of decision to start with.',
      'Slower start due to uncertainty about topic entry.',
    ],
  },
  mike: {
    device: ['mobile', 'desktop'],
    deviceWeights: [0.95, 0.05],
    startHesitatedRate: 0.05,
    timeRange: [60, 120],
    gates: ['GO', 'REVIEW', 'NO_GO'],
    gateWeights: [0.85, 0.14, 0.01],
    friction: [
      'No notable friction observed.',
      'Very smooth flow with minimal friction.',
      'Quick completion; no meaningful confusion points.',
    ],
  },
};

function weightedPick(values, weights, rand) {
  const total = weights.reduce((a, b) => a + b, 0);
  const roll = rand() * total;
  let acc = 0;
  for (let i = 0; i < values.length; i += 1) {
    acc += weights[i];
    if (roll <= acc) return values[i];
  }
  return values[values.length - 1];
}

const personaOrder = ['jena', 'alan', 'mike'];
const personaWeights = [0.4, 0.35, 0.25];

const lines = [];
for (let i = 1; i <= count; i += 1) {
  const rand = createRng(20260312 + i * 7919);
  const persona = weightedPick(personaOrder, personaWeights, rand);
  const model = personas[persona];

  const startHesitated = rand() < model.startHesitatedRate;
  const device = weightedPick(model.device, model.deviceWeights, rand);
  const gateResult = weightedPick(model.gates, model.gateWeights, rand);

  const [minT, maxT] = model.timeRange;
  const timeToCompleteSec = Math.round(minT + rand() * (maxT - minT));
  const frictionNote = model.friction[Math.floor(rand() * model.friction.length)];

  lines.push(
    JSON.stringify({
      sessionIndex: i,
      participantType: 'simulated',
      persona,
      device,
      startSuccess: true,
      startHesitated,
      completed: true,
      summaryUnderstood: true,
      timeToCompleteSec,
      gateResult,
      frictionNote,
    }),
  );
}

writeFileSync(outPath, `${lines.join('\n')}\n`, 'utf8');
console.log(JSON.stringify({ outPath, sessionsGenerated: count }, null, 2));
