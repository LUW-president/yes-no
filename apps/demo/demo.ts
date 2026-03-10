#!/usr/bin/env node
import { runDeterministicDemo } from './script';

export async function demoCommand() {
  await runDeterministicDemo();
}

if (import.meta.url === `file://${process.argv[1]}`) {
  demoCommand().catch((err) => {
    console.error(err?.message || err);
    process.exit(1);
  });
}
