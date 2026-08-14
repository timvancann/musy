<script lang="ts">
  import TabBar from './ui/TabBar.svelte';
  import { currentRoute } from './ui/router.svelte';
  import TrainScreen from './ui/screens/TrainScreen.svelte';
  import ChordsScreen from './ui/screens/ChordsScreen.svelte';
  import SettingsScreen from './ui/screens/SettingsScreen.svelte';
</script>

{#if currentRoute() === '/train'}<TrainScreen />
{:else if currentRoute() === '/chords'}<ChordsScreen />
{:else}<SettingsScreen />{/if}
<TabBar />
