# Templates sweep — Batch E (slugs 129–159) + the category Featured shelf

Swept 2026-08-20. 20 demos opened live at desktop, all motion driven by real wheel events, paired
before/after screenshots at 2–3s intervals to catch reveal timing and count-up flashes.

**Headline result:** three of the six best-looking candidates are disqualified outright on the
count-up rule, two caught mid-flight (`+0 → +120`, `100+ → 120+`). The survivors — Small Studio,
Other °, Baseform — all share the same trait: **they carry their craft in typography and metadata
rather than in motion**, so there is nothing to fail.

Batch E is the tail of the category and is mostly weak: a lot of SaaS/real-estate/coming-soon
templates mis-filed under agency, and an unusually high rate of blank-hero reveal-gating. The
**Featured shelf sweep was the more productive half** — it contains ~60 agency templates that no
batch covers at all.

---

## Shortlist (strongest first)

### 1. Small Studio — https://smallstudio.framer.website/ — **Free**

**Aesthetic.** Light warm-grey, a serif logotype (`0X—Crew®`) against a geometric sans body, and an
obsessive two-axis metadata habit — everything is label-left / content-right on a hairline. It reads
like a studio that keeps records. Closest thing in the batch to Sylven's level of component detail,
and it is free.

**Animation.**

- **Live local clock** in a nav pill — ticked `9:40 PM → 9:41 PM` across captures. Real, useful, a
  two-line `setInterval`. _(Trivial JS, fully reproducible.)_
- **Live date in the footer** — `Thursday, 8/20/2026`, matching the real date. Both of these are
  motion that _means something_ rather than decoration.
- **Availability marquee** in a rounded grey pill beside the logo: `Open to work / Booking for
February / …` scrolling continuously. Carries booking state — a job. _(CSS keyframe translateX.)_
- **Card hover reveals an `Explore ⊕` pill** centred over the project image. _(CSS opacity transition.)_
- **Word-staggered paragraph reveal** with a mid-sentence weight/colour step. _(IO +
  transition-delay, or Framer Motion `staggerChildren`.)_
- **No count-ups anywhere.** The awards section — the obvious place for them — is a static list of
  hairline-separated rows.

**Components worth taking.**

- `0X—Crew®` serif wordmark with a true superscript ®.
- Status pill cluster in the nav: _marquee availability strip_ + _live clock chip_, side by side.
- Project row: title left · **year right-aligned in an oldstyle numeral** · discipline label
  right-aligned beneath it.
- `[01] Who we are` / `[02] Services` / `[03] Awards & Recognition` — bracketed section numerals with
  a plain-language label, on a split label-left/content-right grid.
- **Services rows**: small line-icon + service name left, right-aligned _stack_ of deliverables
  (`Logo Design / Packaging / Brand Assets / Typography`). The single most directly stealable
  component for DCS's services block — carries information with no motion.
- **Awards rows**: brand favicon chip + award name, then discipline tags and a year, `↗` at the right
  edge. A static, authored alternative to a stats bar.
- Testimonial: dark rounded card, quote in white, avatar circle + **name in an inline grey chip**.
- **Diagonal-hatch placeholder tiles** for images that have not loaded — degrades to a designed box
  rather than white space.

**Functional risk.** Everything is `opacity: 0` until scrolled in, and the stagger is slow — each
section sits invisible ~1–2s after entering the viewport, and the hero was still near-invisible grey
at 5s. Text is in the DOM, so SEO/no-JS survives. **Strip the reveal delays, keep everything else.**
No preloader, no scroll-jacking, no count-ups.

Screenshots: `shots/screenshot-1787258491921-184.jpg` (project grid + hover `Explore ⊕`),
`shots/screenshot-1787258491922-186.jpg` (testimonial + `[02] Services`),
`shots/screenshot-1787258491923-188.jpg` (services rows resolved),
`shots/screenshot-1787258491922-185.jpg` and `shots/screenshot-1787258491923-187.jpg` (**mid-reveal —
the failure mode**)

---

### 2. Other ° — https://other-template.framer.website/ — paid (price not shown on demo)

**Aesthetic.** Near-white, one grotesk, zero ornament, enormous confidence. The whole identity is
carried by a **degree sign** used as the trademark glyph (`Other °`) and by ruthless four-column
alignment. Feels like a design studio's own site rather than a template.

**Animation.** Almost none — and that is the point. **The only template in Batch E that rendered its
full hero and works grid at first paint with no reveal gating whatsoever.** The one real interaction
is the view switcher, a layout transition rather than an entrance animation. _(CSS grid + a state
toggle; entirely reproducible in Next.js.)_

**Components worth taking.**

- Four-slot top bar with **no button**: `Other °` | `Creative Studio` | `Index / Info` (active
  underlined) | `contact@other.is`. Putting the raw email where the CTA button usually goes is a
  strong, low-cost move for a small firm.
- `Selected Works⁽¹²⁾` — a **superscript parenthetical count** that is a real count of the items
  below. Exactly the Sylven register, and it earns its place.
- **View-mode switcher rendered as oversized type**: `Grid | List | Feed | Full`, active in black,
  inactive stepping down through greys and cropping off the right edge. A functional control that
  _is_ the typography. The best single answer to the "engaging yet functional" brief found anywhere.
- **Numbered process rows**: hairline-thin giant numeral far left · service name centre ·
  right-aligned deliverables stack · hairline rule between.
- Social links as bare words at the right of the hero, no icons.

**Functional risk.** Low. One real bug: the sticky top bar has no background, so it collides
illegibly with headlines passing under it — do not copy that. No preloader, no count-ups, no
scroll-jacking.

Screenshots: `shots/screenshot-1787259010032-212.jpg` (hero + switcher),
`shots/screenshot-1787259010033-213.jpg` (numbered process rows)

---

### 3. Baseform — https://baseform.framer.website/ — **$49**

**Aesthetic.** Black, editorial, image-led. The nav is the star: four columns spanning the full
viewport width with no container, reading as a masthead rather than a menu.

**Animation.** Minimal — image sections and text fade in on scroll, nothing sequenced. _(Plain
opacity transitions on IO.)_ No count-ups, no preloader, no scroll-jacking.

**Components worth taking.**

- **Masthead nav**: `Baseform®` | `Art Direction / Visual Design` (a two-line _discipline_ stack
  where a menu normally is) | `Work, Archive, Profile, Journal` (**comma-delimited nav items**, no
  separators, no pills) | `Let's Talk` hard right.
- `Featured Work ⁽'17 – '25⁾` — heading with a **superscript abbreviated date range**. Cheap, and
  instantly reads as a studio with history.
- Social as `X, Bē, Ig and Fb` — comma-and-_"and"_ delimited, sentence case. Odd and memorable.
- Project block: title · comma-delimited discipline line in grey · portrait image at an asymmetric
  column width, with deliberate empty columns beside it.

**Functional risk.** It is a _portfolio_ template — no services list, no pricing, no local-business
furniture. You would be lifting the nav and the section-header grammar, not the page. Full-bleed
imagery is heavy; first paint was black for several seconds.

Screenshot: `shots/screenshot-1787259030226-217.jpg`

---

### 4. Mattis® — https://mattis.framer.website/ — **$129** — ⚠ _Featured shelf; no batch covers this_

**Aesthetic.** Split-screen, hairline-ruled down the centre, a vivid signal-orange full-bleed section
with visible film grain, and body copy set in **mono uppercase**. Positions itself as a
"conversion-first design & development agency" — the closest positioning to DCS of anything found.

**Animation.**

- **Pinned split-screen**: the left pane holds while the right column scrolls past it, then they
  swap. Advances the argument as you read. _(`position: sticky` per pane — doable in CSS, but syncing
  two panes cleanly is fiddly; budget for it.)_
- **Persistent footer utility bar** that never leaves: `↓ SEE THE WORK` left, `SHOWREEL ▶` centre with
  a black circular play badge, floating `≡` hamburger capsule dead-centre bottom. Always-available
  navigation without a sticky header eating the top of the page.
- `12+` figure appeared static across both paired captures — **no count-up observed**, but only one
  sample; verify before committing.

**Components worth taking.**

- **Mono-uppercase body copy with weight-based emphasis** rather than colour. Very hard to make look
  cheap.
- Bottom utility bar as a fixed strip.
- Hairline vertical rule as a permanent page spine.
- Project rows over full-bleed imagery: name left · discipline centre · year right.
- Grain overlay on flat colour and on photography.

**Functional risk.** Black first paint for ~5s while imagery loads — the worst load behaviour of
anything still recommended. The pinned split-screen is the most Framer-flavoured effect on this
shortlist and needs a real spike before it goes in a plan.

---

## Also-rans (one line + url)

- **Zentro** — https://zentro.framer.media/ — scroll-linked horizontal word-marquee with inline image
  tiles; steal `[ Build Fast ]` bracketed corner labels, `✳ Los Angeles Based` / `©2025` / `[Menu]`
  corner metadata, two-letter socials. Hero at ~40% opacity at 5s.
- **Foreal** — https://foreal.framer.website/ — real-estate, but the only Batch E hero that renders
  its overlay text immediately; corner metadata on a hairline under the nav, mixed serif-italic
  headline, floating spec card over the hero, `ALL / RENT / SALE` filter pills.
- **AgencyIO (Agenio)** — https://agenio.framer.website/ — acid-green blueprint aesthetic; the
  **availability announcement bar** and the **crop-mark corner ticks + dotted rules** are the two
  things worth taking. Heavy reveal gating; intrusive promo widget.
- **Covix** — https://covix.framer.website/ — vertical hairline "measurement" rails with diamond tick
  nodes flanking the content column, notched-corner testimonial cards. Undermined by aggressive
  blur-in reveals and a content bug (two testimonials both attributed to the same person).
- **Nora Vale** — https://noravale.framer.website/ — see Rejected; but the
  `Los Angeles, CA (13:47:20)` **live clock with seconds** and the comma-delimited nav are worth
  lifting in isolation.
- **Denzar** — https://denzar.framer.website/ — scroll-linked two-tone paragraph wipe, `● WORK` /
  `○ ABOUT` dot-pills, avatar stack with a leading `+` circle joined by a hairline. Renders
  black/empty before each reveal.
- **Manufex** — https://manufex.framer.website/ — industrial, not agency; mono uppercase eyebrow with
  a dot, `01/06` carousel counter. Hero completely empty on load.
- **Orchid** — https://orchid.framer.website/ — fintech/fitness SaaS mis-filed under agency; hero
  never renders; mismatched copy signals low craft.

---

## Rejected for animation reasons

| Template                  | Sin                                                                                                                                                                                |
| ------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **MVN Studio**            | **Count-up caught mid-flight.** `+0 Product flows refined` / `+0 Reusable components` → `+120` / `+240`. Exactly the Sylven failure. Plus a black loading screen for the first 5s. |
| **Quomi** _(Featured)_    | **Count-up caught mid-flight.** `100+ / 65% / 10+` → `120+ / 85% / 30+`. A shame: live clock + date, `• Available for work` status dot, `⟨ SERVICES ⟩` bracketed label all good.   |
| **Theory Studio**         | **Count-up frozen at the wrong value in the wild.** `IMPACT IN NUMBERS / 01+ / PROJECTS SUCCESSFULLY DELIVERED` — publishes a false figure to anyone whose reveal doesn't fire.    |
| **Asake**                 | **Preloader that never finishes.** `ASAKE®` on black for 16+s across three separate attempts; no content ever appeared. Worst functional failure in the batch.                    |
| **OperatorX**             | **Intro sequence gates the page** — black screen with letters cascading diagonally, still running at 5s. The entry cost is paid by every visitor.                                  |
| **Nora Vale**             | **Scroll-jacked**: vertical wheel remapped to a horizontal filmstrip. Costs the visitor control of the page.                                                                       |
| **Martin Luke**           | **Renders pure white for 3+s**, then a single centred line of text. The canonical "functionally broken if the reveal doesn't fire" case.                                           |
| **WaitlistKit**           | Not a homepage — a one-screen coming-soon kit. Headline stuck at low opacity for 5s on top of that.                                                                                |
| **Bold Design Portfolio** | Could not assess: the slug's own subdomain 404s, and the template page's first outbound link resolves to a dead demo.                                                              |

---

## What I did not cover

**Opened live (17 of 30):** small-studio, martin-luke, orchid, manufex, foreal, waitlistkit, covix,
operatorx, mvn-studio, asake, baseform, other, agencyio, theory-studio, nora-vale, zentro, denzar.

**Resolved but not opened (13)** — real demo URLs mapped, so a follow-up can go straight in:

| Slug                   | Demo URL                              | Note                          |
| ---------------------- | ------------------------------------- | ----------------------------- |
| `interior`             | https://sero.framer.website/          | name mismatch — confirm       |
| `pokota`               | https://pokota.framer.website/        |                               |
| `trova`                | https://trova-travel.framer.website/  | travel, not agency            |
| `elyte`                | https://elytetemplate.framer.website/ |                               |
| `b2bizz`               | https://b2bizz-wbs.framer.website/    |                               |
| `portfolioz`           | https://portfoliona.framer.website/   | name mismatch                 |
| `erik-holm`            | https://erikholm.framer.website/      |                               |
| `milo`                 | https://milo-store.framer.website/    | name mismatch                 |
| `bold-design-portfoli` | https://bolddesign.framer.website/    | dead                          |
| `visability`           | **unresolved**                        | probably an author cross-link |
| `quantumflux`          | **unresolved**                        | same                          |
| `travely`              | **unresolved**                        | stray draft link              |
| `seonovu`              | **unresolved**                        | unverified                    |

**Method note:** template pages are client-rendered, so the outbound "Live Preview" anchor is only in
the server HTML for a minority. Fetching the template page and taking the first `*.framer.website`
URL works about two thirds of the time; for the rest you must open the page and read the link.

---

## Featured shelf sweep — `?category=agency`

**This is the most significant finding of the sweep.** The shelf is much longer than the 159-slug
harvested list suggests, and it is ordered by Trending, so the uncovered items are not fringe — they
are the ones Framer's own team is promoting.

Real-wheel-scrolled the shelf and accumulated slugs across the virtualised grid: **99+ distinct
agency templates**, of which roughly the first 40 overlap Batches A–E and the remainder do not.

**Uncovered by any batch, in shelf order:**

```
stratex, swissmono, morphic, baselane, claura, net, interlinea, happygolucky,
arpeggio, citebound, mattis, conversion, dune, shadwell-2-0, kora, stacky,
scarlet, dusk, starkpro, galilee, pipelinepro, swissstyle, hoffen, bleau,
finderos, loop, jack, south, portal, movence, mugen, apex-films, quomi,
display, primeedge, nitro, xzero, taro, studio13, lesmana, visionary, lando,
elixr, atlas-studio, soren, agentik, naoto-studio, deliver, resize, itconf,
rama, timeline, eniwave, valtero-x, treq, ora, strida, haven, effica, trifecta
```

Two spot-checked:

- **Mattis®** (`$129`) — promoted to the shortlist above (#4).
- **Quomi** (free remix) — rejected on a live count-up, but its live-clock + `Based in Amsterdam` +
  `• Available for work` corner cluster and `(1)`-numbered service rows are worth a look.

**Recommendation:** the uncovered Featured list above is a better-quality pool than the tail of the
category grid Batch E was drawn from. If there is appetite for a round two, sweep these 60 before
sweeping any more of the alphabetical listing. `mugen`, `loop`, `morphic`, `south`, `portal` and
`swissmono` all looked promising in thumbnail and are unassessed.
