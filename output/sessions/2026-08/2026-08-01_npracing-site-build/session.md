# Implementation Plan: NPRacing v1/v3 Site Build + Vercel Deploy

**Date:** 2026-08-01
**Status:** Approved for implementation — synthesised from dual-model peer review, user confirmed the open Vercel-branch question below on 2026-08-01
**Source:** Synthesised from Claude and Codex (`openai/gpt-5.6-sol` via OpenRouter) independent plans; full peer-review record at `output/sessions/codex-peer-review/2026-08/2026-08-01_npracing-site-build/`

**Resolved:** the two comparison sites' Vercel Production Branch targets `staging`, not `main` (user confirmed 2026-08-01). Both sites deploy for client review via `develop → staging`; promotion of the winning direction to `main` happens after the client picks one. Phase 9 and the "Open Questions" section below are updated accordingly.

## Key Differences Between Plans

| Aspect                     | Claude                                                                                                                 | Codex                                                                                                                                                                                                      | Synthesised Decision                                                                                                                                                                                                                                                                                                                                                                                                                                                                               |
| -------------------------- | ---------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Branch/worktree sequencing | Two worktrees off `develop` directly, on separate branches, from the start                                             | Bootstrap **both** site skeletons in one commit on a shared integration branch first, **then** fork into two worktrees from that commit, merge back into the integration branch before PR-ing to `develop` | **Codex's staged approach.** Claude's plan didn't solve the real risk of two parallel `pnpm install`s independently touching `pnpm-lock.yaml` from two different starting states. Codex's bootstrap-first sequencing removes that collision entirely — adopted as-is.                                                                                                                                                                                                                              |
| Content validation script  | Extend the root `scripts/validate-content.ts` to recognize `merch`/`news`/`team`                                       | Add **site-scoped** `sites/npracing-v1/scripts/validate-content.ts` / `-v3/...` instead                                                                                                                    | **Codex's site-scoped approach, with a follow-up.** Two worktrees both editing the shared root script concurrently is exactly the kind of collision the worktree split exists to avoid. Site-scoped validators sidestep it. Flag at integration time (Phase 8 below) whether the root script should later register these site-local validators for the "one command checks everything" convention — a decision, not an assumption, since it's a minor deviation from existing platform convention. |
| Brand/team content         | Hand-authored `about-page.tsx` pulling text directly from the loose `content/brand.md`                                 | A schema-validated MDX singleton, `content/brand/npracing.mdx`, through the same `lib/schemas/` + `listSlugs`/`loadMdx` pipeline as merch/news                                                             | **Codex's structured approach.** More consistent with the platform's hard "frontmatter IS the data" rule — a hand-read loose `.md` file is exactly the kind of ad hoc data path that rule exists to prevent. The existing `output/briefs/npracing/content/brand.md` becomes source material to migrate into the new schema, not something read live at runtime.                                                                                                                                    |
| Merch/news route shape     | Left as "decide during implementation"                                                                                 | Merch = index-only (cards deep-link out, no internal detail route); News = index **and** detail routes, with explicit reasoning (shareable URLs, room to grow, avoids re-truncating content)               | **Codex's decision, adopted outright** — it's a committed decision with sound reasoning, not a placeholder.                                                                                                                                                                                                                                                                                                                                                                                        |
| Vercel project creation    | Hedge: "verify live via `vercel --help`/Vercel docs before asserting a procedure"                                      | Concrete, numbered dashboard checklist (Import Git Repository → set Root Directory → no Output Directory override → set env vars → deploy)                                                                 | **Codex's checklist as the working procedure**, since it matches `docs/guides/adding-new-site.md`'s own already-documented Step 10 — two independent models and the platform's own docs converge on "this is dashboard-only, no scriptable git-linked project creation was found." Still worth a light sanity-check against the live dashboard UI at execution time (labels/flow can drift), not a full from-scratch verification.                                                                 |
| Image pipeline risk        | Flagged the `hero.image` local-path bug from project memory (silently renders "R2 URL Not Configured," no build error) | Did not mention this — Codex only had the codebase to read, not this repo's session memory                                                                                                                 | **Claude's catch, folded into Phase 5 below.** This is a real, previously-hit bug specific to this platform (`feedback_hero_image_local_path_bug.md`), invisible to `type-check`/`build`, and dangerous precisely because a placeholder-first workflow would trip it silently.                                                                                                                                                                                                                     |
| Business schema.org type   | Flagged `business.type` (`SportsTeam` vs. `HomeAndConstructionBusiness`) as needing a real answer, not a default       | Not addressed                                                                                                                                                                                              | **Claude's catch, added as an explicit task** in Phase 4.                                                                                                                                                                                                                                                                                                                                                                                                                                          |
| Contact form honesty       | "Structurally real form, decorative for now"                                                                           | Explicit: must not imply successful delivery under any circumstance; no fake success state                                                                                                                 | **Codex's stricter framing, adopted verbatim** — sharper and closes a real risk (a form that silently "succeeds" while sending nothing).                                                                                                                                                                                                                                                                                                                                                           |

## Blind Spots Caught

- **Codex caught the lockfile/worktree collision risk that Claude's plan left unresolved** — Claude's plan flagged worktree isolation as the right call but didn't work through what happens when two independent `pnpm install`s in two worktrees both touch the same `pnpm-lock.yaml` from a diverging base. Codex's bootstrap-commit-first sequencing removes the problem by construction.
- **Claude caught a live, previously-encountered platform bug that Codex had no way to know about** — the MDX `hero.image` local-path failure mode lives only in this project's session memory (`feedback_hero_image_local_path_bug.md`), not in any file Codex was pointed at. This is exactly the kind of thing a fresh model, however good, cannot catch from the repo alone.
- **Codex's integration phase (step 11 in its plan) already does the "compare the two sites for accidental drift" check Claude flagged only as an unresolved risk** — content/theme-token parity comparison at merge time is folded into the synthesised Phase 8 below rather than left as a dangling concern.
- **Neither model questioned which branch the two Vercel projects' "Production Branch" should track** — both defaulted to assuming `main`, following the platform's standard promotion flow literally. But the two sites are explicitly a **pre-decision comparison build** — the client hasn't chosen a direction, and per the existing brief, one of v1/v3 (or neither) may be discarded after they do. Publishing two speculative, soon-to-be-partially-discarded builds all the way to `main` (this platform's production environment, reserved elsewhere for confirmed live client sites) conflates a comparison tool with a production deployment. **This needs your decision before Phase 9 (Vercel project creation) runs** — see "Open Questions for You" below. The plan below defaults to targeting `staging` for the comparison, with `main` promotion deferred until a direction is chosen, but this is a recommendation, not a resolved fact — flag if you want it done differently.

---

## Implementation Plan

### Phase 1 — Bootstrap both site skeletons on a shared integration branch

**Branch:** `feature/npracing-sites`, created from `develop`.

1. Confirm `develop` is clean and up to date.
2. Create `feature/npracing-sites` from `develop`.
3. On that branch, in one commit: `cp -r sites/base-template sites/npracing-v1` and `sites/npracing-v3`, rename `package.json` names, run `pnpm install` once so `pnpm-lock.yaml` reflects both new workspace packages in a single consistent state.
4. From this bootstrap commit, create two feature branches: `feature/npracing-v1`, `feature/npracing-v3`.
5. Check each branch out into its own git worktree (`git worktree add ../lbp-npracing-v1 feature/npracing-v1`, same for v3), one implementation session per worktree, each restricted to editing only its own site directory.
6. Each session gets its own session-observability `--run-id` (`npracing-v1`, `npracing-v3`) — `$SESSION_OBSERVABILITY_SKILL_PATH` is already set in this environment, so `/plan.to.yolo` will auto-wire this in without extra setup.

**Verification gate:** both worktrees exist, point at distinct branches sharing the same bootstrap commit; `git status` clean in both; neither site directory is touched by the other worktree's session.

### Phase 2 — Inspect references and record the implementation contract (both worktrees, before writing production code)

Read, don't assume, in each worktree: `sites/dch-automotive/` (current self-contained pattern — `theme.config.ts`, `components/site-header.tsx`, `components/site-footer.tsx`, `components/pages/*`), `docs/guides/adding-new-site.md`, `docs/guides/adding-content-section.md`, `docs/standards/images.md`, `docs/standards/schema.md`, `output/briefs/npracing/brief.md`, the NPRacing `HANDOFF.md`, `prototype/tokens.css`, all 8 prototype HTML files (composition/copy reference only — never copy their base64 assets or embedded styles), and `prototype/assets/`.

Confirm current `lib/mdx.tsx` signatures, `ContentType` union, sitemap conventions, and `next/image` remote-pattern config before writing any code against assumed APIs.

**Verification gate:** every config key and loader API used in later phases is confirmed against current repo code, not assumed from either independent plan.

### Phase 3 — Site-config adaptation

Inspect `BaseSiteConfig` rather than assuming local-service fields are optional or forcing fabricated data into them.

- If `serviceAreas`/`services` already tolerate empty arrays, leave the shared type alone and just supply empty/minimal truthful values.
- Add NPRacing-specific fields (team name, championship, race number, rider name, Instagram, merch-store URL) as a site-local extension, not fabricated into unrelated shared fields.
- **Resolve the `business.type` schema.org question explicitly** (Claude's catch) — check `docs/standards/schema.md` for what's actually supported; `SportsTeam` is the likely correct type but must be confirmed against the schema doc, not assumed.
- If a shared-type change is genuinely unavoidable, make the smallest backwards-compatible change (optional field, not a breaking rename) and re-run root type-check across all existing sites before committing.

**Verification gate:** no fabricated locations/services data in either config; existing sites still type-check if any shared type changed.

### Phase 4 — Content architecture (per-worktree, schemas + MDX + loader wiring)

Three MDX-backed content types, each site owning its own schema/content/loader files (duplication is intentional — see "Duplication decision" below):

- **`merch`** — 8 products, index-route only (no internal detail route; cards deep-link to The Clothing Kings). Frontmatter: `title`, `description`, `externalUrl`, `priceAmount` (minor GBP units) + `displayPrice` (retailer's formatting), `currency: "GBP"`, `image` (`src`/`alt`/`width`/`height`), `category`, `sortOrder`, `featured`, `available`, `capturedAt`.
- **`news`** — 2 articles at launch, index **and** `[slug]` detail routes. Frontmatter: `title`, `excerpt`, `publishedAt`, `sourceName`, `sourceUrl`, `heroImage` (`src`/`alt`/`width`/`height`), `tags`, `featured`, `draft`. MDX body is original/approved team copy, not a wholesale reproduction of the source article — summarize with attributed quotes and a clear source link.
- **`brand`** — one singleton file, `content/brand/npracing.mdx`, migrated from the existing `output/briefs/npracing/content/brand.md`. Frontmatter: `teamName`, `tagline`, `championship`, `raceNumber`, `riderName`, `email`, `instagramHandle`/`instagramUrl`, `logo`. Body: team history/narrative. Homepage and contact-page team copy loads from this file through the normal MDX pipeline — not read as a loose `.md` file at runtime.

Extend each site's local `ContentType` union with `merch`/`news`/`brand`; add `lib/schemas/{merch,news,brand}.ts`; use the existing `listSlugs`/`loadMdx` pattern.

**Validation:** add a site-scoped `sites/npracing-v1/scripts/validate-content.ts` (and v3 equivalent) as a package script, rather than editing the shared root `scripts/validate-content.ts` from two concurrent worktrees. It should validate frontmatter against each Zod schema, reject duplicate slugs/malformed URLs/missing alt text, and enforce the expected record counts (8 merch, 2 news, 1 brand) for this launch. **Flag at Phase 8 (integration)** whether these should be registered with the root validator for consistency with the platform's "one command validates everything" convention — a decision to make once both sites exist, not before.

**Verification gate:** `pnpm --filter npracing-v1 run validate-content` (and v3) pass; at least one deliberately invalid fixture is tested to confirm the schema actually rejects bad content, not just accepts good content.

### Phase 5 — Re-verify content, then resolve the image pipeline

**Content re-verification** (before finalizing MDX): re-open the 8 retailer product URLs and confirm current price/availability/image against the captured 2026-08-01 data; re-check both BSB source URLs for date/quotes/terminology accuracy. If a source can't be re-verified live, keep the captured value but mark it provisional in the record (`capturedAt` date) and call this out explicitly in the final handoff — don't invent replacements, don't silently present unverified data as final.

**Image pipeline** — check R2 upload access is actually available in this environment before assuming it (credentials/wrangler access), rather than assuming from the docs that it "just works":

- **If available:** upload real assets (logo, 3 team/action photos, 8 merch product photos, any curated news images) to R2 per `docs/standards/images.md` naming conventions, one shared NPRacing asset library referenced by both sites' MDX (same R2 objects, no binary duplication in git). Configure `next/image` remote patterns for the R2 host.
- **If unavailable:** use the documented `placehold.co` dev fallback, but **route it through actual `<Image>`/URL config, never through an MDX `hero.image` pointing at a local `/public` path** — that specific pattern is a known, previously-hit bug on this platform: it silently renders an "R2 URL Not Configured" placeholder with no build error, only visible on the rendered page. Produce an asset manifest (source file → intended R2 key → placement → required crop/alt text) so swapping in real URLs later is a data change, not a rebuild. Any placeholder-based deployment must be labeled provisional in the handoff — not presented as final for client comparison.
- Either way, this is a real blocking dependency for a client-facing comparison to look finished — surface the R2-access outcome to the user immediately, don't discover it late.

**Verification gate:** at least one hero image is checked in an actual `pnpm dev` render (not just a successful build) to catch the local-path trap specifically, since it's invisible to `type-check`/`build`.

### Phase 6 — Theme tokens and component architecture

Translate `prototype/tokens.css`'s actual values (red `#E11024`, black `#0a0a0a`, off-white `#F3F2EE`, Barlow Condensed/Barlow/Bebas Neue) into each site's `DeepPartialThemeConfig`, following `dch-automotive`'s current shape — not `base-template`'s pre-migration `registry: { theme: 'vega' }` pattern. Both sites share the same palette/type foundation; **duplicate it across both `theme.config.ts` files deliberately** rather than building a shared runtime package — consistent with the self-contained-sites rule, and it keeps the two comparison builds genuinely independent in case one is discarded after the client decides.

Build local, hand-authored components per the mockups' actual bespoke layouts (neither design maps cleanly onto `packages/core-components`' generic composable sections): `components/site-header.tsx`, `components/site-footer.tsx`, `components/pages/home-page.tsx`, `components/pages/{merch,news-index,news-detail,contact}-page.tsx`, plus site-specific section components (v1: full-bleed cinematic hero, stat strip, marquee ribbon; v3: race-number-51 poster hero, editorial blocks). Semantic Tailwind classes only (`bg-brand-primary`, never hardcoded hex); no `theme()` calls in plain CSS; respect `prefers-reduced-motion` for the marquee/reveal/decorative animation the mockups use.

Contact form: correct semantic `<form>` markup, labels, required fields, validation-ready — but must not imply successful delivery under any circumstance (no fake success state). Disable submission with an honest "coming soon" note, or intercept with a clear non-sending status. Real Resend wiring is an explicit tracked follow-up, not part of this pass.

**Verification gate:** grep both sites for hardcoded hex in components (reject any hit) and `theme(` in plain CSS (reject any hit); all routes render; keyboard nav/focus order/contrast pass a basic accessibility check; no horizontal overflow at common mobile widths; motion respects `prefers-reduced-motion`.

### Phase 7 — Per-site quality gates (each worktree, before integration)

In each worktree: `run validate-content`, `run lint`, `run type-check` (site-level + root `npm run type-check`), `run build` (confirm `next build --webpack` in the logs, not Turbopack), a local `next start` smoke test hitting every route, and a search-based architecture check (no `@platform/themes/*` runtime imports, no hardcoded product/news arrays, no committed image binaries, no `outputDirectory`/`ignoreCommand` in `vercel.json`). The pre-push hook only runs `type-check` — it is not sufficient on its own; don't treat a successful push as proof the site is ready.

### Phase 8 — Integrate both branches

Merge `feature/npracing-v1` and `feature/npracing-v3` back into `feature/npracing-sites`. At this point, explicitly:

- Resolve `pnpm-lock.yaml` deterministically (should be low-risk given the shared bootstrap commit).
- Compare the two sites' duplicated content and theme tokens side by side to catch accidental drift (a typo'd hex value, a factual mismatch in team copy) — differences should be compositional (layout/component choices), not accidental content divergence.
- Decide the root-validator registration question deferred from Phase 4.
- Run `pnpm install --frozen-lockfile`, root type-check, both lints, both content validations, both builds from the integration branch.

Then: PR `feature/npracing-sites` → `develop`, verify CI (`gh run watch`), and stop — **do not auto-promote to `staging`/`main`** without confirming the "Open Questions for You" item below about which environment the client-comparison URLs should actually target.

### Phase 9 — Vercel project creation (human-required dashboard steps)

The available `mcp__claude_ai_Vercel__deploy_to_vercel` tool is a file-tree upload deploy for repo-less apps — using it would create a project disconnected from this repo's GitHub remote, breaking the platform's normal git-integrated CI/CD. It must not be used for the final deployment (a throwaway diagnostic preview is the only acceptable use, if that's ever needed).

Per `docs/guides/adding-new-site.md` Step 10, and confirmed independently by both peer-review plans, creating a GitHub-linked Vercel project with a monorepo `rootDirectory` is a **dashboard-only** action — no scriptable path was found in the tools available this session:

For each site (`npracing-v1`, `npracing-v3`):

1. Vercel dashboard → Add New → Project → Import Git Repository → select `local-business-platform`.
2. Project name: `npracing-v1` (or `-v3`). Root Directory: `sites/npracing-v1` (or `-v3`). Framework preset: Next.js (auto-detected).
3. Do **not** set an Output Directory override.
4. Set Production Branch to **`staging`** (confirmed 2026-08-01) — not `main` — until a direction is chosen and the winning site is promoted separately.
5. Add required env vars (`NEXT_PUBLIC_SITE_URL`, `RESEND_API_KEY`, `BUSINESS_EMAIL`, shared `SUPABASE_URL`/`SUPABASE_SERVICE_KEY`, `NEXT_PUBLIC_R2_PUBLIC_URL`).
6. Deploy.

After project creation, an agent with an authenticated local Vercel CLI (v50.10.0 confirmed installed) can `vercel link` each site directory to its now-existing project, `vercel pull` to confirm settings, and inspect deployments/build logs — this part is agent-executable and doesn't need the human again.

**Verification gate:** each project is connected to the correct GitHub repo, Root Directory is exactly right, no Output Directory override, a git push actually triggers a deployment, and the default `*.vercel.app` URL renders the correct design (not the other site's).

### Phase 10 — Validate deployed URLs side by side

Both URLs return 200 on all routes; invalid news slugs 404; images load (R2, not a broken placeholder, unless explicitly still in the flagged-provisional state); merch cards open the verified retailer URLs; no hydration/console errors; contact form never falsely reports success. Produce a short comparison handoff: both URLs, deployment commit SHA, asset status (R2-final vs. placeholder-provisional), content verification date, known follow-ups (Resend wiring, Facebook URL still pending, custom domain not yet cut over), and an explicit confirmation that no direction has been selected yet.

### Phase 11 — Two parallel `/plan.to.yolo` briefs

Given the worktree split, this becomes **two separate YOLO briefs**, not one brief with parallel phases:

- **Brief A (v1):** scope `sites/npracing-v1/**` only, branch/worktree `feature/npracing-v1`, observability run-id `npracing-v1`.
- **Brief B (v3):** scope `sites/npracing-v3/**` only, branch/worktree `feature/npracing-v3`, observability run-id `npracing-v3`.
- A short third, manually-supervised integration brief (or a manual session) covers Phase 8 (lockfile/turbo.json/root checks/PR) and Phase 9 (Vercel creation checklist) — these touch shared state and shouldn't run unattended inside either site's worktree.

Each site brief carries its own required gates (content validation, lint, type-check, webpack build, route smoke tests) as its Failure-contract, per the platform's existing YOLO brief conventions.

---

## Open Questions

1. ~~Which Vercel "Production Branch" should the two comparison sites track?~~ **Resolved 2026-08-01: `staging`.**
2. **Facebook profile URL** — still outstanding from the original brief; needed for the Contact page link and as an additional Instagram-adjacent image source. Not blocking the build, but should land before final client-facing review.
3. **R2 credential availability** — needs an actual check at the start of implementation (Phase 5), not an assumption either way.
4. **Root `scripts/validate-content.ts` registration** — deferred to Phase 8; confirm whether you want the site-scoped validators folded into the shared script or left standalone.

---

## Next Step

Feed this spec to `/plan.to.yolo` for the two parallel briefs described in Phase 11.
