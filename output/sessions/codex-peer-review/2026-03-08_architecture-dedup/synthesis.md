# Implementation Plan: Architecture Deduplication

**Date:** 2026-03-08
**Status:** Ready for implementation — approved by dual-model peer review
**Source:** Synthesised from Claude and Codex independent plans

## Key Differences Between Plans

| Aspect | Claude | Codex | Synthesised Decision |
|--------|--------|-------|----------------------|
| Phase ordering | Utilities → Content → Schema → Components → Cleanup | Baseline → Utilities+Schema → Config → MDX → Content → Components → CoverageMap | **Codex order (content.ts after MDX)**. Content is highest-risk; doing MDX first means the MDX injection pattern is proven before content depends on it. |
| Business config consolidation | Add `schema` section to `site.config.ts`, keep `business-config.ts` as thin re-export | Create `mapSiteConfigToBusinessConfig()` mapper in core-components, potentially delete `business-config.ts` | **Claude's approach (schema section in site.config.ts)**. Simpler — a mapper function adds indirection without benefit when the data can just live in one place. Keep `business-config.ts` as a 3-line re-export for backwards compat. |
| Contact route: fetch vs SDK | Standardize on raw fetch, drop Resend SDK | Support both via provider abstraction (`resendFetchProvider`, `resendSdkProvider`) | **Claude's approach (standardize on fetch)**. The SDK is a thin wrapper with no added value for sending single emails. Eliminating the provider abstraction keeps the factory simple. Colossus migrates to fetch. |
| Contact route response shape | Always return `{ success: true }` | Allow site-level mapping at adapter boundary | **Claude's approach (normalize to `{ success: true }`)**. No external consumers depend on `{ ok: true }`. Normalize once in the factory. |
| MDX components file | Keep site-level `mdx-components.tsx` as thin re-export (Next.js requires it) | Delete site-level file if fully compatible | **Claude's approach (keep thin re-export)**. Next.js expects a root-level `mdx-components.tsx`. Deleting it risks build failures. |
| Baseline/safety harness phase | Not included | Phase 0: record checksums, capture test inventory | **Codex's addition (include Phase 0)**. Low cost, high value. Ensures regressions are attributable to migration steps. |
| Content API design | `createContentUtils({ getLocationSlugs, serviceSortFn })` | `createContentApi({ getLocationSlugs?, serviceSort?, imageResolver? })` | **Merged**. Use `createContentUtils` name (matches Claude's convention), include `imageResolver` option from Codex for heroImage handling. |
| Package boundary | Everything in core-components | Everything in core-components | **Agreement**. No new package needed. |

## Blind Spots Caught

- **Codex caught:** The existing `core-components/src/lib/content.ts` is partly a stub/divergent implementation — importing it naively could silently change behavior. Must explicitly rewrite as canonical API, not just "activate" it. Claude's plan said "activate the existing file" which understates the required work.
- **Codex caught:** Route file naming inconsistency (`route.tsx` vs `route.ts`) — colossus contact route is `.tsx`. Normalize to `.ts` for non-JSX handlers during migration.
- **Codex caught:** Need explicit mapping tests when consolidating business config to prevent accidental field normalization (country codes, phone formats).
- **Claude caught:** `process.cwd()` resolves to the site's root directory at build time even when code lives in a package — this is safe and requires no workaround. Important to document so future developers don't "fix" it.
- **Claude caught:** The `extraFields` prop pattern for ContactForm is cleaner than any alternative — it avoids site-specific conditionals in the shared component while accommodating colossus's extra fields.
- **Claude caught:** Thin shims preserving `@/lib/*` import paths avoid a massive find-and-replace across all page files. Codex mentioned this as an option but didn't commit to it as the default strategy.

---

## Implementation Plan

### Phase 0: Baseline and Safety Harness

**Goal:** Establish a clean baseline so any regression is attributable to a specific migration step.

**Actions:**
1. Ensure all sites build cleanly: `pnpm clean && pnpm build && pnpm lint && pnpm type-check`
2. Run all existing tests: unit tests for each site + E2E smoke tests
3. Record current state: note any pre-existing failures so they're not confused with migration regressions

**Verification gate:** All builds green, all tests green (or pre-existing failures documented).

---

### Phase 1: Extract Zero-Divergence Utility Modules

Extract `lib/site.ts` and `lib/contact-info.ts` — files that are identical across base-template and dj-fox with minimal colossus differences. These have no downstream dependencies (other modules depend on them, but they depend on nothing shared).

#### Step 1.1: Extract `lib/site.ts`

**Create:** `packages/core-components/src/lib/site-utils.ts`

```typescript
// Factory for URL-dependent utilities
export function createSiteUtils(siteUrl: string) {
  function absUrl(path: string): string {
    const baseUrl = siteUrl.replace(/\/$/, '');
    const cleanPath = path.startsWith('/') ? path : `/${path}`;
    return `${baseUrl}${cleanPath}`;
  }
  return { absUrl };
}

// Pure utilities (no config needed)
export function formatPhone(phone: string): string { /* ... */ }
export function telLink(phone: string): string { /* ... */ }
export function mailtoLink(email: string, subject?: string): string { /* ... */ }
export function slugify(text: string): string { /* ... */ }
```

**Modify:** `packages/core-components/src/index.ts` — add exports

**Each site keeps `lib/site.ts` as a 5-line configured shim:**
```typescript
import { createSiteUtils, formatPhone, telLink, mailtoLink, slugify } from '@platform/core-components';
import { siteConfig } from '@/site.config';
const { absUrl } = createSiteUtils(siteConfig.url);
export { absUrl, formatPhone, telLink, mailtoLink, slugify };
```

**Verification:** `pnpm type-check && pnpm build`

#### Step 1.2: Extract `lib/contact-info.ts`

**Create:** `packages/core-components/src/lib/contact-info.ts`

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
  // Returns all exports: BUSINESS_NAME, BUSINESS_EMAIL, PHONE_DISPLAY, formatters, etc.
}
```

**Each site keeps `lib/contact-info.ts` as a configured shim:**
```typescript
import { createContactInfo } from '@platform/core-components';
import { siteConfig } from '@/site.config';
export const { BUSINESS_NAME, BUSINESS_EMAIL, PHONE_DISPLAY, /* ... */ } = createContactInfo(siteConfig.business);
```

**Verification:** `pnpm type-check && pnpm build`

#### Step 1.3: Extract CSRF token route

**Create:** `packages/core-components/src/lib/api/csrf-route.ts`

```typescript
export function createCsrfTokenHandler(expirationSeconds = 3600) {
  return async function GET(): Promise<Response> {
    const token = generateCsrfToken(expirationSeconds);
    return Response.json({ token, expiresIn: expirationSeconds, expiresAt: /* ... */ }, {
      status: 200,
      headers: { 'Cache-Control': 'no-store, no-cache, must-revalidate', Pragma: 'no-cache' },
    });
  };
}
```

**Each site route becomes ~4 lines:**
```typescript
import { createCsrfTokenHandler } from '@platform/core-components/lib/api/csrf-route';
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const GET = createCsrfTokenHandler();
```

**Verification:** `pnpm type-check && pnpm build`, manual test of CSRF flow in dev

#### Step 1.4: Extract analytics track route

**Create:** `packages/core-components/src/lib/api/analytics-route.ts`

Same factory pattern. Route is already identical across sites.

**Verification:** `pnpm type-check && pnpm build`

---

### Phase 2: Consolidate Business Config (Colossus Dual-Config Fix)

**Goal:** Eliminate overlapping data between `site.config.ts` and `lib/business-config.ts`.

**Design:** Add a `schema` section to each site's `site.config.ts` containing `businessConfig` and `businessType`. Then `lib/business-config.ts` becomes a 3-line re-export:

```typescript
// sites/colossus-scaffolding/lib/business-config.ts
import { siteConfig } from '@/site.config';
export const businessConfig = siteConfig.schema.businessConfig;
export const businessType = siteConfig.schema.businessType;
```

**Files modified:**
- `sites/*/site.config.ts` — add `schema` section with business config data
- `sites/*/lib/business-config.ts` — replace with re-export from site.config

**Testing:** Add explicit mapping tests to verify field values (phone format, country code, address) match before/after.

**Verification:** `pnpm type-check && pnpm build`, check JSON-LD output in page source matches pre-migration

---

### Phase 3: Extract Schema Generators

**Depends on:** Phase 1 (site-utils for `absUrl`) and Phase 2 (business config consolidation).

**Create:** `packages/core-components/src/lib/schema-generators.ts`

```typescript
export interface SchemaContext {
  absUrl: (path: string) => string;
  businessConfig: BusinessConfig;
  businessType: string;
}

export function createSchemaGenerators(ctx: SchemaContext) {
  return {
    getLocalBusinessSchema: () => { /* ... */ },
    getWebSiteSchema: () => { /* ... */ },
    getBreadcrumbSchema: (items) => { /* ... */ },
    getFAQSchema: (faqs, pageUrl) => { /* ... */ },
    getServiceAreaSchema: (locationName, locationSlug) => { /* ... */ },
    getArticleSchema: (options) => { /* ... */ },
    getAggregateRatingSchema: (options) => { /* ... */ },
  };
}
```

**Each site keeps `lib/schema.ts` as a configured shim:**
```typescript
import { createSchemaGenerators } from '@platform/core-components/lib/schema-generators';
import { absUrl } from './site';
import { businessConfig, businessType } from './business-config';
export const { getLocalBusinessSchema, getWebSiteSchema, /* ... */ } = createSchemaGenerators({ absUrl, businessConfig, businessType });
```

**Verification:** `pnpm type-check && pnpm build`, compare JSON-LD output before/after

---

### Phase 4: Extract MDX System

**Goal:** Deduplicate `mdx-components.tsx` and `lib/mdx.tsx`.

#### Step 4.1: Extract `mdx-components.tsx`

**Create:** `packages/core-components/src/components/mdx/mdx-components.tsx`

Contains the shared component map (InfoBox, QuoteBlock, ImageWithCaption, heading/paragraph/list overrides). `InfoBox` keeps its semantic Tailwind colors (blue-50, green-50, etc.) — these are intentional for callout styling.

**Each site keeps root-level `mdx-components.tsx` as a thin re-export** (Next.js requires this file):
```typescript
export { useMDXComponents } from '@platform/core-components/src/components/mdx/mdx-components';
```

Sites needing custom MDX components can merge:
```typescript
import { createMdxComponentsMap } from '@platform/core-components/src/components/mdx/mdx-components';
const base = createMdxComponentsMap();
export function useMDXComponents(components) {
  return { ...base, ...myCustomComponents, ...components };
}
```

#### Step 4.2: Extract `lib/mdx.tsx`

**Create:** `packages/core-components/src/lib/mdx.tsx`

```typescript
export function createMdxLoader(mdxComponents: MDXComponents) {
  async function loadMdx({ baseDir, slug }) { /* uses injected mdxComponents */ }
  return { loadMdx, listSlugs, getMdxFiles, getMdxContent, getPageImage };
}
```

**Dependency note:** Requires `next-mdx-remote`, `remark-gfm`, `rehype-slug`, `rehype-autolink-headings`. Since core-components has no build step and is consumed as raw source, the site's own `node_modules` resolves these. No changes to core-components `package.json`.

**Each site keeps `lib/mdx.tsx` as a shim:**
```typescript
import { createMdxLoader } from '@platform/core-components/lib/mdx';
import mdxComponents from '@/mdx-components';
export const { loadMdx, listSlugs, getMdxFiles, getMdxContent, getPageImage } = createMdxLoader(mdxComponents);
```

**Verification:** Build all sites, verify MDX rendering (headings, links, InfoBox, QuoteBlock) on service/blog/project pages. Verify `listSlugs` and `getPageImage` for sitemap generation.

---

### Phase 5: Extract Content System (Highest Risk)

**Why this is last among the extraction phases:** Content drives the most pages (`generateStaticParams`, service listings, blog indexes). Having MDX and schema extraction already proven reduces the blast radius.

**Create:** `packages/core-components/src/lib/content.ts` — **rewrite from scratch as canonical superset**, do NOT just "activate" the existing stub (it's divergent and incomplete).

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
  // Returns full superset of all content functions:
  // getContentItems, getContentItem, generateContentParams,
  // getServices, getService, getLocations, getLocation,
  // getBlogPosts, getBlogPost, getProjects, getProject,
  // getProjectsByType, getTestimonials, getTestimonialsByService,
  // getTestimonialsByLocation
}
```

**Design decisions:**
1. **Import source**: All types come from `./content-schemas` (already in core-components).
2. **Location filtering**: Opt-in via `getLocationSlugs` callback. Sites that don't need it (dj-fox) omit it.
3. **Custom sorting**: Opt-in via `serviceSortFn`. Colossus passes its scaffolding-category sort. Default is alphabetical.
4. **Image resolver**: Handles the `heroImage` vs `image` field difference. Default returns `frontmatter.heroImage || frontmatter.image`.
5. **Full superset**: Includes `getProjectsByType` (from base-template/dj-fox) even though colossus doesn't use it.
6. **`process.cwd()` is safe**: It resolves to the site's root at build time even when the code lives in a package. Document this clearly in a code comment.

**Each site keeps `lib/content.ts` as a configured shim:**
```typescript
// sites/colossus-scaffolding/lib/content.ts
import { createContentUtils } from '@platform/core-components';
import { getLocationSlugs } from './locations-config';

const mainCategories = ['Commercial Scaffolding', 'Residential Scaffolding', 'Industrial Scaffolding'];
const customSort = (a, b) => { /* colossus-specific sorting */ };

export const {
  getServices, getService, getLocations, getLocation,
  getBlogPosts, getBlogPost, getProjects, getProject,
  generateContentParams, /* ... */
} = createContentUtils({ getLocationSlugs, serviceSortFn: customSort });
```

**Verification:**
- `pnpm type-check && pnpm build`
- Verify service listing order on colossus (custom sort preserved)
- Verify location-specific service filtering on base-template and colossus
- Verify blog/project/testimonial pages render correctly
- Verify `generateStaticParams` produces correct slugs for all content types

---

### Phase 6: Deduplicate ContactForm and Contact Route

#### Step 6.1: Unify ContactForm

**Create:** `packages/core-components/src/components/ui/contact-form/index.tsx`

```typescript
interface ContactFormProps {
  services: Array<{ slug: string; title: string }> | string[];
  serviceAreas: string[];
  extraFields?: ExtraFieldConfig[];
  variant?: 'standard' | 'detailed';
  className?: string;
}

interface ExtraFieldConfig {
  name: string;
  label: string;
  type: 'select' | 'text' | 'textarea';
  options?: string[];
  required?: boolean;
}
```

**Usage:**
- Base-template/dj-fox: `<ContactForm services={services} serviceAreas={serviceAreas} />`
- Colossus: `<ContactForm services={[...]} serviceAreas={[...]} extraFields={[{ name: 'projectType', ... }, { name: 'urgency', ... }]} variant="detailed" />`

**Delete:** `sites/*/components/ui/ContactForm.tsx` after migration

#### Step 6.2: Create contact route factory

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
    // CSRF validation → rate limiting → honeypot → input validation (collect all errors) → sanitization → send email via fetch → return { success: true }
  };
}
```

**Key decisions:**
- Standardize on raw `fetch()` to Resend API (drop SDK dependency from colossus)
- Always return `{ success: true }` (normalize from `{ ok: true }`)
- Always use `Response.json()` (not `NextResponse.json()`)
- Collect all validation errors (colossus approach — better UX)
- Normalize route file extension to `.ts` (colossus currently uses `.tsx`)

**Each site route becomes ~15 lines:**
```typescript
import { createContactHandler } from '@platform/core-components/lib/api/contact-route';
import { siteConfig } from '@/site.config';
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const POST = createContactHandler({
  siteSlug: siteConfig.slug,
  businessName: siteConfig.business.name,
  businessEmail: siteConfig.business.email,
  fromEmail: process.env.RESEND_FROM_EMAIL || 'noreply@resend.dev',
  themeColors: { /* from theme.config */ },
  rateLimit: siteConfig.features.rateLimit,
});
```

**Verification:** Build all sites, test contact form end-to-end in dev for each site (CSRF fetch → form submission → validation → email sending)

---

### Phase 7: CoverageMap Fix + Cleanup

#### Step 7.1: Fix CoverageMap hex colors

**Modify:** `packages/core-components/src/components/ui/coverage-map.tsx`

Add `countyColors?: Record<string, string>` prop with current hardcoded values as default. Remove `eslint-disable` comments.

Sites that need custom colors pass them via props. Default preserves current behavior.

#### Step 7.2: Delete dead code

- Delete original `sites/*/lib/content.ts` (now shims — these were already replaced in Phase 5)
- Delete original `sites/*/lib/mdx.tsx` (replaced by shims in Phase 4)
- Delete original `sites/*/lib/schema.ts` (replaced by shims in Phase 3)
- Delete original `sites/*/components/ui/ContactForm.tsx` (replaced in Phase 6)
- Verify no orphaned imports remain

#### Step 7.3: Full verification

```bash
pnpm clean
pnpm build          # Full rebuild, no cache
pnpm lint
pnpm type-check
```

```bash
# Unit tests
cd sites/base-template && npm test
cd sites/dj-fox-electrical && npm test
cd sites/colossus-scaffolding && npm test

# E2E smoke tests
cd sites/colossus-scaffolding && npm run test:e2e:smoke
```

#### Step 7.4: Update documentation

- Update `packages/core-components/CLAUDE.md` with new exports
- Update `docs/architecture/how-site-creation-works.md` (new sites now get thin shims instead of full copies)
- Document `process.cwd()` safety in shared content utilities

---

## Risk Assessment

| Risk | Severity | Mitigation |
|------|----------|------------|
| Existing `core-components/content.ts` is divergent stub — naively "activating" it changes behavior | HIGH | Rewrite from scratch as canonical superset (Phase 5). Don't activate existing file. |
| `process.cwd()` resolves differently in shared package | ~~HIGH~~ NONE | Verified safe: resolves to Next.js project root (site directory) at build time. Document clearly. |
| Breaking MDX rendering during extraction | MEDIUM | Keep site-level `mdx-components.tsx` as thin re-export. Test MDX pages visually. |
| Contact form regression (CSRF, validation, email) | MEDIUM | Test end-to-end in dev for each site. Normalize incrementally (response shape, validation approach). |
| Colossus custom service sorting breaks | MEDIUM | Explicit `serviceSortFn` parameter. Snapshot-test service listing order before/after. |
| Business config field normalization (phone format, country code) | LOW-MEDIUM | Add explicit mapping tests comparing before/after values. |
| Type errors from changed import paths | LOW | `pnpm type-check` catches all. Run after every step. |
| Route file naming inconsistency | LOW | Normalize colossus `route.tsx` → `route.ts` for non-JSX handlers. |

## Trade-offs

1. **Factory pattern + thin shims:** Adds ~5-10 lines of boilerplate per site per module. The alternative (direct imports with module-level side effects) creates hidden coupling. Factories are explicit, testable, and preserve existing `@/lib/*` import paths — avoiding a massive find-and-replace across all page files.

2. **Standardize on fetch over Resend SDK:** Eliminates the provider abstraction entirely and removes a dependency from colossus. The Resend SDK adds no value for sending single templated emails. Trade-off: colossus loses the SDK's TypeScript types for email payloads (minor — the payload shape is simple).

3. **Normalize contact response to `{ success: true }`:** Breaking change for any client-side code in colossus that checks `{ ok: true }`. Must update colossus's ContactForm to check `success` instead of `ok`.

4. **Not extracting page-level components:** Intentionally left as site-specific. Even though some are similar, they contain enough layout/content differences to justify per-site ownership.

## Implementation Sessions

Recommended split into 3-4 sessions:

- **Session A:** Phases 0-2 (baseline, utilities, business config) — lowest risk, establishes patterns
- **Session B:** Phases 3-4 (schema, MDX) — medium risk, tests the factory pattern at scale
- **Session C:** Phase 5 (content system) — highest risk, isolated for careful testing
- **Session D:** Phases 6-7 (ContactForm, routes, CoverageMap, cleanup) — highest complexity but well-contained
