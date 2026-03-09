import { createInterface } from 'node:readline/promises';
import { stdin as input, stdout as output } from 'node:process';

export type NormalizedAnswer = 'yes' | 'no';

export function normalizeAnswer(value: string): NormalizedAnswer | null {
  const v = value.trim().toLowerCase();
  if (v === 'yes' || v === 'y' || v === '⭕') return 'yes';
  if (v === 'no' || v === 'n' || v === '❌') return 'no';
  return null;
}

export async function readYesNo(prompt: string): Promise<NormalizedAnswer> {
  const rl = createInterface({ input, output });
  try {
    while (true) {
      const raw = await rl.question(prompt);
      const norm = normalizeAnswer(raw);
      if (norm) return norm;
      console.log('Invalid input. Type yes / no');
    }
  } finally {
    rl.close();
  }
}
