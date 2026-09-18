# notes-f.md — Agent F, wave 2

**Pages:** `prototype/blog-list.html`, `prototype/blog-post.html`, `prototype/blog-category.html`
**CSS:** `kit-additions-f.css` (41 rules, 166 declarations, 0 empty rules — parsed in a real browser)
**Harness:** `prototype/_f_harness.html` (measurement only, not a page — see §6)
**Date:** 2026-09-18

---

## 0. The headline

The blog index is designed so that **its height is a function of the number of topics, not
the number of posts.** That is the whole answer to D4's "must not degrade into a wall at
40–60 posts", and it is measured rather than asserted: at 21 posts the library section is
**3,010px**, at 40 it is **3,634px**, and **at 60 it is still 3,634px.** The same content
in one flat uncapped list measures **6,034px** at 60.

Five things worth a decision from you are listed in §8. Two of them are corrections to the
brief rather than design choices.

---

## 1. What I reused, by class name

Nothing on these three pages is a new visual language. The full list:

**Chrome, byte-identical to the approved set** — spliced from `projects-list.html` by
script rather than retyped, so the logo path, the bar, the overlay, the footer link map and
the three behaviour scripts cannot have drifted: `.bar`, `.mark`, `.mark__svg`,
`.mark__type`, `.bar__r`, `.hire`, `.burger`, `.menu`, `.menu__nav`, `.menu__foot`,
`.pagefoot`, `.end__main`, `.end__foot`, `.footmap`, `.big`, `.hero__act`, `.btn`.
The only edits are which link carries `aria-current` and — on `blog-list.html` only — the
filter script, which is replaced with a two-axis version.

**Page furniture:** `.crumb` (+ `.crumb + .mast`'s 20px rule), `.mast`, `.mast__meta`,
`.eyeless`, `.lead`, `.res`, `.sec`, `.p--ink/--magenta/--white/--aqua/--navy`, `.measure`.

**Lists and cards:** `.work` / `.row` / `.row__n` / `.row__m` / `.row__m em` — design-kit.md
§6.2 records `.row` as "designed for: a dense index — blog post list, location list", and
it had never been used for one. This is it. Plus `.svcs` / `.svc` / `.svc__n` / `.svc__d`
(its dark-ground sibling), and `.svcgrid` / `.svccard--wide` / `.svccard__ix` / `__t` /
`__d` / `__l` — Agent B's block, unchanged, for the featured post.

**Prose:** `.prose` and every element rule in it — `p`, `h2`, `a`, `strong`, `em`.
`.measure`'s 74ch. `.cscroll` as the table's overflow wrapper.

**Controls and states:** `.filterbar`'s `.count`, `.paytoggle` and `.paytoggle button`
(both axes are this control, unchanged), `.empty` and `.empty a`, `.card__link` (Agent A's,
and Agent A predicted /blog would want it — notes-a.md §9.2), `.detail__l` with Agent C's
light-ground accent swap, `.twoup` / `.twoup__p` (Agent C's).

**Behaviour, ported not rewritten:** the bar's `data-ground` probe at `bar.height * 0.62`
with last-match-wins, the one-shot `.in` IntersectionObserver at threshold 0.16, and the
sibling-not-descendant mobile overlay.

---

## 2. What I had to invent, and why

Seven things. Four introduce a new selector but no new number; three introduce a number,
and all three are marked INVENTED in the CSS.

| #        | Thing                                | Why it could not be reused                                                                                                                                                                                                                                                                                                                                         | Closes                           |
| -------- | ------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | -------------------------------- |
| **F-01** | `.filterset` / `.filterax`           | `.filterbar` is a flex row with `justify-content:space-between` holding **one** `.paytoggle` and the count. Two axes need a label each, or two unlabelled pill rows say nothing about which is which. This is a container only — both axes are `.paytoggle` unchanged, and the label is `.eyeless` unchanged. **No new number.**                                   | **G9**                           |
| **F-02** | `.paytoggle button[aria-disabled]`   | The sector axis has seven values and two have posts. D4 says design the axis at full width now; the alternative — render only the populated chips — leaves the control untested at seven, which is the retrofit D4 is trying to avoid. So all seven render and the five empty ones say so. Values are Agent D's `.btn[aria-disabled]` verbatim. **No new number.** | part of **G9**                   |
| **F-03** | `.topic` / `.topic__h` / `.topic__d` | **The wall fix.** Nothing in the kit groups a list into bounded blocks. See §3 for the measurements. **No new number** — every value is `.footmap`'s, `.filterbar`'s, `.payhead`'s or `.twoup__p`'s.                                                                                                                                                               | **G10**, differently (see below) |
| **F-04** | `.jump`                              | There is no in-page navigation pattern anywhere in the kit. Built from `.trade`'s rule-and-label move, `.prose ol li::before`'s numeral, `.detail__l`'s gap, `.prose li`'s indent and `.footmap a`'s link treatment. **One new number:** `scroll-margin-top` — but the value is `.wpanel__ix`'s own clamp, so not new either.                                      | —                                |
| **F-05** | `.chip` / `.chips`                   | **G14** verbatim: "`.card__tag` is a positioned overlay pill; there is no in-flow tag for a post's categories." `.chip` IS `.card__tag` with `position`/`top`/`left`/`z-index` dropped and the media-scrim fill replaced by `.prose code`'s two ground tints. **No new number.**                                                                                   | **G14**                          |
| **F-06** | `.prose table`                       | `.prose` has **no table rule at all** and three of the twenty-one posts contain one — they would render as UA-default tables inside a fully-specified prose column. Values are Agent C's `.ctable` minus its two pricing-specific ones. **No new number.**                                                                                                         | —                                |
| **—**    | `.svc__d em`                         | Found by rendering (§3.6). The selector is new; the declaration block is `.row__m em`'s, copied unchanged.                                                                                                                                                                                                                                                         | —                                |

**Two numbers in this work are genuinely mine, and only one of them is CSS:**

- **The four-post cap**, which is a markup decision, not a rule — rows past the fourth carry
  `hidden` (§3.1 is the arithmetic behind choosing four).
- **`line-height: 2.8`** on the jump list's numeral below 900px. It is a recalibration of
  kit.css:1497's own 1.8 against the 44px touch target the same breakpoint imposes, not a
  new design value, and it is marked in the file.

Everything else is audited in §4: **no new length, colour, duration or curve.**

### G10 — pagination. I did not build one, and that is a decision, not an omission.

G10 lists "Pagination / load more" as the gap because "/blog must not degrade into a wall at
40–60 posts". I have answered the requirement without the component:

- The **index** never grows, because each topic caps at four and hands the rest to the
  topic page. Measured: identical height at 40 and 60 posts (§3.1).
- The **topic page** is the "all of them" view. A dense `.svc` list carries about twenty
  comfortably. At 60 posts across seven topics the largest holds roughly eighteen.
- A pager starts earning its place at roughly **25 posts in one topic**, i.e. a library of
  about 150. Building it now would mean shipping a component that cannot be reached with
  the real content and can only be verified by forcing it — which Agent A had to do for
  `.empty` and flagged as a weakness of that approach (kit.css:1964-1968). I would rather
  hand you a measured threshold than an unverifiable control.

If you want a pager anyway, say so and it is half an hour — but it should be designed
against real overflow, not against a synthetic one.

### The one seam in the taxonomy, stated rather than hidden

`industry-guides` is the only topic labelled by **who** has the problem rather than by the
problem, which is exactly what D4 says a topic must not be. It is on the page because the
three posts carry that `category` in their frontmatter and D4 also says do not rewrite
them. **Recommendation for 40 posts:** dissolve it into the sector axis — those three posts
become `sector: trades` entries under "What a site needs" or "Getting found", and the topic
stops existing. Flagged in the markup too (`blog-list.html`, topic 5's comment) so it does
not get quietly entrenched.

### Two other structural recommendations

1. **`local-seo` and `getting-found-online` overlap badly.** "How to get more leads from
   your website" and "Why tradespeople need a website" sit under one, "How to rank on Google
   Maps" under the other, and at 40 posts nobody will know which to file a new post in. They
   want either merging or a sharper boundary. Not mine to change — the values are in
   frontmatter.
2. **Five posts were written under a different frontmatter convention.** `how-much-does-a-
tradesperson-website-cost`, `how-to-get-more-leads-from-your-website`,
   `is-it-worth-paying-for-seo`, `pay-monthly-vs-upfront-website` and
   `website-vs-facebook-page-for-tradespeople` have no `slug`, no `excerpt`, no
   `readingTime`, no `featured` and no `heroImage`. The design handles it — those rows
   simply carry no read time and the index falls back to `description` — but it is content
   debt, and it is visible on the page as three rows in "Working out what to spend" with a
   date and nothing else.

---

## 3. What I found when I rendered it

Everything below was measured in a browser at **1440 × 900 and 390 × 844** through
`_f_harness.html`, plus rAF- and anchor-dependent checks in a top-level tab. Seven real
bugs, five of them invisible in the markup.

### 3.1 The D4 question, answered with numbers

Measured by cloning rows in the live DOM and re-reading `#library`'s height at 1440:

| Library                         | `#library` height | Rows visible | Document height |
| ------------------------------- | ----------------- | ------------ | --------------- |
| 21 posts (as shipped)           | **3,010px**       | 19 of 21     | 6,223px         |
| 40 posts, capped at 4           | **3,634px**       | 28           | 6,848px         |
| 60 posts, capped at 4           | **3,634px**       | 28           | 6,848px         |
| 60 posts, **no cap** — the wall | **6,034px**       | 63           | 9,247px         |

It grows once (21 → 40) because at 21 three topics hold fewer than four posts, so the cap
does not yet bind on them. Past 40 every topic is capped and the index is flat forever.
The uncapped comparison is 66% taller and every row past the first screen is the same
weight as every other, which is what "a wall" means.

At rest the index shows **19 of 21** — only `local-seo` withholds anything, and its two
hidden rows come back the moment either filter is touched (§3.5).

### 3.2 The filter chips burst the viewport at 390 — and it is Agent A's bug, inherited

`kit.css:997` turns a bare `.paytoggle` into `width:100%; display:grid;
grid-template-columns:1fr 1fr` below 900px. That was written for the homepage's two payment
modes. Agent A hit it with six sector chips and scoped the undo to `.filterbar .paytoggle`
(kit.css:2090) — which **does not reach `.filterset`**, so /blog inherited it in full.

Measured before the fix, at 390px: `.paytoggle button` carries `white-space:nowrap`
(kit.css:697), so "Studios and practitioners" at the mobile 15px measures **213px inside a
162px track**, bursting the axis to **433px wide in a 350px content box** —
`documentElement.scrollWidth` **453** against `innerWidth` **390**, which
`html{overflow-x:clip}` then silently clips. No scrollbar, no console error, three chips
with their right-hand ends cut off. After: `scrollWidth` 381, zero overflowing elements.

Agent A predicted this exactly (notes-a.md §9.3). The right Phase 4b resolution is to make
the two-column grid the special case — `.payhead .paytoggle`, the pricing use — rather than
let a third copy of this override arrive with the next filtered index.

### 3.3 The pill track becomes a grey blob from 1280 down, not 900

My first draft of F-01's comment claimed the topic axis wraps at 1440. **It does not, and
rendering caught me writing that.** Measured at eight widths:

| Viewport | Topic axis (8 chips) | Sector axis (7 chips) |
| -------- | -------------------- | --------------------- |
| 1680     | 41px — one row       | 41px — one row        |
| 1440     | 41px — one row       | 41px — one row        |
| 1280     | 41px                 | **78px — wraps**      |
| 1024     | **78px — wraps**     | 78px                  |
| 390      | 196px — four rows    | 196px                 |

`.paytoggle` is `border-radius:100px` (kit.css:694), which renders as a rounded grey blob
with pills scattered inside it the moment it wraps. So the 18px radius fix has to be
unconditional for this use, not `≤900px` as Agent A scoped it — the failure starts on a
1280 laptop and an iPad in landscape.

### 3.4 A `<br>` in the masthead h1 cost 250px of viewport

`.mast h1` is `max-width:17ch` (kit.css:1360). The first draft's h1 read "Answers to the
questions&lt;br&gt;I get asked most." — the 17ch measure broke the first half on its own, so
the authored break made it **four lines** and a masthead over 1,000px tall. Wave 1's h1s
("Real clients.&lt;br&gt;Real outcomes.") are short enough that the measure never binds, so
this does not show up on any approved page. Shortened to "The questions I get asked most."
with no `<br>`: two lines at both widths, and crumb + masthead drops to **634px of 900**
at 1440.

### 3.5 The two-axis filter, exercised

Driven through six states in a real browser, reading the DOM after each:

| State                 | Rows shown | Topics shown | `.count`                                              | `.empty`  |
| --------------------- | ---------- | ------------ | ----------------------------------------------------- | --------- |
| rest                  | 19         | 7            | "21 guides across 7 topics"                           | hidden    |
| topic = Local search  | **6**      | 1            | "Showing 6 of 21 — Local search"                      | hidden    |
| sector = Motorsport   | 1          | 1            | "Showing 1 of 21 — Motorsport and teams"              | hidden    |
| both                  | 0          | 0            | "Nothing matches Local search + Motorsport and teams" | **shown** |
| click a disabled chip | unchanged  | unchanged    | unchanged                                             | unchanged |
| back to rest          | 19         | 7            | "21 guides across 7 topics"                           | hidden    |

Two things worth noting. **The cap lifts when you filter** — 19 at rest, 6 once a topic is
selected — so selecting a topic turns the index into that topic's full list without a page
load. And unlike /projects, **the empty state is genuinely reachable here**: any topic
except "Design and speed" crossed with "Motorsport and teams" returns nothing. Agent A had
to force theirs.

### 3.6 The meta line in a `.svc__d` read as part of the sentence

On the topic page each guide's description ends with "6 min · March 2026". `.svc__d` is one
block of 14.5px at opacity .84 (kit.css:561), so the date read as the last clause of the
description rather than as metadata. `.row__m` had already solved this on the light side —
an `<em>` reset to normal style and turned into the design's 12px uppercase micro-label
(kit.css:546-547) — but `.svc__d` has no equivalent, because the homepage's version carries
only a sentence. Added with `.row__m em`'s declarations copied unchanged. **For Phase 4b:
this belongs on bare `.svc__d em` in kit.css §13** — it completes a pattern the kit ships
half of, exactly as Agent B's `.svccard__l svg` did.

### 3.7 An invented `min-width` forced a table to scroll that fitted fine

I first wrote `.prose table{min-width:520px}` at ≤900px, by analogy with `.ctable`'s 780px.
But 780 is **measured** for five columns of nowrap prices; 520 had no source at all. At
390px it forced the two-column "Metric / Score" table into a horizontal scroll it did not
need — the table measured **520px inside a 341px measure** when its own content fits in 341.
Removed. A `.prose table` cell sets no nowrap, so it wraps and fits, and `.cscroll` is left
to catch only a table that genuinely cannot. After: table 341px, measure 341px, zero
overflow.

### 3.8 A `.measure` around the tag row split the section onto two left edges

The post page's aqua section wrapped its chips in `.measure` by analogy with the prose
section above. `.measure` is `max-width:74ch; margin-inline:auto` (kit.css:1410), so at 1440
the "Filed under" label sat at **x=380** while "More in this topic" below it started at the
gutter at **x=63** — two labels in one section on two different left edges. `.measure` is
for running prose; a tag row is not prose.

### 3.9 "All 1" — the label that only reads wrong at one count

The topic links were "All 6", "All 3", "All 2", "All 1". The last is not English. Relabelled
to "6 guides / 3 guides / 2 guides / 1 guide", which reads naturally at every count, keeps
the count visible on the index at rest, and needs only a trivial plural at port time.

### Things I checked that were already right

- **Ground sequence and the `.sec` corner cut.** The bar's probe is rAF-driven and rAF is
  throttled here (§6), so I reimplemented `read()` inline and called it at each section.
  All six answer correctly on the index: `.crumb` → ink, `.mast` → ink, `.p--magenta` →
  magenta, `#library` → white, `.p--aqua` → aqua, `.pagefoot` → navy. The `.sec` overlaps
  (`margin-top:-44px`) are visible in the rects and the corners reveal the section above,
  not the body's paper.
- **Anchors, from above _and_ from below.** design-kit.md §9.3 is explicit that an anchor
  bug only reproduces from below the target. Tested both ways on all three jump links:
  every one lands the heading at `top: 96px`, from a starting scroll of 0 and from 4,382.
  `scroll-padding-top` is untouched; the clearance is `scroll-margin-top` on the targets
  only.
- **The bar measures 81px at 1440 and 65px at 390**, which independently confirms Agent G's
  correction and `bar-height-correction.md` (commit `0991d310`) rather than the wave 2
  brief's stale 74.5px. My anchor test ran in a 1338-wide top-level tab where the burger's
  `clamp(40px,3.4vw,46px)` has not yet pinned to its 46px cap, so the bar is 80.5px there —
  the same arithmetic, one pixel of clamp short. Either way `scroll-margin-top`'s
  `clamp(96px,13vh,124px)` clears it: **15px of air at 1440, 16px at 1338.** It is a real
  but thin margin, and it is thin because the clamp floors at 96 on any viewport under
  739px tall — which is every laptop. If the bar ever grows again, this is a second place
  that has to move with it, alongside `.detail{top:120px}`.
- **The mobile overlay is not trapped.** Opened on all three pages at 390: the panel reports
  **390 × 844**, the full viewport, not the bar's 390 × 65 box. Current page marked in aqua.
- **The comma trap, resolved up the whole ancestor chain** rather than checked on the
  element. `<td>` → `<tr>` → `<tbody>` → `<table>` → `.cscroll` → `.prose` → `.measure` →
  `.sec` → `<main>` → `<body>`: **Archivo and `font-variant-numeric: normal` at every
  level.** These figures have no comma, but `how-much-does-a-tradesperson-website-cost.mdx`'s
  table is all comma'd prices and inherits the same rule.
- **No horizontal overflow anywhere**: 1440 and 390, all three pages, zero elements outside
  the viewport and `scrollWidth` below `innerWidth` in every case.
- **CSS parses clean**: 41 rules, 166 declarations retained, **0 rules with all declarations
  dropped**. A syntax error shows up as an empty rule; there are none.
- **Console is silent** on all three pages.

### Content facts I established by counting, not by trusting the brief

| Claim              | Brief / session.md         | Actual                                                                                                                                                                                                                                                                  |
| ------------------ | -------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Categories         | **8**                      | **7.** The brief's own table lists seven and its counts sum to 21. Verified across all 21 files. So the design ships **seven** topic pages.                                                                                                                             |
| Word count         | "1,000–1,300 words each"   | **769–1,169**, mean ~950. Twelve of the twenty-one are under 1,000.                                                                                                                                                                                                     |
| Plural-voice lines | "18 of 21 files, 45 lines" | **17 files, 41 lines** by my regex (`we/we've/we'll/we're/our/ours`). The gap is almost certainly the brief counting `us` or a contraction I did not match — not worth reconciling, but the two numbers are different and mine is the one behind the conversions in §5. |

**Body `<h1>`s: sixteen of the twenty-one posts open with a `# ` that duplicates the
frontmatter title exactly.** The five that do not are exactly the five with reduced
frontmatter. The masthead carries the title here and the body h1 is dropped, so the page has
one h1 (verified: `document.querySelectorAll('h1').length === 1`). **The port has to strip
it**, or every one of those sixteen ships two h1s.

**Heading counts per post** — this is what a TOC has to be sized against:

| h2s | Posts |
| --- | ----- |
| 3   | 1     |
| 4   | 5     |
| 5   | 4     |
| 6   | 6     |
| 7   | 4     |
| 8   | 1     |

Median 6, range 3–8. The post shown (`a-fast-team`) has three, so the jump list on
`blog-post.html` renders at its _smallest_; a typical post gets twice as many rows.

**Frontmatter quoting is inconsistent, as the brief said** — `category: "local-seo"` quoted,
`category: costs-and-value` not, and `getting-found-online` appears both ways. Harmless to
YAML. Not fixed, per the brief.

**Two tables sit adjacent and identical** in `a-fast-team-needs-a-fast-website.mdx` —
"Mobile" and "Desktop", four rows each, every value 100. Rendered as written, because D4
says do not rewrite the posts, but it is a real editorial wrinkle rather than a rendering
fault.

**One title has a year in it** — "Why Tradespeople Need a Website in 2025" — on a library
designed to grow. Left alone for the same reason.

---

## 4. Every CSS value introduced, with its source

`kit-additions-f.css` introduces **no new length, colour, duration or curve.** Every
declared value below is copied from a line in `kit.css`. The full audit:

| Rule                               | Value                                                          | Copied from                                                                                                                                          |
| ---------------------------------- | -------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------- |
| `.filterset` margin-top            | `clamp(28px,4vh,44px)`                                         | `.filterbar` kit.css:860                                                                                                                             |
| `.filterset` gap                   | `18px`                                                         | `.payhead` kit.css:689                                                                                                                               |
| `.filterax` gap                    | `8px`                                                          | `.f` kit.css:2819 (label above a control)                                                                                                            |
| `.filterax .eyeless` margin-bottom | `0`                                                            | `.footmap .eyeless` kit.css:1607                                                                                                                     |
| `.filterset .paytoggle` radius     | `18px`                                                         | `.card` kit.css:414 / `.tcard` kit.css:756; same fix Agent A made at kit.css:2100                                                                    |
| `.filterset .paytoggle` ≤900       | `display:inline-flex; width:auto`                              | Agent A's `.filterbar` override, kit.css:2090                                                                                                        |
| `.paytoggle button[aria-disabled]` | `opacity:.45; cursor:not-allowed`                              | Agent D's `.btn[aria-disabled]` kit.css:3087                                                                                                         |
| `.topic` margin-top                | `clamp(56px,8vh,96px)`                                         | `.footmap` kit.css:1605; also `service-detail.html:226`'s inline value                                                                               |
| `.topic:first-of-type`             | `clamp(28px,4vh,44px)`                                         | `.filterbar` kit.css:860                                                                                                                             |
| `.topic__h`                        | flex, gap `18px`, wrap                                         | `.payhead` kit.css:689 minus its margin-top; baseline alignment per `.tcard__h` kit.css:762                                                          |
| `.topic__d`                        | `mt 14px / op .8 / lh 1.5 / 15.5px`                            | `.twoup__p` kit.css:2455 (= `.detail__p` less its min-height)                                                                                        |
| `.topic__d` max-width              | `62ch`                                                         | `.qa__a p` kit.css:799 / `.prose ul` kit.css:1485                                                                                                    |
| `.topic .work` margin-top          | `clamp(20px,3vh,34px)`                                         | `.payhead` kit.css:689                                                                                                                               |
| `.topic .row__n`                   | `clamp(1.02rem,1.75vw,1.42rem)` / `-.022em`                    | `.qa summary` kit.css:788 — the pair Phase 2 chose for `.prose h3` on the same reasoning                                                             |
| `.topic .row__n` line-height       | `1.24`                                                         | `.cards--2 .card__t` kit.css:445                                                                                                                     |
| `.topic .row` align                | `baseline`                                                     | `.svc` kit.css:557                                                                                                                                   |
| `.svc__d em`                       | `12px / .09em / uppercase / op .72 / mt 3px`                   | `.row__m em` kit.css:546-547, copied unchanged                                                                                                       |
| `.jump` padding-bottom             | `clamp(20px,3vh,28px)`                                         | `.trade` kit.css:2475                                                                                                                                |
| `.jump` margin-bottom              | `clamp(28px,4vh,44px)`                                         | `.trade` kit.css:2475                                                                                                                                |
| `.jump` rule                       | `rgba(255,255,255,.22)` / light `rgba(14,14,18,.16)`           | `.trade` kit.css:2475-2477; bottom edge per `.row` kit.css:536 / `.qa details` kit.css:785                                                           |
| `.jump ol` gap                     | `12px`                                                         | `.detail__l` kit.css:743                                                                                                                             |
| `.jump ol` margin-top              | `16px`                                                         | `.footmap ul` kit.css:1608                                                                                                                           |
| `.jump li` indent                  | `28px`                                                         | `.prose li` kit.css:1487                                                                                                                             |
| `.jump li::before`                 | `800 / 15px / accent / lh 1.8`                                 | `.prose ol li::before` kit.css:1497                                                                                                                  |
| `.jump a`                          | `15px / op .76` + accent hover                                 | `.footmap a` kit.css:1617-1619                                                                                                                       |
| `.jump a` ground swap              | magenta on white/paper/aqua                                    | `.crumb a:hover` kit.css:1319-1320                                                                                                                   |
| `.prose h2[id]` scroll-margin      | `clamp(96px,13vh,124px)`                                       | `.wpanel__ix` kit.css:656                                                                                                                            |
| …at ≤900                           | `calc(84px + env(safe-area-inset-top))`                        | kit.css:973 / kit.css:1666                                                                                                                           |
| `.chips` gap / margin-top          | `12px` / `16px`                                                | `.detail__l` kit.css:743 / `.footmap ul` kit.css:1608                                                                                                |
| `.chip` type + shape               | `10.5px / 700 / .1em / uppercase / 5px 9px / 100px`            | `.card__tag` kit.css:430-432, verbatim                                                                                                               |
| `.chip` fill                       | `rgba(14,14,18,.06)` / dark `rgba(255,255,255,.12)`            | `.prose code` kit.css:1558-1559                                                                                                                      |
| `.prose .cscroll` margin-top       | `clamp(28px,4vh,44px)`                                         | `.prose figure` / `ul` / `blockquote` kit.css:1485,1511,1530                                                                                         |
| `.prose table` cell padding        | `clamp(15px,2.2vh,24px) 6px`                                   | `.ctable` kit.css:2520 (← `.tier`, home-r9.css:396)                                                                                                  |
| `.prose table` rule                | `rgba(14,14,18,.16)` / dark `rgba(255,255,255,.22)`            | `.ctable` kit.css:2520 / `.qa` kit.css:784                                                                                                           |
| `.prose table thead th`            | `clamp(1rem,1.42vw,1.28rem)/700/-.022em`                       | `.ctable thead th` kit.css:2522 (← `.card__t`)                                                                                                       |
| `.prose table` cell type           | `15.5px / 1.5`                                                 | `.ctable li` kit.css:2537                                                                                                                            |
| `.prose table td` opacity          | `.86`                                                          | `.prose p` kit.css:1446                                                                                                                              |
| `.prose .cscroll` ≤900 bleed       | `margin-inline:calc(var(--pad)*-1); padding-inline:var(--pad)` | `.cscroll` kit.css:2555                                                                                                                              |
| `.topic` @max-height:1040          | `clamp(28px,4vh,44px)` / `clamp(18px,2.6vh,30px)`              | `.filterbar` kit.css:860 / the compression at kit.css:894                                                                                            |
| `.topic .row` ≤900 gap             | `9px`                                                          | `.detail__l` original, home-r9.css:424                                                                                                               |
| 16px prose floor ≤900              | `16px`                                                         | the mobile doctrine, home-r9.css:544-551 / kit.css:934-942                                                                                           |
| `.jump a` ≤900 target              | `min-height:44px`                                              | `.crumb a` kit.css:1671                                                                                                                              |
| `.jump li::before` ≤900            | `line-height:2.8`                                              | recalibration of kit.css:1497's 1.8 against the 44px target — **the one arithmetic value in the file, and it is a derived one, not a design choice** |

Every hover this file adds (`.jump a`, the disabled chip) is neutralised under
`@media (hover:none)`, per kit.css §24's standing rule.

---

## 5. Every source line I converted

### 5.1 Voice — first-person plural → singular

All eight are in `a-fast-team-needs-a-fast-website.mdx`, the post rendered in full. The MDX
file is **not** edited — this is the record so the later content pass can be checked
against it.

| Source line     | Was                                                               | Now                                                           |
| --------------- | ----------------------------------------------------------------- | ------------------------------------------------------------- |
| `:17` (excerpt) | "**We** ran NP Racing's…"                                         | "**I** ran NP Racing's…"                                      |
| `:24`           | "So when **we** built the NP Racing website"                      | "So when **I** built the NP Racing website"                   |
| `:24`           | "**We** wanted to know … so **we** ran it through"                | "**I** wanted to know … so **I** ran it through"              |
| `:26`           | "you don't have to take **our** word for it"                      | "you don't have to take **my** word for it"                   |
| `:56`           | "**We've** seen homepages that were shipping"                     | "**I've** seen homepages that were shipping"                  |
| `:64`           | "a reason **we're** not just showing you … **we're** showing you" | "a reason **I'm** not just showing you … **I'm** showing you" |
| `:68`           | "every trade website **we** build on this platform"               | "every trade website **I** build on this platform"            |
| `:70`           | "**We** think every business does."                               | "**I** think every business does."                            |

`:68` keeps the word "trade". Narrowing or widening that claim would be rewriting the post,
which D4 rules out.

**Not converted, and they still need converting:** the other 33 plural lines across 16 files.
None of them is quoted on these three pages — the index and topic pages lift only titles,
dates and descriptions, and those are already singular or neutral.

### 5.2 Case — Title Case → sentence case

**All 21 frontmatter titles are Title Case.** The set's settled ruling is sentence case
everywhere (notes-c.md §15, which converted `service-detail.html` for exactly this). This is
the same class of edit, so the prototypes carry sentence case and the MDX does not yet.
Proper nouns kept: Google, Google Maps, Google Business Profile, Google Workspace, SEO.

| Frontmatter `title`                                                  | As rendered                                                          |
| -------------------------------------------------------------------- | -------------------------------------------------------------------- |
| A Fast Team Needs a Fast Website                                     | A fast team needs a fast website                                     |
| Why Before-and-After Project Pages Convert Better Than Service Pages | Why before-and-after project pages convert better than service pages |
| What Makes a Great Website for Electricians?                         | What makes a great website for electricians?                         |
| What Makes a Great Website for Plumbers?                             | What makes a great website for plumbers?                             |
| What Makes a Great Website for Scaffolding Companies?                | What makes a great website for scaffolding companies?                |
| How Much Does a Tradesperson Website Cost?                           | How much does a tradesperson website cost?                           |
| How to Get More Google Reviews as a Tradesperson                     | How to get more Google reviews as a tradesperson                     |
| How to Get More Leads From Your Tradesperson Website                 | How to get more leads from your tradesperson website                 |
| How to Rank Higher on Google Maps as a Tradesperson                  | How to rank higher on Google Maps as a tradesperson                  |
| How to Write a Good Testimonials Page for Your Trade Business        | How to write a good testimonials page for your trade business        |
| Is It Worth Paying for SEO as a Tradesperson?                        | Is it worth paying for SEO as a tradesperson?                        |
| Local SEO for Tradespeople: What It Is and Why It Matters            | Local SEO for tradespeople: what it is and why it matters            |
| Why Your Tradesperson Website Must Be Mobile-First                   | Why your tradesperson website must be mobile-first                   |
| Pay Monthly vs Upfront Website: Which Is Right for You?              | Pay monthly vs upfront website: which is right for you?              |
| Schema Markup: The Hidden SEO Trick Most Tradespeople Miss           | Schema markup: the hidden SEO trick most tradespeople miss           |
| Service Pages vs Location Pages: What's the Difference?              | Service pages vs location pages: what's the difference?              |
| Google Workspace for Small Businesses: What You Need to Know         | Google Workspace for small businesses: what you need to know         |
| Website vs Facebook Page: What Tradespeople Actually Need            | Website vs Facebook page: what tradespeople actually need            |
| What Is a Google Business Profile and Do You Need One?               | What is a Google Business Profile and do you need one?               |
| What to Put on Your Tradesperson Website: The 7 Essentials           | What to put on your tradesperson website: the 7 essentials           |
| Why Tradespeople Need a Website in 2025                              | Why tradespeople need a website in 2025                              |

### 5.3 Topic display labels — slug → problem-led label

The `category` **slugs stay as they are** and are what the URL uses. These are display
labels only, and the mapping is a thing the port needs.

| Slug                   | Chip label (the control) | Heading (the directory)             |
| ---------------------- | ------------------------ | ----------------------------------- |
| `local-seo`            | Local search             | Showing up in local search          |
| `getting-found-online` | Getting found            | Getting found in the first place    |
| `costs-and-value`      | Costs and value          | Working out what to spend           |
| `website-content`      | Site content             | Deciding what goes on the site      |
| `industry-guides`      | Sector guides            | What a site needs, sector by sector |
| `website-design`       | Design and speed         | Making it fast and usable           |
| `business-tools`       | Tools and email          | The tools around the website        |

Chips are short because they are controls that have to fit a row; headings carry the
problem framing because they are prose. Both are sentence case.

### 5.4 The sector axis — a proposed field, and how each value was derived

**`sector` does not exist in blog frontmatter.** D4 requires the axis now, so it is here,
and every value is derived from the post's own title or description rather than assigned by
feel:

- **Trades and contractors — 20.** Every one of these has "tradesperson", "trades" or a
  named trade in its own title or description.
- **Motorsport and teams — 1.** `a-fast-team-needs-a-fast-website`, whose description is
  "NP Racing's British Superbike homepage…". It is a racing team, not a trade.
- **Retail and eCommerce / Studios and practitioners / Professional and property / Creative
  and B2B — 0 each.** These four labels are the /projects taxonomy's own
  (`projects-list.html:134-138`), reused so the two indexes share one vocabulary.

"Motorsport and teams" is a sixth value the portfolio taxonomy does not have, and that is
deliberate: it is live proof the axis extends rather than being a closed list of five.

**The port has to add the field.** Until it does, the second filter is the one thing on
these pages that is not backed by data in the repo.

---

## 6. What I could not verify

Stated plainly rather than glossed.

- **`resize_window` is a no-op in this environment.** The top-level viewport is locked at
  1338 × 714 whatever is requested — the same finding design-kit.md §14 recorded in Phase 1.
  Every width-based measurement above comes from `_f_harness.html`'s iframes, where
  `innerWidth` genuinely is the frame's width and width media queries really fire. The CSS
  scale on the 1440 frame is visual only and does not affect layout.
- **A height query inside an iframe answers to the iframe's height, not the window's.** Both
  the real 714px window and the 900px frame match `max-height:1040px`, so everything above
  was measured against the compressed desktop scale — which design-kit.md §7 says is the
  normal laptop case. **The tall-screen branch (>1040px viewport height) was never
  exercised.**
- **rAF is throttled in both the iframe and the backgrounded top-level tab.** So the bar's
  `data-ground` probe and the `.in` IntersectionObserver latch **never fire reliably here**.
  I verified the probe's _geometry_ by reimplementing `read()` inline and calling it at each
  section (all six correct), and I latched `.in` by hand for every screenshot. **The live
  colour crossfade, the `.res` resolve and the staggered row reveal were not seen running.**
- **`lvh` vs `svh`, `prefers-reduced-motion`, `@media (hover:none)` and
  `env(safe-area-inset-*)`.** None is testable here; all four viewport units resolve
  identically and the insets resolve to 0. This file introduces no viewport-height value at
  all, so there is no lvh/svh decision in it to get wrong. The `hover:none` block was
  written by reading, not by tapping.
- **`:focus-visible` on the filter chips.** Programmatic `.focus()` does not match
  `:focus-visible` and synthetic Tab presses go to the browser chrome here — the same wall
  Agent A hit. The disabled chips carry `aria-disabled` rather than `disabled` specifically
  so they stay in the tab order and a keyboard user can still read the count, but **I could
  not confirm the tab order by tabbing.**
- **Screen-reader behaviour.** `.count` is `role="status" aria-live="polite"` and its text
  changes on every filter, which is the mechanism; I did not run a screen reader.
- **The other twenty posts' bodies.** Only `a-fast-team-needs-a-fast-website` is rendered in
  full. The other twenty are represented by frontmatter only, so **`.prose` has been
  exercised against one body, containing paragraphs, two tables, four links, `<strong>`,
  `<em>` and three h2s — but no list, no blockquote, no image, no `<hr>` and no code block.**
  Phase 2 exercised those in `_chrome.html`; I did not re-exercise them here.
- **Nothing was built or type-checked.** `sites/dcs/` is untouched; the twenty-one MDX files
  were read and never written.

---

## 7. For Phase 4b — merge notes

1. **Promote `.svc__d em` to a bare selector in kit.css §13.** It completes `.svc__d`, which
   ships without the micro-label its light-ground twin has. Same class of fix as Agent B's
   `.svccard__l svg`.
2. **The `.paytoggle` mobile grid needs inverting, not a third override.** kit.css:997 is now
   wrong for two of its three users and both `.filterbar` and `.filterset` carry an identical
   undo. Make `display:grid; grid-template-columns:1fr 1fr` the _pricing_ case
   (`.payhead .paytoggle`) and leave wrapping flex as the default.
3. **`.filterset .paytoggle{border-radius:18px}` should probably be unconditional on
   `.paytoggle` generally**, and Agent A's `≤900px` copy retired — the blob failure starts at
   1280, not 900, and the homepage's two-mode toggle never wraps at any width so it would
   never see the 18px.
4. **`.chip`, `.jump` and `.prose table` are generic**, not blog-specific. `.prose table` in
   particular belongs in kit.css §31 — any page with an MDX body can contain a table, and the
   legal bodies Agent H is styling may well have one.
5. **The masthead loudness reproduces here and I did not act on it.** Crumb + masthead is
   634px of 900 on the index and 661px on the topic page — better than wave 1's 78–81%, but
   only because my h1s are two lines. Phase 2 and Agent A both flagged the
   `max-height:1040px` compression on `.mast h1` and both declined to apply it unilaterally.
   Same reasoning: two other agents are using `.mast` right now.
6. **Sentence case is now applied to 21 blog titles in the prototypes and to zero in the
   MDX.** Same shape of debt as the voice conversion. Both want one content pass, and §5 is
   the list.
7. **`scroll-margin-top` is now a second consumer of the bar height**, alongside
   `.detail{top:120px}`. `bar-height-correction.md` exists because the 74.5px figure was one
   edit away from becoming a real bug; the jump list's `clamp(96px,13vh,124px)` clears the
   81px bar by 15px and would stop clearing it if the bar grew again. Worth listing with
   `.detail` rather than discovering separately.

---

## 8. Five things that want a ruling from you

1. **Seven categories, not eight.** The brief and session.md both say eight. There are seven.
   Nothing is wrong with the design either way, but the route count in any later plan should
   say seven.
2. **The disabled sector chips.** Five of the seven read "0" and are dimmed. That is the
   honest way to show an axis before it is populated, and it tests the control at full width
   — but it is also five grey chips on a page that is meant to be publish-ready. The
   alternative is to render only the two populated chips and leave the aqua section to
   explain the rest. I went with showing them; it is a one-line change if you disagree.
3. **`industry-guides` is a topic named after an audience**, which D4 says a topic must not
   be. It stays because the posts carry it. The recommendation is to dissolve it into the
   sector axis at around 40 posts (§2).
4. **`local-seo` and `getting-found-online` overlap.** Six posts and three, and I could not
   confidently say which of several posts belongs in which. Worth merging before the library
   doubles.
5. **No pagination.** Answered with a cap and a measured threshold rather than a component
   (§2). If you want the pager built, it should be built against real overflow.
