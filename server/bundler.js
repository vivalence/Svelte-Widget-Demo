import { dirname, fromFileUrl, join, basename } from '$std/path/mod.ts';
import esbuild from 'esbuild';
import sveltePlugin from 'esbuild-svelte';
import { cache } from 'esbuild-plugin-cache';

const SVELTE_VERSION = 'https://esm.sh/svelte@5.1.9';
const svelteImportMap = {
  importmap: {
    imports: {
      svelte: SVELTE_VERSION,
      'svelte/': `${SVELTE_VERSION}/`,
    },
  },
};

async function bundleSvelte(entry) {
  const build = await esbuild.build({
    entryPoints: [entry],
    mainFields: ['svelte', 'browser', 'module', 'main'],
    conditions: ['svelte', 'browser'],
    target: 'es6',
    format: 'esm',
    write: false,
    bundle: true,
    outdir: dirname(entry),
    outExtension: { '.js': '.svelte' },
    plugins: [
      cache(svelteImportMap),
      sveltePlugin({
        compilerOptions: {
          filename: basename(entry),
          css: 'injected',
        },
      }),
    ],
  });

  return build.outputFiles;
}

function createBundler(input) {
  const bundles = new Map();
  const bundlers = { svelte: bundleSvelte };

  const bundler = async (path) => {
    const type = path.split('.').pop();

    if (!bundlers[type])
      throw new Error(`No bundler available for type: ${type}`);

    if (process.env.NODE_ENV === 'dev' || !bundles.has(path)) {
      const bundle = await bundlers[type](path);
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
        ctx.response.type = 'application/javascript';
      } else {
        ctx.response.status = 404;
        ctx.response.body = 'Bundle not found';
      }
    } catch (error) {
      console.error('Bundling error:', error);
      ctx.response.status = 500;
      ctx.response.body = 'Error creating bundle';
    }
  };

  bundler.url = '/bundle/:filename';

  return bundler;
}

export default createBundler;

// import { dirname, fromFileUrl, join, basename } from "$std/path/mod.ts";
// import config from "@vivalence/config";
// import svelte from "./bundlers/svelte.js";

// function createBundler(input) {
//   const bundles = new Map();
//   const BASE_URL = "bundle";

//   const bundler = async (path) => {
//     const type = path.split(".").pop();
//     if ((type === "svelte" && config.isDev) || !bundles.has(path)) {
//       const bundle = await bundlers[type](path);
//       for (const { path, text } of bundle) {
//         bundles.set(path, text);
//       }
//     }
//     return bundles.get(path);
//   };

//   bundler.injectBundleUrl = () => async (ctx, next) => {
//     const rootpath = new URL(input.url, config.env.get("DAEMON_URL")).toString();
//     const bundlepath = join("/", BASE_URL, basename(input.path));
//     ctx.state.game = ctx.state.game || {};
//     ctx.state.game.bundle = rootpath + bundlepath;
//     await next();
//   };

//   bundler.url = `/${BASE_URL}/:filename`;
//   bundler.serve = () => async (ctx) => {
//     const path = join(dirname(input.path), ctx.params.filename);
//     const bundle = await bundler(path);
//     if (bundle) {
//       const CACHE_AGE = config.env.get("CACHE_AGE_SECONDS");
//       ctx.response.headers.set("Cache-Control", `max-age=${CACHE_AGE}`);
//       ctx.response.headers.set("Expires", new Date(Date.now() + CACHE_AGE * 1000).toUTCString());
//       ctx.response.body = bundle;
//       ctx.response.type = "application/javascript";
//     }
//   };

//   return bundler;
// }

// export default createBundler;

// import config from "@vivalence/config";
// import { dirname, basename } from "$std/path/mod.ts";

// import esbuild from "npm:esbuild@latest";
// import sveltePlugin from "npm:esbuild-svelte@latest";
// import { cache } from "npm:esbuild-plugin-cache";

// export default async function (entry) {
//   const build = await esbuild.build({
//     entryPoints: [entry],
//     mainFields: ["svelte", "browser", "module", "main"],
//     conditions: ["svelte", "browser"],
//     target: "es6",
//     format: "esm",
//     write: false,
//     treeShaking: true,
//     // in order for .map to be treated separately, i must parse the output file and replace the sourvemappingurl with the url under which its loadable. this is because the widget component creates a url from blob thus destroying the relative path reference. `// # sourceMappingURL=Game.svelte.map` -> https://xxx/Game.svelte.map
//     sourcemap: config.isDev ? "inline" : false,
//     minify: false,
//     bundle: true,
//     outdir: dirname(entry),
//     outExtension: { ".js": ".svelte" },
//     plugins: [
//       cache(svelteImportMap),
//       sveltePlugin({
//         filterWarnings: (warning, handler) => {
//           if (!warning.code.startsWith("a11y-")) {
//             console.warn("[Game Build Warnings:]");
//             console.warn(entry);
//             console.warn(warning);
//             console.warn("[/Game Build Warnings]");
//           }
//         },
//         compilerOptions: {
//           filename: basename(entry),
//           css: "injected",
//           compatibility: {
//             // componentApi: 4,
//           },
//         },
//       }),
//     ],
//   });
//   return build.outputFiles;
// }

// // console.log(`${config.env.get("VIVA_PACKAGES_DIR")}/ui/mod.js`);
// // /Users/finn/vivalence/code/vivalence/packages/ui/mod.js
// const svelte = "https://esm.sh/svelte@5.1.9";

// const svelteImportMap = {
//   importmap: {
//     imports: {
//       svelte,
//       // "@vivalence/ui": `../../../../packages/ui/mod.js`,
//       // ugly. absolute or repo imports not working. doesnt import nested packages.
//       "svelte/store": `${svelte}/store`,
//       "svelte/motion": `${svelte}/motion`,
//       "svelte/internal": `${svelte}/internal`,
//       "svelte/internal/disclose-version": `${svelte}/internal/disclose-version`,
//       // "svelte-gestures": "https://esm.sh/svelte-gestures@5.0.4",
//       // "@rwh/keystrokes": "https://esm.sh/@rwh/keystrokes@1.5.6",
//     },
//   },
// };
