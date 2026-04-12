# YOLO Implementation Brief: Corvus Theme — Ingest from colorcode.events + Rewire \_rigel-events

**Branch:** feature/corvus-theme-ingest (created from develop)
**Session spec:** output/sessions/2026-04-12_corvus-theme-ingest/yolo-brief.md
**Mode:** Autonomous execution — implement all phases, verify after each, STOP on error
**Orchestrator model:** sonnet

---

## Context

The existing `packages/themes/rigel/` was generated from a stale/incorrect analysis of colorcode.events — the components look nothing like the reference: wrong aesthetic, wrong colour application, missing the signature geometric-shapes-as-typographic-elements design language. The reference site (https://colorcode.events/) uses a deep navy/indigo background (~#2d2a6e), massive bold white display typography, and colourful geometric inline shapes (squares, slashes, circles, arrows) embedded in the text.

This brief: (1) runs the full ingest pipeline against colorcode.events, targeting a **new** theme named `corvus`, capturing enough pages to build a complete picture; (2) saves all reusable text content from the existing `_rigel-events` site before destroying anything; (3) kills the old rigel theme; and (4) rewires `sites/_rigel-events` to use the new `corvus` theme, restoring all the event site pages with the saved content.

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
git checkout -b feature/corvus-theme-ingest
pnpm type-check   # must be clean before starting
```

---

## Phase 1 — Save Rigel Text Content

**Goal:** Capture all reusable text content from `sites/_rigel-events` before we touch any theme files. This is a safety snapshot — nothing is deleted yet.
**Model:** haiku — mechanical reads + file write

Create `output/sessions/2026-04-12_corvus-theme-ingest/saved-content/` and save the following:

```bash
mkdir -p output/sessions/2026-04-12_corvus-theme-ingest/saved-content
```

Copy all MDX content files verbatim:

```bash
cp -r sites/_rigel-events/content/speakers output/sessions/2026-04-12_corvus-theme-ingest/saved-content/
cp -r sites/_rigel-events/content/testimonials output/sessions/2026-04-12_corvus-theme-ingest/saved-content/
cp -r sites/_rigel-events/content/blog output/sessions/2026-04-12_corvus-theme-ingest/saved-content/ 2>/dev/null || true
```

Read and write a single `site-text-content.md` capturing all the key text from `site.config.ts` and all app pages:

Capture from `site.config.ts`:

- `name`, `tagline`, `url`, `domain`, `slug`
- `business` block (name, email, address, socialMedia, geo)
- `navigation.main` items
- `cta.primary`
- `footer.copyright`
- `credentials.stats`
- `about` block (heroBadges, story paragraphs, whyChooseUs, values)

Capture schedule data from `app/schedule/page.tsx` — the full `sessions` array.

Capture venue text from `app/venue/page.tsx`.

Capture sponsors text from `app/sponsors/page.tsx`.

Write all of it to `output/sessions/2026-04-12_corvus-theme-ingest/saved-content/site-text-content.md` in readable markdown sections.

**Verification gate — STOP if this fails:**

```bash
test -f output/sessions/2026-04-12_corvus-theme-ingest/saved-content/site-text-content.md
test -d output/sessions/2026-04-12_corvus-theme-ingest/saved-content/speakers
test -d output/sessions/2026-04-12_corvus-theme-ingest/saved-content/testimonials
echo "PASS: Content snapshot complete"
```

**Commit:**

```bash
git add output/sessions/2026-04-12_corvus-theme-ingest/
git commit -m "chore(corvus): snapshot _rigel-events text content before theme rebuild

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>"
```

---

## Phase 2 — Run the Ingest Pipeline (analyse-site.ts)

**Goal:** Run `tools/analyse-site.ts` against colorcode.events with enough page coverage to capture the full design language. Name the theme `corvus`.
**Model:** sonnet (orchestrates the long-running tool, interprets output)

### A0 — Run analysis tool

The tool must capture multiple pages. Run with explicit page hints to ensure it doesn't just capture the homepage:

```bash
npx tsx tools/analyse-site.ts \
  --url https://colorcode.events/ \
  --name corvus
```

This will take several minutes. Wait for full completion. The tool screenshots, analyses visual tokens, generates components, and scaffolds `packages/themes/corvus/`.

**After completion, verify A0 gate — STOP if fails:**

```bash
test -f packages/themes/corvus/index.ts || { echo "FAIL: corvus theme package not created"; exit 1; }
test -f output/ingestion/corvus/site-analysis.json || { echo "FAIL: site-analysis.json missing"; exit 1; }
echo "PASS: A0 complete — theme package and analysis JSON present"
```

Export:

```bash
SESSION_DIR="output/ingestion/corvus"
```

### A1 + A3 — Parallel fan-out

Launch both sub-agents in ONE message (single Task-tool call with two agents):

#### Sub-agent A1 — Reference asset download

**Model:** sonnet

Prompt:

> You are sub-agent A1 of `/pipeline.ingest` Phase A. Your job is to capture reference HTML and download reference images for theme `corvus`.
>
> **Inputs:** `output/ingestion/corvus/site-analysis.json` — read `discoveredPages[]` to know which pages to fetch.
>
> **Tasks:**
>
> 1. **Capture reference HTML.** Create `output/ingestion/corvus/html/` and `output/ingestion/corvus/meta/`. For each entry in `discoveredPages[]`, download HTML via:
>
>    ```bash
>    curl -s --max-time 15 -L -A "Mozilla/5.0" "<page.url>" -o "output/ingestion/corvus/html/<pageType>.html"
>    ```
>
>    Also fetch these specific pages regardless of whether they appear in discoveredPages (colorcode.events has a rich sub-page structure):
>    - `https://colorcode.events/about/` → `about.html`
>    - `https://colorcode.events/speakers/` → `speakers.html` (if it exists — WARN not STOP on 404)
>    - `https://colorcode.events/schedule/` → `schedule.html` (WARN not STOP on 404)
>    - `https://colorcode.events/blog/` → `blog-list.html`
>
>    Write `output/ingestion/corvus/meta/html-manifest.json`.
>
> 2. **Download reference images.** Create `output/ingestion/corvus/images/`. Extract `<img src="...">` from all HTML files, download up to 20 images (skip data: URIs, skip URLs >2000 chars). Sanitise filenames with python3. Write `output/ingestion/corvus/meta/image-manifest.json`.
>
> **Do NOT** touch `sites/` directories.
>
> **Return:** `"A1: N HTML pages captured, M/K images downloaded."`

#### Sub-agent A3 — Scaffold inventory

**Model:** haiku

Prompt:

> You are sub-agent A3 of `/pipeline.ingest` Phase A. Your job is to pre-compute the inventory for Phase C scaffolding.
>
> **Inputs:**
>
> - `packages/themes/corvus/index.ts`
> - `packages/themes/corvus/components/index.ts` (if present)
> - `sites/base-template/` (read-only reference)
>
> **Tasks:**
>
> 1. Parse `packages/themes/corvus/index.ts` — extract exported Registry and DefaultConfig variable names.
> 2. Compute camelCase theme name (`corvus` → `corvus`).
> 3. If `packages/themes/corvus/components/index.ts` exists, list every export and check each component file exists.
> 4. List top-level entries of `sites/base-template/`.
>
> **Output file:** `output/ingestion/corvus/meta/scaffold-inventory.json`
>
> **Return:** `"A3: registry=<name>, components=N/M present, K missing barrel entries."`

**Phase A verification gate — STOP if any fails:**

```bash
test -f output/ingestion/corvus/site-analysis.json
test -f output/ingestion/corvus/meta/html-manifest.json
test -f output/ingestion/corvus/meta/image-manifest.json
test -f output/ingestion/corvus/meta/scaffold-inventory.json
test -f packages/themes/corvus/index.ts
echo "PASS: All Phase A artefacts present"
```

---

## Phase 3 — Theme Package Validation (TPV)

**Goal:** Audit the generated corvus theme package against all 15 TPV rules. Gate: Critical+High > 0 → STOP.
**Model:** Delegate to `cs-theme-package-validator`

Spawn:

```
subagent_type: cs-theme-package-validator
model: sonnet
```

Prompt:

> You are validating a newly generated theme package as part of `/pipeline.ingest` Phase B.
>
> **Scope:** Single-theme audit. Theme package at `packages/themes/corvus/`.
>
> **Rules:** All 15 rules (TPV-001 through TPV-015).
>
> **Session directory:** `output/ingestion/corvus/`
>
> **Output file:** `output/ingestion/corvus/meta/findings-theme-package.md`
>
> Follow your agent definition's review procedure exactly. Do NOT modify any files — read-only audit.
>
> **Return:** the Statistics line from your findings file (`Statistics: Critical=X High=Y Medium=Z Low=W`).

**Gate:** Read Statistics from `output/ingestion/corvus/meta/findings-theme-package.md`.

- If `Critical + High > 0`: STOP. Print the findings. Do NOT proceed to Phase 4 or touch `sites/`. Leave `packages/themes/corvus/` in place for manual patching.
- If `Critical + High == 0`: print Medium/Low warnings and continue.

**Phase B verification gate:**

```bash
test -f output/ingestion/corvus/meta/findings-theme-package.md
grep -q "Critical" output/ingestion/corvus/meta/findings-theme-package.md
test -f packages/themes/corvus/index.ts
echo "PASS: TPV complete"
```

---

## Phase 4 — Fix Known Pipeline Defects in corvus Theme

**Goal:** Fix the standard post-generation defects that the pipeline consistently produces before we touch the site.
**Model:** haiku (mechanical find-replace)

**4a. Fix animation import paths:**

```bash
grep -rl '@platform/core-components/src/components/animation' \
  packages/themes/corvus/components/ 2>/dev/null \
  | xargs -I{} sed -i '' \
    's|@platform/core-components/src/components/animation|@platform/core-components/components/animation|g' {}

grep -r '@platform/core-components/src/components/animation' \
  packages/themes/corvus/components/ 2>/dev/null \
  && echo "WARN: Some animation import paths not fixed" \
  || echo "PASS: Animation import paths clean"
```

**4b. Fix stale barrel entries in components/index.ts:**

```bash
if [ -f packages/themes/corvus/components/index.ts ]; then
  grep -o "export \* from '\./[^']*'" packages/themes/corvus/components/index.ts \
    | sed "s|export \* from '\./||;s|'||" \
    | while read name; do
      file="packages/themes/corvus/components/${name}.tsx"
      [ -f "$file" ] || echo "MISSING: $name"
    done
fi
```

Remove any MISSING lines from the barrel — edit `packages/themes/corvus/components/index.ts` to delete exports for files that don't exist.

**4c. Verify globals.css uses CSS custom properties not theme() function:**

```bash
grep "theme(" packages/themes/corvus/globals.css 2>/dev/null \
  && echo "WARN: globals.css uses theme() function — replace with var(--...)" \
  || echo "PASS: globals.css clean"
```

If `theme()` calls found, replace them with equivalent `var(--color-*)` references.

**Verification gate:**

```bash
pnpm --filter @platform/themes type-check 2>/dev/null || npx tsc --noEmit -p packages/themes/corvus/tsconfig.json 2>/dev/null || echo "WARN: type-check not available at package level — will catch in Phase 8"
echo "Phase 4 complete"
```

**Commit:**

```bash
git add packages/themes/corvus/
git commit -m "feat(corvus): generated theme package from colorcode.events ingest

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>"
```

---

## Phase 5 — Kill Old Rigel Theme + Create corvus Test Site

**Goal:** Remove `packages/themes/rigel/` and scaffold a test site for corvus.
**Model:** sonnet

### 5a — Kill rigel theme

```bash
# Remove the rigel theme package
rm -rf packages/themes/rigel/

# Verify gone
test -d packages/themes/rigel && echo "FAIL: rigel still exists" || echo "PASS: rigel removed"
```

### 5b — Scaffold corvus test site

Read `output/ingestion/corvus/meta/scaffold-inventory.json` for `registryExport`, `defaultConfigExport`, `camelCaseThemeName`.

```bash
# Copy base-template
cp -r sites/base-template sites/test-corvus
rm -rf sites/test-corvus/node_modules sites/test-corvus/.next sites/test-corvus/.turbo

# Copy reference images
mkdir -p sites/test-corvus/public/images
cp output/ingestion/corvus/images/* sites/test-corvus/public/images/ 2>/dev/null || true
```

Write marker file `sites/test-corvus/.pipeline-test-site.json`:

```json
{
  "createdAt": "<ISO timestamp>",
  "themeName": "corvus",
  "sourceUrl": "https://colorcode.events/",
  "pipelineOutput": "output/ingestion/corvus/"
}
```

### 5c — Wire corvus theme into test site

**theme.config.ts** — use `corvusRegistry` and `corvusDefaultConfig`:

```typescript
import type { DeepPartialThemeConfig } from "@platform/theme-system";
import { corvusRegistry, corvusDefaultConfig } from "@platform/themes/corvus";

export const themeConfig: DeepPartialThemeConfig = {
  componentRegistry: corvusRegistry,
  ...corvusDefaultConfig,
  colors: {
    ...corvusDefaultConfig.colors,
    surface: {
      ...corvusDefaultConfig.colors?.surface,
      inverse:
        "<surface-inverse-hex from site-analysis.json themeTokenRecommendations, fallback #2d2a6e>",
    },
  },
};
```

**CI-inert package.json** — read `sites/base-template/package.json`, use `generateTestSitePackageJson('test-corvus', basePackageJson)` from `tools/lib/test-site-package.ts`, write to `sites/test-corvus/package.json`. Verify no build/lint/test scripts remain.

**Tagline** — update `site.config.ts` tagline to `'Pipeline Test Site — corvus theme'`.

**Fonts** — read `output/ingestion/corvus/site-analysis.json` for `themeTokenRecommendations.typography.fontFamilySans[0]` and `fontFamilyHeading[0]`. Fallback: `Work_Sans` / `Newsreader`. Write `app/layout.tsx` and `app/globals.css` per the pipeline.ingest Phase C2e spec.

**CSP patch** — add `fonts.googleapis.com` to `style-src` and `fonts.gstatic.com` to `font-src` in `sites/test-corvus/next.config.ts`.

### 5d — Generate test site pages

The test site gets two categories of pages:

**Category A — Replicate colorcode.events pages** (build these to match the reference as closely as possible using corvus components):

| Route                              | Mirrors                               | Notes                                                                                             |
| ---------------------------------- | ------------------------------------- | ------------------------------------------------------------------------------------------------- |
| `app/page.tsx`                     | colorcode.events home                 | Hero with geometric shapes motif, event details, calls to action, blog preview, newsletter signup |
| `app/about/page.tsx`               | colorcode.events/about/               | Organisation story, how it started, mission                                                       |
| `app/buffalo/page.tsx`             | colorcode.events/buffalo/             | Event detail page — date, venue, schedule overview, speakers                                      |
| `app/blog/page.tsx`                | colorcode.events/blog/                | Blog listing with post cards                                                                      |
| `app/blog/[slug]/page.tsx`         | colorcode.events blog post            | Blog post detail (static, no `generateStaticParams`)                                              |
| `app/contact/page.tsx`             | colorcode.events/contact/             | Contact form + info                                                                               |
| `app/call-for-speakers/page.tsx`   | colorcode.events/call-for-speakers/   | Speaker recruitment CTA page                                                                      |
| `app/call-for-sponsors/page.tsx`   | colorcode.events/call-for-sponsors/   | Sponsorship opportunities                                                                         |
| `app/call-for-volunteers/page.tsx` | colorcode.events/call-for-volunteers/ | Volunteer recruitment                                                                             |

**Category B — Standard pages not on ref site** (generate these for completeness — any corvus event site will need them):

| Route                          | Purpose                                   |
| ------------------------------ | ----------------------------------------- |
| `app/speakers/page.tsx`        | Speakers listing grid                     |
| `app/speakers/[slug]/page.tsx` | Speaker bio detail                        |
| `app/schedule/page.tsx`        | Full weekend schedule, two-column Sat/Sun |
| `app/venue/page.tsx`           | Venue detail with map link                |
| `app/sponsors/page.tsx`        | Sponsors grid                             |

**Rules for ALL pages:**

- Use corvus components where they exist and map cleanly to the section
- Inline JSX (with theme tokens, no hardcoded hex) as fallback when no component fits
- No `generateStaticParams`, no `getContentItems`, no `fs.readdir`
- No `generateMetadata` with async data loading
- Nav and footer from corvus components on every page (or inline fallback)
- Fix animation import paths (C2f-1c from pipeline.ingest spec) before generating

**Before generating pages** — build the corvus component inventory:

```bash
ls packages/themes/corvus/components/
cat packages/themes/corvus/components/index.ts
```

Map each component to the section category it covers. Prefer using components whose blueprint matches the section being built (check `output/ingestion/corvus/site-analysis.json` → `sectionBlueprints[]`).

**Verification gate:**

```bash
# Required routes
for route in \
  "sites/test-corvus/app/page.tsx" \
  "sites/test-corvus/app/about/page.tsx" \
  "sites/test-corvus/app/buffalo/page.tsx" \
  "sites/test-corvus/app/blog/page.tsx" \
  "sites/test-corvus/app/blog/[slug]/page.tsx" \
  "sites/test-corvus/app/contact/page.tsx" \
  "sites/test-corvus/app/call-for-speakers/page.tsx" \
  "sites/test-corvus/app/call-for-sponsors/page.tsx" \
  "sites/test-corvus/app/call-for-volunteers/page.tsx" \
  "sites/test-corvus/app/speakers/page.tsx" \
  "sites/test-corvus/app/speakers/[slug]/page.tsx" \
  "sites/test-corvus/app/schedule/page.tsx" \
  "sites/test-corvus/app/venue/page.tsx" \
  "sites/test-corvus/app/sponsors/page.tsx"; do
  test -f "$route" || { echo "FAIL: Missing $route"; exit 1; }
done
echo "PASS: All 14 routes present"

# No hardcoded hex
grep -rn '#[0-9a-fA-F]\{3,8\}' sites/test-corvus/app/ 2>/dev/null \
  && echo "WARN: Hardcoded hex colors found" \
  || echo "PASS: No hardcoded hex"

# No forbidden APIs
grep -rn 'generateStaticParams\|getContentItems\|fs\.readdir' sites/test-corvus/app/ 2>/dev/null \
  && echo "WARN: Forbidden API usage" \
  || echo "PASS: No forbidden APIs"
```

**Verification gate (infrastructure):**

```bash
test -d sites/test-corvus
test -f sites/test-corvus/.pipeline-test-site.json
test -f sites/test-corvus/theme.config.ts
test -f sites/test-corvus/app/layout.tsx
echo "PASS: Test site scaffolded"
```

**Commit:**

```bash
git add packages/themes/corvus/ sites/test-corvus/ pnpm-lock.yaml
git commit -m "feat(corvus): scaffold test site + kill rigel theme

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>"
```

---

## Phase 6 — Rewire \_rigel-events to corvus

**Goal:** Replace all rigel theme references in `sites/_rigel-events` with corvus, restore all the event site pages with saved text content.
**Model:** opus (many interdependent files, requires judgment on content mapping)

This phase rebuilds the entire `sites/_rigel-events` site around the corvus theme. The saved content from Phase 1 is the source of truth for all text.

### 6a — Update theme.config.ts

Rewrite `sites/_rigel-events/theme.config.ts`:

```typescript
import type { DeepPartialThemeConfig } from "@platform/theme-system";
import { corvusRegistry } from "@platform/themes/corvus";

export const themeConfig: DeepPartialThemeConfig = {
  componentRegistry: corvusRegistry,
  colors: {
    brand: {
      primary: "#2d2a6e", // deep navy from colorcode.events
      primaryHover: "#1e1b4b",
      secondary: "#F5D121", // yellow accent (keep from original — event branding)
      accent: "#00b140", // green accent
    },
  },
};
```

Read `output/ingestion/corvus/site-analysis.json` → `themeTokenRecommendations.colors` to verify these values match what corvus extracted. Adjust if the extracted values are significantly different — use the extracted values.

### 6b — Update app/globals.css

```css
@import "../../../packages/themes/corvus/globals.css";
@tailwind base;
@tailwind components;
@tailwind utilities;

html {
  scroll-behavior: smooth;
}
body {
  @apply bg-surface-background text-surface-foreground;
}
```

### 6c — Update app/layout.tsx

Replace all `@platform/themes/rigel/components` imports with `@platform/themes/corvus/components`.

Read the corvus components index (`packages/themes/corvus/components/index.ts`) to find the equivalent of:

- A Header/Nav component → use whatever corvus exports for navigation
- A Footer component → use whatever corvus exports for footer

If corvus has no direct Header/Footer equivalents, write inline versions styled with corvus tokens.

Update `ThemeProvider` to use `theme="corvus"` and `registry={corvusRegistry}`.

### 6d — Update app/page.tsx (homepage)

Rewrite the homepage to use corvus components. The homepage should:

- Use the Hero component from corvus (if present) with the saved text: headline "Digital Marketing Weekend 2026", subheading from `site.config.ts` tagline
- Display the 4 stats from `credentials.stats`: `2 Days`, `10+ Speakers`, `20+ Sessions`, `300 Attendees`
- Include an about/intro section with the story paragraphs from `about.story`
- Include the whyChooseUs list from `about.whyChooseUs`
- Include a schedule preview teaser (Saturday + Sunday headline sessions)
- Include a final CTA linking to eventbrite

Map corvus components to these sections using the same hierarchy as pipeline.ingest Phase C2f-1 (theme component → core component → inline JSX). No `RigelHomePage` — that no longer exists.

### 6e — Update all other app pages

For each page in `sites/_rigel-events/app/`:

**speakers/page.tsx** — Remove `RigelSpeakersPage` import. Rewrite using corvus components (or inline JSX) to render a speaker listing page. The `getContentItems('speakers')` data loading stays — this is not a test site. Display a grid of speaker cards from the MDX content.

**speakers/[slug]/page.tsx** — Remove rigel page template import. Rewrite using corvus components for the speaker bio detail page. Keep `generateStaticParams`, `getContentItem`, schema JSON-LD.

**schedule/page.tsx** — Remove `RigelSchedulePage` import. Rewrite using corvus components (or inline JSX) to display the saved sessions data (restore the full `sessions` array from the saved content snapshot). Two-column Saturday/Sunday layout.

**venue/page.tsx** — Remove rigel template. Rewrite with corvus components for venue detail page. Restore venue text from saved snapshot.

**sponsors/page.tsx** — Remove rigel template. Rewrite with corvus components for sponsors page.

**contact/page.tsx** — Remove rigel template. Keep `ContactForm` from core-components. Rewire to corvus layout.

**about/page.tsx** (if it exists) — Remove rigel template. Restore `about.story`, `about.values`, `about.whyChooseUs` content.

**Key constraint:** Every import of `@platform/themes/rigel` must be eliminated. After this phase, `grep -r 'themes/rigel' sites/_rigel-events/` must return empty.

### 6f — Update tailwind.config.ts

Replace any reference to `rigel` theme with `corvus`:

```typescript
import { corvusRegistry } from "@platform/themes/corvus";
// ...
```

Check `sites/_rigel-events/tailwind.config.ts` for rigel imports and update.

**Verification gate — STOP if fails:**

```bash
# No rigel references remain
RIGEL_REFS=$(grep -r 'themes/rigel' sites/_rigel-events/ 2>/dev/null | wc -l | tr -d ' ')
[ "$RIGEL_REFS" -gt 0 ] && { echo "FAIL: $RIGEL_REFS rigel references remain"; grep -r 'themes/rigel' sites/_rigel-events/; exit 1; }
echo "PASS: No rigel references in _rigel-events"

# Corvus wired
grep -q 'corvus' sites/_rigel-events/theme.config.ts || { echo "FAIL: corvus not in theme.config.ts"; exit 1; }
echo "PASS: corvus wired"
```

**Commit:**

```bash
git add sites/_rigel-events/
git commit -m "feat(rigel-events): rewire site to corvus theme, restore all event content

Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>"
```

---

## Phase 7 — Type-check + Lockfile

**Goal:** Ensure the monorepo builds cleanly with rigel gone and corvus wired.
**Model:** sonnet

```bash
# Update lockfile
pnpm install --lockfile-only || pnpm install

# Monorepo type-check
pnpm type-check

# Site-level type-check for both affected sites
cd sites/_rigel-events && npx tsc --noEmit && cd ../..
cd sites/test-corvus && npx tsc --noEmit && cd ../..
```

If type errors found in `sites/_rigel-events`:

- Fix each error — they will mostly be missing component prop types from corvus (the corvus components have different prop interfaces than rigel)
- Re-run `npx tsc --noEmit` to confirm clean
- Do NOT skip — this site will be deployed

If type errors found in `sites/test-corvus`:

- Fix what's easy; log anything that is a corvus theme package defect for follow-up
- Test sites are throwaway — don't spend time on unfixable generated code

**Verification gate:**

```bash
pnpm type-check && echo "PASS: monorepo type-check clean" || echo "WARN: type errors remain — see output above"

# Lockfile must be valid
pnpm install --frozen-lockfile && echo "PASS: lockfile valid" || { echo "FAIL: lockfile out of sync"; exit 1; }
```

**Commit:**

```bash
git add pnpm-lock.yaml sites/_rigel-events/ sites/test-corvus/
git commit -m "chore(corvus): reconcile lockfile, fix type errors post-rewire

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>"
```

---

## Phase 8 — Stage + Final Report

**Goal:** Stage all changes, validate gates, summarise.
**Model:** haiku

```bash
git add -A
git status
```

Confirm:

- `packages/themes/rigel/` is gone (deleted files staged)
- `packages/themes/corvus/` is present
- `sites/test-corvus/` is present with 5 page.tsx files
- `sites/_rigel-events/` has no rigel imports
- `pnpm-lock.yaml` updated

Print final summary:

```
=== Corvus Theme Ingest Complete ===

Phase 1 — Content snapshot:    DONE (saved-content/ + site-text-content.md)
Phase 2 — Ingest (A0+A1+A3):  DONE (corvus theme package generated)
Phase 3 — TPV validation:      DONE (Critical=X High=Y)
Phase 4 — Pipeline defect fix: DONE
Phase 5 — Test site scaffold:  DONE (sites/test-corvus/ — 5 routes)
Phase 6 — Rewire _rigel-events: DONE (all pages rewired to corvus)
Phase 7 — Type-check + lockfile: DONE

Theme:     corvus
Source:    https://colorcode.events/
Test site: sites/test-corvus/
Live site: sites/_rigel-events/

Dev server commands:
  Test site: cd sites/test-corvus && npm run dev
  Live site: cd sites/_rigel-events && npm run dev

Next steps:
  1. Compare test site vs reference screenshots in output/ingestion/corvus/screenshots/
  2. If the corvus design is good, /deploy.changes to ship _rigel-events
  3. When done: /pipeline.kill-site test-corvus
=====================================
```

---

## Parallel Execution Groups

### Intra-phase groups

| Group | Phase   | Items                                                                                                                     | File overlap    | Model          | Rationale                                   |
| ----- | ------- | ------------------------------------------------------------------------------------------------------------------------- | --------------- | -------------- | ------------------------------------------- |
| G1    | Phase 1 | Read site.config.ts, app/schedule/page.tsx, app/venue/page.tsx, app/sponsors/page.tsx                                     | none (reads)    | n/a            | Independent reads — batch in one message    |
| G2    | Phase 2 | Sub-agent A1 (HTML+images), Sub-agent A3 (scaffold inventory)                                                             | none            | sonnet / haiku | Pipeline fan-out — MUST be one Task message |
| G3    | Phase 4 | Fix animation imports (4a), Fix barrel (4b), Check globals.css (4c)                                                       | different files | haiku          | Independent mechanical fixes                |
| G4    | Phase 6 | Read corvus components/index.ts, Read saved-content/site-text-content.md, Read output/ingestion/corvus/site-analysis.json | none (reads)    | n/a            | Pre-rewire reads — batch before editing     |
| G5    | Phase 7 | type-check \_rigel-events, type-check test-corvus                                                                         | none            | n/a            | Independent site type-checks                |

### Cross-phase groups

| Group  | Phases | Items | Rationale                             |
| ------ | ------ | ----- | ------------------------------------- |
| (none) |        |       | All phases have ordering dependencies |

### Sequential points — MUST NOT parallelise

| Item                                              | Reason                                    |
| ------------------------------------------------- | ----------------------------------------- |
| A0 (analyse-site.ts) must complete before A1+A3   | A1 reads discoveredPages from A0's output |
| Phase 3 TPV must complete before Phase 4          | Gate: Critical+High > 0 aborts pipeline   |
| Phase 5 (kill rigel) must complete before Phase 6 | Phase 6 assumes rigel is gone             |
| Type-check gates between phases                   | Each phase's output gates the next        |
| Git commits                                       | One commit per phase, in order            |

---

## Cost Estimate

| Phase                                  | Model        | Est. input tokens | Est. output tokens | Est. cost  |
| -------------------------------------- | ------------ | ----------------- | ------------------ | ---------- |
| Phase 1: Content snapshot              | haiku        | ~15k              | ~3k                | ~$0.08     |
| Phase 2: Ingest (A0 tool)              | n/a (CLI)    | —                 | —                  | —          |
| Phase 2: A1+A3 sub-agents              | sonnet+haiku | ~20k              | ~5k                | ~$0.07     |
| Phase 3: TPV validation                | sonnet       | ~30k              | ~5k                | ~$0.08     |
| Phase 4: Pipeline defect fix           | haiku        | ~8k               | ~2k                | ~$0.01     |
| Phase 5: Test site scaffold (14 pages) | sonnet       | ~60k              | ~30k               | ~$0.63     |
| Phase 6: Rewire \_rigel-events         | opus         | ~60k              | ~20k               | ~$2.40     |
| Phase 7: Type-check + lockfile         | sonnet       | ~20k              | ~5k                | ~$0.14     |
| Phase 8: Final report                  | haiku        | ~5k               | ~2k                | ~$0.01     |
| **Total**                              |              | **~218k**         | **~72k**           | **~$3.42** |

Rates: Opus $15/$75, Sonnet $3/$15, Haiku $0.25/$1.25 per MTok.
Note: `analyse-site.ts` runs as a CLI tool with its own API costs (not reflected above — typically $2-5 depending on page count and vision calls).

---

## Final Report

After all phases complete, output:

1. Phases completed — list each with commit SHA
2. Build status — confirm `pnpm type-check` passes
3. Any exceptions or intentional deviations from the plan
4. Token usage and cost estimate:

   | Model     | Est. input tokens | Est. output tokens | Est. cost |
   | --------- | ----------------- | ------------------ | --------- |
   | opus      |                   |                    | $X.XX     |
   | sonnet    |                   |                    | $X.XX     |
   | haiku     |                   |                    | $X.XX     |
   | **Total** |                   |                    | **$X.XX** |

---

## Update Session File

After completing all phases, append to `output/sessions/2026-04-12_corvus-theme-ingest/yolo-brief.md`:

```markdown
## Completed

**Date:** [today]
**Status:** All phases executed successfully

[1-paragraph summary: what was implemented, any surprises]

### Commits

[list each commit SHA and message]
```

Confirm this was done in the final report.

---

## Run Wrap-Up

After completing all phases and updating the session file, run:

/wrap-up-session

This writes `session-wrap-up.md` to the session folder. **This is a required final step — do not skip it.**

---

## Rules

- STOP on any failed verification gate — do not continue to next phase
- Read every file before editing it
- Never push — leave all changes on the feature branch
- **Consult the `## Parallel execution groups` section before launching any work.** Every item listed in a group MUST be launched in a single Task-tool message.
- **Items NOT listed in any group run sequentially.**
- **Never parallelise across phase boundaries unless the Cross-phase groups table explicitly lists them.**
- **If the groups table and phase prose disagree, the groups table wins.**
- Minimal changes only — implement what the plan says, nothing more
- Use `model: haiku` for mechanical work; `model: sonnet` for standard edits; `model: opus` only for Phase 6 (deep cross-file rewire with content mapping)
- The Co-Authored-By line must reflect the orchestrator model used per phase
- **Phase 3 TPV gate is hard — Critical+High > 0 means STOP, no overrides**
- After Phase 5, `grep -r 'themes/rigel' packages/` must return empty (rigel is dead)
- After Phase 6, `grep -r 'themes/rigel' sites/_rigel-events/` must return empty
