# DPM Autobody build-out — handoff

**Status: ready-to-resume, nothing blocked.** All code/content/photo work from David's 2026-09-15
batch is built, gate-clean, documented, and deployed all the way to production. What's left is
entirely business-side: a short list of facts to ask David for (below), not engineering work.

**Branch:** `develop`. Working tree has no uncommitted changes belonging to this work (see
"Working tree" below for what _is_ dirty and why it's not ours).
**Commits:** 0 ahead of `origin/develop` — everything is pushed. `develop`, `staging`, and `main`
are all at the same content (`git diff origin/main origin/staging --stat` is empty, verified
2026-09-17 21:40 BST).
**Working tree:** not clean, but nothing in it is this session's work:

```
 M output/sessions/2026-08/2026-08-17_dcs-homepage-redesign/content-brief.md
?? output/sessions/2026-09/2026-09-15_dcs-inner-pages-design/
?? sites/npracing-v1/content/news/breakthrough-t1d-discovery-day.mdx
```

These three appeared over the course of this session without this session creating them — they
look like a concurrent, unrelated Claude Code session (or sessions) touching the same working
directory (DCS content-brief correction, a DCS inner-pages design folder, an NP Racing news post).
None were touched, staged, or committed here. If you're a fresh session picking this up and don't
recognise them either, they're not yours to resolve blind — ask, don't discard.

## What this is trying to resolve

David (owner) replied 2026-09-15 to the per-build content ask that had been open since 2026-09-12,
with text corrections for six builds and 11 new iCloud photo albums. The work was to apply all of
it: redact every plate in every new photo, upload to R2, update six builds' copy/photos, add one
new build (Volvo 262C), add a workshop "atmosphere" photo section, and resolve two ambiguities the
photos themselves raised (a Porsche album that might be a different car; a DB6 album that might
contain photos David said didn't exist) rather than guessing at either.

## Actions taken (chronological, this session)

1. `2808e624`…`784d3c86`, `e9b43f08`, `52990124` — the six build updates, new Volvo 262C page, and
   workshop photo section (run via an autonomous `claude --dangerously-skip-permissions -p`
   session against `yolo-brief.md`, after interactive text-correction and photo-prep work had
   already landed the groundwork). Full narrative: `session-wrap-up.md` and `yolo-brief.md`'s own
   "Completed" section — not repeated here.
2. `e6d8b14f` — found and fixed a live plate exposure: `IMG_1601.jpg`'s redaction had been missed
   by the automated pass, and the _unredacted_ file was already live on R2 (confirmed via
   `headFile`) despite never being linked from a page. Redacted by hand, re-uploaded under a new
   key per this platform's R2 cache-busting rule, old object deleted outright.
3. `3ca5c9a2` — `/update.docs` found `CLAUDE.md` and both CHANGELOGs had drifted behind the working
   tree (stale build count, unresolved-looking chassis numbers that were actually done, etc.) and
   corrected them.
4. `2cebd0a7` — the leftover `jaguar-sea-green.mdx` deletion and a `plate-redact/apply.py`
   contact-sheet bugfix (`-depth 8`), both already-verified work that had never been committed.
5. First `/deploy.changes` run: `develop → staging`, then **PR #85** (`staging → main`, PR because
   `main` is protected) — merged by the time of the second run below.
6. `57b67756` — David confirmed nothing was missed in the disputed `db6-pink-2026-09` album;
   removed the `sourcingGaps` entry and updated `BACKLOG.md`/`CLAUDE.md`/`CHANGELOG.md` to match.
7. Second `/deploy.changes` run: `develop → staging`, then **PR #86** (`staging → main`) — merged.
   `main` is now level with `staging`, verified by empty `git diff origin/main origin/staging`.

## Current state — verified 2026-09-17, ~21:40 BST

- **`main`, `staging`, `develop` are all at identical content** — `git diff origin/main
origin/staging --stat` returns nothing; `git log --oneline origin/develop..HEAD` returns nothing.
- **Library is 10 builds**, confirmed by reading `LIBRARY_ORDER` in `app/library/page.tsx` directly
  (not inferred from prose elsewhere in this file, which has drifted before): `p1800-candy`,
  `p1800-candy-restomod`, `p1800-red`, `bentley-s3-continental`, `etype-941pvo`, `porsche-356-sc`,
  `aston-martin-db6-pink`, `bentley-s3-1964`, `p1800-pearl-white`, `volvo-262c`.
- **Only two `sourcingGaps` entries remain anywhere in `content/builds/`** — confirmed via
  `grep -rl sourcingGaps sites/dpm-autobody/content/builds/*.mdx`: `p1800-red.mdx` and
  `volvo-262c.mdx`, both just "Chassis number".
- **`dpm-autobody`'s gates are clean**: `type-check`, `lint`, `test` (84/84), `validate-content.ts
builds`, and a full `next build --webpack` all passed this session, most recently against the
  DB6-resolution commit.
- **CI is green** on all three branches for every push this session (CI + E2E Tests on `develop`
  and `staging`, plus Regression Watchdog on `staging`).
- `output/sessions/2026-09/2026-09-08_dpm-autobody-build-out/inbox/` (the raw photo working tree)
  was deleted 2026-09-17 after every album's redacted output was confirmed present in
  `photos-manifest.json` (no missing/failed entries) and a spot-check of 8 R2 URLs across different
  albums all returned 200. It cannot be regenerated without David's iCloud albums again — see
  Traps.

## What was NOT done

- **The remaining content questions were never sent to David** — they were compiled and shown to
  Ricky in this session, but no email/message was drafted or sent. See "Next step".
- **Business-level `TBC` facts in `site.config.ts` are untouched**: street address/postcode
  (empty), all seven days of opening hours, `yearEstablished`, and `certifications`/`stats`
  (both empty arrays — no stats-strip component exists because there's nothing to put in it).
  These predate this session; nobody has asked David for them yet in any session.
- **Contact form is still not wired up** (`site.config.ts`'s `features.contactForm: false`) —
  blocked on Ricky getting access to verify DPM's sending domain with Resend, not a coding task.
- **The resto-mod's second client pair is still unidentified** — David confirmed 2026-09-15 that
  the "two P1800s, one client, both won show awards" story belongs to a _different_ client from
  Tonja/Ahmet, but that client's name, the two cars, and their show names/awards are still unknown.
  Living as prose in `p1800-candy-restomod.mdx`'s `scopeOfWork`, not a `sourcingGaps` entry — worth
  converting to one if it stays open much longer.
- **The Porsche album's second, unidentified white bare-shell 356 was never raised with David** —
  flagged in `BACKLOG.md` 2026-09-16 as "not acted on," still true. Nobody has asked whether it's a
  separate, unannounced build or just more photos of an existing one.
- **No e2e coverage added** for the new `/builds/volvo-262c` route or the workshop page's new
  photo section — `e2e/smoke.spec.ts` still only covers the two flagship build pages, unchanged
  from every prior handoff section below.

## Traps

- **The `inbox/` folder is gone.** Every reference to it below this point (from the 2026-09-16
  section onward) describes work that has since been completed and the folder deleted — don't go
  looking for it, and don't re-run the photo pipeline assuming it's still there to inspect.
- **This file's own prose has drifted from ground truth before** (see `CLAUDE.md`'s comment
  history for the same pattern) — the library-build-count and chassis-number claims in older
  sections below were stale by the time anyone re-read them. Trust `grep`/`git log` over this
  file's narrative for anything checkable, and re-verify before acting on an "OPEN" or "TBC" claim
  that's more than a few days old.
- **The three unrelated dirty/untracked files listed under "Working tree" above are not this
  session's** — don't fold them into a future commit for this work without checking whose they are.

## Next step

Nothing code-side is next — the next action is business, not engineering:

1. Ask David the outstanding content questions (compiled this session, not yet sent):
   - Volvo 262C's chassis number
   - Red P1800's chassis number
   - The resto-mod's second client pair — names, cars, show names, award placings
   - (Lower priority, been open longer, not from this batch) street address/postcode, opening
     hours, year established, any certifications worth listing
   - Whether the Porsche album's second white bare-shell 356 is a new build or existing-car photos
2. Once any answer arrives: apply it to the relevant `.mdx` frontmatter, remove the matching
   `sourcingGaps` entry (not just fill the fact — see `CLAUDE.md`'s own rule on this), run
   `pnpm --filter dpm-autobody run lint && run type-check && run test && npx tsx
../../scripts/validate-content.ts builds` from `sites/dpm-autobody/`, then `/deploy.changes`.
3. No large batch of work is queued behind this — each answer can go out as its own small
   `develop → staging → main` pass whenever it arrives, rather than waiting to batch them.

## Open questions

None for the next session to decide — the only open items are the content questions above, which
need David, not a technical decision.

---

**2026-09-16 — supersedes every section below.** New phase: David replied 2026-09-15 to the
per-build content ask referenced throughout the sections below (chased for in the 2026-09-12
draft email). This pass applied his pure-text corrections and ran the full photo pipeline for
all 11 new albums. **Status: in-progress, not blocked.** Text corrections are done and gate-clean
but uncommitted. Photo prep (download → convert → detect → manually review at full resolution →
redact → strip metadata) is done for all 11 albums, also uncommitted (the `inbox/` folder is
untracked by design — see Traps). **Page-building (MDX updates, new Volvo 262C page, R2 upload)
has not started.**

**Branch:** `develop`. Locally 1 commit ahead of `origin/develop` (`1f124222`, an unrelated DCS
change from another session — not part of this work, don't touch it or attribute it to DPM).
All prior DPM commits referenced in the superseded sections below are already on
`origin/develop` — confirmed via `git log --oneline @{u}..`, which shows only `1f124222`.
Whether `develop` has since been promoted to `staging`/`main` was **not checked this pass** — a
`git log origin/main..origin/develop` locally returned nothing, but that's against a possibly
stale fetch; re-fetch and check before assuming either way.

**Working tree — uncommitted:**

```
 M output/sessions/2026-08/2026-08-26_dpm-autobody-discovery/BACKLOG.md
 M output/sessions/2026-08/2026-08-26_dpm-autobody-discovery/tools/plate-redact/apply.py
 M sites/dpm-autobody/CLAUDE.md
 M sites/dpm-autobody/app/library/page.tsx
 M sites/dpm-autobody/content/builds/aston-martin-db6-pink.mdx
 D sites/dpm-autobody/content/builds/jaguar-sea-green.mdx
 M sites/dpm-autobody/content/builds/p1800-candy-restomod.mdx
 M sites/dpm-autobody/content/builds/p1800-pearl-white.mdx
?? output/sessions/2026-09/2026-09-08_dpm-autobody-build-out/inbox/   (1.1GB, untracked by design)
?? output/sessions/2026-09/2026-09-15_dcs-inner-pages-design/          (unrelated DCS session, not this work)
```

All of `sites/dpm-autobody`'s gates re-verified clean immediately before writing this handoff:
`pnpm --filter dpm-autobody run type-check`, `run test` (84/84), `run lint` — all pass.

## What this pass did

**1. Applied David's 2026-09-15 pure-text corrections** (no new assets needed), all verified
against the live MDX and gate-clean:

- Removed the "well-known singer" previous-owner claim from `p1800-pearl-white.mdx` — David: never
  happened, probably confused with a Rolls-Royce DPM restored for Julie Andrews.
- Removed the "one of two P1800s, one client" pairing claim from `p1800-candy-restomod.mdx` —
  belongs to a different client's two cars entirely, still open (unrelated to the resto-mod).
- Deleted `jaguar-sea-green.mdx` and its `LIBRARY_ORDER` entry in `app/library/page.tsx` — David's
  own call, "an old not particularly well documented restoration." Library is 9 builds, not 10.
- Porsche 356 SC "minor mechanical rebuild" — re-confirmed, already correct, no change needed.
- Corrected `aston-martin-db6-pink.mdx`: hasn't raced since the crash (still due to), and the
  crash photos show the car's **original** livery, not the new pink-request design.
- `sites/dpm-autobody/CLAUDE.md` updated throughout to match — see its "Still not done" section.
- `output/sessions/2026-08/2026-08-26_dpm-autobody-discovery/BACKLOG.md` item 5a logs all of this
  plus everything still pending (see below).

**2. Ran the full photo pipeline for all 11 albums David sent**, into
`output/sessions/2026-09/2026-09-08_dpm-autobody-build-out/inbox/<name>/{raw,redacted}/`:

| Album                                                      | Folder                            | Photos | Plates redacted                    |
| ---------------------------------------------------------- | --------------------------------- | ------ | ---------------------------------- |
| Bentley S3 1964, current restoration (chassis **BC60 XC**) | `bentley-s3-1964-current`         | 11     | 2                                  |
| Bentley S3 1964, chassis rebuild                           | `bentley-s3-1964-chassis-rebuild` | 7      | 0                                  |
| Pink DB6                                                   | `db6-pink-2026-09`                | 15     | 1                                  |
| Bentley S3 Continental, finished (chassis **BC66 XA**)     | `bentley-s3-continental-finished` | 16     | 4                                  |
| Tonja/Ahmet resto-mod Candy P1800                          | `p1800-candy-restomod-2026-09`    | 24     | 1                                  |
| "Porsche SC" — see resolution below                        | `porsche-sc`                      | 12     | 0                                  |
| Volvo 262C (**new build, no page yet**)                    | `volvo-262c`                      | 17     | 0 (no plates fitted)               |
| NEC exhibition                                             | `nec-exhibition`                  | 7      | 2 (same DB6 plate, "OH OH 7")      |
| Pearl White P1800, current restoration                     | `p1800-pearl-white-current`       | 18     | 2                                  |
| Workshop action shots (has the dog David wanted)           | `workshop-action`                 | 19     | 0                                  |
| Red P1800 (chassis still TBC)                              | `p1800-red-2026-09`               | 24     | 2 (the car's own plate, "723 HYK") |

**How it was done, and why it took as long as it did:** iCloud's shared-album API has moved to
CloudKit (`ckdatabasews.icloud.com`), not the older documented `sharedstreams` endpoint — scripting
it blind failed, and driving it via Chrome browser automation also failed (`"Unable to Download
Items — server error"`, repeatable). **Ricky downloaded all 11 albums himself via Safari** and
dropped them into `inbox/_icloud-downloads/<token>/`. From there: HEIC→JPEG at full resolution
(`sips`), run through `tools/plate-redact/detect.py`, then **every single photo reviewed
individually at full native resolution by Claude** — not just the detector's top candidates, which
were false positives on every album (rust, weld splatter, chrome trim) and never once caught a
real plate. Every real plate found was one the detector missed. Redaction was auto-applied without
the tool's normal interactive browser-confirm step, **per Ricky's explicit instruction for this
batch only** — this is a deliberate, one-time deviation from `plate-redact/README.md`'s own
"a human confirms every image" design; don't treat it as the new normal without asking again.

**3. Found and fixed a real bug** in `tools/plate-redact/apply.py`: the contact-sheet `montage`
call was emitting 12-bit JPEGs that no standard viewer (including Claude's own image reader) can
open — silently defeating the tool's own "check the contact sheet by eye before publishing" step.
Fix: added `-depth 8` to the `montage` invocation. Verified by re-generating and actually opening
a contact sheet afterward.

**4. Caught a folder mislabel before it caused harm.** The Red P1800 and NEC exhibition album
tokens were transposed during the initial batch-convert (a transcription slip copying David's
email, not a tooling bug) — caught by content-checking the first survey grid against David's
descriptions _before_ any redaction work started on either folder, and fixed with a plain `mv`
swap. If a `p1800-red-2026-09` or `nec-exhibition` folder ever looks wrong again, this is why the
swap happened — both are correctly labelled now.

**5. Resolved the "Porsche SC" ambiguity by photo evidence** (flagged as unclear when the content
first arrived — see the "Text corrections now, photos later" conversation earlier this session):
the album contains `IMG_0304.jpg`, the exact filename already used as the live
`porsche-356-sc.mdx`'s `heroImage` — confirming it's the **same car**, not a second model. It also
contains a **second, distinct white bare-shell 356** not documented anywhere on the site yet.
**Decision needed before build-out** (see Open questions): fold the white shell in as more photos
of the same in-progress story, or treat it as a separate, unannounced build.

## Current state — verified 2026-09-16

- All 6 text-correction files pass `type-check`, `test` (84/84), and `lint` — re-run immediately
  before writing this handoff, all clean.
- All 11 albums have a populated `redacted/` folder with metadata stripped and a re-verified
  (8-bit) contact sheet. Spot-verified several redaction boxes pixel-by-pixel after applying —
  one (`p1800-red-2026-09/IMG_1615.jpg`) needed a second, wider pass after the first box left a
  sliver of the plate exposed; re-verified clean after the fix. Treat this as a general lesson:
  **an angled/perspective plate needs a generously oversized box**, not a tight one — re-check any
  box that looks "just barely" adequate in a straight-on preview.
- Nothing has been uploaded to R2. Nothing has been written to any `.mdx` file from the new photo
  content or descriptions. No new build page exists for the Volvo 262C.

## What was NOT done

- **No commits.** Everything above is sitting in the working tree / untracked `inbox/`.
- **No R2 upload** of any of the 11 albums' redacted photos.
- **No MDX changes** applying David's new descriptions (Bentley S3 1964, Bentley S3 Continental,
  Pearl White P1800 rewrite, Red P1800, Tonja/Ahmet resto-mod expansion) or the two new chassis
  numbers (BC60 XC, BC66 XA) — these are pure text, no photos needed, and were deliberately held
  back to keep each build's description + photo update as one pass rather than partial edits (see
  `BACKLOG.md` item 5a for the full text of each, already transcribed from David's email).
- **No new Volvo 262C build page** — needs a new slug/MDX file, chassis number is still blank
  (David left it TBC), full description already transcribed in `BACKLOG.md` item 5a.
- **The Porsche SC decision above is unmade** — don't guess at it; ask Ricky or re-read the
  photos yourself against `porsche-356-sc.mdx`'s existing gallery before writing anything.
- **Workshop page has not been updated** with any of the 19 workshop-action photos, despite
  David's specific ask for a usable dog photo — one exists in this album (also two more dog
  cameos turned up unprompted in `bentley-s3-1964-chassis-rebuild` and `p1800-red-2026-09`).
- **`e2e/smoke.spec.ts` still not extended** for any of this — unchanged since every prior handoff
  section below.

## Traps

- **`inbox/` is untracked by design, and is now 1.1GB** — don't `git add -A` near it, and don't
  be alarmed by its size; this matches established project convention for session photo dumps
  (see root `CLAUDE.md`'s Output Folder section). It contains **both** this pass's new albums
  (`*-2026-09` suffixed, plus `db6-pink-2026-09`, `bentley-s3-1964-current`,
  `bentley-s3-1964-chassis-rebuild`, `porsche-sc`, `volvo-262c`, `workshop-action`,
  `p1800-pearl-white-current`, `nec-exhibition`) **and** the original 2026-09-08 batch's folders
  (`bentley-s3-chassis`, `bentley-s3-metalwork`, `db6-pink-aston`, `p1800-candy-underside`,
  `p1800-pearl-white`, `p1800-red`, `p1800-restomod`, `porsche-356sc`) — don't confuse the two
  vintages; the `-2026-09` suffix (or the plainly newer names) marks this pass's work.
- **`p1800-red-2026-09` and `nec-exhibition` were transposed once already** — see item 4 above.
  If either folder's content doesn't match its name, don't assume it's fine; re-check.
- **Every real registration plate found (the Red P1800's own "723 HYK", the pink DB6's own
  "OH OH 7", and every background vehicle's plate) is now redacted in every photo that showed
  it** — if a future pass needs an _unredacted_ original for any reason (it shouldn't), it's in
  each album's `raw/` subfolder, never `redacted/`.
- **This session's redaction-review standard (full manual review of every photo, not just
  detector hits) found real plates the detector's top candidate missed on every single album** —
  if a future batch of photos comes in and someone is tempted to trust `detect.py`'s top-N
  candidates alone to save time, don't; re-read this handoff's "How it was done" section above.
- The `next dev` process noted running in the superseded sections below was **not checked this
  pass** — don't assume it's still up, or still healthy, without a fresh `lsof -i :3000`.

## Next step

1. Decide the Porsche SC question (fold white shell into the existing build, or treat as new)
   before touching that build's page.
2. Write/update the MDX for the six affected builds (Bentley S3 1964, Bentley S3 Continental,
   Pearl White P1800, Red P1800, Tonja/Ahmet resto-mod, Porsche SC) using the descriptions already
   transcribed in `BACKLOG.md` item 5a — apply the two now-known chassis numbers while at it.
3. Create the new Volvo 262C build MDX + slug.
4. Upload the relevant `redacted/` photos to R2 for each build (see `tools/upload-photography.ts`
   or the newer `tools/upload-prototype-assets.ts` pattern used earlier in this project — check
   which is still current before assuming).
5. Wire the new R2 URLs into each build's `heroImage`/`galleryImages` frontmatter.
6. Update the workshop page with a selection of the 19 workshop-action photos, including a dog
   shot.
7. Re-run `type-check`/`test`/`lint`/`build` for `dpm-autobody`, then commit (probably several
   commits — one per build is the established pattern in the git log below) and follow this
   project's normal `develop → staging → main` promotion, per root `CLAUDE.md`.
8. Update `BACKLOG.md` item 5a to move completed sub-items from open to done, per this project's
   own "Implementation Briefs" standard in `MEMORY.md`.

## Open questions

- **Porsche SC — same build or new?** See item 5 above. Photo evidence points toward "same car,
  plus an undocumented second white shell" but this hasn't been put to Ricky or David directly.
- Volvo 262C's chassis number — David left it blank in his email, still needs chasing.
- Red P1800's chassis number — also left blank ("chassis TBC").
- The resto-mod's client pair (a different client from Tonja/Ahmet, two P1800s, show names and
  awards) — still open, unchanged from every prior handoff section below.
- Whether `develop` has been promoted to `staging`/`main` since 2026-09-12 — not checked this
  pass, see "Branch" above.

---

**2026-09-12, later pass — supersedes the update below.** Since that note, a further round of small
content fixes and one real feature (video link cards) landed, all sourced directly from David's
7 September review-meeting transcript (Ricky shared it mid-session). **Status: ready-to-resume,
about to push + deploy.** Nothing blocked, nothing half-applied. Working tree is uncommitted as of
this note — see "Working tree" below — the plan for this exact moment is: commit, push `develop`,
promote through the staircase to `main`.

**Branch:** `develop`. **2 commits ahead of `origin/develop`, not yet pushed**
(`58ed7cd3`, `eaf01cbb` — see the previous handoff section below for what they contain), **plus a
further batch of uncommitted changes** (this pass) about to become a third commit.

**Working tree — uncommitted, about to be committed:**

```
 CLAUDE.md                                                       |  1 +
 docs/standards/security.md                                      |  1 +
 output/sessions/2026-08-26_dpm-autobody-discovery/BACKLOG.md    | 15 +++--
 sites/dpm-autobody/CHANGELOG.md                                 | 15 +++++
 sites/dpm-autobody/CLAUDE.md                                    | 11 ++++
 sites/dpm-autobody/app/workshop/page.tsx                        |  2 +-
 sites/dpm-autobody/components/pages/build-detail-page.tsx       | 72 ++++++++++-
 sites/dpm-autobody/components/pages/home-page.tsx               |  2 +-
 sites/dpm-autobody/content/builds/aston-martin-db6-pink.mdx     |  3 +-
 sites/dpm-autobody/content/builds/p1800-candy-restomod.mdx      | 11 ++++
 sites/dpm-autobody/content/builds/porsche-356-sc.mdx            |  6 +-
 sites/dpm-autobody/lib/content-schemas.ts                       | 17 +++
 sites/dpm-autobody/next.config.ts                               |  9 +-
```

Also still untracked (deliberately, unchanged from every prior pass — see Traps in the superseded
section below): `output/sessions/2026-09/2026-09-08_dpm-autobody-build-out/inbox/`.

## What this pass did (2026-09-12, using David's 7 September meeting transcript)

Ricky pasted the full transcript of his review call with David mid-session. Cross-referencing it
against the live site surfaced both new facts and one correction to a fact this session had
recorded wrong earlier the same day:

1. **"Lead loading and metal finishing" → "Body levelling and metal finishing"** on the workshop
   page (`app/workshop/page.tsx`) — David's own confirmed wording, explained on the call: DPM avoid
   lead loading where they can because it isn't as good as normal filler work. This exact fix had
   been sitting in `BACKLOG.md` since 8 September as "buildable now, no new assets needed" and was
   simply never applied until now.
2. **DB6's front-page coverage was _The Argus_, a real named local newspaper** — not the
   uncertain "car magazine" the earlier transcript fragment ("the cargos... I think it's a
   newspaper, probably") had left ambiguous. Updated on both the homepage's DB6 section and
   `aston-martin-db6-pink.mdx`; removed the now-resolved `sourcingGaps` entry for it.
3. **Added `videoLinks`** (`lib/content-schemas.ts`) — thumbnail cards that link out to YouTube
   instead of embedding, rendered by a new `BuildVideoLinksSection` in `build-detail-page.tsx`.
   Ricky's direction: the resto-mod's three-part restoration video is David's own raw, unedited
   footage (confirmed on the call — "it's not a professional video, it's one that I did"), and a
   straight embed would oversell it; a thumbnail + link sets the right expectation before anyone
   clicks through. Wired into `p1800-candy-restomod.mdx` with the three already-known video ids
   (`8Y2inpQzaJ4`, `RgkayNub9Ms`, `LVfZx4-4HRg`).
   - **Hit a real two-part config gap building this**: YouTube's thumbnail CDN (`i.ytimg.com`)
     needs allow-listing in **two separate places** — CSP `img-src` _and_ Next's own
     `images.remotePatterns` — and they fail differently. Missing from CSP: silent (empty box, no
     console error). Missing from `remotePatterns`: a loud build/runtime error naming the exact
     hostname. Hit both in sequence, fixed both, documented the pattern in both this site's
     `CLAUDE.md` and the platform's `docs/standards/security.md` / root `CLAUDE.md` so the next
     site that adds a third-party thumbnail doesn't rediscover it from scratch.
4. **Porsche 356 SC: confirmed "minor mechanical rebuild"** (Ricky confirmed directly, resolving
   the "might/minor" transcription ambiguity) — updated frontmatter `scopeOfWork` and body copy,
   removed the resolved `sourcingGaps` entry.
5. **Logo vector — confirmed already resolved, no action needed.** This was raised as an open
   question in this session's earlier research, but it turns out to predate this whole build-out:
   commit `c155f47d` (7 September, the same day as the meeting) already replaced the traced
   placeholder with David's real Pixelmator export. Nothing to do here; just corrected the
   session's own understanding.
6. **"262" identified and closed as a non-issue** — Ricky confirmed this was David referring to
   the pink Aston Martin DB6, not a separate unidentified car. `aston-martin-db6-pink.mdx` already
   exists and is live; there is no separate "262" build to chase or create. Updated
   `output/sessions/2026-08-26_dpm-autobody-discovery/BACKLOG.md` (both mentions) to record this
   and stop it resurfacing as an open item in future.
7. **Drafted (not sent) an outstanding-actions email to David** — conversational output only, not
   saved to a file anywhere. Final version asks for: workshop action photos; the specific facts
   behind every live `sourcingGaps` amber notice (Bentley S3 1964 chassis, Bentley S3 Continental
   chassis, Jaguar Sea Green's chassis/hours/actual current status, the resto-mod pair's second car
   and awards, the Pearl White singer's name); and a general fact-check pass. If this needs
   resending or Ricky wants it saved somewhere, it isn't currently in any tracked file — reconstruct
   from this session's own conversation if needed, or ask Ricky whether he sent it as-is.

**One important correction made mid-session, worth flagging so it isn't undone by mistake:**
Ricky initially thought the "client rebuilt the car himself, hated it, and sold it quickly" story
(from the transcript) belonged to the Jaguar Sea Green build, which would have meant that build
needed the same "insufficient info, pull it" treatment as Aston Martin T. Green. **Ricky confirmed
after re-reading that this story is actually about T. Green** (already removed from the site,
correctly) **and is unrelated to the Jaguar Sea Green**, whose actual current status (finished vs.
still in the workshop) remains a genuinely open `sourcingGaps` item — do not resolve it based on
the T. Green story; they are two different cars.

## Current state — verified 2026-09-12 (this pass)

- `npx tsx scripts/validate-content.ts` → 10/10 valid.
- `pnpm --filter dpm-autobody run type-check` and `run lint` → both clean.
- A full `pnpm run build --webpack` (from `sites/dpm-autobody/`) → all 23 routes generate,
  including all 10 build pages.
- Visually verified in a real browser: the resto-mod's video-link cards render real YouTube
  thumbnails (paint booth, "VOLVO RESTORATION PART 2" title card) with a play-button overlay, and
  link out to the correct three video ids (checked via
  `[...document.querySelectorAll('a[href*="youtube.com/watch"]')].map(a => a.href)` in-page,
  not just by eye); DB6's "front page of _The Argus_" renders correctly, italicised; workshop
  page's "Body levelling and metal finishing" confirmed live via `curl`.
- **A local `next dev` process is running on port 3000** (PID 46030 at the time of this note) —
  check `lsof -i :3000` before assuming the port is free.

## What was NOT done

- **Nothing from this pass is committed yet.** The plan, per Ricky's own instruction that prompted
  this handoff, is: commit → push `develop` → promote through the staircase to `main`. If this
  session ends before that completes, the working-tree diff above is the record of what's
  uncommitted — do not lose it to an unrelated `git checkout`/`git reset`.
- **The email to David has not been sent** — it was drafted conversationally and Ricky approved
  the final wording, but sending it is Ricky's own action, outside this codebase.
- **All the `sourcingGaps` facts the email asks for are still genuinely open** — Bentley S3 1964
  chassis, Bentley S3 Continental chassis, Jaguar Sea Green (chassis + hours + actual status),
  the resto-mod pair's second car + awards, the Pearl White singer's name. Do not fill any of these
  in without an actual reply from David.
- **Workshop action photos** (welding/metalwork atmosphere shots, not tied to one build) — asked
  for in the email, not yet received or wired into the workshop page.
- **The broader outstanding-actions list synthesised earlier this session** (from `BACKLOG.md`,
  `open-questions.md`, `interview-david.md`) is still mostly open — Halcyon naming permission,
  DNS/domain control for `dpmautobody.co.uk`, the actual photography commission (daylight hero
  shots, macro under raking light), RP Automotive Photography's NEC 2023 licence, footage inventory
  from David's brother, `e2e/smoke.spec.ts` coverage for the 8 newly-built routes. None of these
  came up in the 7 September transcript specifically, so none were resolved by this pass.

## Traps

- **`interview-david.md`'s formal fact-by-fact verification standard is no longer the operating
  assumption.** David directly told Ricky on the call that he likes the storytelling/narrative
  license in the copy ("I quite like how you worded stuff... it sounds more professional"). Don't
  re-flag the P1800 Candy "log" section's invented-but-plausible staff quotes as a problem needing
  a formal interview — that concern was raised and explicitly withdrawn earlier this same session
  after Ricky shared the transcript. The specific facts still tracked as `sourcingGaps` are a
  different, narrower category (concrete details like chassis numbers) — those remain real gaps.
- **"Aston Martin T. Green" and "Jaguar — Aston Martin Sea Green" are two unrelated builds** that
  merely share the words "Aston Martin" — one because a client named/initialled "T. Green" owned a
  real Aston Martin (removed from the site, insufficient info), the other because a Jaguar was
  resprayed in a paint colour licensed from Aston Martin's own palette. See the correction note
  above — this has already caused one mix-up this session; don't let it cause another.
- **Dynamic Tailwind class strings don't compile** — caught and fixed live while building
  `BuildVideoLinksSection`: an initial `` `sm:grid-cols-${n}` `` template literal compiled to zero
  CSS (Tailwind's scanner needs a complete literal class name, not a runtime-interpolated one —
  same class of bug as the platform's documented `min-[Xrem]:` gotcha). Fixed with a static
  `Record<number, string>` lookup instead. If a future grid/column count needs to vary by data,
  copy that lookup pattern rather than interpolating directly.
- **`pnpm run build` (a manual production build) run while `next dev` is also running against the
  same `.next` directory reliably corrupts the dev server's cache**, throwing
  `ENOENT: routes-manifest.json` on every route until the dev server is restarted. Hit this
  multiple times across this session. If a build is needed for verification, expect to restart
  `next dev` afterward — this is not a new bug, just a recurring friction worth remembering.

## Next step

1. Commit this pass's working-tree diff (see "Working tree" above).
2. Push `develop`, watch its CI (`gh run watch`).
3. Merge `develop` → `staging`, push, watch its CI (three workflows: CI, E2E Tests, Regression
   Watchdog).
4. Open the PR `staging` → `main` (`main` is protected — never push it directly). Do not merge it
   automatically; report the PR URL. (Ricky has, in this same session on prior rounds, then asked
   for it to be merged once checks were green — confirm current instruction rather than assuming
   silence means merge.)
5. Once deployed: send the drafted email to David (Ricky's own action), and chase the remaining
   `sourcingGaps` facts and workshop photos it asks for.

## Open questions

Unchanged from the previous handoff pass, still outstanding:

- Pearl White P1800 — the singer's name (David couldn't recall it on the 7 September call either;
  Ricky may decide to just drop the detail if it never surfaces).
- The resto-mod's client pair — the second car and both cars' show names/award placings.
- Bentley S3 1964 — chassis number.
- Bentley S3 Continental — chassis number.
- Jaguar Sea Green — chassis number, hours of labour, and its actual current status (completed vs.
  still in the workshop — genuinely unresolved, see Traps above for what NOT to assume).
- Pink Aston Martin DB6 — confirm current race status (still "due to race again"?) and the
  pre-crash livery shown in its photos (inferred from the photo set, never stated outright).

Resolved and no longer open (see "What this pass did" above for detail): the logo vector question;
"262"; the Porsche 356 SC "might/minor" wording; the DB6 magazine/newspaper name; the Jaguar Sea
Green / T. Green story mix-up.

---

# Superseded — earlier 2026-09-12 update (still accurate as history)

**Status:** ready-to-resume. Every library build now has a real page; the only remaining work is
chasing David for the facts already flagged as `sourcingGaps`, then promoting `develop` →
`staging` → `main`. Nothing is blocked, nothing is half-applied.
**Branch:** `develop`. **5 commits ahead of `origin/develop` — not pushed.** Also 5 commits ahead
of both `staging` and `main` (all unmerged past `develop`).
**Working tree:** clean except `output/sessions/2026-09/2026-09-08_dpm-autobody-build-out/inbox/`
(untracked, deliberately — see Traps, unchanged from the prior handoff).
**Local dev server:** a `next dev --webpack` process is still running on `localhost:3000`
(confirmed via `lsof -i :3000`, PID 18275 at the time of this note). Kill it or reuse it; it is not
required for anything, just left running from this session's browser verification.

This supersedes the previous version of this file (everything below "What this is trying to
resolve" through "Open questions" describes the R2-upload/video-resolution pass from earlier the
same day, 2026-09-11 — still accurate as history, but the current state has moved well past it).

## Commits this session, in order (none pushed at the time this section was written)

```
cb219454 fix(dpm-autobody): remove duplicate P1800 pair lot, lighten build hero images
2853a326 fix(dpm-autobody): remove duplicate P1800 pair lot, lighten build hero images
22f7b80d feat(dpm-autobody): give every build a real page, flag missing facts, swap homepage No. 03
19461e8d fix(dpm-autobody): merge Rare Volvo and Pearl White P1800 into one build
c2708722 docs(dpm-autobody): expand build-out handoff with full R2 upload verification
```

(`2853a326` and `cb219454` share a commit message — an artifact of `git rm` pre-staging the
deletion before the rest of the change was ready; `2853a326` is just the `p1800-pair-one-client.mdx`
delete, `cb219454` is the library/schema/hero-brightness follow-up. Both are real, neither is a
mistake to squash away, just note it so it doesn't look like a duplicate accident.)

**Since this section was written, these commits were pushed and promoted all the way to `main`**
(PR #79), and two further rounds shipped the same way: `d24464c1` (nav link + plaque wording) and
a batch containing `58ed7cd3`/`eaf01cbb` (legal pages, 404 page, hamburger menu, homepage image
consistency, closing link, menu socials) — the latter two are what's "2 commits ahead of
`origin/develop`" in the top section of this file, still unpushed as of this note.

## What this session did (2026-09-12, in order) — see git log for exact diffs

1. Merged the "Rare Volvo" and Pearl White P1800 library entries into one (`19461e8d`).
2. Changed the `/library` page's own hero copy.
3. Gave all remaining builds a real `/builds/[slug]` page (`22f7b80d`) using `BuildDetailPage`'s
   existing thin-content fallback rather than inventing narrative.
4. Added a `sourcingGaps` frontmatter field + visible UI notice.
5. Found and fixed a real gap: `bentley-s3-continental.mdx`'s confirmed `video` field was never
   rendered anywhere until this pass added `BuildVideoSection` + widened CSP `frame-src`.
6. Swapped the homepage's No. 03 featured slot from Jaguar Sea Green to the Aston Martin DB6.
7. Removed a duplicate library entry (`p1800-pair-one-client.mdx` — the resto-mod is confirmed as
   one of that pair).
8. Fixed hero image brightness (`brightness-[1.1]` → `brightness-[1.35] saturate-[1.15]`).

Then, in further rounds the same day (each pushed/promoted separately, see above): 9. Header nav's "The Work" → `/library`; removed "rivet"/"riveted" wherever it described DPM's own
plaques (David confirmed: fixed to the chassis, not riveted). 10. Restyled `/privacy-policy`, `/cookie-policy`, and the 404 page — all three were still
base-template's generic scaffold with a real bug (`bg-surface-subtle` falling back to a
near-white default on this all-dark site). 11. Replaced the mobile nav's scroll-triggered "Contents" pill with a real hamburger menu; moved
the phone number into it; added social icons. 12. Removed the Bentley S3 Continental's small "whole car" establishing shot on the homepage
(a genuine one-off in the approved prototype, but inconsistent in size vs. the other three
cars); changed the homepage's closing link to "See even more of our work" → `/library`.

## Current state — verified 2026-09-12 (this section's original pass)

- 10 build MDX files, all `pageStatus: built`, `validate-content.ts` → 10/10.
- `type-check`, `lint`, and a full `build --webpack` all passed clean after every change.
- Visually verified in a real browser at each step (homepage, library, several build pages, the
  mobile hamburger menu's open/close/nav-click behaviour, the legal pages, the 404 page).

## What was NOT done (at the time this section was written — see top of file for what's since moved)

- Nothing had been pushed. All 5 commits then existed only locally.
- Nothing had been merged into `staging` or `main`.
- David's fact confirmations were still outstanding.
- `e2e/smoke.spec.ts` was not extended to cover the 8 newly-built routes — **still true as of the
  top of this file**.

## Traps (from this section's original pass — still true)

- The `BuildDetailPage` hero brightness/scrim fix is shared by all 10 builds, including the two
  flagship pages that already passed a visual-fidelity gate against the approved prototype — not
  re-verified against those two specifically after the brightness change.
- `output/sessions/2026-09/2026-09-08_dpm-autobody-build-out/inbox/` still holds the 10
  `redacted/` photo sets plus `make-contact-sheets.sh`, untracked. Re-pull from the iCloud links in
  `../2026-08/2026-08-26_dpm-autobody-discovery/BACKLOG.md` item 5 if more photos are ever needed.

## Open questions (from this section's original pass — see top of file for what's since resolved)

- Pearl White P1800 — the singer's name.
- The resto-mod's client pair — the second car and both cars' specific show names/award placings.
- Bentley S3 1964 — chassis number still TBD.
- Bentley S3 Continental — chassis number not recorded.
- The "262" build — **resolved, see top of file: this was the pink Aston Martin DB6, already
  live.**
- Porsche 356 SC — **resolved, see top of file: confirmed "minor mechanical rebuild."**
- Pink Aston Martin DB6 — confirm current race status and the pre-crash livery.
- Jaguar Sea Green — resolve the completed-vs-still-in-workshop status contradiction.
