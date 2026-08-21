# Templates sweep — Batch B (bungee … james, 32 slugs)

Assessed 2026-08-20, desktop only, real wheel events. 27 URLs opened live. Prices from each template
page's schema.org `offers.price`.

**A note on demo URLs.** `https://<slug>.framer.website/` is wrong often enough to matter. `firma`,
`james` and `hanza` all return HTTP 200 on the guessed URL but serve a _different or blank_ Framer
site — `james.framer.website` is somebody's unconfigured scratch project. Correct demos found:
`firma` → `firma-template.framer.website`, `hanza` → `hanza-template.framer.website`, `mira` →
`mirastudio.framer.website`, `mondragon-ii` → `mondragon-2.framer.website`, `studio-think` →
`studiothink.framer.website`, `miles-arden` → `milesarden.framer.website`, `rebirth` →
`re-birth.framer.website`, `torque-studio` → `torque.framer.media`, `alex-kabiru` →
`alexkabiru.framer.website`, `kai-marlow` → `kaimarlow.framer.website`.

---

## The Swiss/brutalist question the brief asked

Three templates trade on Swiss restraint, and they answer "is flat-but-expensive achieved without
animation crutches?" three different ways. **It depends entirely on whether the restraint is in the
layout or in the reveal:**

- **SwissFolio ($49)** — restraint is a _crutch_. At `scrollY 813` of a 1594px page the viewport is
  **pure white** with two floating pills; `Prestige`, `Norma`, `La Forge` all sit at `opacity: 0` in
  the DOM and never fire. The "minimalism" is indistinguishable from a broken page.
- **SwissBrut (free)** — restraint is _structural_. Grid, hairlines, type scale and full-bleed image
  stack do the work; motion is additive. Stats render as static authored figures. This is the
  flat-but-expensive look done properly.
- **Oblica (free)** — restraint is _total_. `docH` equals viewport height exactly (781px): the
  homepage does not scroll. Only **one** element has `opacity < 0.05`. Proves you can look expensive
  with zero motion — but it has essentially zero content.

**The lesson for DCS:** SwissBrut and Oblica both look expensive standing still. SwissFolio only
looks expensive _if the script runs_. Whichever direction is picked, the test is **"screenshot it
with JS disabled"** — that is what the visitor on the bad train connection gets.

---

## Shortlist (best 5, strongest first)

### 1. SwissBrut — https://swissbrut.framer.website/ — **free**

The strongest thing in Batch B by a wide margin, and it is free.

**Aesthetic.** Half-bleed image left / modular grid right, the right half carrying nav, a label pair
(`Swiss Brut` / `Design Agency`) and a giant tight-tracked grotesk `Brut` bleeding off the bottom
edge. Strict 4-column grid with visible full-height hairline rules. No rounded corners, no shadows,
no gradients — expensive because of proportion and type weight, not decoration. Black/white plus one
hot red that appears exactly twice.

**Animation:**

| Effect                                                                                                 | Job it does                                                                  | Category                                                                                                 |
| ------------------------------------------------------------------------------------------------------ | ---------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------- |
| Hero image expands 50% → 100% width on scroll                                                          | Promotes project 01 from "sample" to "the thing" — the scroll _is_ the click | Scroll-progress width. `animation-timeline: view()` or 10 lines of `useScroll`.                          |
| Sticky project caption pinned at fixed y, swapping per project                                         | Tells you which of four projects you're looking at, no label per image       | sticky + IntersectionObserver swap.                                                                      |
| Service list where the item nearest viewport centre goes black, rest pale grey                         | Reading-position indicator                                                   | IO with centred `rootMargin`. Degrades to "all grey" — still legible. **Best motion idea in the batch.** |
| Team name list where hovering brings a portrait card forward with a perspective tilt toward the cursor | Hover reveals _who_; tilt confirms pointer tracking                          | `transform: perspective() rotateY()` on pointermove.                                                     |
| Sticky nav whose link colour inverts as light/dark bands pass beneath                                  | Keeps nav legible over arbitrary imagery                                     | `mix-blend-mode: difference`. Trivial.                                                                   |

**Components worth taking:**

- `(01)` parenthesised index + two-line project caption, pinned mid-viewport at a fixed y.
- **Process rows**: giant numeral in column 1, one-word label (`Start` / `Ready` / `Takeoff`) in
  column 2, body copy in column 3, thumbnail in column 4, hairline between rows. **The exact
  component DCS needs for "how we work".**
- Stat triptych: giant figure top-aligned, explanation bottom-aligned, full-height vertical rules
  between columns.
- Contact block: giant `Let's talk.` behind a full-bleed image, footer columns `Call / Write / Follow
/ Map`.
- **A live local clock in the footer** that geolocates the _visitor_, not the studio (rendered
  `Eastbourne 9:37 PM`). Cheap, disproportionately human.
- Services as four giant words with right-aligned `(01)`–`(04)` — no cards, no icons, no boxes.

**Functional risk.** One real flaw: **on first paint the entire right half of the hero is blank white
for ~2–3 seconds.** Drop that intro stagger. Otherwise no preloader, no scroll-jack, **no count-ups**
(`12` / `80` / `3` paint at full value immediately).

Screenshots: `shots/screenshot-1787258335975-179.jpg` (first paint — half-blank hero, the defect),
`shots/screenshot-1787258306731-175.jpg` (team list, pointer-tilted portrait card)

---

### 2. Halo Studio — https://halo-studio.framer.website/ — **free**

The most _usable_ template in the batch. `docH` 11,442 with only **6% of visible elements
opacity-gated** — the lowest of any multi-screen page opened.

**Aesthetic.** Big, plain, confident. Giant `HALO STUDIO` grotesk with a `™` riding the shoulder of
the O; right-aligned eyebrow over a capability line over `Scroll Down ↓`. Near-monochrome with a
single orange accent. Reads like an agency rather than a portfolio, which matters for DCS.

**Animation.**

- **Services accordion** — hairline-separated rows, service name in giant uppercase grotesk, circular
  `+`/`−` toggle right-aligned. Opening reveals a thumbnail, description and a row of grey capability
  chips. Textbook "engaging yet functional": the motion _is_ the information architecture, the closed
  state still shows every service name, and it is a `grid-template-rows: 0fr → 1fr` transition or a
  `<details>` element. Zero Framer dependency.
- Horizontal project strip with per-tile scale on hover. Nothing else.

**Components worth taking.**

- **Live status chip in the nav centre**: pulsing green dot + `Based in Jakarta, Indonesia`. For DCS
  this becomes `Based in Eastbourne, UK` or an availability state.
- `✕ HALO ™` — mark, wordmark and superscript trademark as three separate typographic elements.
- The accordion service row.
- `Pages ⌄` dropdown alongside flat nav links — an honest way to hold a big sitemap without a
  mega-menu.
- Stat pair `120+` / `12+` set very large with a two-line explanation. **Static values, no count-up.**

**Functional risk.** Low. One oddity: scrolling _back up_ through the About section leaves it blank —
the reveal is one-shot-and-reverse rather than one-shot-and-latch, so a visitor scrolling up sees an
empty screen.

Screenshot: `shots/screenshot-1787259181419-223.jpg`

---

### 3. Hanza® — https://hanza-template.framer.website/ — **$99**

**Shortlisted for its component vocabulary — the closest thing in Batch B to the Sylven list — but it
carries the hard disqualifier and that has to be stripped.**

**Aesthetic.** Warm grey field under film grain, visible column rules, one orange accent, mono
small-caps for every piece of metadata.

**Components worth taking:**

- **Nav bar**: `⠿ MENU` left · `HANZA®` wordmark · `10:54 PM LOCAL TIME` centred (live clock, mono) ·
  and on the right a **`START PROJECT /HANZA` bar with the founder's real photograph set into its
  left edge and an orange chevron block on its right**. Sylven's avatar-in-a-CTA-pill device,
  executed as a rectangle instead of a pill, and executed better.
- **Trust block**: overlapping avatar stack + `4.92/5` + a red five-star row + `TRUSTED BY 122+
FOUNDERS`.
- **Section header bar**: small red square bullet · `01` · `MY MISSION` left, `©2019-2026`
  right-aligned, on a hairline. Sylven's exact repeating device.
- **Case-study header bar**: `■ 01` left · `CLIENT GOODWELL` centre · `YEAR 2026` right.
- **Spec table**: `PROFESSION → DESIGNER & FRAMER EXPERT`, `LOCATION → PRAGUE, CZECHIA`. Mono label
  left, value right-aligned, hairline between rows. For DCS this is the "who you're actually hiring"
  block — company number, registered office, years trading, coverage area — as a spec sheet rather
  than an About paragraph.
- **Card progress dots**: each stat card header carries `01 PROJECTS` and, right-aligned, three small
  squares with the active one in orange — a "card N of 4" cue at 8px.

**Animation.** Word-by-word scroll-linked copy reveal — decorative, not informational, but it degrades
to grey-but-legible rather than invisible.

**Functional risk — read before recommending.**

- **Count-ups.** The stat row renders `0+` PROJECTS, `0+` WEBSITES, `0+` YEARS on entry and only then
  animates to `122+` / `84+` / `12+`. Both states photographed. **If any of Hanza is used, those
  figures get authored statically and the counter is deleted.**
- 20% of visible elements are opacity-gated; the hero headline is absent until you scroll.

Screenshot: `shots/screenshot-1787259309239-224.jpg`

---

### 4. Oblica — https://oblica.framer.website/ — **free**

**Aesthetic.** Mono uppercase throughout. Nav is `OBLICA` left · `INDEX WORKS ABOUT NEWS` centre ·
`GET IN TOUCH` right, all monospaced at one size. Below it a horizontal band of project cards, each
carrying frosted-glass category chips over the image and a mono caption underneath.

**Animation.** Almost none, deliberately. A horizontal marquee and a subtle height change on hover.

**Functional risk.** The lowest in the batch: `docH` = viewport height, **1 element** with
`opacity < 0.05` on the entire page. If the script dies, this page is unchanged. But that's because
it's a one-screen index — no services, no process, no proof, no contact. Take the chip-over-image
treatment and the mono nav; do not take the page.

---

### 5. Magnetto — https://magnetto.framer.website/ — **free**

Here for exactly one component.

**The floating bottom dock nav**: a wide glass pill anchored to the bottom of the viewport, carrying
a **square avatar/thumbnail at its left edge**, mono uppercase links in the middle, and a white
**`CONTACT +`** pill at the right. The dock's backdrop is translucent, so it takes the colour of
whatever project card is passing beneath it. Sylven's "Book a Call pill with a real avatar plus a `+`
badge", scaled up into a whole navigation bar.

Second component: project cards where a rounded frosted-glass plate floats over the image carrying a
category eyebrow and the project name — the plate blurs the photograph rather than dimming it.

**Functional risk.** The hero wordmark reveals through a motion-blur that leaves it illegible for ~2
seconds. More importantly, **a centred floating dock is exactly the construction that bites us**: if
centred with `transform: translateX(-50%)` and carrying `backdrop-filter`, it becomes the containing
block for any `position: fixed` mobile-nav dialog nested inside it — the double-trigger case already
in our CLAUDE.md. Centre with `left/right/margin-inline` and portal the mobile dialog to
`document.body`.

---

## Also-rans (one line + url)

- **Mondragon II demo 5** — https://mondragon-2.framer.website/demo-5 — $59 — mint-on-black, rotated
  `/ABOUT` `/SERVICES` labels running up the page edge, `© SINCE 2016` corner metadata, `START
PROJECT` under a hand-drawn double-underline scribble, `+` glyphs at grid intersections. Great
  vocabulary; the page is mostly black void from reveal-gating and the sticky nav has no background.
- **Firma** — https://firma-template.framer.website/ — $129 — left-edge vertical rotated nav rail with
  an item count in the link (`WORK (8)`), headline mixing Didone serif with brush script over a giant
  perspective-skewed wordmark. But `docH === innerHeight` — the homepage does not scroll at all.
- **Miles Arden** — https://milesarden.framer.website/ — $129 — infinite masonry grid, only 1%
  opacity-gated, with a useful bottom control dock: socials · a **column-count switcher (`2 3 4`)** ·
  a `LIGHT` theme toggle. Photographer's index, not an agency site.
- **Studio Think** — https://studiothink.framer.website/ — $49 — graph-paper cream ground, handwritten
  annotations as corner metadata, live city clock, `⟵ drag ⟶` affordance labels. Opens on a
  `preparing your desk…` progress-bar preloader; scrapbook register wrong for a UK IT firm.
- **Stackgrid** — https://stackgrid.framer.website/ — free — nav links wrapped in square brackets
  around a centred glyph mark, and **printer's crop marks** framing the content region. Everything
  inside the frame is opacity-gated and never appeared.
- **Agero** — https://agero.framer.website/ — free — two ideas: a **notched tab hanging from the top
  edge** with a green dot and `Available for New Projects` (concave corner radii, reads as a physical
  tab), and **circular image chips set inline inside the headline sentence**.
- **Pulma**, **Orkan** ($19), **Macxfolio**, **Shinta** ($129), **Chapters** ($129), **Rebirth** —
  miscategorised or generic.

---

## Rejected for animation reasons

| Template                                           | Price | The specific sin                                                                                                                                                                      |
| -------------------------------------------------- | ----- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **SwissFolio**                                     | $49   | **Renders blank white.** Verified in the DOM: at `scrollY 813` of a 1594px page, three project names sit at `opacity: 0` and never fire.                                              |
| **Bungee**                                         | $49   | **Renders blank white, worse.** 11,214px of page, 4,035 characters of real content in the DOM — and 2,500px of scrolling produced nothing but a logo and a Buy button.                |
| **Himon**                                          | $79   | **Preloader that will not dismiss on its own.** Still on screen after 8s; cleared only on a wheel event, to a ~10%-opacity headline over an empty page.                               |
| **Mira**                                           | $129  | **Percentage count-up as a preloader.** Full-screen orange curtain with a `100%` counter, still blocking content at 8s. Preloader _and_ count-up in one.                              |
| **Intelli™**                                      | $99   | **Count-ups caught mid-flight showing false figures**: `13+ / 3+ / 0M+ / 3%` resolving to `500+ / 120+ / 12M+ / 100%`. Also a simulated-typing chat widget that exists to be watched. |
| **Sevora**                                         | free  | **Count-ups, in the hero, for 4+ seconds**: `0+` Projects / `0yr` Experience / `0+` Happy clients → `30+ / 8yr / 40+`. The Sylven defect above the fold, first screen.                |
| **Hanza®**                                        | $99   | Same count-up sin (`0+` → `122+ / 84+ / 12+`) — shortlisted anyway, counter marked for deletion.                                                                                      |
| **Torque® Studio**                                | $129  | **A welcome gate.** A full-screen `Hi, Welcome to Torque® studio / Scroll to explore` interstitial between the visitor and the homepage, followed by blank screens.                  |
| **Sanjaya**                                        | $129  | Sidebar app-shell layout; hero copy still at ~15% opacity after four seconds.                                                                                                         |
| **Firma**                                          | $129  | Hero resolves from a blur only after a scroll gesture, and there's nothing to scroll to.                                                                                              |
| **Agero / Stackgrid / Pulma / Chapters / Rebirth** | mixed | Hero or main content still invisible after a 4-second wait.                                                                                                                           |

**The pattern.** Nine of the twenty-seven demos opened showed the visitor a blank or near-blank screen
at the moment they arrived. Four showed a fabricated number. Not one is a rendering bug — they're all
the same design decision (`opacity: 0` until observed, figures counted rather than authored) taken
without asking what happens when the observer never fires.

---

## What I did not cover

- **Optique ($79)** — could not resolve its demo; the only outbound link is the author's personal site.
- **Fox X (free)** — no demo URL discoverable; `fox-x.framer.website` is a 404.
- **James ($49)** — resolves to an unrelated broken Framer scratch project.
- **Videofolio, Hanzo, Alex Kabiru, Kai Marlow** — left unopened; all portfolio/showreel rather than
  agency. `alexkabiru.framer.website` and `kaimarlow.framer.website` are the correct URLs.
- **Mondragon II demos 1–4 and 6** — only demo 5 opened. Demo 6 (a `STEREO ⬛ STUDIO` split-wordmark
  hero with a client logo marquee) looked worth a second pass.
- Mobile not assessed — desktop only, per the brief.
