# Codex Peer Review Prompt

Paste this entire file into Codex in VS Code.

---

## Your task

You are doing an independent architectural peer review. Read the brief below, then produce your own implementation plan.

Save your plan as `codex-plan.md` in this folder:
`output/sessions/codex-peer-review/2026-03-07_cq-007-hardcoded-colors/`

When done, output this exact command so the user can copy-paste it into Claude Code:

```
/plan.with.codex synthesise
```

---

## Brief: CQ-007 — Hardcoded Neutral Colors Fix + Defensive ESLint Rule

**Date:** 2026-03-07
**Project:** Local Business Platform monorepo
**Note:** This brief is sent to both Claude and Codex independently. Your plans will be synthesised into a final implementation spec. Do not look at `claude-plan.md` before writing your own plan.

### Problem Statement

The colossus-scaffolding site's `privacy-policy/page.tsx` (73 occurrences) and `cookie-policy/page.tsx` (56 occurrences) use hardcoded Tailwind neutral color classes (`text-gray-600`, `text-gray-700`, `text-gray-900`, `bg-gray-50`, `bg-gray-100`, `border-gray-200`, `border-gray-300`, `bg-blue-50`, `bg-green-50`, `bg-purple-50`, `bg-orange-50`, etc.) instead of theme tokens.

This violates the platform's white-label styling standard: sites must use theme tokens so they re-theme correctly. On a dark theme, gray text on a dark background becomes unreadable.

Additionally, there is no automated guard to prevent this from recurring. New pages or AI-generated content could reintroduce hardcoded colors without anyone noticing until a site looks broken.

The task is two-fold:

1. **Fix**: Replace all hardcoded color classes with appropriate theme tokens
2. **Defend**: Add an automated lint rule that catches hardcoded Tailwind color classes in site code, integrated into the existing CI pipeline

### Goals

- All hardcoded neutral color classes in colossus privacy-policy and cookie-policy pages are replaced with theme tokens
- A lint rule prevents future hardcoded color classes from being introduced in `sites/` directories
- The lint rule runs as part of the existing `pnpm lint` pipeline (which runs in CI)
- Zero visual regression — pages should look correct after the token swap

### Non-Goals

- Fixing hardcoded colors in `sites/showcase/` (that's a developer tool, not a client site — tracked separately as CQ-008)
- Fixing the single `text-gray-200` occurrence in `projects/page.tsx` across sites (star rating color, edge case)
- Changing the semantic color callout boxes (blue/green/purple/orange info boxes in policy pages) — these need a design decision about whether to use theme tokens or keep as intentional accent colors
- Creating new shared components for policy pages (out of scope for this fix)

### Acceptance Criteria

1. `grep -c 'text-gray-\|bg-gray-\|border-gray-' sites/colossus-scaffolding/app/privacy-policy/page.tsx` returns 0
2. `grep -c 'text-gray-\|bg-gray-\|border-gray-' sites/colossus-scaffolding/app/cookie-policy/page.tsx` returns 0
3. `pnpm lint` passes with the new rule active
4. Introducing a `text-gray-500` class in any `sites/*/app/**/*.tsx` file causes `pnpm lint` to fail
5. The rule has an escape hatch (e.g., `// eslint-disable-next-line`) for legitimate exceptions
6. Both pages render correctly after the change (visual check or build succeeds)

### Constraints

- **Architecture**: This is a Turborepo + pnpm workspace monorepo. ESLint config is at the root (`eslint.config.mjs`) using flat config format (`FlatCompat` + `next/core-web-vitals`). Each site also has its own `eslint.config.mjs`.
- **Styling standard**: Only theme tokens are allowed — `bg-brand-primary`, `text-surface-foreground`, `text-surface-muted-foreground`, `bg-surface-muted`, `bg-surface-subtle`, etc. See `docs/standards/styling.md`.
- **No new dependencies** unless absolutely necessary. Prefer a custom ESLint rule or `no-restricted-syntax` pattern over installing a third-party plugin.
- **Semantic color callout boxes** (e.g., `bg-blue-50 border border-blue-200` for "Legal Basis" info boxes) are a design choice. The plan should decide: replace with theme tokens, or explicitly allowlist these patterns. Note: DJ Fox and base-template policy pages do NOT have these callout boxes — they use different markup.
- **The `projects/page.tsx` star rating** uses `text-gray-200` for unfilled stars across all sites — this is a UI pattern, not a theming violation. The lint rule should handle this gracefully.
- **Git workflow**: All changes on `develop` branch. Never push to staging/main directly.

### Relevant Architecture

**Theme token system:**

- `packages/theme-system/` defines tokens and a Tailwind plugin
- Theme configs produce CSS custom properties: `:root { --color-brand-primary: #xxx }`
- Tailwind utility classes reference these: `bg-brand-primary` → `var(--color-brand-primary)`
- Key surface tokens: `bg-surface`, `bg-surface-muted`, `bg-surface-subtle`, `text-surface-foreground`, `text-surface-muted-foreground`, `border-surface-border`

**ESLint setup:**

- Root `eslint.config.mjs` — flat config, extends `next/core-web-vitals` + `next/typescript`
- Each site has its own `eslint.config.mjs` (same pattern)
- `pnpm lint` runs ESLint across all workspaces via Turborepo

**Affected files:**

- `sites/colossus-scaffolding/app/privacy-policy/page.tsx` — 73 hardcoded color occurrences
- `sites/colossus-scaffolding/app/cookie-policy/page.tsx` — 56 hardcoded color occurrences

**Clean reference files (no hardcoded colors):**

- `sites/dj-fox-electrical/app/privacy-policy/page.tsx` — 0 occurrences
- `sites/dj-fox-electrical/app/cookie-policy/page.tsx` — 0 occurrences
- `sites/base-template/app/privacy-policy/page.tsx` — 0 occurrences
- `sites/base-template/app/cookie-policy/page.tsx` — 0 occurrences

### Codebase Snapshot

| Path                                                     | What it contains                                                      |
| -------------------------------------------------------- | --------------------------------------------------------------------- |
| `eslint.config.mjs` (root)                               | Flat ESLint config, extends next/core-web-vitals + next/typescript    |
| `sites/colossus-scaffolding/eslint.config.mjs`           | Site-level ESLint config (same pattern as root)                       |
| `sites/colossus-scaffolding/app/privacy-policy/page.tsx` | ~530 lines, privacy policy page with 73 hardcoded color classes       |
| `sites/colossus-scaffolding/app/cookie-policy/page.tsx`  | ~522 lines, cookie policy page with 56 hardcoded color classes        |
| `docs/standards/styling.md`                              | Styling standard — bans hardcoded colors, lists approved theme tokens |
| `packages/theme-system/src/types.ts`                     | Theme token type definitions                                          |
| `sites/dj-fox-electrical/app/privacy-policy/page.tsx`    | Clean reference — same type of page, zero hardcoded colors            |

### What a Good Plan Should Cover

1. **Token mapping**: What is the exact mapping from hardcoded classes to theme tokens? (e.g., `text-gray-600` → `text-surface-muted-foreground`, `bg-gray-50` → `bg-surface-muted`)
2. **Semantic callout boxes**: What to do with `bg-blue-50 border-blue-200`, `bg-green-50 border-green-200`, etc.? Replace with theme tokens, keep as-is with eslint-disable, or create a shared pattern?
3. **Table styling**: The policy pages have tables with `border-gray-300`, `bg-gray-50` headers, `border-gray-200` cells. What theme tokens replace these?
4. **ESLint approach**: Custom rule vs `no-restricted-syntax` regex? Where does the rule live — root config, site configs, or a shared config? How are exceptions handled?
5. **Scope of the lint rule**: Which color classes are banned? Just `gray-*`? All Tailwind color scales (`red-*`, `blue-*`, `green-*`)? What about `text-white`, `bg-white`, `text-black`?
6. **Verification**: How to confirm the pages still look correct after the swap?

---

## Deliverable

Produce a numbered implementation plan with:

- Clear phases/steps
- Which files are created or modified at each step
- Verification gates between steps (how to confirm each step succeeded before moving on)
- Any risks or trade-offs worth calling out

Save your response as `codex-plan.md` in `output/sessions/codex-peer-review/2026-03-07_cq-007-hardcoded-colors/`.

Then output this command for the user to copy-paste into Claude Code:
`/plan.with.codex synthesise`
