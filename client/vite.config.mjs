import { defineConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import { sveltekit } from '@sveltejs/kit/vite';
import { fromFileUrl, dirname, join } from '$std/path/mod.ts';

// https://github.com/bluwy/create-vite-extra/tree/master/template-deno-svelte/src
import 'svelte';
import '@sveltejs/kit';
import '@sveltejs/vite-plugin-svelte';
import 'tailwindcss';
import 'autoprefixer';

const root = dirname(fromFileUrl(import.meta.url));

export default defineConfig({
  resolve: {
    alias: {
      $lib: join(root, './src/lib'),
      $components: join(root, './src/components'),
    },
    extensions: ['.js', '.ts', '.jsx', '.tsx', '.json', '.svelte', '.mjs'],
  },
  plugins: [sveltekit()],
  server: {
    fs: { allow: ['../../..'] },
  },
});
