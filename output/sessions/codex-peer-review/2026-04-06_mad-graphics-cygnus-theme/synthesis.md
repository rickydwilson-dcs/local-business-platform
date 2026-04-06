# Implementation Plan: Mad Graphics — Cygnus Theming + Theme-First Pipeline

**Date:** 2026-04-06
**Status:** Ready for implementation — approved by dual-model peer review
**Source:** Synthesised from Claude and Codex independent plans

---

## Key Differences Between Plans

| Aspect | Claude | Codex | Synthesised Decision |
|--------|--------|-------|----------------------|
| **Location title fix mechanism** | Add `locationName` field to MDX (new field, keep `title` as full SEO string, update `layout.tsx` mapping + content schema) | Change `title` field to bare town name, keep `seoTitle` for SEO (simpler, no schema change) | **Use `locationName` field.** User decided this before synthesis. Keeps `title` driving page `<h1>` and breadcrumbs at full descriptive value; `locationName` is the nav display name. Requires updating content schema Zod type + `layout.tsx` mapping. |
| **Services page — data source** | Config-driven cards via `siteConfig.services` with a `SERVICE_IMAGES` map (slug → stitch image) | Config/content-driven via `getServices()` / `siteConfig.services` in cygnus visual layout | **Agreement: config-driven.** Both plans converge on this. Use `siteConfig.services` to drive 8 cards in cygnus image-card visual layout. Curate `SERVICE_IMAGES` map (slug → stitch image path) as a local constant. |
| **About page — team section** | Omit team grid entirely (cygnus-test team members are fictional Stitch placeholders) | Do not port fake team identities; map content to `siteConfig.about` | **Agreement: no team grid.** Both plans agree. Render story, values, whyChooseUs, badges from `siteConfig.about`. Omit team section. |
| **Locations listing page** | Build a cygnus-styled card layout (no image, dark card with town name and description, using `.card` utility) | Replace `ContentGrid` with image-forward card grid aligned with services page | **Dark card grid, no images.** Location cards don't have dedicated stitch images. Use the cygnus `.card` utility (dark bg, border, padding) in a grid — cleaner than forcing stitch images onto locations. |
| **Pipeline page file source** | Pipeline copies pages from the fixed mad-graphics pages (after they are corrected in Phase 3-5), not directly from cygnus-test | Pipeline copies from cygnus-test reference site (`THEME_REFERENCE_SITES` map) | **Copy from cygnus-test (reference site).** Mad Graphics pages will be fixed versions of cygnus-test. The pipeline should copy from the canonical reference (`cygnus-test`), not from a specific client site. |
| **Pipeline implementation structure** | `THEME_REFERENCE_SITES` map + loop over `THEME_PAGE_FILES` array; also copies stitch images | `THEME_REFERENCE_SITE_MAP` + `THEMED_PAGE_PATHS` + named helper function `applyThemePageOverrides()` | **Use Codex's structured approach.** Named helper function with explicit map and structured logs is more maintainable at ~1,100 lines. |
| **cygnus-test pages — strip nav/footer** | Fix cygnus-test pages too (strip custom nav/footer so they are layout-consistent) | Non-goals state do not modify cygnus-test | **Do NOT modify cygnus-test.** Non-goals are explicit. Mad Graphics pages are written fresh from scratch (using cygnus-test as visual reference only, not a direct copy). |
| **Pre-flight scope check** | Not explicitly included | Explicit Phase 0 scope validation before any code changes | **Include Phase 0.** Good practice — confirm branch, file counts, starting state before touching files. |
| **`style={{}}` inline styles** | Not explicitly called out | Add to hex-removal verification gate | **Include in verification gate.** `style={{ fontVariationSettings: ... }}` for Material Symbols is acceptable (not a color); filter for color-relevant inline styles only. |

---

## Blind Spots Caught

### What Codex caught that Claude missed

- **Next.js default export constraint.** The brief says "named exports only (no default exports in TSX files)" — but Next.js App Router *requires* default exports for `app/**/page.tsx` and `layout.tsx`. Codex explicitly flagged this conflict. **Resolution:** Retain required default exports for route files; enforce named exports everywhere else (components, utilities, lib).

- **Stitch image count discrepancy.** Brief stated 28 images; Codex noted the actual repo count is 26. This must be verified before implementation to avoid acceptance criteria mismatch.

- **Structured helper functions in pipeline.** Claude's pipeline approach (loop + inline copy) would work but adds complexity inline. Codex proposed named helper functions (`resolveThemeRegistry`, `resolveReferenceSite`, `applyThemePageOverrides`). This is more maintainable.

- **Asset provenance risk.** Stitch images are reference assets — their production use status should be noted. Claude's plan treated them as permanent without flagging this.

### What Claude caught that Codex missed

- **`locationName` field approach.** Codex proposed changing `title` to bare town name. Claude (and the user) identified that `title` drives page `<h1>` and breadcrumbs, so changing it silently downgrades those. A new `locationName` field preserves the full descriptive title where useful and provides a clean nav label. Codex's approach would show "Eastbourne" as the `<h1>` on the location detail page.

- **Content schema update required.** Adding `locationName` to MDX frontmatter requires updating the Zod location schema in `packages/core-components/src/lib/content-schemas.ts`. Codex's `title` approach avoided this but created the `<h1>` problem above.

- **`getTestimonials()` availability.** Mad Graphics homepage needs testimonials from MDX content. Claude flagged that `getTestimonials()` may not be exported from the `lib/content.ts` shim. Must verify before writing homepage code.

- **`SERVICE_IMAGES` map with curated slug-to-image assignments.** Codex noted config-driven services but didn't specify how images are assigned. Claude provided an explicit curated map (8 services → specific stitch images), which matters for visual coherence.

- **Hex token mapping table.** Claude provided a complete mapping from cygnus-test hardcoded hex values to platform token classes. Codex said "use tokens" but didn't enumerate. Needed to avoid guesswork during implementation.

---

## Pre-decided Items (not open for re-synthesis)

- **`locationName` field approach** — decided by user before synthesis. Not up for debate.
- **No custom `<header>`/`<footer>` in page files** — hard constraint from project rules.
- **No vehicle wraps** — hard business constraint for Mad Graphics.

---

## Implementation Plan

### Phase 0: Pre-flight

```bash
git checkout develop && git pull

# Confirm starting state
ls sites/mad-graphics/content/locations/*.mdx | wc -l   # must be 19
ls sites/cygnus-test/public/stitch-images/ | wc -l      # record actual count (26 or 28)
pnpm type-check                                          # must be clean before starting
```

Record the actual stitch image count. Acceptance criteria will reference this number, not "28".

---

### Phase 1: Fix Location Nav Labels — `locationName` Field

**Goal:** Nav dropdown shows "Eastbourne", not "Vehicle Graphics & Signs in Eastbourne". Page `<h1>` and breadcrumbs remain unchanged.

**Step 1.1 — Update content schema**

File: `packages/core-components/src/lib/content-schemas.ts`

Add `locationName` as optional field to the location Zod schema:
```typescript
locationName: z.string().optional(),
```

Check whether the return type from `getContentItems('locations')` is typed. If it returns a typed object, add `locationName?: string` to the TypeScript type. If it returns `Record<string, unknown>`, the `locationName ?? title` fallback in layout.tsx will still work via casting.

**Step 1.2 — Add `locationName` to all 19 location MDX files**

Files: `sites/mad-graphics/content/locations/*.mdx` (all 19)

For each file, add `locationName` immediately after the `title` line:
```yaml
title: "Vehicle Graphics & Signs in Eastbourne"
locationName: "Eastbourne"
seoTitle: "Vehicle Graphics & Signs in Eastbourne | Mad Graphics East Sussex"
```

Town name list for the 19 files:
`Eastbourne`, `Hastings`, `Lewes`, `Bexhill-on-Sea`, `Uckfield`, `Crowborough`, `Seaford`, `Hailsham`, `Newhaven`, `Polegate`, `Peacehaven`, `Battle`, `St Leonards-on-Sea`, `Heathfield`, `Pevensey`, `Ringmer`, `Herstmonceux`, `Wadhurst`, `Alfriston`

**Step 1.3 — Update `layout.tsx` location mapping**

File: `sites/mad-graphics/app/layout.tsx`

Change the location mapping:
```typescript
// Before
const locationItems = allLocations.map((loc) => ({
  name: loc.title,
  slug: loc.slug,
}));

// After
const locationItems = allLocations.map((loc) => ({
  name: (loc as { locationName?: string; title: string }).locationName ?? loc.title,
  slug: loc.slug,
}));
```

(If `locationName` is typed via the schema update, the cast is not needed.)

**Verification Gate 1:**
```bash
# locationName present in all 19 files
grep -c "^locationName:" sites/mad-graphics/content/locations/*.mdx
# Each file should show :1

# title unchanged (still full SEO string)
grep "^title:" sites/mad-graphics/content/locations/eastbourne.mdx
# Should still show: title: "Vehicle Graphics & Signs in Eastbourne"

# Content validation
cd sites/mad-graphics && npm run validate:content
npm run type-check
```

**Commit:**
```bash
git add sites/mad-graphics/content/locations/ \
        sites/mad-graphics/app/layout.tsx \
        packages/core-components/src/lib/content-schemas.ts
git commit -m "fix(mad-graphics): add locationName to location MDX for bare nav labels"
```

---

### Phase 2: Copy Stitch Images

**Goal:** Make stitch images available in mad-graphics for page rendering.

**Note on provenance:** These are Stitch-generated reference images. Treat as approved placeholders pending confirmation from design owner. Record in commit message.

```bash
cp -r sites/cygnus-test/public/stitch-images sites/mad-graphics/public/stitch-images
```

**Verification Gate 2:**
```bash
EXPECTED=$(ls sites/cygnus-test/public/stitch-images/ | wc -l)
ACTUAL=$(ls sites/mad-graphics/public/stitch-images/ | wc -l)
echo "Expected: $EXPECTED, Actual: $ACTUAL"
# Must match

ls sites/mad-graphics/public/stitch-images/img-006.jpg  # hero image — must exist
```

**Commit:**
```bash
git add sites/mad-graphics/public/stitch-images/
git commit -m "feat(mad-graphics): add stitch images (temporary placeholders pending R2 pipeline)"
```

---

### Phase 3: Replace Homepage

**Goal:** Mad Graphics homepage matches cygnus visual design. No custom nav/footer. All hex → tokens. Config-driven services.

**Pre-check:** Verify `getTestimonials()` is exported from `sites/mad-graphics/lib/content.ts`. If not, add it as a pass-through from the core-components factory.

**Key decisions:**
- Strip `<header>` and `<footer>` from cygnus-test reference — layout.tsx handles these
- Services: 8 cards driven from `siteConfig.services` with curated `SERVICE_IMAGES` map
- Testimonials: pulled from `getTestimonials()` (max 2 featured)
- Hero: `/stitch-images/img-006.jpg` (not `getImageUrl()` — no R2 asset yet)
- Remove "Vinyl Wrapping" — not a Mad Graphics service

**SERVICE_IMAGES mapping:**
```typescript
const SERVICE_IMAGES: Record<string, string> = {
  'vehicle-graphics':    '/stitch-images/img-025.jpg',
  'signs-signage':       '/stitch-images/img-003.jpg',
  'banners':             '/stitch-images/img-002.jpg',
  'large-format-print':  '/stitch-images/img-006.jpg',
  'marketing-print':     '/stitch-images/img-010.jpg',
  'stickers-labels':     '/stitch-images/img-008.jpg',
  'workwear-merchandise':'/stitch-images/img-015.jpg',
  'graphic-design':      '/stitch-images/img-019.jpg',
};
```

**Hex → token mapping (apply throughout all Phase 3-6 pages):**

| Hardcoded hex | Token class |
|--------------|-------------|
| `#131313` | `bg-surface-background` |
| `#0e0e0e` | `bg-surface-muted` |
| `#f7941d`, `#F7941D` | `text-brand-primary` / `bg-brand-primary` |
| `#5BA829`, `#5ba829` | `text-brand-secondary` |
| `#dac2af`, `#dec498` | `text-surface-muted-foreground` |
| `#613500` | `text-brand-on-primary` (verify token exists; use `text-[var(--color-brand-on-primary)]` if not) |
| `#2d1600` | `text-brand-on-primary` |
| `#e5e2e1`, `#E5E2E1` | `text-surface-foreground` |
| `#544435` | `border-surface-border` |
| rgba shadows with hex | Remove or replace with Tailwind shadow utilities |

**Note:** `style={{ fontVariationSettings: ... }}` on Material Symbols icons is acceptable — not a color value.

**Page structure:**
```tsx
export default async function HomePage() {
  const testimonials = await getTestimonials();
  const featured = testimonials.filter(t => t.featured).slice(0, 2);

  return (
    <main>
      {/* Hero */}
      {cygnusRegistry.heroVariant === 'image-overlay' ? (
        <ImageOverlayHero
          headline="Vehicle Graphics, Signs"
          headlineAccent="& Print."
          subheadline={siteConfig.tagline}
          backgroundImage="/stitch-images/img-006.jpg"
          backgroundImageAlt="Wide-format print workshop at Mad Graphics, Polegate"
          primaryCta={{ label: siteConfig.cta.primary.label, href: '/contact' }}
          secondaryCta={{ label: 'Our Work', href: '/projects' }}
          badge="Est. 2004 — Polegate, East Sussex"
          stats={[
            { value: '20+', label: 'Years Experience' },
            { value: '5,000+', label: 'Projects Completed' },
            { value: '5★', label: 'Client Rated' },
          ]}
        />
      ) : (
        <section className="section bg-gradient-to-b from-brand-primary/5 to-surface-background">
          {/* fallback — base-template style */}
        </section>
      )}

      {/* Services Grid — 8 cards, config-driven */}
      <section id="services" className="py-32 px-8 max-w-7xl mx-auto">
        ...
      </section>

      {/* Testimonials — MDX-driven, max 2 featured */}
      {featured.length > 0 && (
        <section className="bg-surface-muted py-32">...</section>
      )}

      {/* CTA Band */}
      <section className="bg-brand-primary py-24">...</section>
    </main>
  );
}
```

**Verification Gate 3:**
```bash
# No hardcoded hex colors
grep -E 'text-\[#|bg-\[#|border-\[#|from-\[#|to-\[#' sites/mad-graphics/app/page.tsx
# 0 results

# No inline color styles (fontVariationSettings is OK)
grep 'style={{' sites/mad-graphics/app/page.tsx | grep -v fontVariationSettings
# 0 results

# No custom header/footer
grep -E '<header|<footer' sites/mad-graphics/app/page.tsx
# 0 results

cd sites/mad-graphics && npm run type-check
```

**Commit:**
```bash
git add sites/mad-graphics/app/page.tsx
git commit -m "feat(mad-graphics): homepage — cygnus visual design, config-driven, token-only"
```

---

### Phase 4: Replace Services Page

**Goal:** Services listing matches cygnus image-card visual design with 8 Mad Graphics services.

Port cygnus-test services page structure:
- Dark section header ("Our Services" / "What we do")
- 2-3 column image card grid, config-driven from `siteConfig.services`
- Each card: `SERVICE_IMAGES[service.slug]` image, category label (service title), description, "Learn more" link → `/services/${service.slug}`
- CTA band at bottom
- No custom nav/footer

`SERVICE_IMAGES` map is the same as Phase 3 — extract to a shared local constant or duplicate. No "Vinyl Wrapping" card (not in `siteConfig.services`). Apply full hex → token mapping.

**Verification Gate 4:**
```bash
grep -E 'text-\[#|bg-\[#|border-\[#' sites/mad-graphics/app/services/page.tsx
# 0 results
grep -E '<header|<footer' sites/mad-graphics/app/services/page.tsx
# 0 results
cd sites/mad-graphics && npm run type-check
```

**Commit:**
```bash
git add sites/mad-graphics/app/services/page.tsx
git commit -m "feat(mad-graphics): services page — cygnus image card grid, 8 services"
```

---

### Phase 5: Replace About Page

**Goal:** About page uses cygnus visual language, wired to real Mad Graphics data from `siteConfig.about`.

Structure (from cygnus-test visual reference, content from siteConfig):
- Dark hero section with `siteConfig.about.badges` as chips (Est. 2004, Polegate, No Vehicle Wraps)
- Story section: `siteConfig.about.story` paragraphs (not hardcoded Martin Adams narrative)
- Values grid: `siteConfig.about.values` (not hardcoded Precision/Creativity/Reliability)
- Why Choose Us: `siteConfig.about.whyChooseUs` checklist
- **No team grid** — fictional placeholder data from cygnus-test; omit entirely unless `siteConfig.about.team` exists
- CTA section
- No custom nav/footer; hex → tokens throughout

**Verification Gate 5:**
```bash
grep -E 'text-\[#|bg-\[#|border-\[#' sites/mad-graphics/app/about/page.tsx
# 0 results
grep -E '<header|<footer' sites/mad-graphics/app/about/page.tsx
# 0 results
cd sites/mad-graphics && npm run type-check
```

**Commit:**
```bash
git add sites/mad-graphics/app/about/page.tsx
git commit -m "feat(mad-graphics): about page — cygnus visual design, siteConfig-driven content"
```

---

### Phase 6: Update Locations Listing Page

**Goal:** Locations listing uses cygnus card aesthetic — dark cards, no images (locations have no dedicated stitch images).

No direct reference to copy from (both cygnus-test and mad-graphics have identical platform `ContentGrid` here). Build new implementation:
- Same section header pattern as services page
- Grid of location cards using `.card` utility (from cygnus globals.css)
- Each card: `location.title` as heading, `location.description`, link to `/locations/${location.slug}`
- Data from `getLocations()` (MDX content)
- No hardcoded hex; no custom nav/footer

**Verification Gate 6:**
```bash
grep -E 'text-\[#|bg-\[#|border-\[#' sites/mad-graphics/app/locations/page.tsx
# 0 results
cd sites/mad-graphics && npm run type-check
```

**Commit:**
```bash
git add sites/mad-graphics/app/locations/page.tsx
git commit -m "feat(mad-graphics): locations listing — cygnus card grid design"
```

---

### Phase 7: Fix Site Creation Pipeline

**Goal:** `create-site-from-project.ts` copies page files from the theme's reference site when one exists.

**Step 7.1 — Add theme support map and helper constants**

Near the top of `tools/create-site-from-project.ts`, add:

```typescript
/** Maps theme variant name to the reference site slug that defines its visual page implementations. */
const THEME_REFERENCE_SITE_MAP: Record<string, string> = {
  cygnus: 'cygnus-test',
  orion:  'dj-fox-electrical',
  // vega uses base-template directly — no override needed
};

/** Page files to copy from theme reference site (overrides base-template copies). */
const THEMED_PAGE_FILES = [
  'app/page.tsx',
  'app/services/page.tsx',
  'app/about/page.tsx',
  'app/locations/page.tsx',
] as const;
```

**Step 7.2 — Add `applyThemePageOverrides()` helper**

```typescript
function applyThemePageOverrides(
  themeVariant: string,
  newSiteDir: string,
  options: { dryRun: boolean; log: (msg: string) => void }
): void {
  const referenceSiteSlug = THEME_REFERENCE_SITE_MAP[themeVariant];
  if (!referenceSiteSlug) {
    options.log(`No reference site for theme '${themeVariant}' — using base-template pages`);
    return;
  }

  const referenceSiteDir = path.join(SITES_DIR, referenceSiteSlug);
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
  const srcImages  = path.join(referenceSiteDir, 'public/stitch-images');
  const destImages = path.join(newSiteDir, 'public/stitch-images');
  if (fs.existsSync(srcImages) && !fs.existsSync(destImages)) {
    if (!options.dryRun) fs.cpSync(srcImages, destImages, { recursive: true });
    options.log(`[theme:${themeVariant}] Copied stitch images from ${referenceSiteSlug}`);
  }
}
```

**Step 7.3 — Call helper after base-template copy**

In `createSite()`, immediately after the base-template copy step and before config generation:
```typescript
applyThemePageOverrides(project.theme?.themeVariant ?? 'vega', newSiteDir, { dryRun, log });
```

**Step 7.4 — Extend theme config generation to include cygnus**

Update `generateThemeConfig()` to handle cygnus (and other themes) rather than only vega/orion binary:

```typescript
const THEME_REGISTRY_MAP: Record<string, { import: string; registry: string; defaultConfig: string }> = {
  vega:   { import: '@platform/themes/vega',   registry: 'vegaRegistry',   defaultConfig: 'vegaDefaultConfig' },
  orion:  { import: '@platform/themes/orion',  registry: 'orionRegistry',  defaultConfig: 'orionDefaultConfig' },
  cygnus: { import: '@platform/themes/cygnus', registry: 'cygnusRegistry', defaultConfig: 'cygnusDefaultConfig' },
};
// Fallback to vega for unknown themes
```

**Step 7.5 — Update architecture doc**

File: `docs/architecture/how-site-creation-works.md`

Add section: "Theme-First Visual Scaffolding" — explains base-template provides capability infrastructure, theme reference site provides index/listing page implementations, fallback to base-template when no reference site exists.

**Verification Gate 7:**
```bash
# Dry-run with cygnus project
npx tsx tools/create-site-from-project.ts \
  --project /tmp/test-cygnus.json --dry-run
# Log must show: "[theme:cygnus] Copied app/page.tsx from cygnus-test"

# Dry-run with lyra project (no reference site)
npx tsx tools/create-site-from-project.ts \
  --project /tmp/test-lyra.json --dry-run
# Log must show: "No reference site for theme 'lyra' — using base-template pages"
# Must not error/crash

pnpm type-check  # monorepo root
```

**Commit:**
```bash
git add tools/create-site-from-project.ts docs/architecture/how-site-creation-works.md
git commit -m "feat(pipeline): theme-first scaffolding — copy page implementations from theme reference site"
```

---

### Phase 8: Final Build Verification

```bash
# Mad Graphics
cd sites/mad-graphics
npm run validate:content      # all 74 MDX files pass
npm run type-check            # 0 errors
npm run build                 # build succeeds

# Hex scan across all ported pages
grep -rn 'text-\[#\|bg-\[#\|border-\[#\|from-\[#\|to-\[#' \
  sites/mad-graphics/app/page.tsx \
  sites/mad-graphics/app/services/page.tsx \
  sites/mad-graphics/app/about/page.tsx \
  sites/mad-graphics/app/locations/page.tsx
# Must return 0 results

# Business constraints
grep -ri "vinyl wrap\|full wrap\|vehicle wrap" sites/mad-graphics/app/
# 0 results (wraps not offered)

grep -ri "Brighton\|Hove\|Portslade" sites/mad-graphics/app/
# 0 results (out of area)

# Monorepo
cd /path/to/root && pnpm type-check && pnpm lint
```

---

## Files Summary

| File | Action | Phase |
|------|--------|-------|
| `packages/core-components/src/lib/content-schemas.ts` | MODIFY — add optional `locationName` to location Zod schema | 1 |
| `sites/mad-graphics/content/locations/*.mdx` (19 files) | MODIFY — add `locationName: "Town"` field | 1 |
| `sites/mad-graphics/app/layout.tsx` | MODIFY — `name: loc.locationName ?? loc.title` | 1 |
| `sites/mad-graphics/public/stitch-images/` | CREATE — copy from `sites/cygnus-test/public/stitch-images/` | 2 |
| `sites/mad-graphics/app/page.tsx` | REPLACE — cygnus visual design, config-driven | 3 |
| `sites/mad-graphics/app/services/page.tsx` | REPLACE — cygnus image card grid, 8 services | 4 |
| `sites/mad-graphics/app/about/page.tsx` | REPLACE — cygnus visual, siteConfig-driven content | 5 |
| `sites/mad-graphics/app/locations/page.tsx` | REPLACE — cygnus card grid (no images) | 6 |
| `tools/create-site-from-project.ts` | MODIFY — theme-first two-pass scaffold | 7 |
| `docs/architecture/how-site-creation-works.md` | MODIFY — document theme-first pattern | 7 |

**Files NOT modified:**
- `sites/mad-graphics/layout.tsx` — correct as-is (except location mapping in Phase 1)
- `sites/mad-graphics/theme.config.ts` — correct
- `sites/mad-graphics/globals.css` — correct
- `sites/mad-graphics/tailwind.config.ts` — correct
- All `[slug]/page.tsx` files — not in scope
- `sites/cygnus-test/` — read-only reference, not modified
- `sites/dj-fox-electrical/`, `sites/colossus-scaffolding/` — not in scope

---

## Risks

| Risk | Severity | Mitigation |
|------|----------|------------|
| `getTestimonials()` not exported from `lib/content.ts` shim | Medium | Check before Phase 3; add export if missing |
| `text-brand-on-primary` token may not exist in theme-system | Medium | Check `packages/theme-system/src/types.ts`; use `text-[var(--color-brand-on-primary)]` if missing |
| `locationName` type not available on `getContentItems` return | Low | Use type cast fallback; or type properly via schema update |
| Stitch images are reference/placeholder assets (provenance) | Low | Document in commit; treat as temporary pending R2 pipeline |
| Stitch image count is 26 not 28 (brief discrepancy) | Low | Verify in Phase 0; acceptance criteria uses actual count |
| Next.js requires default exports for route files | Low | Retain required default exports; enforce named exports for non-route files only |
| Pipeline `project.theme.themeVariant` field name may differ | Medium | Read actual `ProjectFile` schema type before implementing Phase 7 |
