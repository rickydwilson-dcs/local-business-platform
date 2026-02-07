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

**Exported UI Components** (via `index.ts`):

- `HeroSection` — generic hero wrapper
- `Footer` / `CustomFooter` — site footer with contact info and navigation
- `CTASection` — call-to-action blocks
- `Breadcrumbs` — breadcrumb navigation
- `ContentCard` / `CardGrid` — content display cards
- `CoverageMap` / `CoverageAreas` — service area visualization

**Additional UI Components** (available via subpath imports):

- `MobileMenu` — responsive mobile navigation
- `LocationsDropdown` — locations navigation dropdown
- `ServiceCards` — grid of service cards with icons
- Many more service and location components in `src/components/ui/`

**Analytics** (in `src/components/analytics/`, not exported from root):

- `ConsentManager` — GDPR consent banner
- `Analytics` — GA4/Facebook/Google Ads wrapper
- `AnalyticsDebugPanel` — development debugging tool

**Schema** — JSON-LD structured data generation

### Lib Utilities (`src/lib/`)

- `content.ts` — generic MDX content reading functions
- `content-schemas.ts` — Zod schemas for MDX frontmatter validation
- `services.ts` — service-specific data types and helpers
- `site.ts` — site configuration utilities
- `schema.ts` / `schema-types.ts` — JSON-LD schema generation

## Conventions

- All components in `src/components/ui/`, one directory per component with `index.tsx`
- **Named exports only** (no default exports)
- TypeScript interfaces for all props (avoid `any`)
- **Tailwind CSS only** for styling — components use theme tokens (`bg-brand-primary`, `text-surface-foreground`) so they work with any site's theme
- Components must be theme-agnostic: never hardcode colors, always use CSS variable-based classes

## Importing

```typescript
// From a site:
import { HeroV1 } from "@platform/core-components";
import { ServiceCards } from "@platform/core-components";

// Subpath imports for lib utilities:
import { getServices } from "@platform/core-components/lib/content";
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

Some files are excluded from standalone type-check because they depend on site-specific implementations (MDX config, Upstash Redis). These are still type-checked when building consuming sites.
