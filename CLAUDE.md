# CLAUDE.md

Guidance for Claude Code when working with the Local Business Platform monorepo.

## CRITICAL: Git Workflow

**ALL changes MUST follow this branching workflow. NO EXCEPTIONS.**

```
develop → staging → main
```

1. **ALWAYS start on `develop`** when making changes
2. **NEVER push directly to `staging` or `main`**
3. **Flow:** develop → commit → push → merge to staging → push → merge to main → push
4. **Verify CI passes** after each push: `gh run watch`
5. **Use `/deploy.changes`** to execute the full workflow automatically

**If you break this rule:** Stop immediately, inform user, ask how to proceed.

See [docs/guides/git-workflow.md](docs/guides/git-workflow.md) for detailed workflow.

---

## How This Platform Works

This is a **white-label website platform** for local service businesses. The business model: take a single gold-standard template, customize it per client (colors, content, business info), and deploy each as an independent website.

**The monorepo** uses Turborepo + pnpm workspaces. Shared code lives in `packages/`, individual client websites live in `sites/`, and automation scripts live in `tools/`. When you run `pnpm build`, Turborepo builds packages first (they're dependencies), then builds all sites in parallel with caching.

**Content is MDX-only.** Every service page, location page, blog post, and project case study is an MDX file with YAML frontmatter. There are no centralized data files, no hardcoded page routes. Drop an MDX file in `content/services/` and the dynamic route `[slug]/page.tsx` picks it up automatically at build time via `generateStaticParams()`. This is the single most important architectural decision — it means content editors never touch code.

**The theme system** makes white-labeling work. Each site defines a `theme.config.ts` with brand colors, typography, and component tokens. The theme system's Tailwind plugin transforms this config into CSS custom properties (`:root { --color-brand-primary: #xxx }`) and extends Tailwind with utility classes that reference those variables (`bg-brand-primary` → `var(--color-brand-primary)`). Change the config, rebuild, and the entire site re-themes.

**New sites** are created by copying `sites/base-template` and customizing the config files. The intake system (`packages/intake-system`) can automate this by collecting business info through chat, extracting brand colors from logos/websites, and generating a project file that `tools/create-site-from-project.ts` consumes.

For deep dives into each system, see:

- [How Dynamic Routing Works](docs/architecture/HOW_DYNAMIC_ROUTING_WORKS.md)
- [How the Theme System Works](docs/architecture/HOW_THEME_SYSTEM_WORKS.md)
- [How the Build Pipeline Works](docs/architecture/HOW_BUILD_PIPELINE_WORKS.md)
- [How Site Creation Works](docs/architecture/HOW_SITE_CREATION_WORKS.md)

---

## Key Architecture Rules

### MDX-Only Content

All content is managed through MDX files. This is non-negotiable because it keeps content separate from code. **NEVER create:**

- Individual static page files (`app/services/specific-service/page.tsx`) — use dynamic `[slug]` routes instead
- Centralized TypeScript data files (`lib/locations.ts`) — frontmatter IS the data
- Content-specific loaders or data structures — `lib/content.ts` handles all content types generically

### Styling with Theme Tokens

The theme system exists so sites can be re-branded without touching component code. **Always use theme tokens:**

- `bg-brand-primary`, `text-surface-foreground`, `text-h1` — these resolve to CSS variables
- Never hardcode hex colors (`bg-[#005A9E]`) — they break white-labeling
- Reusable classes go in `app/globals.css` with `@apply`
- No inline styles, no CSS-in-JS — Tailwind only

### Components

- Shared components in `packages/core-components` — used across all sites
- Site-specific components in `sites/[name]/components/ui/`
- TypeScript interfaces for all props, named exports only (no default exports)

### Change Philosophy

- Do NOT remove existing features, templates, or content unless explicitly asked
- When in doubt, ASK before deleting
- Never over-engineer fixes for known upstream bugs — note the issue and move on
- Prefer minimal, targeted changes over sweeping refactors

---

## Essential Commands

```bash
# Root level — runs across all workspaces via Turborepo
pnpm build          # Build packages first, then all sites (cached)
pnpm lint           # ESLint across all workspaces
pnpm type-check     # TypeScript strict mode check
pnpm clean          # Remove build artifacts

# Site level — run from within a site directory
npm run dev         # Next.js dev server (localhost:3000)
npm run build       # Production build
npm test            # Unit tests (Vitest)
npm run test:e2e:smoke  # Fast E2E tests (Playwright)

# Content validation — checks MDX frontmatter against Zod schemas
npm run validate:content   # All MDX files
npm run validate:services  # Service files only
npm run validate:locations # Location files only

# Theme validation — WCAG contrast checking
pnpm validate --config ../../sites/[site-name]/theme.config.ts

# Site creation
npx tsx tools/create-site-from-project.ts --project [project-file.json]
```

---

## When Things Break

### TypeScript Errors During Push

```bash
npm run type-check  # See errors with file:line references
# Fix the errors
npm run type-check  # Verify fix before pushing
```

### Build Failures

```bash
npm run build       # See exact error
# Common causes: import/export mismatches, missing deps, MDX syntax errors
```

### Content Validation Failures

```bash
npm run validate:content  # Shows which MDX files fail and why
# Common: description length (50-200 chars), FAQ count (3-15), missing required fields
```

---

## Documentation

### Architecture (How It Works)

| Document                                                                      | Teaches                                    |
| ----------------------------------------------------------------------------- | ------------------------------------------ |
| [How Dynamic Routing Works](docs/architecture/HOW_DYNAMIC_ROUTING_WORKS.md)   | MDX file → static page via `[slug]` routes |
| [How the Theme System Works](docs/architecture/HOW_THEME_SYSTEM_WORKS.md)     | Config → CSS variables → Tailwind classes  |
| [How the Build Pipeline Works](docs/architecture/HOW_BUILD_PIPELINE_WORKS.md) | Turborepo, packages, workspace linking     |
| [How Site Creation Works](docs/architecture/HOW_SITE_CREATION_WORKS.md)       | Intake → project file → new site → deploy  |
| [Architecture Overview](docs/architecture/ARCHITECTURE.md)                    | High-level system overview                 |

### Standards (How to Do It Right)

| Standard                                   | Covers                                |
| ------------------------------------------ | ------------------------------------- |
| [Styling](docs/standards/styling.md)       | Tailwind CSS, theme tokens            |
| [Components](docs/standards/components.md) | Component architecture, TypeScript    |
| [Content](docs/standards/content.md)       | MDX architecture, frontmatter schemas |
| [SEO](docs/standards/seo.md)               | Meta data, keywords, local SEO        |
| [Images](docs/standards/images.md)         | R2 storage, optimization, naming      |
| [Schema](docs/standards/schema.md)         | JSON-LD structured data               |
| [Testing](docs/standards/testing.md)       | Unit tests, E2E tests                 |
| [Security](docs/standards/security.md)     | Rate limiting, API security, GDPR     |
| [Analytics](docs/standards/analytics.md)   | Consent management, GA4               |
| [Deployment](docs/standards/deployment.md) | CI/CD, monitoring, rollback           |
| [Quality](docs/standards/quality.md)       | Quality gates, checklists             |

### Guides (How to Do Common Tasks)

| Guide                                               | Purpose                  |
| --------------------------------------------------- | ------------------------ |
| [Adding a New Site](docs/guides/adding-new-site.md) | Create a new client site |
| [Theming](docs/guides/theming.md)                   | Configure site theme     |
| [Adding a Service](docs/guides/adding-service.md)   | Add service MDX content  |
| [Adding a Location](docs/guides/adding-location.md) | Add location MDX content |
| [Git Workflow](docs/guides/git-workflow.md)         | Branch workflow details  |
| [Deploying a Site](docs/guides/deploying-site.md)   | Deployment procedures    |

---

## Documentation Maintenance

Run `/update.docs` before deploying. This verifies documentation accuracy against the actual codebase — checking that architecture docs describe current patterns, links resolve to real files, and instructional content matches how the system actually works.

The `/deploy.changes` skill runs `/update.docs` automatically as its first step.

---

## Output Folder

The `/output/` folder stores session context and working notes for complex tasks. The `sessions/` subfolder is tracked in git.

Use sessions for: research tasks, feature implementation notes, bug investigations, architecture decisions.

**Naming:** `YYYY-MM-DD_topic-description`

See [output/README.md](output/README.md) for details.
