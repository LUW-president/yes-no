export type Command = 'run' | 'harness' | 'demo' | 'status' | 'trace' | 'confidence' | 'explain' | 'guard';

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
    'yesno demo',
    'yesno status',
    'yesno trace --session <session_id> | --demo',
    'yesno confidence --session <session_id>',
    'yesno explain --session <session_id>',
    'yesno guard --session <session_id>',
  ].join('\n');
}

export async function dispatchCommand(cmd: string, args: string[] = []): Promise<DispatchResult> {
  const noExec = args.includes('--test-noexec');

  if (cmd === 'run') {
    if (!noExec) {
      const mod = await import('../cli-runner/index');
      if (typeof mod.runCommand === 'function') await mod.runCommand(args);
    }
    return { kind: 'ok', command: 'run' };
  }

  if (cmd === 'harness') {
    if (!noExec) {
      const mod = await import('../ux-harness/index');
      if (typeof mod.harnessCommand === 'function') await mod.harnessCommand(args);
    }
    return { kind: 'ok', command: 'harness' };
  }

  if (cmd === 'demo') {
    if (!noExec) {
      const mod = await import('../demo/demo');
      if (typeof mod.demoCommand === 'function') await mod.demoCommand();
    }
    return { kind: 'ok', command: 'demo' };
  }

  if (cmd === 'status') {
    if (!noExec) {
      const mod = await import('../../ops/dashboard/statusDashboard');
      if (typeof mod.runStatusDashboard === 'function') mod.runStatusDashboard();
    }
    return { kind: 'ok', command: 'status' };
  }

  if (cmd === 'trace') {
    if (!noExec) {
      const mod = await import('./trace');
      if (typeof mod.traceCommand === 'function') await mod.traceCommand(args);
    }
    return { kind: 'ok', command: 'trace' };
  }

  if (cmd === 'confidence') {
    if (!noExec) {
      const mod = await import('./confidence');
      if (typeof mod.confidenceCommand === 'function') await mod.confidenceCommand(args);
    }
    return { kind: 'ok', command: 'confidence' };
  }

  if (cmd === 'explain') {
    if (!noExec) {
      const mod = await import('./explain');
      if (typeof mod.explainCommand === 'function') await mod.explainCommand(args);
    }
    return { kind: 'ok', command: 'explain' };
  }

  if (cmd === 'guard') {
    if (!noExec) {
      const mod = await import('./guard');
      if (typeof mod.guardCommand === 'function') await mod.guardCommand(args);
    }
    return { kind: 'ok', command: 'guard' };
  }

  return { kind: 'usage', message: usageMessage() };
}
