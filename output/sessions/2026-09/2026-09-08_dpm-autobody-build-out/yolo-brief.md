# YOLO Implementation Brief: DPM Autobody — real pages ported from the approved prototype

**Branch:** feature/dpm-autobody-real-pages (created from `develop` — this project's confirmed
integration branch; root `CLAUDE.md`'s git workflow is `develop → staging → main`, never a
direct push to staging/main. This brief creates an isolated feature branch and does not push —
Ricky reviews and merges into `develop` himself afterward, same as any other change here.)
**Session spec:** output/sessions/2026-09/2026-09-08_dpm-autobody-build-out/yolo-brief.md
**Mode:** Autonomous execution — coordinate all phases, delegate implementation to sub-agents, verify after each, STOP on error
**Orchestrator model:** sonnet — coordinator only; per-phase `**Model:**` tiers attach to delegated sub-agents and are independent of this

---

## Context

**Plan source:** Claude independent plan (no Codex review — this is a single-site content/component
build extending an already-approved visual direction, not a new architectural pattern; matches this
project's own precedent for skipping `/plan.with.codex` on this class of task).

`sites/dpm-autobody` is a real Next.js site scaffolded from `base-template` (2026-09-11) but its
pages are still base-template's generic placeholders. The actual design — near-black ground,
auction-lot-page structure, paint-code accent — exists only in a static HTML prototype, reviewed
and approved by both Ricky and the client (David) and live at `dpm-autobody-proto.vercel.app`.
This brief ports that approved prototype into real React/MDX: header, footer, home, workshop,
contact, the library index, and the two individual build pages that have complete real content.

**Why visual fidelity verification is load-bearing, not optional polish:** a prior attempt at this
exact class of work (DCS's 14-inner-route rebuild) was built from a _prose description_ of the
design tokens and was rejected outright — "utterly horrible, not one thing has picked up any of the
design cues other than colours" (see project memory `feedback_visual_rebuild_needs_visual_reference`).
Every page phase in this brief reads the prototype's actual HTML/CSS directly, and every rebuilt
page is screenshotted and compared against a reference screenshot of the live prototype before the
brief can pass. This is Phase 7 below, and it is a hard gate, not an informational step.

**Scope correction made before this brief was written:** the prototype's library page
(`prototype/client/library.html`) has real, DPM-approved photography for 4 of its 12 rows (P1800
Candy, Bentley S3 Continental, Jaguar Sea Green, E-Type 941pvo), but only 2 of those 4 — P1800
Candy and E-Type — have a complete "documented car" page already built
(`volvo-p1800.html`, `etype-941pvo.html`). Bentley and Jaguar have approved photos but almost no
restoration narrative yet, and the prototype itself deliberately leaves their "full record" links
dead rather than shipping a thin page. **This brief follows the prototype's own honesty pattern
exactly: only P1800 Candy and E-Type get real `/builds/[slug]` pages. Bentley and Jaguar get their
real photo in the library row and nothing else — no individual page, matching the prototype.**
Confirmed with Ricky before this brief was written.

Implement the plan exactly as specified below.

## Model Tiers

| Tier   | Alias    | Cost (in/out per MTok) | Use for                                                                                             |
| ------ | -------- | ---------------------- | --------------------------------------------------------------------------------------------------- |
| Opus   | `opus`   | $15 / $75              | Phases with >5 interdependent files, architectural rewrites, judgment calls not covered by the spec |
| Sonnet | `sonnet` | $3 / $15               | Standard implementation — file edits, feature wiring, most phases                                   |
| Haiku  | `haiku`  | $0.80 / $4             | Mechanical tasks: find-replace, import additions, grep checks, content validation                   |

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
# Base branch is develop (this project's confirmed integration branch — see root CLAUDE.md's
# git workflow: develop → staging → main). Do NOT branch from main.
git checkout develop && git pull
git checkout -b feature/dpm-autobody-real-pages

# Sanity gate — must be clean before starting
pnpm --filter dpm-autobody run type-check

# Session observability run-init (SESSION_OBSERVABILITY_SKILL_PATH is set in this environment)
python3 "$SESSION_OBSERVABILITY_SKILL_PATH/session_observability.py" phase \
  --run-id 2026-09-08_dpm-autobody-build-out \
  --phase-id phase-0 --phase-name "Pre-flight" --event start --total-phases 10
```

**Read before starting any phase** (all sub-agents should be pointed at these, not asked to
rediscover them):

- `sites/dpm-autobody/CLAUDE.md` — current scaffold state, what's real vs. placeholder
- `output/sessions/2026-08/2026-08-26_dpm-autobody-discovery/positioning.md` — governing design
  principle: project the customer's world, not the shop's; process appears as evidence, art-directed,
  never as the shop's self-image
- `output/sessions/2026-08/2026-08-26_dpm-autobody-discovery/synthesis.md` — the design argument
- The prototype's **client build** (`prototype/client/*.html`), NOT `prototype/src/*.html` or
  `prototype/annotated/*.html` — the client build has the real, public-facing copy with internal
  working notes (`data-note` blocks) already stripped. Reading `src/` risks copying an internal note
  onto the live site.

---

## Phase 1 — Capture prototype reference screenshots

**Goal:** Screenshot every page of the live prototype (`https://dpm-autobody-proto.vercel.app`) at
two viewports, as the ground truth Phase 7's visual fidelity gate compares against. This must run
first — every later phase's verification depends on these existing.
**Model:** haiku — mechanical scripted capture, no design judgment
**Execution:** delegate to 1 haiku sub-agent
**Failure contract:**

- **Fail fast.** Any uncaught exception aborts the phase immediately — do not swallow it, retry blindly, or continue to the next step.
- **Show the evidence.** On failure, print the full traceback AND the offending record (the exact input/row/item being processed when it threw). No bare error messages.
- **No partial passes.** A phase that processed only some of its records has FAILED, not passed. Never report success on partial data — surface the shortfall.
- **Verdict line, always.** End the phase with exactly one line: `PASS — <n>/<total> records, 0 errors` or `FAIL — <n>/<total> records, <e> errors: <first offending record>`. The counts are mandatory, on both PASS and FAIL.
  **Gate contract:**
- **(a) Golden-fixture test:** n/a — this phase _produces_ the fixtures Phase 7 uses; there is nothing to test it against.
- **(b) Invariant on real data:** exactly 12 screenshot files produced (6 pages × 2 viewports), each a non-zero-byte PNG.
- **(c) Rollback:** `rm -rf output/sessions/2026-09/2026-09-08_dpm-autobody-build-out/reference-screenshots/` (no code changes, nothing to revert in git).
- **(d) Hard fail:** any screenshot missing or 0 bytes, OR the live prototype URL returns non-200 for any of the 6 pages.

```
Task: Capture reference screenshots of the live prototype
model: haiku
Prompt: |
  Screenshot all 6 pages of the live static prototype at
  https://dpm-autobody-proto.vercel.app/ — index.html (home), workshop.html, contact.html,
  library.html, volvo-p1800.html, etype-941pvo.html — using headless Playwright.

  A reusable capture tool already exists in this project:
  output/sessions/2026-08/2026-08-26_dpm-autobody-discovery/research/tools/capture-site.mts
  Read its README/header comment first for its usage and the three gotchas it already solved
  (run from monorepo root, import from @playwright/test, .mts not .ts extension). Adapt/reuse it
  rather than writing a new capture script from scratch, unless it genuinely doesn't fit.

  For each of the 6 pages, capture at two viewports: 1440x900 (desktop) and 390x844 (mobile,
  iPhone 12-ish). Save PNGs to
  output/sessions/2026-09/2026-09-08_dpm-autobody-build-out/reference-screenshots/
  named <page>-desktop.png and <page>-mobile.png (e.g. home-desktop.png, home-mobile.png,
  library-mobile.png, volvo-p1800-desktop.png, etc.) — use "home" for index.html's page name.

  Wait for images to load (the prototype's photography is hosted on R2, not embedded) before
  capturing — a screenshot with broken/loading image placeholders is not a valid reference.

  Report exactly 12 files produced with their byte sizes. End with the required verdict line.
```

---

## Phase 2 — `builds` content model

**Goal:** Define the Zod schema for a `builds` MDX collection, sized to hold all 12 restoration
builds from the prototype's library page (not just the 2 with full pages) — per session.md Phase 2's
own architectural decision: "the library page is a generated view over this same collection, never a
separately maintained list." A build with no full page yet still gets an MDX entry with whatever
real fields are known; it just has no body content and its page isn't generated (see Phase 6).
**Model:** sonnet — schema design judgment, following the existing pattern used for
`ServiceFrontmatterSchema`/`LocationFrontmatterSchema` in `@platform/core-components`
**Execution:** delegate to 1 sonnet sub-agent
**Failure contract:**

- **Fail fast.** Any uncaught exception aborts the phase immediately — do not swallow it, retry blindly, or continue to the next step.
- **Show the evidence.** On failure, print the full traceback AND the offending record (the exact input/row/item being processed when it threw). No bare error messages.
- **No partial passes.** A phase that processed only some of its records has FAILED, not passed. Never report success on partial data — surface the shortfall.
- **Verdict line, always.** End the phase with exactly one line: `PASS — <n>/<total> records, 0 errors` or `FAIL — <n>/<total> records, <e> errors: <first offending record>`. The counts are mandatory, on both PASS and FAIL.
  **Gate contract:**
- **(a) Golden-fixture test:** a unit test (vitest, matching the existing `lib/__tests__/*.test.ts`
  pattern in `sites/dpm-autobody`) that validates the schema against the real P1800 Candy and E-Type
  frontmatter this brief will actually write in Phase 3 (not synthetic dummy data) — write the test
  in this phase, populate it with real values once Phase 3 lands, or write Phase 2+3 close enough
  together that the test can use real values from the start.
- **(b) Invariant on real data:** schema parses successfully for a build with only the minimal
  known fields (name, status, meta note — e.g. Jaguar Sea Green, which has almost nothing) AND for
  a build with the full field set (P1800 Candy) — required fields must not force fabrication of
  data that doesn't exist for the sparse builds.
- **(c) Rollback:** `git revert <this phase's commit>`.
- **(d) Hard fail:** schema rejects any of the 12 real builds' known-real field sets, OR any field
  is marked required that isn't actually known for all 12 (this would force Phase 3 to invent data).

```
Task: Define the builds MDX content type schema
model: sonnet
Prompt: |
  Site: sites/dpm-autobody. Read sites/dpm-autobody/CLAUDE.md and lib/content.ts first (the
  generic content loader) and packages/core-components/src/lib/content-schemas.ts (the existing
  ServiceFrontmatterSchema/LocationFrontmatterSchema pattern this should follow structurally,
  even though `builds` is DPM-specific and should live in sites/dpm-autobody/lib/, not in
  core-components — this content type isn't shared across other sites).

  Read output/sessions/2026-09/2026-09-08_dpm-autobody-build-out/session.md's Phase 2 section for
  the field list already decided: car make/model/year, chassis number, owner/commissioner names
  (optional), status (completed | in-progress), hours of labour, scope of work, heroImage, video
  reference (id + type), build type (concours restoration / resto-mod / race car).

  Add one more field this brief needs that session.md doesn't yet specify: a `pageStatus` field
  (`'built' | 'pending'`) — only P1800 Candy and E-Type will have `pageStatus: 'built'` in this
  brief; the other 10 builds get `pageStatus: 'pending'`. This is what Phase 6 uses to decide
  which builds get a generated [slug] route and which don't (matching the prototype's own
  `golink` vs `golink--dead` distinction). Most fields besides name/status/meta-note/pageStatus
  must be OPTIONAL — most of the 12 real builds don't have most fields populated yet (chassis TBD
  for several, hours unknown for several, no owner name for several). Do not make anything
  required that would force Phase 3 to invent a value for a build that doesn't have one.

  Read the actual content of all 12 rows in
  output/sessions/2026-08/2026-08-26_dpm-autobody-discovery/prototype/client/library.html
  before finalizing the schema, so every real field that exists across the 12 builds has
  somewhere to go.

  Create the Zod schema file (site-local, e.g. sites/dpm-autobody/lib/content-schemas.ts or
  wherever fits the existing lib/content.ts wiring pattern — check how getContentItems() is
  parameterized per content type and wire `builds` into it the same way). Write a vitest unit
  test file testing the schema against realistic real field combinations (a full build like P1800
  Candy, a sparse build like Jaguar Sea Green with almost no fields).

  End with the required verdict line.
```

---

## Phase 3 — Populate `builds` MDX content (all 12, real copy only)

**Goal:** Write 12 MDX files under `sites/dpm-autobody/content/builds/`, one per library row,
transcribing the REAL, already-approved copy from the prototype's client build — not paraphrasing,
not inventing, not filling gaps. Only P1800 Candy and E-Type get body content (their full page copy
from `volvo-p1800.html`/`etype-941pvo.html`); the other 10 get frontmatter only.
**Model:** sonnet — careful faithful transcription across 12 files with a structured mapping
**Execution:** delegate to 1 sonnet sub-agent
**Failure contract:**

- **Fail fast.** Any uncaught exception aborts the phase immediately — do not swallow it, retry blindly, or continue to the next step.
- **Show the evidence.** On failure, print the full traceback AND the offending record (the exact input/row/item being processed when it threw). No bare error messages.
- **No partial passes.** A phase that processed only some of its records has FAILED, not passed. Never report success on partial data — surface the shortfall.
- **Verdict line, always.** End the phase with exactly one line: `PASS — <n>/<total> records, 0 errors` or `FAIL — <n>/<total> records, <e> errors: <first offending record>`. The counts are mandatory, on both PASS and FAIL.
  **Gate contract:**
- **(a) Golden-fixture test:** the real fixture IS `prototype/client/library.html` and
  `prototype/client/volvo-p1800.html`/`etype-941pvo.html` — these are already real, approved,
  client-reviewed content, not synthetic. The test (extending Phase 2's schema test) validates all
  12 written MDX files parse against the schema.
- **(b) Invariant on real data:** every fact transcribed (chassis numbers, hours, names, R2 photo
  URLs) matches the source HTML byte-for-byte in meaning — no paraphrasing of facts. The 4 real R2
  photo URLs (P1800 Candy, Bentley, Jaguar, E-Type — see below) must be the exact existing URLs,
  never re-uploaded or renamed.
- **(c) Rollback:** `git revert <this phase's commit>`.
- **(d) Hard fail:** any of the 12 files missing, OR any fabricated fact not traceable to the
  source HTML, OR 0 files written.

```
Task: Populate builds/ MDX content from the approved prototype
model: sonnet
Prompt: |
  Site: sites/dpm-autobody. Content dir: sites/dpm-autobody/content/builds/ (create it).

  Source of truth for ALL 12 rows, verbatim:
  output/sessions/2026-08/2026-08-26_dpm-autobody-discovery/prototype/client/library.html
  This is the CLIENT build — internal working notes (data-note markers, visible in src/ and
  annotated/ but stripped from client/) must NOT appear here. If you need to cross-reference
  src/library.html to understand something, that's fine, but never copy a data-note block's text
  into the live site.

  The 12 rows, in order (chapter "Finished and delivered" then "In the workshop now"):
  1. Volvo P1800 — Candy Red (chassis 26282) — HAS a full page: prototype/client/volvo-p1800.html.
     pageStatus: built. heroImage: the real R2 URL in its library row.
  2. Volvo P1800 — Resto-mod, Candy Red (chassis 23925, owned Tonja, commissioned Ahmet) —
     no photo, no page. pageStatus: pending.
  3. Volvo P1800 — Red — no photo, no page, has a data-note about a video-misattribution bug
     (do NOT act on that bug in this brief — out of scope — but also do not carry the internal
     note's text onto the site). pageStatus: pending.
  4. Volvo P1800 — pair, one client — no photo, no page. pageStatus: pending.
  5. Bentley S3 Continental, 1963 — HAS a real photo (bentley-s3/whole.jpg), NO page (confirmed
     with Ricky: photo-only, no page yet — matches the prototype's own golink--dead treatment).
     pageStatus: pending. heroImage: the real R2 URL.
  6. Jaguar — Aston Martin Sea Green — HAS a real photo (jaguar-sea-green/booth.jpg), NO page
     (same as Bentley — confirmed, photo-only). pageStatus: pending. heroImage: the real R2 URL.
  7. Jaguar E-Type — 941 PVO — HAS a full page: prototype/client/etype-941pvo.html. pageStatus:
     built. heroImage: the real R2 URL in its library row.
  8. Porsche 356 SC — no photo, no page. pageStatus: pending.
  9. Aston Martin DB6 — the pink one — no photo, no page. pageStatus: pending.
  10. Bentley S3, 1964 (in progress) — no photo, no page. pageStatus: pending, status: in-progress.
  11. Volvo, model TBC (in progress) — no photo, no page. pageStatus: pending, status: in-progress.
  12. Volvo P1800 — Pearl White (in progress) — no photo, no page. pageStatus: pending,
      status: in-progress.

  For builds 1 and 7 (pageStatus: built): the MDX body content must be the real body copy from
  their respective full prototype pages (volvo-p1800.html, etype-941pvo.html) — read those files
  in full and port the actual restoration narrative, not just the library-row summary. Convert
  their HTML structure to MDX/markdown sensibly, preserving all real facts (do not compress or
  paraphrase away specific details — hours, chassis, named modifications, the AMOC Sandringham
  testimonial detail on the E-type page, etc).

  For builds 2-6, 8-12: frontmatter only, using exactly the fields present in their library row
  (name, chassis where given, meta line, note text, status). No body content, no invented fields.

  Slugs: kebab-case, avoiding the P1800 collision risk already flagged in BACKLOG.md item 5 —
  e.g. p1800-candy, p1800-candy-restomod, p1800-red, p1800-pair-one-client, bentley-s3-continental,
  jaguar-sea-green, etype-941pvo, porsche-356-sc, aston-martin-db6-pink, bentley-s3-1964,
  volvo-tbc, p1800-pearl-white — adjust as needed but keep them unambiguous and unique.

  Use the schema/field names Phase 2 defined — read that phase's output file before starting.

  End with the required verdict line, reporting all 12 filenames and which 2 have body content.
```

---

## Phase 4 — Header and footer components

**Goal:** Replace `sites/dpm-autobody/components/site-header.tsx` and `site-footer.tsx`'s rendered
output with the prototype's real chrome — near-black masthead, nav (Workshop / Builds / Contact —
already wired in `site.config.ts`), mobile menu, phone/CTA, footer with social links and the real
DPM logo. This gates every page phase below (they all render inside this chrome via `app/layout.tsx`).
**Model:** sonnet — component redesign matching an exact visual reference
**Execution:** delegate to 1 sonnet sub-agent
**Failure contract:**

- **Fail fast.** Any uncaught exception aborts the phase immediately — do not swallow it, retry blindly, or continue to the next step.
- **Show the evidence.** On failure, print the full traceback AND the offending record (the exact input/row/item being processed when it threw). No bare error messages.
- **No partial passes.** A phase that processed only some of its records has FAILED, not passed. Never report success on partial data — surface the shortfall.
- **Verdict line, always.** End the phase with exactly one line: `PASS — <n>/<total> records, 0 errors` or `FAIL — <n>/<total> records, <e> errors: <first offending record>`. The counts are mandatory, on both PASS and FAIL.
  **Gate contract:**
- **(a) Golden-fixture test:** n/a — this is markup/styling, not a parsing/mapping surface. Verified
  visually in Phase 7 instead (that phase's gate covers this one too).
- **(b) Invariant on real data:** n/a — same reason.
- **(c) Rollback:** `git revert <this phase's commit>`.
- **(d) Hard fail:** `pnpm --filter dpm-autobody run type-check` red after this phase, OR the header
  is missing a working mobile menu (check the prototype for its mobile nav pattern and replicate the
  interaction, not just the desktop layout).

```
Task: Port the prototype's real header and footer
model: sonnet
Prompt: |
  Site: sites/dpm-autobody. Files: components/site-header.tsx, components/site-footer.tsx.

  Read the masthead and footer/colophon markup + associated CSS from
  output/sessions/2026-08/2026-08-26_dpm-autobody-discovery/prototype/client/home.html in full —
  it is the canonical reference (~2000 lines, mostly embedded CSS; the masthead/footer sections
  are near-identical across all 6 prototype pages, so home.html is representative). Cross-check
  the mobile nav interaction against workshop.html or contact.html if home.html's isn't clear.

  Colors and fonts should already mostly match — sites/dpm-autobody/theme.config.ts was ported
  from this same prototype's CSS custom properties in an earlier pass. Verify the actual rendered
  values against the prototype rather than assuming theme.config.ts got every mapping right (its
  own comment block flags this as unverified).

  Real logo: sites/dpm-autobody/public/logo.svg already exists (the approved vector artwork).
  Real business facts (phone, email, address, socials) already flow correctly from site.config.ts
  via lib/contact-info.ts — don't hardcode facts that already have a real data source.

  Nav items already correct in site.config.ts (Workshop → /workshop, Builds → /library,
  Contact → /contact) — /workshop and /library don't exist as routes yet (later phases build
  them); the header should still render working nav links to them.

  Match: near-black ground, the masthead's exact layout/spacing/typography treatment (not just
  its colors), the scroll behavior if the prototype's masthead has one (check for sticky/scroll-
  triggered classes), the mobile menu's actual open/close interaction, and the footer's full
  content (address, phone, email, social icons, "Built by" credit line).

  Run `pnpm --filter dpm-autobody run type-check` before finishing. End with the required verdict
  line.
```

---

## Phase 5 — Home, Workshop, Contact pages

**Goal:** Port `home.html`, `workshop.html`, and `contact.html` (client build) into real Next.js
pages. Three independent files, no overlap — run in parallel.
**Model:** sonnet — each is a real design-language port, not mechanical
**Execution:** delegate to 3 sonnet sub-agents in one message
**Failure contract:**

- **Fail fast.** Any uncaught exception aborts the phase immediately — do not swallow it, retry blindly, or continue to the next step.
- **Show the evidence.** On failure, print the full traceback AND the offending record (the exact input/row/item being processed when it threw). No bare error messages.
- **No partial passes.** A phase that processed only some of its records has FAILED, not passed. Never report success on partial data — surface the shortfall.
- **Verdict line, always.** End the phase with exactly one line: `PASS — <n>/<total> records, 0 errors` or `FAIL — <n>/<total> records, <e> errors: <first offending record>`. The counts are mandatory, on both PASS and FAIL.
  **Gate contract:**
- **(a) Golden-fixture test:** n/a — markup/styling port, verified visually in Phase 7.
- **(b) Invariant on real data:** each page renders without runtime error and contains no leftover
  generic base-template copy ("We offer a comprehensive range of professional services...", etc. —
  grep for it if unsure).
- **(c) Rollback:** `git revert <this phase's commit>` (three sub-agents, one combined commit for
  this phase — or revert each if committed separately, orchestrator's call at commit time).
- **(d) Hard fail:** `pnpm --filter dpm-autobody run type-check` red, OR any of the 3 pages still
  shows base-template placeholder copy.

```
Spawn three agents in parallel (single Task-tool message):

Task: Port the prototype homepage
model: sonnet
Prompt: |
  Site: sites/dpm-autobody. Files: app/page.tsx, components/pages/home-page.tsx (currently a
  minimal placeholder — replace its content entirely).

  Read output/sessions/2026-08/2026-08-26_dpm-autobody-discovery/prototype/client/home.html in
  full — real markup, real CSS, real copy. Port it faithfully: hero, any featured-build section
  (if the prototype shows one car as a static hero example, keep it static/hardcoded here too —
  a real rotating-featured-build mechanism is explicitly out of scope for this brief, deferred to
  session.md Phase 4), testimonials if present, proof/credentials section if present.

  If the homepage links to a specific build's full page (e.g. the P1800 Candy example), link it
  to the real /builds/p1800-candy route this brief is also building (Phase 6) rather than to the
  old prototype .html filename.

  Read positioning.md and synthesis.md (paths in this brief's Pre-flight section) for the
  governing design principle before writing anything — this page must read as evidence of the
  customer's world, not the shop's self-image.

  Run `pnpm --filter dpm-autobody run type-check`. End with the required verdict line.

Task: Build the real workshop page
model: sonnet
Prompt: |
  Site: sites/dpm-autobody. New route: app/workshop/page.tsx (doesn't exist yet — create the
  directory and route). Follow the existing pattern in app/contact/page.tsx for how a Server
  Component page with metadata/breadcrumbs/schema is structured in this codebase.

  Read output/sessions/2026-08/2026-08-26_dpm-autobody-discovery/prototype/client/workshop.html
  in full — real markup, real CSS, real copy. Port it faithfully.

  Note: session.md Phase 4 mentions this page should eventually be "hero'd with the new-unit
  film" and get real workshop action photos — that video/photography commission is out of scope
  for this brief (not yet delivered). Build the page as the prototype currently has it (poster/
  static imagery, no video), matching what's actually in workshop.html today.

  Run `pnpm --filter dpm-autobody run type-check`. End with the required verdict line.

Task: Port the real contact page design
model: sonnet
Prompt: |
  Site: sites/dpm-autobody. File: app/contact/page.tsx (exists, currently base-template's
  generic layout with real business facts already wired in but generic visual design — replace
  the visual design, keep the real ContactForm component and real contact-info wiring).

  Read output/sessions/2026-08/2026-08-26_dpm-autobody-discovery/prototype/client/contact.html
  in full for the real visual design (hero, layout, any copy around the form). The prototype's
  own contact form is mocked (onsubmit="return false") — this real site's form
  (@platform/core-components ContactForm) is genuinely wired to app/api/contact/route.ts but
  site.config.ts's features.contactForm is currently false, reflecting that this hasn't been
  confirmed ready to go live yet. Leave that flag as-is — do not flip it in this brief. Match the
  prototype's visual design around the existing functional form component; do not remove the real
  form to replace it with the prototype's mocked one.

  Run `pnpm --filter dpm-autobody run type-check`. End with the required verdict line.
```

---

## Phase 6 — Library route and individual build pages

**Goal:** Build `/library` (generated view over the `builds` collection, ledger design from
`library.html`) and `/builds/[slug]` (individual pages, generated only for `pageStatus: 'built'`
entries — P1800 Candy and E-Type). Different route trees, no file overlap — run in parallel.
Depends on Phase 2 (schema) + Phase 3 (content) + Phase 4 (header/footer) all being done.
**Model:** sonnet
**Execution:** delegate to 2 sonnet sub-agents in one message
**Failure contract:**

- **Fail fast.** Any uncaught exception aborts the phase immediately — do not swallow it, retry blindly, or continue to the next step.
- **Show the evidence.** On failure, print the full traceback AND the offending record (the exact input/row/item being processed when it threw). No bare error messages.
- **No partial passes.** A phase that processed only some of its records has FAILED, not passed. Never report success on partial data — surface the shortfall.
- **Verdict line, always.** End the phase with exactly one line: `PASS — <n>/<total> records, 0 errors` or `FAIL — <n>/<total> records, <e> errors: <first offending record>`. The counts are mandatory, on both PASS and FAIL.
  **Gate contract:**
- **(a) Golden-fixture test:** the real fixture is the 12 MDX files Phase 3 wrote. A test (or the
  route's own `generateStaticParams`) run against them is the check — no synthetic content.
- **(b) Invariant on real data:** `/library` renders all 12 rows in the correct two chapters
  ("Finished and delivered" / "In the workshop now"), exactly 4 with a real thumbnail, exactly 2
  with a live "full record" link (P1800 Candy, E-Type) and the other 10 with the link disabled/
  absent (matching the prototype's `golink` vs `golink--dead`). `generateStaticParams` for
  `/builds/[slug]` produces exactly 2 params.
- **(c) Rollback:** `git revert <this phase's commit>`.
- **(d) Hard fail:** library page shows fewer or more than 4 thumbnails, OR more than 2 live build
  links, OR `/builds/[slug]` generates a route for any `pageStatus: 'pending'` build, OR 0 routes
  generated.

```
Spawn two agents in parallel (single Task-tool message):

Task: Build the /library route
model: sonnet
Prompt: |
  Site: sites/dpm-autobody. New route: app/library/page.tsx.

  Read output/sessions/2026-08/2026-08-26_dpm-autobody-discovery/prototype/client/library.html
  in full for the real ledger design (near-black, numbered rows, two chapters, photo vs
  text-only row treatment — `.ledger__item--photo` vs plain `.ledger__item`).

  Read all 12 MDX files under content/builds/ (Phase 3's output) via the content loader Phase 2
  wired up. Render one ledger row per build, in the same order as the prototype. A row with
  `heroImage` set gets the photo treatment; a row without does not — never render a placeholder
  box for a missing photo (this project's established rule: a missing photo is a text-only row,
  never a grey box). A row with `pageStatus: 'built'` gets a real link to /builds/[slug]; a row
  with `pageStatus: 'pending'` gets no link (or a visually disabled one, matching the prototype's
  `golink--dead` treatment — read how the prototype styles that state).

  Run `pnpm --filter dpm-autobody run type-check`. End with the required verdict line.

Task: Build /builds/[slug] individual pages
model: sonnet
Prompt: |
  Site: sites/dpm-autobody. New route: app/builds/[slug]/page.tsx.

  This uses the "documented car" page template already proven twice in the prototype —
  read output/sessions/2026-08/2026-08-26_dpm-autobody-discovery/prototype/client/volvo-p1800.html
  AND etype-941pvo.html in full. They share a real, consistent page design (spec table, photo
  gallery, narrative sections) — extract that as the template, not two separate one-off layouts.

  `generateStaticParams` must return ONLY the builds with `pageStatus: 'built'` in their MDX
  frontmatter (Phase 3 set this for exactly 2: the P1800 Candy and E-Type entries) — read from
  the same content/builds/ collection Phase 2/3 set up. Do not hardcode the two slugs; derive them
  from the real frontmatter flag, so a future build automatically gets a page once its
  pageStatus flips to 'built' (matching this project's "frontmatter IS the data" rule).

  Render the full body content Phase 3 wrote for these two builds (the real restoration
  narrative), not just the frontmatter fields.

  Run `pnpm --filter dpm-autobody run type-check`. End with the required verdict line.
```

---

## Phase 7 — Visual fidelity verification (hard gate)

**Goal:** Prove the rebuilt pages actually match the approved prototype's design — not just its
colors. This is the gate that the DCS inner-pages failure (see Context) makes non-negotiable.
**Model:** `cs-visual-fidelity-reviewer` (dedicated review agent, its own configured model — not a
generic Task tier)
**Execution:** delegate to up to 6 `cs-visual-fidelity-reviewer` agent invocations in one message
(one per rebuilt page: home, workshop, contact, library, builds/p1800-candy, builds/etype-941pvo)
**Failure contract:**

- **Fail fast.** Any uncaught exception aborts the phase immediately — do not swallow it, retry blindly, or continue to the next step.
- **Show the evidence.** On failure, print the full traceback AND the offending record (the exact input/row/item being processed when it threw). No bare error messages.
- **No partial passes.** A phase that processed only some of its records has FAILED, not passed. Never report success on partial data — surface the shortfall.
- **Verdict line, always.** End the phase with exactly one line: `PASS — <n>/<total> records, 0 errors` or `FAIL — <n>/<total> records, <e> errors: <first offending record>`. The counts are mandatory, on both PASS and FAIL.
  **Gate contract:**
- **(a) Golden-fixture test:** the reference screenshots from Phase 1 (real, from the live
  prototype — not synthetic).
- **(b) Invariant on real data:** each reviewed page's drift report contains zero HIGH-severity
  findings (typography treatment, spacing rhythm, layout structure, motion) — color-only drift or
  content differences explained by this brief's intentional scope (e.g. library showing only 4
  photographed rows) are not failures.
- **(c) Rollback:** n/a for this phase itself (it's read-only review) — a fix sub-agent's commit
  (7b below) is what would be reverted if a fix turns out wrong: `git revert <fix commit>`.
- **(d) Hard fail:** any page with a HIGH-severity drift finding that isn't fixed and re-verified
  before the brief's final commit.

```
Step 7a — capture actual screenshots of the rebuilt site:
  Build and start sites/dpm-autobody locally (pnpm --filter dpm-autobody run build && pnpm
  --filter dpm-autobody run start, or next dev if start has issues — either way it must be a
  real rendered build, not a mock). Using the same capture approach as Phase 1 (same tool, same
  two viewports: 1440x900 and 390x844), screenshot: /, /workshop, /contact, /library,
  /builds/p1800-candy (or whatever slug Phase 3 actually used), /builds/etype-941pvo (same).
  Save to output/sessions/2026-09/2026-09-08_dpm-autobody-build-out/actual-screenshots/ with the
  same naming convention as Phase 1's reference-screenshots/.

Step 7b — spawn cs-visual-fidelity-reviewer agents in parallel (single Agent-tool message),
  one per page pair, each comparing reference-screenshots/<page>-*.png against
  actual-screenshots/<page>-*.png:

Agent: cs-visual-fidelity-reviewer
Task: Compare rebuilt home page against the approved prototype reference
Prompt: |
  Reference (approved, ground truth): output/sessions/2026-09/2026-09-08_dpm-autobody-build-out/reference-screenshots/home-desktop.png
  and home-mobile.png
  Actual (just-built React port): output/sessions/2026-09/2026-09-08_dpm-autobody-build-out/actual-screenshots/home-desktop.png
  and home-mobile.png

  Compare typography treatment, spacing rhythm, layout structure, color, and any visible motion —
  not just "does it use the right colors." Report drift by severity (HIGH/MEDIUM/LOW). A HIGH
  finding is anything that would make this read as a different design system, not the same one
  faithfully ported (this is exactly the failure mode a prior rebuild attempt on this platform
  hit — see project memory feedback_visual_rebuild_needs_visual_reference).

[Repeat the same prompt shape for workshop, contact, library, builds/p1800-candy, builds/etype-941pvo]

Step 7c — if any HIGH-severity findings: spawn 1 sonnet fix sub-agent per affected page (not in
  parallel with anything touching the same file), each given the specific finding and pointed
  back at the same prototype source file used in that page's original build phase. After fixes,
  re-run 7a-7b for the affected pages only. Repeat until zero HIGH findings or it becomes clear a
  finding reflects a deliberate, documented scope decision in this brief (e.g. library showing
  fewer rows with real content) rather than a real miss.

End Phase 7 with the required verdict line once all pages have zero HIGH findings.
```

---

## Phase 8 — Update smoke tests for the new real routes

**Goal:** `e2e/smoke.spec.ts` was trimmed to `/` and `/contact` at scaffold time (see
`sites/dpm-autobody/CLAUDE.md`'s Tests section) because `/workshop` and `/library` didn't exist yet.
They do now — extend it.
**Model:** haiku — mechanical test-file extension following the existing file's exact pattern
**Execution:** delegate to 1 haiku sub-agent
**Failure contract:**

- **Fail fast.** Any uncaught exception aborts the phase immediately — do not swallow it, retry blindly, or continue to the next step.
- **Show the evidence.** On failure, print the full traceback AND the offending record (the exact input/row/item being processed when it threw). No bare error messages.
- **No partial passes.** A phase that processed only some of its records has FAILED, not passed. Never report success on partial data — surface the shortfall.
- **Verdict line, always.** End the phase with exactly one line: `PASS — <n>/<total> records, 0 errors` or `FAIL — <n>/<total> records, <e> errors: <first offending record>`. The counts are mandatory, on both PASS and FAIL.
  **Gate contract:**
- **(a) Golden-fixture test:** n/a — this phase writes the test, doesn't need one of its own.
- **(b) Invariant on real data:** `pnpm --filter dpm-autobody run test:e2e:smoke` passes against
  the actual built site with the new tests included.
- **(c) Rollback:** `git revert <this phase's commit>`.
- **(d) Hard fail:** smoke suite red, OR fewer than 6 route checks present after this phase
  (`/`, `/contact`, `/workshop`, `/library`, and the two real `/builds/[slug]` routes).

```
Task: Extend smoke tests to cover the new real routes
model: haiku
Prompt: |
  File: sites/dpm-autobody/e2e/smoke.spec.ts. Currently tests only "/" and "/contact" (each
  checking HTTP 200 + a visible h1) — read the existing file for the exact pattern, then add the
  same shape of test for: /workshop, /library, and the two real build slugs Phase 3/6 created
  (check content/builds/ for the exact pageStatus:'built' slugs — do not guess them).

  Run `pnpm --filter dpm-autobody run test:e2e:smoke` against the locally running build from
  Phase 7 (or rebuild/restart if needed) to confirm it passes. End with the required verdict line.
```

---

## Phase 9 — Final verification gates

**Goal:** Run every gate this project defines for this site, scoped correctly, before anything is
considered done.
**Model:** n/a
**Execution:** inline (exception) — running the project's own existing verification gates is the
orchestrator's coordination duty per the Delegation Model ("dispatch sub-agents, run verification
gates, make commits"), not implementation work with a design judgment to delegate.
**Failure contract:**

- **Fail fast.** Any uncaught exception aborts the phase immediately — do not swallow it, retry blindly, or continue to the next step.
- **Show the evidence.** On failure, print the full traceback AND the offending record (the exact input/row/item being processed when it threw). No bare error messages.
- **No partial passes.** A phase that processed only some of its records has FAILED, not passed. Never report success on partial data — surface the shortfall.
- **Verdict line, always.** End the phase with exactly one line: `PASS — <n>/<total> records, 0 errors` or `FAIL — <n>/<total> records, <e> errors: <first offending record>`. The counts are mandatory, on both PASS and FAIL.
  **Gate contract:**
- **(a) Golden-fixture test:** n/a — this phase runs existing golden-fixture tests from earlier
  phases as part of the full suite; it introduces none of its own.
- **(b) Invariant on real data:** all of: type-check, build, lint, unit tests (vitest), e2e smoke
  — green.
- **(c) Rollback:** n/a (no changes made in this phase — it's pure verification).
- **(d) Hard fail:** any gate red.

```bash
# Verification gate — STOP if any of these fail
pnpm --filter dpm-autobody run type-check
pnpm --filter dpm-autobody run build
pnpm --filter dpm-autobody run lint
pnpm --filter dpm-autobody run test
pnpm --filter dpm-autobody run test:e2e:smoke
```

---

## Phase 10 — Commit, update session docs

**Goal:** One clean commit for the whole feature (or per-phase commits, orchestrator's call — see
Rules), and update this project's own tracking docs so a future session knows what's real now.
**Model:** sonnet — writing an accurate summary of what changed needs judgment, not just mechanical edits
**Execution:** delegate to 1 sonnet sub-agent
**Failure contract:**

- **Fail fast.** Any uncaught exception aborts the phase immediately — do not swallow it, retry blindly, or continue to the next step.
- **Show the evidence.** On failure, print the full traceback AND the offending record (the exact input/row/item being processed when it threw). No bare error messages.
- **No partial passes.** A phase that processed only some of its records has FAILED, not passed. Never report success on partial data — surface the shortfall.
- **Verdict line, always.** End the phase with exactly one line: `PASS — <n>/<total> records, 0 errors` or `FAIL — <n>/<total> records, <e> errors: <first offending record>`. The counts are mandatory, on both PASS and FAIL.
  **Gate contract:**
- **(a) Golden-fixture test:** n/a — doc updates only.
- **(b) Invariant on real data:** n/a.
- **(c) Rollback:** `git revert <this phase's commit>`.
- **(d) Hard fail:** commit fails, OR the pre-commit hook (prettier/lint-staged) fails and isn't
  resolved.

```
Task: Update session docs to reflect the real pages now built
model: sonnet
Prompt: |
  Update sites/dpm-autobody/CLAUDE.md's "Current state" section — it currently says the pages are
  "still base-template's generic placeholder layouts" — correct that: home/workshop/contact/
  library/the 2 real build pages are now real, ported from the approved prototype, visually
  verified. State clearly which parts are STILL not done: the other 10 builds (photo-only or
  no-content), the homepage rotating-featured-build mechanism, the contact form's real wiring,
  workshop's video hero.

  Update output/sessions/2026-09/2026-09-08_dpm-autobody-build-out/session.md: tick off the now-
  complete parts of Phase 2 (schema exists) and note Phase 3's scope split explicitly (P1800
  Candy + E-Type built; the other 10 builds still need iCloud photo pulls/plate-redaction/David
  confirmations before their pages can exist) — do not mark Phase 3 fully complete, since most of
  its checklist items (the 8 new-content builds from BACKLOG.md item 5) are still genuinely open.

  Commit everything from this brief with a clear message. End with the required verdict line.
```

---

## Parallel execution groups

This section lists work units that can run concurrently. Each group lists items that MUST be launched in a single Task-tool message. Items across groups run sequentially in the order listed. Groups are named `G1`, `G2`, … for reference.

### Intra-phase groups

| Group | Phase   | Items                                                                                     | File overlap             | Model                 | Rationale                                                                                        |
| ----- | ------- | ----------------------------------------------------------------------------------------- | ------------------------ | --------------------- | ------------------------------------------------------------------------------------------------ |
| G1    | Phase 5 | Port home.html → app/page.tsx + home-page.tsx; build workshop route; port contact.html    | none (different files)   | sonnet                | Independent pages, no shared files, all depend only on Phase 4's already-committed header/footer |
| G2    | Phase 6 | Build /library route; build /builds/[slug] route                                          | none (different files)   | sonnet                | Different route trees, both depend only on Phases 2/3/4 already being committed                  |
| G3    | Phase 7 | `cs-visual-fidelity-reviewer` × up to 6 (home, workshop, contact, library, 2 build pages) | none (read-only compare) | n/a (dedicated agent) | Independent per-page comparisons                                                                 |
| G4    | Phase 9 | `type-check`, `lint`, `test` (vitest), `test:e2e:smoke`                                   | none (read-only checks)  | n/a                   | Independent verification commands — `build` runs alone (writes `.next/`)                         |

Every other phase (1, 2, 3, 4, 8, 10) is `1 sub-agent, sequential` — no parallel group.

### Cross-phase groups

| Group  | Phases | Items | Rationale                                                                                                                                                                                          |
| ------ | ------ | ----- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| (none) |        |       | Phase 3 depends on Phase 2's schema; Phases 5/6 depend on Phase 4's committed header/footer and (for Phase 6) Phase 2/3's content; nothing here is independent enough to cross-parallelize safely. |

### Sequential points — MUST NOT parallelise

| Item                                                                              | Reason                                                                     |
| --------------------------------------------------------------------------------- | -------------------------------------------------------------------------- |
| Verification gates between phases (type-check after each phase)                   | Each phase's output gates the next. Gates are the synchronisation barrier. |
| Git commits                                                                       | One commit per phase, in order. Commits are never batched.                 |
| Any file edited by two or more items                                              | Same-file edits must always serialise.                                     |
| Phase 9's `build` command relative to `type-check`/`lint`/`test`/`test:e2e:smoke` | `build` writes `.next/` — run it alone, not inside G4's parallel group.    |

---

## Cost Estimate

| Phase                                | Model        | Est. input tokens | Est. output tokens | Est. cost  |
| ------------------------------------ | ------------ | ----------------- | ------------------ | ---------- |
| Phase 1: Reference screenshots       | haiku        | ~6k               | ~1k                | ~$0.01     |
| Phase 2: Content schema              | sonnet       | ~15k              | ~3k                | ~$0.09     |
| Phase 3: Populate 12 builds' MDX     | sonnet       | ~30k              | ~8k                | ~$0.21     |
| Phase 4: Header/footer               | sonnet       | ~20k              | ~4k                | ~$0.12     |
| Phase 5: Home/workshop/contact (×3)  | sonnet       | ~45k              | ~10k               | ~$0.29     |
| Phase 6: Library + build pages (×2)  | sonnet       | ~30k              | ~7k                | ~$0.20     |
| Phase 7: Visual fidelity review (×6) | (dedicated)  | ~24k              | ~6k                | ~$0.15     |
| Phase 8: Smoke test update           | haiku        | ~5k               | ~1k                | ~$0.01     |
| Phase 9: Final gates                 | n/a (inline) | —                 | —                  | —          |
| Phase 10: Commit + doc updates       | sonnet       | ~10k              | ~2k                | ~$0.06     |
| **Total**                            |              | **~185k**         | **~42k**           | **~$1.14** |

Rates: Opus $15/$75, Sonnet $3/$15, Haiku $0.80/$4 per MTok.
Estimation: ~5 tokens per line of code. Input = files read + brief (~3k) + system prompt (~3k). Output = code written + verification output (~500/gate).

---

## Final Report

After all phases complete, output:

1. Phases completed — list each with commit SHA
2. Build status — confirm `pnpm --filter dpm-autobody run type-check && pnpm --filter dpm-autobody run build && pnpm --filter dpm-autobody run lint && pnpm --filter dpm-autobody run test && pnpm --filter dpm-autobody run test:e2e:smoke` all pass
3. Any exceptions or intentional deviations from the plan (especially: any Phase 7 finding accepted as a documented scope decision rather than fixed)
4. Token usage and cost estimate:

   | Model     | Est. input tokens     | Est. output tokens | Est. cost |
   | --------- | --------------------- | ------------------ | --------- |
   | sonnet    | [total across phases] |                    | $X.XX     |
   | haiku     | [total across phases] |                    | $X.XX     |
   | **Total** |                       |                    | **$X.XX** |

   Compare to the Cost Estimate above. For exact figures: check console.anthropic.com.

---

## Update Session File

After completing all phases, append to `output/sessions/2026-09/2026-09-08_dpm-autobody-build-out/yolo-brief.md`:

```markdown
## Completed

**Date:** [today]
**Status:** All phases executed successfully

[1-paragraph summary: what was implemented, any surprises]

### Commits

[list each commit SHA and message]
```

Confirm this was done in the final report.

---

## Run Wrap-Up

After completing all phases and updating the session file, run:

/wrap-up-session

This writes a wrap-up summary to the session folder. **Do not skip it.**

---

## Rules

- STOP on any failed verification gate — do not continue to next phase
- **Honour every phase's `**Failure contract:**`.** Fail fast on any uncaught exception (never swallow, blind-retry, or press on), print the full traceback and the offending record, and never report a phase as passed on partial data. Each phase MUST end with its one-line PASS/FAIL verdict including counts (`PASS — <n>/<total> records, 0 errors` / `FAIL — <n>/<total> records, <e> errors: <first offending record>`). A FAIL verdict is a failed gate — STOP.
- **Honour every phase's `**Gate contract:**`.** A phase passes only when its golden-fixture test (a) is green against a **real recorded** shape, its real-data invariant (b) holds, and the type-check is clean. A phase whose fixture/invariant did not actually run, or that declares no gate checks at all, has NOT passed — STOP. Have the phase's rollback (c) to hand before you start it.
- Read every file before editing it
- Never push — leave all changes on the `feature/dpm-autobody-real-pages` branch
- **Delegate every phase's implementation to sub-agents by default.** The orchestrator coordinates, gates, and commits — it does NOT write phase code inline. Each phase's `**Execution:**` line says how. Only Phase 9 is inline, and it declares the exception with its rationale.
- **The `**Model:**` tier names the sub-agent's model, not the orchestrator's.** The orchestrator's own model is set by the launch command.
- **Consult the `## Parallel execution groups` section before launching any work.** Every item listed in a group MUST be launched in a single Task-tool message.
- **Items NOT listed in any group run sequentially — but still as delegated sub-agents.**
- **Never parallelise across phase boundaries** — the Cross-phase groups table is empty for this brief; every phase gates the next.
- **If the groups table and the phase prose disagree, the groups table wins.**
- Minimal changes only — implement what this brief says, nothing more. Do NOT build the other 10 builds' individual pages, the homepage rotation mechanism, the real contact form wiring, or the workshop video hero — all explicitly out of scope, per the Context section's scope correction.
- Use `model: haiku` for Task agents doing mechanical work; `model: sonnet` for standard edits.
- The Co-Authored-By line in commits must reflect the orchestrator model (the committer).
- Every phase that touches `sites/dpm-autobody` files must run `pnpm --filter dpm-autobody run type-check` before that phase's commit — don't wait until Phase 9 to discover a break several phases back.
- **Never fabricate facts, figures, or photography.** Every real fact in this brief's phases traces back to the prototype's client build or BACKLOG.md item 5. If a sub-agent finds it needs a fact that isn't in either source, it must leave that field absent/TBC and flag it in its report — not invent a plausible-sounding value. This platform's whole DPM history has operated on this rule; breaking it here would undo work spanning multiple sessions.

## Completed

**Date:** 2026-09-11
**Status:** All phases executed successfully

Phases 1-6 ported the approved DPM Autobody static prototype into real Next.js/MDX pages: the
builds content schema, MDX content for 12 builds, the real header/footer, home/workshop/contact
pages, the `/library` ledger, and two individual `/builds/[slug]` pages (P1800 Candy resto-mod and
E-type 941 PVO) — all landed roughly as planned. The real surprise was Phase 7, the visual fidelity
gate: it was scoped as a single fix cycle but the first verification pass found extensive
HIGH-severity drift across every page, forcing three further rounds of fixes and re-verification
before the site was fit to ship. The three main root causes were (1) missing webfonts — every page
silently fell back to Georgia because the fonts weren't wired up via `next/font`; (2) a Tailwind
arbitrary-breakpoint bug where `min-[56rem]:`/`min-[60rem]:` variants emitted zero CSS because the
`screens` config mixed px and rem units, making the primary nav invisible site-wide; and (3) a
genuinely missing structural section — both build-detail pages were missing an "Enquiries" CTA
section entirely, which is a real content gap rather than a styling regression. Along the way the
screenshot-capture tooling itself produced two false-positive findings (no scroll-through pass
before capture, missing lazy-loaded/scroll-reveal content; and `deviceScaleFactor: 2` on a
`fullPage: true` capture of a very tall page causing Chromium tile-raster corruption that looked
like missing content) — both were root-caused and fixed rather than chased as site bugs. All final
gates are green: type-check, build, lint, vitest (84/84), and e2e smoke (6/6, now covering
`/workshop`, `/library`, and both build pages). Known MEDIUM/LOW visual-fidelity gaps were
deliberately left open to avoid iterating past diminishing returns: P1800 headline line-breaks
don't exactly match the prototype; the P1800 plaque photo and one E-type pairing figure aren't
full-bleed like the prototype; hero image crop/zoom differs slightly on a few panels; a portrait
"trophy" photo on the E-type page is center-cropped in a 3:2 box rather than its natural aspect
ratio (needs a content-schema change to carry real per-image intrinsic dimensions — out of scope
here); a minor social-icon glyph style (outline vs. filled) mismatch; and a scroll-progress rail
plus film-grain overlay from the prototype were deliberately never ported (documented scope
decisions, not defects). One tooling limitation also remains unsolved: Chromium's screenshot
capture hits a hard 16,384px height cap, so the reference capture for the two tallest pages (home,
P1800) still truncates the last ~4% of the page (just the footer) — worth a proper
segment-and-stitch fix in a future session if this capture tooling gets reused. Out of scope for
this brief and not touched: the other 10 builds' individual pages (frontmatter only, pending
photo pulls and David's confirmations), the homepage rotating-featured-build mechanism, the real
contact form wiring, and the workshop's video hero.

### Commits

- `b4c15184` feat(dpm-autobody): add builds content schema
- `df8bd433` feat(dpm-autobody): populate builds MDX content from approved prototype
- `dcdc1daf` feat(dpm-autobody): port real header and footer from approved prototype
- `a47bd943` feat(dpm-autobody): port real home, workshop, and contact pages
- `1076dbe6` feat(dpm-autobody): add /library ledger and /builds/[slug] pages
- `fb56e211` fix(dpm-autobody): visual fidelity remediation round 1 — fonts, nav, tokens, build structure
- `1bdb0a0d` fix(dpm-autobody): visual fidelity remediation round 2 — footer, fonts, content accuracy
- `ee3bb5b0` fix(dpm-autobody): visual fidelity remediation round 3 — enquiries section, form fonts, contrast
- `d25df472` test(dpm-autobody): extend smoke tests to cover workshop, library, and build pages
