import { majorScale } from './notes';

// The 12 practical major keys of the circle of fifths; theoretical spellings
// (Cb, C#, G#, ...) are skipped in favor of their common enharmonics.
export const KEYS = ['C', 'G', 'D', 'A', 'E', 'B', 'F#', 'Db', 'Ab', 'Eb', 'Bb', 'F'] as const;
export type Key = (typeof KEYS)[number];

export type ChordKind = 'triad' | 'seventh' | 'sus';

export interface ChordItem {
  symbol: string;
  notes: string[];
  key: string;
  degree: number; // 1-based scale degree of the root (1 for sus chords)
  kind: ChordKind;
}

const TRIAD_SUFFIX = ['', 'm', 'm', '', '', 'm', 'dim'];
const SEVENTH_SUFFIX = ['maj7', 'm7', 'm7', 'maj7', '7', 'm7', 'm7b5'];

function stack(scale: string[], degree: number, count: number): string[] {
  const notes: string[] = [];
  for (let k = 0; k < count; k++) notes.push(scale[(degree + 2 * k) % 7]);
  return notes;
}

export function diatonicTriads(key: string): ChordItem[] {
  const scale = majorScale(key);
  return scale.map((root, i) => ({
    symbol: root + TRIAD_SUFFIX[i],
    notes: stack(scale, i, 3),
    key,
    degree: i + 1,
    kind: 'triad' as const,
  }));
}

export function diatonicSevenths(key: string): ChordItem[] {
  const scale = majorScale(key);
  return scale.map((root, i) => ({
    symbol: root + SEVENTH_SUFFIX[i],
    notes: stack(scale, i, 4),
    key,
    degree: i + 1,
    kind: 'seventh' as const,
  }));
}

export function susChords(key: string): ChordItem[] {
  const s = majorScale(key);
  return [
    { symbol: `${s[0]}sus2`, notes: [s[0], s[1], s[4]], key, degree: 1, kind: 'sus' as const },
    { symbol: `${s[0]}sus4`, notes: [s[0], s[3], s[4]], key, degree: 1, kind: 'sus' as const },
  ];
}

export interface KindToggles { triads: boolean; sevenths: boolean; sus: boolean }

// A chord symbol fully determines its notes, so shared diatonic chords
// (e.g. Dm in both C and F) are deduped by symbol, keeping the first key.
export function buildPool(keys: string[], kinds: KindToggles): ChordItem[] {
  const seen = new Set<string>();
  const pool: ChordItem[] = [];
  for (const key of keys) {
    const items = [
      ...(kinds.triads ? diatonicTriads(key) : []),
      ...(kinds.sevenths ? diatonicSevenths(key) : []),
      ...(kinds.sus ? susChords(key) : []),
    ];
    for (const item of items) {
      if (seen.has(item.symbol)) continue;
      seen.add(item.symbol);
      pool.push(item);
    }
  }
  return pool;
}
