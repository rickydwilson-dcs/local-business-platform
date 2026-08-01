# YOLO Implementation Brief: NPRacing v3 "Number 51" — real platform site

**Branch:** `feature/npracing-v3` (already created, forked from the shared bootstrap commit `a477d76f` on `feature/npracing-sites`)
**Worktree:** `/Users/rickywilson/Sites/lbp-npracing-v3` — run this brief from inside this directory. This worktree is isolated from `feature/npracing-v1`'s worktree; **only edit files under `sites/npracing-v3/`** in this repo checkout.
**Session spec:** `output/sessions/2026-08/2026-08-01_npracing-site-build/npracing-v3-yolo-brief.md`
**Mode:** Autonomous execution — coordinate all phases, delegate implementation to sub-agents, verify after each, STOP on error
**Orchestrator model:** sonnet — coordinator only; per-phase `**Model:**` tiers attach to delegated sub-agents and are independent of this

---

## Context

**Plan source:** Dual-model peer review (`output/sessions/codex-peer-review/2026-08/2026-08-01_npracing-site-build/synthesis.md`)

NPRacing is a British Superbike team's brand-building website. Two homepage design directions were prototyped as static HTML mockups and shown to the client as Claude Artifacts; the client has not yet picked between them. This brief builds **v3 "Number 51"** (bold poster style built around the team's race number) as a real, production-quality Next.js site on this platform's actual architecture — MDX content, theme-config/Tailwind tokens, self-contained-site pattern — so it can be compared against v1 on a real Vercel URL. A sibling brief (`npracing-v1-yolo-brief.md`) builds the other direction in a separate worktree at the same time; do not touch `sites/npracing-v1/`.

The full synthesised plan is at `output/sessions/2026-08/2026-08-01_npracing-site-build/session.md` — read it once at the start of Phase 1 for full context on decisions already made (Vercel target is `staging`, not `main`; content-validation is site-scoped not root-shared; brand content is a schema-validated MDX singleton, not a hand-read `.md` file). This brief expands that plan's Phases 2–7 (scoped to `sites/npracing-v3/` only) into executable steps. Phase 1 (bootstrap) and Phases 8–10 (integration, Vercel project creation, deployed-URL validation) are handled outside this brief by the orchestrating session once both v1 and v3 branches are ready.

Implement the plan exactly as specified below. It was dual-model reviewed and approved — hold to the gates.

## Model Tiers

| Tier   | Alias    | Cost (in/out per MTok) | Use for                                                                                             |
| ------ | -------- | ---------------------- | --------------------------------------------------------------------------------------------------- |
| Opus   | `opus`   | $5 / $25               | Phases with >5 interdependent files, architectural rewrites, judgment calls not covered by the spec |
| Sonnet | `sonnet` | $3 / $15               | Standard implementation — file edits, feature wiring, most phases                                   |
| Haiku  | `haiku`  | $1 / $5                | Mechanical tasks: find-replace, import additions, grep checks, content validation                   |

Default orchestrator: **sonnet**. Default sub-agent: **sonnet** unless the task is clearly mechanical (→ haiku) or requires deep cross-file reasoning (→ opus).

## Delegation Model

The orchestrator is a **coordinator, not an implementer**. Its job is: read this brief,
sequence the phases, dispatch sub-agents, run verification gates, make commits, and write
the final report. It does **not** implement phase work inline by default.

**Every phase's implementation work is delegated to one or more `Task` sub-agents**, each
spawned at the phase's `**Model:**` tier. The model annotation _is_ the sub-agent's model —
it is meaningless unless the work is delegated, because the orchestrator cannot change its
own running model. A `**Model:** haiku` phase executed inline runs at full orchestrator
cost and consumes orchestrator context; delegating it keeps that work in the sub-agent and
returns only a short summary.

**Inline exception.** The orchestrator may implement a phase inline ONLY when the work is
tightly cross-coupled and correctness-critical — e.g. a deterministic engine spanning many
interdependent files with exact golden vectors — where round-tripping through a sub-agent
would lose essential context. When taken, the phase MUST declare
`**Execution:** inline (exception) — <one-line rationale>`. This is the exception, not the
default; prefer delegation whenever the work is separable.

The orchestrator's own model (set by the launch command) is **independent** of the phase
tiers. Opus orchestrating while individual phases delegate to haiku/sonnet sub-agents is
expected and correct — the orchestrator coordinates; the tiers attach to sub-agents.

---

## Pre-flight

```bash
# Already on feature/npracing-v3, in the isolated worktree — do NOT create a new branch or checkout develop
cd /Users/rickywilson/Sites/lbp-npracing-v3
git status   # must be clean, HEAD at the bootstrap commit
git log --oneline -3

# Sanity gate — confirm the workspace links correctly before starting
pnpm --filter npracing-v3 run type-check
```

**Session observability run-init:** `$SESSION_OBSERVABILITY_SKILL_PATH` is set in this environment (points at `~/Sites/claude-skills/skills/engineering-team/session-observability/scripts`). After the sanity gate passes:

```bash
python3 "$SESSION_OBSERVABILITY_SKILL_PATH/session_observability.py" phase \
  --run-id npracing-v3 --phase-id phase-0 --phase-name "Pre-flight" --event start --total-phases 8
```

---

## Phase 1: Inspect references and record the implementation contract

**Goal:** Confirm every API/pattern this brief assumes actually exists in the current codebase before writing production code against it — do not trust the brief's file/API names blindly.
**Model:** sonnet — research and synthesis, not mechanical
**Execution:** delegate to 1 sonnet sub-agent
**Failure contract:**

- **Fail fast.** Any uncaught exception aborts the phase immediately — do not swallow it, retry blindly, or continue to the next step.
- **Show the evidence.** On failure, print the full traceback AND the offending record (the exact input/row/item being processed when it threw). No bare error messages.
- **No partial passes.** A phase that processed only some of its records has FAILED, not passed. Never report success on partial data — surface the shortfall.
- **Verdict line, always.** End the phase with exactly one line: `PASS — <n>/<total> records, 0 errors` or `FAIL — <n>/<total> records, <e> errors: <first offending record>`. The counts are mandatory, on both PASS and FAIL.
  **Gate contract:**
- **(a) Golden-fixture test:** n/a — pure inspection, no code written this phase.
- **(b) Invariant on real data:** every file/API path the later phases reference (below) is confirmed to exist by `cat`/`grep` against the actual repo, not assumed from this brief's prose.
- **(c) Rollback:** n/a — no files changed.
- **(d) Hard fail:** any referenced file/API that does NOT exist in the repo and has no adopted substitute recorded in the inspection notes.

Task: Inspect reference implementation and record the contract
model: sonnet
Prompt: |
Read, in this order, and take notes (don't just skim):

1. `sites/dch-automotive/theme.config.ts`, `sites/dch-automotive/components/site-header.tsx`,
   `sites/dch-automotive/components/site-footer.tsx`, `sites/dch-automotive/components/pages/home-page.tsx`
   — this is the current self-contained-site pattern (type-only import from `@platform/theme-system`,
   no runtime import from `@platform/themes/*`). This is the pattern to replicate, NOT
   `sites/npracing-v3/theme.config.ts`'s current copied-from-base-template `registry: { theme: 'vega' }` shape.
2. `docs/guides/adding-content-section.md` — the pattern for adding a new MDX content type.
3. `docs/standards/images.md` — R2 naming/folder conventions, `next/image` requirements,
   the `placehold.co` dev fallback pattern.
4. `docs/standards/schema.md` — what JSON-LD business types this platform's schema helpers
   actually support, to resolve whether `SportsTeam` is usable or something else is needed
   for `site.config.ts`'s `business.type`.
5. `sites/npracing-v3/lib/mdx.tsx`, `sites/npracing-v3/lib/content.ts`, `sites/npracing-v3/lib/site.ts`,
   `sites/npracing-v3/lib/schema.ts`, `sites/npracing-v3/site.config.ts`, `sites/npracing-v3/scripts/validate-content.ts`
   — the actual current shims and their exact function signatures (this is a copy of
   base-template's, not yet customized).
6. `output/briefs/npracing/brief.md` and `output/briefs/npracing/content/brand.md` — the
   source content brief and raw team/brand copy.
7. `output/sessions/2026-08/2026-08-01_npracing-homepage-options/HANDOFF.md` and
   `output/sessions/2026-08/2026-08-01_npracing-homepage-options/prototype/tokens.css` —
   the finalised design tokens (source of truth for `theme.config.ts` — NOT the mockup HTML,
   which is throwaway per the handoff's explicit warning).
8. `output/sessions/2026-08/2026-08-01_npracing-homepage-options/prototype/design-03-number51.html`
   — v3's composition/copy reference ONLY. Do not copy its markup, its base64-embedded
   fonts/images, or its inline `<style>` blocks — extract layout intent and copy, then
   rebuild in Tailwind + theme tokens. Pay particular attention to the team-section
   restructure and creds-bar margin fixes noted in the handoff's "Round 2" work — those
   layout decisions are already final, don't re-litigate them.
9. `output/sessions/2026-08/2026-08-01_npracing-homepage-options/prototype/merch-03-number51.html`,
   `news-03-number51.html`, `contact-03-number51.html` — same: composition/copy reference only.
10. `ls output/sessions/2026-08/2026-08-01_npracing-homepage-options/prototype/assets/` — inventory
    the actual staged image files (logo, team/action photos, merch/gallery thumbnails) and their
    dimensions.
11. `output/briefs/npracing/images/` — the 3 client-provided source photos.

Then write a short inspection note (plain text in your final response, no file needed) covering:

- The exact `ContentType` union and `listSlugs`/`loadMdx` function signatures in `lib/mdx.tsx`.
- Whether `lib/image.ts` already has a `getImageUrl()`-style helper (base-template usually does — confirm, don't recreate).
- The exact `DeepPartialThemeConfig` and `ComponentRegistry` shape from `dch-automotive`'s `theme.config.ts`.
- The confirmed correct `business.type` value for a sports team per `docs/standards/schema.md`.
- A list of the 8 real merch products (name/price/URL) and 2 real news articles (title/date/source/URL)
  from the HANDOFF's "Actions taken" section — these are the seed data for Phase 3, subject to
  Phase 4's re-verification.
- The inventory of staged image assets and their intended use (hero, team, merch, logo).

Report your findings as plain text — this becomes the working reference for every later phase.

**Session observability verdict-forward:**

```bash
python3 "$SESSION_OBSERVABILITY_SKILL_PATH/session_observability.py" phase \
  --run-id npracing-v3 --phase-id 1 --event verdict --verdict PASS --note '<verdict line>'
```

---

## Phase 2: Site-config adaptation

**Goal:** Make `sites/npracing-v3/site.config.ts` and `theme.config.ts`'s registry section truthful for a racing team, not a copied-over local-service-business config.
**Model:** sonnet — judgment call on schema.org type and which BaseSiteConfig fields apply
**Execution:** delegate to 1 sonnet sub-agent
**Failure contract:**

- **Fail fast.** Any uncaught exception aborts the phase immediately — do not swallow it, retry blindly, or continue to the next step.
- **Show the evidence.** On failure, print the full traceback AND the offending record (the exact input/row/item being processed when it threw). No bare error messages.
- **No partial passes.** A phase that processed only some of its records has FAILED, not passed. Never report success on partial data — surface the shortfall.
- **Verdict line, always.** End the phase with exactly one line: `PASS — <n>/<total> records, 0 errors` or `FAIL — <n>/<total> records, <e> errors: <first offending record>`. The counts are mandatory, on both PASS and FAIL.
  **Gate contract:**
- **(a) Golden-fixture test:** n/a — config file, no external-data surface.
- **(b) Invariant on real data:** `pnpm --filter npracing-v3 run type-check` is clean after the change; no `serviceAreas`/`services` arrays contain fabricated local-service data.
- **(c) Rollback:** `git revert <this phase's commit>`.
- **(d) Hard fail:** type-check red, or any invented (non-factual) business data present.

Task: Adapt site.config.ts for NPRacing
model: sonnet
Prompt: |
Using Phase 1's inspection notes, edit `sites/npracing-v3/site.config.ts`:

- `slug: "npracing-v3"`, `name`, `domain` (leave placeholder — no domain confirmed yet, use
  `npracing-v3.vercel.app` as a placeholder, clearly commented as pending),
- `business.type` = the confirmed correct schema.org type from Phase 1 (likely `SportsTeam`).
- `business.email`: `npracingbsb@hotmail.com` (confirmed live in the brief).
- `serviceAreas`/`services`: leave empty arrays or omit if the type allows — do not invent
  local-service data to fill them.
- Add NPRacing-specific fields as a small local extension type in the same file (team name,
  championship, race number, rider name, Instagram handle/URL, merch-store URL) — do not
  force these into unrelated shared `BaseSiteConfig` fields.
- `features`: turn off `serviceAreas`/`locations`-oriented flags that don't apply; keep
  `contactForm: true`.
  Also update `sites/npracing-v3/theme.config.ts`'s `registry` block's `heroVariant`/`headerVariant`
  to whatever the closest existing enum values are for a bold poster-style hero built around a
  large numeral (check `dch-automotive`'s registry for the available enum values first) — full
  token values come in Phase 5, this phase only needs the registry/business-config layer correct.
  Run `pnpm --filter npracing-v3 run type-check` and fix any errors before finishing.
  Report the verdict line.

---

## Phase 3: Content architecture — MDX schemas, content, and site-scoped validator

**Goal:** Add `merch`, `news`, and `brand` as real MDX-backed content types (frontmatter IS the data — no hardcoded TS arrays), seeded with the real product/article/brand data from Phase 1's notes.
**Model:** sonnet — schema design + real content authoring
**Execution:** delegate to 3 sonnet sub-agents in one message (merch / news / brand are independent file sets)
**Failure contract:**

- **Fail fast.** Any uncaught exception aborts the phase immediately — do not swallow it, retry blindly, or continue to the next step.
- **Show the evidence.** On failure, print the full traceback AND the offending record (the exact input/row/item being processed when it threw). No bare error messages.
- **No partial passes.** A phase that processed only some of its records has FAILED, not passed. Never report success on partial data — surface the shortfall.
- **Verdict line, always.** End the phase with exactly one line: `PASS — <n>/<total> records, 0 errors` or `FAIL — <n>/<total> records, <e> errors: <first offending record>`. The counts are mandatory, on both PASS and FAIL.
  **Gate contract:**
- **(a) Golden-fixture test:** `sites/npracing-v3/scripts/validate-content.ts merch|news|brand` run against the real seeded MDX files (real product/article data from Phase 1, not synthetic placeholders) — offline, <5s each.
- **(b) Invariant on real data:** exactly 8 merch records, 2 news records, 1 brand record; zero duplicate slugs; every `externalUrl`/`sourceUrl` is a well-formed absolute URL; a deliberately malformed fixture is rejected by the schema (prove the schema actually rejects bad content, not just accepts good content).
- **(c) Rollback:** `git revert <this phase's commit>` (code + content only, no live state).
- **(d) Hard fail:** any content type's record count is wrong, OR the validator accepts a known-bad fixture, OR 0 records validate on non-empty input.

Spawn three agents in parallel (single Task-tool message):

Task: Build the `merch` content type
model: sonnet
Prompt: |
In `sites/npracing-v3/`: add `merch` to the `ContentType` union in `lib/mdx.tsx` (follow the
existing union's pattern exactly). Create `lib/schemas/merch.ts` (Zod) with fields: `title`,
`description`, `externalUrl` (URL), `priceAmount` (minor GBP units, nonnegative int),
`displayPrice` (string, retailer's own formatting), `currency` (literal `"GBP"`), `image`
(`src`/`alt`/`width`/`height`), `category` (enum inferred from the actual 8 products —
t-shirt/beanie/cap/hoodie/robe), `sortOrder`, `featured` (bool), `available` (bool),
`capturedAt` (ISO date, use `"2026-08-01"` for this seed). Create exactly 8 files under
`content/merch/<product-slug>.mdx` using the real product data from Phase 1's inspection
notes (name/price/URL for each of the 8 Clothing Kings products — this is the SAME product
catalogue as v1, since it's the same team's merch store; the content is identical between
sites, only the card presentation in Phase 5 differs). No internal detail route needed —
cards will link externally. Also create ONE deliberately malformed fixture (e.g. missing
`externalUrl`) as a temporary test file, confirm the schema rejects it via a quick
`tsx`/`node` script invocation, then delete the malformed fixture before finishing (it must
not remain in the committed content).
Report: file paths created, and the verdict line.

Task: Build the `news` content type
model: sonnet
Prompt: |
In `sites/npracing-v3/`: add `news` to the `ContentType` union in `lib/mdx.tsx`. Create
`lib/schemas/news.ts` (Zod) with fields: `title`, `excerpt`, `publishedAt` (ISO date),
`sourceName`, `sourceUrl` (URL), `heroImage` (`src`/`alt`/`width`/`height`, optional if no
curated image yet), `tags` (optional array), `featured` (bool), `draft` (bool, default false).
Create both `app/news/page.tsx` (index) and `app/news/[slug]/page.tsx` (detail) route files
per `docs/guides/adding-content-section.md`'s pattern (index lists all, detail renders one,
`generateStaticParams` from `listSlugs`, unknown slugs → `notFound()`). Create exactly 2 files
under `content/news/<article-slug>.mdx` using the real article data from Phase 1's notes:
Brayden Elliott's Knockhill return (9 Jun 2026, britishsuperbike.com) and Connor Thomson's
rookie signing (26 Feb 2026, britishsuperbike.com) — same source articles as v1, content is
identical between sites, only presentation in Phase 5 differs. Write the MDX body as an
original, attributed summary — do NOT reproduce the source article's text wholesale; short
attributed quotes plus a clear "read the full report at britishsuperbike.com" link are fine.
Report: file paths created, and the verdict line.

Task: Build the `brand` content type
model: sonnet
Prompt: |
In `sites/npracing-v3/`: add `brand` to the `ContentType` union in `lib/mdx.tsx`. Create
`lib/schemas/brand.ts` (Zod) with fields: `teamName`, `tagline`, `championship`, `raceNumber`,
`riderName`, `email` (valid email), `instagramHandle`, `instagramUrl` (URL), `logo` (`src`/`alt`),
`foundedYear` (optional int). Create exactly ONE file, `content/brand/npracing.mdx`, migrating
the real content from `output/briefs/npracing/content/brand.md` (base, manufacturer,
championship, 2026 season, Brayden Elliott's June 2026 signing, owner Neil Pearson / NP
Motorcycles) into this schema-validated file — frontmatter for the structured fields, MDX
body for the narrative/history prose. This becomes the one source both the homepage and
contact page pull team copy from — no other file should hand-read `content/brand.md` at
runtime. Content is identical to v1's brand record — this is the same team, only the visual
presentation differs between the two sites.
Report: file path created, and the verdict line.

After all three sub-agents finish, the orchestrator (not a sub-agent — this is a small
mechanical addition, fine to do directly): add a `validate-content` script entry to
`sites/npracing-v3/package.json` if one doesn't already exist pointing at
`scripts/validate-content.ts` (check the existing base-template copy first — it may already
be wired generically), and extend `scripts/validate-content.ts` itself to recognize `merch`,
`news`, `brand` as valid types alongside whatever it already validates, enforcing the record
counts above.

**Verification gate:**

```bash
pnpm --filter npracing-v3 run validate-content merch
pnpm --filter npracing-v3 run validate-content news
pnpm --filter npracing-v3 run validate-content brand
```

**Session observability verdict-forward:**

```bash
python3 "$SESSION_OBSERVABILITY_SKILL_PATH/session_observability.py" phase \
  --run-id npracing-v3 --phase-id 3 --event verdict --verdict PASS --note '<verdict line>'
```

---

## Phase 4: Content re-verification and image pipeline

**Goal:** Confirm the seeded merch/news data is still accurate against live sources, and resolve the R2-vs-placeholder image question explicitly rather than assuming either way.
**Model:** sonnet — needs live web access and judgment on provisional-vs-final labeling
**Execution:** delegate to 2 sonnet sub-agents in one message (content re-verification and image pipeline are independent workstreams)
**Failure contract:**

- **Fail fast.** Any uncaught exception aborts the phase immediately — do not swallow it, retry blindly, or continue to the next step.
- **Show the evidence.** On failure, print the full traceback AND the offending record (the exact input/row/item being processed when it threw). No bare error messages.
- **No partial passes.** A phase that processed only some of its records has FAILED, not passed. Never report success on partial data — surface the shortfall.
- **Verdict line, always.** End the phase with exactly one line: `PASS — <n>/<total> records, 0 errors` or `FAIL — <n>/<total> records, <e> errors: <first offending record>`. The counts are mandatory, on both PASS and FAIL.
  **Gate contract:**
- **(a) Golden-fixture test:** n/a for re-verification (this IS the real-data check); for the image pipeline, at least one hero image round-trips through an actual `pnpm dev` render (not just a successful build) — this is the specific check for the known `hero.image` local-path bug (see below).
- **(b) Invariant on real data:** every merch/news record is marked either freshly re-verified (`capturedAt` updated) or explicitly `provisional` — none silently left stale without a label.
- **(c) Rollback:** `git revert <this phase's commit>`.
- **(d) Hard fail:** any hero image renders the "R2 URL Not Configured" placeholder in a live `pnpm dev` check, OR any record is silently left unverified without a provisional marker.

Spawn two agents in parallel (single Task-tool message):

Task: Re-verify merch and news content
model: sonnet
Prompt: |
For each of the 8 `content/merch/*.mdx` files: fetch the corresponding product page at
https://www.theclothingkings.co.uk/category/partnerships/npracing/ (or the specific product
URL already in the file) and confirm current price/availability/name match what's recorded.
If a value has changed, update it and bump `capturedAt` to today. If the page can't be reached
or a specific product can't be confirmed, leave the existing value but do NOT bump `capturedAt`
— instead note it in your final report as unverified/provisional.
For each of the 2 `content/news/*.mdx` files: fetch the source URL and confirm date/quotes/
terminology are accurate; same provisional-if-unreachable rule.
Do not invent replacement data for anything that can't be verified.
Report: how many of the 10 records were freshly verified vs. left provisional, and the verdict line.

Task: Resolve the image pipeline
model: sonnet
Prompt: |
First, check whether R2 upload access is actually available in this environment — do not
assume either way. Check for Cloudflare/R2 credentials (`wrangler whoami`, relevant env vars)
without printing any secret values.

- If available: upload the real assets (logo, 3 team/action photos from
  `output/briefs/npracing/images/` and `output/sessions/2026-08/2026-08-01_npracing-homepage-options/prototype/assets/`,
  8 merch product photos) to R2 per `docs/standards/images.md` naming/folder conventions
  under an `npracing/` site folder. **If v1's build already uploaded these same assets to R2
  (check for an existing `npracing/` bucket folder first before re-uploading — both sites use
  the same source photos), reuse the same R2 object URLs rather than duplicating the upload.**
  Update the MDX `image`/`heroImage`/`logo` fields in `content/merch/`, `content/news/`,
  `content/brand/` to the real R2 URLs. Configure `next.config.ts`'s `images.remotePatterns`
  for the R2 host if not already covered by an existing wildcard pattern.
- If unavailable: use the `next/image` + `placehold.co` dev fallback pattern already
  established in `lib/image.ts` (confirm it exists from Phase 1's notes — do not recreate
  it). **Do NOT point any MDX `heroImage`/hero-image field at a local `/public` path** — this
  platform has a known bug where that silently renders an "R2 URL Not Configured" placeholder
  with no build error. Produce a short asset manifest (plain text in your report: source file →
  intended R2 key → placement → alt text) for later real upload, and clearly mark this as a
  provisional/placeholder state.
  Either way: run `pnpm --filter npracing-v3 run dev` briefly and actually load a page with a
  hero image in a headless check (curl the dev server / use a quick Node fetch) to confirm the
  image resolves to something other than the "R2 URL Not Configured" placeholder text — this is
  the concrete check for the known bug, not just "the build compiled."
  Report: R2-available or placeholder-fallback (state which, clearly), and the verdict line.

**Session observability verdict-forward:**

```bash
python3 "$SESSION_OBSERVABILITY_SKILL_PATH/session_observability.py" phase \
  --run-id npracing-v3 --phase-id 4 --event verdict --verdict PASS --note '<verdict line>'
```

---

## Phase 5: Theme tokens and component architecture — "Number 51" design

**Goal:** Translate `prototype/tokens.css` and `design-03-number51.html`'s actual layout into `theme.config.ts` + hand-authored components, matching this platform's architecture, not the mockup's throwaway HTML.
**Model:** opus — cross-file design-system consistency, judgment-heavy translation from a visual mockup into faithful component code
**Execution:** delegate to 1 opus sub-agent
**Failure contract:**

- **Fail fast.** Any uncaught exception aborts the phase immediately — do not swallow it, retry blindly, or continue to the next step.
- **Show the evidence.** On failure, print the full traceback AND the offending record (the exact input/row/item being processed when it threw). No bare error messages.
- **No partial passes.** A phase that processed only some of its records has FAILED, not passed. Never report success on partial data — surface the shortfall.
- **Verdict line, always.** End the phase with exactly one line: `PASS — <n>/<total> records, 0 errors` or `FAIL — <n>/<total> records, <e> errors: <first offending record>`. The counts are mandatory, on both PASS and FAIL.
  **Gate contract:**
- **(a) Golden-fixture test:** n/a — component/design work, not data parsing.
- **(b) Invariant on real data:** `grep -rn "#[0-9a-fA-F]\{3,6\}" sites/npracing-v3/components sites/npracing-v3/app` finds zero hardcoded hex colors in component/route files (theme.config.ts itself is exempt — that's where hex values legitimately live); `grep -rn "theme(" sites/npracing-v3/app/globals.css` finds zero hits.
- **(c) Rollback:** `git revert <this phase's commit>`.
- **(d) Hard fail:** either grep check above finds a hit, or `pnpm --filter npracing-v3 run build` fails.

Task: Build the Number 51 design system and components
model: opus
Prompt: |
Using `output/sessions/2026-08/2026-08-01_npracing-homepage-options/prototype/tokens.css` as
the design-token source of truth (red `#E11024`, near-black `#0a0a0a`, off-white `#F3F2EE`,
Barlow Condensed/Barlow/Bebas Neue fonts, pill-shaped nav/buttons, noise-overlay texture, stat
strip, marquee ribbon — this is the SAME token foundation as v1, both sites share palette/type,
they differ in composition) and `design-03-number51.html` / `merch-03-number51.html` /
`news-03-number51.html` / `contact-03-number51.html` as composition/layout reference ONLY
(never copy their markup, base64 fonts/images, or inline `<style>` blocks):

1. Rewrite `sites/npracing-v3/theme.config.ts`'s color/typography/component blocks to the
   `DeepPartialThemeConfig` shape confirmed in Phase 1 (follow `dch-automotive`'s current
   shape, not `base-template`'s pre-migration one) — use the SAME token values as v1's
   `theme.config.ts` (this is deliberate duplication, not drift — both sites are one brand).
   Set `registry.theme` to something locally meaningful (e.g. `'npracing-v3'`) since this
   site doesn't consume `@platform/themes/*` at runtime.
2. Build local components (no runtime import from `@platform/themes/*`; a type-only import
   from `@platform/theme-system` for `DeepPartialThemeConfig`/`ComponentRegistry` types is fine):
   `components/site-header.tsx`, `components/site-footer.tsx`, `components/pages/home-page.tsx`
   (bold poster-style hero built around the large "51" race number as the principal visual
   structure — per the handoff, this design went through a Round 2 team-section restructure
   and creds-bar margin fix, both already finalised decisions, follow the mockup's current
   state exactly, don't redesign), `components/pages/merch-page.tsx`,
   `components/pages/news-index-page.tsx`, `components/pages/news-detail-page.tsx`,
   `components/pages/contact-page.tsx`, plus any section components you need
   (`components/sections/*.tsx` — e.g. a poster-numeral hero component, editorial content
   blocks).
3. Semantic Tailwind classes only (`bg-brand-primary`, `text-h1`, etc.) — never hardcoded hex
   in component files (hex belongs only in `theme.config.ts`). No inline `style` props, no
   CSS-in-JS, no `theme()` calls in plain CSS — use `var(--color-brand-primary)` if any plain
   CSS is genuinely needed.
4. Preserve semantic heading order even with the poster-style oversized numeral treatment
   (the "51" is decorative/visual, not a literal `<h1>` replacement — the real page heading
   still needs to be a real, readable, properly-ordered heading for accessibility). Respect
   `prefers-reduced-motion` for any reveal/parallax motion.
5. Contact page form: correct semantic `<form>` markup with labels, required fields, and a
   validation-ready status region — but it must NOT imply successful delivery under any
   circumstance. Disable submission with an honest "coming soon" note, or intercept with a
   clear non-sending status message. Pull the team's email (`npracingbsb@hotmail.com`) and
   Instagram link from the `brand` MDX content built in Phase 3, not hardcoded. Facebook: show
   "Link coming soon" (the real URL hasn't arrived yet per the brief).
6. Merch cards render from the 8 `content/merch/*.mdx` records (Phase 3/4), each an external
   link to the retailer with a clear visual/textual indication it leaves the site — use v3's
   own distinct card treatment (per the mockup), not a copy of v1's. News cards link to the
   local `/news/[slug]` detail route. Homepage and contact-page team copy pulls from
   `content/brand/npracing.mdx` (Phase 3), not hardcoded prose.

Run `pnpm --filter npracing-v3 run build` (must show `next build --webpack` in the output,
not Turbopack) and fix any errors before finishing. Run the two grep checks in the Gate
contract yourself and fix any hits.
Report: components created, and the verdict line.

**Session observability verdict-forward:**

```bash
python3 "$SESSION_OBSERVABILITY_SKILL_PATH/session_observability.py" phase \
  --run-id npracing-v3 --phase-id 5 --event verdict --verdict PASS --note '<verdict line>'
```

---

## Phase 6: Routes, metadata, and sitemaps

**Goal:** Wire the components from Phase 5 into actual `app/` routes with correct metadata and sitemap coverage; remove the leftover base-template routes (services/locations/projects/testimonials/blog) that don't apply to NPRacing.
**Model:** sonnet — standard route wiring
**Execution:** delegate to 2 sonnet sub-agents in one message (route wiring and leftover-route removal touch disjoint files)
**Failure contract:**

- **Fail fast.** Any uncaught exception aborts the phase immediately — do not swallow it, retry blindly, or continue to the next step.
- **Show the evidence.** On failure, print the full traceback AND the offending record (the exact input/row/item being processed when it threw). No bare error messages.
- **No partial passes.** A phase that processed only some of its records has FAILED, not passed. Never report success on partial data — surface the shortfall.
- **Verdict line, always.** End the phase with exactly one line: `PASS — <n>/<total> records, 0 errors` or `FAIL — <n>/<total> records, <e> errors: <first offending record>`. The counts are mandatory, on both PASS and FAIL.
  **Gate contract:**
- **(a) Golden-fixture test:** n/a — routing/config work.
- **(b) Invariant on real data:** every route in the list below returns non-404 in a local `pnpm dev` fetch check; `app/sitemap-index.xml/route.ts` references only routes that actually exist.
- **(c) Rollback:** `git revert <this phase's commit>`.
- **(d) Hard fail:** any required route missing or erroring, or a leftover services/locations/projects/testimonials/blog route still present.

Spawn two agents in parallel (single Task-tool message):

Task: Wire required routes and metadata
model: sonnet
Prompt: |
In `sites/npracing-v3/app/`: wire `page.tsx` (home), `merch/page.tsx`, `news/page.tsx`,
`news/[slug]/page.tsx`, `contact/page.tsx`, `about/page.tsx` (renders `content/brand/npracing.mdx`)
to the components built in Phase 5, each with proper `generateMetadata` (title/description
from the relevant content, Open Graph tags) and, for `news/[slug]`, `generateStaticParams`
from `listSlugs('news')` with `notFound()` for unknown slugs. Update `app/layout.tsx`'s nav/
metadata basics if it still references base-template placeholder copy. Create/update section
sitemaps: `app/news/sitemap.ts` (published articles only, excludes `draft: true`), and update
`app/sitemap-index.xml/route.ts` to list home/merch/news/contact/about plus the news sitemap —
remove any reference to services/locations/projects/blog sitemaps that no longer exist.
Report: routes wired, and the verdict line.

Task: Remove leftover base-template routes and content
model: sonnet
Prompt: |
In `sites/npracing-v3/`, remove the routes, components, and content that don't apply to a
racing team site (copied over from base-template and not relevant here): `app/services/`,
`app/locations/`, `app/projects/`, `app/blog/`, `app/reviews/`, their corresponding
`components/pages/*-page.tsx` files, `content/services/`, `content/locations/`,
`content/projects/`, `content/blog/`, `content/testimonials/`, and the now-unused schema/
loader code paths for those content types in `lib/mdx.tsx`/`lib/schemas/` (but do NOT remove
the generic `listSlugs`/`loadMdx` machinery itself — only the services/locations-specific
pieces). Also remove `lib/locations-config.ts` if it's now unused. Check `lib/schema.ts` for
any services/locations-specific JSON-LD helpers that are now dead code and remove those too.
Run `pnpm --filter npracing-v3 run type-check` after removal and fix any resulting errors
(e.g. dangling imports).
Report: files/directories removed, and the verdict line.

**Verification gate:**

```bash
pnpm --filter npracing-v3 run type-check
pnpm --filter npracing-v3 run build
```

**Session observability verdict-forward:**

```bash
python3 "$SESSION_OBSERVABILITY_SKILL_PATH/session_observability.py" phase \
  --run-id npracing-v3 --phase-id 6 --event verdict --verdict PASS --note '<verdict line>'
```

---

## Phase 7: Accessibility, responsiveness, and architecture sweep

**Goal:** Catch the failure modes that pass `build`/`type-check` but ship a broken or inaccessible page.
**Model:** sonnet — needs to actually run the dev server and inspect rendered output
**Execution:** delegate to 1 sonnet sub-agent
**Failure contract:**

- **Fail fast.** Any uncaught exception aborts the phase immediately — do not swallow it, retry blindly, or continue to the next step.
- **Show the evidence.** On failure, print the full traceback AND the offending record (the exact input/row/item being processed when it threw). No bare error messages.
- **No partial passes.** A phase that processed only some of its records has FAILED, not passed. Never report success on partial data — surface the shortfall.
- **Verdict line, always.** End the phase with exactly one line: `PASS — <n>/<total> records, 0 errors` or `FAIL — <n>/<total> records, <e> errors: <first offending record>`. The counts are mandatory, on both PASS and FAIL.
  **Gate contract:**
- **(a) Golden-fixture test:** n/a — manual/scripted UI sweep, not data parsing.
- **(b) Invariant on real data:** every route in the Phase 6 list renders with no console errors, valid heading hierarchy (the poster-style "51" numeral is decorative, not a heading substitute), and visible focus states; no horizontal overflow at 375px width.
- **(c) Rollback:** `git revert <this phase's commit>` if fixes were needed and committed.
- **(d) Hard fail:** any route with a hydration/console error, or `grep -rn "@platform/themes" sites/npracing-v3` finding a runtime import (type-only imports from `@platform/theme-system` are fine — that's a different package).

Task: Accessibility, responsive, and architecture sweep
model: sonnet
Prompt: |
Start `pnpm --filter npracing-v3 run dev` and check every route (home, merch, news index,
both news details, contact, about) for: no browser console errors, valid heading order (one
`h1` per page — confirm the oversized "51" numeral treatment on the homepage is decorative
markup, not accidentally the page's only heading), visible keyboard focus states, no
horizontal scroll at common mobile widths (375px, 390px), any decorative motion respecting
`prefers-reduced-motion` (check the CSS, not just visually), and that merch cards' external
links have safe `rel="noopener noreferrer"` attributes. Run
`grep -rn "@platform/themes" sites/npracing-v3` and confirm it returns nothing (a hit means a
runtime import slipped in — fix it, type-only imports from `@platform/theme-system` — note
the different package name — are fine and won't match this grep). Fix anything you find; if
a fix requires design judgment beyond a small tweak, note it in your report rather than
guessing.
Report: issues found and fixed, and the verdict line.

**Session observability verdict-forward:**

```bash
python3 "$SESSION_OBSERVABILITY_SKILL_PATH/session_observability.py" phase \
  --run-id npracing-v3 --phase-id 7 --event verdict --verdict PASS --note '<verdict line>'
```

---

## Phase 8: Final quality gates

**Goal:** Run every gate this platform actually defines, scoped to `npracing-v3` only, before this branch is considered ready for integration.
**Model:** n/a — orchestrator runs these directly, this is verification not implementation
**Execution:** inline (exception) — pure verification-gate commands, no code judgment involved, exactly what the Delegation Model reserves for the orchestrator's own gating role
**Failure contract:**

- **Fail fast.** Any uncaught exception aborts the phase immediately — do not swallow it, retry blindly, or continue to the next step.
- **Show the evidence.** On failure, print the full traceback AND the offending record (the exact input/row/item being processed when it threw). No bare error messages.
- **No partial passes.** A phase that processed only some of its records has FAILED, not passed. Never report success on partial data — surface the shortfall.
- **Verdict line, always.** End the phase with exactly one line: `PASS — <n>/<total> records, 0 errors` or `FAIL — <n>/<total> records, <e> errors: <first offending record>`. The counts are mandatory, on both PASS and FAIL.
  **Gate contract:**
- **(a) Golden-fixture test:** all three `validate-content` invocations from Phase 3, re-run against final content.
- **(b) Invariant on real data:** type-check, lint, and build all exit 0.
- **(c) Rollback:** n/a — this phase makes no code changes, only runs checks; if it fails, the failing phase above is what gets reverted.
- **(d) Hard fail:** any of the commands below exits non-zero.

```bash
# Verification gate — STOP if any of this fails
cd /Users/rickywilson/Sites/lbp-npracing-v3
pnpm --filter npracing-v3 run validate-content merch
pnpm --filter npracing-v3 run validate-content news
pnpm --filter npracing-v3 run validate-content brand
pnpm --filter npracing-v3 run type-check
pnpm --filter npracing-v3 run lint
pnpm --filter npracing-v3 run build
```

Commit this phase's state (should be a no-op commit unless Phase 7 left uncommitted fixes — commit those now if so) with message `test(npracing-v3): final quality gates pass`.

**Session observability verdict-forward:**

```bash
python3 "$SESSION_OBSERVABILITY_SKILL_PATH/session_observability.py" phase \
  --run-id npracing-v3 --phase-id 8 --event verdict --verdict PASS --note '<verdict line>'
```

---

## Parallel execution groups

This section lists work units that can run concurrently. Each group lists items that MUST be launched in a single Task-tool message. Items across groups run sequentially in the order listed. Groups are named `G1`, `G2`, … for reference.

### Intra-phase groups

| Group | Phase   | Items                                                                               | File overlap                                          | Model  | Rationale                                                     |
| ----- | ------- | ----------------------------------------------------------------------------------- | ----------------------------------------------------- | ------ | ------------------------------------------------------------- |
| G1    | Phase 3 | Build `merch` content type, Build `news` content type, Build `brand` content type   | none                                                  | sonnet | Independent schema/content/route files per content type       |
| G2    | Phase 4 | Re-verify merch/news content, Resolve image pipeline                                | none                                                  | sonnet | Independent workstreams — web verification vs. asset pipeline |
| G3    | Phase 6 | Wire required routes and metadata, Remove leftover base-template routes and content | mostly none (both touch `app/` but disjoint subpaths) | sonnet | Additive routing vs. subtractive cleanup are separable        |

### Cross-phase groups (only if phases are truly independent)

| Group  | Phases | Items | Rationale |
| ------ | ------ | ----- | --------- |
| (none) |        |       |           |

Phase 1 (inspection), Phase 2 (site-config), Phase 5 (theme/components), Phase 7 (a11y sweep), and Phase 8 (final gates) each run as `1 sub-agent, sequential` (Phase 8 is `inline (exception)` per its own declaration above) — no parallel group.

### Sequential points — MUST NOT parallelise

| Item                                                                                  | Reason                                                                      |
| ------------------------------------------------------------------------------------- | --------------------------------------------------------------------------- |
| Verification gates (`validate-content`, `type-check`, `lint`, `build`) between phases | Each phase's output gates the next. Gates are the synchronisation barrier.  |
| Git commits                                                                           | One commit per phase, in order. Commits are never batched.                  |
| Any file edited by two or more items                                                  | Same-file edits must always serialise.                                      |
| Phase 5 (theme/components) relative to Phase 3/4 (content)                            | Phase 5's components render Phase 3/4's content — must run after, not with. |

---

## Cost Estimate

| Phase                                            | Model  | Est. input tokens | Est. output tokens | Est. cost  |
| ------------------------------------------------ | ------ | ----------------- | ------------------ | ---------- |
| Phase 1: Inspect references                      | sonnet | ~25k              | ~2k                | ~$0.11     |
| Phase 2: Site-config adaptation                  | sonnet | ~8k               | ~1.5k              | ~$0.05     |
| Phase 3: Content architecture (3 parallel)       | sonnet | ~30k              | ~9k                | ~$0.22     |
| Phase 4: Re-verify + image pipeline (2 parallel) | sonnet | ~20k              | ~5k                | ~$0.14     |
| Phase 5: Theme + components                      | opus   | ~35k              | ~14k               | ~$0.53     |
| Phase 6: Routes + cleanup (2 parallel)           | sonnet | ~25k              | ~7k                | ~$0.18     |
| Phase 7: Accessibility sweep                     | sonnet | ~15k              | ~3k                | ~$0.09     |
| Phase 8: Final gates                             | n/a    | ~2k               | ~1k                | ~$0.01     |
| **Total**                                        |        | **~160k**         | **~42.5k**         | **~$1.33** |

Rates: Opus $5/$25, Sonnet $3/$15, Haiku $1/$5 per MTok.
Estimation: ~5 tokens per line of code. Input = files read + brief (~5k) + system prompt (~3k). Output = code written + verification output (~500/gate).

---

## Final Report

After all phases complete, output:

1. Phases completed — list each with commit SHA
2. Build status — confirm `pnpm --filter npracing-v3 run type-check && pnpm --filter npracing-v3 run build && pnpm --filter npracing-v3 run lint` all pass
3. Any exceptions or intentional deviations from the plan
4. Image pipeline status — R2-final or placeholder-provisional (from Phase 4); note whether v1's R2 assets were reused
5. Content verification status — how many of the 10 merch/news records were freshly re-verified vs. left provisional (from Phase 4)
6. Token usage and cost estimate:

   | Model     | Est. input tokens     | Est. output tokens | Est. cost |
   | --------- | --------------------- | ------------------ | --------- |
   | sonnet    | [total across phases] |                    | $X.XX     |
   | opus      | [Phase 5]             |                    | $X.XX     |
   | **Total** |                       |                    | **$X.XX** |

   Estimate tokens from: files read (lines x 5) and written (lines x 5).
   Compare to the pre-flight Cost Estimate above.
   For exact figures: check console.anthropic.com.

---

## Update Session File

After completing all phases, append to `output/sessions/2026-08/2026-08-01_npracing-site-build/npracing-v3-yolo-brief.md`:

```markdown
## Completed

**Date:** [today]
**Status:** All phases executed successfully

[1-paragraph summary: what was implemented, any surprises]

### Commits

[list each commit SHA and message]
```

---

## Rules

- STOP on any failed verification gate — do not continue to next phase
- **Honour every phase's `**Failure contract:**`.** Fail fast on any uncaught exception (never swallow, blind-retry, or press on), print the full traceback and the offending record, and never report a phase as passed on partial data. Each phase MUST end with its one-line PASS/FAIL verdict including counts.
- **Honour every phase's `**Gate contract:**`.** A phase passes only when its checks are **executed**, not just declared. Have the phase's rollback to hand before you start it.
- Read every file before editing it
- Never push — leave all changes on the `feature/npracing-v3` branch, in the `lbp-npracing-v3` worktree
- **Only edit files under `sites/npracing-v3/`** — this worktree is isolated specifically so a concurrent session building `feature/npracing-v1` doesn't collide with it. Do not touch root-level files (`turbo.json`, `pnpm-lock.yaml`, `package.json`) unless a phase explicitly says to and confirms it's unavoidable — if it seems unavoidable, STOP and report rather than editing shared state from an isolated worktree.
- **Delegate every phase's implementation to sub-agents by default.** The orchestrator coordinates, gates, and commits — it does NOT write phase code inline, except Phase 8 which is declared as the inline exception (pure verification, no code).
- **The `**Model:**` tier names the sub-agent's model, not the orchestrator's.**
- **Consult the `## Parallel execution groups` section before launching any work.** Every item listed in a group MUST be launched in a single Task-tool message.
- **Items NOT listed in any group run sequentially — but still as delegated sub-agents.**
- **Never parallelise across phase boundaries** — Phase 5 must run after Phase 3/4 complete (components render that content).
- Minimal changes only — implement what this brief says, nothing more
- The Co-Authored-By line in commits must reflect the **orchestrator** model (the committer) — not the per-phase sub-agent tier.
- Every phase that changes code ends with its own commit, `feat(npracing-v3): <phase description>` or `test(npracing-v3): <phase description>` for Phase 8.
- **Real-data rule:** Phase 4's re-verification MUST hit the actual retailer/BSB URLs, not skip straight to "assume it's fine" — an autonomous session with no live check would otherwise ship stale/possibly-wrong client-facing prices and claims.
