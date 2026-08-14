import { scaleWithSteps, MAJOR_STEPS, notePc, raiseSemitone } from './notes';

export const MODES = ['Ionian', 'Dorian', 'Phrygian', 'Lydian', 'Mixolydian', 'Aeolian', 'Locrian'] as const;
export type Mode = (typeof MODES)[number];

const NUMERALS = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII'];

export interface DegreeItem {
  tonic: string;
  mode: Mode;
  degree: number; // 1-based
  numeral: string; // e.g. 'ii', 'bIII', '#iv°', 'V'
  symbol: string; // seventh-chord symbol, e.g. 'Bm7', 'G7', 'Ebmaj7', 'Dm7b5'
  notes: string[];
}

function modeSteps(mode: Mode): number[] {
  const shift = MODES.indexOf(mode);
  const pattern = [2, 2, 1, 2, 2, 2, 1];
  const rotated = [...pattern.slice(shift), ...pattern.slice(0, shift)];
  const steps = [0];
  for (let i = 0; i < 6; i++) steps.push(steps[i] + rotated[i]);
  return steps;
}

const ENHARMONIC: Record<string, string> = {
  'Db': 'C#', 'C#': 'Db', 'Ab': 'G#', 'G#': 'Ab', 'Eb': 'D#', 'D#': 'Eb',
  'Gb': 'F#', 'F#': 'Gb', 'Bb': 'A#', 'A#': 'Bb', 'B': 'Cb', 'Cb': 'B',
};

const hasDoubles = (scale: string[]) => scale.some(n => n.includes('##') || n.includes('bb'));

// A tonic whose mode scale needs double accidentals is a theoretical spelling
// (e.g. Db Aeolian -> Bbb); respell it enharmonically (C# Aeolian) instead.
export function practicalTonic(tonic: string, mode: Mode): string {
  if (!hasDoubles(scaleWithSteps(tonic, modeSteps(mode)))) return tonic;
  const alt = ENHARMONIC[tonic];
  if (alt && !hasDoubles(scaleWithSteps(alt, modeSteps(mode)))) return alt;
  return tonic;
}

export function modeScale(tonic: string, mode: Mode): string[] {
  return scaleWithSteps(practicalTonic(tonic, mode), modeSteps(mode));
}

function interval(root: string, note: string): number {
  return (((notePc(note) - notePc(root)) % 12) + 12) % 12;
}

function seventhSuffix(notes: string[]): string {
  const third = interval(notes[0], notes[1]);
  const fifth = interval(notes[0], notes[2]);
  const seventh = interval(notes[0], notes[3]);
  if (third === 4 && seventh === 11) return 'maj7';
  if (third === 4 && seventh === 10) return '7';
  if (third === 3 && fifth === 6) return 'm7b5';
  return 'm7';
}

export function degreeChords(rawTonic: string, mode: Mode): DegreeItem[] {
  const tonic = practicalTonic(rawTonic, mode);
  const scale = modeScale(tonic, mode);
  const majorPcs = modeSteps('Ionian');
  const pcs = modeSteps(mode);
  return scale.map((root, i) => {
    let notes = [scale[i], scale[(i + 2) % 7], scale[(i + 4) % 7], scale[(i + 6) % 7]];
    let dominant = false;
    if (mode === 'Aeolian' && i === 4) {
      // Practical convention: the minor-key V carries the raised leading tone.
      notes = [notes[0], raiseSemitone(notes[1]), notes[2], notes[3]];
      dominant = true;
    }
    const third = interval(notes[0], notes[1]);
    const fifth = interval(notes[0], notes[2]);
    const diff = (((pcs[i] - majorPcs[i]) % 12) + 18) % 12 - 6; // -1, 0, or 1
    const prefix = diff === -1 ? 'b' : diff === 1 ? '#' : '';
    const base = NUMERALS[i];
    const cased = third === 3 ? base.toLowerCase() : base;
    const numeral = prefix + cased + (fifth === 6 ? '°' : '');
    const suffix = dominant ? '7' : seventhSuffix(notes);
    return { tonic, mode, degree: i + 1, numeral, symbol: notes[0] + suffix, notes };
  });
}

export function buildDegreePool(tonics: string[], modes: Mode[]): DegreeItem[] {
  return tonics.flatMap(t => modes.flatMap(m => degreeChords(t, m)));
}
