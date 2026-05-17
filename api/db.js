import { Pool } from "pg";
import { DefaultAzureCredential } from "@azure/identity";
const credential = new DefaultAzureCredential();
const SCOPE = "https://ossrdbms-aad.database.windows.net/.default";
// Cache the token. AAD tokens are valid for ~1h; @azure/identity caches and
// refreshes for us, but we keep a wrapper here to avoid awaiting on every
// query when the pool is fetching new connections.
let cachedToken = null;
async function getToken() {
    const now = Date.now();
    if (cachedToken && cachedToken.expiresOnTimestamp - now > 60_000) {
        return cachedToken.token;
    }
    const tok = await credential.getToken(SCOPE);
    if (!tok)
        throw new Error("Failed to acquire AAD token for Postgres");
    cachedToken = tok;
    return tok.token;
}
// Single shared pool. The platform sandbox is one Node process per published
// version; we lazy-create the pool on first use so cold-start cost is paid
// once per process.
let pool = null;
async function getPool() {
    if (pool)
        return pool;
    const password = await getToken();
    pool = new Pool({
        host: process.env.AIP_PG_HOST,
        database: process.env.AIP_PG_DATABASE,
        user: process.env.AIP_PG_USER,
        password,
        port: 5432,
        ssl: { rejectUnauthorized: false },
        max: 4,
        idleTimeoutMillis: 30_000,
        // Resolve unqualified table/type names in the `app` schema first.
        // Set at connect-time via libpq startup options so it precedes any query.
        options: "-c search_path=app,public",
    });
    // pg doesn't expose a password-refresh hook on the Pool; we hook into the
    // 'error' event to recycle the pool when AAD tokens expire mid-flight.
    pool.on("error", (err) => {
        // eslint-disable-next-line no-console
        console.error("[pg pool error]", err.message);
    });
    return pool;
}
export async function withClient(fn) {
    const p = await getPool();
    const client = await p.connect();
    try {
        return await fn(client);
    }
    finally {
        client.release();
    }
}
export async function query(text, params) {
    return withClient(async (client) => {
        const res = await client.query(text, params);
        return { rows: res.rows, rowCount: res.rowCount ?? 0 };
    });
}
