# Musy

A recall-speed trainer for music theory on guitar. See a chord, know its
notes. See a key and a degree, know the chord. Faster every day.

**Use it: https://timvancann.github.io/musy/** (add to home screen, works
fully offline)

## Why

Knowing theory and *recalling* it at playing speed are different skills.
Musy drills the second one: no quizzes, no multiple choice, just a prompt,
a running clock, and the honest answer of how long you needed. It is the
sister app of [Cuby](https://github.com/timvancann/cuby), which does the
same for Rubik's cube recognition, and it shares Cuby's design and
tap-to-recall practice loop.

## What it does

- **Chords → Notes** — a chord symbol appears (diatonic triads, sevenths,
  and sus chords across the practical circle-of-fifths keys); tap when you
  have the notes, and check yourself against the correctly spelled answer.
  Yes, F# major's seventh chord really contains an E#.
- **Degrees** — chord to roman numeral and back, in any of the seven modes.
  Aeolian uses the practical dominant V, so C Aeolian's V is G7, the way
  real music works.

Everything is generated from a small, tested theory core, so spellings are
always right and theoretical keys respell themselves the way a musician
would write them.

## Develop

    npm install
    npm run dev
    npm test
