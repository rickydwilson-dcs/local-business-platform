# DPM Autobody — new client discovery, research and prototypes — handoff

**Status:** in-progress. Research complete and synthesised. The chosen direction now exists as
**two generated builds from one source** — a clean client version and an annotated working version.
The two invented cars have been replaced with real DPM work, all copy is a first pass at
customer-facing wording, DPM's logo has been traced to vector and put in the masthead, and there is
a type study for the headline-face question. **The client build is now published at
https://dpm-autobody.vercel.app and is ready to send; David has not been sent it yet.**

**Branch:** `develop`. **Committed** — this handoff ships inside the commit that added the
two-build prototype. Three commits sit on `develop` and **all three are unpushed**:
`80efe32a` (discovery, research, first prototypes), `c2a79ec8` (a handoff correction), and this
one. `git log --oneline origin/main..HEAD` returns exactly those three. No feature branch was used,
deliberately: this touches `output/` only, so nothing CI builds or deploys.

**Working tree: clean for this session folder** — verified with
`git status --porcelain output/sessions/2026-08/2026-08-26_dpm-autobody-discovery`, which returns
nothing. Assets are absent from git by design, not by omission (see Traps).

**A `lint-staged` prettier hook reformats markdown on commit.** Tables get re-padded and long lines
reflowed; content is unchanged. It has twice mangled a bracketed editorial note inside a blockquote
into a nested quote — keep such notes outside the quote.

Unrelated and **not ours** — leave alone: `tasks/operations/google-workspace.md` (modified),
`output/sessions/2026-08-25_dcs-npracing-pagespeed-post/`,
`output/sessions/2026-08/2026-08-26_dcs-projects-pages/`.

**Client:** DPM Autobody, Berwick, East Sussex. Director David Pearce-Martin, 01323 552827,
info@dpmautobody.co.uk. Concours classic car restoration; everything hand-crafted in house except
engine building and trimming; their real speciality is **paintwork** — they do Halcyon Cars' paint.
Existing site `dpmautobody.co.uk` is Wix.

---

## What this is trying to resolve

Ricky won DPM as a client on 2026-08-26. David asked for a website whose appearance "matches the
level of works we do", naming three reference sites: eaglegb.com, thorntonrestorations.com,
halcyon.works. The job is to research, position, and prototype homepage options before any build in
the monorepo.

**Four user decisions constrain everything downstream. Do not re-litigate them.**

1. **Project the lifestyle of the people who drive these machines, not the personality of the shop.**
   Ricky, 2026-08-26. David describes himself as "not the most elegant man"; the clientele own
   concours cars. Process appears as _evidence_, art-directed — never as the shop's self-image.
   Full reasoning in `positioning.md`.
2. **Three editorial axes**, Ricky 2026-08-27: more hands / less faces · more paint / less mechanics ·
   more finished items / less process.
3. **Two builds, one source**, Ricky 2026-08-29: David gets a clean page; Ricky gets the same page
   plus the notes to talk from. Both generated, never hand-maintained.
4. **The page must never narrate itself.** Ricky, 2026-08-29, applied three separate times in one
   session — to the scroll hint, to "which is a harder room than a website", and to the
   testimonials' standfirst and stats. **No copy about the design, the medium, or why the evidence
   counts.** Anything that reads as the site arguing for itself gets cut.

**Read `synthesis.md` first.** It is the argument; the four teardowns in `research/` are the evidence.

---

## Actions taken

`80efe32a` and `c2a79ec8` cover steps 1–10. Steps 11–19 are in the commit this handoff ships in.

1. **Discovery** (08-26): audited the live Wix site, first-pass read of the three references.
2. **Deep research**, five parallel agents: teardowns of Halcyon, Eagle and Thornton; an audit of
   DPM's own imagery; research into the tier above the reference set. ~2,600 lines in `research/`.
3. **`synthesis.md`** — the research turned into a design brief with three art directions.
4. **Art direction** (08-27): 14 AI stills + 3 clips via the Higgsfield CLI.
5. **Three prototypes** built by parallel agents. Reviewed with Ricky.
6. **Client verdict** (08-27): A rejected; B's imagery/interactions and C's log/register liked.
7. **Real photography retrieved** — 14 slides of the Candy Red Volvo P1800 from Instagram.
8. **Direction D "The Register"** built (08-28) — the B+C merge.
9. **Plate-redaction tooling** built (`tools/plate-redact/`).
10. **D revised** (08-29 am) and split into homepage + project page.
11. **Split into two builds** (08-29 pm). `prototype/src/` is the only editable copy; `build.mjs`
    generates `client/` and `annotated/`. Notes marked with `data-note` / `data-client`.
12. **The invented cars replaced with real DPM work.** Enumerated DPM TV's 29 videos with `yt-dlp`,
    identified "the green jag" as their Custom Classic Jaguar in **Aston Martin Sea Green**, and
    found the finished **1963 Bentley S3 Continental** already on DPM's own site at 4032×3024.
    Built `assets/dpm-work/make-plates.zsh` to cut eight plates from those two sources.
13. **All copy rewritten as first-pass customer-facing wording.**
14. **The DPM logo traced to vector.** `tools/trace-logo.mjs` — marching squares over the PNG's
    alpha channel, RDP-simplified. Inlined as an SVG `<symbol>` in the masthead and footer.
15. **Type study built** (`prototype/type-study.html`) for the serif-headline question.
16. **Hero light re-balanced** after Ricky's note that the band sat too high and the paint below
    the chrome trim could not be read. Four separate causes — see Traps.
17. **Hero vertical fit fixed and instrumented.** `measure-hero.mts` checks three gaps across 20
    viewports; four latent collisions found and fixed.
18. **Proof section rebuilt as testimonials.** Six of DPM's 24 Facebook recommendations recovered
    (Ricky's own logged-in session) and transcribed to `research/facebook-reviews.md`.
19. **Three blocks cut from the testimonial section** at Ricky's call — the 100%/24 figure, the
    note explaining why a public comment counts, and the standfirst. All the same fault as (4).
20. **The client build published** (08-29 pm) to https://dpm-autobody.vercel.app. Ricky's scope
    call: David gets the two clean pages and nothing else. Fixing the shared publish tooling was a
    prerequisite — see Traps.
21. **Testimonials restored to verbatim and the section renamed** (08-30). Liam Hunt's and Craig
    Mayhew's Facebook recommendations had been silently trimmed — and the annotated note wrongly
    claimed they were verbatim with "nothing reworded". Both now match `research/facebook-reviews.md`
    character-for-character, checked by parsing page and transcript. Separately, section 01 **"The
    register" became "The record"**: the word was ours, not DPM's, and as the project page's first
    nav item it read as a verb. DPM's own word is "portfolio" — added to `interview-david.md` §D.

---

## Current state — verified 2026-08-29

Everything below was checked by running something, not recalled.

### Prototypes — two generated builds from one source

**Read `prototype/README.md` before touching anything in that folder.** Short version: edit
`prototype/src/`, run `node prototype/build.mjs`, never hand-edit `client/` or `annotated/`.

| File                                  | Status                                                          |
| ------------------------------------- | --------------------------------------------------------------- |
| `prototype/src/home.html`             | **Source of truth**, homepage. Edit this.                       |
| `prototype/src/volvo-p1800.html`      | **Source of truth**, project page. Edit this.                   |
| `prototype/build.mjs`                 | Generates both. Throws if a marker attribute leaks through.     |
| `prototype/client/index.html`         | **Generated. What David sees.**                                 |
| `prototype/client/volvo-p1800.html`   | Generated.                                                      |
| `prototype/annotated/*.html`          | Generated. Same pages + notes + a yellow "working copy" flag.   |
| `prototype/type-study.html`           | Standalone. The headline-face question, with the mark in frame. |
| `prototype/index.html`                | Chooser. **Hand-edited, not generated.** Not deployed.          |
| `prototype/publish.zsh`               | **The only way to publish.** Upload → rebuild → stage → deploy. |
| `prototype/assets-manifest.json`      | What went to R2: 20 files, 4.5MB. Written by the upload tool.   |
| `prototype/.publish/`                 | Generated staging dir, gitignored. The deployed payload.        |
| `prototype/measure-hero.mts`          | Hero geometry check, 20 viewports, exits non-zero on overlap.   |
| `prototype/shoot-hero.mts`            | Hero frames at 4 scroll positions, for before/after comparison. |
| `prototype/direction-d-register.html` | **Superseded.** Kept, do not edit.                              |
| `prototype/project-p1800.html`        | **Superseded.** Kept, do not edit.                              |
| `prototype/direction-a/b/c-*.html`    | Historical. A rejected by the client 27 August.                 |

Verified today, all by running it:

- `node prototype/build.mjs` → **"no marker attributes survived into either build"**.
- **85 references across 6 pages, 0 broken** (link/asset check over the built HTML).
- All 6 pages close `</html>`.
- `measure-hero.mts` → **OK, every gap positive at every size**; worst gaps logo→label 38px,
  lede→foot 24px, foot→caption 77px.
- Client build **meta-language 0, self-reference 0** on both pages.
- `src/`, `client/` and `annotated/` now carry **absolute `pub-….r2.dev` URLs** (26 references per
  page). The five superseded directions still hold relative `assets/` paths, correctly — they point
  at the AI plates, which were never uploaded.
- Live deployment checked by fetching it, not by trusting the CLI: `/` and `/volvo-p1800` return
  **200 and are byte-identical to the local `client/` build** (sha256 match on both). All 8 images
  on the homepage return 200 `image/jpeg` from R2. `X-Robots-Tag: noindex, nofollow` is served.
  `/annotated`, `/client`, `/type-study`, `/direction-a-catalogue`, `/src/home` and
  `/assets-manifest.json` all **404**. No `buildflag` element and no `data-note`/`data-client`
  attribute survives into the served page.

### The three cars are all real DPM work

The invented Jaguar XK150 and Jaguar E-type are gone.

| Lot | Car                                | Imagery                                                          |
| --- | ---------------------------------- | ---------------------------------------------------------------- |
| 01  | Volvo P1800, Candy Red             | 14 frames from DPM's own Instagram. Unchanged.                   |
| 02  | **1963 Bentley S3 Continental**    | Three crops of the 4032×3024 photograph on DPM's own site.       |
| 03  | **Jaguar, Aston Martin Sea Green** | Frames from DPM's own film, lens-corrected. Ricky's "green jag". |

**Nothing on the client or annotated builds is AI.** The AI plates survive only in directions
A, B, C and the superseded D.

Lot 02 claims **no** hours, chassis number or coat count, because DPM have never published any for
that car. Lot 03 does **not** name the model, because DPM never state it and the body is not
identifiable from the footage with enough certainty to print. **Do not "improve" either of these.**

### Assets

- `prototype/assets/dpm-work/` — **2.2 MB, 8 files.** Three Bentley crops, three Sea Green Jaguar
  frames, two workshop frames. `make-plates.zsh` names every source and crop and rebuilds the lot.
- `prototype/assets/brand/` — **116 KB, 3 files.** `dpm-logo.svg` (traced, 15,037 bytes, 16
  contours, 1,258 points) plus trimmed transparent PNGs in bone and dark.
- `prototype/assets/dpm-instagram/DU2rgo5DXqC/` — **4.1 MB, 28 files.** The real P1800 photographs,
  1280×853 (Instagram's ceiling), plus `web/` copies and DPM's verbatim caption.
- `prototype/assets/art-direction/` — **137 MB, 31 files.** The AI plates. **Referenced only by the
  superseded directions now.**
- `research/screenshots/` — **~2.0 GB** of reference captures. Gitignored. Safe to delete.

### The P1800 — the worked example. All facts are DPM's own, verbatim from their caption

Candy Red · a year-long restoration · **1,300 hours of labour** · client changes: Candy Red colour,
wire wheel conversion, power steering conversion, smoothed chrome bumpers, lowered · "a full
restoration portfolio with **over 2000 photos**" · chassis **26282** from the riveted plaque ·
a 37:32 film, "The Volvo P1800 Restoration", **57k views**, on their YouTube "DPM TV".

**Do not embellish these or invent additional ones.** Where a value was never published (coat count,
paint code), the page says "in this car's file" rather than inventing it — keep that.

### Verified by eye, not just asserted

- The plaque in `slide-10.jpg` is engraved "Restored By DPM AUTOBODY" with "ARTISTS O…" along the
  bottom edge — cropped and enlarged to confirm. The tagline is already in the cars.
- The plate detector returns the real number plate as **rank-1 at 0.87** on the P1800 whole-car shot.
- The traced logo renders correctly in bone at both masthead (~103×52px) and footer (~161×80px)
  scale, and measures **1.9% of ink different** from the source raster.
- The re-balanced hero shows Candy Red with visible lustre below the chrome waistline at four
  scroll positions — before/after frames compared via `shoot-hero.mts`.

### Tooling — working

- `prototype/build.mjs` — the two-build generator.
- `prototype/measure-hero.mts` and `shoot-hero.mts` — **run from the monorepo root**, with the
  folder served on :8899.
- `tools/trace-logo.mjs` — raster → SVG. `EPS` env var sets tolerance (default 0.8).
- `prototype/assets/dpm-work/make-plates.zsh` — rebuilds all eight real-work plates.
- `research/tools/capture-site.mts` — headless Playwright capture. **Run from the monorepo root.**
- `tools/plate-redact/` — propose → confirm → apply. Venv verified (`cv2 5.0.0`).
- Higgsfield CLI authenticated; **772.85 credits** remaining.

### Unverified / assumed

- **Whether the builds hold up on a real phone.** Geometry is measured in headless Chromium at
  phone viewports; nobody has opened it on a handset.
- Google Business Profile photos were never checked — bot-blocked during the audit. Still unknown.
- ~~The Jaguar film's rights.~~ **Settled by Ricky, 2026-08-30:** every DPM Instagram and YouTube
  video is to be treated as DPM's to use however they wish. The Lot 03 plates (`3bcai_euCy4`) and
  the workshop film are therefore both usable. Recorded as Ricky's standing instruction rather than
  as something verified with the production company — noted here so it is traceable, not re-opened.

---

## What was NOT done

- **Nothing is pushed.** All three commits exist only on this machine. `git push` has not been
  run, and per `CLAUDE.md` the promotion path is develop → staging → main. **This is the single
  biggest risk here.**
- **The URL has not been sent to David.** It is live and verified, but publishing it and sending it
  are separate acts, and the second has not happened. Before it does, read the invented-copy trap
  below — three blocks put first-person words in the mouths of Dave, Paul and Ellis, and the client
  build carries no label saying so.
- **Nobody has opened the deployed pages in a real browser.** Verification was HTTP-level: status
  codes, byte-identity against the local build, image fetches, headers. That proves the right bytes
  are being served, not that the page looks right on David's phone.
- **Only the client build is published.** The annotated build is not on any URL, so Ricky's
  talk-track is still `file://` or `127.0.0.1:8899` only.
- **The type study has not been decided.** `type-study.html` presents the question and a view;
  nobody has chosen. Until they do the prototype stays on Archivo.
- **The copy has not been read back to David, and the interview that does it has not been run.**
  `interview-david.md` (2026-08-30) inventories every invented block and pairs it with the question
  that replaces it. Deliberately **not** applied as edits: Ricky's call is that David sees the
  sections and is told they are being rewritten.
- **Nothing invented has been removed.** The four log entries, the nine stage names and durations,
  the glosses under the owner's specification, and six claims on the homepage are all still live at
  https://dpm-autobody.vercel.app. That is a decision, not an oversight.
- **The client rationale document is not written.** `BACKLOG.md` item 1, and the next real
  deliverable. Framing and the resolved tension are already specified there.
- **The iCloud photo link has not arrived.** David confirmed on 08-28 he will send it. Playbook:
  `inbox/WHEN-THE-ICLOUD-LINK-ARRIVES.md` — follow it, it encodes decisions easy to get wrong.
- **The plate-redaction tool has never been run over a real batch** — one single-image test only.
- **David's brother's footage library has not been inventoried.** Could remove part of the video
  commission.
- **No monorepo site exists.** No `sites/dpm-autobody`, no theme, no MDX. Still prototype only.
- **The video shoot has not been briefed**, and it is time-critical — `synthesis.md` §6.
- **The Bentley video was never downloaded.** YouTube rate-limited it after the Jaguar film came
  down. Not needed — all three Bentley plates are crops of the one stills photograph — but if a
  fourth is wanted, `JpztIam_ARE` is the 16-minute feature and `web_safari` format 96 is the way in.
- **The remaining 18 Facebook reviews were not recovered**, and chasing them is not worth it — see
  Traps.
- Direction D has been reviewed twice by Ricky, never by David. The "does the resolve device
  survive three repetitions" question is still open — it holds _only_ because Lot 03 breaks the
  pattern by not resolving to a finished car. **That is now true for a real reason:** the Sea Green
  Jaguar is genuinely still in the booth.

---

## Live-data changes already applied

**Two, both on 2026-08-29, both at Ricky's explicit instruction.** No DNS touched, no commit pushed,
no monorepo site deployed. External spend remains 75 Higgsfield credits.

1. **20 objects uploaded to Cloudflare R2** under
   `prototypes/2026-08-26_dpm-autobody-discovery/assets/` in the `local-business-platform` bucket
   — 4.5MB, `public, max-age=300`. All are DPM's own photographs of DPM's own work. The 137MB of AI
   art-direction plates was deliberately **not** uploaded. `assets-manifest.json` is the record.
2. **A new Vercel project `dpm-autobody`** created under `ricky-wilsons-projects` and deployed to
   production, aliased to `https://dpm-autobody.vercel.app`. Not git-linked, so it never rebuilds on
   a monorepo push. Payload is 182.7KB of HTML — two pages, no assets.

Three read-only outward-facing actions, all at Ricky's explicit instruction, all in his own logged-in
Chrome, nothing posted / liked / followed / changed:

1. Read DPM's public Instagram post and saved 14 images (08-27).
2. Read DPM's Facebook reviews page (08-29). Cookie banner set to **decline optional cookies**.
3. Downloaded two DPM TV videos with `yt-dlp` (08-29) for frame extraction.

---

## Traps

- **Republish with `prototype/publish.zsh`, never by hand.** It uploads, rebuilds, stages and
  deploys in the one order that works. Deploying the `prototype/` folder directly would put the
  annotated build — which names the copy we invented — and the rejected directions on David's URL.
- **The shared publish tooling was broken for this folder's shape and failed silently.** Both
  `tools/upload-prototype-assets.ts` and `tools/publish-prototype.ts` scanned only top-level HTML
  and matched only `"assets/`, never `"../assets/`. This session's real pages are one level down and
  climb to reach `assets/`, so the rewrite skipped them, `publish-prototype.ts` excluded `assets/`
  from the upload, and **its pre-flight passed anyway because it was reading the wrong files** — the
  deploy would have succeeded with every image 404ing. Both are fixed (recursive scan, `../` aware)
  and both now take `--pages`. If you touch either, keep the recursion.
- **The rewrite must land on `src/`, not on `client/`.** Rewriting a generated build is undone by
  the next `node build.mjs`. `publish.zsh` passes `--pages src/home.html,src/volvo-p1800.html` for
  exactly this reason.
- **Edit `prototype/src/`, never `client/` or `annotated/`.** They are overwritten on every
  `node prototype/build.mjs`. Hand-editing a build is silently lost on the next run.
- **The client build has no label on the invented copy, by design.** Three blocks are ours, not
  DPM's: the four log entries on the P1800 page, the nine stage names and their durations, and the
  notes beside the owner's specification and the paint. **The log entries put first-person words in
  the mouths of Dave, Paul and Ellis — three real, named men — and Ellis's bumper story describes an
  incident invented to demonstrate the form.** The annotated build flags all of it loudly. Say it
  out loud when walking David through the client version; he will otherwise assume his own staff
  wrote it.
- **Do not put the testimonial section's cut blocks back.** The 100%/24 figure, the note explaining
  why a public comment beats a testimonial, and the standfirst were all cut on 29 August. They read
  as the page arguing for its own evidence. Recorded in the annotated build too.
- **Do not mine Facebook for more reviews.** Six of 24 were recovered. **Every one is a repair or
  modification customer and the newest is September 2020** — the corpus praises speed and service
  ("quick turn around", "short notice"), which is the register of a good local bodyshop and the
  opposite of the concours positioning. The two on the page are the only two that talk about
  _standard_. Read `research/facebook-reviews.md` before touching this section.
- **The hero's light was re-balanced and the four reasons are load-bearing.** `.plate::after`'s
  bottom stop was 0.82 rising from 60%, putting the paint in the dark; `.spec` sat at z-index 3
  _under_ that shade, so its `screen` blend was being darkened by the gradient crushing the bottom;
  `.hero__inner::before` held 0.66 across the middle of the plate; and the hero image was scaled
  1.55× from a 1280px source — both an upscale and a crop that pushed the panel below the trim out
  of frame. The copy now carries a `text-shadow` instead of the plate being dimmed to give it one.
- **The hero's vertical fit is tuned against `measure-hero.mts`, not by eye.** Re-run it after
  touching the hero's padding, `.hero__foot`'s `bottom`, the `min-height: 44rem` that pins it, the
  `.h-hero` size, or the masthead logo height. Four bugs it caught that are invisible at one window
  size: a `@media (min-width: 60rem)` rule was zeroing `.hero__inner`'s top padding; plain
  `align-content: end` spills past the padding edge on overflow, so it must be `safe end`; below
  ~704px tall the pinned foot cannot clear a three-line headline and must go back into flow; and
  the headline needs a `min(7.6vw, 12vh)` cap or a wide-but-short window pushes the lede through
  the foot.
- **`output/.gitignore` denies all binaries across `sessions/**`by design** — including`.svg`.
`git add`silently skips every image, video and the traced logo. That is correct; do not "fix" it.
The logo survives anyway because it is **inlined into the HTML** as a`<symbol>`.
- **`research/reference-teardown.md` is superseded and contains two wrong claims** about Thornton.
  Use `teardown-thornton.md`.
- **`research/asset-audit-dpm.md` carries a dated correction at the end.** Its headline claim — "not
  one photograph of a finished car in daylight away from the workshop" — was **disproved**; the
  Bentley photograph is exactly that, and is now Lot 02. Its scarcity argument still stands.
- **The 1080/1280px ceiling is Instagram's, not the source's.** David's originals are camera and
  phone files.
- **Resolution was never the real constraint — light and composition were.** When the iCloud link
  arrives, the temptation is to treat the photography problem as solved. It is not.
- **`capture-site.mts`, `measure-hero.mts` and `shoot-hero.mts` must run from the monorepo root** —
  `@playwright/test` only resolves there under pnpm.
- **Do not use a helper function inside `page.evaluate()` in a `.mts` file** — tsx compiles it with
  esbuild's `__name` wrapper, which does not exist in the page and throws. Pass a string instead.
- **Only `web_safari` (format 96) serves DPM TV at 1080p** without a PO token. `android` silently
  falls back to 640×360; `tv` and `ios` refuse.
- **Facebook will not serve the reviews to automation.** 33 unhydrated `Facebook` placeholders and
  zero-width-joiner obfuscation on the one card that renders. A human must copy them.
- **Do not name Halcyon in any client-facing artefact yet.** Permission has not been given. The
  prototypes state the credential without the name — keep that.

---

## Next step

**1. Push, when Ricky says so.** Three commits sit unpushed on `develop`. Pushing is
outward-facing and has not been authorised.

```bash
cd /Users/rickywilson/Sites/local-business-platform
git log --oneline origin/main..HEAD   # expect exactly three
git push origin develop
```

**2. Serve it to look at anything.** `file://` works for the pages but not for the tooling.

```bash
cd output/sessions/2026-08/2026-08-26_dpm-autobody-discovery/prototype
python3 -m http.server 8899 --bind 127.0.0.1
# http://127.0.0.1:8899/            the chooser
# http://127.0.0.1:8899/client/     what David sees
# http://127.0.0.1:8899/type-study.html
```

**3. After editing `prototype/src/`, always:**

```bash
node output/sessions/2026-08/2026-08-26_dpm-autobody-discovery/prototype/build.mjs
npx tsx output/sessions/2026-08/2026-08-26_dpm-autobody-discovery/prototype/measure-hero.mts
```

**4. Rebuild assets after a fresh clone** (they are gitignored):

```bash
./output/sessions/2026-08/2026-08-26_dpm-autobody-discovery/prototype/assets/dpm-work/make-plates.zsh
```

**5. Write the client rationale** — `BACKLOG.md` item 1, framed on Ricky's three axes with the cost
of each named honestly, resolving the stated tension: _process is the proof, the finished car is the
promise._

**6. When the iCloud link arrives**, follow `inbox/WHEN-THE-ICLOUD-LINK-ARRIVES.md` exactly. Triage
first, then report the three counts that decide the design: how many files are **above 1280px**; how
many are a **finished car in daylight away from the workshop**; how many show **paint under
directional light**.

**7. Republish after any change to `src/`** — one command, from the monorepo root. It re-uploads
(skipping unchanged objects), regenerates both builds, re-stages the client pages and redeploys to
the same URL.

```bash
./output/sessions/2026-08/2026-08-26_dpm-autobody-discovery/prototype/publish.zsh
```

**8. Run the interview before sending the URL** — `interview-david.md`, written 2026-08-30 and not
yet run. It lists every block on the two pages that is ours rather than DPM's, with the question that
replaces each. Ricky's call: the invented copy **stays on the page for now** so David sees what the
sections do, and the interview is how he is told. Section A is the disclosure to say out loud first.

**9. Send David the URL** — https://dpm-autobody.vercel.app — when the copy caveat has been decided.
It is live, public and `noindex`. Sending it is a separate act from publishing it and has not been
done. Say out loud that the log entries, stage names and two side notes are ours, not his staff's.

---

## Open questions

- **Serif or grotesque for the headline?** Ricky's instinct on 29 August was that the site wants a
  serif, with the caveat that it might clash with the mark. `type-study.html` is built to answer it;
  nobody has. The page's own view: Instrument Serif, Libre Caslon Display or simply promoting
  Newsreader all survive the mark; the Didones do not.
- ~~**Publish the prototypes to Vercel for David?**~~ **Answered 2026-08-29:** yes, but the client
  build only. Live at https://dpm-autobody.vercel.app. The open part is now whether the annotated
  build should get its own unlisted URL so Ricky can talk from the notes on a second screen — it was
  offered and not taken, and is a five-minute change to `publish.zsh` if wanted.
- **Can we quote Liam Hunt, Craig Mayhew and Chris Bulmer?** All three are public posts, but
  quoting a customer on their restorer's own site is DPM's permission to seek. Nobody has asked.
- **Will David get three or four restoration testimonials?** `open-questions.md` item 4b, and the
  cheapest content win left on the site.
- **Is the Bentley a drophead?** The photograph shows a fabric roof, up. `asset-audit-dpm.md` calls
  it a Drophead; the page says only "Bentley S3 Continental" and does not commit. Ask David.
- ~~**Who owns the Jaguar film?**~~ **Answered 2026-08-30 (Ricky):** treat all DPM Instagram and
  YouTube video as theirs to use freely. Lot 03 is unblocked, and so is the workshop film behind
  `BACKLOG.md` item 3.
- **Insurance and accident repair** — keep, demote to a quiet secondary page, or drop? Off-positioning
  for concours but may be real revenue. Never answered by David.
- **Halcyon naming permission.** Their paintwork credential is the strongest proof DPM has.
- Remaining items in `open-questions.md` — DPM still hold no true vector logo (the traced SVG is a
  stopgap, not a redraw), and the NEC listing still carries DPM's old address and phone number.
