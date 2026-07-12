---
name: add-core-component
description: Checklist and rationale for adding a new shared component to packages/core-components, including propagating components identified via reference analysis (newComponentBacklog in reference-analysis.json). Use when adding or reviewing a new cross-theme component in core-components.
---

# Cross-Theme Component Propagation

When adding a new component identified via reference analysis (`newComponentBacklog` in `reference-analysis.json`):

## Checklist

- [ ] Named export only (no default export)
- [ ] TypeScript interface for all props
- [ ] Server Component — no `'use client'`, no React hooks, no context imports
- [ ] Token-only Tailwind classes (`bg-brand-primary`, `text-surface-foreground`, etc.)
- [ ] No hardcoded hex colours
- [ ] Exported from `packages/core-components/src/index.ts`
- [ ] If MDX-driven: schema added to `packages/core-components/src/lib/content-schemas.ts`
- [ ] `pnpm type-check` passes
- [ ] `pnpm --filter @platform/core-components build` passes
- [ ] Visual check in `sites/base-template` (vega) dev server
- [ ] Visual check in `sites/dj-fox-electrical` (orion) dev server if practical

## Why core-components first?

Components use theme tokens → single implementation adapts to every theme's colour palette automatically. No per-theme duplication needed.

## Gap component briefs

Run `tools/generate-theme-from-reference.ts --analyse` → `newComponentBacklog` in `reference-analysis.json` contains props contract, token constraints, and acceptance criteria for each gap component.
