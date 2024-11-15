import { dirname, fromFileUrl, join, basename, extname } from "$std/path/mod.ts";
import esbuild from "esbuild";
import sveltePlugin from "esbuild-svelte";
import { cache } from "esbuild-plugin-cache";

// const SVELTE_VERSION = "https://esm.sh/svelte@5.1.9";
const SVELTE_VERSION = "svelte";
const svelteImportMap = {
  importmap: {
    imports: {
      svelte: SVELTE_VERSION,
      "svelte/": `${SVELTE_VERSION}/`,
      // "svelte/internal/disclose-version": `${SVELTE_VERSION}/internal/disclose-version`,
      // "svelte/internal/client": `${SVELTE_VERSION}/internal/client`,
    },
  },
};

async function bundleSvelte(entry) {
  console.log("Bundling svelte", entry);
  const build = await esbuild.build({
    entryPoints: [entry],
    mainFields: ["svelte", "browser", "module", "main"],
    conditions: ["svelte", "browser"],
    target: "es6",
    format: "esm",
    // sourcemap: "inline",
    sourcemap: false,
    treeShaking: true,
    minify: false,
    keepNames: true,
    write: false,
    bundle: true,
    outdir: dirname(entry),
    plugins: [
      cache(svelteImportMap),
      sveltePlugin({
        compilerOptions: {
          filename: basename(entry),
          css: "injected",
        },
      }),
    ],
  });

  return build.outputFiles;
}

function createBundler(input) {
  const bundles = new Map();

  const bundler = async (path) => {
    if (process.env.NODE_ENV === "dev" || !bundles.has(path)) {
      const bundle = await bundleSvelte(path);
      for (const { path, text } of bundle) {
        bundles.set(path, text);
      }
    }

    return bundles.get(path);
  };

  bundler.serve = () => async (ctx) => {
    try {
      const path = join(dirname(input.path), ctx.params.filename);
      const bundle = await bundler(path);

      if (bundle) {
        ctx.response.body = bundle;
        ctx.response.type = "application/javascript";
      } else {
        ctx.response.status = 404;
        ctx.response.body = "Bundle not found";
      }
    } catch (error) {
      console.error("Bundling error:", error);
      ctx.response.status = 500;
      ctx.response.body = "Error creating bundle";
    }
  };

  bundler.url = "/bundle/:filename";

  return bundler;
}

export default createBundler;
