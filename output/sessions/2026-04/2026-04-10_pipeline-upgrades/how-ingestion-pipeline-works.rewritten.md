# How the Ingestion Pipeline Works

The ingestion pipeline analyses a reference website and produces a complete, self-contained theme package with generated components, then scaffolds a throwaway test site that consumes the new theme. The user-facing entry point is the `/pipeline.ingest` slash command; the heavy lifting happens inside `tools/analyse-site.ts`.

## Core principle

**A theme is a strict family of structurally compatible components.** Each ingestion produces a complete component set for that theme. Components from one theme are never mixed with another. The test site scaffolded by the pipeline is a preview — not a client deliverable — and exists only so a human can eyeball the generated theme against the reference before promoting it.

## The three phases

As of 2026-04-10, `/pipeline.ingest` is structured as three phases. Earlier revisions ran as one ~1600-line monolithic skill where the orchestrator held the entire context through every step.

| Phase                            | Owner                                              | Work                                                                                                                                                                            | Why it's here                                                                                                                                                                                                |
| -------------------------------- | -------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **A — Reference harvest**        | Orchestrator + parallel sub-agents                 | Run `analyse-site.ts` (A0, sequential prelude), then fan out reference asset download (A1) and scaffold inventory (A3) as parallel sub-agents in a **single Task-tool message** | Read-heavy work. Delegating to sub-agents with fresh contexts keeps screenshot inspection, HTML parsing, and barrel-export parsing out of the orchestrator's context.                                        |
| **B — Theme package validation** | `cs-theme-package-validator` sub-agent (read-only) | Audit `packages/themes/<name>/` against all 15 TPV rules (TPV-001 … TPV-015) and write `findings-theme-package.md`                                                              | Gate between Phase A and Phase C. A failing audit must abort before any `sites/` directory is touched.                                                                                                       |
| **C — Test site scaffolding**    | Orchestrator (main Claude)                         | Copy base-template, wire the theme, generate five standard pages, run fidelity review, reconcile lockfile, stage, report                                                        | Stateful filesystem editing with tightly coupled intra-step state (`$BODY_VAR`, `$HEADING_VAR`, registry export names) that does not parallelise — it stays in the orchestrator where the context is shared. |

The primary benefit of this decomposition is **context isolation**, not wall-clock parallelism. The critical path is dominated by `analyse-site.ts` (Phase A0) and the `/pipeline.validate-site` dev-server round trip (Phase C3); neither moves under decomposition. What changes is that the orchestrator no longer carries 1600 lines of harvest-and-inventory work into Phase C where the real edit decisions happen, and Phase B is now a hard validator gate instead of an implicit trust in whatever `analyse-site.ts` emitted.

---

## Phase A — Reference Harvest (parallel)

Phase A splits into a sequential prelude (A0) and a parallel fan-out (A1 + A3 in a single Task message).

### A0 — `analyse-site.ts` (sequential prelude)

`npx tsx tools/analyse-site.ts --url $URL [--name $NAME]` is the multi-minute core of the pipeline. It cannot be meaningfully parallelised without rewriting the tool. A0 runs inside the orchestrator and produces the inputs every subsequent sub-agent needs.

Internally the v2 analyse-site pipeline runs 14 steps in order:

1. Parse args, determine theme name (auto-assigned from constellation namespace)
2. Discover pages — sitemap.xml, nav parsing, common-path probing
3. Fetch HTML for all discovered pages
4. Capture screenshots — Playwright headless Chromium at 1440×900
5. HTML structural analysis — deterministic section detection
6. Colour extraction — CSS scraping from homepage
7. Per-page vision analysis — Claude Sonnet vision calls (capped at 6 pages)
8. Site synthesis — cross-page consolidation
9. Component matching — map sections to core-components
10. Token reconciliation — vision tokens override scraped when confident
11. Write analysis files — `site-analysis.json` + `site-analysis.md`
12. Component generation — unmatched sections only
13. Example page generation — TSX files from PageBlueprints
14. Scaffold theme package — `packages/themes/<name>/`

**Outputs consumed by later phases:**

- `output/ingestion/<name>/site-analysis.json` — discoveredPages, pageBlueprints, sectionBlueprints, componentMatches, themeTokenRecommendations
- `output/ingestion/<name>/screenshots/*.png` — reference site captures
- `packages/themes/<name>/` — fully scaffolded theme package (index.ts, globals.css, manifest.ts, components/, showcase-registry.tsx, README.md)
- Updates `packages/themes/package.json` exports and appends the theme name to `THEME_NAMES` in `packages/theme-system/src/types.ts`

**Why A0 is not parallelised:** The sub-steps inside `analyse-site.ts` form a strict linear data flow — each step reads the output of the previous one. Vision analysis needs the screenshots; component matching needs the blueprints; theme scaffolding needs the reconciled tokens. A parallel rewrite would need to break that pipeline apart, which is a larger refactor out of scope for the skill decomposition.

### A1 — Reference asset download (sub-agent, sonnet)

A1 merges the previous skill's Step 2b (HTML capture) and Step 2c (image download) into a single sub-agent task. It reads `discoveredPages[]` from `site-analysis.json` and writes:

- `output/ingestion/<name>/html/*.html` — reference HTML source per page (WARN-not-STOP on curl failures, since many sites block crawlers)
- `output/ingestion/<name>/meta/html-manifest.json` — list of captured pages
- `output/ingestion/<name>/images/*` — up to 20 reference images, filenames sanitised with python3 (not `tr`, which leaves trailing hyphens)
- `output/ingestion/<name>/meta/image-manifest.json` — originalUrl, localPath, publicPath for each image

The test site copy of these images happens later in Phase C1 — A1 only writes to `output/ingestion/`, never to `sites/`.

### A3 — Scaffold inventory (sub-agent, haiku)

A3 is a small mechanical sub-agent that parses `packages/themes/<name>/index.ts` (already written by A0) to extract the Registry and DefaultConfig export names, computes the camelCase form of the theme name, and checks the theme's `components/index.ts` barrel against the files on disk. It writes:

- `output/ingestion/<name>/meta/scaffold-inventory.json` — themeName, camelCaseThemeName, registryExport, defaultConfigExport, themeComponents[], baseTemplateEntries[]

This work used to live inline in Phase C where the orchestrator parsed the theme index on demand. Moving it to a pre-computed JSON file lets the orchestrator enter Phase C with all metadata in hand.

### Why A2 is absent

The original decomposition plan called for three parallel sub-agents: A1 (download), A2 (visual token extraction from screenshots), and A3 (template fetch). A2 is **subsumed by A0** — `tools/analyse-site.ts` already performs vision analysis and token reconciliation as part of steps 7 and 10. Creating a separate sub-agent to read the same screenshots again would waste cost without improving quality. If A0 is ever broken up into finer-grained sub-steps, a standalone A2 becomes possible.

### Phase A verification gate

Before entering Phase B:

```bash
test -f output/ingestion/<name>/site-analysis.json                  # A0
test -f output/ingestion/<name>/meta/image-manifest.json            # A1
test -f output/ingestion/<name>/meta/scaffold-inventory.json        # A3
test -f packages/themes/<name>/index.ts                             # A0 side effect
```

If any file is missing, the pipeline stops and reports which sub-agent failed.

---

## Phase B — Theme Package Validation (gated delegation)

Phase B is the gate between a freshly generated theme package and any `sites/` directory modification. It delegates a single specialist sub-agent to audit the package, then applies a hard rule on the output.

### The validator

`cs-theme-package-validator` is a read-only sub-agent that runs 15 rules against `packages/themes/<name>/`:

| Rule range        | What it checks                                                                |
| ----------------- | ----------------------------------------------------------------------------- |
| TPV-001 … TPV-005 | Package structure, required exports, token completeness                       |
| TPV-006 … TPV-010 | Colour format correctness, Header/Footer Server Component constraints         |
| TPV-011 … TPV-015 | Tailwind hardcoding violations, barrel export integrity, manifest correctness |

The validator writes its findings to `output/ingestion/<name>/meta/findings-theme-package.md` and returns the Statistics line (`Critical=X High=Y Medium=Z Low=W`) to the orchestrator.

### The gate rule

**If `Critical + High > 0`, Phase B aborts the pipeline.** The orchestrator prints the full findings file, tells the user which file to read, and does not touch `sites/`. The theme package is left in place so the user can patch it and re-run `/pipeline.ingest --url <same-url> --name <theme-name>`.

If `Critical + High == 0` but Medium or Low findings exist, they are printed as warnings and Phase C proceeds.

There is no per-run suppression mechanism. If a TPV rule produces a confirmed false positive on a generated theme, the fix belongs in the validator agent definition or in `tools/analyse-site.ts`, not in an override flag on `/pipeline.ingest`.

### Why this gate is new

Before the decomposition, the pipeline trusted whatever `analyse-site.ts` emitted and went straight to scaffolding. The Phase B gate catches stale barrel exports (TPV-002), malformed colour tokens (TPV-006), Server Component violations in Header/Footer (TPV-009), and hardcoded Tailwind values (TPV-011) before they turn into type-check failures or visual regressions inside the test site. Catching them at the theme package is cheaper than chasing symptoms through five generated pages.

---

## Phase C — Test Site Scaffolding (orchestrator)

Phase C is where the orchestrator does stateful filesystem work. It stays in the main context because the steps share local state (`$BODY_VAR`, `$HEADING_VAR`, registry export name, category slug) that would be expensive to serialise across sub-agent boundaries.

The orchestrator enters Phase C by reading `scaffold-inventory.json` (written by A3) to get the theme's Registry / DefaultConfig export names and the camelCase theme name, then executes the following sub-steps:

| Sub-step                        | Work                                                                                                                                                                                                       | Files touched                                                                                                                                 |
| ------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------- |
| **C1 — Create test site**       | `cp -r sites/base-template sites/test-<name>`, remove `node_modules`/`.next`/`.turbo`, copy downloaded reference images into `public/images/`                                                              | `sites/test-<name>/`                                                                                                                          |
| **C1b — Marker file**           | Write `.pipeline-test-site.json` with theme name, source URL, pipeline output path                                                                                                                         | `sites/test-<name>/.pipeline-test-site.json`                                                                                                  |
| **C2a — theme.config.ts**       | Import the theme's Registry and DefaultConfig, override `colors.surface.inverse` with the reference site's hero colour                                                                                     | `sites/test-<name>/theme.config.ts`                                                                                                           |
| **C2b — globals.css**           | Import theme globals, Tailwind directives, font-family vars from C2e, Material Symbols                                                                                                                     | `sites/test-<name>/app/globals.css`                                                                                                           |
| **C2c — CI-inert package.json** | Use `generateTestSitePackageJson()` to strip build/type-check/lint/test scripts and add `pipelineTestSite: true` marker                                                                                    | `sites/test-<name>/package.json`                                                                                                              |
| **C2d — Tagline**               | Edit `site.config.ts` tagline to `"Pipeline Test Site — <name> theme"`                                                                                                                                     | `sites/test-<name>/site.config.ts`                                                                                                            |
| **C2e — layout.tsx + fonts**    | Detect body/heading fonts from `themeTokenRecommendations`, map to `next/font/google` export names, write layout with ThemeProvider and theme registry                                                     | `sites/test-<name>/app/layout.tsx`                                                                                                            |
| **C2f — Five standard pages**   | Generate `/`, `/about`, `/contact`, `/<category>/`, `/<category>/[slug]/` from `pageBlueprints[]` with component inventory, clean stale barrel exports, fix animation import paths, run 6 validation gates | `sites/test-<name>/app/**/page.tsx`, possibly `packages/themes/<name>/components/index.ts`                                                    |
| **C2g — CSP patch**             | Add `fonts.googleapis.com` / `fonts.gstatic.com` to `next.config.ts` CSP                                                                                                                                   | `sites/test-<name>/next.config.ts`                                                                                                            |
| **C3 — Fidelity review + fix**  | Invoke `/pipeline.validate-site` with a review prompt; run pixel-diff against reference screenshots                                                                                                        | `output/ingestion/<name>/meta/{tsx-review-findings.json,tsx-fix-log.json,dev-screenshots/}`, potentially patched theme component `.tsx` files |
| **C4 — Lockfile + type-check**  | `pnpm install --lockfile-only` at repo root, `tsc --noEmit` inside the test site                                                                                                                           | `pnpm-lock.yaml`                                                                                                                              |
| **C5 — Stage**                  | `git add sites/test-<name>/ pnpm-lock.yaml` (no commit)                                                                                                                                                    | git index                                                                                                                                     |

### Why C2 stays as one block

C2a–C2g form a tightly coupled linear sequence because C2e (font detection) computes `$BODY_VAR` and `$HEADING_VAR`, which C2b (globals.css) substitutes. C2f (five pages) reads the theme component inventory computed at the start of Phase C. C2g (CSP patch) is a trivial tail. Splitting them into sub-agents would require serialising that shared state into JSON files and re-parsing it in each sub-agent context — the overhead would outweigh any latency gain.

### Why C3 is not delegated further

Phase C3 already delegates to `/pipeline.validate-site`, which itself spawns review and fix sub-agents against a running Next.js dev server. Adding another delegation layer would introduce port-contention risk without reducing orchestrator load.

### Phase C verification gate

Before reporting success:

```bash
test -d sites/test-<name>
test -f sites/test-<name>/.pipeline-test-site.json
test -f sites/test-<name>/theme.config.ts
test -f sites/test-<name>/app/layout.tsx
find sites/test-<name>/app -name page.tsx | wc -l | grep -q "^ *5$"
```

---

## Error handling

| Phase           | Failure mode                                                                 | What happens                                                                                                                                                  |
| --------------- | ---------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| A0              | `analyse-site.ts` crashes or produces partial output                         | Pipeline stops. `packages/themes/<name>/` may be half-written — user should run `/pipeline.kill-theme <name>` before retrying.                                |
| A1              | `curl` fails on HTML or images                                               | WARN, not STOP. HTML capture is supplementary (screenshots are primary). Missing images show as colour-block placeholders that C3 flags as `visual` findings. |
| A3              | Theme barrel file missing or malformed                                       | STOP. A3 cannot produce scaffold-inventory.json without readable theme exports.                                                                               |
| B1              | Validator sub-agent crashes or returns no findings file                      | STOP. Treat as a broken gate — do not proceed.                                                                                                                |
| B2              | `Critical + High > 0`                                                        | STOP. Print findings file path, leave theme package in place for user editing, do not touch `sites/`.                                                         |
| C1              | `cp -r sites/base-template` fails (e.g. `sites/test-<name>/` already exists) | STOP. User should run `/pipeline.kill-site test-<name>` before retrying.                                                                                      |
| C2f-9 Gates 1–2 | Route count or missing routes                                                | STOP. A generated page file was lost.                                                                                                                         |
| C2f-9 Gates 3–6 | Hex colours / forbidden APIs / missing nav-footer / low section count        | WARN, not STOP. C3 fidelity review will pick up most of these as findings.                                                                                    |
| C3              | Dev server fails to start (e.g. port 3000 occupied)                          | STOP. Pre-existing risk — not introduced by the decomposition.                                                                                                |
| C4              | `tsc --noEmit` fails                                                         | WARN, continue to C5. The user needs to see the type errors to diagnose theme issues.                                                                         |

**Dev-server port contention** during C3 is the main operational risk. If a previous run left a stray Next.js process on port 3000, `/pipeline.validate-site`'s health check will fail and Phase C aborts. Kill strays with `lsof -ti:3000 | xargs kill` before retrying.

---

## Observability

Every run writes its artefacts to one session directory:

```
output/ingestion/<name>/
├── site-analysis.json              # A0: full v2 analysis
├── site-analysis.md                # A0: human-readable report
├── screenshots/                    # A0: reference site captures
│   ├── home.png
│   ├── about.png
│   └── ...
├── example-pages/                  # A0: (generated but unused by the test site)
├── html/                           # A1: reference HTML source
│   └── *.html
├── images/                         # A1: downloaded reference images
│   └── *
└── meta/
    ├── html-manifest.json          # A1
    ├── image-manifest.json         # A1
    ├── scaffold-inventory.json     # A3
    ├── findings-theme-package.md   # B1 (TPV audit)
    ├── validate-review-prompt.txt  # C3 (review criteria handed to validate-site)
    ├── tsx-review-findings.json    # C3 (findings from validate-site)
    ├── tsx-fix-log.json            # C3 (what the fix agent did)
    └── dev-screenshots/            # C3 (actual rendered test-site screenshots)
```

**Debugging a failed run:**

- Phase B failure → read `meta/findings-theme-package.md`. The statistics line tells you the severity split; the body lists each finding with file path and rule ID.
- Phase C3 finding not auto-fixed → read `meta/tsx-fix-log.json` to see which attempt was made and why it was skipped.
- Pixel-diff surprise → compare `meta/dev-screenshots/<page>.png` with `screenshots/<page>.png` in-place.
- Type-check failure in C4 → `cd sites/test-<name> && npx tsc --noEmit` to reproduce.

---

## Relationship to other skills

| Skill                     | Relationship                                                                                                                                                                                                                                         |
| ------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `/pipeline.stitch-design` | Alternative input path. Stitch generates a theme from a Google Stitch AI design rather than from a reference URL. Both land in `packages/themes/<name>/`, but Stitch uses `sites/<name>-test/` instead of `sites/test-<name>/` for its preview site. |
| `/pipeline.validate-site` | Downstream step. `/pipeline.ingest` invokes it from Phase C3 with an ingest-specific review prompt. It handles screenshots, the review/fix loop, and console QA. It can also be invoked standalone against any site.                                 |
| `/pipeline.kill-theme`    | Cleanup. Removes a theme package from `packages/themes/<name>/` and its entry in `THEME_NAMES`. Use this to recover from a failed Phase A0 that left a half-written theme.                                                                           |
| `/pipeline.kill-site`     | Cleanup. Removes `sites/test-<name>/` (or `sites/<name>-test/` from Stitch). Handles both naming conventions. Use this before retrying `/pipeline.ingest` with the same theme name.                                                                  |

## Test site naming

Two pipeline commands create test sites, using different conventions:

| Command                   | Creates                    | Example            |
| ------------------------- | -------------------------- | ------------------ |
| `/pipeline.ingest`        | `sites/test-<theme-name>/` | `sites/test-lyra/` |
| `/pipeline.stitch-design` | `sites/<theme-name>-test/` | `sites/lyra-test/` |

Both conventions are handled by `/pipeline.kill-site` — pass either the full folder name or the bare theme name.

---

## Key files

| File                                           | Purpose                                               |
| ---------------------------------------------- | ----------------------------------------------------- |
| `.claude/commands/pipeline.ingest.md`          | The orchestrator skill — Phase A / B / C structure    |
| `.claude/agents/cs-theme-package-validator.md` | The TPV-001 … TPV-015 validator agent (Phase B)       |
| `.claude/commands/pipeline.validate-site.md`   | Shared fidelity review skill (Phase C3)               |
| `tools/analyse-site.ts`                        | v2 ingestion pipeline entry point (Phase A0)          |
| `tools/lib/site-discovery.ts`                  | Page discovery (sitemap, nav, probing)                |
| `tools/lib/screenshot-capture.ts`              | Playwright screenshot capture                         |
| `tools/lib/html-structure-analyzer.ts`         | Deterministic HTML section detection                  |
| `tools/lib/multi-page-analyzer.ts`             | Per-page vision + site synthesis                      |
| `tools/lib/core-component-catalog.ts`          | Core component metadata                               |
| `tools/lib/component-matcher.ts`               | Section → component matching                          |
| `tools/lib/page-template-generator.ts`         | Example page TSX generation                           |
| `tools/lib/theme-name-picker.ts`               | Auto theme name from constellation namespace          |
| `tools/lib/test-site-package.ts`               | `generateTestSitePackageJson()` helper (Phase C2c)    |
| `tools/lib/pipeline-visual-compare.ts`         | Pixel-diff helper (Phase C3)                          |
| `tools/scaffold-theme-package.ts`              | Theme package scaffolder (invoked by analyse-site.ts) |

## CLI escape hatch

The raw analyse-site tool can be invoked directly, skipping the orchestrator entirely:

```bash
npx tsx tools/analyse-site.ts --url https://example.com/
```

Flags:

- `--url <website>` (required)
- `--name <slug>` (optional — auto-assigned from constellation namespace)
- `--output <dir>` (optional — default `./output/<theme-name>/`)
- `--max-pages <n>` (optional — default 10)
- `--dry-run` (analysis only, no file generation)
- `--skip-examples` (skip example page generation)

This bypasses Phases B and C — the user gets a theme package but no validator audit and no test site. Use when you want to iterate on the theme generator itself rather than the orchestrator.
