# Codex Peer Review Prompt

Paste this entire file into Codex in VS Code.

---

## Your task

You are doing an independent architectural peer review. Read the brief below, then produce your own implementation plan.

Save your plan as `codex-plan.md` in this folder:
`output/sessions/codex-peer-review/2026-08/2026-08-01_npracing-site-build/`

When done, output this exact command so the user can copy-paste it into Claude Code:

```
/plan.with.codex synthesise output/sessions/codex-peer-review/2026-08/2026-08-01_npracing-site-build/
```

---

## Brief: NPRacing — build npracing-v1 and npracing-v3 as real platform sites, deploy both to Vercel

**Date:** 2026-08-01
**Project:** local-business-platform (white-label Next.js/Turborepo monorepo for local-service-business websites)
**Note:** This brief is sent to both Claude and Codex independently. Your plans will be synthesised into a final implementation spec. Do not look at `claude-plan.md` before writing your own plan.

### Problem Statement

NPRacing is a British Superbike (BSB) racing team's brand-building website — the first non-local-service-business site on this platform (no services/locations content model applies). Two homepage design directions ("v1 Grid Box" — cinematic full-bleed hero, and "v3 Number 51" — bold poster style built around the race number) were prototyped as static, self-contained HTML mockups (base64-embedded fonts/images to survive the Claude Artifact sandbox's CSP) and published as private Claude Artifacts for client review, along with Merch, News, and Contact pages for each direction (8 HTML pages total). The client has not yet picked a final direction between v1 and v3 — the next step is to build BOTH as real, production-quality platform sites and deploy both live to Vercel so the client can compare real URLs instead of Artifact links, before a final direction is chosen.

This is **not** a "port the HTML" task. The prototype HTML is intentionally throwaway (see Constraints) — the real build must use this platform's actual architecture: Next.js App Router, MDX content, the theme-config/Tailwind-token system, and the platform's self-contained-site pattern.

### Goals

- Two independently deployed, production-quality Next.js sites — `sites/npracing-v1` and `sites/npracing-v3` — each fully following this platform's architecture (see Relevant Architecture below), each live on its own Vercel URL, so the client can compare v1 vs v3 side by side on real domains.
- Visual fidelity to the approved mockups (colour, type, layout, motion) — `prototype/tokens.css` is the source of truth for the design system, not the mockup HTML itself.
- Real content: home, merch (8 products, external deep-links to The Clothing Kings), news (2 real BSB articles), contact (email, Instagram, decorative form placeholder pending Resend wiring), team/brand info.
- Both sites buildable and deployable **in parallel** — the user explicitly wants v1 and v3 worked on concurrently, not sequentially.
- A plan that gets as far as physically possible toward "live on Vercel" — including flagging, precisely, any step that cannot be completed by an agent alone (e.g. anything requiring the Vercel dashboard UI, DNS, or a credential/account action only the human user can perform).

### Non-Goals

- Do not pick a winner between v1/v3 — both get built and deployed; direction selection happens after.
- No on-site checkout for merchandise — cards deep-link out to the external retailer only.
- No real Resend-backed contact form wiring in this pass — the contact form can remain a structurally real form (proper markup, validation-ready) but does not need working email delivery yet; note it as explicit follow-up.
- No custom domain cutover — Vercel preview/production URLs on the default `*.vercel.app` domain are sufficient for this pass; a real domain isn't confirmed yet.
- Don't build the "Races" calendar/results page — it's a proposed upsell the client hasn't asked for, out of scope for this pass.
- v2 "Pit Lane Editorial" and v4 "Paddock Minimal" stay homepage-only prototypes — not part of this build.

### Acceptance Criteria

- `sites/npracing-v1/` and `sites/npracing-v3/` exist, each self-contained per this platform's current pattern (own `theme.config.ts`, own Header/Footer/page components, no runtime import from `packages/themes/*`).
- Each site has working routes for: home, merch (index — cards are external links, no on-site detail page needed since each card deep-links out), news (index + detail, or index-only if the 2 articles don't warrant separate detail pages — plan should decide and justify), contact.
- Content (merch products, news articles, team/brand copy) lives in MDX with Zod-validated frontmatter, not a hardcoded TS data file or component-embedded JSX — "frontmatter IS the data" is a hard platform rule.
- `pnpm --filter npracing-v1 run lint` and the equivalent for v3 pass; `npm run type-check` passes for both from repo root.
- Both sites build successfully (`next build --webpack`) locally before any Vercel deploy attempt.
- Two Vercel projects exist (or a concrete, correct procedure is documented for creating them) with `rootDirectory` set to `sites/npracing-v1` and `sites/npracing-v3` respectively, no `outputDirectory` override (see Constraints).
- The plan is explicit about which steps an agent can execute directly vs. which require the human user (Vercel dashboard actions, DNS, secrets/env vars, R2 bucket credentials) — see "What a Good Plan Should Cover."

### Constraints

- **Git workflow is non-negotiable:** all work starts on `develop`, never pushed directly to `staging`/`main`. See root `CLAUDE.md` → "CRITICAL: Git Workflow." Two parallel builds touching disjoint `sites/npracing-v1/` and `sites/npracing-v3/` trees are a textbook case for the platform's documented worktree strategy (`worktree-strategy` skill) rather than one branch with two agents editing concurrently — the plan should state whether it uses worktrees, separate feature branches on the main checkout, or something else, and why.
- **MDX-only content, no exceptions:** never create individual static page files for dynamic content, never a centralized `lib/locations.ts`-style TS data file — frontmatter is the data. This applies even though NPRacing has no services/locations — merch products and news articles are the equivalent "collection" content types here and must follow the same MDX + Zod-schema + `listSlugs`/`loadMdx` pattern documented in `docs/guides/adding-content-section.md`.
- **Self-contained site pattern (current, as of July 2026):** every site owns its own `Header`, `Footer`, page layout components, and theme CSS/tokens inlined in its own `theme.config.ts` — no runtime imports from `@platform/themes/*`. `sites/dch-automotive` is the current reference implementation of this pattern (see Codebase Snapshot). The retired `packages/themes/*` packages and the retired Theme Component Contract CI validator are historical context only, not requirements to satisfy.
- **Styling:** Tailwind only, theme tokens only (`bg-brand-primary`, `text-h1`, etc.) — never hardcoded hex in components; no inline styles, no CSS-in-JS. `prototype/tokens.css` gives the real hex values to translate into each site's `theme.config.ts`.
- **Images:** production images belong in Cloudflare R2, never committed to the repo (`docs/standards/images.md`). This build has an unresolved asset-pipeline gap: the mockups embedded images as base64 for the Artifact sandbox; the real site needs `next/image` + R2 URLs. Actual R2 bucket credentials/upload access for this session have **not been confirmed** as available — the plan must state how it will handle this (e.g., placeholder/`placehold.co` fallback per the platform's existing dev-mode pattern in `docs/standards/images.md`, with a clearly flagged follow-up to upload real assets to R2 before the client-facing comparison is truly final) rather than silently assuming R2 access exists.
- **CSS syntax:** never use Tailwind's `theme()` function in plain CSS — use `var(--color-brand-primary)` instead (causes CSS parser panics otherwise).
- **Tailwind content globs:** never `packages/themes/**/*.{ext}` (descends into `node_modules`, 18+ minute builds) — not directly relevant if npracing sites don't reference `packages/themes` at all, but worth confirming the new sites' own `tailwind.config.ts` content globs are scoped correctly.
- **Vercel monorepo config:** root `vercel.json` produces a trivial static build; each site is its own Vercel project with `rootDirectory: sites/<name>`. Site-level `vercel.json` must **not** set `outputDirectory` (causes double-pathing). No `turbo-ignore`/`ignoreCommand` — Vercel's native monorepo detection handles build skipping.
- **Production builds use `next build --webpack`** (Turbopack has PostCSS bugs in CI); Turbopack is fine for `next dev`.
- **Every env var affecting build output must be declared in `turbo.json`'s `env` array**, or CI gets stale cache hits.
- **Pre-push hook only runs `type-check`** (~3s) — full build/lint runs in CI, so the plan's local verification gates should mirror what CI actually checks (`type-check`, `lint`, content validation), not assume the pre-push hook catches everything.
- **Content validation:** `scripts/validate-content.ts` currently only knows about `services`/`locations` content types (per root `CLAUDE.md`'s Essential Commands). New content types (`merch`, `news`) will need their own Zod schemas and either an extension to that script or a scoped equivalent — the plan should say which.
- **Session-observability instrumentation is available and should be used:** `$SESSION_OBSERVABILITY_SKILL_PATH` is already set in this environment, and `/plan.to.yolo` auto-detects it (guarded — omits everything if not present) to inject phase/progress reporting into the generated YOLO brief. Since this plan will likely become two parallel YOLO briefs (one per site), each should get its own `--run-id` (e.g. `npracing-v1`, `npracing-v3`) so progress can be checked independently via `/observe.status`.

### Relevant Architecture

- **Site creation:** copy `sites/base-template`, customize `theme.config.ts` (colors/typography/component tokens) and `site.config.ts` (business info — NPRacing isn't a "local service business" in the usual sense, so several `BaseSiteConfig` fields like `serviceAreas`/`services` may not map cleanly; the plan should note where this config type needs light adaptation vs. where fields can just be left minimal/empty).
- **Self-contained pattern reference:** `sites/dch-automotive` — `theme.config.ts` still does a **type-only** import from `@platform/theme-system` (`DeepPartialThemeConfig`, `ComponentRegistry` — just TypeScript types, no runtime dependency), but `Header`/`Footer`/page-layout components live locally in `components/site-header.tsx`, `components/site-footer.tsx`, `components/pages/*.tsx` — not imported from any `@platform/themes/*` package. This is the pattern to replicate, not the older `registry: { theme: 'vega' }` pattern still present in `base-template`'s own `theme.config.ts` (base-template predates the July 2026 self-containment migration and hasn't been migrated itself — copying it as a starting point is fine, but its theme.config.ts approach should not be taken as the current standard).
- **Content loader:** `lib/mdx.tsx`'s `listSlugs`/`loadMdx` functions are generic over a `ContentType` string union — adding `merch` and `news` as new content types follows `docs/guides/adding-content-section.md` (Zod schema in `lib/schemas/`, index + detail routes, section sitemap, register in `app/sitemap-index.xml`).
- **Vercel deploy tooling available to the agent:** Vercel CLI v50.10.0 is installed locally (`which vercel`). An example of an existing linked project's `.vercel/project.json` exists at `sites/dch-automotive/.vercel/project.json` (`projectId`, `orgId`, `projectName` — created some other way, not necessarily by this CLI). The `mcp__claude_ai_Vercel__*` MCP tools available in this session include `list_projects`, `get_project`, `get_deployment`, and `deploy_to_vercel` — but `deploy_to_vercel` is an explicit **file-tree upload** deploy ("no git repo and no CLI needed... best for shipping an app you just generated") that creates a project **not connected to this repo's GitHub remote**, which would break the platform's normal git-integrated CI/CD flow (push to `develop` → CI → promote to `staging`/`main`, auto-deploy per environment). There is no MCP tool observed in this session for creating a **GitHub-linked** Vercel project with a specific `rootDirectory` against an existing repo. The plan must directly address how the two Vercel projects actually get created and root-directory-configured against this monorepo (Vercel dashboard's "Import Git Repository" flow, `vercel` CLI's `link`/`project` subcommands run locally, or the Vercel REST API directly) and be explicit about which of those an agent can drive autonomously vs. which needs the human user at a keyboard.

### Codebase Snapshot

- `sites/base-template/` — copy source; has `app/`, `components/`, `content/{blog,locations,projects,services,testimonials}/`, `lib/` (thin shims into `@platform/core-components`), `theme.config.ts`, `site.config.ts`, `tailwind.config.ts`, `vercel.json`.
- `sites/dch-automotive/` — most recent self-contained build; reference for `theme.config.ts` structure, `components/site-header.tsx` / `site-footer.tsx` / `components/pages/*.tsx` pattern, and its `vercel.json` (`buildCommand: cd ../.. && pnpm turbo run build --filter=dch-automotive`, no `outputDirectory`).
- `docs/guides/adding-new-site.md` — full 13-step new-site procedure (CLI tool `tools/create-site.ts`, or manual `cp -r sites/base-template`; Vercel project setup is Step 10, described as manual dashboard steps).
- `docs/guides/adding-content-section.md` — the generic pattern for adding a new top-level content type (used for merch/news here instead of its blog/products examples).
- `docs/standards/images.md` — R2 storage rules, `next/image` requirements, naming conventions, dev-mode `placehold.co` fallback pattern.
- `docs/standards/theme-component-contract.md` — **deprecated 2026-04-19**, historical context only; do not treat its CSS class list as a current requirement.
- `output/briefs/npracing/brief.md` — the NPRacing content brief: team background, available assets (logo, 3 photos, Instagram approved as an image source), page scope (landing/merch/news/contact confirmed; races proposed; sponsors dropped), merch store confirmed as The Clothing Kings with 8 products.
- `output/sessions/2026-08/2026-08-01_npracing-homepage-options/HANDOFF.md` — full handoff for this work: what's built (8 Artifact-published HTML pages for v1+v3), what's explicitly NOT done (no real site, no Vercel deploy), and named traps (don't reuse the Artifact HTML as source; `tokens.css` is the real source of truth; merch/news content only exists as hardcoded HTML today and needs re-verification of prices/URLs/dates before reuse).
- `output/sessions/2026-08/2026-08-01_npracing-homepage-options/prototype/tokens.css` — the actual finalised design tokens (red `#E11024` / black `#0a0a0a` / off-white palette, `Barlow Condensed`/`Barlow`/`Bebas Neue` font stack, pill-shaped nav/buttons, noise-overlay texture, stat strip, marquee ribbon) — the real source for both sites' `theme.config.ts` since v1 and v3 share the same token foundation and differ in layout/composition, not palette.
- `output/sessions/2026-08/2026-08-01_npracing-homepage-options/prototype/` also has the 8 built HTML pages (`design-01-gridbox.html`, `design-03-number51.html`, `merch-01-gridbox.html`, `merch-03-number51.html`, `news-01-gridbox.html`, `news-03-number51.html`, `contact-01-gridbox.html`, `contact-03-number51.html`) and an `assets/` folder with the real logo/photos/product images to be uploaded to R2 (not read yet by this reviewer — the plan should account for reading these to extract exact copy/layout/product data during implementation, not now).
- `worktree-strategy` skill — decision rule for when parallel Claude Code sessions should use git worktrees; directly relevant given two independent, concurrent site builds.
- `$SESSION_OBSERVABILITY_SKILL_PATH` env var is set, pointing at `~/Sites/claude-skills/skills/engineering-team/session-observability/scripts` — `/plan.to.yolo` will auto-wire progress/phase instrumentation into generated YOLO briefs if this is present.

### What a Good Plan Should Cover

- **Branch/worktree strategy** for building two independent sites in parallel without collision — one branch two agents, two branches one checkout, or two git worktrees (per the `worktree-strategy` skill)? State a concrete recommendation.
- **Content model translation:** exactly what MDX content types replace services/locations for NPRacing (merch, news, and what else — team/riders? a single "brand" page from `content/brand.md`?), with concrete Zod schema field lists for `merch` and `news` frontmatter.
- **theme.config.ts design token mapping** from `prototype/tokens.css` to the platform's `DeepPartialThemeConfig` shape — is a single shared token file workable given v1/v3 share the same palette/type but differ in layout composition (hero variant, header variant, card variant, etc. via `ComponentRegistry`)?
- **Component architecture:** what's genuinely shared between v1 and v3 (same content, same MDX schemas, same R2 asset library) vs. what's necessarily distinct (Header/Footer visual treatment, homepage hero layout, card grid style) — and whether any of that shared-but-site-specific logic belongs in a small local shared lib vs. just duplicated per the self-contained pattern's philosophy.
- **Image/asset pipeline sequencing:** concretely, what happens with the mockups' `assets/` folder and the merch product photos — real R2 upload now (if credentials are available and confirmed), or a placeholder-first build that still demonstrates the correct architecture, with R2 upload as an explicit tracked follow-up? State which, and why.
- **Merch/news content sourcing:** the product prices/URLs and article dates/quotes currently only exist as hardcoded HTML from a specific date (2026-08-01) — should the plan re-verify against the live retailer/BSB source before writing final MDX content, or explicitly accept the existing captured data as good enough for this pass?
- **Vercel project creation mechanics** — the single most concrete open question in this brief: how do two GitHub-linked Vercel projects with the right `rootDirectory` actually get created against this monorepo, using only what's actually available (Vercel CLI v50.10.0 locally, the `mcp__claude_ai_Vercel__*` MCP tools, or the human doing specific dashboard clicks)? Don't hand-wave this — either name the exact CLI commands/API calls that work, or say precisely which step needs the human and what they need to click.
- **Verification gates between phases** — what actually gets run and checked at each step (type-check, lint, content validation, local build, before ever touching Vercel).
- **`/plan.to.yolo` structure** — given the user wants "as many steps as possible" automated toward a Vercel deploy, should this synthesis become two separate YOLO briefs (one per site, parallelizable) or one brief with two parallel phases? Recommend one, with reasoning, and make sure each carries its own session-observability `run-id`.

---

## Deliverable

Produce a numbered implementation plan with:

- Clear phases/steps
- Which files are created or modified at each step
- Verification gates between steps (how to confirm each step succeeded before moving on)
- Any risks or trade-offs worth calling out

Save your response as `codex-plan.md` in `output/sessions/codex-peer-review/2026-08/2026-08-01_npracing-site-build/`.

Then output this command for the user to copy-paste into Claude Code:
`/plan.with.codex synthesise output/sessions/codex-peer-review/2026-08/2026-08-01_npracing-site-build/`
