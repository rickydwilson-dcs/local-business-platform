# Phase 2 — Tier 0 chrome + one reference page

**Status:** complete, awaiting the approval gate.
**Date:** 2026-09-15.
**Deliverables:** `prototype/_chrome.html`, `prototype/service-detail.html`,
`kit.css` lines **1111–1676** (Phase 1 is 1–1110 and was not edited).

---

## 0. The one-line version of each decision

| Gap                           | Decision                                                                                                                                                                                                                                     |
| ----------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **G1 header nav**             | Reuse `home-r9.css:89-95`'s never-rendered link treatment as-is; add only `[aria-current]{opacity:1}` and a burger that exists _only_ below 900px. The `data-ground` accent swap needed no new rule at all.                                  |
| **G1 mobile**                 | The existing `.menu` overlay with the six real routes, current page in the aqua the hover state already uses, plus `overflow-y:auto` + `align-content:safe center` because six display-size links overflow a centred grid on a short window. |
| **G2 footer**                 | New `.pagefoot` — the closing _move_ of `.end` (navy, `.big` contact links, `.end__foot` row) at round 1's shortened padding, plus a four-column `.footmap` link map carrying the eight location pages per D2.                               |
| **G3 masthead**               | New `.mast`, reconciling four existing page-local answers into one: project-list's paddings, `.credentials`' container, `.facts`' stacked item, ground left to `.p--*`.                                                                      |
| **G4 breadcrumb**             | **Adopt** `project-post.html:2-5` verbatim on values, with three adaptations: real `<nav>`/`<ol>` with a generated separator, magenta hover on light grounds, 44px touch target.                                                             |
| **G5 prose**                  | Round 1's spine kept, one structural fix to the measure, and the eleven missing element treatments completed — every one built from a value that already exists except six, listed in §3.                                                    |
| **G7 `cf--navy`/`cf--paper`** | Added, but **not because this page needs them** — the section shell in §2 removes the need for cornerfills on non-sticky pages entirely. Two lines, completing a set Phase 1 correctly flagged as incomplete.                                |
| **G13 `.btn--ghost`**         | **Confirm** `kit.css` §06 as written. No CSS change. Evidence in §4.                                                                                                                                                                         |

Plus one thing the brief did not ask for and the page could not be built without: **`.sec`**, the
non-sticky section shell (§2).

---

## 1. What I reused versus what I invented

### Reused wholesale — no new values

- **The entire bar.** `.bar`, `.mark`, `.burger`, `.hire`, the six `data-ground` states, `.bar nav`,
  `.bar nav a` and its underline. The link treatment at `home-r9.css:89-95` had never rendered
  anywhere because `site-bar.tsx` renders no `<nav>`; putting a `<nav>` in it is the whole of G1's
  visual design. **The accent-swap system needed nothing.** `.bar nav a::after` is already
  `background:var(--bar-acc)`, so the underline goes aqua on ink/magenta/navy and magenta on
  paper/white/aqua with no per-ground rule. Verified on all six — `_chrome.html` §1.
- **The `.menu` overlay**, `.menu__nav`, `.menu__foot`.
- **`.eyeless`, `h1`, `.lead`, `.btn`, `.btn--ghost`, `.hero__act`, `.res`, `.qa`, `.detail__l`,
  `.work`/`.row`, `.slot`, `.big`, `.end__main`, `.end__foot`, `.end__nav`** — the reference page
  is built from these and nothing else at the component level.
- **`.crumb`** — every value from `project-post.html:12-15`.
- **`.mast`** — paddings from `project-list.html:3`, meta container from `project-list.html:4-6`,
  meta item from `project-post.html:20-24`.
- **`.pagefoot`** — padding from `project-list.html:13`; `.footmap`'s column gap is `.price`'s
  `clamp(22px,3.4vw,58px)`, its rule and distance are `.end__foot`'s, its link size/opacity/hover
  are `.menu__foot`'s 15px / .76 / aqua, its list gap is `.detail__l`'s 12px.
- **`.prose`** — measure, section rhythm and paragraph from `project-post.html:25-28`. Then:
  h3 = `.qa summary`'s type spec; h3 leading = `.cards--2 .card__t`'s 1.24; blockquote =
  `.cards--2 .card__t`'s full spec with `.quote__a`'s attribution; blockquote rule weight = `.card::before`'s
  2px; inline-link underline = `.wpanel__l`'s 1.5px at .5 alpha; list gap = `.detail__l`'s 12px;
  list measure and leading = `.qa__a p`'s 62ch / 1.55; list indent = `.detail__l`'s optical 28px
  (16px icon + 12px gap); ordered-list numeral = `.step__k`'s weight 800 and accent at `.quote__a`'s
  15px; figure radius = `.card`'s 18px; figure backdrop = `.card__well`'s navy; figcaption =
  `.card__s` verbatim; `hr` = `.work`'s .14 light rule and `.qa`'s .22 dark rule; code tint =
  `.paytoggle`'s .06 track; code radius = the design's smallest, 3px; `pre` radius = `.card`'s 18px;
  `pre` background on dark = `.card__well`/`.mock`'s navy; every block margin = an existing clamp
  (`.filterbar`'s `clamp(28px,4vh,44px)` or prose h2's `clamp(40px,6vh,60px)`).
- **Mobile values** — 84px bar clearance from `.wpanel__ix`'s mobile rule; 96px masthead floor from
  `home-r9.css:512`'s mobile `.hero`; 44px touch floor from the mobile layer's own doctrine; the
  `.big`-as-row treatment and its chevron widened verbatim from `kit.css:1013-1019`.

### Invented — six values, all in `.prose`, all because there is no source

There is no running prose anywhere in `home-r9.css` or `shared.css`, so a handful of typographic
decisions had nothing to copy.

| Value                                                  | Where                  | Why there was nothing to copy                                                          |
| ------------------------------------------------------ | ---------------------- | -------------------------------------------------------------------------------------- |
| `top:.62em`                                            | `.prose ul li::before` | The bullet's vertical offset. Purely optical; no marker exists anywhere in the design. |
| `line-height:1.8`                                      | `.prose ol li::before` | Baseline alignment for the numeral against a 1.55-leaded list item.                    |
| `ui-monospace,SFMono-Regular,Menlo,Consolas,monospace` | `.prose code`          | **The only monospaced face in the whole design.** See the warning in §5.               |
| `font-size:.92em`                                      | `.prose code`          | Mono x-heights run large against Archivo; 1em looked oversized.                        |
| `padding:2px 6px`                                      | `.prose code`          | Inline chip padding.                                                                   |
| `padding:20px 22px`                                    | `.prose pre`           | Code-block padding.                                                                    |

Two more that are _derivations_ rather than inventions, recorded because they are not literal copies:

- **A 6px square bullet.** The 6px is `.mock__live i`'s dot size. Square rather than round because
  circles are reserved for icon affordances in this design (design-kit §4) and
  `.cards--2 .card__well{border-radius:0}` is the precedent for a deliberately squared-off small
  shape.
- **`.crumb a{min-height:44px}` on touch.** `kit.css:955` reaches 44px for `.end__nav a` with
  `padding:13px 0`, but that was calibrated against 15px text; at the crumb's 13.5px the same
  padding measures **41px**, which I measured. Asserting the doctrine's own number directly is exact
  and self-documenting.

### Changed nothing in Phase 1

Not one Phase 1 declaration was edited or deleted. Where a Phase 1 rule needed widening (the
`.big`-as-row treatment, the nav collapse), the Phase 2 block re-states it under a wider selector
rather than editing line 1–1110, so the two halves stay separable for Phase 4's reconciliation.

---

## 2. `.sec` — the thing the brief did not ask for, and why it is unavoidable

The signature boundary of this design is a panel's rounded top corners revealing the colour of the
pane above. On the homepage that works because `.panel` is sticky and `.cornerfill` paints the
revealed strip. An inner page is not a chapter stack, so `.panel` is non-sticky here
(`kit.css:343`) — **and a non-sticky rounded section reveals its _parent's_ background through those
corners, which is the body's `--paper`.** Every boundary on the page would flash a warm off-white
strip. The homepage never hits this because `.stack` sets its own ink background for exactly this
reason (`home-r9.css:132-135`).

`.sec` gets the same cut without the sticky machinery: `margin-top:calc(var(--r) * -1)` pulls each
section up over the one above it by exactly the corner radius, so the previous section's own colour
is what shows through. No cornerfill element, no colour to pass in, and therefore none of
`chapter-panel.tsx:15-31`'s "the fill is the pane **above**, not the panel being opened" trap to get
wrong — the mechanism cannot disagree with itself.

Safe by construction: `--r` caps at 44px, and every block that can precede a `.sec` has at least
48px of bottom padding to be overlapped into (`.mast` `clamp(48px,7vh,80px)`, `.sec` itself
`clamp(56px,8vh,96px)`). Padding is `.worksec`'s verbatim — design-kit §6.2 already calls `.worksec`
"the closest thing to an inner-page section shell that already exists", and this is that shell with
the ground left to `.p--*`.

Demonstrated at the bottom of `_chrome.html`: ink → white → aqua → navy, each corner revealing the
one before it.

---

## 3. The reference page

`/services/[slug]`, using **`sites/dcs/content/services/web-design.mdx`** — chosen because it has the
strongest body of the six: five `h2` sections, a real bulleted list, real prices and a genuine
closing move. Every heading, paragraph, bullet and FAQ on the page is that file's actual text. The
testimonial is `content/testimonials/mark-h-electrician.mdx`, whose own frontmatter carries
`serviceSlug: "web-design"` — it belongs to this page rather than being borrowed for it.

**Ground sequence:** ink (masthead) → white (body) → ink (what's included + questions) → aqua (the
other five services) → navy (footer). Every boundary is a hard cut, no two adjacent panels share a
ground, aqua appears exactly once and late, navy closes — the homepage's own rule
(design-kit §1.2), on a five-panel page instead of eight.

**Every body pattern is a spare pattern from the existing library**, per ground rule 3: `.detail__l`
for the aqua check list (its native ground), `.qa` for the six real FAQs, `.work`/`.row` for the
other five services. Nothing new was designed below the chrome.

**One edit to the source text: first-person plural → singular throughout.** The MDX says "we build",
"we handle", "we've built"; the homepage says "looked after by **me**" (`hero.tsx:32`) and session
ground rule 8 makes the singular the correct voice. Substance, claims, prices and structure are
otherwise untouched. This is a content correction Phase 5 has to make anyway — flagging it here so
it is a decision rather than a silent rewrite.

### An honesty error I made and corrected

The first draft captioned the in-flow figure "The Colossus Scaffolding website, shown on a desktop
browser." **It is not.** The R2 asset (`lib/home-assets.ts:62`, the poster the live homepage already
uses for that case study) is a photograph of the client's scaffolding on a brick building. I only
caught it by rendering the page and looking at what actually loaded. Alt and caption now both say
what the image is. The `.slot` "awaiting footage" box is shown in `_chrome.html` immediately below
it as the alternative for the ten projects with no real media.

---

## 4. G13 — the `.btn--ghost` decision, with the evidence

**Confirmed as written. No CSS change.**

`home-r9.css:128` writes the ghost button for a light ground (ink text, ink-tinted border);
`shared.css:67` rewrites it for a dark one (inherit, white border). Phase 1 resolved this
provisionally by grounding the selector rather than picking a winner, and flagged it.

What needed checking was the four grounds the conflict never mentioned. Rendered and read back from
the browser:

| Ground        | Border resolved to          | Correct?                                                                                      |
| ------------- | --------------------------- | --------------------------------------------------------------------------------------------- |
| `.p--ink`     | `rgba(255,255,255,.4)`      | yes                                                                                           |
| `.p--navy`    | `rgba(255,255,255,.4)`      | yes                                                                                           |
| `.p--magenta` | `rgba(255,255,255,.4)`      | yes                                                                                           |
| `.p--white`   | `rgba(14,14,18,.24)` (base) | yes                                                                                           |
| `.p--paper`   | `rgba(14,14,18,.24)` (base) | yes                                                                                           |
| `.p--aqua`    | `rgba(14,14,18,.24)` (base) | **yes — aqua is a light ground** in this design; `kit.css:196` gives it `--bar-fg:var(--ink)` |

The set is complete and there is no seventh case. The one thing that needed doing was structural,
not stylistic: `.mast` and `.pagefoot` are shells with **no ground of their own**, so they compose
with `.p--*` and the grounded selector reaches inside them — rather than hardcoding a background
inline the way `project-post.html:153` did.

---

## 5. Traps handled, and one I re-checked rather than assumed

- **The `fixed inset-0` containing-block trap.** `.menu` is a sibling of `.bar` in both prototypes.
  I also grepped rather than assuming: **the r9 `.bar` carries neither `backdrop-filter` nor
  `transform`** — the only `backdrop-filter` in `sites/dcs/` is the retired pre-r9
  `site-header.tsx:31`, which this chrome replaces. So the trap is not armed on this bar today. The
  prototypes still compose them as siblings, because the rule is about not depending on that staying
  true. **Verified by measurement, per design-kit §9.5's own test: with the overlay open at 390px it
  reports 390 × 760 — the full viewport, not the bar's box.**
- **The comma trap.** No `tabular-nums` and no mono face anywhere near a figure. `£1,495` renders
  correctly in running prose on the reference page. The prose specimen in `_chrome.html`
  **demonstrates the trap live**: the same figure inside `<code>` visibly renders as "£1 , 995"
  while the one in running Archivo three lines below renders tight. That is the only place a mono
  face exists, it is scoped to `code`/`pre`, and `kit.css` §31 carries a loud warning never to widen
  that selector.
- **`lvh`, not `svh`.** Nothing Phase 2 added sets a viewport height at all, so there was nothing to
  get wrong. Untestable regardless — see §8.
- **`@media (hover:none)`.** Every hover Phase 2 added — `.crumb a`, `.prose a`, `.footmap a`, and
  the menu's current-page colour — is neutralised in `kit.css` §35. Re-asserting
  `.menu__nav a[aria-current] span` there is load-bearing: `kit.css:1108` sets
  `.menu__nav a:hover span{color:inherit}`, and the current page's own link is the one most likely
  to be tapped.
- **Count-ups.** None. Every figure on the page is authored in the markup.
- **No photograph of Ricky, no "our team", no fabricated client media.** See §3.

---

## 6. Bugs found by rendering

Six things reading would not have caught. Four are in my own work; two are pre-existing.

1. **Horizontal overflow at 390px, silently clipped.** The footer link map's `Get in touch` column
   carries the 36-character business email as one unbreakable token. In a 155.5px grid track it
   overflowed its own `minmax(0,1fr)` track and pushed the document to
   **`scrollWidth` 453 against `innerWidth` 390** — and `html{overflow-x:clip}` then _clipped_ it:
   no scrollbar, no error, just a truncated address. Fixed with `overflow-wrap:anywhere`, the same
   fix `home-r9.css:706-708` records for `.big` for the same reason. Re-measured after: 381 against
   390, zero overflowing elements.
2. **The breadcrumb's touch target was 41px, not 44px.** Copying `.end__nav a`'s `padding:13px 0`
   looked right but that value was calibrated against 15px text; at 13.5px it falls 3px short.
   Fixed by asserting `min-height:44px` directly.
3. **A `<pre>` on an ink section was invisible as a block** — `background:var(--ink)` on an ink
   ground. Fixed with `--navy` on ink and magenta grounds, a pairing `.card__well` and `.mock`
   already rely on.
4. **The honesty error in the figure caption** — §3. This is the one that mattered.
5. **Pre-existing, round 1: the inner-page nav has no mobile fallback.** `shared.css:166` (carried
   to `kit.css:931`) hides `.bar nav` below 900px, but neither `project-list.html` nor
   `project-post.html` renders a `.burger` — so **round 1's prototypes have no navigation at all on
   a phone.** Phase 2's bar carries the burger and the overlay.
6. **Pre-existing, latent for Phase 5: `documentElement.scrollTop = n` is a silent no-op on this
   design.** With `html{overflow-x:clip}` (`home-r9.css:29`) the computed overflow is
   `clip visible`, and setting `scrollTop` on the scrolling element does nothing while
   `window.scrollTo()` works normally. Measured: `scrollTop=1700` → `scrollY` stayed 0;
   `scrollTo({top:1700})` → 1700. Any scroll-restoration or anchor-scroll code written with
   `scrollTop` at port time will fail without erroring. Worth knowing alongside design-kit §9.3.

---

## 7. What I rendered, at what size, and how

`resize_window` is a no-op in this browser exactly as it was for Phase 1 — it reports success, and
the viewport stayed 520 × 721 through every attempt (`outerWidth` 465 against `innerWidth` 520
after asking for 1680 × 1000). So the brief's iframe harness was used, and it works: **a width-based
media query responds to the iframe's own width**, so 1440px and 390px layouts were genuinely
exercised.

| Viewport        | Method                                            | What was checked                                                                                                                                                                                                                                                                                              |
| --------------- | ------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **1440 × 900**  | 1440px iframe, `transform:scale(.35)` for capture | `max-height:1040px` **matches** (confirmed: `h2` computes 38.4px in prose, not the uncompressed clamp). Bar at all six grounds, active nav, masthead A–D, breadcrumb on ink and white, `.btn--ghost` on all six grounds, the complete prose set on white and on ink, the footer link map, the `.sec` overlap. |
| **1440 × 1040** | second iframe                                     | The `max-height` boundary; the masthead and prose read the same either side of it.                                                                                                                                                                                                                            |
| **390 × 760**   | 390px iframe, unscaled and scaled                 | The whole authored mobile layer. Bar collapsed to burger, `.mark__type` hidden, breadcrumb at 44px, masthead at 36.8px h1, prose at 16.5px, footer map at two columns, `.big` as full-width rows with chevrons, **overlay open measured at 390 × 760**. Zero horizontal overflow after the fix.               |
| **520 × 721**   | the real top-level viewport                       | The only place JS could be verified — see below.                                                                                                                                                                                                                                                              |

**The harness has one hard limit, and it caught me out first.** The tab is backgrounded whenever the
JS tool runs, so `requestAnimationFrame` and `IntersectionObserver` never fire inside it —
`document.hidden` reads `true` every time. Layout, computed styles and rects are all correct there;
anything driven by rAF or IO is not. So the JS was verified separately by scrolling the **top-level**
page with real scroll events at 520px, where both work: the bar's `data-ground` probe correctly
flipped ink → white with the accent swapping to magenta, and the `.res` headings resolved. For the
1440px captures I latched `.in` manually and set the bar's ground by hand; that is stated on every
one of those captures and nothing was inferred from them about behaviour.

**`kit.css` parse health**, the same check Phase 1 ran: 92,994 bytes, 346 top-level rules, 498 rules
including nested, **3,020 declarations retained and zero rules with all declarations dropped**. A
syntax error shows up as an empty rule; there are none. (Phase 1 was 60,903 / 269 / 2,554.)

---

## 8. What I could not verify — stated plainly

- **`lvh` vs `svh`.** All four viewport units resolve identically in a desktop browser and in an
  iframe. Nothing Phase 2 added sets a viewport height, so there is nothing here to get wrong, but I
  cannot demonstrate that — it remains a construction rule.
- **`@media (hover:none)`.** Not exercised. The block is written for every hover Phase 2 added and
  was checked by reading, not by tapping.
- **`prefers-reduced-motion`.** Not exercised.
- **`env(safe-area-inset-*)`.** Resolves to `0px` everywhere here (`--pad` computed as
  `max(20px,0px,0px)`). The notch behaviour is unverifiable without a real device.
- **Real font loading.** Archivo and Poppins loaded from Google Fonts over the network; the
  `font-display:swap` flash was not profiled.
- **The `.res` rest colours were checked by reading the computed values, not by contrast-measuring
  them.** `--grey` `#70707B` on white is roughly 4.9:1 by calculation; I did not run a contrast
  tool. Design-kit §9.12 makes this an accessibility obligation, not a transient.
- **Nothing was built or type-checked.** These are static prototypes; `sites/dcs/` is untouched, as
  ground rule 11 requires.

---

## 9. Gaps still open after Phase 2

Closed: **G1, G2, G3, G4, G5, G7, G13.**

Still open, unchanged from design-kit §13:

| #   | Gap                                                                                                                                                                                       | Who should own it                                                                                                             |
| --- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------- |
| G6  | **Form controls.** Nothing exists at all — no input, textarea, select, label, error or success styling anywhere, and `home-r9-reset.css:80-88` deliberately `revert`s controls to the UA. | Phase 3 agent D (`/contact`). It is the single largest remaining design job and it is genuinely new work, not reconciliation. |
| G8  | `.cards--6` base rule.                                                                                                                                                                    | Phase 3, if any page wants a 6-up grid. Still better omitted than half-defined.                                               |
| G9  | A second filter axis for `/blog`.                                                                                                                                                         | Wave 2.                                                                                                                       |
| G10 | Pagination / load-more.                                                                                                                                                                   | Wave 2.                                                                                                                       |
| G11 | 404 treatment.                                                                                                                                                                            | Phase 3 agent D.                                                                                                              |
| G12 | `.related-grid` vs `.cards--2`.                                                                                                                                                           | Phase 3 agent A — it is a projects-page pattern and belongs with the page that uses it.                                       |
| G14 | A non-selectable in-flow tag/chip.                                                                                                                                                        | Wave 2 (`/blog` categories).                                                                                                  |

---

## 10. For Phase 4's reconciliation

Three things to settle when the six fan-out stylesheets are merged. All three are deliberate
duplicates left in place so that Phase 1's half of `kit.css` stayed untouched.

1. **Two nav-collapse rules.** `kit.css:931` (Phase 1, from `shared.css:166`) and `kit.css` §34 both
   hide `.bar nav` at 900px. Phase 2's also shows the burger. Merge into one.
2. **Two masthead answers.** `.panel--tight` (`kit.css:344`) and `.mast` do the same job. `.mast` is
   the named one; `.panel--tight` was left rather than deleted, per the project's "don't remove what
   you weren't asked to remove" rule. Retire one.
3. **Two `.big`-as-row rules.** `kit.css:1013` is scoped to `.stack .end`; §34 restates it for
   `.pagefoot`. One selector list would do.

Two further notes for Phase 5, not Phase 4:

- `end-section.tsx:8-11` carries an explicit instruction not to add route links to the footer nav.
  That instruction is scoped to the homepage as it stood and is **superseded by decision D1**; the
  comment needs updating at port time rather than being silently contradicted.
- `.detail{position:sticky;top:120px}` (`kit.css:732`) hardcodes an offset that assumes the 81px
  homepage bar. The inner-page bar measures **74.5px at 1440px and 65px at 390px**. Any inner page
  reusing `.detail` inherits a wrong number.

### One judgement call to overturn knowingly

**The masthead is loud.** On a 1440 × 900 laptop the breadcrumb plus masthead with its meta row
measures **701px — 78% of the viewport**; without the meta row it is 578px, or 64%. The h1 is
100.8px against the homepage hero's 128px. That ratio is Phase 1's deliberate choice
(`kit.css:116`, from `shared.css:71`, reasoned in design-kit §11.2) and round 1 rendered it, so I
did not re-derive it. But it is the single biggest lever on how an inner page feels, and if it wants
to be quieter the place to do it is a `max-height:1040px` compression for `.mast h1` — which would
match how `.stack h2` and `.wpanel__n` are already handled and would need no new decision about the
uncompressed scale. Flagging rather than acting.
