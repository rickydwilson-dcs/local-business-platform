# Templates sweep — Batch C (pixkit … mahadeva, 32 slugs)

Assessed 2026-08-20, desktop only, real wheel scrolling. 32 slugs attempted, **24 resolved to a live
demo**; 8 were `Site Not Found` and 3 more resolved to squatted/unrelated sites.

One structural observation first: **the most common failure in this batch was the hero rendering as
an empty field on load** — white on `pearl`/`elian`, black on `fathom`/`nakula`/`nexsign`, orange on
`flexio`, grey on `purevisuals`. In every case the nav or a floating badge was the only thing on
screen. That is the `opacity: 0`-until-revealed pattern, and in Batch C it hit roughly a third of the
working demos. Plainly: **several of the best-looking templates here have a first screen that is
literally blank.** The fix on our side is trivial (author the hero visible; animate `transform` only,
never gate `opacity` on IO above the fold) but it means we take the _components_, not the build.

**No count-up numbers were found on any shortlisted template.** Where a figure appears it is authored
static (`/26 SELECTED PROJECTS`, `340,000 Units shipped`, `50K+ Clients`). This batch is cleaner on
that axis than the gallery sweep was.

---

## Shortlist (strongest first)

### 1. Lurais / "LucasReis" — https://lurais.framer.website/ — **Free**

**Aesthetic.** The most complete component vocabulary in the batch, and the closest thing here to
Sylven's level of detail. Light grey/near-white page, one giant grotesk, everything else set small in
a tight mono-ish caps. It is elevated because of the _labelling system_, not the pictures.

**Animation.**

- **Section index bar.** `01 ──────────────────────── /INTRODUCTION`, then `02 … /FEATURED`,
  `03 … /PORTFOLIO`. A hairline spanning the full viewport width, two-digit index left,
  slash-prefixed section name right. Static, no motion — and the best single device on the page. Pure
  CSS (flex + `border-top`).
- **Section watermark that tracks the section.** A giant rotated 90° `/about me` sits in the left
  margin; scroll into the next section and it becomes `/featured`, then `/portfolio`. Motion that
  _carries information_ — it answers "where am I" without a sticky nav. Reproducible as a
  `position: sticky` rotated element per section, or an IO swapping one label.
- **Two-tone statement paragraph.** Full contrast → grey → full contrast within one sentence. The
  greying is the emphasis mechanism; it makes a 25-word sentence readable at 48px. Pure CSS. Note
  this is a **static** two-tone, not the scroll-driven word-by-word highlight Nakula and Nexsign use
  — cheaper and safer.
- Images fade up on scroll into view. Content is present and readable in the DOM either way — the
  greyed intermediate state is legible, not invisible. **This is the correct way to do it.**

**Components worth taking.**

- `/26` set very large with a leading slash, `SELECTED PROJECTS` underneath in small caps — a static
  authored count presented as a design element rather than a KPI tile.
- Role stack in the hero corner: `Designer / Creative Director / AI Artist`, three lines, no bullets.
- `NEW YORK /` over `09 41 PM` — live local clock, digits letter-spaced apart. Trivial in JS
  (`Intl.DateTimeFormat` + `setInterval`), and it makes a small firm look staffed.
- **Corner-bracket frame** — four L-shaped tick marks at the corners of an otherwise empty box
  containing the word `RESUME`. Four absolutely-positioned pseudo-elements.
- **"Work principles" row** — three cards of deliberately unequal construction: (a) white card, three
  small monochrome glyphs, centred caption `HONESTY ABOUT TECHNOLOGY`; (b) dark photo card with title
  - subtitle stacked bottom-left; (c) split card — photo top carrying a mono timestamp `21:47` and a
    promise line, white row beneath with a © circle glyph and `I never use unlicensed work`.
    **This is the answer to DCS's flat-generic-card problem.** No icon-in-a-circle, no three identical
    boxes.
- Project caption pattern: `TIMELESS MOTION` / `AUREON Watches / 2026` — name, then client and year
  in muted grey beneath.
- Section headline pattern: two small dots (one dark, one light) then the headline in grey with the
  first word black — `.. best works`, `.. work principles`.

**Functional risk.** Low-to-moderate. Only the hero image is late; the hero _text_ renders. No
preloader, no scroll-jacking, no count-ups, no interstitials. **This is the one I would build from.**

---

### 2. Nexsign — https://nexsign.framer.website/ — **$99**

**Aesthetic.** Cream paper with a real grain/noise texture, near-black sections, one acid-yellow
accent. Dashed hairline rules instead of solid ones. Small filled-square ticks (`■`) at the corners of
the content frame. The most "agency" of the batch and the closest to Sylven's chrome.

**Animation.** The best _information-carrying_ motion in Batch C.

- **Scroll-spy client index rail.** A sticky left column lists the case studies and a small yellow
  `■` marker moves to whichever is currently in the viewport, with that entry going to full contrast.
  A table of contents that tells you your position. IO + class toggle; no Framer engine needed.
  **The effect most worth stealing from this batch.**
- **Progressive word-by-word text highlight on scroll.** Grey → black word by word. Reproducible with
  Framer Motion `useScroll`, or CSS `background-clip: text` driven by a scroll-linked custom
  property. Honest assessment: it looks expensive but costs the reader time, because the sentence is
  not fully legible until you have scrolled past it. Take the _device_ and set the range so text is
  fully resolved by the time the paragraph is centred.
- **Labelled marquee.** The client logo strip scrolls horizontally, but a fixed opaque panel sits over
  its left end reading `BRAND WE HELPED TO SCALE ›`. The static label explains what the moving thing
  is — a marquee that does a job.

**Components worth taking.**

- **Project row header bar**: a full-width tinted bar flush on top of the project image —
  `ELEVATE LABS` left · `BRANDING • WEBSITE` centre · `2025` right. Far better than a caption
  underneath.
- `SEE MORE⁰⁶` — button label with a **superscript numeral** telling you how many more there are.
- `(03)` above `//WORK CREATED WITH CARE BY NEXSIGN.` — parenthetical index plus double-slash prefix.
- Avatar-trio chip + two-line copy.
- Trustpilot green stars + `4.8 (500+ REVIEWS)` — static, authored.

**Functional risk.** **High on first paint.** The hero was a pure black rectangle after a full 6
seconds on a fast desktop connection — nothing but the vendor's "BUY NOW ($99)" badge. Also
`CONTCT US` is misspelled in the shipped demo, a quality tell about the author.

Screenshots: `shots/screenshot-1787258966619-207.jpg` (black hero),
`shots/screenshot-1787258966619-209.jpg` (section heading + client rail),
`shots/screenshot-1787258966619-211.jpg` (scroll-spy rail + project header bars).

---

### 3. Lumenary — https://lumenary.framer.website/ — **$79**

**Aesthetic.** The quietest and arguably the most genuinely elevated: greyscale only, no accent colour
at all, enormous white space, one abstract macro image doing all the visual work. If DCS wants
"expensive" without "loud", this is the reference.

**Animation.**

- **Two-column services table.** Left column the service names at full contrast, right column the
  matching descriptions in grey. Rows reveal staggered on scroll. No cards, no icons, no boxes — just
  a typographic table. **The best "services" pattern in the batch**, and exactly what DCS's current
  flat cards should be replaced with.
- **Gradient-fade client list.** A vertical list where the top entry is full black and each successive
  entry fades toward the background — implying "and more" without a "+12 others" label. CSS
  `mask-image: linear-gradient(...)`.
- Work grid cards at staggered vertical offsets with the label **above** the image, not beneath.

**Components worth taking.**

- Wordmark `Lumenary ®` with a true superscript ®.
- Section eyebrow prefixed by a corner-tick glyph: `⌐ ABOUT US`.
- **ASCII / dot-matrix halftone block** used as a full-column illustration — a raster of text
  characters forming a tonal image. Genuinely distinctive, costs nothing, reproduces as a `<pre>` or
  a canvas. Nothing else in the batch had anything like it.
- `View All Work` as a plain rectangular hairline button, not a pill.

**Functional risk.** Moderate. The hero has **no headline at all** — image-only, so on first paint the
page is a pale grey field with a nav. A deliberate choice rather than a broken reveal, but it means
zero above-the-fold proposition, which is wrong for DCS's audience.

**⚠ Also flag:** the nav clock read `06:45 AM`, then `06:41 AM`, then `06:43 AM` across the session —
**it went backwards.** It is not a real clock; it is animated/decorative. That is a fabricated figure
of exactly the kind we have been bitten by before. If we take this nav we must wire a real
`Intl.DateTimeFormat` clock, not an animation.

---

### 4. Norvin — https://norvin.framer.website/ — **Free**

**Aesthetic.** Near-black, full-bleed motion-blur video hero with **vertical hairline grid guides**
ruled across it — the guides are the elevated touch; they turn a stock video into a designed frame.

**Animation.** Video hero (autoplay, muted, looping), CSS/HTML only. **Two-tone statement heading**
with the payoff clause in mid-grey. Carousel with a pill-and-dots indicator. Nothing wheel-jacked.

**Components worth taking.**

- Nav: hamburger + `Menu` in one pill, a `/` separator, `New York, USA - 9:40 PM` live clock, then
  `Start Project` with a chevron in its own circle.
- **Award card**: `★★★★★` over `BEHANCE` over `1ST WINNER`, flanked by two laurel-wreath glyphs, a
  hairline, then a recognition line beneath. (Note the typo `Ecognized` in the demo — another
  author-quality tell.) The laurel-flanked award block is a strong, specific trust component, much
  better than a row of grey logos.
- Avatar stack + `50K+ Clients` — static authored figure, no count-up.

**Functional risk.** Moderate. The hero is near-black until the video decodes, but the nav and overlay
chrome render immediately, so the page never reads as broken. Free.

---

### 5. BrightEdge — https://brightedge.framer.website/ — **Free**

**Aesthetic.** Split hero: a narrow dark vertical rail down the left edge carrying a rotated wordmark
and a stacked social column, with content and a full-height image occupying the rest.

**Animation.**

- **Giant word parallax.** `CREATORS` set enormous, overlapping the image edge, translating
  horizontally faster than the page. Reproducible with a scroll-linked `translateX` (or
  `animation-timeline: view()`). Decorative rather than informative — take it only for a single
  statement moment.
- **Rotating circular badge**: `CREATE • IDEA • INSIGHT • SOLUTION` set on a circular path around an
  orange disc containing a down arrow. Doubles as the scroll cue. SVG `<textPath>` + CSS keyframe.

**Components worth taking.**

- Left vertical rail: rotated wordmark reading bottom-to-top, logo mark, stacked social icons.
- `✳ We are digital design` — asterisk glyph as an eyebrow prefix, then `CREATORS` at 6× the size.
- **Avatar stack + circular arrow button + `Meet Our Team` caption underneath** — same family as
  Sylven's "Book a Call" avatar pill, but as a team entry point.

**Functional risk.** Low-moderate. **Hero renders complete on load** — one of the few in this batch
that does.

---

### 6. Nakula — https://nakula.framer.website/ — **$129**

Listed last deliberately: the components are excellent, the first paint is the worst in the batch.

**Aesthetic.** Near-black, tight grotesk, `(PARENTHETICAL)` section labels, ® superscript wordmark.

**Animation.**

- **Scroll-spy project switcher.** A giant `01.` index numeral, and beneath it a three-item list where
  the active entry is white and the others grey with an em-dash bullet. Scroll and the active entry
  changes as the paired mockup swaps. Tighter than Nexsign's rail.
- **Word-by-word scroll highlight** on the About statement — same caveat as Nexsign.

**Components worth taking.**

- **Nav status cluster**: green dot + `Available for project` over `EARLY FEB 2025` (two-line status),
  then `3:51 AM` over `(GMT+7)` (two-line clock), then a `LET'S TALK` pill and a hamburger. The best
  nav-right cluster in the batch — availability, timezone and CTA in one band.
- Giant `01.` index numerals with a trailing full stop.

**Functional risk.** **Highest in the shortlist.** The hero was still a pure black rectangle after a
deliberate **8-second** wait — the only thing on screen was the vendor's "Buy Template" badge. The nav
itself does not render until you scroll. The demo copy reads "We **combines** years of web design…"
and the availability badge is hardcoded `EARLY FEB 2025`, i.e. eighteen months stale — a maintenance
trap if we copy that pattern without wiring the date to something. At $129 with those defects, buy
nothing; take the nav cluster and the scroll-spy list.

Screenshots: `shots/screenshot-1787259117096-218.jpg` (black hero after 8s),
`shots/screenshot-1787259117098-221.jpg` (scroll-spy project switcher).

---

## Also-rans (one line + url)

- **Maelle** — https://maelle.framer.website/ — **Free.** Three-column sticky editorial layout: left
  rail with name + services on hairlines + socials, centre scrolling project feed, right sticky bio
  rail with `◆ Available for work`, portrait, and a right-aligned meta stack. Nav is a comma-separated
  inline list (`Home, Info, Work, Contact`) with a live clock centre. Genuinely charming; the whole
  page enters via a blur-to-sharp reveal, leaving the hero name illegibly blurred for a second.
- **Eizo** — https://eizo.framer.website/ — **$69.** Excellent nav: four evenly-spaced column labels
  with `VM YT IG TW` social abbreviations far right; a **running clock with seconds**, `Based in
Japan`, and a small portrait thumbnail. Marked down because the entire project grid rendered as
  empty white boxes — the video posters never loaded, leaving six labelled voids.
- **Moveex** — https://moveex.framer.website/ — logistics. One component worth it: a services block
  headed `01/03` with a three-segment hairline progress indicator.
- **Irongrid** — https://irongrid.framer.website/ — industrial B2B. A floating "This Month" panel
  framed by corner-bracket ticks with three static rows (`04 New orders / 340,000 Units shipped /
99.1% on-time rate`). Figures static across both frames — no count-up. Hero headline never rendered.
- **Lou / "Kong"** — https://lou.framer.website/ — **Free.** Loud acid-green with heavy film grain.
  Rotating circular badge and accordion cards with a solid green header. Too loud for DCS, but the
  grain texture and the badge are reusable.
- **Swag** — https://swag.framer.website/ — HR product, not agency. Floating UI chips overlaid on
  lifestyle photography.
- **Pixkit** — https://pixkit.framer.website/ — a UI kit's marketing site, not an agency site.
- **Grovia** — https://grovia.framer.website/ — generic purple SaaS with emoji bubbles.
- **ClipCut** — https://clipcut.framer.website/ — a bare Framer default demo page.

---

## Rejected for animation reasons

- **Pearl** — https://pearl.framer.website/ — **Hero headline never renders at all.** After load and
  after real wheel scrolling, the first screen is white with a nav and one "Get for free" pill; the
  giant hero type simply never appeared. Textbook `opacity: 0` failure, on a free template.
- **Fathom** — https://fathom.framer.website/ — hero is a **solid black rectangle** with nothing in
  it. Feature cards use diagonal-stripe placeholders rather than real imagery.
- **Flexio** — https://flexio.framer.website/ — hero is a **solid orange field** with only the nav
  pill; the entire above-the-fold proposition failed to reveal.
- **Elian** — https://elian.framer.website/ — renders **completely blank white** and stays blank
  through repeated real scrolls while the scrollbar shows a long page. Total reveal failure.
- **PureVisuals** — https://purevisuals.framer.website/ — the **whole hero is scroll-driven**: on load
  a flat grey void, and only wheel input drives two image panels apart in a curtain reveal. The corner
  metadata is beautiful and very Sylven — but gated behind an effect that puts the animation strictly
  ahead of the visitor, and it needs Framer's scroll engine.
- **Raw Studio** — https://raw-studio.framer.website/ — fires a **scroll-triggered interstitial
  modal** a few seconds in, before you have read anything.
- **Agenius** — https://agenius.framer.website/ — **letter-by-letter typewriter tagline** in the hero,
  so the proposition types itself out while you wait; followed by a full-viewport section containing
  nothing but a decorative gradient. Motion ahead of content, twice.
- **Nakula / Nexsign** — shortlisted above on component strength, but both ship a first screen that is
  a black void. Recorded here so the pattern is not lost: **do not copy their reveal strategy.**

---

## What I did not cover

**Demo did not exist at `<slug>.framer.website` (8):** `forma-interior`, `viral`, `tdlovera`,
`bureau-nine`, `superintelligent`, `korda`, `lumorax`, `mahadeva`. All returned "Site Not Found". The
outbound preview URL is not in the server-rendered HTML, so resolution needs an in-browser click per
template. Unassessed, not rejected.

**Slug resolves to an unrelated squatted site (3):** `porto` (an Indonesian university page full of
lorem ipsum), `amber` (a single non-scrolling slide titled "My Framer Site"), `clipcut` (a bare Framer
demo).

**Not attempted:** mobile/responsive (desktop only per brief); hover states beyond a couple of cards;
interior pages; sign-in-gated behaviour. No "Use for Free", "Remix" or purchase control was clicked.

**Prices verified:** Lurais Free, Norvin Free, BrightEdge Free, Lumenary $79, Nexsign $99, Nakula
$129, Eizo $69, Maelle Free.
