# White-Label Local Business Website Platform - Complete Design Document

**Created:** 2025-10-10
**Status:** Architecture Validated by Codex
**Decision:** Option B - Monorepo with Separate Vercel Projects

---

## Executive Summary

Building a white-label website generation platform for local service businesses (plumbers, gardeners, builders, roofers, scaffolders) targeting South East England, starting with Eastbourne/Polegate area.

### Business Model
- **Setup Fee:** £2,000-2,500 per site (one-time)
- **Maintenance:** £25/month per site
- **Additional Pages:** £100 each
- **Target:** 50 sites in Year 1

### Economics (50 Sites)

**Revenue:**
- Setup fees: £100,000 (one-time)
- Monthly recurring: £1,250/month (50 × £25)
- Year 1 total: ~£115,000

**Costs:**
- Vercel Pro: £20/month (all 50 sites under one team!)
- Cloudflare R2: £10/month (image storage)
- Claude API: £20/month (content generation)
- Sentry: £0-25/month (monitoring)
- **Total: £50-75/month**

**Profit:**
- Monthly: £1,175-1,200 (94-96% margin)
- Year 1: ~£114,100 net profit

### Critical Correction
**Initially thought:** Vercel Pro = £20/month per site = £1,000/month for 50 sites
**Actually:** Vercel Pro = £20/month TOTAL for unlimited projects under one team
**Impact:** Both architectural options economically viable, chose best technical approach

---

## Architecture Decision: Option B (Validated by Codex)

### Final Choice: Monorepo with 50 Separate Vercel Projects

All under ONE Vercel Pro team (£20/month), but each site is an independent project.

### Why Option B Over Multi-Tenant?

**Codex Recommendation:**
> "Stick with Option B. Even if handoffs never happen, the isolation, phased deployments, and flexibility for bespoke tweaks match a managed-agency workflow far better than a multi-tenant app."

**Key Reasons:**
- ✅ Risk isolation (one site fails, others unaffected)
- ✅ Phased deployment capability (canary → batches)
- ✅ Per-site customization without conditional logic
- ✅ Easy client handoff if needed
- ✅ Still £20/month (same cost as multi-tenant)
- ✅ Turborepo caching keeps builds fast (1-5 min)

---

## Repository Structure

```
local-business-platform/
├── packages/
│   ├── core-components/          # Shared, versioned components
│   │   ├── src/
│   │   │   ├── Hero/
│   │   │   │   ├── Hero.tsx
│   │   │   │   ├── HeroDefault.tsx
│   │   │   │   ├── HeroCentered.tsx
│   │   │   │   └── HeroSplit.tsx
│   │   │   ├── ServiceCard/
│   │   │   └── ... (40+ components)
│   │   └── package.json
│   │
│   ├── content-generator/         # AI content generation
│   ├── image-processor/           # Image optimization
│   └── site-config/              # Shared types
│
├── sites/                         # 50 separate Vercel projects
│   ├── joes-plumbing-canterbury/
│   │   ├── app/
│   │   ├── content/              # MDX files
│   │   ├── site.config.ts        # All customization here
│   │   ├── vercel.json
│   │   └── package.json
│   │
│   ├── bright-plumbing-canterbury/
│   └── ... (50 sites)
│
├── assets/                        # Stock images (not in Git)
├── tools/                         # Automation scripts
│   ├── create-site.ts
│   ├── deploy-site.ts
│   ├── deploy-batch.ts           # Phased deployment
│   └── version-components.ts
│
└── turbo.json                     # Turborepo config
```

---

## Component Variant System

### How It Works

Each major component supports multiple visual variants. Sites select which variant to use via their config file.

```typescript
// packages/core-components/src/Hero/index.tsx
export function Hero({ variant = "default", ...props }: HeroProps) {
  const variants = {
    default: HeroDefault,
    centered: HeroCentered,
    split: HeroSplit,
    "image-left": HeroImageLeft,
  };

  const Component = variants[variant];
  return <Component {...props} />;
}

// sites/joes-plumbing-canterbury/site.config.ts
export default {
  components: {
    hero: "split",           // Uses HeroSplit variant
    serviceCard: "elevated",
    contactForm: "minimal",
  },
};
```

### Adding New Variants

When client requests custom styling:

1. Create new variant file (e.g., `HeroImageLeft.tsx`)
2. Register in main component
3. Client site selects via config
4. Variant now available to ALL future sites

**No per-site duplication. No conditional logic explosion.**

---

## Image Management

### Naming Convention

```
{site-slug}_{component}_{page-type}_{page-slug}_{variant}.{ext}

Examples:
joes-plumbing-canterbury_hero_service_emergency-plumbing_01.jpg
joes-plumbing-canterbury_gallery_service_emergency-plumbing_01.jpg
joes-plumbing-canterbury_gallery_project_hotel-refurb_01.jpg
joes-plumbing-canterbury_comparison_service_boiler-repair_before.jpg
joes-plumbing-canterbury_comparison_service_boiler-repair_after.jpg
```

**Benefits:**
- SEO-friendly (includes business name, keywords)
- Component identification (know which uses image)
- Multi-image support (numbered variants)
- Easy searching across all sites

### Storage: Cloudflare R2 (Not Git)

```
Cloudflare R2 Bucket:
├── joes-plumbing-canterbury/
│   ├── branding/
│   ├── services/
│   │   └── emergency-plumbing/
│   │       ├── joes-plumbing-canterbury_hero_service_emergency-plumbing_01.jpg
│   │       ├── joes-plumbing-canterbury_hero_service_emergency-plumbing_01.webp
│   │       └── joes-plumbing-canterbury_gallery_service_emergency-plumbing_01.jpg
│   ├── projects/
│   └── blog/
└── ... (50 sites)

Cost: ~£10/month for 50GB
```

**Why R2, not Git:**
- Git doesn't scale with binary files
- Repo would balloon to GB+ size
- Clone times painful
- R2 provides CDN, automatic optimization

### Image Processing Workflow

```bash
# 1. Client provides messy images
~/client-images/joe-plumbing/
├── IMG_1234.jpg (3.2 MB)
├── photo.jpg
└── bathroom_work.jpg

# 2. You organize into standard folders
~/client-images/joe-plumbing/
├── logo/joe-logo.svg
├── services/
│   ├── emergency-plumbing/
│   │   ├── hero.jpg
│   │   └── gallery-1.jpg
│   └── boiler-repair/hero.jpg
└── projects/
    └── hotel-refurb/
        ├── gallery-1.jpg
        └── gallery-2.jpg

# 3. Run intake tool
npm run images:intake joes-plumbing-canterbury ~/client-images/joe-plumbing/

# Automatically:
# - Validates (size, format, dimensions)
# - Optimizes (resize, compress - typically 90%+ savings)
# - Generates WebP versions
# - Renames to standard convention
# - Uploads to Cloudflare R2
# - Updates site manifest

# Total time: ~5 minutes for 20 images
```

---

## AI Content Generation (No Web Scraping)

### The Challenge

Multiple competing businesses in same town need unique content:
- 5 plumbers in Canterbury
- All need "Emergency Plumbing" page
- Must be unique (SEO + client perception)

### The Solution: Internal Uniqueness Only

```typescript
async function generateServicePage(params: {
  business: string;
  service: string;
  location: string;
}) {
  const prompt = `
Generate unique content for:
- Business: ${params.business}
- Service: ${params.service}
- Location: ${params.location}

Requirements:
- 150-160 character meta description
- 6-8 industry-specific FAQs
- Unique, specific content (not generic)
- UK terminology and spelling
- Local references
- Professional but approachable tone

Temperature: 0.9 (high creativity)
  `;

  const content = await claudeAPI.generate(prompt);

  // Check uniqueness ONLY against YOUR sites (internal DB)
  const existing = await db.query(
    "SELECT content FROM pages WHERE service = ? AND location LIKE ?",
    [params.service, `%${params.location}%`]
  );

  const similarity = checkSimilarity(content, existing);

  if (similarity > 0.7) {
    // Regenerate with more variation
    return generateServicePage(params);
  }

  return content;
}
```

**No web scraping. No legal/GDPR issues. Just check your own portfolio.**

---

## Deployment Pipeline (Critical - Codex Priority #1)

### Phased Deployment Strategy

```
Phase 1: Internal Test Site
├── Deploy to test-site-internal
├── Run smoke tests
├── If fails: ABORT
└── If passes: Continue

Phase 2: Canary (10% of sites)
├── Deploy to 5 sites
├── Wait 1 hour
├── Monitor error rates (Sentry)
├── If error rate > 5%: ROLLBACK
└── If healthy: Continue

Phase 3: Batched Rollout
├── Remaining 45 sites
├── Batches of 10 sites
├── 5 min wait between batches
├── Health check each batch
└── Pause on any issues
```

### Automated Rollback

```bash
# If canary or batch fails:
npm run rollback:batch site-1,site-2,site-3,...

# Automatically:
# 1. Reverts Vercel deployments
# 2. Verifies rollback health
# 3. Sends alerts
# 4. Logs incident
# 5. Pauses ongoing deployments

# Time to rollback: ~2 minutes
```

**Codex:** "Deployment orchestration and rollback scripting are now the central engineering tasks—automate smoke tests and batch limits before scaling past a handful of sites."

---

## Build Time Analysis (Turborepo Caching)

### Real-World Scenarios

**First Build (All 50 Sites):**
```bash
turbo run build
Time: ~20 minutes
Frequency: Once (initial setup)
```

**Update Component (50 Sites Use It):**
```bash
turbo run build --filter='...[HEAD^]'
Time: ~5 minutes (Turborepo caches unchanged deps)
Frequency: Weekly
```

**Update One Site Content:**
```bash
turbo run build --filter=joes-plumbing-canterbury
Time: ~30 seconds (one site only)
Frequency: Daily
```

**New Variant (10 Sites Opt In):**
```bash
turbo run build --filter='{site-1,...,site-10}'
Time: ~2 minutes (10 sites only)
Frequency: Monthly
```

**Conclusion: Manageable with Turborepo caching.**

---

## Component Versioning (Changesets)

### How It Works

```bash
# 1. Update component
cd packages/core-components/src/Hero
# Edit HeroDefault.tsx

# 2. Create changeset
npx changeset
? Which packages? @platform/core-components
? Change type? minor (new feature) or patch (bug fix)
? Summary: Add support for custom CTA styles

# 3. Bump version
npx changeset version
# 1.0.0 → 1.1.0

# 4. Sites gradually migrate
# Some stay on 1.0.0, test group upgrades to 1.1.0
# After 24h monitoring, rest upgrade
```

### Gradual Migration

Sites can use different component versions:

```json
// Site 1 (conservative)
{
  "dependencies": {
    "@platform/core-components": "^1.0.0"
  }
}

// Sites 2-10 (test group)
{
  "dependencies": {
    "@platform/core-components": "^1.1.0"
  }
}

// After validation, upgrade remaining sites
```

---

## Implementation Roadmap (8 Weeks)

### Week 1: Monorepo Foundation
- Set up Vercel Pro team
- Initialize Turborepo + pnpm workspaces
- Extract Colossus into core-components
- Deploy 2 test sites
- Measure build times

### Week 2: Component Versioning
- Add changesets
- Create variant system
- Test version migration
- 3 variants per major component

### Week 3: Image Storage (Cloudflare R2)
- Set up R2 bucket
- Build image processing pipeline (Sharp)
- Create intake tool
- Migrate test images

### Week 4: Deployment Pipeline (CRITICAL)
- Build phased deployment scripts
- Implement smoke tests
- Automated rollback
- Sentry integration

### Week 5: AI Content Generation
- Claude API integration
- Service/location generators
- Internal uniqueness checking
- Quality validators

### Week 6: Blog & Projects
- Blog content type
- Project portfolio type
- AI generators for both

### Week 7: Registry & Monitoring
- Supabase site registry
- Management CLI tools
- Monitoring dashboard
- Automated alerts

### Week 8: Production Launch
- Build industry libraries (plumbing, gardening)
- End-to-end workflow
- First real paying client
- Documentation

---

## Operational Playbook

### Adding New Client (30-60 min)

```bash
# 1. Generate site
npm run create:site
# Interactive prompts for all details

# 2. Organize images
# ~/client-images/joe-plumbing/ (standard folder structure)

# 3. Process images
npm run images:intake joes-plumbing-canterbury ~/client-images/joe-plumbing/
# ~5 min, optimizes everything

# 4. Generate AI content
npm run generate:content joes-plumbing-canterbury
# ~10 min, creates 60+ pages

# 5. Review content (spot-check)
npm run content:review joes-plumbing-canterbury

# 6. Deploy staging
npm run deploy joes-plumbing-canterbury --env=staging
# Client reviews

# 7. Deploy production
npm run deploy joes-plumbing-canterbury --env=production

# 8. Add custom domain
npm run domain:add joes-plumbing-canterbury joesplumbing.com

# Total: 30-60 min
```

### Updating Component Library

```bash
# 1. Make changes, create changeset
cd packages/core-components/src/ContactForm
# Edit, then: npx changeset

# 2. Bump version
npx changeset version

# 3. Deploy with phased rollout
npm run deploy:batch --component=ContactForm

# Automated:
# - Test site
# - Canary (5 sites, wait 1hr)
# - Batches of 10 with monitoring

# Total: ~2 hours (mostly waiting)
```

### Handling Customization

```bash
# Client: "Can my hero have image on left?"

# 1. Create variant
cd packages/core-components/src/Hero
cp HeroDefault.tsx HeroImageLeft.tsx
# Edit layout

# 2. Register variant
# Add to Hero/index.tsx variants object

# 3. Test locally
cd sites/joes-plumbing-canterbury
# Edit site.config.ts: hero: "image-left"

# 4. Deploy
npm run deploy joes-plumbing-canterbury

# New variant now available to ALL future sites
```

---

## Key Metrics

### Technical
- Build time: < 5 min (component updates)
- Build time: < 30 sec (single site)
- Deployment success: > 99%
- Rollback time: < 5 min
- Image optimization: > 90% savings

### Business
- New client deployment: 30-60 min
- All sites update: 2-3 hours
- Weekly maintenance: < 5 hours
- Profit margin: 94-96%
- Client satisfaction: Sites feel independent

### Content Quality
- AI uniqueness: < 70% similarity
- UK spelling: 100% compliance
- Tone: Professional but approachable
- Client approval: > 95%

---

## Watch Points (Codex Warnings)

### 1. Deployment Orchestration (Highest Priority)
**Issue:** 50 sites need robust automation

**Mitigation:**
- Phased deployment pipeline (Week 4)
- Automated health checks
- Rollback capability
- Comprehensive logging

### 2. Repo Hygiene
**Issue:** Repo size with 50 sites

**Mitigation:**
- Images in R2 (not Git)
- Aggressive .gitignore
- Prune dead branches
- Git LFS if needed later

### 3. Config Validation
**Issue:** Invalid configs cause runtime errors

**Mitigation:**
- Zod schema validation
- CI checks before deploy
- Clear error messages

---

## Risks & Mitigation

### Component Update Breaks Sites
**Mitigation:** Phased deployment, automated rollback, versioning

### AI Content Quality Issues
**Mitigation:** Automated validators, spot-checks, client review

### One Person Overwhelmed
**Mitigation:** Heavy automation, clear playbooks, alerts

---

## Scaling Path

### 50 Sites (Current Plan)
- Monorepo works perfectly
- £70/month costs, £1,180 profit
- One person manageable

### 100 Sites
- Consider splitting by industry
- Same architecture works
- May need part-time VA

### 200+ Sites
- Definitely split monorepos
- Hire support person
- Build admin UI
- On-call rotation

---

## Technologies

### Core Stack
- Next.js 15, React 19, TypeScript
- Tailwind CSS, MDX
- Turborepo, pnpm

### Infrastructure
- Vercel (£20/month)
- Cloudflare R2 (£10/month)
- Supabase (free tier)
- Sentry (free tier or £25/month)

### Content & Images
- Claude API (£20/month)
- Sharp (image processing)
- Zod (validation)

### Development
- Changesets (versioning)
- Vitest (unit tests)
- Playwright (E2E tests)

---

## Next Steps

### If Starting Now:

**Day 1:**
1. Set up Vercel Pro team
2. Initialize repository
3. Set up Turborepo

**Day 2:**
4. Extract Colossus into packages
5. Create site template
6. Deploy test site

**Day 3:**
7. Create 2nd test site (plumbing)
8. Test Turborepo caching
9. Verify independence

**Week 2+:**
- Follow 8-week roadmap

---

## Questions Before Implementation

1. **Domain Management:** Where registered? Transfer to Vercel?
2. **Email:** Separate sender per client? Or shared domain?
3. **Analytics:** Per-client Google Analytics? Or aggregate?
4. **Client Access:** Any dashboard needed? Or you manage everything?
5. **N8N Automation:** What's the marketing plan?
6. **Legal:** Service agreement ready? Privacy policy template?

---

## Conclusion

**Architecture:** Monorepo with separate Vercel projects (Option B) ✅
**Economics:** 94-96% profit margins ✅
**Feasibility:** Build times manageable with Turborepo ✅
**Risk Management:** Phased deployment prevents disasters ✅
**Scalability:** Architecture holds to 100+ sites ✅

**Status:** Ready to build 🚀

---

**Last Updated:** 2025-10-10
**Validated By:** Codex AI (architectural review)
**Next:** Begin Week 1 of implementation
