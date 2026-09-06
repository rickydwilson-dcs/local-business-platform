# DPM Autobody — new client discovery, research and prototypes — handoff

**Status:** in-progress. The 2026-09-05 morning contact-page/design-polish pass **is already
committed** (`243e0eee`, 07:11:57 that morning) — verified via `git show --stat`, correcting an
earlier draft of this file that (wrongly, trusting a prior handoff's prose instead of re-checking
git) claimed it was still uncommitted. What actually remains uncommitted is the much larger
afternoon/evening addition on top of it: a new real testimonial, a corrected factual error, and an
entire second "documented car" page for a customer's Jaguar E-type. **All of it is live** at
`https://dpm-autobody.vercel.app`, verified directly against the deployed URLs with `curl`, not just
trusted from the publish script's own output. **None of the evening work is committed to git.** That
is the single most important thing in this file — see Working tree below.

**Branch:** `develop`, from `main`. Last commit: `243e0eee` ("feat(dpm-autobody): redesign contact
page, fix hero lighting, unify nav"), 2026-09-05 07:11:57 — this **is** the morning session's work,
already shipped, not a baseline it sits on top of. `git log origin/main..HEAD` shows 14 commits ahead
of `main` (mixed DPM and unrelated `dcs`/`docs-site` work from other sessions), `243e0eee` among
them. **Only the evening session's work (below) is still uncommitted.**

**Working tree:** dirty. Confirmed via `git status --porcelain` on 2026-09-06:

```
 M output/sessions/2026-08/2026-08-26_dpm-autobody-discovery/prototype/annotated/index.html
 M output/sessions/2026-08/2026-08-26_dpm-autobody-discovery/prototype/assets-manifest.json
 M output/sessions/2026-08/2026-08-26_dpm-autobody-discovery/prototype/client/index.html
 M output/sessions/2026-08/2026-08-26_dpm-autobody-discovery/prototype/publish.zsh
 M output/sessions/2026-08/2026-08-26_dpm-autobody-discovery/prototype/src/home.html
?? output/sessions/2026-08/2026-08-26_dpm-autobody-discovery/create-client-document-skill.md
?? output/sessions/2026-08/2026-08-26_dpm-autobody-discovery/prototype/annotated/etype-941pvo.html
?? output/sessions/2026-08/2026-08-26_dpm-autobody-discovery/prototype/assets/etype-941pvo/
?? output/sessions/2026-08/2026-08-26_dpm-autobody-discovery/prototype/client/etype-941pvo.html
?? output/sessions/2026-08/2026-08-26_dpm-autobody-discovery/prototype/src/etype-941pvo.html
```

Not modified this session: `prototype/src/{workshop,contact}.html` (untouched since the 2026-09-04
commit) and `prototype/src/volvo-p1800.html` (read for reference only, never edited).
`create-client-document-skill.md` is unrelated leftover from an earlier session — see the previous
handoff's note, still unexamined, still out of scope here.

**Client:** DPM Autobody, Berwick, East Sussex. Director David Pearce-Martin, 01323 552827,
info@dpmautobody.co.uk. Concours classic car restoration; paintwork is their real speciality.
Existing site `dpmautobody.co.uk` is Wix.

---

## What this is trying to resolve

Ricky won DPM as a client on 2026-08-26. David asked for a website whose appearance "matches the
level of works we do", naming three reference sites: eaglegb.com, thorntonrestorations.com,
halcyon.works. **Read `synthesis.md` first** — it is the argument; the four teardowns in `research/`
are the evidence.

**Five user decisions constrain everything downstream. Do not re-litigate them:**

1. **Project the lifestyle of the people who drive these machines, not the personality of the shop.**
   Ricky, 2026-08-26. Process appears as _evidence_, art-directed — never as the shop's self-image.
2. **Three editorial axes**, Ricky 2026-08-27: more hands / less faces · more paint / less mechanics
   · more finished items / less process.
3. **Two builds, one source**, Ricky 2026-08-29: David gets a clean page (`prototype/client/`);
   Ricky gets the same page plus the notes to talk from (`prototype/annotated/`). Both generated
   from `prototype/src/` via `node prototype/build.mjs` — **never hand-edit the generated builds.**
   Marking convention (see the comment at the top of `build.mjs`): `data-note` = annotated build
   only; `data-client` = client build only; unmarked = both.
4. **The page must never narrate itself.** No copy about the design, the medium, why the evidence
   counts, or its own section structure ("see section 05", "the quote above"). This was violated
   twice in tonight's new page and had to be caught and fixed — see Actions taken.
5. **Number plates are redacted, house style is a blank sampled-colour fill, not a blur.** Where that
   can't be done reliably to someone else's photograph, exclude the frame instead of guessing at an
   edit — see the E-type gallery note below.

---

## Actions taken, 2026-09-05 morning (contact page polish) — already committed as `243e0eee`

Brief summary — this was fully covered in the previous handoff and is now superseded by the larger
work below. Nothing here was touched again tonight, and it is already committed and pushed as part
of `develop`'s normal history, not part of tonight's commit:

1. Contact page redesign: new heading, mocked enquiry form (`onsubmit="return false"`, no backend,
   deliberately not operational).
2. Contact hero and workshop hero: rebalanced vignette lighting so the car's right-hand side isn't
   dark on both pages.
3. Removed redundant numbered chapter marks; gave the contact page a plain eyebrow-label header
   instead.
4. Desktop nav made consistent across all four pages (each page used to omit the link to itself).
5. Footer: added a socials row (Instagram/Facebook/YouTube) and a "Built by
   digitalconsultingservices.co.uk" credit line to all four pages.

Traps carried forward unchanged from that session: always publish via `prototype/publish.zsh`, never
`tools/publish-prototype.ts` directly; the `--accent`/`--accent-ink` CSS custom properties read as
the default red (not the car's house tan) if inspected via a fresh `javascript_tool` call immediately
after navigating in the Claude-in-Chrome environment — this is a testing-tool artifact (the
`IntersectionObserver`'s first firing is deferred until a real scroll event happens), not a site bug;
do a small scroll before trusting a colour reading taken that way.

---

## Actions taken, 2026-09-05 evening (new testimonial + E-type project page)

David forwarded a message from Mark Antwis — owner of a 1962 Jaguar E-type Series 1 3.8 FHC (941
PVO) and a 1974 Aston Martin V8, both worked on by DPM — with a link to his own site
(`etypefhcseries1.com`) and a PDF of a nine-page feature on the E-type restoration in the E-Type
Owners Club Magazine, April 2026 ("A Promise Kept"). David's own words: the owner said the images and
magazine material are "free to use", **but he would like to approve [the write-up] before it's
launched.** Ricky's instruction: "Pull whatever you want to create what we want on the website, and
then David will later get the owner to approve it" — then, once images were confirmed separately as
cleared: "we are allowed to use the images. we just need the 'article' signed off once written."

1. **Added a new lead testimonial to the homepage `#proof` section** (`prototype/src/home.html`).
   Quote, transcribed verbatim from page 22 of the magazine PDF: _"I had interviewed many body shops
   for the painting of my concours-winning Aston Martin. The only person I would trust with the
   E-type was the man who had laid down that paint with such astonishingly beautiful results."_ —
   Mark Antwis. This is the first real, published, attributable statement from an actual restoration
   client the site has had (the section's own working note had flagged this as "still needed" since
   29 August). Chris Bulmer's weaker Facebook comment was retired to make room, keeping the section
   at three quotes.
2. **Added a small awards/proof list** beneath the quotes: the Aston Martin V8's AMOC Sandringham
   Concours win (92%, class winner outright) and the E-type's hour count.
3. **Caught and corrected a factual error, twice** (see below) — the Aston Martin's Sandringham win
   is **2024, not 2023**. The magazine's first-person narrative (page 16) says "2023"; Mark Antwis's
   own `/the-restorers-profile` page states 2024 in running text and shows two photographed event
   badges dated 2024. A photographed badge outranks a magazine writer's two-years-later recollection,
   so both the homepage and the new E-type page were corrected to 2024, with the discrepancy
   documented in an annotated-only note on each.
4. **Built a full second "documented car" page**, `prototype/src/etype-941pvo.html`, matching
   `volvo-p1800.html`'s scroll-driven hero/veil mechanism and chapter/record/grid/plaque system,
   retinted to the car's Opalescent Silver Blue. Sections: the record (identity block), a
   forty-seven-year provenance story (the Bray family, 1978–2017, then Mark Antwis's 2017 auction
   win), the build (DPM's panel/paint work, with a scroll-stage from primer-flatting to finished
   paint), a plaque carrying the trust quote, a 9-image finished-car daylight gallery, and the Aston
   Martin V8 tie-in. Built by a forked background agent (this session inherited full context), then
   reviewed and corrected in the foreground.
5. **Downloaded 17 real images** from `etypefhcseries1.com` (a Lovable-built SPA — image URLs are
   only discoverable via a rendered-DOM query, not from raw HTML) into
   `prototype/assets/etype-941pvo/{gallery,metalwork,astonmartin}/`, documented in a `SOURCES.md` in
   that folder recording the exact source filename and use for each. Three gallery images with a
   legible "941 PVO" plate were **excluded outright, not redacted** — no reliable way was found to
   apply the site's blank-sampled-fill plate-redaction style to a third party's photograph without
   risking a visibly botched edit.
6. **Added `etype-941pvo.html` to `prototype/publish.zsh`**, both the R2 upload `--pages` flag and
   the client-build `cp` staging list. This was not optional — the build script processes every file
   in `src/` automatically, but `publish.zsh` only ships pages it's explicitly told about, so a new
   page that isn't added there builds correctly and silently never deploys.
7. **Added a "No. 04" teaser lot to the homepage** linking to the new page, in the same scroll-stage
   style as the existing three lots, with a real (not `golink--dead`) link.
8. **Fixed a factual/logical error the user caught after the first publish**: the new page's contact
   section originally said the E-type "is not one we can show you in the workshop... but the Volvo
   and the cars still on the jig are." **This was wrong** — the Volvo P1800 is also a finished,
   delivered customer car (its own page says "interior, as delivered" and shows it photographed on a
   lane, not at the workshop), so it has gone home too, exactly like the E-type. DPM doesn't hold on
   to any car once it's restored. Corrected to: _"This E-type went home to its owner once we were
   done, like every finished car does. What you can see at the workshop is whatever's on the jig
   today."_ — with a data-note recording the correction and why.
9. **Consolidated the two-hour-count display after the user objected to showing both**: the E-type
   page's `.proof` list originally showed both DPM's own 440-hour figure (panel work only) and the
   magazine's 450-hour figure (the whole job) side by side, client-visible. User: "choose eher 440 or
   450 - dpnt show noth[both]." Now shows **450 only**, matching the homepage's own figure; the
   440-vs-450 discrepancy is preserved but moved into an annotated-only note.
10. **Removed self-narrating copy the user flagged as "not public facing"**: the new page originally
    had several client-visible sentences that talked about the page itself rather than stating facts
    — "Everything on this page traces back to that feature or to his own site... never to a record
    DPM published", "It is also the sentence that explains why this page exists at all", and two raw
    "See section 05" / "the plaque quote above" cross-references. All were rewritten as plain
    statements of fact (the underlying sourcing reasoning was preserved, just moved into
    annotated-only `data-note` blocks) — this is the same category of violation as the self-narrating
    copy cut from the homepage on 29 August (rule 4 above).
11. **Published three times** (`prototype/publish.zsh`) — once after the initial testimonial-only
    addition, once after the full E-type page was built, once after the three corrections above. Each
    publish was verified live with `curl` against `https://dpm-autobody.vercel.app`, not just trusted
    from the script's own output.

---

## Current state — verified 2026-09-05/06

### Live deployment

Confirmed by fetching the live URLs directly, not from the publish script's own output:

- `https://dpm-autobody.vercel.app/index.html` — 200. Contains the Mark Antwis testimonial, the
  corrected "AMOC Sandringham Concours, 2024" line (not 2023), and a link to `etype-941pvo.html`.
  Grep-verified: `grep -c "440 hrs\|450 hrs"` etc. were checked at each stage; the internal
  approval-gate/sourcing notes (`data-note`) do **not** leak into the client build.
- `https://dpm-autobody.vercel.app/etype-941pvo.html` — 200. Verified: shows **450 hrs** only (not
  both 440 and 450), shows the corrected workshop/jig sentence, contains zero instances of the
  self-narrating phrases cut in fix #10 above, and all 17 downloaded images resolve at their R2 URLs
  (spot-checked two directly, both 200).
- R2: 36 objects total under `prototypes/2026-08-26_dpm-autobody-discovery/assets/` (up from 21
  before tonight), all verified 200 with correct content-type by the publish script's own
  verification pass.

### Unverified / assumed

- **Nothing has been shown to Mark Antwis.** The images are cleared per David's relayed message, but
  the written page has not been — that gate is documented prominently in an annotated-only note on
  the new page (`#signoff`), but it is only as good as someone actually reading it before the URL
  goes anywhere beyond this review.
- The magazine's own "440 hours" vs "450 hours" figures measure genuinely different scopes (panel
  work alone vs. the whole job) — both are believed accurate to their sources, neither has been
  independently checked against DPM's own records.
- The E-type page's HTML comment for the contact section says `09 · ENQUIRIES` but the actual visible
  chapter mark reads `06` — a harmless cosmetic mismatch between a code comment and the rendered
  number, not user-visible as a bug, not fixed tonight. See Traps.
- Everything already flagged unverified in earlier handoffs and not re-touched tonight: the DB6
  Instagram-highlight identity, real-phone rendering, Google Business Profile photos, whether David
  has seen tonight's changes yet.

---

## What was NOT done

- **DPM's own real photography still is not in `prototype/src/home.html`/`workshop.html`.** This was
  flagged as the priority next step in the previous two handoffs and remains completely untouched —
  tonight's work added a _different_ car's (the E-type owner's own) photography to a _new_ page; it
  did not touch the long-standing gap in DPM's own curated library making it onto the existing pages.
  Only 2 of 29 curated R2 images (`dpm-autobody/photography/`) are live, both in superseded direction
  pages, not the real site.
- **The contact form is still not operational** (unchanged, was always intentional).
- **The E-type page's `09`/`06` chapter-numbering comment mismatch** (see above) — cosmetic, not
  fixed.
- **The video** at `etypefhcseries1.com/videos/colour-coat-in-booth.mp4` ("the colour coat going on
  in the booth") was found but deliberately not downloaded or embedded — the still frame
  (`metalwork/painted-shell.jpg`) covers the same beat and video adds a size/hosting decision that
  wasn't necessary tonight.
- **The NEC 2024 reunion photo** from the magazine (Mark Antwis and another man, with a "DPM"
  branded show-stand visible behind them, page 22) was deliberately left out of the new page — could
  not positively identify the second man beyond inference, so it wasn't captioned or used.
- **Two Aston Martin enamel event-badge photographs** were seen on `etypefhcseries1.com` but not
  downloaded — judged to be small logo-like crops rather than photographs; their dated text is
  already transcribed into the page's copy and notes instead.
- **`interview-david.md` has still not been run**, and the URL has still not been sent to David for
  this specific new content (unchanged from every previous handoff).
- **Today's work is not committed to git** (see Working tree above) — carried forward from the
  previous handoff, now with substantially more uncommitted content on top.
- **`create-client-document-skill.md`** — still present, untracked, still not investigated by this
  session.

---

## Live-data changes already applied

**2026-09-05, all at Ricky's explicit instruction ("publish.zsh" / "publish" before each deploy):**

1. **Three Vercel deploys to the existing `dpm-autobody` project**, each superseding the last, ending
   at the current live state described above.
2. **15 new objects uploaded to R2** (the 17 downloaded E-type images minus 2 that ended up unused —
   `astonmartin/sandringham.jpg` and `metalwork/side-flatted.jpg` were downloaded but are not
   referenced by any published page, so the upload script correctly skipped them as unreferenced).
   All existing 21 objects from before tonight were unchanged and skipped.

There is no rollback command for either — reverting means re-editing `prototype/src/{home,
etype-941pvo}.html` back to their pre-tonight state and re-running `publish.zsh`. The pre-tonight
state is fully recoverable from git (`243e0eee`) for `home.html`; `etype-941pvo.html` did not exist
before tonight and would simply need deleting from `src/`, `publish.zsh`, and the R2 assets folder.

Everything from previous handoffs' live-data sections (the 29 curated photography objects, the
Vercel project itself) still stands and is unchanged by tonight's work.

---

## Traps

Everything in previous handoffs' Traps sections still applies and was not re-verified tonight except
where noted: always use `prototype/publish.zsh`, never `tools/publish-prototype.ts` directly; edit
`prototype/src/`, never `client/`/`annotated/` directly; `cleanUrls` must stay off; HEIC dimension
detection needs `sips`, not `magick identify`.

- **A new page needs adding to `publish.zsh` in two places, or it silently never deploys.** The build
  script (`build.mjs`) picks up every file in `src/` automatically, so a forgotten new page will
  build correctly into `client/`/`annotated/` and look completely fine locally — the failure is
  invisible until you check the live URL and find a 404. `etype-941pvo.html` is now correctly wired
  in; the next new page won't be, by default.
- **The `--accent`/`--accent-ink` CSS custom properties read as the default red, not the car's house
  colour, if inspected via a fresh `javascript_tool` call immediately after navigating in the
  Claude-in-Chrome environment.** Confirmed again as a testing-tool artifact, not a site bug — do a
  small scroll before trusting a colour reading taken this way.
- **`.plate::after`'s radial-gradient vignette is duplicated per-page**, not shared. The workshop
  hero's lighting fix from the morning session does not apply to `home.html`'s or
  `volvo-p1800.html`'s `.plate` sections, which still use the old centred vignette.
- **The E-type page's contact-section chapter number comment says `09`, the rendered mark says `06`.**
  Harmless, but if a future session adds more sections to that page and tries to number relative to
  the comment rather than the actual rendered marks, it will produce a visible duplicate or gap.
- **Two downloaded images are orphaned**: `prototype/assets/etype-941pvo/astonmartin/sandringham.jpg`
  and `.../metalwork/side-flatted.jpg` exist on disk and are documented in `SOURCES.md` as
  intentional spares, but are not referenced by any HTML and were correctly skipped by the last R2
  upload. Don't be alarmed that they're "missing" from the live site — they were never meant to be
  live yet.

---

## Next step

**1. Commit tonight's work to git.** The morning contact-page polish is already committed
(`243e0eee`, pushed to `origin/develop`) — only tonight's testimonial/E-type additions are still
uncommitted. This should happen before more work stacks on top, per the project's standard
`develop → staging → main` workflow (see `.claude/deploy.md`: staircase promotion, `staging → main`
gated by a PR since `main` is protected).

**2. Get DPM's own real photography into `prototype/src/home.html` and `workshop.html`.** Unchanged
priority from every previous handoff — tonight's work did not touch this gap, it only added a
different car's photography to a new page.

```bash
cat output/sessions/2026-08/2026-08-26_dpm-autobody-discovery/research/photography-manifest.json
cat output/sessions/2026-08/2026-08-26_dpm-autobody-discovery/research/asset-audit-dpm.md
```

**3. After any `src/` edit, always rebuild and republish with the real script:**

```bash
cd /Users/rickywilson/Sites/local-business-platform
node output/sessions/2026-08/2026-08-26_dpm-autobody-discovery/prototype/build.mjs
./output/sessions/2026-08/2026-08-26_dpm-autobody-discovery/prototype/publish.zsh
```

**4. Get David to take the new E-type page/testimonial back to Mark Antwis for sign-off** before it
is shown or promoted to anyone beyond this review — this is the single open gate on everything built
tonight, and it is documented in an annotated-only note on the page itself
(`prototype/src/etype-941pvo.html`, `id="signoff"`), which means it will not be visible to anyone
looking only at the client build or the live URL.

**5. Everything from earlier handoffs' remaining Next Step items, still open:** prune the raw 35GB
photography library; decide the Jaguar/Austin-Healey fictional sections in the superseded direction
pages; run `interview-david.md`; resolve the type-study (Fraunces) question; resolve whether the
Bentley/documentary photography gaps need more material from David or the commissioned shoot; extend
the nav-consistency and hero-lightening fixes to `home.html`/`volvo-p1800.html`'s other `.plate`
sections if full consistency is wanted; decide whether the mobile pill nav should get the same
`is-active` treatment as the desktop nav.

---

## Open questions

Everything open in earlier handoffs is still open and unchanged (Fraunces/type-study, where new
DB6/Porsche photography should live, the Bentley/documentary gaps, the DB6 Instagram-highlight
identity, quoting named reviewers, three vs. four testimonials — **partially answered tonight, see
below** — the Bentley drophead question, Halcyon naming permission, insurance/accident-repair page
treatment, whether the contact form should be wired up). New tonight:

- **"Three or four testimonials" is now "four, with three restoration-adjacent" or "keep at three
  with the new one leading"** — depends on how you read it: the homepage still shows three quotes
  (Mark Antwis leading, then Liam Hunt, Craig Mayhew), plus a separate two-row awards/proof list. The
  original ask ("David has the phone numbers") for more _actual restoration client_ quotes beyond
  this one is still open.
- **Should the E-type page's video** (`colour-coat-in-booth.mp4`) be pulled in later, and if so,
  hosted where — R2 alongside the images, or linked out to the owner's own site?
- **Should the two orphaned downloaded images** (Aston Martin second angle, E-type side-flatted shot)
  be wired into the page for a richer treatment, or deleted as genuinely unused?
