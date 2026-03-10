#!/usr/bin/env node
import { createInterface } from 'node:readline/promises';
import { stdin as input, stdout as output } from 'node:process';
import { NativeMobileSession } from './session';
import { renderQuestionScreen } from './screens/questionScreen';
import { renderArtifactScreen } from './screens/artifactScreen';
import { renderCompletionScreen } from './screens/completionScreen';
import { normalizeTap } from './input/tapInput';
import { circleGesture, crossGesture } from './input/gestureStub';

type UiState = { mode: string; question?: string; artifact?: string };

function render(state: UiState, gestureMessage?: string) {
  if (state.mode === 'question') return renderQuestionScreen(state.question || '', gestureMessage);
  if (state.mode === 'artifact') return renderArtifactScreen((state.artifact || '').replace('artifact_', ''));
  return renderCompletionScreen();
}

function normalizeInput(raw: string): { answer: 'yes' | 'no' | null; gestureMessage?: string } {
  const v = (raw || '').trim().toLowerCase();

  if (v === 'circle' || v === 'c') {
    return { answer: circleGesture(), gestureMessage: 'GESTURE RECOGNIZED: YES' };
  }

  if (v === 'cross' || v === 'x') {
    return { answer: crossGesture(), gestureMessage: 'GESTURE RECOGNIZED: NO' };
  }

  if (v === 'gesture bad' || v === 'bad-gesture') {
    return { answer: null, gestureMessage: 'GESTURE NOT RECOGNIZED' };
  }

  return { answer: normalizeTap(v) };
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
      const parsed = normalizeInput(raw);

      if (!parsed.answer) {
        if (parsed.gestureMessage) console.log(parsed.gestureMessage);
        if (!parsed.gestureMessage) {
          console.log('Input not recognized. Use yes/no (or y/n). Gesture inputs: circle/cross.');
        }
        continue;
      }

      try {
        state = await session.answer(parsed.answer);
      } catch (e: any) {
        console.error(e?.message || 'Failed to continue session');
        return;
      }

      console.log(render(state, parsed.gestureMessage));
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
