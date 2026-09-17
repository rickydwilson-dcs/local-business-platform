# YOLO Implementation Brief: DPM Autobody — 2026-09-16 build-out (photos + 6 builds + Volvo 262C + workshop)

**Branch:** `develop` (no feature branch — see "Deviation from default branch model" below)
**Session spec:** output/sessions/2026-09/2026-09-08_dpm-autobody-build-out/yolo-brief.md
**Mode:** Autonomous execution — coordinate all phases, delegate implementation to sub-agents, verify after each, STOP on error
**Orchestrator model:** sonnet — coordinator only; per-phase `**Model:**` tiers attach to delegated sub-agents and are independent of this

---

## Context

**Plan source:** Claude independent plan (no Codex review) — generated directly from
`output/sessions/2026-09/2026-09-08_dpm-autobody-build-out/HANDOFF.md`'s own "Next step" list, at
the user's explicit instruction to skip `/plan.with.codex` synthesis for this pass (matches the
established project convention recorded in memory `feedback_plan_to_yolo_without_codex.md`).

David Pearce-Martin (DPM Autobody) replied 2026-09-15 with per-build content for 6 existing builds
plus one brand-new build (Volvo 262C), and sent 11 iCloud photo albums. The prior session already:
applied David's pure-text corrections, ran the full photo pipeline (download → HEIC→JPEG → plate
detect → full manual review → redact → strip metadata) for all 11 albums into
`inbox/<album>/redacted/`, and confirmed via photo evidence that "Porsche SC" is the **same car**
as the already-live `porsche-356-sc.mdx` (the user re-confirmed this explicitly this turn — it is
not a new build). Nothing has been uploaded to R2 and no MDX/page changes exist yet for any of
this content. This brief implements everything from "Next step" items 2–8 of the HANDOFF: R2
upload, the 6 build-content updates, the new Volvo 262C page, the workshop page photo section, and
the final gates/commits/BACKLOG update. It does **not** push or promote to staging/main — see
"Deviation from default promotion model" below.

Implement the plan exactly as specified below. This had no second-model review, so hold to the
gate contracts all the more — especially the photo-verification steps, which exist because this
exact project has twice already caught real mismatches (a folder-token transposition, an
undersized redaction box) by looking at actual pixels instead of trusting filenames or prior notes.

### Deviation from default branch model

The generic brief template defaults to a new `feature/<slug>` branch off the base branch. This
project's root `CLAUDE.md` states a **non-negotiable** `develop → staging → main` workflow with no
feature-branch step — every prior DPM Autobody commit in `git log` was made directly to `develop`.
The working tree on `develop` right now also already contains this session's precious uncommitted
work (text corrections + the 1.1GB `inbox/` photo pipeline output, both described in HANDOFF.md).
**Do not create a feature branch, do not run `git checkout -b`, do not run `git pull`** (local
`develop` is already ahead of `origin/develop`, not behind, so a pull is a no-op at best and a risk
at worst if that ever changes). Work directly on `develop`.

### Deviation from default promotion model

Per the user's global scope-discipline rule ("commit ≠ push, deploy, or promote"), this brief
**commits locally to `develop` and stops there.** It does not push, does not merge to `staging`,
and does not open any PR to `main`. Pushing and promotion are a separate, explicit, user-approved
step after this brief's work is reviewed — do not do it as part of this run, even though HANDOFF's
own "Next step" item 7 describes the full staircase; that item is deliberately truncated here to
"commit only."

---

## Model Tiers

| Tier   | Alias    | Cost (in/out per MTok) | Use for                                                                                             |
| ------ | -------- | ---------------------- | --------------------------------------------------------------------------------------------------- |
| Opus   | `opus`   | highest                | Phases with >5 interdependent files, architectural rewrites, judgment calls not covered by the spec |
| Sonnet | `sonnet` | mid                    | Standard implementation — file edits, feature wiring, most phases                                   |
| Haiku  | `haiku`  | lowest                 | Mechanical tasks: find-replace, import additions, grep checks, content validation                   |

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
# On develop already — do NOT create a feature branch, do NOT git pull (see Deviation note above)
git status --short   # confirm the working tree still matches HANDOFF.md's description; STOP if it doesn't
pnpm --filter dpm-autobody run type-check   # sanity gate — must be clean before starting

# Session observability run-init (skill available via $SESSION_OBSERVABILITY_SKILL_PATH)
python3 "$SESSION_OBSERVABILITY_SKILL_PATH/session_observability.py" phase \
  --run-id 2026-09-08_dpm-autobody-build-out --phase-id phase-0 --phase-name "Pre-flight" \
  --event start --total-phases 7 || true

# Confirm R2 credentials are present (the upload phase will fail loudly otherwise)
node -e "for (const k of ['R2_ACCOUNT_ID','R2_ACCESS_KEY_ID','R2_SECRET_ACCESS_KEY']) if (!process.env[k]) { console.error('Missing ' + k); process.exit(1) }; console.log('R2 credentials present')"
```

If any of these fail, STOP and report — do not guess around a missing credential or an
unexpectedly dirty tree.

---

## Phase 1 — Upload the 11 new photo albums to R2

**Goal:** Extend `tools/upload-dpm-autobody-photos-to-r2.ts`'s `ALBUM_TO_R2_PATH` map with the 11
new albums from `inbox/` and run a real (non-dry-run) upload, producing the manifest that every
later phase will read for exact URLs.
**Model:** sonnet — extending a typed map and a small script change (per-album prefix override), not purely mechanical
**Execution:** delegate to 1 sonnet sub-agent
**Failure contract:**

- **Fail fast.** Any uncaught exception aborts the phase immediately — do not swallow it, retry blindly, or continue to the next step.
- **Show the evidence.** On failure, print the full traceback AND the offending record (the exact input/row/item being processed when it threw). No bare error messages.
- **No partial passes.** A phase that processed only some of its records has FAILED, not passed. Never report success on partial data — surface the shortfall.
- **Verdict line, always.** End the phase with exactly one line: `PASS — <n>/<total> records, 0 errors` or `FAIL — <n>/<total> records, <e> errors: <first offending record>`. The counts are mandatory, on both PASS and FAIL.
  **Gate contract:** (all four required — see templates/gated-phase-brief-template.md)
- **(a) Golden-fixture test:** n/a — no test suite for this upload script; the gate is the script's own `--dry-run` output (a real recorded listing of the actual `inbox/` files on disk), inspected before the real run.
- **(b) Invariant on real data:** every album folder listed in the table below has a matching manifest entry with `status: "uploaded"` (or `"skipped-exists"` on a safe re-run), and the manifest's photo count per album matches the table below exactly.
- **(c) Rollback:** `git revert <this phase's commit>` undoes the script change; the R2 objects themselves are additive (new keys only, nothing overwritten) and don't need reverting.
- **(d) Hard fail:** any album's uploaded-or-skipped count is 0, or the manifest is missing an album that's in the table below.

Task: Extend and run the DPM Autobody R2 photo upload
model: sonnet
Prompt:

```
Read tools/upload-dpm-autobody-photos-to-r2.ts in full first.

Extend its `ALBUM_TO_R2_PATH` map (currently a `Record<string, string>`) to also support a
per-entry prefix override, because one album (`workshop-action`) needs a different R2 prefix
(`dpm-autobody/workshop` instead of the current hardcoded `dpm-autobody/builds`). Change the map's
value type to `string | { path: string; prefix?: string }`, and in `planUploads()`, resolve
`const prefix = typeof entry === 'string' ? R2_PREFIX : (entry.prefix ?? R2_PREFIX)` and
`const subpath = typeof entry === 'string' ? entry : entry.path` before building `key`. Keep every
existing map entry unchanged (string form still works — do not rewrite the 8 existing entries into
object form).

Add these 11 new entries (source album folder -> R2 destination) — all under
`output/sessions/2026-09/2026-09-08_dpm-autobody-build-out/inbox/<album>/redacted/`:

| Album folder                    | New map entry                                                          | Photos (verify this count) |
|----------------------------------|-------------------------------------------------------------------------|-----------------------------|
| bentley-s3-1964-current          | "bentley-s3-1964/current-restoration-2026-09"                          | 11 |
| bentley-s3-1964-chassis-rebuild  | "bentley-s3-1964/chassis-rebuild-2026-09"                              | 7  |
| bentley-s3-continental-finished  | "bentley-s3-continental/2026-09"                                        | 16 |
| p1800-pearl-white-current        | "p1800-pearl-white/current-restoration-2026-09"                        | 18 |
| p1800-red-2026-09                | "p1800-red/2026-09"                                                     | 24 |
| db6-pink-2026-09                 | "aston-martin-db6-pink/2026-09"                                         | 15 |
| p1800-candy-restomod-2026-09     | "p1800-candy-restomod/2026-09"                                          | 24 |
| porsche-sc                       | "porsche-356-sc/2026-09"                                                | 12 |
| volvo-262c                       | "volvo-262c"                                                            | 17 |
| nec-exhibition                   | "nec-exhibition"                                                        | 7  |
| workshop-action                  | `{ path: "action", prefix: "dpm-autobody/workshop" }`                  | 19 |

(These counts come from the prior session's photo-pipeline table in
`output/sessions/2026-08/2026-08-26_dpm-autobody-discovery/BACKLOG.md`'s "Photo pipeline" section
— re-verify each against the actual file count in that album's `redacted/` folder, excluding any
`contact-sheet*` file, which the script's existing filter already excludes. If any count doesn't
match, STOP and report the discrepancy rather than silently uploading whatever is there — do not
assume the table or the folder is right.)

Then:
1. Run `npx tsx tools/upload-dpm-autobody-photos-to-r2.ts --dry-run` from the repo root. Confirm
   the printed per-album counts match the table above for all 11 new albums (and the 8 existing
   ones are unaffected). If anything looks wrong, stop and report — do not proceed to a real
   upload on a plan you're not confident in.
2. Run `npx tsx tools/upload-dpm-autobody-photos-to-r2.ts` for real (no `--dry-run`).
3. Confirm the manifest was written to `output/sessions/2026-09/photos-manifest.json` and contains
   one entry per uploaded photo with a real `url`. This manifest is the single source of truth for
   every URL later phases will use — do not let any later phase hand-construct a URL instead of
   reading it from here.

As you work through the upload (~170 photos across 11 new albums), report progress periodically:
every ~20-50 items completed, or roughly every 30 seconds, whichever comes first. Run:

    python3 "$SESSION_OBSERVABILITY_SKILL_PATH/session_observability.py" progress \
      --run-id 2026-09-08_dpm-autobody-build-out --work-id r2-photo-upload --shard-id shard-01 \
      --completed <N> --shard-total 170 || true

wrapped so a failed report never blocks the real upload. Report immediately (outside the normal
cadence) if the upload goes blocked/failed, or on final completion (`--status complete`).

Return: the final manifest path, total uploaded/skipped/failed counts, and confirmation that all
11 new albums are represented.
```

**Commit after this phase:**

```bash
git add tools/upload-dpm-autobody-photos-to-r2.ts
git commit -m "feat(dpm-autobody): extend R2 photo upload for David's 2026-09-15 batch (11 albums)

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_01JfHobWPgzzVWigAY9SAn55"
```

(The uploaded photos themselves live in R2, not git — nothing else to add here. `photos-manifest.json`
lives under `output/sessions/2026-09/`, which is tracked; add and commit it too if it changed.)

---

## Phase 2 — Author the 7 existing-build content updates (parallel)

Each item below is a **separate MDX file** with **no overlap** — safe to run as one parallel
group. Every sub-agent must:

- Read `output/sessions/2026-08/2026-08-26_dpm-autobody-discovery/BACKLOG.md` §5a in full for the
  complete transcription of David's email (the summary in each prompt below is a compressed
  pointer, not a substitute for the source text).
- Read `output/sessions/2026-09/photos-manifest.json` (written by Phase 1) to get every real R2
  URL for that build's album(s) — never hand-construct a URL.
- Read the build's existing MDX file in full before editing it.
- **Look at actual photos**, not just filenames, before choosing which go into `galleryImages`
  (or a new `photoSections` group) and before writing any caption. Open the album's contact sheet
  (`inbox/<album>/redacted/contact-sheet*.jpg`) and any individual photo needed to confirm what it
  shows. This project has twice already caught a real mismatch (a transposed folder, an undersized
  redaction box) by checking pixels instead of trusting labels — do the same here.
- **Do not overwrite `heroImage`** on any of these 7 builds. Every one already has an approved hero
  photo; add the new photos to `galleryImages` (flat URL list is fine, matching the existing style
  in each file) or, only if genuinely better structured that way, a new `photoSections` entry.
- **Expand wording, never invent facts.** David's own line ("feel free to expand or change some
  wording where you see fit") licenses tightening prose for the site's voice, not adding claims he
  didn't make.
- Update or remove `sourcingGaps` entries that this new information resolves (e.g. the two now-known
  chassis numbers).
- Validate frontmatter: `cd sites/dpm-autobody && npx tsx scripts/validate-content.ts` must report
  this file (and all others) valid before the phase is done.

**Model:** sonnet — real narrative authorship from source material + photo verification, not mechanical
**Execution:** delegate to 7 sonnet sub-agents in one message
**Failure contract:**

- **Fail fast.** Any uncaught exception aborts the phase immediately — do not swallow it, retry blindly, or continue to the next step.
- **Show the evidence.** On failure, print the full traceback AND the offending record (the exact input/row/item being processed when it threw). No bare error messages.
- **No partial passes.** A phase that processed only some of its records has FAILED, not passed. Never report success on partial data — surface the shortfall.
- **Verdict line, always.** End the phase with exactly one line: `PASS — <n>/<total> records, 0 errors` or `FAIL — <n>/<total> records, <e> errors: <first offending record>`. The counts are mandatory, on both PASS and FAIL.
  **Gate contract:** (all four required — see templates/gated-phase-brief-template.md)
- **(a) Golden-fixture test:** n/a — content authorship, not a parser; the closest equivalent is Zod validation against the real schema (`scripts/validate-content.ts`), which each sub-agent must run and pass.
- **(b) Invariant on real data:** every photo URL written into frontmatter must appear in `photos-manifest.json` with `status` of `uploaded` or `skipped-exists` — never a hand-typed or guessed URL.
- **(c) Rollback:** `git revert <that build's commit>` (each build is committed separately — see below).
- **(d) Hard fail:** `validate-content.ts` reports this file invalid, OR the sub-agent added 0 photos/no content change despite new source material existing for it.

Spawn 7 agents in parallel (single Task-tool message):

```
Task: Update bentley-s3-1964.mdx with David's 2026-09-15 content
model: sonnet
Prompt: |
  Update sites/dpm-autobody/content/builds/bentley-s3-1964.mdx.

  New facts from David (BACKLOG.md §5a — read the full paragraph there): chassis number is now
  known as **BC60 XC**. Full description of this "current restoration": arrival condition,
  wheel-tub/quarter-panel/valance fabrication, soda blasting, epoxy primer, body levelling,
  underside/cockpit paint — the car "now awaits reuniting with the freshly restored chassis before
  final prep for paint."

  Photos: two albums feed this one build —
  - bentley-s3-1964-current (R2 subpath bentley-s3-1964/current-restoration-2026-09, 11 photos):
    the car itself, matching the description above.
  - bentley-s3-1964-chassis-rebuild (R2 subpath bentley-s3-1964/chassis-rebuild-2026-09, 7 photos):
    the chassis rebuild specifically — a companion set, no separate description from David.

  Set chassisNumber: "BC60 XC". Remove any sourcingGaps entry for the chassis number (keep any
  other still-open gap). Rewrite/expand scopeOfWork and the body prose using the new description.
  Add the new photos to galleryImages (read exact URLs from photos-manifest.json for both albums).
  Run `cd sites/dpm-autobody && npx tsx scripts/validate-content.ts` and confirm this file passes.

Task: Update bentley-s3-continental.mdx with David's 2026-09-15 content
model: sonnet
Prompt: |
  Update sites/dpm-autobody/content/builds/bentley-s3-continental.mdx.

  New facts from David (BACKLOG.md §5a): chassis number is now known as **BC66 XA**. Restored
  2021. Full description: bare-metal repaint, hand-crafted lower-body panels (coachbuilt — no
  replacement panels exist for this model), 4mm panel gaps, 5 coats of lacquer, 6-grade block sand,
  chrome re-done, interior recolonised, hood by SM Trimming. New fact: showcased at the NEC in
  2023 (this build already has a confirmed `video` field — do not touch that).

  Photos: bentley-s3-continental-finished (R2 subpath bentley-s3-continental/2026-09, 16 photos).
  Also check output/sessions/2026-09/2026-09-08_dpm-autobody-build-out/inbox/nec-exhibition/redacted/
  (R2 subpath nec-exhibition, 7 photos) — if any clearly show this Bentley at the NEC, add those
  too (this album is shared across builds; the resto-mod's sub-agent is independently checking the
  same folder for its own car — that's fine, the same photo can be referenced by URL from both
  builds if it genuinely shows both, though for a single-car show shot it will usually belong to
  just one).

  Set chassisNumber: "BC66 XA". Remove the corresponding sourcingGaps entry. Expand scopeOfWork and
  body prose with the new detail, including the NEC 2023 showcase fact. Add new photos to
  galleryImages (URLs from photos-manifest.json). Run
  `cd sites/dpm-autobody && npx tsx scripts/validate-content.ts` and confirm this file passes.

Task: Rewrite p1800-pearl-white.mdx with David's 2026-09-15 content
model: sonnet
Prompt: |
  Rewrite (not just patch) sites/dpm-autobody/content/builds/p1800-pearl-white.mdx's body and
  scopeOfWork. BACKLOG.md §5a explicitly calls for a rewrite here since the new description is much
  richer than the current thin copy, "rather than patching piecemeal."

  New facts from David: a "drive in drive out" package; a pre-purchase compression check found low
  compression, requiring an engine rebuild; new wheel tubs, inner wings, floor pans, chassis rails,
  jacking points, bulkhead; soda blasting; 4mm panel gaps; a custom pearl-effect colour; poly bush
  + new bearings; a power-steering conversion. Note: the earlier "well-known singer" previous-owner
  claim was already removed in the prior session's pass (2026-09-15) — do not reintroduce it or
  anything like it.

  Photos: p1800-pearl-white-current (R2 subpath p1800-pearl-white/current-restoration-2026-09, 18
  photos, URLs from photos-manifest.json).

  Run `cd sites/dpm-autobody && npx tsx scripts/validate-content.ts` and confirm this file passes.

Task: Update p1800-red.mdx with David's 2026-09-15 content
model: sonnet
Prompt: |
  Update sites/dpm-autobody/content/builds/p1800-red.mdx.

  New facts from David: chassis is still TBC (left blank again — do not invent one; keep/add a
  sourcingGaps entry for "Chassis number" if not already present). Full description: sent to DPM
  as a stripped shell, "one of the worst DPM has seen"; full inner-panel fabrication (floors,
  chassis rails, inner wings, scuttle, boot floor); body sent for blasting with exterior panels
  off; factory black stone-chip underside paint; engine/interior refit was done by another shop
  after DPM's own work. Confirms the whole restoration was documented by **JPM Productions** (a
  film production company — name not previously confirmed; worth keeping as an attribution detail
  if there's a natural place for it, matching how other builds credit named parties).

  Photos: p1800-red-2026-09 (R2 subpath p1800-red/2026-09, 24 photos, URLs from
  photos-manifest.json).

  Run `cd sites/dpm-autobody && npx tsx scripts/validate-content.ts` and confirm this file passes.

Task: Expand p1800-candy-restomod.mdx with David's 2026-09-15 content
model: sonnet
Prompt: |
  Expand sites/dpm-autobody/content/builds/p1800-candy-restomod.mdx (the earlier corrections from
  this session already removed the wrong "one of two P1800s, one client" pairing claim — leave
  that fix alone, add to it).

  New facts from David: panel-seam and side-trim removal for a smooth body; bumpers modified and
  shortened, converted to a single piece from the factory's original 3-piece setup; window-scraper
  trim fitment matched to the door-handle trim gap; a custom 3-stage Candy Red paint mix.
  Mechanical rebuild by **Wilde Classics** (name now confirmed); custom interior by another,
  unnamed firm. Showcased at the NEC in **both 2023 and 2024** (previously only 2023 was noted).

  Photos — IMPORTANT, verify before trusting the text: BACKLOG.md §5a's prose says "No new photos
  given for this one — reuse existing," but a photo-pipeline table in the same document (and this
  brief's Phase 1) lists an actual album `p1800-candy-restomod-2026-09` with 24 photos, R2 subpath
  p1800-candy-restomod/2026-09. Open that album's contact sheet and compare it against this
  build's current galleryImages. Two possible outcomes:
  (a) the 24 photos are genuinely new (not already used elsewhere on this build) — in which case
      add a sensible selection to galleryImages, same as every other build in this phase; or
  (b) they turn out to be a duplicate/near-duplicate of an existing set, or actually belong to a
      different build (this project has hit exactly this kind of folder mix-up before) — in which
      case do NOT add them, and instead write one sentence into your final report flagging what you
      found, so the orchestrator can note it for the user.
  Do not guess; decide from what the photos actually show.

  Also check output/sessions/2026-09/2026-09-08_dpm-autobody-build-out/inbox/nec-exhibition/redacted/
  (R2 subpath nec-exhibition, 7 photos) for any that clearly show this resto-mod at either NEC show
  and add those if found.

  Expand scopeOfWork and body prose with the new detail (trim/panel work, the paint mix, the two
  confirmed names, both NEC years). Run
  `cd sites/dpm-autobody && npx tsx scripts/validate-content.ts` and confirm this file passes.

Task: Fold the "Porsche SC" white-shell photos into porsche-356-sc.mdx
model: sonnet
Prompt: |
  Update sites/dpm-autobody/content/builds/porsche-356-sc.mdx. The user has confirmed directly
  (2026-09-16, this session) that "Porsche SC" is the **same car** as this already-live build —
  this is settled, do not re-litigate it. The album also contains a second, distinct white
  bare-shell 356 not previously documented anywhere on the site; per the user's decision, treat
  these as more photos of the same in-progress restoration story, not a separate build.

  Photos: porsche-sc (R2 subpath porsche-356-sc/2026-09, 12 photos, URLs from
  photos-manifest.json). Note: this album contains IMG_0304.jpg, the exact file already used as
  this build's existing `heroImage` — do not add a duplicate entry for that same photo to
  galleryImages. Add the rest (including the white-shell photos) to galleryImages. If the
  white-shell photos read as visually distinct enough from the rest of the gallery that a reader
  might be confused about whether it's the same car, add a short clause to the body prose or a
  caption clarifying it's the same restoration at an earlier/different stage — do not leave it
  ambiguous, but do not invent a story about *why* the shell looks different beyond what's visually
  obvious (e.g. "before" vs. "after" paint, if that's what the photos show).

  Run `cd sites/dpm-autobody && npx tsx scripts/validate-content.ts` and confirm this file passes.

Task: Reconcile aston-martin-db6-pink.mdx's unexpected new-photo album
model: sonnet
Prompt: |
  sites/dpm-autobody/content/builds/aston-martin-db6-pink.mdx already received its text
  corrections in the prior session's pass (crash/livery/race-status facts — already correct, leave
  that prose alone). BACKLOG.md §5a's prose for this build says "correction only, no new photos" —
  but Phase 1 of this brief uploaded an album `db6-pink-2026-09` with 15 photos (R2 subpath
  aston-martin-db6-pink/2026-09, one plate redacted) that was part of the same 2026-09-15 batch.
  This is a genuine discrepancy between what David's email text said and what the photo pipeline
  actually received — investigate before acting.

  Open the album's contact sheet and compare it against this build's existing galleryImages (17
  photos already live, all showing the pink DB6 at various stages — crash, bare metal, masking,
  finished pink). If the 15 new photos clearly show the same car at the same or new stages (not a
  duplicate of the existing 17), add the genuinely new ones to galleryImages using URLs from
  photos-manifest.json. If instead they look like duplicates of what's already live, or don't
  clearly match this car, do not guess — add none, and write one sentence in your final report
  flagging the discrepancy for the orchestrator to note.

  Also check output/sessions/2026-09/2026-09-08_dpm-autobody-build-out/inbox/nec-exhibition/redacted/
  (7 photos) — the NEC album's plate-redaction notes mention the DB6's own plate ("OH OH 7")
  appearing there, meaning this car was very likely exhibited at the NEC. If so and there's no NEC
  mention in this build's prose yet, add one short sentence noting it, and add any clearly-matching
  NEC photos to the gallery.

  Run `cd sites/dpm-autobody && npx tsx scripts/validate-content.ts` and confirm this file passes.
```

**Commit after each build in this phase** (7 separate commits, matching this project's established
one-commit-per-build convention — see `git log` for `bentley-s3-1964`-style prior commits):

```bash
git add sites/dpm-autobody/content/builds/bentley-s3-1964.mdx
git commit -m "feat(dpm-autobody): add Bentley S3 1964 chassis number and David's 2026-09-15 content

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_01JfHobWPgzzVWigAY9SAn55"
# ...repeat for bentley-s3-continental.mdx, p1800-pearl-white.mdx, p1800-red.mdx,
# p1800-candy-restomod.mdx, porsche-356-sc.mdx, aston-martin-db6-pink.mdx — one commit each,
# with a message describing that specific build's actual change.
```

---

## Phase 3 — Create the new Volvo 262C build page

**Goal:** New build, not previously in the library — needs a new MDX file + slug + library entry.
**Model:** sonnet — new content type instance, schema-conformant, plus a library-order edit
**Execution:** delegate to 1 sonnet sub-agent
**Failure contract:**

- **Fail fast.** Any uncaught exception aborts the phase immediately — do not swallow it, retry blindly, or continue to the next step.
- **Show the evidence.** On failure, print the full traceback AND the offending record (the exact input/row/item being processed when it threw). No bare error messages.
- **No partial passes.** A phase that processed only some of its records has FAILED, not passed. Never report success on partial data — surface the shortfall.
- **Verdict line, always.** End the phase with exactly one line: `PASS — <n>/<total> records, 0 errors` or `FAIL — <n>/<total> records, <e> errors: <first offending record>`. The counts are mandatory, on both PASS and FAIL.
  **Gate contract:** (all four required — see templates/gated-phase-brief-template.md)
- **(a) Golden-fixture test:** n/a — new content authorship; gate is Zod validation against the real schema.
- **(b) Invariant on real data:** the new build appears in `LIBRARY_ORDER` in `app/library/page.tsx`, `validate-content.ts` reports it valid, and every photo URL exists in `photos-manifest.json`.
- **(c) Rollback:** `git revert <this phase's commit>`.
- **(d) Hard fail:** `validate-content.ts` fails, OR the build is missing from `LIBRARY_ORDER`, OR it has zero photos despite 17 being available.

Task: Create sites/dpm-autobody/content/builds/volvo-262c.mdx
model: sonnet
Prompt:

```
Read sites/dpm-autobody/lib/content-schemas.ts's BuildFrontmatterSchema in full, and read one
existing "thin" build (e.g. p1800-red.mdx or bentley-s3-1964.mdx) as a structural reference — this
new build should follow the same thin-content pattern (frontmatter + 1-2 paragraphs of prose, no
`##`-structured chapters), matching this site's established convention documented in
sites/dpm-autobody/CLAUDE.md ("do not invent narrative for a thin build").

New build, from David's 2026-09-15 email (full text in
output/sessions/2026-08/2026-08-26_dpm-autobody-discovery/BACKLOG.md §5a): a Volvo 262C, a repeat
client, a rare model. Donor vehicle sourced from the USA for parts/roof (the original roof had
vinyl-roof moisture-trap damage). In-house engine rebuild, zinc-plated components, injection unit
refurbished off-site. "Fully rebuilt and now going through shakedown tests." Names **Simon**
specifically for the finessing work — keep this as a named-credit detail, matching how
`etype-941pvo.mdx` credits Mark Antwis by name (read that file for the pattern).

Chassis number: left blank by David, still TBC — do not invent one. Add a sourcingGaps entry:
"Chassis number".

status: use "in-progress" (shakedown testing, not yet delivered to the client). pageStatus: "built".
buildType: pick the closest BuildTypeSchema fit from the description (concours-restoration /
resto-mod / race-car) — if genuinely ambiguous, leave it unset (it's optional) rather than
guessing.

Create the file at sites/dpm-autobody/content/builds/volvo-262c.mdx with slug `volvo-262c`.

Photos: album `volvo-262c`, R2 subpath `volvo-262c` (17 photos, no plates — none fitted to the
car). Read exact URLs from output/sessions/2026-09/photos-manifest.json (written by an earlier
phase in this run). Open the album's contact sheet, pick a strong heroImage (this build has none
yet, unlike every other phase in this brief — you must set one), a heroImageAlt describing what's
actually in that photo, and add a sensible gallery selection to galleryImages.

Then add "volvo-262c" to the LIBRARY_ORDER array in sites/dpm-autobody/app/library/page.tsx —
append it at the end of the array (the file's own header comment explains there's no `order` field
yet, so the array's literal sequence IS the display order; appending is the minimal, safe choice
per that file's documented convention).

Run `cd sites/dpm-autobody && npx tsx scripts/validate-content.ts` and confirm this new file
passes, and run `pnpm --filter dpm-autobody run type-check` to confirm the LIBRARY_ORDER edit
doesn't break anything (it's a `const` tuple — adding a new valid slug string should be fine, but
verify).
```

**Commit after this phase:**

```bash
git add sites/dpm-autobody/content/builds/volvo-262c.mdx sites/dpm-autobody/app/library/page.tsx
git commit -m "feat(dpm-autobody): add new Volvo 262C build to the library

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_01JfHobWPgzzVWigAY9SAn55"
```

---

## Phase 4 — Add a workshop-action photo section to the workshop page

**Goal:** David specifically asked for workshop action photos (welding/metalwork atmosphere, not
build-specific), including a usable dog photo if one exists. The workshop page currently has no
photo grid at all beyond its single hero image — this is a real addition, not a hero swap.
**Model:** sonnet — new JSX section, needs real photo inspection to pick the dog shot and a coherent selection
**Execution:** delegate to 1 sonnet sub-agent
**Failure contract:**

- **Fail fast.** Any uncaught exception aborts the phase immediately — do not swallow it, retry blindly, or continue to the next step.
- **Show the evidence.** On failure, print the full traceback AND the offending record (the exact input/row/item being processed when it threw). No bare error messages.
- **No partial passes.** A phase that processed only some of its records has FAILED, not passed. Never report success on partial data — surface the shortfall.
- **Verdict line, always.** End the phase with exactly one line: `PASS — <n>/<total> records, 0 errors` or `FAIL — <n>/<total> records, <e> errors: <first offending record>`. The counts are mandatory, on both PASS and FAIL.
  **Gate contract:** (all four required — see templates/gated-phase-brief-template.md)
- **(a) Golden-fixture test:** n/a — page/component work, not a parser.
- **(b) Invariant on real data:** the rendered page (checked via `pnpm --filter dpm-autobody run build` + a manual look, or dev server + curl/screenshot) shows a new photo grid with more than one image and includes the dog photo; every `src` resolves to a URL present in `photos-manifest.json`.
- **(c) Rollback:** `git revert <this phase's commit>`.
- **(d) Hard fail:** the section renders 0 images, OR no dog photo is included despite one being available in the album.

Task: Add a workshop-action photo grid to app/workshop/page.tsx
model: sonnet
Prompt:

```
Read sites/dpm-autobody/app/workshop/page.tsx in full — it currently has a hero, a lede, and an
in-house/out-of-house two-column list, and nothing else. Also skim
sites/dpm-autobody/components/pages/build-detail-page.tsx's `PhotoGrid` function (around line 588)
purely as a visual-pattern reference (grid gap/columns/figcaption styling using theme tokens) — do
NOT import it into the workshop page; this page has no shared gallery component yet and one isn't
needed for a single grid, so write a small self-contained grid directly in page.tsx using the same
Tailwind theme-token conventions (no hardcoded hex, `bg-brand-primary`-style tokens only) already
used elsewhere on this page.

Photos: album `workshop-action`, uploaded in an earlier phase of this run to R2 under
`dpm-autobody/workshop/action/` (19 photos, no plates). Read exact URLs from
output/sessions/2026-09/photos-manifest.json.

David's ask (BACKLOG.md, "Workshop page" section): general welding/metalwork atmosphere shots, "not
build-specific — atmosphere and craft, not 'here's car X being welded'"; and specifically a photo
of the workshop dog, if there's a usable one. Open the album's contact sheet and look at the actual
photos: pick ~6-10 that read as atmosphere/craft shots (avoid several near-duplicates of the same
angle), and make sure the dog photo is one of them. (HANDOFF.md notes two more dog cameos turned up
unprompted in the bentley-s3-1964-chassis-rebuild and p1800-red-2026-09 albums, already uploaded in
this run under bentley-s3-1964/chassis-rebuild-2026-09 and p1800-red/2026-09 respectively — you may
use one of those instead if it's a stronger shot than anything in workshop-action itself.)

Add the new grid section below the existing in-house/out-of-house list, using `next/image` (not
plain `<img>`), real alt text describing what's actually in each photo (not generic "workshop
photo" text), and a heading that makes clear this is general workshop atmosphere rather than a
specific build (matching David's own framing).

Verify visually: start the dev server if one isn't already running cleanly on port 3000 (check
`lsof -i :3000 -sTCP:LISTEN` first per this project's CLAUDE.md — don't assume a stale process is
healthy), and confirm the new section renders with real images, not broken boxes.
```

**Commit after this phase:**

```bash
git add sites/dpm-autobody/app/workshop/page.tsx
git commit -m "feat(dpm-autobody): add workshop action photo section, incl. the dog shot David asked for

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_01JfHobWPgzzVWigAY9SAn55"
```

---

## Parallel execution groups

This section lists work units that can run concurrently. Each group lists items that MUST be launched in a single Task-tool message. Items across groups run sequentially in the order listed. Groups are named `G1`, `G2`, … for reference.

### Intra-phase groups

| Group | Phase   | Items                                                                                                                                                                        | File overlap            | Model  | Rationale                              |
| ----- | ------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------- | ------ | -------------------------------------- |
| G1    | Phase 2 | 7 sub-agents: bentley-s3-1964.mdx, bentley-s3-continental.mdx, p1800-pearl-white.mdx, p1800-red.mdx, p1800-candy-restomod.mdx, porsche-356-sc.mdx, aston-martin-db6-pink.mdx | none — 7 distinct files | sonnet | Independent MDX files, no shared state |

### Cross-phase groups

Phases 2, 3, and 4 touch entirely disjoint files (Phase 2: 7 build MDX files; Phase 3:
`volvo-262c.mdx` + `app/library/page.tsx`; Phase 4: `app/workshop/page.tsx`) and none depends on
another's output beyond Phase 1's manifest, which all three only _read_. They may be launched as
one combined 9-agent group instead of three sequential phases, if the orchestrator prefers — this
is explicitly allowed, unlike the default "leave empty" rule, because the independence is real and
stated here.

| Group | Phases  | Items                                                                                              | Rationale                                                                  |
| ----- | ------- | -------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------- |
| G2    | 2, 3, 4 | All of G1's 7 sub-agents + Phase 3's Volvo 262C sub-agent + Phase 4's workshop sub-agent (9 total) | Disjoint files, all read-only against Phase 1's manifest, no ordering need |

If run as G2, commit each phase's file(s) separately and in the order written above (7 builds,
then Volvo 262C + library page, then workshop page) once all 9 sub-agents return — commits are
still never batched, per the Rules footer.

### Sequential points — MUST NOT parallelise

| Item                                                                                    | Reason                                                                     |
| --------------------------------------------------------------------------------------- | -------------------------------------------------------------------------- |
| Phase 1 (R2 upload) before Phase 2/3/4                                                  | Every later phase reads `photos-manifest.json`, which Phase 1 produces.    |
| Verification gates (type-check / build / lint / test / validate:content) between phases | Each phase's output gates the next. Gates are the synchronisation barrier. |
| Git commits                                                                             | One commit per build/phase, in order. Commits are never batched.           |
| Any file edited by two or more items                                                    | None here — see table above — but the rule still applies if that changes.  |

---

## Phase 5 — Final verification gate, BACKLOG update, session file

**Goal:** Run every gate `dpm-autobody` defines, update `BACKLOG.md` §5a to move completed items
from open to done, and close out the session file.
**Model:** sonnet — coordination + doc update, low complexity but needs accurate cross-referencing of what actually landed
**Execution:** delegate to 1 sonnet sub-agent
**Failure contract:**

- **Fail fast.** Any uncaught exception aborts the phase immediately — do not swallow it, retry blindly, or continue to the next step.
- **Show the evidence.** On failure, print the full traceback AND the offending record (the exact input/row/item being processed when it threw). No bare error messages.
- **No partial passes.** A phase that processed only some of its records has FAILED, not passed. Never report success on partial data — surface the shortfall.
- **Verdict line, always.** End the phase with exactly one line: `PASS — <n>/<total> records, 0 errors` or `FAIL — <n>/<total> records, <e> errors: <first offending record>`. The counts are mandatory, on both PASS and FAIL.
  **Gate contract:** (all four required — see templates/gated-phase-brief-template.md)
- **(a) Golden-fixture test:** the gate commands below, run for real against the actual repo state (not simulated).
- **(b) Invariant on real data:** all of type-check/build/lint/test/validate:content/validate:quality exit 0.
- **(c) Rollback:** `git revert <this phase's commit>` for the BACKLOG.md change; the gate run itself has no state to roll back.
- **(d) Hard fail:** any gate command exits non-zero.

```bash
# Verification gate — STOP if this fails
pnpm --filter dpm-autobody run type-check
pnpm --filter dpm-autobody run build
pnpm --filter dpm-autobody run lint
pnpm --filter dpm-autobody run test
cd sites/dpm-autobody && npx tsx scripts/validate-content.ts && npx tsx scripts/validate-quality.ts && cd ../..
```

Task: Update BACKLOG.md §5a and close out the session file
model: sonnet
Prompt:

```
Read output/sessions/2026-08/2026-08-26_dpm-autobody-discovery/BACKLOG.md §5a in full. For every
bullet whose content was actually applied in this run (check the real git log from this session
for what landed, and note any items a Phase-2 sub-agent flagged as skipped/uncertain — e.g. the
resto-mod's or DB6's photo discrepancies, if either was flagged), move it from "not yet applied" to
a clearly marked "done" state, following this project's own "Implementation Briefs" standard in
MEMORY.md (move completed sub-items from open to done, update evidence + summary counts). Leave
anything genuinely still open (the Porsche SC decision is now resolved and should be marked so;
Volvo 262C's and Red P1800's chassis numbers are still TBC and stay open; the resto-mod pair's
second-car/awards question stays open) clearly marked as such — do not mark something done that a
Phase-2 sub-agent explicitly flagged as skipped.

Then append a "## Completed" section to
output/sessions/2026-09/2026-09-08_dpm-autobody-build-out/yolo-brief.md per the template below,
listing every commit SHA from this run with its message, and a short paragraph summarising what
was implemented and any surprises (the two photo-discrepancy flags, if either fired, belong here).
```

## Cost Estimate

| Phase                                       | Model  | Est. input tokens | Est. output tokens | Est. cost                     |
| ------------------------------------------- | ------ | ----------------- | ------------------ | ----------------------------- |
| Phase 1: R2 upload (11 albums, ~170 photos) | sonnet | ~15k              | ~3k                | low                           |
| Phase 2: 7 build MDX updates                | sonnet | ~90k (7×~13k)     | ~21k (7×~3k)       | mid                           |
| Phase 3: New Volvo 262C page                | sonnet | ~14k              | ~3k                | low                           |
| Phase 4: Workshop page photo section        | sonnet | ~12k              | ~3k                | low                           |
| Phase 5: Final gates + BACKLOG update       | sonnet | ~10k              | ~2k                | low                           |
| **Total**                                   |        | **~141k**         | **~32k**           | **mid, single-digit dollars** |

Rates: Opus highest, Sonnet mid, Haiku lowest per MTok (see console.anthropic.com for exact current pricing).
Estimation: ~5 tokens per line of code/prose. Input = files read + brief (~6k) + system prompt (~3k) per sub-agent. Output = MDX/JSX written + verification output (~500/gate).

---

## Final Report

After all phases complete, output:

1. Phases completed — list each with commit SHA
2. Build status — confirm `pnpm --filter dpm-autobody run type-check && run build && run lint && run test` and both `validate-content.ts`/`validate-quality.ts` pass
3. Any exceptions or intentional deviations from the plan — **explicitly call out** whether the
   DB6 and/or resto-mod photo-discrepancy flags fired (see Phase 2 prompts), and what was decided
4. Token usage and cost estimate:

   | Model     | Est. input tokens     | Est. output tokens | Est. cost |
   | --------- | --------------------- | ------------------ | --------- |
   | sonnet    | [total across phases] |                    | $X.XX     |
   | **Total** |                       |                    | **$X.XX** |

   Estimate tokens from: files read (lines x 5) and written (lines x 5).
   Compare to the pre-flight Cost Estimate above.
   For exact figures: check console.anthropic.com.

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

## Run Wrap-Up

After completing all phases and updating the session file, run:

/wrap-up-session

This writes a wrap-up summary to the session folder. **Do not skip it.**

---

## Rules

- STOP on any failed verification gate — do not continue to next phase
- **Honour every phase's `**Failure contract:**`.** Fail fast on any uncaught exception (never swallow, blind-retry, or press on), print the full traceback and the offending record, and never report a phase as passed on partial data. Each phase MUST end with its one-line PASS/FAIL verdict including counts (`PASS — <n>/<total> records, 0 errors` / `FAIL — <n>/<total> records, <e> errors: <first offending record>`). A FAIL verdict is a failed gate — STOP.
- **Honour every phase's `**Gate contract:**`.** A phase passes only when its checks actually ran and passed, not merely declared. Have the phase's rollback to hand before you start it.
- Read every file before editing it
- **Never push. Never merge to `staging` or `main`. Everything stays committed on `develop`, locally.** This is a hard stop, not a default that can be overridden by inference from HANDOFF's own next-step text — the user must explicitly ask for push/promotion separately.
- **Do not create a feature branch.** Work happens directly on `develop` — see "Deviation from default branch model" above.
- **Delegate every phase's implementation to sub-agents by default.** The orchestrator coordinates, gates, and commits — it does NOT write phase code/content inline.
- **The `**Model:**` tier names the sub-agent's model, not the orchestrator's.**
- **Inline is the exception, not the default.**
- **Consult the `## Parallel execution groups` section before launching any work.** G1 (or the combined G2, if you choose to merge phases 2-4) MUST be launched in a single Task-tool message.
- **Never parallelise across phase boundaries** except where G2 explicitly allows it above.
- **If the groups table and the phase prose disagree, the groups table wins.**
- Minimal changes only — implement what the plan says, nothing more. Do not invent facts David
  didn't supply; expand wording only, per his own stated licence.
- Use `model: sonnet` for every phase in this brief — none of this work is purely mechanical
  (find-replace/import-only), and none requires opus-level cross-file architectural reasoning.
- The Co-Authored-By line in commits must reflect the **orchestrator** model (the committer). If
  the running orchestrator differs from this brief's stated `**Orchestrator model:**`, use the
  actual running model.
- Every brief MUST verify with the project's type-check, build, and lint gates, plus this site's
  `test`, `validate:content`, and `validate:quality` — see Phase 5. STOP if any fails.
- **Real-data rule:** every photo URL written into any frontmatter or page component MUST come
  from `photos-manifest.json` (produced by a real R2 upload in Phase 1) — never hand-constructed,
  never invented. This is the project's own established discipline (this exact class of mistake —
  trusting a label instead of verifying against the real artifact — has bitten this project twice
  already; see the folder-transposition and undersized-redaction-box notes in HANDOFF.md).

## Completed

**Date:** 2026-09-16
**Status:** All phases executed successfully

David's 2026-09-15 per-build content and photo albums were applied across all 10 builds in the
library (9 existing + 1 new). 170 photos across 11 albums were uploaded to R2 and wired into
frontmatter via `photos-manifest.json` (real manifest path:
`output/sessions/2026-09/2026-09-08_dpm-autobody-build-out/photos-manifest.json`). Chassis numbers
were confirmed and set for the Bentley S3 1964 (BC60 XC) and Bentley S3 Continental (BC66 XA); the
Volvo 262C (a brand-new build added to the library, bringing it to 10 builds) and the Red P1800
both remain TBC on chassis number with open `sourcingGaps` entries. Two photo-discrepancy checks
surfaced during the run: the "Porsche SC" album was confirmed to be the same car as
`porsche-356-sc.mdx` (RESOLVED, per David 2026-09-16) via a matching filename plus 11 new gallery
photos; and the DB6 album was found to contain a 15-photo batch despite David's email saying "no
new photos" for that build — 6 of 15 filenames matched existing gallery photos exactly and the
remaining 9 showed no new content, so zero photos were added and a new `sourcingGaps` entry was
added instead asking David to confirm nothing was missed (this stays open, not resolved). Two
previously-open DB6 `sourcingGaps` entries (race status since the 2022 crash, pre-crash livery
colour) were resolved and removed. A new workshop-page "Workshop atmosphere" photo section was
added, including the dog photo David requested, found within the workshop-action album itself —
this also corrected an incorrect HANDOFF.md claim that two other albums contained unprompted dog
cameos; neither actually does. One redaction gap was found outside this run's scope: an unredacted,
legible plate ("723 HYK", on a shelf, not the car) in
`inbox/p1800-red-2026-09/redacted/IMG_1601.jpg`, not used in any gallery, logged as an open item.
All 10 build MDX files pass `validate-content.ts`, and the full gate run passed: type-check, build
(10 build pages generated), lint, test (84/84), validate-content (10/10), validate-quality (0/0,
expected on this site).

### Commits

- `a23c67fb` — feat(dpm-autobody): extend R2 photo upload for David's 2026-09-15 batch (11 albums)
- `2808e624` — feat(dpm-autobody): add Bentley S3 1964 chassis number and David's 2026-09-15 content
- `65a654f7` — feat(dpm-autobody): fold Porsche SC 2026-09-15 photos into porsche-356-sc build
- `9faa77ab` — feat(dpm-autobody): expand P1800 Candy resto-mod with trim/paint detail and 2026-09-15 photos
- `1a1af03a` — feat(dpm-autobody): rewrite P1800 Pearl White with David's 2026-09-15 restoration detail
- `e9b43f08` — feat(dpm-autobody): add new Volvo 262C build to the library
- `57f65d24` — feat(dpm-autobody): add DB6 NEC exhibition photos, flag duplicate 2026-09-15 photo batch
- `8f3488d4` — feat(dpm-autobody): add Bentley S3 Continental chassis number and David's 2026-09-15 content
- `784d3c86` — feat(dpm-autobody): add P1800 Red restoration detail and David's 2026-09-15 photos
- `52990124` — feat(dpm-autobody): add workshop action photo section, incl. the dog shot David asked for
