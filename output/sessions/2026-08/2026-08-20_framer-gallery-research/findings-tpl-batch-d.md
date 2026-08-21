# Templates sweep — Batch D (videohut … medora-healthcare, 32 slugs)

Assessed 2026-08-20, desktop only, real wheel scrolling via the `computer` tool with paired
before/after screenshots. 11 demos opened live.

**Slug→demo URL is not reliable in this batch.** Three of the four flagged/likely candidates do not
live at `<slug>.framer.website`:

| slug     | actual demo                                                                                |
| -------- | ------------------------------------------------------------------------------------------ |
| `astra`  | `https://astralab.framer.website/` (`astra.framer.website` is an unrelated component demo) |
| `kanso`  | `https://kanso.framer.media/` (`kanso.framer.website` is a different template, "Picture")  |
| `prolab` | `https://prolab.framer.website/` — resolves, but the demo brands itself **Studioform®**   |
| `rolen`  | `https://rolen.framer.media/`                                                              |
| `nexura` | `https://nexura.framer.ai/`                                                                |
| `hrzns`  | dead on both `.framer.website` and `.framer.media`                                         |

Framer serves demos on **three** hostnames — `.framer.website`, `.framer.media` and `.framer.ai`.
The template page's "Live Preview" link is client-rendered, so it is not in the raw HTML; the only
reliable way to resolve it is the `find` tool on the loaded template page. Budget for that.

---

## Shortlist (best 5, strongest first)

### 1. MATTTER® — https://mattter.framer.website/ — paid (price not shown on demo)

**Aesthetic:** Near-black (#080808) with a fine grain, one green accent used only on CTAs and the
active nav pill, one yellow accent used only on section indices. Type is a single neo-grotesk at two
extremes — 15px nav / 100px+ section headings — with nothing in between. The restraint is what makes
it read expensive: no gradients, no glass, no drop shadows.

**Animation — the strongest set in the batch:**

- **Nav pill that collapses on scroll-down and re-expands on scroll-up.** At rest it is a wide pill
  containing `MATTTER® · Studio · Projects⁰⁷ · Blog · [Contact]`. Scroll down and it shrinks to just
  `MATTTER® ▍••`. Job: reclaims the viewport when you are reading, restores the menu the moment you
  reverse. **Reproducible:** scroll-direction hook + a `width`/`opacity` CSS transition. Not
  Framer-proprietary.
- **A scroll-progress bar built _into_ the collapsed pill.** The `▍••` marks are a three-segment
  progress indicator that fills left-to-right as you descend. Job: tells you how much page is left,
  in the one element always on screen. **Reproducible:** `scrollY / (scrollHeight - innerHeight)` → a
  CSS custom property.
- **A sticky section-label pill riding a hairline rule at each section boundary** — `(About Us)`,
  then `(Portfolio)`. Centred on a 1px rule spanning the viewport, swapping as you cross into the
  next section. Job: constant "where am I" orientation without a sidebar. **Reproducible:**
  `position: sticky` + IntersectionObserver. The single most stealable device in the whole batch.
- Giant `MATTTER®` watermark behind the hero at ~4% contrast, with a real circled-R drawn as a
  geometric glyph rather than a superscript character.

**Components worth taking:**

- `Projects⁰⁷` — superscript numeral in a nav link that is the actual project **count**, not
  decoration. Sylven's `Projects 02` device but carrying information.
- Section index as a parenthesised numeral in the accent colour above the heading: `(07)` / `Projects.`
- Client logo grid where each logo sits in its own near-black card at ~30% opacity — reads as a wall,
  not a row of stickers.
- Green pill CTA (`Start Your Project`, `All Projects`) against near-black — one saturated colour,
  used four times on the page and nowhere else.

**Functional risk:** Reveal-gated throughout — every section rendered blank on the frame immediately
after a scroll and populated ~1–1.5s later. The top ~300px of the hero is empty by design, so the
first paint is a black screen with only a floating pill. No preloader, no scroll-jacking, no
count-ups found.

Screenshots: `shots/screenshot-1787258631825-196.jpg` (hero, collapsed nav), `shots/screenshot-1787258631825-197.jpg`
(hero, expanded nav), `shots/screenshot-1787258631825-198.jpg` (nav mid-collapse + `(About Us)` pill),
`shots/screenshot-1787258631825-199.jpg` (collapsed pill with progress marks),
`shots/screenshot-1787258631825-195.jpg` (about + logo grid).

---

### 2. Rolen Studio — https://rolen.framer.media/ — $69

**Aesthetic:** Black, cinema-grade. A three-column masthead instead of a nav row, and a hero where
the headline is pushed to the _lower right_ quadrant while the interactive index occupies the left
gutter. Art-directed rather than templated.

**Animation:**

- **Hover-driven vertical project rail.** A column of ~7 small project thumbnails runs down the left
  edge. Hovering one (a) moves a white 1px outline onto it, (b) prints
  `Built Different / Brand Film / 2024` in the empty space to its right, and (c) overlays a
  `VIEW PROJECT ▷` label across the thumb. Inactive thumbs each carry a small tick mark on the left
  edge, so the rail also reads as a ruler. The batch's best example of "a hover that reveals the next
  step" — it carries title, discipline and year, and costs the user nothing. **Reproducible:** plain
  React state + CSS transitions. Zero Framer dependency.
- Nothing else moves. No marquee, no parallax, no count-ups. Refreshingly quiet.

**Components worth taking:**

- The **three-column masthead**: `FEATURED WORK / PROJECTS (20)` · `ABOUT / CONTACT` ·
  `HELLO@ROLEN.STUDIO / X IG YT TT`. Links stacked in pairs, all-caps, tight. Reads like a magazine
  colophon. `PROJECTS (20)` again puts a real count in the nav.
- The hover rail itself — retarget it at DCS services: thumb rail on the left, service name +
  category + typical turnaround printed on hover.
- Right-aligned lower-quadrant hero headline with generous dead space above it.

**Functional risk:** Black screen for the first ~4s on load — the whole first viewport is
reveal-gated. Vertical scroll does **not** advance past the hero (the hero is fixed and the rail is
the interaction), which is a scroll-hijack in effect even if not by intent — I could not reach any
content below the fold. On a phone, a hover-only index has no equivalent, so the component needs a
tap-to-expand fallback authored from scratch.

Screenshot: `shots/screenshot-1787258905991-206.jpg` (rail with hover state on item 4).

---

### 3. Kanso — https://kanso.framer.media/ — $99

**Aesthetic:** The closest thing in the batch to Sylven's register. Pure white, one neo-grotesk,
everything on a strict left margin. The hero is nothing but the word `Kanso` at ~200px with a real
**circled-R glyph the same height as the cap** — the ® _is_ the artwork.

**Animation:**

- **Floating pill nav with a live local clock** — `Kanso® · 20 Aug, 9:38 pm` on the left, links and a
  `Start a project` CTA on the right, plus a `+` button. The clock ticks (watched 9:38→9:39). Job: it
  is the studio's local time, genuinely useful for a client deciding whether to call.
  **Reproducible:** `setInterval` + `toLocaleTimeString`.
- **Greyscale logo marquee** — continuous horizontal drift, ~11 client marks. Pure CSS keyframe.
- **Project card hover: image scales ~1.03 and bleeds past the card's rounded corner while the
  caption dims.** Confirmed live. Pure CSS transform + opacity transition.
- Motion-blurred showreel still with a circular play button — a static image, not a video, so it
  costs nothing until clicked.

**Components worth taking:**

- Section header device: `/ About us` hard left, `(01)` hard right, on the same baseline. Repeats as
  `Selected Work.` + `(02)`. Sylven's `[01] // BRAND EXCELLENCE © 2026` bar, simplified — and simpler
  is better for DCS.
- **Two-tone headline**: first line in black, second line in mid-grey, within one sentence. Carries
  emphasis without bold or colour.
- **Stat ticker, not a stat counter**: `15+ Years of Experience / 140+ Projects completed / 100+ …`
  in a single horizontally scrolling strip, separated by `/`. The figures are authored literals in
  the DOM — **no count-up** — and the motion is a marquee, so the numbers are always correct.
  Exactly the pattern to copy in place of the count-up Ricky dislikes.
- `★★★★★ 4.9/5 · Trusted by 100+ businesses` block pinned bottom-right of the hero.
- Project card: image in a light card, **title bold left / year right on the same baseline**, grey
  category caption below.

**Functional risk:** Worst-in-batch first paint — on load the page rendered as a **completely blank
white body with only the nav pill** for over 4 seconds, and stayed blank through the first two real
scroll steps before the hero appeared. The copy _is_ in the DOM (dumped `innerText` and got the full
page), so SEO and screen readers are fine — but a visitor on a slow phone gets a white screen with a
floating clock. No preloader, no scroll-jacking. $99.

Screenshots: `shots/screenshot-1787258325867-177.jpg` (Kanso® hero + logo marquee + rating block),
`shots/screenshot-1787258325867-176.jpg`, `shots/screenshot-1787258325867-178.jpg`.

---

### 4. ProLab / "Studioform®" — https://prolab.framer.website/ — **free**

**Aesthetic:** Full-bleed editorial photography, a fixed `Studioform®` masthead at ~48px top-left
that stays pinned while image panels scroll beneath it, and a text-only centred nav
(`Work · Index · About · Blog` … `Contact` pushed right). Very high-fashion. Best
aesthetic-per-pound in the batch given it is free.

**Animation:**

- **Service rows drawn as a hairline rule crossing a full-bleed image.** Each service is a large
  photo panel with `1 ————————————— Branding`, `2 ————————————— Digital` overlaid: index hard left,
  name hard right, 1px rule between. **The rule draws itself left-to-right as the panel enters the
  viewport**, and the label fades in behind it — caught a frame where the rule had reached ~68% and
  "Digital" was still half-faded. The line is doing a job: it physically connects the index to the
  name, and its progress tells you the row is arriving. **Reproducible:** IntersectionObserver + a
  `transform: scaleX()` transition on a pseudo-element. Trivially portable.
- Panels stack and scale over one another with rounded corners as you scroll — a card-deck
  transition. This one **is** closer to Framer's scroll engine; the CSS equivalent is
  `position: sticky` + a scroll-linked `scale`, doable but fiddlier.

**Components worth taking:**

- The numbered-rule service row (above). The single most directly usable device for a DCS services
  section.
- Fixed oversized wordmark with ® that persists over scrolling content — gives the page a masthead
  rather than a header.
- Nav with `Contact` isolated hard right, everything else centred.

**Functional risk:** Image-first throughout, so a slow connection gives you a flat orange/grey field
with a ghosted wordmark. The masthead rendered blurred-out on first paint. Heavy image weight is the
real risk for DCS's audience (local business owners on 4G).

---

### 5. Astra® — https://astralab.framer.website/ — free

**Aesthetic:** Split hero — light left half, deep-space photograph right half, divided by a **curved
diagonal**, not a straight line. Grain overlay everywhere. A ghosted `Astra` wordmark straddles the
divide. Genuinely striking, if a bit sci-fi for a UK IT firm.

**Animation:**

- Services list in the hero with a **sliding indicator dash** — each service name has a short rule to
  its right; the active one's rule is dark, the rest pale. CSS.
- Services section proper is an accordion of rows:
  `UI/UX and Product Design | short description | **12** Projects | +`. The `+` expands the row and
  the row's hairline rule extends to full width to mark the active state. IO/CSS.
- Section index `/01` parked in the left gutter, sticky against the section.

**Components worth taking:**

- **`Contact Now` pill containing a real photographic avatar plus a two-dot activity indicator** —
  Sylven's avatar pill almost exactly, and the highest-leverage single component in either sweep for
  making a small firm look staffed and reachable.
- **`Team of Pilots` avatar stack where the first "avatar" is a `32⁺` counter bubble** rather than a
  face. Neat, and removes the need to show 32 photos.
- Founder card: photo, name, role in grey beneath — with the mission paragraph beside it using
  **two-tone emphasis**.
- Stats with **superscript unit marks**: `38⁺`, `61⁺%` — the `+` and `%` set as superscripts.

**Functional risk — two, both serious:**

1. **Count-ups.** `38+`, `61%` and `1997`/`2008` all roll up on entry; I caught `1997` mid-roll with a
   second digit set visible underneath. The exact defect Ricky called out. Take the _layout_ of the
   stat block, author the figures as static text.
2. Reveal-gating at the worst severity in the batch after Kanso — entire sections rendered as bare
   headings with no content on the post-scroll frame.

---

## Also-rans (one line + url)

- **Formance** — https://formance.framer.website/ — cream/tomato-red agency template with one
  genuinely good effect: a **word-by-word colour-fill scroll reveal** on the about paragraph (grey →
  black as you descend), which literally tracks your reading position. Also a bottom-centre floating
  pill nav with a home icon, a `● ABOUT US` red-dot section label, a `SCROLL` cue with a red tick,
  and a `PROJECTS ● PROJECTS ●` marquee. Project cards carry pill category tags and the grid rows are
  deliberately offset. Held back by generic 3D-blob stock renders.
- **Nexura** — https://nexura.framer.ai/ — SaaS product template, not agency, but its **sticky
  left-hand tab rail** (`For marketing team / For startup / For agency`) that swaps the right-hand
  content as you scroll is a good pattern for DCS's audience segments. Framer canvas guides are
  visibly left in the published page — sloppy.
- **Collins Brent** — https://collins.framer.website/ — condensed grotesk headline, `Collins™`
  superscript, purple `Featured Work` marquee, project cards with an inline `→`. Competent personal
  portfolio, not agency-grade; the mid-page about section is a scroll-rotated stack of coloured cards
  that renders as illegible overlapping text at rest.
- **Crevix** — https://crevix.framer.website/ — dark violet + didone serif. Two devices worth noting:
  `Trusted by [5-avatar stack] Startups and Leading Brands Worldwide` as one inline sentence, and a
  dotted-halftone bracket flanking the section label. Serif-plus-purple reads dated.
- **WANDERPEAK** — https://wanderpeak.framer.website/ — a single-screen "register your interest"
  landing page, not an agency site. Mis-categorised.

---

## Rejected for animation reasons (name + the specific sin)

- **Kanso** (also shortlisted) — _near-total first-paint failure_. Blank white body, nav pill only,
  for >4 seconds and through two real scroll steps. Shortlisted anyway because the component work is
  the best in the batch and the content is in the DOM; the reveal gating must be stripped, not copied.
- **Creatiq** — https://creatiq.framer.website/ — **the worst page in the batch.** Content is gated
  behind a _blur_-reveal that never resolves: the page renders as a black void with a single red
  headline, the rest never paints, and scrolling stops advancing entirely. Captured three consecutive
  identical frames after three separate wheel events. Functionally broken.
- **Astra®** (also shortlisted) — **count-ups on every stat**, caught mid-roll. Plus whole-section
  reveal gating.
- **Crevix** — hero renders as a solid black rectangle for the first 4s; the nav is the only thing on
  screen.
- **WANDERPEAK** — full-black first paint on a page that is _one screen tall_. There is nothing to
  reveal; the gate is pure cost.
- **Rolen** (also shortlisted) — **the hero does not scroll.** Three separate wheel bursts left the
  scroll position unchanged; the fixed hero plus hover rail traps the visitor on screen one.
- **Collins Brent** — the about section's scroll-driven card rotation renders as overlapping text at
  rest; only legible mid-transition. Motion that makes content _less_ readable when it stops.
- **Nexura** — content blocks render as ghost outlines and only fill ~1.5s after the scroll settles;
  the published page leaks Framer's dotted canvas guides.

**Pattern across the batch:** 10 of the 11 demos rendered their first viewport blank or near-blank
for 3–5 seconds. The Framer `opacity: 0`-until-in-view default is universal here, and on dark
templates it presents as a black screen, which reads as a broken site rather than a slow one.
Whatever DCS borrows, the rule to carry over is: **content renders at full opacity by default; motion
is an enhancement layered on top** — animate `transform` from a visible state, or gate the animation
behind `@media (prefers-reduced-motion: no-preference)` with the un-animated state being complete.

**Count-ups found:** Astra (confirmed, caught mid-roll). Kanso deliberately avoids them by using a
marquee of authored literals instead — that is the pattern to copy. Formance's `3+ / 10+ / 100%` were
inconclusive; treat as unverified.

---

## What I did not cover

Of the 32 slugs in Batch D, 11 demos opened live. Not opened:
`videohut-…`, `reelio`, `jayden`, `yuya`, `vyzn`, `novexaai`, `agencyai`, `rec`, `mobius`,
`vsl-elevate`, `noora`, `zerixa`, `prisam`, `nord-a`, `andrew-hale`, `dr-k`, `valeryn-studio`, `bim`,
`lan-events`, `medora-healthcare`.

`hrzns` is **dead** — `Site Not Found` on both hostnames.

Also not covered: mobile/responsive behaviour (desktop-only per the brief), inner pages, and pricing
for paid templates other than Kanso ($99) and Rolen ($69).
