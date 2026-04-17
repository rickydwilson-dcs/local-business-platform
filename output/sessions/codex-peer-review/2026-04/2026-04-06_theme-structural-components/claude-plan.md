# Claude's Plan: Theme Packages Own Their Header and Footer

**Date:** 2026-04-06
**Author:** Claude (independent, pre-synthesis)

---

## Core Insight: The Data Dependency Problem

The hardest constraint is the Footer. The current `Footer` in core-components is a zero-prop async Server Component that imports directly from `@/lib/content`, `@/lib/contact-info`, and `@/site.config`. These `@/` aliases resolve at the consuming site's build time.

If Footer moves into a theme package, it can't use `@/` imports — packages don't have access to site-specific aliases.

**Solution: Props-based theme components.** Theme headers and footers accept all data as props. Layout.tsx (which already has access to `@/` imports) fetches the data and passes it in. This is exactly how atlas/rigel work — their components are pure presentational, all data via props.

The layout.tsx pattern shifts from:

```tsx
// Old: Footer fetches its own data
<Footer />

// New: Layout fetches data, passes to Footer
<CygnusFooter services={services} locations={locations} contact={contact} siteName={siteConfig.name} />
```

This is actually cleaner architecture — layout.tsx becomes the single data-fetching layer for the shell.

---

## Phase 1: Cygnus (mad-graphics is live — do this first)

### Step 1.1 — Create `packages/themes/cygnus/components/CygnusHeader.tsx`

Props-based Server Component. Data passed from layout.tsx.

```tsx
// packages/themes/cygnus/components/CygnusHeader.tsx
import { MobileMenu } from "@platform/core-components/components/ui/mobile-menu";

export interface CygnusHeaderProps {
  siteName: string;
  phoneDisplay: string;
  phoneTel: string;
  showPhone?: boolean;
  primaryCta: { label: string; href: string };
  navigation: Array<{ label: string; href: string }>;
  locations: Array<{ name: string; slug: string }>;
}

export function CygnusHeader(props: CygnusHeaderProps) {
  // Bold cygnus logo treatment, dark nav, 4-link navigation
  // Uses theme tokens: bg-brand-primary, text-on-brand-primary, etc.
  // MobileMenu handles hamburger (client component)
}
```

### Step 1.2 — Create `packages/themes/cygnus/components/CygnusFooter.tsx`

Props-based Server Component.

```tsx
export interface CygnusFooterProps {
  siteName: string;
  phoneDisplay: string;
  phoneTel: string;
  email: string;
  address: string;
  services: Array<{ title: string; slug: string }>;
  locations: Array<{ name: string; slug: string }>;
}

export function CygnusFooter(props: CygnusFooterProps) {
  // Compact 3-col dark footer: About | Services | Locations | Contact
  // Dark bg-surface-inverse, white text
}
```

### Step 1.3 — Create `packages/themes/cygnus/components/index.ts`

```ts
export { CygnusHeader } from "./CygnusHeader";
export type { CygnusHeaderProps } from "./CygnusHeader";
export { CygnusFooter } from "./CygnusFooter";
export type { CygnusFooterProps } from "./CygnusFooter";
```

### Step 1.4 — Update `packages/themes/package.json`

Add:

```json
"./cygnus/components": "./cygnus/components/index.ts"
```

### Step 1.5 — Update `sites/cygnus-test/app/layout.tsx`

```tsx
import { CygnusHeader, CygnusFooter } from '@platform/themes/cygnus/components';

// In RootLayout:
const allLocations = await getContentItems('locations');
const allServices = await getContentItems('services');
const locationItems = allLocations.map(l => ({ name: l.title, slug: l.slug }));
const serviceItems = allServices.map(s => ({ title: s.title, slug: s.slug }));

<PageShell
  header={<CygnusHeader siteName={siteConfig.name} phoneDisplay={PHONE_DISPLAY} ... locations={locationItems} />}
  footer={<CygnusFooter siteName={siteConfig.name} services={serviceItems} locations={locationItems} ... />}
>
```

### Step 1.6 — Update `sites/mad-graphics/app/layout.tsx`

Same pattern as cygnus-test. Also fix the `vegaRegistry` → `cygnusRegistry` mismatch (currently uses vega registry and `theme="vega"` but is meant to be cygnus).

### Step 1.7 — Verification gate

```bash
cd sites/cygnus-test && npm run build
cd sites/mad-graphics && npm run build
pnpm type-check
```

---

## Phase 2: Orion

### Step 2.1 — Create `packages/themes/orion/components/OrionHeader.tsx`

Same pattern. Orion has `appearance="dark"` with county-grouped locations (mega-menu). The `counties` prop (county-grouped) is used for desktop, flat `locations` for mobile.

```tsx
export interface OrionHeaderProps {
  siteName: string;
  phoneDisplay: string;
  phoneTel: string;
  showPhone?: boolean;
  primaryCta: { label: string; href: string };
  navigation: Array<{ label: string; href: string }>;
  counties: Array<{ name: string; slug: string; towns: Array<{ name: string; slug: string }> }>;
  locations: Array<{ name: string; slug: string }>;
}
```

### Step 2.2 — Create `packages/themes/orion/components/OrionFooter.tsx`

Same props pattern as CygnusFooter but with orion's dark styling.

### Step 2.3 — `packages/themes/orion/components/index.ts` + update `packages/themes/package.json`

Add `"./orion/components": "./orion/components/index.ts"`

### Step 2.4 — Update `sites/dj-fox-electrical/app/layout.tsx`

Replace `SiteHeader` + `Footer` imports with `OrionHeader` + `OrionFooter`. Pass counties from `getAllCounties()`.

### Step 2.5 — Verification gate

```bash
cd sites/dj-fox-electrical && npm run build
pnpm type-check
```

---

## Phase 3: Vega

### Step 3.1-3.4 — Same pattern for VegaHeader / VegaFooter

Vega has `appearance="light"`, `sticky={false}`, flat locations (no counties). VegaHeader is simpler than OrionHeader.

Update `colossus-scaffolding` and `base-template` layout.tsx files.

### Step 3.5 — Verification gate

```bash
cd sites/colossus-scaffolding && npm run build
cd sites/base-template && npm run build
pnpm type-check
```

---

## Phase 4: Pipeline Update

### Step 4.1 — Update `THEMED_PAGE_FILES` in `tools/create-site-from-project.ts`

```typescript
const THEMED_PAGE_FILES = [
  "app/layout.tsx", // ← ADD THIS
  "app/page.tsx",
  "app/services/page.tsx",
  "app/about/page.tsx",
  "app/locations/page.tsx",
] as const;
```

**Risk:** layout.tsx contains font preloads, ThemeProvider setup, analytics env vars, and metadata. All of these are appropriate to copy from the reference site — new sites should have the same font stack and theme setup as the reference. The only site-specific content in layout.tsx will be the `@/` imports that resolve to the new site's files (these work as-is since the new site has the same lib shim structure).

### Step 4.2 — Add vega to THEME_REFERENCE_SITE_MAP

```typescript
const THEME_REFERENCE_SITE_MAP = {
  cygnus: "cygnus-test",
  orion: "dj-fox-electrical",
  vega: "base-template", // ← ADD (vega already IS base-template, but explicit is better)
};
```

### Step 4.3 — Verification gate

```bash
npx tsx tools/create-site-from-project.ts --project [test-project.json] --dry-run
# Confirm layout.tsx appears in copied files list
```

---

## What Happens to Generic SiteHeader and Footer?

**Keep both.** Do not delete.

- `SiteHeader` — demote to an internal building block that theme headers can optionally compose with. Mark it with a JSDoc comment noting it's a primitive, not a consumer-facing component.
- `Footer` — same. It still works for any site that hasn't migrated to theme-specific footers.

No breaking changes to existing imports.

---

## Risks and Trade-offs

**Risk 1: Layout.tsx data fetching duplication**
Before: Footer fetched services/locations internally.
After: Layout.tsx fetches services + locations for both header (locations only) and footer (services + locations).
Mitigation: One `getContentItems('locations')` call covers both. Add `getContentItems('services')` in layout — this is one additional async call, but it's cached by Next.js.

**Risk 2: Atlas/Rigel components use `'use client'`**
Atlas's `site-header.tsx` is `'use client'`. Our theme headers should be Server Components (no state), using `MobileMenu` as a client sub-component (same pattern as current `SiteHeader`). Do NOT follow atlas's `'use client'` pattern — it would force the entire header into the client bundle.

**Risk 3: mad-graphics vega/cygnus mismatch**
The pipeline rebuilt mad-graphics with `theme="vega"` and `vegaRegistry`. When we update layout.tsx to use `CygnusHeader/CygnusFooter`, we should also switch to `theme="cygnus"` and `cygnusRegistry`. This is correct behaviour, not a breaking change.

**Risk 4: TypeScript path resolution**
Adding `"./cygnus/components": "./cygnus/components/index.ts"` to the themes package.json exports should be sufficient since the monorepo uses TypeScript project references and pnpm workspaces. No tsconfig changes needed (the workspace resolver handles subpath exports automatically via the `exports` field).

---

## Phasing Recommendation

Do all three themes in one PR. The pattern is identical — once cygnus is done, orion and vega are mechanical. Splitting into three PRs adds coordination overhead with no benefit.

Sequence within the PR:

1. Phase 1 (cygnus) — verify builds
2. Phase 2 (orion) — verify builds
3. Phase 3 (vega) — verify builds
4. Phase 4 (pipeline) — dry-run verify
5. Full `pnpm build` across all sites

Total files changed: ~15 new files (6 component files + 3 index.ts + 1 package.json update + 5 layout.tsx updates + 1 pipeline change).
