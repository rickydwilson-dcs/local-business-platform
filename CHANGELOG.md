# Platform Changelog

Notable platform-level changes to the Local Business Platform. Site-specific changes are tracked in each site's own CHANGELOG.md. Package-level changes are tracked via changesets in each package directory.

> For the full project development history (2025-10 through 2026-01), see [docs/project-history.md](docs/project-history.md).

---

## 2026-02-07

### Architecture

- Deduplicated `content-schemas.ts` — canonical source now in `@platform/core-components`, sites re-export
- Moved location data (coordinates, region, isCounty) into MDX frontmatter — deleted hardcoded TS data files
- Migrated `brand-blue` to `brand-primary` theme tokens across all shared components
- Added `useFocusTrap` hook to `@platform/core-components` for mobile-menu and ConsentManager

### Platform

- Centralised Supabase rate limiter in `@platform/core-components` — replaces per-site stub implementations
- CSRF hardening: timing-safe comparison, single-use tokens
- Input validation: length limits on all API fields
- Accessibility: `lang="en-GB"`, skip navigation, SVG `aria-hidden`, proper page titles

### Infrastructure

- Security headers: `font-src` in CSP, HSTS, CORP, Permissions-Policy
- API info disclosure fixes — error responses no longer leak internals

### Documentation

- Rewrote all docs from reference lists to instructional teaching approach
- Added four "How It Works" architecture docs: dynamic routing, theme system, build pipeline, site creation
- Restructured CLAUDE.md as architectural briefing

---

## 2026-01-27

### Platform

- Site registry system with Supabase backend (7-table schema)
- Management CLI (`tools/manage-sites.ts`): list, show, sync, set-status commands
- Registry API client with Vercel and NewRelic integration

---

## 2026-01-25

### Platform

- Blog system: MDX-based with RSS feed, categories, Schema.org BlogPosting
- Projects portfolio: case studies with image galleries and client testimonials
- Testimonials and reviews system with aggregate ratings and Schema.org Review markup

### Packages

- `@platform/core-components`: extended content.ts with blog, projects, testimonials helpers
- Added 3 new Zod content schemas (BlogFrontmatter, ProjectFrontmatter, TestimonialFrontmatter)

---

## 2025-12-21

### Platform

- Theme system: `@platform/theme-system` package with CSS variable generation, Tailwind plugin, WCAG validation
- Base template (`sites/base-template`): gold-standard copy-and-customize template for new sites
- Migrated 32+ UI components from hardcoded colours to CSS variables

### Infrastructure

- Next.js 16.0.7 upgrade with Turbopack as default bundler
- Modern ESLint 9 flat config across all sites and packages

---

## 2025-12-07

### Tooling

- AI image generation pipeline: Gemini 3 Pro for card images, batch API, R2 CDN upload
- Service and location page generators (Claude + Gemini providers)
- Content quality validators: readability, SEO, uniqueness scoring

### Platform

- Dynamic location discovery — filesystem-based slug detection replaces hardcoded patterns

### Infrastructure

- Security audit remediation: HTML escaping, secure IP extraction, CSP hardening, HSTS
- React 19.1.2 (CVE-2025-55182 patch)

---

## 2025-10-10

### Infrastructure

- Tiered E2E testing: smoke-only on develop, full suite on staging/main
- Performance tracking with historical trend analysis and degradation alerts
- CI pipeline consolidation: 3 jobs to 1, saving 4-6 minutes per run
