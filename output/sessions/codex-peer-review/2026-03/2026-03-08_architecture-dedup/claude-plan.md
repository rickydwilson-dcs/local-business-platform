# Claude Plan: Architecture Deduplication

## Overview

Extract ~2,500 lines of duplicated code from 3 sites into shared packages. The plan is organized into 5 phases, ordered from zero-divergence files (safest) to significantly-diverged files (require design decisions). Each phase can be verified independently before moving to the next.

## Phase 1: Zero-Divergence Extractions (Low Risk)

These files are identical (or whitespace-only different) across base-template and dj-fox. Colossus either matches or is missing. No design decisions needed -- pure move-and-re-export.

### Step 1.1: Extract `lib/site.ts` into core-components

**Files created:**

- `packages/core-components/src/lib/site-utils.ts`

**Design:** The functions (`absUrl`, `formatPhone`, `telLink`, `mailtoLink`, `slugify`) currently import `siteConfig` at module scope. To make them package-portable, change to a factory pattern:

```typescript
// packages/core-components/src/lib/site-utils.ts
export function createSiteUtils(siteUrl: string) {
  function absUrl(path: string): string {
    const baseUrl = siteUrl.replace(/\/$/, '');
    const cleanPath = path.startsWith('/') ? path : `/${path}`;
    return `${baseUrl}${cleanPath}`;
  }
  // ... formatPhone, telLink, mailtoLink, slugify (these are pure, no config needed)
  return { absUrl };
}

// Pure utilities that don't need config
export function formatPhone(phone: string): string { ... }
export function telLink(phone: string): string { ... }
export function mailtoLink(email: string, subject?: string): string { ... }
export function slugify(text: string): string { ... }
```

**Files modified:**

- `packages/core-components/src/index.ts` -- add exports
- `sites/base-template/lib/site.ts` -- replace with re-export + configured instance
- `sites/dj-fox-electrical/lib/site.ts` -- same
- `sites/colossus-scaffolding/lib/site.ts` -- same (if exists, or create thin wrapper)

**Site-local shim (each site keeps `lib/site.ts` as a 5-line configured re-export):**

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

**Verification:** `pnpm type-check && pnpm build`

### Step 1.2: Extract `lib/contact-info.ts` into core-components

**Files created:**

- `packages/core-components/src/lib/contact-info.ts`

**Design:** Accept a config object parameter rather than importing `siteConfig` directly:

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
  // Returns all the exports: BUSINESS_NAME, PHONE_DISPLAY, formatPhoneDisplay, etc.
}
```

**Site-local shim (each site keeps `lib/contact-info.ts` as a configured re-export):**

```typescript
import { createContactInfo } from '@platform/core-components';
import { siteConfig } from '@/site.config';
export const { BUSINESS_NAME, BUSINESS_EMAIL, PHONE_DISPLAY, ... } = createContactInfo(siteConfig.business);
```

**Verification:** `pnpm type-check && pnpm build`

### Step 1.3: Extract CSRF token route

**Files created:**

- `packages/core-components/src/lib/api/csrf-route.ts`

**Design:** Export a simple handler factory:

```typescript
import { generateCsrfToken } from "../security/csrf";

export function createCsrfTokenHandler(expirationSeconds = 3600) {
  return async function GET(): Promise<Response> {
    try {
      const token = generateCsrfToken(expirationSeconds);
      return Response.json(
        {
          token,
          expiresIn: expirationSeconds,
          expiresAt: new Date(Date.now() + expirationSeconds * 1000).toISOString(),
        },
        {
          status: 200,
          headers: { "Cache-Control": "no-store, no-cache, must-revalidate", Pragma: "no-cache" },
        }
      );
    } catch (error) {
      console.error("CSRF token generation error:", error);
      return Response.json({ error: "Failed to generate CSRF token" }, { status: 500 });
    }
  };
}
```

**Site routes become 4 lines each:**

```typescript
import { createCsrfTokenHandler } from "@platform/core-components/lib/api/csrf-route";
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const GET = createCsrfTokenHandler();
```

**Verification:** `pnpm type-check && pnpm build`, then manual test of CSRF flow in dev

### Step 1.4: Extract analytics track route

**Files created:**

- `packages/core-components/src/lib/api/analytics-route.ts`

**Design:** Same factory pattern. The route is already identical across all sites. Extract the POST and GET handlers.

```typescript
export function createAnalyticsTrackHandler() {
  return {
    POST: async function(request: NextRequest) { ... },
    GET: async function() { ... },
  };
}
```

**Site routes become:**

```typescript
import { createAnalyticsTrackHandler } from "@platform/core-components/lib/api/analytics-route";
const handlers = createAnalyticsTrackHandler();
export const POST = handlers.POST;
export const GET = handlers.GET;
```

**Verification:** `pnpm type-check && pnpm build`

---

## Phase 2: Content System Extraction (Medium Risk)

### Step 2.1: Activate the existing `core-components/src/lib/content.ts`

The file already exists in core-components but is unused. It's identical to colossus's copy. We need to reconcile the differences across all three sites.

**Design decisions:**

1. **Import source**: Change from `./content-schemas` to the proper barrel export (types are already in `content-schemas.ts` which is exported from core-components index).

2. **Location slug filtering**: Make it opt-in via a parameter:

   ```typescript
   export async function getContentItems(
     contentType: ContentType,
     options?: { getLocationSlugs?: () => Promise<string[]> }
   ): Promise<ContentItem[]>;
   ```

   Sites that need filtering pass their `getLocationSlugs` function. Sites that don't (dj-fox) omit it.

3. **Custom sorting**: Add an optional `sortFn` parameter:

   ```typescript
   export async function getContentItems(
     contentType: ContentType,
     options?: {
       getLocationSlugs?: () => Promise<string[]>;
       sortFn?: (a: ContentItem, b: ContentItem) => number;
     }
   ): Promise<ContentItem[]>;
   ```

   Colossus passes its custom scaffolding-category sort. Default is alphabetical.

4. **Missing functions**: Add `getProjectsByType` (from base-template/dj-fox) and keep all testimonial helpers. The shared version is a superset.

5. **`heroImage` field**: Normalize to always include both `image` and `heroImage` in the returned object (base-template approach).

**Files modified:**

- `packages/core-components/src/lib/content.ts` -- reconcile all differences
- `packages/core-components/src/index.ts` -- export content utilities
- `sites/base-template/lib/content.ts` -- replace with configured re-export
- `sites/dj-fox-electrical/lib/content.ts` -- replace with configured re-export
- `sites/colossus-scaffolding/lib/content.ts` -- replace with configured re-export

**Site-local shim example (colossus):**

```typescript
import { createContentUtils } from "@platform/core-components";
import { getLocationSlugs } from "./locations-config";

const mainCategories = [
  "Commercial Scaffolding",
  "Residential Scaffolding",
  "Industrial Scaffolding",
];
const customSort = (a, b) => {
  /* colossus sorting logic */
};

export const {
  getContentItems,
  getContentItem,
  generateContentParams,
  getServices,
  getService,
  getLocations,
  getLocation,
  getBlogPosts,
  getBlogPost /* ... */,
} = createContentUtils({ getLocationSlugs, serviceSortFn: customSort });
```

**Verification:** `pnpm type-check && pnpm build`, validate content renders correctly on all 3 sites in dev

### Step 2.2: Extract `lib/mdx.tsx` into core-components

**Files created:**

- `packages/core-components/src/lib/mdx.tsx`

**Design:** The key challenge is the `mdxComponents` import. Currently each site's `lib/mdx.tsx` does `import mdxComponents from '@/mdx-components'`. The shared version must accept components as a parameter.

```typescript
import { MDXRemote } from "next-mdx-remote/rsc";
import type { MDXComponents } from "mdx/types";

export function createMdxLoader(mdxComponents: MDXComponents) {
  async function loadMdx({ baseDir, slug }) {
    // ... same logic but uses injected mdxComponents
  }
  return { loadMdx, listSlugs, getMdxFiles, getMdxContent, getPageImage };
}
```

**Dependency consideration:** This requires `next-mdx-remote`, `remark-gfm`, `rehype-slug`, `rehype-autolink-headings` as dependencies. These are already in each site's `package.json`. Since core-components has no build step and is consumed as raw source, the site's own node_modules will resolve these imports. No changes needed to core-components `package.json`.

**Site-local shim:**

```typescript
import { createMdxLoader } from "@platform/core-components/lib/mdx";
import mdxComponents from "@/mdx-components";
export const { loadMdx, listSlugs, getMdxFiles, getMdxContent, getPageImage } =
  createMdxLoader(mdxComponents);
```

**Verification:** Build all sites, verify blog/service/project pages render MDX content correctly

### Step 2.3: Extract `mdx-components.tsx` into core-components (ARCH-003/CQ-010)

**Files created:**

- `packages/core-components/src/components/mdx/mdx-components.tsx`

**Design:** Move the shared component map (InfoBox, QuoteBlock, ImageWithCaption, heading/paragraph/list overrides) to core-components. Export both the components map and the `useMDXComponents` function.

The `InfoBox` component uses semantic Tailwind colours (blue-50, green-50, etc.) which are intentional for callout type differentiation -- these are NOT theme token violations and should NOT be converted.

**Important:** Next.js requires each site to have a root-level `mdx-components.tsx` (or the file will fail to compile). Each site keeps this file but it becomes a thin re-export:

```typescript
// sites/base-template/mdx-components.tsx
export { useMDXComponents } from "@platform/core-components/src/components/mdx/mdx-components";
```

If a site needs to add custom MDX components, they can merge:

```typescript
import { createMdxComponentsMap } from "@platform/core-components/src/components/mdx/mdx-components";
import type { MDXComponents } from "mdx/types";
const base = createMdxComponentsMap();
export function useMDXComponents(components: MDXComponents): MDXComponents {
  return { ...base, ...myCustomComponents, ...components };
}
```

**Verification:** Build all sites, verify MDX rendering (headings, links, lists, InfoBox, QuoteBlock)

---

## Phase 3: Schema & Config Consolidation (Medium Risk)

### Step 3.1: Extract `lib/schema.ts` into core-components (ARCH-004)

**Files created:**

- `packages/core-components/src/lib/schema-generators.ts`

**Design:** The schema generators currently import `absUrl` from `./site` and `businessConfig` from `./business-config`. To make them portable, use dependency injection:

```typescript
export interface SchemaContext {
  absUrl: (path: string) => string;
  businessConfig: BusinessConfig;
  businessType: string;
}

export function createSchemaGenerators(ctx: SchemaContext) {
  return {
    getLocalBusinessSchema: () => { /* uses ctx.absUrl, ctx.businessConfig */ },
    getWebSiteSchema: () => { ... },
    getBreadcrumbSchema: (items) => { ... },
    getFAQSchema: (faqs, pageUrl) => { ... },
    getServiceAreaSchema: (locationName, locationSlug) => { ... },
    getArticleSchema: (options) => { ... },
    getAggregateRatingSchema: (options) => { ... },
  };
}

// Also export types
export type { ArticleSchemaOptions, AggregateRatingOptions };
```

**Site-local shim:**

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

export { getLocalBusinessSchema as getOrganizationSchema }; // deprecated alias
export type {
  ArticleSchemaOptions,
  AggregateRatingOptions,
} from "@platform/core-components/lib/schema-generators";
```

**Verification:** Build all sites, check JSON-LD output in page source

### Step 3.2: Consolidate colossus dual-config (ARCH-008)

**Problem:** Colossus has `site.config.ts` with business info AND `lib/business-config.ts` with Schema.org-specific business data. Phone, email, name, address appear in both.

**Design:** Extend the `BaseSiteConfig` type to include a `schema` section that holds the `BusinessConfig` and `businessType`. Then `business-config.ts` becomes a derived file that reads from `site.config.ts`.

However, base-template and dj-fox also have `lib/business-config.ts`, so this isn't a colossus-only problem. The real fix is:

1. Each site's `site.config.ts` remains the single source of truth for ALL business data.
2. Each site's `lib/business-config.ts` imports from `site.config.ts` and transforms to `BusinessConfig` shape.
3. OR: the `BusinessConfig` data moves directly into `site.config.ts` under a `schema` key.

**Recommended approach:** Add a `schema: { businessType, businessConfig }` section to `site.config.ts`. Then `lib/business-config.ts` becomes:

```typescript
import { siteConfig } from "@/site.config";
export const businessConfig = siteConfig.schema.businessConfig;
export const businessType = siteConfig.schema.businessType;
```

This is a minimal change that eliminates the data duplication without restructuring the entire config system.

**Files modified:**

- `sites/colossus-scaffolding/site.config.ts` -- add schema section
- `sites/colossus-scaffolding/lib/business-config.ts` -- replace with re-export from site.config
- `sites/base-template/site.config.ts` -- add schema section
- `sites/base-template/lib/business-config.ts` -- replace with re-export
- `sites/dj-fox-electrical/site.config.ts` -- add schema section
- `sites/dj-fox-electrical/lib/business-config.ts` -- replace with re-export

**Verification:** Build all sites, check Schema.org output matches before/after

---

## Phase 4: Component & Route Deduplication (Higher Risk)

### Step 4.1: Fix CoverageMap hex colours (ARCH-002)

**Files modified:**

- `packages/core-components/src/components/ui/coverage-map.tsx`

**Design:** Add `countyColors` prop to `CoverageMapProps`:

```typescript
interface CoverageMapProps {
  locations: TownLocation[];
  center?: [number, number];
  zoom?: number;
  className?: string;
  height?: string;
  countyColors?: Record<string, string>; // NEW
}
```

Default value preserves current behaviour:

```typescript
const defaultCountyColors: Record<string, string> = {
  "East Sussex": "#2563eb",
  "West Sussex": "#059669",
  Kent: "#dc2626",
  Surrey: "#7c3aed",
};

const colors = countyColors ?? defaultCountyColors;
```

Remove the `eslint-disable` comments.

**Sites that use CoverageMap:** Update to pass `countyColors` prop (or use default). Future sites can customize.

**Verification:** Build, check map renders with correct colors

### Step 4.2: Unify ContactForm (ARCH-005)

**Files created:**

- `packages/core-components/src/components/ui/contact-form/index.tsx`

**Design:** A single `ContactForm` component with a flexible props API:

```typescript
interface ContactFormProps {
  /** Available services for dropdown */
  services: Array<{ slug: string; title: string }> | string[];
  /** Available service areas for dropdown */
  serviceAreas: string[];
  /** Additional form fields beyond the standard set */
  extraFields?: ExtraFieldConfig[];
  /** Form variant for styling differences */
  variant?: "standard" | "detailed";
  /** Custom class name */
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

Colossus would use it as:

```typescript
<ContactForm
  services={[
    { slug: 'access-scaffolding', title: 'Access Scaffolding' },
    // ...
  ]}
  serviceAreas={['East Sussex', 'West Sussex', 'Kent', 'Surrey', 'Other']}
  extraFields={[
    { name: 'projectType', label: 'Project Type', type: 'select', options: ['residential', 'commercial', 'industrial'] },
    { name: 'urgency', label: 'Urgency', type: 'select', options: ['standard', 'urgent', 'emergency'] },
  ]}
  variant="detailed"
/>
```

Base-template/dj-fox would use the standard variant:

```typescript
<ContactForm services={services} serviceAreas={serviceAreas} />
```

**Migration:** Move base-template's ContactForm to core-components, add the `extraFields` and `variant` props, then update all three sites to import from core-components. Remove site-local copies.

**Verification:** Build all sites, test contact form submission in dev mode for each site

### Step 4.3: Create contact route factory (ARCH-006/CQ-011)

**Files created:**

- `packages/core-components/src/lib/api/contact-route.ts`

**Design:** A factory that returns a POST handler:

```typescript
interface ContactRouteConfig {
  /** Site slug for rate limiting */
  siteSlug: string;
  /** Business name for email templates */
  businessName: string;
  /** Business email to receive submissions */
  businessEmail: string;
  /** From email address */
  fromEmail: string;
  /** Theme colors for email templates */
  themeColors: {
    brandPrimary: string;
    textPrimary: string;
    background: string;
    textMuted: string;
  };
  /** Whether to use rate limiting */
  rateLimit: boolean;
  /** Email provider configuration */
  emailProvider: "resend-fetch" | "resend-sdk";
}

export function createContactHandler(config: ContactRouteConfig) {
  return async function POST(request: Request): Promise<Response> {
    // CSRF validation
    // Rate limiting (if enabled)
    // Honeypot check
    // Input validation (normalized -- collect all errors)
    // Sanitization
    // Send email (using configured provider)
    // Return normalized response: { success: true, message: '...' }
  };
}
```

**Key normalization decisions:**

- Always return `{ success: true }` (not `{ ok: true }`)
- Always use `Response.json()` (not `NextResponse.json()`) for consistency
- Collect all validation errors (colossus approach -- better UX)
- Accept `Request` (not `NextRequest`) since we don't use NextRequest-specific features
- Email sending is abstracted behind the `emailProvider` config flag

**Site routes become ~15 lines:**

```typescript
import { createContactHandler } from "@platform/core-components/lib/api/contact-route";
import { siteConfig } from "@/site.config";
import { themeConfig } from "@/theme.config";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export const POST = createContactHandler({
  siteSlug: siteConfig.slug,
  businessName: siteConfig.business.name,
  businessEmail: siteConfig.business.email,
  fromEmail: process.env.RESEND_FROM_EMAIL || "noreply@resend.dev",
  themeColors: {
    brandPrimary: themeConfig.colors?.brand?.primary ?? "#3b82f6",
    textPrimary: themeConfig.colors?.surface?.foreground ?? "#374151",
    background: themeConfig.colors?.surface?.muted ?? "#f9fafb",
    textMuted: themeConfig.colors?.surface?.mutedForeground ?? "#6b7280",
  },
  rateLimit: siteConfig.features.rateLimit,
  emailProvider: "resend-fetch", // or 'resend-sdk' for colossus
});
```

**Risk:** The colossus route uses the Resend SDK while others use raw fetch. The factory must support both. Since the SDK is a thin wrapper around the same HTTP API, consider standardizing on raw fetch (eliminates the `resend` package dependency for colossus) or making both paths available.

**Recommendation:** Standardize on raw fetch. The Resend SDK adds no value over `fetch()` for sending a single email. This simplifies the factory and removes a dependency.

**Verification:** Build all sites, test contact form end-to-end in dev (CSRF fetch, form submission, email sending with Resend configured)

---

## Phase 5: Cleanup & Verification (Low Risk)

### Step 5.1: Remove dead code

- Delete `sites/*/lib/content.ts` (replaced by shared import)
- Delete `sites/*/lib/mdx.tsx` (replaced by shared import)
- Delete `sites/*/lib/schema.ts` (replaced by shared shim)
- Delete `sites/*/components/ui/ContactForm.tsx` (replaced by core-components)
- Verify no orphaned imports

### Step 5.2: Full build verification

```bash
pnpm clean
pnpm build          # Full rebuild, no cache
pnpm lint
pnpm type-check
```

### Step 5.3: Test verification

```bash
# Unit tests
cd sites/base-template && npm test
cd sites/dj-fox-electrical && npm test
cd sites/colossus-scaffolding && npm test

# E2E smoke tests
cd sites/colossus-scaffolding && npm run test:e2e:smoke
```

### Step 5.4: Update documentation

- Update `packages/core-components/CLAUDE.md` with new exports
- Update site-level `CLAUDE.md` files to reference shared imports
- Update `docs/architecture/how-site-creation-works.md` if the site creation template changes

---

## Risk Assessment

| Risk                                                    | Severity | Mitigation                                                                                                      |
| ------------------------------------------------------- | -------- | --------------------------------------------------------------------------------------------------------------- |
| `process.cwd()` resolves differently in shared package  | HIGH     | Verified: it resolves to the Next.js project root at build time, which is the site directory. No change needed. |
| Breaking MDX rendering during mdx-components extraction | MEDIUM   | Keep site-level `mdx-components.tsx` as thin re-export. Test MDX pages visually.                                |
| Contact form regression                                 | MEDIUM   | Test CSRF flow, validation, honeypot, and email sending manually in dev before merging.                         |
| Colossus custom service sorting breaks                  | LOW      | Explicitly test services page order before/after.                                                               |
| Type errors from changed import paths                   | LOW      | `pnpm type-check` catches all of these. Run after every step.                                                   |
| Breaking Turborepo cache                                | LOW      | `pnpm clean` then full rebuild verifies from scratch.                                                           |

## Estimated Effort

- **Phase 1** (zero-divergence): 2-3 hours
- **Phase 2** (content system): 3-4 hours
- **Phase 3** (schema & config): 2-3 hours
- **Phase 4** (components & routes): 4-6 hours
- **Phase 5** (cleanup & verify): 1-2 hours

**Total: 12-18 hours of implementation**, split across 2-3 sessions.

## Trade-offs

1. **Factory pattern vs direct exports**: Using factories (e.g., `createContentUtils()`, `createSchemaGenerators()`) adds a small amount of boilerplate in each site's shim file (~5-10 lines). The alternative is direct exports with module-level side effects, but that creates hidden coupling to site-specific modules. Factories are explicit and testable.

2. **Thin shims vs complete deletion**: Each site keeps a thin `lib/content.ts`, `lib/site.ts`, etc. that configures and re-exports from the shared package. This preserves the `@/lib/content` import paths used throughout each site's pages, avoiding a massive find-and-replace across all page files. The shims are 5-10 lines each and trivially maintained.

3. **Standardizing on fetch vs supporting Resend SDK**: Recommending standardization on raw fetch for email sending. The Resend SDK is a convenience wrapper that adds a dependency without significant value for our use case (sending 1-2 templated emails per form submission).

4. **Not extracting page-level components**: Page files (`app/about/page.tsx`, etc.) are intentionally site-specific. Even though some are similar, they contain enough layout and content differences to justify per-site ownership. Extracting them would over-constrain the white-label flexibility.
