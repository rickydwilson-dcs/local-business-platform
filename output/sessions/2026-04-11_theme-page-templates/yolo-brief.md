# YOLO Implementation Brief: Theme Page Templates

**Branch:** feature/theme-page-templates (created from develop)
**Session spec:** output/sessions/2026-04-11_theme-page-templates/yolo-brief.md
**Mode:** Autonomous execution — implement all phases, verify after each, STOP on error
**Orchestrator model:** sonnet

---

## Context

Theme packages currently export only Header and Footer components. Every site's page layout is duplicated inline in `app/page.tsx`, making it impossible to enforce visual consistency across sites using the same theme and requiring manual page rewrites for each new site. The approved plan adds a `pages/` subdirectory to all 7 named theme packages, exporting props-based Server Component page layouts (e.g. `CastorHomePage`, `VegaServiceDetailPage`). Sites' `page.tsx` files become thin wrappers: fetch content → pass as props to theme template. Per-site variation is handled via props; full structural override remains possible.

The synthesis was reviewed and approved. Implement it exactly as specified below.

---

## Model Tiers

| Tier   | Alias    | Cost (in/out per MTok) | Use for                                                                                             |
| ------ | -------- | ---------------------- | --------------------------------------------------------------------------------------------------- |
| Opus   | `opus`   | $15 / $75              | Phases with >5 interdependent files, architectural rewrites, judgment calls not covered by the spec |
| Sonnet | `sonnet` | $3 / $15               | Standard implementation — file edits, feature wiring, most phases                                   |
| Haiku  | `haiku`  | $0.80 / $4             | Mechanical tasks: find-replace, import additions, grep checks, content validation                   |

Default orchestrator: **sonnet**. Default sub-agent: **sonnet** unless the task is clearly mechanical (→ haiku) or requires deep cross-file reasoning (→ opus).

---

## Pre-flight

```bash
git checkout develop && git pull
git checkout -b feature/theme-page-templates   # create feature branch from develop
pnpm type-check   # must be clean before starting
```

---

## Phase 0: Scope Confirmation (read-only)

**Goal:** Verify the canonical page matrix and reference site assignments against actual `app/` directories. No files written.
**Model:** haiku — grep and directory reads only.

Confirm the following by reading the actual file system:

**Tradesperson page set** (castor, cygnus, lyra, nova, orion, vega):

- `app/page.tsx`, `app/services/page.tsx`, `app/services/[slug]/page.tsx`
- `app/locations/page.tsx`, `app/locations/[slug]/page.tsx`
- `app/blog/page.tsx`, `app/blog/[slug]/page.tsx`
- `app/projects/page.tsx`, `app/projects/[slug]/page.tsx`
- `app/reviews/page.tsx`, `app/about/page.tsx`, `app/contact/page.tsx`

**Rigel event page set:**

- `app/page.tsx`, `app/speakers/page.tsx`, `app/speakers/[slug]/page.tsx`
- `app/schedule/page.tsx`, `app/venue/page.tsx`, `app/sponsors/page.tsx`
- `app/blog/page.tsx`, `app/blog/[slug]/page.tsx`, `app/contact/page.tsx`

**Reference sites:**

| Theme  | Reference site            |
| ------ | ------------------------- |
| vega   | `sites/base-template`     |
| castor | `sites/_castor-plumbing`  |
| cygnus | `sites/_cygnus-graphics`  |
| lyra   | `sites/_lyra-garden`      |
| nova   | `sites/_nova-print`       |
| orion  | `sites/dj-fox-electrical` |
| rigel  | `sites/_rigel-events`     |

Read these in parallel:

- `sites/base-template/app/` directory listing
- `sites/_castor-plumbing/app/` directory listing
- `sites/dj-fox-electrical/app/` directory listing
- `sites/_rigel-events/app/` directory listing

Flag any discrepancies. If a reference site is missing a page that the plan expects, note it — do NOT create missing pages in this phase.

```bash
# Verification gate — STOP if this fails
pnpm type-check
# Must be clean before proceeding
```

**Commit:** none (read-only phase)

---

## Phase 1: Shared Prop Type Contracts

**Goal:** Define TypeScript interfaces for all page template props in `packages/core-components`. Zero runtime changes — types only.
**Model:** sonnet — one new file, needs careful type design.

### File to create:

`packages/core-components/src/lib/page-template-types.ts`

Create this file with the following exact content:

```typescript
import type React from "react";

// ─── Sub-object types ─────────────────────────────────────────────────────────

export interface ServiceSummary {
  slug: string;
  title: string;
  description?: string;
  icon?: string;
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
  readingTime?: number;
  author?: { name: string };
}

export interface ProjectSummary {
  slug: string;
  title: string;
  description?: string;
  heroImage?: string;
  date?: string;
  tags?: string[];
}

export interface TestimonialSummary {
  slug: string;
  name: string;
  rating: number;
  body: string;
  platform?: string;
  date?: string;
}

/** Minimal site config subset needed for page template rendering */
export interface SiteConfigSummary {
  name: string;
  tagline: string;
  phone: string;
  phoneDisplay: string;
  address: {
    city: string;
    county?: string;
  };
  cta: {
    primary: { label: string; href: string };
    phone: { show: boolean };
  };
  stats?: Array<{ value: string; label: string }>;
}

export interface BreadcrumbItem {
  name: string;
  href: string;
  current?: boolean;
}

// ─── Tradesperson page props ──────────────────────────────────────────────────

export interface HomePageTemplateProps {
  siteConfig: SiteConfigSummary;
  services: ServiceSummary[];
  locations: LocationSummary[];
  heroImage?: string;
  heroHeadline?: string;
  heroSubheading?: string;
  schemaNodes?: React.ReactNode;
}

export interface ServicesPageTemplateProps {
  siteConfig: SiteConfigSummary;
  services: ServiceSummary[];
}

export interface ServiceDetailPageTemplateProps {
  siteConfig: SiteConfigSummary;
  frontmatter: {
    title: string;
    description?: string;
    badge?: string;
    heroImage?: string;
    benefits?: string[];
    faqs?: Array<{ question: string; answer: string }>;
  };
  mdxContent: React.ReactNode;
  breadcrumbs: BreadcrumbItem[];
  schemaNodes?: React.ReactNode;
}

export interface LocationsPageTemplateProps {
  siteConfig: SiteConfigSummary;
  locations: LocationSummary[];
}

export interface LocationDetailPageTemplateProps {
  siteConfig: SiteConfigSummary;
  frontmatter: {
    title: string;
    description?: string;
    heroImage?: string;
    faqs?: Array<{ question: string; answer: string }>;
    hero?: { title?: string; description?: string };
  };
  mdxContent: React.ReactNode;
  breadcrumbs: BreadcrumbItem[];
  schemaNodes?: React.ReactNode;
}

export interface BlogPageTemplateProps {
  siteConfig: SiteConfigSummary;
  posts: BlogPostSummary[];
}

export interface BlogPostPageTemplateProps {
  siteConfig: SiteConfigSummary;
  frontmatter: {
    title: string;
    description: string;
    date: string;
    category: string;
    heroImage?: string;
    author: { name: string; role?: string };
    tags?: string[];
    relatedServices?: string[];
  };
  mdxContent: React.ReactNode;
  relatedPosts: BlogPostSummary[];
  readingTime?: number;
  breadcrumbs: BreadcrumbItem[];
  schemaNodes?: React.ReactNode;
}

export interface ProjectsPageTemplateProps {
  siteConfig: SiteConfigSummary;
  projects: ProjectSummary[];
}

export interface ProjectDetailPageTemplateProps {
  siteConfig: SiteConfigSummary;
  frontmatter: {
    title: string;
    description?: string;
    heroImage?: string;
    date?: string;
    tags?: string[];
    outcomes?: string[];
  };
  mdxContent: React.ReactNode;
  breadcrumbs: BreadcrumbItem[];
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

// ─── Rigel event page props ───────────────────────────────────────────────────

export interface SpeakerSummary {
  slug: string;
  name: string;
  title: string;
  topic: string;
  description: string;
  day: "saturday" | "sunday";
  time: string;
  stage: string;
  featured?: boolean;
  imageAlt?: string;
  social?: { twitter?: string; linkedin?: string; website?: string };
}

export interface RigelHomePageTemplateProps {
  siteConfig: SiteConfigSummary;
  featuredSpeakers: SpeakerSummary[];
  testimonials: TestimonialSummary[];
  schemaNodes?: React.ReactNode;
}

export interface RigelSpeakersPageTemplateProps {
  siteConfig: SiteConfigSummary;
  speakers: SpeakerSummary[];
}

export interface RigelSpeakerDetailPageTemplateProps {
  siteConfig: SiteConfigSummary;
  frontmatter: SpeakerSummary;
  mdxContent: React.ReactNode;
  breadcrumbs: BreadcrumbItem[];
}

export interface RigelSchedulePageTemplateProps {
  siteConfig: SiteConfigSummary;
}

export interface RigelVenuePageTemplateProps {
  siteConfig: SiteConfigSummary;
}

export interface RigelSponsorsPageTemplateProps {
  siteConfig: SiteConfigSummary;
}

export interface RigelBlogPageTemplateProps {
  siteConfig: SiteConfigSummary;
  posts: BlogPostSummary[];
}

export interface RigelBlogPostPageTemplateProps {
  siteConfig: SiteConfigSummary;
  frontmatter: {
    title: string;
    description: string;
    date: string;
    category: string;
    heroImage?: string;
    author: { name: string; role?: string };
    tags?: string[];
  };
  mdxContent: React.ReactNode;
  relatedPosts: BlogPostSummary[];
  breadcrumbs: BreadcrumbItem[];
}

export interface RigelContactPageTemplateProps {
  siteConfig: SiteConfigSummary;
}
```

### Also update:

Read `packages/core-components/src/index.ts` first. Add this export line at the end of the lib section:

```typescript
export * from "./lib/page-template-types";
```

```bash
# Verification gate — STOP if this fails
pnpm type-check
# Must pass with 0 errors
```

**Commit:**

```bash
git add packages/core-components/src/lib/page-template-types.ts packages/core-components/src/index.ts
git commit -m "$(cat <<'EOF'
feat(core-components): add page template prop type contracts

Adds HomePageTemplateProps, ServiceDetailPageTemplateProps, and all
other page template interfaces to core-components. Used by theme
packages' pages/ directories in subsequent phases.

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>
EOF
)"
```

---

## Phase 2: Vega Page Templates + base-template Migration

**Goal:** Implement the full Vega page template set (12 components) and migrate `sites/base-template` to use them. This is the reference implementation that validates the full pattern.
**Model:** opus — first implementation of the pattern; 12 new files + 12 site file rewrites; sets the standard for all subsequent themes.

### Key implementation rules (read before coding):

1. **Server Components only** — no `'use client'` at the template level
2. **No content loading** — templates receive pre-fetched data as props only; never call `getServices()` etc. inside a template
3. **No schema generation** — wrapper renders `<script type="application/ld+json">` above the template; template may accept optional `schemaNodes?: React.ReactNode`
4. **Theme tokens only** — `bg-brand-primary`, `text-surface-foreground`, etc. No hardcoded hex values
5. **Import from `@platform/core-components`** for heroes, cards, FAQ sections, CTAs etc.
6. **Import types from `@platform/core-components/lib/page-template-types`**

### Step 2a: Update `packages/themes/vega/package.json`

Read the file first. Add `"./pages": "./pages/index.ts"` to the `exports` field.

### Step 2b: Create `packages/themes/vega/pages/` directory with 13 files

Read `sites/base-template/app/page.tsx` and `sites/dj-fox-electrical/app/page.tsx` before writing templates to understand what sections and components each page currently uses.

Also read these to understand the available core-components:

- `packages/core-components/src/index.ts` (exports list)
- `packages/core-components/src/components/hero/` (hero variants)

**Vega visual identity:**

- Split hero (image left, text right) or gradient text-only hero
- Light header (already done via VegaHeader)
- Standard white cards, clean borders
- 3-column services grid on desktop
- Full-width `bg-brand-primary` CTA section

Files to create:

**`packages/themes/vega/pages/home.tsx`** — `VegaHomePage`
Accepts `HomePageTemplateProps`. Sections: Hero → Stats strip (from `siteConfig.stats`) → Services grid → Locations grid → CTA section.

**`packages/themes/vega/pages/services.tsx`** — `VegaServicesPage`
Accepts `ServicesPageTemplateProps`. Sections: page title banner → services card grid.

**`packages/themes/vega/pages/service-detail.tsx`** — `VegaServiceDetailPage`
Accepts `ServiceDetailPageTemplateProps`. Sections: Breadcrumbs → ServiceHero → Benefits → MDX content → FAQSection → CTASection.

**`packages/themes/vega/pages/locations.tsx`** — `VegaLocationsPage`
Accepts `LocationsPageTemplateProps`. Sections: page title banner → locations card grid.

**`packages/themes/vega/pages/location-detail.tsx`** — `VegaLocationDetailPage`
Accepts `LocationDetailPageTemplateProps`. Sections: Breadcrumbs → LocationHero → MDX content → FAQSection → CTASection.

**`packages/themes/vega/pages/blog.tsx`** — `VegaBlogPage`
Accepts `BlogPageTemplateProps`. Sections: page title banner → blog post card grid.

**`packages/themes/vega/pages/blog-post.tsx`** — `VegaBlogPostPage`
Accepts `BlogPostPageTemplateProps`. Sections: Breadcrumbs → BlogPostHero → prose content → AuthorCard → CTA → Related posts.

**`packages/themes/vega/pages/projects.tsx`** — `VegaProjectsPage`
Accepts `ProjectsPageTemplateProps`. Sections: page title banner → projects card grid.

**`packages/themes/vega/pages/project-detail.tsx`** — `VegaProjectDetailPage`
Accepts `ProjectDetailPageTemplateProps`. Sections: Breadcrumbs → hero/title → MDX content → CTA.

**`packages/themes/vega/pages/reviews.tsx`** — `VegaReviewsPage`
Accepts `ReviewsPageTemplateProps`. Sections: page title → testimonials grid.

**`packages/themes/vega/pages/about.tsx`** — `VegaAboutPage`
Accepts `AboutPageTemplateProps`. Sections: page title → about content area (business info from siteConfig).

**`packages/themes/vega/pages/contact.tsx`** — `VegaContactPage`
Accepts `ContactPageTemplateProps`. Renders the contact form section. Import the ContactForm from core-components if available; otherwise render a placeholder section with heading and contact details.

**`packages/themes/vega/pages/index.ts`** — re-exports all 12 components and their types.

### Step 2c: Migrate `sites/base-template/app/` thin wrappers

Read each current page file before rewriting it. The thin wrapper pattern:

- Keeps `export const metadata` / `generateMetadata` in the wrapper
- Keeps `generateStaticParams` in the wrapper
- Keeps content fetching (`getServices()`, `getLocations()`, `loadMdx()`, schema generation) in the wrapper
- Renders schema `<script>` tags above the template component
- Imports and renders `Vega*Page` with props built from the fetched data

Build a `SiteConfigSummary` object from `siteConfig` at the top of each wrapper:

```typescript
const siteSummary: SiteConfigSummary = {
  name: siteConfig.business.name,
  tagline: siteConfig.tagline,
  phone: siteConfig.business.phone,
  phoneDisplay: PHONE_DISPLAY,
  address: { city: siteConfig.business.address.city },
  cta: siteConfig.cta,
  stats: siteConfig.credentials?.stats,
};
```

Update all 12 page files in `sites/base-template/app/`:

- `app/page.tsx`
- `app/services/page.tsx`
- `app/services/[slug]/page.tsx`
- `app/locations/page.tsx`
- `app/locations/[slug]/page.tsx`
- `app/blog/page.tsx`
- `app/blog/[slug]/page.tsx`
- `app/projects/page.tsx`
- `app/projects/[slug]/page.tsx`
- `app/reviews/page.tsx`
- `app/about/page.tsx`
- `app/contact/page.tsx`

```bash
# Verification gate — STOP if this fails
pnpm type-check
cd sites/base-template && npm run build
```

**Commit:**

```bash
git add packages/themes/vega/pages/ packages/themes/vega/package.json sites/base-template/app/
git commit -m "$(cat <<'EOF'
feat(vega): add page template components and migrate base-template

Adds VegaHomePage, VegaServiceDetailPage, and all 12 Vega page
templates to packages/themes/vega/pages/. Migrates sites/base-template
app/ page files to thin wrappers that import from @platform/themes/vega/pages.
Schema and generateMetadata/generateStaticParams remain in site wrappers.

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>
EOF
)"
```

---

## Phase 3: Castor Page Templates + \_castor-plumbing Migration

**Goal:** Implement Castor's Stitch-designed visual identity in 12 page templates. Migrate `_castor-plumbing`. This is the visual acceptance criterion — the homepage must match the Stitch design intent.
**Model:** sonnet — follows Vega pattern established in Phase 2; Castor has distinct visual identity to preserve.

### Step 3a: Update `packages/themes/castor/package.json`

Add `"./pages": "./pages/index.ts"` to exports.

### Step 3b: Create `packages/themes/castor/pages/`

Read `packages/themes/castor/index.ts` and `packages/themes/castor/components/header.tsx` to understand Castor's palette and style before writing templates.

**Castor visual identity:**

- Hero: image-overlay with navy scrim (`rgba(26,58,107,0.75)`)
- Headlines: Newsreader serif (`font-headline` class from Castor globals.css)
- Cards: white with `cardBorder` (#e2e8f0) and Trade Navy hover accent
- Section banding: white (#ffffff) alternating with Mist Grey (use `bg-surface-muted`)
- CTAs: Trade Navy (`bg-brand-primary`) full-width with white text
- Accent elements: Fresh Sage (`bg-brand-accent`) for CTA buttons and highlights

Create the same 12 files as Vega, prefixed `Castor*`. Components should compose core-components primitives but apply Castor-specific class choices where they differ from Vega's defaults.

### Step 3c: Migrate `sites/_castor-plumbing/app/` thin wrappers

Read each current page file before rewriting. Apply the same thin wrapper pattern as base-template.

```bash
# Verification gate — STOP if this fails
pnpm type-check
cd sites/_castor-plumbing && npm run build
# Visual QA expectation: homepage shows image-overlay hero, Newsreader headlines, navy/sage palette
```

**Commit:**

```bash
git add packages/themes/castor/pages/ packages/themes/castor/package.json sites/_castor-plumbing/app/
git commit -m "$(cat <<'EOF'
feat(castor): add page template components and migrate _castor-plumbing

Adds CastorHomePage and all 12 Castor page templates using the
Trade Navy + Fresh Sage palette with Newsreader serif headlines.
Migrates sites/_castor-plumbing to thin wrappers.

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>
EOF
)"
```

---

## Phase 4: Cygnus, Lyra, Nova Page Templates + Reference Site Migrations

**Goal:** Build page templates for 3 remaining trade themes. Migrate their underscore reference sites.
**Model:** sonnet — follows established pattern; 3 themes × 12 files + 3 site migrations.

Spawn 3 sub-agents in parallel — one per theme. Each sub-agent:

1. Reads the theme's `index.ts` and `components/header.tsx` to understand the palette
2. Creates `packages/themes/[name]/pages/` (12 files + index.ts)
3. Updates `packages/themes/[name]/package.json` (add `./pages` export)
4. Reads and rewrites all page files in the reference site

**Sub-agent instructions:**

**Cygnus sub-agent** (`model: sonnet`):

- Read `packages/themes/cygnus/index.ts` and `packages/themes/cygnus/components/header.tsx`
- Visual identity: dark mode; `bg-surface-inverse` on hero and alternating sections; Signal Orange primary, Craft Green accent; full-bleed hero with overlay; dark card surfaces with orange highlights
- Create `packages/themes/cygnus/pages/` (12 files: `CygnusHomePage` etc.)
- Update `packages/themes/cygnus/package.json`
- Migrate `sites/_cygnus-graphics/app/` (12 thin wrapper files)

**Lyra sub-agent** (`model: sonnet`):

- Read `packages/themes/lyra/index.ts` and `packages/themes/lyra/components/header.tsx`
- Visual identity: editorial serif layout; muted sage/cream palette; soft section backgrounds (`bg-surface-muted`); generous whitespace; editorial card layouts; Newsreader or similar serif headline
- Create `packages/themes/lyra/pages/` (12 files: `LyraHomePage` etc.)
- Update `packages/themes/lyra/package.json`
- Migrate `sites/_lyra-garden/app/` (12 thin wrapper files)

**Nova sub-agent** (`model: sonnet`):

- Read `packages/themes/nova/index.ts` and `packages/themes/nova/components/header.tsx`
- Visual identity: bold orange + green; light header; energetic card grids; strong contrast CTAs
- Create `packages/themes/nova/pages/` (12 files: `NovaHomePage` etc.)
- Update `packages/themes/nova/package.json`
- Migrate `sites/_nova-print/app/` (12 thin wrapper files)

**Important for all sub-agents:** No `'use client'` in template files. No content loading inside templates. Use theme tokens only (no hardcoded hex). Import types from `@platform/core-components/lib/page-template-types`.

```bash
# Verification gate — STOP if any fail
pnpm type-check
cd sites/_cygnus-graphics && npm run build
cd sites/_lyra-garden && npm run build
cd sites/_nova-print && npm run build
```

**Commit:**

```bash
git add packages/themes/cygnus/ packages/themes/lyra/ packages/themes/nova/ \
        sites/_cygnus-graphics/app/ sites/_lyra-garden/app/ sites/_nova-print/app/
git commit -m "$(cat <<'EOF'
feat(themes): add cygnus/lyra/nova page templates and migrate reference sites

Adds full page template sets for Cygnus (dark mode, Signal Orange),
Lyra (editorial serif, sage/cream), and Nova (bold orange + green).
Migrates _cygnus-graphics, _lyra-garden, _nova-print to thin wrappers.

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>
EOF
)"
```

---

## Phase 5: Orion Page Templates + dj-fox-electrical Migration

**Goal:** Extract Orion page templates from `dj-fox-electrical`'s existing (mature) page.tsx implementations. Parameterize site-specific content as props. Migrate dj-fox-electrical to thin wrappers.
**Model:** opus — extraction requires careful judgment: distinguish layout code (moves to template) from site-specific content (becomes props). dj-fox-electrical is a production site — must build correctly.

### Step 5a: Read all current dj-fox-electrical page files

Before writing anything, read ALL of these in parallel:

- `sites/dj-fox-electrical/app/page.tsx`
- `sites/dj-fox-electrical/app/services/page.tsx`
- `sites/dj-fox-electrical/app/services/[slug]/page.tsx`
- `sites/dj-fox-electrical/app/locations/page.tsx`
- `sites/dj-fox-electrical/app/locations/[slug]/page.tsx`
- `sites/dj-fox-electrical/app/blog/page.tsx`
- `sites/dj-fox-electrical/app/blog/[slug]/page.tsx`
- `sites/dj-fox-electrical/app/projects/page.tsx`
- `sites/dj-fox-electrical/app/reviews/page.tsx`
- `sites/dj-fox-electrical/app/about/page.tsx`
- `sites/dj-fox-electrical/app/contact/page.tsx`

### Step 5b: Create `packages/themes/orion/pages/`

**Orion visual identity** (from dj-fox-electrical):

- Full-bleed image hero with dark overlay (`HeroWithImage` from core-components)
- Dark header (`bg-surface-inverse`, noise overlay)
- Stats strip with icon+value+label rows
- 2-col services layout (sticky header left, scrolling list right)
- `ImageOverlayCard` for category grid
- Location pills with arrow affordance
- "Why Choose Us" table-style rows on dark background
- CTA: split layout with `MagneticButton` (client component, already exists in dj-fox)

**Extraction rule:** Move layout structure to `OrionHomePage`. Parameterize:

- Hardcoded "NICEIC" → `badge?: string` prop
- Hardcoded "15+" → comes from `siteConfig.stats`
- Hardcoded "Eastbourne" → comes from `siteConfig.address.city`
- The 4 hardcoded stat entries → `siteConfig.stats`
- The "Why Choose Us" rows → `whyChooseUsItems?: Array<{icon, title, body, stat}>` prop on `OrionHomePage`

### Step 5c: Update `packages/themes/orion/package.json`

Add `"./pages": "./pages/index.ts"` to exports.

### Step 5d: Migrate `sites/dj-fox-electrical/app/` to thin wrappers

After creating templates, rewrite each page file. The `whyChooseUsItems` for dj-fox's homepage stays in the wrapper as a const array passed as prop.

```bash
# Verification gate — STOP if this fails
pnpm type-check
cd sites/dj-fox-electrical && npm run build
# dj-fox is production — must build cleanly
```

**Commit:**

```bash
git add packages/themes/orion/pages/ packages/themes/orion/package.json sites/dj-fox-electrical/app/
git commit -m "$(cat <<'EOF'
feat(orion): extract page templates from dj-fox-electrical and migrate site

Extracts OrionHomePage and all Orion page templates from the mature
dj-fox-electrical implementation. Parameterizes site-specific content
(NICEIC badge, stats, whyChooseUsItems) as props. Migrates
dj-fox-electrical to thin wrappers.

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>
EOF
)"
```

---

## Phase 6: Rigel Event Page Templates + \_rigel-events Migration

**Goal:** Build the Rigel event-specific page template set (9 components for event page types). Migrate `_rigel-events`.
**Model:** sonnet — event page types are different from tradesperson but follow the same pattern once understood.

### Step 6a: Read current \_rigel-events pages

Read in parallel before writing:

- `sites/_rigel-events/app/page.tsx`
- `sites/_rigel-events/app/speakers/page.tsx`
- `sites/_rigel-events/app/speakers/[slug]/page.tsx`
- `sites/_rigel-events/app/schedule/page.tsx`
- `sites/_rigel-events/app/venue/page.tsx`
- `sites/_rigel-events/app/sponsors/page.tsx`
- `sites/_rigel-events/app/blog/page.tsx`
- `sites/_rigel-events/app/contact/page.tsx`

### Step 6b: Create `packages/themes/rigel/pages/`

Create these files:

- `home.tsx` — `RigelHomePage` (accepts `RigelHomePageTemplateProps`)
- `speakers.tsx` — `RigelSpeakersPage` (accepts `RigelSpeakersPageTemplateProps`)
- `speaker-detail.tsx` — `RigelSpeakerDetailPage` (accepts `RigelSpeakerDetailPageTemplateProps`)
- `schedule.tsx` — `RigelSchedulePage` (accepts `RigelSchedulePageTemplateProps`)
- `venue.tsx` — `RigelVenuePage` (accepts `RigelVenuePageTemplateProps`)
- `sponsors.tsx` — `RigelSponsorsPage` (accepts `RigelSponsorsPageTemplateProps`)
- `blog.tsx` — `RigelBlogPage` (accepts `RigelBlogPageTemplateProps`)
- `blog-post.tsx` — `RigelBlogPostPage` (accepts `RigelBlogPostPageTemplateProps`)
- `contact.tsx` — `RigelContactPage` (accepts `RigelContactPageTemplateProps`)
- `index.ts` — re-exports all

**Rigel visual identity:**

- Deep purple (`#292661`) primary, yellow accent (`#F5D121`)
- Large Inter headings
- Stats strip (2 Days / 10+ Speakers / 20+ Sessions / 300 Attendees) from `siteConfig.stats`
- Speaker cards grid on homepage
- Dark purple gradient CTA section

`RigelSchedulePage` and `RigelVenuePage` currently have embedded static data (session arrays, venue details). Extract these as props on the respective template components. The wrapper passes the data.

### Step 6c: Update `packages/themes/rigel/package.json`

Add `"./pages": "./pages/index.ts"` to exports.

### Step 6d: Migrate `sites/_rigel-events/app/` to thin wrappers

```bash
# Verification gate — STOP if this fails
pnpm type-check
cd sites/_rigel-events && npm run build
```

**Commit:**

```bash
git add packages/themes/rigel/pages/ packages/themes/rigel/package.json sites/_rigel-events/app/
git commit -m "$(cat <<'EOF'
feat(rigel): add event page templates and migrate _rigel-events

Adds RigelHomePage, RigelSpeakersPage, RigelSchedulePage, RigelVenuePage,
and all Rigel event page templates. Migrates sites/_rigel-events to thin
wrappers. Schedule/venue session data passed as props from wrappers.

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>
EOF
)"
```

---

## Phase 7: Update Site Scaffolding Tool

**Goal:** Update `tools/create-site-from-project.ts` so new sites created for any theme get thin-wrapper page files automatically.
**Model:** haiku — targeted replacements in one file, mechanical.

Read `tools/create-site-from-project.ts` in full before editing.

### Change 1 — Expand `THEME_REFERENCE_SITE_MAP` (replace existing):

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

### Change 2 — Replace flat `THEMED_PAGE_FILES` with per-theme map:

Remove the existing `THEMED_PAGE_FILES` const. Replace with:

```typescript
const TRADESPERSON_PAGE_FILES = [
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

const RIGEL_EVENT_PAGE_FILES = [
  "app/layout.tsx",
  "app/page.tsx",
  "app/speakers/page.tsx",
  "app/speakers/[slug]/page.tsx",
  "app/schedule/page.tsx",
  "app/venue/page.tsx",
  "app/sponsors/page.tsx",
  "app/blog/page.tsx",
  "app/blog/[slug]/page.tsx",
  "app/contact/page.tsx",
] as const;

const THEMED_PAGE_FILES_BY_THEME: Record<string, readonly string[]> = {
  rigel: RIGEL_EVENT_PAGE_FILES,
};

function getThemedPageFiles(theme: string): readonly string[] {
  return THEMED_PAGE_FILES_BY_THEME[theme] ?? TRADESPERSON_PAGE_FILES;
}
```

### Change 3 — Update all references to `THEMED_PAGE_FILES`:

Find any places in the file that reference `THEMED_PAGE_FILES` directly and replace with `getThemedPageFiles(project.theme)` (or equivalent call with the theme variable available in that context).

```bash
# Verification gate — STOP if this fails
pnpm type-check
npx tsx tools/create-site-from-project.ts --help
# Must run without errors
```

**Commit:**

```bash
git add tools/create-site-from-project.ts
git commit -m "$(cat <<'EOF'
feat(scaffolding): expand theme reference map and add per-theme page file manifest

Updates THEME_REFERENCE_SITE_MAP to cover all 7 themes. Replaces flat
THEMED_PAGE_FILES with THEMED_PAGE_FILES_BY_THEME map so rigel event
sites get event-specific page files instead of tradesperson defaults.

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>
EOF
)"
```

---

## Phase 8: Documentation Updates

**Goal:** Update architecture docs to reflect the new theme page template pattern.
**Model:** sonnet — documentation writing.

Read these files before updating them (in parallel):

- `docs/architecture/how-theme-system-works.md`
- `docs/architecture/architecture.md`
- `docs/guides/creating-new-theme.md`
- `docs/guides/adding-new-site.md`
- `CLAUDE.md`

### Updates required:

**`docs/architecture/how-theme-system-works.md`** — add a "Page Templates" section after the existing Header/Footer section:

- What page templates are: props-based Server Components in `packages/themes/[name]/pages/`
- How thin wrappers work: `generateMetadata` + `generateStaticParams` + data fetch stays in wrapper; layout rendering moves to template
- What belongs in the template vs the wrapper (layout → template; metadata, schema, data fetching → wrapper)
- The `SiteConfigSummary` pattern for passing site config to templates

**`docs/architecture/architecture.md`** — update the Theme System section paragraph to mention that themes now export page layout templates in addition to Header/Footer.

**`docs/guides/creating-new-theme.md`** — add a required section: every new theme must include a `pages/` directory with either the full tradesperson page set or a custom event page set. Reference the prop types from `@platform/core-components/lib/page-template-types`.

**`docs/guides/adding-new-site.md`** — update to note that new sites scaffolded with `create-site-from-project.ts` automatically receive thin-wrapper page files from the theme's reference site.

**`CLAUDE.md`** — update the "Theme System" subsection in "How This Platform Works" to mention page templates: themes export page layout components from `@platform/themes/[name]/pages`. Sites' page.tsx files are thin wrappers.

```bash
# Verification gate — STOP if this fails
pnpm type-check
pnpm build
# Full monorepo build — all sites including non-migrated ones (colossus, mad-graphics) must pass
```

**Commit:**

```bash
git add docs/ CLAUDE.md
git commit -m "$(cat <<'EOF'
docs: update architecture docs for theme page template pattern

Documents the new pages/ subdirectory pattern in theme packages.
Updates how-theme-system-works.md, architecture.md, creating-new-theme
guide, adding-new-site guide, and CLAUDE.md.

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>
EOF
)"
```

---

## Parallel execution groups

This section lists work units that can run concurrently. Each group lists items that MUST be launched in a single Task-tool message. Items across groups run sequentially in the order listed. Groups are named `G1`, `G2`, … for reference.

### Intra-phase groups

Work items that can run in parallel within a single phase. Launch every item in a group in one message.

| Group | Phase   | Items                                                                                                                                                                       | File overlap                     | Model       | Rationale                                          |
| ----- | ------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------- | ----------- | -------------------------------------------------- |
| G1    | Phase 0 | Read `sites/base-template/app/`, `sites/_castor-plumbing/app/`, `sites/dj-fox-electrical/app/`, `sites/_rigel-events/app/` directory listings                               | none (reads only)                | n/a         | Independent reads — batch in one message           |
| G2    | Phase 2 | Read `packages/core-components/src/index.ts`, `packages/core-components/src/components/hero/` directory                                                                     | none (reads only)                | n/a         | Pre-implementation reads — safe to batch           |
| G3    | Phase 2 | Read all 12 base-template `app/` page files before rewriting                                                                                                                | none (reads only)                | n/a         | Must understand current content before rewriting   |
| G4    | Phase 4 | Launch Cygnus sub-agent, Lyra sub-agent, Nova sub-agent (each works on independent packages + sites)                                                                        | none (separate packages + sites) | sonnet each | 3 fully independent themes — no shared files       |
| G5    | Phase 5 | Read all 11 dj-fox-electrical `app/` page files before extracting                                                                                                           | none (reads only)                | n/a         | Must read all before extracting to Orion templates |
| G6    | Phase 6 | Read all 8 `_rigel-events/app/` page files before rewriting                                                                                                                 | none (reads only)                | n/a         | Must read all before creating Rigel templates      |
| G7    | Phase 8 | Read `docs/architecture/how-theme-system-works.md`, `docs/architecture/architecture.md`, `docs/guides/creating-new-theme.md`, `docs/guides/adding-new-site.md`, `CLAUDE.md` | none (reads only)                | n/a         | Pre-documentation reads — safe to batch            |

### Cross-phase groups (only if phases are truly independent)

| Group  | Phases | Items | Rationale                                                            |
| ------ | ------ | ----- | -------------------------------------------------------------------- |
| (none) |        |       | All phases have ordering dependencies — phases must run sequentially |

### Sequential points — MUST NOT parallelise

| Item                                                                            | Reason                                                                              |
| ------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------- |
| Verification gates (`pnpm type-check`, `npm run build`) between phases          | Each phase's output gates the next. Gates are the synchronisation barrier.          |
| Git commits                                                                     | One commit per phase, in order. Commits are never batched.                          |
| Phase 4 sub-agents that update the same `packages/core-components/src/index.ts` | If any sub-agent needs to add exports to core-components index, serialise that step |
| Phase 2 page template creation + Phase 2 base-template migration                | Templates must exist before wrappers can import them                                |
| Phase 5 reading dj-fox files + writing Orion templates                          | Must read source before extracting                                                  |

---

## Cost Estimate

| Phase                                         | Model      | Est. input tokens | Est. output tokens | Est. cost  |
| --------------------------------------------- | ---------- | ----------------- | ------------------ | ---------- |
| Phase 0: Scope confirmation                   | haiku      | ~5k               | ~1k                | ~$0.01     |
| Phase 1: Prop types                           | sonnet     | ~8k               | ~3k                | ~$0.07     |
| Phase 2: Vega templates + base-template       | opus       | ~40k              | ~15k               | ~$1.73     |
| Phase 3: Castor templates + \_castor-plumbing | sonnet     | ~20k              | ~10k               | ~$0.21     |
| Phase 4: Cygnus/Lyra/Nova (3 parallel agents) | sonnet × 3 | ~18k × 3          | ~10k × 3           | ~$1.89     |
| Phase 5: Orion extraction + dj-fox migration  | opus       | ~30k              | ~12k               | ~$1.35     |
| Phase 6: Rigel templates + \_rigel-events     | sonnet     | ~20k              | ~8k                | ~$0.18     |
| Phase 7: Scaffolding tool                     | haiku      | ~8k               | ~2k                | ~$0.01     |
| Phase 8: Documentation                        | sonnet     | ~15k              | ~5k                | ~$0.12     |
| **Total**                                     |            | **~~207k**        | **~~86k**          | **~$5.57** |

Rates: Opus $15/$75, Sonnet $3/$15, Haiku $0.80/$4 per MTok.

---

## Final Report

After all phases complete, output:

1. Phases completed — list each with commit SHA
2. Build status — confirm `pnpm lint && pnpm type-check && pnpm build` passes
3. Any exceptions or intentional deviations from the plan
4. Token usage and cost estimate:

   | Model     | Est. input tokens     | Est. output tokens | Est. cost |
   | --------- | --------------------- | ------------------ | --------- |
   | opus      | [total across phases] |                    | $X.XX     |
   | sonnet    | [total across phases] |                    | $X.XX     |
   | haiku     | [if used]             |                    | $X.XX     |
   | **Total** |                       |                    | **$X.XX** |

   Estimate tokens from: files read (lines × 5) and written (lines × 5).
   Compare to the pre-flight Cost Estimate above.
   For exact figures: check console.anthropic.com.

---

## Update Session File

After completing all phases, append to `output/sessions/2026-04-11_theme-page-templates/yolo-brief.md`:

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
- **Consult the `## Parallel execution groups` section before launching any work.** Every item listed in a group MUST be launched in a single Task-tool message. Do not launch group items sequentially — that defeats the purpose of the block and doubles the wall-clock time.
- **Items NOT listed in any group run sequentially.** If the groups table has no row for a given work item, assume it is sequential.
- **Never parallelise across phase boundaries unless the Cross-phase groups table explicitly lists the phases.** Verification gates are the synchronisation barrier between phases — respect them.
- **If the groups table and the phase prose disagree, the groups table wins.** The groups block is the authoritative execution plan.
- Minimal changes only — implement what the plan says, nothing more
- Use `model: haiku` for Task agents doing mechanical work (grep, import additions, find-replace); `model: sonnet` for standard edits; `model: opus` only for deep multi-file reasoning
- The Co-Authored-By line in commits must reflect the orchestrator model used (`Claude Sonnet 4.6`)
- For any phase that creates or modifies theme packages: after the final commit, run `pnpm type-check` to confirm the monorepo is still clean
- **Non-migrated sites** (`colossus-scaffolding`, `mad-graphics`) must build correctly at every phase. The final `pnpm build` in Phase 8 verifies this.
- **dj-fox-electrical is a production site** — Phase 5 must build cleanly before committing
