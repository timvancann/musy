import { expect, test } from 'vitest';
import { majorScale } from './notes';
import { KEYS, buildPool, diatonicSevenths, diatonicTriads, susChords } from './chords';

test('major scales are spelled correctly, including E# in F# major', () => {
  expect(majorScale('C')).toEqual(['C', 'D', 'E', 'F', 'G', 'A', 'B']);
  expect(majorScale('F#')).toEqual(['F#', 'G#', 'A#', 'B', 'C#', 'D#', 'E#']);
  expect(majorScale('Db')).toEqual(['Db', 'Eb', 'F', 'Gb', 'Ab', 'Bb', 'C']);
  expect(majorScale('F')).toEqual(['F', 'G', 'A', 'Bb', 'C', 'D', 'E']);
});

test('the key list is the 12 practical circle-of-fifths keys', () => {
  expect(KEYS).toEqual(['C', 'G', 'D', 'A', 'E', 'B', 'F#', 'Db', 'Ab', 'Eb', 'Bb', 'F']);
});

test('diatonic triads of C major', () => {
  const t = diatonicTriads('C');
  expect(t.map(c => c.symbol)).toEqual(['C', 'Dm', 'Em', 'F', 'G', 'Am', 'Bdim']);
  expect(t[6].notes).toEqual(['B', 'D', 'F']);
});

test('diatonic sevenths of A major: V7 is E7 = E G# B D', () => {
  const s = diatonicSevenths('A');
  expect(s.map(c => c.symbol)).toEqual(['Amaj7', 'Bm7', 'C#m7', 'Dmaj7', 'E7', 'F#m7', 'G#m7b5']);
  expect(s[4].notes).toEqual(['E', 'G#', 'B', 'D']);
});

test('sus chords on the tonic', () => {
  const s = susChords('D');
  expect(s.map(c => c.symbol)).toEqual(['Dsus2', 'Dsus4']);
  expect(s[0].notes).toEqual(['D', 'E', 'A']);
  expect(s[1].notes).toEqual(['D', 'G', 'A']);
});

test('buildPool respects kind toggles and dedupes shared chords', () => {
  const pool = buildPool(['C', 'F'], { triads: true, sevenths: false, sus: false });
  const symbols = pool.map(c => c.symbol);
  expect(symbols.filter(s => s === 'Dm')).toHaveLength(1); // ii of C, vi of F — deduped
  expect(symbols).toContain('Bdim');
  expect(symbols).toContain('Bb');
  expect(pool.every(c => c.kind === 'triad')).toBe(true);
  const withSus = buildPool(['C'], { triads: false, sevenths: false, sus: true });
  expect(withSus.map(c => c.symbol)).toEqual(['Csus2', 'Csus4']);
});
