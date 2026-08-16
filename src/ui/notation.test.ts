import { expect, test } from 'vitest';
import { chordSymbol } from './notation';

test('jazz symbols map standard suffixes', () => {
  expect(chordSymbol('Cmaj7', true)).toBe('C∆');
  expect(chordSymbol('F#m7b5', true)).toBe('F#ø');
  expect(chordSymbol('Bdim', true)).toBe('B°');
  expect(chordSymbol('Dm7', true)).toBe('D-7');
  expect(chordSymbol('Ebm', true)).toBe('Eb-');
  expect(chordSymbol('G7', true)).toBe('G7'); // dominant stays plain 7
  expect(chordSymbol('Caug', true)).toBe('C+');
  expect(chordSymbol('Asus4', true)).toBe('Asus4'); // sus unchanged
});

test('letters mode is a no-op', () => {
  for (const s of ['Cmaj7', 'F#m7b5', 'Bdim', 'Dm7', 'G7']) {
    expect(chordSymbol(s, false)).toBe(s);
  }
});
