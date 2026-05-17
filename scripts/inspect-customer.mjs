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
const r = await c.query(
  `SELECT column_name, data_type, is_nullable, column_default
     FROM information_schema.columns
    WHERE table_schema = 'app' AND table_name IN ('customer','response','standards_version')
    ORDER BY table_name, ordinal_position`,
);
const members = await c.query(
  `SELECT table_name FROM information_schema.tables
    WHERE table_schema = 'app' AND table_name = 'members'`,
);
await c.end();
console.log(JSON.stringify({ cols: r.rows, members_exists: members.rowCount > 0 }, null, 2));
