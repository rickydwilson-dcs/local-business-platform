# Implementation Plan: Theme Packages Own Header and Footer

**Date:** 2026-04-06
**Status:** Ready for implementation -- approved by dual-model peer review
**Source:** Synthesised from Claude and Codex independent plans

## Key Differences Between Plans

| Aspect | Claude | Codex | Synthesised Decision |
|--------|--------|-------|----------------------|
| **Footer data injection** | Props-based: layout.tsx fetches all data, passes as props to `CygnusFooter(props)` | Factory + site shim: `createCygnusFooter(config, dataFetchers)` returns configured component, site creates `lib/themed-footer.tsx` | **Props-based (Claude).** See reasoning below. |
| **Header approach** | Props-based Server Component (same as existing SiteHeader) | Props-based (agrees) | Props-based. Both plans agree. |
| **tsconfig changes** | Says no changes needed | Flags tsconfig.base.json may need updating | **tsconfig changes ARE needed.** See blind spots. |
| **mad-graphics vega/cygnus mismatch** | Caught: layout.tsx imports vegaRegistry but site is cygnus-themed | Not mentioned | Must fix. See blind spots. |
| **atlas `'use client'` trap** | Caught: atlas header/footer are `'use client'` -- do NOT follow this pattern | Not mentioned | Theme headers/footers must be Server Components. |
| **Pipeline: vega in THEME_REFERENCE_SITE_MAP** | Adds vega explicitly to the map | Not mentioned | **Yes, add it.** Currently there is only a comment `// vega: uses base-template directly`. Making it explicit (`vega: 'base-template'`) eliminates a special case in the pipeline code. |
| **File naming** | `CygnusHeader.tsx`, `CygnusFooter.tsx` (PascalCase, theme-prefixed) | `header.tsx`, `footer-factory.tsx` | **`header.tsx`, `footer.tsx`** (lowercase, no prefix). The theme package directory already namespaces them (`cygnus/components/header.tsx`). Exports use theme-prefixed names (`CygnusHeader`, `CygnusFooter`) for clarity at import sites. |
| **Phasing** | All three themes in one PR, ~15 files | Theme-by-theme with verification gates | **All three themes, one PR, but with per-theme verification gates** (hybrid). The changes are mechanical and low-risk once the pattern is established for cygnus. |

## Footer: Props vs Factory -- Reasoning

The factory pattern IS the established pattern in this codebase for shared utilities that need site-specific data (`createContentUtils`, `createSchemaGenerators`, `createContactHandler`, etc.). Codex correctly identified this precedent.

However, the factory pattern solves a different problem: utilities that need site-specific *configuration* or *dependencies* (filesystem paths, remark plugins, business config). The Footer needs site-specific *data* (services list, locations list, contact info) -- data that layout.tsx already has access to or can trivially fetch.

Arguments for props-based:
1. **Layout.tsx already fetches locations** for the header in every site. Adding services is one more `getContentItems()` call, cached by Next.js request deduplication.
2. **No new files.** The factory approach creates `lib/themed-footer.tsx` in every site -- a shim whose only job is to wire `@/` dependencies to the factory. For a component that takes 6 props, this is overhead without payoff.
3. **Debuggability.** When footer data is wrong, you look at layout.tsx and see exactly what is passed. With a factory shim, you trace through two indirections.
4. **Consistency with Header.** Both plans agree headers are props-based. Having footer use a different pattern for the same architectural layer is confusing.
5. **The existing generic SiteHeader is already props-based.** The theme headers follow the same pattern. Footer should match.

The factory pattern would be the right call if the footer needed complex wiring (custom remark plugins, filesystem paths, conditional dependency injection). It does not -- it needs a list of services, a list of locations, and contact strings.

**Decision: Props-based. Layout.tsx is the single data-fetching layer for the page shell.**

## Blind Spots Caught

### 1. tsconfig path mappings are incomplete (Codex was right, Claude was wrong)

Inspecting `sites/mad-graphics/tsconfig.json` reveals it only maps:
```json
"@platform/themes/orion": ["../../packages/themes/orion/index.ts"],
"@platform/themes/vega": ["../../packages/themes/vega/index.ts"]
```

It does NOT map `@platform/themes/cygnus` at all -- yet the layout imports `cygnusRegistry` from `@platform/themes/cygnus`. This works at build time via pnpm workspace resolution, but TypeScript IDE tooling and strict type-checking may not resolve it correctly.

More importantly, the new `@platform/themes/cygnus/components` subpath export needs a tsconfig path mapping in every consuming site, because the `exports` field in `package.json` is not enough for TypeScript resolution in the monorepo's raw-source-compilation model (no build step in theme packages).

**Action required per site:** Add path mappings for `@platform/themes/<theme>` AND `@platform/themes/<theme>/components` in each site's `tsconfig.json`.

### 2. mad-graphics imports vegaRegistry but is a cygnus site (Claude caught, Codex missed)

`sites/mad-graphics/app/layout.tsx` line 8: `import { vegaRegistry } from '@platform/themes/vega'` and line 74: `<ThemeProvider theme="vega" registry={vegaRegistry}>`. This site was rebuilt from cygnus-test but still references vega. The cygnus-test layout correctly uses cygnusRegistry. This must be fixed when updating mad-graphics layout.

### 3. atlas/rigel use `'use client'` -- do NOT replicate (Claude caught, Codex missed)

`packages/themes/atlas/components/site-header.tsx` starts with `"use client"` and uses `useState`. This breaks async data fetching and makes the component a client component. Our theme headers and footers MUST be Server Components. Interactive sub-components (MobileMenu) are already separate client components.

### 4. Existing generic Footer reads `siteConfig.footer.maxServices`, `siteConfig.footer.showServices`, etc.

Both plans mentioned footer props but neither fully enumerated the config-driven features. The generic Footer uses `siteConfig.footer.maxServices`, `siteConfig.footer.showServices`, `siteConfig.footer.showLocations`, `siteConfig.footer.maxLocations`, `siteConfig.footer.copyright`, `siteConfig.footer.builtBy`, and `siteConfig.credentials.certifications`. Theme footers should accept these as props so layout.tsx can pass them from siteConfig.

---

## Implementation Plan

### Phase 1: Cygnus (cygnus-test + mad-graphics)

**Step 1.1 -- Create `packages/themes/cygnus/components/header.tsx`**

Server Component. No `'use client'`. Props-based, accepting the same interface as the generic SiteHeader but with cygnus-specific visual treatment (dark appearance, Signal Orange accents, Press-Black canvas).

```typescript
// Props interface (matches what layout.tsx already passes to SiteHeader)
export interface CygnusHeaderProps {
  siteName: string;
  phoneDisplay?: string;
  phoneTel?: string;
  showPhone?: boolean;
  primaryCta: { label: string; href: string };
  navigation: Array<{ label: string; href: string; hasDropdown?: boolean }>;
  locations: Array<{ name: string; slug: string }>;
}
```

For the initial implementation, this can wrap the existing `SiteHeader` from core-components with `appearance="dark"` hardcoded, or be a standalone implementation. Wrapping is simpler and avoids duplication; standalone allows full visual divergence later. **Decision: wrap SiteHeader initially.** The point of this phase is ownership and the ability to diverge, not to diverge immediately.

```typescript
import { SiteHeader } from '@platform/core-components';

export async function CygnusHeader(props: CygnusHeaderProps) {
  return <SiteHeader appearance="dark" {...props} />;
}
```

**Step 1.2 -- Create `packages/themes/cygnus/components/footer.tsx`**

Server Component. Props-based. All data passed from layout.tsx.

```typescript
export interface CygnusFooterProps {
  siteName: string;
  tagline: string;
  phoneDisplay: string;
  phoneTel: string;
  email: string;
  address: { locality: string; region: string };
  certifications: Array<{ name: string; description: string; icon?: string }>;
  services: Array<{ slug: string; title: string }>;
  locations: Array<{ slug: string; title: string }>;
  totalServices: number;
  totalLocations: number;
  maxServices: number;
  maxLocations: number;
  showServices: boolean;
  showLocations: boolean;
  copyright: string;
  builtBy?: { name: string; url: string };
}
```

Implementation: Port the generic Footer's JSX into cygnus-specific styling (dark canvas, orange accents). Remove all `@/` imports -- all data comes via props.

**Step 1.3 -- Create `packages/themes/cygnus/components/index.ts`**

```typescript
export { CygnusHeader } from './header';
export type { CygnusHeaderProps } from './header';
export { CygnusFooter } from './footer';
export type { CygnusFooterProps } from './footer';
```

**Step 1.4 -- Update `packages/themes/package.json` exports**

Add:
```json
"./cygnus/components": "./cygnus/components/index.ts"
```

**Step 1.5 -- Update `sites/cygnus-test/tsconfig.json`**

Add path mappings:
```json
"@platform/themes/cygnus": ["../../packages/themes/cygnus/index.ts"],
"@platform/themes/cygnus/components": ["../../packages/themes/cygnus/components/index.ts"]
```

**Step 1.6 -- Update `sites/cygnus-test/app/layout.tsx`**

- Import `CygnusHeader`, `CygnusFooter` from `@platform/themes/cygnus/components`
- Remove import of generic `SiteHeader` from `@platform/core-components`
- Remove import of generic `Footer` from `@platform/core-components/components/ui/footer`
- Layout fetches services + locations, passes as props to both header and footer
- siteConfig values passed as props to footer

```typescript
import { CygnusHeader, CygnusFooter } from '@platform/themes/cygnus/components';

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const [allServices, allLocations] = await Promise.all([
    getContentItems('services'),
    getContentItems('locations'),
  ]);

  const locationItems = allLocations.map((loc) => ({ name: loc.title, slug: loc.slug }));
  const sortedServices = [...allServices].sort((a, b) => a.title.localeCompare(b.title)).slice(0, siteConfig.footer.maxServices);
  const sortedLocations = [...allLocations].sort((a, b) => a.title.localeCompare(b.title)).slice(0, siteConfig.footer.maxLocations);

  return (
    // ...
    <PageShell
      header={
        <CygnusHeader
          siteName={siteConfig.name}
          phoneDisplay={PHONE_DISPLAY}
          phoneTel={PHONE_TEL}
          showPhone={siteConfig.cta.phone.show}
          primaryCta={siteConfig.cta.primary}
          navigation={siteConfig.navigation.main}
          locations={locationItems}
        />
      }
      footer={
        <CygnusFooter
          siteName={siteConfig.business.name}
          tagline={siteConfig.tagline}
          phoneDisplay={PHONE_DISPLAY}
          phoneTel={PHONE_TEL}
          email={BUSINESS_EMAIL}
          address={ADDRESS}
          certifications={siteConfig.credentials.certifications}
          services={sortedServices}
          locations={sortedLocations}
          totalServices={allServices.length}
          totalLocations={allLocations.length}
          maxServices={siteConfig.footer.maxServices}
          maxLocations={siteConfig.footer.maxLocations}
          showServices={siteConfig.footer.showServices}
          showLocations={siteConfig.footer.showLocations}
          copyright={siteConfig.footer.copyright}
          builtBy={siteConfig.footer.builtBy}
        />
      }
    >
      {children}
    </PageShell>
    // ...
  );
}
```

**Step 1.7 -- Update `sites/mad-graphics/tsconfig.json`**

Add cygnus path mappings (same as step 1.5). Also confirm orion/vega mappings can stay for now (they are unused but harmless).

**Step 1.8 -- Update `sites/mad-graphics/app/layout.tsx`**

Same pattern as cygnus-test. Additionally:
- **Fix the vega/cygnus mismatch**: change `vegaRegistry` to `cygnusRegistry`, change `theme="vega"` to `theme="cygnus"`, change the import from `@platform/themes/vega` to `@platform/themes/cygnus`.
- Import `CygnusHeader`, `CygnusFooter` from `@platform/themes/cygnus/components`.
- Add `BUSINESS_EMAIL` and `ADDRESS` to the `@/lib/contact-info` import.

**Step 1.9 -- Verification gate**

```bash
cd sites/cygnus-test && npm run build
cd sites/mad-graphics && npm run build
pnpm type-check
```

All three must pass before proceeding.

---

### Phase 2: Orion (dj-fox-electrical)

**Step 2.1 -- Create `packages/themes/orion/components/header.tsx`**

Server Component. Orion-specific: dark background, county-grouped mega-menu support. Wraps generic SiteHeader with `appearance="dark"` initially.

Props: same as CygnusHeader plus `counties` and `maxTownsPerCounty` (dj-fox-electrical uses these for the mega-menu).

```typescript
export interface OrionHeaderProps {
  siteName: string;
  phoneDisplay?: string;
  phoneTel?: string;
  showPhone?: boolean;
  primaryCta: { label: string; href: string };
  navigation: Array<{ label: string; href: string; hasDropdown?: boolean }>;
  locations: Array<{ name: string; slug: string }>;
  counties?: Array<{ county: string; towns: Array<{ name: string; slug: string }> }>;
  maxTownsPerCounty?: number;
}
```

**Step 2.2 -- Create `packages/themes/orion/components/footer.tsx`**

Server Component. Same prop interface as CygnusFooter (the generic footer is used by all sites identically). Orion-specific styling can diverge later.

**Step 2.3 -- Create `packages/themes/orion/components/index.ts`**

Export `OrionHeader`, `OrionFooter` and their prop types.

**Step 2.4 -- Update `packages/themes/package.json`**

Add: `"./orion/components": "./orion/components/index.ts"`

**Step 2.5 -- Update `sites/dj-fox-electrical/tsconfig.json`**

Add:
```json
"@platform/themes/orion/components": ["../../packages/themes/orion/components/index.ts"]
```
(Verify `@platform/themes/orion` mapping already exists; add if missing.)

**Step 2.6 -- Update `sites/dj-fox-electrical/app/layout.tsx`**

- Import `OrionHeader`, `OrionFooter` from `@platform/themes/orion/components`
- Remove generic SiteHeader and Footer imports
- Layout fetches services (new), already fetches locations via `getAllCounties()`
- Pass props to both header and footer
- Add `BUSINESS_EMAIL`, `ADDRESS` import from `@/lib/contact-info`

**Step 2.7 -- Verification gate**

```bash
cd sites/dj-fox-electrical && npm run build
pnpm type-check
```

---

### Phase 3: Vega (base-template + colossus-scaffolding)

**Step 3.1 -- Create `packages/themes/vega/components/header.tsx`**

Server Component. Vega-specific: light background, sticky=false, flat locations list. Wraps generic SiteHeader with `appearance="light"`.

```typescript
export interface VegaHeaderProps {
  siteName: string;
  phoneDisplay?: string;
  phoneTel?: string;
  showPhone?: boolean;
  primaryCta: { label: string; href: string };
  navigation: Array<{ label: string; href: string; hasDropdown?: boolean }>;
  locations: Array<{ name: string; slug: string }>;
}
```

**Step 3.2 -- Create `packages/themes/vega/components/footer.tsx`**

Server Component. Same prop pattern as orion/cygnus footers.

**Step 3.3 -- Create `packages/themes/vega/components/index.ts`**

Export `VegaHeader`, `VegaFooter` and prop types.

**Step 3.4 -- Update `packages/themes/package.json`**

Add: `"./vega/components": "./vega/components/index.ts"`

**Step 3.5 -- Update `sites/base-template/tsconfig.json`**

Add vega path mappings including `/components` subpath.

**Step 3.6 -- Update `sites/base-template/app/layout.tsx`**

Same pattern. Import `VegaHeader`, `VegaFooter` from `@platform/themes/vega/components`.

**Step 3.7 -- Update `sites/colossus-scaffolding/tsconfig.json`**

Add vega path mappings.

**Step 3.8 -- Update `sites/colossus-scaffolding/app/layout.tsx`**

Same pattern as base-template.

**Step 3.9 -- Verification gate**

```bash
cd sites/base-template && npm run build
cd sites/colossus-scaffolding && npm run build
pnpm type-check
```

---

### Phase 4: Pipeline and Cleanup

**Step 4.1 -- Add `app/layout.tsx` to THEMED_PAGE_FILES**

In `tools/create-site-from-project.ts`, add `'app/layout.tsx'` to the `THEMED_PAGE_FILES` array. This ensures new sites created via the pipeline get the theme-specific layout from the reference site.

**Step 4.2 -- Add vega explicitly to THEME_REFERENCE_SITE_MAP**

Change:
```typescript
const THEME_REFERENCE_SITE_MAP: Record<string, string> = {
  cygnus: 'cygnus-test',
  orion:  'dj-fox-electrical',
  // vega: uses base-template directly -- no override needed
};
```

To:
```typescript
const THEME_REFERENCE_SITE_MAP: Record<string, string> = {
  cygnus: 'cygnus-test',
  orion:  'dj-fox-electrical',
  vega:   'base-template',
};
```

This removes a special case in pipeline logic. The comment was fragile documentation; explicit mapping is self-documenting.

**Step 4.3 -- Keep generic SiteHeader and Footer**

Do NOT delete. Demote to internal building blocks. Theme headers can wrap them (as designed in this plan) or diverge independently. No breaking changes to any existing imports.

**Step 4.4 -- Final verification**

```bash
pnpm build          # Full monorepo build
pnpm type-check     # TypeScript strict mode
pnpm lint           # ESLint
```

---

## File Change Summary

### New files (9)

| File | Purpose |
|------|---------|
| `packages/themes/cygnus/components/header.tsx` | Cygnus-themed header |
| `packages/themes/cygnus/components/footer.tsx` | Cygnus-themed footer |
| `packages/themes/cygnus/components/index.ts` | Cygnus components barrel |
| `packages/themes/orion/components/header.tsx` | Orion-themed header |
| `packages/themes/orion/components/footer.tsx` | Orion-themed footer |
| `packages/themes/orion/components/index.ts` | Orion components barrel |
| `packages/themes/vega/components/header.tsx` | Vega-themed header |
| `packages/themes/vega/components/footer.tsx` | Vega-themed footer |
| `packages/themes/vega/components/index.ts` | Vega components barrel |

### Modified files (11)

| File | Change |
|------|--------|
| `packages/themes/package.json` | Add 3 subpath exports for `/components` |
| `sites/cygnus-test/tsconfig.json` | Add cygnus path mappings |
| `sites/cygnus-test/app/layout.tsx` | Switch to CygnusHeader + CygnusFooter |
| `sites/mad-graphics/tsconfig.json` | Add cygnus path mappings (fix missing cygnus) |
| `sites/mad-graphics/app/layout.tsx` | Fix vega->cygnus mismatch + switch to theme components |
| `sites/dj-fox-electrical/tsconfig.json` | Add orion/components path mapping |
| `sites/dj-fox-electrical/app/layout.tsx` | Switch to OrionHeader + OrionFooter |
| `sites/base-template/tsconfig.json` | Add vega/components path mapping |
| `sites/base-template/app/layout.tsx` | Switch to VegaHeader + VegaFooter |
| `sites/colossus-scaffolding/tsconfig.json` | Add vega/components path mapping |
| `sites/colossus-scaffolding/app/layout.tsx` | Switch to VegaHeader + VegaFooter |
| `tools/create-site-from-project.ts` | Add layout.tsx to THEMED_PAGE_FILES, add vega to map |

**Total: ~20 files changed**

---

## Risks and Mitigations

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| Layout.tsx data fetching adds latency | Low | Low | `getContentItems('services')` + `getContentItems('locations')` are already cached by Next.js request deduplication. Footer already calls these -- we are just moving where the call happens. |
| TypeScript resolution fails for new subpath exports | Medium | Medium | Add explicit `paths` entries in each site's tsconfig.json. Verified that atlas/rigel already use this pattern successfully. |
| mad-graphics vega/cygnus mismatch causes visual regression | High (if not fixed) | High | Explicitly fix in Step 1.8. The site should already be cygnus-themed -- this is a bug fix, not a new risk. |
| Theme headers diverge from generic SiteHeader, losing features | Low | Medium | Initial implementation wraps generic SiteHeader. Divergence is opt-in and intentional. |
| Pipeline generates incorrect layout.tsx for new sites | Low | Medium | Adding layout.tsx to THEMED_PAGE_FILES means pipeline copies the reference site's layout, which will already have the correct theme imports. Test with a dry-run after changes. |

---

## Non-Goals (Explicitly Out of Scope)

- **Custom visual designs for each theme's header/footer.** This plan establishes ownership and the props-based architecture. Visual differentiation is a follow-up task.
- **Removing the generic SiteHeader or Footer.** They remain as building blocks.
- **Factory pattern for footer.** Decided against. If a future theme needs complex dependency injection (e.g., custom data sources), it can be reconsidered at that point.
- **Shared base footer props type.** All three themes currently use the same footer data shape. A shared `BaseThemeFooterProps` type could be extracted later if the pattern proves stable. For now, each theme owns its own props interface to allow independent evolution.
