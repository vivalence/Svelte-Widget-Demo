<script>
  import { onDestroy, mount, unmount } from "svelte";

  /* let component
   * export { component as this } */

  let { this: component, payload } = $props();

  let target = $state(null);
  let cmp = $state(null);

  const create = () => {
    console.log("Widget/Component.svelte creating: target, component", target, component);
    cmp = mount(component, { target, props: payload });
    // Not reached.
    console.log("cmp", cmp);

    // OLD:
    /* cmp = new component({target, props: payload,}); */
  };

  const cleanup = () => {
    if (!cmp) return;
    console.log("destroying", cmp);
    cmp.$destroy();
    cmp = null;
  };

  $effect(() => {
    if (component && target) {
      cleanup();
      create();
    }
    return cleanup;
  });

  $effect(() => {
    if (cmp) {
      console.log("effect setting props", restProps);
      // Not reached.

      cmp.$set(restProps);
    }
  });

  onDestroy(cleanup);
</script>

<p class="text-gray">Widget/Component.svelte</p>
<div id="game-container" bind:this={target} />
