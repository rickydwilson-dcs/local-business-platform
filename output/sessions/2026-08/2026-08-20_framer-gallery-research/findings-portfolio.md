# Portfolio + Personal sweep

Segment: `framer.com/community/gallery/categories/portfolio/` and `.../personal/`.
Roughly 90 tiles skimmed across both categories (they overlap heavily — maybe 40% of the
Personal grid is the same sites as Portfolio). 11 live sites opened and scrolled end-to-end.

**Framing for this segment.** Portfolio/Personal is the craft end of the gallery and most of it
is _unusable structure_ — one-page art pieces with no services, no pricing, no FAQ, no footer
worth the name. So this file is deliberately weighted toward **transferable details** rather
than page skeletons, with one big exception: the category quietly contains a handful of real
small-business sites (a plaster repair firm, a pelvic-health practice) that are the most
directly applicable things I found anywhere. Those lead the shortlist.

One cross-cutting observation before the list: **the single most repeated "elevation" device in
this whole segment is the hand-drawn marker annotation** — a rough yellow lasso or ellipse drawn
over a word in a headline, or a hand-drawn oval badge floating beside a carousel. Two completely
unrelated sites (hest.design, trowelcraft.com.au) both use it, both to good effect. It is an
inline SVG path, costs nothing, and it is the cheapest way I saw to make a flat headline look
art-directed. It would survive contact with a plumber's website _immediately_ — circle "no
call-out fee" or "same-day" and the page stops looking like a template.

---

## Shortlist (strongest first)

### 1. Trowel Craft — https://www.trowelcraft.com.au/

**Why it's here:** It is a family-run Melbourne plaster repair business — i.e. _literally a DCS
client profile_ — and it is the most component-confident thing in either category. Every section
is doing something specific rather than reaching for the default card grid. If one site on this
list should be pulled apart component-by-component, it is this one.

Screenshots (all in `/var/folders/0q/45_vy13x57731v52n3nc56100000gn/T/claude-chrome-screenshots-Qrhs3g/`):

- Services cards — `screenshot-1787252342873-39.jpg`
- Services cards, closer — `screenshot-1787252342861-38.jpg`
- Testimonial + hand-drawn badge — `screenshot-1787252342859-37.jpg`
- "Swipe for more" carousel — `screenshot-1787252342874-41.jpg`
- Team cards — `screenshot-1787252342875-43.jpg`

**Components worth taking:**

- **Nav with the logo as an overhanging badge.** The nav is a transparent bar; the logo is a
  solid black hexagonal "seal" (FAMILY / TROWEL CRAFT / OWNED) roughly 2x the bar height that
  **drops below the bar's bottom edge into the page**. Nav links split 2 left / 2 right around
  it. Reads as a stamped trade mark rather than a website header. Fixed-size element, so it
  survives every breakpoint — at mobile the seal just becomes the whole header.
- **Hero type set _into_ the photograph, not on top of it.** Full-bleed documentary photo of the
  three actual tradesmen walking to a job. The headline "BETTER PLASTER REPAIRS" is a huge
  condensed grotesk in **semi-transparent white (~35%)**, so the photo reads through the
  letterforms. No dark scrim. It makes real, un-styled work photography look intentional — which
  matters enormously for trades clients who only have phone photos.
- **Service cards where the CTA is part of the card, not the section.** Three flat acid-yellow
  rectangles with **zero border radius** — no shadow, no border, no icon. Inside each: giant
  condensed all-caps title pinned top-left, a deliberate ~150px empty gap, body copy pinned
  toward the bottom, then a 1px black rule and a full-width **"ENQUIRE NOW"** bar as the card's
  own footer. Three services = three separate entry points to the enquiry form. This is a direct
  answer to "cards that are more than icon + heading + paragraph": the answer here is _cards
  that each convert independently_.
- **Testimonial as full-bleed portrait + oversized quote + hand-drawn badge.** Photo of the
  owner fills the section; the pull-quote sits over it in condensed white caps at ~72px with
  real typographic quote marks; and a **hand-drawn yellow ellipse containing "A FAMILY TRADE"**
  floats upper-right at a slight rotation. Zero card, zero avatar-name-stars.
- **Hand-drawn "SWIPE FOR MORE" oval** sitting outside the left edge of a horizontal carousel.
  Carousel cards are split 50/50 photo-left / flat-black-right with copy bottom-aligned in the
  black half, bleeding off both viewport edges. A mobile pattern promoted to the desktop layout,
  which is exactly the direction of travel we want.
- **Team cards on a colour ground.** White cards on the acid-yellow section, photo bleeding to
  the card's top edge, name in huge condensed caps, centred body. Simple, but the inversion
  (white card on yellow, where every other card was yellow on white) does the work.
- Stat row of four: label above, figure below, no dividers — "Family Owned & Operated / Years of
  experience / Liability Cover / Completed Projects".

**Reservations:** Everything animates in from `opacity: 0` on scroll, slowly — scrolling fast
leaves you looking at blank white for a full second at a time (several of my screenshots caught
completely empty viewports). On a mid-range Android that will feel broken, not premium. Also the
semi-transparent hero headline will fail WCAG contrast outright; borrowing it needs a real `<h1>`
behind it or a much higher opacity floor.

---

### 2. Xhulia Frroku — https://www.xhulia.com/

**Why it's here:** The best "case study / recent work" row structure I saw, plus a nav treatment
more interesting than the standard floating pill. It also demonstrates a spectacle technique I
want to explicitly warn against, which is useful in its own right.

Screenshot (hero, physics settled): `.../claude-chrome-screenshots-Qrhs3g/screenshot-1787252190227-6.jpg`

**Components worth taking:**

- **Nav split into three floating pods** rather than one pill: a circular monogram chip on the
  left, the white pill of nav links in the centre (each link is `icon + label`, lucide-style line
  icons at ~14px), then two standalone circular icon buttons on the right in solid brand colours
  (yellow envelope, lilac coffee cup). The gaps between the pods are the design. Reduces to
  monogram + hamburger + one coloured circle at mobile without losing identity.
- **Case-study row.** Repeated identically per project: small favicon-chip + `Client — Year` in
  grey; a single-line bold outcome headline at ~28px sans ("A design system that stopped UI
  debates and helped 4 product teams ship faster"); then a bullet-separated **outcomes strip**
  ("Fewer debates · Faster delivery · Dev-rated 4.4/5 for speed & efficiency · Shared UX
  standards"); a black pill "View case study >" hard right; and underneath, a **horizontally
  scrolling strip of screenshot cards bleeding off both edges**. The outcome-strip-instead-of-
  tag-list is the transferable bit: it says what the work _did_ in four fragments. For DCS that
  becomes "Built in 3 weeks · Ranks #1 for 'plumber in Ashford' · 4x enquiry volume".
- Rows are sectioned by a thin **coloured top-edge rule** (yellow) on the card that slides over
  the previous one — the section transition is a stacking card with a coloured leading edge.
- Headline mixes **serif with an italic serif emphasis word** ("I design products that _feel_
  simple, even when they're not") at low-contrast grey, with a sans subline where key phrases
  are bolded inline. That serif/italic/sans stack in one hero is more expensive-looking than any
  single-face treatment I saw.

**Reservations:** The pastel skill-chips in the hero are a **matter.js-style physics sim** — they
fall and pile up, and when they settle they _cover the headline_. Confirmed: after jumping to the
bottom and back, "I design products" was more than half obscured. Genuinely bad, and pure
spectacle. Take the chip styling (pastel fill, black uppercase mono label, trailing line icon,
slight rotation) as a static decorative element; do not take the physics.

---

### 3. hest.design — https://hest.design/

**Why it's here:** Typography and section-transition craft. The one to look at when asking "how
do I make type carry the page instead of components carrying it".

**Components worth taking:**

- **Nav justified edge-to-edge across the full viewport** — small mark far left, then About /
  Projects / Playground spaced with `justify-content: space-between`, Contact hard right. No
  pill, no box, no background. At 1512px it reads editorial and confident; the whitespace between
  items _is_ the design. (Honestly: this one does not translate to mobile — it has to become a drawer.)
- **The yellow lasso annotation.** A rough hand-drawn SVG ellipse loops around "human touch" in
  the hero headline "I create Strategic Websites and Branding with human touch". Single stroke,
  slightly overshooting, not closed. One inline SVG. Highest effort-to-impact ratio in the sweep.
- **Curtain section transition.** The dark section does not scroll up under the hero — it slides
  over it as a hard-edged full-bleed panel while the hero stays pinned behind. No parallax, no
  scale, no rounded corner. Cheap, and it makes the light→dark switch feel deliberate rather than
  like two stacked sections.
- **Word-by-word blur-to-sharp reveal** on the big display line — each word starts blurred and
  low-opacity and resolves as it enters, and the colour shifts white→cream across the line.
  Better than a fade because words that have already landed stay readable.
- Display face is a high-contrast didone-ish serif at ~140px caps, flush-left in a 4-column
  masonry page. The contrast between that and the tiny 11px uppercase tracked-out eyebrow ("HI,
  I'M HELEN") is the whole typographic system: two sizes, nothing in between.

**Reservations:** The 4-column masonry project wall (columns scrolling at slightly different
rates) is desktop-only and would collapse to a plain list. Blur filters on large text are
expensive and will jank on a low-end phone. And the aesthetic is _fashion-editorial_ — it needs
heavy tempering before a garage would wear it.

---

### 4. Rise from Within — https://risefromwithin.com.au/

**Why it's here:** A real small service business (pelvic-health practice, Australia) with exactly
the content problems DCS clients have — services, credentials, a method, testimonials, a booking
CTA. Least visually adventurous entry here, but two components I'd steal outright.

**Components worth taking:**

- **The symptom checklist — the best "not icon + heading + paragraph" card I found.** A central
  portrait image with a column of white pill-cards flanking it left and right (four each side).
  Each pill: 24px radius, white, soft shadow, thin line icon at 20px, and _one line of copy that
  is a problem the visitor recognises in themselves_ — "Bladder leakage when coughing, laughing
  or exercising", "Poor posture & chronic tension". No headings, no body copy. It is a **problem
  list, not a feature list**, and that is why it works. Collapses to one stacked column on mobile
  trivially because each item is already one line. For a DCS client: "Website you can't update
  yourself" / "No one can find you on Google" / "Enquiries going to a Gmail nobody checks".
- **Credential cards built around the real badge.** Two-up, one pale sage and one inverted dark
  olive, each carrying the **actual certification seal as an image at ~110px top-left**, then a
  tiny uppercase kicker ("PROFESSIONAL TRAINING"), then a large title, then body. Using the real
  accreditation artwork as the card's hero is exactly right for trades — Gas Safe, NICEIC,
  Checkatrade, TrustMark — and more persuasive than any icon.
- **Chevron-notched process strip.** Six steps inside one white rounded container, but the
  dividers between steps are **chevron notches (`>`) cut out of the divider** rather than straight
  rules, so the row reads as a flow without arrow graphics. Six is too many for mobile; at 3–4
  steps it works as a stacked column with the chevron rotated 90 degrees.
- Eyebrow chips are a small light pill with a **leading bullet dot**: "• About us",
  "• Certifications". Same family as the seed reference's mono chips but sentence-case and softer.
- Nav CTA pill is **taller than the nav bar** and overhangs it top and bottom — dark olive pill,
  label, then a white circular arrow chip inside the pill's right end.

**Reservations:** The photography is obviously AI-generated (the hero especially) and it cheapens
the whole thing on second look — a reminder that these patterns are only as good as the imagery
poured into them. Large blank stretches where scroll animations hadn't fired, same problem as
Trowel Craft. Overall look is closer to "good Framer template" than "art-directed".

---

### 5. Poch Studio — https://poch.studio/

**Why it's here:** The most disciplined, most copyable **portfolio row** in the sweep, plus a
service-section idea that kills the card entirely.

**Components worth taking:**

- **The case-study row, repeated identically.** 1px hairline rule at the top of each row; a
  header line with 2–3 dark tag pills hard left ("Brand Identity" / "Web Design" / "Illustration")
  and an outlined "See Full Case ↗" pill hard right; then an **asymmetric three-column text
  block** — left ~30% is the project sentence, right two narrow columns are ~12px body (the
  brief, and what was done); then a **4-across strip of equal-height 4:5 image tiles**. Nothing
  else. The discipline is the point: five projects, five identical rows, and it never gets boring
  because the imagery carries the variation.
- **The bold-lead-in headline.** Each project sentence is one line where the name is bold and the
  rest continues in regular weight, same size, same line: "**Open Office:** a friendly identity
  for the platform where businesses meet, share, and grow together". No separate title and
  subtitle. Compact, confident, and it forces good copy.
- **Services section with dividers instead of cards.** "Branding" / "Digital" columns separated
  by a vertical 1px hairline, a large illustrative object above each, huge title, body under. No
  card, no border, no fill — the rule does all the containment work. Direct fix for "components
  look flat": the problem is often that a flat card is worse than _no_ card.

**Reservations:** Near-black background throughout, which needs a real decision rather than a
default. And the 4-across image strip has no visible affordance that it's a set — on mobile it
would need to become a scroller with an explicit cue (Trowel Craft's "SWIPE FOR MORE" badge is
the fix).

---

### 6. Karolina Hess — https://karolinahess.com/

**Why it's here:** Two navigation ideas that are _actually_ mobile-first rather than
desktop-designs-that-shrink.

**Components worth taking:**

- **Bottom-pinned floating pill nav.** A white pill fixed to the bottom-centre of the viewport
  (not the top), containing HOME / WORKS / ABOUT, with the **active item rendered as a lime pill
  inside the white pill**. Thumb-reachable by construction. The pill's colours never change even
  as the page ground cycles white → deep green → sage → grey — good token discipline, and it
  makes the nav read as chrome rather than content.
- **Persistent "Quick info" edge tab.** A small rounded tab fixed to the right edge, vertically
  centred, rotated text, opening a panel. For a trades site this is the answer to "how do I keep
  the phone number, opening hours and service area one tap away without a sticky bar eating the
  viewport".
- **Image/type interlock section heading.** "Recent works" sits centred, and two rounded project
  images slide in from left and right on scroll until they _overlap and mask_ part of the word.
  Type and image occupying the same space rather than stacked. Cheap (two translating divs,
  z-index above the heading) and it reads as art direction.
- Full-bleed dark section where the click target is the words "PLAY REEL" at ~110px, not a button.

**Reservations:** The hero headline is a two-line staggered arrangement (second line indented
right by ~450px) which will be ugly or impossible below ~900px. "PLAY REEL" as bare unstyled text
gives no affordance that it's interactive. Smooth-scroll hijack made scroll increments
unpredictable.

---

## Also-rans

- **Huehaus** — https://huehaus.design/ — genuinely novel section transitions: sections wipe in
  as a **mosaic of square tiles filling in randomly**, and section boundaries are a **stepped
  pixel-staircase edge** rather than a straight line or curve. Worth stealing the stepped divider
  as a distinctive alternative to the usual diagonal/wave. But the hero was blank for 4 seconds
  and copy is illegible mid-reveal (letters fade in individually) — an LCP and accessibility
  disaster. Loud; wrong for a plumber, maybe right for a bold DCS brand statement.
- **Paul Hahn** — https://paul-hahn.com/ — a German web designer's services site. Components are
  flat (icon + heading + paragraph, exactly what we're escaping), but two things: the whole site
  is a **~580px single column centred at every width**, so desktop and mobile are effectively the
  same layout — a blunt but effective mobile-durability strategy; and the FAQ is numbered pill
  rows ("01." … "06.") on light grey with a chevron, the number the same weight as the question.
  One card in the services stack is inverted to brand blue — the cheapest possible "elevate the
  stack" move.
- **Denis Turbin** — https://trbn.design/ — dark seascape hero with a text card floating over it
  and a mixed serif-italic wordmark. Not opened in depth; thumbnail suggests good image/type
  overlay work.
- **Kyne Jang** — https://kynejang.com/ — very large serif "Digital Designer." with a soft
  radial-blur colour bloom behind the type. The blurred-colour-wash-behind-serif look is a cheap
  way to make an off-white hero non-empty.
- **27b Studio** — https://27-b.com/ — flat red ground, one enormous black abstract form. Pure
  poster. A reminder that one colour + one shape can carry a hero.
- **Nrthview** — https://nrthview.com/ — spatial canvas (draggable node map of work) with a
  radio-style top status bar. Spectacle, unusable structure, but the **top bar rendered as a
  hardware readout** (temperature, date, time, small caps) is a nice detail.
- **Hoox Design Studio** — https://hoox.co.in/ — "Full-Service Website Team behind the Top 1%" —
  a direct DCS analogue in positioning. Warm orange gradient hero, logo wall directly beneath the
  fold. Not opened; flagged for whoever covers Agency.
- **Jijo's Space** — https://jijo.fyi/ — scroll-scrubbed flight through volumetric clouds with an
  **Aqua-era skeuomorphic glossy pill nav** (avatar + play triangle in a grey gradient capsule).
  The retro-skeuomorphic nav is a live micro-trend worth knowing about. Everything else is pure
  spectacle — the whole journey has essentially no text, so it's also an SEO void.
- **Makora Studio** — https://makorastudio.com/ — positioning is almost word-for-word DCS ("We
  design & build websites that grow your business faster"). **Never got past its preloader**,
  which sat on a dark screen 20+ seconds saying "Good things take a second." An unintentional case
  study in what not to do; worth a second look from a faster connection.
- **Midlife Engineering** — https://midlife.engineering/ — highly rated (183 likes), beautiful
  thumbnail, but **never resolved past its preloader** across four attempts. Worth a retry.
- **Adam Lambert '98** — https://adamclambert.com/ — pixel-perfect Windows 98 desktop as a
  portfolio. Superb execution, zero applicability; listed so nobody wastes time opening it.

---

## What I did not cover

- **Mobile.** Per the brief I stayed at the shared desktop window and never resized. Every mobile
  claim above is inference from how the component is constructed (fixed-size badges, single-line
  list items, edge-bleeding scrollers), not observation. The bottom-pinned nav (Karolina Hess),
  the edge-bleeding carousels (Trowel Craft, Xhulia, Poch) and the single-column-at-all-widths
  approach (Paul Hahn) are the four things I'd most want verified in the orchestrator's mobile pass.
- **Interior pages.** Homepages only. Several of these (Xhulia, Poch, hest) have case-study detail
  pages that likely hold more component craft than the homepage does.
- **Hover and cursor behaviour.** I could not reliably capture hover states in this setup, so
  cursor-follow effects, magnetic buttons and link hover treatments are largely unassessed — a
  real gap given they were part of my remit. Only static and scroll-linked behaviour is reported.
- **Two sites blocked by preloaders** (Makora Studio, Midlife Engineering) — both promising, both
  worth retrying.
- **The deep tail of the Portfolio grid.** ~90 tiles read; the virtualised grid keeps going well
  past that. The tail was trending toward 3D/CGI showreels and AI-tool portfolios, so I stopped.
- **Pricing components.** Almost entirely absent from this segment — portfolios don't publish
  prices. Nothing here competes with the seed reference's pricing card; that has to come from the
  SaaS / Business / Agency segments.
