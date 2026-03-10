export type YesNo = 'yes' | 'no';

export function normalizeInput(raw: string): YesNo | null {
  const v = (raw || '').trim().toLowerCase();
  if (v === 'yes' || v === 'y') return 'yes';
  if (v === 'no' || v === 'n') return 'no';
  return null;
}

export function clickYes(): YesNo {
  return 'yes';
}

export function clickNo(): YesNo {
  return 'no';
}
