# AGENTS.md

Guidance for Codex when working with the Local Business Platform monorepo.

## What This Project Is

A **white-label website platform** for local service businesses (tradespeople, contractors). The model: take a single gold-standard template, customise per client (colours, content, business info), and deploy each as an independent website on its own domain.

**Monorepo structure:** Turborepo + pnpm workspaces. Shared code in `packages/`, client websites in `sites/`, automation scripts in `tools/`.

## Critical: Git Workflow

```
develop → staging → main
```

- ALWAYS start on `develop` when making changes
- NEVER push directly to `staging` or `main`
- Use the full workflow: develop → commit → push → merge to staging → push → merge to main → push

## Architecture: Non-Negotiable Rules

### MDX-Only Content

All content is managed through MDX files with YAML frontmatter. **Never create:**
- Individual static page files (`app/services/specific-service/page.tsx`) — use dynamic `[slug]` routes
- Centralised TypeScript data files (`lib/locations.ts`) — frontmatter IS the data

### Theme System

- `packages/theme-system/` — tokens + Tailwind plugin
- `packages/themes/orion/` — dark header, full-bleed hero, circular icons (DJ Fox Electrical style)
- `packages/themes/vega/` — light header, split hero, card grid (base-template / colossus style)
- `packages/core-components/` — shared component primitives; these are **Server Components** — React context cannot be used for layout/variant decisions
- `ThemeProvider` (React context) is **client-only** — limited to mobile menu, consent manager, button tokens
- Sites import from theme packages: `import { vegaRegistry } from '@platform/themes/vega'`
- Per-site `globals.css` should be ~20-25 lines — just imports theme CSS + site-specific shims

### Styling

- Always use theme tokens: `bg-brand-primary`, `text-surface-foreground`, `text-h1`
- NEVER hardcode hex colours — they break white-labelling
- No inline styles, no CSS-in-JS — Tailwind only

### Components

- Shared components → `packages/core-components/src/components/ui/`
- Site-specific components → `sites/[name]/components/ui/`
- Named exports only (no default exports), TypeScript interfaces for all props

## Live Sites

| Site | Domain | Theme |
|------|--------|-------|
| `sites/dj-fox-electrical` | djfoxelectrical.com | orion (red) |
| `sites/colossus-scaffolding` | — | vega (navy) |
| `sites/base-template` | — | vega (blue) — gold-standard template |

## Key Commands

```bash
pnpm build          # Build all packages then all sites (Turborepo cached)
pnpm lint           # ESLint across all workspaces
pnpm type-check     # TypeScript strict mode
pnpm clean          # Remove build artifacts
```

## Key File Paths

| What | Where |
|------|-------|
| Project instructions | `CLAUDE.md` (root) |
| Theme types | `packages/theme-system/src/types.ts` |
| Content schemas | `packages/core-components/src/lib/content-schemas.ts` |
| Core components | `packages/core-components/src/components/ui/` |
| Orion theme | `packages/themes/orion/` |
| Vega theme | `packages/themes/vega/` |
| Site creation tool | `tools/create-site-from-project.ts` |
| AI theme generator | `tools/generate-theme-from-reference.ts` |

## Peer Review Role

When you receive a planning brief from `output/sessions/codex-peer-review/*/codex-prompt.md`:

1. Read the brief carefully, including all constraints
2. Explore the relevant parts of the codebase yourself before planning
3. Produce an independent implementation plan — do not try to guess what Claude would say
4. Focus especially on: operational constraints, migration risks, what could break, verification steps
5. Save your plan as `codex-plan.md` in the same folder as the brief
