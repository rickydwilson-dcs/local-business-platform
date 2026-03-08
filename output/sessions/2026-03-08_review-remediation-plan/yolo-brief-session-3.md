# YOLO Brief: Session 3 — SEO & Schema (4 Fixes)

**Date:** 2026-03-08
**Branch:** Start on `develop`
**Scope:** SEO and structured data fixes from 2026-03-07 code review
**Estimated time:** 30-45 minutes

---

## Prerequisites

```bash
cd /Users/rickywilson/Sites/local-business-platform
git checkout develop
git pull origin develop
```

---

## Fix 1: SEO-003 — Add LocalBusiness JSON-LD to location detail pages

**Problem:** Location detail pages in base-template and dj-fox-electrical have breadcrumb and FAQ schema but no LocalBusiness schema. The colossus site does not need this fix (it uses a separate pattern). Adding LocalBusiness schema to location pages improves local SEO by telling Google this page represents a business serving that specific area.

**Files to modify:**
- `/Users/rickywilson/Sites/local-business-platform/sites/base-template/app/locations/[slug]/page.tsx`
- `/Users/rickywilson/Sites/local-business-platform/sites/dj-fox-electrical/app/locations/[slug]/page.tsx`

**Reference pattern:** Look at how the homepage (`app/page.tsx`) in each site generates LocalBusiness schema. Both sites import `getLocalBusinessSchema` from `@/lib/schema` and render it as a `<script type="application/ld+json">` tag.

**Action for each file:**

### Step 1: Add the import

Both files already import `Schema`, `siteConfig`, and `absUrl`. Add the `getLocalBusinessSchema` import:

```ts
import { getLocalBusinessSchema } from '@/lib/schema';
```

### Step 2: Generate LocalBusiness schema with location-specific data

In the component function body (after `const faqs = fm.faqs || [];`), add:

```ts
// SEO-003: LocalBusiness schema for location page
const localBusinessSchema = getLocalBusinessSchema();

// Add location-specific areaServed to the schema
const locationSchema = {
  ...localBusinessSchema,
  '@id': absUrl(`/locations/${slug}#local-business`),
  areaServed: {
    '@type': 'City',
    name: locationName,
  },
};
```

Note: `getLocalBusinessSchema()` in each site's `lib/schema.ts` returns a site-specific schema with business name, address, phone, etc. from the site's own config. The base-template version takes no arguments (it reads from a local `businessConfig`). The dj-fox version is similar. Check the actual function signature before calling it — if it requires arguments, pass the appropriate config.

**For base-template:** Check `/Users/rickywilson/Sites/local-business-platform/sites/base-template/lib/schema.ts` — the function is `getLocalBusinessSchema()` and takes no arguments (it reads from a local config variable).

**For dj-fox:** Check `/Users/rickywilson/Sites/local-business-platform/sites/dj-fox-electrical/lib/schema.ts` — same pattern.

### Step 3: Add the script tag to the JSX

Both files already have a `<Schema>` component at the bottom of the JSX return. Add the LocalBusiness schema as a separate script tag before or after the existing `<Schema>` component:

```tsx
{/* LocalBusiness schema for location page */}
<script
  type="application/ld+json"
  dangerouslySetInnerHTML={{ __html: JSON.stringify(locationSchema) }}
/>
```

Place this inside the fragment `<>...</>` alongside the existing `<Schema>` component.

### Important

- Do NOT modify the colossus location page — it has a completely different structure
- The `getLocalBusinessSchema` function varies per site. Read the file before using it. If it requires options (like the shared core-components version does), pass the appropriate config
- If the site's `lib/schema.ts` does not export `getLocalBusinessSchema`, check if it is imported from `@platform/core-components` instead, and use the shared version with appropriate options

---

## Fix 2: SEO-005 — Complete layout-level OG metadata defaults

**Problem:** Layout-level metadata in both base-template and dj-fox have `metadataBase` set correctly, but the default `openGraph` object is missing `images` and `url`. While the homepage pages export their own complete OG metadata, other pages that do not specify OG images will have no default fallback.

**Files to check and fix:**
- `/Users/rickywilson/Sites/local-business-platform/sites/base-template/app/layout.tsx`
- `/Users/rickywilson/Sites/local-business-platform/sites/dj-fox-electrical/app/layout.tsx`

### Base-template layout.tsx

**Current (lines 13-25):**
```ts
export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.tagline,
  metadataBase: new URL(siteConfig.url),
  openGraph: {
    type: 'website',
    locale: 'en_GB',
    siteName: siteConfig.name,
  },
};
```

**Change to:**
```ts
export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.tagline,
  metadataBase: new URL(siteConfig.url),
  openGraph: {
    type: 'website',
    locale: 'en_GB',
    siteName: siteConfig.name,
    url: siteConfig.url,
    images: [
      {
        url: '/logo.svg',
        width: 1200,
        height: 630,
        alt: siteConfig.business.name,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    images: ['/logo.svg'],
  },
};
```

Note: `metadataBase` is set, so relative URLs like `/logo.svg` will be resolved to full URLs automatically by Next.js.

### DJ Fox layout.tsx

**Current (lines 10-22):**
```ts
export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.tagline,
  metadataBase: new URL(siteConfig.url),
  openGraph: {
    type: 'website',
    locale: 'en_GB',
    siteName: siteConfig.name,
  },
};
```

**Change to the same pattern as base-template** (with the images and url additions).

### Also check colossus

Check `/Users/rickywilson/Sites/local-business-platform/sites/colossus-scaffolding/app/layout.tsx` — if it has the same incomplete pattern, fix it too.

---

## Fix 3: SEO-007 — Make homepage h1 more keyword-focused

**Problem:** The base-template homepage h1 uses `{siteConfig.name}` which renders as just the business name. For SEO, the h1 should include service type and location keywords.

### Base-template

**File:** `/Users/rickywilson/Sites/local-business-platform/sites/base-template/app/page.tsx`

**Current (around line 93-95):**
```tsx
<h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-balance text-surface-foreground">
  {siteConfig.name}
</h1>
```

**Change to:**
```tsx
<h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-balance text-surface-foreground">
  Professional {siteConfig.tagline} You Can Trust
</h1>
```

This uses the site's own tagline (which is "Professional Local Services") to create a more keyword-rich h1 while keeping it generic enough for the template. The `siteConfig.tagline` is already configured per-site, so this will adapt to each new site created from the template.

If `siteConfig.tagline` is too generic (e.g., just "Professional Local Services"), consider a slightly more specific pattern:

```tsx
<h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-balance text-surface-foreground">
  Professional Local Services in {siteConfig.business.address.city}
</h1>
```

Choose whichever pattern makes sense given the actual `siteConfig` values. The key is: the h1 should NOT be just the business name.

### DJ Fox

**File:** `/Users/rickywilson/Sites/local-business-platform/sites/dj-fox-electrical/app/page.tsx`

DJ Fox already uses a keyword-rich heading via the `HeroWithImage` component (line 114):
```
High Quality Electrical Services in Eastbourne
```

This is already good. No change needed for DJ Fox.

### Colossus

Check `/Users/rickywilson/Sites/local-business-platform/sites/colossus-scaffolding/app/page.tsx` — if the h1 is just the business name, apply the same pattern.

---

## Fix 4: SEO-010 — Add breadcrumb fallback for colossus location pages

**Problem:** In colossus-scaffolding, breadcrumbs on location pages are conditional on `locationData.breadcrumbs` being present in the frontmatter. If frontmatter does not include breadcrumbs, no breadcrumbs render at all. There should be a default fallback that generates breadcrumbs from the URL structure.

**File:** `/Users/rickywilson/Sites/local-business-platform/sites/colossus-scaffolding/app/locations/[slug]/page.tsx`

**Current (around lines 232-239):**
```tsx
{/* Breadcrumbs - always show if exists */}
{locationData.breadcrumbs && (
  <div className="bg-surface-muted border-b">
    <div className="container-standard py-4">
      <Breadcrumbs items={locationData.breadcrumbs} />
    </div>
  </div>
)}
```

**Action:** Generate default breadcrumbs when frontmatter does not provide them. Replace the conditional block:

```tsx
{/* Breadcrumbs - show from frontmatter or generate default */}
<div className="bg-surface-muted border-b">
  <div className="container-standard py-4">
    <Breadcrumbs
      items={
        locationData.breadcrumbs || [
          { name: 'Locations', href: '/locations' },
          { name: locationData.title, href: `/locations/${slug}`, current: true },
        ]
      }
    />
  </div>
</div>
```

This removes the conditional rendering and always shows breadcrumbs, using frontmatter values if available and falling back to a sensible default derived from the URL structure.

**Important:** Verify the `Breadcrumbs` component is imported. Check the imports at the top of the file — if `Breadcrumbs` is not imported, add:

```ts
import { Breadcrumbs } from "@platform/core-components";
```

Also verify the `BreadcrumbItem` type matches the shape being passed — the `Breadcrumbs` component expects `{ name: string; href: string; current?: boolean }`.

Also check other colossus page types (services, blog, projects) for the same conditional pattern and consider adding fallbacks there too, but only if this was flagged in the review. For this brief, focus on location pages only.

---

## Verification

After all changes:

```bash
cd /Users/rickywilson/Sites/local-business-platform
pnpm type-check
pnpm lint
pnpm build
```

All three commands must pass cleanly.

### Additional verification:

1. **Schema validation:** After building, check the generated HTML for location pages to verify the JSON-LD is well-formed:
```bash
# Build and check output
cd sites/base-template && npm run build
grep -r "LocalBusiness" .next/server/app/locations/ --include="*.html" | head -5
```

2. **OG metadata:** Verify the layout metadata is correct:
```bash
grep -r "og:image" .next/server/app/ --include="*.html" | head -5
```

3. **Breadcrumbs:** Verify colossus location pages render breadcrumbs even without frontmatter:
```bash
cd /Users/rickywilson/Sites/local-business-platform/sites/colossus-scaffolding && npm run build
```

---

## UPDATE AGGREGATED REPORT

After all fixes and verification, update `/Users/rickywilson/Sites/local-business-platform/output/sessions/2026-03-07_code-review/aggregated-report.md`:

Add a new section at the bottom (after any previous session sections, before the final `_Generated by...` line):

```markdown
## Session 3 Fixes Applied (2026-03-08)

| Finding ID | Status | Evidence |
|-----------|--------|----------|
| SEO-003 | Fixed | Added LocalBusiness JSON-LD schema to location pages in base-template and dj-fox |
| SEO-005 | Fixed | Added default OG images and url to layout.tsx metadata in base-template and dj-fox |
| SEO-007 | Fixed | Changed base-template homepage h1 from business name to keyword-focused heading |
| SEO-010 | Fixed | Added breadcrumb fallback in colossus location `[slug]/page.tsx` |
```

Update the Executive Summary table counts to reflect the reduced open findings.

---

## Commit

```bash
git add -A
git commit -m "fix(seo): add LocalBusiness schema to location pages, complete OG metadata, improve h1

Fixes: SEO-003, SEO-005, SEO-007, SEO-010

Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>"
```

Do NOT push. Do NOT merge to staging or main.
