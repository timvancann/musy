const LETTERS = ['C', 'D', 'E', 'F', 'G', 'A', 'B'] as const;
const LETTER_PC: Record<string, number> = { C: 0, D: 2, E: 4, F: 5, G: 7, A: 9, B: 11 };
const MAJOR_STEPS = [0, 2, 4, 5, 7, 9, 11];

function parse(note: string): { letter: string; alter: number } {
  const letter = note[0];
  const rest = note.slice(1);
  const alter = rest === '#' ? 1 : rest === 'b' ? -1 : rest === '##' ? 2 : rest === 'bb' ? -2 : 0;
  return { letter, alter };
}

function render(letter: string, alter: number): string {
  return letter + (alter > 0 ? '#'.repeat(alter) : 'b'.repeat(-alter));
}

// Correctly spelled major scale: one of each letter, accidentals chosen so the
// pitch classes match the major step pattern.
export function majorScale(tonic: string): string[] {
  const { letter, alter } = parse(tonic);
  const tonicPc = LETTER_PC[letter] + alter;
  const startIdx = LETTERS.indexOf(letter as (typeof LETTERS)[number]);
  return MAJOR_STEPS.map((step, i) => {
    const l = LETTERS[(startIdx + i) % 7];
    const targetPc = tonicPc + step;
    const diff = (((targetPc - LETTER_PC[l]) % 12) + 18) % 12 - 6; // into [-6, 5]
    return render(l, diff);
  });
}
