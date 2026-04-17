# Codex Peer Review Prompt

Paste this entire file into Codex in VS Code.

---

## Your task

You are doing an independent architectural peer review. Read the brief below, then produce your own implementation plan.

Save your plan as `codex-plan.md` in this folder:
`output/sessions/codex-peer-review/2026-02-21_pipeline-test-commands/`

When done, output this exact command so the user can copy-paste it into Claude Code:

```
/plan.with.codex synthesise
```

---

## Brief: Pipeline Test Commands

**Date:** 2026-02-21
**Project:** Local Business Platform monorepo
**Note:** This brief is sent to both Claude and Codex independently. Your plans will be synthesised into a final implementation spec. Do not look at `claude-plan.md` before writing your own plan.

### Problem Statement

The ingestion pipeline (`tools/analyse-site.ts`) analyses a reference website and scaffolds a new theme package under `packages/themes/<name>/`. To test the output, someone currently has to manually wire the new theme into `base-template` or an existing site, visually inspect it, then manually undo all those changes.

We need three Claude Code commands (`.claude/commands/*.md`) that automate this test loop:

1. **`/pipeline.ingest`** — Run the full ingestion pipeline against a URL, then automatically create a temporary test site that uses the newly generated theme. The test site should have just enough pages to visually verify the theme (home, a service page, a blog listing, a blog post, contact — not the full content suite). It must NOT modify `base-template`.

2. **`/pipeline.kill-site`** — Completely remove a test site created by `/pipeline.ingest`. Clean up everything: the `sites/<name>/` directory, any workspace references, `node_modules` links, `.next` cache — everything needed so the repo is clean again.

3. **`/pipeline.kill-theme`** — Remove a generated theme package independently of the site. Clean up `packages/themes/<name>/`, the export entries in `packages/themes/package.json`, the name from `THEME_NAMES` in `packages/theme-system/src/types.ts`, and the `ThemeName` union in `packages/core-components/src/context/theme-context.tsx`.

These commands will typically run in terminal YOLO mode but should also work in VS Code with approval prompts.

### Goals

- One-command ingestion + test site creation from a URL
- One-command complete cleanup of a test site
- One-command complete cleanup of a theme package
- Test sites are clearly marked as temporary (naming convention, marker file)
- No permanent side effects on `base-template` or existing sites
- Commands are idempotent where possible (running kill twice doesn't error)

### Non-Goals

- Modifying the ingestion pipeline itself (`tools/analyse-site.ts`)
- Modifying the site creation tool (`tools/create-site-from-project.ts`)
- Creating new TypeScript tooling scripts — these are Claude Code command files (markdown instructions)
- Deploying test sites to Vercel
- Generating full MDX content suites (services, locations, blog posts) — just enough placeholder content to verify the theme renders

### Acceptance Criteria

1. `/pipeline.ingest --url https://example.com` runs the full pipeline and produces a working test site at `sites/test-<theme-name>/` that starts with `pnpm dev`
2. `/pipeline.kill-site test-<name>` removes the site directory and all workspace traces
3. `/pipeline.kill-theme <name>` removes the theme package and all type/export references
4. Running `/pipeline.kill-site` then `/pipeline.kill-theme` leaves the repo in the exact same state as before ingestion (verifiable with `git status`)
5. Test site uses the generated theme's tokens and components, not vega/orion defaults
6. Commands work in both YOLO mode and interactive VS Code mode

### Constraints

**Architecture constraints (from CLAUDE.md and codebase):**

- Commands are markdown files in `.claude/commands/` — they contain step-by-step instructions that Claude Code follows, not executable scripts
- The ingestion pipeline is invoked via: `npx tsx tools/analyse-site.ts --url <url> [--name <name>]`
- The pipeline outputs to `./output/ingestion/<theme-name>/` and scaffolds the theme package to `packages/themes/<name>/`
- Theme scaffolding (`tools/scaffold-theme-package.ts`) modifies these files:
  - Creates `packages/themes/<name>/` directory with index.ts, globals.css, manifest.ts, showcase-registry.tsx, components/
  - Adds export entries to `packages/themes/package.json`
  - Appends theme name to `THEME_NAMES` in `packages/theme-system/src/types.ts`
  - Appends theme name to `ThemeName` union in `packages/core-components/src/context/theme-context.tsx`
- Site creation tool (`tools/create-site-from-project.ts`) requires a ProjectFile JSON and copies from `base-template`
- Sites are auto-discovered by pnpm via `pnpm-workspace.yaml` glob `sites/*` — no manual registration needed
- Git workflow: all work on `develop` branch. These commands do NOT commit or push — they're local dev tools
- The existing theme packages (orion, vega) use a component registry pattern — the test site's `theme.config.ts` needs to import from the generated theme or fall back to an existing registry

**Key decision for both models to address:**

The test site needs a `theme.config.ts` that references the new theme. But generated themes from the ingestion pipeline produce a `DefaultConfig` object (see `packages/themes/lyra/index.ts`), not a component registry like orion/vega have. The site's `theme.config.ts` needs a `componentRegistry` — how should the test site handle this? Options include:

- Using vega's registry as a fallback while applying the generated theme's color/typography tokens
- Having the command generate a minimal registry from the theme's manifest
- Skipping the registry entirely for visual testing purposes

### Relevant Architecture

**Ingestion pipeline** (`tools/analyse-site.ts`):

- 14-step process: discover pages → screenshot → HTML analysis → vision analysis → component matching → token reconciliation → component generation → theme scaffolding
- Outputs: `output/ingestion/<name>/` (analysis JSON, screenshots, components, example pages) + `packages/themes/<name>/` (theme package)
- Theme names come from a constellation namespace (`tools/lib/theme-name-picker.ts`) — e.g., "lyra", "cygnus", "draco"

**Theme package structure** (e.g., `packages/themes/lyra/`):

- `index.ts` — exports `lyraDefaultConfig: DeepPartialThemeConfig` + calls `registerTheme()`
- `globals.css` — theme-specific utility classes (buttons, cards, sections, typography)
- `manifest.ts` — component metadata array
- `components/` — generated component TSX files + barrel index.ts
- `showcase-registry.tsx` — showcase site integration

**Site structure** (`sites/base-template/`):

- `theme.config.ts` — imports registry from theme package, defines color overrides
- `site.config.ts` — business info, navigation, features
- `app/globals.css` — imports theme CSS + Tailwind directives
- `content/` — MDX files (services, locations, blog, projects, testimonials)
- `app/` — Next.js routes with dynamic `[slug]` patterns

**Site creation** (`tools/create-site-from-project.ts`):

- Requires a `ProjectFile` JSON validated against Zod schema
- Copies base-template → generates site.config.ts + theme.config.ts from project data
- The ProjectFile schema is extensive (business info, services, regions, pricing, deployment config)

### Codebase Snapshot

| File                                                     | Purpose                                              |
| -------------------------------------------------------- | ---------------------------------------------------- |
| `tools/analyse-site.ts`                                  | v2 ingestion pipeline entry point (639 lines)        |
| `tools/scaffold-theme-package.ts`                        | Theme package generator (719 lines)                  |
| `tools/create-site-from-project.ts`                      | Site generator from project JSON (1117 lines)        |
| `tools/examples/sample-project.json`                     | Example ProjectFile for site creation                |
| `packages/themes/package.json`                           | Shared exports map for all themes                    |
| `packages/themes/lyra/index.ts`                          | Example generated theme (from previous pipeline run) |
| `packages/themes/vega/index.ts`                          | Reference: established theme with registry           |
| `packages/themes/orion/index.ts`                         | Reference: established theme with registry           |
| `packages/theme-system/src/types.ts`                     | `THEME_NAMES` array + `ThemeName` type               |
| `packages/core-components/src/context/theme-context.tsx` | Duplicated `ThemeName` union                         |
| `sites/base-template/theme.config.ts`                    | Reference: how sites import theme registries         |
| `sites/base-template/site.config.ts`                     | Reference: site configuration structure              |
| `sites/base-template/app/globals.css`                    | Reference: how sites import theme CSS                |
| `.claude/commands/deploy.changes.md`                     | Reference: existing command format                   |
| `pnpm-workspace.yaml`                                    | Workspace globs: `sites/*`, `packages/*`, `tools/*`  |

### What a Good Plan Should Cover

1. **Site creation approach**: Should the command generate a minimal ProjectFile JSON and run `create-site-from-project.ts`? Or should it copy base-template directly with targeted file replacements? Trade-offs: the project file approach validates through the schema but requires generating a full ProjectFile; direct copy is simpler but bypasses validation.

2. **Theme wiring**: How does the test site's `theme.config.ts` reference the new theme when generated themes don't have component registries? What's the simplest approach that still renders pages correctly?

3. **Minimal content**: What placeholder MDX files does the test site need? Which pages are sufficient to verify a theme visually?

4. **Naming convention**: How are test sites identified? `test-<theme-name>`? A `.test-site` marker file? Both?

5. **Kill-site cleanup scope**: What exactly needs to be removed? Just `rm -rf sites/<name>`? Or also `node_modules` cleanup, turbo cache, `.next`?

6. **Kill-theme cleanup**: The inverse of what `scaffold-theme-package.ts` does — removing directory, exports, THEME_NAMES entry, ThemeName union entry. How to make this robust (regex? AST? string replacement?).

7. **Error handling**: What if the pipeline fails midway? What if the theme was already partially cleaned up? Idempotency considerations.

8. **Command argument passing**: How do commands accept arguments like `--url` and site/theme names? What's the interaction model?

---

## Deliverable

Produce a numbered implementation plan with:

- Clear phases/steps
- Which files are created or modified at each step
- Verification gates between steps (how to confirm each step succeeded before moving on)
- Any risks or trade-offs worth calling out

Save your response as `codex-plan.md` in `output/sessions/codex-peer-review/2026-02-21_pipeline-test-commands/`.

Then output this command for the user to copy-paste into Claude Code:

```
/plan.with.codex synthesise
```
