# Core Components Package

Shared component library for the local business platform (`@platform/core-components`).

## Available Components

### Hero Variants

- `HeroV1` - Classic centered hero with trust badges
- `HeroV2` - Split layout with image
- `HeroV3` - Minimal with gradient background

### UI Components

- `ServiceCards` - Grid of service cards with icons
- `CoverageMap` - Leaflet map showing service areas
- `Footer` - Site footer with contact info
- `MobileMenu` - Responsive mobile navigation
- `LocationsDropdown` - Locations navigation dropdown

### Analytics

- `ConsentManager` - GDPR consent banner
- `Analytics` - GA4/Facebook/Google Ads wrapper
- `AnalyticsDebugPanel` - Development debugging

## Conventions

**Component Organization:**

- All components in `src/components/ui/`
- One component per directory with `index.tsx`
- Named exports only (no default exports)

**TypeScript:**

- Interfaces required for all props
- Strict typing (avoid `any`)

**Styling:**

- Tailwind CSS only (no inline styles, no CSS-in-JS)
- Use design tokens from consuming site's Tailwind config

## Type-Checking

**Standalone type-check:**

```bash
pnpm run type-check  # Uses tsconfig.build.json
```

The package supports standalone type-checking via `tsconfig.build.json` which:

- Maps `@/` path aliases to the package's `src/` directory
- Excludes files that depend on site-specific implementations

**Excluded from standalone type-check:**

- `src/lib/mdx.tsx` - Depends on site's `mdx-components.tsx`
- `src/lib/rate-limiter.ts` - Depends on `@upstash/redis` (site-provided)
- `src/components/templates/content-page.tsx` - Depends on site's MDX config

These files are still type-checked when building consuming sites.

**Linting:**

```bash
pnpm lint  # ESLint v9 flat config
```

**Exports:**

```typescript
// Import in consuming sites:
import { HeroV1 } from "@platform/core-components";
import { ServiceCards } from "@platform/core-components";
```

## Adding New Components

1. Create directory: `src/components/ui/my-component/`
2. Create `index.tsx` with named export
3. Add export to `src/index.ts`
4. Use TypeScript interface for props
5. Style with Tailwind classes only
