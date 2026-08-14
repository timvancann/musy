<script lang="ts">
  const QUALITIES: { name: string; formula: string }[] = [
    { name: 'Major triad', formula: '1 3 5' },
    { name: 'Minor triad', formula: '1 b3 5' },
    { name: 'Diminished triad', formula: '1 b3 b5' },
    { name: 'maj7', formula: '1 3 5 7' },
    { name: 'm7', formula: '1 b3 5 b7' },
    { name: '7 (dominant)', formula: '1 3 5 b7' },
    { name: 'm7b5 (half-dim)', formula: '1 b3 b5 b7' },
    { name: 'sus2', formula: '1 2 5' },
    { name: 'sus4', formula: '1 4 5' },
  ];
</script>

<div class="screen">
  <h1>Settings</h1>
  <h2 class="section-title">Reference — chord formulas</h2>
  <section>
    {#each QUALITIES as q}
      <div class="row">
        <span>{q.name}</span><span class="formula">{q.formula}</span>
      </div>
    {/each}
  </section>
  <p class="dim about">Musy — chord recall trainer. Sister app of Cuby.</p>
</div>

<style>
  h1 { font-size: 20px; margin-bottom: 12px; }
  h2.section-title { font-size: 16px; margin: 20px 0 8px; color: var(--dim); font-weight: 500; }
  section { display: grid; gap: 1px; background: var(--line); border-radius: var(--radius); overflow: hidden; }
  .row {
    display: flex; justify-content: space-between; align-items: center;
    background: var(--panel); color: var(--text);
    font: 500 14px var(--font-ui); padding: 12px 14px;
  }
  .formula { font: 600 14px var(--font-mono); color: var(--accent); }
  .about { font-size: 12px; margin-top: 20px; text-align: center; }
</style>
