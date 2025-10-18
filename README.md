# Local Business Platform

White-label website generation platform for local service businesses (plumbers, gardeners, builders, roofers, scaffolders) targeting South East England.

---

## 📋 Project Status

**Phase:** ✅ Week 2 Complete - Component Versioning & Multi-Site Validation
**Architecture:** Option B - Root as Coordinator (Monorepo with Separate Vercel Projects)
**Current Sites:** 2 (colossus-reference, joes-plumbing-canterbury)
**Target:** 50 sites by end of Year 1
**Last Build:** 44.4s from scratch | **253ms cached** (176x faster with Turborepo!)
**Components:** @platform/core-components v1.1.0
**Image Storage:** ✅ Cloudflare R2 (46 images uploaded, all code updated)

---

## 🏗 Architecture

This is a **pnpm workspace + Turborepo monorepo** where:

- Root coordinates builds and deployment (no application code)
- Shared components live in `packages/core-components`
- Each client site is a separate Next.js app in `sites/`
- All 50 sites deploy to ONE Vercel Pro team (£20/month total)

### Why This Architecture?

✅ **Clean Separation** - Root coordinates, sites are independent
✅ **Risk Isolation** - One site fails, others unaffected
✅ **Phased Deployment** - Canary testing before full rollout
✅ **Per-Site Customization** - Via config, not conditional logic
✅ **Easy Client Handoff** - Each site is independent
✅ **Cost Efficient** - £20/month for all 50 sites
✅ **Fast Builds** - Turborepo caching (26.88s for 77 pages)
✅ **Scalable** - Add sites without changing infrastructure

---

## 📁 Repository Structure

```
local-business-platform/
├── package.json                  # Minimal root coordinator
├── turbo.json                    # Turborepo build orchestration
├── pnpm-workspace.yaml          # Workspace configuration
│
├── packages/
│   └── core-components/          # Shared components (versioned)
│       ├── src/
│       │   ├── components/       # All UI components
│       │   ├── lib/              # Shared utilities
│       │   └── index.ts          # Public exports
│       ├── package.json
│       └── tsconfig.json
│
├── sites/                        # 50 separate Vercel projects
│   ├── colossus-reference/       # Scaffolding business (77 pages)
│   │   ├── app/                  # Next.js 15 app directory
│   │   ├── components/           # Site-specific components
│   │   ├── lib/                  # Site-specific utilities
│   │   ├── content/              # MDX content (62 files)
│   │   ├── public/               # Static assets
│   │   ├── site.config.ts        # Business customization
│   │   ├── next.config.ts        # Next.js configuration
│   │   ├── tailwind.config.ts    # Tailwind configuration
│   │   ├── package.json          # Site dependencies
│   │   └── tsconfig.json         # TypeScript configuration
│   │
│   └── joes-plumbing-canterbury/ # Plumbing business (12 pages)
│       ├── app/                  # Next.js 15 app directory
│       ├── components/           # Navigation, etc
│       ├── lib/                  # Content utilities
│       ├── content/              # Services & locations
│       ├── site.config.ts        # Plumbing business config
│       └── ... (same structure)
│
├── tools/                        # Automation scripts (Week 2+)
│   ├── create-site.ts           # Interactive site generator
│   ├── deploy-site.ts           # Single site deployment
│   └── deploy-batch.ts          # Phased batch deployment
│
├── assets/                       # Image strategy docs
│   └── README.md                # Cloudflare R2 strategy (Week 3)
│
└── docs/                         # Complete documentation
    ├── README.md                # Documentation index
    ├── WHITE_LABEL_PLATFORM_DESIGN.md  # 8-week roadmap
    ├── architecture/            # Architectural guidelines
    ├── development/             # Development workflow
    ├── deployment/              # Vercel deployment guide
    ├── component-versioning/    # Changesets workflow
    ├── testing/                 # Testing strategies
    └── ai/                      # AI agent guidelines
```

---

## 🚀 Quick Start

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

# Build all sites with Turborepo
pnpm build

# Run linting across all workspaces
pnpm lint
```

### Development

```bash
# Run reference site in development
cd sites/colossus-reference
pnpm dev
# Visit http://localhost:3000

# Build specific site
cd sites/colossus-reference
pnpm build

# Build all sites (from root)
pnpm build
```

---

## 🎯 Business Model

### Pricing

- **Setup Fee:** £2,000-2,500 per site (one-time)
- **Maintenance:** £25/month per site
- **Additional Pages:** £100 each
- **Custom Features:** £500-1,500

### Economics (50 Sites)

**Revenue:**

- Setup fees: £100,000 (one-time, Year 1)
- Monthly recurring: £1,250/month (£15,000/year)
- **Year 1 Total: ~£115,000**

**Costs:**

- Vercel Pro: £20/month
- Cloudflare R2: £10/month
- Claude API: £20/month
- Sentry: £0-25/month
- **Total: £50-75/month (£600-900/year)**

**Profit:** £1,175-1,200/month = **94-96% margin** 🎉

---

## 📦 Component Variant System (Week 2)

Each site customizes components via `site.config.ts`:

```typescript
// sites/joes-plumbing/site.config.ts
export const siteConfig = {
  name: "Joe's Plumbing Canterbury",
  business: {
    name: "Joe's Plumbing",
    phone: "01227 123456",
    email: "joe@joesplumbing.com",
  },
  components: {
    hero: "split", // Uses HeroSplit variant
    serviceCard: "elevated",
    contactForm: "minimal",
  },
  theme: {
    primary: "#1e40af", // Blue
    secondary: "#0f172a", // Dark slate
    accent: "#f59e0b", // Amber
  },
};
```

**No per-site code duplication. Just config changes!**

---

## 🖼 Image Management (Week 3)

### Production: Cloudflare R2 (Not Git!)

Images are stored in Cloudflare R2, not in this repository.

**Why?**

- ❌ Git doesn't scale with binary files
- ❌ Repository would balloon to GB+ sizes
- ✅ R2 provides global CDN + automatic optimization
- ✅ Cost: ~£10/month for 50GB (100+ sites worth)

### Naming Convention

```
{site-slug}_{component}_{page-type}_{page-slug}_{variant}.{ext}

Examples:
joes-plumbing-canterbury_hero_service_emergency-plumbing_01.jpg
joes-plumbing-canterbury_gallery_project_bathroom-renovation_03.jpg
```

### Workflow (Coming Week 3)

```bash
npm run images:intake joes-plumbing-canterbury ~/client-images/joe/
# Automatically:
# 1. Optimizes images (WebP + AVIF)
# 2. Generates responsive sizes
# 3. Renames with convention
# 4. Uploads to R2
# 5. Updates site config
```

---

## 🤖 AI Content Generation (Week 5)

Generate unique content for each site using Claude API:

```bash
npm run generate:content joes-plumbing-canterbury

# Generates:
# - 25 service pages
# - 37 location pages
# - About page
# - Contact page
# - All with unique, SEO-optimized content
# - Internal uniqueness checking (no duplication across our sites)
```

**Uniqueness checking:** Only against our internal portfolio (no web scraping, no legal issues)

---

## 📈 Deployment Strategy (Week 4)

### Phased Rollout

```
Phase 1: Internal Test → Phase 2: Canary (5 sites) → Phase 3: Batched (45 sites)
         ↓ Smoke tests                ↓ 1hr wait + monitoring      ↓ 10 at a time
         ABORT if fails               ROLLBACK if errors           PAUSE on issues
```

### Rollback Capability

```bash
npm run deploy:rollback site-1,site-2,site-3
# Automatically reverts deployments in ~2 minutes
```

---

## 🛠 Development Commands

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
pnpm dev              # Run this site only
pnpm build            # Build this site only
pnpm lint             # Lint this site
pnpm type-check       # Type check this site
pnpm test             # Run this site's tests
pnpm test:e2e         # Run E2E tests
```

### Coming Soon (Week 2+)

```bash
pnpm create:site                  # Interactive site generator
pnpm deploy:site <site-name>      # Deploy single site
pnpm deploy:batch                 # Phased deployment (all sites)
```

---

## 📊 Implementation Roadmap

### ✅ Week 1: Monorepo Foundation (COMPLETE)

- ✅ Set up Turborepo + pnpm workspaces
- ✅ Refactor root to pure coordinator (Option B)
- ✅ Move code to sites/colossus-reference
- ✅ Extract components to packages/core-components
- ✅ Successful build (26.88s for 77 pages)
- ✅ Deploy colossus-reference to Vercel
- ✅ Measure multi-site build times

### ✅ Week 2: Component Versioning (COMPLETE)

- ✅ Deploy colossus-reference to Vercel (live)
- ✅ Create second test site (joes-plumbing-canterbury)
- ✅ Deploy second site to Vercel (live)
- ✅ Add full content structure (12 pages)
- ✅ Add navigation and custom styling
- ✅ Measure multi-site builds (44.4s / 253ms cached = 176x faster!)
- ✅ Add changesets for component versioning
- ✅ Create variant system (3 Hero variants: V1, V2, V3)
- ✅ Test version migration (1.0.0 → 1.1.0)
- ✅ Document versioning workflow

### Week 3: Image Storage (Cloudflare R2)

- [x] Set up R2 bucket
- [x] Build image processing pipeline (Sharp)
- [x] Create intake tool
- [x] Create Vercel environment setup automation
- [ ] Add R2 credentials to .env.local
- [ ] Test R2 connection
- [ ] Configure Vercel environment variables
- [ ] Migrate test images

### Week 4: Deployment Pipeline (CRITICAL)

- [ ] Build phased deployment scripts
- [ ] Implement smoke tests
- [ ] Automated rollback
- [ ] Sentry integration

### Week 5: AI Content Generation

- [ ] Claude API integration
- [ ] Service/location generators
- [ ] Internal uniqueness checking
- [ ] Quality validators

### Week 6: Blog & Projects

- [ ] Blog content type
- [ ] Project portfolio type
- [ ] AI generators for both

### Week 7: Registry & Monitoring

- [ ] Supabase site registry
- [ ] Management CLI tools
- [ ] Monitoring dashboard
- [ ] Automated alerts

### Week 8: Production Launch

- [ ] Build industry libraries (plumbing, gardening)
- [ ] End-to-end workflow
- [ ] First real paying client
- [ ] Complete documentation

---

## 🔧 Technologies

**Core Stack:**

- Next.js 15 (App Router)
- React 19
- TypeScript (Strict mode)
- Tailwind CSS
- MDX (Content)

**Build System:**

- Turborepo (caching & orchestration)
- pnpm workspaces (dependency management)
- SWC (Fast compilation)

**Infrastructure:**

- Vercel (hosting - £20/month for 50 sites)
- Cloudflare R2 (image storage - £10/month)
- Supabase (site registry - Free tier)
- Sentry (monitoring - £0-25/month)

**Content & Automation:**

- Claude API (AI content generation)
- Sharp (image processing)
- Zod (content validation)

---

## 📖 Documentation

Comprehensive documentation in [/docs](./docs/):

**Platform Strategy:**

- [WHITE_LABEL_PLATFORM_DESIGN.md](./docs/WHITE_LABEL_PLATFORM_DESIGN.md) - Complete 8-week plan
- [WEEK_1_COMPLETE.md](./docs/WEEK_1_COMPLETE.md) - Week 1 completion report
- [MONOREPO_STATUS.md](./docs/MONOREPO_STATUS.md) - Architecture decisions

**Development:**

- [docs/README.md](./docs/README.md) - Documentation index
- [ARCHITECTURE.md](./docs/architecture/ARCHITECTURE.md) - Architectural guidelines
- [DEVELOPMENT.md](./docs/development/DEVELOPMENT.md) - Development workflow
- [TESTING.md](./docs/testing/E2E_TESTING_STRATEGY.md) - Testing strategies

**Quick Links:**

- [TODO.md](./docs/TODO.md) - Current task list
- [CLAUDE.md](./docs/ai/CLAUDE.md) - AI agent instructions

---

## 🎯 Current Status & Next Steps

### ✅ Week 2 Complete

1. ✅ Monorepo structure established (Option B)
2. ✅ Root refactored to pure coordinator
3. ✅ colossus-reference site deployed to Vercel (77 pages)
4. ✅ joes-plumbing-canterbury site deployed to Vercel (12 pages)
5. ✅ Turborepo + pnpm workspaces configured
6. ✅ Multi-site build performance validated (44.4s / 253ms cached = 176x faster!)
7. ✅ Changesets installed and configured
8. ✅ Component versioning workflow tested (@platform/core-components v1.0.0 → v1.1.0)
9. ✅ Hero component variants created (V1, V2, V3)
10. ✅ Site customization demonstrated (different themes, fonts, styling)

### 🎯 Next Steps (Week 3)

1. Set up Cloudflare R2 bucket for image storage
2. Build image processing pipeline (Sharp)
3. Create image intake tool
4. Migrate test images to R2
5. Update sites to use R2 URLs

See [docs/TODO.md](./docs/TODO.md) for complete task list.

---

## 💡 Key Principles

1. **Config over Code** - Sites customize via `site.config.ts`, not code changes
2. **Shared Components** - All sites use versioned components from `@platform/core-components`
3. **Independent Deploys** - Each site deploys separately for risk isolation
4. **Phased Rollouts** - Never deploy to all 50 sites at once
5. **Images in R2** - Never commit images to Git
6. **Heavy Automation** - One person can manage 50 sites
7. **Clean Architecture** - Root coordinates, sites are independent

---

## 📊 Success Metrics

### Build Performance ✅

- **Single site:** 26.88s (target: <30s) ✅
- **Multi-site from scratch:** 44.4s for 2 sites (89 pages total) ✅
- **Turborepo cache hit:** 253ms (176x faster than clean build!) ✅
- **Target for 50 sites:** <5min ✅ (on track)

### Code Quality ✅

- TypeScript: Strict mode, zero errors ✅
- ESLint: All rules passing ✅
- Tests: 141 unit + 92 E2E tests ✅
- Pre-commit hooks: Active ✅

### Business Metrics

- **Sites deployed:** 2/50 (colossus-reference, joes-plumbing-canterbury)
- **Component library:** v1.1.0 with 3 Hero variants
- **Revenue generated:** £0 (pre-launch)
- **Target:** First client by Week 8

---

## 🤝 Contributing

This is a commercial project. For questions or collaboration:

- Email: webmaster@digitalconsultingservices.co.uk
- GitHub Issues: For technical issues only

---

## 📝 License

Proprietary - All Rights Reserved
© 2025 Digital Consulting Services

---

**Status:** ✅ Week 2 Complete - Component Versioning System Live! 🚀
**Last Updated:** 2025-10-12
**Current Phase:** Week 2 Complete / Week 3 Starting
**Build Time:** 44.4s from scratch | **253ms cached** (176x faster!)
**Architecture:** Option B - Root as Coordinator ✅
**Component Library:** @platform/core-components v1.1.0
