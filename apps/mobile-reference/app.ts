#!/usr/bin/env node
import { createInterface } from 'node:readline/promises';
import { stdin as input, stdout as output } from 'node:process';
import { normalizeInput } from './input';
import { renderState } from './render';
import { MobileReferenceSession } from './session';

export async function runMobileReferenceApp() {
  const session = new MobileReferenceSession();
  const rl = createInterface({ input, output });

  try {
    let state = await session.start('mobile_user', 'creation_v0');
    console.log(renderState(state));

    while (true) {
      if (state.artifact) {
        console.log('ARTIFACT PROPOSED');
        break;
      }
      if (state.status === 'completed') {
        console.log('SESSION COMPLETE');
        break;
      }

      const raw = await rl.question('> ');
      const normalized = normalizeInput(raw);
      if (!normalized) continue;

      state = await session.answer(normalized);
      console.log(renderState(state));
    }

    if (state.status === 'completed') console.log(renderState({ status: 'completed' }));
  } finally {
    rl.close();
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  runMobileReferenceApp().catch((err) => {
    console.error(err?.message || err);
    process.exit(1);
  });
}
