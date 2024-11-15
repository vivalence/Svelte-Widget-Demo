<script>
  import Widget from "$components/Widget/Widget.svelte";

  const COMPONENT_URL = "http://localhost:3000/bundle/module.svelte.js";
  const payload = { some: "data" };
</script>

<div class="container mx-auto flex flex-col justify-center items-center h-full">
  <h1>Widget</h1>
  <Widget bundle={COMPONENT_URL} {payload} />
  <a href="/test"> second page </a>
</div>
