<script lang="ts">
  import { buildPool, type ChordItem } from '../../core/theory/chords';
  import { buildDegreePool, type DegreeItem } from '../../core/theory/degrees';
  import { buildTriadPool, type TriadItem } from '../../core/theory/triads';
  import { mulberry32 } from '../../core/rng';
  import { getKinds, getSelectedKeys, getSelectedModes, getTriadToggles } from '../prefs';
  import { navigate } from '../router.svelte';
  import CircleArt from '../CircleArt.svelte';
  import { drillKeys } from '../keys';

  const rand = mulberry32(Date.now() >>> 0);
  const REVEAL_DEAD_MS = 300;

  type Direction = 'toDegree' | 'toChord';

  let view = $state<'select' | 'chords' | 'degrees' | 'triads'>('select');
  let chordPool = $state<ChordItem[]>([]);
  let degreePool = $state<DegreeItem[]>([]);
  let triadPool = $state<TriadItem[]>([]);
  let chord = $state<ChordItem | null>(null);
  let degree = $state<DegreeItem | null>(null);
  let triad = $state<TriadItem | null>(null);
  let direction = $state<Direction>('toDegree');
  let stage = $state<'show' | 'reveal'>('show');
  let shownAt = $state(0);
  let elapsedMs = $state(0);
  let revealAt = $state(0);
  let count = $state(0);
  let lastId: string | undefined;

  $effect(() => {
    chordPool = buildPool(getSelectedKeys(), getKinds());
    degreePool = buildDegreePool(getSelectedKeys(), getSelectedModes());
    triadPool = buildTriadPool(getSelectedKeys(), getTriadToggles());
  });

  $effect(() =>
    drillKeys({
      onSpace: () => onTap(Date.now()),
      onEscape: () => (view = 'select'),
      enabled: () => view !== 'select',
    }),
  );

  function pickFrom<T>(pool: T[], idOf: (x: T) => string): T {
    let candidates = pool;
    if (pool.length >= 3 && lastId) candidates = pool.filter(x => idOf(x) !== lastId);
    const chosen = candidates[Math.floor(rand() * candidates.length)];
    lastId = idOf(chosen);
    return chosen;
  }

  function next() {
    if (view === 'chords') {
      chord = pickFrom(chordPool, c => c.symbol);
    } else if (view === 'degrees') {
      degree = pickFrom(degreePool, d => `${d.tonic}${d.mode}${d.degree}`);
      direction = rand() < 0.5 ? 'toDegree' : 'toChord';
    } else {
      triad = pickFrom(triadPool, t => `${t.label}|${t.inversion}|${t.stringSet}`);
    }
    stage = 'show';
    shownAt = Date.now();
    elapsedMs = 0;
  }

  function startDrill(which: 'chords' | 'degrees' | 'triads') {
    view = which;
    count = 0;
    lastId = undefined;
    next();
  }

  // Tap on release only when the pointer didn't move (mirrors cuby's dry mode).
  const DRAG_SLOP_PX = 10;
  let down: { x: number; y: number; t: number } | null = null;

  function onDown(e: PointerEvent) {
    down = { x: e.clientX, y: e.clientY, t: Date.now() };
  }

  function onUp(e: PointerEvent) {
    if (!down) return;
    const moved = Math.hypot(e.clientX - down.x, e.clientY - down.y);
    const t = down.t;
    down = null;
    if (moved > DRAG_SLOP_PX) return;
    onTap(t);
  }

  function onTap(t: number) {
    // The triad trainer is untimed: any tap simply deals the next prompt.
    if (view === 'triads') {
      count += 1;
      next();
      return;
    }
    if (stage === 'show') {
      elapsedMs = t - shownAt;
      stage = 'reveal';
      revealAt = t;
      count += 1;
      return;
    }
    if (t - revealAt < REVEAL_DEAD_MS) return;
    next();
  }
</script>

<div class="screen train">
  {#if chordPool.length < 3}
    <div class="empty">
      <p>Select at least one key and chord type.</p>
      <button class="primary" onclick={() => navigate('/chords')}>Choose chords</button>
    </div>
  {:else if view === 'select'}
    <div class="mode-select">
      <h1>Train</h1>
      <button class="mode-card" onclick={() => startDrill('chords')}>
        <CircleArt size={96} />
        <span class="mode-name">Chords → Notes</span>
        <span class="dim">see a chord symbol, recall its notes</span>
      </button>
      <button class="mode-card" onclick={() => startDrill('degrees')}>
        <span class="numeral-art" aria-hidden="true">ii V I</span>
        <span class="mode-name">Degrees</span>
        <span class="dim">chord ↔ degree within a mode, both directions</span>
      </button>
      <button class="mode-card" onclick={() => startDrill('triads')}>
        <span class="numeral-art" aria-hidden="true">5-4-3</span>
        <span class="mode-name">Triads on the neck</span>
        <span class="dim">find the voicing on a string set, untimed</span>
      </button>
    </div>
  {:else}
    <header>
      <button class="back" onclick={() => (view = 'select')}>← modes</button>
      <span class="dim">{count} recalled</span>
    </header>
    <button class="zone" onpointerdown={onDown} onpointerup={onUp} onpointercancel={() => (down = null)}>
      {#if view === 'chords' && chord}
        {#if stage === 'show'}
          <p class="symbol">{chord.symbol}</p>
          <p class="hint">tap when you have the notes</p>
        {:else}
          <div class="reveal">
            <p class="symbol small">{chord.symbol}</p>
            <p class="big accent">{chord.notes.join(' ')}</p>
            <p class="time">{(elapsedMs / 1000).toFixed(2)}s</p>
            <p class="hint">tap for the next chord</p>
          </div>
        {/if}
      {:else if view === 'triads' && triad}
        <p class="symbol">{triad.label}</p>
        <p class="context">{triad.inversionLabel}</p>
        <p class="stringset">strings {triad.stringSet}</p>
        <p class="hint">find it on the neck, then tap for the next</p>
      {:else if view === 'degrees' && degree}
        {#if stage === 'show'}
          {#if direction === 'toDegree'}
            <p class="symbol">{degree.symbol}</p>
            <p class="context">in {degree.tonic} {degree.mode}</p>
            <p class="hint">which degree?</p>
          {:else}
            <p class="context">{degree.tonic} {degree.mode}</p>
            <p class="symbol">{degree.numeral}</p>
            <p class="hint">which chord?</p>
          {/if}
        {:else}
          <div class="reveal">
            <p class="context">{degree.tonic} {degree.mode}</p>
            <p class="big accent">{direction === 'toDegree' ? degree.numeral : degree.symbol}</p>
            <p class="secondary">{direction === 'toDegree' ? degree.symbol : degree.numeral} — {degree.notes.join(' ')}</p>
            <p class="time">{(elapsedMs / 1000).toFixed(2)}s</p>
            <p class="hint">tap for the next one</p>
          </div>
        {/if}
      {/if}
    </button>
    <p class="footnote dim">nothing is recorded — pure recall practice</p>
  {/if}
</div>

<style>
  .train { display: flex; flex-direction: column; }
  .empty { margin: auto; text-align: center; display: grid; gap: 12px; }
  header { display: flex; justify-content: space-between; align-items: center; gap: 8px; }
  .back {
    background: var(--panel); border: 1px solid var(--line); border-radius: var(--radius);
    color: var(--text); font: 600 15px var(--font-ui); padding: 0 18px; min-height: 44px; cursor: pointer;
  }
  .mode-select { display: grid; gap: 16px; align-content: center; justify-items: center; flex: 1; }
  .mode-select h1 { font-size: 20px; justify-self: start; }
  .mode-card {
    display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 10px;
    aspect-ratio: 1; width: min(100%, 27dvh);
    background: var(--panel); border: 2px solid var(--line); border-radius: 14px;
    color: var(--text); text-align: center; padding: 18px; cursor: pointer;
  }
  .mode-card:active { border-color: var(--accent); }
  .mode-name { font: 700 18px var(--font-ui); }
  .mode-card .dim { font-size: 12px; max-width: 24ch; }
  .numeral-art { font: 700 34px var(--font-mono); color: var(--accent); letter-spacing: 0.06em; }
  .zone {
    flex: 1; display: flex; flex-direction: column; align-items: center; justify-content: center;
    gap: 16px; background: none; border: 0; color: var(--text); cursor: pointer;
    -webkit-tap-highlight-color: transparent; touch-action: manipulation; user-select: none;
  }
  .symbol { font: 700 56px var(--font-mono); }
  .symbol.small { font-size: 28px; color: var(--dim); }
  .context { font: 500 20px var(--font-ui); color: var(--dim); }
  .stringset { font: 700 26px var(--font-mono); color: var(--accent); }
  .hint { color: var(--dim); font-size: 13px; }
  .reveal { display: flex; flex-direction: column; align-items: center; gap: 10px; }
  .big { font: 700 44px var(--font-mono); letter-spacing: 0.04em; }
  .accent { color: var(--accent); }
  .secondary { font: 600 18px var(--font-mono); color: var(--text); }
  .time { font: 600 28px var(--font-mono); font-variant-numeric: tabular-nums; }
  .footnote { font-size: 12px; text-align: center; padding-bottom: 8px; }
  .primary {
    background: var(--accent); color: var(--accent-ink); border: 0; border-radius: var(--radius);
    font: 700 15px var(--font-ui); padding: 14px 18px; cursor: pointer;
  }
</style>
