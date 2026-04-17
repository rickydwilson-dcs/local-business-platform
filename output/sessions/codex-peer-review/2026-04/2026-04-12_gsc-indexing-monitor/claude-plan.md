# Claude's Implementation Plan: GSC Indexing Monitor

**Date:** 2026-04-12
**Author:** Claude (independent plan, before synthesis)

---

## Phase 1: Infrastructure

### Step 1.1 — Install packages

```bash
pnpm add -D playwright
```

`googleapis` is already in `package.json` (used for Gemini). Playwright is new.

Add to root `package.json` scripts:

```json
"gsc:login":          "tsx tools/gsc-indexing.ts login",
"gsc:inspect":        "tsx tools/gsc-indexing.ts inspect",
"gsc:inspect:dry":    "tsx tools/gsc-indexing.ts inspect --dry-run",
"gsc:report":         "tsx tools/gsc-indexing.ts report",
"gsc:report:monthly": "tsx tools/gsc-indexing.ts report --monthly",
"gsc:verify":         "tsx tools/gsc-indexing.ts verify"
```

**Verification gate:** `pnpm gsc:login --help` exits without error.

---

### Step 1.2 — Supabase tables (`tools/supabase-schema-gsc.sql`)

Run in Supabase SQL Editor after creating the file.

**`gsc_runs`** — one row per tool invocation per site:

```sql
CREATE TABLE IF NOT EXISTS gsc_runs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  run_id TEXT UNIQUE NOT NULL,
  site_id UUID REFERENCES sites(id) ON DELETE SET NULL,
  site_slug TEXT NOT NULL,
  status TEXT DEFAULT 'running'
    CHECK (status IN ('running', 'completed', 'failed', 'partial')),
  urls_discovered INTEGER DEFAULT 0,
  urls_unindexed INTEGER DEFAULT 0,
  sitemap_submitted BOOLEAN DEFAULT false,
  started_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  completed_at TIMESTAMPTZ,
  error_message TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_gsc_runs_site_slug ON gsc_runs(site_slug);
CREATE INDEX IF NOT EXISTS idx_gsc_runs_started_at ON gsc_runs(started_at DESC);
ALTER TABLE gsc_runs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Service role access" ON gsc_runs FOR ALL USING (auth.role() = 'service_role');
```

**`gsc_url_inspections`** — one row per URL per run, plus transition tracking:

```sql
CREATE TABLE IF NOT EXISTS gsc_url_inspections (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  run_id TEXT NOT NULL,
  site_id UUID REFERENCES sites(id) ON DELETE CASCADE,
  site_slug TEXT NOT NULL,
  url TEXT NOT NULL,
  coverage_state TEXT,
  is_unindexed BOOLEAN GENERATED ALWAYS AS (
    coverage_state ILIKE '%not indexed%'
  ) STORED,
  last_detected_by_google TIMESTAMPTZ,
  inspected_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_gsc_inspections_site_slug ON gsc_url_inspections(site_slug);
CREATE INDEX IF NOT EXISTS idx_gsc_inspections_run_id ON gsc_url_inspections(run_id);
CREATE INDEX IF NOT EXISTS idx_gsc_inspections_url ON gsc_url_inspections(url, site_slug);
CREATE INDEX IF NOT EXISTS idx_gsc_inspections_unindexed ON gsc_url_inspections(is_unindexed) WHERE is_unindexed = true;
ALTER TABLE gsc_url_inspections ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Service role access" ON gsc_url_inspections FOR ALL USING (auth.role() = 'service_role');
```

**Transition tracking** (detecting when a URL moves to indexed):
Rather than storing `first_seen_unindexed` / `first_seen_indexed` on each row (which would require updates across rows), tracking is done at query time in the monthly report: compare the set of unindexed URLs from run N against run N-1. URLs present in N-1 but absent in N were indexed between those runs. This keeps the schema simple and the data immutable (each row is a point-in-time snapshot).

**Verification gate:** Both tables appear in Supabase dashboard with correct columns and RLS enabled.

---

### Step 1.3 — `tools/gsc-config.ts`

Static map of site slug → GSC config. One entry per site. Adding a site = one object here.

```typescript
export interface GscSiteConfig {
  /**
   * GSC property string passed to the API.
   * Domain property (preferred for new sites):  'sc-domain:example.com'
   * URL-prefix property (inherited client sites): 'https://www.example.com/'
   * Check: GSC > Settings > Property type to confirm which was registered.
   */
  gscProperty: string;
  propertyType: "domain" | "url-prefix";
  /** Full URL to the sitemap index — submitted each run via sitemaps.submit */
  sitemapIndexUrl: string;
  /**
   * The domain string as it appears in GSC's property switcher.
   * Used by Playwright to select the correct property in the UI.
   * For domain properties this is typically 'example.com' (no sc-domain: prefix).
   * For URL-prefix properties this is the full URL including trailing slash.
   */
  gscUiIdentifier: string;
}

export const GSC_SITE_CONFIG: Record<string, GscSiteConfig> = {
  "colossus-scaffolding": {
    gscProperty: "sc-domain:colossus-scaffolding.co.uk",
    propertyType: "domain",
    sitemapIndexUrl: "https://www.colossus-scaffolding.co.uk/sitemap-index.xml",
    gscUiIdentifier: "colossus-scaffolding.co.uk",
  },
  "dj-fox-electrical": {
    gscProperty: "sc-domain:djfoxelectrical.com",
    propertyType: "domain",
    sitemapIndexUrl: "https://www.djfoxelectrical.com/sitemap-index.xml",
    gscUiIdentifier: "djfoxelectrical.com",
  },
};
```

**Verification gate:** `import { GSC_SITE_CONFIG } from './gsc-config'` resolves without type errors.

---

## Phase 2: Library Modules

### Step 2.1 — `tools/lib/gsc-browser.ts`

Playwright-based session management and CSV download.

**Session storage:** stored at `GSC_SESSION_PATH` env var (default: `./secrets/gsc-session.json`). In CI, `GSC_SESSION_JSON` env var contains the JSON string, which is written to `GSC_SESSION_PATH` before the run.

**`GscSessionExpiredError`** — custom error class; thrown when Playwright detects a redirect to accounts.google.com. Caught in `gsc-indexing.ts` `inspect` command and surfaces as: `"Session expired. Run: pnpm gsc:login"`.

**Exported functions:**

```typescript
/** One-time headed login. Saves session to GSC_SESSION_PATH. */
export async function loginGsc(): Promise<void>;

/**
 * Validates the session file exists and contains non-expired cookies.
 * Does NOT launch a browser — just checks the file.
 * Returns false if file missing, JSON invalid, or any cookie is expired.
 */
export async function isSessionValid(): Promise<boolean>;

/**
 * Downloads the "Discovered - currently not indexed" CSV for the given GSC property.
 * Throws GscSessionExpiredError if redirected to login.
 * Returns array of { url: string, coverageState: string, lastDetected: string | null }
 */
export async function downloadCoverageReport(config: GscSiteConfig): Promise<CoverageRow[]>;

export interface CoverageRow {
  url: string;
  coverageState: string;
  lastDetected: string | null; // ISO date string or null
}
```

**GSC Coverage Report CSV structure** (based on known GSC export format):
The exported CSV has columns: `URL`, `Coverage state`, `Last crawled` (may be empty). The tool filters to rows where `Coverage state` contains "not indexed".

**Navigation flow for `downloadCoverageReport`:**

1. Launch headless Chromium, restore session from file
2. Navigate to `https://search.google.com/search-console/index?resource_id=[encodeURIComponent(gscProperty)]`
3. If URL redirects to `accounts.google.com` → throw `GscSessionExpiredError`
4. Wait for Coverage report to load
5. Find and click the "Export" button, select "Download CSV"
6. Intercept the download event, capture the buffer
7. Parse CSV with a minimal inline parser (no extra dependency — split on newlines, parse header row, extract URL and Coverage state columns)
8. Filter to rows where `Coverage state` ILIKE `'%not indexed%'`
9. Close browser, return parsed rows

**Headed vs headless:**

- `loginGsc()` — always headed (`headless: false`)
- `downloadCoverageReport()` — always headless (`headless: true`)
- No config flag needed; the split is by function, not by option

**Verification gate:** `pnpm gsc:login` opens a browser, completes login, file appears at `secrets/gsc-session.json`.

---

### Step 2.2 — `tools/lib/gsc-client.ts`

Service account auth and sitemap submission. No Playwright — pure API.

```typescript
import { google } from "googleapis";

/**
 * Creates a GoogleAuth instance from env.
 * Reads GSC_SERVICE_ACCOUNT_KEY_JSON first (CI), falls back to GSC_SERVICE_ACCOUNT_KEY_PATH (local).
 */
export async function createGscAuth(): Promise<InstanceType<typeof google.auth.GoogleAuth>>;

/**
 * Submits the sitemap index to GSC via the sitemaps.submit API.
 * Requires the service account to have "User" permission on the GSC property.
 * No meaningful quota — this is a one-shot signal per run.
 */
export async function submitSitemap(
  auth: ReturnType<typeof createGscAuth>,
  siteUrl: string,
  feedpath: string
): Promise<void>;

/**
 * Lists all GSC properties the service account can access.
 * Used by the `verify` command.
 */
export async function listProperties(auth: ReturnType<typeof createGscAuth>): Promise<string[]>;
```

**Verification gate:** `pnpm gsc:verify` prints the list of accessible GSC properties without error.

---

### Step 2.3 — Extend `tools/lib/supabase-client.ts`

Add to the existing `RegistryClient` class. Follow the existing pattern exactly — no new files.

**New types:**

```typescript
export interface GscRun {
  id: string;
  run_id: string;
  site_id: string | null;
  site_slug: string;
  status: "running" | "completed" | "failed" | "partial";
  urls_discovered: number;
  urls_unindexed: number;
  sitemap_submitted: boolean;
  started_at: string;
  completed_at: string | null;
  error_message: string | null;
  created_at: string;
}

export interface GscUrlInspection {
  id: string;
  run_id: string;
  site_id: string | null;
  site_slug: string;
  url: string;
  coverage_state: string | null;
  is_unindexed: boolean;
  last_detected_by_google: string | null;
  inspected_at: string;
  created_at: string;
}
```

**New methods on `RegistryClient`:**

- `createGscRun(data: Omit<GscRun, 'id' | 'created_at'>): Promise<GscRun>`
- `updateGscRun(runId: string, data: Partial<Pick<GscRun, 'status' | 'urls_discovered' | 'urls_unindexed' | 'sitemap_submitted' | 'completed_at' | 'error_message'>>): Promise<void>`
- `bulkLogGscUrls(rows: Omit<GscUrlInspection, 'id' | 'is_unindexed' | 'created_at'>[]): Promise<void>` — bulk insert, not one-by-one
- `getGscRuns(siteSlug?: string, limit?: number): Promise<GscRun[]>`
- `getGscUnindexedUrls(siteSlug: string, runId?: string): Promise<GscUrlInspection[]>`
- `getGscMonthlyData(siteSlug: string, year: number, month: number): Promise<{ runs: GscRun[]; urlsByRun: Record<string, GscUrlInspection[]> }>`

**Verification gate:** TypeScript compiles without errors after adding these methods.

---

## Phase 3: Main CLI (`tools/gsc-indexing.ts`)

### Step 3.1 — File structure

Follows `tools/alert-system.ts` exactly:

```typescript
#!/usr/bin/env node
/**
 * GSC Indexing Monitor
 *
 * Tracks Google Search Console indexing status across all platform sites.
 * Downloads the Coverage Report CSV via browser automation (Playwright),
 * logs results to Supabase, re-submits the sitemap each run.
 *
 * IMPORTANT CONSTRAINTS:
 * - Google does NOT expose a "Request Indexing" API. This tool monitors and logs only.
 * - The 10/day "Request Indexing" UI limit is separate from the URL Inspection API (2,000/day).
 *   This tool uses neither for the bulk URL list — Playwright downloads the CSV instead.
 * - Sitemap submission is a freshness HINT, not a crawl guarantee.
 *
 * Commands:
 *   login              One-time browser login. Saves session to GSC_SESSION_PATH.
 *   inspect [slug]     Download Coverage CSV, log to Supabase, submit sitemap.
 *   report [slug]      Show recent inspection results from Supabase.
 *   verify             Confirm service account can access configured GSC properties.
 *
 * Environment Variables:
 *   GSC_SESSION_PATH            Path to browser session file (default: ./secrets/gsc-session.json)
 *   GSC_SESSION_JSON            Session JSON string (CI — written to GSC_SESSION_PATH at start)
 *   GSC_SERVICE_ACCOUNT_KEY_JSON  Service account JSON string (CI)
 *   GSC_SERVICE_ACCOUNT_KEY_PATH  Service account JSON file path (local)
 *   SUPABASE_URL                Supabase project URL
 *   SUPABASE_SERVICE_KEY        Supabase service role key
 */

import { Command } from "commander";
import chalk from "chalk";
import * as dotenv from "dotenv";
dotenv.config({ path: ".env.local" });
```

### Step 3.2 — `login` command

```typescript
async function loginCommand() {
  console.log(chalk.blue("Opening browser for Google Sign-In..."));
  console.log(chalk.yellow("Complete the login in the browser window, then close it."));
  await loginGsc();
  console.log(chalk.green("Session saved. Run `pnpm gsc:inspect` to start."));
}
```

### Step 3.3 — `inspect [slug]` command

```typescript
async function inspectCommand(slug: string | undefined, opts: InspectOptions) {
  // 1. Restore CI session if GSC_SESSION_JSON is set
  if (process.env.GSC_SESSION_JSON) {
    writeFileSync(sessionPath, process.env.GSC_SESSION_JSON);
  }

  // 2. Validate session BEFORE starting any runs
  if (!(await isSessionValid())) {
    console.error(chalk.red('GSC session expired or missing. Run: pnpm gsc:login'));
    process.exit(1);
  }

  // 3. Determine site list
  const sites = slug
    ? [slug]
    : Object.keys(GSC_SITE_CONFIG);

  // 4. Per-site loop
  for (const siteSlug of sites) {
    const config = GSC_SITE_CONFIG[siteSlug];
    if (!config) {
      console.warn(chalk.yellow(`No GSC config for site: ${siteSlug} — skipping`));
      continue;
    }

    const runId = crypto.randomUUID().slice(0, 8);
    console.log(chalk.bold(`\n[${siteSlug}] run ${runId}`));

    // Insert run row
    let run: GscRun | null = null;
    if (!opts.dryRun) {
      run = await registry.createGscRun({ run_id: runId, site_slug: siteSlug, status: 'running', ... });
    }

    try {
      // Download Coverage CSV
      console.log('  Downloading Coverage report...');
      const rows = await downloadCoverageReport(config);
      const unindexedRows = rows.filter(r => r.coverageState.toLowerCase().includes('not indexed'));
      console.log(`  Found ${unindexedRows.length} unindexed URLs`);

      if (!opts.quiet) {
        for (const row of unindexedRows) {
          console.log(chalk.yellow(`  → ${row.url}`));
        }
      }

      // Write to Supabase
      if (!opts.dryRun && run) {
        await registry.bulkLogGscUrls(unindexedRows.map(r => ({
          run_id: runId, site_slug: siteSlug, url: r.url,
          coverage_state: r.coverageState,
          last_detected_by_google: r.lastDetected ? new Date(r.lastDetected).toISOString() : null,
          inspected_at: new Date().toISOString(),
        })));
      }

      // Submit sitemap
      const auth = await createGscAuth();
      await submitSitemap(auth, config.gscProperty, config.sitemapIndexUrl);
      console.log(chalk.green(`  Sitemap submitted: ${config.sitemapIndexUrl}`));

      // Update run
      if (!opts.dryRun && run) {
        await registry.updateGscRun(runId, {
          status: 'completed',
          urls_discovered: rows.length,
          urls_unindexed: unindexedRows.length,
          sitemap_submitted: true,
          completed_at: new Date().toISOString(),
        });
      }

      console.log(chalk.green(`  ✓ ${unindexedRows.length}/${rows.length} URLs unindexed`));

    } catch (err) {
      if (err instanceof GscSessionExpiredError) {
        console.error(chalk.red('Session expired mid-run. Run: pnpm gsc:login'));
        if (!opts.dryRun && run) {
          await registry.updateGscRun(runId, { status: 'failed', error_message: 'Session expired' });
        }
        process.exit(1);
      }
      throw err;
    }
  }
}
```

### Step 3.4 — `report` command

```typescript
async function reportCommand(slug: string | undefined, opts: ReportOptions) {
  if (opts.monthly) {
    // Parse YYYY-MM from opts.monthly
    // Call registry.getGscMonthlyData()
    // Build markdown, write to output/reports/gsc-[slug]-[YYYY-MM].md
    // Print: "Report written to output/reports/..."
  } else {
    // Query getGscRuns + getGscUnindexedUrls for recent data
    // Print console table
  }
}
```

**Monthly markdown report structure:**

```markdown
# GSC Indexing Report: Colossus Scaffolding — April 2026

**Period:** 2026-04-01 to 2026-04-30
**Generated:** 2026-05-01

## Summary

| Metric                        | Value |
| ----------------------------- | ----- |
| Total URLs in sitemaps        | 73    |
| Unindexed at start of month   | 61    |
| Unindexed at end of month     | 47    |
| URLs newly indexed this month | 14    |
| Sitemaps submitted            | 30    |

## Week-by-Week Trend

| Week      | Unindexed Count |
| --------- | --------------- |
| Apr 1–7   | 61              |
| Apr 8–14  | 57              |
| Apr 15–21 | 52              |
| Apr 22–28 | 47              |

## Top Unresolved URLs (oldest first)

| URL                | First Detected |
| ------------------ | -------------- |
| /locations/ashford | 2026-04-01     |
| /locations/battle  | 2026-04-01     |

| ...

---

_Report generated by GSC Indexing Monitor. Raw data in Supabase: `gsc_url_inspections` table._
```

### Step 3.5 — `verify` command

Calls `listProperties()`, checks each `gscProperty` in `GSC_SITE_CONFIG` against the returned list. Prints green for accessible, red for missing.

**Verification gate:** `pnpm gsc:inspect colossus-scaffolding --dry-run` prints unindexed URL count and "dry run — no DB writes" without error.

---

## Phase 4: GitHub Actions Cron

### Step 4.1 — `.github/workflows/gsc-indexing.yml`

```yaml
name: GSC Indexing Monitor

on:
  schedule:
    - cron: "0 7 * * *"
  workflow_dispatch:
    inputs:
      site_slug:
        description: "Site slug (blank = all sites)"
        required: false
      dry_run:
        type: boolean
        default: false

jobs:
  gsc-inspect:
    runs-on: ubuntu-latest
    timeout-minutes: 30

    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v4
      - uses: actions/setup-node@v4
        with:
          node-version: "20"
          cache: "pnpm"
      - run: pnpm install --frozen-lockfile
      - run: npx playwright install chromium --with-deps

      - name: Run GSC inspect
        env:
          SUPABASE_URL: ${{ secrets.SUPABASE_URL }}
          SUPABASE_SERVICE_KEY: ${{ secrets.SUPABASE_SERVICE_KEY }}
          GSC_SERVICE_ACCOUNT_KEY_JSON: ${{ secrets.GSC_SERVICE_ACCOUNT_KEY_JSON }}
          GSC_SESSION_JSON: ${{ secrets.GSC_SESSION_JSON }}
        run: |
          SLUG="${{ inputs.site_slug }}"
          DRY="${{ inputs.dry_run }}"
          CMD="pnpm gsc:inspect"
          [ -n "$SLUG" ] && CMD="$CMD $SLUG"
          [ "$DRY" = "true" ] && CMD="$CMD --dry-run"
          eval $CMD
```

**Session expiry in CI:** When the workflow fails with "Session expired", the operator runs `pnpm gsc:login` locally, copies the content of `secrets/gsc-session.json`, and updates the `GSC_SESSION_JSON` GitHub Secret. No code change needed.

**Verification gate:** Manual `workflow_dispatch` with `dry_run: true` completes successfully in GitHub Actions.

---

## Phase 5: Documentation

### Step 5.1 — `docs/guides/gsc-setup.md`

**Part 1: Browser session (CSV download)**

1. `pnpm gsc:login` — headed browser opens to Google Sign-In
2. Complete login (including 2FA)
3. Session saved to `secrets/gsc-session.json`
4. For CI: copy file contents → add as `GSC_SESSION_JSON` GitHub Secret
5. Sessions last weeks to months; when expired, repeat from step 1

**Part 2: Service account (sitemap submission)**

1. Google Cloud Console → new service account → download JSON key
2. Enable "Google Search Console API" in GCP API Library
3. GSC → Settings → Users and permissions → Add user (service account email, "User" level) — repeat for each property
4. Check property type: GSC → Settings → confirm "Domain property" or "URL-prefix property"
5. `.env.local`: `GSC_SERVICE_ACCOUNT_KEY_JSON=<json>` or `GSC_SERVICE_ACCOUNT_KEY_PATH=./secrets/gsc-key.json`
6. GitHub Secrets: `GSC_SERVICE_ACCOUNT_KEY_JSON`

**Part 3: Adding a new site**

1. Add entry to `tools/gsc-config.ts`
2. Add service account as GSC User on the new property
3. Run `pnpm gsc:verify` to confirm access

**Verification gate:** `docs/guides/gsc-setup.md` exists and links correctly from `CLAUDE.md` docs table.

---

## Risks and Trade-offs

| Risk                                                                  | Likelihood | Mitigation                                                                                                                                                                                                     |
| --------------------------------------------------------------------- | ---------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Google changes GSC Coverage Report UI, breaking Playwright navigation | Medium     | The CSV export button and report structure have been stable for years. The filter URL approach (using `resource_id` query param) is more stable than navigating the UI. Monitor for failures in the daily run. |
| Session expiry causes silent CI failure                               | Low        | Session validity is checked before any site run begins. Failure is loud (non-zero exit, workflow fails, GitHub sends email).                                                                                   |
| `gscUiIdentifier` doesn't match what GSC shows                        | Low-Medium | The `verify` command cross-checks property access. Also: using the direct Coverage report URL with `resource_id` param avoids needing to find the property in the UI switcher.                                 |
| GSC Coverage CSV format changes                                       | Low        | CSV column names have been stable. Parser checks for expected header columns and throws if not found, rather than silently returning wrong data.                                                               |
| Playwright install bloat in CI                                        | Low        | `chromium` only (not full Playwright browser suite). `--with-deps` handles Linux system deps. Adds ~200ms to install step.                                                                                     |
| Monthly report queries get slow as data grows                         | Low        | The `gsc_url_inspections` indexes on `site_slug` and `inspected_at` are sufficient for the expected data volume (30 runs × 150 URLs × 12 months = ~54,000 rows/site/year).                                     |

---

## Scaling / Quota Pool

The Playwright CSV approach has **no API quota concern** for the URL list. The only API call is `sitemaps.submit` (one per site per run, no meaningful quota).

When platform grows to many sites, the relevant concern is **CI runtime** (not quota). At 1 site ≈ ~30 seconds for Playwright login + CSV download, 20 sites ≈ 10 minutes. Still within the 30-minute timeout.

If sites grow very large, add `active: boolean` to `GscSiteConfig` and a `--pool` CLI flag. No schema changes needed.

---

## File Checklist

| File                                 | Action                                      |
| ------------------------------------ | ------------------------------------------- |
| `tools/gsc-indexing.ts`              | CREATE                                      |
| `tools/gsc-config.ts`                | CREATE                                      |
| `tools/lib/gsc-browser.ts`           | CREATE                                      |
| `tools/lib/gsc-client.ts`            | CREATE                                      |
| `tools/supabase-schema-gsc.sql`      | CREATE                                      |
| `.github/workflows/gsc-indexing.yml` | CREATE                                      |
| `docs/guides/gsc-setup.md`           | CREATE                                      |
| `output/reports/`                    | CREATE dir                                  |
| `tools/lib/supabase-client.ts`       | MODIFY (add GSC methods)                    |
| `package.json`                       | MODIFY (add gsc:\* scripts, playwright dep) |
| `.env.example`                       | MODIFY (document new vars)                  |
