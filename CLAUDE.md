# CLAUDE.md

Guidance for Claude Code when working with the Local Business Platform monorepo.

## ⚠️ CRITICAL: Git Workflow

**ALL changes MUST follow this branching workflow. NO EXCEPTIONS.**

```
develop → staging → main
```

1. **ALWAYS start on `develop`** when making changes
2. **NEVER push directly to `staging` or `main`**
3. **Flow:** develop → commit → push → merge to staging → push → merge to main → push
4. **Verify CI passes** after each push: `gh run watch`

**If you break this rule:** Stop immediately, inform user, ask how to proceed.

See [docs/guides/git-workflow.md](docs/guides/git-workflow.md) for detailed workflow.

---

## Mandatory Documentation

Before making changes, read these files:

| Document                                                               | Purpose                                         |
| ---------------------------------------------------------------------- | ----------------------------------------------- |
| [docs/architecture/ARCHITECTURE.md](docs/architecture/ARCHITECTURE.md) | Architecture overview                           |
| [docs/standards/](docs/standards/)                                     | Content, styling, components, testing standards |
| [docs/guides/](docs/guides/)                                           | How-to guides for common tasks                  |
| [WHITE_LABEL_PLATFORM_DESIGN.md](WHITE_LABEL_PLATFORM_DESIGN.md)       | Business model & roadmap                        |

---

## Project Overview

White-label website platform for local service businesses. Monorepo with Turborepo + pnpm.

- **Sites:** `sites/` directory (each deploys to separate Vercel project)
- **Components:** `packages/core-components` (@platform/core-components v1.1.0)
- **Theme System:** `packages/theme-system` (@platform/theme-system) - CSS variables + Tailwind plugin
- **Base Template:** `sites/base-template` - Gold-standard template for new sites
- **Content:** MDX files only (62 total: 25 services + 37 locations)

---

## Output Folder Guidance

The `/output/` folder stores session context and working notes for complex tasks. The `sessions/` subfolder is **tracked in git**.

**When to create sessions:**

- Research and analysis tasks (exploring codebase, understanding patterns)
- Feature implementation notes (design decisions, code snippets, progress)
- Bug investigation documentation (debugging steps, root cause analysis)
- Architecture decisions (pros/cons, alternatives, rationale)
- Any work that might need future reference or continuation

**Session naming:** `YYYY-MM-DD_topic-description` (e.g., `2025-12-06_auth-refactor-analysis`)

**What to include in session metadata:**

- Objective/context
- Key findings or decisions
- Code references and file paths
- Next steps (if incomplete)
- Related issues/PRs

**Git tracking:** The `output/sessions/` folder is committed to the repository. Other output contents (generated images, batch files) remain gitignored.

See [output/README.md](output/README.md) for full documentation.

---

## Essential Commands

### Root Level (Monorepo)

```bash
pnpm build          # Build all sites (Turborepo cached)
pnpm lint           # Lint all workspaces
pnpm type-check     # Type check all workspaces
pnpm clean          # Clean build artifacts
```

### Site Level (sites/colossus-reference/)

```bash
npm run dev         # Dev server (localhost:3000)
npm run build       # Production build
npm test            # 141 unit tests (~2s)
npm run test:e2e:smoke  # Fast E2E (~30s)
```

### Content Validation

```bash
npm run validate:content   # All 62 MDX files
npm run validate:services  # 25 service files
npm run validate:locations # 37 location files
```

### Theme System

```bash
# Validate theme contrast (from packages/theme-system)
pnpm validate --config ../../sites/[site-name]/theme.config.ts

# Create new site from base-template
npx ts-node tools/create-site.ts [site-name]
```

---

## Critical Architecture Rules

### MDX-Only Content (CRITICAL)

All content managed through MDX files. **NEVER create:**

- Individual static page files (`app/services/specific-service/page.tsx`)
- Centralized TypeScript data files (`lib/locations.ts`)
- Content-specific loaders or data structures

### Styling

- **Tailwind CSS + Theme System** - No inline styles, no CSS-in-JS
- Use theme tokens: `bg-brand-primary`, `text-surface-foreground`
- ❌ Avoid hardcoded hex colors (`bg-[#005A9E]`) - use CSS variables
- Reusable classes in `app/globals.css` with `@apply`

### Components

- All reusable components in `components/ui/`
- TypeScript interfaces for all props
- Named exports only (no default exports)

See [docs/architecture/ARCHITECTURE.md](docs/architecture/ARCHITECTURE.md) for details.

---

## Common Issues

### TypeScript Errors During Push

```bash
npm run type-check  # Identify errors
# Fix errors
npm run type-check  # Verify fix
git push
```

### Build Failures

```bash
npm run build  # See exact error
# Fix: import/export errors, missing deps, MDX syntax
npm run build  # Verify fix
```

### Content Validation Failures

```bash
npm run validate:content  # See errors
# Fix: description length (50-200), FAQ count (3-15), YAML syntax
npm run validate:content  # Verify fix
```

---

## Documentation Maintenance

**IMPORTANT:** Update documentation after every change.

### Files to Update

| File                 | When to Update                           |
| -------------------- | ---------------------------------------- |
| CHANGELOG.md         | Every change (date, description, impact) |
| ARCHITECTURE.md      | Architecture patterns, content structure |
| docs/standards/\*.md | Standards changes                        |
| This file            | Commands, workflow, tools                |

### Workflow

1. Review which docs are affected
2. Update content and examples
3. Verify accuracy
4. Include in same commit

---

## Before Implementation Checklist

**Before:**

- [ ] Read ARCHITECTURE.md and relevant standards
- [ ] Confirm MDX-only pattern applies
- [ ] Check existing patterns in globals.css

**After:**

- [ ] `npm run type-check` passes
- [ ] `npm run build` passes
- [ ] Documentation updated
- [ ] CHANGELOG.md updated

---

## Quality Gates

| Environment | Requirements                             |
| ----------- | ---------------------------------------- |
| develop     | Pre-push hooks pass (TypeScript + Build) |
| staging     | CI passes + E2E tests                    |
| main        | Staging CI must pass first               |

---

**Remember:** MDX-only architecture. No centralized data files. All content in MDX frontmatter.
