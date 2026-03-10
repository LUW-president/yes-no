#!/usr/bin/env node
import { createInterface } from 'node:readline/promises';
import { stdin as input, stdout as output } from 'node:process';
import { NativeMobileSession } from './session';
import { renderQuestionScreen } from './screens/questionScreen';
import { renderArtifactScreen } from './screens/artifactScreen';
import { renderCompletionScreen } from './screens/completionScreen';
import { normalizeTap } from './input/tapInput';
import { circleGesture, crossGesture } from './input/gestureStub';

function render(state: Awaited<ReturnType<NativeMobileSession['start']>>) {
  if (state.mode === 'question') return renderQuestionScreen(state.question);
  if (state.mode === 'artifact') return renderArtifactScreen(state.artifact.replace('artifact_', ''));
  return renderCompletionScreen();
}

function normalizeInput(raw: string): 'yes' | 'no' | null {
  const v = (raw || '').trim().toLowerCase();
  if (v === 'circle' || v === 'c') return circleGesture();
  if (v === 'cross' || v === 'x') return crossGesture();
  return normalizeTap(v);
}

export async function runNativePrototype() {
  const session = new NativeMobileSession();
  const rl = createInterface({ input, output });

  try {
    let state = await session.start();
    console.log(render(state));

    while (state.mode !== 'completion') {
      const raw = await rl.question('> ');
      const answer = normalizeInput(raw);
      if (!answer) continue;
      state = await session.answer(answer);
      console.log(render(state as any));

      if (state.mode === 'artifact') {
        // For prototype continuity, ask for accept/reject and then continue lifecycle.
        const artifactRaw = await rl.question('> ');
        const artifactAnswer = normalizeInput(artifactRaw);
        if (!artifactAnswer) continue;
        state = await session.answer(artifactAnswer);
        console.log(render(state as any));
      }
    }
  } finally {
    rl.close();
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  runNativePrototype().catch((err) => {
    console.error(err?.message || err);
    process.exit(1);
  });
}
