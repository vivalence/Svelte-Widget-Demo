import { defineConfig } from "vite";
import { svelte } from "@sveltejs/vite-plugin-svelte";
import { sveltekit } from "@sveltejs/kit/vite";
import { fromFileUrl, dirname, join } from "$std/path/mod.ts";

// https://github.com/bluwy/create-vite-extra/tree/master/template-deno-svelte/src
import "svelte";
import "@sveltejs/kit";
import "@sveltejs/vite-plugin-svelte";
import "tailwindcss";
import "autoprefixer";

const root = dirname(fromFileUrl(import.meta.url));

export default defineConfig({
  resolve: {
    alias: {
      $lib: join(root, "./src/lib"),
      $components: join(root, "./src/components"),
    },
    extensions: [".js", ".ts", ".jsx", ".tsx", ".json", ".svelte", ".mjs"],
  },
  plugins: [sveltekit()],
  server: {
    fs: { allow: ["../../.."] },
  },
  build: {
    rollupOptions: {
      onwarn: (warning, warn) => {
        console.log("warning,warn");
        console.log(warning, warn);
        if (warning.code === "DYNAMIC_IMPORT_VARIABLES") return;
        // Ignore specific warnings by their code
        // if (warning.code === 'SOME_WARNING_CODE') return;

        // // Ignore specific warnings by their message
        // if (warning.message.includes('some specific message')) return;

        // // Forward other warnings to the default handler
        // warn(warning);
      },
    },
  },
});
