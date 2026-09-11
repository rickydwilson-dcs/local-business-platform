# DPM Autobody build-out — handoff

**Status:** ready-to-resume. Photo curation for all 8 BACKLOG.md item 5 albums is done. Video work (all 3 items) is now resolved/actioned this session — see "Video work — resolved 2026-09-11" below. Next step is David's outstanding fact confirmations, then real MDX pages.
**Branch:** `develop`. One frontmatter edit made this session (see below) — not yet committed.
**Commits this session:** none yet — `sites/dpm-autobody/content/builds/bentley-s3-continental.mdx` has an uncommitted edit (added the confirmed `video` block). Everything else this session was research only (yt-dlp/transcript pulls into the scratchpad, not the repo).
**Working tree:** the `inbox/` directory from the prior session (untracked, see Traps for exactly what's safe vs. not) plus the one modified MDX file above.

## Video work — resolved 2026-09-11

All three BACKLOG.md item 5 video items actioned this session:

1. **Candy Red Volvo wrong-video mismatch — confirmed already resolved, no action needed.**
   Checked the real site's `sites/dpm-autobody/content/builds/p1800-candy.mdx` (chassis 26282,
   the live page): it has no `video` field and no reference to a "37:32 minute film" anywhere.
   The wrong claim was only ever in the old static prototype (`home.html`/`volvo-p1800.html`,
   fixed there 2026-09-08 per BACKLOG.md) — it was never ported into the real MDX site, which
   was scaffolded later. Nothing to fix.
2. **Bentley finished-car video — added.** `bentley-s3-continental.mdx` (No. 05, the finished
   S3 Continental, distinct from the in-progress S3 1964 at No. 10) now carries
   `video: { id: "JpztIam_ARE", type: "professional" }`, confirmed by David 2026-09-08. This
   exactly matches the fixture already written in
   `lib/__tests__/build-content-schema.test.ts` ("a build with a confirmed video credit — No.
   05"). Verified: `pnpm exec vitest run lib/__tests__/build-content-schema.test.ts
lib/__tests__/content-schemas.test.ts` (49/49 pass) and `npx tsx scripts/validate-content.ts`
   (12/12 builds pass). **Not committed yet.**
3. **The unedited 3-part resto-mod video — located and confirmed, not wired into MDX.** Used the
   `youtube-research` skill (yt-dlp + transcript extraction) against DPM's channel. Found DPM
   TV's "VOLVO P1800 RESTORATION PART 1/2/3" (July 2021 – Mar 2022):
   - Part 1: `8Y2inpQzaJ4`
   - Part 2: `RgkayNub9Ms`
   - Part 3: `LVfZx4-4HRg`

   **Confirmed by transcript, not inference** — part 2's auto-captions, ~17:50: _"we're going to
   dedicate this episode to tonja who is the owner of the vehicle."_ This is Tonja's car — the
   resto-mod, `p1800-candy-restomod.mdx`, chassis 23925 — not the separate `p1800-red.mdx` build
   (worth double-checking against, since both are red/candy P1800s with a documented history of
   mix-ups in this project). Part 3 also confirms bespoke work matching the resto-mod's own
   scope ("single piece bumper" conversion, bespoke trim mods) and that engine/running-gear work
   went to another company — consistent with the resto-mod's frontmatter, which only claims body/
   paint/trim as DPM's own scope.

   **Deliberately not added to `p1800-candy-restomod.mdx` frontmatter**, for two reasons: (a) it's
   raw/unedited footage — BACKLOG.md explicitly says "expect to need editing/trimming, not a
   straight embed," so it isn't publish-ready as-is; (b) `BuildVideoSchema` in
   `lib/content-schemas.ts` only supports a single `id`, not multiple — this is a 3-part series,
   so the schema would need a shape change (array of ids, or similar) before any of this could be
   wired in even as a placeholder. Next step when this build gets a real page: either edit the
   three parts down to one clip first, or extend `BuildVideoSchema` to carry more than one id.

## What this is trying to resolve

Same underlying goal as before: turn DPM Autobody's approved prototype into a real MDX site, with the other 10 library builds needing real photos before they can get real pages. The previous handoff (superseded below) described this as blocked on "iCloud photo pulls, plate-redaction, and David's confirmations." This session did the iCloud pulls and plate-redaction for all 8 albums BACKLOG.md item 5 lists. David's confirmations (chassis numbers, names, wording) are still outstanding — see Open Questions, carried over unchanged.

## What changed since the last HANDOFF.md (2026-09-11, earlier today)

The previous handoff said `develop` had not been pushed. That was stale by the time this session started — `develop` was already pushed and merged into `staging` before this session began (verified via `git log staging..develop` = empty). This session did not touch git at all.

## Actions taken this session

1. Counted photos in all 8 iCloud shared albums from `../2026-08/2026-08-26_dpm-autobody-discovery/BACKLOG.md` item 5 (technique: navigate to the `share.icloud.com` link, read `document.querySelector('iframe').contentDocument.body.innerText` — the count is in plain text, no clicking needed).
2. Downloaded all 8 albums in full (~8,500 photos, ~40GB) into `inbox/<album>/raw/`.
3. Built date-sorted, labeled contact sheets per album (`inbox/make-contact-sheets.sh`, 48 photos/page) to visually triage without opening 8,500 individual images.
4. **Found and fixed a bug in `make-contact-sheets.sh`**: the original file-matching glob (`*.HEIC *.JPG`) was case-sensitive and silently dropped lowercase `.heic`/`.jpg` files. Caught on Red P1800, which was missing 435 of 1442 photos before the fix. Bentley chassis and Porsche 356 SC were unaffected (all-uppercase source files); DB6 lost ~27 photos to this before being caught (not worth re-running given the shortlist was already good — noted as a gap, not fixed).
5. Selected a shortlist per album by eye from the contact sheets, extracted full-resolution originals into `inbox/<album>/shortlist/`.
6. Ran every shortlisted photo through `../2026-08/2026-08-26_dpm-autobody-discovery/tools/plate-redact/` (propose → confirm → apply), visually confirming every image myself (not just accepting detector boxes blindly) and applying `--style blank`. Final output in `inbox/<album>/redacted/`.
7. **Caught the tool being unreliable and adjusted process mid-session**: an early accepted detector box on the resto-mod album left a plate partially exposed after apply — the _screen_ showed a box that looked like full coverage, but the box coordinates it actually recorded didn't match. From then on, verified every redacted plate photo by cropping the **applied output** at full resolution and reading it back, not by trusting the browser screenshot. Fixed under-sized boxes by hand-editing `redactions.json` coordinates directly (measured off the original image with ImageMagick crops) rather than fighting the browser drag UI, which froze the tab outright on Candy underside and Bentley metalwork's final images (had to redo those two reviews from scratch in a fresh tab; the second time round the Candy underside export also produced the same freeze, so its final `redactions.json` was constructed entirely by hand — same measure-and-edit method, verified the same way).

## Current state — verified 2026-09-11 21:25 BST

106 photos total, all shortlisted + plate-checked + GPS-stripped + individually crop-verified, sitting in `inbox/<album>/redacted/`:

| Album                                                 | Source count                     | Shortlisted | Real plates found & redacted                     |
| ----------------------------------------------------- | -------------------------------- | ----------- | ------------------------------------------------ |
| `p1800-restomod`                                      | 5 (David's own curated set)      | 5           | 2 (background vehicle, not the client car)       |
| `bentley-s3-chassis`                                  | 466                              | 20          | 0                                                |
| `porsche-356sc`                                       | 881                              | 18          | 0                                                |
| `db6-pink-aston`                                      | 603 (574 indexed, see bug above) | 24          | 3 (the car's own "OH OH 7" plate)                |
| `p1800-red`                                           | 1442                             | 9           | 1                                                |
| `p1800-pearl-white`                                   | 1646                             | 8           | 0 (car has no bumper/plate fitted at this stage) |
| `p1800-candy-underside` (chassis 26282, already live) | 1418                             | 10          | 3 (the car's own "NYS 727F" plate)               |
| `bentley-s3-metalwork`                                | 2037                             | 12          | 0                                                |

Best finds: **Porsche 356 SC** and **Candy P1800 underside** albums both contain genuine finished-car-in-daylight-away-from-workshop shots — the exact shot type the original discovery audit (`research/asset-audit-dpm.md`) found DPM had none of. DB6 album has a complete before→after arc (crash damage → bare metal → DPM paint booth → finished pink).

## What was NOT done

- **No MDX pages written.** This session was photo curation only, per explicit scope from the resume conversation. Do not start writing build pages from this material alone — see Open Questions below, several facts are still unconfirmed by David.
- **Video work is done as of this session** — see "Video work — resolved 2026-09-11" above. The Bentley MDX edit is uncommitted.
- **DB6 album's case-sensitivity gap was not backfilled.** ~27 lowercase-extension photos were silently excluded from that album's contact sheets before the bug was caught; the shortlist drawn from it is still good, but a full re-triage was not done. Low priority — flag only if the DB6 page ends up needing more material later.
- **Nothing was applied to any live site or MDX file.** All output is local files under `output/sessions/2026-09/2026-09-08_dpm-autobody-build-out/inbox/`.
- **The 106 photos have not been uploaded to R2.** Per this project's convention (`docs/guides/prototype-hosting.md`), real site images need to go through R2, not git — that upload step has not happened.

## Traps

- **`inbox/*/raw/`, `thumbs/`, `contact-sheets/`, `shortlist/`, `redact-work/`, and the album `.zip`s were deleted after this session** (user confirmed, 2026-09-11 ~21:25 BST) — `inbox/` went from ~53GB down to ~307MB, now holding only `redacted/` (the 106 final photos) per album plus `make-contact-sheets.sh`. **If more photos are ever needed from these same 8 albums, they must be re-downloaded from the iCloud links in `../2026-08/2026-08-26_dpm-autobody-discovery/BACKLOG.md` item 5** — there is no local raw copy anymore. Re-downloading all 8 took ~15-20 min total this session; a single album is faster.
- **The redaction working files (`redact-work/review.html`, 0.9–2.9MB each with base64-embedded thumbnails) were part of what got deleted** — this closes the git-tracking risk noted in an earlier draft of this handoff (those `.html` files weren't covered by the binary `.gitignore` denylist). If redaction work resumes on new photos, remember this gap still exists in `.gitignore` for next time.
- **Two DB6 raw filenames collided with duplicate-suffix originals** (`IMG_1029.HEIC` vs `IMG_1029-1.HEIC`, same for 1030/1031, and separately `IMG_3036` in the Candy underside album) — iCloud's own duplicate-naming. If re-pulling these two albums, check both variants exist before assuming which one a thumbnail came from; one wrong pick happened this session (a steering-wheel photo instead of the intended exterior shot in `p1800-candy-underside` — kept anyway since it was still usable) and was not corrected.
- **The `plate-redact` review.html UI is unreliable for anything but very short sessions.** It froze the Chrome tab outright twice near the end of a review pass (Candy underside, Bentley metalwork), both times losing in-progress state and requiring a fresh tab. For any future redaction work, prefer: view the source image directly, measure the plate's pixel bounds with an ImageMagick crop, and hand-write `redactions.json` — it's more reliable than the browser drag UI turned out to be, and it's how the last two albums were actually finished.
- **`make-contact-sheets.sh` in `inbox/` is a working, fixed (case-insensitive) script** — reuse it directly for any further album work rather than rewriting.

## Next step

Video work (all 3 BACKLOG.md item 5 YouTube items) is resolved — see above. Remaining before real
pages can be built:

1. **Commit the Bentley video-credit edit** (`bentley-s3-continental.mdx`) — trivial, just needs a
   commit message and the usual develop → staging → main flow when ready.
2. **David's outstanding fact confirmations** — see Open Questions below, unchanged.
3. **Upload the 106 curated/redacted photos to R2** per `docs/guides/prototype-hosting.md` — not
   yet done (see "What was NOT done").
4. **Write real MDX bodies** for the builds that now have confirmed photos + facts, once (2) and
   (3) are done.

## Open questions

Unchanged from the prior handoff — still outstanding, still blocking real pages for the corresponding builds:

- Chassis number: 26282 (plaque, live P1800 Candy page) vs. 23925 (Tonja/Ahmet's resto-mod) — **this one is actually resolved**, per BACKLOG.md item 5: David confirmed 2026-09-11 these are two different cars, not a transcription error. Not a blocker.
- "Rare Volvo" build — singer's name still needed.
- The two-P1800s-same-client build — show names/awards still needed.
- Bentley S3 1964 (in-progress) — chassis number still TBD.
- The "262" build — chassis number still pending; may replace the T. Green Aston Martin content in the featured set.
- Porsche 356 SC — confirm the "might/minor mechanical rebuild" wording before publishing.
- Pearl White P1800's "1,300 hours" figure — double-check it wasn't accidentally copied from the Red P1800's figure.
- Pink Aston Martin DB6 — currently "due to race again"; confirm current status before publishing.
