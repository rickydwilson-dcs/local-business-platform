# notes-h.md — Agent H, the legal page template

**Wave 2, Phase 3b.** Output: `prototype/legal.html` (one template, three real bodies,
switchable), `kit-additions-h.css`, this file. Plus `prototype/_h_harness.html`, a
verification rig — see §6.

Nothing under `sites/dcs/` was modified. The three source pages and the two legal
components were read only.

---

## 0. What was built, in one paragraph

One template — breadcrumb, masthead, a sticky table-of-contents rail beside a `.prose`
article, an ink closing band linking the sibling documents, the page footer — carrying the
verbatim bodies of `/privacy-policy` (9 clauses), `/cookie-policy` (6) and
`/terms-and-conditions` (9). Ground sequence ink → white → ink → navy. The TOC is the part
that had to actually work, and it does: measured at 1440×900, 1440×700, 1280, 1024, 901,
900 and 390×844, **every anchor lands the heading clear of the fixed bar when clicked from
the bottom of the document**, and the rail pins for 3,150px on Privacy and 4,500px on
Terms. Four bugs were found by rendering that reading alone would not have caught; all
four are described below with their measurements.

---

## 1. What I reused, by class name

Everything here is `kit.css` as merged at Phase 4. No pattern was re-cut.

| Class                                                                               | Used for                                                                       | Note                                                                                                                                                                                             |
| ----------------------------------------------------------------------------------- | ------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `.bar` `.mark` `.mark__type` `.hire` `.burger` `.menu` `.menu__nav` `.menu__foot`   | header chrome                                                                  | burger-only at every width (session.md §4a #5). No `[aria-current]` — a legal page is not one of the six routes, same call `404.html` made                                                       |
| `.crumb` + `.p--ink`                                                                | breadcrumb band, two levels (Home / this document)                             | matches `LegalHero`'s own two-level crumb rather than inventing a `/legal` index that does not exist                                                                                             |
| `.mast` `.mast__meta`                                                               | masthead on all three                                                          | `.crumb+.mast{padding-top:20px}` fires correctly                                                                                                                                                 |
| `.mast__meta` **again, inside `.prose`**                                            | the data-controller block (Privacy §1) and the contact block (Terms §1, §9)    | precedent: `.svcgrid` already reuses it this way (kit.css:2279)                                                                                                                                  |
| `.eyeless`                                                                          | "Legal", "On this page", "Also legal", the four footer column heads            |                                                                                                                                                                                                  |
| `.sec` `.p--ink` `.p--white` `.p--navy`                                             | the four grounds                                                               |                                                                                                                                                                                                  |
| `.res`                                                                              | every `h2` in the body and in the closing band                                 | `service-detail.html` already puts `.res` on `.prose h2`; followed rather than diverged                                                                                                          |
| `.prose` — `p` `h2` `h3` `ul` `ol` `strong` `a` `hr` `code`                         | the entire article body of all three documents                                 | `.prose` needed no change at all for legal prose                                                                                                                                                 |
| `.cscroll`                                                                          | wraps every table; carries the kit's own ≤900px full-bleed rule (kit.css:2565) |                                                                                                                                                                                                  |
| `.svcs` / `.svc` / `.svc__n` / `.svc__d`                                            | the closing "the other two documents" rows                                     | a **spare** pattern — design-kit.md §6.2 records 0 uses on the live homepage, "designed for a services list on an ink/magenta panel". Exhausting the library before inventing, per ground rule 3 |
| `.pagefoot` `.end__main` `.end__foot` `.footmap` `.big` `.lead` `.btn` `.hero__act` | the footer                                                                     | the active legal link takes `[aria-current]`, which `.footmap a[aria-current]` (kit.css:1620) already styles aqua                                                                                |
| `--acc` / `--ring` (kit.css:1770-1777)                                              | every accent in the TOC                                                        | so the accent-swap rule (design-kit.md §1.4) applies for free if the rail is ever put on a dark ground. Verified: resolves to `#D6006B` on `.p--white`                                           |
| `[hidden]{display:none!important}` (kit.css P4.1 [1])                               | hiding the two inactive documents                                              | the rig depends on the promoted fix; the UA rule alone would have lost                                                                                                                           |

**`.ctable` was deliberately NOT reused** for the legal tables. Its `min-width:780px` is
recorded in kit.css:2510-2515 as _measured_ for five pricing columns whose widest cell is
"From £2,995" at `white-space:nowrap`. Inside a 678px reading column that minimum makes a
two-column table of "Quote enquiries / 2 years" scroll horizontally on every viewport,
forever. Same job, wrong measurement. See §2.

---

## 2. What I had to invent, and why

Four things. Three are design; the fourth is a prototype rig that gets deleted at port.

### 2.1 `.legal` — the two-column reading layout

**Why:** `.cols` (kit.css:3174) is the kit's existing two-column page body at
`minmax(0,1.05fr) minmax(0,1fr)` — two working columns of comparable weight. A 200px nav
rail beside a 74ch article is not that shape.

**What it is now:** `grid-template-columns:200px minmax(0,74ch)`, `gap` =
`clamp(22px,3.4vw,58px)` (`.price`'s, home-r9.css:393), `justify-content:center`. The pair
is centred; the article track shrinks rather than pushing the rail out of the page.

**The version before it is the interesting part** and is written up in §3.1 — it was a
three-track grid that kept the article dead-centre, rendered perfectly at 1440, and
overflowed the page gutter below ~1286px without producing a scrollbar.

**Cost, stated plainly:** the article is no longer dead-centre. At 1440 its centre sits
about 124px right of where `.measure` puts it on `service-detail.html`. **This is the one
thing to look at when this page is reviewed beside the wave 1 pages.** Centring the _pair_
rather than left-anchoring it (which is what `LegalToc`'s own layout does) at least makes
the margins symmetric, so it reads as a two-column document rather than as a column that
has drifted. If you would rather the reading column never move, the alternative is the
three-track layout with a hard 1320px breakpoint and no sticky rail on a 1280 laptop —
that trade was made in the other direction here, knowingly.

### 2.2 `.legal__rail` / `.legal__toc` — the table of contents

**Restyled, not rebuilt.** `components/legal/legal-toc.tsx`'s anatomy is kept intact so
the port is a className swap:

| `legal-toc.tsx`                                       | here                                                          |
| ----------------------------------------------------- | ------------------------------------------------------------- |
| `<nav aria-label="Table of contents">`                | same                                                          |
| uppercase tracked "On this page"                      | `.eyeless` (kit.css:126)                                      |
| `<ol>` of `<li><a href="#id">`                        | same                                                          |
| `border-l-2 border-transparent`, `pl-3`               | `border-left:2px`, `padding-left:14px`                        |
| `hover:text-brand-primary hover:border-brand-primary` | hover padding-shift; `[aria-current]` takes the rule + colour |
| `lg:sticky lg:top-28`                                 | `position:sticky;top:clamp(90px,12vh,124px)`                  |

**The one addition to the component's anatomy is the ordinal.** Every clause in all three
documents is already numbered in its own heading ("1. Data controller information"), so a
TOC without numbers makes the reader map labels onto numbers by hand. A CSS counter means
the numbers cannot drift from the list.

Every value is reused — full table in §4. The genuinely invented number is the **200px rail
width**, measured rather than picked: the narrowest width that holds the longest label in
the three documents ("Ownership and intellectual property", Terms §4) without hyphenation.
Rendered check at 1440: longest entries occupy two lines (60px), the rest one (44px).

### 2.3 `.ltable` — a table inside `.prose`

**Why:** design-kit.md G5 lists what `.prose` lacked and tables are not even on the list —
the homepage has no running prose, so it has no table in prose. But four blocks across the
three documents are irreducibly tabular: the retention-period table (Privacy §6) and three
cookie tables (Cookie §3). Re-marking them as paragraphs would be the rewrite this brief
forbids.

Every value is taken from `.ctable`'s own citations or from `.qa`/`.tier`/`.row`; the full
list is in §4. `.ltable--wide` adds `min-width:440px` + `table-layout:fixed` for the
three-column cookie tables — both measured, both explained in §3.4.

**Comma trap.** `.ltable` sets no `font-variant-numeric` and no `font-family`; figures
inherit Archivo from `<body>` via `--f`. Nothing in these tables currently carries a
thousands comma, but the Terms pricing figures (£1,495, £2,995) sit two clauses away in
the same `.prose` block, so the rule is in the stylesheet comment for whoever tabulates
them next. **Verified as rendered:** the full ancestor chain of the £1,495 paragraph
resolves `font-variant-numeric: normal` and `font-family: Archivo` at every level, and the
figure was zoomed and read — the comma is tight.

### 2.4 The rig — `[data-rig]`, §H6 of the CSS. **Delete at port.**

Three routes, one file, so the template can be reviewed under all three bodies without
three near-identical files drifting apart. Everything is marked `[data-rig]` so it greps
in one pass. Deep-linkable: `?doc=privacy | ?doc=cookie | ?doc=terms`. Agent D's
`contact.html?rig` was handled the same way and Phase 4 ruled it gets deleted in Phase 5
(session.md §4a #2). Centred with `left/right/margin-inline`, never `translateX(-50%)` —
root CLAUDE.md's rule that a transform establishes a containing block for `position:fixed`
descendants all on its own.

---

## 3. What I found when I rendered it

Rendered at **1440×900, 1440×700, 1300, 1280, 1240, 1236, 1024, 901, 900 and 390×844**,
in an exact-pixel iframe (`_h_harness.html`) rather than by resizing the window, because
two other wave-2 agents are using tabs in the same browser window.

### 3.1 The centred three-track layout overflowed the gutter, silently — **fixed**

The first `.legal` was `minmax(0,1fr) | minmax(0,74ch) | minmax(0,1fr)` with the rail in
the left track at `justify-self:end`. That is arithmetically identical to `.measure`, so
the article landed pixel-identical to `service-detail.html`, and it rendered beautifully at 1440.

A fixed-width 200px item inside a `minmax(0,1fr)` track **cannot shrink when the track
does** — it sticks out of it, leftward, and `html{overflow-x:clip}` (home-r9.css:29) then
hides the evidence instead of producing a scrollbar.

| viewport | rail left edge | section's own gutter | verdict                               |
| -------- | -------------- | -------------------- | ------------------------------------- |
| 1240     | 34px           | 54.6px               | **20.6px outside the page margin**    |
| 1300     | 62px           | 57.2px               | clears by 4.8px — luck, not clearance |
| 1440     | 176px          | 63.4px               | fine                                  |

My own derived breakpoint (1219px) was wrong too, because I had estimated 74ch as 629px
where it measures **678px**. The real threshold is 1286px, and a breakpoint that tight is
a bug waiting for a font change.

**Fix:** two tracks, `200px minmax(0,74ch)`, `justify-content:center`. The article track
shrinks instead. Re-measured at every width above: the rail is inside the gutter at all of
them and `documentElement.scrollWidth` never exceeds `innerWidth`. At 901px (one pixel
above the collapse) the article narrows to 582px ≈ 63ch, still a comfortable measure.

### 3.2 A jumped-to heading landed **5px behind the fixed bar** at 1440×700 — **fixed**

The obvious citation for `scroll-margin-top` is `.svcstack`'s `clamp(76px,10vh,94px)`
(home-r9.css:337). At 1440×900 that resolves to 90px and lands every heading 9px clear.
But **the bar's height is width-driven** — its padding is `clamp(11px,1.5vw,17px)`
(home-r9.css:44) — so it measures 81px at 1440 at _every_ viewport height. At 1440×700,
10vh = 70px, the clamp floors at 76px, and the heading top lands at 76 against a bar bottom
of 81.

1440×700 is not an edge case: design-kit.md §7 measures a 1440×900 laptop at a **757px**
viewport, which is why the kit has a whole `max-height:1040px` layer.

**Fix:** `clamp(90px,12vh,124px)` — `.crumb`'s own clearance (kit.css:1306), and the same
value the rail's sticky top already uses. Its 90px floor clears 81px at every viewport
height. Re-measured at 1440×900, 1440×700 and 390×844: **all nine anchors land clear, in
all three documents, tested from the bottom of the page.**

**Also worth recording: `phase2-notes.md` §10's figure for the inner-page bar is wrong.**
It records 74.5px at 1440; it measures **81px** here, and 65px at 390. Anything sizing
clearance off 74.5px inherits a 6.5px error.

### 3.3 `justify-self` now applies in **block** layout, and it broke the mobile rail — **fixed**

At 390 the in-flow rail rendered 217.8px wide inside a 341px column, right-aligned, with
the article beneath it at the full 341. `width:auto` was set and winning; `display` was
`block`; `float` was `none`; the parent was `display:block`. Setting `width:100%`
"fixed" it.

The cause is the base rule's `justify-self:end`, left in place when `.legal` became
`display:block` at the breakpoint. **Chrome now applies the box-alignment properties in
block layout, not only in flex and grid**, and a block-level `justify-self:end` makes the
box shrink-to-fit and sit against the end edge. It presents as a width bug and is an
alignment one.

The current `.legal` no longer sets `justify-self`, so the bug is gone at source, but
`justify-self:auto;align-self:auto` is kept as an explicit reset in the media query and
the finding is written into the stylesheet. **It generalises: any pattern in this kit that
sets `justify-self`/`align-self` on a grid item and then collapses the grid at a
breakpoint carries the same latent bug.** `.cols`, `.twoup`, `.quotes` and `.svcgrid` all
collapse at 900px; none of them currently sets `justify-self`, so none is affected today.

### 3.4 Three stacked tables sized their columns independently — **fixed**

The Cookie policy stacks three tables with identical headers. With the default
`table-layout:auto` each sized to its own content: at 1440 the "Purpose" column started at
719px in the first table and 624px in the second. Nothing is technically wrong; it reads
as sloppy.

`table-layout:fixed` plus two column widths locks all three to one grid — measured after:
217 / 339 / 122 in all three. The widths took **two** attempts: 32% of a 420px minimum
gives a 134px cell, which is only 120px of _content box_ once the cell's own 14px
padding-right comes off, and `cookie_consent` measures 132px and carries
`white-space:nowrap`. It overran into the gutter and left 2px between it and the Purpose
text. 35% of 440px gives 154px, i.e. 138px of content — **verified: 132px name in a 138px
box.**

### 3.5 Sticky needs `align-self:start`, and it pins correctly

A grid item's containing block is its _grid area_, which spans the full row height — but
with the default `align-self:stretch` the item's own box is also the full row height, and
a sticky element whose box fills its containing block has nowhere to travel. Measured both
ways: stretch gives **0px of pin**; `align-self:start` gives **3,150px** on Privacy and
**4,500px** on Terms at 1440×900. The rail releases exactly where the article ends, which
is correct — a TOC should not be pinned over the closing band and the footer.

`max-height:calc(100lvh - clamp(90px,12vh,124px) - 24px)` with `overflow-y:auto` is a
safety net for a longer document; at 1440×900 the tallest rail (Terms, 9 entries) is 457px
against 786px available, so it never engages today. `lvh` by construction, not `svh` —
untestable in this harness (trap 6).

### 3.6 The TOC anchor test, in full, because it is the brief's hard part

Harness traps 4 and 5 were read first. **The trap does not bite here, and the reason
matters:** a sticky element reports its _pinned_ position, so an anchor whose TARGET is
sticky has nowhere to scroll. Here the sticky element is the rail, and the targets are
static `h2`s inside a non-sticky `.prose` block. Their rects are true.

Method: scroll to `document.scrollHeight - innerHeight` — **below every target** — then
click each rail link and read the heading's rect. Repeated for all three documents at three
viewport sizes. `scroll-behavior:smooth` was temporarily neutralised for the measurement
so the landing position could be read synchronously; see §6 for what that means was _not_
tested.

Result, all 9 / 6 / 9 links: `before: 4675 → after: 383 … 3532`, heading top **108px** on
every single one at 1440×900, **90px** at 1440×700, **101px** at 390×844. Bar heights 81 /
81 / 65. Nothing was missed, nothing no-opped.

**No JavaScript is used for scrolling.** `preventDefault` + a manual `layoutTop()` would
have been needed only if the targets were sticky. Native anchors plus `scroll-margin-top`
on the heading is the whole mechanism, which also means the port needs no behaviour at all
for navigation.

### 3.7 Smaller things, found and left alone

- **The masthead does NOT have the flagged 78–81%-of-viewport problem here.** Crumb +
  masthead measure **435px, 48.4% of a 900px viewport**, because the legal masthead
  carries no `.lead` and no action row. Nothing was changed; recording it because the
  open masthead-height question (session.md §4a, "still open") does not apply to this
  page and a blanket `max-height:1040px` compression on `.mast h1` would shorten a
  masthead that is already short.
- **`.res` does not resolve at the top of the page** on the white body section. The
  section is ~3,600px tall, so at scroll 0 only ~440px of it is visible and it never
  reaches `threshold: 0.16` until you scroll. The headings sit in `--grey` `#70707B`
  until then — which measures **4.86:1 on white**, clearing the 3:1 large-text floor, so
  trap 12's "rest colour must be legible unaided" holds. Behaviour is identical to the
  approved `service-detail.html`; not changed.
- **The bar ground probe is correct** (`ink` at the masthead, `white` in the body, `navy`
  at the footer, re-read on every frame so the rig's document swap cannot leave a stale
  list). Screenshots taken straight after a programmatic scroll show the _previous_
  ground — that is design-kit.md §14's documented lag plus a backgrounded tab, not a page
  bug. Confirmed by reading `data-ground` and the computed background after a wait.
- **Touch targets:** minimum TOC row height measured **44px** exactly, at both breakpoints.
- **No horizontal overflow at any width tested.** `documentElement.scrollWidth` tracks
  `innerWidth - 9` (the kit's 9px scrollbar) throughout.
- **`kit-additions-h.css` parses clean:** 38 top-level rules, 49 including nested, 254
  declarations retained, **zero rules with all declarations dropped**. No console
  messages of any kind.
- **Structural check (static, over the file):** zero duplicate `id`s across all three
  documents; every TOC `href` resolves; TOC entry count equals `h2[id]` count per
  document (9 / 6 / 9); every TOC label matches its heading text exactly once the clause
  number is stripped.

---

## 4. Every CSS value I introduced, with its source

`INVENTED` means there is no source and the number was measured or reasoned; each one says
which.

### `.legal`

| Declaration                  | Source                                                                                                                                                               |
| ---------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `gap:clamp(22px,3.4vw,58px)` | `.price`'s two-column gap, home-r9.css:393 — also `.footmap` kit.css:1604, `.twoup` kit.css:2443                                                                     |
| `minmax(0,74ch)`             | `.measure`, kit.css:1410 (itself `project-post.html:25`)                                                                                                             |
| `200px` rail width           | **INVENTED.** Measured: narrowest width holding "Ownership and intellectual property" without hyphenation at 14px Archivo. `LegalToc`'s 220px was the starting point |
| `justify-content:center`     | **INVENTED** (a keyword, not a number). Reason in §2.1                                                                                                               |
| `align-self:start`           | **INVENTED** (a keyword). Load-bearing for sticky — §3.5                                                                                                             |

### `.legal__rail`

| Declaration                                               | Source                                                                                                                                         |
| --------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------- |
| `position:sticky;top:clamp(90px,12vh,124px)`              | `.crumb`'s clearance, kit.css:1306. Explicitly **not** `.detail{top:120px}` (kit.css:732), which hardcodes an offset for the 81px homepage bar |
| `max-height:calc(100lvh - clamp(90px,12vh,124px) - 24px)` | same clamp; `lvh` per design-kit.md §9.2                                                                                                       |
| `margin:0 auto clamp(40px,6vh,72px)` (≤900)               | `.cards--2`'s top margin, home-r9.css:168                                                                                                      |
| `padding-block:clamp(20px,3vh,28px)` (≤900)               | `.mast__meta`'s `padding-top`, kit.css:1364                                                                                                    |
| `border-top/bottom:1px solid rgba(14,14,18,.14)` (≤900)   | `.row`/`.work`'s light rule, home-r9.css:313                                                                                                   |
| dark-ground rule `rgba(255,255,255,.22)`                  | `.qa`'s dark rule, home-r9.css:432                                                                                                             |

### `.legal__toc`

| Declaration                                                  | Source                                                                                                                                                                              |
| ------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `font-size:14px;font-weight:500;opacity:.72`                 | `.bar nav a` verbatim, home-r9.css:89 — this design's one navigation-link spec                                                                                                      |
| `15px / opacity .76` (≤900)                                  | `.footmap a`, kit.css:1617                                                                                                                                                          |
| `min-height:44px`                                            | the mobile doctrine's touch floor, asserted directly as kit.css:1660 does for `.crumb a`                                                                                            |
| `padding:11px 0 11px 14px`                                   | **INVENTED.** 11px is what takes a 14px line box to the 44px floor; 14px is the indent the 2px rule needs                                                                           |
| `border-left:2px`                                            | `.card::before` / `.big`'s rule weight, home-r9.css:219 / 464                                                                                                                       |
| `gap:9px` (number → label)                                   | `.detail__l`'s icon gap, home-r9.css:424                                                                                                                                            |
| `::before` `font-weight:800;font-size:13px;color:var(--acc)` | `.step__k`'s number idiom (800, accent) at running size — exactly as `.prose ol li::before` already does it, kit.css:1497-1498. 13px is **INVENTED**, one step under the 14px label |
| `line-height:1.35`                                           | **INVENTED.** Optical, for a two-line nav label; no source                                                                                                                          |
| hover `padding-left:14px → 26px`                             | the 12px padding-shift of `.tier` (home-r9.css:399) and `.qa summary` (home-r9.css:438)                                                                                             |
| `transition … .35s cubic-bezier(.16,1,.3,1)`                 | `.tier`'s duration and the design's primary curve, home-r9.css:399                                                                                                                  |
| `[aria-current]` full opacity + accent rule                  | the kit's existing `[aria-current]` idiom — shared.css:52, kit.css:1314, kit.css:1620                                                                                               |
| `scroll-margin-top:clamp(90px,12vh,124px)`                   | `.crumb`'s clearance, kit.css:1306. Rationale and the wrong first value in §3.2                                                                                                     |

### `.ltable`

| Declaration                                        | Source                                                           |
| -------------------------------------------------- | ---------------------------------------------------------------- |
| cell padding `clamp(13px,2vh,21px)` vertical       | `.qa summary`, home-r9.css:437                                   |
| cell padding `14px` horizontal                     | `.tier`'s gap, home-r9.css:707                                   |
| row rule `rgba(14,14,18,.14)`                      | `.row`/`.work`, home-r9.css:313                                  |
| head rule `rgba(14,14,18,.16)`                     | `.tiers`, home-r9.css:394                                        |
| head type `12.5px / .11em / 700 / uppercase / .6`  | `.eyeless` verbatim, kit.css:126                                 |
| body cell `15.5px / 1.5`                           | `.detail__p`, home-r9.css:423 — the same value `.ctable li` uses |
| cell `opacity:.86`                                 | `.prose p`, kit.css:1446                                         |
| dark rules `rgba(255,255,255,.22)` / `.28`         | `.qa` home-r9.css:432 / `.svcs` kit.css:555                      |
| `min-width:440px` on `.ltable--wide`               | **INVENTED.** Measured — §3.4                                    |
| `table-layout:fixed` + `35%` / `18%`               | **INVENTED.** Measured — §3.4                                    |
| `.ltable code{white-space:nowrap}`                 | **INVENTED** (a keyword). `_ga_*` breaks mid-token otherwise     |
| `.prose .cscroll{margin-top:clamp(28px,4vh,44px)}` | `.prose ul`'s own top margin, kit.css:1486                       |

### `.prose .mast__meta` adjustments

| Declaration                           | Source                                                            |
| ------------------------------------- | ----------------------------------------------------------------- |
| `margin-top:clamp(28px,4vh,44px)`     | `.prose ul`'s, kit.css:1486                                       |
| `overflow-wrap:anywhere` on its links | kit.css:1609's measured fix for the same 36-character email token |
| `gap:22px` at ≤900                    | `.mast__meta`'s own mobile gap, kit.css:1679                      |

### The rig (deleted at port)

All values are **INVENTED** and deliberately kept out of the design vocabulary: 11px
label, 13.5px buttons, 100px radius, aqua pressed state, `0 18px 40px -20px` shadow. It is
a control panel for a reviewer, not a component.

---

## 5. Voice, case, and every edit I made to the source text

### 5.1 The voice decision — **this is the one that needs a ruling**

Ground rule 8 is first-person singular. **The three legal bodies are first-person plural
and I left them that way, deliberately.** Counts, measured:

| Document                        | `we` / `We` | `us` / `Us` | `our` / `Our` | total  |
| ------------------------------- | ----------- | ----------- | ------------- | ------ |
| `privacy-policy/page.tsx`       | 21          | 5           | 10            | **36** |
| `cookie-policy/page.tsx`        | 9           | 4           | 7             | **20** |
| `terms-and-conditions/page.tsx` | 15          | 6           | 14            | **35** |

**Why I did not convert them.** This brief says the content is fine and only the shell
changes, and says not to rewrite legal prose. In `terms-and-conditions` §1 the pronouns
are not style, they are **defined terms**:

> Digital Consulting Services Ltd ("we", "us", "our", or "Ricky") provides website
> design, build, …

Changing those is changing a contract's definition of the contracting party, not changing
a shell. The privacy notice has the same construction in §1. A find-and-replace across 91
occurrences would also produce "I do not sell your personal data to third parties" and "I
reserve the right to pursue recovery of unpaid invoices", which is a different document
with a different tone of liability, and that is a decision for Ricky and a solicitor, not
for a design agent.

**What this means in practice.** If the voice IS converted in the content pass, the
defining clause has to change first — Terms §1 and Privacy §1 — and every downstream
pronoun follows from it. Doing it the other way round leaves a contract that defines "we"
and then never uses it.

**Every word of shell copy I authored is first-person singular**, per ground rule 8:

- "What gets set on your device, why, and how to turn it off." (Cookie policy nav line)
- "What personal data I hold, why, how long for, and your rights over it." (Privacy nav line)
- "The commercial terms I work under — quotes, payment, ownership, cancellation." (Terms nav line)
- "The other two documents." / "Also legal" (closing band heading and eyebrow)
- "Legal" / "On this page" / "Last updated" / "In this document" / "Supervisory authority" /
  "Cookie categories" / "Governing law" (labels)

That is the complete list of copy on this page that is not in the source. **This does mean
the page currently carries singular nav copy next to plural legal bodies.** It is visible
and it is deliberate — flagging it rather than hiding it by making the nav plural too.

### 5.2 Case

Settled decision: **sentence case everywhere** (notes-c.md §15). The source headings are
Title Case, so every `h2`, `h3`, TOC label and table head was lowered: "Data Controller
Information" → "Data controller information", "Retention Period" → "Retention period",
"Right of Access" → "Right of access", and so on.

Untouched: proper nouns (Information Commissioner's Office, Google Analytics, Facebook
Pixel, Chrome, Firefox, Safari, Edge, England and Wales), initialisms (UK GDPR, ICO, SSL,
HTTPS, CMS, IT), and the four **product tier names** — Starter, Professional, Growth,
eCommerce — which are defined terms in the T&Cs and keep their capitals.

### 5.3 Structural edits to the markup, all five of them

The words are verbatim in every case. These are re-markings, listed so a reviewer can
check each one against the source.

1. **Privacy §4 (legal bases) and §7 (your rights)** were `<dl>` grids of four and six
   terse term/definition pairs. They are now `<ul>` with `<strong>Term</strong> — Body`.
   The em dash is the only added character; no word changed, no capital changed. Six
   `h3` + `p` pairs for forty words of definition read as six subsections rather than as
   a list. **Privacy §2 kept its `h3` + `p` structure** because those four bodies are
   full sentences, not fragments.
2. **Privacy §9** rendered "Contact us" and "Supervisory authority" as two bordered
   cards. They are now two `h3` blocks in flow. A card in this design implies a
   destination — `.card` has a hover lift and a `.card__link` — and nothing in that
   section is clickable except two links.
3. **Terms' closing note** (page.tsx:364-371) sat in a tinted bordered panel with no `id`
   and no TOC entry. It is now `.prose hr` + a paragraph. kit.css:1536-1539 records that
   the rule stands in for a new `h2`, which is what an unnumbered closing remark after
   clause 9 is.
4. **Terms §1 and §9's contact blocks**, and **Privacy §1's data-controller block**, use
   `.mast__meta` instead of a Tailwind `bg-surface-card rounded-[20px]` card. The
   stacked value-over-label item is that block's shape and it already has a precedent
   inside another component (kit.css:2279).
5. **The article body is a flat `.prose` block with `id`s on the `h2`s**, not the
   source's `<section id>` wrappers. `.prose>*+*` and `.prose>:first-child` are **child**
   selectors (kit.css:1444-1445): wrapping each clause in a `<section>` makes every
   paragraph a grandchild, so p→p spacing silently becomes 0, and the rules you then add
   to fix it (`.legal__s>*+*`, 0-2-0) out-specify `.prose h3`, `.prose ul` and
   `.prose ol` (0-1-1) and collapse their margins too. Flat markup keeps `.prose`
   behaving exactly as wave 1 rendered and verified it. Semantic cost: no `<section>`
   grouping; the headings still structure the document for assistive tech.

**Terms §2's four pricing tiers were deliberately NOT tabulated.** A table would be more
legible, but building it means editing the price _strings_ — "Upfront: £750 + £10/month |
Monthly: £45/month with 24-month minimum term" has to be split into cells — and those are
contract terms. They stay as `h3` + two lines, verbatim. Offered as a follow-up for a
human to rule on, not taken unilaterally.

**Prices cross-checked** against the approved `pricing.html`, which carries the same set:
750/10, 45, 1,495/15, 85, 2,995/25, 150, 50, and the 5/20/100 page counts. Session §4a #1
settled £750/£45 and 5/20/100 as real; the rest match the page wave 1 shipped.

**A whole-document fidelity check was run**, normalising quotes, dashes and whitespace and
testing every source text node over 25 characters for presence in the prototype. Three
fragments reported missing; all three were investigated and two were regex artefacts. The
third was real — I had merged "You have the right to lodge a complaint with:" and the
following ICO paragraph into one sentence — and **it has been reverted** to the source's
two-element form. Re-checked clean.

### 5.4 Gaps in the source content — noted, never filled

Per the brief: flagged, not fixed, and nothing invented to cover them.

1. **`lastUpdated` is computed, not authored.** All three pages do
   `new Date().toLocaleDateString('en-GB', …)`, so **every build publishes "last updated:
   today" on three legal documents**, regardless of whether anything changed. That is a
   correctness bug in a legal notice, not a styling one. The prototype authors
   **25 August 2026**, the source files' own last-modified date, as the nearest defensible
   value. The real date must be authored and confirmed before launch.
2. **`terms-and-conditions/page.tsx:4` carries a TODO: "Draft content pending Ricky's
   legal review — not reviewed by a solicitor."** It is a code comment, so it does not
   render, and per the copy register rule (notes-c.md §14) no editor note appears in the
   rendered copy. But it is the single most important thing on this page: the commercial
   terms the business operates under have never had legal review. Raising it here because
   this design makes those terms considerably more findable than they currently are.
3. **The cookie policy declares cookies that may not exist.** `_ga`, `_ga_*`, `_fbp` and
   `gclid` are listed as set. Whether GA4 and the Facebook Pixel are actually live on the
   DCS site was not verified — it is outside this brief — but a cookie policy declaring
   trackers that are not set (or, worse, missing ones that are) is a compliance problem.
   Worth a five-minute check before the `noindex` comes off.
4. **The privacy policy names no data processors and no international transfers.** UK
   GDPR notices normally identify categories of processor (hosting, email, analytics) and
   say whether data leaves the UK. §5 says only "service providers who assist our
   operations (e.g., IT support, payment processors)". Not filled in — inventing a
   processor list would be inventing a clause.
5. **"Project information … property information, and service preferences"** (Privacy §2)
   reads as leftover from the gardening/trades template. Not changed; it is content.
6. **The Terms' closing note has no clause number and no TOC entry** in the source. Kept
   unnumbered, after the `hr`, which is the honest rendering of what it is.

---

## 6. What I could not verify

Stated plainly rather than glossed.

- **Smooth scrolling was neutralised for the anchor measurements.** `html` carries
  `scroll-behavior:smooth`, and a jump from the bottom of a 4,675px document to clause 1
  is a ~4,200px rAF-driven animation that does not complete in a backgrounded iframe
  (harness trap 2) — the first attempt froze the renderer for 45 seconds. I set
  `scroll-behavior:auto` for one measurement to isolate the **landing position**, which is
  the thing that can be wrong. **What that did not test: whether a 4,200px smooth scroll
  is a good experience on a legal page.** My judgement is that it is acceptable — it shows
  the reader where they moved to — but it is a judgement, not a measurement, and it is
  existing kit behaviour I did not change.
- **The scroll-spy is an optional enhancement and is not load-bearing.** It sets
  `aria-current="true"` on one rail entry and nothing else; the TOC is complete and fully
  navigable with the whole block deleted. `legal-toc.tsx` ships with no scroll-spy today
  ("No scroll-spy JS — these pages are text, not an app surface") and that remains
  defensible. **Port cost:** `LegalToc` is a server component, so this needs either a
  small client wrapper or `'use client'` on it. It is a scroll listener rather than an
  `IntersectionObserver` for two reasons — IO never fires in this harness (trap 1) so an
  IO version could not have been verified at all, and a scroll listener reuses the exact
  rAF-throttled pattern the bar probe already uses on every page in the set.
- **`lvh` vs `svh`, `prefers-reduced-motion`, `@media (hover:none)` and
  `env(safe-area-inset-*)` were not exercised** — all four viewport units resolve
  identically in an iframe (trap 6). `lvh` is used by construction on the rail's
  `max-height`; the `hover:none` block is written but untested; `env(safe-area-inset-bottom)`
  on the rig is untested and the rig is deleted at port anyway.
- **No real touch device.** The 44px floor is measured geometrically, not tapped.
- **`table-layout:fixed`'s column percentages were measured in Chrome only.** A different
  font stack (Archivo failing to load, the `system-ui` fallback taking over) would change
  `cookie_consent`'s 132px and could overrun the 138px cell. The 8px of slack is thin.
  Worth re-checking once, with fonts blocked.
- **Only Chrome.** No Safari, no Firefox. §3.3's `justify-self`-in-block-layout finding is
  specifically a recent-Chrome behaviour; other engines may not do it, which makes the
  explicit reset cheap insurance rather than redundancy.
- **`IntersectionObserver` never fired in the harness**, so every screenshot has `.in`
  latched by hand. **Nothing about the `.res` colour resolve, or about the reveal layer,
  can be inferred from these captures.** The one `.res` fact I do assert is measured from
  computed styles, not from a picture: the muted rest colour is `#70707B`, 4.86:1 on white.
- **Screenshots taken immediately after a programmatic scroll show a stale bar ground.**
  That is design-kit.md §14's documented lag plus a backgrounded tab. Where the bar looks
  wrong in a capture, `data-ground` and the computed background were read separately and
  were correct.
- **The mobile in-flow TOC costs 478px at 390×844** — a full screen of nav before the
  article starts. That is a real cost and it is not hidden. A collapsed `<details>` was
  considered and rejected: making one element an always-open rail above 900px and a
  disclosure below it needs either duplicate markup for the same nine links (two `<nav>`s,
  one of them wrong for a screen reader at any given width) or an author `display:block`
  override of the UA's closed-`<details>` machinery, which this prototype cannot test
  across browsers. Nine visible entries at the head of a legal document is arguably the
  thing the reader came for. If a reviewer disagrees, the disclosure is the alternative
  and it is a markup change, not a design change.
- **The `id` prefixes (`pp-` / `cp-` / `tc-`) are a prototype artefact.** Three documents
  in one file collide on `contact` and `how-we-use`. On the real site each document is its
  own route and **the source ids are correct unprefixed** — do not carry the prefixes into
  the port.
- **I did not check whether the three legal routes are linked from anywhere today.** They
  appear in this prototype's `.footmap`, following `404.html`'s footer, but whether the
  shipped `SiteFooter` links them was not verified.

---

## 7. Port notes, in one place

1. Delete `[data-rig]` (markup + script block 5) and §H6 of `kit-additions-h.css`.
2. Drop the `pp-` / `cp-` / `tc-` id prefixes; use the source ids.
3. `LegalHero` → `.crumb` + `.mast` + `.mast__meta`. Its `lastUpdated` prop must take an
   authored date string, not `new Date()`.
4. `LegalToc` → `.legal__rail` + `.legal__toc`, same `<nav>`/`<ol>`/`<li>`/`<a>` shape.
   Add `aria-label="Table of contents"` (already there) and nothing else unless the
   scroll-spy is wanted, in which case it needs a client boundary.
5. `terms-and-conditions/page.tsx` currently uses **neither** component — it hand-rolls
   `Breadcrumbs`, an `h1.heading-hero` and a bordered "Contents" box with its own nine-item
   `<ol>` (page.tsx:34-97). All of that is replaced by the shared template; unifying it is
   most of the point of this brief.
6. Keep the body flat. Do not reintroduce `<section id>` wrappers around each clause
   without also re-testing `.prose` spacing — see §5.3 item 5.
7. `scroll-margin-top` goes on the heading. Do not touch `html{scroll-padding-top:0}`.
