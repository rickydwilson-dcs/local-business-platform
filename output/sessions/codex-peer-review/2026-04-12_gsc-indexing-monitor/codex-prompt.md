# Codex Peer Review Prompt

Paste this entire file into Codex in VS Code.

---

## Your task

You are doing an independent architectural peer review. Read the brief below, then produce your own implementation plan.

Save your plan as `codex-plan.md` in this folder:
`output/sessions/codex-peer-review/2026-04-12_gsc-indexing-monitor/`

When done, output this exact command so the user can copy-paste it into Claude Code:

```
/plan.with.codex synthesise output/sessions/codex-peer-review/2026-04-12_gsc-indexing-monitor/
```

---

## Brief: GSC Indexing Monitor

**Date:** 2026-04-12
**Project:** Local Business Platform monorepo
**Note:** This brief is sent to both Claude and Codex independently. Your plans will be synthesised into a final implementation spec. Do not look at `claude-plan.md` before writing your own plan.

### Problem Statement

A white-label website platform builds and deploys multiple client sites (currently: Colossus Scaffolding at `www.colossus-scaffolding.co.uk`, DJ Fox Electrical at `www.djfoxelectrical.com`). Google Search Console shows ~60 pages across these sites as "Discovered - currently not indexed" with never-crawled dates. The Search Console UI allows "Request Indexing" for only 10 URLs/day per site (manual, cannot be triggered via API).

The owner needs a daily automated tool that:

1. Downloads the list of unindexed URLs from Google Search Console (the Coverage Report CSV)
2. Re-submits the sitemap to signal freshness to Google
3. Logs results to Supabase for trend tracking
4. Generates monthly markdown reports for client reporting (a future formatter will convert these to polished PDFs)

The tool should work across all current and future platform sites with minimal per-site configuration.

### Goals

- Daily automated monitoring of GSC indexing status per site
- Sitemap re-submission each run as a freshness signal
- Persistent Supabase log of which URLs are unindexed, when they were first detected, and when they transitioned to indexed
- Monthly markdown report: URLs submitted, outstanding count, week-by-week trend, oldest unresolved URLs
- Clean CLI that works both locally and in GitHub Actions
- Extensible to new sites by adding one config entry

### Non-Goals

- Triggering "Request Indexing" via API (Google does not expose this endpoint publicly)
- Replacing Google Search Console as a monitoring tool
- Generating the polished client-facing PDF/HTML report (a future formatter job handles that)
- Any browser automation for authentication that requires persistent manual intervention more than once per month

### Acceptance Criteria

1. `pnpm gsc:login` completes browser-based Google sign-in and saves session
2. `pnpm gsc:inspect --dry-run` fetches the Coverage CSV, prints unindexed URL list, makes no DB writes
3. `pnpm gsc:inspect` runs full inspection, writes to `gsc_runs` and `gsc_url_inspections` tables in Supabase
4. `pnpm gsc:report --monthly 2026-04` writes `output/reports/gsc-[slug]-2026-04.md` with correct structure
5. GitHub Actions cron runs daily at 07:00 UTC without manual intervention (unless session expires)
6. Session expiry is detected before the run starts, not mid-run; error message tells user to run `pnpm gsc:login`
7. Adding a new site requires only one new entry in `tools/gsc-config.ts`

### Constraints

- **No "Request Indexing" API.** Google does not expose this. The tool inspects and logs status only.
- **Two separate rate limits** that must not be conflated:
  - URL Inspection API: 2,000 req/day (read-only status checks — may or may not be used)
  - "Request Indexing" UI button: 10/day/site (UI only, no API equivalent)
- **Playwright for CSV download** — the GSC Coverage Report CSV is only accessible via the web UI. Browser automation is required to download it.
- **Session persistence in CI** — GitHub Actions runners are ephemeral. The browser session (cookies) must be stored as a GitHub Secret and written to disk at workflow start. Session expiry means updating the secret, not re-architecting the tool.
- **Monorepo tool conventions** — all tools live in `tools/`, follow `tools/alert-system.ts` patterns (Commander.js CLI, dotenv from `.env.local`, chalk, Supabase via `tools/lib/supabase-client.ts`).
- **TypeScript + tsx** — all tools are TypeScript run via `tsx`. No compilation step.
- **Property type varies** — new platform sites use GSC domain properties (`sc-domain:example.com`). Inherited client sites may use URL-prefix properties (`https://www.example.com/`). The config must support both.
- **Playwright binary** — `npx playwright install chromium` must be run once. In GitHub Actions this is a workflow step.
- **Supabase schema changes** — new tables only, no changes to existing tables.
- **Monthly reports are markdown** — saved to `output/reports/`. A future job converts them to polished client PDFs.

### Relevant Architecture

**Tool pattern** — `tools/alert-system.ts` is the canonical example:

- `#!/usr/bin/env node` shebang
- JSDoc header documenting commands, env vars, constraints
- `dotenv.config({ path: '.env.local' })` at top
- `chalk` for coloured output
- `Commander` subcommands, each as a standalone `async function`
- Supabase client from `tools/lib/supabase-client.ts` via `getRegistry()` lazy init
- `program.parse()` at end

**Registry** — `tools/lib/supabase-client.ts`:

- `RegistryClient` class with methods for all existing tables
- `registry.listSites({ status: 'active' })` returns all active sites
- `Site` interface: `{ id, slug, name, domain, vercel_project_id, status }`
- New GSC methods should be added to this same class (not a new file)

**Existing tools** of note:

- `tools/manage-sites.ts` — site registry CLI, shows Commander pattern at scale
- `tools/alert-system.ts` — closest structural analogue; read this before designing

**Supabase tables** already exist: `sites`, `deployments`, `builds`, `metrics`, `alerts`, `content_generations`, `rate_limits`. All use UUID primary keys, `created_at`/`updated_at` TIMESTAMPTZ, and RLS with service-role-only policy.

**Package.json** already has: `commander`, `chalk`, `dotenv`, `@supabase/supabase-js`, `tsx`, `zod`, `googleapis` (used for Gemini). Does NOT have `playwright`.

### Codebase Snapshot

```
tools/
  gsc-indexing.ts         ← TO CREATE: main CLI
  gsc-config.ts           ← TO CREATE: site→GSC property mapping
  alert-system.ts         ← READ THIS: canonical tool pattern
  manage-sites.ts         ← READ THIS: Commander at scale
  lib/
    supabase-client.ts    ← MODIFY: add GSC methods
    gsc-client.ts         ← TO CREATE: service account auth + sitemap submit
    gsc-browser.ts        ← TO CREATE: Playwright session + CSV download
    REGISTRY_CLI.md       ← existing docs
.github/workflows/
  gsc-indexing.yml        ← TO CREATE: daily cron
docs/guides/
  gsc-setup.md            ← TO CREATE: setup instructions
output/reports/           ← TO CREATE dir: monthly report output
package.json              ← MODIFY: add gsc:* scripts
.env.example              ← MODIFY: document new env vars
```

**Key config sites live under** `sites/colossus-scaffolding/site.config.ts` and `sites/dj-fox-electrical/site.config.ts` — these contain `url` and `domain` fields but no GSC-specific fields. GSC config lives in `tools/gsc-config.ts` (a new file, not in site configs).

### What a Good Plan Should Cover

1. **Session management in CI**: how to store, restore, and detect expiry of the Playwright browser session in ephemeral GitHub Actions runners
2. **CSV parsing**: what columns does the GSC Coverage Report CSV actually contain, and how to extract URL + coverage state
3. **Transition tracking**: how to detect when a URL moves from "unindexed" to "indexed" across runs (requires comparing current run against previous run data in Supabase)
4. **Sitemap submission**: does the service account need GSC User-level permission, and does `sitemaps.submit` count against any quota?
5. **Monthly report content**: what exactly should appear in the markdown — what's the most useful data for a client who wants to understand their indexing progress?
6. **Playwright headless/headed split**: the login command must be headed (user needs to see the browser); the inspect command must be headless (runs in CI). How is this handled cleanly?
7. **Error handling**: what happens if GSC returns no data, if the session is expired, if the CSV download fails, if Supabase write fails?
8. **Quota pool future-proofing**: when the platform grows beyond ~13 sites (where 2,000 URL Inspection API quota / ~150 URLs per site = 13 sites), how should the tool scale? Note: the Playwright CSV approach has no API quota concern — only the `sitemaps.submit` call is API-based, and that has no meaningful quota.

---

## Deliverable

Produce a numbered implementation plan with:

- Clear phases/steps
- Which files are created or modified at each step
- Verification gates between steps (how to confirm each step succeeded before moving on)
- Any risks or trade-offs worth calling out

Save your response as `codex-plan.md` in `output/sessions/codex-peer-review/2026-04-12_gsc-indexing-monitor/`.

Then output this command for the user to copy-paste into Claude Code:
`/plan.with.codex synthesise output/sessions/codex-peer-review/2026-04-12_gsc-indexing-monitor/`
