# Local Business Platform

A white-label website platform for local service businesses (plumbers, electricians, builders, scaffolders, gardeners) targeting South East England. Each client gets a fully customised, SEO-optimised Next.js website — deployed independently but sharing a common component library and theme system.

The monorepo uses Turborepo + pnpm workspaces. Shared code lives in `packages/`, individual client websites live in `sites/`, and automation scripts live in `tools/`. Content is managed entirely through MDX files with YAML frontmatter — no hardcoded data files, no per-page route files.

## Repository Structure

```
local-business-platform/
├── packages/
│   ├── core-components/       # Shared UI components (versioned with Changesets)
│   ├── theme-system/          # Tailwind plugin + CSS variable generation
│   └── intake-system/         # Client onboarding automation
│
├── sites/
│   ├── colossus-reference/    # Reference implementation (scaffolding business)
│   ├── smiths-electrical-cambridge/  # Demo site (electrical business)
│   └── base-template/         # Gold-standard template for new sites
│
├── tools/                     # Site creation, image management, deployment scripts
└── docs/                      # Architecture, standards, and how-to guides
```

## Quick Start

### Prerequisites

- Node.js 18+
- pnpm 8+

### Setup

```bash
git clone https://github.com/rickydwilson-dcs/local-business-platform.git
cd local-business-platform
pnpm install
pnpm build
```

### Development

```bash
# Run a site locally
cd sites/colossus-reference
pnpm dev
# Visit http://localhost:3000
```

### Common Commands

```bash
# Root level (Turborepo — runs across all workspaces)
pnpm build          # Build packages then sites (cached)
pnpm lint           # ESLint all workspaces
pnpm type-check     # TypeScript strict mode check
pnpm clean          # Remove build artifacts

# Site level (run from within a site directory)
pnpm dev            # Next.js dev server
pnpm build          # Production build
pnpm test           # Unit tests (Vitest)
pnpm test:e2e:smoke # Smoke tests (Playwright)
```

## Tech Stack

**Core:** Next.js (App Router), React, TypeScript, Tailwind CSS, MDX

**Build:** Turborepo, pnpm workspaces, Changesets

**Infrastructure:** Vercel, Cloudflare R2, Supabase

**Quality:** ESLint, Vitest, Playwright, Zod content validation

## Documentation

| Section                            | What It Covers                                                       |
| ---------------------------------- | -------------------------------------------------------------------- |
| [Architecture](docs/architecture/) | How dynamic routing, theming, builds, and site creation work         |
| [Standards](docs/standards/)       | Styling, components, content, SEO, security, testing, deployment     |
| [Guides](docs/guides/)             | Adding sites, services, locations; git workflow; theming; deployment |

See [CLAUDE.md](CLAUDE.md) for AI-specific context and key architecture rules.

## License

Proprietary — All Rights Reserved
