// Triad trainer items: pure label combinatorics — the player finds the notes
// on the instrument, so no note math is needed here.

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
  label: string; // e.g. "F#m", "Csus4", "G7 shell"
  shell: boolean;
  inversion: 0 | 1 | 2;
  inversionLabel: string;
  stringSet: StringSet;
}

const TRIAD_INVERSIONS = ['root position', '1st inversion', '2nd inversion'];
const SHELL_INVERSIONS = ['root in bass', '3rd in bass', '7th in bass'];

function variants(root: string, toggles: TriadToggles): { label: string; shell: boolean }[] {
  const out: { label: string; shell: boolean }[] = [];
  if (toggles.major) out.push({ label: root, shell: false });
  if (toggles.minor) out.push({ label: `${root}m`, shell: false });
  if (toggles.dim) out.push({ label: `${root}dim`, shell: false });
  if (toggles.sus) out.push({ label: `${root}sus2`, shell: false }, { label: `${root}sus4`, shell: false });
  if (toggles.shell)
    out.push(
      { label: `${root}maj7 shell`, shell: true },
      { label: `${root}7 shell`, shell: true },
      { label: `${root}m7 shell`, shell: true },
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
