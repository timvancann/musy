// Musy stores only small preferences (no history), so localStorage suffices.
import type { KindToggles } from '../core/theory/chords';

const KEYS_KEY = 'musy.keys';
const KINDS_KEY = 'musy.kinds';

export function getSelectedKeys(): string[] {
  try {
    const raw = localStorage.getItem(KEYS_KEY);
    const parsed = raw ? (JSON.parse(raw) as unknown) : null;
    if (Array.isArray(parsed) && parsed.every(k => typeof k === 'string')) return parsed;
  } catch {
    // fall through to default
  }
  return ['C'];
}

export function setSelectedKeys(keys: string[]): void {
  localStorage.setItem(KEYS_KEY, JSON.stringify(keys));
}

export function getKinds(): KindToggles {
  try {
    const raw = localStorage.getItem(KINDS_KEY);
    const parsed = raw ? (JSON.parse(raw) as Partial<KindToggles>) : null;
    if (parsed && typeof parsed === 'object') {
      return { triads: parsed.triads !== false, sevenths: parsed.sevenths !== false, sus: parsed.sus !== false };
    }
  } catch {
    // fall through to default
  }
  return { triads: true, sevenths: true, sus: true };
}

export function setKinds(kinds: KindToggles): void {
  localStorage.setItem(KINDS_KEY, JSON.stringify(kinds));
}
