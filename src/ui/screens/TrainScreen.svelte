<script lang="ts">
  import { buildPool, type ChordItem } from '../../core/theory/chords';
  import { mulberry32 } from '../../core/rng';
  import { getKinds, getSelectedKeys } from '../prefs';
  import { navigate } from '../router.svelte';
  import CircleArt from '../CircleArt.svelte';

  const rand = mulberry32(Date.now() >>> 0);
  const REVEAL_DEAD_MS = 300;

  let view = $state<'select' | 'drill'>('select');
  let pool = $state<ChordItem[]>([]);
  let item = $state<ChordItem | null>(null);
  let stage = $state<'show' | 'reveal'>('show');
  let shownAt = $state(0);
  let elapsedMs = $state(0);
  let revealAt = $state(0);
  let count = $state(0);
  let lastSymbol: string | undefined;

  $effect(() => {
    pool = buildPool(getSelectedKeys(), getKinds());
  });

  function pick(): ChordItem {
    let candidates = pool;
    if (pool.length >= 3 && lastSymbol) candidates = pool.filter(c => c.symbol !== lastSymbol);
    return candidates[Math.floor(rand() * candidates.length)];
  }

  function next() {
    item = pick();
    lastSymbol = item.symbol;
    stage = 'show';
    shownAt = Date.now();
    elapsedMs = 0;
  }

  function startDrill() {
    view = 'drill';
    count = 0;
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
    if (!item) return;
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
  {#if pool.length < 3}
    <div class="empty">
      <p>Select at least one key and chord type.</p>
      <button class="primary" onclick={() => navigate('/chords')}>Choose chords</button>
    </div>
  {:else if view === 'select'}
    <div class="mode-select">
      <h1>Train</h1>
      <button class="mode-card" onclick={startDrill}>
        <CircleArt size={110} />
        <span class="mode-name">Chords → Notes</span>
        <span class="dim">see a chord symbol, recall its notes</span>
      </button>
    </div>
  {:else if item}
    <header>
      <button class="back" onclick={() => (view = 'select')}>← modes</button>
      <span class="dim">{count} recalled</span>
    </header>
    <button class="zone" onpointerdown={onDown} onpointerup={onUp} onpointercancel={() => (down = null)}>
      {#if stage === 'show'}
        <p class="symbol">{item.symbol}</p>
        <p class="hint">tap when you have the notes</p>
      {:else}
        <div class="reveal">
          <p class="symbol small">{item.symbol}</p>
          <p class="notes">{item.notes.join(' ')}</p>
          <p class="time">{(elapsedMs / 1000).toFixed(2)}s</p>
          <p class="hint">tap for the next chord</p>
        </div>
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
    aspect-ratio: 1; width: min(100%, 38dvh);
    background: var(--panel); border: 2px solid var(--line); border-radius: 14px;
    color: var(--text); text-align: center; padding: 18px; cursor: pointer;
  }
  .mode-card:active { border-color: var(--accent); }
  .mode-name { font: 700 18px var(--font-ui); }
  .mode-card .dim { font-size: 12px; max-width: 24ch; }
  .zone {
    flex: 1; display: flex; flex-direction: column; align-items: center; justify-content: center;
    gap: 16px; background: none; border: 0; color: var(--text); cursor: pointer;
    -webkit-tap-highlight-color: transparent; touch-action: manipulation; user-select: none;
  }
  .symbol { font: 700 56px var(--font-mono); }
  .symbol.small { font-size: 28px; color: var(--dim); }
  .hint { color: var(--dim); font-size: 13px; }
  .reveal { display: flex; flex-direction: column; align-items: center; gap: 10px; }
  .notes { font: 700 40px var(--font-mono); color: var(--accent); letter-spacing: 0.04em; }
  .time { font: 600 28px var(--font-mono); font-variant-numeric: tabular-nums; }
  .footnote { font-size: 12px; text-align: center; padding-bottom: 8px; }
  .primary {
    background: var(--accent); color: var(--accent-ink); border: 0; border-radius: var(--radius);
    font: 700 15px var(--font-ui); padding: 14px 18px; cursor: pointer;
  }
</style>
