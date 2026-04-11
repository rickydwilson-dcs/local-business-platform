# Claude's Plan: Theme Page Templates

**Date:** 2026-04-11
**Author:** Claude (independent plan, written before Codex review)

---

## Summary

Add a `pages/` subdirectory to each named theme package. Each theme page component is a Server Component that accepts typed props (pre-fetched content data) and renders the full page body (excluding Header/Footer, which are in layout.tsx). Sites' `page.tsx` files become thin data-fetching wrappers (~30 lines) that call `generateMetadata`, `generateStaticParams`, fetch MDX content, and pass it to the theme page component as props.

---

## Phase 1: Define the Props Interface Contracts

**Goal:** Establish the TypeScript interfaces for all page template props before writing any implementations. This gates all subsequent work — implementations must match the interfaces exactly.

Create a shared types file in `packages/core-components/src/lib/page-template-types.ts`.

### Why core-components, not individual theme packages?

Multiple theme packages need the same prop shapes (all tradesperson themes share the same page types). Defining in core-components means:

- A single source of truth
- Sites can import types for their thin wrappers: `import type { HomePageProps } from '@platform/core-components/lib/page-template-types'`
- Theme packages import from core-components (they already depend on it)

### Interfaces to define:

```typescript
// Shared sub-objects
export interface ServiceSummary {
  slug: string;
  title: string;
  description?: string;
}
export interface LocationSummary {
  slug: string;
  title: string;
  description?: string;
}
export interface BlogPostSummary {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  category: string;
  heroImage?: string;
}
export interface ProjectSummary {
  slug: string;
  title: string;
  description?: string;
  heroImage?: string;
  date?: string;
}
export interface TestimonialSummary {
  slug: string;
  name: string;
  rating: number;
  body: string;
  platform?: string;
}

// Page-level props
export interface HomePageTemplateProps {
  siteConfig: SiteConfigSummary;
  services: ServiceSummary[];
  locations: LocationSummary[];
  heroImage?: string;
  heroHeadline?: string;
  heroSubheading?: string;
}

export interface ServicesPageTemplateProps {
  siteConfig: SiteConfigSummary;
  services: ServiceSummary[];
}

export interface ServiceDetailPageTemplateProps {
  siteConfig: SiteConfigSummary;
  frontmatter: ServiceFrontmatter;
  mdxContent: React.ReactNode;
  breadcrumbs: BreadcrumbItem[];
}

export interface LocationsPageTemplateProps {
  siteConfig: SiteConfigSummary;
  locations: LocationSummary[];
}

export interface LocationDetailPageTemplateProps {
  siteConfig: SiteConfigSummary;
  frontmatter: LocationFrontmatter;
  mdxContent: React.ReactNode;
  breadcrumbs: BreadcrumbItem[];
}

export interface BlogPageTemplateProps {
  siteConfig: SiteConfigSummary;
  posts: BlogPostSummary[];
}

export interface BlogPostPageTemplateProps {
  siteConfig: SiteConfigSummary;
  frontmatter: BlogPostFrontmatter;
  mdxContent: React.ReactNode;
  relatedPosts: BlogPostSummary[];
}

export interface ProjectsPageTemplateProps {
  siteConfig: SiteConfigSummary;
  projects: ProjectSummary[];
}

export interface ProjectDetailPageTemplateProps {
  siteConfig: SiteConfigSummary;
  frontmatter: ProjectFrontmatter;
  mdxContent: React.ReactNode;
}

export interface ReviewsPageTemplateProps {
  siteConfig: SiteConfigSummary;
  testimonials: TestimonialSummary[];
}

export interface AboutPageTemplateProps {
  siteConfig: SiteConfigSummary;
}

export interface ContactPageTemplateProps {
  siteConfig: SiteConfigSummary;
}
```

**SiteConfigSummary** — a minimal site config subset that page templates need (name, phone, address, CTA labels). This avoids importing the full `SiteConfig` type from `@/site.config` into theme packages.

**Schema.org JSON-LD decision:** Stays in site `page.tsx`. Template components do NOT render schema scripts. Rationale: schema generation needs `absUrl()` and the full site config — both are site-local. Passing schema as a prop would couple the interface too tightly to implementation. Better: thin wrapper renders `<script>` tags above the theme component, and the theme component renders the visible UI.

**MDX body decision:** Passed as `mdxContent: React.ReactNode`. The site's `page.tsx` calls `loadMdx()` and passes the result. Theme template renders it in its prose section.

**Breadcrumbs decision:** Passed as `breadcrumbs: BreadcrumbItem[]` — the site's page.tsx constructs them (they need slug + location context logic that's site-local). Theme template renders `<Breadcrumbs items={breadcrumbs} />`.

**Verification gate:**

```bash
# From monorepo root
pnpm type-check
# Must pass with 0 errors (no new consumers yet, just type definitions)
```

**Files created:**

- `packages/core-components/src/lib/page-template-types.ts`
- Export it from `packages/core-components/src/index.ts`

---

## Phase 2: Implement Vega Page Templates (Reference Implementation)

**Goal:** Build the full set of Vega page templates as the reference implementation, migrating `base-template` to use them. This validates the pattern before rolling out to all themes.

**Why Vega first?** `base-template` already uses Vega. We can validate the full end-to-end pattern (template → thin wrapper → build → visual check) with a single theme before multiplying work.

### Files to create in `packages/themes/vega/pages/`:

```
vega/pages/
  home.tsx           — VegaHomePage
  services.tsx       — VegaServicesPage
  service-detail.tsx — VegaServiceDetailPage
  locations.tsx      — VegaLocationsPage
  location-detail.tsx — VegaLocationDetailPage
  blog.tsx           — VegaBlogPage
  blog-post.tsx      — VegaBlogPostPage
  projects.tsx       — VegaProjectsPage
  project-detail.tsx — VegaProjectDetailPage
  reviews.tsx        — VegaReviewsPage
  about.tsx          — VegaAboutPage
  contact.tsx        — VegaContactPage
  index.ts           — re-exports all
```

Each component:

- Is a Server Component (no `'use client'`)
- Imports from `@platform/core-components` (heroes, cards, FAQ, CTA sections, etc.)
- Uses `bg-brand-primary`, `text-surface-foreground` etc. — theme tokens, no hardcoded colors
- Accepts typed props from `page-template-types.ts`

**Example — VegaHomePage:**

```tsx
import { ServiceCard, CTASection, StatsStrip } from '@platform/core-components';
import type { HomePageTemplateProps } from '@platform/core-components/lib/page-template-types';

export function VegaHomePage({ siteConfig, services, locations, heroImage, heroHeadline }: HomePageTemplateProps) {
  return (
    <div className="min-h-screen">
      {/* Hero — Vega uses SplitHero (image left, text right) */}
      <SplitHero headline={heroHeadline ?? siteConfig.tagline} ... />
      {/* Stats strip */}
      <StatsStrip stats={siteConfig.stats} />
      {/* Services grid */}
      <section className="section">
        <div className="container-narrow">
          <div className="grid md:grid-cols-3 gap-6">
            {services.map(s => <ServiceCard key={s.slug} {...s} />)}
          </div>
        </div>
      </section>
      {/* Locations */}
      ...
      {/* CTA */}
      <CTASection ... />
    </div>
  );
}
```

### Update `packages/themes/vega/package.json`:

Add `"./pages"` subpath export:

```json
{
  "exports": {
    ".": "./index.ts",
    "./components": "./components/index.ts",
    "./pages": "./pages/index.ts"
  }
}
```

### Update `sites/base-template/app/page.tsx`:

Reduce from ~250 lines to ~35 lines:

```tsx
import type { Metadata } from 'next';
import { siteConfig } from '@/site.config';
import { getServices, getLocations } from '@/lib/content';
import { getLocalBusinessSchema } from '@/lib/schema';
import { absUrl } from '@/lib/site';
import { VegaHomePage } from '@platform/themes/vega/pages';

export const metadata: Metadata = { ... };

export default async function HomePage() {
  const [services, locations] = await Promise.all([getServices(), getLocations()]);
  const schema = getLocalBusinessSchema();

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <VegaHomePage
        siteConfig={{ name: siteConfig.business.name, phone: siteConfig.business.phone, ... }}
        services={services}
        locations={locations}
        heroHeadline={`Professional Services in ${siteConfig.business.address.city}`}
      />
    </>
  );
}
```

Similarly update all other base-template page.tsx files.

**Verification gate:**

```bash
cd sites/base-template && npm run build
# Must succeed with 0 errors
pnpm type-check
# Must pass across monorepo
```

---

## Phase 3: Implement Castor Page Templates + Migrate \_castor-plumbing

**Goal:** Build Castor page templates using the Castor Stitch design (Trade Navy header, Newsreader serif headlines, image-overlay hero, banded sections).

**Castor visual identity (from Stitch design):**

- Hero: image overlay with navy scrim (`rgba(26,58,107,0.75)`)
- Headlines: Newsreader serif font (`font-headline`)
- Cards: standard white cards with navy border accent
- CTA section: dark navy background
- Section banding: alternating white / mist-grey (#f0f4f8)

Files: same structure as Vega pages, in `packages/themes/castor/pages/`.

Migrate `sites/_castor-plumbing/app/page.tsx` etc. to thin wrappers.

**Verification gate:**

```bash
cd sites/_castor-plumbing && npm run build
pnpm type-check
```

---

## Phase 4: Implement Remaining Trade Themes (Cygnus, Lyra, Nova, Orion)

**Goal:** Build page templates for the remaining 4 trade themes, migrate their underscore reference sites.

Each theme's visual identity (to preserve in page templates):

- **Cygnus:** dark mode, Signal Orange primary, Craft Green accent — inverse surfaces on hero/CTA
- **Lyra:** editorial serif, sage/cream palette — soft section backgrounds, editorial card layouts
- **Nova:** bold orange + green, light header — energetic card grids
- **Orion:** dark header, full-bleed image hero, red accent, noise overlay — already the most developed (dj-fox-electrical)

For Orion: `dj-fox-electrical/app/page.tsx` already has the mature Orion layout. Extract it into `packages/themes/orion/pages/home.tsx` rather than writing from scratch. Then migrate `dj-fox-electrical` to use `OrionHomePage`.

**Migrate underscore sites:**

- `_cygnus-graphics` → uses `CygnusHomePage` etc.
- `_lyra-garden` → uses `LyraHomePage` etc.
- `_nova-print` → uses `NovaHomePage` etc.
- `dj-fox-electrical` → uses `OrionHomePage` etc. (Orion's reference implementation is already excellent — just extract it)

**Verification gate:**

```bash
# Run for each theme site
cd sites/_cygnus-graphics && npm run build
cd sites/_lyra-garden && npm run build
cd sites/_nova-print && npm run build
cd sites/dj-fox-electrical && npm run build
pnpm type-check
```

---

## Phase 5: Rigel Event Templates

**Goal:** Rigel has a non-standard page set (event site, not tradesperson). Build a Rigel-specific page template set covering: home, speakers listing, speaker detail, schedule, venue, sponsors, blog listing, blog post, contact.

Rigel templates accept event-specific props rather than services/locations.

**Files:** `packages/themes/rigel/pages/`

**Migrate:** `sites/_rigel-events` to use Rigel page templates.

**Verification gate:**

```bash
cd sites/_rigel-events && npm run build
pnpm type-check
```

---

## Phase 6: Update Site Scaffolding Tool

**Goal:** Update `tools/create-site-from-project.ts` so new sites created from any theme get thin-wrapper page files automatically.

### Changes:

**1. Expand `THEME_REFERENCE_SITE_MAP`:**

```typescript
const THEME_REFERENCE_SITE_MAP: Record<string, string> = {
  castor: "_castor-plumbing",
  cygnus: "_cygnus-graphics",
  lyra: "_lyra-garden",
  nova: "_nova-print",
  orion: "dj-fox-electrical",
  vega: "base-template",
  rigel: "_rigel-events",
};
```

**2. Expand `THEMED_PAGE_FILES`:**

```typescript
const THEMED_PAGE_FILES = [
  "app/layout.tsx",
  "app/page.tsx",
  "app/services/page.tsx",
  "app/services/[slug]/page.tsx",
  "app/locations/page.tsx",
  "app/locations/[slug]/page.tsx",
  "app/blog/page.tsx",
  "app/blog/[slug]/page.tsx",
  "app/projects/page.tsx",
  "app/projects/[slug]/page.tsx",
  "app/reviews/page.tsx",
  "app/about/page.tsx",
  "app/contact/page.tsx",
] as const;
```

This means a site scaffolded with `--theme castor` will copy all page files from `_castor-plumbing` — getting the thin Castor wrappers — rather than the generic base-template layouts.

**Verification gate:**

```bash
# Dry-run site creation for each theme
npx tsx tools/create-site-from-project.ts --project test-fixtures/castor-project.json --dry-run
# Confirm all 13 page files are listed as "would copy from _castor-plumbing"
pnpm type-check
```

---

## Phase 7: Documentation + Wrap-Up

**Goal:** Update architecture docs and CLAUDE.md to reflect the new theme page template pattern.

### Files to update:

- `docs/architecture/how-theme-system-works.md` — add "Page Templates" section explaining the new pattern
- `docs/architecture/architecture.md` — update theme system description
- `docs/guides/creating-new-theme.md` — add required section on creating page templates for a new theme
- `docs/guides/adding-new-site.md` — update to reflect that new sites get thin wrappers automatically
- `CLAUDE.md` — update "How This Platform Works" to mention page templates

---

## Risks and Trade-offs

### Risk 1: SiteConfigSummary coupling

The page templates need _some_ site config data (business name, phone, CTA labels) to render CTA sections. Defining `SiteConfigSummary` creates a coupling between the theme package and whatever config shape sites provide.

**Mitigation:** Keep `SiteConfigSummary` minimal — only what's genuinely needed for rendering. Avoid passing the full `SiteConfig` object (it has site-local dependencies).

### Risk 2: Orion/dj-fox extraction requires care

`dj-fox-electrical/app/page.tsx` has site-specific content (NICEIC, "15+ years", Eastbourne) embedded in the layout. Extracting to `OrionHomePage` requires distinguishing layout code (belongs in template) from content (belongs in props).

**Mitigation:** Extract layout structure; parameterize all content. The template gets: `trustedBadge`, `yearsExperience`, `jobsCompleted` etc. as props rather than hardcoded strings.

### Risk 3: Scope is large

13 pages × 7 themes = 91 new files, plus 5 underscore sites × 13 page file rewrites. This is a significant undertaking.

**Mitigation:** Implement one theme fully (Vega) first, validate the pattern, then roll out to remaining themes. The pattern is highly repetitive once established — phases 3-5 reuse identical structural decisions from phase 2.

### Risk 4: Colossus-scaffolding has custom service sorting

`colossus-scaffolding` uses custom service sorting logic in its `lib/content.ts` shim. It does NOT follow base-template's generic service ordering.

**Mitigation:** Colossus is NOT in the first rollout. When it's eventually migrated, the thin wrapper handles the custom sorting before passing `services` to `VegaServicesPage`. The template never sees sorting logic.

### Risk 5: `_rigel-events` has completely different page set

Rigel's page templates can't follow the tradesperson template pattern.

**Mitigation:** Build separate `RigelEventHomePage`, `RigelSpeakersPage` etc. with event-specific props. Handled in Phase 5 after trade theme pattern is established.

---

## Rollout Sequence

1. Phase 1: Types → `pnpm type-check` ✓
2. Phase 2: Vega + base-template → `base-template` build ✓
3. Phase 3: Castor + `_castor-plumbing` → castor build ✓
4. Phase 4: Cygnus, Lyra, Nova, Orion → all 4 builds ✓
5. Phase 5: Rigel → `_rigel-events` build ✓
6. Phase 6: Scaffolding tool → dry-run verification ✓
7. Phase 7: Docs → `pnpm type-check` + full `pnpm build` ✓

Total: 7 phases. Phases 2-5 are the bulk of the work (template implementations). Each is independently verifiable.
