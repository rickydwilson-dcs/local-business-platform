# DPM Autobody build-out — handoff

**2026-09-12 update:** all 9 remaining builds now have real `/builds/[slug]` pages (`pageStatus:
built`), wired to the R2 photos this session uploaded, using `BuildDetailPage`'s existing
thin-content fallback rather than inventing narrative. A new `sourcingGaps` frontmatter field +
`SourcingGapNotice` component makes missing facts (chassis numbers, the Pearl White singer's name,
etc.) a visible amber notice instead of a silent gap. A build's confirmed `video` now actually
renders (it never did before — CSP's `frame-src` had to widen for `youtube-nocookie.com`). The
"Rare Volvo"/Pearl White duplicate builds were merged into one. Homepage's No. 03 slot is now the
Aston Martin DB6 (finished) instead of Jaguar Sea Green (still-in-progress framing didn't fit a
"Finished and delivered" slot). See `sites/dpm-autobody/CLAUDE.md`'s "Current state" for the full
detail — not yet committed as of this note; see git status. Full re-write of the sections below
(much of it now stale) is due at the next `/wrap-up-session` pass, not attempted here.

**Status (pre-2026-09-12, now partially superseded above):** ready-to-resume. Photo curation for
all 8 BACKLOG.md item 5 albums is done, the Bentley video-credit and R2-upload commits are pushed
to `origin/develop`, and all 106 curated/redacted photos are live on the public R2 CDN. Nothing is
blocking a resume — the remaining work is content (David's fact confirmations) and then real MDX
bodies.
**Branch:** `develop`. Working tree clean except one untracked local-only directory (see below).
Pushed to `origin/develop` — verified `git log --oneline @{u}..` is empty.
**Commits this session:** 3, all pushed, all still unmerged into `staging`/`main` (verified
`git log --oneline staging..develop` / `main..develop` both list exactly these 3 as the tip):

- `d4487852` feat(dpm-autobody): add confirmed video credit to Bentley S3 Continental
- `62828063` docs(dpm-autobody): record video-work resolution in build-out handoff
- `46f0ad91` feat(dpm-autobody): upload 106 curated build photos to R2

**Working tree:** clean except `output/sessions/2026-09/2026-09-08_dpm-autobody-build-out/inbox/`
(untracked, deliberately — see Traps). No uncommitted edits anywhere else.

## What this is trying to resolve

Same underlying goal as the session before: turn DPM Autobody's approved prototype into a real MDX
site. The other 10 library builds need real photos before they can get real pages, and 3 open video
items and a run of David-confirmation facts (chassis numbers, names, wording) were blocking that.
This session (across two resumed passes) did the iCloud photo pulls + plate-redaction for all 8
albums BACKLOG.md item 5 lists, resolved all 3 video items, and uploaded the resulting 106 photos to
R2. David's fact confirmations are the only thing still outstanding — see Open Questions.

## Live-data changes already applied

**106 image files were uploaded to the public Cloudflare R2 bucket** (`local-business-platform`,
served at `https://pub-a159d5c51e44442897e06986a53dda1d.r2.dev`) under `dpm-autobody/builds/`. This
is a real write to a shared, publicly-reachable CDN — a fresh session must **not** re-run the
uploader expecting a no-op-if-done state without knowing this already happened (the tool **is**
idempotent — see below — but re-running it wastes a full scan/upload pass for nothing, since every
object already exists).

| Album (`inbox/<name>/redacted/`) | R2 path                                                | Files |
| -------------------------------- | ------------------------------------------------------ | ----- |
| `p1800-restomod`                 | `dpm-autobody/builds/p1800-candy-restomod/`            | 5     |
| `bentley-s3-chassis`             | `dpm-autobody/builds/bentley-s3-1964/chassis-rebuild/` | 20    |
| `bentley-s3-metalwork`           | `dpm-autobody/builds/bentley-s3-1964/metalwork/`       | 12    |
| `porsche-356sc`                  | `dpm-autobody/builds/porsche-356-sc/`                  | 18    |
| `db6-pink-aston`                 | `dpm-autobody/builds/aston-martin-db6-pink/`           | 24    |
| `p1800-red`                      | `dpm-autobody/builds/p1800-red/`                       | 9     |
| `p1800-pearl-white`              | `dpm-autobody/builds/p1800-pearl-white/`               | 8     |
| `p1800-candy-underside`          | `dpm-autobody/builds/p1800-candy/`                     | 10    |

**Verified 2026-09-11:** dry run (`--dry-run`) reported exactly 106 files / 298.19 MB, matching the
prior handoff's own curation table before anything was uploaded. Live run reported `106/106
uploaded, 0 failed`. Post-upload, 3 URLs spot-checked across 3 different albums all returned
`200 image/jpeg` with real byte counts (258 KB–2.7 MB — consistent with full photos, not empty
objects). Full per-file record (local path → R2 key → URL → status) is in
`photos-manifest.json` in this session folder, committed in `46f0ad91`; `python3 -c` over it
confirms all 106 entries carry `"status": "uploaded"`.

**Album-to-build-slug mapping** (used to choose the R2 subpaths above) came from
`../2026-08/2026-08-26_dpm-autobody-discovery/BACKLOG.md` item 5 — matched by which build each
iCloud link was attached to — cross-checked against the real filenames in
`sites/dpm-autobody/content/builds/*.mdx`. The two Bentley S3 1964 albums ("Metalwork and body
prep" / "Chassis rebuild") both feed the _same_ in-progress build and were kept in separate
subfolders, since BACKLOG.md's own framing note asks for "before images alongside the raw
metalwork" as two distinct threads on that build's eventual page.

**No rollback command exists** for this upload — R2 objects would need deleting individually via
`R2Client.deleteFile()` (see `tools/lib/r2-client.ts`) or the Cloudflare dashboard. There is no
reason to roll it back; these are the intended final assets, just not yet referenced from any MDX.

## What was NOT done

- **No MDX pages or frontmatter have been written or edited to reference the new R2 photos.**
  Checked directly: `grep -l "heroImage\|galleryImages" sites/dpm-autobody/content/builds/*.mdx`
  still shows every existing `heroImage` pointing at the _old_ prototype-era R2 path
  (`.../prototypes/2026-08-26_dpm-autobody-discovery/assets/...`), not the new
  `dpm-autobody/builds/...` paths just uploaded. Wiring these in is real content work for a future
  pass — it is not blocked technically, but several builds are blocked on David's confirmations
  (see Open Questions) and none should be written from photos alone.
- **David's fact confirmations are still outstanding** — unchanged from the prior handoff, see Open
  Questions below. Do not write body copy for the affected builds until these land.
- **The 3-part unedited resto-mod restoration video is identified but not embedded anywhere** — see
  "Video work" below for why (raw footage, and the schema only supports one video id per build).
- **DB6 album's case-sensitivity gap was never backfilled** — ~27 lowercase-extension photos were
  silently excluded from that album's contact sheets before the triage-script bug was caught
  (see Traps). The shortlist drawn from it is still good; a full re-triage was never done. Low
  priority — only matters if the DB6 page later needs more material than the 24 already uploaded.
- **`bentley-s3-continental.mdx`'s `heroImage` still points at the old prototype-era R2 path**, not
  a site-specific `dpm-autobody/...` one — noted as a gap for whoever writes that build's real body,
  not fixed this session.
- **Nothing has been merged into `staging` or `main`.** All 3 commits above exist only on `develop`,
  pushed to `origin/develop`. The next promotion step (`develop` → `staging` → `main`, per this
  project's git workflow) has not been started.

## Video work — resolved 2026-09-11

All three BACKLOG.md item 5 video items were actioned in an earlier pass of this session:

1. **Candy Red Volvo wrong-video mismatch — confirmed already resolved, no action needed.** The
   real site's `sites/dpm-autobody/content/builds/p1800-candy.mdx` (chassis 26282, the live page)
   has no `video` field and no reference to a "37:32 minute film" anywhere. The wrong claim was
   only ever in the old static prototype (`home.html`/`volvo-p1800.html`, fixed there 2026-09-08
   per BACKLOG.md) — never ported into the real MDX site, which was scaffolded later.
2. **Bentley finished-car video — added and committed (`d4487852`).**
   `bentley-s3-continental.mdx` (No. 05, the finished S3 Continental, distinct from the in-progress
   S3 1964 at No. 10) carries `video: { id: "JpztIam_ARE", type: "professional" }`, confirmed by
   David 2026-09-08. Matches the fixture already written in
   `lib/__tests__/build-content-schema.test.ts`. Verified at the time:
   `pnpm exec vitest run lib/__tests__/build-content-schema.test.ts lib/__tests__/content-schemas.test.ts`
   (49/49 pass) and `npx tsx scripts/validate-content.ts` (12/12 builds pass).
3. **The unedited 3-part resto-mod restoration video — located and confirmed, deliberately not
   wired into MDX.** DPM TV's "VOLVO P1800 RESTORATION PART 1/2/3" (July 2021 – Mar 2022):
   Part 1 `8Y2inpQzaJ4`, Part 2 `RgkayNub9Ms`, Part 3 `LVfZx4-4HRg`. Confirmed by transcript (part
   2, ~17:50: _"we're going to dedicate this episode to tonja who is the owner of the vehicle"_) as
   the resto-mod (`p1800-candy-restomod.mdx`, chassis 23925), not the separate `p1800-red.mdx`
   build. Not added because (a) it's raw/unedited footage — BACKLOG.md says to expect
   editing/trimming, not a straight embed — and (b) `BuildVideoSchema` in `lib/content-schemas.ts`
   only supports one `id`, not a 3-part series. Next step when this build gets a real page: either
   edit the three parts down to one clip, or extend `BuildVideoSchema` to carry more than one id.

## Actions taken (chronological, across both passes of this session)

**Pass 1 — photo curation:**

1. Counted photos in all 8 iCloud shared albums from
   `../2026-08/2026-08-26_dpm-autobody-discovery/BACKLOG.md` item 5.
2. Downloaded all 8 albums in full (~8,500 photos, ~40 GB) into `inbox/<album>/raw/`.
3. Built date-sorted, labeled contact sheets per album (`inbox/make-contact-sheets.sh`) to triage
   visually without opening 8,500 individual images.
4. **Found and fixed a case-sensitivity bug** in `make-contact-sheets.sh` (glob `*.HEIC *.JPG`
   silently dropped lowercase `.heic`/`.jpg`) — caught on Red P1800 (435/1442 photos missing before
   the fix); DB6 lost ~27 photos to this before being caught (not backfilled, see above).
5. Selected a shortlist per album by eye, extracted full-resolution originals.
6. Ran every shortlisted photo through the plate-redaction tool (propose → confirm → apply),
   visually confirming every image against the **applied output**, not the browser preview (see
   Traps — the review UI's on-screen box did not always match its recorded coordinates).
7. Adjusted process mid-session after the redaction review UI froze the Chrome tab twice — switched
   to hand-editing `redactions.json` coordinates (measured via ImageMagick crops) for the final two
   albums rather than fighting the UI further.
8. User confirmed deletion of all intermediate directories (`raw/`, `thumbs/`, `contact-sheets/`,
   `shortlist/`, `redact-work/`, album `.zip`s) once the 106-photo `redacted/` sets were final —
   `inbox/` went from ~53 GB to ~307 MB. See Traps for what this means for re-doing any of this.

**Pass 2 (this resumed session) — video work, then R2 upload:**

9. Confirmed via `git log`/`git status` that the prior pass's uncommitted Bentley MDX edit had, in
   fact, already been committed and the handoff doc updated (`d4487852`, `62828063`) but not yet
   pushed — pushed both to `origin/develop` (pre-push type-check passed, 13/13 packages).
10. Wrote `tools/upload-dpm-autobody-photos-to-r2.ts`, reusing `tools/lib/r2-client.ts`. Dry-ran it
    first (reported 106 files / 298.19 MB, matching the curation table exactly), then ran it live —
    see "Live-data changes already applied" above for the result.
11. Committed the new tool + `photos-manifest.json` + this handoff update as `46f0ad91`, pushed to
    `origin/develop` (pre-push type-check + lint passed, 16/16 and 10/10 packages respectively).

## Current state — verified 2026-09-11

106 photos total, all shortlisted + plate-checked + GPS-stripped + individually crop-verified, now
**both** sitting in `inbox/<album>/redacted/` locally **and** live on R2 (see table above):

| Album                                                 | Source count                                      | Shortlisted | Real plates found & redacted                     |
| ----------------------------------------------------- | ------------------------------------------------- | ----------- | ------------------------------------------------ |
| `p1800-restomod`                                      | 5 (David's own curated set)                       | 5           | 2 (background vehicle, not the client car)       |
| `bentley-s3-chassis`                                  | 466                                               | 20          | 0                                                |
| `porsche-356sc`                                       | 881                                               | 18          | 0                                                |
| `db6-pink-aston`                                      | 603 (574 indexed, see case-sensitivity bug above) | 24          | 3 (the car's own "OH OH 7" plate)                |
| `p1800-red`                                           | 1442                                              | 9           | 1                                                |
| `p1800-pearl-white`                                   | 1646                                              | 8           | 0 (car has no bumper/plate fitted at this stage) |
| `p1800-candy-underside` (chassis 26282, already live) | 1418                                              | 10          | 3 (the car's own "NYS 727F" plate)               |
| `bentley-s3-metalwork`                                | 2037                                              | 12          | 0                                                |

Best finds: **Porsche 356 SC** and **Candy P1800 underside** albums both contain genuine
finished-car-in-daylight-away-from-workshop shots — the exact shot type the original discovery
audit (`research/asset-audit-dpm.md`) found DPM had none of. DB6 album has a complete before→after
arc (crash damage → bare metal → DPM paint booth → finished pink).

## Traps

- **`inbox/*/raw/`, `thumbs/`, `contact-sheets/`, `shortlist/`, `redact-work/`, and the album
  `.zip`s were deleted after the curation pass** (user confirmed) — `inbox/` now holds only
  `redacted/` (the 106 final photos, now also on R2) per album plus `make-contact-sheets.sh`. **If
  more photos are ever needed from these same 8 albums, they must be re-downloaded from the iCloud
  links in `../2026-08/2026-08-26_dpm-autobody-discovery/BACKLOG.md` item 5** — there is no local
  raw copy anymore.
- **The redaction working files (`redact-work/review.html`) were part of what got deleted** —
  this closes the git-tracking risk from an earlier draft of this handoff (those `.html` files
  weren't covered by the binary `.gitignore` denylist). If redaction work resumes on new photos,
  remember this `.gitignore` gap still exists.
- **Two DB6 raw filenames collided with duplicate-suffix originals** (`IMG_1029.HEIC` vs
  `IMG_1029-1.HEIC`, same for 1030/1031; separately `IMG_3036` in the Candy underside album) —
  iCloud's own duplicate-naming. One wrong pick happened this session (a steering-wheel photo
  instead of the intended exterior shot in `p1800-candy-underside`, kept anyway since still usable)
  and was not corrected. If re-pulling either album, check both variants exist before assuming
  which one a thumbnail came from.
- **The `plate-redact` review.html UI is unreliable for anything but very short sessions** — froze
  the Chrome tab outright twice, losing in-progress state both times. Prefer measuring plate pixel
  bounds with an ImageMagick crop and hand-writing `redactions.json` for any future redaction work.
- **`make-contact-sheets.sh` in `inbox/` is a working, fixed (case-insensitive) script** — reuse it
  directly for any further album work rather than rewriting.
- **`tools/upload-dpm-autobody-photos-to-r2.ts` is idempotent but not free to re-run** — it does a
  `headFile()` check per object before uploading, so re-running against unchanged `redacted/`
  content will report "0 uploaded, 106 skipped" rather than erroring or duplicating, but it still
  makes 106 HEAD requests. No reason to re-run unless the `redacted/` contents change.

## Next step

All of David's item-5 video items and the R2 upload are done. What's left before real build pages
can be written:

1. **David's outstanding fact confirmations** — see Open Questions below. Chase these before
   writing body copy for the affected builds.
2. **Write real MDX bodies**, wiring each build's `heroImage`/`galleryImages` to its
   `dpm-autobody/builds/<slug>/...` R2 URLs from the table above. Not blocked for every build —
   e.g. Porsche 356 SC's photos are ready now and its only outstanding fact is the
   "might/minor mechanical rebuild" wording; Bentley S3 1964's photos are ready but its chassis
   number is still TBD.
3. **While writing the Bentley S3 Continental (No. 05) page**, consider moving its `heroImage` off
   the old `prototypes/2026-08-26_dpm-autobody-discovery/...` R2 path onto the new
   `dpm-autobody/...` convention, now that real per-build R2 folders exist.
4. **Once real pages are ready, run the normal promotion flow** (`develop` → `staging` → `main`,
   `gh run watch` after each push) — nothing from this session has been merged past `develop` yet.

## Open questions

Still outstanding, still blocking real pages for the corresponding builds:

- Pearl White P1800 (formerly tracked as two separate builds — see "Resolved" below) — the singer's
  name is still not known; David hasn't given it. `scopeOfWork` in `p1800-pearl-white.mdx` carries
  the owner-history note with the name left as "to be confirmed by David."
- The two-P1800s-same-client build — show names/awards still needed.
- Bentley S3 1964 (in-progress) — chassis number still TBD.
- The "262" build — chassis number still pending; may replace the T. Green Aston Martin content in
  the featured set.
- Porsche 356 SC — confirm the "might/minor mechanical rebuild" wording before publishing.
- Pink Aston Martin DB6 — currently "due to race again"; confirm current status before publishing.

Resolved and no longer open:

- The chassis 26282 vs. 23925 question (David confirmed 2026-09-11 these are two genuinely
  different Candy Red P1800s, not a transcription error).
- **"Rare Volvo" (prototype No. 11, "Volvo, model to be confirmed") and Pearl White P1800
  (prototype No. 12) are the same build, confirmed 2026-09-11** — not two separate cars as the
  approved prototype's `library.html` had them. `volvo-tbc.mdx` was removed, its singer-owned-it
  note folded into `p1800-pearl-white.mdx`'s `scopeOfWork`, and `app/library/page.tsx`'s
  `LIBRARY_ORDER` updated from 12 real slugs to 11. `npx tsx scripts/validate-content.ts` and
  `type-check` both re-verified clean after the merge.
- **The "1,300 hours" figure on Candy Red P1800 (No. 01), Red P1800 (No. 03), and Pearl White
  (No. 12) — confirmed 2026-09-11 by David as three genuinely separate totals, not one figure
  copied across builds.** This was flagged as a real risk both in BACKLOG.md and as a caution note
  baked into the approved prototype's own `library.html` (No. 12's row). No content change needed;
  all three MDX files already carry their own correct value.

## Content note for future photo-wiring passes

**Pearl White P1800 (and any other in-progress build) should show work-in-progress photos on the
homepage/library, not finished-car shots** — confirmed 2026-09-11. This matches the framing note
already in BACKLOG.md item 5 for the Bentley S3 1964 and the (now-merged) rare Volvo: "restoration
in progress," not a showcase of an end state that doesn't exist yet for these cars. Keep this in
mind when selecting `heroImage`/`galleryImages` for any build still `status: in-progress`.
