#!/usr/bin/env node
import { dispatchCommand, usageMessage } from './dispatch';

export async function main(argv = process.argv.slice(2)) {
  const cmd = argv[0];
  const args = argv.slice(1);

  if (!cmd) {
    console.log(usageMessage());
    process.exit(1);
  }

  const result = await dispatchCommand(cmd, args);
  if (result.kind === 'usage') {
    console.log(result.message);
    process.exit(1);
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch((err) => {
    console.error(err?.message || err);
    process.exit(1);
  });
}
