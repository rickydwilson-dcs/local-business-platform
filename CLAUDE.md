# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## MANDATORY: Read These Documentation Files First

**Before making ANY changes to this codebase, you MUST read these critical documentation files:**

1. **[ARCHITECTURE.md](ARCHITECTURE.md)** - Complete architectural guidelines, styling standards, content patterns, and critical violation prevention rules (1,456 lines)
2. **[DEVELOPMENT.md](DEVELOPMENT.md)** - Development workflow, git procedures, branch structure, pre-push hooks, and quality gates (451 lines)
3. **[AI_INSTRUCTIONS.md](AI_INSTRUCTIONS.md)** - General AI agent instructions and content accuracy standards
4. **[CONTENT_VALIDATION.md](CONTENT_VALIDATION.md)** - Content validation rules, Zod schemas, and troubleshooting
5. **[CHANGELOG.md](CHANGELOG.md)** - Project change history and architectural decisions

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
npm test                 # Run full test suite (68 tests with Vitest)
npm run test:watch       # Watch mode for development
npm run test:coverage    # Generate coverage report
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

### Test Coverage (68 passing tests)

- **Contact API Tests** (13 tests) - Form validation, email handling, rate limiting
- **Rate Limiter Tests** (17 tests) - Upstash Redis mocking, IP isolation, fail-open design
- **Content Schema Tests** (21 tests) - Zod validation for MDX frontmatter
- **Location Utils Tests** (17 tests) - Location detection and area served logic

### Testing Commands

```bash
npm test              # Run all 68 tests (~2 seconds)
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

### Configuration

- `lib/image-config.ts` - Centralized image quality settings
- `lib/site.ts` - Site-wide configuration and utilities

## Middleware

`middleware.ts` handles server-side analytics tracking:

- **Consent-aware** - Respects user consent cookies
- **Client ID generation** - Persistent tracking across sessions
- **Page view tracking** - Automatic tracking for all pages (excludes API routes)
- **Feature flag controlled** - Respects `FEATURE_SERVER_TRACKING`

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
