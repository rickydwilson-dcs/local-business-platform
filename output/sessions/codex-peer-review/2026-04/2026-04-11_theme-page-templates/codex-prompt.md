# Codex Peer Review Prompt

Paste this entire file into Codex in VS Code.

---

## Your task

You are doing an independent architectural peer review. Read the brief below, then produce your own implementation plan.

Save your plan as `codex-plan.md` in this folder:
`output/sessions/codex-peer-review/2026-04-11_theme-page-templates/`

When done, output this exact command so the user can copy-paste it into Claude Code:

```
/plan.with.codex synthesise output/sessions/codex-peer-review/2026-04-11_theme-page-templates/
```

---

## Brief: Theme Page Templates

**Date:** 2026-04-11
**Project:** Local Business Platform monorepo
**Note:** This brief is sent to both Claude and Codex independently. Your plans will be synthesised into a final implementation spec. Do not look at `claude-plan.md` before writing your own plan.
**Note:** No clarified brief was produced for this topic. Challenge assumptions accordingly and flag any scope gaps you identify.

### Problem Statement

The platform currently has a white-label website generator for local service businesses. Theme packages (`packages/themes/castor`, `packages/themes/orion`, etc.) export only Header and Footer components. Every page's layout lives entirely inside the site's `app/page.tsx`, `app/services/[slug]/page.tsx`, etc.

This means:

1. Every site that uses the Castor theme (for example) still renders the base-template's generic page structure — not the Castor Stitch-designed layout.
2. Creating a new site on a given theme requires manually rewriting all page.tsx files to match the theme's visual identity.
3. There is no enforced visual consistency across sites using the same theme.

The goal is to make theme packages own the page layout templates, the same way they already own Header and Footer. A site using the Castor theme should get the Castor page layouts by default, with per-site variation delivered through props (different headline text, different hero image, different service list) rather than by rewriting the layout code.

This is a **platform-wide architectural change** that must cover:

- All standard page types used by tradesperson sites (homepage, services listing, service detail, locations listing, location detail, blog listing, blog post, projects listing, project detail, reviews/testimonials, about, contact)
- All relevant named themes (at minimum: castor, cygnus, lyra, nova, orion, vega, rigel)
- The `base-template` site (which new sites are copied from)
- The `tools/create-site-from-project.ts` scaffolding tool (which assembles new sites)

### Goals

1. Each named theme exports a complete set of page layout components (e.g. `CastorHomePage`, `CastorServiceDetailPage`) as named exports from `@platform/themes/castor/pages`.
2. Each page layout component accepts typed props: content data (frontmatter, MDX body, siteConfig values) not layout decisions.
3. Sites' `page.tsx` files become thin wrappers: fetch MDX content → pass as props to the theme page component. ~30 lines instead of ~200.
4. Per-site variation is handled entirely via props. Two sites on Castor get the same layout structure but different hero images, headlines, service lists.
5. Full structural override remains possible: a site can write its own `page.tsx` that ignores the theme template entirely and composes raw components.
6. The `base-template` site is updated to use theme page templates so new sites inherit the pattern automatically.
7. `create-site-from-project.ts` is updated so the `THEME_REFERENCE_SITE_MAP` and `THEMED_PAGE_FILES` lists remain correct and new sites get the right thin-wrapper page files.
8. The 5 underscore reference sites (`_castor-plumbing`, `_cygnus-graphics`, `_lyra-garden`, `_nova-print`, `_rigel-events`) are updated to use their theme's page templates.

### Non-Goals

- Rewriting `packages/core-components` component internals — page templates are thin compositions of existing core-components primitives, not new components.
- Changing the MDX content architecture — `content/services/*.mdx` etc. remains the single source of truth. Page templates receive parsed MDX frontmatter and rendered MDX as props.
- Building theme page templates for `atlas`, `polaris`, `sirius`, `solaris` — these are config-only or event-specific themes without underscore reference sites. They can be added later.
- Adding new visual designs from scratch — use the existing Stitch-designed component selections already established for each theme.
- Changing how Header/Footer work — they already follow this pattern correctly.

### Acceptance Criteria

1. `packages/themes/castor` exports `CastorHomePage`, `CastorServiceDetailPage`, `CastorServicesPage`, `CastorLocationDetailPage`, `CastorLocationsPage`, `CastorBlogPostPage`, `CastorBlogPage`, `CastorProjectDetailPage`, `CastorProjectsPage`, `CastorReviewsPage`, `CastorAboutPage`, `CastorContactPage` from `@platform/themes/castor/pages`.
2. Same set exists for cygnus, lyra, nova, orion, vega, rigel (with rigel's set adapted for event-site page types: home, speakers, schedule, venue, sponsors, blog).
3. `sites/_castor-plumbing/app/page.tsx` is ~30 lines: imports `CastorHomePage`, fetches services/locations, passes as props.
4. `pnpm type-check` passes with 0 errors across the monorepo.
5. `pnpm build` succeeds for all sites.
6. The visual layout of `_castor-plumbing` homepage matches the Stitch design intent (Trade Navy header, Newsreader headlines, image-overlay hero, services grid).
7. `base-template` uses `VegaHomePage` etc. so new sites scaffolded from it inherit the pattern.

### Constraints

**Architecture constraints (from codebase):**

- Theme `components/` directories export **Server Components only** (no `'use client'`). Page templates must follow this rule — no React hooks, no event handlers in the template itself. Client interactivity is handled by client components imported inside the template (e.g. `MobileMenu` from core-components is already a client component).
- Theme package `components/` are imported in `app/layout.tsx` (a Server Component). Page templates in `pages/` will be imported in individual `page.tsx` files (also Server Components). Same constraint applies.
- `page.tsx` files are Next.js App Router Server Components with `generateMetadata()` and `generateStaticParams()`. The thin wrapper must still export these — they cannot move into the theme package because they depend on `@/lib/content` and `@/site.config` which are site-local.
- Do NOT use `'use client'` at the page template level. If a sub-component needs client features, it should already be a client component in core-components.
- Existing import paths `@platform/themes/castor/components` must continue to work (backwards compat for Header/Footer).
- The `packages/themes/[name]/package.json` must declare the `pages` subpath export so `@platform/themes/castor/pages` resolves correctly.

**Content constraints:**

- Page templates receive **pre-fetched data** as props — they do not call `getServices()`, `getLocations()` etc. themselves. Data fetching stays in the site's page.tsx wrapper. This keeps theme packages free of site-specific lib imports.
- MDX body content (the rendered React element tree) is passed as a `children` or `mdxContent: React.ReactNode` prop.
- Schema.org JSON-LD scripts (`<script type="application/ld+json">`) should remain in site page.tsx wrappers or be passed as props — theme templates should not generate schema themselves (they don't have enough site context).

**Tooling constraints:**

- `THEME_REFERENCE_SITE_MAP` in `tools/create-site-from-project.ts` currently lists only `cygnus`, `orion`, `vega`. After this change, all 7 themes should be listed.
- `THEMED_PAGE_FILES` currently lists 5 files. After this change, it needs to cover the full set of page files.

### Relevant Architecture

**How themes currently work:**

- `packages/themes/castor/index.ts` — exports `castorRegistry` (ComponentRegistry) and `castorDefaultConfig` (DeepPartialThemeConfig). Pure config, no components.
- `packages/themes/castor/components/header.tsx` — exports `CastorHeader` Server Component with typed props.
- `packages/themes/castor/components/footer.tsx` — exports `CastorFooter` Server Component with typed props.
- `packages/themes/castor/components/index.ts` — re-exports both.
- `packages/themes/castor/package.json` — has `exports` field with `"."` and `"./components"` subpaths.

**How sites currently use themes:**

- `sites/base-template/app/layout.tsx` imports `VegaHeader`, `VegaFooter` from `@platform/themes/vega/components` and wraps children in `PageShell`.
- `sites/base-template/app/page.tsx` — ~250 lines of inline layout code (Hero, Trust Strip, Services Grid, Locations Grid, CTA section). All layout decisions are hardcoded in the site.

**How page.tsx currently works (base-template homepage):**

```tsx
export default async function HomePage() {
  const locations = await getLocations();
  const localBusinessSchema = getLocalBusinessSchema();
  // ... inline JSX for Hero, Stats, Services, Locations, CTA
}
```

**After this change, base-template/app/page.tsx should look like:**

```tsx
import { VegaHomePage } from "@platform/themes/vega/pages";

export default async function HomePage() {
  const services = await getServices();
  const locations = await getLocations();
  const schema = getLocalBusinessSchema();
  return (
    <VegaHomePage
      services={services}
      locations={locations}
      schema={schema}
      siteConfig={siteConfig}
    />
  );
}
```

**CastorHeader pattern to follow:**

```tsx
// packages/themes/castor/components/header.tsx
export interface CastorHeaderProps {
  siteName: string;
  phoneDisplay?: string;
  navigation: Array<{ label: string; href: string; hasDropdown?: boolean }>;
  locations: Array<{ name: string; slug: string }>;
  // ...
}

export function CastorHeader(props: CastorHeaderProps) {
  // Composes core-components primitives (SiteHeader, MobileMenu, NavLink)
  // Server Component — no hooks, no event handlers
}
```

**Theme package.json exports pattern (what needs adding for `./pages`):**

```json
{
  "exports": {
    ".": "./index.ts",
    "./components": "./components/index.ts",
    "./pages": "./pages/index.ts" // NEW
  }
}
```

**The 5 standard page types in every tradesperson site:**

| Page              | Route               | Key props needed                                          |
| ----------------- | ------------------- | --------------------------------------------------------- |
| Homepage          | `/`                 | services[], locations[], stats[], heroImage, heroHeadline |
| Services listing  | `/services`         | services[]                                                |
| Service detail    | `/services/[slug]`  | frontmatter, mdxContent, faqs[], benefits[], siteConfig   |
| Locations listing | `/locations`        | locations[]                                               |
| Location detail   | `/locations/[slug]` | frontmatter, mdxContent, faqs[], siteConfig               |
| Blog listing      | `/blog`             | posts[]                                                   |
| Blog post         | `/blog/[slug]`      | frontmatter, mdxContent, relatedPosts[]                   |
| Projects listing  | `/projects`         | projects[]                                                |
| Project detail    | `/projects/[slug]`  | frontmatter, mdxContent                                   |
| Reviews           | `/reviews`          | testimonials[]                                            |
| About             | `/about`            | siteConfig                                                |
| Contact           | `/contact`          | siteConfig                                                |

**Stitch images:** `_castor-plumbing/public/stitch-images/`, `_cygnus-graphics/public/stitch-images/`, `_lyra-garden/public/stitch-images/` contain Stitch-designed reference images. These are **not** used in page templates — they're reference images. The actual hero/background images for each site will be site-specific props.

### Codebase Snapshot

Key files:

```
packages/themes/
  castor/
    index.ts                        — registry + config exports
    components/
      header.tsx                    — CastorHeader Server Component
      footer.tsx                    — CastorFooter Server Component
      index.ts                      — re-exports
    package.json                    — exports: "." and "./components"
  orion/                            — same structure, has Header+Footer
  vega/                             — same structure, has Header+Footer
  cygnus/                           — same structure, has Header+Footer
  lyra/                             — same structure, has Header+Footer
  nova/                             — same structure, has Header+Footer
  rigel/                            — same structure, has Header (37 event components)

sites/base-template/
  app/
    layout.tsx                      — imports VegaHeader, VegaFooter; wraps in PageShell
    page.tsx                        — ~250 lines inline homepage layout
    services/page.tsx               — services listing page
    services/[slug]/page.tsx        — service detail with ServiceHero, FAQSection, CTASection
    locations/page.tsx              — locations listing page
    locations/[slug]/page.tsx       — location detail
    blog/page.tsx                   — blog listing
    blog/[slug]/page.tsx            — blog post with BlogPostHero, AuthorCard
    projects/page.tsx               — projects listing
    projects/[slug]/page.tsx        — project detail
    reviews/page.tsx                — testimonials
    about/page.tsx                  — about page
    contact/page.tsx                — contact form page

sites/_castor-plumbing/
  app/                              — same structure as base-template but using CastorHeader/Footer
                                      page.tsx still uses base-template generic layout

tools/create-site-from-project.ts
  THEME_REFERENCE_SITE_MAP          — maps theme name → reference site (currently: cygnus, orion, vega only)
  THEMED_PAGE_FILES                 — page files copied from theme reference site (currently 5 files)
```

### What a Good Plan Should Cover

1. **Props type design** — What TypeScript interfaces do the page template components need? How do they receive content (services, locations, MDX body)? What's the right level of abstraction — one big `CastorHomePageProps` or composed sub-objects?

2. **Where does `generateMetadata` live?** — It must stay in site's `page.tsx` (needs `@/lib/content`, `@/site.config`). The plan must be explicit about what does NOT move into theme templates.

3. **Where does `generateStaticParams` live?** — Same question. Must stay in site's page.tsx.

4. **Schema.org JSON-LD** — Currently inline in page.tsx (as `<script type="application/ld+json">`). Does it stay there, get passed as a prop, or does the page template render it?

5. **MDX body rendering** — The `loadMdx()` call returns a React.ReactNode (compiled MDX). How does this get passed to the theme template? As a `children` prop? As `mdxContent: React.ReactNode`?

6. **Rollout order** — Which theme/site gets done first? Is there a safe incremental rollout, or does this need to happen all at once to maintain type consistency?

7. **package.json exports** — Each theme's `package.json` needs a `"./pages"` subpath export added. The plan must include this step explicitly.

8. **base-template update** — After this change, `base-template` must use `VegaHomePage` etc. so new sites scaffolded from it get thin wrappers automatically. The plan must specify how base-template is updated.

9. **create-site-from-project.ts update** — `THEME_REFERENCE_SITE_MAP` and `THEMED_PAGE_FILES` must be updated. What exactly changes?

10. **Rigel divergence** — Rigel is an event site, not a tradesperson site. Its page set is different (speakers, schedule, venue, sponsors). How does the plan handle theme packages with non-standard page sets?

11. **Build verification** — What does a passing verification gate look like? `pnpm type-check`? `pnpm build` for all 5 underscore sites? Specific visual checks?

12. **Backwards compatibility** — Sites not yet migrated (dj-fox-electrical, colossus-scaffolding, mad-graphics) should still build correctly after this change. What guarantees this?

---

## Deliverable

Produce a numbered implementation plan with:

- Clear phases/steps
- Which files are created or modified at each step
- Verification gates between steps (how to confirm each step succeeded before moving on)
- Any risks or trade-offs worth calling out

Save your response as `codex-plan.md` in `output/sessions/codex-peer-review/2026-04-11_theme-page-templates/`.

Then output this command for the user to copy-paste into Claude Code:
`/plan.with.codex synthesise output/sessions/codex-peer-review/2026-04-11_theme-page-templates/`
