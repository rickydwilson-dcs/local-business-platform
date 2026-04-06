# YOLO Implementation Brief: Mad Graphics — Cygnus Theming + Theme-First Pipeline

**Branch:** feature/mad-graphics-cygnus-theme (created from develop)
**Session spec:** output/sessions/2026-04-06_mad-graphics-cygnus-theme/yolo-brief.md
**Mode:** Autonomous execution — implement all phases, verify after each, STOP on error
**Orchestrator model:** sonnet

---

## Context

`sites/mad-graphics` was scaffolded from `base-template` instead of the cygnus reference site (`cygnus-test`), so it uses a generic vega-style layout while the Vercel deployment should look like the cygnus-test design (dark, bold, Stitch-derived). Additionally, the location nav dropdown shows full SEO strings ("Vehicle Graphics & Signs in Eastbourne") instead of bare town names, and the site creation pipeline always scaffolds from base-template regardless of requested theme. This plan ports the cygnus visual design into mad-graphics, fixes the nav labels via a new `locationName` MDX field, and adds theme-first page scaffolding to the pipeline.

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
# Verification gate — STOP if this fails
git checkout develop && git pull
git checkout -b feature/mad-graphics-cygnus-theme

# Record starting state
ls sites/mad-graphics/content/locations/*.mdx | wc -l    # must be 19
ls sites/cygnus-test/public/stitch-images/ | wc -l       # record actual count (likely 26)
pnpm type-check                                           # must be clean before starting
```

---

## Phase 1: Fix Location Nav Labels — `locationName` Field

**Goal:** Nav dropdown shows "Eastbourne", not "Vehicle Graphics & Signs in Eastbourne". Page `<h1>` and breadcrumbs remain unchanged.

**Model:** sonnet — touches content schema (TypeScript), 19 MDX files, and layout.tsx

Read these files in parallel before editing:
- `packages/core-components/src/lib/content-schemas.ts`
- `sites/mad-graphics/app/layout.tsx`
- `sites/mad-graphics/content/locations/eastbourne.mdx`

**Step 1.1 — Update content schema**

File: `packages/core-components/src/lib/content-schemas.ts`

Find the location Zod schema. Add:
```typescript
locationName: z.string().optional(),
```

If the return type from `getContentItems('locations')` is a typed interface, also add `locationName?: string` to it.

**Step 1.2 — Add `locationName` to all 19 location MDX files**

For each file in `sites/mad-graphics/content/locations/*.mdx`, add `locationName: "<TownName>"` immediately after the `title:` line. Use parallel Task agents (model: haiku) — this is mechanical.

Town name mapping (file slug → bare name):
```
alfriston          → Alfriston
battle             → Battle
bexhill-on-sea     → Bexhill-on-Sea
crowborough        → Crowborough
eastbourne         → Eastbourne
hailsham           → Hailsham
hastings           → Hastings
heathfield         → Heathfield
herstmonceux       → Herstmonceux
lewes              → Lewes
newhaven           → Newhaven
peacehaven         → Peacehaven
pevensey           → Pevensey
polegate           → Polegate
ringmer            → Ringmer
seaford            → Seaford
st-leonards-on-sea → St Leonards-on-Sea
uckfield           → Uckfield
wadhurst           → Wadhurst
```

**Step 1.3 — Update `layout.tsx` location mapping**

File: `sites/mad-graphics/app/layout.tsx`

Find the block mapping `allLocations` to `locationItems`. Change:
```typescript
// Before
name: loc.title,
// After
name: (loc as any).locationName ?? loc.title,
```

If `locationName` is properly typed via the schema update, remove the cast.

```bash
# Verification gate — STOP if this fails
grep -c "^locationName:" sites/mad-graphics/content/locations/*.mdx
# Every file must show :1

grep "^title:" sites/mad-graphics/content/locations/eastbourne.mdx
# Must still show full: title: "Vehicle Graphics & Signs in Eastbourne"

cd sites/mad-graphics && npm run validate:content
npm run type-check
```

**Commit:**
```bash
git add sites/mad-graphics/content/locations/ \
        sites/mad-graphics/app/layout.tsx \
        packages/core-components/src/lib/content-schemas.ts
git commit -m "$(cat <<'EOF'
fix(mad-graphics): add locationName field for bare nav labels

Adds locationName frontmatter to all 19 location MDX files so the nav
dropdown shows "Eastbourne" not "Vehicle Graphics & Signs in Eastbourne".
title and seoTitle unchanged — page headings and SEO unaffected.

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>
EOF
)"
```

---

## Phase 2: Copy Stitch Images

**Goal:** Make stitch images available in mad-graphics for page rendering.

**Model:** haiku — single shell command

```bash
cp -r sites/cygnus-test/public/stitch-images sites/mad-graphics/public/stitch-images
```

```bash
# Verification gate — STOP if this fails
EXPECTED=$(ls sites/cygnus-test/public/stitch-images/ | wc -l | tr -d ' ')
ACTUAL=$(ls sites/mad-graphics/public/stitch-images/ | wc -l | tr -d ' ')
[ "$EXPECTED" = "$ACTUAL" ] && echo "OK: $ACTUAL images" || (echo "MISMATCH: expected $EXPECTED got $ACTUAL" && exit 1)
ls sites/mad-graphics/public/stitch-images/img-006.jpg   # must exist
```

**Commit:**
```bash
git add sites/mad-graphics/public/stitch-images/
git commit -m "$(cat <<'EOF'
feat(mad-graphics): add stitch images (temporary placeholders pending R2 pipeline)

Copied from sites/cygnus-test/public/stitch-images/. Reference assets —
treat as approved placeholders until R2 asset pipeline runs.

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>
EOF
)"
```

---

## Phase 3: Replace Homepage

**Goal:** Mad Graphics homepage matches cygnus visual design. No custom nav/footer. All hex → tokens. Config-driven services.

**Model:** sonnet — significant new TSX file

Read these files in parallel before writing:
- `sites/cygnus-test/app/page.tsx` (visual reference — 510 lines)
- `sites/mad-graphics/app/page.tsx` (current file to replace)
- `sites/mad-graphics/site.config.ts`
- `sites/mad-graphics/lib/content.ts` (check getTestimonials export — add it if missing)
- `packages/themes/cygnus/globals.css` (available utility classes)

**Hard constraints:**
- No `<header>` or `<footer>` elements — layout.tsx provides these via PageShell
- No hardcoded hex — use token classes only (mapping below)
- No "Vinyl Wrapping" service card — not offered by Mad Graphics
- Default export required (Next.js App Router)
- Hero image: `/stitch-images/img-006.jpg` (not getImageUrl — no R2 asset yet)

**Hex → token mapping (apply throughout Phases 3–6):**

| Hex | Token class |
|-----|-------------|
| `#131313` | `bg-surface-background` |
| `#0e0e0e` | `bg-surface-muted` |
| `#f7941d`, `#F7941D` | `text-brand-primary` / `bg-brand-primary` |
| `#5BA829`, `#5ba829` | `text-brand-secondary` |
| `#dac2af`, `#dec498` | `text-surface-muted-foreground` |
| `#613500`, `#2d1600` | `text-brand-on-primary` — check this token exists in theme-system first; use `text-[var(--color-brand-on-primary)]` if not |
| `#e5e2e1`, `#E5E2E1` | `text-surface-foreground` |
| `#544435` | `border-surface-border` |
| rgba shadow values | Remove or replace with Tailwind shadow utilities |

Note: `style={{ fontVariationSettings: ... }}` on Material Symbols icons is acceptable — not a color.

**SERVICE_IMAGES map (use exactly this):**
```typescript
const SERVICE_IMAGES: Record<string, string> = {
  'vehicle-graphics':     '/stitch-images/img-025.jpg',
  'signs-signage':        '/stitch-images/img-003.jpg',
  'banners':              '/stitch-images/img-002.jpg',
  'large-format-print':   '/stitch-images/img-006.jpg',
  'marketing-print':      '/stitch-images/img-010.jpg',
  'stickers-labels':      '/stitch-images/img-008.jpg',
  'workwear-merchandise': '/stitch-images/img-015.jpg',
  'graphic-design':       '/stitch-images/img-019.jpg',
};
```

**Page structure:**
1. JSON-LD schema scripts (copy from current mad-graphics page.tsx — LocalBusiness, WebSite, BreadcrumbList)
2. Hero: `cygnusRegistry.heroVariant === 'image-overlay'` conditional → `<ImageOverlayHero>` with Mad Graphics data. Fallback: gradient section.
3. Services grid: map `siteConfig.services` → image cards using `SERVICE_IMAGES`
4. Testimonials: `await getTestimonials()` → filter featured → slice(0, 2) → render if any
5. CTA band: `bg-brand-primary`

```bash
# Verification gate — STOP if this fails
grep -E 'text-\[#|bg-\[#|border-\[#|from-\[#|to-\[#' sites/mad-graphics/app/page.tsx
# 0 results

grep 'style={{' sites/mad-graphics/app/page.tsx | grep -v fontVariationSettings
# 0 results

grep -E '<header|<footer' sites/mad-graphics/app/page.tsx
# 0 results

cd sites/mad-graphics && npm run type-check
```

**Commit:**
```bash
git add sites/mad-graphics/app/page.tsx
git commit -m "$(cat <<'EOF'
feat(mad-graphics): homepage — cygnus visual design, config-driven, token-only

Full-screen image-overlay hero, 8-service image card grid, featured
testimonials from MDX, CTA band. All colors via theme tokens. No
custom nav/footer — layout.tsx PageShell provides chrome.

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>
EOF
)"
```

---

## Phase 4: Replace Services Page

**Goal:** Services listing matches cygnus image-card visual design with 8 Mad Graphics services.

**Model:** sonnet — new TSX file

Read in parallel before writing:
- `sites/cygnus-test/app/services/page.tsx` (visual reference)
- `sites/mad-graphics/app/services/page.tsx` (current)
- `sites/mad-graphics/site.config.ts` (siteConfig.services)

**Hard constraints:**
- No `<header>` or `<footer>` elements
- No hardcoded hex — same token mapping as Phase 3
- No "Vinyl Wrapping" card
- Default export required

Use same `SERVICE_IMAGES` map as Phase 3 (duplicate as local constant).

Structure: section header ("Our Services") → 2-3 col image card grid config-driven via `siteConfig.services` → CTA band.

```bash
# Verification gate — STOP if this fails
grep -E 'text-\[#|bg-\[#|border-\[#' sites/mad-graphics/app/services/page.tsx
# 0 results
grep -E '<header|<footer' sites/mad-graphics/app/services/page.tsx
# 0 results
cd sites/mad-graphics && npm run type-check
```

**Commit:**
```bash
git add sites/mad-graphics/app/services/page.tsx
git commit -m "$(cat <<'EOF'
feat(mad-graphics): services page — cygnus image card grid, 8 services

Replaces ContentGrid with cygnus-style image card design. 8 services
driven from siteConfig with curated stitch image assignments.

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>
EOF
)"
```

---

## Phase 5: Replace About Page

**Goal:** About page uses cygnus visual language wired to real Mad Graphics data from `siteConfig.about`.

**Model:** sonnet — new TSX file

Read in parallel before writing:
- `sites/cygnus-test/app/about/page.tsx` (visual reference)
- `sites/mad-graphics/app/about/page.tsx` (current)
- `sites/mad-graphics/site.config.ts` — about section specifically

**Hard constraints:**
- No `<header>` or `<footer>` elements
- No hardcoded hex — same token mapping
- **No team grid** — cygnus-test team (Martin Adams, Sarah Jenkins, etc.) are fictional Stitch placeholders. Omit unless `siteConfig.about.team` exists with data.
- Default export required

Wire content from siteConfig:
- `siteConfig.about.badges` → badge chips (Est. 2004, Polegate, No Vehicle Wraps)
- `siteConfig.about.story` → narrative paragraphs
- `siteConfig.about.values` → values grid
- `siteConfig.about.whyChooseUs` → checklist

```bash
# Verification gate — STOP if this fails
grep -E 'text-\[#|bg-\[#|border-\[#' sites/mad-graphics/app/about/page.tsx
# 0 results
grep -E '<header|<footer' sites/mad-graphics/app/about/page.tsx
# 0 results
cd sites/mad-graphics && npm run type-check
```

**Commit:**
```bash
git add sites/mad-graphics/app/about/page.tsx
git commit -m "$(cat <<'EOF'
feat(mad-graphics): about page — cygnus visual design, siteConfig-driven

Dark hero, story, values grid, why-choose-us all driven from
siteConfig.about. Fictional team grid omitted. Token-only colors.

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>
EOF
)"
```

---

## Phase 6: Update Locations Listing Page

**Goal:** Locations listing uses cygnus card aesthetic. Dark cards, no images. Town name + description linking to `/locations/[slug]`.

**Model:** sonnet — new TSX file, no direct reference to copy from

Read before writing:
- `sites/mad-graphics/app/locations/page.tsx` (preserve metadata + schema patterns)
- `packages/themes/cygnus/globals.css` (.card utility class)
- `sites/mad-graphics/app/services/page.tsx` (match section header pattern, written in Phase 4)

Structure:
- Preserve existing metadata + JSON-LD schema
- Replace `ContentGrid` with grid of `.card` utility cards
- Each card: `location.title` heading, `location.description` text, link to `/locations/${location.slug}`
- Data from `await getLocations()`
- No hardcoded hex; no custom nav/footer

```bash
# Verification gate — STOP if this fails
grep -E 'text-\[#|bg-\[#|border-\[#' sites/mad-graphics/app/locations/page.tsx
# 0 results
cd sites/mad-graphics && npm run type-check
```

**Commit:**
```bash
git add sites/mad-graphics/app/locations/page.tsx
git commit -m "$(cat <<'EOF'
feat(mad-graphics): locations listing — cygnus card grid design

Replaces ContentGrid with cygnus-style dark card grid. Cards show
town name and description, linking to location detail pages.

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>
EOF
)"
```

---

## Phase 7: Fix Site Creation Pipeline

**Goal:** `create-site-from-project.ts` copies page files from the theme's reference site when one exists; falls back gracefully to base-template when not.

**Model:** opus — architectural change to a ~1,100 line file; pipeline correctness is critical

Spawn two agents in parallel:
- **Agent A (opus):** implement all pipeline changes in `tools/create-site-from-project.ts`
- **Agent B (sonnet):** update `docs/architecture/how-site-creation-works.md`

**Agent A — Read before editing:**
- `tools/create-site-from-project.ts` (full file)

Find: SITES_DIR constant, the `createSite()` function body, the `generateThemeConfig()` function (or equivalent theme config generation logic).

**Step 7.1 — Add constants near top of file (after imports/existing constants):**

```typescript
/** Maps theme variant → reference site providing canonical visual page implementations. */
const THEME_REFERENCE_SITE_MAP: Record<string, string> = {
  cygnus: 'cygnus-test',
  orion:  'dj-fox-electrical',
  // vega: uses base-template directly — no override needed
};

/** Page files to copy from theme reference site (overrides base-template copies). */
const THEMED_PAGE_FILES = [
  'app/page.tsx',
  'app/services/page.tsx',
  'app/about/page.tsx',
  'app/locations/page.tsx',
] as const;
```

**Step 7.2 — Add `applyThemePageOverrides()` helper function:**

```typescript
function applyThemePageOverrides(
  themeVariant: string,
  newSiteDir: string,
  sitesDir: string,
  options: { dryRun: boolean; log: (msg: string) => void }
): void {
  const referenceSiteSlug = THEME_REFERENCE_SITE_MAP[themeVariant];
  if (!referenceSiteSlug) {
    options.log(`No reference site for theme '${themeVariant}' — using base-template pages`);
    return;
  }
  const referenceSiteDir = path.join(sitesDir, referenceSiteSlug);
  if (!fs.existsSync(referenceSiteDir)) {
    options.log(`Warning: reference site '${referenceSiteSlug}' not found — using base-template pages`);
    return;
  }
  for (const pageFile of THEMED_PAGE_FILES) {
    const src  = path.join(referenceSiteDir, pageFile);
    const dest = path.join(newSiteDir, pageFile);
    if (fs.existsSync(src)) {
      if (!options.dryRun) fs.copyFileSync(src, dest);
      options.log(`[theme:${themeVariant}] Copied ${pageFile} from ${referenceSiteSlug}`);
    }
  }
  // Copy stitch images if reference site has them
  const srcImages  = path.join(referenceSiteDir, 'public', 'stitch-images');
  const destImages = path.join(newSiteDir, 'public', 'stitch-images');
  if (fs.existsSync(srcImages) && !fs.existsSync(destImages)) {
    if (!options.dryRun) fs.cpSync(srcImages, destImages, { recursive: true });
    options.log(`[theme:${themeVariant}] Copied stitch images from ${referenceSiteSlug}`);
  }
}
```

**Step 7.3 — Call helper in `createSite()` after base-template copy:**

Immediately after the base-template recursive copy step, add:
```typescript
// Pass 2: overlay theme-specific page implementations
const themeVariant = project.theme?.themeVariant ?? 'vega';
// Note: verify the actual field name by reading the ProjectFile type — may be project.theme?.name or project.theme?.variant
applyThemePageOverrides(themeVariant, newSiteDir, SITES_DIR, { dryRun, log });
```

**Step 7.4 — Extend theme config generation to support cygnus:**

Find the `generateThemeConfig()` function (or wherever the binary vega/orion registry selection happens). Replace the binary condition with a map:

```typescript
const THEME_REGISTRY_MAP: Record<string, { packagePath: string; registry: string; defaultConfig: string }> = {
  vega:   { packagePath: '@platform/themes/vega',   registry: 'vegaRegistry',   defaultConfig: 'vegaDefaultConfig' },
  orion:  { packagePath: '@platform/themes/orion',  registry: 'orionRegistry',  defaultConfig: 'orionDefaultConfig' },
  cygnus: { packagePath: '@platform/themes/cygnus', registry: 'cygnusRegistry', defaultConfig: 'cygnusDefaultConfig' },
};
const themeEntry = THEME_REGISTRY_MAP[themeVariant] ?? THEME_REGISTRY_MAP['vega'];
// Use themeEntry.packagePath, themeEntry.registry, themeEntry.defaultConfig
// when generating the theme.config.ts template string
```

**Agent B — Docs update:**

File: `docs/architecture/how-site-creation-works.md`

Add a new section "Theme-First Visual Scaffolding" (after the existing base-template section):
- Base-template provides capability infrastructure (API routes, lib shims, config structure, analytics, consent)
- Theme reference site provides canonical visual index/listing page implementations
- Pipeline: copy base-template first (capability), then overlay theme pages (visual)
- Reference sites: cygnus → cygnus-test, orion → dj-fox-electrical, vega → no override
- Graceful fallback to base-template pages when no reference site exists

```bash
# Verification gate — STOP if this fails

# Create minimal test project JSONs (adjust field names to match actual ProjectFile schema)
cat > /tmp/test-cygnus.json << 'EOF'
{"metadata":{"projectName":"test-cygnus","status":"draft"},"business":{"name":"Test"},"theme":{"themeVariant":"cygnus"}}
EOF
cat > /tmp/test-lyra.json << 'EOF'
{"metadata":{"projectName":"test-lyra","status":"draft"},"business":{"name":"Test"},"theme":{"themeVariant":"lyra"}}
EOF

npx tsx tools/create-site-from-project.ts --project /tmp/test-cygnus.json --dry-run 2>&1 | grep -E "theme:cygnus|Copied"
# Must show: [theme:cygnus] Copied app/page.tsx from cygnus-test

npx tsx tools/create-site-from-project.ts --project /tmp/test-lyra.json --dry-run 2>&1 | grep -E "No reference|fallback|base-template"
# Must show graceful fallback message — must NOT error

pnpm type-check  # monorepo root — CRITICAL
```

**Commit:**
```bash
git add tools/create-site-from-project.ts docs/architecture/how-site-creation-works.md
git commit -m "$(cat <<'EOF'
feat(pipeline): theme-first scaffolding — copy pages from theme reference site

Adds THEME_REFERENCE_SITE_MAP and applyThemePageOverrides() to the site
creation pipeline. New sites get visual page implementations from the
theme's reference site (cygnus-test for cygnus, dj-fox-electrical for
orion) while base-template provides capability infrastructure. Graceful
fallback to base-template pages for themes without a reference site.

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>
EOF
)"
```

---

## Phase 8: Final Build Verification

**Goal:** Everything passes. No regressions across monorepo.

**Model:** haiku — run commands, report results

```bash
# Verification gate — STOP if this fails
cd /Users/rickywilson/Sites/local-business-platform/sites/mad-graphics

npm run validate:content      # all MDX files pass
npm run type-check            # 0 errors
npm run build                 # build succeeds

# Hex scan — all four ported pages
grep -rn 'text-\[#\|bg-\[#\|border-\[#\|from-\[#\|to-\[#' \
  app/page.tsx \
  app/services/page.tsx \
  app/about/page.tsx \
  app/locations/page.tsx
# Must return 0 results

# Business constraints
grep -ri "vinyl wrap\|full wrap\|vehicle wrap" app/
# 0 results (not offered by Mad Graphics)

grep -ri "Brighton\|Hove\|Portslade" app/
# 0 results (out of service area)

# Monorepo
cd /Users/rickywilson/Sites/local-business-platform
pnpm type-check
pnpm lint
```

---

## Cost Estimate

| Phase | Model | Est. input tokens | Est. output tokens | Est. cost |
|-------|-------|------------------|--------------------|-----------|
| Phase 0: Pre-flight | haiku | ~2k | ~0.5k | ~$0.00 |
| Phase 1: locationName field | sonnet | ~18k | ~6k | ~$0.15 |
| Phase 2: Copy images | haiku | ~2k | ~0.5k | ~$0.00 |
| Phase 3: Homepage | sonnet | ~25k | ~8k | ~$0.20 |
| Phase 4: Services page | sonnet | ~20k | ~6k | ~$0.15 |
| Phase 5: About page | sonnet | ~20k | ~6k | ~$0.15 |
| Phase 6: Locations page | sonnet | ~15k | ~4k | ~$0.10 |
| Phase 7: Pipeline (opus) | opus | ~35k | ~8k | ~$1.13 |
| Phase 8: Verification | haiku | ~10k | ~1k | ~$0.01 |
| **Total** | | **~147k** | **~40k** | **~$1.89** |

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

After completing all phases, append to `output/sessions/2026-04-06_mad-graphics-cygnus-theme/yolo-brief.md`:

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
- The Co-Authored-By line in commits must reflect the orchestrator model used (e.g., `Claude Sonnet 4.6` not `Opus 4.6`)
- Pipeline tools were modified in Phase 7 — the final verification gate MUST confirm `pnpm type-check` passes at monorepo root

---

## Completed

**Date:** 2026-04-06
**Status:** All phases executed successfully

Implemented all 8 phases of the Mad Graphics cygnus theming plan. Phase 1 added `locationName` to the location Zod schema and all 19 MDX files so the nav dropdown shows bare town names. Phase 2 copied 26 stitch images (force-added past gitignore for placeholder use). Phases 3–6 replaced the four key pages (homepage, services, about, locations) with cygnus visual design — dark backgrounds, image card grids, token-only colors, no custom nav/footer. Phase 7 added `THEME_REFERENCE_SITE_MAP` and `applyThemePageOverrides()` to the site creation pipeline plus `cygnusDefaultConfig` to `THEME_REGISTRY_MAP`, and extended the `ProjectFile` schema to allow `cygnus` as a `themeVariant` value. A post-Phase-8 lint fix was also committed to replace `<a>` with `<Link>` for internal navigation. All verification gates passed.

### Commits
- `0596164` fix(mad-graphics): add locationName field for bare nav labels
- `86067fe` feat(mad-graphics): add stitch images (temporary placeholders pending R2 pipeline)
- `8dfb77a` feat(mad-graphics): homepage — cygnus visual design, config-driven, token-only
- `9b58cfa` feat(mad-graphics): services page — cygnus image card grid, 8 services
- `5c9e0e0` feat(mad-graphics): about page — cygnus visual design, siteConfig-driven
- `323c562` feat(mad-graphics): locations listing — cygnus card grid design
- `66bf80d` feat(pipeline): theme-first scaffolding — copy pages from theme reference site
- `d20df87` fix(mad-graphics): replace <a> with Link for internal navigation
