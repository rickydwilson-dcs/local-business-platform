# Pipeline Ingest

Run the full ingestion pipeline against a URL, then create a temporary test site using the generated theme.

**Usage:** `/pipeline.ingest --url https://example.com [--name my-theme]`

---

## Architecture: three-phase decomposition

As of 2026-04-10 this skill is structured as three phases:

| Phase                            | Owner                                              | Work                                                                                                                                                                                                                                                                                                                         |
| -------------------------------- | -------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **A — Reference harvest**        | Orchestrator + parallel sub-agents                 | Run `analyse-site.ts` (A0, sequential), then fan out reference asset download (A1) and scaffold inventory (A3) as parallel sub-agents in a **single Task-tool message**                                                                                                                                                      |
| **B — Theme package validation** | `cs-theme-package-validator` sub-agent (read-only) | Audit the generated `packages/themes/<name>/` package against all 15 TPV rules. **Gate:** if `Critical + High > 0`, the pipeline aborts before Phase C touches `sites/`.                                                                                                                                                     |
| **C — Test site scaffolding**    | Orchestrator (main Claude)                         | Copy base-template, wire the theme, generate the five standard pages, run fidelity review, reconcile lockfile, stage, report. Remains in the orchestrator because the work is stateful filesystem editing with tightly coupled intra-step state (`$BODY_VAR`/`$HEADING_VAR`/registry export name) that does not parallelise. |

The primary benefit of this decomposition is **context isolation**, not wall-clock parallelism — the critical path is dominated by `analyse-site.ts` (A0) and the `/pipeline.validate-site` dev-server round trip (C3). Delegating the read-heavy harvest and the validator to fresh sub-agent contexts keeps the orchestrator focused on the stateful edit decisions in Phase C.

---

## Step 1: Preflight Checks

```bash
git branch --show-current
```

Must be on `develop`. If not, STOP: "Switch to develop branch first."

Check working tree:

```bash
git status --porcelain
```

If dirty, WARN: "Working tree has uncommitted changes. Proceeding anyway — test site creation does not commit."

Parse `$ARGUMENTS` for:

- `--url` (required) — the website URL to analyse
- `--name` (optional) — override the auto-assigned theme name

If `--url` is missing, STOP with: "Usage: /pipeline.ingest --url https://example.com [--name my-theme]"

---

## Phase A — Reference Harvest

Goal: gather every piece of input data that Phase B and Phase C will need.

Phase A is split into one sequential prelude (A0) and a parallel fan-out (A1 + A3). Sub-agent A2 from the original plan is **subsumed by A0** because `tools/analyse-site.ts` already performs visual token extraction internally; duplicating that work in a sub-agent would waste cost without improving quality.

### A0 — Sequential prelude: run the analysis tool

```bash
npx tsx tools/analyse-site.ts --url $URL [--name $NAME]
```

This takes several minutes. Wait for completion. The tool performs screenshot capture, per-page vision analysis, token reconciliation, component generation, and theme package scaffolding as a single monolith. It cannot be meaningfully parallelised without rewriting `tools/analyse-site.ts` (out of scope for this skill).

After the tool finishes, determine the theme name:

- If `--name` was supplied, use that
- Otherwise, parse from the pipeline summary output (look for "Theme: <name>")
- As a fallback, find the newest folder under `output/ingestion/`

**A0 verification gate — STOP if this fails:**

```bash
test -f packages/themes/<theme-name>/index.ts
test -f output/ingestion/<theme-name>/site-analysis.json
```

If the theme package was not created, STOP: "Pipeline did not create theme package. Check output above for errors."

Also export the session directory path for downstream sub-agents:

```bash
SESSION_DIR="output/ingestion/<theme-name>"
```

### A1 + A3 — Parallel fan-out (single Task-tool message)

**CRITICAL: Launch both sub-agents in ONE Task message.** Not sequentially. The whole point of this step is the parallel fan-out.

#### Sub-agent A1 — Reference asset download

**Model:** sonnet (generic `general-purpose`)

**Prompt:**

> You are sub-agent A1 of `/pipeline.ingest` Phase A. Your job is to capture reference HTML and download reference images for theme `<theme-name>`.
>
> **Inputs:**
>
> - `output/ingestion/<theme-name>/site-analysis.json` — already written by A0. Read `discoveredPages[]` to know which pages to fetch.
>
> **Tasks:**
>
> 1. **Capture reference HTML.** Create `output/ingestion/<theme-name>/html/` and `output/ingestion/<theme-name>/meta/`. For each entry in `discoveredPages[]`, download HTML via:
>
>    ```bash
>    curl -s --max-time 15 -L -A "Mozilla/5.0" "<page.url>" -o "output/ingestion/<theme-name>/html/<pageType>.html"
>    ```
>
>    Map `pageType` to filename:
>    - `pageType === "home"` → `home.html`
>    - `pageType === "about"` → `about.html`
>    - `pageType === "contact"` → `contact.html`
>    - `pageType` containing `services-list` or `blog-list` → `<pageType>.html`
>    - `pageType` containing `service-detail` or `blog-post` → `<pageType>.html` (first depth-2 page only)
>
>    **WARN not STOP** on curl failures — many sites block crawlers. Screenshots (from A0) are the primary reference; HTML is supplementary.
>
>    Write `output/ingestion/<theme-name>/meta/html-manifest.json`:
>
>    ```json
>    {
>      "capturedAt": "<ISO timestamp>",
>      "pages": [{ "pageType": "home", "url": "...", "file": "html/home.html" }]
>    }
>    ```
>
> 2. **Download reference images.** Create `output/ingestion/<theme-name>/images/`. For each HTML file, extract `<img src="...">` values:
>
>    ```bash
>    grep -oh 'src="[^"]*"' output/ingestion/<theme-name>/html/*.html 2>/dev/null \
>      | sed 's/src="//;s/"//' \
>      | grep -v '^data:' \
>      | grep -v '^$' \
>      | sort -u > /tmp/<theme-name>-img-urls.txt
>    ```
>
>    For each URL in that list (max 20):
>    - Skip if URL length > 2000 chars
>    - Resolve relative URLs to absolute using the page base URL
>    - **Sanitise filename with python3, not `tr`** (`tr` produces trailing `-` on most URLs):
>      ```bash
>      python3 -c "
>      import sys, re
>      url = sys.argv[1]
>      name = url.split('/')[-1].split('?')[0].split('#')[0]
>      name = re.sub(r'[^a-zA-Z0-9._-]', '-', name)
>      name = name.strip('-') or 'image'
>      print(name)
>      " \"$url\"
>      ```
>    - Download to the ingestion directory only (the test site copy happens in Phase C):
>      ```bash
>      curl -s --max-time 10 -L -A "Mozilla/5.0" "$url" -o "output/ingestion/<theme-name>/images/<sanitised-filename>"
>      ```
>    - **WARN not STOP** on curl failures — CDNs block direct downloads frequently.
>
>    Write `output/ingestion/<theme-name>/meta/image-manifest.json`:
>
>    ```json
>    {
>      "capturedAt": "<ISO timestamp>",
>      "images": [
>        {
>          "originalUrl": "https://example.com/hero.jpg",
>          "localPath": "output/ingestion/<theme-name>/images/hero.jpg",
>          "publicPath": "/images/hero.jpg"
>        }
>      ]
>    }
>    ```
>
> **Do NOT** touch `sites/test-<theme-name>/` — that directory does not exist yet and is owned by Phase C.
>
> **Return:** a one-line summary — `"A1: N HTML pages captured, M/K images downloaded."`

#### Sub-agent A3 — Scaffold inventory

**Model:** haiku (mechanical file reads)

**Prompt:**

> You are sub-agent A3 of `/pipeline.ingest` Phase A. Your job is to pre-compute the inventory that the orchestrator will consume during Phase C scaffolding, so the orchestrator does not have to parse these files in its own context.
>
> **Inputs:**
>
> - `packages/themes/<theme-name>/index.ts` — already written by A0
> - `packages/themes/<theme-name>/components/index.ts` (if present)
> - `sites/base-template/` — read-only reference
>
> **Tasks:**
>
> 1. Parse `packages/themes/<theme-name>/index.ts` and extract the exported Registry and DefaultConfig variable names (e.g. `lyraRegistry`, `lyraDefaultConfig`).
> 2. Compute the camelCase theme name (`dark-forest` → `darkForest`).
> 3. If `packages/themes/<theme-name>/components/index.ts` exists, list every `export * from './<name>'` line and record the expected file paths.
> 4. List the top-level entries of `sites/base-template/` (for the orchestrator's cp plan awareness).
>
> **Output file:** `output/ingestion/<theme-name>/meta/scaffold-inventory.json`
>
> ```json
> {
>   "themeName": "<theme-name>",
>   "camelCaseThemeName": "<camelCaseThemeName>",
>   "registryExport": "<themeNameRegistry>",
>   "defaultConfigExport": "<themeNameDefaultConfig>",
>   "themeComponents": [{ "exportPath": "./HeroV1", "expectedFile": "HeroV1.tsx", "exists": true }],
>   "baseTemplateEntries": ["app", "components", "content", "public", "lib", "..."]
> }
> ```
>
> **Do NOT** write, edit, or patch any files outside `output/ingestion/<theme-name>/meta/`.
>
> **Return:** a one-line summary — `"A3: registry=<registryExport>, components=<N>/<M> present, N missing barrel entries."`

### Phase A verification gate — STOP if this fails

```bash
SESSION_DIR="output/ingestion/<theme-name>"
test -f "$SESSION_DIR/site-analysis.json"                  # A0
test -d "$SESSION_DIR/html" || test -f "$SESSION_DIR/meta/html-manifest.json"  # A1 (HTML)
test -f "$SESSION_DIR/meta/image-manifest.json"            # A1 (images)
test -f "$SESSION_DIR/meta/scaffold-inventory.json"        # A3
test -f "packages/themes/<theme-name>/index.ts"            # A0 side effect
```

If any gate fails, STOP and print which sub-agent failed to produce its artefact.

---

## Phase B — Theme Package Validation (delegated gate)

Goal: audit the generated theme package against the TPV rule set before any `sites/` modification. A failing audit aborts the pipeline.

### B1 — Delegate to `cs-theme-package-validator`

```
Task tool parameters:
  description: "Validate generated theme package"
  subagent_type: "cs-theme-package-validator"
```

**Prompt for the agent:**

> You are validating a newly generated theme package as part of `/pipeline.ingest` Phase B.
>
> **Scope:** Single-theme audit. The theme package is at `packages/themes/<theme-name>/`.
>
> **Rules to run:** All 15 rules (TPV-001 through TPV-015). This is a fresh package so all rules apply.
>
> **Session directory:** `output/ingestion/<theme-name>/`
>
> **Output file:** `output/ingestion/<theme-name>/meta/findings-theme-package.md`
>
> Follow your agent definition's review procedure exactly. Do NOT modify any files — this is a read-only audit.
>
> **Return:** the Statistics line from your findings file (`Statistics: Critical=X High=Y Medium=Z Low=W`) so the orchestrator can decide whether to proceed.

### B2 — Gate on validator output

After the validator completes, read the Statistics line from `output/ingestion/<theme-name>/meta/findings-theme-package.md`.

**Gate rule:** if `Critical + High > 0`, STOP the pipeline:

- Print the full findings file to the console
- Tell the user: "Theme package validation failed — Critical/High TPV findings block Phase C. See `output/ingestion/<theme-name>/meta/findings-theme-package.md`. Fix the findings and re-run `/pipeline.ingest --url <same-url> --name <theme-name>`."
- Do NOT proceed to Phase C. Do NOT touch `sites/`.
- Do NOT delete `packages/themes/<theme-name>/` — leave it in place so the user can patch it.

If `Critical + High == 0` but Medium/Low findings exist, print them as warnings and continue to Phase C.

### Phase B verification gate — STOP if this fails

```bash
test -f "output/ingestion/<theme-name>/meta/findings-theme-package.md"
grep -q "Critical" "output/ingestion/<theme-name>/meta/findings-theme-package.md"
test -d "packages/themes/<theme-name>"
test -f "packages/themes/<theme-name>/index.ts"
```

**Note on scope:** This skill does not include a validator-override mechanism. If a TPV rule produces a confirmed false positive on a generated theme, the rule should be fixed in `cs-theme-package-validator` or the generator should emit theme packages that comply. Do not add per-run suppression here.

---

## Phase C — Test Site Scaffolding (orchestrator)

Goal: create a throwaway test site that consumes the validated theme package. Phase C stays in the orchestrator because the work is stateful filesystem editing with tightly coupled intra-step state — sub-agent delegation would lose the shared `$BODY_VAR`/`$HEADING_VAR`/registry-export-name context that Steps C2a–C2g all consume.

Read `output/ingestion/<theme-name>/meta/scaffold-inventory.json` (written by A3) to get `registryExport`, `defaultConfigExport`, `camelCaseThemeName`, and `themeComponents[]`. Hold these in working memory for the rest of Phase C.

### C1 — Create the test site directory

Copy base-template to create the test site. **Important:** `sites/test-<theme-name>/` must NOT exist yet when `cp -r` runs — if a previous step created anything inside it first, `cp -r` nests `base-template/` inside the existing directory instead of replacing it.

```bash
cp -r sites/base-template sites/test-<theme-name>
rm -rf sites/test-<theme-name>/node_modules sites/test-<theme-name>/.next sites/test-<theme-name>/.turbo
```

Copy the downloaded reference images into the test site's public directory:

```bash
mkdir -p sites/test-<theme-name>/public/images
cp output/ingestion/<theme-name>/images/* sites/test-<theme-name>/public/images/ 2>/dev/null || true
```

### C1b — Write marker file

Create `sites/test-<theme-name>/.pipeline-test-site.json` with:

```json
{
  "createdAt": "<current ISO timestamp>",
  "themeName": "<theme-name>",
  "sourceUrl": "<url>",
  "pipelineOutput": "output/ingestion/<theme-name>/"
}
```

### C2 — Wire theme into test site

This block is the `5a`–`5g` chain from the pre-decomposition skill. It stays as one linear sequence inside Phase C because the substitutions share state (`$BODY_VAR`/`$HEADING_VAR` are computed in C2e and consumed by C2b).

**C2a. Rewrite `sites/test-<theme-name>/theme.config.ts`:**

Use the `registryExport` / `defaultConfigExport` / `camelCaseThemeName` values from `scaffold-inventory.json`. Write:

```typescript
import type { DeepPartialThemeConfig } from '@platform/theme-system';
import { <camelCaseThemeName>Registry, <camelCaseThemeName>DefaultConfig } from '@platform/themes/<theme-name>';

/**
 * Test site theme configuration
 * Generated by /pipeline.ingest
 */
export const themeConfig: DeepPartialThemeConfig = {
  componentRegistry: <camelCaseThemeName>Registry,
  ...<camelCaseThemeName>DefaultConfig,
  // Always override surface tokens directly in theme.config.ts.
  // The theme-system Tailwind plugin is pre-compiled to dist/ — values imported from
  // theme packages are not guaranteed to be picked up at the consuming site's build time.
  // Overrides in theme.config.ts are always applied.
  colors: {
    ...<camelCaseThemeName>DefaultConfig.colors,
    surface: {
      ...<camelCaseThemeName>DefaultConfig.colors?.surface,
      inverse: '<surface-inverse-hex>',
    },
  },
};
```

Where `<surface-inverse-hex>` is `themeTokenRecommendations.colors.surface.inverse` from `site-analysis.json`. Fall back to `'#111111'` if absent or null.

**Why this matters:** If `surface.inverse` is not overridden here and the theme's hero/CTA uses `bg-surface-inverse`, it will render as `#111827` (the theme-system default near-black) instead of the intended brand colour.

**C2b. Globals CSS** — see C2e for font determination. Globals CSS is written **after** C2e so `$BODY_VAR` and `$HEADING_VAR` are known.

Write `sites/test-<theme-name>/app/globals.css`:

```css
@import "../../../packages/themes/<theme-name>/globals.css";

@tailwind base;
@tailwind components;
@tailwind utilities;

/**
 * Pipeline Test Site — <theme-name> theme
 * Generated by /pipeline.ingest
 */

@layer base {
  html {
    scroll-behavior: smooth;
  }

  body {
    font-family: var(<$BODY_VAR>), sans-serif;
    @apply bg-surface-background text-surface-foreground;
    font-feature-settings:
      "rlig" 1,
      "calt" 1;
  }

  h1,
  h2,
  h3,
  h4 {
    font-family: var(<$HEADING_VAR>), serif;
  }

  .material-symbols-outlined {
    font-family: "Material Symbols Outlined";
    font-weight: normal;
    font-style: normal;
    font-size: 24px;
    line-height: 1;
    letter-spacing: normal;
    text-transform: none;
    display: inline-block;
    white-space: nowrap;
    direction: ltr;
    font-feature-settings: "liga";
    font-variation-settings:
      "FILL" 0,
      "wght" 400,
      "GRAD" 0,
      "opsz" 24;
    vertical-align: middle;
  }
}
```

**C2c. CI-inert `package.json`:**

1. Read `sites/base-template/package.json`
2. Use `generateTestSitePackageJson('test-<theme-name>', basePackageJson)` from `tools/lib/test-site-package.ts`
3. Write the result to `sites/test-<theme-name>/package.json`

The utility strips all scripts except `dev`, `start`, and `clean`, and adds `"pipelineTestSite": true`.

Verify:

```bash
node -e "
  const p = require('./sites/test-<theme-name>/package.json');
  const bad = ['build','type-check','lint','test'].filter(s => p.scripts?.[s]);
  if (bad.length) { console.error('FAIL: test site has CI scripts:', bad); process.exit(1); }
  if (!p.pipelineTestSite) { console.error('FAIL: missing pipelineTestSite marker'); process.exit(1); }
  console.log('PASS: test site is CI-inert');
"
```

**C2d. Tagline override:** Update `sites/test-<theme-name>/site.config.ts` — find the `tagline` value and change it to `'Pipeline Test Site — <theme-name> theme'`.

**C2e. Layout.tsx and font determination:**

Read `output/ingestion/<theme-name>/site-analysis.json`. Extract:

- `themeTokenRecommendations.typography.fontFamilySans[0]` → `$BODY_FONT_NAME`
- `themeTokenRecommendations.typography.fontFamilyHeading[0]` → `$HEADING_FONT_NAME`

Fallback (if field missing or null): `$BODY_FONT_NAME = "Work Sans"`, `$HEADING_FONT_NAME = "Newsreader"`

**next/font/google export name:** Replace spaces with underscores: `"Work Sans"` → `Work_Sans`, `"DM Sans"` → `DM_Sans`, `"Plus Jakarta Sans"` → `Plus_Jakarta_Sans`, `"Source Serif 4"` → `Source_Serif_4`.

**Confirmed available in next/font/google:** `Inter`, `Lato`, `Work_Sans`, `Newsreader`, `Outfit`, `Montserrat`, `DM_Sans`, `Plus_Jakarta_Sans`, `Space_Grotesk`, `Manrope`, `Rubik`, `Geist`, `Sora`, `EB_Garamond`, `Literata`, `Source_Serif_4`, `Domine`, `Libre_Caslon_Text`, `Noto_Serif`, `Raleway`, `Open_Sans`, `Poppins`, `Nunito`, `Roboto`, `Mulish`, `Barlow`.

Any font NOT in the confirmed list → fall back to `Work_Sans` (body) or `Newsreader` (heading).

**CSS variable name:** Lowercase + underscores→hyphens: `Work_Sans` → `--font-work-sans`, `Source_Serif_4` → `--font-source-serif-4`. These become `$BODY_VAR` and `$HEADING_VAR`, also used in C2b globals.css.

**Weights:**

- Body: `['300', '400', '500', '600', '700']`
- Heading (serif — Newsreader, EB_Garamond, Literata, Source_Serif_4, Domine, Libre_Caslon_Text, Noto_Serif): `['200', '300', '400', '500', '600', '700', '800']` + `style: ['normal', 'italic']`
- Heading (sans-serif): `['400', '500', '600', '700', '800']`

**Write `sites/test-<theme-name>/app/layout.tsx`:**

If body and heading are the same font, use a single font instance with `variable: '--font-primary'` and reference `var(--font-primary)` in globals.css. Otherwise:

```typescript
import type { Metadata, Viewport } from 'next';
import { <BodyExportName>, <HeadingExportName> } from 'next/font/google';
import './globals.css';
import { siteConfig } from '@/site.config';
import { ThemeProvider } from '@platform/core-components';
import { <camelCaseThemeName>Registry } from '@platform/themes/<theme-name>';

const bodyFont = <BodyExportName>({
  subsets: ['latin'],
  variable: '<$BODY_VAR>',
  display: 'swap',
  weight: ['300', '400', '500', '600', '700'],
});

const headingFont = <HeadingExportName>({
  subsets: ['latin'],
  variable: '<$HEADING_VAR>',
  display: 'swap',
  weight: ['200', '300', '400', '500', '600', '700', '800'],
  style: ['normal', 'italic'],
});

export const metadata: Metadata = {
  title: { default: siteConfig.name, template: `%s | ${siteConfig.name}` },
  description: siteConfig.tagline,
};

export const viewport: Viewport = { width: 'device-width', initialScale: 1, maximumScale: 5 };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-GB" className={`${bodyFont.variable} ${headingFont.variable}`}>
      <head>
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0&display=block"
        />
      </head>
      <body className="min-h-screen flex flex-col">
        <ThemeProvider theme="<theme-name>" registry={<camelCaseThemeName>Registry}>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
```

**Why bare shell:** Generated pages include Nav and Footer inline — no double header/footer. Do NOT include `SiteHeader`, `Footer`, `PageShell`, `ReviewPanel`, analytics, or consent components.

**After writing layout.tsx:** Go back and write `globals.css` (C2b) using the `$BODY_VAR` and `$HEADING_VAR` names computed above.

**C2f. Generate five standard pages:**

This step always produces exactly five routes regardless of what the analysis pipeline generated. The `output/ingestion/<theme-name>/example-pages/` directory is **not used** — the five pages are generated fresh from `site-analysis.json`.

**C2f-0: Load site-analysis.json.** Extract and hold: `discoveredPages[]`, `pageBlueprints[]`, `sectionBlueprints[]`, `componentMatches[]`, `registryRecommendation.themeName`, `reference.url`.

**C2f-1: Build component inventory.**

```bash
ls packages/themes/<theme-name>/components/ 2>/dev/null || echo "no-components"
```

Build two sets:

- **`themeNavComponents`** — component export names where `sectionBlueprints[].category === "Navigation"` OR filename contains `nav`, `navigation`, `header`, `topbar`, `top-nav`.
- **`themeFooterComponents`** — component export names where category is `"Footer"` OR filename contains `footer`.

For all other components: build a map `blueprintId → componentExportName` from `sectionBlueprints[].componentFileName` cross-referenced with files actually present in `packages/themes/<theme-name>/components/`.

**Safe core-components fallback** (barrel import, no async data):

- Hero: `HeroV1`, `HeroV2`, `HeroV3`, `HeroSection`, `HeroWithImage`, `PageHero`
- Sections: `CTASection`, `ServiceCards`, `FAQSection`, `Breadcrumbs`
- Forms: `ContactForm` (client component — always safe)

**Never use from core-components:**

- `Footer` — uses `getContentItems()` + `fs/promises`, will crash without MDX content
- Any component calling `getContentItems()`, `getLocations()`, `getServices()`

**Component resolution hierarchy** (per section):

1. Theme component — if `packages/themes/<theme-name>/components/<componentFileName>` exists → import from `@platform/themes/<theme-name>/components`
2. Core component match — if `componentMatches` has "exact" or "close" confidence → import from `@platform/core-components` (barrel only, no subpath)
3. Inline JSX — write the section directly in the page file using Tailwind theme tokens

**C2f-1b: Verify and clean theme barrel index.**

The pipeline sometimes marks components as "reused from core" but still appends their names to the theme's `index.ts` barrel. This causes import errors at build time. Verify every named export in `packages/themes/<theme-name>/components/index.ts` has a corresponding file:

```bash
grep -o "export \* from '\./[^']*'" packages/themes/<theme-name>/components/index.ts \
  | sed "s|export \* from '\./||;s|'||" \
  | while read name; do
    file="packages/themes/<theme-name>/components/${name}.tsx"
    [ -f "$file" ] || echo "MISSING: $name"
  done
```

For each MISSING export: remove that `export * from './...'` line from `packages/themes/<theme-name>/components/index.ts`.

**Known pipeline defect — do not skip this step.** Phase B's TPV auditor will flag the stale barrel exports. If those findings were Medium/Low (non-blocking) in Phase B, the cleanup here is still required.

**C2f-1c: Fix animation import paths in theme components.**

AI-generated theme components frequently use the wrong import path for animation primitives. The pipeline writes `@platform/core-components/src/components/animation` but the correct path is `@platform/core-components/components/animation`.

```bash
grep -rl '@platform/core-components/src/components/animation' \
  packages/themes/<theme-name>/components/ \
  | xargs -I{} sed -i '' \
    's|@platform/core-components/src/components/animation|@platform/core-components/components/animation|g' {}
```

Verify:

```bash
grep -r '@platform/core-components/src/components/animation' \
  packages/themes/<theme-name>/components/ 2>/dev/null \
  && echo "WARN: Some import paths not fixed" \
  || echo "PASS: Animation import paths clean"
```

**C2f-2: Detect category slug.** First definitive match wins:

1. Extract all depth-1 paths from `discoveredPages[]`: filter `path.split('/').length === 2` and `path !== '/'`, take `path.split('/')[1]`, dedupe.
2. Remove reserved roots: `about`, `contact`, `privacy`, `privacy-policy`, `cookie-policy`, `cookies`, `terms`, `legal`, `search`, `404`, `500`.
3. Score remaining candidates:

   | Signal                                                        | Points |
   | ------------------------------------------------------------- | ------ |
   | Has depth-2 page under `/<slug>/something` in discoveredPages | +3     |
   | Has `pageBlueprints` entry for `/<slug>/` with ≥1 section     | +2     |
   | Has pageType containing `list`                                | +2     |
   | Appears in discoveredPages with `source: "nav"`               | +1     |

4. Pick highest-scoring candidate. On tie, prefer the one with the lowest index in `discoveredPages`.
5. If no candidates remain: use `"services"` as fallback.
6. Emit: `Detected category slug: <slug> (source: <detection-reason>)`

**Nav/Footer resolution:**

- Nav: if `themeNavComponents` has entries → use the first (or the one whose blueprint appears first in home page sections). Otherwise → use inline nav block.
- Footer: if `themeFooterComponents` has entries → use the first (or the one whose blueprint appears last in home page sections). Otherwise → use inline footer block. **Never import Footer from core-components.**

**C2f-3: Clean test site pages.**

```bash
find sites/test-<theme-name>/app -name "page.tsx" -delete
find sites/test-<theme-name>/app -type d -empty -delete
mkdir -p sites/test-<theme-name>/app/about
mkdir -p sites/test-<theme-name>/app/contact
mkdir -p "sites/test-<theme-name>/app/<detected-slug>/[slug]"
```

**C2f-4 through C2f-8: Generate five pages (one at a time).**

For each page:

1. Find matching blueprint in `pageBlueprints` (match by `path` or `pageType`)
2. If found: render sections in `sections[]` order, resolving each via the hierarchy in C2f-1
3. If NOT found: use the fallback template

**Structural rules for ALL generated pages:**

- `export default function Page()` — not async, no server data loading
- All Tailwind classes use theme tokens: `bg-brand-primary`, `text-on-brand-primary`, `bg-surface-background`, `text-surface-foreground`, `bg-surface-muted`, `text-surface-muted-foreground`, `border-surface-subtle`, `bg-surface-inverse`, `text-brand-primary`
- **No hardcoded hex colors**
- **No `generateStaticParams`, `getContentItems`, `getServices`, `getLocations`, `fs.readdir`**
- Add comment at top of sections: `{/* Source: <reference.url> — <pageType> blueprint */}` or `{/* Source: fallback template */}`
- **Opacity modifier on CSS custom properties does not work:** Tailwind's `/opacity` modifier renders transparent when the colour comes from `var()`. For semi-transparent theme colours, use the hex from `themeTokenRecommendations` as an arbitrary value: `bg-[#hexvalue]/80`. Applies to sticky navs, hero overlays, decorative backgrounds.
- **Preserve CSS animation and interaction classes:** `duration-300/500/700`, `hover:scale-105`, `hover:-translate-y-1`, `grayscale`, `grayscale-[20%]`, opacity transitions. If the blueprint indicates an interactive pattern, the TSX must implement it.

**C2f-4: `app/page.tsx` (Home)** — blueprint lookup: `pageBlueprints` where `path === "/"` or `pageType === "home"`. Fallback: hero (brand-primary), service cards (3 tiles), stats strip (4 numbers on surface-inverse), CTA section. Wrap with `<Nav />` and `<Footer />`.

**C2f-5: `app/about/page.tsx`** — blueprint lookup: `path === "/about"` or `pageType === "about"`. Fallback: page-hero, Our Story narrative block, 3-value grid, CTA. Wrap with `<Nav />` / `<Footer />`.

**C2f-6: `app/contact/page.tsx`** — blueprint lookup: `path === "/contact"` or `pageType === "contact"`. Fallback: `import { ContactForm } from '@platform/core-components'`, page-hero, 2-column layout with form + get-in-touch card. Wrap with `<Nav />` / `<Footer />`. **Never import Footer from core-components.**

**C2f-7: `app/<detected-slug>/page.tsx`** — blueprint lookup: `path === "/<detected-slug>"` or `path === "/<detected-slug>/"`. Fallback: three stub items in a const array, page-hero, 3-column card grid linking to `/<slug>/<item.slug>`, CTA. Wrap with `<Nav />` / `<Footer />`.

**C2f-8: `app/<detected-slug>/[slug]/page.tsx`** — blueprint lookup: `routePattern` containing `[slug]` under `/<detected-slug>`. **Do NOT add `generateStaticParams`** — dev-mode only test site. Fallback: derive title from `params.slug`, hero with breadcrumb, overview section with "What's Included" checklist, "Related" 2-card grid, CTA. Wrap with `<Nav />` / `<Footer />`.

**Inline Nav fallback** (when no theme nav component exists): `<header>` with sticky top, logo text, 3 nav links, primary-coloured Contact CTA.

**Inline Footer fallback** (when no theme footer component exists): `<footer>` on `bg-surface-inverse`, 3-column grid (brand, pages, contact), bottom border with copyright.

_(Full fallback template bodies — identical to the pre-decomposition skill — remain authoritative. The summaries above describe their structure; the orchestrator should render the same Tailwind-token JSX it always has.)_

**C2f-9: Validation gates.**

Gate 1 — Route count (STOP):

```bash
ROUTES=$(find sites/test-<theme-name>/app -name "page.tsx" | wc -l | tr -d ' ')
[ "$ROUTES" -ne 5 ] && { echo "FAIL: Expected 5 page.tsx files, found $ROUTES"; exit 1; }
echo "PASS: Route count = 5"
```

Gate 2 — All required routes present (STOP):

```bash
for route in \
  "sites/test-<theme-name>/app/page.tsx" \
  "sites/test-<theme-name>/app/about/page.tsx" \
  "sites/test-<theme-name>/app/contact/page.tsx" \
  "sites/test-<theme-name>/app/<detected-slug>/page.tsx" \
  "sites/test-<theme-name>/app/<detected-slug>/[slug]/page.tsx"; do
  test -f "$route" || { echo "FAIL: Missing $route"; exit 1; }
done
echo "PASS: All required routes present"
```

Gate 3 — No hardcoded hex colors (WARN):

```bash
grep -rn '#[0-9a-fA-F]\{3,8\}' \
  sites/test-<theme-name>/app/page.tsx \
  sites/test-<theme-name>/app/about/page.tsx \
  sites/test-<theme-name>/app/contact/page.tsx \
  sites/test-<theme-name>/app/<detected-slug>/page.tsx \
  "sites/test-<theme-name>/app/<detected-slug>/[slug]/page.tsx" 2>/dev/null \
  && echo "WARN: Hardcoded hex colors found" \
  || echo "PASS: No hardcoded hex colors"
```

Gate 4 — No forbidden APIs (WARN):

```bash
grep -rn 'generateStaticParams\|getContentItems\|getServices\|getLocations\|fs\.readdir\|TODO\|PLACEHOLDER' \
  sites/test-<theme-name>/app/page.tsx \
  sites/test-<theme-name>/app/about/page.tsx \
  sites/test-<theme-name>/app/contact/page.tsx \
  sites/test-<theme-name>/app/<detected-slug>/page.tsx \
  "sites/test-<theme-name>/app/<detected-slug>/[slug]/page.tsx" 2>/dev/null \
  && echo "WARN: Forbidden API usage detected" \
  || echo "PASS: No forbidden APIs"
```

Gate 5 — Nav + footer present (WARN): iterate every page and check `<nav|<header|Navigation|TopNav|NavBar|SiteHeader` and `<footer|Footer|SiteFooter`.

Gate 6 — Section count (WARN): each page should have ≥3 `<section>` elements; detail page ≥2.

**C2f-10: Generation summary — print:**

```
=== C2f: Standard Pages Generated ===
Source URL: <reference.url>
Category slug: <detected-slug> (source: <detection-reason>)
Nav component: <ThemeNavName | inline fallback>
Footer component: <ThemeFooterName | inline fallback>
Theme components used: <N> sections
Inline JSX sections: <N> sections

Routes created:
  /                          app/page.tsx
  /about                     app/about/page.tsx
  /contact                   app/contact/page.tsx
  /<slug>/                   app/<slug>/page.tsx
  /<slug>/[slug]/            app/<slug>/[slug]/page.tsx

Validation:
  Route count:    PASS (5/5)
  Hex colors:     PASS | WARN (N occurrences)
  Forbidden APIs: PASS | WARN (N occurrences)
  Nav/Footer:     PASS | WARN (details)
  Section counts: PASS | WARN (details)
=====================================
```

**C2g. CSP patch** — Add Google Fonts to `sites/test-<theme-name>/next.config.ts`.

Find the `Content-Security-Policy` value and change:

```
style-src 'self' 'unsafe-inline'; font-src 'self';
```

To:

```
style-src 'self' 'unsafe-inline' fonts.googleapis.com; font-src 'self' fonts.gstatic.com;
```

**Verification gate — STOP if fails:**

```bash
grep "fonts.googleapis.com" sites/test-<theme-name>/next.config.ts \
  && echo "PASS: CSP patched" \
  || { echo "FAIL: CSP not patched — fonts will be blocked"; exit 1; }
```

### C3 — Fidelity review + fix

Write the review criteria to `output/ingestion/<theme-name>/meta/validate-review-prompt.txt`:

```
Review the 5 test site pages for brand fidelity against the reference site.

**Reference material:**
- Dev server screenshots (actual rendered output): `output/ingestion/<theme-name>/meta/dev-screenshots/` — `home.png`, `about.png`, `contact.png`, `category-list.png`, `category-detail.png`. Read these PNG files directly.
- Reference site screenshots: `output/ingestion/<theme-name>/screenshots/` — `home.png`, `about.png`, `blog-list.png`, etc.
- HTML source: `output/ingestion/<theme-name>/html/`
- Section blueprints: `output/ingestion/<theme-name>/site-analysis.json` → `pageBlueprints[]`, `sectionBlueprints[]`
- Extracted tokens: `site-analysis.json` → `themeTokenRecommendations`
- Downloaded images: `output/ingestion/<theme-name>/meta/image-manifest.json`

**Primary comparison method**: Read both dev and reference screenshots per page. Compare layout, colours, typography scale, spacing, image presence. Use WebFetch on the dev server URL for structural/code checks only.

**What to check:**
1. Font loading — body text in the extracted font?
2. Brand colours — match `themeTokenRecommendations.brand`?
3. Section completeness — every `pageBlueprints[page].sections[]` present?
4. Nav and footer — present on every page?
5. Layout pattern — header dark/light matches `visualLanguage.heroPattern.headerDark`?
6. CSS completeness — hover effects, transitions, interactive states present?
7. Image rendering — images present, or still colour-block placeholders? Check `image-manifest.json`.
8. Logo rendering — `<img>` element, not text. If `logo` prop renders as string, flag as `visual`.
9. Hamburger menu — not `md:hidden` on desktop; has `onClick` handler and dropdown.
10. CTA colour variety — distinct backgrounds per CTA section if reference shows variety.
11. Invisible text — `text-surface-background` on dark `bg-surface-inverse` is a `blocker`.

**What NOT to check:** pixel-matching content, identical copy, form interactivity (`readOnly` is intentional), high pixel-diff scores.

**Fix guidance for common finding types:**
- Image placeholder: pass `publicPath` from `image-manifest.json` as component props.
- Logo-as-text: replace `{props.logo}` with `<img src={props.logo} alt="Site logo" className="h-8 w-auto" />`.
- Hamburger: `"use client"`, `useState`, `onClick={() => setOpen(!open)}`, conditional dropdown. Remove `md:hidden`.
- CTA colour: assign `bg-brand-secondary`/`bg-brand-accent`/`bg-[#hex]`. Never `text-on-brand-primary` on non-brand-primary backgrounds.
- Invisible text: `text-surface-background` → `text-surface-foreground` on dark sections.
```

Then invoke the shared validation skill:

```
/pipeline.validate-site \
  --site-dir sites/test-<theme-name> \
  --pages "/ /about /contact /<detected-slug>/ /<detected-slug>/test-item" \
  --review-prompt-file output/ingestion/<theme-name>/meta/validate-review-prompt.txt \
  --findings-file output/ingestion/<theme-name>/meta/tsx-review-findings.json \
  --fix-log-file output/ingestion/<theme-name>/meta/tsx-fix-log.json \
  --screenshot-dir output/ingestion/<theme-name>/meta/dev-screenshots
```

After the pixel-diff baseline (run inside the validate-site skill's screenshot step), also run:

```bash
npx tsx -e "
import fs from 'fs';
import path from 'path';
import { compareImages } from './tools/lib/pipeline-visual-compare.ts';
const devDir = 'output/ingestion/<theme-name>/meta/dev-screenshots';
const refDir = 'output/ingestion/<theme-name>/screenshots';
const pairs = [
  ['home.png','home.png'], ['about.png','about.png'],
  ['category-list.png','blog-list.png'], ['category-list.png','services-list.png'],
];
for (const [devFile, refFile] of pairs) {
  const devPath = path.join(devDir, devFile);
  const refPath = path.join(refDir, refFile);
  if (!fs.existsSync(devPath) || !fs.existsSync(refPath)) continue;
  const buf = fs.readFileSync(devPath);
  const result = await compareImages(refPath, buf);
  console.log(devFile + ': ' + (result.diffPercent * 100).toFixed(1) + '% pixel diff vs reference (informational)');
}
" 2>/dev/null || echo "WARN: Visual diff skipped (pipeline-visual-compare unavailable)"
```

Print diff percentages as informational only — high values (30–70%) are expected since content differs.

### C4 — Reconcile lockfile and type-check

1. Run `pnpm install --lockfile-only` at the monorepo root. This updates `pnpm-lock.yaml` to include the new test site workspace without modifying `node_modules`.
2. If `--lockfile-only` fails, fall back to `pnpm install`.
3. Verify: `pnpm install --frozen-lockfile` must succeed.

Then run type-check inside the test site:

```bash
cd sites/test-<theme-name> && npx tsc --noEmit
```

If type-check fails, report the errors but continue — the user needs to see what went wrong with the generated theme.

### C5 — Stage with test site

Stage `pnpm-lock.yaml` alongside the test site directory. The lockfile MUST be in the same commit as the test site to prevent `ERR_PNPM_OUTDATED_LOCKFILE` on any branch.

```bash
git add sites/test-<theme-name>/ pnpm-lock.yaml
```

### Phase C verification gate — STOP if this fails

```bash
test -d "sites/test-<theme-name>"
test -f "sites/test-<theme-name>/.pipeline-test-site.json"
test -f "sites/test-<theme-name>/theme.config.ts"
test -f "sites/test-<theme-name>/app/layout.tsx"
find "sites/test-<theme-name>/app" -name "page.tsx" | wc -l | grep -q "^ *5$"
```

---

## Step 8: Final Report

```
=== /pipeline.ingest complete ===

Phase A (harvest):         <N> HTML pages, <M>/<K> images, scaffold inventory ok
Phase B (validator):       Critical=0 High=0 Medium=<X> Low=<Y>  (findings: meta/findings-theme-package.md)
Phase C (scaffolding):     5 routes generated, type-check <PASS|WARN>

✓ Theme name:     <theme-name>
✓ Source URL:     <url>
✓ Test site:      sites/test-<theme-name>/

Reference assets: output/ingestion/<theme-name>/
  screenshots/    — <N> reference site page captures (A0)
  html/           — <N> reference HTML pages (A1)
  images/         — <M>/<K> downloaded images (A1)
  meta/           — html-manifest.json, image-manifest.json, scaffold-inventory.json,
                    findings-theme-package.md, tsx-review-findings.json, tsx-fix-log.json

Fidelity review:  <N> findings — <blockers> blockers, <visual> visual, <minor> minor
Fix pass:         <fixed> fixed, <skipped> skipped
<If any blockers unresolved: "⚠ Unresolved blockers: <list>">

Dev server:   cd sites/test-<theme-name> && npm run dev

Reference comparison:
  http://localhost:3000               ↔  screenshots/home.png
  http://localhost:3000/about         ↔  screenshots/about.png
  http://localhost:3000/contact       ↔  screenshots/contact.png
  http://localhost:3000/<slug>/       ↔  screenshots/services-list.png | blog-list.png
  http://localhost:3000/<slug>/<item> ↔  screenshots/service-detail.png | blog-post.png

Cleanup:      /pipeline.kill-site test-<theme-name>
              /pipeline.kill-theme <theme-name>

Next steps:
  1. Start dev server, compare each page against the reference screenshots above
  2. Review meta/findings-theme-package.md — TPV validation report
  3. Review meta/tsx-review-findings.json — what the fidelity pass found
  4. Review meta/tsx-fix-log.json — what was auto-fixed vs skipped
  5. Iterate on theme.config.ts if brand colours need tuning
  6. When satisfied: /deploy.changes
```

---

## Removed in the 2026-04-10 decomposition

**None.** Every numbered step from the pre-decomposition skill maps to exactly one location in the Phase A / B / C structure:

| Old step                         | New location                         |
| -------------------------------- | ------------------------------------ |
| Step 1 Preflight                 | Step 1 Preflight (unchanged)         |
| Step 2 `analyse-site.ts`         | Phase A0                             |
| Step 2b HTML capture             | Phase A1 (first task)                |
| Step 2c Image download           | Phase A1 (second task)               |
| _(new)_ TPV audit                | Phase B (new gate)                   |
| Step 3 cp base-template + images | Phase C1                             |
| Step 4 Marker file               | Phase C1b                            |
| Step 5a theme.config.ts          | Phase C2a                            |
| Step 5b globals.css              | Phase C2b                            |
| Step 5c CI-inert package.json    | Phase C2c                            |
| Step 5d Tagline                  | Phase C2d                            |
| Step 5e layout.tsx + fonts       | Phase C2e                            |
| Step 5f Five pages + gates       | Phase C2f (sub-steps C2f-0 … C2f-10) |
| Step 5g CSP patch                | Phase C2g                            |
| Step 5h Fidelity review          | Phase C3                             |
| Step 6 Lockfile + type-check     | Phase C4                             |
| Step 7 Stage                     | Phase C5                             |
| Step 8 Report                    | Step 8 Final Report                  |

The scaffold-inventory JSON produced by the new sub-agent A3 is additive — it does not replace any existing step, it front-loads reads the orchestrator used to perform inline in Phase C.

---

## Rules

- This command does NOT commit or push anything
- Never modify `sites/base-template/` — only the copy
- If any phase fails, STOP and report — do not attempt to create a partial test site
- **Phase A1 and A3 MUST be launched in a single Task-tool message.** Sequential spawning defeats the parallel fan-out and is a correctness bug in this skill's execution.
- **Phase B gate is hard.** Critical + High > 0 → abort before touching `sites/`. No overrides, no retries. Fix the theme package and re-run.
- **Phase C stays in the orchestrator.** Do not attempt to delegate C2/C3/C4 to a sub-agent — the intra-step state sharing (`$BODY_VAR`/`$HEADING_VAR`/registry export names) would be lost.
- Sub-agents see a fresh context. Always pass them absolute paths (theme name, session directory) and do not assume shared state.
