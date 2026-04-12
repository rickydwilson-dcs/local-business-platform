# YOLO Implementation Brief: GSC Indexing Monitor

**Branch:** feature/gsc-indexing-monitor (created from develop)
**Session spec:** output/sessions/2026-04-12_gsc-indexing-monitor/yolo-brief.md
**Mode:** Autonomous execution — implement all phases, verify after each, STOP on error
**Orchestrator model:** sonnet

---

## Context

Google Search Console shows ~60 pages across platform client sites as "Discovered - currently not indexed" with never-crawled dates. The manual "Request Indexing" button is limited to 10 URLs/day per site. This tool automates daily GSC monitoring: it uses Playwright to download the Coverage Report CSV (the only way to get the bulk unindexed list), re-submits the sitemap as a freshness signal via the GSC API, logs results to Supabase for trend tracking, and generates monthly markdown reports for client reporting.

The synthesis was reviewed and approved. Implement it exactly as specified below.

---

## Model Tiers

| Tier   | Alias    | Cost (in/out per MTok) | Use for                                                                                             |
| ------ | -------- | ---------------------- | --------------------------------------------------------------------------------------------------- |
| Opus   | `opus`   | $15 / $75              | Phases with >5 interdependent files, architectural rewrites, judgment calls not covered by the spec |
| Sonnet | `sonnet` | $3 / $15               | Standard implementation — file edits, feature wiring, most phases                                   |
| Haiku  | `haiku`  | $0.25 / $1.25          | Mechanical tasks: find-replace, import additions, grep checks, content validation                   |

Default orchestrator: **sonnet**. Default sub-agent: **sonnet** unless the task is clearly mechanical (→ haiku) or requires deep cross-file reasoning (→ opus).

---

## Pre-flight

```bash
git checkout develop && git pull
git checkout -b feature/gsc-indexing-monitor
pnpm type-check   # must be clean before starting
```

---

## Phase 1 — Infrastructure

**Goal:** Add playwright dependency, gsc:\* scripts, protect secrets/ from git, create Supabase schema file, create site config.
**Model:** haiku — mechanical additions to package.json, .gitignore, and new config files with no cross-file reasoning required.

### 1a — Install playwright and update package.json

Add `playwright` as a devDependency. Add the following scripts to the `scripts` block in root `package.json`:

```json
"gsc:login":          "tsx tools/gsc-indexing.ts login",
"gsc:inspect":        "tsx tools/gsc-indexing.ts inspect",
"gsc:inspect:dry":    "tsx tools/gsc-indexing.ts inspect --dry-run",
"gsc:report":         "tsx tools/gsc-indexing.ts report",
"gsc:report:monthly": "tsx tools/gsc-indexing.ts report --monthly",
"gsc:verify":         "tsx tools/gsc-indexing.ts verify"
```

Run:

```bash
pnpm add -D playwright
```

### 1b — Add secrets/ to .gitignore

Read the root `.gitignore` first. Add `secrets/` as a new entry (if not already present).

### 1c — Create `tools/supabase-schema-gsc.sql`

```sql
-- =========================================
-- GSC INDEXING MONITOR TABLES
-- Add to existing Supabase schema
-- Run in Supabase SQL Editor
-- =========================================

-- TABLE: gsc_runs
-- One row per tool invocation per site
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
ALTER TABLE gsc_runs FORCE ROW LEVEL SECURITY;
CREATE POLICY "Service role access" ON gsc_runs
  FOR ALL USING (auth.role() = 'service_role');

-- TABLE: gsc_url_inspections
-- One row per URL per run (immutable point-in-time snapshot)
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
CREATE INDEX IF NOT EXISTS idx_gsc_insp_site_slug ON gsc_url_inspections(site_slug);
CREATE INDEX IF NOT EXISTS idx_gsc_insp_run_id ON gsc_url_inspections(run_id);
CREATE INDEX IF NOT EXISTS idx_gsc_insp_url ON gsc_url_inspections(url, site_slug);
CREATE INDEX IF NOT EXISTS idx_gsc_insp_unindexed ON gsc_url_inspections(is_unindexed) WHERE is_unindexed = true;
CREATE INDEX IF NOT EXISTS idx_gsc_insp_site_date ON gsc_url_inspections(site_slug, inspected_at DESC);
ALTER TABLE gsc_url_inspections ENABLE ROW LEVEL SECURITY;
ALTER TABLE gsc_url_inspections FORCE ROW LEVEL SECURITY;
CREATE POLICY "Service role access" ON gsc_url_inspections
  FOR ALL USING (auth.role() = 'service_role');
```

### 1d — Create `tools/gsc-config.ts`

```typescript
/**
 * GSC Site Configuration
 *
 * Maps platform site slugs to their Google Search Console properties.
 * Add one entry per site. For new platform sites, use domain properties
 * ('sc-domain:'). For inherited client sites, check GSC > Settings >
 * Property type to determine whether to use 'sc-domain:' or 'https://'.
 *
 * coverageReportUrl: The exact GSC Coverage report URL filtered to
 * "Discovered - currently not indexed". Captured during the navigation
 * spike and stored here to avoid runtime URL construction issues with
 * property type encoding. Update after verifying manually in GSC.
 */

export interface GscSiteConfig {
  /**
   * GSC property identifier passed to the API.
   * Domain property (new platform sites):     'sc-domain:example.com'
   * URL-prefix property (inherited clients):  'https://www.example.com/'
   * Check: GSC > Settings > Property type.
   */
  gscProperty: string;
  propertyType: "domain" | "url-prefix";
  /** Submitted to GSC via sitemaps.submit each run. */
  sitemapIndexUrl: string;
  /**
   * The exact GSC Coverage report URL for this property, pre-filtered
   * to show only unindexed pages. Captured during the navigation spike.
   * Stored here to avoid runtime URL construction bugs with property
   * type encoding differences.
   * TODO: Verify this URL manually in GSC before first run.
   */
  coverageReportUrl: string;
}

export const GSC_SITE_CONFIG: Record<string, GscSiteConfig> = {
  "colossus-scaffolding": {
    gscProperty: "sc-domain:colossus-scaffolding.co.uk",
    propertyType: "domain",
    sitemapIndexUrl: "https://www.colossus-scaffolding.co.uk/sitemap-index.xml",
    // TODO: Verify this URL in GSC — navigate to Pages report filtered to
    // "Discovered - currently not indexed" and copy the URL from the address bar
    coverageReportUrl:
      "https://search.google.com/search-console/index?resource_id=sc-domain%3Acolossus-scaffolding.co.uk",
  },
  "dj-fox-electrical": {
    gscProperty: "sc-domain:djfoxelectrical.com",
    propertyType: "domain",
    sitemapIndexUrl: "https://www.djfoxelectrical.com/sitemap-index.xml",
    // TODO: Verify this URL in GSC
    coverageReportUrl:
      "https://search.google.com/search-console/index?resource_id=sc-domain%3Adjfoxelectrical.com",
  },
};
```

### 1e — Create `output/reports/` directory

Create `output/reports/.gitkeep` to ensure the directory is tracked.

```bash
# Verification gate — STOP if this fails
pnpm type-check
```

**Commit:**

```bash
git add -A
git commit -m "feat(gsc): infrastructure — dependencies, schema, site config

Add playwright devDependency, gsc:* npm scripts, secrets/ gitignore entry,
Supabase schema SQL for gsc_runs + gsc_url_inspections tables,
gsc-config.ts with site-to-property mapping, output/reports/ directory.

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>"
```

---

## Phase 2 — Library Modules

**Goal:** Create the three library modules: GSC API client, Playwright browser session manager, and Supabase client extensions.
**Model:** sonnet — three interconnected modules with non-trivial logic.

### 2a — Create `tools/lib/gsc-client.ts`

Service account auth and sitemap submission only. No Playwright.

```typescript
/**
 * GSC API Client
 *
 * Service account authentication and sitemap submission via the
 * Google Search Console API. Used by gsc-indexing.ts for:
 * - Submitting sitemaps as freshness signals
 * - Listing accessible properties (verify command)
 *
 * Does NOT handle URL inspection or CSV download (see gsc-browser.ts).
 *
 * Environment Variables:
 *   GSC_SERVICE_ACCOUNT_KEY_JSON  Full service account JSON as string (CI)
 *   GSC_SERVICE_ACCOUNT_KEY_PATH  Path to service account JSON file (local dev)
 */

import { google } from "googleapis";
import { readFileSync } from "fs";

type GoogleAuth = InstanceType<typeof google.auth.GoogleAuth>;

const GSC_SCOPES = ["https://www.googleapis.com/auth/webmasters"];

export async function createGscAuth(): Promise<GoogleAuth> {
  const keyJson = process.env.GSC_SERVICE_ACCOUNT_KEY_JSON;
  const keyPath = process.env.GSC_SERVICE_ACCOUNT_KEY_PATH;

  let credentials: object;

  if (keyJson) {
    try {
      credentials = JSON.parse(keyJson);
    } catch {
      throw new Error("GSC_SERVICE_ACCOUNT_KEY_JSON is not valid JSON");
    }
  } else if (keyPath) {
    try {
      credentials = JSON.parse(readFileSync(keyPath, "utf-8"));
    } catch {
      throw new Error(`Could not read GSC service account key from: ${keyPath}`);
    }
  } else {
    throw new Error(
      "GSC auth requires GSC_SERVICE_ACCOUNT_KEY_JSON (CI) or GSC_SERVICE_ACCOUNT_KEY_PATH (local)"
    );
  }

  return new google.auth.GoogleAuth({ credentials, scopes: GSC_SCOPES });
}

export async function submitSitemap(
  auth: GoogleAuth,
  siteUrl: string,
  feedpath: string
): Promise<void> {
  const client = await auth.getClient();
  const webmasters = google.webmasters({
    version: "v3",
    auth: client as Parameters<typeof google.webmasters>[0]["auth"],
  });
  await webmasters.sitemaps.submit({ siteUrl, feedpath });
}

export async function listProperties(auth: GoogleAuth): Promise<string[]> {
  const client = await auth.getClient();
  const webmasters = google.webmasters({
    version: "v3",
    auth: client as Parameters<typeof google.webmasters>[0]["auth"],
  });
  const response = await webmasters.sites.list();
  return (response.data.siteEntry ?? []).map((entry) => entry.siteUrl ?? "").filter(Boolean);
}
```

### 2b — Create `tools/lib/gsc-browser.ts`

Playwright session management and CSV download.

**Key design notes:**

- Selectors are defined as named constants at the top — easy to update after the navigation spike
- `coverageReportUrl` comes from `config` (not constructed at runtime) to avoid encoding bugs
- Zero-row CSV returns empty array (success, not error)
- `GscSessionExpiredError` is thrown on auth redirect at any point during navigation

```typescript
/**
 * GSC Browser Automation
 *
 * Manages Playwright browser sessions for Google Search Console access.
 * Used to download the Coverage Report CSV — the only way to get the
 * bulk "Discovered - currently not indexed" URL list from GSC.
 *
 * Session storage: GSC_SESSION_PATH env var (default: ./secrets/gsc-session.json)
 * In CI: GSC_SESSION_JSON env var is written to GSC_SESSION_PATH by the inspect command.
 *
 * IMPORTANT: The navigation selectors below are best-estimates based on the known
 * GSC URL structure. Verify against the live GSC UI before first production run.
 * Update GSC_SELECTORS if Google has changed their Coverage/Pages report UI.
 * See docs/guides/gsc-setup.md for the navigation spike procedure.
 */

import { chromium, type BrowserContext } from "playwright";
import { writeFileSync, readFileSync, existsSync } from "fs";
import { join } from "path";
import type { GscSiteConfig } from "../gsc-config.js";

// ============================================================================
// Constants — update these after the navigation spike if selectors differ
// ============================================================================

const GSC_SELECTORS = {
  /** Element that indicates the report has finished loading */
  reportLoaded: 'div[data-test-id="index-coverage-table"], table, .OOHai',
  /** Export button */
  exportButton: 'div[aria-label="Export"], button[aria-label="Export"], [data-id="export-button"]',
  /** "Download CSV" option in export dropdown */
  downloadCsv:
    'li:has-text("Download CSV"), [data-id="download-csv"], div:has-text("Download CSV")',
} as const;

const GSC_URL = "https://search.google.com/search-console";
const GOOGLE_LOGIN_URL_FRAGMENT = "accounts.google.com";

// ============================================================================
// Types
// ============================================================================

export class GscSessionExpiredError extends Error {
  constructor() {
    super("GSC session expired. Run: pnpm gsc:login");
    this.name = "GscSessionExpiredError";
  }
}

export interface CoverageRow {
  url: string;
  coverageState: string;
  lastDetected: string | null;
}

function getSessionPath(): string {
  return process.env.GSC_SESSION_PATH ?? join(process.cwd(), "secrets", "gsc-session.json");
}

// ============================================================================
// Public API
// ============================================================================

/**
 * One-time headed browser login. Opens GSC, waits for user to authenticate,
 * then saves the browser session (cookies + localStorage) to GSC_SESSION_PATH.
 */
export async function loginGsc(): Promise<void> {
  const sessionPath = getSessionPath();
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();

  console.log("Opening Google Search Console...");
  await page.goto(GSC_URL, { waitUntil: "networkidle" });

  console.log("\nComplete sign-in in the browser window.");
  console.log("Press Enter here once the GSC dashboard is visible.");

  await new Promise<void>((resolve) => {
    process.stdin.once("data", () => resolve());
  });

  const state = await context.storageState();
  const dir = join(sessionPath, "..");
  const { mkdirSync } = await import("fs");
  mkdirSync(dir, { recursive: true });
  writeFileSync(sessionPath, JSON.stringify(state, null, 2));

  await browser.close();
  console.log(`\nSession saved to: ${sessionPath}`);
}

/**
 * Sanity-checks the session file. Does NOT guarantee server-side validity —
 * Google can invalidate sessions before cookie expiry. The real check is
 * the navigation in downloadCoverageReport (GscSessionExpiredError on redirect).
 */
export async function isSessionValid(): Promise<boolean> {
  const sessionPath = getSessionPath();
  if (!existsSync(sessionPath)) return false;

  try {
    const state = JSON.parse(readFileSync(sessionPath, "utf-8"));
    if (!state.cookies || !Array.isArray(state.cookies)) return false;
    const now = Date.now() / 1000;
    return state.cookies.some((c: { expires?: number }) => !c.expires || c.expires > now);
  } catch {
    return false;
  }
}

/**
 * Downloads the Coverage Report CSV for the given GSC property.
 * Returns empty array if no unindexed URLs (success case).
 * Throws GscSessionExpiredError if redirected to Google login.
 */
export async function downloadCoverageReport(config: GscSiteConfig): Promise<CoverageRow[]> {
  const sessionPath = getSessionPath();
  const browser = await chromium.launch({ headless: true });
  let context: BrowserContext | null = null;

  try {
    context = await browser.newContext({ storageState: sessionPath });
    const page = await context.newPage();

    await page.goto(config.coverageReportUrl, { waitUntil: "networkidle", timeout: 30000 });

    if (page.url().includes(GOOGLE_LOGIN_URL_FRAGMENT)) {
      throw new GscSessionExpiredError();
    }

    try {
      await page.waitForSelector(GSC_SELECTORS.reportLoaded, { timeout: 30000 });
    } catch {
      if (page.url().includes(GOOGLE_LOGIN_URL_FRAGMENT)) throw new GscSessionExpiredError();
      throw new Error(
        `GSC Coverage report did not load. Current URL: ${page.url()}\n` +
          `The GSC UI may have changed. Update GSC_SELECTORS in tools/lib/gsc-browser.ts.\n` +
          `See docs/guides/gsc-setup.md for the navigation spike procedure.`
      );
    }

    const [download] = await Promise.all([
      page.waitForEvent("download", { timeout: 15000 }),
      (async () => {
        await page.click(GSC_SELECTORS.exportButton, { timeout: 10000 });
        try {
          await page.waitForSelector(GSC_SELECTORS.downloadCsv, { timeout: 3000 });
          await page.click(GSC_SELECTORS.downloadCsv);
        } catch {
          // Export may have triggered download directly without a dropdown
        }
      })(),
    ]);

    const buffer = await download.createReadStream().then(async (stream) => {
      const chunks: Buffer[] = [];
      for await (const chunk of stream) chunks.push(Buffer.from(chunk));
      return Buffer.concat(chunks);
    });

    return parseCoverageCsv(buffer.toString("utf-8"));
  } finally {
    await context?.close();
    await browser.close();
  }
}

// ============================================================================
// CSV Parser — defensive, partial-match column detection
// ============================================================================

function parseCoverageCsv(content: string): CoverageRow[] {
  const lines = content.trim().split("\n");
  if (lines.length < 2) return [];

  const headers = lines[0].split(",").map((h) => h.replace(/"/g, "").trim().toLowerCase());

  const urlIdx = headers.findIndex((h) => h === "url" || h.includes("url"));
  const stateIdx = headers.findIndex(
    (h) => h.includes("index") || h.includes("coverage") || h.includes("status")
  );
  const crawlIdx = headers.findIndex(
    (h) => h.includes("crawl") || h.includes("detected") || h.includes("last")
  );

  if (urlIdx === -1 || stateIdx === -1) {
    throw new Error(
      `GSC CSV: Could not find expected columns.\n` +
        `Expected: URL column + indexing/coverage state column.\n` +
        `Actual headers: ${headers.join(", ")}\n` +
        `Update parseCoverageCsv() in tools/lib/gsc-browser.ts if GSC export format changed.`
    );
  }

  return lines
    .slice(1)
    .map((line) => {
      const cols = line.match(/(".*?"|[^,]+)(?=,|$)/g) ?? line.split(",");
      const clean = cols.map((c) => c.replace(/^"|"$/g, "").trim());
      return {
        url: clean[urlIdx] ?? "",
        coverageState: clean[stateIdx] ?? "",
        lastDetected: crawlIdx !== -1 ? clean[crawlIdx] || null : null,
      };
    })
    .filter((r) => r.url.startsWith("http"));
}
```

### 2c — Extend `tools/lib/supabase-client.ts`

Read the full file first to understand the `RegistryClient` class structure. Then add the following at the end of the file (before any closing exports).

**New types** (add after existing type definitions):

```typescript
// ============================================================================
// GSC Indexing Monitor Types
// ============================================================================

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

**New methods** (add to `RegistryClient` class, following existing method patterns):

```typescript
// ============================================================================
// GSC Indexing Monitor Methods
// ============================================================================

async createGscRun(data: {
  run_id: string;
  site_slug: string;
  urls_discovered?: number;
}): Promise<GscRun> {
  const sites = await this.listSites();
  const site = sites.find((s) => s.slug === data.site_slug);

  const { data: run, error } = await this.client
    .from('gsc_runs')
    .insert({
      run_id: data.run_id,
      site_id: site?.id ?? null,
      site_slug: data.site_slug,
      status: 'running',
      urls_discovered: data.urls_discovered ?? 0,
    })
    .select()
    .single();

  if (error) throw new Error(`Failed to create GSC run: ${error.message}`);
  return run as GscRun;
}

async updateGscRun(
  runId: string,
  data: Partial<Pick<GscRun, 'status' | 'urls_discovered' | 'urls_unindexed' | 'sitemap_submitted' | 'completed_at' | 'error_message'>>
): Promise<void> {
  const { error } = await this.client
    .from('gsc_runs')
    .update(data)
    .eq('run_id', runId);
  if (error) throw new Error(`Failed to update GSC run: ${error.message}`);
}

async bulkLogGscUrls(
  rows: Array<{
    run_id: string;
    site_slug: string;
    url: string;
    coverage_state: string;
    last_detected_by_google: string | null;
    inspected_at: string;
  }>
): Promise<void> {
  if (rows.length === 0) return;
  const sites = await this.listSites();
  const site = sites.find((s) => s.slug === rows[0].site_slug);
  const { error } = await this.client
    .from('gsc_url_inspections')
    .insert(rows.map((r) => ({ ...r, site_id: site?.id ?? null })));
  if (error) throw new Error(`Failed to log GSC URL inspections: ${error.message}`);
}

async getGscRuns(siteSlug?: string, limit = 10): Promise<GscRun[]> {
  let query = this.client
    .from('gsc_runs')
    .select('*')
    .order('started_at', { ascending: false })
    .limit(limit);
  if (siteSlug) query = query.eq('site_slug', siteSlug);
  const { data, error } = await query;
  if (error) throw new Error(`Failed to fetch GSC runs: ${error.message}`);
  return (data ?? []) as GscRun[];
}

async getGscUnindexedUrls(siteSlug: string, runId?: string): Promise<GscUrlInspection[]> {
  let query = this.client
    .from('gsc_url_inspections')
    .select('*')
    .eq('site_slug', siteSlug)
    .eq('is_unindexed', true)
    .order('inspected_at', { ascending: false });
  if (runId) query = query.eq('run_id', runId);
  const { data, error } = await query;
  if (error) throw new Error(`Failed to fetch unindexed URLs: ${error.message}`);
  return (data ?? []) as GscUrlInspection[];
}

async getGscMonthlyData(
  siteSlug: string,
  year: number,
  month: number
): Promise<{ runs: GscRun[]; urlsByRun: Record<string, GscUrlInspection[]> }> {
  const startDate = new Date(year, month - 1, 1).toISOString();
  const endDate = new Date(year, month, 1).toISOString();

  const { data: runs, error: runsError } = await this.client
    .from('gsc_runs')
    .select('*')
    .eq('site_slug', siteSlug)
    .gte('started_at', startDate)
    .lt('started_at', endDate)
    .order('started_at', { ascending: true });

  if (runsError) throw new Error(`Failed to fetch GSC runs: ${runsError.message}`);

  const runList = (runs ?? []) as GscRun[];
  const runIds = runList.map((r) => r.run_id);
  const urlsByRun: Record<string, GscUrlInspection[]> = {};

  if (runIds.length > 0) {
    const { data: urls, error: urlsError } = await this.client
      .from('gsc_url_inspections')
      .select('*')
      .eq('site_slug', siteSlug)
      .in('run_id', runIds);
    if (urlsError) throw new Error(`Failed to fetch GSC inspections: ${urlsError.message}`);
    for (const url of (urls ?? []) as GscUrlInspection[]) {
      if (!urlsByRun[url.run_id]) urlsByRun[url.run_id] = [];
      urlsByRun[url.run_id].push(url);
    }
  }

  return { runs: runList, urlsByRun };
}
```

```bash
# Verification gate — STOP if this fails
pnpm type-check
```

**Commit:**

```bash
git add -A
git commit -m "feat(gsc): library modules — gsc-client, gsc-browser, supabase extensions

Add tools/lib/gsc-client.ts (service account auth + sitemap submit),
tools/lib/gsc-browser.ts (Playwright session management + CSV download),
extend RegistryClient in supabase-client.ts with GSC run and URL
inspection methods.

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>"
```

---

## Phase 3 — Main CLI

**Goal:** Create `tools/gsc-indexing.ts` — the main CLI with login, inspect, report, and verify commands.
**Model:** sonnet — complex multi-command CLI with error handling, business logic, and report generation.

Create `tools/gsc-indexing.ts`:

```typescript
#!/usr/bin/env node
/**
 * GSC Indexing Monitor
 *
 * Tracks Google Search Console indexing status across all platform sites.
 * Downloads the Coverage Report CSV via Playwright, logs results to Supabase,
 * re-submits sitemaps as freshness signals each run.
 *
 * IMPORTANT CONSTRAINTS:
 * - Google does NOT expose a "Request Indexing" API. This tool monitors only.
 * - The 10/day "Request Indexing" UI limit is separate and irrelevant here.
 * - Sitemap submission is a freshness HINT, not a crawl guarantee.
 * - Playwright selectors in gsc-browser.ts require verification against the
 *   live GSC UI before first production use. See docs/guides/gsc-setup.md.
 *
 * Commands:
 *   login              One-time browser login. Saves session to GSC_SESSION_PATH.
 *   inspect [slug]     Download Coverage CSV, log to Supabase, submit sitemap.
 *   report [slug]      Show recent results or generate monthly markdown report.
 *   verify             Confirm service account can access configured GSC properties.
 *
 * Environment Variables:
 *   GSC_SESSION_PATH              Path to browser session (default: ./secrets/gsc-session.json)
 *   GSC_SESSION_JSON              Session JSON string (CI — written to GSC_SESSION_PATH at start)
 *   GSC_SERVICE_ACCOUNT_KEY_JSON  Service account JSON string (CI)
 *   GSC_SERVICE_ACCOUNT_KEY_PATH  Service account JSON file path (local dev)
 *   SUPABASE_URL                  Supabase project URL
 *   SUPABASE_SERVICE_KEY          Supabase service role key
 */

import { Command } from "commander";
import chalk from "chalk";
import * as dotenv from "dotenv";
import { writeFileSync, mkdirSync } from "fs";
import { join, dirname } from "path";

dotenv.config({ path: ".env.local" });

import {
  loginGsc,
  isSessionValid,
  downloadCoverageReport,
  GscSessionExpiredError,
} from "./lib/gsc-browser.js";
import { createGscAuth, submitSitemap, listProperties } from "./lib/gsc-client.js";
import { GSC_SITE_CONFIG } from "./gsc-config.js";
import type { GscRun, GscUrlInspection } from "./lib/supabase-client.js";

// ============================================================================
// Registry client (lazy init, graceful degradation if Supabase unavailable)
// ============================================================================

let _registry: import("./lib/supabase-client.js").RegistryClient | null = null;

async function getRegistry() {
  if (_registry) return _registry;
  const { RegistryClient } = await import("./lib/supabase-client.js");
  const { createClient } = await import("@supabase/supabase-js");
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_KEY;
  if (!url || !key) throw new Error("SUPABASE_URL and SUPABASE_SERVICE_KEY are required");
  _registry = new RegistryClient(createClient(url, key));
  return _registry;
}

function getSessionPath(): string {
  return process.env.GSC_SESSION_PATH ?? join(process.cwd(), "secrets", "gsc-session.json");
}

function ensureDir(filePath: string) {
  mkdirSync(dirname(filePath), { recursive: true });
}

// ============================================================================
// Commands
// ============================================================================

async function loginCommand() {
  console.log(chalk.blue("\n[GSC] Opening browser for Google Sign-In..."));
  console.log(chalk.yellow("Complete login in the browser window, then press Enter here."));
  await loginGsc();
  console.log(chalk.green("\n✓ Session saved. Run `pnpm gsc:verify` to confirm API access."));
  console.log(
    chalk.dim("For CI: copy contents of secrets/gsc-session.json → GSC_SESSION_JSON GitHub Secret")
  );
}

interface InspectOptions {
  dryRun: boolean;
  quiet: boolean;
}

async function inspectCommand(slug: string | undefined, opts: InspectOptions) {
  // Restore CI session from env var
  const sessionPath = getSessionPath();
  if (process.env.GSC_SESSION_JSON) {
    ensureDir(sessionPath);
    writeFileSync(sessionPath, process.env.GSC_SESSION_JSON);
    console.log(chalk.dim("[GSC] Session restored from GSC_SESSION_JSON"));
  }

  // Pre-flight session sanity check
  if (!(await isSessionValid())) {
    console.error(chalk.red("\n✗ GSC session missing, invalid, or expired."));
    console.error(chalk.yellow("Run: pnpm gsc:login"));
    process.exit(1);
  }

  const sites = slug ? [slug] : Object.keys(GSC_SITE_CONFIG);
  const summary: Array<{ slug: string; discovered: number; unindexed: number }> = [];

  for (const siteSlug of sites) {
    const config = GSC_SITE_CONFIG[siteSlug];
    if (!config) {
      console.warn(chalk.yellow(`\n[GSC] No config for site: ${siteSlug} — skipping`));
      console.warn(chalk.dim("  Add an entry to tools/gsc-config.ts to include this site."));
      continue;
    }

    const runId = crypto.randomUUID().slice(0, 8);
    console.log(chalk.bold(`\n[GSC] ${siteSlug} — run ${runId}`));
    if (opts.dryRun) console.log(chalk.dim("  (dry run — no DB writes, no sitemap submission)"));

    // Init registry — graceful degradation if Supabase unavailable
    let dbAvailable = !opts.dryRun;
    let registry = null;
    if (!opts.dryRun) {
      try {
        registry = await getRegistry();
        await registry.createGscRun({ run_id: runId, site_slug: siteSlug });
      } catch (err) {
        console.warn(chalk.yellow("  ⚠ Supabase unavailable — continuing without DB logging"));
        console.warn(chalk.dim(`  ${err instanceof Error ? err.message : String(err)}`));
        dbAvailable = false;
      }
    }

    // Download Coverage CSV
    let rows;
    try {
      console.log(chalk.dim("  Downloading Coverage report..."));
      rows = await downloadCoverageReport(config);
    } catch (err) {
      if (err instanceof GscSessionExpiredError) {
        console.error(chalk.red(`\n✗ ${err.message}`));
        if (dbAvailable && registry) {
          await registry
            .updateGscRun(runId, { status: "failed", error_message: "Session expired" })
            .catch(() => {});
        }
        process.exit(1);
      }
      const msg = err instanceof Error ? err.message : String(err);
      console.error(chalk.red(`  ✗ CSV download failed: ${msg}`));
      if (dbAvailable && registry) {
        await registry
          .updateGscRun(runId, { status: "failed", error_message: msg })
          .catch(() => {});
      }
      continue;
    }

    const unindexedRows = rows.filter((r) => r.coverageState.toLowerCase().includes("not indexed"));

    if (rows.length === 0) {
      console.log(chalk.green("  ✓ No unindexed URLs — all pages indexed (or no data yet)"));
    } else {
      console.log(
        `  Found ${chalk.yellow(String(unindexedRows.length))} unindexed / ${rows.length} total`
      );
      if (!opts.quiet) {
        for (const row of unindexedRows) {
          console.log(chalk.dim(`    → ${row.url}`));
        }
      }
    }

    // Log to Supabase
    if (dbAvailable && registry && unindexedRows.length > 0) {
      try {
        await registry.bulkLogGscUrls(
          unindexedRows.map((r) => ({
            run_id: runId,
            site_slug: siteSlug,
            url: r.url,
            coverage_state: r.coverageState,
            last_detected_by_google: r.lastDetected ? new Date(r.lastDetected).toISOString() : null,
            inspected_at: new Date().toISOString(),
          }))
        );
      } catch (err) {
        console.warn(
          chalk.yellow(
            `  ⚠ Failed to log to Supabase: ${err instanceof Error ? err.message : String(err)}`
          )
        );
        dbAvailable = false;
      }
    }

    // Submit sitemap
    if (!opts.dryRun) {
      try {
        const auth = await createGscAuth();
        await submitSitemap(auth, config.gscProperty, config.sitemapIndexUrl);
        console.log(chalk.green(`  ✓ Sitemap submitted: ${config.sitemapIndexUrl}`));
      } catch (err) {
        console.warn(
          chalk.yellow(
            `  ⚠ Sitemap submission failed: ${err instanceof Error ? err.message : String(err)}`
          )
        );
      }
    }

    // Update run record
    if (dbAvailable && registry) {
      await registry
        .updateGscRun(runId, {
          status: "completed",
          urls_discovered: rows.length,
          urls_unindexed: unindexedRows.length,
          sitemap_submitted: !opts.dryRun,
          completed_at: new Date().toISOString(),
        })
        .catch(() => {});
    }

    summary.push({ slug: siteSlug, discovered: rows.length, unindexed: unindexedRows.length });
  }

  if (summary.length > 1) {
    console.log(chalk.bold("\n[GSC] Summary"));
    for (const s of summary) {
      const icon = s.unindexed === 0 ? chalk.green("✓") : chalk.yellow("!");
      console.log(`  ${icon} ${s.slug}: ${s.unindexed}/${s.discovered} unindexed`);
    }
  }
}

interface ReportOptions {
  days: string;
  unindexedOnly: boolean;
  monthly?: string;
  output?: string;
}

async function reportCommand(slug: string | undefined, opts: ReportOptions) {
  const registry = await getRegistry();

  if (opts.monthly) {
    const [year, month] = opts.monthly.split("-").map(Number);
    if (!year || !month) {
      console.error(chalk.red("Invalid --monthly format. Use YYYY-MM (e.g. 2026-04)"));
      process.exit(1);
    }

    const targetSites = slug ? [slug] : Object.keys(GSC_SITE_CONFIG);

    for (const siteSlug of targetSites) {
      const { runs, urlsByRun } = await registry.getGscMonthlyData(siteSlug, year, month);

      if (runs.length === 0) {
        console.log(chalk.yellow(`No data for ${siteSlug} in ${opts.monthly}`));
        continue;
      }

      const report = buildMonthlyReport(siteSlug, year, month, runs, urlsByRun);
      const outputPath =
        opts.output ?? join("output", "reports", `gsc-${siteSlug}-${opts.monthly}.md`);
      ensureDir(outputPath);
      writeFileSync(outputPath, report);
      console.log(chalk.green(`✓ Report written to: ${outputPath}`));
    }
  } else {
    const days = parseInt(opts.days, 10) || 7;
    const targetSites = slug ? [slug] : Object.keys(GSC_SITE_CONFIG);

    for (const siteSlug of targetSites) {
      const runs = await registry.getGscRuns(siteSlug, days);
      if (runs.length === 0) {
        console.log(chalk.dim(`\n[${siteSlug}] No runs in the last ${days} days`));
        continue;
      }

      console.log(chalk.bold(`\n[${siteSlug}] Last ${runs.length} run(s):`));
      for (const run of runs) {
        const statusColour = run.status === "completed" ? chalk.green : chalk.red;
        console.log(
          `  ${statusColour(run.status.padEnd(10))} ` +
            `${new Date(run.started_at).toLocaleDateString("en-GB")} — ` +
            `${run.urls_unindexed}/${run.urls_discovered} unindexed ` +
            `${run.sitemap_submitted ? chalk.dim("(sitemap ✓)") : ""}`
        );

        if (opts.unindexedOnly) {
          const urls = await registry.getGscUnindexedUrls(siteSlug, run.run_id);
          for (const u of urls) console.log(chalk.dim(`    → ${u.url}`));
        }
      }
    }
  }
}

function buildMonthlyReport(
  siteSlug: string,
  year: number,
  month: number,
  runs: GscRun[],
  urlsByRun: Record<string, GscUrlInspection[]>
): string {
  const monthName = new Date(year, month - 1, 1).toLocaleString("en-GB", {
    month: "long",
    year: "numeric",
  });
  const siteName = siteSlug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

  const startDate = runs[0].started_at.split("T")[0];
  const endDate = runs[runs.length - 1].started_at.split("T")[0];

  const unindexedByRun = runs.map((r) => {
    const urls = urlsByRun[r.run_id] ?? [];
    return new Set(urls.filter((u) => u.is_unindexed).map((u) => u.url));
  });

  const startUnindexed = unindexedByRun[0]?.size ?? 0;
  const endUnindexed = unindexedByRun[unindexedByRun.length - 1]?.size ?? 0;
  const firstSet = unindexedByRun[0] ?? new Set<string>();
  const lastSet = unindexedByRun[unindexedByRun.length - 1] ?? new Set<string>();
  const newlyIndexed = [...firstSet].filter((url) => !lastSet.has(url));
  const deIndexed = [...lastSet].filter((url) => !firstSet.has(url));

  // Week-by-week trend
  const weekBuckets: Array<{ label: string; unindexed: number }> = [];
  let currentWeek = "";
  for (let i = 0; i < runs.length; i++) {
    const d = new Date(runs[i].started_at);
    const ws = new Date(d);
    ws.setDate(d.getDate() - d.getDay());
    const label = ws.toLocaleDateString("en-GB", { day: "numeric", month: "short" });
    if (label !== currentWeek) {
      currentWeek = label;
      weekBuckets.push({ label, unindexed: unindexedByRun[i]?.size ?? 0 });
    }
  }

  const finalUrls = [...lastSet];
  const lines: string[] = [
    `# GSC Indexing Report: ${siteName} — ${monthName}`,
    "",
    `**Period:** ${startDate} to ${endDate}`,
    `**Generated:** ${new Date().toISOString().split("T")[0]}`,
    "",
    "## Summary",
    "",
    "| Metric | Value |",
    "|--------|-------|",
    `| Total URLs tracked | ${runs[0]?.urls_discovered ?? 0} |`,
    `| Unindexed at start of month | ${startUnindexed} |`,
    `| Unindexed at end of month | ${endUnindexed} |`,
    `| Newly indexed this month | ${newlyIndexed.length} |`,
    `| De-indexed this month (regressions) | ${deIndexed.length} |`,
    `| Sitemaps submitted | ${runs.filter((r) => r.sitemap_submitted).length} |`,
    "",
    "## Week-by-Week Trend",
    "",
    "| Week | Unindexed | Change |",
    "|------|-----------|--------|",
  ];

  for (let i = 0; i < weekBuckets.length; i++) {
    const prev = i === 0 ? weekBuckets[0].unindexed : weekBuckets[i - 1].unindexed;
    const diff = weekBuckets[i].unindexed - prev;
    const change = i === 0 ? "—" : diff === 0 ? "0" : diff > 0 ? `+${diff}` : String(diff);
    lines.push(`| ${weekBuckets[i].label} | ${weekBuckets[i].unindexed} | ${change} |`);
  }
  lines.push("");

  if (newlyIndexed.length > 0) {
    lines.push("## Newly Indexed This Month", "", "| URL |", "|-----|");
    for (const url of newlyIndexed) lines.push(`| ${url} |`);
    lines.push("");
  }

  if (finalUrls.length > 0) {
    lines.push("## Top Unresolved URLs (end of month)", "", "| URL |", "|-----|");
    for (const url of finalUrls.slice(0, 20)) lines.push(`| ${url} |`);
    if (finalUrls.length > 20) lines.push(`| *(${finalUrls.length - 20} more...)* |`);
    lines.push("");
  }

  if (deIndexed.length > 0) {
    lines.push("## De-indexed URLs (Regressions)", "", "| URL |", "|-----|");
    for (const url of deIndexed) lines.push(`| ${url} |`);
    lines.push("");
  }

  lines.push(
    "---",
    "*Generated by GSC Indexing Monitor. Raw data: `gsc_url_inspections` table in Supabase.*",
    "*A polished client version will be generated separately.*"
  );

  return lines.join("\n");
}

async function verifyCommand() {
  console.log(chalk.bold("\n[GSC] Verifying service account access...\n"));

  let properties: string[];
  try {
    const auth = await createGscAuth();
    properties = await listProperties(auth);
  } catch (err) {
    console.error(chalk.red(`✗ Auth failed: ${err instanceof Error ? err.message : String(err)}`));
    process.exit(1);
  }

  console.log(
    `Service account has access to ${properties.length} propert${properties.length === 1 ? "y" : "ies"}:`
  );
  for (const p of properties) console.log(chalk.dim(`  ${p}`));

  console.log(chalk.bold("\nChecking configured sites:"));
  let allOk = true;
  for (const [slug, config] of Object.entries(GSC_SITE_CONFIG)) {
    const found = properties.some(
      (p) => p.includes(config.gscProperty) || config.gscProperty.includes(p.replace(/\/$/, ""))
    );
    if (found) {
      console.log(chalk.green(`  ✓ ${slug} → ${config.gscProperty}`));
    } else {
      console.log(chalk.red(`  ✗ ${slug} → ${config.gscProperty} (not found)`));
      allOk = false;
    }
  }

  if (!allOk) {
    console.log(chalk.yellow("\nFor missing properties: add the service account as a GSC User."));
    console.log(chalk.dim("See docs/guides/gsc-setup.md"));
    process.exit(1);
  }
  console.log(chalk.green("\n✓ All configured sites accessible."));
}

// ============================================================================
// CLI
// ============================================================================

const program = new Command();

program
  .name("gsc-indexing")
  .description("GSC Indexing Monitor — tracks indexing status across platform sites")
  .version("1.0.0");

program
  .command("login")
  .description("One-time browser login. Saves session for automated use.")
  .action(loginCommand);

program
  .command("inspect [slug]")
  .description("Download Coverage CSV, log to Supabase, submit sitemap")
  .option("--dry-run", "Skip DB writes and sitemap submission", false)
  .option("--quiet", "Suppress per-URL output", false)
  .action(inspectCommand);

program
  .command("report [slug]")
  .description("Show recent results or generate monthly markdown report")
  .option("--days <n>", "Look back N days", "7")
  .option("--unindexed-only", "Show only unindexed URLs", false)
  .option("--monthly <YYYY-MM>", "Generate monthly markdown report")
  .option("--output <path>", "Output file path for monthly report")
  .action(reportCommand);

program
  .command("verify")
  .description("Confirm service account can access configured GSC properties")
  .action(verifyCommand);

program.parse();
```

```bash
# Verification gate — STOP if this fails
pnpm type-check
```

**Commit:**

```bash
git add -A
git commit -m "feat(gsc): main CLI — login, inspect, report, verify commands

Add tools/gsc-indexing.ts with four commands:
- login: headed Playwright browser login, saves session
- inspect [slug]: downloads Coverage CSV, logs to Supabase, submits sitemap
- report [slug]: recent runs + monthly markdown report generation
- verify: confirms service account has access to configured GSC properties

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>"
```

---

## Phase 4 — GitHub Actions Workflow

**Goal:** Create the daily cron workflow.
**Model:** haiku — mechanical YAML file creation.

Create `.github/workflows/gsc-indexing.yml`:

```yaml
name: GSC Indexing Monitor

on:
  schedule:
    - cron: "0 7 * * *" # 07:00 UTC daily
  workflow_dispatch:
    inputs:
      site_slug:
        description: "Site slug (leave blank for all sites)"
        required: false
        type: string
      dry_run:
        description: "Dry run (no DB writes, no sitemap submission)"
        required: false
        type: boolean
        default: false

jobs:
  gsc-inspect:
    name: Inspect GSC Indexing Status
    runs-on: ubuntu-latest
    timeout-minutes: 30

    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Setup pnpm
        uses: pnpm/action-setup@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: "20"
          cache: "pnpm"

      - name: Install dependencies
        run: pnpm install --frozen-lockfile

      - name: Cache Playwright browsers
        uses: actions/cache@v4
        id: playwright-cache
        with:
          path: ~/.cache/ms-playwright
          key: playwright-chromium-${{ hashFiles('**/pnpm-lock.yaml') }}

      - name: Install Playwright Chromium
        if: steps.playwright-cache.outputs.cache-hit != 'true'
        run: npx playwright install chromium --with-deps

      - name: Run GSC inspect
        env:
          SUPABASE_URL: ${{ secrets.SUPABASE_URL }}
          SUPABASE_SERVICE_KEY: ${{ secrets.SUPABASE_SERVICE_KEY }}
          GSC_SERVICE_ACCOUNT_KEY_JSON: ${{ secrets.GSC_SERVICE_ACCOUNT_KEY_JSON }}
          GSC_SESSION_JSON: ${{ secrets.GSC_SESSION_JSON }}
        run: |
          CMD="pnpm gsc:inspect"
          [ -n "${{ inputs.site_slug }}" ] && CMD="$CMD ${{ inputs.site_slug }}"
          [ "${{ inputs.dry_run }}" = "true" ] && CMD="$CMD --dry-run"
          eval $CMD
```

```bash
# Verification gate — STOP if this fails
pnpm type-check
```

**Commit:**

```bash
git add -A
git commit -m "feat(gsc): GitHub Actions daily cron workflow

Add .github/workflows/gsc-indexing.yml — runs at 07:00 UTC daily,
workflow_dispatch for manual runs, Playwright Chromium cache by
pnpm lockfile hash.

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>"
```

---

## Phase 5 — Documentation and env

**Goal:** Create setup guide, update .env.example, update CLAUDE.md docs table.
**Model:** haiku — documentation writing.

### 5a — Create `docs/guides/gsc-setup.md`

```markdown
# GSC Indexing Monitor: Setup Guide

The GSC Indexing Monitor uses two separate authentication mechanisms:

1. **Browser session** (Playwright) — for downloading the Coverage Report CSV
2. **Service account** (Google API) — for sitemap submission

Both are required for a full run.

---

## Part 1: Browser Session Setup (CSV Download)

### Initial setup

1. Run: `pnpm gsc:login`
2. A Chrome browser window opens to Google Search Console
3. Sign in and complete any 2FA
4. Once the GSC dashboard is visible, press **Enter** in the terminal
5. Session saved to `secrets/gsc-session.json`

> ⚠️ This file contains auth cookies. It is gitignored. Never commit it.

### For CI (GitHub Actions)

1. Copy contents of `secrets/gsc-session.json`
2. GitHub → Settings → Secrets → Actions → New secret
3. Name: `GSC_SESSION_JSON`, Value: the full JSON content

### Session expiry

Sessions last weeks to months. When the daily workflow fails with
`GSC session expired`, run `pnpm gsc:login` locally and update the
`GSC_SESSION_JSON` secret.

---

## Part 2: Service Account Setup (Sitemap Submission)

### Create a service account

1. [Google Cloud Console](https://console.cloud.google.com) → IAM & Admin → Service Accounts
2. Create service account (e.g. `gsc-indexing-monitor`)
3. Click the account → Keys → Add Key → JSON → Download

### Enable the Search Console API

GCP → APIs & Services → Library → "Google Search Console API" → Enable

### Add service account to each GSC property

For each site in `tools/gsc-config.ts`:

1. GSC → select property → Settings → Users and permissions → Add user
2. Enter the service account email (`name@project-id.iam.gserviceaccount.com`)
3. Permission: **User**

### Check property type

- **Domain property** → use `sc-domain:example.com` in gsc-config.ts
- **URL-prefix property** → use `https://www.example.com/`

Check: GSC → Settings → note property type label.

### Configure credentials

Local (`.env.local`):
```

GSC_SERVICE_ACCOUNT_KEY_PATH=./secrets/gsc-key.json

````

CI (GitHub Secret): `GSC_SERVICE_ACCOUNT_KEY_JSON` = full JSON content

---

## Part 3: Adding a New Site

1. Add entry to `tools/gsc-config.ts`
2. Add service account as GSC User on the new property
3. Run `pnpm gsc:verify`

---

## Part 4: Navigation Spike (Before First Production Run)

The `coverageReportUrl` values in `gsc-config.ts` are best-estimates.
Verify before first use:

1. Open GSC for the property manually
2. Navigate to **Pages** report, filter to "Discovered - currently not indexed"
3. Copy the URL from the address bar → update `coverageReportUrl` in `gsc-config.ts`
4. If export selectors fail, update `GSC_SELECTORS` in `tools/lib/gsc-browser.ts`

---

## Verification

```bash
pnpm gsc:verify                                    # confirm service account access
pnpm gsc:inspect colossus-scaffolding --dry-run    # test without DB writes
pnpm gsc:inspect colossus-scaffolding              # full run
pnpm gsc:report colossus-scaffolding               # view recent results
pnpm gsc:report colossus-scaffolding --monthly 2026-04  # monthly report
````

```

### 5b — Update root `.env.example`

Read the root `.env.example` first. Append this section:

```

# ===== GOOGLE SEARCH CONSOLE =====

# Browser session for Coverage Report CSV download (Playwright)

GSC_SESSION_PATH=./secrets/gsc-session.json # local dev

# GSC_SESSION_JSON= # CI — full session JSON (GitHub Secret)

# Service account for sitemap submission (Google API)

GSC_SERVICE_ACCOUNT_KEY_PATH=./secrets/gsc-key.json # local dev

# GSC_SERVICE_ACCOUNT_KEY_JSON= # CI — full key JSON (GitHub Secret)

```

### 5c — Update `CLAUDE.md`

Read `CLAUDE.md`. Add to the Guides table in the Documentation section:

```

| [GSC Setup](docs/guides/gsc-setup.md) | Google Search Console indexing monitor setup |

````

```bash
# Verification gate — STOP if this fails
pnpm type-check
````

**Commit:**

```bash
git add -A
git commit -m "feat(gsc): documentation — setup guide, env vars, CLAUDE.md

Add docs/guides/gsc-setup.md with browser session and service account
setup instructions, navigation spike procedure, and adding new sites.
Update .env.example with GSC vars. Add to CLAUDE.md guides table.

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>"
```

---

## Parallel execution groups

### Intra-phase groups

| Group | Phase   | Items                                                                                                  | File overlap | Model  | Rationale                      |
| ----- | ------- | ------------------------------------------------------------------------------------------------------ | ------------ | ------ | ------------------------------ |
| G1    | Phase 1 | Read `package.json`, read `.gitignore`                                                                 | none (reads) | n/a    | Independent reads before edits |
| G2    | Phase 1 | Create `tools/supabase-schema-gsc.sql`, create `tools/gsc-config.ts`, create `output/reports/.gitkeep` | none         | haiku  | Independent new files          |
| G3    | Phase 2 | Create `tools/lib/gsc-client.ts`, create `tools/lib/gsc-browser.ts`                                    | none         | sonnet | Independent new files          |
| G4    | Phase 5 | Read `.env.example`, read `CLAUDE.md`                                                                  | none (reads) | n/a    | Independent reads before edits |

### Cross-phase groups

| Group  | Phases | Items | Rationale                                |
| ------ | ------ | ----- | ---------------------------------------- |
| (none) |        |       | Each phase gates the next via type-check |

### Sequential points — MUST NOT parallelise

| Item                                   | Reason                                                     |
| -------------------------------------- | ---------------------------------------------------------- |
| `pnpm type-check` gates between phases | Phase N types gate Phase N+1                               |
| Phase 2c (supabase-client.ts) after G3 | Adds types that reference gsc-browser + gsc-client modules |
| Phase 3 (CLI) after Phase 2            | Imports from all Phase 2 modules                           |
| Git commits                            | One per phase, in order                                    |

---

## Cost Estimate

| Phase                    | Model  | Est. input tokens | Est. output tokens | Est. cost  |
| ------------------------ | ------ | ----------------- | ------------------ | ---------- |
| Phase 1: Infrastructure  | haiku  | ~8k               | ~3k                | ~$0.01     |
| Phase 2: Library modules | sonnet | ~20k              | ~8k                | ~$0.18     |
| Phase 3: Main CLI        | sonnet | ~25k              | ~10k               | ~$0.23     |
| Phase 4: GitHub Actions  | haiku  | ~5k               | ~1k                | ~$0.003    |
| Phase 5: Documentation   | haiku  | ~8k               | ~3k                | ~$0.01     |
| **Total**                |        | **~66k**          | **~25k**           | **~$0.43** |

---

## Final Report

After all phases complete, output:

1. Phases completed — list each with commit SHA
2. Build status — `pnpm type-check` result
3. Any deviations from the plan (note: Playwright selectors in gsc-browser.ts are best-estimates requiring a navigation spike before first production use — this is expected and documented)
4. Token usage:

   | Model     | Est. input tokens | Est. output tokens | Est. cost |
   | --------- | ----------------- | ------------------ | --------- |
   | sonnet    |                   |                    | $X.XX     |
   | haiku     |                   |                    | $X.XX     |
   | **Total** |                   |                    | **$X.XX** |

---

## Update Session File

After completing all phases, append to `output/sessions/2026-04-12_gsc-indexing-monitor/yolo-brief.md`:

```markdown
## Completed

**Date:** [today]
**Status:** All phases executed successfully

[1-paragraph summary]

### Commits

[list each commit SHA and message]
```

---

## Run Wrap-Up

After completing all phases and updating the session file, run:

/wrap-up-session

This writes `session-wrap-up.md` to the session folder. **Required final step — do not skip.**

---

## Rules

- STOP on any failed verification gate — do not continue to next phase
- Read every file before editing it
- Never push — leave all changes on the feature branch
- **Consult `## Parallel execution groups` before launching any work** — items in a group MUST launch in a single message
- Items NOT listed in any group run sequentially
- Never parallelise across phase boundaries
- If groups table and phase prose disagree, groups table wins
- Minimal changes only — implement what the plan says, nothing more
- Use `model: haiku` for mechanical work, `model: sonnet` for standard edits
- Co-Authored-By must say `Claude Sonnet 4.6`
- **Playwright selectors and coverageReportUrl values are best-estimates** — document them as requiring post-implementation verification. Do not mark the implementation as broken because of this.
