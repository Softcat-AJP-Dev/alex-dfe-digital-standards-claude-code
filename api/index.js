import { Hono } from "hono";
import { customersRoutes } from "./routes/customers";
import { assessmentsRoutes } from "./routes/assessments";
import { standardsRoutes } from "./routes/standards";
import { reportsRoutes } from "./routes/reports";
import { readAipUser } from "./auth";
import { query } from "./db";
const app = new Hono();
// Surface unhandled errors with their real message instead of Hono's
// default plain "Internal Server Error" text. Otherwise debugging across
// the sub-path edge is guesswork.
app.onError((err, c) => {
    // eslint-disable-next-line no-console
    console.error("[api onError]", c.req.method, c.req.path, err);
    return c.json({
        error: "internal_error",
        message: err instanceof Error ? err.message : String(err),
        route: `${c.req.method} ${c.req.path}`,
    }, 500);
});
// Version — embedded at build time so a fresh `curl /api/version` confirms
// the published bundle matches the source. Doesn't touch the DB or
// identity — safest possible smoke test.
const BUILD_ID = "2026-05-17-onerror";
app.get("/version", (c) => c.json({ buildId: BUILD_ID, ok: true }));
// Health — also handy for confirming AAD-to-Postgres works end-to-end.
app.get("/health", async (c) => {
    try {
        const r = await query("SELECT NOW() AS now");
        return c.json({ ok: true, now: r.rows[0].now });
    }
    catch (err) {
        const msg = err instanceof Error ? err.message : String(err);
        return c.json({ ok: false, error: msg }, 500);
    }
});
// Who am I — useful for the frontend to render the signed-in consultant.
// Doesn't require membership; just echoes the platform-injected identity.
app.get("/me", (c) => {
    const u = readAipUser(c);
    if (!u)
        return c.json({ error: "no_identity" }, 401);
    return c.json(u);
});
app.route("/customers", customersRoutes);
app.route("/assessments", assessmentsRoutes);
app.route("/standards", standardsRoutes);
app.route("/reports", reportsRoutes);
// IMPORTANT: nothing async at module top level. The platform bundles this
// file with esbuild --format=cjs; top-level await blocks the sandbox's
// synchronous require() and the runtime reports api_runtime_unavailable.
// Local-dev server bootstrap lives in api/local-dev.ts.
export default app;
