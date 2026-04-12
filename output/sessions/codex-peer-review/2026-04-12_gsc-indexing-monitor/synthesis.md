# Implementation Plan: GSC Indexing Monitor

**Date:** 2026-04-12
**Status:** Ready for implementation
**Source:** Claude plan + Opus critical review (Codex API returned stub — single-model synthesis)

---

## Plan Review: Gaps and Strengthened Decisions

| Area                                | Gap / Issue                                                                                                                    | Resolution                                                                                                                                                                        |
| ----------------------------------- | ------------------------------------------------------------------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **GSC Coverage Report navigation**  | HIGH RISK. The exact URL structure and SPA loading behaviour is unknown. `resource_id` encoding differs by property type.      | **Mandatory navigation spike before any Playwright code.** Document exact URLs, selectors, and loading behaviour. See detailed spike notes below.                                 |
| **CSV export flow**                 | Exact selector for Export button unknown. File download is a two-step UI interaction (click Export → dropdown → Download CSV). | Use `page.waitForEvent('download')` around the export click sequence. Selectors captured in spike. Parser reads buffer directly, no disk write.                                   |
| **CSV column names**                | Post-2023 GSC redesign may use `Page indexing` not `Coverage state`. `Last crawled` column name may differ.                    | Defensive parser: find columns by partial case-insensitive match, throw with actual headers if not found.                                                                         |
| **Session validity check**          | Cookie expiry check in file is insufficient — sessions can be invalidated server-side before expiry.                           | Downgrade pre-flight to a sanity check (file exists, parseable, not obviously expired). Treat the real check as the navigation: `GscSessionExpiredError` thrown on auth redirect. |
| **Transition tracking**             | No `first_seen_unindexed` stored — makes "oldest unresolved URLs" expensive to compute.                                        | Compute at query time with `MIN(inspected_at)` per URL. Acceptable at expected volumes (<100K rows/year). Add materialized table later if report generation exceeds 5 seconds.    |
| **Monthly report: regressions**     | No tracking of URLs that regressed from indexed → unindexed.                                                                   | Add "De-indexed URLs" section to monthly report.                                                                                                                                  |
| **`.gitignore` missing `secrets/`** | **BUG.** `secrets/gsc-session.json` would be staged by `git add .`.                                                            | **Must add `secrets/` to `.gitignore` in Step 1.1, before any session files are created.**                                                                                        |
| **Zero-row CSV**                    | Not handled explicitly.                                                                                                        | Return empty array, log "No unindexed URLs found", mark run `completed` with `urls_unindexed: 0`. Success case, not error.                                                        |
| **Supabase unreachable**            | Tool crashes before CSV download if Supabase is unreachable.                                                                   | Wrap `createGscRun` in try/catch. If Supabase down, set `dbAvailable = false`, continue with console output + sitemap submission.                                                 |
| **Playwright CI install time**      | ~1-2 minutes (not ~200ms as originally estimated).                                                                             | Cache Playwright browser binary with `actions/cache` keyed on pnpm lockfile hash.                                                                                                 |
| **`coverageReportUrl` per site**    | Runtime URL construction is fragile (encoding varies by property type).                                                        | Add `coverageReportUrl` field to `GscSiteConfig`. Set during spike, stored as a constant. No runtime construction.                                                                |

---

## Mandatory Pre-Implementation: GSC Navigation Spike

**Do this before writing any Playwright code.** Budget 1-2 hours.

Open GSC manually for `sc-domain:colossus-scaffolding.co.uk` with DevTools open and document:

1. **Coverage report URL** — the exact URL of the "Pages" (formerly "Coverage") report, including any `resource_id` query param encoding
2. **"Not indexed" filter URL** — navigate to filter by "Discovered - currently not indexed" and capture the URL with its filter params (likely `item_key=` or similar)
3. **Export button selector** — `aria-label`, `data-testid`, or text content
4. **Export dropdown** — does clicking export open a dropdown? What is the "Download CSV" option selector?
5. **Downloaded file** — what is the filename pattern? What columns does the CSV actually have?
6. **SPA loading** — what `waitForSelector` or `waitForLoadState` strategy reliably indicates the report has rendered?
7. **Property type difference** — test with a URL-prefix property if available to confirm the `resource_id` encoding works for both types

Store all findings as named constants and comments in `tools/lib/gsc-browser.ts`.

---

## Implementation Plan

### Phase 1 — Infrastructure

**Step 1.1 — Dependencies, scripts, gitignore**

```bash
pnpm add -D playwright
```

Modify `package.json` scripts:

```json
"gsc:login":          "tsx tools/gsc-indexing.ts login",
"gsc:inspect":        "tsx tools/gsc-indexing.ts inspect",
"gsc:inspect:dry":    "tsx tools/gsc-indexing.ts inspect --dry-run",
"gsc:report":         "tsx tools/gsc-indexing.ts report",
"gsc:report:monthly": "tsx tools/gsc-indexing.ts report --monthly",
"gsc:verify":         "tsx tools/gsc-indexing.ts verify"
```

Add to `.gitignore`:

```
secrets/
```

**Verification:** `pnpm gsc:login --help` exits 0. `git status` does not show `secrets/` as a tracked path.

---

**Step 1.2 — Supabase tables** (`tools/supabase-schema-gsc.sql`)

Two new tables. No changes to existing schema.

**`gsc_runs`:**

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
ALTER TABLE gsc_runs FORCE ROW LEVEL SECURITY;
CREATE POLICY "Service role access" ON gsc_runs
  FOR ALL USING (auth.role() = 'service_role');
```

**`gsc_url_inspections`:**

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

**Verification:** Both tables visible in Supabase dashboard with correct columns, indexes, and RLS enabled.

---

**Step 1.3 — Site config** (`tools/gsc-config.ts`)

```typescript
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
   * The exact GSC Coverage report URL for this property, pre-filtered to
   * "Discovered - currently not indexed". Captured during the navigation spike.
   * Stored here to avoid runtime URL construction issues with property type encoding.
   */
  coverageReportUrl: string;
}

export const GSC_SITE_CONFIG: Record<string, GscSiteConfig> = {
  "colossus-scaffolding": {
    gscProperty: "sc-domain:colossus-scaffolding.co.uk",
    propertyType: "domain",
    sitemapIndexUrl: "https://www.colossus-scaffolding.co.uk/sitemap-index.xml",
    // TODO: Fill in during navigation spike
    coverageReportUrl:
      "https://search.google.com/search-console/index?resource_id=sc-domain%3Acolossus-scaffolding.co.uk",
  },
  "dj-fox-electrical": {
    gscProperty: "sc-domain:djfoxelectrical.com",
    propertyType: "domain",
    sitemapIndexUrl: "https://www.djfoxelectrical.com/sitemap-index.xml",
    // TODO: Fill in during navigation spike
    coverageReportUrl:
      "https://search.google.com/search-console/index?resource_id=sc-domain%3Adjfoxelectrical.com",
  },
};
```

**Verification:** TypeScript compiles without errors.

---

### Phase 2 — Library Modules

**Step 2.1 — `tools/lib/gsc-client.ts`** (service account API, no Playwright)

```typescript
import { google } from "googleapis";

export async function createGscAuth() {
  /* reads GSC_SERVICE_ACCOUNT_KEY_JSON or _PATH */
}
export async function submitSitemap(auth, siteUrl: string, feedpath: string): Promise<void>;
export async function listProperties(auth): Promise<string[]>;
```

`googleapis` is already installed. No new package.

**Verification:** `pnpm gsc:verify` lists accessible GSC properties.

---

**Step 2.2 — `tools/lib/gsc-browser.ts`** (Playwright — depends on spike findings)

Key design decisions:

- `loginGsc()` — headed Chromium, navigate to GSC, wait for dashboard, save `storageState()`
- `isSessionValid()` — file-level sanity check only (exists, parseable, not all cookies expired). Label as sanity check in logs, not guarantee.
- `downloadCoverageReport(config)` — headless, restore session, navigate to `config.coverageReportUrl`, export CSV, parse defensively

```typescript
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

export async function loginGsc(): Promise<void>;
export async function isSessionValid(): Promise<boolean>;
export async function downloadCoverageReport(config: GscSiteConfig): Promise<CoverageRow[]>;
```

**CSV parser (inline, no dependency):**

```typescript
function parseCsv(content: string): CoverageRow[] {
  const lines = content.trim().split("\n");
  if (lines.length < 2) return [];
  const headers = lines[0].split(",").map((h) => h.replace(/"/g, "").trim().toLowerCase());

  const urlIdx = headers.findIndex((h) => h.includes("url"));
  const stateIdx = headers.findIndex((h) => h.includes("index") || h.includes("coverage"));
  const crawlIdx = headers.findIndex((h) => h.includes("crawl") || h.includes("detected"));

  if (urlIdx === -1 || stateIdx === -1) {
    throw new Error(`GSC CSV: expected URL and coverage/index columns. Got: ${headers.join(", ")}`);
  }

  return lines
    .slice(1)
    .map((line) => {
      const cols = line.split(",").map((c) => c.replace(/"/g, "").trim());
      return {
        url: cols[urlIdx],
        coverageState: cols[stateIdx],
        lastDetected: crawlIdx !== -1 ? cols[crawlIdx] || null : null,
      };
    })
    .filter((r) => r.url);
}
```

**Verification:** `pnpm gsc:login` saves session. Manual test of `downloadCoverageReport` returns parsed rows.

---

**Step 2.3 — Extend `tools/lib/supabase-client.ts`**

Add to existing `RegistryClient` class. New types and methods exactly following existing patterns.

Types: `GscRun`, `GscUrlInspection`
Methods:

- `createGscRun(data)` → `gsc_runs` insert
- `updateGscRun(runId, data)` → update by `run_id`
- `bulkLogGscUrls(rows[])` → array insert (not one-by-one)
- `getGscRuns(siteSlug?, limit?)` → for `report` command
- `getGscUnindexedUrls(siteSlug, runId?)` → latest unindexed
- `getGscMonthlyData(siteSlug, year, month)` → aggregated for monthly report

**Verification:** `pnpm type-check` passes.

---

### Phase 3 — Main CLI (`tools/gsc-indexing.ts`)

Follow `tools/alert-system.ts` exactly. Shebang, JSDoc header documenting constraints, `dotenv.config`, chalk, Commander subcommands.

**JSDoc header must include:**

- These are monitoring tools only — no "Request Indexing" API exists
- The 10/day UI limit is irrelevant to this tool
- Sitemap submission is a hint, not a crawl guarantee
- Session management: `pnpm gsc:login` when session expires

**`inspect` command flow:**

```
1. If GSC_SESSION_JSON env set: write to GSC_SESSION_PATH
2. isSessionValid() → if false, error + exit(1) with instructions
3. Determine site list (slug arg or all keys in GSC_SITE_CONFIG)
4. For each site:
   a. Look up config → skip with warning if missing
   b. Generate runId = crypto.randomUUID().slice(0, 8)
   c. Try createGscRun() → if Supabase fails, set dbAvailable=false, log warning, continue
   d. Try downloadCoverageReport() → catch GscSessionExpiredError → error + exit(1)
   e. If rows.length === 0: log "No unindexed URLs" → skip to sitemap submission
   f. Print unindexed URLs (unless --quiet)
   g. If dbAvailable: bulkLogGscUrls()
   h. submitSitemap() (unless --dry-run)
   i. If dbAvailable: updateGscRun(completed, counts)
   j. Print summary line
5. Print cross-site summary
```

**Monthly report structure:**

```markdown
# GSC Indexing Report: [Site Name] — [Month Year]

**Period:** YYYY-MM-DD to YYYY-MM-DD
**Generated:** YYYY-MM-DD

## Summary

| Metric                              | Value |
| ----------------------------------- | ----- |
| Total URLs tracked                  | N     |
| Unindexed at start of month         | N     |
| Unindexed at end of month           | N     |
| Newly indexed this month            | N     |
| De-indexed this month (regressions) | N     |
| Sitemaps submitted                  | N     |

## Week-by-Week Trend

| Week     | Unindexed | Change |
| -------- | --------- | ------ |
| Apr 1–7  | 61        | —      |
| Apr 8–14 | 57        | −4     |

## Newly Indexed This Month

| URL | First Detected Unindexed | Days to Index |
| --- | ------------------------ | ------------- |

## Top Unresolved URLs (oldest first)

| URL | First Detected | Days Pending |
| --- | -------------- | ------------ |

## De-indexed URLs (Regressions)

| URL | Previously Indexed | Re-detected Unindexed |
| --- | ------------------ | --------------------- |

---

_Generated by GSC Indexing Monitor. Raw data: `gsc_url_inspections` table in Supabase._
_A polished client version will be generated separately._
```

**Verification:** `pnpm gsc:inspect colossus-scaffolding --dry-run` completes without error, prints URL list.

---

### Phase 4 — GitHub Actions (`.github/workflows/gsc-indexing.yml`)

```yaml
name: GSC Indexing Monitor

on:
  schedule:
    - cron: "0 7 * * *" # 07:00 UTC daily
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

**Required GitHub Secrets:**

- `SUPABASE_URL`, `SUPABASE_SERVICE_KEY` — already exist for other workflows
- `GSC_SERVICE_ACCOUNT_KEY_JSON` — new (service account JSON string)
- `GSC_SESSION_JSON` — new (browser session JSON string, from `secrets/gsc-session.json`)

**Session expiry recovery:** Workflow fails with non-zero exit (GitHub sends failure email). Operator runs `pnpm gsc:login` locally, copies `secrets/gsc-session.json` content, updates `GSC_SESSION_JSON` secret.

**Verification:** `workflow_dispatch` with `dry_run: true` completes successfully.

---

### Phase 5 — Documentation

**`docs/guides/gsc-setup.md`** — three sections:

1. **Browser session setup** — `pnpm gsc:login`, CI secret update
2. **Service account setup** — GCP console, enable API, add as GSC User, property type check
3. **Adding a new site** — one entry in `gsc-config.ts`, add service account to new property, `pnpm gsc:verify`

**`.env.example`** additions:

```
# ===== GOOGLE SEARCH CONSOLE =====
GSC_SESSION_PATH=./secrets/gsc-session.json      # local dev — path to saved browser session
# GSC_SESSION_JSON=                               # CI — full session JSON as string (GitHub Secret)
GSC_SERVICE_ACCOUNT_KEY_PATH=./secrets/gsc-key.json  # local dev
# GSC_SERVICE_ACCOUNT_KEY_JSON=                   # CI — full service account JSON (GitHub Secret)
```

**`CLAUDE.md` docs table** — add `gsc-setup.md` to the Guides section.

---

## Known Risks

| Risk                                          | Likelihood             | Impact                     | Mitigation                                           |
| --------------------------------------------- | ---------------------- | -------------------------- | ---------------------------------------------------- |
| GSC UI/URL structure differs from assumptions | **High**               | Blocks Playwright entirely | Mandatory navigation spike. Budget 1-2 hours.        |
| GSC redesigns Coverage report UI              | Medium                 | Breaks CSV download        | Selectors as named constants. Monitor CI failures.   |
| Session expires more frequently than expected | Medium                 | Daily CI failures          | Loud failure + clear recovery instructions.          |
| CSV column names differ from expected         | Medium                 | Silent bad data            | Defensive parser with partial-match + header error.  |
| `secrets/` accidentally committed             | **High (without fix)** | Auth cookie leak           | **Fix in Step 1.1.**                                 |
| Supabase unreachable                          | Low                    | Data loss for run          | Graceful degradation — continue with console output. |
| Playwright CI install bloat                   | Low                    | Slower CI                  | Browser binary cache in workflow.                    |

---

## File Checklist

| File                                 | Action                                          |
| ------------------------------------ | ----------------------------------------------- |
| `.gitignore`                         | MODIFY — add `secrets/`                         |
| `package.json`                       | MODIFY — add playwright devDep + gsc:\* scripts |
| `tools/gsc-config.ts`                | CREATE                                          |
| `tools/gsc-indexing.ts`              | CREATE                                          |
| `tools/lib/gsc-browser.ts`           | CREATE (highest risk — Playwright)              |
| `tools/lib/gsc-client.ts`            | CREATE                                          |
| `tools/lib/supabase-client.ts`       | MODIFY — add GSC types + methods                |
| `tools/supabase-schema-gsc.sql`      | CREATE                                          |
| `.github/workflows/gsc-indexing.yml` | CREATE                                          |
| `docs/guides/gsc-setup.md`           | CREATE                                          |
| `.env.example`                       | MODIFY — document GSC vars                      |
| `output/reports/`                    | CREATE dir                                      |

## Recommended Next Steps

1. Do the navigation spike (manual GSC investigation) — fill in `coverageReportUrl` values and Playwright selectors
2. Create a session: `output/sessions/2026-04-12_gsc-indexing-monitor/session.md` from this synthesis
3. Implement in the sequence above (infrastructure → library modules → CLI → CI → docs)
