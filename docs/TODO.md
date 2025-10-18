# Local Business Platform - TODO List

Outstanding tasks organized by 8-week implementation roadmap. Updated as tasks complete.

**Last Updated:** 2025-10-18
**Current Phase:** Week 3 In Progress

---

## ✅ Week 1: Monorepo Foundation (COMPLETE - 2025-10-11)

### Core Infrastructure

- [x] Initialize Turborepo + pnpm workspaces
- [x] Create packages/core-components structure
- [x] Refactor root to pure coordinator (Option B)
- [x] Move code to sites/colossus-reference
- [x] Fix import paths and build errors
- [x] Successful production build (26.88s, 77 pages)
- [x] Document architecture decision (MONOREPO_STATUS.md)
- [x] Create Week 1 completion report (WEEK_1_COMPLETE.md)

### Documentation

- [x] Update docs/README.md for platform
- [x] Update root README.md with monorepo structure
- [x] Update TODO.md with 8-week roadmap
- [x] Create WEEK_1_COMPLETE.md
- [x] Create MONOREPO_STATUS.md
- [x] Update WHITE_LABEL_PLATFORM_DESIGN.md

### Remaining Week 1 Tasks

- [x] Set up Vercel Pro team account (Completed Week 2)
- [x] Deploy colossus-reference to Vercel (Completed Week 2)
- [x] Measure multi-site build times with Turborepo caching (Completed Week 2)

---

## ✅ Week 2: Component Versioning & Second Test Site (COMPLETE - 2025-10-12)

### Documentation (Week 2)

- [x] Create VERCEL_DEPLOYMENT.md for deployment guide
- [x] Create VERSIONING_WORKFLOW.md for component versioning
- [x] Create WEEK_2_COMPLETE.md completion report
- [x] Update CLAUDE.md with Week 2 progress
- [x] Update docs/README.md with Week 2 sections
- [x] Update root README.md with Week 2 status
- [x] Create new DEVELOPMENT.md for monorepo workflow
  - [x] Turborepo build commands
  - [x] Site-specific development
  - [x] Testing procedures
  - [x] Deployment workflow
  - [x] Branch strategy (develop/staging/main)
  - [x] Pre-push hooks documentation
- [x] Create docs/troubleshooting/CORRUPTED_BUILD_CACHE.md

### Vercel Setup

- [x] Upgrade to Vercel Pro team (£20/month)
- [x] Connect local-business-platform GitHub repo
- [x] Deploy colossus-reference site (77 pages)
  - [x] Configure vercel.json with monorepo commands
  - [x] Set Root Directory to sites/colossus-reference
  - [x] Verify deployment works
  - [x] Test all pages load correctly
- [x] Deploy joes-plumbing-canterbury site (12 pages)
  - [x] Configure vercel.json
  - [x] Set Root Directory
  - [x] Verify deployment works

### Second Test Site

- [x] Create sites/joes-plumbing-canterbury/ directory
- [x] Set up site structure
  - [x] Copy app structure from reference
  - [x] Create site.config.ts with plumbing business details
  - [x] Create content/ with plumbing services (3 services)
  - [x] Create content/ with locations (3 locations)
  - [x] Copy necessary config files (vercel.json, tsconfig, tailwind, etc.)
  - [x] Create custom Navigation component
  - [x] Create lib utilities (content.ts, mdx.tsx)
- [x] Test imports from @platform/core-components
- [x] Build second site successfully (12 pages)
- [x] Deploy to Vercel
- [x] Customize with emerald green theme
- [x] Change font to Poppins

### Component Versioning

- [x] Add changesets package to monorepo (@changesets/cli)
- [x] Configure changesets for version management
- [x] Configure .changeset/config.json to ignore site packages
- [x] Add changeset scripts to root package.json
- [x] Document component versioning workflow (VERSIONING_WORKFLOW.md)
- [x] Create first changeset (add-hero-variants.md)
- [x] Test version bump workflow (1.0.0 → 1.1.0)
- [x] Verify CHANGELOG.md auto-generation

### Component Variant System

- [x] Design variant system architecture
- [x] Implement 3 hero variants:
  - [x] HeroV1 - Classic centered (traditional businesses)
  - [x] HeroV2 - Split layout (modern businesses)
  - [x] HeroV3 - Full-screen immersive (creative agencies)
- [x] Export all variants from core-components
- [x] Document variant usage in VERSIONING_WORKFLOW.md
- [x] Bump version to 1.1.0 with changesets
- [ ] Implement 3 service card variants (Deferred to Week 4+)
  - [ ] card-default (current)
  - [ ] card-elevated (shadow + hover effect)
  - [ ] card-compact (dense layout)
- [ ] Implement 3 contact form variants (Deferred to Week 4+)
  - [ ] form-default (current)
  - [ ] form-minimal (fewer fields)
  - [ ] form-detailed (more fields + preferences)
- [ ] Test variant switching in test sites (Deferred to Week 4+)

### Build Performance

- [x] Measure single site build time (26.88s for 77 pages)
- [x] Measure two-site build time (44.4s from scratch)
- [x] Measure Turborepo cache hit time (253ms - 176x faster!)
- [x] Document build performance metrics (WEEK_2_COMPLETE.md)
- [x] Validate target: <5min for 50 sites (Projected <3min ✅)

---

## 🖼️ Week 3: Image Storage (Cloudflare R2) - IN PROGRESS

### R2 Setup

- [x] Create Cloudflare account (via Vercel integration)
- [x] Set up R2 bucket (one for all sites)
- [x] Configure bucket policies and CORS
- [x] Generate API tokens (via Vercel Blob)
- [x] Document R2 configuration
- [ ] Set up custom domain for R2 (images.yourdomain.com) - Optional for later

### Image Processing Pipeline

- [x] Install Sharp and dependencies
- [x] Create image optimization script
  - [x] WebP conversion (85% quality)
  - [x] Quality optimization
  - [ ] AVIF conversion (optional) - Deferred
  - [ ] Responsive size generation (3-5 sizes) - Deferred
- [x] Create naming convention (location-slug_01.webp)
- [x] Create R2 upload utility (using Vercel Blob SDK)
- [x] Test image processing locally

### Image Intake Tool

- [x] Create ad-hoc upload scripts
  - [x] tools/upload-location-images.ts
  - [x] tools/convert-images.js (PNG to WebP)
- [x] Implement batch processing (13 location images)
- [x] Implement progress reporting
- [x] Add error handling and validation
- [x] Test with colossus-reference images
- [ ] Create unified tools/images-intake.ts CLI - Future enhancement
  - [ ] Site slug parameter
  - [ ] Source directory parameter
  - [ ] Interactive mode for metadata

### Migration

- [x] Migrate colossus-reference hero images to R2
  - [x] 13 location hero images uploaded
  - [x] Brighton, Eastbourne, Hastings, Lewes (previously uploaded)
  - [x] Bognor Regis, Burgess Hill, Chichester, Crowborough
  - [x] East Sussex, Kent, Kingston-upon-Thames, Margate
  - [x] Newhaven, Seaford, Surrey, West Sussex, Woking
- [x] Update image references in colossus-reference MDX files
- [x] Test all images load correctly (via smoke tests)
- [ ] Remove old images from Git repository - In progress
- [ ] Update .gitignore for images
- [ ] Document image workflow - Partially documented in DEVELOPMENT.md

### Quality Assurance & Testing

- [x] Set up E2E smoke tests with Playwright
  - [x] Test homepage loads
  - [x] Test service pages load
  - [x] Test location pages load
  - [x] Test contact page renders
  - [x] Test about page loads
- [x] Integrate smoke tests into pre-push hooks
- [x] Fix corrupted build cache issues
  - [x] Document troubleshooting steps
  - [x] Add automatic .next cleanup to pre-push hook
- [x] Set up branch-based deployment strategy
  - [x] develop → Development environment
  - [x] staging → Preview environment
  - [x] main → Production environment

---

## 🚀 Week 4: Deployment Pipeline (CRITICAL)

### Deployment Scripts

- [ ] Create tools/deploy-site.ts
  - [ ] Single site deployment
  - [ ] Vercel API integration
  - [ ] Environment variable management
  - [ ] Deployment status checking
- [ ] Create tools/deploy-batch.ts
  - [ ] Phased deployment (internal → canary → batch)
  - [ ] Progress tracking
  - [ ] Error handling
  - [ ] Rollback capability
- [ ] Create tools/rollback.ts
  - [ ] Single site rollback
  - [ ] Batch rollback
  - [ ] Previous deployment restoration

### Smoke Tests

- [x] Create smoke test suite
  - [x] Homepage loads (HTTP 200 + H1 check)
  - [x] Service pages load
  - [x] Location pages load
  - [x] Contact form renders
  - [x] About page loads
- [x] Integrate smoke tests into pre-push hooks
  - [x] Runs on develop and staging branches
  - [x] Automatic abort on smoke test failure
  - [x] Automatic .next cache cleanup before tests
- [ ] Integrate smoke tests into CI/CD pipeline
- [ ] Add smoke tests to Vercel deployment checks

### Monitoring Integration

- [ ] Set up Sentry account
- [ ] Configure Sentry for platform
- [ ] Add Sentry to core-components
- [ ] Set up error alerting
- [ ] Create monitoring dashboard
- [ ] Set up Slack/email notifications

### Deployment Testing

- [ ] Test single site deployment
- [ ] Test phased batch deployment (with 2 sites)
- [ ] Test rollback procedures
- [ ] Test canary deployment strategy
- [ ] Document deployment procedures

---

## 🤖 Week 5: AI Content Generation

### Claude API Setup

- [ ] Set up Anthropic API account
- [ ] Generate API keys
- [ ] Configure environment variables
- [ ] Set up rate limiting
- [ ] Implement cost tracking

### Service Page Generator

- [ ] Create tools/generate-services.ts
- [ ] Design service generation prompts
  - [ ] Service description
  - [ ] Benefits section
  - [ ] Process/how it works
  - [ ] FAQ generation
- [ ] Implement uniqueness checking
  - [ ] Compare against existing site content
  - [ ] Flag similar content
  - [ ] Regenerate if too similar
- [ ] Test with different industries
- [ ] Generate services for test sites

### Location Page Generator

- [ ] Create tools/generate-locations.ts
- [ ] Design location generation prompts
  - [ ] Location intro
  - [ ] Local area description
  - [ ] Service coverage details
  - [ ] Local expertise
- [ ] Implement geographic data integration
- [ ] Test with different locations
- [ ] Generate locations for test sites

### Content Quality Validators

- [ ] Create content quality checkers
  - [ ] Readability score
  - [ ] Keyword density
  - [ ] Word count validation
  - [ ] Grammar checking
  - [ ] Duplicate detection
- [ ] Implement content approval workflow
- [ ] Create content review interface

### Testing & Refinement

- [ ] Generate full site content (services + locations)
- [ ] Manual quality review
- [ ] Refine prompts based on output
- [ ] Test uniqueness checking across multiple sites
- [ ] Document content generation workflow

---

## 📝 Week 6: Blog & Projects

### Blog Content Type

- [ ] Design blog MDX schema
- [ ] Create blog listing page template
- [ ] Create blog post page template
- [ ] Add blog to site.config.ts
- [ ] Implement blog navigation
- [ ] Add RSS feed generation

### Blog AI Generator

- [ ] Create tools/generate-blog.ts
- [ ] Design blog post prompts
  - [ ] Industry tips
  - [ ] How-to guides
  - [ ] Case studies
  - [ ] Seasonal content
- [ ] Implement blog scheduling
- [ ] Test blog generation

### Project Portfolio Type

- [ ] Design project MDX schema
- [ ] Create projects listing page template
- [ ] Create project detail page template
- [ ] Add projects to site.config.ts
- [ ] Implement project gallery
- [ ] Add project filtering

### Projects AI Generator

- [ ] Create tools/generate-projects.ts
- [ ] Design project description prompts
- [ ] Generate sample projects
- [ ] Test project pages
- [ ] Document project workflow

### Testing

- [ ] Generate blog posts for test sites
- [ ] Generate projects for test sites
- [ ] Review content quality
- [ ] Test SEO impact
- [ ] Refine as needed

### Testimonials & Reviews Component

- [ ] Design testimonial component variants
  - [ ] testimonial-card (single testimonial)
  - [ ] testimonial-carousel (rotating testimonials)
  - [ ] testimonial-grid (multiple testimonials)
  - [ ] testimonial-featured (hero-style large testimonial)
- [ ] Create testimonial MDX schema
  - [ ] Customer name, role, company
  - [ ] Rating (1-5 stars)
  - [ ] Testimonial text
  - [ ] Photo (optional)
  - [ ] Date
  - [ ] Service/project related to
- [ ] Implement testimonial display components
- [ ] Add testimonials to site.config.ts

### Review Platform Integration

- [ ] Research Google Reviews API
  - [ ] Google My Business API setup
  - [ ] Authentication flow
  - [ ] Rate limits and quotas
- [ ] Research Trustpilot API
  - [ ] API access requirements
  - [ ] Data fetching methods
  - [ ] Terms of service review
- [ ] Research Trustpilot alternatives (Reviews.io, Feefo, etc.)
- [ ] Create review aggregation utility
  - [ ] Fetch reviews from platforms
  - [ ] Normalize review data structure
  - [ ] Cache reviews (avoid API rate limits)
  - [ ] Filter reviews by rating threshold
- [ ] Implement review display components
  - [ ] Review cards with platform badges
  - [ ] Star ratings display
  - [ ] Review schema markup (JSON-LD)
  - [ ] "Read more" expandable text
- [ ] Add review sections to pages
  - [ ] Homepage featured reviews
  - [ ] Service pages relevant reviews
  - [ ] Dedicated reviews page
- [ ] Test review integration
  - [ ] Verify data fetching
  - [ ] Test caching behavior
  - [ ] Check SEO schema markup
  - [ ] Validate responsive design

---

## 📊 Week 7: Registry & Monitoring

### Site Registry (Supabase)

- [ ] Set up Supabase account (free tier)
- [ ] Design site registry schema
  - [ ] Site metadata
  - [ ] Deployment history
  - [ ] Content generation logs
  - [ ] Performance metrics
- [ ] Create Supabase tables
- [ ] Implement API client
- [ ] Test CRUD operations

### Management CLI

- [ ] Create tools/manage-sites.ts
- [ ] Implement commands:
  - [ ] List all sites
  - [ ] Show site details
  - [ ] Update site config
  - [ ] Sync site to registry
  - [ ] Bulk operations
- [ ] Add interactive mode
- [ ] Test CLI commands

### Monitoring Dashboard

- [ ] Design dashboard UI (simple React app)
- [ ] Implement site overview
  - [ ] Deployment status
  - [ ] Build times
  - [ ] Error rates
  - [ ] Traffic metrics
- [ ] Implement site detail view
- [ ] Add performance charts
- [ ] Deploy dashboard

### Automated Alerts

- [ ] Set up alert rules
  - [ ] Build failures
  - [ ] Deployment failures
  - [ ] High error rates
  - [ ] Performance degradation
- [ ] Configure notification channels
  - [ ] Email
  - [ ] Slack (optional)
- [ ] Test alert system
- [ ] Document alert procedures

---

## 🎉 Week 8: Production Launch

### Industry Libraries

- [ ] Create plumbing service library (25 services)
- [ ] Create gardening service library (25 services)
- [ ] Create building service library (25 services)
- [ ] Create roofing service library (20 services)
- [ ] Test libraries with AI generation

### End-to-End Workflow

- [ ] Document complete site creation process
  1. Client intake form
  2. Site generation script
  3. Content generation
  4. Image upload
  5. Review & approval
  6. Deployment
  7. Domain configuration
  8. Client handoff
- [ ] Create workflow checklist
- [ ] Test complete workflow with dummy client
- [ ] Time each step
- [ ] Optimize bottlenecks

### First Real Client

- [ ] Identify first paying client
- [ ] Conduct client intake
- [ ] Generate site
- [ ] Review with client
- [ ] Deploy to production
- [ ] Configure custom domain
- [ ] Set up Google My Business
- [ ] Submit to search engines
- [ ] Client handoff & training

### Documentation Finalization

- [ ] Complete all technical documentation
- [ ] Create client-facing documentation
- [ ] Create sales materials
- [ ] Document pricing & packages
- [ ] Create support procedures
- [ ] Prepare marketing website

### Launch Preparation

- [ ] Set up payment processing
- [ ] Create client onboarding process
- [ ] Set up support email/system
- [ ] Prepare contract templates
- [ ] Create sales pipeline
- [ ] Plan marketing strategy

---

## 📋 Ongoing Tasks (Post-Launch)

### Platform Maintenance

- [ ] Weekly dependency updates
- [ ] Monthly security audits
- [ ] Quarterly performance reviews
- [ ] Regular backup verification

### Client Acquisition

- [ ] Reach target of 50 sites by end Year 1
- [ ] Track client acquisition costs
- [ ] Monitor churn rate
- [ ] Collect client testimonials

### Feature Development

- [ ] Gather client feature requests
- [ ] Prioritize feature roadmap
- [ ] Implement high-value features
- [ ] A/B test new features

### Financial Management

- [ ] Monthly revenue tracking
- [ ] Expense monitoring
- [ ] Profit margin analysis
- [ ] Cash flow forecasting

---

## 🎯 Business Milestones

### Revenue Targets

- [ ] First paid client (Week 8)
- [ ] 10 sites deployed (Month 3)
- [ ] 25 sites deployed (Month 6)
- [ ] 50 sites deployed (Month 12)
- [ ] £100K+ revenue Year 1

### Technical Milestones

- [ ] Sub-30s build times maintained
- [ ] 99.9% uptime achieved
- [ ] Zero critical security incidents
- [ ] Fully automated deployment pipeline

### Product Milestones

- [ ] 5 industry libraries created
- [ ] 10 component variants available
- [ ] Blog & projects features live
- [ ] Client self-service portal

---

## 💡 Ideas & Future Enhancements

### Potential Features (Backlog)

- [ ] Multi-language support
- [ ] E-commerce integration
- [ ] Booking/scheduling system
- [ ] Client portal
- [ ] Advanced analytics
- [ ] White-label mobile apps
- [ ] Video content generation
- [ ] Social media integration
- [ ] Email marketing integration
- [ ] CRM integration

### Scaling Ideas

- [ ] Franchise model for other regions
- [ ] Partner with marketing agencies
- [ ] Create reseller program
- [ ] Expand to other industries
- [ ] International expansion

---

## 📊 Current Progress

**Completed Weeks:** 2.5/8 (31%)
**Sites Deployed:** 2/50 (4%) - colossus-reference (77 pages), joes-plumbing-canterbury (12 pages)
**Revenue Generated:** £0 (pre-launch)
**Build Time:** 26.88 seconds (target: <30s) ✅

**Recent Achievements:**

- ✅ R2 image storage set up and working
- ✅ 17 hero images migrated to R2
- ✅ E2E smoke tests implemented with Playwright
- ✅ Pre-push quality gates with automatic cache cleanup
- ✅ Branch-based deployment strategy (develop/staging/main)
- ✅ Troubleshooting documentation for build issues

**On Track:** YES ✅
**Current Focus:** Week 3 - Image Storage completion
**Blockers:** None
**Next Milestones:**

1. Complete image migration to R2
2. Begin Week 4 deployment automation
3. Set up monitoring (Sentry)

---

**Project Status:** Week 3 In Progress (Image Storage + QA Infrastructure)
**Target Completion:** Week 8
**First Client Target:** Week 8
