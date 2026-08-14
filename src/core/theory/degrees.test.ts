import { expect, test } from 'vitest';
import { MODES, degreeChords } from './degrees';

test('mode list', () => {
  expect(MODES).toEqual(['Ionian', 'Dorian', 'Phrygian', 'Lydian', 'Mixolydian', 'Aeolian', 'Locrian']);
});

test('A Ionian numerals and the ii chord', () => {
  const d = degreeChords('A', 'Ionian');
  expect(d.map(x => x.numeral)).toEqual(['I', 'ii', 'iii', 'IV', 'V', 'vi', 'vii°']);
  expect(d[1].symbol).toBe('Bm7');
  expect(d[1].notes).toEqual(['B', 'D', 'F#', 'A']);
  expect(d[4].symbol).toBe('E7'); // dominant on V in major
});

test('C Aeolian: practical dominant V (G7), otherwise strict', () => {
  const d = degreeChords('C', 'Aeolian');
  expect(d.map(x => x.numeral)).toEqual(['i', 'ii°', 'bIII', 'iv', 'V', 'bVI', 'bVII']);
  expect(d[4].symbol).toBe('G7');
  expect(d[4].notes).toEqual(['G', 'B', 'D', 'F']); // raised third, not Bb
  expect(d[2].symbol).toBe('Ebmaj7');
  expect(d[6].symbol).toBe('Bb7'); // bVII is a dominant-quality seventh in natural minor
  expect(d[1].symbol).toBe('Dm7b5');
});

test('theoretical tonics respell enharmonically per mode', () => {
  const d = degreeChords('Db', 'Aeolian'); // Db minor needs Bbb -> respelled C# minor
  expect(d[0].tonic).toBe('C#');
  expect(d[3].symbol).toBe('F#m7');
  expect(d[3].notes).toEqual(['F#', 'A', 'C#', 'E']);
  const flat = (n: string) => n.includes('bb') || n.includes('##');
  expect(d.every(x => !x.notes.some(flat))).toBe(true);
  // Db Ionian is fine as-is and must NOT respell
  expect(degreeChords('Db', 'Ionian')[0].tonic).toBe('Db');
});

test('Lydian raised fourth and Phrygian flat second', () => {
  const lyd = degreeChords('F', 'Lydian');
  expect(lyd[3].numeral).toBe('#iv°');
  expect(lyd[3].symbol).toBe('Bm7b5');
  const phr = degreeChords('E', 'Phrygian');
  expect(phr[1].numeral).toBe('bII');
  expect(phr[1].symbol).toBe('Fmaj7');
});
