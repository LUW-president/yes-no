export type Command = 'run' | 'harness';

export type DispatchResult =
  | { kind: 'ok'; command: Command }
  | { kind: 'usage'; message: string };

export function usageMessage(): string {
  return [
    'YES/NO CLI',
    '',
    'Commands:',
    'yesno run',
    'yesno harness',
  ].join('\n');
}

export async function dispatchCommand(cmd: string, args: string[] = []): Promise<DispatchResult> {
  const noExec = args.includes('--test-noexec');

  if (cmd === 'run') {
    if (!noExec) {
      const mod = await import('../cli-runner/index');
      if (typeof mod.runCommand === 'function') {
        await mod.runCommand(args);
      }
    }
    return { kind: 'ok', command: 'run' };
  }

  if (cmd === 'harness') {
    if (!noExec) {
      const mod = await import('../ux-harness/index');
      if (typeof mod.harnessCommand === 'function') {
        await mod.harnessCommand(args);
      }
    }
    return { kind: 'ok', command: 'harness' };
  }

  return { kind: 'usage', message: usageMessage() };
}
