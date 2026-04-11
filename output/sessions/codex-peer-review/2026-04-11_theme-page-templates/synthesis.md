# Implementation Plan: Theme Page Templates

**Date:** 2026-04-11
**Status:** Ready for implementation — approved by dual-model peer review
**Source:** Synthesised from Claude and Codex independent plans

---

## Key Differences Between Plans

| Aspect                                          | Claude                                                                    | Codex                                                                           | Synthesised Decision                                                                                                                                                                                                  |
| ----------------------------------------------- | ------------------------------------------------------------------------- | ------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Where shared prop types live**                | `packages/core-components/src/lib/page-template-types.ts`                 | `packages/themes/theme-page-types.ts` (themes workspace root)                   | **core-components** — it already owns shared types; theme packages already depend on it; avoids a new workspace-root module with unclear ownership                                                                    |
| **Type prefix naming**                          | `HomePageTemplateProps` (generic, shared)                                 | `ThemeHomePageProps` (generic)                                                  | **`HomePageTemplateProps`** — matches Claude's cleaner naming (Codex's `Theme` prefix is redundant — these types are _for_ theme pages by definition)                                                                 |
| **`schemaNodes` prop**                          | Schema stays in wrapper, NOT passed as prop                               | Optional `schemaNodes?: React.ReactNode` prop on templates                      | **Hybrid**: schema stays in wrapper by default (simpler), but templates MAY accept an optional `schemaNodes?: React.ReactNode` prop for cases where the template wants to co-locate script rendering. No requirement. |
| **Scaffolder: flat vs per-theme page manifest** | Flat `THEMED_PAGE_FILES` array, same for all themes                       | `THEMED_PAGE_FILES_BY_THEME` map to handle rigel divergence                     | **Per-theme map** — Codex is right that rigel's event routes can't use the tradesperson page list. `THEMED_PAGE_FILES_BY_THEME` with a `default` tradesperson key is cleaner                                          |
| **Rollout order**                               | Vega first (base-template validation), then Castor, then remaining themes | Recommends pre-work scope alignment gate before coding                          | **Scope alignment first, then Vega, then remaining themes** — Codex's pre-work gate is good practice; adopt it                                                                                                        |
| **Non-migrated sites**                          | Implicit — colossus/dj-fox/mad-graphics not in scope                      | Explicit "do not force migration" as a backward-compat rule                     | **Explicit non-migration rule** — adopt Codex's clarity; non-reference production sites (dj-fox-electrical, colossus-scaffolding, mad-graphics) are NOT migrated in this PR                                           |
| **~30 line wrapper target**                     | Firm target                                                               | Codex flags as potentially unrealistic on dynamic routes with metadata + schema | **Guideline not a rule** — target thin wrappers; dynamic routes with `generateMetadata` + `generateStaticParams` + schema may be ~60-80 lines and that's fine                                                         |

---

## Blind Spots Caught

**Codex caught:**

- **Rigel scaffolder divergence**: The flat `THEMED_PAGE_FILES` array can't serve both tradesperson and event themes. A `THEMED_PAGE_FILES_BY_THEME` map (or site-class map) is needed. Claude's plan mentioned rigel divergence as a risk but didn't resolve it in the scaffolder phase.
- **Explicit scope alignment gate**: Codex added a pre-flight phase (Phase 0) to confirm the canonical page matrix and reference site map before coding starts. This prevents discovering mid-implementation that orion or vega need separate handling.
- **LOC target is a guideline**: Claude's "~30 lines" was treated as a hard target; Codex correctly identified that `generateMetadata`, `generateStaticParams`, and inline schema scripts legitimately add lines.

**Claude caught:**

- **Props type location**: Putting shared types in `packages/core-components` is architecturally cleaner than a new `packages/themes/theme-page-types.ts`. Types belong with the package that already owns them and is already a dependency of all theme packages.
- **MDX body as `React.ReactNode`**: Explicit call that `loadMdx()` returns a ReactNode and must be passed as `mdxContent` prop — not re-fetched inside the template. Codex's plan implied this but didn't spell it out.
- **Orion extraction pattern**: `dj-fox-electrical/app/page.tsx` is already the mature Orion layout — extract it rather than writing from scratch. This saves significant work and preserves proven visual decisions.

---

## Implementation Plan

### Phase 0: Scope Alignment (pre-flight, read-only)

**Goal:** Confirm canonical page matrix and reference site assignments before writing any code.

**Canonical page sets:**

Tradesperson themes (castor, cygnus, lyra, nova, orion, vega):

- `/` — home
- `/services` — listing
- `/services/[slug]` — detail (dynamic)
- `/locations` — listing
- `/locations/[slug]` — detail (dynamic)
- `/blog` — listing
- `/blog/[slug]` — detail (dynamic)
- `/projects` — listing
- `/projects/[slug]` — detail (dynamic)
- `/reviews` — testimonials
- `/about` — static
- `/contact` — static

Event theme (rigel):

- `/` — home
- `/speakers` — listing
- `/speakers/[slug]` — detail (dynamic)
- `/schedule` — static
- `/venue` — static
- `/sponsors` — static
- `/blog` — listing
- `/blog/[slug]` — detail (dynamic)
- `/contact` — static

**Reference sites per theme:**

| Theme  | Reference site            | Notes                                               |
| ------ | ------------------------- | --------------------------------------------------- |
| vega   | `sites/base-template`     | Gold-standard template                              |
| castor | `sites/_castor-plumbing`  |                                                     |
| cygnus | `sites/_cygnus-graphics`  |                                                     |
| lyra   | `sites/_lyra-garden`      |                                                     |
| nova   | `sites/_nova-print`       |                                                     |
| orion  | `sites/dj-fox-electrical` | Most mature implementation — extract, don't rewrite |
| rigel  | `sites/_rigel-events`     | Event site, different page set                      |

**Output:** No files created. Confirm the above is accurate against actual `app/` directories.

---

### Phase 1: Shared Prop Type Contracts

**Goal:** Define TypeScript interfaces for all page template props. Zero runtime changes.

**File to create:**
`packages/core-components/src/lib/page-template-types.ts`

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
```

**Also update:**

- `packages/core-components/src/index.ts` — add export for `page-template-types.ts`

**Verification gate:**

```bash
# From monorepo root
pnpm type-check
# Must pass with 0 errors (types only, no runtime changes)
```

---

### Phase 2: Vega Page Templates + base-template Migration

**Goal:** Implement the full Vega page template set as the reference implementation. Migrate base-template to use them. This validates the full pattern before multiplying to other themes.

**Files to create in `packages/themes/vega/pages/`:**

```
home.tsx              — VegaHomePage
services.tsx          — VegaServicesPage
service-detail.tsx    — VegaServiceDetailPage
locations.tsx         — VegaLocationsPage
location-detail.tsx   — VegaLocationDetailPage
blog.tsx              — VegaBlogPage
blog-post.tsx         — VegaBlogPostPage
projects.tsx          — VegaProjectsPage
project-detail.tsx    — VegaProjectDetailPage
reviews.tsx           — VegaReviewsPage
about.tsx             — VegaAboutPage
contact.tsx           — VegaContactPage
index.ts              — re-exports all
```

Each component:

- Server Component only (no `'use client'`)
- Imports from `@platform/core-components` for heroes, cards, FAQ, CTA, etc.
- Uses theme tokens (`bg-brand-primary`, `text-surface-foreground`, etc.) — no hardcoded colors
- Accepts typed props from `@platform/core-components/lib/page-template-types`
- Does NOT call content loaders — receives pre-fetched data as props
- Does NOT generate schema — receives optional `schemaNodes` prop or wrapper renders schema above it

**Vega visual identity to preserve in templates:**

- `VegaHeader` — split layout with light header (already done)
- Hero: `SplitHero` variant (image left, text right) or text-only hero with gradient
- Cards: standard white cards, clean borders
- Services grid: 3-column on desktop
- CTAs: `bg-brand-primary` full-width section

**Update `packages/themes/vega/package.json`:**

```json
{
  "exports": {
    ".": "./index.ts",
    "./components": "./components/index.ts",
    "./pages": "./pages/index.ts"
  }
}
```

**Update `sites/base-template/app/page.tsx` (and all other page files):**
Pattern: keep `generateMetadata`, `generateStaticParams`, content fetching, schema scripts. Import and render the theme page component.

```tsx
// sites/base-template/app/page.tsx — thin wrapper
import type { Metadata } from 'next';
import { siteConfig } from '@/site.config';
import { getServices, getLocations } from '@/lib/content';
import { getLocalBusinessSchema } from '@/lib/schema';
import { absUrl } from '@/lib/site';
import { PHONE_DISPLAY, PHONE_TEL } from '@/lib/contact-info';
import { VegaHomePage } from '@platform/themes/vega/pages';

export const metadata: Metadata = { ... };

export default async function HomePage() {
  const [services, locations] = await Promise.all([getServices(), getLocations()]);
  const schema = getLocalBusinessSchema();

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <VegaHomePage
        siteConfig={{
          name: siteConfig.business.name,
          tagline: siteConfig.tagline,
          phone: siteConfig.business.phone,
          phoneDisplay: PHONE_DISPLAY,
          address: { city: siteConfig.business.address.city },
          cta: siteConfig.cta,
          stats: siteConfig.credentials?.stats,
        }}
        services={services}
        locations={locations}
        heroHeadline={`Professional Services in ${siteConfig.business.address.city}`}
      />
    </>
  );
}
```

The 12 page files in `base-template/app/` are each reduced to this thin wrapper pattern.

**Verification gate:**

```bash
pnpm type-check               # Must pass across monorepo
cd sites/base-template && npm run build   # Must succeed
```

---

### Phase 3: Castor Page Templates + \_castor-plumbing Migration

**Goal:** Implement Castor's visual identity in page templates. Castor is the visual acceptance criterion — it must match the Stitch design intent.

**Files:** `packages/themes/castor/pages/` — same 12-file set as Vega.

**Castor visual identity to implement:**

- Hero: `image-overlay` variant — full-bleed image with navy scrim (`rgba(26,58,107,0.75)`)
- Headlines: Newsreader serif (`font-headline` class)
- Cards: white with subtle `cardBorder` (#e2e8f0) and Trade Navy hover accent
- Section banding: white (#ffffff) alternating with Mist Grey (#f0f4f8)
- CTAs: Trade Navy (`bg-brand-primary`) background with white text
- Accent elements: Fresh Sage (#3a7d44) for CTA buttons and key highlights

**Update `packages/themes/castor/package.json`:** add `"./pages"` subpath.

**Migrate `sites/_castor-plumbing`:** update all 12 `app/page.tsx` wrappers to import from `@platform/themes/castor/pages`.

**Verification gate:**

```bash
pnpm type-check
cd sites/_castor-plumbing && npm run build
# Visual QA: homepage must show image-overlay hero, Newsreader headlines, navy/sage palette
```

---

### Phase 4: Remaining Trade Themes (Cygnus, Lyra, Nova, Orion)

**Goal:** Build page templates for the 4 remaining trade themes. Migrate their underscore/reference sites.

**Theme-specific visual identities to preserve:**

**Cygnus** (`_cygnus-graphics` reference):

- Dark mode: `bg-surface-inverse` on hero and alternating sections
- Signal Orange primary (`#f97316`), Craft Green accent
- Cards: dark surface with orange border highlights
- Full-bleed hero with overlay

**Lyra** (`_lyra-garden` reference):

- Editorial serif layout, muted sage/cream palette
- Soft section backgrounds, generous whitespace
- Card layouts with editorial typography

**Nova** (`_nova-print` reference):

- Bold orange + green, light header
- Energetic card grids, strong contrast CTAs

**Orion** (`dj-fox-electrical` reference — extract, don't rewrite):

- Extract layout from `sites/dj-fox-electrical/app/page.tsx` into `OrionHomePage`
- Same for other Orion page types — `dj-fox-electrical` has the most mature implementations
- Parameterize all site-specific content (NICEIC, "15+ years", Eastbourne references become props)
- After extraction, update `dj-fox-electrical` to use `OrionHomePage` as its thin wrapper
- Update remaining Orion page files

**Files per theme:** `packages/themes/[name]/pages/` — 12-file tradesperson set.

**Migrate reference sites:**

- `_cygnus-graphics` → CygnusHomePage etc.
- `_lyra-garden` → LyraHomePage etc.
- `_nova-print` → NovaHomePage etc.
- `dj-fox-electrical` → OrionHomePage etc.

**Update `package.json` for each:** add `"./pages"` subpath.

**Verification gate:**

```bash
pnpm type-check
cd sites/_cygnus-graphics && npm run build
cd sites/_lyra-garden && npm run build
cd sites/_nova-print && npm run build
cd sites/dj-fox-electrical && npm run build
```

---

### Phase 5: Rigel Event Page Templates + \_rigel-events Migration

**Goal:** Build the Rigel event-specific page template set with event page types (speakers, schedule, venue, sponsors). Migrate `_rigel-events`.

**Files to create in `packages/themes/rigel/pages/`:**

```
home.tsx              — RigelHomePage
speakers.tsx          — RigelSpeakersPage
speaker-detail.tsx    — RigelSpeakerDetailPage
schedule.tsx          — RigelSchedulePage
venue.tsx             — RigelVenuePage
sponsors.tsx          — RigelSponsorsPage
blog.tsx              — RigelBlogPage
blog-post.tsx         — RigelBlogPostPage
contact.tsx           — RigelContactPage
index.ts
```

Props use `RigelHomePageTemplateProps`, `RigelSpeakersPageTemplateProps` etc. from Phase 1.

**Update `packages/themes/rigel/package.json`:** add `"./pages"` subpath.

**Migrate `_rigel-events`:** update all event page wrappers to use Rigel page templates. `app/speakers/[slug]/page.tsx` follows the same pattern as service detail — `generateStaticParams` + content fetch stays in wrapper, passes to `RigelSpeakerDetailPage`.

**Verification gate:**

```bash
pnpm type-check
cd sites/_rigel-events && npm run build
```

---

### Phase 6: Update Site Scaffolding Tool

**Goal:** Update `tools/create-site-from-project.ts` so new sites get thin-wrapper page files automatically for their theme.

**File to modify:** `tools/create-site-from-project.ts`

**Change 1 — Expand `THEME_REFERENCE_SITE_MAP`:**

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

**Change 2 — Replace flat `THEMED_PAGE_FILES` with per-theme map:**

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
  // All tradesperson themes use the default
};

function getThemedPageFiles(theme: string): readonly string[] {
  return THEMED_PAGE_FILES_BY_THEME[theme] ?? TRADESPERSON_PAGE_FILES;
}
```

Update the file-copy logic to call `getThemedPageFiles(project.theme)` instead of the old flat constant.

**Verification gate:**

```bash
# Dry-run for tradesperson theme
npx tsx tools/create-site-from-project.ts --project test-fixtures/castor-project.json --dry-run
# Confirm 13 page files listed as "would copy from _castor-plumbing"

# Dry-run for event theme
npx tsx tools/create-site-from-project.ts --project test-fixtures/rigel-project.json --dry-run
# Confirm 10 event page files listed as "would copy from _rigel-events"

pnpm type-check
```

---

### Phase 7: Documentation Updates

**Goal:** Update architecture docs to reflect the new theme page template pattern.

**Files to update:**

- `docs/architecture/how-theme-system-works.md` — add "Page Templates" section:
  - What they are (props-based Server Components in `packages/themes/[name]/pages/`)
  - How thin wrappers work (generateMetadata + generateStaticParams + data fetch → pass to template)
  - What belongs in the template vs the wrapper
- `docs/architecture/architecture.md` — update Theme System description to mention page templates

- `docs/guides/creating-new-theme.md` — add required section: every new theme must include a `pages/` directory with the full tradesperson or event page set

- `docs/guides/adding-new-site.md` — update to reflect thin wrappers are now the default

- `CLAUDE.md` — update "How This Platform Works" theme system paragraph to mention page templates

**Verification gate:**

```bash
# Confirm all doc links resolve
pnpm type-check
pnpm build   # Full monorepo build including all migrated + non-migrated sites
```

---

## Backward Compatibility Rule

**Production sites NOT in scope for this PR:**

- `sites/colossus-scaffolding`
- `sites/mad-graphics`

These sites must continue to build correctly throughout all phases. They use VegaHeader/VegaFooter/CygnusHeader already. Adding new `./pages` subpath exports to theme packages is additive and does NOT break existing imports. Verified by `pnpm build` at end of each phase.

`dj-fox-electrical` IS migrated (in Phase 4) because it is the Orion reference site — the Orion templates are extracted from its existing page.tsx code.

---

## Risks

| Risk                                                                                          | Mitigation                                                                                                                                                             |
| --------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Extracting Orion from dj-fox requires care — site-specific content is embedded in layout code | Parameterize all content; extract layout structure only. Review diff carefully.                                                                                        |
| Type coupling via `SiteConfigSummary` — too much vs too little                                | Keep it minimal (name, phone, city, cta). Extend per-theme if needed rather than bloating the shared type.                                                             |
| 91 new files (13 pages × 7 themes) is a large volume of mostly repetitive code                | Implement one theme (Vega) fully as the pattern; remaining themes follow the same structure — haiku-level mechanical work once the pattern exists.                     |
| `colossus-scaffolding` custom service sorting                                                 | Not affected — colossus is not migrated in this PR. When it eventually is, sorting happens in the wrapper before passing to `VegaServicesPage`.                        |
| ~30-line thin wrapper is a guideline                                                          | Dynamic routes with `generateMetadata` + `generateStaticParams` + schema will be 60-80 lines. This is fine — the goal is architectural separation, not minimizing LOC. |

---

## Verification Summary

| Phase | Gate                                                     |
| ----- | -------------------------------------------------------- |
| 0     | Scope confirmed against actual app/ directories          |
| 1     | `pnpm type-check` — 0 errors                             |
| 2     | `pnpm type-check` + `base-template` build                |
| 3     | `pnpm type-check` + `_castor-plumbing` build + visual QA |
| 4     | `pnpm type-check` + all 4 site builds                    |
| 5     | `pnpm type-check` + `_rigel-events` build                |
| 6     | Dry-run scaffold (castor + rigel) + `pnpm type-check`    |
| 7     | `pnpm type-check` + full `pnpm build` (all sites)        |
