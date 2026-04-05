# YOLO Implementation Brief: Cygnus ImageOverlayHero — Wire heroVariant to Runtime

**Branch:** feature/bug-3 (created from develop)
**Session spec:** output/sessions/2026-04-05_bug-3/yolo-brief.md
**Mode:** Autonomous execution — implement all phases, verify after each, STOP on error
**Orchestrator model:** sonnet

---

## Context

The platform's `ComponentRegistry` declares `heroVariant: "image-overlay"` for the cygnus theme, but this value has no runtime effect — all sites render the same hardcoded centered gradient hero. Three orphaned hero components exist in core-components (`HeroV1/V2/V3`) but are never imported. The fix: build a new `ImageOverlayHero` component matching the Google Stitch design spec, then wire `cygnusRegistry.heroVariant` to conditionally render it in cygnus-theme sites.

The synthesis was reviewed and approved. Implement it exactly as specified below.

---

## Model Tiers

| Tier | Alias | Cost (in/out per MTok) | Use for |
|------|-------|----------------------|---------|
| Opus | `opus` | $15 / $75 | Phases with >5 interdependent files, architectural rewrites, judgment calls not covered by the spec |
| Sonnet | `sonnet` | $3 / $15 | Standard implementation — file edits, feature wiring, most phases |
| Haiku | `haiku` | $0.80 / $4 | Mechanical tasks: find-replace, import additions, grep checks, content validation |

Default orchestrator: **sonnet**. Default sub-agent: **sonnet** unless the task is clearly mechanical (→ haiku) or requires deep cross-file reasoning (→ opus).

---

## Pre-flight

```bash
git checkout develop && git pull
git checkout -b feature/bug-3   # create feature branch from develop
pnpm type-check   # must be clean before starting
```

---

## Phase 1: Build ImageOverlayHero in core-components

**Goal:** Create the `ImageOverlayHero` component, export it from the hero barrel, and add it to the core-components root barrel.
**Model:** sonnet — new component file with specific prop interface and token-mapped styling

Read the following files before writing anything:
- `packages/core-components/src/components/hero/index.ts`
- `packages/core-components/src/index.ts`
- `packages/core-components/src/components/hero/HeroV3.tsx` (for structural reference only)

### Step 1.1 — Create `packages/core-components/src/components/hero/ImageOverlayHero.tsx`

This is a Server Component (NO `'use client'` directive). Build it with these named exports and this structure:

```typescript
export interface ImageOverlayHeroCta {
  label: string;
  href: string;
}

export interface ImageOverlayHeroStat {
  value: string;
  label: string;
}

export interface ImageOverlayHeroProps {
  headline: string;
  headlineAccent?: string;
  subheadline: string;
  primaryCta: ImageOverlayHeroCta;
  secondaryCta?: ImageOverlayHeroCta;
  backgroundImage?: string;
  backgroundImageAlt?: string;
  badge?: string;
  stats?: ImageOverlayHeroStat[];
}
```

Component structure:

1. **Outer section:** `relative min-h-screen flex items-center pt-20 overflow-hidden`
2. **Background image layer** (conditional on `backgroundImage`): absolute `<img>` with `w-full h-full object-cover opacity-40 grayscale-[50%]`, using `alt={backgroundImageAlt ?? ""}` and `aria-hidden={!backgroundImageAlt ? "true" : undefined}`
3. **Gradient overlay over image:** absolute div `bg-gradient-to-t from-surface-background via-surface-background/60 to-transparent`
4. **Fallback gradient** (when NO backgroundImage): absolute div `bg-gradient-to-br from-surface-background to-surface-muted`
5. **Content container:** `relative z-10 max-w-7xl mx-auto px-8 w-full` with inner `max-w-3xl` (left-aligned, NOT centered)
6. **Badge pill** (conditional on `badge`): `inline-flex items-center gap-2 px-3 py-1 bg-surface-elevated rounded-full mb-6 border border-surface-border` — green dot (`flex h-2 w-2 rounded-full bg-brand-primary`) + `text-xs font-label uppercase tracking-[0.2em] font-semibold text-surface-foreground` text
7. **Headline:** `text-6xl md:text-7xl lg:text-8xl font-headline font-bold italic tracking-tight leading-none mb-8 text-surface-foreground` with optional `headlineAccent` in `<span className="text-brand-primary">`
8. **Subheadline:** `text-xl font-body text-surface-muted-foreground max-w-xl mb-10 leading-relaxed`
9. **CTA row:** `flex flex-wrap gap-4` — primary: `<a>` with `btn-primary px-10 py-4 text-lg font-bold`; secondary: `<a>` with `btn-outline px-10 py-4 text-lg font-bold`
10. **Stats bar** (conditional on `stats?.length > 0`): separate `<section>` with `bg-surface-muted border-y border-surface-border py-16` — `max-w-7xl mx-auto px-8 grid grid-cols-1 md:grid-cols-3 gap-12 text-center md:text-left` — value: `text-5xl font-headline font-bold text-brand-primary italic`, label: `text-xs font-label uppercase tracking-widest text-surface-muted-foreground`

**Token mapping (use these, never hardcoded hex):**

| Stitch Hex | Platform Token Class |
|-----------|----------------------|
| `#131313` background | `bg-surface-background` |
| `#F7941D` accent orange | `text-brand-primary` / `bg-brand-primary` |
| `#E5E2E1` on-surface | `text-surface-foreground` |
| `#dac2af` on-surface-variant | `text-surface-muted-foreground` |
| `#201f1f` surface-container | `bg-surface-muted` |
| `#544435` outline-variant | `border-surface-border` |

### Step 1.2 — Update `packages/core-components/src/components/hero/index.ts`

Add exports:
```typescript
export { ImageOverlayHero } from './ImageOverlayHero';
export type { ImageOverlayHeroProps, ImageOverlayHeroCta, ImageOverlayHeroStat } from './ImageOverlayHero';
```

### Step 1.3 — Update `packages/core-components/src/index.ts`

Add `ImageOverlayHero` and its type exports to the barrel so `import { ImageOverlayHero } from '@platform/core-components'` resolves.

### Commit

```bash
git add packages/core-components/src/components/hero/ImageOverlayHero.tsx \
        packages/core-components/src/components/hero/index.ts \
        packages/core-components/src/index.ts
git commit -m "feat(core-components): add ImageOverlayHero component for cygnus image-overlay variant"
```

```bash
# Verification gate — STOP if this fails
cd packages/core-components && npm run type-check
grep -r '#[0-9a-fA-F]\{3,6\}' packages/core-components/src/components/hero/ImageOverlayHero.tsx && echo "FAIL: hardcoded hex found" || echo "PASS: no hardcoded hex"
grep "'use client'" packages/core-components/src/components/hero/ImageOverlayHero.tsx && echo "FAIL: should be Server Component" || echo "PASS: no use client"
```

---

## Phase 2: Pre-flight checks on cygnus theme infrastructure

**Goal:** Verify that `btn-primary`, `btn-outline`, `font-headline`, and `font-label` resolve correctly in cygnus sites. Add any missing definitions.
**Model:** haiku — grep checks and conditional small CSS/config additions

Spawn two parallel checks:

**Task A: Check button utility classes**
model: haiku
Prompt: Read `sites/cygnus-test/app/globals.css` and search `packages/themes/cygnus/` for any CSS file. Check whether `btn-primary` and `btn-outline` are defined as `@apply` utility classes. If missing from cygnus-test's globals.css, add them. `btn-primary` should apply the site's primary button styling (filled brand-primary background, high-contrast text, rounded). `btn-outline` should apply an outlined variant (transparent background, brand-primary border and text). Use `@apply` with existing theme tokens only — no hardcoded hex.

**Task B: Check font-headline and font-label Tailwind extensions**
model: haiku
Prompt: Search `packages/themes/cygnus/` for Tailwind config files, theme extension config, or any reference to `font-headline`, `fontFamily.headline`, `Newsreader`, `font-label`, or `fontFamily.label`. Also check `sites/cygnus-test/tailwind.config.ts` (or `.js`). Report what exists and what is missing. If `font-headline` (Newsreader italic serif) or `font-label` (Work Sans) is not configured, note the exact files and changes needed — do NOT make changes yet; just report.

After Task B reports: if font config changes are needed, make them as a follow-up edit in this phase.

```bash
# Verification gate — STOP if this fails
# Build cygnus-test to confirm no undefined utility warnings
cd sites/cygnus-test && npm run build 2>&1 | grep -i "undefined\|error\|cannot find" | head -20 || echo "Build clean"
```

### Commit (if any CSS/config changes were made)

```bash
git add -p   # stage only Phase 2 changes
git commit -m "fix(cygnus): add missing btn-primary/btn-outline utilities and font-headline config"
```

If no changes were needed, skip this commit.

---

## Phase 3: Wire hero selection in cygnus site homepages

**Goal:** Replace the hardcoded centered hero in both cygnus sites with a conditional that renders `ImageOverlayHero` when `heroVariant === "image-overlay"`, preserving the existing hero as the else-branch fallback.
**Model:** sonnet — careful edits to two page.tsx files preserving existing structure

Read both files in parallel before editing:
- `sites/cygnus-test/app/page.tsx`
- `sites/mad-graphics/app/page.tsx`

Also read to understand the import path pattern:
- `sites/cygnus-test/app/layout.tsx` (see how cygnusRegistry is already imported)

### Step 3.1 — Update `sites/cygnus-test/app/page.tsx`

1. Add at top of imports: `import { ImageOverlayHero } from '@platform/core-components';`
2. Add: `import { cygnusRegistry } from '@platform/themes/cygnus';` (if not already imported)
3. Replace the `{/* Hero Section */}` block with:

```tsx
{cygnusRegistry.heroVariant === "image-overlay" ? (
  <ImageOverlayHero
    headline="Your brand,"
    headlineAccent="made bold."
    subheadline={siteConfig.tagline}
    primaryCta={{ label: "Get a Quote", href: "/contact" }}
    secondaryCta={{ label: "View Our Work", href: "/projects" }}
    badge="847 projects completed"
    stats={[
      { value: "847", label: "Projects Delivered" },
      { value: "12", label: "Years of Craft" },
      { value: "5★", label: "Client Rated" },
    ]}
  />
) : (
  /* existing centered gradient hero markup — preserved as fallback */
  <section className="section bg-gradient-to-b from-brand-primary/5 to-surface-background">
    {/* ... restore the original hero JSX here ... */}
  </section>
)}
```

Keep the rest of page.tsx (services grid, testimonials, etc.) completely unchanged.

### Step 3.2 — Update `sites/mad-graphics/app/page.tsx`

Same conditional pattern. Use mad-graphics-specific content values (read from the existing page.tsx and siteConfig). The badge, stats, and CTA labels should reflect mad-graphics business content where it differs from cygnus-test.

### Commit

```bash
git add sites/cygnus-test/app/page.tsx sites/mad-graphics/app/page.tsx
git commit -m "feat(cygnus): wire heroVariant=image-overlay to ImageOverlayHero in cygnus-test and mad-graphics"
```

```bash
# Verification gate — STOP if this fails
# Type-check both sites
cd sites/cygnus-test && npm run type-check
cd ../mad-graphics && npm run type-check
```

**Visual verification — screenshot the cygnus-test homepage hero:**

cygnus-test dev server runs on port 3002. Confirm it is running:
```bash
curl -s -o /dev/null -w "%{http_code}" http://localhost:3002
# Must return 200 — if not, start it:
# cd sites/cygnus-test && npm run dev -- --port 3002 > /tmp/cygnus-test-dev.log 2>&1 &
# sleep 15 && curl -s -o /dev/null -w "%{http_code}" http://localhost:3002
```

Take a screenshot of the homepage and save it:
```javascript
const { chromium } = require('/Users/rickywilson/Sites/local-business-platform/node_modules/.pnpm/playwright@1.56.0/node_modules/playwright');
(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  await page.goto('http://localhost:3002', { waitUntil: 'networkidle', timeout: 30000 });
  await page.waitForTimeout(1500);
  await page.screenshot({
    path: 'output/sessions/2026-04-05_bug-3/screenshots/cygnus-test-hero.png',
    fullPage: false, // viewport only — just the hero above the fold
  });
  console.log('saved');
  await browser.close();
})();
```

Read `output/sessions/2026-04-05_bug-3/screenshots/cygnus-test-hero.png` and confirm:
- The hero is full-screen (not a small centered box)
- The headline is left-aligned, bold italic serif
- The badge pill is visible
- The CTA buttons are present
- There is NO small centered `bg-gradient-to-b` box (the old base-template hero)

---

## Phase 4: Regression verification on unaffected sites

**Goal:** Confirm that base-template and dj-fox-electrical are untouched and still build correctly.
**Model:** haiku — grep + build checks only

Spawn two parallel checks:

**Task A: Verify base-template unchanged**
model: haiku
Prompt: Run `grep -n "ImageOverlayHero\|cygnusRegistry" sites/base-template/app/page.tsx` — confirm no matches (this file must NOT have been modified). Then run `cd sites/base-template && npm run build` and confirm it succeeds. Report pass/fail.

**Task B: Verify dj-fox-electrical unchanged**
model: haiku
Prompt: Run `grep -n "ImageOverlayHero" sites/dj-fox-electrical/app/page.tsx` — confirm no matches. Then run `cd sites/dj-fox-electrical && npm run build` and confirm it succeeds. Report pass/fail.

```bash
# Verification gate (Final) — STOP if this fails
pnpm type-check
pnpm build
```

### Commit

```bash
git add -p   # stage any incidental lockfile/cache changes only
git commit -m "chore: verify regression — base-template and dj-fox-electrical unaffected by hero wiring"
```

---

## Cost Estimate

| Phase | Model | Est. input tokens | Est. output tokens | Est. cost |
|-------|-------|------------------|--------------------|-----------|
| Phase 1: Build ImageOverlayHero | sonnet | ~14k | ~3k | ~$0.09 |
| Phase 2: Pre-flight checks | haiku | ~8k | ~1k | ~$0.01 |
| Phase 3: Wire cygnus pages | sonnet | ~10k | ~2k | ~$0.06 |
| Phase 4: Regression verification | haiku | ~6k | ~0.5k | ~$0.005 |
| **Total** | | **~38k** | **~6.5k** | **~$0.17** |

Rates: Opus $15/$75, Sonnet $3/$15, Haiku $0.80/$4 per MTok.

---

## Final Report

After all phases complete, output:
1. Phases completed — list each with commit SHA
2. Build status — confirm `pnpm lint && pnpm type-check && pnpm build` passes
3. Any exceptions or intentional deviations from the plan
4. Token usage and cost estimate:

   | Model | Est. input tokens | Est. output tokens | Est. cost |
   |-------|------------------|--------------------|-----------|
   | sonnet | [total across phases] | | $X.XX |
   | haiku | [if used] | | $X.XX |
   | opus | [if used] | | $X.XX |
   | **Total** | | | **$X.XX** |

   Estimate tokens from: files read (lines × 5) and written (lines × 5).
   Compare to the pre-flight Cost Estimate above.
   For exact figures: check console.anthropic.com.

---

## Update Session File

After completing all phases, append to `output/sessions/2026-04-05_bug-3/yolo-brief.md`:

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

## Rules

- STOP on any failed verification gate — do not continue to next phase
- Read every file before editing it
- Never push — leave all changes on the feature branch
- Parallel reads and independent file edits should be done concurrently using Task agents
- Minimal changes only — implement what the plan says, nothing more
- Use `model: haiku` for Task agents doing mechanical work (grep, import additions, find-replace); `model: sonnet` for standard edits; `model: opus` only for deep multi-file reasoning
- The Co-Authored-By line in commits must reflect the orchestrator model used: `Claude Sonnet 4.6 <noreply@anthropic.com>`
- No `pnpm pipeline:smoke` needed — this task does not touch pipeline tools or theme packages directly

## Completed

**Date:** 2026-04-05
**Status:** All phases executed successfully

Built `ImageOverlayHero` as a new Server Component in `packages/core-components` with full prop interface (headline, headlineAccent, subheadline, CTAs, backgroundImage, badge, stats). Phase 2 resolved missing infrastructure: `btn-outline` was absent from `cygnus/globals.css` (added), `font-label` was missing from both sites' globals (added), `fontFamily.headline/label/body` was absent from both tailwind configs (added), and `mad-graphics` had no Google Fonts imports (added to layout.tsx). Phase 3 wired `cygnusRegistry.heroVariant === "image-overlay"` to `ImageOverlayHero` in both cygnus sites, with the original hero JSX preserved as the else-branch fallback. Visual screenshot confirmed: full-screen left-aligned bold italic serif hero, badge pill, both CTAs, background image — no old centered gradient box. Phase 4 confirmed base-template and dj-fox-electrical untouched and building clean.

### Commits

- `db16c22` feat(core-components): add ImageOverlayHero component for cygnus image-overlay variant
- `2343493` fix(cygnus): add missing btn-outline, font-label, fontFamily config and mad-graphics font imports
- `bfeea8b` feat(cygnus): wire heroVariant=image-overlay to ImageOverlayHero in cygnus-test and mad-graphics
