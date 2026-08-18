# DCS homepage redesign — handoff

> **✅ RESOLVED 2026-08-18 — the R2 migration below is DONE. Read this box, not the warning under it.**
>
> The 117MB never entered git. All 67 prototype assets are in R2 under
> `prototypes/2026-08-17_dcs-homepage-redesign/`, all 311 references across the 54 prototypes
> were rewritten to absolute R2 URLs, and the prototype folder went 142MB → 19MB.
>
> **The prototypes are live: https://dcs-prototypes.vercel.app** (all 54 verified 200, the
> hand-built design library is the index). Per-deployment URLs are SSO-gated; this project
> alias is public.
>
> The root cause was not a stray `git add -f`: `output/.gitignore`'s `!sessions/**` was
> overriding the root `.gitignore`'s image rules for every session folder. Fixed with an
> explicit binary deny-list. See `plan-r2-prototype-hosting.md` and
> `docs/guides/prototype-hosting.md`.
>
> **Still to do:** commit and deploy (`develop → staging → PR to main`). Nothing has been
> committed or pushed. The everything-below section is kept as the record of why the deploy
> was stopped.
>
> **Pre-existing, unrelated to this work:** the sector video tiles (e.g. `home-43`'s RETAIL
> tile) show their flat poster rather than playing. Confirmed identical on the original
> pre-rewrite HTML served with local assets, so it is not a migration regression. R2 serves
> the mp4 correctly (206 with range support).

---

> **⚠️ READ THIS FIRST — the deploy was deliberately stopped mid-flight.**
> A commit containing **117MB of unreferenced PNGs** was made and then **undone**. Nothing was
> ever pushed. The next session's first job is the R2 migration described in
> "**Blocked: R2 migration before deploy**" below, _then_ the deploy. Do not simply
> `git commit && push` — that is the exact outcome this stop was to avoid.

**Status:** blocked — 54 prototypes built and verified; deploy halted so prototype assets can
be moved to R2 before anything enters git history.
**Branch:** `develop` at `141f1a79` — **identical to `origin/develop`. Nothing has been pushed.**
**Working tree:** 156 files **staged** (the session folder, from the undone commit) plus two
**unstaged** doc edits: `CLAUDE.md` and `CHANGELOG.md`.
**`sites/dcs`:** verified clean — untouched by this session.

## Blocked: R2 migration before deploy

Ricky, on being told the 117MB would be permanent in git history once pushed:

> _"Actually, we probably should build it into this deploy, or we end up with it always in our
> history. So, stop the deployment."_

and earlier:

> _"In an ideal world, we will probably move any assets that we create and they use for
> prototyping and put them into R2, where they will persist as we do with sites that we build."_

### Why this is still fixable

A commit (`f326a724`) containing everything **was** created, then removed with
`git reset --soft HEAD~1`. `origin/develop` never moved. **Verified:** local HEAD and
`origin/develop` are both `141f1a79`. The 117MB has never touched a remote and is not in any
reachable history. It only becomes permanent if someone commits and pushes it.

### The asset situation — measured, not assumed

|                                      | files | size      | referenced by prototypes |
| ------------------------------------ | ----- | --------- | ------------------------ |
| `assets/img/*.png` (2048px archives) | 29    | **117MB** | **0**                    |
| `assets/img/web/*.jpg` (1600px)      | 29    | 8.6MB     | 24                       |
| `assets/video/*.mp4`                 | 4     | 5.3MB     | 4                        |

The 117MB is **pure archive — nothing references it.** That is the whole problem and also why
it is easy to solve.

### R2 is ready — verified 2026-08-18

- **Credentials present** in `.env.local`: `R2_ACCOUNT_ID`, `R2_ACCESS_KEY_ID`,
  `R2_SECRET_ACCESS_KEY`, `R2_BUCKET_NAME` all set. `R2_PUBLIC_URL` is **not** set — the tools
  do not appear to need it, but check before assuming.
- **Public URL shape** (from existing site content):
  `https://pub-a159d5c51e44442897e06986a53dda1d.r2.dev/<path>` — e.g.
  `.../dch-automotive/stitch-images/led-auto-lamps`.
- **Existing tooling** (read these before writing anything new):
  `tools/upload-djfox-to-r2.ts` (S3 client + `PutObjectCommand`, reads `.env.local`),
  `tools/images-intake.ts`, `tools/update-to-r2-urls.ts`.
- No `rclone`, `aws` or `wrangler` on PATH — use the repo's own tsx tools.

### The decision a fresh session must get from Ricky first

**Which assets go to R2?** Two defensible answers with a real trade-off:

1. **Archives only** (the 117MB of root PNGs). Removes 94% of the weight, keeps the 14MB of
   referenced web JPEGs and video in git, and **the prototypes keep working offline from
   `file://`** — which is how Ricky reviews them. Simplest, lowest risk.
2. **All prototype assets**, matching how built sites work. Repo stays tiny and assets persist
   independently — but every referenced URL across 54 files must be rewritten to R2, and **the
   prototypes then require an internet connection to render**. Ricky's "in an ideal world"
   message points here; his review workflow points at option 1.

Do not guess. This changes 54 files if it is option 2.

### Suggested sequence once decided

```bash
# 1. upload (adapt the existing tool; do NOT hand-roll a new uploader)
#    suggested key prefix, matching the dch-automotive convention:
#      dcs-prototypes/2026-08-17/<filename>
npx tsx tools/upload-djfox-to-r2.ts   # READ IT FIRST — it is site-specific, needs adapting

# 2. verify every uploaded object is fetchable before deleting anything local
#    curl -sI <public-url>/<key> | head -1   → expect 200

# 3. only then remove the local archives
rm output/sessions/2026-08/2026-08-17_dcs-homepage-redesign/prototype/assets/img/*.png

# 4. add a .gitignore rule so they can never be re-added
#    e.g.  output/sessions/**/prototype/assets/img/*.png

# 5. unstage everything and re-stage clean, then verify the size before committing
git reset
git add output/sessions/2026-08/2026-08-17_dcs-homepage-redesign/ CLAUDE.md CHANGELOG.md
git diff --cached --stat | tail -1        # sanity-check the total
```

**Verify the staged payload is small before committing.** The previous attempt's commit added
100,201 insertions and pushed the pack to ~107MB.

### Then, and only then, deploy

`.claude/deploy.md` is authoritative and was already resolved:

- **base:** `develop` · **promotion:** staircase → `staging` → `main` · **docs:** `update.docs`
- Gates are enforced by pre-push hooks (type-check + lint, turbo, all packages). No site was
  modified, so no per-site lint is needed.
- **`main` is protected** — a direct push returns `GH006`. The final rung is
  `gh pr create --base main --head staging --fill`, then **stop**; a human owns the merge.

## Documentation work already done (unstaged, ready to include)

Both edits are in the working tree and should go in the same commit:

- **`CLAUDE.md`** — two verified CSS gotchas added to the CSS Syntax section: the `transform`
  containing-block trap on centred floating navs (independent of `backdrop-filter`), and
  `tabular-nums` corrupting comma'd prices (`£1,995` → `£1 , 995`).
- **`CHANGELOG.md`** — a `2026-08-18` entry covering both gotchas plus the design session,
  following the precedent of the `2026-08-04` entry which documented a CLAUDE.md gotcha the
  same way.

`/update.docs` was run as part of the halted deploy. Its finding: the commit touches only
`output/sessions/`, so `README.md`, `AGENTS.md` and `docs/**` need **no** changes — the
CHANGELOG explicitly scopes itself to "notable platform-level changes" and has never
referenced prototypes or design rounds, so only the two genuine platform gotchas were added
rather than manufacturing an entry for the prototypes alone.

## What this is trying to resolve

The DCS site (Digital Consulting Services, Ricky's own agency) works but doesn't sell. The
April 2026 attempts (`2026-04-08_dcs-redesign` → `2026-04-12_dcs-parity`) went straight into
React and produced that outcome. This session restarts the redesign using the process that
worked for NP Racing: **static HTML prototypes iterated until a direction is agreed, and only
then rebuilt in React inside `sites/dcs`.**

Explicit user decisions that constrain the work — a fresh session will otherwise re-litigate
these:

1. **Positioning is broad.** DCS builds websites for small businesses of _any_ kind. Trades are
   one sector among several, never the frame. (Corrected in round 2; `content-brief.md` is v2.)
2. **Register is an elevated design studio**, not an under-construction site notice. Hi-vis,
   hazard tape, dockets, job sheets and road signs are ruled out by name.
3. **Reference is [kota.co.uk](https://kota.co.uk)** — for _ambition_, explicitly **not** to be
   cloned. See `reference-kota.md`.
4. **The pitch:** "work that competes with London/NYC agencies, for a fraction of the cost and
   a tiny fraction of the client effort." The site is the proof of the first claim.
5. **Colour is furniture, not walls.** Grounds/panels/sections stay neutral; saturated colour
   belongs to content, moving elements and objects. Ricky's phrase: _"the furnishings rather
   than the walls, ceilings and floors."_
6. **Every section fits one viewport** at ≥1024px (relaxed on mobile and below stated height
   floors).
7. Ricky's colour preferences: bright orange and bright purple are his favourites; he is
   ambivalent about pink ("I like it but I'm not a pink guy").

## Actions taken

No commits. All work is files in this session folder. Chronologically:

| Round | Directions | What                                                                                              |
| ----- | ---------- | ------------------------------------------------------------------------------------------------- |
| 1     | 01–12      | Twelve prescribed art directions, one agent each, different UI skill each                         |
| 1b    | 13–18, 16b | Six built by the `impeccable` skill choosing its own visual world, plus one seeded A/B re-roll    |
| 2     | 20–25      | Elevated round on the revised (broader, non-trades) brief                                         |
| 3     | 26–30      | Assertive round against the kota reference                                                        |
| 4     | 31–42      | Twelve variations on direction 27 "Poster" — 6 chords × 2 nav treatments                          |
| 5     | 43–54      | Ultra chord + Flare-style counterpoint bar; dark and light heroes; Poster chord; tertiary options |

Full detail per round, including every agent's findings, is in **`session.md` (787 lines)** —
that is the record; this file is only what the next session needs to _act_.

## Current state — verified 2026-08-18

- **54 prototypes** in `prototype/`, plus `prototype/index.html` (the library page).
- **Library page** renders all 54 as **live scaled iframes**, not screenshots, so it never goes
  stale. Filters by round. Opens on round 5. The `DIRECTIONS` array parses as 54 entries
  (verified with `node -e` eval).
- **Media:** 29 web-optimised images (`prototype/assets/img/web/*.jpg`, 1600px) and 4 silent
  video loops (`prototype/assets/video/*.mp4`, faststart-remuxed). Root PNGs are 2048px/3–7MB
  archives — **do not use them**.
- **Round 5 is the live branch of work**, 12 directions:

  |                         | Counterpoint                                        | Acid/cyan | Tonal flip |
  | ----------------------- | --------------------------------------------------- | --------- | ---------- |
  | Ultra, dark hero        | 43                                                  | 44        | 45         |
  | Ultra, light hero       | 46                                                  | 47        | 48         |
  | Poster chord, dark hero | 49                                                  | 50        | 51         |
  | Poster tertiary options | 52 indigo · 53 oxblood · 54 deep teal (all from 50) |           |            |

- **Viewport fit verified** for round 5 at 1440×900, 1366×768, 1440×800, 1600×800 and
  1920×720 — measured as natural content height with the `min-height:100svh` pin released,
  which is the only way to get a true reading.
- **Six directions are off-brief** and kept as record only, dimmed in the library and excluded
  from the default filter: **06, 13, 15, 16, 16b, 17** (hi-vis / hoarding / road sign / docket /
  tool case / merchant counter). They pre-date the round 2 brief correction.
- **No live-data changes of any kind.** This session wrote no production data, touched no
  database, and deployed nothing. Two real-world side effects did occur, both outside the repo —
  see the next section.
- **Background processes:** all stopped (`caffeinate` and the local server both confirmed dead).

## Side effects outside this repo — do not repeat

Not live _data_, but real and already done. A fresh session must not redo these.

- **`impeccable` skill installed globally** at `~/.claude/skills/impeccable` (v4.1.1,
  Apache-2.0, real directory, npm deps present so the detector runs at full strength).
  Its bundled agents are in `~/.claude/agents/impeccable-*.md`.
  **Its hooks were deliberately NOT enabled** — its shipped `settings.json` registers
  `PostToolUse`/`Stop` hooks that would run its detector after every edit across all projects.
  Ricky has not been asked to approve that.
  **Outstanding:** a duplicate copy still exists at `~/.agents/skills/impeccable` from the
  install staging. Byte-identical today, will drift on update. Ricky was asked and has not yet
  said whether to remove it — **do not delete it unilaterally.**
- **Higgsfield credits spent: 300** of an original 1,198. Balance verified at **897.85** on
  2026-08-18. Spent on 23 images and 4 videos, all already downloaded into `prototype/assets/`.
  **Do not regenerate them.**

## What was NOT done

- **No React. Nothing in `sites/dcs` was touched.** Verified clean.
- **Nothing committed, nothing pushed.** The whole session folder is untracked.
- **No direction has been chosen.** All 54 are candidates except the six off-brief ones.
- **Homepage only.** No Services, Pricing, Portfolio, Blog, About or Contact page exists in any
  direction.
- **`sites/dcs/site.config.ts` still carries the old trades-only service wording** and would
  need the same generalisation `content-brief.md` §5 applies. Noted, not done.
- **Contrast triage never completed.** The impeccable detector at full strength reports ~1,296
  findings across the round 1–3 files, of which the objective subset is 148 `low-contrast` +
  25 `gray-on-color`. **6 are provably impossible** (a colour against itself); the remaining
  **142 were never triaged** to separate real failures from static-pairing artifacts. Rounds 4–5
  are much cleaner (several directions measured 0 failures on rendered pixels) but the older
  files were never swept.
- **Rounds 1–3 were never re-verified at the corrected viewport sizes.** Only round 4 and 5 got
  the wide sweep. Directions 01–30 may fail at 1366×768 / 1440×800 — unknown, never measured.
- **Direction 34 still fails** at heights ≤740px (+18px at 1440×740, +31px at 1920×720). Left
  deliberately; all realistic sizes pass.
- **Mobile is relaxed, not solved.** Below 768–1024px (varies by direction) sections flow
  naturally rather than fitting the viewport. That was the brief, but no direction has had a
  proper mobile design pass.
- **`session-wrap-up.md` has not been written.** This work is mid-flight, not shipped.

## Traps

Every one of these cost time this session. They will mislead a fresh session identically.

1. **`getComputedStyle` lies about transitioning/scroll-driven state.** It produced two full
   false alarms — a "flat image" bug and a "broken nav bar" — both disproved by a single
   screenshot. **For anything resolving through transitions, custom properties or scroll state,
   screenshot first and measure second.**
2. **The reference viewport sizes are wrong by ~90px.** 1440×900 and 1280×800 are _screen_
   dimensions; a real 1440×900 laptop yields ~810px of viewport after browser chrome. Both are
   also exactly **16:10**, which makes an entire failure class invisible — type sized off
   viewport _width_ happens to scale with height at a fixed aspect ratio, and breaks at 16:9.
   **Any layout rule verified at one aspect ratio is undertested.**
3. **`font-variant-numeric: tabular-nums` corrupts prices.** Schibsted Grotesk (and Newsreader)
   give the thousands comma a full digit slot, rendering **"£1,995" as "£1 , 995"**. It
   inherits, so an ancestor `.num` breaks a figure that looks clean itself. Hit in 6+ directions.
   Resolve `font-variant-numeric` _up the ancestor chain_ when checking.
4. **Never symlink the impeccable skill.** Scripts invoked through a symlinked path **exit 0
   with no output on stdout or stderr** — a silent failure that disabled its concept seed for a
   whole direction.
5. **Its detector writes findings to stderr.** `2>/dev/null` reports a false zero.
6. **`python3 -m http.server` does not support HTTP Range**, so video hangs at `readyState 0`
   and looks broken. A range-capable server is at
   `/private/tmp/claude-501/.../scratchpad/rangeserver.py` (scratchpad — **will not persist**;
   rewrite it if needed).
7. **Playwright's bundled Chromium cannot decode H.264.** System Google Chrome plays the videos
   fine (`readyState 4`, confirmed by four directions). A `readyState 0` is a harness
   limitation, **never a bad asset — do not delete or regenerate the MP4s on the strength of it.**
8. **Media honesty rules are binding and non-obvious.** No generated image may be captioned as a
   real named client's premises/van/team, and none may be presented as Ricky, "our team" or "the
   person who builds your site" — there is no photograph of him. **`sector-office.jpg` is the
   specific trap:** two people at a table seen from behind, safe as a professional-services
   sector tile, unsafe beside process step 1 ("A conversation") or first-person copy, because a
   reader will infer one of them is him. Full rules in `prototype/assets/img/MANIFEST-round4.md`.
9. **The six off-brief directions look finished and are not candidates.** They are good work
   against a superseded brief. Don't resurrect one because it looks strong in isolation.
10. **`--lilac` in the Poster-chord files is my invention**, not Poster's own chord. It was a
    light-tint slot needed when mapping Ultra's tokens onto Poster's palette.
11. **A `#pricing` ID selector out-specifies `.panel` rules.** Cost a whole debugging pass when a
    short-viewport recovery rule silently failed to apply to pricing.

## Next step

**First: the R2 migration above, then the deploy.** Only after that does design work resume.

**Then: nothing is built until Ricky picks a direction.** To review:

```bash
open output/sessions/2026-08/2026-08-17_dcs-homepage-redesign/prototype/index.html
```

Opens on round 5 (12 directions). Filter to any round, or "Everything (54)".

Once a direction is chosen, in order:

1. **Round 6 — inner pages for the winner only.** Services, Pricing, Portfolio, About, Contact,
   in the chosen direction's system. Same process: one agent per page, each rendering and
   verifying its own file.
2. **A proper mobile design pass** on the winner — currently relaxed, not designed.
3. **Only then rebuild in React** in `sites/dcs`, with `site.config.ts` service copy
   generalised per `content-brief.md` §5.

If instead the next task is to keep iterating on the homepage, the working set is
**43–54** and the parent of that branch is `home-33-ultra-adaptive.html`.

## Open questions for Ricky

1. **R2 scope — archives only, or all prototype assets?** Blocks the deploy. See
   "Blocked: R2 migration before deploy" above; option 2 rewrites URLs in 54 files and costs
   offline review.
2. **Which direction?** Nothing proceeds on the design work without this.
3. **The one-viewport rule.** It is what caused the cramped padding he objected to — pricing
   sits at ~100% of the viewport, so uniform padding was set by the densest section. Keeping it
   costs air on hero and pricing permanently. Worth confirming he still wants it before it
   shapes the React build.
4. **Remove the duplicate `~/.agents/skills/impeccable`?** Asked, not yet answered.
5. **Enable impeccable's detector hooks?** Deliberately left off; they change harness behaviour
   across all projects.
