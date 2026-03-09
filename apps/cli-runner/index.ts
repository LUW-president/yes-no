#!/usr/bin/env node
import { runSession } from './runner';

function getArg(flag: string, fallback?: string): string | undefined {
  const idx = process.argv.indexOf(flag);
  if (idx >= 0 && process.argv[idx + 1]) return process.argv[idx + 1];
  return fallback;
}

async function main() {
  const cmd = process.argv[2];
  if (cmd !== 'run') {
    console.log('Usage: yesno run [--user <user_id>] [--pack <pack_id>]');
    process.exit(1);
  }

  const userId = getArg('--user', 'local_user')!;
  const packId = getArg('--pack', 'creation_v0')!;

  await runSession({ userId, packId, interactive: true });
}

main().catch((err) => {
  console.error(err.message || err);
  process.exit(1);
});
