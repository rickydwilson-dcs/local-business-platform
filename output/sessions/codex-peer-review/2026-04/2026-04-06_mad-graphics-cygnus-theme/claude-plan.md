# Claude's Plan: Mad Graphics — Full Cygnus Theming + Theme-First Pipeline

**Date:** 2026-04-06
**Author:** Claude (independent, pre-synthesis)

---

## Phase 0: Pre-flight

```bash
git checkout develop && git pull
pnpm type-check  # must be clean before starting
```

---

## Phase 1: Add `locationName` Field to Location MDX Files (19 files)

**Goal:** Add a bare town name field to location MDX so the nav dropdown shows "Eastbourne" not "Vehicle Graphics & Signs in Eastbourne", without touching `title` (which drives page `<h1>`) or `seoTitle`.

**Decision (confirmed by user):** Add a new `locationName` frontmatter field. Keep `title` and `seoTitle` unchanged. Change `layout.tsx` to use `locationName` for nav display.

This is the cleanest approach:

- `title` = "Vehicle Graphics & Signs in Eastbourne" → page heading, breadcrumbs, content grid cards
- `seoTitle` = "Vehicle Graphics & Signs in Eastbourne | Mad Graphics East Sussex" → `<title>` tag
- `locationName` = "Eastbourne" → nav dropdown label, footer location list

**Step 1.1 — Check the content schema**

Read `packages/core-components/src/lib/content-schemas.ts` to find the location Zod schema. Add `locationName: z.string().optional()` to the location schema so the field is recognised and typed.

Check the `getContentItems` return type — confirm whether frontmatter fields are typed or returned as `Record<string, unknown>`. If typed, the TypeScript type for location objects needs `locationName?: string`.

**Step 1.2 — Add `locationName` to all 19 location MDX files**

Files: `sites/mad-graphics/content/locations/*.mdx` (19 files)

For each file, add after the existing `title` line:

```yaml
title: "Vehicle Graphics & Signs in Eastbourne"
locationName: "Eastbourne"
seoTitle: "Vehicle Graphics & Signs in Eastbourne | Mad Graphics East Sussex"
```

Full `locationName` values (bare town names):
Eastbourne, Hastings, Lewes, Bexhill-on-Sea, Uckfield, Crowborough, Seaford, Hailsham, Newhaven, Polegate, Peacehaven, Battle, St Leonards-on-Sea, Heathfield, Pevensey, Ringmer, Herstmonceux, Wadhurst, Alfriston

**Step 1.3 — Update `layout.tsx` location mapping**

File: `sites/mad-graphics/app/layout.tsx`

Change:

```typescript
const locationItems = allLocations.map((loc) => ({
  name: loc.title,
  slug: loc.slug,
}));
```

to:

```typescript
const locationItems = allLocations.map((loc) => ({
  name: loc.locationName ?? loc.title,
  slug: loc.slug,
}));
```

**Verification Gate 1:**

```bash
# Confirm locationName present in all 19 files
grep -c "^locationName:" sites/mad-graphics/content/locations/*.mdx | grep -v ":1"
# Must return nothing (all files have exactly 1 match)

# Confirm title unchanged
grep "^title: \"Vehicle Graphics" sites/mad-graphics/content/locations/eastbourne.mdx
# Must still show the full SEO title

npm run validate:content --prefix sites/mad-graphics
# Must pass

cd sites/mad-graphics && npm run type-check
```

**Commit:**

```bash
git add sites/mad-graphics/content/locations/ sites/mad-graphics/app/layout.tsx packages/core-components/src/lib/content-schemas.ts
git commit -m "fix(mad-graphics): add locationName field to location MDX for bare nav labels"
```

---

## Phase 2: Copy Stitch Images

**Goal:** Make the 28 stitch images available in `sites/mad-graphics/public/`.

**Decision:** Copy (not symlink) the images. Each site's `public/` is independent — Vercel serves static assets per-site. Symlinks would break on Vercel. The stitch images are appropriate for mad-graphics as they are print/graphics/signage industry images matching the business type. They are not cygnus-test-specific IP.

**Step 2.1:**

```bash
cp -r sites/cygnus-test/public/stitch-images sites/mad-graphics/public/stitch-images
```

**Verification Gate 2:**

```bash
ls sites/mad-graphics/public/stitch-images/ | wc -l
# Must be 28

# Spot check
ls sites/mad-graphics/public/stitch-images/img-006.jpg
# Must exist (hero image)
```

**Commit:**

```bash
git add sites/mad-graphics/public/stitch-images/
git commit -m "feat(mad-graphics): add stitch images for cygnus page design"
```

---

## Phase 3: Replace Homepage (`app/page.tsx`)

**Goal:** Mad Graphics homepage matches cygnus-test visual design.

**Key decisions:**

**3a. Strip custom nav and footer.** The cygnus-test `page.tsx` renders a fixed `<header>` nav and a `<footer>` inline. Mad Graphics uses `layout.tsx` → `PageShell` → `SiteHeader` + `Footer`. The ported page must contain only `<main>` content (hero, services, testimonials, CTA).

**3b. Services grid — config-driven, not hardcoded.** Cygnus-test hardcodes 6 generic service cards. Mad Graphics has 8 specific services in `siteConfig.services`. Use the same visual card design (image, category label, title, description, "Learn more" link) but drive data from `siteConfig.services`. Map each service to a stitch image (assign img-\*.jpg paths by index or curated mapping).

Mad Graphics services → stitch image mapping:
| Service | Slug | Image |
|---------|------|-------|
| Vehicle Graphics | vehicle-graphics | img-025.jpg (vinyl/car) |
| Signs & Signage | signs-signage | img-003.jpg (building signage) |
| Banners | banners | img-002.jpg (print workshop) |
| Large Format Print | large-format-print | img-006.jpg (large format) |
| Marketing Print | marketing-print | img-010.jpg (print press) |
| Stickers & Wall Graphics | stickers-labels | img-008.jpg (vinyl graphics) |
| Workwear & Merchandise | workwear-merchandise | img-019.jpg (design workspace) |
| Graphic Design | graphic-design | img-015.jpg (exhibition/display) |

**3c. Testimonials — MDX-driven.** Pull from `content/testimonials/` via `getTestimonials()` rather than hardcoding. Show max 2 featured testimonials. If fewer than 2 exist, render however many are available.

**3d. CTA band colors — use theme tokens.** `bg-[#f7941d]` → `bg-brand-primary`. `text-[#613500]` → `text-brand-on-primary`. `bg-[#131313]` → `bg-surface-background`.

**3e. Hero image.** Use `/stitch-images/img-006.jpg` (same as cygnus-test). Not `getImageUrl()` — no R2 asset exists yet.

**3f. Hardcoded hex removal — complete mapping:**

| Cygnus-test hex      | Token class                                                             |
| -------------------- | ----------------------------------------------------------------------- |
| `#131313`            | `bg-surface-background` / `text-surface-foreground` (context-dependent) |
| `#0e0e0e`            | `bg-surface-muted`                                                      |
| `#f7941d`, `#F7941D` | `text-brand-primary` / `bg-brand-primary`                               |
| `#5BA829`            | `text-brand-secondary`                                                  |
| `#dac2af`, `#dec498` | `text-surface-muted-foreground`                                         |
| `#613500`            | `text-brand-on-primary`                                                 |
| `#2d1600`            | `text-brand-on-primary`                                                 |
| `#e5e2e1`, `#E5E2E1` | `text-surface-foreground`                                               |
| `#544435`            | `border-surface-border`                                                 |

**Risk:** `text-brand-on-primary` — check if this token exists in `packages/theme-system/src/types.ts`. If not, use `text-[var(--color-brand-on-primary)]` or hardcode as a CSS variable reference. Do not hardcode the hex value.

**Output file:** `sites/mad-graphics/app/page.tsx`

Structure:

```tsx
import type { Metadata } from 'next';
import { ImageOverlayHero } from '@platform/core-components';
import { cygnusRegistry } from '@platform/themes/cygnus';
import { siteConfig } from '@/site.config';
import { getTestimonials } from '@/lib/content';

export const metadata: Metadata = { ... };  // from siteConfig

const SERVICE_IMAGES: Record<string, string> = { ... };  // slug → image path

export default async function HomePage() {
  const testimonials = await getTestimonials();
  const featured = testimonials.filter(t => t.featured).slice(0, 2);

  return (
    <main>
      {/* Hero */}
      {cygnusRegistry.heroVariant === 'image-overlay' ? (
        <ImageOverlayHero ... />
      ) : (
        <section className="section bg-gradient-to-b from-brand-primary/5 to-surface-background">
          {/* fallback */}
        </section>
      )}

      {/* Services Grid */}
      <section id="services" className="py-32 px-8 max-w-7xl mx-auto">
        {siteConfig.services.map((service) => (
          <ServiceCard key={service.slug} service={service} image={SERVICE_IMAGES[service.slug]} />
        ))}
      </section>

      {/* Testimonials */}
      {featured.length > 0 && (
        <section className="bg-surface-muted py-32"> ... </section>
      )}

      {/* CTA Band */}
      <section className="bg-brand-primary py-24"> ... </section>
    </main>
  );
}
```

**Verification Gate 3:**

```bash
# No hardcoded hex in the file
grep -E 'text-\[#|bg-\[#|border-\[#|text-\[.#' sites/mad-graphics/app/page.tsx
# Must return 0 results

# No custom header/footer
grep -E '<header|<footer' sites/mad-graphics/app/page.tsx
# Must return 0 results

cd sites/mad-graphics && npm run type-check
```

**Commit:**

```bash
git add sites/mad-graphics/app/page.tsx
git commit -m "feat(mad-graphics): replace homepage with cygnus-theme visual design"
```

---

## Phase 4: Replace Services Page (`app/services/page.tsx`)

**Goal:** Services listing matches cygnus-test visual style (image card grid).

**Decision:** Config-driven cards using `siteConfig.services` + `SERVICE_IMAGES` map (same map as homepage, extracted to a shared local constant or small module).

Port the cygnus-test services page visual structure:

- Page header with "Our Services" / "What we do" section
- 2-3 column image card grid
- Each card: image, category label, title, description, "Learn more" link → `/services/${slug}`
- CTA band at bottom

No custom nav/footer — layout.tsx handles this.

Convert all hex → theme tokens.

**Verification Gate 4:**

```bash
grep -E 'text-\[#|bg-\[#' sites/mad-graphics/app/services/page.tsx
# 0 results

cd sites/mad-graphics && npm run type-check
```

**Commit:**

```bash
git add sites/mad-graphics/app/services/page.tsx
git commit -m "feat(mad-graphics): replace services page with cygnus image card design"
```

---

## Phase 5: Replace About Page (`app/about/page.tsx`)

**Goal:** About page matches cygnus-test visual style, wired to real Mad Graphics data.

**Decision:** Port cygnus-test's visual structure (dark hero, story section, values grid) but drive content from `siteConfig.about`:

- `siteConfig.about.badges` → badge chips (Est. 2004, Polegate, No Vehicle Wraps)
- `siteConfig.about.story` → narrative paragraphs (replace hardcoded Martin Adams story)
- `siteConfig.about.values` → values grid (replace hardcoded Precision/Creativity/Reliability)
- `siteConfig.about.whyChooseUs` → why-choose-us list

**Remove hardcoded team members.** The cygnus-test team grid (Martin Adams, Sarah Jenkins, David Thorne, Elena Rossi) is fictional placeholder content from Stitch. Real team content doesn't exist yet. Omit the team section entirely — or render it conditionally only if `siteConfig.about.team` exists.

Convert all hex → theme tokens. No custom nav/footer.

**Verification Gate 5:**

```bash
grep -E 'text-\[#|bg-\[#' sites/mad-graphics/app/about/page.tsx
# 0 results

cd sites/mad-graphics && npm run type-check
```

**Commit:**

```bash
git add sites/mad-graphics/app/about/page.tsx
git commit -m "feat(mad-graphics): replace about page with cygnus design, wired to siteConfig"
```

---

## Phase 6: Update Locations Listing Page (`app/locations/page.tsx`)

**Goal:** Locations listing page uses cygnus visual design (image card style), not generic `ContentGrid`.

**Context:** Neither cygnus-test nor mad-graphics has a custom locations listing page — both use the same platform `ContentGrid`. So there is no reference to "copy from". We need to build a cygnus-styled locations listing that matches the services page visual design.

**Decision:** Build a locations listing page that mirrors the services page structure:

- Same section header pattern
- Grid of location cards (without images — locations don't have dedicated stitch images)
- Cards: town name as title, location description or tagline, link to `/locations/${slug}`
- Keep `ContentGrid` as fallback if `getLocations()` returns nothing

Use a simpler card than services (no image) — clean dark card with town name and description, matching `.card` utility class from cygnus globals.css.

**Verification Gate 6:**

```bash
cd sites/mad-graphics && npm run type-check
```

**Commit:**

```bash
git add sites/mad-graphics/app/locations/page.tsx
git commit -m "feat(mad-graphics): update locations listing to cygnus visual style"
```

---

## Phase 7: Fix Site Creation Pipeline

**Goal:** `create-site-from-project.ts` uses theme reference site pages when available.

**Step 7.1 — Define theme reference map**

Add a constant near the top of `tools/create-site-from-project.ts`:

```typescript
const THEME_REFERENCE_SITES: Record<string, string> = {
  cygnus: "cygnus-test",
  orion: "dj-fox-electrical",
  // vega: 'base-template' — implicit (already the default)
};

const THEME_PAGE_FILES = [
  "app/page.tsx",
  "app/services/page.tsx",
  "app/about/page.tsx",
  "app/locations/page.tsx",
];
```

**Step 7.2 — Two-pass scaffold**

In the main `createSite()` function, after copying base-template (pass 1), add pass 2:

```typescript
const requestedTheme = project.theme?.name ?? "vega"; // check actual field name in ProjectFile schema
const referenceSite = THEME_REFERENCE_SITES[requestedTheme];

if (referenceSite) {
  const refSitePath = path.join(SITES_DIR, referenceSite);

  if (fs.existsSync(refSitePath)) {
    for (const pageFile of THEME_PAGE_FILES) {
      const src = path.join(refSitePath, pageFile);
      const dest = path.join(newSitePath, pageFile);

      if (fs.existsSync(src)) {
        fs.copyFileSync(src, dest);
        log(`Copied theme page: ${pageFile} from ${referenceSite}`);
      }
    }

    // Also copy stitch images if reference site has them
    const refImages = path.join(refSitePath, "public/stitch-images");
    const destImages = path.join(newSitePath, "public/stitch-images");
    if (fs.existsSync(refImages) && !fs.existsSync(destImages)) {
      fs.cpSync(refImages, destImages, { recursive: true });
      log(`Copied stitch images from ${referenceSite}`);
    }
  } else {
    log(`Warning: theme reference site '${referenceSite}' not found — using base-template pages`);
  }
}
```

**Step 7.3 — Handle cygnus in theme config generation**

The existing `generateThemeConfig()` function only handles `vega` and `orion` registries. Add `cygnus`:

```typescript
function getRegistryImport(themeVariant: string): string {
  const registryMap: Record<string, string> = {
    vega: "vegaRegistry",
    orion: "orionRegistry",
    cygnus: "cygnusRegistry",
    // add others as themes become available
  };
  return registryMap[themeVariant] ?? "vegaRegistry";
}

function getThemePackageImport(themeVariant: string): string {
  const supported = ["vega", "orion", "cygnus", "nova", "atlas", "rigel"];
  return supported.includes(themeVariant) ? themeVariant : "vega";
}
```

**Step 7.4 — Update the architecture doc**

Update `docs/architecture/how-site-creation-works.md` to describe the two-pass scaffold and theme reference site concept.

**Risk:** The ported reference pages contain `siteConfig`-specific imports (`@/site.config`) and references to `siteConfig.business.name` etc. These are parameterised by `site.config.ts`, which is generated correctly. The pages should work as-is without token substitution because they read from `siteConfig` at runtime. The only issue would be hardcoded business-specific strings — which we've already eliminated by using `siteConfig` references. Verify after scaffold.

**Verification Gate 7:**

```bash
# Test dry-run with a cygnus project file
npx tsx tools/create-site-from-project.ts --project /tmp/test-cygnus.json --dry-run
# Should log "Copied theme page: app/page.tsx from cygnus-test"

# Test dry-run with a lyra project file (no reference site)
npx tsx tools/create-site-from-project.ts --project /tmp/test-lyra.json --dry-run
# Should log "Warning: theme reference site 'lyra-test' not found — using base-template pages"

pnpm type-check  # monorepo root
```

**Commit:**

```bash
git add tools/create-site-from-project.ts docs/architecture/how-site-creation-works.md
git commit -m "feat(pipeline): theme-first site scaffolding — copy pages from theme reference site"
```

---

## Phase 8: Final Build Verification

```bash
# Full monorepo check
pnpm type-check
pnpm lint

# Mad Graphics specific
cd sites/mad-graphics
npm run validate:content
npm run build

# Verify no hex colors remain in ported pages
grep -rn 'text-\[#\|bg-\[#\|border-\[#' sites/mad-graphics/app/page.tsx sites/mad-graphics/app/services/page.tsx sites/mad-graphics/app/about/page.tsx sites/mad-graphics/app/locations/page.tsx
# Must return 0 results

# Verify no vehicle wrap content
grep -ri "vinyl wrap\|full wrap\|vehicle wrap" sites/mad-graphics/app/
# Must return 0 results

# Verify location nav titles
grep "^title:" sites/mad-graphics/content/locations/*.mdx | grep "Vehicle Graphics"
# Must return 0 results
```

---

## Risks & Trade-offs

| Risk                                                                                          | Severity | Mitigation                                                                                                                                                                                                                                                                       |
| --------------------------------------------------------------------------------------------- | -------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `text-brand-on-primary` token may not exist in platform                                       | Medium   | Check `packages/theme-system/src/types.ts`; use CSS variable fallback if missing                                                                                                                                                                                                 |
| Reference site pages have business-specific hardcoded strings (names, phones)                 | Medium   | Audit cygnus-test pages; replace with `siteConfig.*` references before copying to pipeline                                                                                                                                                                                       |
| `getTestimonials()` may not exist in mad-graphics `lib/content.ts` shim                       | Medium   | Check the shim; add export if missing from the factory                                                                                                                                                                                                                           |
| Stitch images (~8.6 MB) add to repo size                                                      | Low      | Acceptable for now; move to R2 in image pipeline phase                                                                                                                                                                                                                           |
| Pipeline page copy may break if reference site pages import site-specific constants           | Medium   | The pages use `@/site.config` — this resolves correctly per-site. No issue.                                                                                                                                                                                                      |
| cygnus-test `app/page.tsx` still has custom `<header>`/`<footer>` — pipeline would copy these | High     | Mad Graphics pages will be fixed in Phase 3-5 BEFORE the pipeline reads them. Pipeline copies from mad-graphics' fixed pages, not cygnus-test directly. Actually — pipeline should copy from cygnus-test. This means cygnus-test pages also need the custom nav/footer stripped. |

**Critical issue on last risk:** The pipeline copies pages from the reference site (`cygnus-test`). The cygnus-test `page.tsx` has a custom `<header>` and `<footer>` baked in. When pipeline copies these to a new site, the new site will have duplicate nav/footer (once from `layout.tsx` PageShell, once hardcoded in page.tsx).

**Resolution:** Either:

- (A) Fix cygnus-test pages to remove custom nav/footer (making cygnus-test itself layout-driven) — this is the right long-term answer but changes cygnus-test's current dev behaviour
- (B) Pipeline copies from a separate `pages/` directory within the theme package (not from the live site)
- (C) Strip nav/footer during pipeline copy using a post-processing step

**Recommended: Option A** — fix cygnus-test pages alongside mad-graphics so both are layout-consistent. This makes cygnus-test the clean reference it should be.

---

## Files Summary

| File                                                    | Action                                                  | Phase |
| ------------------------------------------------------- | ------------------------------------------------------- | ----- |
| `sites/mad-graphics/content/locations/*.mdx` (19 files) | MODIFY — add `locationName` field                       | 1     |
| `sites/mad-graphics/app/layout.tsx`                     | MODIFY — use `locationName ?? title` for nav            | 1     |
| `packages/core-components/src/lib/content-schemas.ts`   | MODIFY — add optional `locationName` to location schema | 1     |
| `sites/mad-graphics/public/stitch-images/`              | CREATE — copy from cygnus-test                          | 2     |
| `sites/mad-graphics/app/page.tsx`                       | REPLACE — cygnus visual design                          | 3     |
| `sites/cygnus-test/app/page.tsx`                        | MODIFY — strip custom nav/footer                        | 3     |
| `sites/mad-graphics/app/services/page.tsx`              | REPLACE — cygnus image card grid                        | 4     |
| `sites/cygnus-test/app/services/page.tsx`               | MODIFY — strip custom nav/footer                        | 4     |
| `sites/mad-graphics/app/about/page.tsx`                 | REPLACE — cygnus visual, siteConfig data                | 5     |
| `sites/cygnus-test/app/about/page.tsx`                  | MODIFY — strip custom nav/footer                        | 5     |
| `sites/mad-graphics/app/locations/page.tsx`             | REPLACE — cygnus card style                             | 6     |
| `tools/create-site-from-project.ts`                     | MODIFY — two-pass theme scaffold                        | 7     |
| `docs/architecture/how-site-creation-works.md`          | MODIFY — document new pattern                           | 7     |
