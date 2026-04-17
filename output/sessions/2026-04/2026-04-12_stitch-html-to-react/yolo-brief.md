# YOLO Implementation Brief: Stitch HTML → React Fidelity Fix

**Branch:** feature/stitch-html-to-react (created from develop)
**Session spec:** output/sessions/2026-04-12_stitch-html-to-react/yolo-brief.md
**Mode:** Autonomous execution — implement all phases, verify after each, STOP on error
**Orchestrator model:** sonnet

---

## Context

The underscore sites (`_castor-plumbing`, `_cygnus-graphics`, `_lyra-garden`, `_nova-print`) look nothing like their Stitch designs. The pipeline ran correctly for token extraction but skipped the critical step of converting the Stitch HTML into React components. The page templates in `packages/themes/*/pages/` are generic base-template copies. Three gaps compound this: (1) fonts are documented in theme comments but never loaded via `next/font/google`, (2) Material Symbols icons are used in all Stitch HTML but absent from all theme templates, (3) the Stitch HTML section structure (zig-zag layouts, floating trust cards, staggered grids) was never translated into TSX.

This brief also updates the pipeline documentation to make the HTML→React conversion step explicit and origin-agnostic — it must work whether the design came from Stitch, a reference site scrape, or the taste-skill locally.

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
git checkout -b feature/stitch-html-to-react
pnpm type-check   # must be clean before starting
```

---

## Phase 1 — Wire fonts in all 4 sites

**Goal:** Add `next/font/google` font loading (Newsreader + Work Sans) to all 4 underscore site layouts and register font variables in their tailwind configs.
**Model:** haiku — mechanical, identical change across 4 files

### Reference pattern (from `sites/dj-fox-electrical/app/layout.tsx`):

```ts
import { Outfit } from 'next/font/google';
const outfit = Outfit({ subsets: ['latin'], variable: '--font-outfit', display: 'swap', weight: ['400','500','600','700','800'] });
// ...
<html lang="en-GB" className={outfit.variable}>
```

### What to add in each layout.tsx:

```ts
import { Newsreader, Work_Sans } from "next/font/google";

const newsreader = Newsreader({
  subsets: ["latin"],
  variable: "--font-newsreader",
  display: "swap",
  weight: ["400", "700", "800"],
  style: ["normal", "italic"],
});

const workSans = Work_Sans({
  subsets: ["latin"],
  variable: "--font-work-sans",
  display: "swap",
  weight: ["300", "400", "500", "600", "700"],
});
```

Apply to `<html>` tag:

```tsx
<html lang="en-GB" className={`${newsreader.variable} ${workSans.variable}`}>
```

### What to add in each tailwind.config.ts (under `theme.extend`):

```ts
fontFamily: {
  headline: ['var(--font-newsreader)', 'serif'],
  body: ['var(--font-work-sans)', 'sans-serif'],
},
```

### Files to edit (spawn 4 parallel haiku agents, one per site):

**Agent 1 — castor:**

- `sites/_castor-plumbing/app/layout.tsx` — add font imports + apply to `<html>`
- `sites/_castor-plumbing/tailwind.config.ts` — add `fontFamily` under `theme.extend`

**Agent 2 — cygnus:**

- `sites/_cygnus-graphics/app/layout.tsx` — same
- `sites/_cygnus-graphics/tailwind.config.ts` — same

**Agent 3 — lyra:**

- `sites/_lyra-garden/app/layout.tsx` — same
- `sites/_lyra-garden/tailwind.config.ts` — same

**Agent 4 — nova:**

- `sites/_nova-print/app/layout.tsx` — same
- `sites/_nova-print/tailwind.config.ts` — same

```bash
# Verification gate — STOP if this fails
pnpm type-check
```

**Commit:**

```bash
git add sites/_castor-plumbing/app/layout.tsx sites/_castor-plumbing/tailwind.config.ts \
        sites/_cygnus-graphics/app/layout.tsx sites/_cygnus-graphics/tailwind.config.ts \
        sites/_lyra-garden/app/layout.tsx sites/_lyra-garden/tailwind.config.ts \
        sites/_nova-print/app/layout.tsx sites/_nova-print/tailwind.config.ts
git commit -m "feat(themes): wire Newsreader + Work Sans fonts in all 4 underscore sites

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>"
```

---

## Phase 2 — Add Material Symbols to all 4 theme globals.css

**Goal:** Add the Material Symbols Outlined Google Font import to each theme's globals.css so icons can be used in page templates.
**Model:** haiku — single CSS line addition to 4 files

Add this line at the top of each theme's `globals.css` (after any existing `@import` lines, before the first rule block):

```css
@import url("https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=block");
```

Also add this utility class at the end of each globals.css:

```css
/* ==========================================
   MATERIAL SYMBOLS
   ========================================== */
.material-symbols-outlined {
  font-family: "Material Symbols Outlined";
  font-variation-settings:
    "FILL" 0,
    "wght" 400,
    "GRAD" 0,
    "opsz" 24;
  display: inline-block;
  vertical-align: middle;
  line-height: 1;
  font-size: inherit;
}
```

Files:

- `packages/themes/castor/globals.css`
- `packages/themes/cygnus/globals.css`
- `packages/themes/lyra/globals.css`
- `packages/themes/nova/globals.css`

Spawn 4 parallel haiku agents, one per theme globals.css.

```bash
# Verification gate — STOP if this fails
pnpm type-check
```

**Commit:**

```bash
git add packages/themes/castor/globals.css packages/themes/cygnus/globals.css \
        packages/themes/lyra/globals.css packages/themes/nova/globals.css
git commit -m "feat(themes): add Material Symbols Outlined to castor/cygnus/lyra/nova globals

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>"
```

---

## Phase 3 — Rewrite castor page templates from Stitch HTML

**Goal:** Translate the castor Stitch HTML into faithful React/Tailwind page templates. This is the most important phase — the home page in particular must match the Stitch design signature.
**Model:** opus — 5 files, complex DOM→TSX translation requiring judgment on prop mapping and token substitution

### Stitch HTML source files to read first:

- `output/ingestion/castor-stitch/html/home.html` — read in full
- `output/ingestion/castor-stitch/html/services.html` — read in full
- `output/ingestion/castor-stitch/html/service-detail.html` — read in full
- `output/ingestion/castor-stitch/html/about.html` — read in full
- `output/ingestion/castor-stitch/html/contact.html` — read in full

### Existing prop interfaces to respect (read before writing):

- `packages/core-components/src/lib/page-template-types.ts` — all interfaces (HomePageTemplateProps, ServicesPageTemplateProps, ServiceDetailPageTemplateProps, AboutPageTemplateProps, ContactPageTemplateProps)

### Translation rules — MUST follow:

1. **Preserve section order and structure** from the Stitch HTML exactly (hero first, then sections in HTML order)
2. **Replace hardcoded hex with theme tokens**: `#1a3a6b` → `bg-brand-primary`, `#3a7d44` → `bg-brand-accent`, `#f0f4f8` → `bg-surface-muted`, `#ffffff` → `bg-surface-card`, `#1c1c1e` → `text-surface-foreground`, `rgba(26,58,107,0.75)` → use `bg-brand-primary/75` BUT NOTE: Tailwind opacity modifiers don't work with CSS custom properties — use inline style `style={{ background: 'rgba(26,58,107,0.75)' }}` for the hero overlay
3. **Replace static copy with props** — use the prop interfaces. For text that has no matching prop, use a sensible default from the Stitch HTML as a fallback string
4. **Replace Material Symbols icons**: keep the `<span className="material-symbols-outlined">icon_name</span>` pattern — Material Symbols is now available via the globals.css import from Phase 2. Use the exact icon names from the Stitch HTML
5. **Preserve micro-interactions**: `hover:-translate-y-1`, `active:-translate-y-px`, `group-hover:scale-105`, `transition-all duration-300`, `group-hover:translate-x-1` etc — keep these exactly
6. **Font classes**: `font-headline` for Newsreader (h1, h2, h3), `font-body` for Work Sans (body, nav) — these are now registered in tailwind via Phase 1
7. **Hero image**: The Stitch home hero uses a full-bleed background image. Use `style={{ backgroundImage: 'url(...)' }}` as a placeholder with a comment `{/* TODO: wire to heroImage prop or R2 asset */}` — do NOT use a Next.js `<Image>` component for a full-bleed background (it doesn't support that pattern cleanly)
8. **Never hardcode business-specific copy** (phone numbers, addresses, testimonials) — use props. If a prop doesn't exist in the interface, add it as optional with `?`

### Key sections to faithfully translate for `home.tsx`:

- **Nav**: handled by CastorHeader — do NOT duplicate nav in the page template
- **Hero**: full-bleed background image + `rgba(26,58,107,0.75)` overlay + left-aligned text + two CTA buttons + **floating trust card** (bottom-right, hidden on mobile via `hidden sm:flex`)
- **Stats bar**: mistGrey background, icon + value + label per stat
- **Services zig-zag**: alternating left/right image placement (4 services), `order-1`/`order-2` for responsive reorder
- **Testimonials**: staggered 2-col grid, second column offset `md:mt-12`, white cards with `border-l-4 border-brand-accent`, star ratings
- **CTA band**: navy background, heading + two buttons
- **Footer**: handled by CastorFooter — do NOT duplicate footer

### Key sections for `services.tsx`:

- Hero: navy background + gradient, breadcrumb, heading
- Services grid: 3-col, cards with image, icon, title, description, "Learn more →" link
- CTA band

### Key sections for `service-detail.tsx`:

- Hero: full-bleed image + overlay, heading, subheading, CTA
- Description + "Why choose us" card (2-col layout)
- Image gallery: 3-col with hover overlay labels
- FAQ accordion: `<details>`/`<summary>` style but as React state (use `useState` — this IS a client component, add `'use client'` at top if needed for accordion interactivity, OR implement as a simple CSS-only accordion using `<details>`)
- CTA panel

### Key sections for `about.tsx`:

- Hero: image + overlay
- Company story: 2-col (text left, image right), blockquote with navy left border
- Trust bar: certification logos with grayscale/hover effect
- Values cards: 3-col, hover flips to navy background
- Team grid: 4-col, image + bottom text overlay, hover reveals description
- CTA band

### Key sections for `contact.tsx`:

- Hero: image + overlay
- Form (left, 7/12 width) + sidebar (right, 5/12 width) with contact details card
- Stats row: 4 stats with large sage-green numbers

### Files to write:

- `packages/themes/castor/pages/home.tsx` — full rewrite
- `packages/themes/castor/pages/services.tsx` — full rewrite
- `packages/themes/castor/pages/service-detail.tsx` — full rewrite
- `packages/themes/castor/pages/about.tsx` — full rewrite
- `packages/themes/castor/pages/contact.tsx` — full rewrite

Also fix `packages/themes/castor/components/header.tsx` — change nav links from `uppercase tracking-widest text-xs` to `font-body text-sm font-medium` to match the Stitch design (Work Sans medium, not uppercase).

```bash
# Verification gate — STOP if this fails
cd sites/_castor-plumbing && npm run type-check
```

**Commit:**

```bash
git add packages/themes/castor/pages/ packages/themes/castor/components/header.tsx
git commit -m "feat(castor): rewrite page templates from Stitch HTML — faithful HTML→React conversion

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>"
```

---

## Phase 4 — Rewrite nova page templates from Stitch HTML

**Goal:** Translate the nova Stitch HTML into faithful React/Tailwind page templates.
**Model:** opus — same complexity as Phase 3

**Important context for nova:** The nova Stitch design uses a different palette from castor. Read `output/ingestion/nova-stitch/meta/token-mapping-report.json` first to confirm nova's colours, then read the nova HTML files. Nova uses orange (`#E85118`) + green (`#5BA829`) + charcoal (`#1a1a1a`) — map to nova's theme tokens from `packages/themes/nova/index.ts`.

### Stitch HTML source files to read first:

- `output/ingestion/nova-stitch/html/home.html`
- `output/ingestion/nova-stitch/html/services.html`
- `output/ingestion/nova-stitch/html/service-detail.html`
- `output/ingestion/nova-stitch/html/about.html`
- `output/ingestion/nova-stitch/html/contact.html`
- `packages/themes/nova/index.ts` — read to confirm nova's token mappings

Apply the same translation rules as Phase 3 (token substitution, props from page-template-types.ts, preserve micro-interactions, Material Symbols icons).

### Files to write:

- `packages/themes/nova/pages/home.tsx` — full rewrite
- `packages/themes/nova/pages/services.tsx` — full rewrite
- `packages/themes/nova/pages/service-detail.tsx` — full rewrite
- `packages/themes/nova/pages/about.tsx` — full rewrite
- `packages/themes/nova/pages/contact.tsx` — full rewrite

```bash
# Verification gate — STOP if this fails
cd sites/_nova-print && npm run type-check
```

**Commit:**

```bash
git add packages/themes/nova/pages/
git commit -m "feat(nova): rewrite page templates from Stitch HTML — faithful HTML→React conversion

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>"
```

---

## Phase 5 — Rewrite cygnus page templates from Stitch HTML

**Goal:** Translate the cygnus Stitch HTML into faithful React/Tailwind page templates.
**Model:** opus — same complexity, but cygnus uses a **dark theme** (MD3 tokens, dark background)

**Critical context for cygnus:** The cygnus Stitch HTML uses `class="dark"` on `<html>` and a Material Design 3 dark colour scheme with amber/orange primary (`#ffb976`) on dark backgrounds (`#131313`). This is completely different from castor's light-theme navy/green. Read the cygnus HTML carefully before writing any components.

- Read `output/ingestion/cygnus-stitch/meta/token-mapping-report.json` first
- Read `packages/themes/cygnus/index.ts` to confirm current token mappings
- The dark theme means `bg-surface-background` will resolve to a dark colour — components should use these tokens, not hardcode dark hex values
- The `<html class="dark">` in the Stitch HTML is handled by the theme system — do NOT add a `dark` class to the layout; just use the theme tokens which will have dark values

### Stitch HTML source files to read first:

- `output/ingestion/cygnus-stitch/html/home.html`
- `output/ingestion/cygnus-stitch/html/services.html`
- `output/ingestion/cygnus-stitch/html/service-detail.html`
- `output/ingestion/cygnus-stitch/html/about.html`
- `output/ingestion/cygnus-stitch/html/contact.html`
- `packages/themes/cygnus/index.ts`

Apply the same translation rules (token substitution, props, micro-interactions, Material Symbols).

### Files to write:

- `packages/themes/cygnus/pages/home.tsx` — full rewrite
- `packages/themes/cygnus/pages/services.tsx` — full rewrite
- `packages/themes/cygnus/pages/service-detail.tsx` — full rewrite
- `packages/themes/cygnus/pages/about.tsx` — full rewrite
- `packages/themes/cygnus/pages/contact.tsx` — full rewrite

```bash
# Verification gate — STOP if this fails
cd sites/_cygnus-graphics && npm run type-check
```

**Commit:**

```bash
git add packages/themes/cygnus/pages/
git commit -m "feat(cygnus): rewrite page templates from Stitch HTML — dark theme MD3 HTML→React

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>"
```

---

## Phase 6 — Rewrite lyra page templates from Stitch HTML

**Goal:** Translate the lyra Stitch HTML into faithful React/Tailwind page templates.
**Model:** opus — same complexity

**Context for lyra:** Lyra is partially done (some token work was done in the Apr 11 session). Read the existing `packages/themes/lyra/pages/home.tsx` first to understand what was already improved, then compare against the Stitch HTML to identify remaining gaps. Lyra uses a green garden/landscaping palette — `brand.primary` is a dark green.

### Stitch HTML source files to read first:

- `output/ingestion/lyra-stitch/html/home.html`
- `output/ingestion/lyra-stitch/html/services.html`
- `output/ingestion/lyra-stitch/html/service-detail.html`
- `output/ingestion/lyra-stitch/html/about.html`
- `output/ingestion/lyra-stitch/html/contact.html`
- `packages/themes/lyra/index.ts`
- `packages/themes/lyra/pages/home.tsx` — read existing to find delta

Apply the same translation rules.

### Files to write:

- `packages/themes/lyra/pages/home.tsx` — rewrite (check against existing first)
- `packages/themes/lyra/pages/services.tsx` — full rewrite
- `packages/themes/lyra/pages/service-detail.tsx` — full rewrite
- `packages/themes/lyra/pages/about.tsx` — full rewrite
- `packages/themes/lyra/pages/contact.tsx` — full rewrite

```bash
# Verification gate — STOP if this fails
cd sites/_lyra-garden && npm run type-check
```

**Commit:**

```bash
git add packages/themes/lyra/pages/
git commit -m "feat(lyra): rewrite page templates from Stitch HTML — garden theme HTML→React

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>"
```

---

## Phase 7 — Update pipeline documentation

**Goal:** Add the missing HTML→React conversion step to pipeline docs so future themes (Stitch, ingest, or taste-skill origin) get this step explicitly.
**Model:** sonnet

### Files to update:

**`docs/architecture/how-stitch-design-pipeline-works.md`**

Add a new "Step 4b: HTML → React Conversion" section after the existing Step 4 (token mapping). Insert after the "## Theme Package Output" section:

```markdown
## Step 4b: HTML → React Conversion (REQUIRED)

After token extraction, the Stitch HTML files must be translated into the theme's page templates. This step was missing from earlier pipeline runs and is the primary cause of design fidelity gaps.

**This step must run before scaffolding the test site.**

For each Stitch page (`home`, `services`, `service-detail`, `about`, `contact`), open `output/ingestion/<theme-name>-stitch/html/<page>.html` and translate it into `packages/themes/<theme-name>/pages/<page>.tsx` following these rules:

### Translation checklist

- [ ] **Hero structure**: full-bleed image or solid colour? overlay colour and opacity? left/centre/right text alignment? floating elements (trust cards, badges)?
- [ ] **Section cadence**: list every section in HTML order and implement them in the same order in TSX
- [ ] **Typography**: replace `font-['Newsreader']` → `font-headline`, `font-['Work_Sans']` → `font-body` (these are registered in tailwind.config.ts via Phase 1 of the font wiring)
- [ ] **Colour tokens**: replace all hardcoded hex values with theme tokens (e.g. `#1a3a6b` → `bg-brand-primary`). Exception: rgba overlays — use inline style for these since Tailwind opacity modifiers don't work with CSS custom properties
- [ ] **Icons**: keep `<span className="material-symbols-outlined">icon_name</span>` — Material Symbols is available via the theme's globals.css import
- [ ] **Props**: replace all static copy with props from `HomePageTemplateProps` (etc.) in `packages/core-components/src/lib/page-template-types.ts`. If a needed prop doesn't exist, add it as optional
- [ ] **Micro-interactions**: preserve all hover/active/group-hover animation classes exactly as in the HTML
- [ ] **Images**: use `style={{ backgroundImage: 'url(...)' }}` for CSS background images with a `TODO` comment; use `<Image>` only for `<img>` tags

### Origin-agnostic note

This checklist applies regardless of how the design was created:

- **Stitch origin**: HTML is in `output/ingestion/<name>-stitch/html/`
- **Ingest origin**: screenshots and HTML are in `output/ingestion/<name>/`
- **Taste-skill origin** (no external reference): a `DESIGN.md` spec was produced; the "HTML" step becomes "implement from DESIGN.md" using the same checklist
```

**`docs/guides/creating-new-theme.md`**

Find the section describing the pipeline steps and add a "Step 4b" checkpoint. Add a cross-reference: "See [How the Stitch Design Pipeline Works](../architecture/how-stitch-design-pipeline-works.md#step-4b-html--react-conversion-required) for the full checklist."

```bash
# Verification gate — STOP if this fails
# (no code changes — just verify the doc reads correctly)
cat docs/architecture/how-stitch-design-pipeline-works.md | grep -A 5 "Step 4b"
cat docs/guides/creating-new-theme.md | grep -A 3 "Step 4b"
```

**Commit:**

```bash
git add docs/architecture/how-stitch-design-pipeline-works.md docs/guides/creating-new-theme.md
git commit -m "docs(pipeline): add Step 4b HTML→React conversion — origin-agnostic checklist

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>"
```

---

## Phase 8 — Final verification

**Goal:** Confirm all 4 sites type-check clean and the monorepo builds.
**Model:** haiku

```bash
# Verification gate — STOP if this fails
pnpm type-check
```

If type-check passes, confirm by listing what was changed:

```bash
git log --oneline develop..HEAD
```

---

## Parallel execution groups

This section lists work units that can run concurrently. Each group lists items that MUST be launched in a single Task-tool message.

### Intra-phase groups

| Group | Phase   | Items                                                                                  | File overlap      | Model | Rationale                                        |
| ----- | ------- | -------------------------------------------------------------------------------------- | ----------------- | ----- | ------------------------------------------------ |
| G1    | Phase 1 | Read all 8 layout.tsx + tailwind.config.ts files before editing                        | none (reads only) | n/a   | Independent reads — batch in one message         |
| G2    | Phase 1 | Edit castor layout + tailwind; Edit cygnus layout + tailwind; Edit lyra; Edit nova     | none              | haiku | 4 independent site pairs — parallel haiku agents |
| G3    | Phase 2 | Edit castor globals.css; cygnus globals.css; lyra globals.css; nova globals.css        | none              | haiku | 4 independent theme CSS files                    |
| G4    | Phase 3 | Read all 5 castor Stitch HTML files + page-template-types.ts + existing page templates | none (reads only) | n/a   | Independent reads before the rewrite             |
| G5    | Phase 4 | Read all 5 nova Stitch HTML files + nova/index.ts + token-mapping-report.json          | none (reads only) | n/a   | Independent reads before the rewrite             |
| G6    | Phase 5 | Read all 5 cygnus Stitch HTML files + cygnus/index.ts + token-mapping-report.json      | none (reads only) | n/a   | Independent reads before the rewrite             |
| G7    | Phase 6 | Read all 5 lyra Stitch HTML files + lyra/index.ts + existing home.tsx                  | none (reads only) | n/a   | Independent reads before the rewrite             |
| G8    | Phase 7 | Read both doc files before editing                                                     | none (reads only) | n/a   | Independent reads                                |

### Cross-phase groups (only if phases are truly independent)

| Group | Phases     | Items                               | Rationale                                                                                                                                                                                                                                          |
| ----- | ---------- | ----------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| CG1   | 3, 4, 5, 6 | Castor, nova, cygnus, lyra rewrites | All write to different theme packages with no shared files. Can run as 4 parallel opus agents if desired. However: each is expensive at opus tier — run sequentially by default to manage cost. Override to parallel only if time is the priority. |

### Sequential points — MUST NOT parallelise

| Item                                                  | Reason                                                                    |
| ----------------------------------------------------- | ------------------------------------------------------------------------- |
| Verification gates between phases                     | Each phase's output gates the next. Phases 1 → 2 must be sequential.      |
| Git commits                                           | One commit per phase, in order.                                           |
| Phase 3–6 page rewrites (unless CG1 override invoked) | Each requires deep reasoning over large HTML files — sequential is safer. |

---

## Cost Estimate

| Phase                           | Model  | Est. input tokens | Est. output tokens | Est. cost  |
| ------------------------------- | ------ | ----------------- | ------------------ | ---------- |
| Phase 1: Font wiring (4 sites)  | haiku  | ~20k              | ~2k                | ~$0.08     |
| Phase 2: Material Symbols CSS   | haiku  | ~8k               | ~1k                | ~$0.02     |
| Phase 3: Castor rewrite (5 pgs) | opus   | ~60k              | ~15k               | ~$2.00     |
| Phase 4: Nova rewrite (5 pgs)   | opus   | ~60k              | ~15k               | ~$2.00     |
| Phase 5: Cygnus rewrite (5 pgs) | opus   | ~60k              | ~15k               | ~$2.00     |
| Phase 6: Lyra rewrite (5 pgs)   | opus   | ~60k              | ~15k               | ~$2.00     |
| Phase 7: Doc updates            | sonnet | ~15k              | ~3k                | ~$0.09     |
| Phase 8: Final verification     | haiku  | ~5k               | ~0.5k              | ~$0.01     |
| **Total**                       |        | **~288k**         | **~66k**           | **~$8.20** |

Rates: Opus $15/$75, Sonnet $3/$15, Haiku $0.25/$1.25 per MTok.
Note: Phases 3–6 dominate cost because they require reading large HTML files + writing comprehensive TSX. If running parallel (CG1), wall-clock time halves but cost is the same.

---

## Final Report

After all phases complete, output:

1. Phases completed — list each with commit SHA
2. Build status — confirm `pnpm type-check` passes
3. Any exceptions or intentional deviations from the plan
4. Token usage and cost estimate:

   | Model     | Est. input tokens     | Est. output tokens | Est. cost |
   | --------- | --------------------- | ------------------ | --------- |
   | opus      | [total across phases] |                    | $X.XX     |
   | sonnet    | [if used]             |                    | $X.XX     |
   | haiku     | [if used]             |                    | $X.XX     |
   | **Total** |                       |                    | **$X.XX** |

   Compare to the pre-flight Cost Estimate above.
   For exact figures: check console.anthropic.com.

---

## Update Session File

After completing all phases, append to `output/sessions/2026-04-12_stitch-html-to-react/yolo-brief.md`:

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
- **Never parallelise across phase boundaries unless the Cross-phase groups table explicitly lists the phases.**
- **If the groups table and the phase prose disagree, the groups table wins.**
- Minimal changes only — implement what the plan says, nothing more
- Use `model: haiku` for Task agents doing mechanical work; `model: sonnet` for standard edits; `model: opus` for deep multi-file HTML→React translation
- The Co-Authored-By line must reflect the orchestrator model: `Claude Sonnet 4.6 <noreply@anthropic.com>`

---

## Completed

**Date:** 2026-04-12
**Status:** All phases executed successfully

All 8 phases implemented as specified. Wired Newsreader + Work Sans fonts via `next/font/google` in all 4 underscore site layouts with tailwind fontFamily config. Added Material Symbols Outlined CSS import and utility class to all 4 theme globals.css files. Rewrote all 20 page templates (5 per theme × 4 themes: castor, nova, cygnus, lyra) from Stitch HTML to faithful React/Tailwind TSX — each preserving the original section structure, micro-interactions, Material Symbols icons, and colour palette mapped to theme tokens. Fixed castor header nav styling. Updated pipeline docs with Step 4b HTML→React conversion checklist. Also added `pages/**` content glob to all 4 site tailwind configs (not in the original brief but necessary for Tailwind to scan page template classes). Full monorepo type-check passes clean across all 13 packages. No deviations from the plan.

### Commits

- `74c7a19` feat(themes): wire Newsreader + Work Sans fonts in all 4 underscore sites
- `a03240b` feat(themes): add Material Symbols Outlined to castor/cygnus/lyra/nova globals
- `58e9c26` feat(castor): rewrite page templates from Stitch HTML — faithful HTML→React conversion
- `b17d604` feat(nova): rewrite page templates from Stitch HTML — faithful HTML→React conversion
- `5118361` feat(cygnus): rewrite page templates from Stitch HTML — dark theme MD3 HTML→React
- `e416dbf` feat(lyra): rewrite page templates from Stitch HTML — garden theme HTML→React
- `929ff16` docs(pipeline): add Step 4b HTML→React conversion — origin-agnostic checklist
