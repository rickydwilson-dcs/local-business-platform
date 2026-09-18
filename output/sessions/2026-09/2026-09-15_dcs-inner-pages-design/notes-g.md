# Phase 3b / Wave 2 — Agent G — `/locations` and `/locations/[slug]`

**Deliverables:** `prototype/locations-list.html`, `prototype/location-detail.html`,
`kit-additions-g.css` (**one declaration**), this file. Plus `prototype/_harness-g.html`,
the two-iframe rig both widths were rendered in — kept so the result is reproducible,
and named with the `_` prefix `_chrome.html` established.

**Date:** 2026-09-18. **`kit.css` was not edited** — three agents were writing against
it concurrently. **Nothing under `sites/dcs/` was touched**, including the eight MDX
files, which were read and never written.

---

## 1. The design problem, and the answer

Decision D2 demotes this tier and that is a design instruction. The problem it
creates is stated in the brief: **eight near-identical pages look machine-generated,
and nothing about a town may be invented to make them differ.**

The answer has three parts, and none of them is a new fact.

### (a) The differentiators were already written. They were just buried.

All eight MDX files open with a genuinely different proposition and then bury it under
an identical h1 ("Website Design for Tradespeople in _X_") and three near-identical
sub-headings. Lifted out and put in the list, they are eight different sentences:

| Town       | Differentiating line, as it appears on the index    | Where it comes from                                                                               |
| ---------- | --------------------------------------------------- | ------------------------------------------------------------------------------------------------- |
| Polegate   | The studio is here, on Chaucer Business Park        | `polegate.mdx` FAQ 1 + body ¶1 (the full address)                                                 |
| Hailsham   | A market town with steady demand                    | `hailsham.mdx` body ¶1 — "a market town with steady demand for skilled trades"                    |
| Eastbourne | One of the largest, busiest towns in the county     | `eastbourne.mdx` body ¶1 — "one of East Sussex's largest and busiest towns"                       |
| Seaford    | A smaller town with a much wider catchment          | `seaford.mdx` FAQ 3 — "in a smaller coastal town like Seaford … a much wider catchment area"      |
| Lewes      | The county town, and a discerning market            | `lewes.mdx` body ¶1 — "the county town of East Sussex … an increasingly discerning customer base" |
| Uckfield   | A town plus a ring of villages across the Weald     | `uckfield.mdx` body ¶1 — "the town itself, plus a ring of villages … across the Weald"            |
| Brighton   | One of the most competitive markets in the south    | `brighton.mdx` body ¶1 — "one of the most competitive markets in the south of England"            |
| Hove       | Its own search market, not an extension of Brighton | `hove.mdx` body h3 — "Hove is not the same as Brighton" + FAQ 3                                   |

**Nothing above was written by me.** Each is a compression of a sentence that is
already in that town's own file, and each is a claim the business has already made.

### (b) The eight pages differ in SHAPE, because the source data differs in shape

This is the part that actually stops the set reading as generated, and it is the
reason the detail page's markup labels every block **CONSTANT** or **PER-TOWN**.
Three blocks are **optional** — they render only where the source supports them:

| Town         |  Testimonial  | "Meet in person" |       Named neighbouring places       | Two-audience block |
| ------------ | :-----------: | :--------------: | :-----------------------------------: | :----------------: |
| Polegate     |       —       |        ✓         |                   —                   |         —          |
| Hailsham     |       —       |        ✓         |                   —                   |         —          |
| Eastbourne   |  ✓ Sarah T.   |        —         |                   —                   |         —          |
| Seaford      |       —       |        —         |  ✓ Newhaven, Peacehaven, Eastbourne   |         —          |
| Lewes        |   ✓ Dave C.   |        ✓         |                   —                   |         ✓          |
| Uckfield     |       —       |        —         | ✓ Crowborough, Heathfield, Maresfield |         —          |
| **Brighton** | **✓ Mark H.** |        —         |                   —                   |       **✓**        |
| Hove         |       —       |        —         |                   —                   |         ✓          |

Sources, all verified by reading rather than recalled:

- **Testimonial** — all three files in `content/testimonials/` carry a `locationSlug`:
  `brighton`, `lewes`, `eastbourne`. So the Brighton quote belongs to the Brighton
  page _by data_; it is not borrowed for it. **The other five towns render no quote at
  all.** That is the `.slot` doctrine applied to words: a page with no real testimonial
  gets nothing, never an invented one.
- **Meet in person** — exactly three files offer it: `polegate.mdx` FAQ 1 ("welcome to
  come in"), `hailsham.mdx` FAQ 1 ("happy to meet locally if you prefer"),
  `lewes.mdx` FAQ 1 ("happy to arrange a local meeting").
- **Named neighbouring places** — exactly two: `seaford.mdx` body ¶1 and
  `uckfield.mdx` FAQ 2. Hove names Brighton, but as a _contrast_ rather than as
  coverage, so it is counted under the two-audience column, not here.
- **Two-audience** — `brighton.mdx` FAQ 4 (commercial clients, letting agents,
  property managers), `hove.mdx` FAQ 4 (homeowners, landlords, property managers),
  `lewes.mdx` body ¶1 ("homeowners and commercial clients").

Four different page shapes across eight towns, driven entirely by what is in the
files. **Brighton was chosen for the prototype because it fires the most blocks**, so
the template is exercised rather than merely displayed.

### (c) The repetition is isolated rather than disguised

Everything that genuinely is identical across the eight — the price, the timescale,
the process, the remote-by-default working — was pulled **off** the detail pages and
put on the index once, as the ink "What doesn't change by town" band. The page says so
in customer-facing words: _"each one leads on what is genuinely different about working
there. Everything that doesn't change by town is here, once."_

That is also why the detail page is short. A doorway page pads; this one has four
bands and stops.

### (d) The demotion, made visible

Four levers, each a decision rather than an omission:

| Lever            | What wave 1 does          | What this tier does                       | Precedent                                                     |
| ---------------- | ------------------------- | ----------------------------------------- | ------------------------------------------------------------- |
| Masthead buttons | `.hero__act` pair         | none                                      | `404.html:90-98`, the only wave-1 masthead with no button row |
| `.mast__meta`    | four facts                | three on the index, **two** on the detail | —                                                             |
| `.plate`         | one plated word in the h1 | none                                      | —                                                             |
| Section count    | 6–8 bands                 | **4**                                     | —                                                             |

Measured document heights at 1440 × 900, every wave-1 page in the same harness:

| Page                       |     Height |
| -------------------------- | ---------: |
| `404.html` (utility)       |     2370px |
| `contact.html` (a form)    |     2814px |
| **`locations-list.html`**  | **3519px** |
| `services-list.html`       |     3813px |
| **`location-detail.html`** | **4237px** |
| `about.html`               |     5249px |
| `project-detail.html`      |     5630px |
| `service-detail.html`      |     5787px |
| `pricing.html`             |     5862px |
| `projects-list.html`       |     6871px |

The index is the shortest real content page in the set, and the detail page is the
shortest detail page by 1,393px. The demotion is measurable, not asserted.

### (e) The trades framing — a recorded decision, not a tidy-up

**Every one of the eight files is framed as trades-only**, from the h1 down. D2 says
this tier "must not pull the brand back toward local trades", and the portfolio spans
retail, eCommerce, studios, practitioners, tuition, property and B2B.

So I applied D4's rule for `/blog` — _trades appear as worked examples inside topics,
never as the frame_ — to this tier as well, which is the same decision Agent B recorded
for `/services` (`notes-b.md` §4). Concretely: the h1 loses "for Tradespeople"; the
trade list stays in the body as an example of who has actually been built for; and the
index's framing sentence is lifted verbatim from the **approved** `projects-list.html`
masthead ("A specialist fabric retailer and an 11+ tutor sit alongside a scaffolder and
an electrician"), so the sector claim on this page is one wave 1 already made.

Every changed line is in §5. **This is a content decision surfaced here rather than
made silently** — the MDX itself is a Phase 5 job.

---

## 2. What I reused, by class name

Everything except one declaration. Listed by section:

**Chrome, copied from `service-detail.html` unchanged:** `.bar`, `.mark`, `.mark__svg`,
`.mark__type`, `.bar__r`, `.hire`, `.burger`, `.menu`, `.menu__nav`, `.menu__foot`,
`.crumb`, `.pagefoot`, `.end__main`, `.big`, `.footmap`, `.end__foot`, `.hero__act`,
`.btn`, and all three scripts (ground probe, `.in` latch, mobile menu).

**Page shells:** `.mast`, `.mast__meta`, `.sec`, `.p--ink`, `.p--white`, `.p--navy`,
`.measure`, `.eyeless`, `.lead`, `.res`.

**The index list:** `.work` / `.row` / `.row__n` / `.row__m` / `.row__m em`
(kit.css §12) and `.filterbar` / `.count` (kit.css §21).

**The index's constants band:** `.detail__l` with the aqua check SVG (kit.css §17),
the composition `service-detail.html:217-224` already uses on ink.

**The detail body:** `.prose` with `h2`, `p`, `strong`, `ul`, `li`, inline `a`,
`blockquote`, `cite` (kit.css §31); `.qa` / `.qa__a` with native
`<details>`/`<summary>` (kit.css §18).

### Patterns considered and rejected, with the reason

| Pattern                                            | Why not                                                                                                                                                                                                                                                                                                                                 |
| -------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `.card` + `.cards--3`                              | design-kit.md §6.3 does suggest `.cards--3` for "8 locations", but the card **is** a `.card__well` (16/11, navy). There is no media for a town — every `hero.image` points at a `placeholder/hero-*.webp` that does not exist — so eight of them would be eight empty navy boxes. Same objection Agent B recorded for the six services. |
| `.cards--2`                                        | Worse: its supporting line lives _inside_ a scrim over the media (`.card__s{position:absolute;inset:0}`), so with no media the differentiator has nothing to sit on. It is also `/projects`' pattern — reusing it would make the demoted tier look like the portfolio.                                                                  |
| `.slot`                                            | It is the honesty mechanism for **missing project footage**. A town has no footage to await. Eight "AWAITING FOOTAGE" boxes on a locations page is a category error, not a placeholder.                                                                                                                                                 |
| `.mock`                                            | Draws _a website_. Eight identical drawn browsers labelled with eight town names says nothing true.                                                                                                                                                                                                                                     |
| `.svccard` / `.svcgrid`                            | Agent B's pattern for `/services`. Eight full-ground cards is the loudest thing in the kit and the opposite of a demoted tier.                                                                                                                                                                                                          |
| A map                                              | The frontmatter has real coordinates, so a map is tempting and is the one thing on this list I'd revisit. Rejected here because it needs a third-party tile provider (a CSP `img-src`/`connect-src` change and a cookie question) for a tier whose whole brief is _cost nothing_. Noted for Phase 4b rather than built.                 |
| A dedicated "nearby areas" band on the detail page | Designed, then cut. `.footmap` already lists all eight on every page — a demoted tier does not need the same navigation twice, and cutting it is what got the detail page to four bands.                                                                                                                                                |
| A filter pill group on the index                   | Eight items, one axis. A filter that never has to filter is theatre. `.filterbar` is still used, for the count and the sort label, which is what `justify-content:space-between` was written for.                                                                                                                                       |

---

## 3. What I had to invent

**One declaration, and it is a contrast fix.**

`.work--loc .row__m em{opacity:1}`

`.row__m em{opacity:.72}` (kit.css:547, from `home-r9.css:322`) over `.row__m`'s own
`#5E5E68` on white measures **3.38:1**, and inside the magenta hover fill (white at
`.72` on `#D6006B`) it measures **3.11:1**. Both are under WCAG AA's 4.5:1 for text
this size. On the homepage and on `404.html` that sub-line carries a descriptive tag;
here it carries the **distance**, which is the one piece of information on the row a
visitor might act on.

Measured at every step: `.80` → 4.03/3.61 · `.86` → 4.57/4.02 · `.90` → 5.05/4.34 ·
`.94` → 5.52/4.66 · `1` → **6.41/5.16**. Only full opacity clears 4.5:1 in _both_
states, so the fix removes the opacity rather than picking a new fraction — **no new
value enters the design.** The label stays clearly subordinate: 12px against 14.5px,
uppercase, `.09em` tracked.

Scoped to a modifier (`.work--loc`, following `.cards--2` / `.quote--sm` /
`.svccard--ink`) because a bare `.row__m em` rule would change `404.html`, which is
approved and rendered. **Phase 4b should decide whether to promote it** — see §8.

No new hover effect was added, so `kit.css` §24 needs no addition.

**Invented apart from that: nothing.** No new length, colour, duration, curve or
breakpoint.

### Two page-level compositions that are new arrangements of old parts

1. **`.filterbar` with two `.count`s and no pill group** — count left, sort right.
2. **Three `.mast__meta` items with deliberately short labels.** Not a style change;
   see the bug in §4.

---

## 4. What rendering found — the real bugs

Six. Two are mine, one is a kit gap I introduced traffic to, and three are
pre-existing findings I can now confirm independently.

### Mine

1. **A headline written as two lines rendered as four, and took the masthead to 83%
   of viewport height.** `.mast h1{max-width:17ch}` (kit.css:1310) caps the measure at
   roughly 18 characters a line at the 100.8px display size, so _"East Sussex on the
   doorstep. / The rest of the UK remotely."_ — two authored lines — broke into four.
   Measured: **h1 411px, masthead 744px, 83% of a 900px viewport** — worse than the
   78–81% already flagged as open in `session.md` §4a. Rewritten to _"Eight towns. /
   The whole UK."_: **h1 206px, masthead 538px, 60%**. I did **not** apply the
   `max-height:1040px` compression that has been offered twice and not taken up — the
   component is untouched and the page is shorter because the words are.
   **Worth knowing for any page with a masthead: write the h1 to the 17ch cap, not to
   the line breaks you want.**
2. **A long `.mast__meta` label breaks the row's two-up pairing at 390px.** The row is
   a wrapping flex container; at 390 it has 350px, so two items pair only if each
   12px small-caps label stays inside about 16 characters. My first draft used
   "TOWNS WITH THEIR OWN PAGE" (25) and "THE FURTHEST OF THEM FROM THE STUDIO" (36),
   and the row dropped to **one item per line** — three stacked rows where wave 1
   shows a 2 × 2 block. The approved row pairs because its labels are 8–19 characters
   (`service-detail.html:101-104`). Shortened to "Named areas" / "The furthest" /
   "Everywhere else"; verified by reading item tops — `[477, 477, 532]`, i.e. two up,
   one under. Nothing errors and it is invisible at desktop width.

### A kit gap this page now carries traffic over

3. **`.row__m em` is 3.38:1 at rest and 3.11:1 on hover.** §3. Pre-existing, but this
   is the first page where that sub-line carries information rather than a label.

### Pre-existing, confirmed independently rather than taken on trust

4. **`.menu__nav a` measures 34px at 390px**, under the mobile layer's own 44px touch
   floor. Measured on my page: all six links 34px. Identical on every wave-1 page;
   `notes-e.md` raised it as a Phase 4 decision and it is still open. Not fixed here —
   fixing it unilaterally would put my two pages out of step with nine others.
5. **The bar measures 81px at 1440px in this harness, not the 74.5px the wave 2 brief
   states.** I measured 81px on _both_ my page and the approved `services-list.html`
   in the same rig, so the number in the brief does not reproduce here. It changes
   nothing for me — neither page uses `.detail`, so the `.detail{top:120px}` trap is
   not in play — but anyone about to rely on 74.5px should measure first.
6. **`document.hidden` is `true` for the whole of any automated interaction**, so a
   screenshot taken straight after a scroll catches the bar mid-crossfade (0.55s) and
   `.res` mid-resolve (1s) and _looks_ broken. Confirmed by reading state instead of
   looking: after a real top-level scroll into the white section the bar reported
   `data-ground="white"` with a white background and ink foreground, the first `.sec`
   carried `.in`, and the prose h2 computed to `rgb(14,14,18)` — fully resolved. A
   second screenshot a moment later shows it correct.

### Things that were checked and were fine

- **No overflow at any width tested.** `scrollWidth` equals `clientWidth` at 1440
  (1431/1431), 1000 (991/991), 901 (892/892) and 390 (381/381), with **zero**
  elements reporting a right edge past the viewport, on both pages.
- **The 900–1080px band** — the one `notes-b.md` §7 said it had not looked at. At
  1000px and at 901px: burger shown, `.bar nav` hidden, `.row` still two-column
  (580/295 and 490/295), `.footmap` still four columns, no overflow, every row one
  line. Fine.
- **The `fixed inset-0` overlay trap.** The opened `.menu` at 390 reports
  **390 × 844** — the full viewport, not the bar's box. Walked the bar's ancestor
  chain in the live DOM: **zero** elements carrying `transform`, `backdrop-filter`,
  `filter`, `perspective` or `will-change: transform`.
- **The `.row` hover was exercised, not argued** — hovered the Lewes row at top level
  and captured it: the magenta fill wipes up from the bottom, both texts go white.
- **`.qa` touch targets**: summaries measure 61–86px at 1440 and 69px at 390.
- **Content audit against the rendered DOM at both widths, both pages:** 0 `img`,
  0 `video`, 0 `iframe`; **0 comma'd figures**; **0 elements resolving to
  `tabular-nums` or a monospaced family** (trap 7 has nothing to bite on);
  heading order h1 → h2 with no skipped level; `lang="en-GB"`; 2 `[aria-current]`
  per page; and **0 occurrences of "we", "our" or "us"** in the rendered text of
  either page.
- **Parse health of `kit-additions-g.css`**: read back from the live stylesheet —
  **1 rule, 1 declaration retained, 0 rules with all declarations dropped.**

---

## 5. Every value introduced, and every line of voice converted

### CSS values

| Value                                  | Where                                       | Source                                                                                                                  |
| -------------------------------------- | ------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------- |
| `opacity:1` on `.work--loc .row__m em` | `kit-additions-g.css` G1                    | Not a new value — it removes `kit.css:547`'s `.72`. Justified by measurement in §3.                                     |
| `margin-top:clamp(28px,4vh,44px)`      | one inline style, `locations-list.html:240` | `.filterbar`'s own margin, `kit.css:860`. The inline-margin idiom is `service-detail.html:226`'s, in the approved page. |

That is the complete list. Nothing else.

### Data I computed (not invented, but not lifted either)

The eight distances are **haversine great-circle distances** between each file's own
`coordinates` block and `polegate.mdx`'s, at R = 6371.0088 km, converted at
1 km = 0.621371 mi and rounded to the nearest mile:

| Town       | lat, lng         |    km | miles | shown as            |
| ---------- | ---------------- | ----: | ----: | ------------------- |
| Polegate   | 50.8233, 0.2557  |  0.00 |  0.00 | "Where I work from" |
| Hailsham   | 50.8621, 0.2590  |  4.32 |  2.68 | 3 miles             |
| Eastbourne | 50.7687, 0.2904  |  6.54 |  4.07 | 4 miles             |
| Seaford    | 50.7720, 0.1031  | 12.15 |  7.55 | 8 miles             |
| Lewes      | 50.8733, 0.0097  | 18.14 | 11.27 | 11 miles            |
| Uckfield   | 50.9675, 0.0872  | 19.92 | 12.38 | 12 miles            |
| Brighton   | 50.8225, −0.1372 | 27.60 | 17.15 | 17 miles            |
| Hove       | 50.8272, −0.1687 | 29.81 | 18.53 | 19 miles            |

**These are straight-line, not driving, distances, and the page never implies
otherwise** — the label reads "from the studio", and the one comparative claim
("Hailsham, Eastbourne and Seaford are all inside ten miles of it") is true on these
numbers by a clear margin. The only derived claim on the detail page is "about
seventeen miles east of the city", which follows from the two longitudes.

**Port note:** nothing in `sites/dcs/` consumes `coordinates` today — grepped
`lib`, `components` and `app`; the only hits are an unrelated schema type and a
comment. Either compute this at build time or add a `distanceMiles` field.

### Voice: first-person plural → singular

All eight location files are plural. Counted: **75 lines** across the eight
(brighton 8, eastbourne 11, hailsham 9, hove 7, lewes 11, polegate 11, seaford 9,
uckfield 9) — which matches the brief's figure exactly. I lifted copy from
`brighton.mdx` only, and converted **all 8 of its plural lines**:

| Line              | Source (plural)                                                                                                                                       | As it appears in the prototype                                                                                                                              |
| ----------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `brighton.mdx:26` | "Brighton is one of **our** most active areas. **We work** with electricians … DCS is based in East Sussex — Brighton is right on **our** doorstep."  | "Brighton is one of **my** most active areas. **I work** with electricians … The office is in Polegate, East Sussex, so Brighton is right on the doorstep." |
| `brighton.mdx:29` | "DCS builds all of this in from the start. **We also help** you position around specific neighbourhoods…"                                             | "**I build** all three in from the start. **I'll also** position you around specific neighbourhoods…"                                                       |
| `brighton.mdx:35` | "**We can** tailor your site to target both domestic and commercial audiences…"                                                                       | "**I can** tailor the site to target domestic and commercial audiences separately…"                                                                         |
| `brighton.mdx:38` | "**Our** office is in Polegate … a local area for **us** — but **we work** with tradespeople across the whole of the UK."                             | "The office is in Polegate … so Brighton is a local area — but **I work** with businesses across the whole of the UK."                                      |
| `brighton.mdx:45` | "DCS is a web agency for tradespeople, based in Polegate … **We understand** the Brighton market … **We build** websites that cut through the noise." | "**I run DCS** from Polegate in East Sussex, about seventeen miles east of the city. **I know** the Brighton market…"                                       |
| `brighton.mdx:49` | "**We build** every site from scratch: custom design, copywriting specific to your trade and your area…"                                              | "**Every site I build** is built from scratch" + the four-bullet list                                                                                       |
| `brighton.mdx:51` | "**We work with** electricians, plumbers, builders … and every other trade working in and around Brighton."                                           | Kept as the FAQ answer's trade list; the body's version becomes "That applies whatever the business is." (see below)                                        |
| `brighton.mdx:55` | "Brighton is genuinely local to **us**. **We know** the area … **we build** websites for tradespeople right across the UK"                            | "Brighton is genuinely local to **me**, and **I know** the area … But **I build** for businesses across the whole of the UK"                                |

### Voice and framing: the trades reframe, line by line

| Source                                                                                                                 | Change                                                                                                                                                                                   | Why                                                                                                                                                                      |
| ---------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `brighton.mdx:2` title "Website Design **for Tradespeople** in Brighton"                                               | h1 → "Website design in Brighton"                                                                                                                                                        | D2. Also sentence case, per `notes-c.md` §15.                                                                                                                            |
| `brighton.mdx:15` hero.description "Brighton is one of the UK's most competitive markets **for tradespeople**."        | lead → "Brighton is one of the most competitive markets in the south of England." (the body's own, stronger wording)                                                                     | D2                                                                                                                                                                       |
| `brighton.mdx:44` "If you're **a tradesperson in Brighton**, you're operating in one of the most competitive markets…" | "Brighton is home to a huge number of **small businesses**, and customers here have more choice than anywhere else I work."                                                              | D2                                                                                                                                                                       |
| `brighton.mdx:51` "**We work with** electricians … and every other trade" (body)                                       | "That applies whatever the business is. The electrician quoted below works in the city; a shop, a studio or a letting agent would get the same build, written for a different customer." | D2 — trades become the worked example, not the frame. The trade list itself survives in FAQ 1.                                                                           |
| `brighton.mdx:26` FAQ 1 "Do you work with **tradespeople** in Brighton?"                                               | "Do you work with **businesses** in Brighton?"                                                                                                                                           | D2                                                                                                                                                                       |
| `brighton.mdx:38` FAQ 5 "**we work with tradespeople** across the whole of the UK"                                     | "I work with **businesses** across the whole of the UK"                                                                                                                                  | D2                                                                                                                                                                       |
| index framing                                                                                                          | —                                                                                                                                                                                        | "A specialist fabric retailer and an 11+ tutor sit alongside a scaffolder and an electrician" is lifted from the **approved** `projects-list.html:99-101`, not invented. |

**I claimed nothing about the client base that the files do not support.** In
particular I did not write that the Brighton clients are mostly trades, or that shops
and studios in Brighton are existing clients — the copy says the _build_ is the same,
which is a capability claim, not a client claim.

### One source error found and NOT fixed

`brighton.mdx:21-25` lists **"Locations" twice** in its `breadcrumbs` array, so the
live page renders _Home / Locations / Locations / Brighton_.
`components/pages/LocationDetailPage.tsx:20` maps that array straight to the render, so
this is a live defect, not a theoretical one. It is the only one of the eight with the
duplicate. **Flagged, not fixed** — the MDX is not mine to edit. My prototype renders
the corrected three-item crumb.

---

## 6. Honesty

- **Zero images and zero videos on both pages**, verified against the rendered DOM at
  both widths rather than asserted. No generated image is captioned as a real named
  place, premises, van or team. There is no photograph of Ricky and nothing stands in
  for one.
- **The only quote on either page is a real one**, from
  `content/testimonials/mark-h-electrician.mdx`, on the page its own `locationSlug`
  points at. Five of the eight towns have no testimonial and would render none.
- **Every number on both pages is either in the source or computed from it**, and the
  computation is written down in §5 so it can be checked.
- **No count-up animations.** Every figure is authored in the markup.
- **No editor or reviewer notes in the rendered copy.** The reasoning is in HTML
  comments and in this file.

---

## 7. What I could NOT verify

- **`:focus-visible` was never seen.** `document.activeElement` does not advance under
  synthetic Tab presses and a programmatic `.focus()` does not trigger
  `:focus-visible`. The global 3px magenta ring (kit.css §02) applies by cascade to
  everything on these pages, and I added no focus rule — but that is an argument, not
  a screenshot. Same limit wave 1 reported.
- **`@media (hover:none)` was not exercised.** I added no new hover effect, so
  `kit.css` §24 needs no addition, and the `.row` hover it already neutralises is the
  only one on either page. Checked by reading.
- **`prefers-reduced-motion` was not exercised.**
- **`lvh` vs `svh`.** All four viewport units resolve identically in a desktop browser
  and in an iframe. **Neither page sets a viewport height at all** — grepped both
  files and `kit-additions-g.css`: the only `vh` anywhere is inside a `clamp()` for a
  paragraph margin. So there is nothing here to get wrong, but I cannot demonstrate it.
  Construction rule, applied.
- **`env(safe-area-inset-*)` resolves to `0px` here.** Notch behaviour needs a device.
- **The `.in` latch never fires inside the harness** (`document.hidden` is `true`), so
  every capture has it latched by hand. It _did_ fire at top level on a real scroll,
  confirmed by reading the resolved colour back. **Nothing about scroll behaviour
  should be inferred from my screenshots.**
- **Seven of the eight towns were not built.** The shape matrix in §1(b) is an
  assertion about the template, derived from reading all eight MDX files and all three
  testimonial files — it is not eight rendered pages. If Phase 4b wants the
  anti-sameness claim proven rather than argued, the cheapest test is to render
  Polegate (the only town with a physical address) and Seaford (named neighbours, no
  quote) against Brighton.
- **Contrast was measured arithmetically**, from the stylesheet's own hexes and
  opacities, not sampled from rendered pixels. The numbers in §3 are sRGB relative
  luminance per WCAG 2.x. I did not check the `.res` rest colour, the `.count`
  (`4.28:1` at `opacity:.55` on white — **also under 4.5**, and pre-existing on
  `projects-list.html`), or the aqua-on-navy footer states beyond what is recorded here.
- **Nothing was built, type-checked or linted.** These are static prototypes;
  `sites/dcs/` is untouched.
- **The port is not costed.** `LocationsPage.tsx` currently hard-codes "Areas We Serve"
  and "We build websites for tradespeople across the UK" in the component
  (`LocationsPage.tsx:12-15`), so the index page's voice and framing debt lives in
  **code**, not in MDX, and is outside the 75-line count.

---

## 8. For Phase 4b

1. **Rule on `.work--loc .row__m em{opacity:1}`.** It is arguably a kit-wide fix:
   3.38:1 fails AA everywhere the pattern is used, including `404.html`. I scoped it
   rather than promote it because promoting it silently changes an approved page.
   The user is colourblind and has asked for contrast to be surfaced as numbers rather
   than acted on by eye — so this is a decision, not a fix I should have taken.
2. **`.count{opacity:.55}` measures 4.28:1 on white** (kit.css:861, from
   `shared.css:134`) and is used on `projects-list.html` too. Same call, wider blast
   radius, so I changed nothing.
3. **`.menu__nav a` at 34px** is still open from wave 1 (`notes-e.md` §6). Confirmed
   on my pages.
4. **The brief's "74.5px at 1440" bar height does not reproduce** — I measure 81px on
   the approved pages too. Worth correcting in the brief before another agent designs
   against it.
5. **`brighton.mdx`'s duplicated breadcrumb** (§5) is a live defect in the shipped
   component's render path, not a prototype issue. Cheapest possible content fix.
6. **A map on `/locations` is the one rejected idea worth reopening**, since the
   coordinates are real and currently unused. It needs a CSP `img-src`/`connect-src`
   decision and a cookie answer first, which is why I did not build it.
7. **The index page's copy is component-level, not MDX.** Whoever ports this should
   know that `/locations`' heading and intro are hard-coded strings in
   `LocationsPage.tsx`, so the voice fix there is a code change.
