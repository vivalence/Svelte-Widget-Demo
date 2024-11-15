<script>
  let { ...data } = $props();
  console.log("Hello World from Test.svelte");
  console.log("Check these amazing props", data);
</script>

<h1 class="text-palette-white">My Test</h1>
