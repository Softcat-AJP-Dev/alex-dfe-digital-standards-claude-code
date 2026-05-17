// One-off: grant the platform's runtime SP access to the app schema so
// the API can read/write at runtime. Run as the DB admin (alex@) once
// per project. Re-running is safe (idempotent).
//
// Safe to delete after first publish is working.

import pg from "pg";
import { DefaultAzureCredential } from "@azure/identity";

const HOST = "pg-dfe-digital-standards-claude-code-nrc47kbqicsvu.postgres.database.azure.com";
const RUNTIME_ROLE = "aip-platform-1b40d8b3";

const cred = new DefaultAzureCredential();
const tok = await cred.getToken("https://ossrdbms-aad.database.windows.net/.default");
const c = new pg.Client({
  host: HOST,
  database: "app",
  user: "alex@explainitlabs.com",
  password: tok.token,
  port: 5432,
  ssl: { rejectUnauthorized: false },
});
await c.connect();
const statements = [
  `GRANT CONNECT ON DATABASE "app" TO "${RUNTIME_ROLE}"`,
  `GRANT USAGE ON SCHEMA "app" TO "${RUNTIME_ROLE}"`,
  `GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA "app" TO "${RUNTIME_ROLE}"`,
  `GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA "app" TO "${RUNTIME_ROLE}"`,
  `GRANT ALL PRIVILEGES ON ALL FUNCTIONS IN SCHEMA "app" TO "${RUNTIME_ROLE}"`,
  // Future migrations: anything alex@ creates in `app` is auto-granted to the runtime role.
  `ALTER DEFAULT PRIVILEGES IN SCHEMA "app" GRANT ALL PRIVILEGES ON TABLES TO "${RUNTIME_ROLE}"`,
  `ALTER DEFAULT PRIVILEGES IN SCHEMA "app" GRANT ALL PRIVILEGES ON SEQUENCES TO "${RUNTIME_ROLE}"`,
  `ALTER DEFAULT PRIVILEGES IN SCHEMA "app" GRANT ALL PRIVILEGES ON FUNCTIONS TO "${RUNTIME_ROLE}"`,
];
for (const sql of statements) {
  process.stdout.write(`  • ${sql} ... `);
  await c.query(sql);
  console.log("ok");
}
await c.end();
console.log("\nRuntime principal access granted.");
