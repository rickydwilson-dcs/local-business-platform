# DCS homepage — round 9 — handoff

**Status:** in-progress — the round-9 prototype now has an authored mobile layer, a redesigned
client-work section, and a fifth client. All of it is **uncommitted**, unpushed and undeployed, and
the new video asset is **gitignored** so it exists only on this machine.
**Branch:** `develop`, **2 commits ahead of `origin/develop`** (base `03ef16d6`). **Not pushed.**
**Commits:** 2 — `789b65ef` (pricing page corrections), `18b9eca3` (round 9 prototype). **Nothing
from this session is in either of them.**
**Working tree:** 1 modified + 2 new, all this session's work:

```
 M prototype/r9-kota-level.html      ← mobile layer, work-section redesign, 5th client
 ?? prototype/mobile-frame.html      ← 390px preview harness (new)
 ?? prototype/r9-worklab.html        ← work-section options lab (new, decision record)
```

Pre-existing, unrelated, do not commit: `supabase/`, `output/sessions/codex-peer-review/.../openrouter-response.json`.

**Supersedes** the previous version of this file, committed at `18b9eca3` and recoverable with
`git show 18b9eca3:output/sessions/2026-08/2026-08-17_dcs-homepage-redesign/HANDOFF.md`. Read it for
rounds 1–8 background and the Kota reference rationale; everything below is what changed since.

---

## What this is trying to resolve

Round 9 built `r9-kota-level.html` — a desktop homepage at the craft level of the pinned reference
(`kota.co.uk`). The prior handoff's single largest gap was that **390px had never once been
rendered**, against Ricky's original complaint that rounds 1–7 had "dreadful" mobile responsiveness.
This session closed that, then Ricky redirected twice:

1. **"check that the sections do fill vh so that the entire view changes colour on scroll"** — they
   did not; fixed.
2. **"the cards are too boring… the current section we have feels incongruent to rest of design"** —
   the 2×2 bordered client-card grid was the only card treatment on a page otherwise built from
   full-bleed colour walls. Three options were built; Ricky chose the full-bleed stack.
3. **Add a fifth client** (Colossus Scaffolding) with a generated timelapse video.

Constraints carried from earlier rounds, still binding: scope is the homepage only; build as a
standalone HTML prototype under `output/sessions/`, not in `sites/dcs`; positioning is broad (all
small owner-run businesses, not trades); take Kota's register, never its identity.

---

## Actions taken (this session, chronological)

All in `prototype/r9-kota-level.html` unless stated.

1. **Authored the 390px layer.** Everything inside `@media (max-width:900px / 360px / hover:none)`
   so desktop stayed byte-identical. Hero display type resized from the longest unbreakable word;
   panel rhythm; pricing rebuilt as three whole cards; the craft floor (44px targets, 16px prose,
   safe-area, hover-latch neutralisation) restored per `mobile-lab.html` doctrine.
2. **Made every panel fill the viewport** — `min-height` was `82svh`, which could never cover the
   band under the fixed bar. Now `calc(100lvh + 110px)`.
3. **Built `r9-worklab.html`** — three replacements for the work section (A pill reel, B full-bleed
   stack, C index & reveal), each live at both breakpoints. Ricky chose **B**.
4. **Grafted option B in**, replacing the 2×2 card grid with a white chapter opener (naming all
   clients as anchor chips) plus sticky full-viewport video panels.
5. **Added Colossus Scaffolding as client 05**, including a generated Higgsfield timelapse.
6. **Fixed the last panel never pinning** (see Current state).

No changes to `sites/dcs` or any other site this session.

---

## Current state — verified 2026-08-22

Every figure below was measured today in a 390px (or 320px) same-origin iframe, or at the desktop
viewport. Nothing here is recalled.

### Prototype geometry

|                           | mobile 390×844                                    | mobile 320×844 | desktop 1512×725            |
| ------------------------- | ------------------------------------------------- | -------------- | --------------------------- |
| Document height           | **18,821px** (22.3 screens)                       | 19,044px       | **15,116px** (20.8 screens) |
| `scrollWidth` vs viewport | 381 / 390                                         | 311 / 320      | 1503 / 1512                 |
| Horizontal overflow       | **none**                                          | **none**       | none                        |
| Touch targets < 44px      | **0**                                             | **0**          | —                           |
| Prose under 16px          | 0 (excluding `.detail`, `display:none` on mobile) | —              | —                           |

### Work section — five sticky full-bleed video panels

Pinned scroll distance per panel, measured by sampling `getBoundingClientRect().top` every 40px:

|         | 01 CK | 02 CPF | 03 NPR | 04 SMC | **05 Colossus** |
| ------- | ----- | ------ | ------ | ------ | --------------- |
| mobile  | 4800  | 3760   | 2720   | 1680   | **880**         |
| desktop | 4200  | 3280   | 2400   | 1480   | **720**         |

Gap between panel 05 and the following `#services` panel during handover: **0px at both
breakpoints** (measured across the whole scroll range).

Reading window — scroll distance where a panel's full text block is visible and uncovered:
panels 1–4 = **280 / 300 / 280 / 300px** (verified). Panel 5 was 800px when measured, but **that
measurement predates the `::after` tail fix** — treat panel 5's figure as unverified; its 880px pin
implies it is at least comparable.

### Colossus Scaffolding — the "78 pages" claim

Ricky said 80. The site builds **78**, counted from `sites/colossus-scaffolding`:
10 static routes + 18 services + 37 locations + 5 blog + 2 projects + 6 `services/[slug]/[location]`
matrix pages. The matrix comes from `.mdx` files inside subdirectories of `content/services/`
(2 such dirs, 6 files). **78 is what is on the page.** If Ricky is counting something else
(drafts, planned expansion), this needs changing.

### Bar ground tracking

`ground()` returns `ink` at all five work panels (computed directly, not read off the live bar —
see Traps). All five `.wpanel`s carry `data-ground="ink"`.

### Assumed, not verified

- **Desktop drift.** 30 non-work selectors were compared against the pre-change file at 1440 / 1280
  / 901 and came back identical — but **that check predates the fifth panel and the sticky fix**.
  Those changes touch only new selectors (`.wstack`, `.wpanel`, `.windex`) plus `.wstack::after`, so
  drift _should_ still be zero. Not re-measured. Re-run it before trusting it.
- **`lvh` vs `svh`.** The panels use `lvh` deliberately so a section is never shorter than the
  viewport when mobile browser chrome retracts. In an iframe all four viewport units resolve
  identically (844px), so **this distinction cannot be tested in this harness** — only on a real
  handset.
- Firefox and Safari. Chrome only, all session.
- Anything on a real phone. See What was NOT done.

---

## What was NOT done

- **Never opened on a real handset.** Everything is Chrome in a fixed-width iframe. Safe-area insets
  (`env(safe-area-inset-*)`, added this session with `viewport-fit=cover`) are _specifically_ the
  thing an emulator cannot check — the prior mobile round recorded that exact defect surviving
  because it is invisible outside a notched device.
- **Nothing committed.** The whole session is in the working tree.
- **Nothing pushed or deployed.** The two existing commits still exist only on this machine.
- **The new video is gitignored** and will vanish on a fresh clone. It cost 10 credits.
- **`r9-worklab.html` still shows four clients**, not five, and its Option A pill rail has a known
  unfixed defect (below). It is a decision record for a decision already made; left deliberately.
- **The pill reel's rail defect is unfixed.** Ricky reported it: on a 390px screen the selected pill
  does not scroll into view, so you cannot tell there is a third one. He then chose Option B, so
  this was never addressed. If Option A is ever revisited, this is the first thing to fix.
- **Dead CSS not removed.** `.worksec`, `.cards`, `.card`, `.cards--2` are now unused, joining
  already-dead `.work`, `.row`, `.svcs`, `.svc`, `.slot` from earlier rounds. Left alone on purpose —
  a greedy regex wiped the stylesheet earlier in round 9. Needs a deliberate, verified pass.
- **Colossus has no outbound link.** Like The Clothing Kings and Cuddle Plush, its panel has no live
  URL; only NP Racing and SM Commercial link out. Inconsistent.
- **Loop seams unfixed.** All clips including the new one hard-cut at the 5s loop point.
- Carried forward, still true: **trades-only positioning is still live** in
  `sites/dcs/site.config.ts` and the pricing page metadata; **`content/projects/cuddle-plush-fabrics.mdx`
  still says "five years"** where the relationship began 2014; `sites/dcs/PRODUCT.md` and the
  session-folder `PRODUCT.md` have diverged (the `sites/dcs` one is current);
  `output/sessions/.current-session` is stale, pointing at `2026-07/2026-07-18_deploy-hardening`.

---

## Live-data / machine changes already applied

No production website data was written. One paid action:

| Change                                                             | Where                      | Reversible?                                                                             |
| ------------------------------------------------------------------ | -------------------------- | --------------------------------------------------------------------------------------- |
| **10 Higgsfield credits spent** (Kling 3.0 Turbo, 5s, 1080p, 16:9) | Ricky's Higgsfield account | **No.** Balance **857.85**, was 867.85 — both confirmed via `higgsfield account status` |

Generation id `1d3bb8ea-8573-45eb-9b6f-5a26b0568b38`. Source still on Higgsfield's CDN, so a re-encode
costs nothing; a re-roll costs another 10.

**Do not re-generate any of the four videos.** They exist and are optimised.

Tooling installed in earlier sessions and still present: `@higgsfield/cli` 1.1.23 at
`~/.npm-global/bin/higgsfield` (authenticated), `ffmpeg` 9.0.1 at `/opt/homebrew/bin/ffmpeg`.

---

## Traps

Five of these cost real time this session. The first three caused wrong diagnoses that were only
caught by measuring instead of looking.

1. **🔴 `requestAnimationFrame` is paused in a backgrounded tab**, which is the state during
   `javascript_tool` evaluation. Anything rAF-driven reads **stale**: the nav ground tracking, the
   `.res` grey→ink reveals, smooth scrolling. Twice this session a "bug" was actually this. Verify
   scroll-driven state by _computing what the function would return_, never by reading the live
   result. **Never `await` inside a rAF callback — it will hang the call until the 45s CDP timeout.**
2. **🔴 Screenshots can be stale compositor frames.** Three times, a screenshot showed mismatched
   state (a pill saying one client, the heading another; two index rows highlighted at once) where
   the DOM was provably correct. **Trust `getComputedStyle` / `getBoundingClientRect`, not pixels.**
3. **🔴 `python3 -m http.server` honours `If-Modified-Since` and will serve a stale prototype after
   an edit.** A `100lvh` change measured as having no effect at all until this was found by dumping
   the live CSSOM and seeing the _old_ value. `mobile-frame.html` now cache-busts on every load;
   if you build another harness, do the same.
4. **`resize_window` returns success but does not change the viewport.** Use the iframe harness.
5. **`position: sticky` room comes only from in-flow content after the element.** A bottom _margin_
   gives none (the margin box is what gets clamped) and _padding_ on the container gives none
   (it is outside the content box, which is what the containing block resolves to). Both were tried
   and both measured as 0px of pin. This is why `.wstack::after` exists — delete it and the last
   panel silently stops pinning.
6. **`offsetTop` is relative to the offset parent (`.stack`), not the document.** Scrolling to
   `el.offsetTop` lands in the hero. Use `el.getBoundingClientRect().top + scrollY`.
7. **Every image and video under `output/sessions/**` is gitignored** (`output/.gitignore:21`and`:27`). Confirmed today for `colossus-scaffolding.mp4`, `colossus-scaffolding.jpg`and`np-racing.jpg`.
8. **Port 3000 is `npracing-v1`, not dcs.** `sites/dcs` has no dev server running.
9. **The prototype server dies with the session.** It was `python3 -m http.server 4321` from the
   prototype directory; every `localhost:4321` URL is dead until restarted.
10. **Comma'd prices must stay in Archivo, never a mono face** — `£1,495` renders as `£1 , 995` in a
    mono or `tabular-nums` context. Verified clean today: `.tcard__f` resolves to Archivo with
    `font-variant-numeric: normal` up the whole ancestor chain.
11. **The burger overlay is deliberately a sibling of `.bar`,** not nested inside it.

---

## Next step

Restart the server and look before changing anything:

```bash
cd output/sessions/2026-08/2026-08-17_dcs-homepage-redesign/prototype
python3 -m http.server 4321
# desktop: http://localhost:4321/r9-kota-level.html
# 390px:   http://localhost:4321/mobile-frame.html?p=r9-kota-level.html
# options: http://localhost:4321/mobile-frame.html?p=r9-worklab.html
```

Then, in priority order:

1. **Preserve the videos — they are gitignored and cost real money:**
   ```bash
   npx tsx tools/upload-prototype-assets.ts \
     output/sessions/2026-08/2026-08-17_dcs-homepage-redesign/prototype
   ```
2. **Commit this session's work** (nothing is committed):
   ```bash
   git add output/sessions/2026-08/2026-08-17_dcs-homepage-redesign/prototype/r9-kota-level.html \
           output/sessions/2026-08/2026-08-17_dcs-homepage-redesign/prototype/mobile-frame.html \
           output/sessions/2026-08/2026-08-17_dcs-homepage-redesign/prototype/r9-worklab.html \
           output/sessions/2026-08/2026-08-17_dcs-homepage-redesign/HANDOFF.md
   ```
   Do **not** `git add -A` — `supabase/` and the codex `openrouter-response.json` are unrelated.
3. **Deploy the prototype so it can be seen on a real phone** — the one remaining unverified thing
   that matters:
   ```bash
   npx tsx tools/publish-prototype.ts \
     output/sessions/2026-08/2026-08-17_dcs-homepage-redesign/prototype --project dcs-prototypes
   ```
4. **Push, then promote** per `CLAUDE.md` (develop → staging → main), verifying CI with `gh run watch`.

Tuning knobs, if length is the objection (mobile is 22.3 screens, up from 9,067px/10.7 at the start
of this session):

- `.wstack::after{height:100lvh}` — the last panel's hold. `60lvh` takes back ~340px and still
  leaves a ~500px hold.
- `.wpanel{margin-bottom:26vh}` desktop / `22vh` mobile — the per-panel reading window. Halving it
  takes back ~700px at the cost of the 280–300px windows.
- `.panel{min-height:calc(100lvh + 110px)}` — the +110px is full-colour dwell. Dropping to plain
  `100lvh` takes back ~660px but reduces the single-colour moment to the 65px the bar overlaps.

---

## Open questions

1. **Is 78 the number Ricky wants on the page,** or is he counting something the repo doesn't build?
2. **Is the page too long?** 22.3 screens mobile / 20.8 desktop. Kota's own desktop page measured
   16,180px for comparison. Three knobs above.
3. **Do The Clothing Kings, Cuddle Plush and Colossus have live URLs?** Three of five panels have no
   outbound link, which reads as inconsistent against the two that do.
4. **Fix the loop seams?** Ping-pong encode or a short crossfade. Originals are on Higgsfield's CDN,
   so either costs no credits.
5. **Should `r9-worklab.html` be re-synced to five clients,** or left as the four-client record of a
   decision already made?
6. **Port the winner to React in `sites/dcs`, or keep iterating in HTML?** Still unanswered from the
   previous handoff, and now more expensive to defer — the prototype has grown substantially.
7. **Is `r9-kota-level.html` the direction?** Ricky has now art-directed it across two long sessions
   and made several specific calls on it, which reads as acceptance, but he has never said so.
