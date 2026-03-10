export type YesNo = 'yes' | 'no';

export function normalizeInput(raw: string): YesNo | null {
  const v = (raw || '').trim().toLowerCase();
  if (v === 'yes' || v === 'y') return 'yes';
  if (v === 'no' || v === 'n') return 'no';
  return null;
}

export function tapYes(): YesNo {
  return 'yes';
}

export function tapNo(): YesNo {
  return 'no';
}
