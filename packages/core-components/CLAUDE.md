# Core Components Package

Shared component library for the Local Business Platform (`@platform/core-components`).

## How It Works

This package exports raw TypeScript source — it has **no build step**. When a site imports `@platform/core-components`, Next.js compiles the TypeScript directly during the site's build. This means changes are reflected immediately in dev mode via HMR, with no "rebuild the package" step.

Sites resolve imports via TypeScript path mapping in their `tsconfig.json`:

```json
"@platform/core-components": ["../../packages/core-components/src/index.ts"]
```

## What's In Here

### Components (`src/components/`)

**Hero Variants** — different hero section layouts for the top of pages:

- `HeroV1` — Classic centered hero with trust badges
- `HeroV2` — Split layout with image on one side
- `HeroV3` — Minimal with gradient background

**Exported UI Components** (via `index.ts`) — includes service, location, blog, and general UI components. Selected examples:

- `HeroSection`, `PageHero`, `ServiceHero`, `LocationHero`, `BlogPostHero` — various hero layouts
- `CTASection`, `ServiceCTA` — call-to-action blocks
- `Breadcrumbs` — breadcrumb navigation
- `ContentCard`, `CardGrid`, `ContentGrid` — content display
- `CoverageMap`, `CoverageAreas`, `CoverageMapSection`, `CoverageStatsSection` — service area visualization
- `ServiceCards`, `ServiceBenefits`, `ServiceAbout`, `ServiceShowcase`, `ServiceGallery`, `ServiceFAQ` — service page sections
- `LocationServices`, `LocationFAQ`, `LocationCoverage` — location page sections
- `MobileMenu` — responsive mobile navigation
- `HeaderNavDropdown` — generic header dropdown supporting `mega` (alpha-grouped columns) and `list` modes; driven by a `HeaderDropdownConfig` on each nav item; replaces the old hardcoded `LocationsDropdown` branch in `SiteHeader`
- `LocationsDropdown` — **deprecated** thin shim that maps legacy `locations`/`counties` props to `HeaderNavDropdown`; kept for backwards compat only
- `TestimonialCard`, `StarRating`, `AggregateRatingDisplay` — reviews
- `PageLayout` — shared page layout wrapper
- `Schema` — JSON-LD structured data generation

See `src/index.ts` for the full list of exports.

**Not exported from root** (import via subpath due to server/site-specific dependencies):

- `Footer` — uses `fs/promises`, import directly from `@platform/core-components/src/components/ui/footer`
- `ConsentManager`, `Analytics`, `AnalyticsDebugPanel` — depend on site-specific `@/lib/analytics/types`

### Lib Utilities (`src/lib/`)

**Factory functions** — the core architecture pattern. Each returns configured utilities for a specific site:

- `content.ts` — `createContentUtils(config)` factory for MDX content reading (server-only, uses `fs/promises`). Config accepts `getLocationSlugs` callback, `customSort`, and feature flags.
- `mdx.tsx` — `createMdxLoader(config)` factory for MDX rendering via `next-mdx-remote/rsc`. Sites pass their own remark/rehype plugins (core-components can't resolve them).
- `schema-generators.ts` — `createSchemaGenerators(config)` factory for JSON-LD schema generation. Config accepts `businessConfig`, `absUrl`, and `businessType`.
- `site-utils.ts` — `createSiteUtils(config)` + standalone `formatPhone`, `telLink`, `mailtoLink`, `slugify` helpers.
- `contact-info.ts` — `createContactInfo(siteConfig)` factory for phone/address/hours formatting.

**API route factories** (`src/lib/api/`):

- `contact-route.ts` — `createContactHandler(config)` factory for the contact form POST handler. Config includes business info, email settings, and provider choice.
- `csrf-route.ts` — `createCsrfTokenHandler()` factory for CSRF token generation endpoint.
- `analytics-route.ts` — shared analytics tracking route handler.

**Other utilities:**

- `content-schemas.ts` — Zod schemas for MDX frontmatter validation (exported from root)
- `schema.ts` / `schema-types.ts` — JSON-LD schema types (exported from root)
- `rate-limiter.ts` — rate limiting (import via `@platform/core-components/lib/rate-limiter`)
- `security/csrf.ts` — HMAC-signed CSRF token validation
- `security/ip-utils.ts` — IP extraction and validation from request headers
- `validators/` — input validation (contact form, email, phone, etc.)
- `image.ts` — image path utilities and validation
- `nav-grouping.ts` — `buildAlphaColumns(items, numCols)` pure function: sorts items A-Z and chunks into `numCols` groups with letter-range labels (`"A-D"`, `"E-J"`, …). Used by `HeaderNavDropdown` for the locations/services mega-menu.

**Critical import rule:** Site lib shims must import factories via **subpath** (`@platform/core-components/lib/contact-info`) NOT the barrel (`@platform/core-components`). Barrel imports cause circular dependencies in vitest.

### Context (`src/context/`)

- `ThemeProvider` — `'use client'` wrapper that provides `ThemeName` and `ComponentRegistry` to client components; wrap `PageShell` in each site's `layout.tsx`
- `useTheme()` — hook returning `{ theme: ThemeName, registry: ComponentRegistry | null }`

### Animation Primitives (`src/components/animation/`)

Client components for scroll-triggered animation. Import via subpath (not from barrel — they are `"use client"` components):

```typescript
import { RevealOnScroll } from "@platform/core-components/src/components/animation";
import { Carousel } from "@platform/core-components/src/components/animation";
import { ParallaxSection } from "@platform/core-components/src/components/animation";
import { useScrollParallax } from "@platform/core-components/src/components/animation";
```

- `RevealOnScroll` — IntersectionObserver-based scroll reveal wrapper. Variants: `fade-up`, `fade-in`, `fade-down`, `slide-left`, `slide-right`, `scale-up`. SSR-safe (starts visible on server). Respects `prefers-reduced-motion`.
- `Carousel` — Embla-backed carousel with auto-play, dot/arrow navigation, touch/swipe. Children-based API.
- `ParallaxSection` — scroll-speed parallax wrapper for background sections.
- `useScrollParallax` — hook for custom parallax effects. RAF-throttled, IntersectionObserver-gated.

Shared CSS keyframes are in `src/styles/animations.css` (imported by theme globals).

### Hooks (`src/hooks/`)

- `useFocusTrap` — keyboard focus trapping for modals and menus

## Conventions

- All components in `src/components/ui/`, one directory per component with `index.tsx`
- **Named exports only** (no default exports)
- TypeScript interfaces for all props (avoid `any`)
- **Tailwind CSS only** for styling — components use theme tokens (`bg-brand-primary`, `text-surface-foreground`) so they work with any site's theme
- Components must be theme-agnostic: never hardcode colors, always use CSS variable-based classes
- **Theme contract:** Composable section components may reference any class name in `THEME_COMPONENT_CONTRACT` (exported from `@platform/theme-system`). Any other theme-specific class name is forbidden — it would break non-Orion themes.
- Typography conventions: see `docs/standards/styling.md` — shared components must use semantic utility classes, never inline `text-<size>`.

## Importing

```typescript
// UI components — from barrel:
import { HeroV1 } from "@platform/core-components";
import { ServiceCards } from "@platform/core-components";

// Factory functions — ALWAYS use subpath imports:
import { createContentUtils } from "@platform/core-components/lib/content";
import { createSchemaGenerators } from "@platform/core-components/lib/schema-generators";
import { createContactInfo } from "@platform/core-components/lib/contact-info";
import { createSiteUtils } from "@platform/core-components/lib/site-utils";
import { createMdxLoader } from "@platform/core-components/lib/mdx";
import { createContactHandler } from "@platform/core-components/lib/api/contact-route";
```

## Adding a New Component

1. Create directory: `src/components/ui/my-component/`
2. Create `index.tsx` with named export and TypeScript props interface
3. Add export to `src/index.ts`
4. Use only Tailwind theme token classes for styling
5. The component is immediately available to all sites

## Type-Checking

```bash
pnpm run type-check    # Uses tsconfig.build.json (standalone check)
```

Some files are excluded from standalone type-check because they depend on site-specific implementations (MDX config, Supabase). These are still type-checked when building consuming sites.

## Cross-Theme Component Propagation

When adding a new component identified via reference analysis (`newComponentBacklog` in `reference-analysis.json`):

### Checklist

- [ ] Named export only (no default export)
- [ ] TypeScript interface for all props
- [ ] Server Component — no `'use client'`, no React hooks, no context imports
- [ ] Token-only Tailwind classes (`bg-brand-primary`, `text-surface-foreground`, etc.)
- [ ] No hardcoded hex colours
- [ ] Exported from `packages/core-components/src/index.ts`
- [ ] If MDX-driven: schema added to `packages/core-components/src/lib/content-schemas.ts`
- [ ] `pnpm type-check` passes
- [ ] `pnpm --filter @platform/core-components build` passes
- [ ] Visual check in `sites/base-template` (vega) dev server
- [ ] Visual check in `sites/dj-fox-electrical` (orion) dev server if practical

### Why core-components first?

Components use theme tokens → single implementation adapts to every theme's colour palette automatically. No per-theme duplication needed.

### Gap component briefs

Run `tools/generate-theme-from-reference.ts --analyse` → `newComponentBacklog` in `reference-analysis.json` contains props contract, token constraints, and acceptance criteria for each gap component.
