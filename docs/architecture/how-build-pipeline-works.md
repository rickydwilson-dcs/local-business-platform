# How the Build Pipeline Works

This document explains what happens when you run `pnpm build` and how packages, sites, and Turborepo fit together.

## The Big Picture

This is a pnpm workspace monorepo orchestrated by Turborepo. Three workspace roots exist: `packages/`, `sites/`, and `tools/`. Sites depend on packages. When you build, Turborepo figures out the dependency graph, builds packages first, then builds all sites in parallel with aggressive caching.

```
pnpm build (root)
    ↓ Turborepo reads turbo.json
    ↓ Determines dependency order via "dependsOn": ["^build"]
    ↓
Phase 1: Build packages (parallel, no interdependencies)
    ├── packages/theme-system          → tsc (TypeScript → dist/)
    ├── packages/intake-system         → tsup (TypeScript → dist/, dual CJS + ESM)
    ├── packages/themes/               → NO BUILD (CSS-only, imported by sites)
    ├── packages/core-components       → NO BUILD (source-only, compiled by sites)
    └── packages/component-composition → NO BUILD (source-only, compiled by sites)
    ↓
Phase 2: Build sites (parallel, after packages complete)
    ├── sites/base-template           → next build
    ├── sites/colossus-scaffolding    → next build
    ├── sites/dcs                     → next build
    ├── sites/dj-fox-electrical       → next build
    ├── sites/mad-graphics            → next build
    ├── sites/showcase                → next build
    └── sites/[theme-name]-test       → next build (test only, created by pipeline)
    ↓
Each next build:
    1. Loads theme.config.ts → runs createThemePlugin() → generates CSS variables
    2. Resolves @platform/* imports via tsconfig paths
    3. Calls generateStaticParams() for each [slug] route → reads all MDX files
    4. Renders every page to static HTML
    5. Outputs to .next/
```

## How Packages Connect to Sites

### pnpm Workspaces

`pnpm-workspace.yaml` declares the workspace roots:

```yaml
packages:
  - "packages/*"
  - "sites/*"
  - "tools/*"
```

Sites declare package dependencies using the `workspace:*` protocol:

```json
// sites/base-template/package.json
{
  "dependencies": {
    "@platform/theme-system": "workspace:*"
  }
}
```

When you run `pnpm install`, pnpm creates symlinks from `node_modules/@platform/theme-system` to `packages/theme-system/`. No publishing, no version pinning — sites always use the local workspace version.

### TypeScript Path Resolution

Sites configure TypeScript to resolve `@platform/*` imports directly to source files:

```json
// sites/base-template/tsconfig.json
{
  "compilerOptions": {
    "paths": {
      "@platform/core-components": ["../../packages/core-components/src/index.ts"],
      "@platform/core-components/*": ["../../packages/core-components/src/*"],
      "@platform/theme-system": ["../../packages/theme-system/src/index.ts"],
      "@platform/theme-system/plugin": ["../../packages/theme-system/src/tailwind-plugin.ts"]
    }
  }
}
```

This means TypeScript type-checking resolves against the source, even though the runtime import may resolve to `dist/`. It's faster for development and provides better error messages.

### Why core-components Has No Build Step

`@platform/core-components` exports raw TypeScript source:

```json
// packages/core-components/package.json
{
  "main": "./src/index.ts",
  "exports": { ".": "./src/index.ts" }
}
```

Next.js compiles it directly during each site's build. This means:

- No double-compilation overhead
- Changes reflected immediately in dev mode via HMR
- Simpler workflow (no "build the package first" step)

### Why theme-system and intake-system Are Pre-Built

These packages need to be compiled before sites can use them:

- **theme-system** — the Tailwind plugin runs in Node.js and needs CommonJS. `tsc` compiles to `dist/`.
- **intake-system** — used by both sites and CLI tools, needs dual format (CJS + ESM). `tsup` bundles to `dist/`.

Turborepo's `"dependsOn": ["^build"]` ensures these build before any site that imports them.

## Turborepo Configuration

```json
// turbo.json
{
  "tasks": {
    "build": {
      "dependsOn": ["^build"], // Build dependencies first
      "outputs": [".next/**", "!.next/cache/**", "dist/**"], // Cache these outputs
      "env": [
        "NODE_ENV",
        "NEXT_PUBLIC_SITE_URL",
        "SUPABASE_URL",
        "SUPABASE_SERVICE_KEY",
        "RESEND_API_KEY",
        "FEATURE_CONSENT_BANNER",
        "FEATURE_GA4_ENABLED",
        "FEATURE_FACEBOOK_PIXEL",
        "FEATURE_GOOGLE_ADS",
        "FEATURE_ANALYTICS_ENABLED",
        "FEATURE_SERVER_TRACKING",
        "CSRF_SECRET",
        "BUSINESS_NAME",
        "BUSINESS_EMAIL",
        "R2_BUCKET_NAME",
        "GA4_API_SECRET",
        "FACEBOOK_ACCESS_TOKEN",
        "NEW_RELIC_LICENSE_KEY",
        "NEW_RELIC_APP_NAME",
        "NEW_RELIC_LOG",
        "NEW_RELIC_DISTRIBUTED_TRACING_ENABLED",
        "NEW_RELIC_NO_CONFIG_FILE",
        "VERCEL_URL",
        "VERCEL_ENV",
        "NEXT_PUBLIC_FEATURE_CONSENT_BANNER",
        "NEXT_PUBLIC_FEATURE_ANALYTICS_ENABLED",
        "NEXT_PUBLIC_FEATURE_GA4_ENABLED",
        "NEXT_PUBLIC_FEATURE_FACEBOOK_PIXEL",
        "NEXT_PUBLIC_FEATURE_GOOGLE_ADS",
        "NEXT_PUBLIC_GA_MEASUREMENT_ID",
        "NEXT_PUBLIC_FACEBOOK_PIXEL_ID",
        "NEXT_PUBLIC_GOOGLE_ADS_CUSTOMER_ID",
        "NEXT_PUBLIC_R2_PUBLIC_URL"
      ]
    },
    "dev": {
      "cache": false, // Never cache dev server
      "persistent": true // Keep running
    },
    "lint": {
      "dependsOn": ["^lint"]
    },
    "type-check": {
      "dependsOn": ["^type-check"],
      "outputs": ["*.tsbuildinfo"]
    },
    "test": {
      "dependsOn": ["^build"], // Tests need dependencies built first
      "outputs": ["coverage/**"]
    },
    "test:e2e": {
      "dependsOn": ["build"],
      "cache": false,
      "outputs": ["playwright-report/**", "test-results/**"]
    },
    "test:e2e:smoke": {
      "dependsOn": ["build"],
      "cache": false,
      "outputs": ["playwright-report/**", "test-results/**"]
    },
    "test:e2e:ui": {
      "dependsOn": ["build"],
      "cache": false,
      "persistent": true
    },
    "clean": {
      "cache": false
    }
  }
}
```

### Caching

Turborepo hashes inputs (source files, configs, env vars) and caches outputs (`.next/`, `dist/`). If nothing changed since the last build, it replays the cached output instantly. This is why incremental builds are so fast.

Cache busts when:

- Any source file in the package/site changes
- `package.json` dependencies change
- Environment variables listed in `env` change
- `globalDependencies` (`.env.*local` files) change

### The `^` Prefix

In `"dependsOn": ["^build"]`, the `^` means "my dependencies' build tasks, not my own." So when `sites/base-template` builds, Turborepo first runs `build` on `@platform/theme-system` and `@platform/intake-system` (its workspace dependencies), then runs `next build` on the site itself.

### Environment Variable Requirements

Every environment variable that affects build output must be listed in the `env` array. If a variable is used at build time but not listed, Turborepo may serve a cached build from when the variable had a different value (or was unset). This has caused production bugs with feature flags like `FEATURE_CONSENT_BANNER` being invisible despite being set in Vercel.

When adding a new env var: add it to `turbo.json` `tasks.build.env`, then verify with `pnpm turbo run build --dry` that build hashes change.

## What `next build` Does Per Site

Inside each site's build:

1. **Tailwind CSS processing** — loads `tailwind.config.ts`, runs `createThemePlugin()`, generates all CSS with theme variables
2. **TypeScript compilation** — compiles `app/`, `components/`, `lib/`, plus `@platform/core-components` source
3. **Static generation** — for each `[slug]` route:
   - Calls `generateStaticParams()` to discover all MDX files
   - Calls `generateMetadata()` per page for SEO tags
   - Renders each page component to HTML
4. **Asset optimization** — images, fonts, JS bundles
5. **Output** — writes everything to `.next/`

### Webpack vs Turbopack

Production builds use `next build --webpack`. Turbopack (the default bundler in Next.js 16) has known PostCSS processing bugs that cause panics in CI (as of April 2026). Dev mode (`next dev`) continues to use Turbopack for its faster HMR.

### Tailwind Content Scanning

The `content` array in `tailwind.config.ts` controls which files Tailwind scans for class usage. Overly broad globs like `packages/themes/**/*.{js,ts,jsx,tsx}` will descend into `node_modules/` inside theme packages, inflating build times from ~30 seconds to 18+ minutes. Always use scoped globs that stop before `node_modules/`:

```
'../../packages/themes/*/*.{js,ts,jsx,tsx}'
'../../packages/themes/*/components/**/*.{js,ts,jsx,tsx}'
```

## Quality Gates

The build pipeline includes quality checks at multiple stages:

| Stage                  | What Runs                                                 | When                               |
| ---------------------- | --------------------------------------------------------- | ---------------------------------- |
| Pre-commit (Husky)     | lint-staged (Prettier), MDX content validation            | Every commit                       |
| Pre-push (Husky)       | TypeScript check only (~3s)                               | Every push                         |
| CI (GitHub Actions)    | ESLint, TypeScript, content validation, unit tests, build | Every push to develop/staging/main |
| CI (staging/main only) | E2E tests (Playwright)                                    | PRs and pushes to staging/main     |

## Common Build Issues

**"Module not found: @platform/theme-system"**
→ Run `pnpm install` from root. The workspace symlink may be missing.

**"Type error in packages/core-components"**
→ Run `pnpm type-check` from root. Core-components is type-checked as part of the site build.

**Build succeeds locally but fails in CI**
→ CI runs a clean install. Check that `pnpm-lock.yaml` is committed and up to date. Run `pnpm install --frozen-lockfile` locally to reproduce.

**Cache seems stale**
→ Run `pnpm clean` to clear all Turborepo caches, then `pnpm build` for a fresh build.
