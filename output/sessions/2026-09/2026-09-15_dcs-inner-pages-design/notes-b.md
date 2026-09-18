# Phase 3 — Agent B — `/services` (the list)

**Deliverables:** `prototype/services-list.html`, `kit-additions-b.css`, this file.
**`kit.css` was not edited.** Four agents were working against it at the same time.
**Date:** 2026-09-17.

---

## 1. The list pattern, and why the alternatives were wrong

**Chosen: `.svccard` (kit.css §14), stripped of the sticky-stack machinery, in a
flat two-column grid — `.svcgrid` — where the first and last card span both
columns.**

The brief's own hint is the argument: `.svccard` is the only pattern in the kit
with a **five-ground modifier set** (`--ink/--magenta/--aqua/--navy/--white`,
kit.css:577-581). That set only makes sense if the design intends these things to
be told apart by **colour**, not by an icon or a picture — and colour is the only
differentiator available here, because **there is no media for a service.** All
six MDX files point `hero.image` at `placeholder/hero-*.webp`, which does not
exist.

Its anatomy is also the masthead's anatomy, which is what makes the list lead into
the approved detail page rather than merely sit before it — see §3.

### Why each alternative was rejected

| Pattern               | Why not                                                                                                                                                                                                                                                                                                                                 |
| --------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `.card` + `.cards--3` | Media-led: the card _is_ a `.card__well` (16/11, navy) with a 14px title strip under it. With no media the well is an empty navy box, and six of them is precisely the "thin grid of boxes" the brief rules out.                                                                                                                        |
| `.cards--2`           | Also media-led, and worse: its supporting line lives **inside** a scrim over the media (`.card__s{position:absolute;inset:0}`, kit.css:452), so with no media there is nothing for the description to sit on. It is also the pattern **round 1 used for `/projects`** — reusing it here would make `/services` look like the portfolio. |
| `.slot`               | It is the **honesty mechanism for missing project footage** (kit.css §10), not a neutral placeholder. A service has no footage to await. Six "AWAITING FOOTAGE" boxes on a services page would be a category error, not a placeholder.                                                                                                  |
| `.mock`               | Legitimate where no real capture exists — but it draws _a website_. Six identical drawn browsers labelled with six different services says nothing, and five of the six services are not a website.                                                                                                                                     |
| `.row` / `.work`      | **The approved detail page already uses it**, for its "The other five" band (`service-detail.html:265-286`). If the list page is built from the same rows, the destination looks like the cross-sell that points at it, and the list adds nothing the detail page's own footer band doesn't.                                            |
| `.svc` / `.svcs`      | Same objection as `.row`, plus it is dark-ground-only (`rgba(255,255,255,.28)` rules, kit.css:557) so the section ground would be forced.                                                                                                                                                                                               |
| `.cards--6`           | Has no base rule (design-kit G8) and renders as one column above 1080px. Not used, so nothing needed fixing.                                                                                                                                                                                                                            |

### Why 1 + 2 + 2 + 1 and not 3×2 or 2×3

Six is awkward because **these six are not six peers**, and the content says so:

- **Website Design** is the build everything else attaches to.
- **Ongoing Website Management** is the recurring relationship at the other end.
- The four between them attach to one or the other — `local-seo.mdx` says its work
  is _"built into every DCS website … included as standard"_; `analytics.mdx` and
  `google-workspace.mdx` are set up alongside a site; `ecommerce.mdx` is a variant
  of the build.

So the first and last span the grid and the middle four pair up. The section
heading states the shape explicitly ("It starts with a site. It ends with someone
looking after it."), so the layout is arguing the content rather than decorating
it. Three equal rows of two would have said all six are interchangeable, which
they are not.

### Grounds

`p--white` section → `ink` (01, wide) → `magenta` / `navy` (02, 03) →
`ink` / `magenta` (04, 05) → `aqua` (06, wide) → `p--navy` footer.

- **No two cards sharing an edge share a ground.** Design-kit §1.2 states that
  rule for _boundaries_; there is a `clamp(18px,2.1vw,34px)` gutter between every
  cell here, so nothing actually abuts. Cards 02 and 05 are both magenta and touch
  at a **corner** in the 2×2 block. That is unavoidable: with 01 fixed at ink and
  06 at aqua, the 2×2 needs four distinct grounds and only three are usable
  (`--white` on a white section is not a card). Stated rather than hidden.
- **`--white` is deliberately unused** for that reason.
- **Aqua appears exactly once, last**, immediately above the navy footer — which
  is the homepage's own closing move (quote/aqua → `.end`/navy, design-kit §1.2).
  That was the deciding factor in making Ongoing Management the last card rather
  than the second.

---

## 2. Reuse vs invention

### Reused with no new value

Everything. **`kit-additions-b.css` introduces not one new number** — no length,
colour, duration or curve below is new:

- `.svcgrid` top margin = `.svcs`'s `clamp(30px,5vh,54px)` (kit.css:557).
- `.svcgrid` columns + gap = `.cards--2`'s (kit.css:441-442), the kit's only
  two-up grid.
- Card hover = `.cards--2 .card:hover`'s `translateY(-4px)` +
  `0 28px 54px -30px rgba(14,14,18,.55)` (kit.css:445-446).
- Wide card internal columns = `.svccard`'s own
  `minmax(0,1fr) minmax(0,1.02fr)` (kit.css:576).
- Wide card description measure = `.wpanel__d`'s `44ch` (kit.css:652).
- Facts row = **`.mast__meta` verbatim** (kit.css:1313-1318), the approved
  masthead's own component.
- Arrow SVG = `.tcard__l svg`/`.hire svg`'s 15px, `flex:none` from
  `.detail__l svg` (kit.css:771, 246, 745).
- Focus accent on magenta = the accent-swap rule (design-kit §1.4), same move as
  `.bar :focus-visible` (kit.css:250).
- Mobile collapse = `.cards--2`'s own 900px breakpoint (kit.css:929).
- `max-height:1040px` margin collapse = kit.css:893's own value.

Everything else is either a **reset** of a value kit.css sets (position, height,
min-height, margin-bottom, box-shadow, grid-template-rows) or purely **structural**
(`grid-column`, `justify-self`, `align-content`). Those are reasoned inline in the
stylesheet.

The chrome — bar, `.menu` overlay, `.crumb`, `.mast`, `.sec`, `.pagefoot`, and all
three scripts — is copied from `_chrome.html` / `service-detail.html` unchanged.

### Invented

Nothing.

---

## 3. How the list leads into the approved detail page

The brief's test was "the card treatment on the list should feel like the same
family as the masthead it opens." It is literally the same parts:

| Detail page masthead                                        | List card                                                                   |
| ----------------------------------------------------------- | --------------------------------------------------------------------------- |
| `.eyeless` "Services · 01 / 06"                             | `.svccard__ix` "01 / 06" — same 12.5px/700 small-caps idiom, same numbering |
| `h1` at display weight                                      | `.svccard__t` at display weight (800, `-.038em`, `lh .94`)                  |
| `.lead`                                                     | `.svccard__d`                                                               |
| `.hero__act` buttons                                        | `.svccard__l` — the gap-open link                                           |
| **`.mast__meta`** — four facts, value over small-caps label | **`.mast__meta`** — the _same component_, two or three facts                |
| ink ground                                                  | the card's own ground                                                       |

So opening card 01 lands on a page whose top block is the card, enlarged. The
masthead's meta row and the card's meta row are one component, not two that look
alike.

The list masthead also reuses `.mast` + `.mast__meta` itself, so
`/services` and `/services/[slug]` open identically.

---

## 4. Content — what is real and the two recorded edits

Every title, description, price and figure comes from
`sites/dcs/content/services/*.mdx`. The card descriptions are the frontmatter
`description` field. The fact rows are from body text and FAQs:

| Card     | Facts                                                 | Source                                                                                                                                                                                                |
| -------- | ----------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 01       | £995 upfront · £59/month · 2–3 weeks                  | `web-design.mdx` description + body + FAQ "How long does it take to build?"                                                                                                                           |
| 02       | WooCommerce · Stripe & PayPal                         | `ecommerce.mdx` FAQs 1 and 3                                                                                                                                                                          |
| 03       | Included with every build · Service + location pages  | `local-seo.mdx` description + body                                                                                                                                                                    |
| 04       | GA4 + Search Console · Monthly plain-English report   | `analytics.mdx` body "What We Set Up"                                                                                                                                                                 |
| 05       | One-off setup · From £5.50 per user, Google bills you | `google-workspace.mdx` FAQ "Who pays Google each month?"                                                                                                                                              |
| 06       | £59/month · One business day · 30 days' notice        | `monthly-management.mdx` FAQs; the £59 figure is carried from the **approved detail page's** own cross-sell row (`service-detail.html:272`), not from `monthly-management.mdx`, which states no price |
| masthead | Six · £59/month · 2–3 weeks · 30 days                 | as above                                                                                                                                                                                              |

All static, authored figures. **No count-ups anywhere** (design-kit §5.4.1).

### Two recorded content decisions

1. **First-person plural → singular.** "We handle" → "I handle". This is the same
   edit Phase 2 made and flagged on the detail page (`phase2-notes.md` §3), for the
   same reason: the homepage is first person singular and the inner content is what
   is wrong. Substance untouched.
2. **The audience qualifier is dropped from two titles.** `web-design.mdx` is
   titled "Website Design **for Tradespeople**" and `local-seo.mdx` "Local SEO
   **for Tradespeople**". The cards say "Website Design" and "Local SEO". One word
   in `web-design`'s description changes with it ("built for tradespeople across
   the UK" → "built for small businesses across the UK"), and
   `monthly-management`'s "focus on your trade" → "focus on the work". Nothing
   else in any title or description changes.

   **This is a decision, not a tidy-up, so it is recorded here rather than made
   silently.** The brief is explicit that DCS builds for retail, eCommerce,
   studios, practitioners, tuition, property, B2B _and_ trades, and a list page is
   where site-wide framing gets set — a page whose first two entries say "for
   Tradespeople" frames the whole studio as trades-only regardless of what the
   masthead says. The underlying MDX titles are a **content** problem for Phase 5;
   this note is the flag.

   Note the approved detail page still carries the full trades-framed h1, so the
   list card and the page it opens currently disagree on the title. That is the
   visible symptom of the content problem, and it resolves when the MDX is fixed.

### Honesty

No generated image, no photograph of Ricky, no "our team", no fabricated client
media — **there is no image on this page at all.** The claim "something I do
myself, in-house" is the first-person form of round 1's own credential line
("Everything managed in-house", `project-list.html:57`).

---

## 5. What I rendered, at what size, and how

`resize_window` is a no-op in this browser, as it was for Phases 1 and 2. The
iframe harness was used and works — a width media query responds to the iframe's
own width.

| Viewport       | How                                                                                                                    | What was checked                                                                                                                                                                                                                                                                                                                                                                                                                  |
| -------------- | ---------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **1440 × 900** | `prototype/_harness-b.html` — a 1440px iframe at `transform:scale(.5)`, full document height, scrolled in three passes | `max-height:1040px` **matches** (confirmed: `.svccard__t` computes 46.4px, the compressed `2.9rem` cap at kit.css:900, not the uncompressed `4rem`). Grid geometry, all six grounds, the wide variant's two columns, the facts-row borders on every card ground, the ink→white→navy boundary overlaps, the aqua→navy close. Document height 3813px, `scrollWidth` 1431 against `innerWidth` 1440 — **zero overflowing elements**. |
| **390 × 760**  | `prototype/_harness-b390.html` — a 390px iframe, unscaled, full height                                                 | The whole authored mobile layer: bar collapsed to burger, `.mark__type` hidden, breadcrumb, `h1` at 36.8px, `.mast__meta` at two columns, the grid at one column, the wide cards' asides folded into the body with `padding-top:0`, the footer link map at two columns, `.big` as full-width rows. Document height 5267px, `scrollWidth` 381 against 390 — **zero overflowing elements**.                                         |
| top-level page | `services-list.html` direct                                                                                            | `documentElement.scrollTop = 1500` → `scrollY` stayed **0**; `scrollTo({top:1500})` → **1500**. The silent no-op the brief warns about, reproduced on this page.                                                                                                                                                                                                                                                                  |

**Parse health** (the same check Phases 1 and 2 ran on `kit.css`):
`kit-additions-b.css` — 17 top-level rules, 23 including nested, **50 declarations
retained and zero rules with all declarations dropped.** A syntax error shows up
as an empty rule; there are none.

`_harness-b.html` and `_harness-b390.html` are left in `prototype/` so this can be
re-verified in Phase 4. Both latch `.in` manually on load (see §7).

---

## 6. Bugs found by rendering

Three. **All three are in kit.css, not in my own markup**, and the first is the
kind that only a render finds.

1. **`.svccard__l` and `.wpanel__l` have no `svg` sizing rule, so a plain arrow
   renders at 300 × 150px.** `.btn`, `.hire`, `.detail__l` and `.tcard__l` all size
   their SVG (kit.css:291, 246, 745, 771); these two do not, although design-kit
   §5.3 describes both as _"a border-bottom link whose **arrow** slides away from
   the word"_. A bare `<svg viewBox="0 0 16 16">` with no width/height falls back
   to the SVG default of 300 × 150, and the first render had a 300px arrow filling
   the first card and inflating the document from 3813px to 5454px. Nothing errors.
   Fixed at 15px, scoped to `.svcgrid`.
   **Phase 4 should promote this to bare `.svccard__l svg` / `.wpanel__l svg`** —
   it is a kit gap, not a page problem, and any page using either pattern with a
   plain SVG hits it.
2. **`.svccard__l` stretches to the full column width as a grid item.** It sets
   `align-self:start` but no `justify-self` (kit.css:587), so its 1.5px
   `border-bottom` drew edge to edge and read as a section divider rather than a
   link. Invisible on the homepage, where a media well ends the card. Fixed with
   `justify-self:start`, scoped. **Flagged rather than assumed** — if the
   full-width rule is the intended homepage look, this stays scoped.
3. **`.svccard__body{align-content:center}` misaligns a content-height card.**
   That value was written for a **fixed** `min(80vh,720px)` sticky card where the
   copy floats in a height it does not fill. In a grid card the only vertical slack
   is whatever the _taller card in the same row_ contributes, so "centred" means
   "offset by however long my neighbour's title happens to be." Measured at 1440px:
   the 02 and 03 index labels sat 14px apart and their links 14px apart the other
   way. Start-aligned inside `.svcgrid`, every card in a row now shares a top edge
   (verified: index-label tops 1482/1482 and 1913/1913). The one place the original
   centring is still right — the wide card's short second column beside a taller
   first — has it restored explicitly; start-aligned it stranded ~90px of dead
   ground under the aqua card's facts.

A fourth thing that is _not_ a bug but was checked rather than assumed:
**`.mast__meta`'s border colour is set by the PAGE ground** (`.p--white` etc.,
kit.css:1318). Inside a card the page ground and the card ground differ, so every
ink/navy/magenta card on the white section would have taken the ink border and the
rule would have vanished. Re-resolved against the card's own modifier. Verified by
reading the computed colour back from all six cards: white on the five dark cards,
`rgba(14,14,18,.16)` on the aqua one.

---

## 7. What I could **not** verify — stated plainly

- **Hover and `:focus-visible` were not exercised.** Both were verified by
  cascade, not by a rendered state. `document.activeElement` stayed on `<body>`
  through 14 synthetic Tab presses and a programmatic `.focus()` does not trigger
  `:focus-visible`, so **the magenta card's aqua focus ring was never seen.** The
  rule's specificity (0,3,0 against the global `:focus-visible`'s 0,1,0, in a
  stylesheet loaded later) means it must win, but that is an argument, not a
  screenshot.
- **`@media (hover:none)` was not exercised.** The block is written for both
  hovers added and was checked by reading.
- **The `.in` latch never fired.** `document.hidden` reads `true` whenever the JS
  tool runs — in the top-level tab as well as in an iframe, which is worse than
  Phase 2 found — so the IntersectionObserver never ran and the bar's rAF ground
  probe only ran once, at load. `.in` was latched by hand for every capture. So
  **the `.res` colour resolve was not seen animating**; what was seen is the
  unaided rest colour, `#70707B` on white (kit.css:167), which design-kit §9.12
  makes the state that actually has to be legible. Not contrast-measured.
- **`lvh` vs `svh`.** Neither this page nor `kit-additions-b.css` sets a viewport
  height at all — grepped, zero matches for `vh`/`svh`/`lvh` in both files — so
  there is nothing here to get wrong. It remains untestable in a desktop browser
  regardless.
- **`prefers-reduced-motion`** not exercised.
- **`env(safe-area-inset-*)`** resolves to `0px` here; notch behaviour needs a real
  device.
- **Nothing was built or type-checked.** Static prototypes only; `sites/dcs/` is
  untouched.
- **Widths between 900px and 1080px were not rendered.** The grid collapses to one
  column at 900px and the nav collapses to the burger at 1080px, so there is a band
  where the burger is showing and the grid is still two-up. Both are existing kit
  breakpoints and neither is mine, but I did not look at that band.

---

## 8. For Phase 4

1. **Promote the `svg` fix** (§6.1) to bare `.svccard__l svg` / `.wpanel__l svg`
   in `kit.css`. It is a kit gap.
2. **Decide on `.svccard__l{justify-self:start}`** (§6.2) — scoped here pending
   a look at the live homepage.
3. **Decide on `.svcgrid .svccard__body{align-content:start}`** (§6.3). If
   `.svccard` ever gets used flat again, this belongs on a shared modifier rather
   than on `.svcgrid`.
4. **The card-ground `.mast__meta` border rules** duplicate kit.css:1313/1318's
   values at higher specificity. If `.mast__meta` is ever renamed to something
   ground-agnostic, these collapse into it.
5. **Service ordering disagrees between the two pages.** The approved detail
   page's "other five" band runs Local SEO → Ongoing Management → eCommerce →
   Analytics → Google Workspace (`service-detail.html:265-286`); this list runs
   01 Website Design → 02 eCommerce → 03 Local SEO → 04 Analytics → 05 Google
   Workspace → 06 Ongoing Management. Since the detail page's eyebrow already
   asserts "Services · 01 / 06" for web-design, one order should win — and the
   list page's is the one that carries the numbering. Cheap to align on the detail
   page.
6. **The trades-framed MDX titles** (§4). A content job for Phase 5, but Phase 4
   should see it, because the list card and the detail h1 currently disagree.
