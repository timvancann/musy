import { lowerSemitone, majorScale } from './notes';

export const STRING_SETS = ['5-4-3', '4-3-2', '3-2-1'] as const;
export type StringSet = (typeof STRING_SETS)[number];

export interface TriadToggles {
  major: boolean;
  minor: boolean;
  dim: boolean;
  sus: boolean;
  shell: boolean;
}

export interface TriadItem {
  symbol: string; // e.g. "F#m", "Csus4", "C7"
  shell: boolean;
  tones: string[]; // chord tones low-to-high role order; tones[inversion] is the bass
  bass: string;
  inversion: 0 | 1 | 2;
  inversionLabel: string;
  stringSet: StringSet;
}

const TRIAD_INVERSIONS = ['root position', '1st inversion', '2nd inversion'];
const SHELL_INVERSIONS = ['root in bass', '3rd in bass', '7th in bass'];

// Chord tones spelled from the root's major scale.
function tonesFor(root: string): Record<string, string[]> {
  const s = majorScale(root);
  const b3 = lowerSemitone(s[2]);
  const b5 = lowerSemitone(s[4]);
  const b7 = lowerSemitone(s[6]);
  return {
    major: [s[0], s[2], s[4]],
    minor: [s[0], b3, s[4]],
    dim: [s[0], b3, b5],
    sus2: [s[0], s[1], s[4]],
    sus4: [s[0], s[3], s[4]],
    maj7: [s[0], s[2], s[6]], // shell: 1 3 7
    dom7: [s[0], s[2], b7],
    m7: [s[0], b3, b7],
  };
}

function variants(root: string, toggles: TriadToggles): { symbol: string; shell: boolean; tones: string[] }[] {
  const t = tonesFor(root);
  const out: { symbol: string; shell: boolean; tones: string[] }[] = [];
  if (toggles.major) out.push({ symbol: root, shell: false, tones: t.major });
  if (toggles.minor) out.push({ symbol: `${root}m`, shell: false, tones: t.minor });
  if (toggles.dim) out.push({ symbol: `${root}dim`, shell: false, tones: t.dim });
  if (toggles.sus)
    out.push(
      { symbol: `${root}sus2`, shell: false, tones: t.sus2 },
      { symbol: `${root}sus4`, shell: false, tones: t.sus4 },
    );
  if (toggles.shell)
    out.push(
      { symbol: `${root}maj7`, shell: true, tones: t.maj7 },
      { symbol: `${root}7`, shell: true, tones: t.dom7 },
      { symbol: `${root}m7`, shell: true, tones: t.m7 },
    );
  return out;
}

export function buildTriadPool(roots: string[], toggles: TriadToggles): TriadItem[] {
  const pool: TriadItem[] = [];
  for (const root of roots) {
    for (const v of variants(root, toggles)) {
      for (const inversion of [0, 1, 2] as const) {
        for (const stringSet of STRING_SETS) {
          pool.push({
            ...v,
            bass: v.tones[inversion],
            inversion,
            inversionLabel: (v.shell ? SHELL_INVERSIONS : TRIAD_INVERSIONS)[inversion],
            stringSet,
          });
        }
      }
    }
  }
  return pool;
}
