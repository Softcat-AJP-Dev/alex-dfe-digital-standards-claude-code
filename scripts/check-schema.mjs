import pg from "pg";
import { DefaultAzureCredential } from "@azure/identity";

const HOST = "pg-dfe-digital-standards-claude-code-nrc47kbqicsvu.postgres.database.azure.com";
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
const tables = await c.query(
  `SELECT table_schema, table_name
     FROM information_schema.tables
    WHERE table_schema = 'app' AND table_type = 'BASE TABLE'
    ORDER BY table_name`,
);
const types = await c.query(
  `SELECT n.nspname AS schema, t.typname AS type
     FROM pg_type t
     JOIN pg_namespace n ON n.oid = t.typnamespace
    WHERE n.nspname = 'app' AND t.typtype = 'e'
    ORDER BY t.typname`,
);
const roles = await c.query(
  `SELECT rolname FROM pg_roles WHERE rolname NOT LIKE 'pg_%' ORDER BY rolname`,
);
await c.end();
console.log(JSON.stringify({ tables: tables.rows, enums: types.rows, roles: roles.rows.map(r => r.rolname) }, null, 2));
