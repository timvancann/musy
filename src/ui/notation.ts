// Display-level chord notation: data always stores letter suffixes; the jazz
// toggle rewrites them Real Book style. Order matters (m7b5 before m7 before m).
const JAZZ: [string, string][] = [
  ['m7b5', 'ø'],
  ['maj7', '∆'],
  ['dim', '°'],
  ['aug', '+'],
  ['m7', '-7'],
  ['m', '-'],
];

export function chordSymbol(symbol: string, jazz: boolean): string {
  if (!jazz) return symbol;
  const match = symbol.match(/^([A-G](?:#{1,2}|b{1,2})?)(.*)$/);
  if (!match) return symbol;
  const [, root, suffix] = match;
  if (suffix.startsWith('sus')) return symbol;
  for (const [from, to] of JAZZ) {
    if (suffix === from) return root + to;
  }
  return symbol;
}
