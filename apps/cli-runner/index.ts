#!/usr/bin/env node
import { runSession } from './runner';

function getArg(flag: string, argv: string[], fallback?: string): string | undefined {
  const idx = argv.indexOf(flag);
  if (idx >= 0 && argv[idx + 1]) return argv[idx + 1];
  return fallback;
}

export async function runCommand(argv = process.argv.slice(2)) {
  const userId = getArg('--user', argv, 'local_user')!;
  const packId = getArg('--pack', argv, 'creation_v0')!;
  await runSession({ userId, packId, interactive: true });
}

async function main() {
  const cmd = process.argv[2];
  if (cmd !== 'run') {
    console.log('Usage: yesno run [--user <user_id>] [--pack <pack_id>]');
    process.exit(1);
  }
  await runCommand(process.argv.slice(3));
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch((err) => {
    console.error(err.message || err);
    process.exit(1);
  });
}
