# Database — DfE Digital Standards - Claude Code

The AI Provisioning Platform attached a Postgres Flexible Server to
this project. This file is the long-form integration guide that you
(or your AI assistant) should read before writing DB-touching code.

## Connection at a glance

- **Server:** `(unknown)`
- **Database:** `(unknown)`
- **Auth:** Microsoft Entra ID only — no passwords on the server.

## Full connection guidance

- **Type:** PostgreSQL Flexible Server (B1ms burstable — ~£11/month)
- **Server FQDN:** `(unknown)`
- **Database name:** `(unknown)`
- **Auth:** Microsoft Entra ID **only** — password auth is disabled at the server level.
- **Admin:** `alex@explainitlabs.com` (you). Run `az login` then connect with any tool that supports AAD: `psql` (`PGPASSWORD=$(az account get-access-token --resource-type oss-rdbms --query accessToken -o tsv) psql 'host=<fqdn> dbname=<db> user=alex@explainitlabs.com sslmode=require'`), the Node `pg` driver with a token via `@azure/identity`, etc.
- **No password to store.** No `.env` secret. To grant your hosted app access, run `SELECT * FROM pgaadauth_create_principal('<app-mi-name>', false, false);` in the database as you, then `GRANT ALL ON SCHEMA app TO "<app-mi-name>";`.

**Connection string shape** (when a tool insists on a URL):

```
postgresql://<user>:<aad-token>@(unknown):5432/(unknown)?sslmode=require
```

- `<user>` — your AAD principal (`alex@explainitlabs.com`) when running locally,
  or the platform service principal at runtime — read it from the
  injected env var `AIP_PG_USER`.
- `<aad-token>` — fetched fresh each connection. NEVER bake into the URL
  and check it into config; tokens last ~1h. Use `DefaultAzureCredential`
  + `getToken('https://ossrdbms-aad.database.windows.net/.default')` and
  pass the result as the password to the `pg` driver. The `@azure/identity`
  SDK caches and refreshes for you.
- `sslmode=require` is non-negotiable — the server rejects unencrypted
  connections.

## API runtime conventions

Server-side code lives in **`api/`**. The platform bundles it on
every publish (esbuild → CJS) and serves it at
`/alex/dfe-digital-standards-claude-code/api/*`. The runtime is a sandboxed Node process per
published version — it spins up on first request and stays warm.

**Conventions**

- **Single entry**: `api/index.ts` must `export default` a Hono app.
  The bundler walks its imports; everything in your `package.json`
  is inlined into one self-contained `api.bundle.cjs`.
- **Env vars** the runtime injects automatically:
  - `AIP_PG_HOST`, `AIP_PG_DATABASE` — connect with these.
  - `AIP_PG_USER` — Postgres principal name (the platform SP).
  - `AZURE_TENANT_ID`, `AZURE_CLIENT_ID`, `AZURE_CLIENT_SECRET` —
    pass to `@azure/identity` so DefaultAzureCredential authenticates.
  - any `project_secrets` you've added via the portal Secrets tab.
- **User identity** per request:
  - `aip-user` header — signed-in user's email.
  - `aip-user-oid` header — their Entra object id.
  These are forwarded by the host *after* the auth gate has passed.
  Don't trust them otherwise — they're set by the host, not the client.

**Starter shape**

```typescript
// api/index.ts
import { Hono } from "hono";
import { DefaultAzureCredential } from "@azure/identity";
import { Client } from "pg";

const app = new Hono();

app.get("/health", async (c) => {
  // Get an Entra token for Postgres OSS RDBMS scope. Token TTL is 1h;
  // refresh on every request for v1 simplicity, cache for prod.
  const cred = new DefaultAzureCredential();
  const token = await cred.getToken(
    "https://ossrdbms-aad.database.windows.net/.default",
  );
  const client = new Client({
    host: process.env.AIP_PG_HOST,
    database: process.env.AIP_PG_DATABASE,
    user: process.env.AIP_PG_USER,
    password: token!.token,
    port: 5432,
    ssl: { rejectUnauthorized: false },
  });
  await client.connect();
  const r = await client.query("SELECT NOW()");
  await client.end();
  return c.json({ ok: true, now: r.rows[0].now });
});

export default app;
```

## Local development

Use `DefaultAzureCredential` from `@azure/identity`. Sign in once
via `az login` and the SDK picks up your CLI credentials. The same
code works locally and in the platform sandbox — no branching.

## Migrations

- **Prisma:** add `prisma` + `@prisma/client` to package.json and
  put your schema in `prisma/schema.prisma`. The platform's publish
  pipeline detects this and runs `prisma migrate deploy` before
  uploading the build artefact.
- **Drizzle:** equivalent flow lands in a later release. For now,
  run migrations manually before publishing.

## Troubleshooting

- **`SASL: SCRAM-SERVER-FIRST-MESSAGE` errors:** you're trying
  password auth against an AAD-only server. Use a token, not a
  password.
- **`no pg_hba.conf entry`:** firewall is missing the Azure-services
  rule. Re-run the bicep deploy to reconcile.
- **`token expired`:** OSS-RDBMS tokens last ~1h. Mint fresh on each
  request from `DefaultAzureCredential` — the SDK caches under the
  hood, so this is cheap.
