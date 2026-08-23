# DCS homepage — round 9 — handoff

**Status:** in-progress — the prototype is art-directed, deployed for review, and **fully promoted
to production**. Nothing is blocked and nothing is pending promotion. The one open item is that it
has never been opened on a real handset.
**Branch:** `develop`, level with `origin/develop`. `develop`, `staging` and `main` all carry the
same work — 0 commits outstanding between them at the time of writing.
**Working tree:** clean for this work. Two pre-existing untracked items are not ours and must stay
out of any commit: `supabase/`, `output/sessions/codex-peer-review/.../openrouter-response.json`.
**In production (`main` = `5a598045`):** everything below, via PR #60, merged 2026-08-23T07:33:20Z
by rickydwilson-dcs. That promotion changed exactly six files — four under `output/sessions/` plus
`CLAUDE.md` and `CHANGELOG.md` — and **no site, package, script, tool or workflow file at all**,
which is why CI, Production Quality Gate and the Regression Watchdog produced no runs for it. Their
`paths-ignore` filters excluded the change set; they were not skipped gates, and no production site
redeployed.
**Live prototype:** https://2026-08-17-dcs-homepage-redesign.vercel.app/r9-kota-level — verified
HTTP 200 on 2026-08-23. Public, no auth wall. Options lab at `/r9-worklab`.

**Chains from** the previous version of this file (`git show acd71a44:.../HANDOFF.md`) — read it for
rounds 1-8 background and the Kota reference rationale. Everything below is what changed since.

---

## What this is trying to resolve

Round 9's prototype (`prototype/r9-kota-level.html`) is a standalone HTML homepage built at the
craft level of the pinned reference, `kota.co.uk`. Two sessions of close art direction with Ricky
have taken it from a desktop-only draft to something reviewable on a phone.

Binding constraints, carried and still in force:

- **Scope is the homepage only.** Not inner pages, not the whole site.
- **Build as a standalone HTML prototype** under `output/sessions/`, not in `sites/dcs`.
- **Positioning is broad** — small owner-run businesses of every sector, not just trades.
- **Take Kota's register, never its identity.** Full analysis in `reference-kota.md`.
- **Ricky iterates by eye and reverses himself.** Two changes this session were rolled back on
  sight (heading anchoring, the pricing column restructure). Prefer `git revert` and a diff against
  the prior SHA over hand-undoing — it caught a rule that would otherwise have been missed.

---

## Actions taken this session

Chronological. All in `prototype/r9-kota-level.html` unless stated.

| SHA        | What                                                                                         |
| ---------- | -------------------------------------------------------------------------------------------- |
| `bc48748a` | Removed the client pills from the work opener; `.wpanel__n` took h2's type spec verbatim     |
| `c3ae5eb9` | Services intro type fades as the card stack rises; work-panel copy centred; scrim rebalanced |
| `50a822ce` | Nav holds fuchsia across all six service cards, cuts to ink at the process section           |
| `ce6d4eed` | Anchored every section heading to one height — **later reverted**                            |
| `0792b920` | Page counts per tier, plus the upfront-only eCommerce tier                                   |
| `d171983f` | Hero joined the anchor; service-card title compensation — **later reverted**                 |
| `65b0ea22` | **Revert** of the anchoring work, restored from `50a822ce`                                   |
| `329e41a3` | Pricing: notes dropped, three-bullet trim, fixed pane size, eCommerce N/A + tab switch       |
| `35ccc789` | Detail pane moved level with the pay toggle — **immediately reverted**                       |
| `e218cb91` | **Revert** of `35ccc789`                                                                     |
| `080fcefb` | Process heading shortened to "A quick chat. / I do the rest."                                |
| `a045fd56` | Section curves now read against the pane above, via `.cornerfill`                            |
| `a41f9508` | Dropped "I reply within one working day"                                                     |
| `efb74744` | Hero sub speaks in the first person                                                          |
| `d93e35e4` | `scroll-padding-top` 84 -> 0 so menu jumps land inside their section                         |
| `4a21783b` | Tier figures right-aligned; eCommerce service card got packing footage                       |
| `c2d32109` | In-page links intercepted to use layout position; new testimonial                            |

Earlier in the run: `e90d30e0` (mobile layer + work section rebuild), `1d74e295` (R2 upload +
publish), `621ddc99` / `acd71a44` (handoff corrections).

---

## Current state — verified 2026-08-23

Every figure below was measured today, in a same-origin iframe at the stated viewport.

### Verified

- **Live prototype returns HTTP 200** at the shareable alias, no auth wall.
- **R2 holds 50 objects, 19.8 MB**, all verified 200 with correct content types by the upload tool's
  own post-check. The prototype HTML references R2 URLs only — no relative asset paths remain.
- **Section curves** read the colour of the pane above at all eight boundaries, at both 1440x900 and
  390x844.
- **In-page links** (5 menu + 4 footer) land their target at `top: 0` with the nav taking that
  section's colour, tested from the page bottom.
- **Pricing pane** is the same size in all seven tier/mode states — 372px, CTA at 332px, range 0.
  Tier figures right-aligned in all eight combinations.
- **Work panels** pin 4800/3760/2720/1680/880 at 390px with **zero gap** at the handover.
- **390px and 320px:** no horizontal overflow, no touch target under 44px, 16px prose floor.
- **Desktop drift** was zero when last measured across 30 selectors — but see Assumed.

### Assumed, not verified

- **Nothing has been opened on a real handset.** This is the single largest gap and has been open
  since the mobile work began. `env(safe-area-inset-*)` and the `lvh`-vs-`svh` choice are both
  _structurally_ untestable in a desktop iframe — all four viewport units resolve identically there.
  The prototype is on a public URL precisely so this can be closed.
- **Desktop drift** has not been re-measured since `50a822ce`. Many changes since are deliberate
  desktop changes, so a plain drift check no longer means anything without a curated selector list.
- Firefox and Safari — Chrome only, throughout.
- Page length: mobile is roughly 19,000px / ~23 screens. Long, and Ricky has not objected, but it
  has never been reviewed as a whole on a device.

---

## What was NOT done

- **Never opened on a real handset.** See above. Everything is Chrome in a fixed-width iframe.
- **`r9-worklab.html` still shows four clients**, not five, and its Option A pill rail still has the
  defect Ricky reported — the selected pill does not scroll into view at 390px. He chose Option B,
  so it was never fixed. It is a decision record, deliberately left.
- **Dead CSS not removed.** `.worksec`, `.cards`, `.card`, `.cards--2` joined the already-dead
  `.work`, `.row`, `.svcs`, `.svc`, `.slot`. Left alone on purpose — a greedy regex wiped the
  stylesheet earlier in round 9. Needs a deliberate, verified pass.
- **`vid-fabric.mp4` and `poster-fabric.jpg` are now unreferenced** but remain in R2 and on disk.
- **Three clients still have no outbound link** — The Clothing Kings, Cuddle Plush and Colossus.
  Only NP Racing and SM Commercial link out.
- **Loop seams unfixed.** All five clips hard-cut at the 5s loop point.
- Carried forward, still true: **trades-only positioning is still live** in `sites/dcs/site.config.ts`
  and the pricing page metadata; **`content/projects/cuddle-plush-fabrics.mdx` still says "five
  years"** where the relationship began 2014; `sites/dcs/PRODUCT.md` and the session-folder
  `PRODUCT.md` have diverged (the `sites/dcs` one is current); `output/sessions/.current-session` is
  stale, pointing at `2026-07/2026-07-18_deploy-hardening`.

---

## Live-data / machine changes already applied

No production website data was written. Two paid actions this session:

| Change                                                           | Where      | Reversible? |
| ---------------------------------------------------------------- | ---------- | ----------- |
| **10 credits** — Colossus scaffolding timelapse (`1d3bb8ea-...`) | Higgsfield | **No**      |
| **10 credits** — eCommerce packing timelapse (`b5c1b143-...`)    | Higgsfield | **No**      |

Balance **847.85**, confirmed today via `higgsfield account status`. Was 867.85 at session start.
Source clips remain on Higgsfield's CDN, so re-encoding is free; a re-roll is another 10.

**Do not re-generate any of the five client/service clips.** They exist, are optimised, and are in
R2.

Also written: 50 objects to the R2 bucket `local-business-platform` under
`prototypes/2026-08-17_dcs-homepage-redesign/`, and repeated Vercel deploys of the prototype project
`2026-08-17-dcs-homepage-redesign`.

---

## Traps

Six of these cost real time. The first four caused wrong diagnoses that only measurement caught.

1. **RED FLAG — `requestAnimationFrame` is frozen in a backgrounded tab**, which is the state during
   `javascript_tool` evaluation. Everything rAF-driven reads stale: the nav's `data-ground`, the
   `.res` reveals, smooth scrolling, CSS transitions mid-flight. This produced at least five false
   readings this session, including a "settled" poll that was really a frozen value repeating.
   **Compute what the function would return; never read the live result.** Never `await` inside a
   rAF callback — it hangs until the 45s CDP timeout.
2. **RED FLAG — Screenshots can be stale compositor frames.** Repeatedly showed mismatched state
   where the DOM was provably correct. Trust `getComputedStyle` / `getBoundingClientRect`, not
   pixels.
3. **RED FLAG — `elementFromPoint` measures hit-testing, not visibility.** `.svcstack` spans its
   area with `z-index:1` and no background, so it intercepts the point while showing what is behind
   it. A probe using it reported the services heading was never visible when it plainly was.
4. **RED FLAG — Sticky elements lie about their position.** Both `getBoundingClientRect()` and
   `offsetTop` report the _pinned_ position, not the layout one — every section read 14391 from the
   page bottom. This is why in-page links needed intercepting. `layoutTop()` in the page script
   neutralises `position` for one synchronous measurement; that is the only reliable read.
5. **RED FLAG — `python3 -m http.server` honours `If-Modified-Since`** and serves a stale prototype
   after an edit. A change measured as having no effect until the live CSSOM was dumped.
   `mobile-frame.html` cache-busts; any new harness must too.
6. **`position: sticky` room comes only from in-flow content after the element.** A bottom margin
   gives none (the margin box is what gets clamped) and container padding gives none (it is outside
   the content box). Both measured 0px of pin. This is why `.wstack::after` exists — delete it and
   the last work panel silently stops pinning.
7. **`resize_window` returns success but does not change the viewport.** Use the iframe harness.
8. **Every image and video under `output/sessions/` is gitignored.** All nine mp4s and their posters
   exist on disk and in R2 but not in git.
9. **The prototype server dies with the session** — `python3 -m http.server 4321` from the prototype
   directory.
10. **Comma'd prices must stay in Archivo, never a mono face.** Verified clean today.
11. **Port 3000 is `npracing-v1`, not dcs.**

---

## Next step

```bash
cd output/sessions/2026-08/2026-08-17_dcs-homepage-redesign/prototype
python3 -m http.server 4321
# desktop: http://localhost:4321/r9-kota-level.html
# 390px:   http://localhost:4321/mobile-frame.html?p=r9-kota-level.html
```

1. **Open the live URL on a real phone** — the only remaining verification gap, and the one thing no
   amount of harness work can close:
   https://2026-08-17-dcs-homepage-redesign.vercel.app/r9-kota-level
   Check specifically what an emulator cannot: content clearing the notch and home indicator, and
   whether any strip of the next section leaks at a boundary when the URL bar retracts.
2. Re-publish after any further edit:
   ```bash
   npx tsx tools/publish-prototype.ts \
     output/sessions/2026-08/2026-08-17_dcs-homepage-redesign/prototype
   ```
   Do **not** pass `--project` — the directory is already linked to
   `2026-08-17-dcs-homepage-redesign` and a flag would create a second project.

Assets are already on R2; `tools/upload-prototype-assets.ts` only needs re-running if new files are
added (it rewrites relative paths to R2 URLs as a side effect, which is how new assets get wired in).

---

## Open questions

1. **"Two ways to pay for the same site"** now sits directly above a row marked "upfront only" and
   priced N/A. Raised twice, not yet addressed.
2. **Growth and eCommerce both lead with GBP 2,995** — Growth at +25/mo, eCommerce "From" +50/mo.
   Implemented exactly as specified, but the identical anchor works against eCommerce reading as a
   step up.
3. **Is the page too long?** ~23 screens on mobile. The cheapest lever is `.wpanel`'s
   `margin-bottom` — it exists only to buy a reading window for bottom-aligned copy, and centring
   the copy already tripled that window, so it is now largely redundant.
4. **Do The Clothing Kings, Cuddle Plush and Colossus have live URLs?**
5. **Fix the loop seams?** Ping-pong encode or a crossfade; costs no credits either way.
6. **Port to React in `sites/dcs`, or keep iterating in HTML?** Unanswered since the last handoff and
   more expensive to defer with every round.
7. **Is `r9-kota-level.html` the direction?** Ricky has art-directed it across two long sessions and
   made many specific calls, which reads as acceptance, but he has never said so.
