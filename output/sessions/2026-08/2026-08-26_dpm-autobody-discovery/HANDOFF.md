# DPM Autobody — new client discovery, research and prototypes — handoff

**Status:** in-progress. Research complete and synthesised; four homepage prototypes plus one project
page built and reviewed with Ricky; direction chosen and revised once. Blocked on client-supplied
photography before the next meaningful design step. Nothing has been published, deployed, or committed.

**Branch:** `develop`. **No commits were made for this work.** The three commits at the tip
(`d62bad55`, `f1baaf90`, `105e08bd` — turbo-ignore fixes) belong to a different session and are
unrelated to DPM.

**Working tree:** the entire session folder is **untracked** — `git status` shows one line,
`?? output/sessions/2026-08/2026-08-26_dpm-autobody-discovery/`. **Nothing here would survive a fresh
clone.** See Traps.

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

**Two user decisions constrain everything downstream. Do not re-litigate them.**

1. **Project the lifestyle of the people who drive these machines, not the personality of the shop.**
   Ricky's direction, 2026-08-26. David describes himself as "not the most elegant man"; the clientele
   own concours cars. Process appears as _evidence_, art-directed — never as the shop's self-image.
   Full reasoning in `positioning.md`.
2. **Three editorial axes**, Ricky 2026-08-27: more hands / less faces · more paint / less mechanics ·
   more finished items / less process.

**Read `synthesis.md` first.** It is the argument; the four teardowns in `research/` are the evidence.

---

## Actions taken

No SHAs — nothing was committed. Chronologically:

1. **Discovery** (2026-08-26): audited the live Wix site, first-pass read of the three references.
2. **Deep research**, five parallel agents: teardowns of Halcyon, Eagle and Thornton; an audit of
   DPM's own imagery; and research into the tier above the reference set. ~2,600 lines in `research/`.
3. **`synthesis.md`** — turned the research into a design brief with three art directions.
4. **Art direction** (2026-08-27): 14 AI stills + 3 clips generated via the Higgsfield CLI.
5. **Three prototypes** built by parallel agents, each pairing `ui-ux-pro-max` with a second design
   skill. Reviewed with Ricky.
6. **Client verdict** (2026-08-27): A rejected; B's imagery/interactions and C's log/register liked.
7. **Real photography retrieved** — 14 slides of the Candy Red Volvo P1800 from Instagram, via Ricky's
   own logged-in Chrome at his instruction.
8. **Direction D "The Register"** built (2026-08-28) — the B+C merge.
9. **Plate-redaction tooling** built (`tools/plate-redact/`).
10. **D revised** (2026-08-29) after Ricky's second review, and split into homepage + project page.

---

## Current state — verified 2026-08-29

Everything below was checked by running something, not recalled.

### Prototypes — all well-formed, all asset references resolve

| File                                   | Lines | Status                                       |
| -------------------------------------- | ----- | -------------------------------------------- |
| `prototype/index.html`                 | 162   | Chooser page                                 |
| `prototype/direction-d-register.html`  | 1625  | **The live direction.** Revised homepage     |
| `prototype/project-p1800.html`         | 1813  | **New.** The P1800 "log"                     |
| `prototype/direction-a-catalogue.html` | 1017  | **Rejected by client** — kept for the record |
| `prototype/direction-b-wetcoat.html`   | 955   | Parent of D                                  |
| `prototype/direction-c-greenroom.html` | 1074  | Parent of D                                  |

Verified: every file closes `</html>`; all 41 relative `assets/…` references across the six files
resolve to real files (0 missing).

### Assets

- `prototype/assets/art-direction/` — **137 MB**: 14 AI PNGs (2–3K wide), 14 web JPEGs in `web/`,
  3 MP4s. **AI-generated; not DPM's cars.** Rules in that folder's `MANIFEST.md`.
- `prototype/assets/dpm-instagram/DU2rgo5DXqC/` — **4.1 MB**: 14 real DPM photographs of the Candy Red
  Volvo P1800, all **1280×853** (Instagram's ceiling), plus `web/` copies and a `README.md` carrying
  DPM's verbatim caption and per-slide notes.
- `research/screenshots/` — **2.0 GB** of reference captures. Gitignored. Safe to delete.

### The P1800 — the worked example. All facts are DPM's own and verbatim from their caption

Candy Red · a year-long restoration · **1,300 hours of labour** · client changes: Candy Red colour,
wire wheel conversion, power steering conversion, smoothed chrome bumpers, lowered · "a full
restoration portfolio with **over 2000 photos**" · chassis **26282** from the riveted plaque ·
a 37:32 film, "The Volvo P1800 Restoration", **57k views**, on their YouTube "DPM TV".

**Do not embellish these or invent additional ones.** Where a value was never published (coat count,
paint code), `project-p1800.html` says so rather than inventing it — keep that.

### Verified by eye, not just asserted

- The plaque in `slide-10.jpg` is engraved "Restored By DPM AUTOBODY" with "ARTISTS O…" along the
  bottom edge — I cropped and enlarged it to confirm. The tagline is already in the cars.
- The plate detector returns the real number plate as **rank-1 at 0.87** on the P1800 whole-car shot.
- The revised hero reads as lit on arrival and the light band completes within roughly one viewport
  (compared frames at scroll 0 and scroll 900).

### Tooling — working

- `research/tools/capture-site.mts` — headless Playwright reference capture. **Run from the monorepo
  root**, import from `@playwright/test`, `.mts` not `.ts`. Its README documents three solved gotchas.
- `tools/plate-redact/` — propose → confirm → apply. Venv verified working (`cv2 5.0.0`).
- Higgsfield CLI authenticated; **772.85 credits** remaining (75 spent).

### Unverified / assumed

- **Nothing has been published.** No `r2.dev` or `vercel.app` URL appears in any prototype — grepped.
- The two secondary lots on the homepage and all journal entries are **invented placeholder copy**,
  labelled as indicative in-page. Only the P1800 facts are real.
- Google Business Profile photos were never checked — bot-blocked during the audit. Still unknown.

---

## What was NOT done

- **Nothing is committed.** No branch, no commit, no push. The whole folder is untracked.
- **Nothing is published.** Assets are not on R2; no prototype is on Vercel. David has **not seen any
  of this** — every review so far has been Ricky's, on local `file://` URLs.
- **The client rationale document is not written.** It is `BACKLOG.md` item 1 and the next real
  deliverable. Framing and the resolved tension are already specified there.
- **The iCloud photo link has not arrived.** David confirmed on 2026-08-28 he will send it. The
  playbook for handling it is `inbox/WHEN-THE-ICLOUD-LINK-ARRIVES.md` — follow it, it encodes decisions
  that are easy to get wrong.
- **The plate-redaction tool has never been run over a real batch** — only a single-image test on
  `slide-01.jpg`. It works; it has not been exercised at scale.
- **David's brother's footage library has not been inventoried.** He produced the P1800 film and "has
  quite a lot of other footage". Unseen. Could remove the need for part of the video commission.
- **No monorepo site exists.** No `sites/dpm-autobody`, no theme, no MDX. This is all still prototype.
- **The video shoot has not been briefed**, and it is time-critical — see `synthesis.md` §6.
- Direction D has only been reviewed once since revision, by Ricky. The "does the device survive three
  repetitions" question is open — the builder's honest verdict was that it holds _only_ because Lot 03
  breaks the pattern by not resolving to a car.

---

## Live-data changes already applied

**None.** No production system was written to. No site deployed, no DNS touched, no R2 upload, no
Vercel project created, no commit pushed. The only external spend was 75 Higgsfield credits.

One outward-facing action was taken: Ricky's own logged-in Chrome was used, at his explicit
instruction, to read DPM's public Instagram post and save 14 images. Nothing was posted, liked,
followed or changed. The cookie banner was set to **decline optional cookies**.

---

## Traps

- **The whole session folder is untracked and never committed.** 2.1 GB of it is gitignored binaries,
  but the ~40 markdown/HTML/script files are the actual work product and exist only on this machine.
  If preserving them matters, commit the text files before anything else.
- **`output/.gitignore` denies all binaries across `sessions/**`by design.**`git add` will silently
  skip every image and video. That is correct — assets belong in R2 — but do not "fix" it.
- **`research/reference-teardown.md` is superseded and contains two wrong claims** about Thornton.
  It carries a banner saying so. Use `teardown-thornton.md`.
- **`research/asset-audit-dpm.md` carries a dated correction at the end.** Its headline claim — "not
  one photograph of a finished car in daylight away from the workshop" — was **disproved**. Read to
  the bottom before quoting it. Its scarcity argument still stands; the absolute claim does not.
- **The 1080/1280px ceiling is Instagram's, not the source's.** David's originals are camera and phone
  files. Do not repeat "their photography is capped at 1080px" — it was true of what we could reach,
  not of what exists.
- **Resolution was never the real constraint — light and composition were.** When the iCloud link
  arrives, the temptation is to treat the photography problem as solved. It is not. The commissioned
  shot list stands.
- **`capture-site.mts` must run from the monorepo root**, not from its own directory — `@playwright/test`
  only resolves there under pnpm. It fails with `ERR_MODULE_NOT_FOUND` otherwise.
- **A previous agent died mid-task when the machine slept.** It had written nothing, so no repair was
  needed — but check file integrity before assuming a failed agent left a clean tree.
- **Do not name Halcyon in any client-facing artefact yet.** Permission has not been given. The
  prototypes state the credential without the name ("the paint is done here for other people's cars
  too") — keep that until David confirms.

---

## Next step

**1. Write the client rationale** — the next deliverable, `BACKLOG.md` item 1. Framed on Ricky's three
axes with the cost of each named honestly, and resolving the stated tension: _process is the proof,
the finished car is the promise._

**2. When the iCloud link arrives**, follow the playbook exactly:

```
open output/sessions/2026-08/2026-08-26_dpm-autobody-discovery/inbox/WHEN-THE-ICLOUD-LINK-ARRIVES.md
```

Triage first, then report three counts that decide the design: how many files are **above 1280px**;
how many are a **finished car in daylight away from the workshop**; how many show **paint under
directional light**.

**3. To redact plates once real photos are in:**

```bash
cd output/sessions/2026-08/2026-08-26_dpm-autobody-discovery/tools/plate-redact
./.venv/bin/python detect.py /path/to/photos --out work/proposals.json --review work/review.html --embed-thumbs
open work/review.html          # confirm every image — apply.py refuses unreviewed input
./.venv/bin/python apply.py ~/Downloads/redactions.json --in /path/to/photos --out /path/to/redacted --style blank --contact-sheet
```

**4. To re-capture any prototype for review:**

```bash
cd /Users/rickywilson/Sites/local-business-platform
S=output/sessions/2026-08/2026-08-26_dpm-autobody-discovery
npx tsx $S/research/tools/capture-site.mts --url "file://$PWD/$S/prototype/direction-d-register.html" \
  --label proto-d --frames 6 --out $PWD/$S/research/screenshots
```

**5. To publish for David** (needs Ricky's go-ahead — this is outward-facing, and he has not given it):

```bash
npx tsx tools/upload-prototype-assets.ts   # check what it sweeps first — 137 MB of PNG is not referenced
npx tsx tools/publish-prototype.ts
```

Only the 11 MB `web/` set and the 4.1 MB Instagram set are referenced by the pages.

---

## Open questions

- **Publish the prototypes to Vercel for David?** Not done deliberately — deploying is outward-facing.
  Needs Ricky's explicit go-ahead.
- **Commit the session folder?** Nothing is under version control. Ricky's call.
- **Insurance and accident repair** — keep, demote to a quiet secondary page, or drop? Off-positioning
  for concours but may be real revenue. Never answered by David.
- **Halcyon naming permission.** Their paintwork credential is the strongest proof DPM has.
- **Does the resolve device survive three repetitions?** Ricky has seen the revision once; his verdict
  on this specific point has not been given.
- Remaining items in `open-questions.md` — the logo is a raster PNG needing vector redraw, and the
  NEC listing still carries DPM's old address and phone number.
