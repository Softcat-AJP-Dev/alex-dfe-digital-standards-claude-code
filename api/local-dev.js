// Local dev entry — NOT included in the production bundle.
// `api/index.ts` exports the Hono app and is what the platform bundles
// (esbuild walks only that file's import graph). This file lifts the app
// onto @hono/node-server so you can hit it on :8787 while developing.
import { serve } from "@hono/node-server";
import app from "./index";
const port = Number(process.env.PORT ?? 8787);
serve({ fetch: app.fetch, port });
// eslint-disable-next-line no-console
console.log(`[api] local dev server listening on :${port}`);
