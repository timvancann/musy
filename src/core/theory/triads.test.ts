import { expect, test } from 'vitest';
import { STRING_SETS, buildTriadPool, type TriadToggles } from './triads';

const all: TriadToggles = { major: true, minor: true, dim: true, sus: true, shell: true };

test('pool covers roots x qualities x inversions x string sets', () => {
  const pool = buildTriadPool(['C'], all);
  // major, minor, dim, sus2, sus4, maj7 shell, 7 shell, m7 shell = 8 variants
  expect(pool).toHaveLength(8 * 3 * 3);
  expect(STRING_SETS).toEqual(['5-4-3', '4-3-2', '3-2-1']);
});

test('bass notes are correctly spelled chord tones', () => {
  const pool = buildTriadPool(['C', 'F#'], all);
  const find = (symbol: string, inv: number) => pool.find(p => p.symbol === symbol && p.inversion === inv)!;
  expect(find('C', 2).bass).toBe('G'); // C/G, the famous one
  expect(find('Cm', 1).bass).toBe('Eb');
  expect(find('F#dim', 2).bass).toBe('C');
  expect(find('Csus4', 1).bass).toBe('F');
  expect(find('C7', 2).bass).toBe('Bb'); // shell, 7th in bass
  expect(find('F#maj7', 2).bass).toBe('E#'); // spelled, not F
  expect(find('C', 0).bass).toBe('C'); // root position: bass is the root
});

test('inversion wording: triads by inversion, shells by bass tone', () => {
  const pool = buildTriadPool(['C'], all);
  expect(pool.find(p => p.symbol === 'Cm' && p.inversion === 1)!.inversionLabel).toBe('1st inversion');
  expect(pool.find(p => p.symbol === 'C7' && p.inversion === 2)!.inversionLabel).toBe('7th in bass');
});

test('toggles filter qualities', () => {
  const pool = buildTriadPool(['C', 'G'], { major: true, minor: false, dim: false, sus: false, shell: false });
  expect(pool.every(p => p.symbol === 'C' || p.symbol === 'G')).toBe(true);
  expect(pool).toHaveLength(2 * 3 * 3);
});
