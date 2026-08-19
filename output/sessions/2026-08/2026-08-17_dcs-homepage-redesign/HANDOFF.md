# DCS homepage redesign — handoff

**Status:** in-progress — **a direction has been chosen** (52) and substantially reworked: new
logo and favicon, new accent colour, new body typeface, and a full copy pass. All of it is
**uncommitted**, and all of it is **deployed** to a public URL. Those two facts together are the
main risk in this handoff.
**Branch:** `develop` @ `5d622f93` — level with `origin/develop`, **zero commits made this
session**. `staging` and `main` untouched.
**Commits:** none. Every change below exists only in the working tree of this machine.
**Working tree:** **20 dirty paths** (6 modified, 14 untracked). Listed under "Working tree" below.
A fresh clone gets none of this work.
**Supersedes:** the previous `HANDOFF.md` in this folder (the "pick one of 54" handoff). Its
R2/deploy facts and its Traps #2–#13 still hold and are not repeated in full — read it for
background. Its "Next step" (choose a direction) is **done**.

## What this is trying to resolve

DCS needs a new homepage. An earlier session produced 54 static HTML prototypes. This session
**picked direction 52** and moved from "which direction" to "make 52 right", panel by panel.

Ricky's stated working method for the rest of this: **content first, then layout, panel by
panel.** He has said twice that layout is a separate pass. Do not restructure panels while doing
copy — surface the observation and move on.

Decisions he made explicitly, which constrain the work:

- **Direction 52 is the one.** The other 53 are reference only and are now inconsistent with it.
- **Accent tertiary is navy `#17265E`**, chosen from `/colour-lab` over the original indigo.
- **Body typeface is DM Mono 500.** Chosen over Inconsolata 600, Space Grotesk, JetBrains Mono,
  Anonymous Pro and Geologica, from `/type-lab`. Headings stay Schibsted Grotesk — he is happy
  with them and said so directly.
- **Logotype is Poppins Light 300**, lowercase, two lines.
- **No serifs in body copy.** He rejected them outright. Serifs were offered again as _headings_
  and he did not take them.
- **PAYG minimum contract is 24 months** (was 12).
- **Do not name Google Workspace on the homepage** — "it won't mean anything to anybody."
- **Detailed pricing and service mechanics belong on inner pages, not the homepage.**

## Actions taken

**There are no SHAs — nothing was committed.** In rough order:

| #   | Change                                                               | Where                                                    |
| --- | -------------------------------------------------------------------- | -------------------------------------------------------- |
| 1   | Hero CTA → white at rest, aqua on hover                              | `home-52`                                                |
| 2   | Hero price chip → aqua field, navy label                             | `home-52`                                                |
| 3   | Logo: DCS monogram vectorised, `currentColor`, + Poppins wordmark    | `home-52`, `sites/dcs/public/`                           |
| 4   | New favicon: magenta field, D clipped from the real monogram         | `sites/dcs/public/favicon.svg`                           |
| 5   | Re-did the mark from Ricky's own `logo_black_vector_cropped.svg`     | `dcs-mark.svg`, `home-52`                                |
| 6   | Removed "This page is the proof…" from the hero lead                 | `home-52`                                                |
| 7   | Full copy pass — 14 changes, see "Copy" below                        | `home-52`                                                |
| 8   | Hero H1 "Agency work…" → "Websites as professional as you are."      | `home-52`                                                |
| 9   | Services restructured to 3 offerings + 3 support services            | `home-52`, `content-brief.md`                            |
| 10  | PAYG minimum 12 → 24 months                                          | `home-52`, `PRODUCT.md`, `content-brief.md`              |
| 11  | Removed the "every site includes" list and add-ons line from pricing | `home-52`, `content-brief.md`                            |
| 12  | Accent tertiary indigo → navy `#17265E`                              | `home-52`, `index.html`                                  |
| 13  | Body typeface → DM Mono 500 via a new `--font-body` token            | `home-52`                                                |
| 14  | Extended DM Mono to buttons, nav, and the hero price chip            | `home-52`                                                |
| 15  | Four decision-record pages built and deployed                        | `logo-lab`, `colour-lab`, `type-lab`, `home-52-typetest` |

## Current state — verified 2026-08-19

Everything here was measured today, not recalled.

**Live and reachable** — all 200:
`/` · `/home-52-poster-indigo` · `/logo-lab` · `/colour-lab` · `/type-lab` · `/home-52-typetest`
on `https://dcs-prototypes.vercel.app`.

**Confirmed present in the deployed HTML** (curl + grep, not assumed):
`--plum: #17265E` · `--font-body: 'DM Mono'` · the `Websites` plate word · `24-month` ·
`Real people` / `No bots` · `WordPress and WooCommerce` · zero occurrences of `Agency`,
`Workspace`, `Every site includes`, or `Add-ons`.

**Layout fits one viewport** on `home-52`, measured across 1920×1080, 1440×810, 1366×690,
1280×720, 1440×740 — **all sections fit at all five.** This is better than the file started: the
`pricing` panel used to overflow by 7px at 1366×690, and still does in every other round-5 file.
Removing the includes list fixed it.

**No faux bold anywhere.** Swept every element in the DOM for one computing to DM Mono above
weight 500 — returns clean.

**Font assignment verified per element**, not inferred from the selector list. Prose, buttons,
nav, phone, floating CTA, mobile menu and the price chip resolve to `DM Mono 500`; h1, `.h2`,
`.label`, `.svc__name`, `.tier__fig`, `.duo__sector`, `.tile__sector` resolve to Schibsted
Grotesk; `.brand__full` resolves to Poppins 300.

**Nav bar fits** at 390 / 430 / 760 / 900 / 1024 / 1100 / 1180 / 1280 / 1440 / 1600 / 1920 — no
overflow, no horizontal scroll, bar height 68px throughout.

**Assumed, not verified:** that the other 53 prototypes still render correctly (untouched, but
they were redeployed each time). That `home-52` is correct on a real phone — only emulated
viewports were checked. That the video tiles still play (not re-tested this session; see the
prior handoff's Trap #1 — review in Safari).

## Working tree

Modified (6):

```
output/sessions/2026-08/2026-08-17_dcs-homepage-redesign/HANDOFF.md
output/sessions/2026-08/2026-08-17_dcs-homepage-redesign/PRODUCT.md
output/sessions/2026-08/2026-08-17_dcs-homepage-redesign/content-brief.md
output/sessions/2026-08/2026-08-17_dcs-homepage-redesign/prototype/home-52-poster-indigo.html
output/sessions/2026-08/2026-08-17_dcs-homepage-redesign/prototype/index.html
sites/dcs/public/favicon.svg
```

Untracked and **new this session** (7):

```
prototype/colour-lab.html   prototype/logo-lab.html   prototype/type-lab.html
prototype/home-52-typetest.html
sites/dcs/public/dcs-mark.svg
```

Untracked but **added by Ricky, not me** (6): `logo black.svg`, `logo white.svg`,
`logo_black_vector.svg`, `logo_black_vector_cropped.svg`, `logo_white_vector.svg`,
`logo_white_vector_cropped.svg`, plus `favicon-old.svg` (his rename of the original tracked
`favicon.svg` — which is why `favicon.svg` shows as _modified_ rather than added).

Pre-existing and unrelated: `supabase/`, `codex-peer-review/.../openrouter-response.json`.

## Live changes already applied

**Vercel only. No R2 writes this session** — `tools/upload-prototype-assets.ts` was never run, and
the 67 objects from the previous session are untouched. The prototypes' assets are unchanged.

`tools/publish-prototype.ts` was run **about ten times** against the existing `dcs-prototypes`
project. Each run redeploys **every HTML file in the prototype directory**, so all 59 pages
currently live are from this machine's working tree. The alias
`https://dcs-prototypes.vercel.app` points at the most recent.

There is no rollback command. Reverting the files and re-running `publish-prototype.ts` is the
only way back, and the four lab pages would need deleting from the directory first or they stay
deployed.

## What was NOT done

- **Nothing was committed, pushed, staged or merged.** No branch was created. This is the single
  biggest risk here — the entire session's work is one `git checkout` away from gone.
- **Only `home-52` was touched.** The other 53 prototypes still carry the old copy, the old
  indigo, Schibsted body text, the old DCS tile logo, the 12-month PAYG line and the includes
  list. They are now inconsistent with the chosen direction. Deliberate — but do not treat any
  other file as current.
- **`sites/dcs` has had no React work.** Only two asset files were written there
  (`favicon.svg`, `dcs-mark.svg`). No component, config or content file was touched, and
  `sites/dcs/site.config.ts` still carries the old trades-only service wording.
- **The layout pass has not started.** Content only. Two known layout debts, both surfaced and
  deliberately left: the pricing panel is bottom-light with a visible gap since the includes list
  was removed, and the hero no longer hints that a person builds these (the "I designed it" line
  was cut at Ricky's request).
- **No inner pages exist.** Services, Pricing, Portfolio, About, Contact — none. Three pieces of
  content have been explicitly banked in `content-brief.md` _for_ those pages and must not be
  reinstated on the homepage: the eleven-item includes list, the add-ons pricing, and the email
  explanation (including that Google bills the client monthly per mailbox, which must be
  disclosed as a third-party cost).
- **The old FAQ has no home.** The live site has 7 FAQ questions; nothing on this page carries
  them.
- **Mobile is still relaxed, not designed** — unchanged from the previous handoff.
- **The 46 other prototypes still say "12-month minimum".** Not updated; they are superseded.
- **`output/sessions/.current-session` is still stale**, pointing at
  `2026-07/2026-07-18_deploy-hardening`. Detection falls back to most-recently-modified and
  resolves correctly, but the pointer is wrong.
- **`session-wrap-up.md` has not been written.**

## Traps

The previous handoff's Traps #2–#13 still apply. These are new.

1. **The filename lies about the colour.** `home-52-poster-indigo.html` is no longer indigo — it
   is navy. The filename and the URL were kept deliberately so Ricky's link keeps working; only
   the display name in `index.html` changed, to "Poster · Navy tertiary". Do not "fix" the
   filename without telling him the URL changes.
2. **DM Mono ships 300/400/500 only — there is no 600 or 700.** Every rule converted to the body
   face had to come down to 500 or the browser fakes the weight and the text goes furry. If you
   add a `font-weight: 700` to anything on `var(--font-body)`, you have introduced faux bold.
   Sweep for it; do not eyeball it.
3. **The hero price is now lighter than it was** — `.pricechip__big` went from Schibsted 800 to
   DM Mono 500, compensated with a size bump and looser tracking. **Ricky has not yet ruled on
   this.** It is the most important figure in the hero. If he objects, the fix is to return
   `.pricechip__big` alone to grotesk 800 and let the label and note carry the mono.
4. **Do not put `.tier__fig` on the body face.** DM Mono is monospaced, so a comma takes a full
   character cell — the exact `£1 , 995` failure in CLAUDE.md. `£1,995` and `£3,495` in the
   pricing table are the only comma'd figures on the page and they stay grotesk for that reason.
   There is a comment in the stylesheet saying so.
5. **There is a `@media (max-height:740px)` rule for `.svc` that is load-bearing.** DM Mono runs
   ~22% wider than the grotesk, which overflows the services panel by 39px on short viewports.
   That one rule pays for it. Deleting it as "tidying" silently breaks the panel on a 1366×768
   laptop, and it will look fine on the developer's larger screen.
6. **`home-52-typetest.html` is a stale fork of the homepage and is deployed.** It was branched
   before the DM Mono and font-weight work and is now at least two changes behind. It has a font
   switcher bottom-left. At a glance it looks like the real page. **Recommend deleting it** —
   `/type-lab` is the durable record of that decision. Ricky was told twice and has not answered.
7. **The four lab pages are not linked from `index.html`.** `/logo-lab`, `/colour-lab`,
   `/type-lab` and `/home-52-typetest` are reachable by direct URL only. `index.html` mentions
   `/colour-lab` in prose but links nothing.
8. **Canvas `measureText` silently falls back to a default font** if the family is not applied in
   that context, and returns plausible-looking numbers rather than an error. It produced two
   wrong x-height readings this session before being caught — the tell is several different
   fonts returning identical values. **Measure x-height with the CSS `ex` unit inside an element
   where the font is actually rendering.** There is a working implementation in `type-lab.html`.
9. **The nav's `plum` ground is a dead branch.** The cyan band above pricing carries
   `data-ground-src="plum"`, intending the bar to repaint navy while crossing it. Sweeping the
   whole page at 40px steps, the bar only ever reaches `paper`, `acid`, `ink` and `ultra`.
   Confirmed the same on two untouched siblings, so it predates this session. Nothing looks
   broken; the intended counterpoint just never fires.
10. **Do not go darker than `#17265E`.** Darker navies separate _better_ from magenta, so that is
    not the constraint — the limit is the Selected Work tile against the ink ground behind it.
    1.33:1 at the chosen value; below about 1.25 the tiles stop reading. `/colour-lab` option 5
    at 1.07 shows the failure. A comment in the stylesheet records this.
11. **Ricky's raster logo files are not the source of truth.** `logo.svg`, `logo black.svg` and
    `logo white.svg` are all 530×254 PNGs inside SVG wrappers, and the two mono ones are
    pixel-identical in shape to the colour one. Use `logo_black_vector_cropped.svg`, or the
    derived `sites/dcs/public/dcs-mark.svg`. See the memory note `reference_dcs_logo_asset.md`.

## Next step

**Ask Ricky whether to commit before doing anything else.** Twenty dirty paths, ten deploys, zero
commits. Suggested:

```bash
git checkout -b feature/dcs-homepage-direction-52
git add output/sessions/2026-08/2026-08-17_dcs-homepage-redesign sites/dcs/public
git status                     # confirm supabase/ and openrouter-response.json are NOT staged
```

Then, unless he redirects, continue the panel-by-panel pass. Content is broadly done; **layout is
the outstanding half**, and the pricing panel's gap is the first item. To redeploy after any edit:

```bash
npx tsx tools/publish-prototype.ts \
  output/sessions/2026-08/2026-08-17_dcs-homepage-redesign/prototype --project dcs-prototypes
```

Assets are on R2 and unchanged — **do not** re-run `upload-prototype-assets.ts` unless you add a
new image. To re-check the one-viewport rule after any content change, the measurement harness
lives in the scratchpad, which does not persist — rewrite it: load the page in Playwright at
1920×1080 / 1440×810 / 1366×690 / 1280×720 / 1440×740 and compare each `main > section`
`getBoundingClientRect().height` against the viewport height.

## Open questions

1. **Commit now, or keep going uncommitted?** Blocks nothing, risks everything.
2. **Is the hero price acceptable at DM Mono 500?** See Trap #3. Ricky has not seen a direct
   before/after of that one element.
3. **Delete `home-52-typetest.html`?** Asked twice, unanswered. See Trap #6.
4. **Should the other 53 prototypes be left to rot, archived, or deleted?** They are now
   materially inconsistent with the chosen direction and the index still offers all 54.
5. Carried over and still unanswered from the previous handoff: the one-viewport rule itself,
   the duplicate `~/.agents/skills/impeccable`, and impeccable's detector hooks.
