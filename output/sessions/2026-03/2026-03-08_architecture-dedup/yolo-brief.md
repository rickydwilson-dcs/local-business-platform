# YOLO Implementation Brief: Architecture Deduplication

**Branch:** feature/architecture-dedup (created from develop)
**Session spec:** output/sessions/2026-03-08_architecture-dedup/yolo-brief.md
**Mode:** Autonomous execution — implement all phases, verify after each, STOP on error
**Orchestrator model:** sonnet

---

## Context

The monorepo has ~2,500 lines of duplicated code across 3 sites (base-template, dj-fox-electrical, colossus-scaffolding). Files like `lib/content.ts`, `lib/schema.ts`, `lib/mdx.tsx`, `ContactForm.tsx`, and API routes are copied with minimal variation. This plan extracts shared code into `packages/core-components` using factory patterns, replacing site-local copies with thin configured shims that preserve existing `@/lib/*` import paths.

The synthesis was reviewed and approved via dual-model peer review (Claude + Codex). Implement it exactly as specified below.

---

## Model Tiers

| Tier   | Alias    | Cost (in/out per MTok) | Use for                                                                                             |
| ------ | -------- | ---------------------- | --------------------------------------------------------------------------------------------------- |
| Opus   | `opus`   | $15/$75                | Phases with >5 interdependent files, architectural rewrites, judgment calls not covered by the spec |
| Sonnet | `sonnet` | $3/$15                 | Standard implementation — file edits, feature wiring, most phases                                   |
| Haiku  | `haiku`  | $0.80/$4               | Mechanical tasks: find-replace, import additions, grep checks, content validation                   |

Default orchestrator: **sonnet**. Default sub-agent: **sonnet** unless the task is clearly mechanical (→ haiku) or requires deep cross-file reasoning (→ opus).

---

## Pre-flight

```bash
git checkout develop && git pull
git checkout -b feature/architecture-dedup
pnpm type-check   # must be clean before starting
```

---

## Phase 0: Baseline and Safety Harness

**Goal:** Establish a clean baseline so any regression is attributable to a specific migration step.
**Model:** haiku — mechanical verification only

### Actions

1. Run full build and lint:

```bash
# Verification gate — STOP if this fails
pnpm clean && pnpm build && pnpm lint && pnpm type-check
```

2. Run unit tests for each site:

```bash
cd sites/base-template && npm test
cd sites/dj-fox-electrical && npm test
cd sites/colossus-scaffolding && npm test
```

3. Document any pre-existing failures in this file under "Baseline Notes" at the bottom. These are NOT regressions from this work.

No commit for this phase — it's verification only.

---

## Phase 1: Extract Zero-Divergence Utility Modules

**Goal:** Extract `lib/site.ts`, `lib/contact-info.ts`, CSRF route, and analytics route into core-components.
**Model:** sonnet — standard file creation and editing across multiple packages

These files are identical (or near-identical) across sites. No design judgment needed — pure extraction with factory wrappers.

### Step 1.1: Extract `lib/site.ts` → `packages/core-components/src/lib/site-utils.ts`

Read all three sites' `lib/site.ts` files in parallel:

- `sites/base-template/lib/site.ts` (45 lines)
- `sites/dj-fox-electrical/lib/site.ts` (45 lines)
- `sites/colossus-scaffolding/lib/site.ts` (14 lines)

**Create:** `packages/core-components/src/lib/site-utils.ts`

Design:

```typescript
// Factory for URL-dependent utilities
export function createSiteUtils(siteUrl: string) {
  function absUrl(path: string): string {
    const baseUrl = siteUrl.replace(/\/$/, "");
    const cleanPath = path.startsWith("/") ? path : `/${path}`;
    return `${baseUrl}${cleanPath}`;
  }
  return { absUrl };
}

// Pure utilities (no config needed) — copy implementations from base-template
export function formatPhone(phone: string): string {
  /* ... */
}
export function telLink(phone: string): string {
  /* ... */
}
export function mailtoLink(email: string, subject?: string): string {
  /* ... */
}
export function slugify(text: string): string {
  /* ... */
}
```

**Add exports** to `packages/core-components/src/index.ts`.

**Replace each site's `lib/site.ts`** with a 5-line configured shim:

```typescript
import {
  createSiteUtils,
  formatPhone,
  telLink,
  mailtoLink,
  slugify,
} from "@platform/core-components";
import { siteConfig } from "@/site.config";
const { absUrl } = createSiteUtils(siteConfig.url);
export { absUrl, formatPhone, telLink, mailtoLink, slugify };
```

### Step 1.2: Extract `lib/contact-info.ts` → `packages/core-components/src/lib/contact-info.ts`

Read all three sites' `lib/contact-info.ts` files in parallel:

- `sites/base-template/lib/contact-info.ts` (137 lines)
- `sites/dj-fox-electrical/lib/contact-info.ts` (137 lines)
- `sites/colossus-scaffolding/lib/contact-info.ts` (93 lines)
- `packages/core-components/src/lib/contact-info.ts` (53 lines — type stub, replace it)

**Create/replace:** `packages/core-components/src/lib/contact-info.ts`

Design: Accept a config object, return all the constants and formatters. Use the base-template implementation as the source. The interface must cover all fields used across all three sites.

```typescript
export interface ContactInfoConfig {
  name: string;
  legalName: string;
  email: string;
  phone: string;
  address: { street: string; city: string; region: string; postalCode: string; country: string };
  hours: Record<string, string>;
}

export function createContactInfo(config: ContactInfoConfig) {
  // Return: BUSINESS_NAME, BUSINESS_EMAIL, PHONE_DISPLAY, PHONE_HREF,
  // FULL_ADDRESS, formatPhoneDisplay, getBusinessHours, etc.
}
```

**Add exports** to `packages/core-components/src/index.ts`.

**Replace each site's `lib/contact-info.ts`** with a configured shim:

```typescript
import { createContactInfo } from "@platform/core-components";
import { siteConfig } from "@/site.config";
export const { BUSINESS_NAME, BUSINESS_EMAIL, PHONE_DISPLAY /* all other exports */ } =
  createContactInfo(siteConfig.business);
```

### Step 1.3: Extract CSRF token route → `packages/core-components/src/lib/api/csrf-route.ts`

Read all three CSRF routes in parallel:

- `sites/base-template/app/api/csrf-token/route.ts` (40 lines)
- `sites/dj-fox-electrical/app/api/csrf-token/route.ts` (40 lines)
- `sites/colossus-scaffolding/app/api/csrf-token/route.ts` (62 lines)

**Create:** `packages/core-components/src/lib/api/csrf-route.ts`

Export a `createCsrfTokenHandler(expirationSeconds?)` factory that returns a `GET` handler.

**Replace each site's route** with ~4 lines:

```typescript
import { createCsrfTokenHandler } from "@platform/core-components/lib/api/csrf-route";
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const GET = createCsrfTokenHandler();
```

**Note:** Check what `generateCsrfToken` imports from — it's likely in `@platform/core-components` security utils already. Use the correct import path.

### Step 1.4: Extract analytics track route → `packages/core-components/src/lib/api/analytics-route.ts`

Read all analytics routes in parallel:

- `sites/base-template/app/api/analytics/track/route.ts` (338 lines)
- `sites/colossus-scaffolding/app/api/analytics/track/route.ts` (337 lines)
- Check if `sites/dj-fox-electrical/app/api/analytics/track/route.ts` exists

**Create:** `packages/core-components/src/lib/api/analytics-route.ts`

Export `createAnalyticsTrackHandler()` factory returning `{ POST, GET }` handlers.

**Replace each site's route** with a thin wrapper importing from the factory.

### Phase 1 Verification

```bash
# Verification gate — STOP if this fails
pnpm type-check && pnpm build
```

### Phase 1 Commit

```bash
git add packages/core-components/src/lib/site-utils.ts \
  packages/core-components/src/lib/contact-info.ts \
  packages/core-components/src/lib/api/csrf-route.ts \
  packages/core-components/src/lib/api/analytics-route.ts \
  packages/core-components/src/index.ts \
  sites/base-template/lib/site.ts \
  sites/base-template/lib/contact-info.ts \
  sites/base-template/app/api/csrf-token/route.ts \
  sites/base-template/app/api/analytics/track/route.ts \
  sites/dj-fox-electrical/lib/site.ts \
  sites/dj-fox-electrical/lib/contact-info.ts \
  sites/dj-fox-electrical/app/api/csrf-token/route.ts \
  sites/colossus-scaffolding/lib/site.ts \
  sites/colossus-scaffolding/lib/contact-info.ts \
  sites/colossus-scaffolding/app/api/csrf-token/route.ts \
  sites/colossus-scaffolding/app/api/analytics/track/route.ts

git commit -m "$(cat <<'EOF'
refactor: extract site-utils, contact-info, CSRF and analytics routes to core-components

Move zero-divergence utility modules into shared packages using factory
patterns. Each site keeps a thin configured shim preserving @/lib/* imports.

- createSiteUtils() for absUrl + pure phone/email/slug helpers
- createContactInfo() for business contact constants and formatters
- createCsrfTokenHandler() for CSRF token API route
- createAnalyticsTrackHandler() for analytics tracking API route

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>
EOF
)"
```

---

## Phase 2: Consolidate Business Config

**Goal:** Eliminate overlapping data between `site.config.ts` and `lib/business-config.ts` across all sites.
**Model:** sonnet — config restructuring requires understanding relationships between files

### Actions

Read in parallel:

- `sites/base-template/site.config.ts`
- `sites/base-template/lib/business-config.ts` (240 lines)
- `sites/dj-fox-electrical/site.config.ts`
- `sites/dj-fox-electrical/lib/business-config.ts` (240 lines)
- `sites/colossus-scaffolding/site.config.ts`
- `sites/colossus-scaffolding/lib/business-config.ts` (116 lines)

**Design:** Add a `schema` section to each site's `site.config.ts` containing `businessConfig` and `businessType`. Data currently duplicated between the two files gets consolidated into `site.config.ts` only.

**Replace each site's `lib/business-config.ts`** with a 3-line re-export:

```typescript
import { siteConfig } from "@/site.config";
export const businessConfig = siteConfig.schema.businessConfig;
export const businessType = siteConfig.schema.businessType;
```

**Important:** When moving data into `site.config.ts`, preserve exact field values (phone format, country codes, address strings). Do NOT normalize or reformat any values.

### Phase 2 Verification

```bash
# Verification gate — STOP if this fails
pnpm type-check && pnpm build
```

Manually verify: the `businessConfig` object exported from each site's `lib/business-config.ts` has identical field values before and after. Use `console.log(JSON.stringify(businessConfig))` in a temp script if needed.

### Phase 2 Commit

```bash
git add sites/*/site.config.ts sites/*/lib/business-config.ts

git commit -m "$(cat <<'EOF'
refactor: consolidate business config into site.config.ts

Add schema section to each site's site.config.ts containing businessConfig
and businessType. lib/business-config.ts becomes a thin re-export, eliminating
the data duplication between the two config files.

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>
EOF
)"
```

---

## Phase 3: Extract Schema Generators

**Goal:** Move `lib/schema.ts` (~420 lines) into core-components using dependency injection.
**Model:** sonnet — factory pattern implementation with type design
**Depends on:** Phase 1 (site-utils for `absUrl`) and Phase 2 (business config consolidation)

### Actions

Read in parallel:

- `sites/base-template/lib/schema.ts` (420 lines)
- `sites/dj-fox-electrical/lib/schema.ts` (420 lines)
- `sites/colossus-scaffolding/lib/schema.ts` (213 lines)

**Create:** `packages/core-components/src/lib/schema-generators.ts`

```typescript
export interface SchemaContext {
  absUrl: (path: string) => string;
  businessConfig: BusinessConfig;
  businessType: string;
}

export function createSchemaGenerators(ctx: SchemaContext) {
  return {
    getLocalBusinessSchema,
    getWebSiteSchema,
    getBreadcrumbSchema,
    getFAQSchema,
    getServiceAreaSchema,
    getArticleSchema,
    getAggregateRatingSchema,
  };
}
```

Copy the full implementation from base-template (it's the most complete). All functions use `ctx.absUrl` and `ctx.businessConfig` instead of direct imports. Export all types (`ArticleSchemaOptions`, `AggregateRatingOptions`, etc.).

**Add exports** to `packages/core-components/src/index.ts`.

**Replace each site's `lib/schema.ts`** with a configured shim:

```typescript
import { createSchemaGenerators } from "@platform/core-components/lib/schema-generators";
import { absUrl } from "./site";
import { businessConfig, businessType } from "./business-config";
export const {
  getLocalBusinessSchema,
  getWebSiteSchema,
  getBreadcrumbSchema,
  getFAQSchema,
  getServiceAreaSchema,
  getArticleSchema,
  getAggregateRatingSchema,
} = createSchemaGenerators({ absUrl, businessConfig, businessType });
// Re-export types
export type {
  ArticleSchemaOptions,
  AggregateRatingOptions,
} from "@platform/core-components/lib/schema-generators";
```

### Phase 3 Verification

```bash
# Verification gate — STOP if this fails
pnpm type-check && pnpm build
```

### Phase 3 Commit

```bash
git add packages/core-components/src/lib/schema-generators.ts \
  packages/core-components/src/index.ts \
  sites/*/lib/schema.ts

git commit -m "$(cat <<'EOF'
refactor: extract schema generators to core-components

createSchemaGenerators() accepts absUrl + businessConfig via dependency
injection. Each site's lib/schema.ts becomes a configured shim. Includes
all 7 schema generators: LocalBusiness, WebSite, Breadcrumb, FAQ,
ServiceArea, Article, AggregateRating.

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>
EOF
)"
```

---

## Phase 4: Extract MDX System

**Goal:** Deduplicate `mdx-components.tsx` and `lib/mdx.tsx`.
**Model:** sonnet — component extraction with injection pattern

### Step 4.1: Extract `mdx-components.tsx`

Read in parallel:

- `sites/base-template/mdx-components.tsx` (277 lines)
- `sites/dj-fox-electrical/mdx-components.tsx` (277 lines)
- `sites/colossus-scaffolding/mdx-components.tsx` (66 lines)

**Create:** `packages/core-components/src/components/mdx/mdx-components.tsx`

Move the full shared component map (InfoBox, QuoteBlock, ImageWithCaption, heading/paragraph/list overrides) from base-template. `InfoBox` keeps its semantic Tailwind colors (blue-50, green-50, etc.) — do NOT convert these to theme tokens.

Export both:

- `useMDXComponents` function (for Next.js MDX integration)
- `createMdxComponentsMap()` function (for sites that want to extend)

**Replace each site's root-level `mdx-components.tsx`** with a thin re-export. Next.js requires this file to exist at the root:

```typescript
export { useMDXComponents } from "@platform/core-components/src/components/mdx/mdx-components";
```

If colossus has custom MDX components, merge them:

```typescript
import { createMdxComponentsMap } from "@platform/core-components/src/components/mdx/mdx-components";
const base = createMdxComponentsMap();
export function useMDXComponents(components) {
  return { ...base, ...components };
}
```

### Step 4.2: Extract `lib/mdx.tsx`

Read in parallel:

- `sites/base-template/lib/mdx.tsx` (180 lines)
- `sites/dj-fox-electrical/lib/mdx.tsx` (180 lines)
- `sites/colossus-scaffolding/lib/mdx.tsx` (87 lines)

**Create:** `packages/core-components/src/lib/mdx.tsx`

```typescript
export function createMdxLoader(mdxComponents: MDXComponents) {
  async function loadMdx({ baseDir, slug }) {
    /* uses injected mdxComponents */
  }
  function listSlugs(baseDir) {
    /* ... */
  }
  function getMdxFiles(dir) {
    /* ... */
  }
  function getMdxContent(filePath) {
    /* ... */
  }
  function getPageImage(dir, slug) {
    /* ... */
  }
  return { loadMdx, listSlugs, getMdxFiles, getMdxContent, getPageImage };
}
```

Use base-template as the source (most complete). The key change: instead of `import mdxComponents from '@/mdx-components'`, accept it as a parameter.

**Dependency note:** `next-mdx-remote`, `remark-gfm`, `rehype-slug`, `rehype-autolink-headings` resolve from the site's own `node_modules`. No changes to core-components `package.json`.

**Replace each site's `lib/mdx.tsx`** with a shim:

```typescript
import { createMdxLoader } from "@platform/core-components/lib/mdx";
import mdxComponents from "@/mdx-components";
export const { loadMdx, listSlugs, getMdxFiles, getMdxContent, getPageImage } =
  createMdxLoader(mdxComponents);
```

### Phase 4 Verification

```bash
# Verification gate — STOP if this fails
pnpm type-check && pnpm build
```

### Phase 4 Commit

```bash
git add packages/core-components/src/components/mdx/mdx-components.tsx \
  packages/core-components/src/lib/mdx.tsx \
  packages/core-components/src/index.ts \
  sites/*/mdx-components.tsx \
  sites/*/lib/mdx.tsx

git commit -m "$(cat <<'EOF'
refactor: extract MDX components and loader to core-components

- Shared mdx-components.tsx with InfoBox, QuoteBlock, ImageWithCaption
- createMdxLoader() accepts MDX components map via injection
- Each site keeps root mdx-components.tsx (Next.js requirement) as thin re-export
- Each site keeps lib/mdx.tsx as configured shim

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>
EOF
)"
```

---

## Phase 5: Extract Content System (HIGHEST RISK)

**Goal:** Rewrite `content.ts` as canonical superset in core-components. This is the riskiest phase — content drives `generateStaticParams` across all pages.
**Model:** opus — highest-risk phase with >5 interdependent files, requires deep cross-file reasoning to reconcile 3 divergent implementations

**CRITICAL:** Do NOT "activate" the existing `packages/core-components/src/lib/content.ts` — it is a divergent stub. **Rewrite from scratch** as a canonical superset of all three sites' implementations.

### Actions

Read all content files in parallel:

- `sites/base-template/lib/content.ts` (580 lines)
- `sites/dj-fox-electrical/lib/content.ts` (571 lines)
- `sites/colossus-scaffolding/lib/content.ts` (384 lines)
- `packages/core-components/src/lib/content.ts` (362 lines — the divergent stub, read for reference only)
- `packages/core-components/src/lib/content-schemas.ts` (the canonical schema types)

**Rewrite:** `packages/core-components/src/lib/content.ts`

```typescript
export interface ContentUtilsOptions {
  /** Optional location slug provider for filtering */
  getLocationSlugs?: () => Promise<string[]>;
  /** Optional custom service sort function */
  serviceSortFn?: (a: ServiceItem, b: ServiceItem) => number;
  /** Optional image field resolver (for heroImage vs image differences) */
  imageResolver?: (frontmatter: Record<string, unknown>) => string | undefined;
}

export function createContentUtils(options?: ContentUtilsOptions) {
  // Returns FULL SUPERSET of all content functions from all 3 sites:
  // getContentItems, getContentItem, generateContentParams,
  // getServices, getService, getLocations, getLocation,
  // getBlogPosts, getBlogPost, getProjects, getProject,
  // getProjectsByType, getTestimonials, getTestimonialsByService,
  // getTestimonialsByLocation
}
```

**Design decisions to implement:**

1. All types come from `./content-schemas` (already in core-components)
2. Location filtering: opt-in via `getLocationSlugs` callback. If not provided, no filtering.
3. Custom sorting: opt-in via `serviceSortFn`. Default is alphabetical by title.
4. Image resolver: default returns `frontmatter.heroImage || frontmatter.image`
5. Full superset: include `getProjectsByType` even though colossus doesn't use it
6. Add code comment documenting that `process.cwd()` is safe — resolves to site root at build time

**Replace each site's `lib/content.ts`** with a configured shim.

Base-template shim:

```typescript
import { createContentUtils } from "@platform/core-components";
import { getLocationSlugs } from "./locations-config";
export const {
  getServices,
  getService,
  getLocations,
  getLocation,
  getBlogPosts,
  getBlogPost,
  getProjects,
  getProject,
  getProjectsByType,
  getTestimonials,
  getTestimonialsByService,
  getTestimonialsByLocation,
  generateContentParams,
} = createContentUtils({ getLocationSlugs });
```

DJ-Fox shim (no location filtering):

```typescript
import { createContentUtils } from "@platform/core-components";
export const {
  getServices,
  getService,
  getLocations,
  getLocation,
  getBlogPosts,
  getBlogPost,
  getProjects,
  getProject,
  getProjectsByType,
  getTestimonials,
  getTestimonialsByService,
  getTestimonialsByLocation,
  generateContentParams,
} = createContentUtils();
```

Colossus shim (custom sort + location filtering):

```typescript
import { createContentUtils } from "@platform/core-components";
import { getLocationSlugs } from "./locations-config";
const mainCategories = [
  "Commercial Scaffolding",
  "Residential Scaffolding",
  "Industrial Scaffolding",
];
const scaffoldingSortFn = (a, b) => {
  /* colossus category-first sorting logic */
};
export const {
  getServices,
  getService,
  getLocations,
  getLocation,
  getBlogPosts,
  getBlogPost,
  getProjects,
  getProject,
  generateContentParams,
} = createContentUtils({ getLocationSlugs, serviceSortFn: scaffoldingSortFn });
```

**Important:** Read colossus's content.ts carefully for the exact sorting logic. Preserve it exactly in the shim's `scaffoldingSortFn`.

### Phase 5 Verification

```bash
# Verification gate — STOP if this fails
pnpm type-check && pnpm build
```

Additional checks:

- Verify service listing order on colossus matches pre-migration (custom sort preserved)
- Verify `generateStaticParams` produces same slugs as before (spot-check a few routes)
- Run unit tests: `cd sites/base-template && npm test && cd ../dj-fox-electrical && npm test && cd ../colossus-scaffolding && npm test`

### Phase 5 Commit

```bash
git add packages/core-components/src/lib/content.ts \
  packages/core-components/src/index.ts \
  sites/*/lib/content.ts

git commit -m "$(cat <<'EOF'
refactor: extract content system to core-components as canonical superset

Rewrite content.ts from scratch (not activating the divergent stub).
createContentUtils() accepts optional getLocationSlugs, serviceSortFn,
and imageResolver callbacks for site-specific behavior.

- Full superset: all functions from all 3 sites
- Colossus custom service sorting preserved via serviceSortFn
- Location filtering opt-in via getLocationSlugs callback
- process.cwd() documented as safe (resolves to site root at build time)

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>
EOF
)"
```

---

## Phase 6: Deduplicate ContactForm and Contact Route

**Goal:** Unify ContactForm component and contact API route across all sites.
**Model:** opus — highest complexity phase, requires reconciling 3 divergent implementations with different field sets, validation approaches, and email providers

### Step 6.1: Unify ContactForm

Read all ContactForm implementations in parallel:

- `sites/base-template/components/ui/ContactForm.tsx` (347 lines)
- `sites/dj-fox-electrical/components/ui/ContactForm.tsx` (330 lines)
- `sites/colossus-scaffolding/components/ui/ContactForm.tsx` (383 lines)

**Create:** `packages/core-components/src/components/ui/contact-form/index.tsx`

```typescript
interface ContactFormProps {
  services: Array<{ slug: string; title: string }> | string[];
  serviceAreas: string[];
  extraFields?: ExtraFieldConfig[];
  variant?: "standard" | "detailed";
  className?: string;
}

interface ExtraFieldConfig {
  name: string;
  label: string;
  type: "select" | "text" | "textarea";
  options?: string[];
  required?: boolean;
}
```

Use base-template's implementation as the starting point. Add `extraFields` rendering and `variant` styling support for colossus's `projectType` and `urgency` fields.

**Important:** The shared ContactForm must check `response.success` (not `response.ok`) since Phase 6.2 normalizes the API response.

**Update all sites** to import from core-components:

- Base-template/dj-fox: `<ContactForm services={services} serviceAreas={serviceAreas} />`
- Colossus: Pass `extraFields` and `variant="detailed"` with hardcoded service/location lists as props

**Delete** the site-local `ContactForm.tsx` files after all imports are updated.

### Step 6.2: Create contact route factory

Read all contact routes in parallel:

- `sites/base-template/app/api/contact/route.ts` (347 lines)
- `sites/dj-fox-electrical/app/api/contact/route.ts` (347 lines)
- `sites/colossus-scaffolding/app/api/contact/route.tsx` (286 lines — note `.tsx` extension)

**Create:** `packages/core-components/src/lib/api/contact-route.ts`

```typescript
interface ContactRouteConfig {
  siteSlug: string;
  businessName: string;
  businessEmail: string;
  fromEmail: string;
  themeColors: { brandPrimary: string; textPrimary: string; background: string; textMuted: string };
  rateLimit: boolean;
}

export function createContactHandler(config: ContactRouteConfig) {
  return async function POST(request: Request): Promise<Response> {
    // CSRF validation → rate limiting → honeypot → input validation (collect ALL errors) → sanitization → send email via fetch → return { success: true }
  };
}
```

**Key normalization decisions:**

- Standardize on raw `fetch()` to Resend API (drop Resend SDK from colossus)
- Always return `{ success: true }` (not `{ ok: true }`)
- Always use `Response.json()` (not `NextResponse.json()`)
- Collect all validation errors (colossus approach — better UX)
- Accept `Request` (not `NextRequest`)

**Replace each site's route** with ~15 lines calling the factory. Normalize colossus's `route.tsx` → `route.ts`.

**Update colossus's `package.json`** to remove `resend` SDK dependency if present.

### Phase 6 Verification

```bash
# Verification gate — STOP if this fails
pnpm type-check && pnpm build
```

Run unit tests: `cd sites/base-template && npm test && cd ../dj-fox-electrical && npm test && cd ../colossus-scaffolding && npm test`

### Phase 6 Commit

```bash
git add packages/core-components/src/components/ui/contact-form/ \
  packages/core-components/src/lib/api/contact-route.ts \
  packages/core-components/src/index.ts \
  sites/*/app/api/contact/route.ts \
  sites/*/components/ui/ContactForm.tsx

# Also stage deleted files and any renamed colossus route
git add -u sites/*/components/ui/ContactForm.tsx
git add -u sites/colossus-scaffolding/app/api/contact/route.tsx

git commit -m "$(cat <<'EOF'
refactor: unify ContactForm and contact route across all sites

- Single ContactForm in core-components with extraFields prop for colossus
- createContactHandler() factory for contact API route
- Standardized on fetch (dropped Resend SDK), normalized response shape
- Colossus route.tsx normalized to route.ts

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>
EOF
)"
```

---

## Phase 7: CoverageMap Fix + Final Cleanup

**Goal:** Fix hardcoded hex colors in CoverageMap, clean up dead code, full verification.
**Model:** sonnet — standard edits + mechanical cleanup

### Step 7.1: Fix CoverageMap hex colors

Read: `packages/core-components/src/components/ui/coverage-map.tsx` (238 lines)

Add `countyColors?: Record<string, string>` prop to `CoverageMapProps`. Move current hardcoded colors to a `defaultCountyColors` constant used as the fallback. Remove `eslint-disable` comments for the hex colors.

```typescript
interface CoverageMapProps {
  locations: TownLocation[];
  center?: [number, number];
  zoom?: number;
  className?: string;
  height?: string;
  countyColors?: Record<string, string>;
}

const defaultCountyColors: Record<string, string> = {
  "East Sussex": "#2563eb",
  "West Sussex": "#059669",
  Kent: "#dc2626",
  Surrey: "#7c3aed",
};
```

### Step 7.2: Verify no orphaned imports

Run a grep across all sites for any remaining direct imports of the old file contents (not the shim pattern). If found, fix them.

```bash
# Check for direct imports that should now go through shims
grep -r "from.*content-schemas" sites/ --include="*.ts" --include="*.tsx" | grep -v node_modules | grep -v "lib/content"
```

### Step 7.3: Full verification

```bash
# Verification gate — STOP if this fails
pnpm clean
pnpm build
pnpm lint
pnpm type-check
```

```bash
# Unit tests
cd sites/base-template && npm test
cd ../../sites/dj-fox-electrical && npm test
cd ../../sites/colossus-scaffolding && npm test
```

### Step 7.4: Update documentation

Spawn parallel agents:

Task 1 (model: haiku): Update `packages/core-components/src/index.ts` barrel exports if any new exports are missing.

Task 2 (model: haiku): If `packages/core-components/CLAUDE.md` exists, update it with the new shared modules. If it doesn't exist, skip.

Task 3 (model: haiku): Check `docs/architecture/how-site-creation-works.md` — if it references copying `lib/content.ts`, `lib/schema.ts`, etc., update to mention that new sites get thin shims instead of full copies.

### Phase 7 Commit

```bash
git add -A

git commit -m "$(cat <<'EOF'
refactor: fix CoverageMap hex colors + final cleanup

- CoverageMap accepts countyColors prop (defaults preserved)
- Removed eslint-disable comments for hardcoded hex colors
- Updated documentation for new shared module pattern
- Full build/lint/type-check/test verification passed

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>
EOF
)"
```

---

## Cost Estimate

| Phase                          | Model  | Est. input tokens | Est. output tokens | Est. cost  |
| ------------------------------ | ------ | ----------------- | ------------------ | ---------- |
| Phase 0: Baseline              | haiku  | ~8k               | ~1k                | $0.01      |
| Phase 1: Utility extraction    | sonnet | ~25k              | ~8k                | $0.20      |
| Phase 2: Business config       | sonnet | ~20k              | ~5k                | $0.14      |
| Phase 3: Schema generators     | sonnet | ~30k              | ~8k                | $0.21      |
| Phase 4: MDX system            | sonnet | ~30k              | ~8k                | $0.21      |
| Phase 5: Content system        | opus   | ~40k              | ~12k               | $1.50      |
| Phase 6: ContactForm + route   | opus   | ~40k              | ~12k               | $1.50      |
| Phase 7: CoverageMap + cleanup | sonnet | ~15k              | ~5k                | $0.12      |
| **Total**                      |        | **~208k**         | **~59k**           | **~$3.89** |

Rates: Opus $15/$75, Sonnet $3/$15, Haiku $0.80/$4 per MTok.
Estimation: ~5 tokens per line of code. Input = files read + brief (~3k) + system prompt (~3k). Output = code written + verification output (~500/gate).

---

## Final Report

After all phases complete, output:

1. Phases completed — list each with commit SHA
2. Build status — confirm `pnpm lint && pnpm type-check && pnpm build` passes
3. Any exceptions or intentional deviations from the plan
4. Token usage and cost estimate:

   | Model     | Est. input tokens     | Est. output tokens | Est. cost |
   | --------- | --------------------- | ------------------ | --------- |
   | sonnet    | [total across phases] |                    | $X.XX     |
   | haiku     | [if used]             |                    | $X.XX     |
   | opus      | [if used]             |                    | $X.XX     |
   | **Total** |                       |                    | **$X.XX** |

   Estimate tokens from: files read (lines x 5) and written (lines x 5).
   Compare to the pre-flight Cost Estimate above.
   For exact figures: check console.anthropic.com.

---

## Update Session File

After completing all phases, append to `output/sessions/2026-03-08_architecture-dedup/yolo-brief.md`:

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

---

## Completed

**Date:** 2026-03-08
**Status:** All phases executed successfully

Extracted ~2,500 lines of duplicated code from 3 sites into `packages/core-components` using factory patterns across 7 phases. Phases 1-3 extracted utility modules (site-utils, contact-info, CSRF/analytics routes, business config, schema generators). Phase 4 extracted the MDX component map and loader — required a deviation from the brief: `remark-gfm` and `mdx/types` are not resolvable from core-components' node_modules path, so plugins were parameterized (sites pass them from their own node_modules) and a local type alias replaced the `mdx/types` import. Phase 5 canonically rewrote `content.ts` as a full superset factory. Phase 6 unified ContactForm (with `extraFields` prop for colossus) and contact routes. Phase 7 added `countyColors` prop to CoverageMap, removing hardcoded hex colors. All 7 phases verified with `pnpm type-check && pnpm build` passing. Changes are on `feature/architecture-dedup` branch, never pushed.

### Commits

- `f82f22d` refactor: extract site-utils, contact-info, CSRF and analytics routes to core-components
- `2c11e3c` refactor: consolidate business config into site.config.ts
- `09da207` refactor: extract schema generators to core-components
- `5fa1d10` refactor: extract MDX components and loader to core-components
- `9af91e9` refactor: extract content system to core-components as canonical superset
- `fa18c6f` refactor: unify ContactForm and contact route across all sites
- `d79de0b` refactor: fix CoverageMap hex colors + final cleanup
- When the plan says "rewrite from scratch", do NOT copy-paste the existing stub — read all source implementations and write a canonical version
- Normalize colossus `route.tsx` → `route.ts` for non-JSX API route handlers
