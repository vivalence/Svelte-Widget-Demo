<script>
  import Component from "./Component.svelte";
  import { onMount, mount, unmount } from "svelte";
  import { createClassComponent } from "svelte/legacy";

  const { data, bundle, payload } = $props();

  let component = $state(null);

  async function fetchAndCompileAST() {
    const response = await fetch(bundle, { method: "GET" });
    const text = await response.text();
    const blob = new Blob([text], { type: "application/javascript" });
    const url = URL.createObjectURL(blob);
    const { default: Widget } = await import(/* @vite-ignore */ url);
    console.log(Widget);
    component = Widget;
  }

  onMount(async () => {
    const { default: Widget } = await import(/* @vite-ignore */ bundle);
    component = Widget;

    // OLD:
    /* fetchAndCompileAST(); */
  });
</script>

<p class="text-gray">Widget/Widget.svelte</p>
{#if component}
  <Component this={component} {payload} />
{:else}
  <span class="text-gray">Loading component...</span>
{/if}
