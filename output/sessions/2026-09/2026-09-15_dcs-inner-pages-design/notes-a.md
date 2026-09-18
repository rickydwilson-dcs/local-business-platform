# Phase 3 / Agent A — `/projects` and `/projects/[slug]`

**Date:** 2026-09-17
**Deliverables:** `prototype/projects-list.html`, `prototype/project-detail.html`,
`kit-additions-a.css`, this file. Plus `prototype/_a_harness.html`, the 390px iframe rig.
**`kit.css` was not edited.** Four agents were writing against it at the same time.

---

## 0. The headline

Three things in here matter more than the layout.

1. **The three "real media" assets are not screen recordings of client websites.** The
   2026-08-26 brief says they are; they are not. I fetched all three and looked at them. This
   changes what the cards are allowed to claim. §5.
2. **Round 1's portfolio grid was never a grid.** `class="cards--2"` without `cards` — no
   `display:grid`, thirteen full-width blocks, no error. §6.1.
3. **`.related-grid` is retired; `.cards--2` is the one portfolio card.** G12 closed. §3.

---

## 1. What I kept from round 1

Round 1 (`output/sessions/2026-08/2026-08-26_dcs-projects-pages/`) got the bones right and most
of it survives:

| Kept                                         | Where it lives now                                                                                                                                                                |
| -------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `.paytoggle` as the sector filter pill group | unchanged — it is still the site's one selectable-pill pattern, and Phase 1 already resized it (13.5px / 9px 16px) for five chips rather than two payment modes (kit.css:691-693) |
| Real client-side filtering, not a mock       | rewritten, three changes — §6.5                                                                                                                                                   |
| `.cards--2` as the portfolio card            | unchanged as the pattern; fixed as markup (§6.1)                                                                                                                                  |
| `.slot` for the projects with no footage     | unchanged. Ten of thirteen                                                                                                                                                        |
| `.detail__l` for the case-study outcomes     | kept, moved to a dark ground — §2.3                                                                                                                                               |
| The `.crumb` breadcrumb spine                | now the **kit** version (Phase 2 promoted it, kit.css §28), not the page-local one                                                                                                |
| `.card__meta` and `.card__link`              | promoted out of `project-list.html`'s `<style>` block into `kit-additions-a.css`, with different jobs — §2.1                                                                      |
| `h1` "Real clients. Real outcomes."          | verbatim. It is honest, first-person-compatible and short                                                                                                                         |
| The five-sector taxonomy and its mapping     | verbatim from `brief.md:29-35`                                                                                                                                                    |
| Colossus as the demo case study              | verbatim reasoning — it is the only one with both a full narrative and real media                                                                                                 |

## 2. What I changed from round 1, and why

### 2.1 The two supporting lines stopped saying the same thing

Round 1 gave every card **both** a `.card__s` hover scrim and a `.card__meta` band — and put
near-identical copy in each. The Clothing Kings card said "price changes with the job…" in the
scrim and "where the price changes with embroidery vs. vinyl…" underneath it.

Deleting one band was the obvious fix and the wrong one. `.card__s` is hover-only on desktop, so
whatever goes in it is invisible to someone scanning; the outcome figure is the thing that sells a
portfolio card and has to be always-visible. So the two bands now carry different things:

- `.card__meta` — the strongest real `outcomes:` bullet from that project's MDX. Always visible.
- `.card__s` — what the project actually is, from that project's `description:`. Hover / focus.

### 2.2 The masthead facts changed, and two round-1 claims are gone

Round 1's `.credentials` row read **Est. 2019 · 20+ sites delivered · 5+ years with our
longest-standing client · Everything managed in-house**.

I could not source "Est. 2019" or "20+ sites delivered" anywhere in the repo — not in
`content/`, not in `content-brief.md`, not in the theme config. They may well be true; Ricky
would know. But an unsourceable number on the page that is specifically about proof is the wrong
place to guess, so I have not asserted them. What is there instead is checkable:

| Shown                                      | Source                                              |
| ------------------------------------------ | --------------------------------------------------- |
| **13** case studies here                   | `sites/dcs/content/projects/*.mdx` — thirteen files |
| **5 sectors**                              | the taxonomy in `brief.md:29-35`                    |
| **5+ years** longest client relationship   | `cuddle-plush-fabrics.mdx` outcome 1, verbatim      |
| **One person** — design, build and support | the homepage's own positioning, `hero.tsx:32`       |

**If Est. 2019 and the site count are right, put them back** — they are stronger than two of
mine. I am flagging rather than deciding.

Also: "our longest-standing client" → "my". Ground rule 7.

### 2.3 The outcomes list moved off the paper ground

Round 1 put `.detail__l` on `.p--paper` (`project-post.html:124`). The whole point of
`.detail__l` is the aqua check (kit.css:739-745) and **`--aqua` on a light ground is roughly
1.7:1** — the same reason Phase 2 had to swap the breadcrumb's hover colour on light grounds
(kit.css:1245-1249). It is now on `.sec.p--ink`, its native ground, which is also where Phase 2
put it on the reference page.

### 2.4 The case study lost a section boundary

Round 1 had the facts as a separate white `.facts` band between the ink hero and the body. Phase 2
built `.mast__meta` as precisely the reconciliation of round 1's `.credentials` container with its
`.facts` item (kit.css:1293-1296), so the facts are now the masthead's own meta row, on the
masthead's own ground. One fewer boundary, one fewer page-local block.

### 2.5 Grid order

Six of the thirteen are trades, and the positioning is "mix the sectors, do not lead with trades".
Round 1's order ended on four consecutive trades cards. Mine interleaves so that every two-up row
pairs two different sectors — except the thirteenth, which has no partner. The three with real
media land at positions 1, 3 and 4, so the top of the page is not all placeholder.

---

## 3. G12 — `.related-grid` vs `.cards--2`. Decision: **`.cards--2`. `.related-grid` is retired.**

`project-post.html:34-42` defined `.related-grid` page-locally: 2 columns, 18px radius, 1px ink
border, 16/10 well, title bar, `<small>` sub-line, `translateY(-3px)` on hover. `.cards--2` is: 2
columns, `clamp(16px,1.7vw,24px)` radius, 1px ink border, 16/10 well, title bar, `<small>` slot via
`.card__t--row`, `translateY(-4px)` on hover.

They are the same object, drawn twice, differing in a radius, a hover distance, and whether the
title sits above or below the media. Three reasons the kit one wins:

1. **`.cards--2` carries things `.related-grid` does not, and each is load-bearing.**
   `:focus-visible` parity with hover (kit.css:464-467); the `.card__tag` z-index fix that stops
   the scrim covering the sector pill (kit.css:471); the `@media (hover:none)` branch that turns
   the scrim into a permanent bottom gradient because touch has no hover to give (kit.css:476-481);
   the 900px collapse to one column. `.related-grid` had a bare `transform` hover and one media
   query. Adopting it would mean re-deriving all four.
2. **Two near-identical grids is exactly the drift Phase 4 exists to remove**, and this one is
   avoidable at zero cost — the related block on `project-detail.html` uses `.cards--2` with **no
   new CSS at all**.
3. The one real difference — title below the media rather than above — is a second card anatomy
   for no gain. `.cards--2`'s title-above-media with the ink rule under it is the more distinctive
   of the two and it is the one already in the kit.

**For Phase 4:** nothing to merge. `.related-grid` simply never appears again.

---

## 4. Reuse vs invention

### Reused, no new values

The whole chrome (bar, nav, burger, `.menu` overlay, `.pagefoot`, `.footmap`, `.end__foot`) copied
from `prototype/service-detail.html` — byte-identical except which link carries `aria-current` and
the footer's closing headline. `.crumb`, `.mast`, `.mast__meta`, `.sec`, `.measure`, `.prose`,
`.cards`/`.cards--2`/`.card__t--row`/`.card__tag`/`.card__s`/`.card__well`, `.slot`, `.detail__l`,
`.paytoggle`, `.filterbar`, `.count`, `.empty`, `.eyeless`, `.lead`, `.res`, `.btn`, `.quote`,
`.quote__a`, `.big`. Ground sequences follow design-kit §1.2.

### The additions file, and where each value came from

| Rule                         | Why it exists                                                                                                             | Values from                                                                                                                                                                         |
| ---------------------------- | ------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `.cards--2 .card[hidden]`    | the filter cannot hide a card without it — §6.4                                                                           | none; one declaration                                                                                                                                                               |
| `.card__meta`                | §2.1                                                                                                                      | padding `project-list.html:19`; type = `.card__s`'s base, kit.css:429                                                                                                               |
| `.card__link`                | ten of thirteen wells are placeholders and read as unfinished rather than clickable                                       | `project-list.html:21`; arrow nudge = `.btn svg`'s transition, `.hire svg`'s 4px                                                                                                    |
| `.empty a`                   | kit.css §21 styles `.empty` but not a link in it, and the reset makes links inherit — the CTA rendered as plain grey text | `.prose a` verbatim, kit.css:1416                                                                                                                                                   |
| `.card__note`                | **honesty** — §5                                                                                                          | `.slot__s` verbatim (kit.css:501); margin = `.prose figcaption`'s 12px                                                                                                              |
| `.mast__media`               | the one thing a case study has that a service page does not                                                               | `aspect-ratio:16/8` from `project-post.html:18`; cap = `.svccard`'s `min(80vh,720px)`, in `lvh`; fill rules = `.card__well`'s; backdrop = `.card__well`'s navy                      |
| `.quotes` / `.quote--sm`     | three testimonials side by side; `.quote`'s 41.6px cap is ~10 characters a line in a 400px column                         | columns = `.cards--3`'s; gap = `.price`'s; top margin = `.cards--2`'s; **type = `.cards--2 .card__t`'s**, the same pair Phase 2 chose for `.prose blockquote` on the same reasoning |
| `.filterbar .paytoggle` @900 | §6.3                                                                                                                      | undoes kit.css:997; radius 18px = `.card`'s                                                                                                                                         |

**Genuinely invented: nothing.** Every number resolves to an existing declaration. The two
judgement calls that are derivations rather than copies:

- **`.card__note` at 12.5px on mobile** rather than the 16px prose floor. It is a caption, the
  same class of thing as `.slot__s` (11.5px) and `.prose figcaption` (13.5px), neither of which the
  mobile layer lifts either. 12.5px is `.eyeless`'s size.
- **`max-height:min(80lvh,720px)`** is `.svccard`'s `min(80vh,720px)` used as a cap rather than a
  height, and in `lvh` rather than `vh` per ground rule 9.

### `.prose` — what the case-study body needed and whether Phase 2 had it

Phase 2's `.prose` covered the Colossus body completely: `p`, `h2`, `ul`/`li`, inline `a`. Nothing
was missing, nothing was added. Three notes for wave 2, when `/blog/[slug]` inherits it:

1. **`.lead` does not belong inside `.prose`.** I put `class="lead"` on the MDX's opening
   paragraph and rendering showed its 56ch measure (kit.css:130) inside `.measure`'s 74ch column as
   a visibly short ragged opening block against every paragraph below. Removed. If `.prose` ever
   wants a lead-paragraph treatment it needs its own, measured against the 74ch column.
2. **`.prose h2` is not `.res`-aware and does not need to be** — I put `.res` on the three section
   headings and it resolves correctly on white, because kit.css:163 is unscoped. Worth knowing that
   the `.in` latch has to reach the heading's section for it to un-mute.
3. The 74ch measure computed to **72 characters** of actual Archivo at 16.5px — the fix Phase 2
   made to round 1's gutter-inside-measure bug (kit.css:1382-1387) is doing exactly what it says.

---

## 5. Honesty — the media finding

**The three case studies with "real media" do not have a capture of the client's website between
them.** `brief.md:37-40` calls all three "real R2-hosted screen-recording video + poster". I
fetched the three posters and looked at them on 2026-09-17:

| Asset                      | What it actually is                                                                                             |
| -------------------------- | --------------------------------------------------------------------------------------------------------------- |
| `colossus-scaffolding.jpg` | scaffolding poles across the front of a brick terrace with white sash windows                                   |
| `the-clothing-kings.jpg`   | an embroidery machine stitching a logo onto a navy polo shirt — and the logo being stitched is not the client's |
| `cuddle-plush-fabrics.jpg` | a folded bolt of pale green fabric on a white surface                                                           |

All three are sector atmosphere. Phase 2 found this for Colossus alone, having first captioned it
as the website and caught itself (`phase2-notes.md` §3). Nobody had checked the other two, and
round 1's `/projects` presented all three as the client's site by placement.

This matters more on a card than on the homepage. On the homepage they run full-bleed behind a
client name as `.wpanel` background and read as atmosphere. In a 16/10 card well directly under
that client's name in a portfolio, a viewer reads "this is their site".

**What I did.** Every one of the three carries a `.card__note` caption beginning "Pictured:",
naming what the frame contains and saying it is not a capture of the website; and an `aria-label`
on the `<video>` saying the same. The case-study hero carries the longer form. The other ten keep
`.slot`. No project anywhere gets a fabricated or stand-in screenshot.

**What I did not do:** claim anything about whose scaffolding, whose polo shirt or whose fabric it
is. I can only see what is in the frame.

**The cheapest real fix is three screen recordings.** All three sites are live. Ten minutes of
capture would let ten of these captions go away and turn the other ten `.slot` boxes into a
to-do list rather than a permanent state.

### The other honesty calls

- **No testimonial is attached to any case study, and that is deliberate.** All three
  testimonials' frontmatter maps to a **service** (`serviceSlug: web-design` / `local-seo` /
  `monthly-management`), never to a project slug. Dave C. is a "Scaffolding Contractor, Lewes";
  Colossus is a scaffolding contractor in East Sussex. Putting his quote on the Colossus page
  because both involve scaffolding would be inventing a relationship the content does not contain,
  and it would read to a visitor as Colossus's own words. So all three sit together on `/projects`,
  quoted verbatim and attributed exactly as their own frontmatter does, introduced as three
  different pieces of work. **`project-detail.html` carries no testimonial at all.** If any of the
  three genuinely is a project's client, adding a `projectSlug` to the frontmatter would let the
  detail page place it properly.
- **"Eastbourne Plumber" and "Brighton Decorator"** are the card titles for
  `wordpress-to-platform-rebuild.mdx` and `new-website-from-scratch.mdx`, whose own titles name no
  client. Neither is named because the content does not name them.
- **No count-ups.** Every figure on both pages is authored in the markup. `13`, `5 sectors`,
  `5+ years`, `30 pages`, `£80`, `£25`, `3.2s`, `0.8s`.
- **Nothing is presented as Ricky or as a team.** No photograph of a person appears on either page.
- **Voice.** The Colossus MDX body is first-person plural throughout ("we built", "we created").
  Converted to singular, the same correction Phase 2 made to `web-design.mdx`. Substance, claims,
  figures and structure untouched. The MDX's own `# Colossus Scaffolding` heading is dropped
  because the masthead is the `h1`.

---

## 6. Bugs found by rendering

Six. Four are mine, two are round 1's. None of them would have been caught by reading.

### 6.1 Round 1's portfolio grid was never a grid

`display:grid` lives on `.cards` (kit.css:405). `.cards--2` only supplies `grid-template-columns`,
the gap and the top margin. `project-list.html:75` wrote `class="cards--2"` **alone** — so the
thirteen cards were thirteen full-width blocks stacked down the page, at every viewport width,
with no error and no warning. I inherited it by copying round 1's markup and only caught it when a
card measured 1521px wide in a 1671px window. `class="cards cards--2"`.

### 6.2 `aspect-ratio` + `max-height` ran the ratio backwards

`.mast__media` at `aspect-ratio:16/8` with `width:auto` grew without bound — **840px tall in a
714px-tall window** at 1680px wide, i.e. a hero image taller than the screen, and 1280px on an
ultrawide. Capping it with `max-height` then made the browser shrink the **width** to preserve the
ratio: the full-bleed band measured **1142px inside a 1671px window**, indented, no longer
full-bleed, no error. The transferred size suggestion only applies to an axis that is `auto`, so
the width has to be stated: `width:calc(100% + var(--pad) * 2)`.

### 6.3 The filter pills overflowed at 390px and were silently clipped

`scrollWidth` **398** against `innerWidth` **390**, from three `<button>`s. kit.css:997 turns
`.paytoggle` into a `width:100%` two-column grid below 900px — correct for the homepage's two
payment modes, wrong for six sector names, because `.paytoggle button` is `white-space:nowrap`
(kit.css:697) and "Studios & Practitioners" at the mobile 15px measures ~203px inside a 162px
track. `html{overflow-x:clip}` then clipped it: no scrollbar, no error, three pills with their
right ends cut off. The same failure mode Phase 2 hit with the footer email. Fixed by restoring the
base `flex-wrap` for the filter use only (`.filterbar .paytoggle`), leaving the pricing page's own
toggle on kit.css:997 untouched. **After: 381 against 390, zero overflowing elements, and the same
at every one of the six filter states.**

Second half of the same bug: `.paytoggle`'s `border-radius:100px` is right for one row and renders
as a rounded grey blob once six chips wrap onto four. 18px (`.card`'s radius) below 900px; 100px
kept above it.

### 6.4 `[hidden]` does nothing to a `.cards--2` card

`[hidden]`'s `display:none` is a **UA-origin** rule; `.cards--2 .card{display:block}`
(kit.css:438) is author-origin and wins. So `card.hidden = true` sets the attribute, removes the
element from the accessibility tree, and leaves it fully visible on screen. Round 1 sidestepped
this with inline `style.display='none'`. One author-origin rule fixes it properly and keeps the
markup declarative.

### 6.5 The media credit would have been invisible on one of the three cards

First draft put `.card__note` over the media, white at .62 opacity, `.card__tag`'s 14px insets. It
read perfectly over Colossus and Clothing Kings. **Cuddle Plush is pale fabric against a
near-white wall** — it would have vanished, which for an honesty mechanism is worse than not having
it. The design already knows this: `.wpanel`'s scrim is explicitly sized so white text clears
4.5:1 against a pure-white video frame (home-r9.css:281-285). Adding a second scrim would have
stacked with the one `.card__s` already becomes on touch. It is a static caption below the media
instead: no scrim, cannot be covered by the hover scrim, and it sits with the rest of the card's
copy.

### 6.6 A rule scoped one level too tight rendered as plain text

`.card__link` was written as `.cards--2 .card__link`. The case-study page then reuses the same
"read on" affordance for a standalone "See all thirteen" outside any card, and it rendered as plain
grey body text with a zero-sized SVG next to it. No colour, no weight, no arrow, nothing in the
console. Base selector unscoped; only the card's own hover stays scoped.

### Two smaller things, fixed without ceremony

- The `.empty` state's "get in touch" link was invisible as a link (§4 table). Only found by
  forcing the state, because it is unreachable with the current data — §8.
- `.slot__s`'s 22ch measure broke `dch-one.vercel.app` mid-hostname across two lines. All ten
  sub-lines are now the same short "Capture not yet taken"; the live URLs were already in the
  proof lines where they matter.

---

## 7. What I rendered, at what size, and how

`resize_window` is a no-op here exactly as it was for Phases 1 and 2. The browser tab's own
viewport was **1680 × 714** throughout, and the 390px work used the brief's iframe harness
(`prototype/_a_harness.html`), which works — width media queries respond to the iframe's own width.

| Viewport                    | What was checked                                                                                                                                                                                                                                                                                                                                                             |
| --------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **1680 × 714** (real tab)   | `max-height:1040px` **matches** — `h1` computes 102.4px, the inner-page 6.4rem cap. Both pages end to end. Card grid 2 columns at 745px each, well 465px. Quotes 3 columns. Ground sequences. `.sec` corner reveals. Prose measure = 72 real characters. Zero overflowing elements; `scrollWidth` 1671 = `innerWidth` − scrollbar. Page heights 7164 (list) / 5939 (detail). |
| **390 × 760** (iframe)      | The whole authored mobile layer. `.bar nav` hidden, burger shown, `.mark__type` hidden, crumb links **44px** exactly, `h1` 36.8px, `.card__meta p` lifted to 16px, grid and quotes at one column, filter pills 44px tall and wrapping, media band 381 × 191. `scrollWidth` **381** against 390 — zero overflow, on both pages and in all six filter states.                  |
| **390 × 760, overlay open** | **Measured 390 × 760 — the full viewport, not the bar's box.** That is design-kit §9.5's own test for the `fixed inset-0` containing-block trap, and it passes. Current page shows aqua in the overlay via `[aria-current]`.                                                                                                                                                 |

**Behaviour verified numerically, not visually.** The harness backgrounds the tab whenever the JS
tool runs, so `document.hidden` is `true` and `requestAnimationFrame` and `IntersectionObserver`
never fire inside it — Phase 2 documented the same limit. So:

- **The bar ground probe** was verified by replicating its computation synchronously at nine scroll
  positions down the list page: `ink → white → white → white → white → white → white → aqua →
navy`, which is the intended sequence exactly. The _crossfade_ between those states was not
  observed; design-kit §14 already records that `data-ground` lags a jump-scroll by a few hundred
  milliseconds, so it could not be asserted immediately after a programmatic scroll anyway.
- **`.res` and the staggered card reveal** were checked by latching `.in` by hand and confirming
  the resolved state. The transition itself was not watched.
- **The filter** was driven with real `click()` events and is fully verified: 13 / 3 / 6 / 2 / 1 /
  1 across the six chips, summing to 13 and matching the taxonomy; `aria-pressed` moves; `.count`
  updates; no overflow in any state.
- **`kit-additions-a.css` parse health**, the same check Phases 1 and 2 ran: 15 top-level rules,
  **85 declarations retained, zero rules with all declarations dropped.** A syntax error shows up
  as an empty rule; there are none.

---

## 8. What I could not verify — stated plainly

- **`lvh` vs `svh`.** All four viewport units resolve identically in a desktop browser and in an
  iframe. `.mast__media`'s `min(80lvh,720px)` cap is the only viewport unit this agent introduced
  and it is `lvh` by construction. Not demonstrable here.
- **`:focus-visible` parity on the cards.** kit.css:464-467 gives keyboard users the scrim, and I
  did not change it — but I could not exercise it. Programmatic `.focus()` does not match
  `:focus-visible`, and synthetic Tab presses in this environment go to the browser chrome, not the
  page (twelve of them left `document.activeElement` on `<body>`).
- **`@media (hover:none)`.** Written for the one hover this file adds, checked by reading, not by
  tapping.
- **`prefers-reduced-motion`.** Not exercised.
- **The `.empty` state is unreachable with the current content.** All five sectors have at least
  one project, so no chip can return zero. I forced the state to confirm it renders (and found the
  unstyled link that way), but it has never been reached legitimately. Kept because the ported page
  will build its chips from data and a sector can exist before its first project does.
- **Video playback and weight.** The three card videos are `preload="none"` and play on hover; the
  case-study hero autoplays muted, which **does** fetch its 1.4MB on load — accepted deliberately
  for a page hero, and flagged in the file for the port to route through
  `components/home/lazy-video.tsx` like every other video on the site. I did not profile any of it.
- **`env(safe-area-inset-*)`** resolves to 0 everywhere here.
- **Nothing was built or type-checked.** `sites/dcs/` is untouched.

---

## 9. For Phase 4

1. **`.related-grid` never appears again.** §3. Nothing to merge.
2. **`.card__link` and `.card__note` are generic, not projects-specific.** Both will be wanted by
   `/blog` in wave 2 — a post card has the same "there is a page behind this" problem and the same
   caption need. They belong in the merged `kit.css` proper, not in a per-page block.
3. **The `.filterbar .paytoggle` override at ≤900px is a workaround for a rule that is now wrong
   for two of its three users.** kit.css:997's two-column mobile grid was written for the
   homepage's two payment modes. `/projects` needs six chips, and `/blog` needs **two stacked
   axes** per D4/G9. Worth turning the grid into the special case and wrapping flex into the
   default when the merge happens.
4. **`.mast` + `.sec` leaves a very thin ink strip on a wide, short window.** `.mast`'s bottom
   padding floors at 48px and `.sec` pulls up by `--r`, which caps at 44px — so at 1680 × 714 the
   masthead's meta row sits **4px** above the white section's top edge. It still reads, because the
   rounded corners do reveal ink, but 48 − 44 is the whole margin by construction. Not mine to
   change: `.mast` is shared with agents B–E. Phase 2 called the same composition "safe by
   construction" (kit.css:1343-1345) and it is, but only just.
5. **Phase 2's flagged masthead loudness reproduces here and I did not act on it.** Breadcrumb plus
   masthead measures 78% of the viewport on a laptop, `h1` at 102.4px. Phase 2 flagged it rather
   than acting because it is the single biggest lever on how an inner page feels and it changes
   every page at once. Same reasoning: four other agents are using `.mast` right now, and
   compressing it unilaterally would put a conflict into the merge. If it should be quieter, the
   place is a `max-height:1040px` rule for `.mast h1`, matching how `.stack h2` and `.wpanel__n`
   are already handled.
6. **Two round-1 masthead claims are missing and may want restoring** — §2.2.
