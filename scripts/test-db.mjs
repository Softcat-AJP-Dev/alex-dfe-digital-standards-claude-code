// One-off connection check for the publish-prep flow. Lists DB state.
// Safe to delete after the publish is working.

import pg from "pg";
import { DefaultAzureCredential } from "@azure/identity";

const HOST = "pg-dfe-digital-standards-claude-code-nrc47kbqicsvu.postgres.database.azure.com";
const DB = "app";

const upn = process.argv[2];
if (!upn) {
  console.error("usage: node scripts/test-db.mjs <pg-user-name>");
  process.exit(2);
}

const cred = new DefaultAzureCredential();
const tok = await cred.getToken("https://ossrdbms-aad.database.windows.net/.default");
if (!tok) throw new Error("no token");

const client = new pg.Client({
  host: HOST,
  database: DB,
  user: upn,
  password: tok.token,
  port: 5432,
  ssl: { rejectUnauthorized: false },
  connectionTimeoutMillis: 10000,
});

try {
  await client.connect();
  const who = await client.query(
    "SELECT current_user AS me, current_database() AS db, version() AS pg",
  );
  const schemas = await client.query(
    `SELECT schema_name FROM information_schema.schemata
      WHERE schema_name NOT IN ('pg_catalog', 'information_schema', 'pg_toast')
      ORDER BY 1`,
  );
  const roles = await client.query(
    `SELECT r.rolname,
            r.rolsuper, r.rolcreaterole, r.rolcreatedb,
            ARRAY(SELECT b.rolname FROM pg_catalog.pg_auth_members m
                   JOIN pg_catalog.pg_roles b ON m.roleid = b.oid
                  WHERE m.member = r.oid) AS member_of
       FROM pg_catalog.pg_roles r
      WHERE r.rolname = current_user`,
  );
  await client.end();
  console.log(
    JSON.stringify(
      {
        identity: who.rows[0],
        schemas: schemas.rows.map((r) => r.schema_name),
        privileges: roles.rows[0],
      },
      null,
      2,
    ),
  );
} catch (err) {
  console.error("CONNECT FAILED as", upn);
  console.error(err.code || "", err.message);
  process.exit(1);
}
