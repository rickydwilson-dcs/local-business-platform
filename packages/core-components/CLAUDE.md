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
- `ServiceCards`, `ServiceBenefits`, `ServiceAbout`, `ServiceShowcase`, `ServiceGallery`, `ServiceFaq` — service page sections
- `LocationServices`, `LocationFaq`, `LocationCoverage` — location page sections
- `MobileMenu` — responsive mobile navigation
- `LocationsDropdown` — locations navigation dropdown
- `TestimonialCard`, `StarRating`, `AggregateRatingDisplay` — reviews
- `PageLayout` — shared page layout wrapper
- `Schema` — JSON-LD structured data generation

See `src/index.ts` for the full list of exports.

**Not exported from root** (import via subpath due to server/site-specific dependencies):

- `Footer` — uses `fs/promises`, import directly from `@platform/core-components/src/components/ui/footer`
- `ConsentManager`, `Analytics`, `AnalyticsDebugPanel` — depend on site-specific `@/lib/analytics/types`

### Lib Utilities (`src/lib/`)

- `content.ts` — generic MDX content reading functions (server-only, uses `fs/promises`)
- `content-schemas.ts` — Zod schemas for MDX frontmatter validation (exported from root)
- `services.ts` — service-specific data types and helpers
- `site.ts` — site configuration utilities
- `schema.ts` / `schema-types.ts` — JSON-LD schema generation (exported from root)
- `rate-limiter.ts` — Supabase-backed rate limiting (import via `@platform/core-components/lib/rate-limiter`)
- `security/csrf.ts` — HMAC-signed CSRF token validation
- `security/ip-utils.ts` — IP extraction and validation from request headers
- `validators/` — input validation (contact form, email, phone, etc.)
- `image.ts` — image path utilities and validation

### Hooks (`src/hooks/`)

- `useFocusTrap` — keyboard focus trapping for modals and menus

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

Some files are excluded from standalone type-check because they depend on site-specific implementations (MDX config, Supabase). These are still type-checked when building consuming sites.
