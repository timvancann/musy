<script lang="ts">
  // Circle of fifths: 12 dots, a few lit accent-yellow — musy's mode-card mark.
  let { size = 96 }: { size?: number } = $props();
  const dots = Array.from({ length: 12 }, (_, i) => {
    const a = (i / 12) * 2 * Math.PI - Math.PI / 2;
    return { x: 60 + 44 * Math.cos(a), y: 60 + 44 * Math.sin(a), on: [0, 1, 4, 7].includes(i) };
  });
</script>

<svg viewBox="0 0 120 120" width={size} height={size} aria-hidden="true">
  <circle cx="60" cy="60" r="44" fill="none" stroke="var(--line)" stroke-width="2" />
  {#each dots as d}
    <circle cx={d.x} cy={d.y} r={d.on ? 7 : 4.5} fill={d.on ? 'var(--accent)' : 'var(--panel-2)'}
      stroke={d.on ? 'none' : 'var(--line)'} stroke-width="1.5" />
  {/each}
</svg>
