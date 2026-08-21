# DCS homepage — round 9 (Kota-level rebuild) — handoff

**Status:** in-progress — a single homepage prototype (`r9-kota-level.html`) is built, animated and
substantially art-directed with Ricky in the loop. It is **committed but not pushed, not deployed,
and has never been viewed at 390px.** Three AI videos were generated and are **gitignored**, so they
exist only on this machine even now that the rest is committed.
**Branch:** `develop`, **2 commits ahead of `origin/develop`** (base `03ef16d6`). **Not pushed.**
**Commits:** 2 — `789b65ef` (pricing page corrections) and this one (self-referential, so not named).
**Working tree:** clean for this work. Two pre-existing untracked items remain and are not ours:
`supabase/` and a codex `openrouter-response.json`.
**Supersedes:** the round-5 "direction 52" handoff previously at this path (recoverable via
`git show 03ef16d6:output/sessions/2026-08/2026-08-17_dcs-homepage-redesign/HANDOFF.md`).
**Chains from:** `../2026-08-20_framer-gallery-research/HANDOFF.md` — the round-8 reset. Read its
"THE HEADLINE" section; the diagnosis there is why this round exists. ⚠ **That file is itself
uncommitted** (see Traps).

---

## What this is trying to resolve

DCS needs a new homepage. Rounds 1–7 produced 68 static HTML prototypes, all rejected. Round 8's
reset established the cause: the brief had been written as a motion _ban list_ whose only pass/fail
test was "readable with JavaScript disabled", so building nothing that moved was the winning
strategy. Round 7 shipped twelve well-composed **static** pages and failed its own objective.

This session started over. Key user decisions that constrain any further work:

- **Scope is the homepage only.** Not inner pages, not the whole site.
- **Build as a standalone HTML prototype** under `output/sessions/`, not directly in `sites/dcs`.
  Ricky chose this knowing it is the method that produced the 68 rejects.
- **Positioning is broad** — small owner-run businesses of every sector. Trades are one slice, not
  the definition. `site.config.ts` still says otherwise (see What was NOT done).
- **The reference is `kota.co.uk`**, pinned by Ricky, and a pinned reference beats the concept roll.
  Take the _ambition and register_, never the identity — Kota is a competing agency, and cloning the
  benchmark is the one move that proves you couldn't meet it. Full analysis in `reference-kota.md`.
- Two direction rolls (a grounded hand, then a "bolder" hand) were run and **both rejected** —
  "sepia, boring", "I want it to look like a design agency not an architect". Do not re-run the
  concept seed; the direction is settled by Ricky's reference.

---

## Actions taken

Two commits on `develop`, neither pushed:

| SHA        | What                                                                       |
| ---------- | -------------------------------------------------------------------------- |
| `789b65ef` | Pricing page: figures, 24-month term, phantom £59 metadata, ownership line |
| _(head)_   | Round 9 prototype, `PRODUCT.md`, `.impeccable/`, both handoffs             |

Chronologically, what was built:

1. **`sites/dcs/PRODUCT.md` written** — durable product truth, replacing the
   session-folder copy for build purposes. Includes the "motion is evidence, not ornament" finding
   so no future round can re-derive round 7's mistake.
2. **`.impeccable/config.json`** written with `buildPath: "comp"` (Ricky chose comp-first).
3. **Two rejected direction rounds**, with comps generated via Gemini 3 Pro Image
   (`GOOGLE_AI_API_KEY`, already in `.env.local`). Comps in `sites/dcs/.impeccable/mocks/decision/`
   and mirrored to `prototype/r8-comps/`. Both are **gitignored**.
4. **`r9-kota-level.html` built** — the live candidate. Everything below was iterated with Ricky.
5. **Three Higgsfield videos generated, optimised and wired** (see Live changes).
6. **`sites/dcs/app/pricing/page.tsx` corrected** — the only change to real site code.

---

## Current state — verified 2026-08-21

Everything here was measured or run today.

### The prototype — `prototype/r9-kota-level.html`

Verified by DOM query and screenshots, not recalled:

|                   |                                                                                                                                                  |
| ----------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| Typeface          | **Archivo** (`--f:'Archivo'`), one family throughout. Poppins 300 for the logotype only                                                          |
| Ground order      | `ink(hero) → white(work) → magenta(services intro) → [6 service cards] → ink(process) → white(pricing) → magenta(faq) → aqua(quote) → navy(end)` |
| Prices (upfront)  | £750 + £10/mo · £1,495 + £15/mo · £2,995 + £25/mo                                                                                                |
| Prices (monthly)  | £45 · £85 · £150 — **this is the default tab**, per Ricky's retention preference                                                                 |
| Service cards     | 6, each `min(80vh,720px)`, stacking with fanned sticky offsets (78→128px)                                                                        |
| Client cards      | 2×2, white with 1px ink outline, name above a full-bleed video                                                                                   |
| `sites/dcs` gates | `type-check` **PASS**, `lint` **PASS**                                                                                                           |

**Structure:** fixed bar with `data-ground` driving `--bar-bg/--bar-fg/--bar-rule/--bar-acc`
together (ported from `home-52`); burger menu + "Hire me" pill; black hero with a magenta plate on
"Websites"; 2×2 client grid; six scroll-stacked service cards; process; pricing with a
monthly/upfront toggle; six-question Q&A on `<details>`; testimonial; contact panel with the footer
folded into it.

**Motion actually present** (this is the thing round 7 lacked): per-character headline assembly,
scroll-linked ground tracking, sticky panel stacking, six fanned service cards, grey→ink text
resolve, hover overlays that darken and centre, four autoplaying videos, `grid-template-rows`
accordion. All armed inside `@media (prefers-reduced-motion: no-preference)`; nothing is gated on
`opacity: 0` at rest.

### Bugs found and fixed this session (all verified fixed)

- `overflow-x: hidden` on `<body>` made body its own scroll container — killed every scroll event,
  all programmatic scrolling and anchor jumps. Now `overflow-x: clip` on `<html>`.
- Hero dim line measured **2.72:1**, below the 3:1 large-text floor. Darkened.
- Pricing tier name/sub rendered `inline`, running together.
- Sticky panels taller than the viewport lost their bottom content — `max-height:900px` query added.
- Headline descenders clipped by a leftover `overflow:hidden` on each line.
- **Self-inflicted:** the ticker-removal regex was greedy and deleted the entire `.cards`/`.mock`
  stylesheet, making the work panel 2788px tall in a 779px viewport. Restored.

### Other files

- `prototype/r9-typelab.html` — nine display faces at hero scale with per-face tracking. Archivo
  was chosen from it. Keep; it is the decision record.
- `prototype/r9-index.html`, `r8-index.html`, `r8-a-survey-sheet.html` — the two rejected direction
  rounds. Reference only.
- `prototype/frame-check.html` — throwaway video frame-grabber, **deleted** before committing.

### Unverified

- **390px has never been rendered.** Not once, all session.
- Firefox/Safari — Chrome only.
- The `home-5x` prototypes were not re-checked; assume they still work but nothing was confirmed.

---

## Live-data / machine changes already applied

No production website data was written. But four things changed outside the repo:

| Change                                                                   | Where                                   | Reversible?                        |
| ------------------------------------------------------------------------ | --------------------------------------- | ---------------------------------- |
| **30 Higgsfield credits spent** (3 × 10, Kling 3.0 Turbo)                | Ricky's Higgsfield account              | No. Balance **867.85**, was 897.85 |
| `@higgsfield/cli` **1.1.23** installed globally                          | `~/.npm-global/bin/higgsfield`          | `npm rm -g @higgsfield/cli`        |
| **Higgsfield authenticated** — Ricky ran `higgsfield auth login` himself | `~/.config/higgsfield/credentials.json` | `higgsfield auth logout`           |
| **ffmpeg 9.0.1 installed** via Homebrew                                  | `/opt/homebrew/bin/ffmpeg`              | `brew uninstall ffmpeg`            |

Also: the stale `npracing-v1` dev server on **port 3000** (running since 14 Aug, serving 500s) was
killed and restarted. It is **npracing, not dcs** — see Traps.

**Do not re-generate the three videos.** They exist and are optimised.

---

## What was NOT done

- **390px is completely unauthored.** The single largest gap. Both card grids collapse to one column
  by media query, the hero grid stacks, the service-card stack has an untested `max-width:820px`
  branch, and the pricing toggle has never been seen at that width. Ricky's original complaint about
  rounds 1–7 was _"the mobile responsiveness was dreadful"_ — that half is still unaddressed.
- **Nothing was deployed.** The prototype has only ever run on a local `python3 -m http.server`.
- **No React work.** `sites/dcs` components are untouched; only `app/pricing/page.tsx` and two new
  files (`PRODUCT.md`, `.impeccable/`).
- **Trades-only positioning still live.** `sites/dcs/site.config.ts` tagline is still "Websites that
  get local tradespeople more jobs", and `app/pricing/page.tsx` metadata still says "tradesperson
  websites" — against the broad positioning Ricky confirmed.
- **`content/projects/cuddle-plush-fabrics.mdx` still says "five years"** in three places
  (description, an outcome bullet, and "Five years on, we're still managing their site"). Ricky
  confirmed the relationship began **2014** — twelve years. A live page understates his longest
  client by seven years.
- **The Cuddle Plush automation is not in the MDX.** Automated product loading from wholesaler sites
  - backorder handling was confirmed verbally this session and recorded only in `PRODUCT.md`.
- **The Clothing Kings video has garbled AI lettering** stitched into the embroidered emblem.
  Known, not fixed. ~10 credits to re-roll.
- **All three clips hard-cut at the 5s loop point.** Most visible on the embroidery one.
- **`sites/dcs/PRODUCT.md` duplicates the session-folder `PRODUCT.md`,** which declares itself the
  canonical one. Two records now exist and they have diverged (the sites/dcs one is current).
- **`output/sessions/.current-session` is still stale**, pointing at `2026-07/2026-07-18_deploy-hardening`.

---

## Working tree

Modified (2):

```
output/sessions/2026-08/2026-08-20_framer-gallery-research/HANDOFF.md   ← round-8 reset, UNCOMMITTED
sites/dcs/app/pricing/page.tsx                                          ← price/term corrections
```

Untracked and new this session:

```
output/sessions/2026-08/2026-08-17_dcs-homepage-redesign/prototype/r9-kota-level.html
                                                        .../r9-typelab.html
                                                        .../r9-index.html
                                                        .../r8-index.html
                                                        .../r8-a-survey-sheet.html
                                                        .../frame-check.html      ← delete
sites/dcs/PRODUCT.md
sites/dcs/.impeccable/
```

Pre-existing, unrelated, do not commit: `supabase/`,
`output/sessions/codex-peer-review/.../openrouter-response.json`.

---

## Traps

1. **🔴 Every new image and video is gitignored.** `output/.gitignore` blocks `*.mp4` and `*.jpg`
   under `sessions/**`. That covers all three Higgsfield clips, their posters, and every comp in
   `prototype/r8-comps/` and `sites/dcs/.impeccable/mocks/decision/`. Confirmed with
   `git check-ignore -v`. **They cost 30 credits and will vanish on a fresh clone.** To preserve
   them, upload to R2: `npx tsx tools/upload-prototype-assets.ts <prototype-dir>` — see
   `docs/guides/prototype-hosting.md`. Do this before any clean-up.
2. **The round-8 reset handoff is uncommitted.** `../2026-08-20_framer-gallery-research/HANDOFF.md`
   shows as modified; the committed version is an older "ready-to-resume" text that says zero
   prototypes were built. The version on disk — the one worth reading — exists only here.
3. **Port 3000 is `npracing-v1`, not dcs.** It was restarted this session. Do not assume a dev
   server on 3000 is the DCS site. `sites/dcs` has no dev server running.
4. **The prototype server dies with the session.** It was
   `python3 -m http.server 4321` run from the prototype directory. Every `localhost:4321` URL in the
   conversation is dead until you restart it.
5. **`requestAnimationFrame` is paused when the tab is backgrounded**, which is the state during
   `javascript_tool` evaluation. Any measurement of scroll-driven state (the nav ground, reveal
   classes) will read **stale** and look like a bug. It cost a long false diagnosis this session.
   Verify motion with **real wheel events** via the `computer` tool's `scroll` action and paired
   screenshots, never `window.scrollTo`.
6. **The `scroll` action's own auto-capture fires mid-repaint** and frequently returns a blank grey
   frame. Only trust screenshots taken _after_ an explicit `wait`.
7. **`serve-question.mjs` does not survive the Bash call that starts it.** `--start` returns a URL
   and key, then the daemon is reaped, so `--update` fails with "no live question server". Use the
   structured question tool instead, or re-`--start` each time.
8. **Comma'd prices must stay in Archivo, never a mono face.** `£1,495` and `£2,995` are the live
   examples. A monospaced face renders `£1 , 995` — see root `CLAUDE.md`.
9. **The burger menu overlay is deliberately a sibling of `.bar`, not nested inside it.** Moving it
   inside would trap the fixed overlay in the bar's box.

---

## Next step

Restart the server and look at it before changing anything:

```bash
cd output/sessions/2026-08/2026-08-17_dcs-homepage-redesign/prototype
python3 -m http.server 4321   # then open http://localhost:4321/r9-kota-level.html
```

Then, in priority order:

1. **Preserve the videos** — they are gitignored and cost real money:
   ```bash
   npx tsx tools/upload-prototype-assets.ts \
     output/sessions/2026-08/2026-08-17_dcs-homepage-redesign/prototype
   ```
2. **Design 390px explicitly.** Author it, do not reflow. `resize_window` does not work in this
   Chrome tooling — inject the page into a same-origin `<iframe width="390">` and screenshot that.
3. **Push**, then promote per `CLAUDE.md` (develop → staging → main). The two commits exist only on
   this machine until then.
4. **Deploy the prototype for review on a real phone:**
   ```bash
   npx tsx tools/publish-prototype.ts \
     output/sessions/2026-08/2026-08-17_dcs-homepage-redesign/prototype --project dcs-prototypes
   ```

Optional, cheap, already specified:

```bash
# re-roll the Clothing Kings clip without the fake lettering (~10 credits)
higgsfield generate create kling3_0_turbo --prompt "<as before> ... an abstract emblem with no letters or text" \
  --duration 5 --resolution 1080p --aspect-ratio 16:9
# then, from prototype/assets/video/
ffmpeg -y -i <raw>.mp4 -vf "scale=1280:-2" -c:v libx264 -preset slow -crf 23 \
  -pix_fmt yuv420p -profile:v high -movflags +faststart -an the-clothing-kings.mp4
ffmpeg -y -i the-clothing-kings.mp4 -vf "select=eq(n\,0),scale=1280:-2" -frames:v 1 -q:v 6 the-clothing-kings.jpg
```

---

## Open questions

1. **Is `r9-kota-level.html` the direction?** Ricky has been iterating it closely for hours, which
   reads as acceptance, but he has never said so. Everything downstream depends on it.
2. **Do The Clothing Kings and Cuddle Plush have live URLs?** Their cards link to `#end`; NP Racing
   and SM Commercial link out to real sites. Inconsistent until the two domains are supplied.
3. **Fix the loop seams?** Ping-pong encode (seamless, but reversed machinery can look wrong) or a
   short crossfade. Originals are still on Higgsfield's CDN, so no credits either way.
4. **Which `PRODUCT.md` is canonical** — `sites/dcs/PRODUCT.md` or the session-folder one?
5. **Port the winner to React in `sites/dcs`, or keep iterating in HTML?**
6. **Should the trades-only copy pass happen now?** It touches `site.config.ts`, the pricing page
   metadata and several MDX files — a separate job from this prototype.
