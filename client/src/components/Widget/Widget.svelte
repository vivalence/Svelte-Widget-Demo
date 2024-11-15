<script>
  import { onMount, unmount, onDestroy } from "svelte";

  const { bundle, payload } = $props();

  let component = $state(null);
  let target = $state(null);

  onMount(async () => {
    const { default: Game } = await import(/* @vite-ignore */ bundle);
    component = await Game(target, payload);
  });

  onDestroy(() => {
    component && unmount(component);
  });
</script>

<div id="game-container" bind:this={target} />

{#if !component}
  <span class="text-gray">Loading component...</span>
{/if}
