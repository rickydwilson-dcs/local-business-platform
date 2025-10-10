# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## MANDATORY: Read These Documentation Files First

**Before making ANY changes to this codebase, you MUST read these critical documentation files:**

1. **[ARCHITECTURE.md](../architecture/ARCHITECTURE.md)** - Complete architectural guidelines, styling standards, content patterns, and critical violation prevention rules (1,455 lines)
2. **[DEVELOPMENT.md](../development/DEVELOPMENT.md)** - Development workflow, git procedures, branch structure, pre-push hooks, and quality gates (683 lines)
3. **[AI_INSTRUCTIONS.md](AI_INSTRUCTIONS.md)** - General AI agent instructions and content accuracy standards
4. **[CONTENT_VALIDATION.md](../architecture/CONTENT_VALIDATION.md)** - Content validation rules, Zod schemas, and troubleshooting
5. **[CHANGELOG.md](../../CHANGELOG.md)** - Project change history and architectural decisions

**CRITICAL**: These files contain:

- Unified MDX-only architecture requirements (ARCHITECTURE.md)
- Architecture violation detection and prevention (ARCHITECTURE.md)
- Pre-push hooks that BLOCK pushes on errors (DEVELOPMENT.md)
- Content accuracy and truthful claims standards (ARCHITECTURE.md)
- Styling system rules and maintainable classes (ARCHITECTURE.md)
- Branch structure and direct push workflow (DEVELOPMENT.md)

**Failure to read these files will result in architectural violations, blocked pushes, and inconsistent implementations.**

---

## Project Overview

Modern Next.js 15 website for Colossus Scaffolding - professional scaffolding services across South East England. Built with React 19, TypeScript, Tailwind CSS, and MDX for content management. Deployed on Vercel with automated CI/CD pipeline.

## Essential Development Commands

### Development & Build

```bash
npm run dev              # Start development server (localhost:3000)
npm run build            # Production build (required before push)
npm run type-check       # TypeScript validation (required before push)
```

### Quality Checks

```bash
npm run lint             # ESLint validation
npm run lint:fix         # Auto-fix linting issues
npm run pre-commit-check # Full quality check (lint + type-check + validate + build)
```

### Testing

```bash
# Unit Tests (Vitest)
npm test                 # Run full test suite (141 passing tests)
npm run test:watch       # Watch mode for development
npm run test:coverage    # Generate coverage report

# E2E Tests (Playwright) - TIERED STRATEGY
npm run test:e2e:smoke   # FAST smoke tests (7 tests, ~30s) - USE THIS MOST
npm run test:e2e         # Standard functional tests (51 tests, 2-3min)
npm run test:e2e:full    # Comprehensive tests (10min+)

# Specific E2E Test Suites
npm run test:e2e:ui      # Interactive UI mode
npm run test:e2e:performance   # Performance tests with Core Web Vitals
npm run test:e2e:accessibility # WCAG 2.1 AA accessibility tests
npm run test:e2e:visual        # Visual regression tests

# Performance Tracking
npm run performance:report # View historical performance data & trends
```

### Content Validation

```bash
npm run validate:content # Validate all 62 MDX files (services + locations)
npm run validate:services # Validate 25 service MDX files
npm run validate:locations # Validate 37 location MDX files
```

## Architecture Patterns

### Unified MDX-Only Content System (CRITICAL)

**Single Source of Truth**: All content (services AND locations) managed exclusively through MDX files with comprehensive frontmatter. No centralized TypeScript data structures.

**Content Files**: 62 total MDX files

- 25 service files in `content/services/`
- 37 location files in `content/locations/`

**Dynamic Routing**:

- `app/services/[slug]/page.tsx` - Reads MDX files, renders all services dynamically
- `app/locations/[slug]/page.tsx` - Reads MDX files, renders all locations dynamically

**Route Generation**: `generateStaticParams()` reads MDX files to build routes at build time

**NEVER Create**:

- Individual static page files (e.g., `app/services/specific-service/page.tsx`)
- Centralized TypeScript data files (e.g., `lib/locations.ts` - already deleted)
- Content-specific loaders or data structures
- Dual architecture with fallback data

### Content Reading Pattern

```typescript
// Reading service/location content from MDX
import fs from "fs/promises";
import path from "path";
import matter from "gray-matter";

const filePath = path.join(process.cwd(), "content", "services", `${slug}.mdx`);
const fileContent = await fs.readFile(filePath, "utf-8");
const { data } = matter(fileContent); // data = frontmatter object
```

### MDX Frontmatter Structure

All services and locations use comprehensive frontmatter with structured data:

```yaml
---
title: "Service/Location Title"
seoTitle: "SEO-optimized Title"
description: "50-200 character description"
keywords: ["keyword1", "keyword2"]
heroImage: "/path-to-image.png"
hero:
  title: "Hero Title"
  description: "Hero description"
  phone: "01424 466 661"
  trustBadges: ["TG20:21 Compliant", "CHAS Accredited"]
benefits:
  - "Benefit 1"
  - "Benefit 2"
faqs:
  - question: "Question?"
    answer: "Answer..."
about:
  whatIs: "Detailed description"
  whenNeeded: ["Use case 1", "Use case 2"]
  whatAchieve: ["Outcome 1", "Outcome 2"]
  keyPoints: ["Point 1", "Point 2"]
---
```

## Critical Code Architecture Rules

### Styling System

- **Tailwind CSS ONLY** - No inline styles, no CSS-in-JS, no styled-components
- **Maintainable Classes** - Repeated patterns extracted to `app/globals.css` with `@apply`
- **Component Classes**: `.btn-primary`, `.card-interactive`, `.section-standard`, etc.

### Component Organization

- **All reusable components** in `components/ui/`
- **TypeScript interfaces required** for all props
- **Named exports only** (no default exports for UI components)

### Content Management

- **MDX files ONLY** - All content in `content/services/` and `content/locations/`
- **NO hardcoded content** in components
- **NO centralized data files** (lib/locations.ts deleted - NEVER recreate)

### SEO & Schema

- Every page requires proper `Metadata` export with title, description, keywords, openGraph
- Schema markup required: Service schema, LocalBusiness schema (locations), FAQPage schema
- Heading hierarchy must be semantic (H1 → H2 → H3, no skipping)

## Git Workflow & Branch Structure

### Branches (NEVER Create New Branches)

- `develop` - Development environment
- `staging` - Preview environment
- `main` - Production environment

### Direct Push Workflow (After Approval)

```bash
# Development
git push origin develop

# ⚠️ CRITICAL: Verify GitHub Actions CI passes
gh run watch
# OR: gh run list --branch develop --limit 1

# Development → Staging (after CI passes ✅)
git checkout staging
git merge develop
git push origin staging

# ⚠️ CRITICAL: Verify GitHub Actions CI passes
gh run watch

# Staging → Production (after CI passes ✅)
git checkout main
git merge staging
git push origin main

# ⚠️ CRITICAL: Verify GitHub Actions CI passes
gh run watch
```

### Pre-Push Hooks (BLOCKS PUSH IF FAILED)

**CRITICAL**: TypeScript and build errors will block ALL pushes

```bash
# Hooks automatically run before every push:
npm run type-check  # TypeScript validation
npm run build       # Production build test
```

**Always run before committing**:

```bash
npm run pre-commit-check  # Prevents push failures
```

### Monitoring GitHub Actions CI (MANDATORY)

**⚠️ RULE: Always verify CI passes after every push**

```bash
# Check CI status
gh run list --branch develop --limit 1
gh run watch              # Watch in real-time
gh run view --web         # Open in browser
```

**Why CI verification is mandatory:**

- Pre-push hooks run **locally** (can miss environment-specific issues)
- CI runs in **isolated Node 20/Ubuntu container**
- CI uses `npm ci` (clean install) vs `npm install` locally
- Common CI-only failures: ESM/CommonJS compatibility, env differences, dependency versions

**If CI fails:**

1. Stop immediately - do not proceed to staging/production
2. Check error logs: `gh run view` or visit Actions tab
3. Reproduce locally: `npm ci && npm run lint && npm run type-check && npm test && npm run build`
4. Fix the issue and push again
5. Wait for CI to pass ✅ before proceeding

## Testing Infrastructure

### Unit Test Coverage (141 passing tests)

- **Contact API Tests** - Form validation, email handling, rate limiting
- **Rate Limiter Tests** - Upstash Redis mocking, IP isolation, fail-open design
- **Content Schema Tests** - Zod validation for MDX frontmatter
- **Location Utils Tests** - Location detection and area served logic
- **Schema Tests** - JSON-LD schema generation
- **Analytics Tests** - dataLayer implementation and tracking

### E2E Test Strategy (Branch-Specific)

| Branch    | Tests Run             | Duration | Purpose                          |
| --------- | --------------------- | -------- | -------------------------------- |
| `develop` | Smoke only (7 tests)  | ~30s     | Fast feedback for development    |
| `staging` | Smoke + Standard (58) | ~3-4min  | Functional validation pre-prod   |
| `main`    | Smoke + Standard (58) | ~3-4min  | Production deployment validation |

### Testing Commands

```bash
npm test              # Run all 141 unit tests (~2 seconds)
npm run test:watch    # Watch mode for development
npm run test:ui       # Interactive test UI
```

## Security & Performance

### Rate Limiting (Upstash Redis)

- Contact form protected: 5 requests per 5 minutes per IP
- Distributed rate limiting (serverless-compatible)
- Fail-open design: allows requests if Redis unavailable
- Environment variables: `KV_REST_API_URL`, `KV_REST_API_TOKEN`

### Image Optimization

- **Next.js Image component required** for all images
- **Quality settings** from `lib/image-config.ts`:
  - Hero images: `quality={80}`
  - Content images: `quality={65}` (default)
  - Thumbnails: `quality={50}`
- **Automatic format conversion**: WebP/AVIF when supported
- **Always set width/height** to prevent layout shift

### Modern Browser Targeting

- **ES2022 target** eliminates 11.4 KiB of polyfills
- **Browserslist**: Last 2 versions of Chrome, Firefox, Safari, Edge (95%+ compatibility)
- **No IE11 support**

## Content Validation System

### Automated Validation (Zod)

All 62 MDX files validated on commit via Husky pre-commit hook:

- **Description length**: 50-200 characters
- **FAQ requirements**: 3-15 FAQs per service
- **YAML syntax**: Proper formatting and structure
- **Required fields**: All mandatory frontmatter present

### Validation Schemas

- `lib/content-schemas.ts` - Zod schemas for services and locations
- `scripts/validate-content.ts` - CLI validation tool

## Analytics & Consent Management

### GDPR-Compliant System

- **ConsentManager component** - Banner with consent categories
- **Feature flags** control all analytics functionality:
  - `FEATURE_CONSENT_BANNER` - Shows/hides banner
  - `FEATURE_ANALYTICS_ENABLED` - Master switch
  - `FEATURE_GA4_ENABLED` - Google Analytics 4
- **Smart page detection** - Banner hidden on `/privacy-policy` and `/cookie-policy`

### GA4 Integration

- **Manual page view tracking** after consent (fixes single-page visit tracking)
- **Server-side tracking** via middleware (consent-aware)
- **Event tracking** available via `useAnalytics()` hook

### Environment Variables

```bash
# Analytics (Public)
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX

# Feature Flags (Server)
FEATURE_CONSENT_BANNER=true
FEATURE_ANALYTICS_ENABLED=true
FEATURE_GA4_ENABLED=true

# Rate Limiting (Server)
KV_REST_API_URL=https://your-database.upstash.io
KV_REST_API_TOKEN=your-token-here

# Email (Server)
RESEND_API_KEY=re_your_api_key_here
BUSINESS_EMAIL=your-business@email.com
NEXT_PUBLIC_SITE_URL=https://yourdomain.com
```

## Common Development Issues

### TypeScript Errors During Push

**Problem**: `git push` fails with TypeScript errors

**Solution**:

```bash
npm run type-check  # Identify errors
# Fix reported errors (missing types, function ordering, hook dependencies)
npm run type-check  # Verify fix
git push            # Now succeeds
```

### Production Build Failures

**Problem**: Pre-push hook blocks with build errors

**Solution**:

```bash
npm run build       # See exact error
# Common issues: import/export errors, missing dependencies, MDX syntax
npm run build       # Verify fix
```

### Content Validation Failures

**Problem**: Commit blocked due to invalid MDX

**Solution**:

```bash
npm run validate:content  # See validation errors
# Fix: description length, FAQ count, YAML syntax, required fields
npm run validate:content  # Verify fix
```

## Key Library Files

### Content Management

- `lib/content.ts` - MDX reading utilities, content item retrieval
- `lib/content-schemas.ts` - Zod validation schemas for MDX frontmatter

### Location & Service Utilities

- `lib/location-utils.ts` - Location detection, area served logic
- `lib/services.ts` - Service categories and metadata
- `lib/services-data.ts` - Service card data for listings

### Rate Limiting & Analytics

- `lib/rate-limiter.ts` - Upstash Redis rate limiting implementation
- `lib/analytics/types.ts` - TypeScript types for analytics system
- `lib/analytics/dataLayer.ts` - GTM dataLayer implementation
- `lib/performance-tracker.ts` - Performance test result tracking and trend analysis

### API Routes

- `app/api/contact/route.ts` - Contact form submission with rate limiting and email
- `app/api/analytics/track/route.ts` - Analytics event tracking endpoint
- `app/api/analytics/debug/route.ts` - Analytics debugging endpoint

### Configuration

- `lib/image-config.ts` - Centralized image quality settings
- `lib/site.ts` - Site-wide configuration and utilities
- `lib/schema.ts` - JSON-LD schema generation utilities

## Middleware

`middleware.ts` handles server-side analytics tracking:

- **Consent-aware** - Respects user consent cookies
- **Client ID generation** - Persistent tracking across sessions
- **Page view tracking** - Automatic tracking for all pages (excludes API routes)
- **Feature flag controlled** - Respects `FEATURE_SERVER_TRACKING`

## Documentation Maintenance (MANDATORY)

**⚠️ CRITICAL RULE: Always update documentation after making changes**

Documentation is a first-class citizen in this codebase. Keeping documentation up-to-date is **NOT optional** - it is a mandatory part of every change.

### Documentation Files That Must Be Updated

After making changes, you **MUST** review and update these files as needed:

#### 1. **ARCHITECTURE.md** (1,455 lines)

Update when you:

- Add new architectural patterns or components
- Create new styling classes or patterns
- Change content structure or MDX frontmatter
- Modify routing or page generation logic
- Add new libraries or dependencies with architectural impact
- Change SEO patterns or schema markup
- Update image optimization or performance patterns

#### 2. **DEVELOPMENT.md** (683 lines)

Update when you:

- Change git workflow or branch structure
- Modify pre-commit/pre-push hooks
- Add new scripts to package.json
- Change deployment procedures
- Update CI/CD pipeline or GitHub Actions
- Modify quality gates or testing requirements
- Add new development tools or commands

#### 3. **CHANGELOG.md**

Update **ALWAYS** when:

- Making ANY change to the codebase
- Adding new features or functionality
- Fixing bugs or issues
- Updating dependencies
- Changing configuration or infrastructure
- Format: Date, description, impact, files changed

#### 4. **CLAUDE.md** (this file)

Update when you:

- Add new npm scripts or commands
- Change project structure or file organization
- Add new testing infrastructure
- Update environment variables
- Change development workflow
- Add new libraries or tools
- Modify architecture patterns

#### 5. **Testing Documentation**

- **E2E_TESTING.md** - Update when adding/changing E2E tests
- **PERFORMANCE_TESTING.md** - Update when changing performance tests or thresholds
- **PERFORMANCE_TRACKING.md** - Update when modifying tracking features

#### 6. **GITHUB_SETUP.md**

Update when you:

- Change GitHub Actions workflows
- Add new secrets or environment variables
- Modify CI/CD pipeline
- Change deployment process
- Update branch protection rules

#### 7. **CONTENT_VALIDATION.md**

Update when you:

- Change Zod schemas for content validation
- Add new validation rules
- Modify MDX frontmatter structure
- Change content requirements

#### 8. **AI_INSTRUCTIONS.md**

Update when you:

- Add new AI agent guidelines
- Change content creation standards
- Modify writing style requirements

### Documentation Update Workflow

**After completing ANY implementation:**

1. **Review Impact** - Identify which documentation files are affected
2. **Update Content** - Add/modify relevant sections with your changes
3. **Update Examples** - If code examples exist, update them to match new implementation
4. **Update Commands** - If new scripts or commands added, document them
5. **Update Counts** - Update test counts, file counts, line counts if they changed
6. **Verify Accuracy** - Ensure documentation accurately reflects current state
7. **Check Cross-References** - Update links and references to other docs

### Documentation Standards

- ✅ **Be Specific** - Include exact file paths, line numbers when relevant
- ✅ **Show Examples** - Provide code examples for new patterns
- ✅ **Explain Why** - Document reasoning behind architectural decisions
- ✅ **Keep Current** - Never leave outdated information
- ✅ **Be Complete** - Cover all aspects of the change
- ✅ **Use Formatting** - Markdown formatting for readability

### Example Documentation Update

```markdown
# After adding performance tracking feature:

Files to update:
✅ CLAUDE.md - Added performance:report command to Testing section
✅ PERFORMANCE_TESTING.md - Added tracking features section
✅ PERFORMANCE_TRACKING.md - Created new comprehensive guide
✅ CHANGELOG.md - Added entry with date, description, files changed
✅ DEVELOPMENT.md - Added performance tracking to testing workflow
```

### Documentation as Code Review

Treat documentation updates as part of your implementation:

- Documentation updates are **required before considering a task complete**
- Missing documentation updates = incomplete implementation
- Documentation quality is as important as code quality

---

## Before Implementation Checklist

**CRITICAL**: Before implementing ANY feature:

1. ✅ **Read mandatory documentation** - ARCHITECTURE.md and DEVELOPMENT.md (see top of this file)
2. ✅ Read relevant existing code (services/locations routing files)
3. ✅ Confirm MDX-only architecture pattern (detailed in ARCHITECTURE.md)
4. ✅ Verify no architectural violations in planned approach (see ARCHITECTURE.md violation detection section)
5. ✅ Check if similar patterns exist in globals.css (styling)
6. ✅ Run `npm run pre-commit-check` before committing
7. ✅ Ensure TypeScript compilation passes (`npm run type-check`)
8. ✅ Verify production build succeeds (`npm run build`)

**AFTER completing implementation:**

9. ✅ **Update all relevant documentation files** (see Documentation Maintenance section above)
10. ✅ Update CHANGELOG.md with change details
11. ✅ Verify all documentation is accurate and current

## Quality Gates

### Development

- Pre-commit hooks pass (ESLint + Prettier)
- Pre-push hooks pass (TypeScript + Build) - **BLOCKS PUSH IF FAILED**
- Content validation passes (MDX frontmatter)

### Staging

- All GitHub Actions passing (ESLint + TypeScript + Tests + Build + Content Validation)
- Production build successful
- Full application testing on staging URL

### Production

- Staging verification complete
- All tests passing
- Explicit approval obtained
- Branch up to date with latest changes

---

**Remember**: This codebase uses a unified MDX-only architecture. NEVER create centralized TypeScript data files or individual static page files. All content managed through MDX with comprehensive frontmatter.
