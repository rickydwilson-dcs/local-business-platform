# Claude's Independent Plan: NPRacing v1/v3 Site Build

**Written before seeing Codex's plan.**

## Phase 0 — Branch/worktree strategy

**Recommendation: two git worktrees, two feature branches, off `develop`.**

The user explicitly wants v1 and v3 worked on in parallel, likely as two separate unattended `/plan.to.yolo` runs. That's exactly the scenario the `worktree-strategy` skill's decision rule calls out (2+ concurrent long-running sessions on independent work), not the "single feature branch, sub-agents inside one session" case — two long-running YOLO orchestrators sharing one checkout would race on `pnpm-lock.yaml`, `git status`, and any incidental root-level file touch (e.g. `turbo.json` if either site needs a new env var declared).

- `git worktree add ../lbp-npracing-v1 -b feature/npracing-v1-site develop`
- `git worktree add ../lbp-npracing-v3 -b feature/npracing-v3-site develop`
- Each worktree gets its own `pnpm install` (needed anyway since each is a distinct checkout).
- Both branches merge back to `develop` independently (two small PRs, or two sequential fast-forward merges) — whichever lands first doesn't block the other, since they touch disjoint `sites/` subtrees.
- Both must be on `develop` (and promoted through `staging`/`main`) before the client can compare live URLs, since Vercel preview deploys off feature branches aren't a substitute for the platform's normal environment promotion (per root `CLAUDE.md`, this platform's Vercel projects deploy per-branch/per-environment, not per-arbitrary-feature-branch — this needs confirming from `docs/standards/deployment.md` during implementation, not assumed here).

**Trade-off called out:** worktrees cost setup time and disk vs. one checkout with sequential work. Given the user asked for parallel and the two builds are large (dozens of files each), the isolation is worth it here — this would be the wrong call for a small fix.

## Phase 1 — Content model & Zod schemas

New MDX collections, added identically to both sites (content differs where v1/v3 copy differs, schema shape is shared):

- `content/merch/*.mdx` — schema: `title`, `price` (string, formatted e.g. "£24.99"), `image` (R2 path), `externalUrl`, `category` (enum: t-shirt/beanie/cap/hoodie/robe), `description` (optional), `featured` (optional bool).
- `content/news/*.mdx` — schema: `title`, `publishedAt` (ISO date), `source` (e.g. "britishsuperbike.com"), `sourceUrl`, `excerpt`, `heroImage` (optional).
- `content/team/*.mdx` — one file per rider (Brayden Elliott, Connor Thomson, any others from `content/brand.md`) — schema: `name`, `role` (e.g. "Race Rider — #51"), `photo`, `bio`, `joinedDate` (optional).

Each gets: `lib/schemas/merch.ts`, `lib/schemas/news.ts`, `lib/schemas/team.ts` (Zod), following `docs/guides/adding-content-section.md`'s pattern exactly — index page, `[slug]` detail page (news only needs this; merch cards link externally so may not need a detail route — decide during implementation whether 2 news articles justify detail pages or an index-only page with expandable excerpts is enough), section `sitemap.ts`, registration in `app/sitemap-index.xml`.

**Extend, don't replace, `scripts/validate-content.ts`:** add `merch`/`news`/`team` as new recognized types alongside the existing `services`/`locations`, rather than writing a parallel bespoke validator — keeps `npm run validate:content` as the one command that checks everything.

A single "brand/about" section (drawing from `content/brand.md`'s team background, base, manufacturer, championship, owner info) — likely a hand-authored `app/about/page.tsx` in the self-contained style (like `dch-automotive`'s pattern), not an MDX collection, since it's one page, not a repeating item type. Pull copy from `content/brand.md` directly rather than re-deriving it.

**Verification gate:** `npx tsx ../../scripts/validate-content.ts merch`, `news`, `team` all pass against seeded sample content before building any page UI on top.

## Phase 2 — Image/asset pipeline (do this before wiring hero images into MDX)

**Known trap, confirmed from project memory:** MDX `hero.image` pointing at a local `/public` path silently renders an "R2 URL Not Configured" placeholder — no build error, only visible on the rendered page. This means placeholder-first + wire-later is actively dangerous for hero images specifically; it's easy to ship a broken-looking hero and not notice.

- **Step 1:** verify R2 upload access is actually available in this environment before assuming it (`wrangler whoami`, check for `CLOUDFLARE_API_TOKEN`/R2 credentials in env). Don't assume — this is exactly the kind of vendor/environment fact that needs checking live, not from memory.
- **If R2 access is available:** upload the real assets now — logo, 3 team/action photos, 8 merch product photos (from `prototype/assets/` and the retailer listing), following `docs/standards/images.md` naming/folder conventions (`npracing-v1/hero/...`, `npracing-v3/hero/...` — separate site folders per the standard, even though the source images are shared between both directions). News article images can stay hotlinked to source or be a small curated set — lower priority than hero/product images.
- **If R2 access is not available:** stop and flag this to the user explicitly rather than silently shipping the known-broken local-path pattern. Do not fall back to `/public` hero images as a silent workaround.
- Build the `getImageUrl()`-style helper (per the images standard) into each site's `lib/image.ts` (this is likely already present from `base-template` — verify, don't recreate).

**Verification gate:** at least one hero image round-trips through the real `next/image` + R2 URL path in a local `pnpm dev` render (not just "the code compiles") before moving on — this is the specific failure mode the memory note describes, and it's invisible to `type-check`/`build`.

## Phase 3 — Site scaffolding

For each of `sites/npracing-v1` and `sites/npracing-v3`:

- `cp -r sites/base-template sites/npracing-v1` (and `-v3`).
- `package.json` — rename to `npracing-v1`/`npracing-v3`.
- `theme.config.ts` — translate `prototype/tokens.css`'s actual values (red `#E11024`, black `#0a0a0a`, off-white `#F3F2EE`, `Barlow Condensed`/`Barlow`/`Bebas Neue`) into `DeepPartialThemeConfig`. Both sites share the same palette/type — this is deliberate duplication across two files, consistent with the self-contained-sites philosophy (no shared runtime package), not a bug to fix. Follow `dch-automotive`'s `theme.config.ts` as the current-pattern reference over `base-template`'s (which still uses the pre-migration `registry: { theme: 'vega' }` shape and hasn't itself been migrated to self-contained).
- `site.config.ts` — adapt `BaseSiteConfig`: NPRacing isn't a conventional local-service business, so `serviceAreas`/`services` arrays either go empty or get repurposed; `business.type` schema.org type needs a real answer (likely `SportsTeam` rather than `HomeAndConstructionBusiness` — check `docs/standards/schema.md` for what's actually supported before assuming). `slug` fields: `npracing-v1`, `npracing-v3` (needed for rate-limit isolation per the guide, even though contact-form rate limiting matters less here — keep it for consistency).
- Components — hand-author `components/site-header.tsx`, `components/site-footer.tsx`, `components/pages/home-page.tsx`, `components/pages/merch-page.tsx`, `components/pages/news-page.tsx` (+ detail if applicable), `components/pages/about-page.tsx`, matching `dch-automotive`'s file layout. These should be **built from the mockup HTML's actual layout/motion** (nav pill shape, stat strip, marquee ribbon, noise-overlay texture, card styles — all already fully specified in `tokens.css`'s CSS and the mockup HTML's markup), translated into Tailwind + theme tokens — not copy-pasted (the mockup HTML is base64-embedded-font throwaway per the handoff's explicit warning).
- `app/` routes: `page.tsx` (home), `merch/page.tsx`, `news/page.tsx` (+`[slug]` if applicable), `about/page.tsx`, `contact/page.tsx` (reuse `base-template`'s `contact-form.tsx` component and API route as-is — the form's backend already exists platform-wide, this isn't NPRacing-specific work).
- `vercel.json` per site — same shape as `dch-automotive`'s (`buildCommand: cd ../.. && pnpm turbo run build --filter=npracing-v1`, no `outputDirectory`).

**Verification gate:** `pnpm --filter npracing-v1 run type-check` and `run lint` pass; repeat for v3.

## Phase 4 — Local build verification

- `pnpm --filter npracing-v1 run build` (must be the `--webpack` production build path, not `next dev`'s Turbopack) — repeat for v3.
- `pnpm --filter npracing-v1 run dev` and manually check home/merch/news/about/contact render correctly, brand colors apply, nav/footer work, mobile responsive — this is the step that catches the hero-image R2 trap if Phase 2 was somehow skipped or misconfigured.
- Run `npx tsx ../../scripts/validate-content.ts merch|news|team` one more time against final content.

## Phase 5 — Vercel project creation & deploy

This is the least-certain part of the plan and should not be over-specified without live verification:

- Confirm exactly how a **GitHub-linked** Vercel project (not a bare file-tree upload) gets created against this monorepo with `rootDirectory: sites/npracing-v1` — check `vercel link --help`, `vercel project --help`, `vercel git --help` live, and/or `mcp__claude_ai_Vercel__search_vercel_documentation` if that tool is available, rather than asserting CLI behavior from training data (root `CLAUDE.md`'s "Facts" rule: verify vendor behavior against the live system or vendor docs, mark anything unverified as an explicit assumption).
- The `mcp__claude_ai_Vercel__deploy_to_vercel` MCP tool is a **file-tree upload** deploy that is explicitly for apps with no git repo — using it would create a project disconnected from this repo's GitHub remote, breaking the platform's normal CI/CD promotion flow. Flag this clearly rather than defaulting to it for convenience.
- Most likely outcome: initial GitHub-repo-linked project creation with the correct Root Directory needs the human user at the Vercel dashboard (Import Git Repository → select `local-business-platform` → set Root Directory to `sites/npracing-v1` during import, per `docs/guides/adding-new-site.md` Step 10) — the CLI's `vercel link` typically links a _local directory_ to a project record but the initial GitHub-integration + monorepo root-directory pairing during first import has historically been a dashboard-only action on Vercel (this is exactly the thing the user flagged uncertainty about — confirm rather than guess). If the CLI or API genuinely can do this unattended, say so explicitly with the exact commands; otherwise the plan's final deliverable should be a precise, copy-pasteable dashboard checklist the user can run in under 2 minutes per site.
- Required env vars per `docs/guides/adding-new-site.md` Step 11 (`NEXT_PUBLIC_SITE_URL`, `RESEND_API_KEY`, `BUSINESS_EMAIL`, shared `SUPABASE_URL`/`SUPABASE_SERVICE_KEY`, `NEXT_PUBLIC_R2_PUBLIC_URL`) — these are account/secret actions, list them precisely as a checklist rather than attempting to set them programmatically.
- Push each feature branch, verify CI (`gh run watch`), merge to `develop`, then follow the normal `develop → staging → main` promotion (`/deploy.changes`) once both sites are confirmed working — the client-comparison URLs likely want at least `staging`, possibly `main`, depending on how "live for client review" is defined; confirm with the user before promoting to `main` since that's a shared-state action.

**Verification gate:** both Vercel deployments return 200 on their preview/production URL, hero images render (not the R2-placeholder), nav/merch/news/contact all reachable.

## Phase 6 — Recommend two `/plan.to.yolo` briefs, not one

Given the worktree-per-site structure in Phase 0, this naturally becomes **two separate YOLO briefs** — `output/sessions/.../npracing-v1-yolo-brief.md` and `.../npracing-v3-yolo-brief.md` — each launched as its own autonomous session in its own worktree, each with its own `session-observability` `--run-id` (`npracing-v1`, `npracing-v3`) so `/observe.status npracing-v1` and `/observe.status npracing-v3` can be checked independently. One combined brief with "phase 3a/3b run in parallel" would fight the worktree isolation this plan already recommends.

## Risks / trade-offs

- **R2 credential availability is the single biggest unknown** — if unavailable, the whole "real, deployable comparison" goal degrades to "structurally correct but visually broken" until resolved. Surface this immediately, don't discover it at Phase 5.
- **Vercel git-linked project creation may not be scriptable at all** — budget for "the agent prepares everything up to a 2-minute manual dashboard step" as the realistic ceiling, not a fully unattended deploy.
- **Two YOLO runs in two worktrees means two separate contexts** — if content (e.g. the shared `theme.config.ts` token values, or a shared `content/team/*.mdx` set) needs to change identically in both, there's no automatic sync; a follow-up "diff the two sites' shared inputs" step may be worth adding to catch drift.
- **schema.org business type for a sports team** is genuinely uncertain (`docs/standards/schema.md` needs checking, not assumed) — flag rather than guess.
