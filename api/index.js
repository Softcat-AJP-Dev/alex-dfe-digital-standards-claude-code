import { Hono } from "hono";
import { customersRoutes } from "./routes/customers";
import { assessmentsRoutes } from "./routes/assessments";
import { standardsRoutes } from "./routes/standards";
import { reportsRoutes } from "./routes/reports";
import { readAipUser } from "./auth";
import { query } from "./db";
const app = new Hono();
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
// Local-dev: lift Hono with @hono/node-server so you can hit it on :8787.
// At publish, the platform's bundler bypasses this and serves the export.
if (process.env.LOCAL_DEV === "1") {
    // Lazy import so the prod bundle doesn't carry the node-server dep.
    const { serve } = await import("@hono/node-server");
    serve({ fetch: app.fetch, port: 8787 });
    // eslint-disable-next-line no-console
    console.log("[api] local dev server listening on :8787");
}
export default app;
