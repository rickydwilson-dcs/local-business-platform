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

## Debugging Approach

- When diagnosing UI or runtime bugs, check whether a dev server is running (`lsof -i :3000`); if not, start one before speculating about causes
- Fetch the running dev server (`WebFetch http://localhost:3000` or `:3001`) and take a screenshot to capture the visual state and any console output — do not ask the user for a screenshot if you can retrieve it yourself
- Do not guess at hydration errors, RSC serialisation, or z-index issues without evidence
- Check CSP headers early when scripts fail silently (`unsafe-eval`, `unsafe-inline` policies block many third-party scripts)
- When evidence is still needed after fetching, ask for a specific console screenshot or error message — not a general "can you share what you see"

See [docs/guides/debugging.md](docs/guides/debugging.md) for common issue patterns.

---

## How This Platform Works

This is a **white-label website platform** for local service businesses. The business model: take a single gold-standard template, customize it per client (colors, content, business info), and deploy each as an independent website.

**The monorepo** uses Turborepo + pnpm workspaces. Shared code lives in `packages/`, individual client websites live in `sites/`, and automation scripts live in `tools/`. When you run `pnpm build`, Turborepo builds packages first (they're dependencies), then builds all sites in parallel with caching.

**Shared utilities use factory patterns.** `packages/core-components` exports factory functions (`createContentUtils`, `createSchemaGenerators`, `createMdxLoader`, `createSiteUtils`, `createContactInfo`, `createContactHandler`) that accept site-specific configuration and return configured utilities. Each site's `lib/` directory contains thin shims (5-10 lines) that call these factories with site config and re-export the results, preserving the `@/lib/*` import paths used throughout the site's pages. This means bug fixes and improvements to shared logic flow to all sites automatically on next build.

**Content is MDX-only.** Every service page, location page, blog post, and project case study is an MDX file with YAML frontmatter. There are no centralized data files, no hardcoded page routes. Drop an MDX file in `content/services/` and the dynamic route `[slug]/page.tsx` picks it up automatically at build time via `generateStaticParams()`. This is the single most important architectural decision — it means content editors never touch code.

**The theme system** makes white-labeling work. Each site defines a `theme.config.ts` with brand colors, typography, and component tokens. The theme system's Tailwind plugin transforms this config into CSS custom properties (`:root { --color-brand-primary: #xxx }`) and extends Tailwind with utility classes that reference those variables (`bg-brand-primary` → `var(--color-brand-primary)`). Pre-built named themes in `packages/themes/` (cygnus, designlab, navagarden, orion, solaris, vega) provide component registries, CSS utilities, and — for orion, vega, cygnus, and solaris — theme-owned `Header` and `Footer` Server Components exported via `@platform/themes/[name]/components`. Sites import these into `app/layout.tsx` instead of the generic `SiteHeader`/`Footer` from core-components. Themes also export **page layout components** from `packages/themes/[name]/pages/` — each site's `page.tsx` files are thin wrappers that import the theme template, fetch content, and pass it as props; schema JSON-LD and `generateMetadata`/`generateStaticParams` stay in the wrapper. Change the config, rebuild, and the entire site re-themes.

**Self-contained sites.** As of April 2026, `base-template`, `dcs`, and `mad-graphics` have migrated to a self-contained architecture: each site owns its own `Header`, `Footer`, page layout components, and theme CSS, with no imports from `@platform/themes/*`. The shared named-theme packages described above are currently used only by `dj-fox-electrical` (orion) and `colossus-scaffolding` (vega). See `MEMORY.md` → "Site self-containment migration" for the recipe and rationale.

**New sites** are created by copying `sites/base-template` and customizing the config files. The intake system (`packages/intake-system`) can automate this by collecting business info through chat, extracting brand colors from logos/websites, and generating a project file that `tools/create-site-from-project.ts` consumes.

For deep dives into each system, see:

- [How Dynamic Routing Works](docs/architecture/how-dynamic-routing-works.md)
- [How the Theme System Works](docs/architecture/how-theme-system-works.md)
- [How the Build Pipeline Works](docs/architecture/how-build-pipeline-works.md)
- [How Site Creation Works](docs/architecture/how-site-creation-works.md)

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
- Every theme must satisfy the Theme Component Contract — see `docs/standards/theme-component-contract.md`. (The CI validation script was retired in April 2026 alongside the self-containment pivot; the contract remains the architectural rule.)
- Reusable classes go in `app/globals.css` with `@apply`
- No inline styles, no CSS-in-JS — Tailwind only

### Components

- Shared components in `packages/core-components` — used across all sites
- Site-specific components in `sites/[name]/components/ui/`
- TypeScript interfaces for all props, named exports only (no default exports)

### Theme Package File Conventions

- Theme `components/` files use **lowercase filenames** (`header.tsx`, `footer.tsx`) and **named exports** in the barrel (`export { LyraHeader } from './header'`). Never use PascalCase filenames or `export *` — jiti (Tailwind's config loader) can't resolve them.
- Theme `index.ts` must **NOT** re-export from `./components` or `./pages` — this forces jiti to load every file at Tailwind config evaluation time. Sites import components via the subpath (`@platform/themes/orion/components`), not the theme barrel.
- Theme `pages/` files use PascalCase (`HomePage.tsx`) — this is safe because pages are imported by Next.js bundler, not jiti.

### Change Philosophy

- Do NOT remove existing features, templates, or content unless explicitly asked
- When in doubt, ASK before deleting
- Never over-engineer fixes for known upstream bugs — note the issue and move on
- Prefer minimal, targeted changes over sweeping refactors

### Vercel Monorepo Configuration

- Root `vercel.json` produces a trivial static build. Each site deploys as its own Vercel project with `rootDirectory` set to `sites/<name>`.
- Site `vercel.json` must NOT set `outputDirectory` — Vercel resolves `.next` relative to `rootDirectory` automatically. Setting it causes double-pathing.
- Do NOT use `turbo-ignore` or `ignoreCommand` — Vercel native monorepo detection handles build skipping.

### CSS Syntax

- Never use Tailwind's `theme()` function in plain CSS files — it causes CSS parser panics. Use CSS custom properties: `var(--color-brand-primary)` not `theme('colors.brand.primary')`.

### Tailwind Content Globs

- Never use `packages/themes/**/*.{ext}` — the `**` descends into `node_modules/` causing 18+ minute builds. Use scoped globs: `packages/themes/*/*.{ext}` and `packages/themes/*/components/**/*.{ext}`.

### Build & CI

- Production builds use `next build --webpack`. Turbopack has PostCSS bugs in CI. Turbopack is still used for `next dev`.
- Every env var affecting build output must be in `turbo.json` `env` array — missing vars cause stale cache hits.
- E2E tests in CI use `next start` (pre-built), not `next dev`. New Relic is disabled in CI.
- Pre-push hook runs only `type-check` (~3s). Full build runs in CI.

---

## Essential Commands

```bash
# Session verification — MANDATORY at the end of every coding session
pnpm type-check                        # TypeScript strict check across monorepo
pnpm build                             # Production build (all sites)
pnpm --filter <site> run lint          # Lint for each site modified (e.g. pnpm --filter dj-fox-electrical run lint)

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
npm run validate:content                          # All MDX files
npx tsx ../../scripts/validate-content.ts services   # Service files only
npx tsx ../../scripts/validate-content.ts locations  # Location files only

# Theme validation — WCAG contrast checking (run from packages/theme-system/)
pnpm --filter @platform/theme-system validate --config ../../sites/[site-name]/theme.config.ts

# Site creation
npx tsx tools/create-site-from-project.ts --project [project-file.json]
```

---

## Dev Server Management

- Before starting a dev server, run `lsof -i :3000` (or the target port) to check for existing processes
- If the port is occupied, identify which site/project owns it — do NOT kill the process without confirmation
- If Turbopack causes PostCSS or worker errors in dev, retry with `--webpack` flag: `npm run dev -- --webpack`
- Confirm the server is reachable with `curl -s http://localhost:3000` before reporting it as running

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

### Vercel Deployment Failures

- **"No Output Directory found"** — Check that site `vercel.json` does NOT set `outputDirectory`. Vercel resolves paths relative to `rootDirectory`, so setting it causes double-pathing.
- **CSS parser panic or PostCSS timeout** — Verify the site uses `next build --webpack` (not Turbopack) in its `package.json` build script.
- **Stale builds after adding env var** — Add the variable name to `turbo.json` `tasks.build.env` array. Without this, Turborepo serves a cached build with the old value.
- **18+ minute Tailwind builds** — Check `tailwind.config.ts` content globs for `**` patterns that descend into `node_modules/`. Use scoped globs instead.
- **CI scan gate fails with missing token** — `SNYK_TOKEN` must be set in the Vercel project environment variables before security scan gates will pass.

---

## Parallel sessions & git worktrees

The default workflow is: feature branch off `develop`, one Claude session at a time, merge back when done. Worktrees are not needed for normal work — the March 2026 remediation of 49 findings across 37 files and 3 sites completed with zero conflicts using feature branches alone.

Worktrees are the right choice only in a narrow set of circumstances. Use the decision rule below.

### Decision rule — use a worktree when ALL of these are true

1. You intend to run **2+ concurrent Claude sessions** against the same repo.
2. The work crosses **different branches** or would cause branch-switch races.
3. The sessions will run **>15 minutes each** (otherwise the setup cost dominates).
4. The work is **independent** (no shared files or build artifacts).

If any of the four conditions is false, use a normal feature branch instead.

### Specific scenarios

| Scenario                                                    | Use worktree?                    | Why                                                                                                     |
| ----------------------------------------------------------- | -------------------------------- | ------------------------------------------------------------------------------------------------------- |
| Parallel YOLO sessions on the same repo                     | **Yes**                          | The killer use case. Each session gets its own worktree + feature branch and merges back when verified. |
| Large architecture refactor needing safety isolation        | No                               | Feature branch + `git stash` is sufficient. Worktrees add friction without safety.                      |
| Pipeline runs spinning up ephemeral test sites              | No                               | Test sites already live in isolated `sites/test-*` directories. Double isolation for no gain.           |
| Concurrent `/pipeline.ingest` + `/review.code` on same repo | Marginal — only if both run long | Usually not worth it.                                                                                   |

### Mechanics

To create a worktree for a parallel session:

```bash
# From the main working copy
git worktree add .claude/worktrees/my-session feature/my-session-branch

# Then cd into it and work as usual
cd .claude/worktrees/my-session
# ... run YOLO, commit, verify ...
```

When the session is done and the branch has been merged back:

```bash
# From any worktree of the repo
git worktree remove .claude/worktrees/my-session
git branch -d feature/my-session-branch
```

`.claude/worktrees/` is gitignored — see the root `.gitignore`.

### What NOT to do

- **Do not use worktrees for single-session work.** It adds friction with no benefit.
- **Do not create nested worktrees.** One level of worktree off the main working copy is the supported topology.
- **Do not use worktrees to work around branch-protection rules.** They are not a shortcut around CI.
- **Do not leave stale worktrees.** `git worktree prune` regularly or remove them when done.

### Cross-repo note

This rule applies to local-business-platform only. The force repo (`/Users/rickywilson/Sites/force/`) has `GOVERNANCE §8` which explicitly forbids parallel job execution. Do not propagate worktree adoption to force until `§8` is lifted — see `force/CLAUDE.md` for the authoritative rule there.

---

## Documentation

### Architecture (How It Works)

| Document                                                                                      | Teaches                                                              |
| --------------------------------------------------------------------------------------------- | -------------------------------------------------------------------- |
| [How Dynamic Routing Works](docs/architecture/how-dynamic-routing-works.md)                   | MDX file → static page via `[slug]` routes                           |
| [How the Theme System Works](docs/architecture/how-theme-system-works.md)                     | Config → CSS variables → Tailwind classes                            |
| [How the Build Pipeline Works](docs/architecture/how-build-pipeline-works.md)                 | Turborepo, packages, workspace linking                               |
| [How Site Creation Works](docs/architecture/how-site-creation-works.md)                       | Intake → project file → new site → deploy                            |
| [How the Ingestion Pipeline Works](docs/architecture/how-ingestion-pipeline-works.md)         | Screenshot → analysis → components → theme package                   |
| [How the Stitch Design Pipeline Works](docs/architecture/how-stitch-design-pipeline-works.md) | Stitch AI design → tokens → theme package → test site                |
| [Clone Package Format](docs/pipeline/CLONE_PACKAGE_FORMAT.md)                                 | CPF spec: the intermediate format between clone and theme extraction |
| [Architecture Overview](docs/architecture/architecture.md)                                    | High-level system overview                                           |
| [Content Validation](docs/architecture/content-validation.md)                                 | Zod schemas for MDX frontmatter validation                           |
| [Monitoring Dashboard](docs/architecture/monitoring-dashboard.md)                             | Dashboard design for site registry and monitoring                    |
| [Component Composition System](docs/architecture/component-composition-system.md)             | Config-driven page composition engine and two-pass AI pipeline       |

### Standards (How to Do It Right)

| Standard                                         | Covers                                |
| ------------------------------------------------ | ------------------------------------- |
| [Styling](docs/standards/styling.md)             | Tailwind CSS, theme tokens            |
| [Components](docs/standards/components.md)       | Component architecture, TypeScript    |
| [Content](docs/standards/content.md)             | MDX architecture, frontmatter schemas |
| [SEO](docs/standards/seo.md)                     | Meta data, keywords, local SEO        |
| [Images](docs/standards/images.md)               | R2 storage, optimization, naming      |
| [Schema](docs/standards/schema.md)               | JSON-LD structured data               |
| [Testing](docs/standards/testing.md)             | Unit tests, E2E tests                 |
| [Security](docs/standards/security.md)           | Rate limiting, API security, GDPR     |
| [Analytics](docs/standards/analytics.md)         | Consent management, GA4               |
| [Deployment](docs/standards/deployment.md)       | CI/CD, monitoring, rollback           |
| [Quality](docs/standards/quality.md)             | Quality gates, checklists             |
| [Documentation](docs/standards/documentation.md) | Documentation maintenance guidelines  |

### Guides (How to Do Common Tasks)

| Guide                                                             | Purpose                                           |
| ----------------------------------------------------------------- | ------------------------------------------------- |
| [Adding a New Site](docs/guides/adding-new-site.md)               | Create a new client site                          |
| [Creating a New Theme](docs/guides/creating-new-theme.md)         | Create a theme via ingest or Stitch pipeline      |
| [Theming](docs/guides/theming.md)                                 | Configure site theme tokens and overlays          |
| [Adding a Service](docs/guides/adding-service.md)                 | Add service MDX content                           |
| [Adding a Location](docs/guides/adding-location.md)               | Add location MDX content                          |
| [Git Workflow](docs/guides/git-workflow.md)                       | Branch workflow details                           |
| [Deploying a Site](docs/guides/deploying-site.md)                 | Deployment procedures                             |
| [Orchestration Patterns](docs/guides/orchestration-patterns.md)   | Skill patterns: sequential, parallel, hybrid      |
| [GitHub Actions](docs/guides/github-actions.md)                   | CI/CD workflow configuration                      |
| [Monitoring Setup](docs/guides/monitoring-setup.md)               | NewRelic and Vercel monitoring setup              |
| [Adding a Content Section](docs/guides/adding-content-section.md) | Add new MDX content type with dynamic route       |
| [Registry Setup](docs/guides/registry-setup.md)                   | Supabase site registry and monitoring setup       |
| [End-to-End Workflow](docs/guides/end-to-end-workflow.md)         | Full site creation workflow from intake to deploy |
| [Component Versioning](docs/guides/component-versioning.md)       | Versioning shared components in core-components   |
| [Debugging](docs/guides/debugging.md)                             | Diagnosing UI, runtime, build, and CSP issues     |
| [Project History](docs/project-history.md)                        | Platform changelog and development phases         |

---

## Documentation Maintenance

Run `/update.docs` before deploying. This verifies documentation accuracy against the actual codebase — checking that architecture docs describe current patterns, links resolve to real files, and instructional content matches how the system actually works.

The `/deploy.changes` skill runs `/update.docs` automatically as its first step.

---

## Output Folder

The `/output/` folder stores session context and working notes for complex tasks. The `sessions/` subfolder is tracked in git.

Use sessions for: research tasks, feature implementation notes, bug investigations, architecture decisions.

**Naming:** `YYYY-MM/YYYY-MM-DD_topic-description`

See [output/README.md](output/README.md) for details.

## Session Wrap-Up Standard

Every session ends with a `session-wrap-up.md` in the session folder:

- **YOLO sessions:** The brief's final phase runs `/wrap-up-session` automatically.
- **Interactive sessions:** Run `/wrap-up-session` before closing.
- **Fallback:** The SessionEnd hook writes a minimal placeholder if the command was skipped.

The wrap-up captures: goal, what was done, key decisions, commits, significant files changed, and what was learned.
