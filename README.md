# Local Business Platform

A white-label website generation platform for local service businesses (plumbers, gardeners, builders, roofers, scaffolders) targeting South East England.

## What It Does

This platform enables rapid deployment of professional, SEO-optimized websites for local service businesses. Each site is:

- **Fully customizable** via configuration (no code changes needed per site)
- **SEO-optimized** with proper schema markup, meta tags, and structured content
- **Performance-focused** with Next.js 16, Turbopack, and optimized images
- **Content-rich** with service pages, location pages, and dynamic routing

## Architecture

This is a **pnpm workspace + Turborepo monorepo** where:

- Root coordinates builds and deployment (no application code)
- Shared components live in `packages/core-components`
- Each client site is a separate Next.js app in `sites/`
- Each site deploys to its own Vercel project

### Key Benefits

- **Clean Separation** - Root coordinates, sites are independent
- **Risk Isolation** - One site fails, others unaffected
- **Phased Deployment** - Canary testing before full rollout
- **Per-Site Customization** - Via config, not conditional logic
- **Fast Builds** - Turborepo caching provides 176x faster incremental builds
- **Scalable** - Add sites without changing infrastructure

## Repository Structure

```
local-business-platform/
├── package.json                  # Root coordinator
├── turbo.json                    # Turborepo build orchestration
├── pnpm-workspace.yaml           # Workspace configuration
│
├── packages/
│   ├── core-components/          # Shared components (versioned)
│   │   ├── src/
│   │   │   ├── components/       # UI components
│   │   │   ├── lib/              # Shared utilities
│   │   │   └── index.ts          # Public exports
│   │   └── package.json
│   │
│   └── theme-system/             # Centralized theming (@platform/theme-system)
│       ├── src/
│       │   ├── types.ts          # ThemeConfig interface
│       │   ├── defaults.ts       # Default theme values
│       │   ├── tailwind-plugin.ts # Tailwind CSS plugin
│       │   └── validation.ts     # Zod schema validation
│       └── package.json
│
├── sites/                        # Individual client sites
│   ├── colossus-reference/       # Reference implementation (scaffolding)
│   │   ├── app/                  # Next.js 16 app directory
│   │   ├── components/           # Site-specific components
│   │   ├── lib/                  # Site-specific utilities
│   │   ├── content/              # MDX content files
│   │   ├── site.config.ts        # Business customization
│   │   └── ...
│   │
│   ├── joes-plumbing-canterbury/ # Demo site (plumbing)
│   │   └── ... (same structure)
│   │
│   └── base-template/            # Template for new sites (copy-and-customize)
│       └── ... (gold-standard template)
│
├── tools/                        # Automation scripts
│   ├── create-site.ts            # Create new site from base-template
│   ├── deploy-site.ts            # Single site deployment
│   ├── deploy-batch.ts           # Phased batch deployment
│   └── rollback.ts               # Quick rollback tool
│
└── docs/                         # Documentation
    ├── architecture/             # Architectural guidelines
    ├── development/              # Development workflow
    └── testing/                  # Testing strategies
```

## Quick Start

### Prerequisites

- Node.js 18+
- pnpm 8+

### Installation

```bash
# Clone the repository
git clone https://github.com/rickydwilson-dcs/local-business-platform.git
cd local-business-platform

# Install dependencies for all workspaces
pnpm install

# Build all sites
pnpm build

# Run linting
pnpm lint
```

### Development

```bash
# Run a site in development mode
cd sites/colossus-reference
pnpm dev
# Visit http://localhost:3000

# Build a specific site
pnpm build

# Build all sites (from root)
cd ../..
pnpm build
```

## Site Customization

Each site is customized via `site.config.ts`:

```typescript
export const siteConfig = {
  name: "Joe's Plumbing Canterbury",
  business: {
    name: "Joe's Plumbing",
    phone: "01227 123456",
    email: "joe@joesplumbing.com",
  },
  components: {
    hero: "split",
    serviceCard: "elevated",
    contactForm: "minimal",
  },
  theme: {
    primary: "#1e40af",
    secondary: "#0f172a",
    accent: "#f59e0b",
  },
};
```

No per-site code duplication - just configuration changes.

## Image Management

Images are stored in Cloudflare R2 (not in the repository) for scalability and performance.

**Naming Convention:**

```
{site-slug}_{component}_{page-type}_{page-slug}_{variant}.{ext}

Examples:
joes-plumbing-canterbury_hero_service_emergency-plumbing_01.webp
colossus-reference_hero_location_brighton_01.webp
```

## Deployment

### CI/CD Pipeline

- **GitHub Actions** runs on every push: TypeScript, ESLint, Build, Tests
- **E2E Tests** run on staging before production deployment
- **Automated deployment** on `main` branch with phased rollout

### Deployment Commands

```bash
# Single site deployment
tsx tools/deploy-site.ts colossus-reference --env production

# Batch deployment with phased rollout
tsx tools/deploy-batch.ts --env production

# Quick rollback
tsx tools/rollback.ts colossus-reference
```

### Phased Rollout

Deployments follow a staged approach:

1. **Canary** - Deploy to 1 site, monitor for issues
2. **Small Batch** - Deploy to next 5 sites
3. **Medium Batch** - Deploy to next 10 sites
4. **Full Rollout** - Deploy to remaining sites

## Development Commands

### Root Level (Turborepo)

```bash
pnpm build            # Build all sites (cached)
pnpm lint             # Lint all workspaces
pnpm type-check       # Type check all workspaces
pnpm clean            # Clean all build artifacts
pnpm test             # Run all tests
```

### Site Level

```bash
cd sites/colossus-reference
pnpm dev              # Development server
pnpm build            # Production build
pnpm lint             # Lint this site
pnpm type-check       # Type check this site
pnpm test             # Run unit tests
pnpm test:e2e         # Run E2E tests
pnpm test:e2e:smoke   # Run smoke tests only
```

## Technology Stack

**Core:**

- Next.js 16.0.7 (App Router with Turbopack)
- React 19.1.2
- TypeScript (Strict mode)
- Tailwind CSS + Theme System (CSS variables)
- MDX (Content management)

**Build System:**

- Turbopack (default bundler in Next.js 16)
- Turborepo (caching & orchestration)
- pnpm workspaces (dependency management)

**Infrastructure:**

- Vercel (hosting)
- Cloudflare R2 (image storage)
- NewRelic APM (monitoring)

**Quality:**

- ESLint 9 (flat config)
- Vitest (unit tests)
- Playwright (E2E tests)
- Zod (content validation)

## Documentation

See [/docs](./docs/) for comprehensive documentation:

- [ARCHITECTURE.md](./docs/architecture/ARCHITECTURE.md) - Architectural guidelines
- [DEVELOPMENT.md](./docs/development/DEVELOPMENT.md) - Development workflow
- [DEPLOYMENT_GUIDE.md](./docs/DEPLOYMENT_GUIDE.md) - Deployment procedures
- [E2E_TESTING_STRATEGY.md](./docs/testing/E2E_TESTING_STRATEGY.md) - Testing approach
- [Theming Guide](./docs/guides/theming.md) - Theme system and CSS variables
- [Adding a New Site](./docs/guides/adding-new-site.md) - Create new client sites

## License

Proprietary - All Rights Reserved
© 2025 Digital Consulting Services
