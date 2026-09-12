# DPM Autobody build-out — handoff

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

## Commits this session, in order (none pushed)

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

Everything from `46f0ad91` back (the R2 photo upload, the Bentley video credit) was already pushed
and described in the superseded handoff content below — unchanged.

## What this session did (2026-09-12, in order)

1. **Merged the "Rare Volvo" and Pearl White P1800 library entries into one** (`19461e8d`) — the
   approved prototype's `library.html` had them as two separate rows (No. 11 "Volvo, model to be
   confirmed" / No. 12 "Pearl White"), but Ricky confirmed they're the same car. Removed
   `volvo-tbc.mdx`, folded its singer-owned-it note into `p1800-pearl-white.mdx`'s `scopeOfWork`,
   dropped `app/library/page.tsx`'s `LIBRARY_ORDER` from 12 slugs to 11. Also resolved the
   "1,300 hours" question flagged in the prototype's own caution note — Ricky confirmed with David
   that Candy Red, Red P1800, and Pearl White are three genuinely separate totals, not one figure
   copied across builds; no content change needed for that part.
2. **Changed the `/library` page's own hero copy** — "Every car that's passed through the
   workshop." → "Some of the cars that have passed through the workshop.", and removed the
   subtitle paragraph beneath it entirely, per Ricky's direction.
3. **Gave all remaining builds a real `/builds/[slug]` page** (`22f7b80d`) — before this pass,
   only `p1800-candy` and `etype-941pvo` had `pageStatus: built`; the other 9 had frontmatter only
   and 404'd. Added `heroImage`/`galleryImages` (real R2 URLs from the prior session's 106-photo
   upload) and a short MDX body to each, then flipped `pageStatus` to `built`. Did **not** invent
   narrative content: the 9 thin builds rely on `BuildDetailPage`'s existing fallback path (a
   build with no `- **Label:** value` list in its body gets an auto-generated "The record" fact
   panel from frontmatter, and a flat `galleryImages` array gets an automatic trailing photo grid)
   — this fallback already existed in the component, it was just never exercised until now.
4. **Added a `sourcingGaps` frontmatter field + visible UI notice** (`lib/content-schemas.ts`,
   `components/sourcing-gap-notice.tsx`) — an array of short strings rendered as an amber "Needs
   sourcing from David" callout on both the library card and the build page. Replaces the previous
   pattern of leaving a fact silently blank or burying a caveat in a code comment.
5. **Found and fixed a real gap**: `bentley-s3-continental.mdx` has carried a confirmed `video`
   field (YouTube id, confirmed by David 2026-09-08) since before this session, but nothing in
   `BuildDetailPage` ever rendered `fm.video` — the confirmed credit was invisible even once the
   page existed. Added `BuildVideoSection` (a `youtube-nocookie.com` embed) and widened
   `next.config.ts`'s CSP `frame-src` to allow it — a plain `youtube.com`/`youtu.be` iframe is
   silently dropped by CSP with no visible error, same class of bug the root `CLAUDE.md` already
   documents for other embeds.
6. **Swapped the homepage's No. 03 featured slot** from Jaguar Sea Green to the Aston Martin DB6
   ("the pink one") — Ricky's direction: DB6 is a finished, delivered car, so it belongs in the
   "Finished and delivered" framing No. 01/02 use, not the "still in our hands" framing Jaguar Sea
   Green had. Jaguar Sea Green is still a library build, just no longer one of the homepage's four
   featured cars. Rewrote the section's prose (facts only — crash, in-house door, pink respray at
   owner's request — no invented detail) and picked macro/resolve photos from the DB6 album.
7. **Removed a duplicate library entry** (`2853a326`/`cb219454`) — `p1800-pair-one-client.mdx`
   described "two P1800s, one client, both won show awards" as its own lot, but Ricky confirmed the
   resto-mod (`p1800-candy-restomod.mdx`, chassis 23925) is one of that pair — i.e. it was
   double-listing a car already catalogued on its own. Deleted the duplicate file and its
   `LIBRARY_ORDER` row; folded the pair/award fact into the resto-mod's own `sourcingGaps` instead.
   **The second car in the pair is still not identified** — see Open questions.
8. **Fixed hero image brightness** (`cb219454`) — `BuildDetailPage`'s shared top-hero filter
   (`brightness-[1.1]`) and scrim gradients were tuned against the two flagship pages'
   professionally lit prototype photography. Applied to the other builds' real, un-curated
   workshop snapshots, Ricky found the car itself hard to make out. Bumped to
   `brightness-[1.35] saturate-[1.15]` with lighter scrim opacities (see the inline comment at the
   hero in `build-detail-page.tsx`).

## Current state — verified 2026-09-12

- **10 build MDX files exist, all `pageStatus: built`** — confirmed by
  `ls sites/dpm-autobody/content/builds/*.mdx | wc -l` → 10, and
  `npx tsx scripts/validate-content.ts` → `10/10 valid`.
- **`app/library/page.tsx`'s `LIBRARY_ORDER` lists exactly those 10 slugs**, confirmed by reading
  the file directly (not assumed from the count matching).
- **`pnpm --filter dpm-autobody run type-check`, `run lint`, and a full `run build --webpack`** all
  passed clean after every change in this session, run repeatedly as changes landed — most recently
  after commit `cb219454`.
- **Visually verified in a real browser** (Claude in Chrome, not just curl 200s): homepage's No. 03
  slot shows the finished pink DB6 with correct copy and a working link to
  `/builds/aston-martin-db6-pink`; the DB6, Porsche 356 SC, and Bentley S3 1964 build pages all
  render their hero image, the "Needs sourcing from David" notice (where set), the auto-record
  fact panel, and the trailing photo grid; `bentley-s3-continental`'s video embeds and plays
  (thumbnail confirmed loading, "DPM TV: 1963 BENTLEY S3 CONTINENTAL RESTORATION"); the thinnest
  page (`p1800-pair-one-client`) was screenshotted **before** its removal and degraded gracefully
  with no `heroImage` (plain dark hero, sourcing notice, no broken layout) — that page no longer
  exists, but the fallback behaviour it exercised is unchanged and still used by other thin builds.
  The library page's No. 02 (resto-mod) row was re-verified after the pair-lot removal and shows
  the folded-in sourcing note correctly; No. 04 (the duplicate) no longer appears.
- **An apparent "hero renders solid black" bug on `bentley-s3-1964` was investigated and ruled out**
  as a stale/mistimed screenshot capture, not a real defect — confirmed by re-screenshotting
  (showed the car correctly), a `zoom` capture of the same region (showed the car correctly even
  when the full screenshot didn't), and a JS-side check of the `<img>` element's `naturalWidth`/
  `naturalHeight`/`complete`/computed filter (all correct). Don't re-investigate this from scratch
  if it resurfaces — re-screenshot first.
- **Not re-verified against a fresh `git clone`** — all checks above ran against this working
  tree, which also has 106 R2-uploaded photos and other artifacts from the prior session's pass
  still present locally in `inbox/` (untracked, not part of the build).

## What was NOT done

- **Nothing has been pushed.** All 5 commits above exist only in this local working tree. A
  connection drop, `git reset --hard`, or a fresh clone elsewhere would lose them entirely — this
  is the single biggest risk in this handoff. Push before doing anything else if resuming
  elsewhere.
- **Nothing has been merged into `staging` or `main`.**
- **David's fact confirmations are still outstanding** — see Open questions. Do not remove a
  `sourcingGaps` entry or fill in a real value without an actual answer from David; several of
  these are marked amber and visible on the live pages specifically so they aren't missed.
- **The second car in the "two P1800s, one client" pair is still unidentified.** Don't guess which
  of the other P1800 builds (Candy Red 26282, Pearl White, Red) it is — none of their frontmatter
  currently names an owner matching Tonja/Ahmet (the resto-mod's confirmed owner/commissioner), so
  there's no data-driven way to infer it. Ricky explicitly said not to worry about which one it is
  for now ("just show the individual cars") — this is tracked as a `sourcingGaps` entry on the
  resto-mod, not a blocker.
- **`e2e/smoke.spec.ts` was not extended** to cover the 8 newly-built routes — it still only checks
  `/builds/p1800-candy` and `/builds/etype-941pvo` per the site's own `CLAUDE.md`. Not attempted
  this session; worth doing before the next promotion if smoke coverage matters for this batch.
- **The DB6's pre-crash livery claim was deliberately left unconfirmed, not stated as fact.** The
  photo album visibly shows a green, rally-liveried car (with "LA CARRERA PANAMERICANA" / "MEXICO
  RALLY" / car no. 335 branding) that is almost certainly this same car before the 2022 crash, but
  that inference was never asserted in the published copy — it's listed as a `sourcingGaps` entry
  instead ("confirm the car's livery immediately before the crash... inferred from the photo set,
  not stated outright in the brief"). Don't upgrade this to stated fact without David confirming it.
- **Jaguar Sea Green's status inconsistency was flagged, not resolved.** Its frontmatter says
  `status: completed`, but the approved prototype's own homepage copy for it says the car is still
  in the workshop ("This car is still in our hands, so its record stops at the paint"). Both can't
  be right. Left as a `sourcingGaps` entry rather than picked one arbitrarily.
- **No attempt was made to reconcile or backfill the DB6's magazine credit or current race status**
  beyond flagging them — both are `sourcingGaps` entries, not resolved.

## Traps

- **Two commits share an identical message** (`2853a326`, `cb219454`) — see "Commits this session"
  above for why; don't assume one is a duplicate/mistake to drop.
- **A `next dev` process is still running on port 3000** from this session's browser verification
  (PID 18275 at time of writing) — a fresh session should check `lsof -i :3000` before assuming the
  port is free, and can kill it or reuse it as convenient.
- **`sourcingGaps` is a plain array of free-text strings, not a structured field-to-gap mapping.**
  Don't try to programmatically match a gap string to a specific frontmatter field — they're
  written for a human to read on the page, not for code to parse.
- **The `BuildDetailPage` hero brightness/scrim fix is shared by all 10 builds**, including the two
  flagship pages that already passed a visual-fidelity gate against the approved prototype
  (`p1800-candy`, `etype-941pvo`). This session did not re-run a fidelity check against those two
  after the brightness change — the prototype's own photography was already well-lit, so the
  higher brightness is unlikely to have hurt them, but this was not visually re-verified for those
  two specific pages. Worth a quick look before the next promotion if fidelity drift on those two
  matters.
- **`output/sessions/2026-09/2026-09-08_dpm-autobody-build-out/inbox/`** still holds the 10
  `redacted/` photo sets plus `make-contact-sheets.sh`, untracked, per the prior handoff's Traps —
  unchanged this session. `raw/`, `thumbs/`, `contact-sheets/`, `shortlist/`, `redact-work/` and
  the album `.zip`s remain deleted; re-pull from the iCloud links in
  `../2026-08/2026-08-26_dpm-autobody-discovery/BACKLOG.md` item 5 if more photos are ever needed
  from these same 8 albums.

## Next step

1. **Push.** `git push origin develop` — nothing from this session exists anywhere but this
   machine right now.
2. **Chase David** for the Open questions below — several affected builds' pages will keep showing
   a visible amber notice to site visitors' eyes only in the sense that it's an obvious editorial
   marker (not literally hidden from real visitors) until these are resolved; decide with Ricky
   whether that's acceptable to ship as-is or whether promotion should wait.
3. **Once ready, run the normal promotion flow**: `develop` → `staging` → `main`, `gh run watch`
   after each push, per this project's git workflow. Nothing from this session has been merged past
   `develop`.
4. Optionally, before promotion: extend `e2e/smoke.spec.ts` to cover the 8 newly-built routes, and
   spot-check `p1800-candy`/`etype-941pvo` against the approved prototype for any fidelity drift
   from the hero brightness change.

## Open questions

- Pearl White P1800 — the singer's (previous owner's) name is still not known.
- The resto-mod's client pair — the second car and both cars' specific show names/award placings.
- Bentley S3 1964 — chassis number still TBD.
- Bentley S3 Continental — chassis number not recorded (not previously flagged as open, surfaced
  during this pass).
- The "262" build — chassis number still pending; may replace the T. Green Aston Martin content in
  the featured set. (Unchanged from the prior handoff — no build file exists for this yet.)
- Porsche 356 SC — confirm the "might/minor mechanical rebuild" wording before publishing.
- Pink Aston Martin DB6 — confirm current race status (still "due to race again"?), the exact
  magazine title that featured it, and (lower priority) the pre-crash livery shown in its photos.
- Jaguar Sea Green — resolve the completed-vs-still-in-workshop status contradiction.

Resolved and no longer open (see the superseded content below and this session's actions for
detail): the chassis 26282 vs. 23925 question; the "Rare Volvo"/Pearl White duplicate; the
"1,300 hours" three-way coincidence.

---

# Superseded — 2026-09-11 R2 upload / video-resolution pass

_(Kept for history; "Current state" above is authoritative. The R2 upload and video-credit work
described here was already committed and pushed as of `46f0ad91`, before this session's work began.)_

**Status:** Photo curation for all 8 BACKLOG.md item 5 albums is done, the Bentley video-credit and
R2-upload commits were pushed to `origin/develop`, and all 106 curated/redacted photos are live on
the public R2 CDN.

## Live-data changes already applied (2026-09-11, still true)

**106 image files were uploaded to the public Cloudflare R2 bucket** (`local-business-platform`,
served at `https://pub-a159d5c51e44442897e06986a53dda1d.r2.dev`) under `dpm-autobody/builds/`. This
is a real write to a shared, publicly-reachable CDN. No rollback command exists; these are the
intended final assets. Full per-file record in `photos-manifest.json` in this session folder,
committed in `46f0ad91`.

| Album                   | R2 path                                                | Files |
| ----------------------- | ------------------------------------------------------ | ----- |
| `p1800-restomod`        | `dpm-autobody/builds/p1800-candy-restomod/`            | 5     |
| `bentley-s3-chassis`    | `dpm-autobody/builds/bentley-s3-1964/chassis-rebuild/` | 20    |
| `bentley-s3-metalwork`  | `dpm-autobody/builds/bentley-s3-1964/metalwork/`       | 12    |
| `porsche-356sc`         | `dpm-autobody/builds/porsche-356-sc/`                  | 18    |
| `db6-pink-aston`        | `dpm-autobody/builds/aston-martin-db6-pink/`           | 24    |
| `p1800-red`             | `dpm-autobody/builds/p1800-red/`                       | 9     |
| `p1800-pearl-white`     | `dpm-autobody/builds/p1800-pearl-white/`               | 8     |
| `p1800-candy-underside` | `dpm-autobody/builds/p1800-candy/`                     | 10    |

All 106 of these URLs are now actually referenced from `heroImage`/`galleryImages` in the
corresponding build MDX files, as of this session — that was the "What was NOT done" gap in the
2026-09-11 version of this handoff, now closed.

## Video work — resolved 2026-09-11 (still true)

1. Candy Red Volvo wrong-video mismatch — confirmed already resolved, no action needed.
2. Bentley finished-car video — added to `bentley-s3-continental.mdx` frontmatter 2026-09-08,
   confirmed by David. **As of this session, it also actually renders on the page** (see above —
   it didn't before).
3. The unedited 3-part resto-mod restoration video (DPM TV, YouTube ids `8Y2inpQzaJ4`,
   `RgkayNub9Ms`, `LVfZx4-4HRg`) — located and confirmed as the resto-mod's own footage, still
   deliberately not wired in (raw/unedited, and `BuildVideoSchema` only supports one video id).
