import { Application, Router } from "oak";
import { dirname, fromFileUrl, join } from "$std/path/mod.ts";

import createBundler from "./bundler.js";

export async function startServer(port = 3000) {
  const app = new Application();
  const router = new Router();

  const bundleProps = {
    path: join(dirname(fromFileUrl(import.meta.url)), "./component/module.svelte.js"),
  };
  const bundler = createBundler(bundleProps);

  router.get(bundler.url, bundler.serve());

  app.use(async (ctx, next) => {
    ctx.response.headers.set("Access-Control-Allow-Origin", "*");
    ctx.response.headers.set("Access-Control-Allow-Methods", "*");
    await next();
  });
  app.use(router.routes());
  app.use(router.allowedMethods());

  await app.listen({ port });

  return app;
}
