# Core Components Package

Shared component library for the Local Business Platform (`@platform/core-components`).

## How It Works

This package exports raw TypeScript source — it has **no build step**. When a site imports `@platform/core-components`, Next.js compiles the TypeScript directly during the site's build. This means changes are reflected immediately in dev mode via HMR, with no "rebuild the package" step.

Sites resolve imports via TypeScript path mapping in their `tsconfig.json`:

```json
"@platform/core-components": ["../../packages/core-components/src/index.ts"]
```

## What's In Here

Components (`src/components/`), lib factory functions (`src/lib/`), context (`src/context/`), animation primitives (`src/components/animation/`), and hooks (`src/hooks/`) — see `src/index.ts` for the full list of exports rather than a maintained duplicate here.

**Critical import rule:** any `"use client"` file — anywhere, in any site — must import via **subpath** (`@platform/core-components/lib/contact-info`, `@platform/core-components/hooks/useFocusTrap`, `@platform/core-components/components/animation`) and NEVER from the barrel (`@platform/core-components`). This package has no `sideEffects: false` in `package.json`, so a barrel import can't be safely tree-shaken — webpack pulls in the _entire_ module graph behind `src/index.ts`, including server-only, Zod-dependent modules like `lib/content-schemas.ts`. A client component that reaches the barrel for something as small as a hook ends up shipping Zod (and its `allowsEval` CSP self-test) to the browser for no reason — this actually happened in `sites/npracing-v1/components/ui/gallery-lightbox.tsx`, which imported `useFocusTrap` from the barrel and triggered a CSP `eval`-blocked console warning on every page load; fixed 2026-08-25 by adding a `./hooks/*` export and switching to the subpath. Barrel imports are fine in Server Components (nothing there reaches the client bundle) — the risk is specifically `"use client"` files. Barrel imports from lib factories also independently cause circular dependencies in vitest, which is the original reason this rule existed.

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
// UI components in a Server Component — barrel import is fine, nothing here reaches the client bundle:
import { HeroV1 } from "@platform/core-components";
import { ServiceCards } from "@platform/core-components";

// Anything imported from a "use client" file — ALWAYS use subpath imports:
import { createContentUtils } from "@platform/core-components/lib/content";
import { createSchemaGenerators } from "@platform/core-components/lib/schema-generators";
import { createContactInfo } from "@platform/core-components/lib/contact-info";
import { createSiteUtils } from "@platform/core-components/lib/site-utils";
import { createMdxLoader } from "@platform/core-components/lib/mdx";
import { createContactHandler } from "@platform/core-components/lib/api/contact-route";
import { useFocusTrap } from "@platform/core-components/hooks/useFocusTrap";
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

## Adding a Component From Reference Analysis

See the `add-core-component` skill for the checklist and rationale when propagating a component identified via `newComponentBacklog` in `reference-analysis.json`.
