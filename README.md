# Local Business Platform

White-label website generation platform for local service businesses (plumbers, gardeners, builders, roofers, scaffolders) targeting South East England.

## 📋 Project Status

**Phase:** Week 1 - Monorepo Foundation
**Architecture:** Monorepo with Separate Vercel Projects (Option B)
**Current Sites:** 1 (test-site-internal)
**Target:** 50 sites by end of Year 1

## 🏗 Architecture

This is a **pnpm workspace + Turborepo monorepo** where:
- Shared components live in `packages/core-components`
- Each client site is a separate Vercel project in `sites/`
- All 50 sites deploy to ONE Vercel Pro team (£20/month total)

### Why This Architecture?

✅ **Risk Isolation** - One site fails, others unaffected
✅ **Phased Deployment** - Canary testing before full rollout
✅ **Per-Site Customization** - Via config, not conditional logic
✅ **Easy Client Handoff** - Each site is independent
✅ **Cost Efficient** - £20/month for all 50 sites
✅ **Fast Builds** - Turborepo caching (1-5 min for updates)

## 📁 Repository Structure

```
local-business-platform/
├── packages/
│   └── core-components/          # Shared components (versioned)
│       ├── src/
│       │   ├── components/       # UI components
│       │   ├── lib/              # Utilities
│       │   └── index.ts          # Public exports
│       └── package.json
│
├── sites/                        # 50 separate Vercel projects
│   └── test-site-internal/       # First test site
│       ├── app/                  # Next.js 15 app
│       ├── content/              # MDX content
│       ├── site.config.ts        # All customization here!
│       └── package.json
│
├── tools/                        # Automation scripts
│   ├── create-site.ts           # (Coming in Week 2)
│   ├── deploy-site.ts           # (Coming in Week 4)
│   └── deploy-batch.ts          # (Coming in Week 4)
│
├── assets/                       # Local dev only
│   └── README.md                # Images go to Cloudflare R2!
│
├── turbo.json                    # Turborepo config
├── pnpm-workspace.yaml          # Workspace config
└── package.json                 # Root scripts
```

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- pnpm 8+

### Installation

```bash
# Install dependencies for all workspaces
pnpm install

# Run test site in development
cd sites/test-site-internal
pnpm dev

# Build all sites
pnpm build

# Run linting across all workspaces
pnpm lint
```

## 🎯 Business Model

### Pricing
- **Setup Fee:** £2,000-2,500 per site (one-time)
- **Maintenance:** £25/month per site
- **Additional Pages:** £100 each

### Economics (50 Sites)

**Revenue:**
- Setup fees: £100,000 (one-time)
- Monthly recurring: £1,250/month
- **Year 1 Total: ~£115,000**

**Costs:**
- Vercel Pro: £20/month
- Cloudflare R2: £10/month
- Claude API: £20/month
- Sentry: £0-25/month
- **Total: £50-75/month**

**Profit:** £1,175-1,200/month (94-96% margin) 🎉

## 📦 Component Variant System

Each site can customize components via `site.config.ts`:

```typescript
export const siteConfig = {
  components: {
    hero: 'split',           // Uses HeroSplit variant
    serviceCard: 'elevated',
    contactForm: 'minimal',
  },
  theme: {
    primary: '#1e40af',
    secondary: '#0f172a',
  },
};
```

**No per-site code duplication. Just config changes!**

## 🖼 Image Management

### Production: Cloudflare R2 (Not Git!)

Images are stored in Cloudflare R2, not in this repository.

**Why?**
- Git doesn't scale with binary files
- Repository would balloon to GB+ sizes
- R2 provides CDN + optimization
- Cost: ~£10/month for 50GB

### Naming Convention

```
{site-slug}_{component}_{page-type}_{page-slug}_{variant}.{ext}

Example:
joes-plumbing-canterbury_hero_service_emergency-plumbing_01.jpg
```

### Workflow (Coming Week 3)

```bash
npm run images:intake joes-plumbing-canterbury ~/client-images/joe/
# Automatically optimizes, renames, and uploads to R2
```

## 🤖 AI Content Generation (Coming Week 5)

Generate unique content for each site using Claude API:

```bash
npm run generate:content joes-plumbing-canterbury
# Creates 60+ pages of unique, SEO-optimized content
```

**Uniqueness checking:** Only against our internal portfolio (no web scraping, no legal issues)

## 📈 Deployment Strategy (Week 4)

### Phased Rollout

```
Phase 1: Internal Test → Phase 2: Canary (5 sites) → Phase 3: Batched (45 sites)
         ↓ Smoke tests                ↓ 1hr wait + monitoring      ↓ 10 at a time
         ABORT if fails               ROLLBACK if errors           PAUSE on issues
```

### Rollback Capability

```bash
npm run rollback:batch site-1,site-2,site-3
# Automatically reverts deployments in ~2 minutes
```

## 🛠 Development Commands

### Root Level (affects all workspaces)

```bash
pnpm dev              # Run all sites in dev mode
pnpm build            # Build all sites (Turborepo cached)
pnpm lint             # Lint all workspaces
pnpm type-check       # Type check all workspaces
pnpm clean            # Clean all build artifacts
```

### Site Level

```bash
cd sites/test-site-internal
pnpm dev              # Run this site only
pnpm build            # Build this site only
pnpm type-check       # Type check this site
```

### Coming Soon

```bash
pnpm create:site                  # Interactive site generator
pnpm deploy:site <site-name>      # Deploy single site
pnpm deploy:batch                 # Phased deployment (all sites)
```

## 📊 Implementation Roadmap

- [x] **Week 1:** Monorepo foundation (YOU ARE HERE)
  - [x] Set up Turborepo + pnpm workspaces
  - [x] Extract Colossus into core-components
  - [ ] Deploy first test site
  - [ ] Measure build times

- [ ] **Week 2:** Component versioning
  - [ ] Add changesets
  - [ ] Create variant system
  - [ ] Test version migration

- [ ] **Week 3:** Image storage (Cloudflare R2)
  - [ ] Set up R2 bucket
  - [ ] Build image processing pipeline
  - [ ] Create intake tool

- [ ] **Week 4:** Deployment pipeline (CRITICAL)
  - [ ] Phased deployment scripts
  - [ ] Automated rollback
  - [ ] Sentry integration

- [ ] **Week 5:** AI content generation
  - [ ] Claude API integration
  - [ ] Service/location generators
  - [ ] Uniqueness checking

- [ ] **Week 6:** Blog & projects
- [ ] **Week 7:** Registry & monitoring
- [ ] **Week 8:** Production launch

## 🔧 Technologies

**Core Stack:**
- Next.js 15
- React 19
- TypeScript
- Tailwind CSS
- MDX

**Build System:**
- Turborepo (caching & orchestration)
- pnpm workspaces (dependency management)

**Infrastructure:**
- Vercel (hosting)
- Cloudflare R2 (image storage)
- Supabase (site registry)
- Sentry (monitoring)

**Content:**
- Claude API (AI content generation)
- Sharp (image processing)

## 📖 Documentation

See [/docs](./docs/) for detailed documentation:
- [White Label Platform Design](./docs/WHITE_LABEL_PLATFORM_DESIGN.md)

## 🎯 Next Steps

1. Fix import paths in test-site-internal
2. Test first build with Turborepo
3. Deploy to Vercel
4. Measure build times
5. Create second test site (plumber)

## 💡 Key Principles

1. **Config over Code** - Sites customize via `site.config.ts`, not code changes
2. **Shared Components** - All sites use versioned components from `@platform/core-components`
3. **Independent Deploys** - Each site deploys separately for risk isolation
4. **Phased Rollouts** - Never deploy to all 50 sites at once
5. **Images in R2** - Never commit images to Git
6. **Heavy Automation** - One person can manage 50 sites

---

**Status:** Ready for first test build 🚀
**Last Updated:** 2025-10-11
**Current Phase:** Week 1 - Monorepo Foundation
