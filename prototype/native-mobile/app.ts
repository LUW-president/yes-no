#!/usr/bin/env node
import { createInterface } from 'node:readline/promises';
import { stdin as input, stdout as output } from 'node:process';
import { NativeMobileSession } from './session';
import { renderQuestionScreen } from './screens/questionScreen';
import { renderArtifactScreen } from './screens/artifactScreen';
import { renderCompletionScreen } from './screens/completionScreen';
import { normalizeTap } from './input/tapInput';
import { circleGesture, crossGesture } from './input/gestureStub';

function render(state: { mode: string; question?: string; artifact?: string }) {
  if (state.mode === 'question') return renderQuestionScreen(state.question || '');
  if (state.mode === 'artifact') return renderArtifactScreen((state.artifact || '').replace('artifact_', ''));
  return renderCompletionScreen();
}

function normalizeInput(raw: string): 'yes' | 'no' | null {
  const v = (raw || '').trim().toLowerCase();
  if (v === 'circle' || v === 'c') return circleGesture();
  if (v === 'cross' || v === 'x') return crossGesture();
  return normalizeTap(v);
}

function promptLabel(stateMode: 'question' | 'artifact' | 'completion') {
  return stateMode === 'artifact' ? 'artifact> ' : '> ';
}

export async function runNativePrototype() {
  const session = new NativeMobileSession();
  const rl = createInterface({ input, output });

  try {
    let state;
    try {
      state = await session.start();
    } catch (e: any) {
      console.error(e?.message || 'Failed to start prototype session');
      return;
    }

    console.log(render(state));

    while (state.mode !== 'completion') {
      const raw = await rl.question(promptLabel(state.mode));
      const answer = normalizeInput(raw);
      if (!answer) {
        console.log('Input not recognized. Use yes/no (or y/n). Gesture stubs: circle/cross.');
        continue;
      }

      try {
        state = await session.answer(answer);
      } catch (e: any) {
        console.error(e?.message || 'Failed to continue session');
        return;
      }

      console.log(render(state));
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
