<script lang="ts">
  import { KEYS, buildPool, type KindToggles } from '../../core/theory/chords';
  import { getKinds, getSelectedKeys, setKinds, setSelectedKeys } from '../prefs';

  let selected = $state<string[]>(getSelectedKeys());
  let kinds = $state<KindToggles>(getKinds());

  function toggleKey(k: string) {
    selected = selected.includes(k) ? selected.filter(x => x !== k) : [...selected, k];
    setSelectedKeys([...selected]);
  }

  function toggleKind(kind: keyof KindToggles) {
    kinds = { ...kinds, [kind]: !kinds[kind] };
    setKinds({ ...kinds });
  }

  const poolSize = $derived(buildPool(selected, kinds).length);
</script>

<div class="screen">
  <h1>Chords <span class="dim">{poolSize} in the pool</span></h1>

  <h2 class="section-title">Keys</h2>
  <div class="chips">
    {#each KEYS as k}
      <button class="chip" class:on={selected.includes(k)} onclick={() => toggleKey(k)}>{k}</button>
    {/each}
  </div>

  <h2 class="section-title">Chord types</h2>
  <section>
    <button class="row" onclick={() => toggleKind('triads')}>
      <span>Diatonic triads</span><span class="dim">{kinds.triads ? 'on' : 'off'}</span>
    </button>
    <button class="row" onclick={() => toggleKind('sevenths')}>
      <span>Diatonic sevenths</span><span class="dim">{kinds.sevenths ? 'on' : 'off'}</span>
    </button>
    <button class="row" onclick={() => toggleKind('sus')}>
      <span>Sus chords (sus2, sus4)</span><span class="dim">{kinds.sus ? 'on' : 'off'}</span>
    </button>
  </section>
</div>

<style>
  h1 { font-size: 20px; margin-bottom: 12px; }
  h1 .dim { font-size: 13px; font-weight: 400; margin-left: 8px; }
  h2.section-title { font-size: 16px; margin: 20px 0 8px; color: var(--dim); font-weight: 500; }
  .chips { display: grid; grid-template-columns: repeat(4, 1fr); gap: 8px; }
  .chip {
    background: var(--panel); border: 2px solid var(--line); border-radius: var(--radius);
    color: var(--text); font: 600 16px var(--font-mono); min-height: 48px; cursor: pointer;
  }
  .chip.on { border-color: var(--accent); color: var(--accent); }
  section { display: grid; gap: 1px; background: var(--line); border-radius: var(--radius); overflow: hidden; }
  .row {
    display: flex; justify-content: space-between; align-items: center;
    background: var(--panel); color: var(--text); border: 0; text-align: left;
    font: 500 14px var(--font-ui); padding: 14px 14px; min-height: 48px; cursor: pointer;
  }
</style>
