const LETTERS = ['C', 'D', 'E', 'F', 'G', 'A', 'B'] as const;
const LETTER_PC: Record<string, number> = { C: 0, D: 2, E: 4, F: 5, G: 7, A: 9, B: 11 };
export const MAJOR_STEPS = [0, 2, 4, 5, 7, 9, 11];

function parse(note: string): { letter: string; alter: number } {
  const letter = note[0];
  const rest = note.slice(1);
  const alter = rest === '#' ? 1 : rest === 'b' ? -1 : rest === '##' ? 2 : rest === 'bb' ? -2 : 0;
  return { letter, alter };
}

function render(letter: string, alter: number): string {
  return letter + (alter > 0 ? '#'.repeat(alter) : 'b'.repeat(-alter));
}

// Correctly spelled scale: one of each letter, accidentals chosen so the
// pitch classes match the given step pattern.
export function scaleWithSteps(tonic: string, steps: number[]): string[] {
  const { letter, alter } = parse(tonic);
  const tonicPc = LETTER_PC[letter] + alter;
  const startIdx = LETTERS.indexOf(letter as (typeof LETTERS)[number]);
  return steps.map((step, i) => {
    const l = LETTERS[(startIdx + i) % 7];
    const targetPc = tonicPc + step;
    const diff = (((targetPc - LETTER_PC[l]) % 12) + 18) % 12 - 6; // into [-6, 5]
    return render(l, diff);
  });
}

export function majorScale(tonic: string): string[] {
  return scaleWithSteps(tonic, MAJOR_STEPS);
}

export function notePc(note: string): number {
  const { letter, alter } = parse(note);
  return (((LETTER_PC[letter] + alter) % 12) + 12) % 12;
}

export function raiseSemitone(note: string): string {
  const { letter, alter } = parse(note);
  return render(letter, alter + 1);
}
