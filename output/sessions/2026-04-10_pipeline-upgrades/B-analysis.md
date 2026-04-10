# /pipeline.ingest decomposition analysis

Scratch analysis prepared during Phase 0 of the brief at
`B-pipeline-ingest-decompose.md`. Feeds directly into Phase 1 (skill rewrite).

---

## Current structure

The current `.claude/commands/pipeline.ingest.md` (1148 lines) is a single
linear orchestrator. Every step runs in the main context. Sequence:

| #   | Step                          | Work                                                                                                                                                                                                                                                           | Inputs                                                          | Outputs                                                                                                               | File writes                            | External deps                                    |
| --- | ----------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------- | -------------------------------------- | ------------------------------------------------ |
| 1   | Preflight                     | Branch + working-tree check; parse `$ARGUMENTS` for `--url`, `--name`                                                                                                                                                                                          | `git`, `$ARGUMENTS`                                             | `$URL`, `$NAME` (env-ish)                                                                                             | none                                   | `git`                                            |
| 2   | Run Ingestion Pipeline        | `npx tsx tools/analyse-site.ts --url $URL [--name $NAME]` — multi-minute v2 pipeline: discover pages, fetch HTML, screenshot, vision analysis, component matching, token reconciliation, component generation, theme package scaffold                          | `$URL`                                                          | Theme name, `output/ingestion/<name>/` (site-analysis.json, screenshots/, example-pages/), `packages/themes/<name>/*` | yes (theme package + ingestion output) | Claude Sonnet vision API, Playwright, filesystem |
| 2b  | Capture Reference HTML Source | For each `discoveredPages[]` page, curl HTML into `output/ingestion/<name>/html/`                                                                                                                                                                              | `site-analysis.json`                                            | `html/*.html`, `meta/html-manifest.json`                                                                              | yes                                    | `curl`                                           |
| 2c  | Download Reference Images     | Extract `<img src>` from captured HTML, resolve relative URLs, sanitise names with python3, curl to `output/ingestion/<name>/images/`                                                                                                                          | `html/*.html`                                                   | `images/*`, `meta/image-manifest.json`                                                                                | yes                                    | `curl`, `python3`                                |
| 3   | Create Test Site              | `cp -r sites/base-template sites/test-<name>`; remove `node_modules`/`.next`/`.turbo`; copy downloaded images into site public dir                                                                                                                             | `base-template/`, `images/`                                     | `sites/test-<name>/`                                                                                                  | yes                                    | `cp`, `rm`                                       |
| 4   | Write Marker File             | Write `sites/test-<name>/.pipeline-test-site.json`                                                                                                                                                                                                             | `$NAME`, `$URL`                                                 | marker file                                                                                                           | yes                                    | none                                             |
| 5a  | Theme config                  | Rewrite `sites/test-<name>/theme.config.ts` — read `packages/themes/<name>/index.ts` for export names, reference `themeTokenRecommendations.colors.surface.inverse` from site-analysis.json (fallback `#111111`)                                               | `packages/themes/<name>/index.ts`, `site-analysis.json`         | `theme.config.ts`                                                                                                     | yes                                    | none                                             |
| 5b  | Globals CSS                   | Rewrite `sites/test-<name>/app/globals.css` — imports theme globals, Tailwind directives, font-family vars from 5e, Material Symbols link                                                                                                                      | `$BODY_VAR`/`$HEADING_VAR` (from 5e)                            | `globals.css`                                                                                                         | yes                                    | none                                             |
| 5c  | CI-inert package.json         | Use `generateTestSitePackageJson()` from `tools/lib/test-site-package.ts`; assert no `build`/`type-check`/`lint`/`test` scripts                                                                                                                                | `base-template/package.json`                                    | `package.json`                                                                                                        | yes                                    | node                                             |
| 5d  | Tagline override              | Edit `sites/test-<name>/site.config.ts` tagline                                                                                                                                                                                                                | —                                                               | `site.config.ts`                                                                                                      | yes                                    | none                                             |
| 5e  | Layout.tsx (font detection)   | Read `site-analysis.json` for font names, map to next/font/google export names, write `app/layout.tsx` with ThemeProvider + theme registry                                                                                                                     | `site-analysis.json`, `packages/themes/<name>/index.ts`         | `layout.tsx`                                                                                                          | yes                                    | none                                             |
| 5f  | Five standard pages           | Generate `/`, `/about`, `/contact`, `/<category>`, `/<category>/[slug]` from `pageBlueprints[]` with component inventory; clean barrel index; fix animation import paths; run 6 validation gates (route count, hex, forbidden APIs, nav/footer, section count) | `site-analysis.json`, `packages/themes/<name>/components/`      | `app/**/page.tsx`, potentially patched `packages/themes/<name>/components/index.ts`                                   | yes                                    | none                                             |
| 5g  | CSP patch                     | Modify `next.config.ts` CSP to allow `fonts.googleapis.com` / `fonts.gstatic.com`                                                                                                                                                                              | —                                                               | `next.config.ts`                                                                                                      | yes                                    | none                                             |
| 5h  | Fidelity review + fix         | Write validate-review-prompt.txt, invoke `/pipeline.validate-site` (which screenshots, runs review agent, 3-attempt fix agent, console QA), then run pipeline-visual-compare for pixel-diff                                                                    | `dev-screenshots/`, `site-analysis.json`, `image-manifest.json` | `tsx-review-findings.json`, `tsx-fix-log.json`, potentially patched `.tsx` files                                      | yes                                    | `/pipeline.validate-site`, Playwright            |
| 6   | Reconcile Lockfile            | `pnpm install --lockfile-only` (fallback `pnpm install`), verify `--frozen-lockfile`, run `tsc --noEmit` inside test site                                                                                                                                      | `package.json` from 5c                                          | `pnpm-lock.yaml`                                                                                                      | yes                                    | `pnpm`, `tsc`                                    |
| 7   | Stage Lockfile With Test Site | `git add sites/test-<name>/ pnpm-lock.yaml` (no commit)                                                                                                                                                                                                        | —                                                               | git index                                                                                                             | no (index only)                        | `git`                                            |
| 8   | Report                        | Print summary block                                                                                                                                                                                                                                            | —                                                               | stdout                                                                                                                | no                                     | none                                             |

## Dependency graph

Strict linear data flow dominates. Every downstream step reads files that an
upstream step writes.

```
[Step 1 Preflight]
      ↓ $URL, $NAME
[Step 2 analyse-site.ts]  ← the multi-minute core; writes site-analysis.json + packages/themes/<name>/
      ↓ site-analysis.json (discoveredPages, pageBlueprints, themeTokenRecommendations), packages/themes/<name>/
      ├→ [Step 2b HTML capture]   reads discoveredPages, writes html/*.html
      │         ↓ html/*.html
      │         └→ [Step 2c image download]   reads html/*.html (grep for <img>), writes images/*
      │                                                          ↓ images/*
      └→ (independent of 2b/2c) [Step 3 cp base-template → sites/test-<name>]
                                                                  ↓ sites/test-<name>/
                                                                  └→ [Step 2c tail: cp images → public/images/]
                                                                                  ↓
                                    [Step 4 marker] [Step 5a theme.config] [Step 5b globals.css] [Step 5c package.json]
                                    [Step 5d tagline] [Step 5e layout.tsx + fonts] [Step 5f pages + gates] [Step 5g CSP]
                                                                  ↓ sites/test-<name>/ ready
                                                                  └→ [Step 5h /pipeline.validate-site]
                                                                                  ↓ review + fix
                                                                                  └→ [Step 6 lockfile reconcile + tsc]
                                                                                                  ↓
                                                                                                  └→ [Step 7 git add]
                                                                                                                  ↓
                                                                                                                  └→ [Step 8 report]
```

Within Step 5, internal order matters:

- 5e (font detection) must run before 5b (globals.css) because 5b substitutes `$BODY_VAR`/`$HEADING_VAR` from 5e output.
- 5c (CI-inert package.json) must run before Step 6 (lockfile reconcile) so pnpm sees the new workspace.
- 5f (standard pages) depends on 5a/5b/5e being in place because the generated pages import from `@platform/themes/<name>` and rely on the theme being wired.

## Parallelism opportunities

True independent fan-out after Step 2 (analyse-site.ts) completes:

| Task                                                                                                    | Inputs                                        | Can run parallel with                                                       |
| ------------------------------------------------------------------------------------------------------- | --------------------------------------------- | --------------------------------------------------------------------------- |
| Step 2b (HTML capture)                                                                                  | `site-analysis.json.discoveredPages`          | Step 3 (cp base-template), base-template file-list read                     |
| Step 2c (image download)                                                                                | `html/*.html` from 2b                         | Step 3 (cp base-template) — image copy into public/ happens after both land |
| Step 3 (cp base-template)                                                                               | `sites/base-template/` (read-only)            | Steps 2b, 2c, base-template scaffolding inventory                           |
| Reading `packages/themes/<name>/index.ts` to pre-compute registry/default-config export names for 5a/5e | `packages/themes/<name>/index.ts` (read-only) | Steps 2b, 2c, 3                                                             |

Step 2 (analyse-site.ts) itself cannot be parallelised — it is the dominant
wall-clock cost (multiple minutes) and its output gates everything downstream.

Inside Step 5, the sub-steps are mostly serial because they all write into the
same `sites/test-<name>/` tree. Parallelising them would race on filesystem
writes (theme.config.ts ↔ globals.css ↔ package.json are independent files,
but the speedup would be marginal compared to Step 2 and Step 5h).

Step 5h (fidelity review) is already delegated to `/pipeline.validate-site`,
which in turn spawns review + fix agents sequentially (dev server, screenshots,
review, fix retry loop).

**The honest conclusion:** the single biggest win from decomposition is
**not** wall-clock parallelism (the critical path is dominated by
analyse-site.ts and the validate-site dev-server round trip) but **context
isolation**. Delegating the read-heavy reference harvest to sub-agents keeps
1600 lines of screenshot inspection, HTML parsing, and component inventory
work out of the orchestrator's context, which improves quality on Phase C
where actual edit decisions get made.

## Phase boundaries

### Preflight (before Phase A)

Stays in the orchestrator: branch check, argument parsing, STOP on missing
`--url`. Trivial, no delegation value.

### Phase A — Reference Harvest (parallel fan-out)

Contains the reference-heavy work. The brief's target model is three parallel
sub-agents (A1 download, A2 token extraction, A3 template fetch) in one Task
message.

**Mapping from current skill:**

- **A0 (sequential prelude): Step 2 — `npx tsx tools/analyse-site.ts`**
  This is the multi-minute tool that does screenshot capture, vision
  analysis, token extraction, component matching, AND writes
  `packages/themes/<name>/` as a side effect. It cannot be meaningfully
  parallelised — it IS the harvest. The brief's "A2 visual token extraction"
  description is already covered by this tool. Keeping it as a sequential
  prelude to the parallel fan-out is the only sane option without rewriting
  `tools/analyse-site.ts`, which is out of scope.

- **A1 — Reference asset download (sub-agent, sonnet)**
  Merges current Step 2b (HTML capture via curl) + Step 2c (image extraction
  and download with python3 filename sanitisation). Reads
  `site-analysis.json.discoveredPages` produced by A0. Writes:
  - `output/ingestion/<name>/html/*.html`
  - `output/ingestion/<name>/meta/html-manifest.json`
  - `output/ingestion/<name>/images/*`
  - `output/ingestion/<name>/meta/image-manifest.json`

- **A2 — Visual token extraction (no separate sub-agent — handled by A0)**
  The brief describes A2 as reading screenshots to extract tokens into a
  draft theme.config. The current skill already does this inside
  `tools/analyse-site.ts` (per-page vision analysis → token reconciliation →
  theme package scaffold). Rather than duplicate the work in a sub-agent,
  the new skill documents that A2 is **subsumed by A0** and notes this as
  an intentional deviation from the brief's three-sub-agent ideal. A
  future refactor could extract the vision analysis into a standalone
  sub-agent once `analyse-site.ts` is decomposed.

- **A3 — Scaffold inventory (sub-agent, haiku)**
  Reads the base-template directory (`sites/base-template/`) and the newly
  written `packages/themes/<name>/` to produce a JSON manifest of files the
  orchestrator will need to know about in Phase C (theme export names,
  template file list). Writes:
  - `output/ingestion/<name>/meta/scaffold-inventory.json` containing:
    - `registryExport`, `defaultConfigExport` (parsed from
      `packages/themes/<name>/index.ts`)
    - `themeComponents[]` (exports from `components/index.ts` if present)
    - `baseTemplateFiles[]` (file list for the orchestrator's cp plan)

**Parallelism:** A1 and A3 run in a single parallel Task message after A0
completes. A1 does not depend on A3 and vice versa.

### Phase B — Theme Package Validation (delegated gate)

New phase introduced by the decomposition. `packages/themes/<name>/` already
exists (written by A0). Phase B adds a validator gate before any site
scaffolding happens.

**B1 — Delegate to `cs-theme-package-validator` sub-agent (single-theme audit)**

- Scope: `packages/themes/<name>/`
- Run all 15 rules (TPV-001 … TPV-015)
- Findings output: `output/ingestion/<name>/meta/findings-theme-package.md`
- Returns: the Statistics line so the orchestrator can decide

**B2 — Gate on `Critical + High > 0`**

- If >0: print full findings file, STOP the pipeline, tell the user to fix
  and re-run. Do NOT start Phase C. Do NOT touch `sites/`.
- If 0 but Medium/Low present: print as warnings, continue.

**Note:** The brief's Step B1 says "Generate the theme package" as
orchestrator work inside Phase B. In the current skill, the theme package is
generated inside `analyse-site.ts` (Phase A). The rewrite documents this
deviation — Phase B becomes validation-only, which is the more coherent split
given the existing tool structure.

### Phase C — Test Site Scaffolding (orchestrator stays)

Everything from current Step 3 onwards. Stateful filesystem work that touches
many files in `sites/test-<name>/` and depends on the validated theme package
from Phase A/B.

| New Step                             | Current step(s)                                                                                                                                | Why it stays in the orchestrator                                                                 |
| ------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------ |
| C1 — Scaffold test site              | Step 3 (cp base-template + copy images) + Step 4 (marker file)                                                                                 | Many small file ops; not worth sub-agent spawn overhead                                          |
| C2 — Wire theme into test site       | Steps 5a–5g (theme.config.ts, globals.css, CI-inert package.json, tagline, layout.tsx + font detection, 5 standard pages + 6 gates, CSP patch) | Long chain of interdependent edits sharing `$BODY_VAR`/`$HEADING_VAR`/registry export name state |
| C3 — Fidelity review + fix           | Step 5h (write review prompt, invoke `/pipeline.validate-site`, run pixel-diff)                                                                | Already delegated to another skill — no further delegation benefit                               |
| C4 — Reconcile lockfile + type-check | Step 6                                                                                                                                         | Must run with orchestrator's CWD at repo root                                                    |
| C5 — Stage and report                | Steps 7 + 8                                                                                                                                    | Trivial orchestrator work                                                                        |

## Risks

- **analyse-site.ts multi-minute runtime.** If A0 fails halfway, `packages/themes/<name>/` may be partially written and Phase B will report cascading TPV violations. The verification gate after Phase A must confirm the theme package was fully written before launching the validator.
- **Validator false positives cost trust.** `cs-theme-package-validator` is a new agent. If it flags Critical/High on a generated theme that is actually fine, every ingest run will abort. The brief requires Phase C to be blocked — so a flaky validator means the whole pipeline is flaky. Mitigation: log the full findings file and tell the user how to re-run with a specific override if a rule is known to be a false positive. (No override mechanism exists today — note as follow-up.)
- **Data dependency misread.** A1 (asset download) needs the discoveredPages list from A0. If A1 is accidentally spawned in parallel with A0, A1 has nothing to read. The Phase A skeleton must explicitly place A0 as a sequential prelude and only fan out A1/A3 afterwards.
- **Step 5f component inventory cleanup side effects.** Step 5f-1b deletes missing exports from `packages/themes/<name>/components/index.ts`. Phase B validation runs BEFORE this cleanup (because Phase B is the gate between A and C). A newly generated theme package with stale barrel exports will be flagged by TPV-001/TPV-002 in Phase B but the orchestrator would have cleaned them up in Phase C anyway. Decision: let Phase B flag it — the validator is a gate, not a forgiving mentor. The cleanup should happen inside `analyse-site.ts` itself as a follow-up fix, not inside `/pipeline.ingest`.
- **Removed steps trap.** The brief says no existing step may be dropped. Every step in the table at the top of this file must land somewhere in Phase A/B/C, or be explicitly moved to `## Removed in 2026-04-10 decomposition` with justification. I don't expect to remove any — this is a pure restructure.
- **Phase A sub-agent path assumptions.** Sub-agents see a fresh context. They must be told the absolute session directory, the theme name, and the exact file paths to read/write. Brittle if the orchestrator assumes shared state.
- **Dev-server port contention during C3.** Step 5h spawns a background dev server via `/pipeline.validate-site`. If a previous run left a stray Next.js process on port 3000, the validate-site skill's health-check fails and Phase C aborts. This risk is pre-existing — not introduced by the decomposition.
