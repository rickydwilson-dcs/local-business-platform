# YOLO Implementation Brief: Rebuild DCS's shared chrome + 14 inner routes in the r9 brand; reclassify the NP Racing post as a project; fix blog/project schema and image gaps

**Branch:** `feature/dcs-r9-rebrand-inner-pages` (created from `develop` — this repo's `CLAUDE.md` mandates `develop → staging → main` as a NON-NEGOTIABLE workflow; the prior `dcs-homepage-nextjs-port` YOLO run used the same feature-branch-off-develop pattern for exactly this kind of autonomous work)
**Session spec:** `output/sessions/2026-08/2026-08-25_dcs-r9-rebrand-inner-pages/yolo-brief.md`
**Mode:** Autonomous execution — coordinate all phases, delegate implementation to sub-agents, verify after each, STOP on error
**Orchestrator model:** sonnet — coordinator only; per-phase `**Model:**` tiers attach to delegated sub-agents and are independent of this
**Run ID (session observability):** `2026-08-25_dcs-r9-rebrand-inner-pages`
**Total phases:** 8 (Phase 0 through Phase 7)

---

## Context

**Plan source:** Claude independent plan (`session.md` in this folder — no Codex peer review requested; Ricky ran `/plan.to.yolo` directly per his own established preference for skipping synthesis on straightforward tasks). Hold to the gates all the more.

The DCS homepage (`/`) shipped on the new **r9** brand 2026-08-23; the 14 inner routes (`about`, `blog`, `blog/[slug]`, `contact`, `cookie-policy`, `locations`, `locations/[slug]`, `pricing`, `privacy-policy`, `projects`, `projects/[slug]`, `reviews`, `services`, `services/[slug]`, `terms-and-conditions`) plus the shared `SiteHeader`/`SiteFooter` chrome are still on the old **solaris** theme (teal `#61A3BA` / lime `#D2DE32`, Inter/Space Grotesk). This brief rebuilds all of it — components, not just a token recolor — against the r9 palette, which gets promoted from a homepage-only custom-CSS variable set into the platform's real `colors.brand.*`/`colors.surface.*` theme tokens first. It also moves a same-day blog post (a client case study) into `content/projects/` where it belongs, fixes a blog-category schema mismatch that predates this session, adds a missing `blog` validation case, and wires up hero-image rendering that the type system already supports but no component actually uses yet.

Full background, verified findings, and the decisions behind this scope are in `session.md` in this same folder — read it if any phase below needs more context than is repeated here.

Implement the plan exactly as specified below.

### Scope — decided by Ricky, 2026-08-25

**In scope:** promoting r9 to real theme tokens; rebuilding the shared header/footer and all 14 inner-route components (not a recolor); adding hero-image rendering to blog + project templates; moving the NP Racing post to `content/projects/`; fixing the `BlogCategory` enum and adding a `blog` validation case.

**Explicitly out of scope — do NOT do these:**

- The homepage (`/`) and its `styles/home-r9.css` / `home-r9-reset.css` — already shipped and pixel-verified, not touched.
- The `robots: { index: false, follow: false }` export in `app/(site)/layout.tsx` — owned by a separate, not-yet-started SiteGround→Vercel cutover project. Do not change it, do not remove it, do not make any route indexable as a side effect of restyling it. Phase 6's gate explicitly diffs this.
- The DNS/domain cutover and its redirect map (`next.config.ts` `redirects()`) — separate project (`output/sessions/2026-08/2026-08-23_dcs-site-cutover/cutover-plan.md`).
- Rewriting the prose of the 20 generic blog posts — only frontmatter (`category`, `heroImage`) and rendering change.
- Deleting `components/pages/HomePage.tsx` (416 lines, confirmed dead code — `app/page.tsx` defines its own local `HomePage` backed by `components/home/home-body.tsx`). Report it; do not remove it.
- Backfilling images for the other 12 pre-existing `content/projects/*.mdx` files — noted as backlog only.
- Any site other than `sites/dcs`, and any file under `packages/themes/*` (dcs is self-contained, per this repo's site self-containment migration — it must not gain a dependency on those packages).
- Instagram/social publishing.

### Decisions already made — do not re-litigate

1. **Rebuild, not a token-only recolor.** Every inner page's components get rebuilt to the r9 visual language.
2. **Promote r9 to real platform theme tokens** in `sites/dcs/theme.config.ts` (`colors.brand.*` / `colors.surface.*` / `colors.semantic.*`), rather than extending the homepage's bespoke verbatim-ported CSS. This is what makes the site re-themeable from one config file going forward, matching every other site on the platform.
3. **The NP Racing PSI post moves from blog to a project case study** — it's client-specific and outcome-driven, matching every other file in `content/projects/`, not generic advice content.
4. **`content/projects/*.mdx` uses a simpler DCS-local shape** (`title, description, date, tags, outcomes, heroImage`) matching `ProjectDetailPageTemplateProps` from `packages/core-components/src/lib/page-template-types.ts` — **not** the stricter shared `ProjectFrontmatterSchema` in `content-schemas.ts`, which is built for physical trade projects (`projectType`, `location`, `completionDate`, etc.) and does not apply to DCS's web-agency portfolio. Do not try to make the NP Racing entry conform to `ProjectFrontmatterSchema`.

### Decisions deferred to Ricky — surface, do NOT act on

Report these in the Final Report. Do not implement any of them.

1. **Exact primary/accent/surface role mapping** when promoting r9 tokens (e.g. whether magenta becomes `brand.primary` or `brand.accent`; whether `surface.background` becomes paper or white). Phase 1 must choose a reasonable default and apply it, but this is a visual-identity call — flag it as applied-but-reviewable, not settled.
2. **Which exact images ship for the 20 remaining blog posts.** Phase 7 applies reasonable defaults directly (two real client screenshots, category graphics for the rest — see Phase 7) rather than pausing for review. R2 write credentials (`R2_ACCOUNT_ID`/`R2_ACCESS_KEY_ID`/`R2_SECRET_ACCESS_KEY`/`R2_BUCKET_NAME`) are present and non-empty in the root `.env.local` (re-verified 2026-08-25 after an earlier false negative in this same session — the values are real, not placeholders), so this should ship end-to-end. Phase 7 still checks for them itself before generating assets, as a live guard against the environment the orchestrator actually runs in differing from this one (e.g. a fresh checkout without `.env.local` copied over) — not because they're expected to be missing.
3. **Whether the `BlogCategory` enum expansion in Phase 5 affects any other site.** Phase 5 must check this before touching the shared file; if any other site's blog content would be affected, STOP that phase and report rather than proceeding.

---

## Model Tiers

| Tier   | Alias    | Cost (in/out per MTok) | Use for                                                                                             |
| ------ | -------- | ---------------------- | --------------------------------------------------------------------------------------------------- |
| Opus   | `opus`   | $5 / $25               | Phases with >5 interdependent files, architectural rewrites, judgment calls not covered by the spec |
| Sonnet | `sonnet` | $3 / $15               | Standard implementation — file edits, feature wiring, most phases                                   |
| Haiku  | `haiku`  | $1 / $5                | Mechanical tasks: find-replace, import additions, grep checks, content validation                   |

Default orchestrator: **sonnet**. Default sub-agent: **sonnet** unless the task is clearly mechanical (→ haiku) or requires deep cross-file reasoning (→ opus).

## Delegation Model

The orchestrator is a **coordinator, not an implementer**. Its job is: read this brief, sequence the phases, dispatch sub-agents, run verification gates, make commits, and write the final report. It does **not** implement phase work inline by default.

**Every phase's implementation work is delegated to one or more `Task` sub-agents**, each spawned at the phase's `**Model:**` tier. The model annotation _is_ the sub-agent's model — it is meaningless unless the work is delegated, because the orchestrator cannot change its own running model. A `**Model:** haiku` phase executed inline runs at full orchestrator cost and consumes orchestrator context; delegating it keeps that work in the sub-agent and returns only a short summary.

**Inline exception.** The orchestrator may implement a phase inline ONLY when the work is tightly cross-coupled and correctness-critical — e.g. a deterministic engine spanning many interdependent files with exact golden vectors, or (as in Phase 7 here) work requiring live browser-tool orchestration and content judgment that would lose essential context if handed to a blind sub-agent. When taken, the phase MUST declare `**Execution:** inline (exception) — <one-line rationale>`. This is the exception, not the default; prefer delegation whenever the work is separable.

The orchestrator's own model (set by the launch command) is **independent** of the phase tiers. Opus orchestrating while individual phases delegate to haiku/sonnet sub-agents is expected and correct — the orchestrator coordinates; the tiers attach to sub-agents.

---

## Traps — read before Phase 0

1. **`fixed inset-0` mobile-nav dialogs must never nest inside a `backdrop-blur-*`/`transform` ancestor.** Per this repo's `CLAUDE.md`, `backdrop-filter`/`transform` become the containing block for `position: fixed` descendants, trapping a "fullscreen" overlay inside the header's own small box. Render the mobile menu dialog as a sibling of the header, or portal it to `document.body`. See `sites/npracing-v1/components/site-nav-mobile.tsx` for a correct reference.
2. **Comma'd prices must never sit on `tabular-nums` or a monospace face.** The pricing page has `£750`, `£45/mo`, etc. — tabular figures give commas a full digit advance, rendering `£1,995` as `£1 , 995`. Keep prices in the grotesk/Archivo body face. `components/home/pricing.tsx` already documents this for the homepage; the rebuilt inner pricing page must follow the same rule.
3. **`theme.config.ts`'s `colors.custom.*` (ink/paper/magenta/aqua/navy/grey) already exists** — Phase 1 promotes these into `colors.brand.*`/`colors.surface.*`/`colors.semantic.*`, it does not invent new hex values. Do not touch `styles/home-r9.css`/`home-r9-reset.css` — the homepage's own stylesheet is untouched by this brief.
4. **`BlogPostPageTemplateProps.frontmatter` and `ProjectDetailPageTemplateProps.frontmatter`** (in `packages/core-components/src/lib/page-template-types.ts`) **already declare `heroImage?: string`.** Phase 3 adds rendering for a field that already exists in the type — no type changes needed there.
5. **`content/projects/*.mdx` does NOT use the shared `ProjectFrontmatterSchema`.** It uses a simpler local shape. Do not "fix" the NP Racing entry to add `projectType`/`location`/`completionDate` — those fields are for a different (physical trade project) domain and `ProjectDetailPage.tsx` doesn't read them.
6. **Neither `scripts/validate-content.ts` (root) nor `sites/dcs/scripts/validate-content.ts` currently handles a `blog` or `project` content type at all** — only `service` and `location`. A prior session's claim that blog content had been validated is confirmed false. Phase 5 is adding new functionality here, not fixing a broken case.
7. **Port collisions:** `lsof -i :3000` before starting any dev server — port 3000 may be running a different site (e.g. `npracing-v1`) from an earlier session. Use a free port for any manual verification.
8. **Production builds use `next build --webpack`**, never Turbopack — this repo's `CLAUDE.md` notes Turbopack has PostCSS bugs in CI. `sites/dcs/package.json`'s `build` script already does this correctly; do not change it.

---

## Pre-flight

```bash
cd /Users/rickywilson/Sites/local-business-platform

# Base branch for this repo is develop (CLAUDE.md: develop → staging → main, NON-NEGOTIABLE)
git checkout develop && git pull
git checkout -b feature/dcs-r9-rebrand-inner-pages

# Session observability run-init
python3 "$SESSION_OBSERVABILITY_SKILL_PATH/session_observability.py" phase \
  --run-id 2026-08-25_dcs-r9-rebrand-inner-pages \
  --phase-id phase-0 --phase-name "Pre-flight" --event start --total-phases 8

# Sanity gate — must be clean before starting
pnpm --filter @platform/dcs run type-check
```

---

## Phase 1: Promote r9 palette to real theme tokens

**Goal:** Replace `sites/dcs/theme.config.ts`'s `colors.brand.*`, `colors.surface.*`, and `colors.semantic.*` (currently solaris teal `#61A3BA` / lime `#D2DE32`) with r9-derived values (ink `#0E0E12`, paper `#ECEBE9`, magenta `#D6006B`, aqua `#00D2D8`, navy `#17265E`, grey `#70707B`), and update `typography.fontFamily.sans`/`heading` to reference the Archivo/Poppins `next/font` CSS variables already declared in `app/layout.tsx` (do not add new font loading — it already exists). Check `sites/dcs/app/globals.css` for any hardcoded solaris-specific values (e.g. leftover Theme Component Contract-era classes like `btn-primary`/`section-dark-accent`) that need to read from the new tokens instead. Then run the platform's WCAG contrast validator against the new values and fix token values (not component-level overrides) until it passes.
**Model:** sonnet — token/config edits across 2 files plus reading the validator output
**Execution:** delegate to 1 sonnet sub-agent
**Failure contract:**

- **Fail fast.** Any uncaught exception aborts the phase immediately — do not swallow it, retry blindly, or continue to the next step.
- **Show the evidence.** On failure, print the full traceback AND the offending record (the exact input/row/item being processed when it threw). No bare error messages.
- **No partial passes.** A phase that processed only some of its records has FAILED, not passed. Never report success on partial data — surface the shortfall.
- **Verdict line, always.** End the phase with exactly one line: `PASS — <n>/<total> records, 0 errors` or `FAIL — <n>/<total> records, <e> errors: <first offending record>`. The counts are mandatory, on both PASS and FAIL.
  **Gate contract:** (all four required — see templates/gated-phase-brief-template.md)
- **(a) Golden-fixture test:** n/a — no external-data surface (config-value change); the WCAG validator run below stands in as the real correctness check.
- **(b) Invariant on real data:** `pnpm --filter @platform/theme-system validate --config ../../sites/dcs/theme.config.ts` exits 0 (WCAG AA) against the new token values.
- **(c) Rollback:** `git revert <this phase's commit>` (code-only, no live state).
- **(d) Hard fail:** the contrast validator reports any AA failure, OR `styles/home-r9.css`/`home-r9-reset.css` were modified (they must stay untouched).

```
Task: Promote r9 palette into sites/dcs/theme.config.ts real theme tokens
model: sonnet
Prompt: |
  Read sites/dcs/theme.config.ts in full. It currently has two color groups:
  - colors.brand/surface/semantic/overlay — the OLD solaris teal/lime values, actually
    consumed by every component via bg-brand-primary, text-surface-foreground etc.
  - colors.custom — the r9 palette (ink #0E0E12, paper #ECEBE9, white #ffffff,
    magenta #D6006B, aqua #00D2D8, navy #17265E, grey #70707B), currently only used by
    the homepage's own hand-authored stylesheet, NOT by the generic token classes.

  Replace colors.brand/surface/semantic/overlay with values derived from the r9 palette.
  Reasonable defaults (apply these unless the file's own structure strongly suggests
  otherwise — this is a judgment call to flag, not re-litigate):
    - brand.primary: magenta (#D6006B) — the r9 accent color used for CTAs/links
    - brand.secondary or brand.accent: aqua (#00D2D8)
    - brand.onPrimary: white (#ffffff) — check contrast in the validator step
    - surface.background: paper (#ECEBE9)
    - surface.foreground: ink (#0E0E12)
    - surface.card: white (#ffffff)
    - keep the shape (which keys exist) identical to what's there now — only change values
  Update typography.fontFamily.sans and .heading to reference the CSS variables Archivo and
  Poppins are already loaded under in sites/dcs/app/layout.tsx (read that file to find the
  actual variable names — do not invent new font loading).

  Leave colors.custom as-is (still needed by the homepage's own stylesheet) — do not delete it.
  Do NOT touch sites/dcs/styles/home-r9.css or home-r9-reset.css.

  Then read sites/dcs/app/globals.css. If it defines any classes tied to the old
  Theme Component Contract era (btn-primary, btn-secondary, section-dark-accent, etc.)
  with hardcoded solaris hex values instead of var(--color-...) references, update them
  to use the new token variables. If nothing hardcoded is found, state that explicitly.

  Run: pnpm --filter @platform/theme-system validate --config ../../sites/dcs/theme.config.ts
  If it reports any WCAG AA failure, adjust the token VALUES (not add component-level
  overrides) until it passes. Report the exact validator output.

  Do not touch any component file in this phase — that's Phases 2-3.

  Return: a summary of the exact before/after token values changed, the font variable
  names used, whether globals.css needed changes, and the validator's final pass/fail output.
```

```bash
# Verification gate — STOP if this fails
pnpm --filter @platform/theme-system run validate --config ../../sites/dcs/theme.config.ts
pnpm --filter @platform/dcs run type-check
git diff --name-only | grep -E "home-r9" && echo "FAIL: home-r9 stylesheet touched" && exit 1 || echo "OK: home-r9 untouched"
```

```bash
git add sites/dcs/theme.config.ts sites/dcs/app/globals.css
git commit -m "feat(dcs): promote r9 palette to real brand/surface theme tokens

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>"
python3 "$SESSION_OBSERVABILITY_SKILL_PATH/session_observability.py" phase \
  --run-id 2026-08-25_dcs-r9-rebrand-inner-pages --phase-id phase-1 --event verdict \
  --verdict PASS --note "r9 tokens promoted, WCAG AA validated"
```

---

## Phase 2: Rebuild shared chrome — header and footer

**Goal:** Rebuild `components/site-header.tsx` and `components/site-footer.tsx` in the r9 visual language, using the new tokens from Phase 1. Use `components/home/site-bar.tsx` and `components/home/mobile-menu.tsx` as the _visual_ reference only (nav treatment, spacing, type) — not literal reuse, since those are homepage-specific single-page-scroll components with in-page anchor links, not the multi-route nav this header needs. **Both components MUST keep their existing exported prop interface unchanged** (same prop names/types consumed by `app/(site)/layout.tsx`) so that file needs no edits in this phase — verify this constraint explicitly before finishing.
**Model:** sonnet — visual rebuild of 2 components against an established token set and a documented CSS trap
**Execution:** delegate to 2 sonnet sub-agents in one message (site-header.tsx and site-footer.tsx are independent files with no overlap)
**Failure contract:**

- **Fail fast.** Any uncaught exception aborts the phase immediately — do not swallow it, retry blindly, or continue to the next step.
- **Show the evidence.** On failure, print the full traceback AND the offending record (the exact input/row/item being processed when it threw). No bare error messages.
- **No partial passes.** A phase that processed only some of its records has FAILED, not passed. Never report success on partial data — surface the shortfall.
- **Verdict line, always.** End the phase with exactly one line: `PASS — <n>/<total> records, 0 errors` or `FAIL — <n>/<total> records, <e> errors: <first offending record>`. The counts are mandatory, on both PASS and FAIL.
  **Gate contract:** (all four required — see templates/gated-phase-brief-template.md)
- **(a) Golden-fixture test:** n/a — no external-data surface (UI component rebuild); type-check + visual screenshot check stand in.
- **(b) Invariant on real data:** `app/(site)/layout.tsx` requires zero edits (props unchanged) — `git diff` on that file must be empty after this phase.
- **(c) Rollback:** `git revert <this phase's commit>` (code-only, no live state).
- **(d) Hard fail:** `layout.tsx` needed changes (prop interface broke), OR the mobile nav dialog is nested inside a `backdrop-blur`/`transform` ancestor (Trap 1).

```
Spawn two agents in parallel (single Task-tool message):

Task: Rebuild components/site-header.tsx in the r9 visual language
model: sonnet
Prompt: |
  Read sites/dcs/components/site-header.tsx (251 lines) in full, then
  sites/dcs/components/home/site-bar.tsx and sites/dcs/components/home/mobile-menu.tsx
  as visual reference for the r9 nav treatment (do not literally reuse their anchor-link
  behavior — this header serves multiple routes, not one scrolling page).
  Read sites/dcs/theme.config.ts (already updated this session — Phase 1) to see the
  current token values, and sites/dcs/app/(site)/layout.tsx to see exactly which props
  this component is called with (logoSrc, logoAlt, logoText, navItems, ctaLabel, ctaHref,
  phone, showPhone).

  Rebuild the header's visual style (colors, typography, spacing, nav treatment, mobile
  menu) to match the r9 language — magenta/aqua/ink/paper, Archivo/Poppins via the new
  brand/surface tokens (bg-brand-primary, text-surface-foreground etc., NOT hardcoded hex).

  CRITICAL: keep the exact same exported prop names and types. layout.tsx must not need
  any edit after this change. If you find you need a new prop, stop and report why instead
  of changing the signature.

  CRITICAL CSS trap: if the mobile menu is a fixed inset-0 overlay, it must NOT be nested
  inside any ancestor with backdrop-blur-* or a transform — render it as a sibling in the
  component tree (or portal to document.body). See sites/npracing-v1/components/site-nav-mobile.tsx
  for a correct reference if useful.

  Return: confirmation the prop interface is unchanged, and where the mobile menu sits in
  the tree relative to any blurred/transformed ancestor.

Task: Rebuild components/site-footer.tsx in the r9 visual language
model: sonnet
Prompt: |
  Read sites/dcs/components/site-footer.tsx (145 lines) in full, and sites/dcs/theme.config.ts
  (already updated this session — Phase 1) for the current token values. Read
  sites/dcs/app/(site)/layout.tsx to see exactly which props this component is called with
  (logoSrc, logoAlt, logoText, tagline, copyright, navColumns, contact, legal).

  Rebuild the footer's visual style (colors, typography, spacing, column layout) to match
  the r9 language — magenta/aqua/ink/paper, Archivo/Poppins via the new brand/surface
  tokens (bg-brand-primary, text-surface-foreground etc., NOT hardcoded hex).

  CRITICAL: keep the exact same exported prop names and types. layout.tsx must not need
  any edit after this change. If you find you need a new prop, stop and report why instead
  of changing the signature.

  Return: confirmation the prop interface is unchanged.
```

```bash
# Verification gate — STOP if this fails
pnpm --filter @platform/dcs run type-check
git diff --name-only -- "sites/dcs/app/(site)/layout.tsx" | grep -q . && echo "FAIL: layout.tsx was touched" && exit 1 || echo "OK: layout.tsx untouched"
```

```bash
git add sites/dcs/components/site-header.tsx sites/dcs/components/site-footer.tsx
git commit -m "feat(dcs): rebuild shared header/footer in the r9 brand

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>"
python3 "$SESSION_OBSERVABILITY_SKILL_PATH/session_observability.py" phase \
  --run-id 2026-08-25_dcs-r9-rebrand-inner-pages --phase-id phase-2 --event verdict \
  --verdict PASS --note "header/footer rebuilt, layout.tsx untouched"
```

---

## Phase 3: Rebuild all 14 inner-route page components + hero-image rendering

**Goal:** Rebuild every inner-page component against the Phase 1 tokens, and add hero-image rendering to the blog and project templates (the type already supports `heroImage?: string`; no component currently renders it). Each work item below touches a disjoint set of files — no two items share a file.
**Model:** sonnet — visual rebuild of established components against a defined token set; two items also add a new (but type-already-declared) render path
**Execution:** delegate to 9 sonnet sub-agents in one message
**Failure contract:**

- **Fail fast.** Any uncaught exception aborts the phase immediately — do not swallow it, retry blindly, or continue to the next step.
- **Show the evidence.** On failure, print the full traceback AND the offending record (the exact input/row/item being processed when it threw). No bare error messages.
- **No partial passes.** A phase that processed only some of its records has FAILED, not passed. Never report success on partial data — surface the shortfall.
- **Verdict line, always.** End the phase with exactly one line: `PASS — <n>/<total> records, 0 errors` or `FAIL — <n>/<total> records, <e> errors: <first offending record>`. The counts are mandatory, on both PASS and FAIL. Here "records" = the 9 work items (12 files total).
  **Gate contract:** (all four required — see templates/gated-phase-brief-template.md)
- **(a) Golden-fixture test:** n/a — no external-data surface; type-check plus a real browser screenshot pass (see gate below) stand in.
- **(b) Invariant on real data:** every one of the 14 routes renders with a 200 (no runtime error) when the dev server is hit; the pricing page's `£` figures visually show no comma-gap.
- **(c) Rollback:** `git revert <this phase's commit>` (code-only, no live state).
- **(d) Hard fail:** any route throws at render time, OR the pricing page uses `tabular-nums`/a mono face on a comma'd price, OR `heroImage` rendering was not added to both `BlogPostPage.tsx` and `ProjectDetailPage.tsx`.

```
Spawn nine agents in parallel (single Task-tool message):

Task: Rebuild components/pages/AboutPage.tsx in the r9 visual language
model: sonnet
Prompt: |
  Read sites/dcs/components/pages/AboutPage.tsx (187 lines) and sites/dcs/theme.config.ts
  (r9 tokens already promoted this session — Phase 1). Rebuild its visual style to match
  the r9 language using the promoted brand/surface tokens (bg-brand-primary,
  text-surface-foreground, etc.) — do not hardcode hex values. Keep the component's
  props/interface and data wiring unchanged; this is a visual rebuild, not a data change.
  Return a one-line summary of what changed.

Task: Rebuild components/pages/ContactPage.tsx in the r9 visual language
model: sonnet
Prompt: |
  Read sites/dcs/components/pages/ContactPage.tsx (222 lines) and sites/dcs/theme.config.ts
  (r9 tokens already promoted this session — Phase 1). Rebuild its visual style to match
  the r9 language using the promoted tokens. Keep props/data wiring unchanged (this page
  likely has a form — do not alter any form submission/validation logic, only its
  presentation). Return a one-line summary of what changed.

Task: Rebuild components/pages/ReviewsPage.tsx in the r9 visual language
model: sonnet
Prompt: |
  Read sites/dcs/components/pages/ReviewsPage.tsx (104 lines) and sites/dcs/theme.config.ts
  (r9 tokens already promoted this session — Phase 1). Rebuild its visual style to match
  the r9 language using the promoted tokens. Keep props/data wiring unchanged. Return a
  one-line summary of what changed.

Task: Rebuild components/pages/ServicesPage.tsx and ServiceDetailPage.tsx in the r9 visual language
model: sonnet
Prompt: |
  Read sites/dcs/components/pages/ServicesPage.tsx (146 lines),
  sites/dcs/components/pages/ServiceDetailPage.tsx (191 lines), and
  sites/dcs/theme.config.ts (r9 tokens already promoted this session — Phase 1).
  Rebuild both to match the r9 language using the promoted tokens, keeping the list and
  detail views visually consistent with each other (they're the same route family).
  Keep props/data wiring unchanged. Return a one-line summary of what changed in each file.

Task: Rebuild components/pages/LocationsPage.tsx and LocationDetailPage.tsx in the r9 visual language
model: sonnet
Prompt: |
  Read sites/dcs/components/pages/LocationsPage.tsx (95 lines),
  sites/dcs/components/pages/LocationDetailPage.tsx (160 lines), and
  sites/dcs/theme.config.ts (r9 tokens already promoted this session — Phase 1).
  Rebuild both to match the r9 language using the promoted tokens, keeping the list and
  detail views visually consistent with each other. Keep props/data wiring unchanged.
  Return a one-line summary of what changed in each file.

Task: Rebuild components/pages/BlogPage.tsx and BlogPostPage.tsx — r9 style plus hero-image rendering
model: sonnet
Prompt: |
  Read sites/dcs/components/pages/BlogPage.tsx (81 lines),
  sites/dcs/components/pages/BlogPostPage.tsx (153 lines),
  packages/core-components/src/lib/page-template-types.ts (look at BlogPostPageTemplateProps
  and BlogPostSummary — heroImage?: string is already declared there, you're adding the
  render path, not the type), and sites/dcs/theme.config.ts (r9 tokens already promoted
  this session — Phase 1).

  Two things to do:
  1. Rebuild both components' visual style to match the r9 language using the promoted
     tokens (bg-brand-primary, text-surface-foreground, etc.).
  2. Add actual rendering of frontmatter.heroImage: a thumbnail on each card in BlogPage's
     list view, and a full hero image on BlogPostPage's detail view. Use next/image with
     explicit width/height and quality=58 (content image, per docs/standards/images.md),
     descriptive alt text derived from the post title, and handle the case where
     heroImage is absent (optional field — many posts don't have a real one yet) by
     rendering nothing rather than a broken image.

  Keep props/data wiring otherwise unchanged. Return a one-line summary of what changed
  in each file, and confirm heroImage renders conditionally without crashing when absent.

Task: Rebuild components/pages/ProjectsPage.tsx and ProjectDetailPage.tsx — r9 style plus hero-image rendering
model: sonnet
Prompt: |
  Read sites/dcs/components/pages/ProjectsPage.tsx (101 lines),
  sites/dcs/components/pages/ProjectDetailPage.tsx (131 lines),
  packages/core-components/src/lib/page-template-types.ts (look at
  ProjectDetailPageTemplateProps and ProjectSummary — heroImage?: string is already
  declared there, you're adding the render path, not the type), and
  sites/dcs/theme.config.ts (r9 tokens already promoted this session — Phase 1).

  Two things to do:
  1. Rebuild both components' visual style to match the r9 language using the promoted
     tokens (bg-brand-primary, text-surface-foreground, etc.).
  2. Add actual rendering of frontmatter.heroImage: a thumbnail on each card in
     ProjectsPage's list view, and a full hero image on ProjectDetailPage's detail view.
     Use next/image with explicit width/height and quality=58 (content image, per
     docs/standards/images.md), descriptive alt text derived from the project title, and
     handle the case where heroImage is absent (all 13 current project files lack it) by
     rendering nothing rather than a broken image.

  Keep props/data wiring otherwise unchanged. Return a one-line summary of what changed
  in each file, and confirm heroImage renders conditionally without crashing when absent.
  This work is a prerequisite for Phase 4 (a new project file will set heroImage) — make
  sure the render path actually works, not just compiles.

Task: Rebuild app/(site)/pricing/page.tsx in the r9 visual language
model: sonnet
Prompt: |
  Read sites/dcs/app/(site)/pricing/page.tsx in full and sites/dcs/theme.config.ts
  (r9 tokens already promoted this session — Phase 1). This is an inline page component
  (no separate components/pages/ file) with pricing tiers including comma'd and
  decimal prices (£750, £45/mo, etc.).

  Rebuild its visual style to match the r9 language using the promoted tokens.

  CRITICAL TYPOGRAPHIC TRAP: comma'd prices must NEVER sit on font-variant-numeric:
  tabular-nums or a monospace font — tabular figures give the comma a full digit advance,
  rendering "£1,995" as "£1 , 995". Check components/home/pricing.tsx for how the
  homepage's own pricing section already documents and avoids this (same trap, same
  fix — keep prices on the Archivo/grotesk body face, resolve BOTH font-variant-numeric
  and font-family up the ancestor chain, not just this component's own classes).

  Keep the pricing tier data/logic unchanged — this is a visual rebuild only.
  Return a one-line summary of what changed, and explicit confirmation of how the
  comma-gap trap was avoided (which classes/fonts were checked up the ancestor chain).

Task: Rebuild components/legal/legal-hero.tsx and legal-toc.tsx in the r9 visual language
model: sonnet
Prompt: |
  Read sites/dcs/components/legal/legal-hero.tsx (44 lines) and
  sites/dcs/components/legal/legal-toc.tsx (31 lines), and sites/dcs/theme.config.ts
  (r9 tokens already promoted this session — Phase 1). These two shared components are
  used by all three legal routes: privacy-policy, cookie-policy, terms-and-conditions.

  Rebuild both to match the r9 language using the promoted tokens. Keep props/data wiring
  unchanged. Return a one-line summary of what changed in each file.
```

```bash
# Verification gate — STOP if this fails
pnpm --filter @platform/dcs run type-check
pnpm --filter @platform/dcs run lint

# Start a real dev server on a free port and hit every inner route
lsof -i :3100 || (cd sites/dcs && nohup npm run dev -- --webpack -p 3100 > /tmp/dcs-dev-phase3.log 2>&1 &)
sleep 5
for route in about blog contact cookie-policy locations pricing privacy-policy projects reviews services terms-and-conditions; do
  code=$(curl -s -o /dev/null -w "%{http_code}" "http://localhost:3100/$route")
  echo "$route -> $code"
  [ "$code" = "200" ] || { echo "FAIL: $route returned $code"; exit 1; }
done
```

```bash
git add sites/dcs/components/pages/ sites/dcs/components/legal/ "sites/dcs/app/(site)/pricing/page.tsx"
git commit -m "feat(dcs): rebuild 14 inner-route page components in the r9 brand, add hero-image rendering to blog/project templates

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>"
python3 "$SESSION_OBSERVABILITY_SKILL_PATH/session_observability.py" phase \
  --run-id 2026-08-25_dcs-r9-rebrand-inner-pages --phase-id phase-3 --event verdict \
  --verdict PASS --note "14 routes rebuilt, heroImage rendering added, all routes return 200"
```

---

## Phase 4: Reclassify the NP Racing post as a project case study

**Goal:** Move `content/blog/a-fast-team-needs-a-fast-website.mdx` to `content/projects/npracing.mdx`, reshaping its frontmatter to the DCS-local project shape (`title, description, date, tags, outcomes, heroImage`) — NOT the shared `ProjectFrontmatterSchema`. Keep the body content. The PSI-score graphic produced in the source session becomes its `heroImage` if a real R2 path for it already exists (check `output/sessions/2026-08-25_dcs-npracing-pagespeed-post/` for where that asset ended up — the HANDOFF there notes the PNG was NOT committed to git and NOT yet uploaded to R2, only produced locally). If no real R2 path exists yet, leave `heroImage` unset rather than inventing a path — do not fabricate a URL.
**Model:** sonnet — a single self-contained content move/reshape with one dependency check
**Execution:** delegate to 1 sonnet sub-agent
**Failure contract:**

- **Fail fast.** Any uncaught exception aborts the phase immediately — do not swallow it, retry blindly, or continue to the next step.
- **Show the evidence.** On failure, print the full traceback AND the offending record (the exact input/row/item being processed when it threw). No bare error messages.
- **No partial passes.** A phase that processed only some of its records has FAILED, not passed. Never report success on partial data — surface the shortfall.
- **Verdict line, always.** End the phase with exactly one line: `PASS — <n>/<total> records, 0 errors` or `FAIL — <n>/<total> records, <e> errors: <first offending record>`.
  **Gate contract:** (all four required — see templates/gated-phase-brief-template.md)
- **(a) Golden-fixture test:** n/a — content move, no external-data surface.
- **(b) Invariant on real data:** `/projects/npracing` renders with a 200; `/blog/a-fast-team-needs-a-fast-website` no longer resolves (404); `/blog` listing no longer includes it; `/projects` listing does.
- **(c) Rollback:** `git revert <this phase's commit>` (code-only, no live state).
- **(d) Hard fail:** the old blog route still resolves, OR the new project route 404s, OR `heroImage` was set to a fabricated/non-existent path.

```
Task: Move a-fast-team-needs-a-fast-website.mdx from content/blog/ to content/projects/npracing.mdx
model: sonnet
Prompt: |
  Read sites/dcs/content/blog/a-fast-team-needs-a-fast-website.mdx in full, and read 3-4
  existing files in sites/dcs/content/projects/ (e.g. dj-fox-electrical.mdx,
  colossus-scaffolding.mdx) to confirm the exact frontmatter shape in use there:
  title, description, date, tags, outcomes (+ the now-supported heroImage from Phase 3).

  Also read output/sessions/2026-08-25_dcs-npracing-pagespeed-post/HANDOFF.md to check
  whether the PSI-score graphic PNG was ever uploaded to R2 (a real https URL) or only
  exists locally / was never committed. Do NOT fabricate an R2 URL if none exists yet —
  if no real uploaded path exists, leave heroImage unset in the new file rather than
  guessing a path.

  Create sites/dcs/content/projects/npracing.mdx with:
  - title, description adapted from the blog post's title/description/excerpt (keep it
    accurate to the content — it's about NP Racing's PageSpeed scores, not their whole
    website build)
  - date: the blog post's date field
  - tags: reasonable tags matching this project's actual content (e.g. website-performance,
    case-study — check what tags the existing project files use for style consistency)
  - outcomes: a short bullet list summarizing the real, verified results from the post body
    (100/100/100/100 mobile and desktop PageSpeed scores, 1.8s/0.4s LCP, etc. — pull these
    from the body content, don't re-derive or round differently)
  - heroImage: only if a real R2 path was found per above, otherwise omit the field entirely
  - Keep the full markdown body content from the original post essentially as-is (it's
    already well-written and accurate) — do not rewrite the prose, just move it.

  Delete sites/dcs/content/blog/a-fast-team-needs-a-fast-website.mdx.

  Grep the whole sites/dcs tree for any other reference to the old slug
  ("a-fast-team-needs-a-fast-website") — e.g. in a sitemap, related-posts list, or another
  MDX file's relatedServices/tags — and update or remove those references so nothing links
  to a route that no longer exists.

  Return: the new file's path, confirmation the old file was deleted, and a list of any
  other files that referenced the old slug and what was done about them.
```

```bash
# Verification gate — STOP if this fails
pnpm --filter @platform/dcs run type-check
curl -s -o /dev/null -w "%{http_code}" "http://localhost:3100/projects/npracing" | grep -q 200 || { echo "FAIL: new project route not 200"; exit 1; }
curl -s -o /dev/null -w "%{http_code}" "http://localhost:3100/blog/a-fast-team-needs-a-fast-website" | grep -q 404 || { echo "FAIL: old blog route still resolves"; exit 1; }
```

```bash
git add sites/dcs/content/blog/a-fast-team-needs-a-fast-website.mdx sites/dcs/content/projects/npracing.mdx
git commit -m "content(dcs): move NP Racing PageSpeed post from blog to a project case study

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>"
python3 "$SESSION_OBSERVABILITY_SKILL_PATH/session_observability.py" phase \
  --run-id 2026-08-25_dcs-r9-rebrand-inner-pages --phase-id phase-4 --event verdict \
  --verdict PASS --note "NP Racing post reclassified as a project case study"
```

---

## Phase 5: Fix BlogCategory schema drift and add missing blog/project validation

**Goal:** (a) Expand the `BlogCategory` enum in `packages/core-components/src/lib/content-schemas.ts` to include the values DCS's 21 blog posts actually use (`local-seo`, `website-design`, `costs-and-value`, `getting-found-online`, `industry-guides`, `website-content`, `business-tools`) — after checking whether any other site's blog content would be affected by this shared-package change. (b) Add a real `blog` case (and a `project` case matching the DCS-local shape) to `scripts/validate-content.ts` and/or `sites/dcs/scripts/validate-content.ts`, so this content type is actually checked going forward.
**Model:** sonnet — a schema enum change with a cross-site check, and new validation logic mirroring an existing pattern in the same file
**Execution:** delegate to 2 sonnet sub-agents in one message (content-schemas.ts and validate-content.ts are independent files with no overlap)
**Failure contract:**

- **Fail fast.** Any uncaught exception aborts the phase immediately — do not swallow it, retry blindly, or continue to the next step.
- **Show the evidence.** On failure, print the full traceback AND the offending record (the exact input/row/item being processed when it threw). No bare error messages.
- **No partial passes.** A phase that processed only some of its records has FAILED, not passed. Never report success on partial data — surface the shortfall.
- **Verdict line, always.** End the phase with exactly one line: `PASS — <n>/<total> records, 0 errors` or `FAIL — <n>/<total> records, <e> errors: <first offending record>`.
  **Gate contract:** (all four required — see templates/gated-phase-brief-template.md)
- **(a) Golden-fixture test:** the new `blog` validation case run against all 20 real DCS blog MDX files (real content, not synthetic) must pass.
- **(b) Invariant on real data:** every real `content/blog/*.mdx` and `content/projects/*.mdx` file in `sites/dcs` validates cleanly against the (possibly expanded) schema/new validator; validated-count > 0.
- **(c) Rollback:** `git revert <this phase's commit>` (code-only, no live state).
- **(d) Hard fail:** any real blog/project file fails the new validation, OR the `BlogCategory` change was made without checking other sites' blog content, OR 0 files were validated.

```
Spawn two agents in parallel (single Task-tool message):

Task: Expand BlogCategory enum in packages/core-components/src/lib/content-schemas.ts
model: sonnet
Prompt: |
  Read packages/core-components/src/lib/content-schemas.ts, specifically BlogCategory
  (currently: industry-tips | how-to-guide | case-study | seasonal | news) and
  BlogFrontmatterSchema.

  This is SHARED platform code — before changing it, grep every site's content/blog/
  directory (sites/*/content/blog/*.mdx) for their category: frontmatter values. List
  every distinct category value in use across ALL sites, not just DCS.

  If any other site relies on the current narrower enum in a way that would break if you
  simply expand it (unlikely, since expanding is additive, but verify), STOP and report
  instead of proceeding.

  Expand BlogCategory to include the union of all values actually found in use, keeping
  the existing five values too (nothing currently in use should become invalid). Sort/group
  them sensibly. Do not remove any existing enum value.

  Return: the full list of category values found across all sites, the final enum you
  produced, and explicit confirmation whether any other site's content was at risk.

Task: Add blog and project content-type support to validate-content.ts
model: sonnet
Prompt: |
  Read scripts/validate-content.ts (root) in full — note it currently only handles
  "service" and "location" types (see the validateFile function signature and whatever
  dispatches on process.argv). Read sites/dcs/scripts/validate-content.ts too (same
  situation, 211 lines, no "blog" or "project" case exists in either file).

  Read packages/core-components/src/lib/content-schemas.ts to get BlogFrontmatterSchema
  (and the BlogCategory enum, which the other agent in this phase may be updating
  concurrently — re-read it fresh before relying on its contents, don't assume the old enum).

  Add a "blog" case to whichever of these two scripts is the one actually meant to be run
  for DCS content (check sites/dcs/package.json's validate:content script to see which
  file it invokes) that validates every file in content/blog/ against
  BlogFrontmatterSchema. Also add a "project" case that validates content/projects/*.mdx
  against the DCS-local shape actually in use (title, description, date, tags, outcomes,
  heroImage — NOT the stricter shared ProjectFrontmatterSchema, which doesn't apply here,
  per this session's session.md decision log) — you may need to define a small local Zod
  schema for this shape rather than reusing ProjectFrontmatterSchema, since that schema
  requires fields (projectType, location, completionDate) DCS's projects don't have.

  Wire the new case(s) into the existing CLI argument handling (mirroring how "service"
  and "location" are dispatched) so it can be run standalone, e.g.
  `npx tsx scripts/validate-content.ts blog` and `... project`.

  Run the new validation against sites/dcs/content/blog/*.mdx (all 20 remaining files —
  the NP Racing one moved out in Phase 4) and sites/dcs/content/projects/*.mdx (14 files
  after Phase 4's addition). Every one must pass. If any fails, report exactly which file
  and which field, and fix the file's frontmatter if the fix is obviously correct (e.g. a
  typo) — do NOT silently loosen the schema to make a genuinely malformed file pass.

  Return: the exact command(s) to run each new validation case, and the pass/fail count
  for both content types.
```

```bash
# Verification gate — STOP if this fails
pnpm --filter @platform/dcs run type-check
npx tsx scripts/validate-content.ts blog 2>&1 | tee /tmp/dcs-blog-validate.log
grep -qi "fail\|error" /tmp/dcs-blog-validate.log && { echo "FAIL: blog validation reported failures"; exit 1; }
npx tsx scripts/validate-content.ts project 2>&1 | tee /tmp/dcs-project-validate.log
grep -qi "fail\|error" /tmp/dcs-project-validate.log && { echo "FAIL: project validation reported failures"; exit 1; }
echo "OK: both validations clean"
```

```bash
git add packages/core-components/src/lib/content-schemas.ts scripts/validate-content.ts sites/dcs/scripts/validate-content.ts
git commit -m "fix(content): expand BlogCategory enum to match real usage, add blog/project validation

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>"
python3 "$SESSION_OBSERVABILITY_SKILL_PATH/session_observability.py" phase \
  --run-id 2026-08-25_dcs-r9-rebrand-inner-pages --phase-id phase-5 --event verdict \
  --verdict PASS --note "BlogCategory enum fixed, blog+project validation added and passing"
```

---

## Phase 6: Final verification gates

**Goal:** Run every correctness gate this repo defines for `sites/dcs`, scoped to the package (not repo-wide), plus an explicit diff check confirming the `robots` export in `app/(site)/layout.tsx` was never touched across the whole branch.
**Model:** haiku — running existing commands and reporting their output is mechanical
**Execution:** delegate to 1 haiku sub-agent
**Failure contract:**

- **Fail fast.** Any uncaught exception aborts the phase immediately — do not swallow it, retry blindly, or continue to the next step.
- **Show the evidence.** On failure, print the full traceback AND the offending record (the exact input/row/item being processed when it threw). No bare error messages.
- **No partial passes.** A phase that processed only some of its records has FAILED, not passed. Never report success on partial data — surface the shortfall.
- **Verdict line, always.** End the phase with exactly one line: `PASS — <n>/<total> records, 0 errors` or `FAIL — <n>/<total> records, <e> errors: <first offending record>`. Here "records" = the gates run (type-check, lint, build, content validation, e2e smoke, robots-diff).
  **Gate contract:** (all four required — see templates/gated-phase-brief-template.md)
- **(a) Golden-fixture test:** `sites/dcs/e2e/smoke.spec.ts` (if it exists) run against a real `next start` build, per this repo's CI convention (pre-built, not `next dev`).
- **(b) Invariant on real data:** all gates below exit 0.
- **(c) Rollback:** n/a — this phase makes no code changes, nothing to roll back.
- **(d) Hard fail:** any gate below is non-zero, OR the `robots` export differs at all from `develop`.

```
Task: Run all final verification gates for sites/dcs and report pass/fail
model: haiku
Prompt: |
  Run each of these commands from /Users/rickywilson/Sites/local-business-platform and
  report the exact output and exit code of each. Do not proceed past a failing command —
  stop and report which one failed and its full output.

  1. pnpm --filter @platform/dcs run type-check
  2. pnpm --filter @platform/dcs run lint
  3. cd sites/dcs && npm run build && cd ../..    (webpack build, not turbopack — this
     is what the package.json build script already does, do not change it)
  4. pnpm --filter @platform/dcs run validate:content   (runs the new blog + project
     cases added in Phase 5, plus the existing service/location ones)
  5. cd sites/dcs && npx playwright test e2e/smoke.spec.ts --project=chromium 2>&1 || echo "e2e smoke not runnable/present, note and continue" ; cd ../..
  6. git diff develop..HEAD -- "sites/dcs/app/(site)/layout.tsx" — grep the diff output
     for the word "robots". If it appears in the diff, print the surrounding lines and
     FAIL this gate explicitly — the robots export must be byte-for-byte unchanged from
     develop. If the file has no diff at all, or a diff that doesn't touch the robots
     block, that's a pass.

  Return: pass/fail for each of the 6 items, with full output for anything that failed.
```

```bash
# Verification gate — STOP if this fails (re-run directly, not just trust the sub-agent's report)
pnpm --filter @platform/dcs run type-check
pnpm --filter @platform/dcs run lint
(cd sites/dcs && npm run build)
pnpm --filter @platform/dcs run validate:content
git diff develop..HEAD -- "sites/dcs/app/(site)/layout.tsx" | grep -i "robots" && { echo "FAIL: robots export was touched"; exit 1; } || echo "OK: robots export untouched"
```

```bash
python3 "$SESSION_OBSERVABILITY_SKILL_PATH/session_observability.py" phase \
  --run-id 2026-08-25_dcs-r9-rebrand-inner-pages --phase-id phase-6 --event verdict \
  --verdict PASS --note "all gates green, robots export confirmed unchanged"
```

(No commit — this phase makes no code changes.)

---

## Phase 7: Blog hero-image sourcing — generate, upload to real R2, apply to MDX, ship

**Goal:** Ship real hero images for the 20 remaining blog posts (NP Racing's is done — Phase 4): generate/screenshot the assets, upload them to real R2, update each post's `heroImage` frontmatter to the real uploaded path, delete the dead `placeholder/blog-*.webp` values, and commit. This is a full ship, not a proposal.
**Model:** sonnet — requires live browser-tool screenshotting of real client sites and content judgment about which posts get which treatment
**Execution:** inline (exception) — needs direct orchestrator-level browser-tool orchestration (Claude-in-Chrome) to screenshot live client sites, and produces judgment calls (which screenshot looks good, framing, crop) that would lose essential context if round-tripped through a blind sub-agent per the Delegation Model.
**Environment check — do this FIRST, before generating any assets, as a live guard rather than an expected problem:**
`tools/lib/r2-client.ts` requires `R2_ACCOUNT_ID`, `R2_ACCESS_KEY_ID`, `R2_SECRET_ACCESS_KEY` and throws explicitly if any are unset. Verified 2026-08-25: all four R2 vars (including `R2_BUCKET_NAME`) are present with real, non-empty values in this repo's root `.env.local` — this is the same config the live site already uses to serve R2-hosted images, so the upload path is expected to work. Confirm this is still true in whatever environment actually runs this phase (a fresh checkout might not have `.env.local` — it's gitignored by convention) before proceeding:

- **If all three write credentials are present:** proceed with the full ship below.
- **If any are missing** (e.g. a different machine/checkout without `.env.local`): do NOT fabricate a URL, do NOT silently fall back to a local-only proposal without saying so loudly. Generate and stage every asset locally under `output/sessions/2026-08/2026-08-25_dcs-r9-rebrand-inner-pages/blog-images/` exactly as described below, write the mapping doc, but stop before the upload/MDX-write step and report clearly in the Final Report: "R2 credentials not available in this environment — 20/20 images generated and staged at `<path>`, NOT uploaded, MDX NOT modified. Copy `.env.local` into this environment (or set `R2_ACCOUNT_ID`/`R2_ACCESS_KEY_ID`/`R2_SECRET_ACCESS_KEY`) and re-run this phase to complete the ship." This is a FAIL verdict for this phase (see below), not a PASS with a caveat — the goal was to ship, and shipping did not happen.
  **Failure contract:**
- **Fail fast.** Any uncaught exception aborts the phase immediately — do not swallow it, retry blindly, or continue to the next step.
- **Show the evidence.** On failure, print the full traceback AND the offending record (the exact input/row/item being processed when it threw). No bare error messages.
- **No partial passes.** A phase that processed only some of its records has FAILED, not passed — if fewer than 20 posts get a real uploaded image, report the exact shortfall and why (a site was unreachable, R2 credentials missing, an upload failed), don't silently ship a partial set as if it were complete.
- **Verdict line, always.** End the phase with exactly one line: `PASS — <n>/<total> records, 0 errors` or `FAIL — <n>/<total> records, <e> errors: <first offending record>`. Here "records" = the 20 blog posts needing a real shipped image. Missing R2 credentials → `FAIL — 0/20 records, 1 error: R2_ACCOUNT_ID/R2_ACCESS_KEY_ID/R2_SECRET_ACCESS_KEY not set`.
  **Gate contract:** (all four required — see templates/gated-phase-brief-template.md)
- **(a) Golden-fixture test:** n/a — asset generation/upload, no existing parser/mapper being exercised against a recorded shape.
- **(b) Invariant on real data:** every one of the 20 posts' `heroImage` frontmatter resolves to a real, fetchable R2 URL (verify with `curl -s -o /dev/null -w "%{http_code}"` on each — must be 200) after this phase, if it ran to completion.
- **(c) Rollback:** `git revert <this phase's commit>` for the MDX changes (code-only); the uploaded R2 objects themselves are not deleted by a revert — if a re-upload is ever needed at the same key, remember R2 does not bust the CDN cache on overwrite (rename the file instead, per this repo's own documented gotcha).
- **(d) Hard fail:** any of the 20 posts ends up with a `heroImage` pointing at a URL that doesn't actually resolve, OR a fabricated/guessed URL is written anywhere, OR the phase silently reports success while R2 credentials were actually missing.

**Do this work directly (inline exception, no sub-agent delegation):**

1. Check `.env.local` for `R2_ACCOUNT_ID`, `R2_ACCESS_KEY_ID`, `R2_SECRET_ACCESS_KEY`. If any are missing, follow the "If any are missing" branch above and stop before uploading.
2. Take real browser screenshots of `djfoxelectrical.com` (for `best-websites-for-electricians.mdx`) and Colossus Scaffolding's live site (for `best-websites-for-scaffolding-companies.mdx`) — check `content/projects/dj-fox-electrical.mdx` and `content/projects/colossus-scaffolding.mdx` for the correct live URLs first, don't guess. Crop/frame each as a usable blog hero image.
3. For the other 18 generic-advice posts, design a small set of reusable r9-branded category graphics — roughly one per distinct `category` value used across those posts (check the actual values after Phase 5's enum work) — rather than 18 bespoke one-offs. Use the `design`/`banner-design` skill if it produces a faster, more consistent result than hand-authoring HTML+screenshot per graphic.
4. Save every generated/screenshotted asset locally first under `output/sessions/2026-08/2026-08-25_dcs-r9-rebrand-inner-pages/blog-images/` (per this repo's rule, anything under `output/sessions/**` is gitignored for binaries, so these never accidentally get committed as files — they get committed as R2 URLs in MDX frontmatter instead).
5. If R2 credentials are present: upload every asset to R2 under `dcs/blog/...` (per the site-folder convention in `docs/standards/images.md`), using `tools/upload-prototype-assets.ts` if its interface fits, or `tools/lib/r2-client.ts` directly otherwise. Use `CACHE_ARCHIVE`-style long-lived cache headers (these are final assets, not live-iterating prototype files) and correct content types per extension.
6. Update each of the 20 posts' `heroImage` frontmatter to the real uploaded R2 path (full public URL, per `NEXT_PUBLIC_R2_PUBLIC_URL` convention). Delete the dead `placeholder/blog-*.webp` values on the 15 posts that had them.
7. Write `output/sessions/2026-08/2026-08-25_dcs-r9-rebrand-inner-pages/blog-images/MAPPING.md` documenting, per post: which image was used, whether it's a real screenshot or a category graphic, and its final R2 URL — a record of what shipped, not a proposal awaiting approval.
8. Verify every one of the 20 URLs actually resolves with a 200 before committing (see Gate contract (b)) — do not commit unverified URLs.

```bash
git add sites/dcs/content/blog/*.mdx
git commit -m "feat(dcs): add real hero images for 20 blog posts (screenshots + category graphics)

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>"
python3 "$SESSION_OBSERVABILITY_SKILL_PATH/session_observability.py" phase \
  --run-id 2026-08-25_dcs-r9-rebrand-inner-pages --phase-id phase-7 --event verdict \
  --verdict PASS --note "20/20 blog posts shipped with real R2-hosted hero images"
```

If the phase stopped at the R2-credentials blocker instead, skip the commit above — there is nothing to commit — and report the FAIL verdict with the exact missing-credentials message instead.

---

## Parallel execution groups

This section lists work units that can run concurrently. Each group lists items that MUST be launched in a single Task-tool message. Items across groups run sequentially in the order listed. Groups are named `G1`, `G2`, … for reference.

### Intra-phase groups

| Group | Phase   | Items                                                                                                                                                                                                                                                    | File overlap | Model  | Rationale                                                       |
| ----- | ------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------ | ------ | --------------------------------------------------------------- |
| G1    | Phase 1 | 1 sub-agent, sequential                                                                                                                                                                                                                                  | n/a          | sonnet | Single-file/config phase, no parallel work available            |
| G2    | Phase 2 | Rebuild `site-header.tsx`, Rebuild `site-footer.tsx`                                                                                                                                                                                                     | none         | sonnet | Independent files, no shared state, both consume Phase 1 tokens |
| G3    | Phase 3 | AboutPage.tsx; ContactPage.tsx; ReviewsPage.tsx; ServicesPage.tsx+ServiceDetailPage.tsx; LocationsPage.tsx+LocationDetailPage.tsx; BlogPage.tsx+BlogPostPage.tsx; ProjectsPage.tsx+ProjectDetailPage.tsx; pricing/page.tsx; legal-hero.tsx+legal-toc.tsx | none         | sonnet | 9 disjoint file sets, no two items touch the same file          |
| G4    | Phase 4 | 1 sub-agent, sequential                                                                                                                                                                                                                                  | n/a          | sonnet | Single content move, depends on Phase 3's heroImage rendering   |
| G5    | Phase 5 | Expand `BlogCategory` enum; add blog/project validate-content.ts cases                                                                                                                                                                                   | none         | sonnet | Independent files, no shared state                              |
| G6    | Phase 6 | 1 sub-agent, sequential                                                                                                                                                                                                                                  | n/a          | haiku  | Mechanical gate-running, nothing to parallelise                 |
| G7    | Phase 7 | inline (exception) — includes a real R2 upload step, not just local asset generation                                                                                                                                                                     | n/a          | sonnet | Declared inline exception — orchestrator does this directly     |

### Cross-phase groups (only if phases are truly independent)

| Group  | Phases | Items | Rationale |
| ------ | ------ | ----- | --------- |
| (none) |        |       |           |

Phases are NOT cross-phase-parallel here: Phase 2/3 both depend on Phase 1's tokens; Phase 4 depends on Phase 3's heroImage rendering; Phase 5 is independent of 2-4 in principle but shares the same verification gates and is kept sequential for a clean commit history; Phase 6 depends on everything before it; Phase 7 is deliberately last and non-blocking.

### Sequential points — MUST NOT parallelise

| Item                                                                             | Reason                                                                     |
| -------------------------------------------------------------------------------- | -------------------------------------------------------------------------- |
| Verification gates (type-check / lint / build / content-validate) between phases | Each phase's output gates the next. Gates are the synchronisation barrier. |
| Git commits                                                                      | One commit per phase, in order. Commits are never batched.                 |
| Any file edited by two or more items                                             | Same-file edits must always serialise.                                     |
| Phase 3 before Phase 4                                                           | Phase 4's new project file needs Phase 3's heroImage rendering to exist.   |
| Phase 1 before Phases 2 and 3                                                    | Both consume the tokens Phase 1 promotes.                                  |

---

## Cost Estimate

| Phase                                              | Model  | Est. input tokens | Est. output tokens | Est. cost  |
| -------------------------------------------------- | ------ | ----------------- | ------------------ | ---------- |
| Phase 1: Promote r9 tokens                         | sonnet | ~15k              | ~2k                | ~$0.075    |
| Phase 2: Rebuild header/footer (2 agents)          | sonnet | ~24k              | ~6k                | ~$0.16     |
| Phase 3: Rebuild 14 routes + hero-image (9 agents) | sonnet | ~90k              | ~30k               | ~$0.72     |
| Phase 4: Reclassify NP Racing post                 | sonnet | ~12k              | ~3k                | ~$0.081    |
| Phase 5: Schema + validation fixes (2 agents)      | sonnet | ~30k              | ~8k                | ~$0.21     |
| Phase 6: Final verification gates                  | haiku  | ~6k               | ~1k                | ~$0.011    |
| Phase 7: Image sourcing + real R2 ship (inline)    | sonnet | ~25k              | ~9k                | ~$0.21     |
| **Total**                                          |        | **~202k**         | **~59k**           | **~$1.47** |

Rates: Opus $5/$25, Sonnet $3/$15, Haiku $1/$5 per MTok.
Estimation: ~5 tokens per line of code read/written; input includes files read + brief (~5k) + system prompt (~3k) per agent; output includes code written + verification output (~500/gate). Screenshotting/image-generation/upload in Phase 7 is not well captured by this line-count heuristic and may run higher in practice — it's also the one phase with an external dependency (R2 credentials) that could make it exit early on 0 image-generation cost if the blocker fires immediately.

---

## Final Report

After all phases complete, output:

1. Phases completed — list each with commit SHA (Phase 6 makes no commit — note that explicitly rather than omitting it; Phase 7 commits only if it actually shipped — see item 4)
2. Build status — confirm `pnpm --filter @platform/dcs run type-check && (cd sites/dcs && npm run build) && pnpm --filter @platform/dcs run lint && pnpm --filter @platform/dcs run validate:content` all pass
3. Any exceptions or intentional deviations from the plan
4. Explicitly restate the deferred/flagged decisions from the Context section above so Ricky sees them without digging through phase output: the token role mapping applied in Phase 1, the `BlogCategory` cross-site check result from Phase 5, and — most importantly — **whether Phase 7 actually shipped or stopped at the R2-credentials blocker**. If it stopped, state exactly where the generated assets are staged and what needs adding to `.env.local` to finish the job.
5. Explicitly confirm: the `robots` export in `app/(site)/layout.tsx` is unchanged from `develop`
6. Token usage and cost estimate:

   | Model     | Est. input tokens     | Est. output tokens | Est. cost |
   | --------- | --------------------- | ------------------ | --------- |
   | sonnet    | [total across phases] |                    | $X.XX     |
   | haiku     | [Phase 6]             |                    | $X.XX     |
   | **Total** |                       |                    | **$X.XX** |

   Compare to the Cost Estimate above. For exact figures: check console.anthropic.com.

---

## Update Session File

After completing all phases, append to `output/sessions/2026-08/2026-08-25_dcs-r9-rebrand-inner-pages/yolo-brief.md`:

```markdown
## Completed

**Date:** [today]
**Status:** All phases executed successfully

[1-paragraph summary: what was implemented, any surprises]

### Commits

[list each commit SHA and message]
```

## Run Wrap-Up

After completing all phases and updating the session file, run:

/wrap-up-session

This writes a wrap-up summary to the session folder. **Do not skip it.**

---

## Rules

- STOP on any failed verification gate — do not continue to next phase
- **Honour every phase's `**Failure contract:**`.** Fail fast on any uncaught exception (never swallow, blind-retry, or press on), print the full traceback and the offending record, and never report a phase as passed on partial data. Each phase MUST end with its one-line PASS/FAIL verdict including counts. A FAIL verdict is a failed gate — STOP.
- **Honour every phase's `**Gate contract:**`.** A phase passes only when its checks are **executed**, not just declared. A phase whose fixture/invariant did not actually run has NOT passed — STOP. Have the phase's rollback (c) to hand before you start it.
- Read every file before editing it
- Never push — leave all changes on the feature branch
- **Delegate every phase's implementation to sub-agents by default.** Only Phase 7 is inline, and it declares why.
- **The `**Model:**` tier names the sub-agent's model, not the orchestrator's.**
- **Consult the `## Parallel execution groups` section before launching any work.** Every item listed in a group MUST be launched in a single Task-tool message.
- **Items NOT listed in any group run sequentially — but still as delegated sub-agents.**
- **Never parallelise across phase boundaries** — the Cross-phase groups table is empty in this brief; treat all 8 phases as strictly sequential.
- **If the groups table and the phase prose disagree, the groups table wins.**
- Minimal changes only — implement what the plan says, nothing more.
- Use `model: haiku` for mechanical work, `model: sonnet` for standard edits, `model: opus` only for deep multi-file reasoning (not needed anywhere in this brief).
- The Co-Authored-By line in commits must reflect the **orchestrator** model (the committer). If the running orchestrator differs from this brief's stated `**Orchestrator model:**` (sonnet), use the actual running model.
- Every brief MUST verify with the project's type-check, lint, and build gates. STOP if any fails. This repo also requires `next build --webpack` specifically (not Turbopack) for `sites/dcs` — already the package's own `build` script, do not change it.
- **Real-data rule for Phase 7:** every hero image must be a real screenshot of a real live client URL (verified from `content/projects/*.mdx`, not guessed) or a real generated graphic — never a fabricated/placeholder image passed off as real, and never a `heroImage` value pointing at a URL that hasn't been verified to actually resolve (200). Phase 7 is explicitly allowed and expected to upload to production R2 and commit MDX changes when R2 credentials are available — that is the intended ship, not scope creep. It is equally expected to STOP short of that and report honestly if the credentials aren't there (see Phase 7's known blocker) — reporting a fabricated success is worse than reporting an honest incomplete ship.

---

## Completed

**Date:** 2026-08-25
**Status:** All 7 implementation phases executed successfully (Phase 0 pre-flight, Phase 6 verification-only — no commit) — **then rejected on visual-design grounds and ARCHIVED, not merged.** Branch renamed `archive/dcs-r9-inner-pages-v1-2026-08-25`. See the post-review note at the top of `session-wrap-up.md` in this folder for what's salvageable vs. what needs a real redesign pass.

Rebuilt DCS's shared header/footer and all 14 inner routes against a newly-promoted r9 theme-token set (magenta/aqua/navy/ink/paper via `colors.brand.*`/`colors.surface.*`), added conditional `heroImage` rendering to the blog and project templates, reclassified the NP Racing PageSpeed post as a project case study, fixed a `BlogCategory` schema/enum drift and added missing blog/project content validation, and shipped real R2-hosted hero images for all 20 remaining blog posts (2 live client screenshots + 7 reusable r9-branded category graphics). The `robots: { index: false, follow: false }` export was confirmed byte-for-byte unchanged from `develop` throughout.

**Surprises / deviations from the plan:**

- Nine of the fourteen Phase 3 sub-agents independently used non-existent `font-body`/`font-headline` Tailwind classes (silent no-ops — this site's real tokens are `font-sans`/`font-heading`). Two agents (Services, pricing) caught and self-corrected it; the other seven were fixed by the orchestrator directly with a grep + find/replace across all touched files before the Phase 3 gate.
- The `heroImage` guard the Phase 3 sub-agents wrote (checking for an absolute `http(s)://` URL or a leading `/`) crashed `/blog` at render time on the 15 posts still carrying dead `placeholder/blog-*.webp` values — `next/image` throws on a bare relative string. Fixed by adding a real resolvability check before Phase 3's commit.
- Phase 5's new blog validator surfaced 5 real blog posts with a missing required `excerpt` field (a pre-existing content gap this session's new validator was the first thing ever to catch — see Trap 6 in this brief). Per user decision (asked mid-session rather than silently loosening the schema or stopping the whole brief), backfilled `excerpt` on all 5 from each post's own existing `description` field — no new copy invented.
- Phase 7 surfaced a second, more fundamental `heroImage` bug: frontmatter must store a **relative R2 key** (`ImagePathSchema`'s convention, e.g. `dcs/blog/foo.webp`), not a full URL — `getImageUrl()` resolves it to a full URL at render time. The Phase 3 rendering code and Phase 7's initial frontmatter writes both used full URLs. Fixed by switching `BlogPage`/`BlogPostPage`/`ProjectsPage`/`ProjectDetailPage` to `isValidImagePath()` + `getImageUrl()` (both already exported from `@platform/core-components/lib/image`, re-exported via `sites/dcs/lib/image.ts`) and rewriting all 20 posts' `heroImage` values to relative keys. Visually confirmed working in a live dev server afterward.
- `sites/dcs/.env.local` (gitignored, pre-existing) was missing `NEXT_PUBLIC_R2_PUBLIC_URL` — added locally only, for dev-server verification; not a repo change.
- The Colossus Scaffolding live URL wasn't stated in its own `content/projects/colossus-scaffolding.mdx`; verified against real HTTP responses instead of guessing (`colossus-scaffolding.vercel.app` 404s; `www.colossus-scaffolding.co.uk` is the real live domain).

### Commits

- `44e6b281` — feat(dcs): promote r9 palette to real brand/surface theme tokens
- `7cf1ef97` — feat(dcs): rebuild shared header/footer in the r9 brand
- `67418868` — feat(dcs): rebuild 14 inner-route page components in the r9 brand, add hero-image rendering to blog/project templates
- `ba39ffb4` — content(dcs): move NP Racing PageSpeed post from blog to a project case study
- `a70dd88c` — fix(content): expand BlogCategory enum to match real usage, add blog/project validation
- `a14598aa` — feat(dcs): add real hero images for 20 blog posts (screenshots + category graphics)

(Phase 6 — final verification gates — made no commit, as specified.)
