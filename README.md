# DfE Digital Standards — Schools Maturity Model

A consultant-facing tool to take UK schools and colleges through the
[DfE digital and technology standards](https://www.gov.uk/guidance/meeting-digital-and-technology-standards-in-schools-and-colleges),
score them against a 1–5 maturity model anchored to the gov.uk language,
and generate a printable report.

Provisioned on the AI Provisioning Platform. Owner: Alex Pearce. Published
at `/alex/dfe-digital-standards-claude-code/` (path-based, **not** root —
every URL respects this).

## What's in the box

- **12 standards** seeded from gov.uk: 6 core (broadband, wireless,
  switching, leadership & governance, filtering & monitoring, cyber
  security) and 6 additional (cloud, accessibility, IT support, devices,
  cabling, servers).
- **~85 sub-criteria** under those standards, with verbatim source
  language and links back to gov.uk.
- **5 level descriptors per sub-criterion** (Initial → Developing →
  Compliant → Established → Leading), drafted to be defensible against
  the "must / should / could" language on gov.uk.
- **Assessment flow** — per customer, save-as-you-go, evidence notes and
  links per sub-criterion.
- **Frozen report** — radar chart, prioritised gap list, full
  standard-by-standard breakdown, printable to PDF in-browser.

## First-time setup

```sh
pnpm install
az login                     # interactive AAD sign-in for local Postgres access
cp .env.example .env.local   # fill in any blanks for your env
```

Generate an AAD-backed `DATABASE_URL` once per shell (token lasts ~1h):

```sh
export DATABASE_URL="postgresql://${AIP_PG_USER}:$(az account get-access-token \
  --resource-type oss-rdbms --query accessToken -o tsv)@${AIP_PG_HOST}:5432/${AIP_PG_DATABASE}?sslmode=require"
```

Create the initial migration (only needed once — the file gets committed):

```sh
pnpm prisma migrate dev --name init
```

Seed the reference data (the 12 standards + sub-criteria + descriptors):

```sh
pnpm db:seed
```

Run the Hono API and the Vite frontend in two terminals:

```sh
pnpm api:dev     # http://localhost:8787
pnpm dev         # http://localhost:5173/alex/dfe-digital-standards-claude-code/
```

## How publish works

The AI Provisioning Platform's publish pipeline:

1. Clones `main`.
2. Runs `pnpm install --frozen-lockfile=false && pnpm build`.
3. Runs `prisma migrate deploy` against the project Postgres.
4. Bundles `api/index.ts` with esbuild into a single CJS file.
5. Uploads `dist/` and activates the new version atomically.

**The seed is not run automatically.** Run `pnpm db:seed` once against
the production database after the first publish (or whenever a new
`StandardsVersion` is added). The seed is idempotent on a version string.

## Conventions and platform rules

- **Auth is handled by the platform host.** Two headers are forwarded
  into the API after sign-in: `aip-user` (email) and `aip-user-oid`
  (Entra object id). Per-customer ownership uses `aip-user-oid` so
  records survive email changes.
- **`app.members`** is platform-managed — seeded from the publish
  allowlist on every publish. The API reads it as a 403 gate; nothing in
  this repo writes to it.
- **No blob storage.** Evidence is text notes or links, or small inline
  content.
- **Standards are versioned.** A new gov.uk update means a new
  `StandardsVersion` row plus a fresh seed run; existing reports stay
  pinned to the version they were generated against.

## Repository map

```
api/                         Hono app served at /alex/.../api/*
  index.ts                   Hono entry; exports default app
  db.ts                      pg pool + AAD token caching
  auth.ts                    aip-user header + app.members gate
  routes/                    customers · assessments · standards · reports
prisma/
  schema.prisma              Source of truth for the schema
  seed.ts                    12 standards + 85 sub-criteria + 415 descriptors
src/
  main.tsx · App.tsx         React SPA, BrowserRouter at the project sub-path
  api.ts                     Typed fetch client (sub-path aware)
  components/                Layout, RadarChart
  pages/                     Customers · CustomerDetail · Assessment · Report
docs/
  PLATFORM.md                Long-form platform reference (provisioned)
  DATABASE.md                Postgres connection recipe (provisioned)
CLAUDE.md / AGENTS.md        AI-tool instructions (provisioned)
```

## Need help

Platform support and provisioning: <https://aip.softcat.io>.
