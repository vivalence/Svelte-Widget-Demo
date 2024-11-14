import { Application, Router } from 'oak';
import { dirname, fromFileUrl, join } from '$std/path/mod.ts';

import createBundler from './bundler.js';

export async function startServer(port = 3000) {
  const app = new Application();
  const router = new Router();

  const bundler = createBundler({
    path: join(
      dirname(fromFileUrl(import.meta.url)),
      './component/Test.svelte',
    ),
  });

  router.get(bundler.url, bundler.serve());

  app.use(async (ctx, next) => {
    ctx.response.headers.set('Access-Control-Allow-Origin', '*');
    ctx.response.headers.set('Access-Control-Allow-Methods', '*');
    await next();
  });
  app.use(router.routes());
  app.use(router.allowedMethods());

  await app.listen({ port });

  return app;
}

// const serverDir = dirname(fromFileUrl(import.meta.url)); const componentPath = join(serverDir, "component", "Test.svelte");
// router.get("/bundle/:component", async (ctx) => {if (ctx.params.component === "Test.svelte") {try {// const bundle = await bundleSvelteComponent(componentPath); ctx.response.headers.set("Content-Type", "text/plain"); ctx.response.body = bundle;} catch (error) {ctx.response.status = 500; ctx.response.body = "Error loading component";}} else {ctx.response.status = 404; ctx.response.body = "Component not found";}});
