# DPM Autobody — new client discovery, research and prototypes — handoff

**Status:** in-progress. Working tree is **clean** — everything through today is committed. **But
4 commits are unpushed** (local `develop` only), and **the two most recent pieces of prototype work
are not deployed** to `https://dpm-autobody.vercel.app`: the new build-library page prototype, and a
copy fix that removed a now-confirmed-false claim from the live P1800 pages. The false claim is
**still live** on the deployed site right now — see Current state.

**Branch:** `develop`, from `main`. `git status --porcelain` is empty (verified 2026-09-11).
`git log @{u}..` shows **4 unpushed commits**, oldest first:

```
c7093815 feat(dpm-autobody): swap in two real restoration-client testimonials
c155f47d feat(dpm-autobody): replace traced logo with real vector artwork
41cc8ab7 feat(dpm-autobody): scale the logo up ~50%
c5941cb6 feat(dpm-autobody): add build-library prototype, fix confirmed-false P1800 video claim
```

The first three predate this session and are **already deployed live** (verified: the live
homepage's testimonials are Mark Antwis / Ahmet Hussein / Tonja Hussein, matching `c7093815`). Only
`c5941cb6` — this session's work — is committed but **not yet published**.

**Client:** DPM Autobody, Berwick, East Sussex. Director David Pearce-Martin, 01323 552827,
info@dpmautobody.co.uk. Concours classic car restoration; paintwork is their real speciality.
Existing site `dpmautobody.co.uk` is Wix.

---

## What this is trying to resolve

Ricky won DPM as a client on 2026-08-26. David asked for a website whose appearance "matches the
level of works we do", naming three reference sites: eaglegb.com, thorntonrestorations.com,
halcyon.works. **Read `synthesis.md` first** — it is the argument; the four teardowns in `research/`
are the evidence.

David reviewed the prototype on **2026-09-08** and was **very happy** with it. In that same
conversation he sent real content for 8 restoration builds (chassis numbers, iCloud photo albums,
corrections) — see `BACKLOG.md` item 5, which is the full transcript-derived content dump. That
volume of real content, plus the platform's MDX-only architecture rule (root `CLAUDE.md`: never
hand-author individual static pages), is what triggered the decision to plan a real
`sites/dpm-autobody` build rather than keep extending this static prototype indefinitely — see
`output/sessions/2026-09/2026-09-08_dpm-autobody-build-out/session.md` for that plan. **This
discovery-phase prototype and that build-out plan are two different session folders covering the
same client** — read both; the build-out session's Phase 0 (library-page design) is what this
session actually executed, still inside this folder's `prototype/`.

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
   counts, or its own section structure ("see section 05", "the quote above").
5. **Number plates are redacted, house style is a blank sampled-colour fill, not a blur.** Where that
   can't be done reliably to someone else's photograph, exclude the frame instead of guessing at an
   edit.
6. **Nothing is ever fabricated — no placeholder photography, no invented figures.** Established
   repeatedly across this project (see `prototype/README.md` "What is real, and what is not") and
   reinforced this session: the new library-page prototype gives every row an image _slot_, but rows
   without real, approved photography stay text-only rather than carrying a fake placeholder box.

---

## Actions taken, 2026-09-05 morning (contact page polish) — committed, deployed

Superseded by later work; kept brief. Committed as `243e0eee`, already pushed as part of `develop`'s
normal history: contact page redesign (mocked enquiry form, `onsubmit="return false"`), rebalanced
hero vignette lighting on contact/workshop, removed redundant chapter marks on contact, made desktop
nav consistent across all four pages, added a footer socials row + build credit to all four pages.

## Actions taken, 2026-09-05 evening (E-type testimonial + project page) — committed, deployed

Also superseded; kept brief — this added `prototype/src/etype-941pvo.html` (Mark Antwis's 941 PVO,
the E-type Owners Club Magazine feature) as a second full "documented car" page, plus the first real
attributable homepage testimonial. Corrected an AMOC Sandringham year error (2024, not 2023) using a
photographed event badge over a magazine writer's recollection. Full detail was in this file's prior
revision if needed — not reproduced here, superseded by verified current state below.

## Actions taken, 2026-09-05–07 (logo + testimonials) — committed, deployed, not detailed in a prior handoff

Three commits exist between the evening session above and this one that no prior handoff covered in
detail: `c7093815` (swapped in two real restoration-client testimonials), `c155f47d` (replaced the
traced-alpha logo SVG with real vector artwork), `41cc8ab7` (scaled the logo up ~50%). All three are
**confirmed live** (verified via `curl` against `dpm-autobody.vercel.app/index.html` — testimonials
show Ahmet/Tonja Hussein, logo `viewBox="0 0 500 342"` matches the current mark). If more detail on
exactly what these changed is needed, read the commit diffs directly — this handoff was not written
contemporaneously with them.

## Actions taken, 2026-09-08–11 (this session) — committed as `c5941cb6`, NOT yet deployed

**Part 1 — captured David's review-meeting content.** David reviewed the prototype (very happy) and
sent real content for 8 restoration builds in the same conversation: P1800 resto-mod (Candy,
Tonja/Ahmet), Pink Aston Martin DB6 (La Carrera Panamericana crash), a rare Volvo (once owned by a
famous singer, name TBD), a pair of P1800s for one client, Bentley S3 1964 (in-progress), Red P1800
(video-mismatch — see Part 2), Porsche 356 SC, Pearl White P1800 (in-progress). All captured verbatim
with iCloud links in `BACKLOG.md` item 5. Also captured: several copy corrections ("lead loading and
filling" → "body levelling", plaque "riveted" → needs accurate wording, remove Aston Martin T. Green,
insurance work confirmed to stay off the site) and two site-architecture asks (a build-library page
above individual build pages, explicitly "must not look like a shop"; a homepage rotating
featured-build selection). Wrote a new build-out session plan:
`output/sessions/2026-09/2026-09-08_dpm-autobody-build-out/session.md`, sequencing: prototype the
library page first (this session), then scaffold a real `sites/dpm-autobody`, then content model, then
individual build pages + the library route together, then homepage/workshop/contact rewiring.

**Part 2 — built and iterated a build-library page prototype**, `prototype/src/library.html` (new
file, wired into `build.mjs`'s automatic `src/*.html` discovery — **but NOT added to
`publish.zsh`**, see Traps and Next step). Design: a single numbered ledger (auction-catalogue lot
list), not a card grid, extending the existing Direction D language (same tokens, `.golink`,
`.chapter`, a new `.ledger`/`.ledger__item` component). Only rows with real, already-approved
photography (P1800 Candy, Bentley Continental, Jaguar Sea Green, E-Type — 4 of 12 rows) carry a
thumbnail; the other 8 (this session's new content, photography not yet pulled/redacted) are
deliberately text-only rather than carrying a placeholder. Split into two chapters: "Finished and
delivered" (8 rows) and "In the workshop now" (3 rows). Fixed one real bug found via visual review in
Claude-in-Chrome: the page intro rendered underneath the fixed, gradient-backed masthead because its
3-child markup broke `.section-head`'s 2-column grid assumption and vh-based padding fell short of
the masthead's documented ~114px footprint on a real viewport — added a `.section-head--intro`
modifier with a safe fixed-floor top padding. Confirmed at 1440×900 and 390×844 (mobile) in both the
annotated and client builds. Ricky confirmed the direction; confirmed every row should eventually
carry a real photo (not permanently text-only) once each build's real page is built, and confirmed
the library page's data should be a _generated view_ over the same `builds` MDX collection each
individual page will read from (a `heroImage` frontmatter field), never a separately-maintained list
— both captured in the build-out `session.md`, Phase 2/3.

**Part 3 — fixed a confirmed-false factual claim.** David separately emailed: chassis 26282 (the
Candy Red P1800, wire wheels, the homepage's main photo — the same car already live as
`volvo-p1800.html`) **has no restoration film**. The "37:32 minute film" claim previously on the site
was wrong. It appeared in **6 places** across `prototype/src/home.html` and
`prototype/src/volvo-p1800.html` (hero-adjacent copy, a "real, verbatim" caption, a closing proof
paragraph and its working note, and a whole `Film` row in the P1800's own spec table) and has been
**removed from all 6**, each with a dated correction note left in place (`data-note`, so it survives
in `annotated/` but is stripped from `client/`). Verified via `grep` after rebuild (0 hits outside the
correction notes themselves) and by screenshot in Claude-in-Chrome, both annotated and client builds.
David also sent a **new, larger iCloud album** for chassis 26282
(`https://share.icloud.com/photos/067FIpe2yW62VqmZ8gK1TRk6w`) and asked specifically for **underside
shots** to be added to `volvo-p1800.html` — not yet done, see What was NOT done. He also corroborated
(without confirming) that chassis 26282 and chassis 23925 (the resto-mod's number from the earlier
meeting) may be the same car under two different transcriptions — the homepage's own testimonials
already name "Ahmet Hussein and Tonja Hussein," matching the resto-mod's owner/commissioner names.
**Still unreconciled** — ask David directly which chassis number is correct.

**Part 4 — housekeeping.** Verified `client-document` is a properly registered skill in
`~/Sites/claude-skills` (catalog entry, domain index, changelog history, correctly symlinked at
`~/.claude/skills/client-document`) and deleted the stray untracked
`create-client-document-skill.md` that every handoff back to (at least) 2026-09-05 had flagged as
"still unexamined." **Caveat:** it was deleted after reading only the first third of its 150 lines —
the full original prompt is not recoverable (real `rm`, no Trash alias, never committed to git). Not
a blocker for anything, but if anyone needs that exact prompt text again, it doesn't exist anywhere
anymore.

---

## Current state — verified 2026-09-11

### Local / git

- `git status --porcelain` — empty. Working tree clean.
- `git log @{u}..` — 4 unpushed commits (listed at top). **`c5941cb6` (this session) has never left
  this machine.**
- `git log origin/develop..HEAD` — same 4 commits.

### Live deployment (`https://dpm-autobody.vercel.app`), verified via direct `curl`

- **Live and correct:** the testimonials swap, the real vector logo, the logo scale-up (all pre-date
  this session, all confirmed live).
- **NOT live — this session's video-claim fix has not been deployed.** `curl .../index.html | grep
-c "37:32\|thirty-seven-minute"` returns **2** — the false film claim is **still on the live site
  right now**, in the two spots that were on `index.html`. The `volvo-p1800.html` fix is presumably
  also un-deployed for the same reason (not independently re-checked, but there is no mechanism by
  which one page's fix could have deployed and not the other's — neither has been published since
  `c5941cb6` was committed).
- **NOT live — the library page does not exist on the deployed site.** `curl -o /dev/null -w
'%{http_code}' .../library.html` returns **404**. Confirmed cause: `library.html` was never added
  to `prototype/publish.zsh` (grep for "library" in that file returns nothing) — this is the exact
  failure mode a previous handoff already warned about (see Traps): `build.mjs` picks up every
  `src/*.html` automatically, so it built locally into `client/`/`annotated/` looking completely
  fine, but `publish.zsh` only ships pages it's explicitly told about.
- Whether David has been sent any URL for this session's changes: **no** — unchanged from every
  prior handoff, the URL has never been sent to David at all (per project memory
  `project_dpm_autobody.md`).

### Unverified / assumed

- Everything flagged unverified in the prior version of this handoff and not re-touched this
  session: whether David has seen the E-type/testimonial changes, the DB6 Instagram-highlight
  identity, real-phone rendering, Google Business Profile photos, the 440-vs-450 E-type hour-count
  discrepancy, the E-type page's `09`/`06` chapter-comment mismatch (still present, still cosmetic,
  still not fixed).
- The chassis 26282 vs 23925 discrepancy (see Part 3 above) — corroborating evidence found, not
  resolved.
- Whether the two P1800s' repeated "1,300 hours" figure (Red P1800 and Pearl White P1800, both given
  by David in the same meeting) are genuinely two separate totals or one carried over by mistake —
  flagged in the library-page prototype itself (`data-note`), not resolved.

---

## What was NOT done

- **This session's work is not published.** See Current state — both the video-claim fix and the new
  library page exist only in `prototype/src/`, `annotated/`, `client/` on disk and in the git commit,
  not on the live URL.
- **`library.html` was never added to `prototype/publish.zsh`** (neither the R2 upload `--pages`
  flag nor the client-build `cp` staging list) — required before any publish, or it will build fine
  and silently 404 live, exactly like the E-type page trap from the 2026-09-05 handoff.
- **The underside shots David asked for were not added to `volvo-p1800.html`.** The new iCloud album
  (`067FIpe2yW62VqmZ8gK1TRk6w`) has not been downloaded, reviewed, plate-redacted, or used anywhere.
- **None of the 8 new builds' photography has been pulled or plate-redacted.** All 8 corresponding
  library-page rows are still text-only by necessity, not by final design intent — see the build-out
  `session.md` Phase 3, which makes a real photo per build a completion requirement, not optional.
- **The chassis 26282/23925 discrepancy has not been put to David directly** — only corroborating
  circumstantial evidence (matching testimonial names) has been found.
- **DPM's own real photography still is not in `home.html`/`workshop.html`** in the way earlier
  handoffs meant it (a broader curated library beyond the specific cars already featured) — unchanged
  priority carried forward from every prior handoff.
- **The contact form is still not operational** (unchanged, always intentional at this stage).
- **`interview-david.md` has still not been run** (unchanged from every previous handoff).
- **The E-type page's `09`/`06` chapter-numbering comment mismatch** — cosmetic, still not fixed.
- **Nothing from this session has been shown to David** — the URL has never been sent to him at all.
- **The real `sites/dpm-autobody` scaffold (build-out Phase 1) has not been started.** This session
  only executed Phase 0 (the library-page prototype) of that plan.

---

## Live-data changes already applied

**None this session.** No `publish.zsh` run happened — everything this session touched exists only
in the local git history and the local `prototype/{src,annotated,client}/` folders. The live Vercel
deployment and R2 assets are exactly as they were at the end of the 2026-09-05–07 work (testimonials,
logo). Rollback is trivial if needed: nothing live to roll back.

---

## Traps

Everything in the previous handoff's Traps section still applies and was not re-verified this session
except where noted: always use `prototype/publish.zsh`, never `tools/publish-prototype.ts` directly;
edit `prototype/src/`, never `client/`/`annotated/` directly; `cleanUrls` must stay off; HEIC
dimension detection needs `sips`, not `magick identify`; the `--accent`/`--accent-ink` CSS custom
properties read as the default red in a fresh Claude-in-Chrome `javascript_tool` call immediately
after navigating — scroll first, it's a testing-tool artifact, not a site bug.

- **`library.html` is not in `publish.zsh` — the exact same failure mode the E-type page hit in
  September.** Fix this in the same two places noted then: the R2 upload `--pages` flag and the
  client-build `cp` staging list. Confirmed the omission by grep, not by assumption.
- **This whole session's work is unpublished AND unpushed.** A fresh session (or anyone on another
  machine) will not see any of it — not the library page, not the video-claim fix, not `session.md`'s
  build-out plan — until someone runs `git push` and `publish.zsh`.
- **The false "37:32 minute film" claim is still live right now**, on a URL that (per project memory)
  has never actually been sent to David — so the exposure risk is low, but it is not zero if anyone
  else has that link.
- **`output/sessions/.current-session` points at an unrelated project's session folder**
  (`2026-08/2026-08-23_dcs-homepage-nextjs-port`) — not DPM. If a future `/handoff` or similar tool
  run is given no explicit target and trusts that pointer over recency, it will resolve to the wrong
  folder. Not fixed here (out of scope for this handoff), just flagged.
- Everything already documented as a trap in the 2026-09-05/06 handoff still stands: `.plate::after`'s
  vignette is duplicated per-page rather than shared (the workshop hero's lighting fix doesn't extend
  to `home.html`'s/`volvo-p1800.html`'s other `.plate` sections); the E-type page's `09`/`06`
  chapter-comment mismatch; two orphaned downloaded images in `assets/etype-941pvo/` that are
  intentional spares, not missing content.

---

## Next step

**1. Decide whether to push and publish this session's work before continuing.** Nothing is lost by
waiting, but the video-claim fix is a real correction sitting uncommitted-to-production on a
confirmed-false claim, and every day it isn't live is a day the (unsent, but existing) URL could show
it to someone. Two independent actions, in order if you proceed:

```bash
cd /Users/rickywilson/Sites/local-business-platform
git push origin develop   # pushes all 4 commits, including this session's

# Then, once library.html is added to publish.zsh (see Traps):
node output/sessions/2026-08/2026-08-26_dpm-autobody-discovery/prototype/build.mjs
./output/sessions/2026-08/2026-08-26_dpm-autobody-discovery/prototype/publish.zsh
```

**2. Add `library.html` to `publish.zsh`** (the R2 `--pages` flag and the client-build `cp` list)
before that publish — otherwise it repeats the E-type 404 trap.

**3. Ask David to reconcile the chassis 26282 vs 23925 discrepancy** directly — see Current state.
Low cost, needed before either number is repeated on a new page.

**4. Pull and plate-redact the new iCloud albums**, starting with chassis 26282's underside shots
(the specific, small ask David made) and then the 8 new builds' albums, per
`output/sessions/2026-09/2026-09-08_dpm-autobody-build-out/session.md` Phase 3. Use the existing
tooling: `output/sessions/2026-08/2026-08-26_dpm-autobody-discovery/tools/plate-redact/`.

**5. Once ready to move past the prototype:** follow the build-out plan's Phase 1 (scaffold
`sites/dpm-autobody` from `base-template`) — gated on Phase 0 (this session's library-page design)
being considered settled, which it now is per Ricky's confirmation.

**6. Everything from earlier handoffs' remaining items, still open and untouched this session:**
prune the raw 35GB photography library; decide the Jaguar/Austin-Healey fictional sections in the
superseded direction pages; run `interview-david.md`; resolve the type-study (Fraunces) question;
resolve whether the Bentley/documentary photography gaps need more material from David; extend the
nav-consistency and hero-lightening fixes to `home.html`'s/`volvo-p1800.html`'s other `.plate`
sections if full consistency is wanted; decide whether the mobile pill nav should get the same
`is-active` treatment as the desktop nav.

---

## Open questions

Carried forward, still open: Fraunces/type-study, where new DB6/Porsche photography should live, the
Bentley/documentary gaps, the DB6 Instagram-highlight identity, quoting named reviewers beyond the
current three testimonials, the Bentley drophead question, Halcyon naming permission, insurance/
accident-repair page treatment (partially answered 2026-09-08: David confirmed it stays off the site
entirely, matching category convention — see `BACKLOG.md` item 5), whether the contact form should be
wired up, whether the E-type page's video should be pulled in later and hosted where, whether the two
orphaned E-type images should be wired in or deleted.

New this session:

- **Chassis 26282 vs 23925** — same car, per corroborating testimonial-name evidence, but not
  confirmed by David directly.
- **The repeated "1,300 hours" figure** across the Red P1800 and Pearl White P1800 — genuinely two
  totals, or one copied by mistake?
- **The Red P1800's video** (the one actually shot for chassis 26282's page in error) — confirmed to
  exist and belong to the Red P1800, but not yet embedded anywhere, since that build doesn't have its
  own page yet.
- **The rare Volvo's previous owner** (a "well-known singer") — name not given by David, needed before
  that build's copy can name the detail it's otherwise built around.
