import type { Context, MiddlewareHandler, Next } from "hono";
import { query } from "./db";

// Platform-injected headers — see docs/PLATFORM.md "Trust model".
// These arrive AFTER the host's auth + permission gate, so we trust them.
// We must NEVER consult Authorization, X-User-*, or query-string identity.

export type AipUser = {
  email: string;
  oid: string;
};

export function readAipUser(c: Context): AipUser | null {
  const email = c.req.header("aip-user");
  const oid = c.req.header("aip-user-oid");
  if (!email || !oid) return null;
  return { email, oid };
}

// Require a logged-in user (header present) AND that they're in app.members.
// app.members is platform-managed: seeded from the publish allowlist on every
// publish AND every permission update. We don't write to it.
export const requireMember: MiddlewareHandler = async (c: Context, next: Next) => {
  const user = readAipUser(c);
  if (!user) {
    // Per the platform contract, logged-out users never reach our code.
    // If we see this, the host failed open — report it as an internal error.
    return c.json(
      { error: "missing_identity_headers", hint: "host failed open" },
      500,
    );
  }
  const r = await query<{ ok: number }>(
    "SELECT 1 AS ok FROM app.members WHERE email = $1",
    [user.email],
  );
  if (r.rowCount === 0) {
    return c.json({ error: "not_a_member" }, 403);
  }
  c.set("user", user);
  return next();
};

declare module "hono" {
  interface ContextVariableMap {
    user: AipUser;
  }
}
