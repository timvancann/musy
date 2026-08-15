import { expect, test } from 'vitest';
import { STRING_SETS, buildTriadPool, type TriadToggles } from './triads';

const all: TriadToggles = { major: true, minor: true, dim: true, sus: true, shell: true };

test('pool covers roots x qualities x inversions x string sets', () => {
  const pool = buildTriadPool(['C'], all);
  // qualities expand: major, minor, dim, sus2, sus4, shell maj7, shell 7, shell m7 = 8
  expect(pool).toHaveLength(8 * 3 * 3);
  expect(STRING_SETS).toEqual(['5-4-3', '4-3-2', '3-2-1']);
});

test('labels and inversion wording', () => {
  const pool = buildTriadPool(['F#'], all);
  const labels = new Set(pool.map(p => p.label));
  for (const l of ['F#', 'F#m', 'F#dim', 'F#sus2', 'F#sus4', 'F#maj7 shell', 'F#7 shell', 'F#m7 shell']) {
    expect(labels).toContain(l);
  }
  const triad = pool.find(p => p.label === 'F#m' && p.inversion === 1)!;
  expect(triad.inversionLabel).toBe('1st inversion');
  const shell = pool.find(p => p.label === 'F#7 shell' && p.inversion === 2)!;
  expect(shell.inversionLabel).toBe('7th in bass');
  expect(pool.find(p => p.label === 'F#' && p.inversion === 0)!.inversionLabel).toBe('root position');
});

test('toggles filter qualities', () => {
  const pool = buildTriadPool(['C', 'G'], { major: true, minor: false, dim: false, sus: false, shell: false });
  expect(pool.every(p => p.label === 'C' || p.label === 'G')).toBe(true);
  expect(pool).toHaveLength(2 * 3 * 3);
});
