# Codex Peer Review Prompt

Paste this entire file into Codex in VS Code.

---

## Your task

You are doing an independent architectural peer review. Read the brief below, then produce your own implementation plan.

Save your plan as `codex-plan.md` in this folder:
`output/sessions/codex-peer-review/2026-02-20_ingestion-pipeline/`

When done, tell the user to run `/plan.with.codex synthesise` in Claude Code.

---

## Brief: End-to-End Client Ingestion Pipeline

**Date:** 2026-02-20
**Project:** Local Business Platform monorepo
**Note:** This brief is sent to both Claude and Codex independently. Your plans will be synthesised into a final implementation spec. Do not look at `claude-plan.md` before writing your own plan.

### Problem Statement

The Local Business Platform is a white-label website factory for UK local service businesses (trades, contractors). The goal is a pipeline where an operator can input a client's business details (via a chat intake session) and their branding (a website URL or logo image), and the system outputs a fully configured, ready-to-build Next.js 15 site with correct theme, colours, and business config.

The pipeline exists in pieces but is **not connected end-to-end**. Several pieces produce broken output that would fail build or TypeScript type-check. The task is to fix the critical defects and wire the pieces together so a single `create-site-from-project.ts` invocation produces a valid, buildable site.

The current flow is designed to work like this:
```
Chat intake → ProjectFile JSON → create-site-from-project.ts → valid site directory
```

And separately:
```
Client URL / logo → generate-theme-from-reference.ts → theme.config.ts content
```

The problem is that neither flow produces output that actually works due to format mismatches and missing wiring.

### The Confirmed Defects

#### Defect 1 (CRITICAL): `generateThemeConfigContent()` emits a non-existent API

File: `packages/intake-system/src/theme-extraction/theme-generator.ts` lines 399–442

This function outputs:
```typescript
import { defineTheme } from '@platform/theme-system';
export default defineTheme({ name: '...', ... });
```

But `defineTheme` **does not exist** in `@platform/theme-system`. The package exports only `DeepPartialThemeConfig` (a type) and the Tailwind plugin. Any site using this output would fail at runtime with an import error. `export default` is also against project conventions (named exports only).

The correct format all production sites use:
```typescript
import type { DeepPartialThemeConfig } from '@platform/theme-system';
import { vegaRegistry } from '@platform/themes/vega'; // or orionRegistry

export const themeConfig: DeepPartialThemeConfig = {
  componentRegistry: vegaRegistry,
  colors: { brand: {...}, surface: {...} },
  typography: { fontFamily: { sans: [...], heading: [...] } },
};
```

This defect also cascades to `generate-theme-from-reference.ts`. That tool calls `generateThemeConfigContent()` and then applies two regex patches to inject the registry import. Those regex patterns look for `import type { DeepPartialThemeConfig }` and `export const themeConfig: DeepPartialThemeConfig = {` — which never appear in the current output. Both patches silently fail. The standalone theme generator tool therefore also produces broken output.

#### Defect 2 (CRITICAL): `create-site-from-project.ts` generates theme.config.ts without `componentRegistry`

File: `tools/create-site-from-project.ts` lines 683–740

This function correctly uses `DeepPartialThemeConfig` format (named export, correct type). However, it **never emits** the `componentRegistry` line. Without this, the generated site falls back to whatever registry the base template last had — there is no error, but the wrong theme components are silently applied.

Example of what's missing from the generated output:
```typescript
export const themeConfig: DeepPartialThemeConfig = {
  // ← componentRegistry: vegaRegistry  ← THIS LINE IS MISSING
  colors: { ... },
  ...
};
```

#### Defect 3 (BLOCKER): No `themeVariant` field in ProjectFile schema

File: `packages/intake-system/src/schemas/project-file.schema.ts`

The `ProjectFile` is the single source of truth that flows from intake → site creation. There is no field to record the orion/vega decision. The `create-site-from-project.ts` tool therefore has no way to know which theme registry to use. The schema needs a `themeVariant` field.

#### Defect 4 (MEDIUM): Intake chat doesn't capture orion/vega preference

File: `packages/intake-system/src/chat-intake/system-prompt.ts`

The intake chat system prompt collects colours and fonts but doesn't ask the style question that maps to orion vs vega. Operators must manually set `themeVariant` in the ProjectFile JSON after intake, which is error-prone.

### Architecture Facts

**Theme system:**
- `packages/theme-system/` exports `DeepPartialThemeConfig` type and Tailwind plugin
- `packages/themes/orion/` exports `orionRegistry` — dark header, full-bleed image hero, circular icon cards. For: trades businesses (electrical, plumbing), bold/dark brands.
- `packages/themes/vega/` exports `vegaRegistry` — light header, split hero, card grid. For: professional services (scaffolding, consulting), clean/light brands.
- The `componentRegistry` field in `theme.config.ts` is set at **build time** — it's a Server Component concern, not a React context concern. No runtime switching.

**ProjectFile:**
- Defined in `packages/intake-system/src/schemas/project-file.schema.ts` as a Zod schema
- All sections use `.optional()` where not required — schema additions are non-breaking
- `ProjectFile.theme` is the section that holds colours, typography, and component config
- `ProjectFile.deployment` holds site-level configuration including feature flags

**Site creation tool:**
- `tools/create-site-from-project.ts` (1,106 lines)
- Reads ProjectFile JSON, validates against schema, copies base-template, generates `site.config.ts` and `theme.config.ts`
- Has `--dry-run` flag for testing
- The `generateThemeConfig(project)` function (lines 624–743) is the one that needs fixing

**Standalone theme generator:**
- `tools/generate-theme-from-reference.ts` — fetches a website or analyzes a logo, uses Claude Haiku to classify orion vs vega, outputs `theme.config.ts` content
- It calls `generateThemeConfigContent()` from intake-system as its base, then patches the output with regex
- After fixing Defect 1, this tool should work correctly with no further changes (the regex patches will match the corrected output)

**Intake chat system:**
- `packages/intake-system/src/chat-intake/system-prompt.ts` — guides Claude through collecting business info
- `packages/intake-system/src/chat-intake/tools.ts` — MCP tool definitions Claude can call during intake
- The intake ends with Claude calling `generate_project_file` tool to produce the ProjectFile JSON

### Codebase Snapshot

Key files and their current state:

| File | Current State |
|------|---------------|
| `packages/intake-system/src/theme-extraction/theme-generator.ts` L399–442 | `generateThemeConfigContent()` outputs `defineTheme()` / `export default` — broken |
| `tools/create-site-from-project.ts` L683–740 | `generateThemeConfig()` outputs correct format but missing `componentRegistry` line |
| `packages/intake-system/src/schemas/project-file.schema.ts` L443+ | `ThemeSchema` has no `themeVariant` field |
| `packages/intake-system/src/chat-intake/system-prompt.ts` | No question capturing orion/vega preference |
| `tools/generate-theme-from-reference.ts` L196–218 | Calls `generateThemeConfigContent()` then patches with regex — will work once Defect 1 fixed |
| `sites/dj-fox-electrical/theme.config.ts` | Gold-standard orion format |
| `sites/base-template/theme.config.ts` | Gold-standard vega format |

### Constraints

1. **`defineTheme` does not exist** — any reference to it must be removed
2. **Named exports only** — `export const themeConfig`, never `export default`
3. **`componentRegistry` is build-time, not runtime** — set in `theme.config.ts`, not in React context
4. **ProjectFile is the single source of truth** — no parallel data files for the orion/vega decision
5. **No over-engineering** — fix what's broken, wire what exists; don't redesign what works
6. **Schema changes must be non-breaking** — all new fields use `.optional()`
7. **MDX-only content** — site creation generates configs; content generation (MDX files) is a separate tool already (out of scope)
8. **Git workflow** — all changes on `develop` branch

### What a Good Plan Should Cover

1. The exact change to `generateThemeConfigContent()` — what should it output, and should it include the `componentRegistry` line or leave that to callers?
2. How the orion/vega decision flows from intake → ProjectFile schema → site creation tool
3. Whether `generate-theme-from-reference.ts` needs changes after fixing Defect 1, or whether the existing regex patches will "just work"
4. What question or logic in the intake system prompt captures the orion/vega preference
5. The minimal end-to-end smoke test that confirms a generated `theme.config.ts` is valid and buildable

---

## Deliverable

Produce a numbered implementation plan with:
- Clear phases/steps
- Which files are created or modified at each step
- Verification gates between steps (how to confirm each step succeeded before moving on)
- Any risks or trade-offs worth calling out

Save your response as `codex-plan.md` in `output/sessions/codex-peer-review/2026-02-20_ingestion-pipeline/`.
