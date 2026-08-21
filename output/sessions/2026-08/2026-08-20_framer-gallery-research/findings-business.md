# Business category sweep

Segment: `https://www.framer.com/community/gallery/categories/business/` (4.1K) plus
`https://www.framer.com/community/gallery/featured/?category=business` (27 featured tiles).
~140 tile titles/domains harvested and skimmed as thumbnails; 11 sites opened live and scrolled.

Weighted toward structural/commercial patterns (services, pricing, trust, contact) over spectacle,
per the assignment.

---

## Shortlist (strongest first)

### 1. Billow — https://www.billow.so/ (pricing page: /pricing)

**Why it's here:** This is the closest thing in the whole category to what the brief says the DCS
prototypes are missing — every feature card carries a purpose-built abstract UI mock, and the
pricing page is a genuinely composed component rather than three boxes in a row. 164 likes, the
highest in the category.

**Components worth taking:**

- **"Getting started" feature cards.** Three equal cards on white with a ~28px radius and a very
  soft blue-white gradient wash filling the top ~60% of the card. Inside each: a _skeleton_ UI mock
  (grey pill placeholders standing in for table rows / invoice lines / a chart) drawn at about 70%
  card width, then **one saturated blue element floated on top of it** — a chunky rounded "Import"
  button with an AI glyph, a 56px circular badge reading "2 / min", or a small blue stat chip
  "Unpaid Invoices / $14,000". The trick is that the mock is deliberately illegible (all grey
  placeholders) except the one blue thing you're meant to read. Card title is a **serif** display
  (~26px), body in sans below. This is a much cheaper illustration recipe than Default Studio's and
  it reads at any size.
- **Pricing, tier one.** The three founding plans sit inside an **outer container panel** — a
  ~1340px rounded rectangle with its own pale blue-white gradient — so the trio reads as one object.
  Plan name is serif at ~36px; price `$37` bold sans at ~20px with `/month billed yearly` in muted
  grey inline; a **green "You keep $445/yr" line** under the price does the value framing. Feature
  rows use small **line icons per row, not ticks** (member icon, project icon, invoice icon), which
  removes the tick-list cliché. Highlighted middle plan: pure white card, raised shadow, `Most Value`
  chip beside the name, and the only solid-blue full-width CTA; the outer two get white CTAs with a
  hairline border. Under every CTA sits two lines of 11px grey reassurance copy ("You won't be
  charged before the trial ends. / Cancel anytime before."). Below the cards, a row of four
  **outlined pill chips with a leading blue tick** ("Shape the roadmap with us", "Founding badge on
  your profile") carries the extras that would otherwise bloat the feature lists.
- **Pricing, tier two.** A second block headed "Or start with a regular plan:" with a
  **monthly/yearly toggle plus a `2 months off` chip** in the section header row rather than floating
  above the cards. Directly transferable to DCS's PAYG-vs-upfront problem.
- Hero: centred outline pill announcement chip above a very large serif headline, two-button row
  (solid blue pill + white pill), and a large soft blue "blob" glow bleeding up from behind the
  product screenshot. Restrained enough for a trades audience if the serif is swapped.

**Reservations:** Serif display type and a SaaS-blue palette; the copy pattern is product-led
("Start free trial"), so the CTA vocabulary needs re-pointing at "Get a quote". The pricing needs a
real "from £X" story — a plumber's site rarely has three plans.

Screenshots:
`/var/folders/0q/45_vy13x57731v52n3nc56100000gn/T/claude-chrome-screenshots-Qrhs3g/screenshot-1787252899898-148.jpg` (pricing)
`/var/folders/0q/45_vy13x57731v52n3nc56100000gn/T/claude-chrome-screenshots-Qrhs3g/screenshot-1787252916257-153.jpg` (feature cards)

---

### 2. Slaten — https://slaten.domenicogriffo.com/

**Why it's here:** Same "card contains an abstract UI mock" idea as Billow, executed with a
completely different and arguably more distinctive surface treatment. It is a template demo, so the
component vocabulary is deliberately reusable.

**Components worth taking:**

- **Dotted-ground cards.** Each card's background is an off-white panel filled with a fine
  **dot grid** (roughly 1px dots on a 6px pitch, very low contrast), ~20px radius, no border. The
  white UI mock inside then reads as floating _above_ a drafting surface. This single texture does
  more for "elevated" than any shadow, and it costs one CSS `radial-gradient` background.
- **Card affordance.** A ~32px square rounded button with a 45-degree arrow glyph pinned to the
  card's top-right corner, with the card heading occupying the top-left. Consistent across every
  card, so the whole grid reads as clickable without underlines.
- **The mocks themselves** are worth studying as a set because they are _not_ screenshots: a budget
  panel with two chartreuse progress bars and three greyed "Declined" rows; a receipt-matching
  diagram that is literally two small white cards joined by a horizontal rule with a green tick
  circle at the midpoint and the caption "Matched automatically / Receipt read in 0.4s"; a
  month-close panel with four bars all at 100% and a chartreuse "Export PDF" button. Each mock
  states the benefit visually in one glance. DCS could do the same with "site live in 10 days",
  "uptime 99.9%", "quote request → your phone".
- **Type:** a monospace typewriter face at ~44px for display headings against a normal grotesk for
  body. Distinctive and cheap; reads as engineering craft rather than agency polish.
- **Imagery:** halftone/duotone-treated photography (heavy dot screen, near-monochrome) so photos
  sit inside the same visual system as the dot-grid cards instead of fighting them.

**Reservations:** It's a fintech template with no real content behind it, and only the home page
exists (`/pricing` 404s), so there is no pricing or FAQ component to copy. Chartreuse-on-off-white
plus mono type is a strong stylistic commitment that may read as "startup" to a garage owner.

Screenshot:
`/var/folders/0q/45_vy13x57731v52n3nc56100000gn/T/claude-chrome-screenshots-Qrhs3g/screenshot-1787252935048-155.jpg`

---

### 3. Trowel Craft — https://www.trowelcraft.com.au/

**Why it's here:** An actual family-owned plaster-repair business — DCS's exact customer — with a
site that is genuinely elevated. This is the proof that the trades sector does not require the
generic-blue-tradesman-template treatment, and its structure (services / stats / standards /
promise / team / quote) maps almost one-to-one onto what DCS builds.

**Components worth taking:**

- **Service cards with no chrome at all.** Three flat chartreuse (#F4F191-ish) rectangles, zero
  radius, zero shadow, generous padding. Title in a heavy condensed grotesk at ~40px, set hard to
  the top-left; body copy pinned to the _bottom_ of the card with a large deliberate gap between,
  then `ENQUIRE NOW` in small caps beneath it. The empty middle is the design. Far more confident
  than icon + heading + paragraph, and it degrades to a single column on mobile without losing
  anything.
- **Hand-drawn oval annotation badges.** Small ellipses drawn as if with a marker, rotated a few
  degrees, containing two lines of caps text — `A FAMILY TRADE` over the founder photo,
  `SWIPE FOR MORE` beside the carousel. They do the job of an eyebrow label but feel human. Cheap
  to implement as an inline SVG ellipse + text.
- **Stat row.** Four figures at ~72px in the heavy condensed face (`94%`, `22+`, `$14MIL`, `194+`)
  with a bold 13px caption under each, on plain white, no card, no divider. Note these are
  count-up animated (they read `92 / 20 / 12 / 192` mid-animation), which is the known trap — author
  the true value in markup.
- **"The Standards We Hold" carousel.** Split cards — left half a photograph, right half a solid
  black panel with a caps heading top and body copy bottom — advanced horizontally.
- **Pull-quote section:** full-bleed founder photograph, huge white condensed caps quote laid over
  it, attribution in small bold sans ("Ross Davies, Co-founder (and Dad)").
- Nav is centred-logo with two links either side and no CTA button — unusual and confident, though
  DCS has already decided to put contact in the nav.

**Reservations:** The standards carousel is **wheel-jacked** — it pins the section and converts
vertical scroll to horizontal, and it did not release on my pass, so I could not reach the rest of
the page by scrolling. That is a real usability defect and must not be copied. The chartreuse +
black + condensed-caps look is loud; it works for a plaster business, less so for a "professional
firm" positioning.

Screenshot:
`/var/folders/0q/45_vy13x57731v52n3nc56100000gn/T/claude-chrome-screenshots-Qrhs3g/screenshot-1787252960102-156.jpg`

---

### 4. Didasko — https://didasko.domenicogriffo.com/

**Why it's here:** The most complete _set_ of commercial components in the category — bento, pricing,
FAQ, testimonials, process — all built in one consistent idiom. Even if the neobrutalist style is
rejected wholesale, the structural decisions are worth lifting.

**Components worth taking:**

- **Pricing cards.** Three cards, each a _different_ tint (pale yellow / peach / mint) rather than
  one highlighted plan — so no plan is visually demoted. 1.5px black border plus a hard ~10px
  offset black shadow (no blur). Plan name in heavy caps ~30px, then a 3-line description, then the
  price at ~48px with `/ MO` in small caps baseline-aligned beside it. Feature list uses a
  **four-point star glyph** instead of a tick. Full-width CTA at the card foot which carries _its
  own_ smaller offset shadow — a button that looks like a physical key.
- **FAQ rows.** Full-width white bars, 1.5px border, hard offset shadow, question in heavy caps at
  ~19px left, and a **filled yellow circular chevron button** at the right. The row is the hit
  target, the circle is the affordance. Much better than a thin `+` on a hairline divider.
- **Section eyebrows.** Small caps mono labels (`PROBLEM`, `BENEFITS`, `PRICING`, `FAQ`) inside a
  tiny bordered chip with the same offset shadow, centred above each section heading. Instantly
  makes a long page navigable.
- **Bento benefit grid** where the UI mock **bleeds off the card's right edge** (a leaderboard panel
  half-cropped by the card boundary) — a very effective way to imply "there's more in the product"
  without drawing a whole fake screen.

**Reservations:** Neobrutalism is a whole-site commitment; you cannot take the offset shadows
without taking the border weight and the flat tints. It's also a template with placeholder content
and a demo product. Hard black shadows on light tints can read as cheap if the type isn't as strong
as this.

Screenshot:
`/var/folders/0q/45_vy13x57731v52n3nc56100000gn/T/claude-chrome-screenshots-Qrhs3g/screenshot-1787252975081-162.jpg`

---

### 5. Nocean Recruitment — https://www.noceanrecruitment.com/

**Why it's here:** The best "small professional firm" reference I found — a services business
(construction/architecture recruitment) that has chosen editorial restraint over SaaS gloss. Useful
as the counter-proposal if DCS wants to look established rather than startup-ish.

**Components worth taking:**

- **A visible column grid.** Faint vertical hairlines run the full height of the page at fixed
  gutters, and the sticky nav is divided by the _same_ rules (logo in the leftmost column, links in
  the centre span, CTA in the rightmost). Section content snaps to those columns. It is the cheapest
  possible way to make a page feel designed rather than stacked, and it's completely style-neutral.
- **Testimonial band.** Full-bleed pale blue (#A8CBF5-ish) section, quote set in a **large italic
  serif at ~30px** with generous leading, broken into three short paragraphs; below it the **client's
  own logo** (not a headshot avatar), then attribution in 15px sans ("James Dean, General Manager,
  Plan Group Pty Ltd"). Using the client logo instead of a stock portrait is a small decision that
  changes the credibility completely — directly applicable to DCS showing its actual clients.
- **Numbered process.** `01. / 02. / 03. / 04. Post-Placement Care` on a warm dark-grey band, each
  step paired with a photograph, running full-bleed. Simple, and it survives a narrow viewport.
- Warm off-white ground (#FDFBF6-ish) with a Freight/Newsreader-style serif for headings and a
  neutral grotesk for UI — a palette that would read as "trusted local firm" rather than "tech".

**Reservations:** Extremely animation-dependent — almost everything is opacity-0 until scrolled
into view, and several viewports are near-empty as a result. The desktop layout leaves large voids
that will need real reflow work at mobile. There is no pricing component at all.

Screenshot:
`/var/folders/0q/45_vy13x57731v52n3nc56100000gn/T/claude-chrome-screenshots-Qrhs3g/screenshot-1787252992252-166.jpg`

---

### 6. Stack Health — https://www.stackhealthcare.com/

**Why it's here:** One idea executed better than anywhere else in the category: a scroll-linked
"how it works" that stays legible. Worth taking for the process/steps slot specifically.

**Components worth taking:**

- **Word-by-word scroll-linked text reveal.** The headline is set in grey and each _word_
  transitions to near-black as the section scrolls through the viewport. Unlike a fade-up it never
  hides content — the text is readable the whole time, it just gains emphasis. That is the right
  answer to "we want scroll animation but not a page full of invisible divs".
- **Pinned step scroller.** Left column carries `STEP 1` in small caps plus a heavy short heading;
  right column is a beige panel containing a white phone-proportioned card that swaps content as
  each step passes. Because the right panel is portrait-shaped, this collapses to a normal
  stacked mobile layout instead of breaking.
- **Segmented pill control** (`Bronze | Silver | Gold`) inside the mock — a plan-picker pattern that
  is smaller and friendlier than three pricing cards, and would suit a "which package suits you"
  interaction.
- **Section corner rounding:** the yellow hero section's bottom edge is met by the next section's
  large top radius, so sections interlock rather than butt. Simple, and it makes a long page feel
  built.
- Nav CTA is a **split pill**: `BOOK A CONSULT` in a wide black pill with a separate black circle
  carrying an arrow glyph beside it. Reads as one control, gives a second tap target.
- Line-art mascot illustrations (a tortoise at a typewriter) used as the "no photography budget"
  answer.

**Reservations:** Heavy scroll-linked animation throughout; several device mocks were still empty
placeholders on load. The bright yellow / cream / black palette is a strong brand choice, not a
neutral system.

Screenshot:
`/var/folders/0q/45_vy13x57731v52n3nc56100000gn/T/claude-chrome-screenshots-Qrhs3g/screenshot-1787253010082-168.jpg`

---

## Also-rans

- **Amplify IT** — https://amplifyit.eu/ — closest business _model_ match found (IT/AI consultancy
  selling to SMEs). One genuinely good component: a concentric layered-shield diagram labelled
  Identity / Network / Data / Audit as an abstract "how we protect you" illustration. Otherwise
  crippled by blur-in reveals and huge empty viewports.
- **Taxo** — https://taxo.ai/ — 96 likes. Aurora-gradient dark hero, mixed serif/sans headline
  ("_Intelligent_ healthcare"), small ghost-pill CTA. Good hero reference, weak on structure.
- **Ballpark** — https://ballparkhq.com/ (featured) — has a real `/pricing` page; worth a second
  opinion for plan comparison specifically. Not opened in depth.
- **Acctual** — https://acctual.com/ (featured) — invoicing/payments marketing site, same genre as
  Billow. Not opened.
- **Milo (pet insurance)** — https://milopet.com/ — 45 likes; consumer-service site with floating
  benefit chips overlaid on lifestyle photography and a visible "calculate price" CTA. Good
  quote-flow reference for a local service business.
- **Sidekick** — https://side-kick.se/ (featured) — Swedish small-business services, clean.
- **Rise from Within** — https://risefromwithin.com.au/ — solo practitioner, booking-led
  ("Book a Consultation" / "Join a Class" / "Start the 7 Day Challenge") — good CTA hierarchy
  reference for a salon or clinic.
- **Fundcycle Law** — https://www.fundcycle.com/ — 36 likes; professional-firm structure.
- **Luna UI** — https://lunaui.co/ — 70 likes; dark studio site, strong card craft.
- **Go-Getter** — https://go-getter.uk/ — UK careers-tuition solo business with a "Tailored
  Packages" section, so structurally relevant, but the execution is exactly the failure mode DCS is
  trying to escape: sticky sections that leave three consecutive near-blank viewports at 1512px.
  Instructive as a negative example.
- **Makora Studio** — https://makorastudio.com/ — a web-design studio (DCS's direct peer) with a
  strong "WE DESIGN & BUILD WEBSITES THAT GROW YOUR BUSINESS FASTER" hero, but it is gated behind a
  multi-second forced preloader ("Crafting your experience…"). Do not copy that.
- **Mètier / Strukture / Harmonix / Keitimas / Interlinea** — all `*.domenicogriffo.com` template
  demos from the same author as Slaten and Didasko. If the two shortlisted ones land well, this
  author's whole catalogue is a cheap source of consistent component patterns.

---

## What I did not cover

- **Mobile.** Per the brief I did not resize the window, so every observation above is desktop-only
  at 1512×789. Trowel Craft, Billow and Didasko are the three I would prioritise in the
  orchestrator's mobile pass; Nocean and Go-Getter are the two I most expect to fail it.
- **Hover and micro-interaction** were not exercised — I did not hover cards, open accordions
  (beyond noting the affordance), or open mobile nav.
- I read ~140 tiles and opened 11 sites live. The category holds 4.1K entries and the grid is a
  lazily-loading virtual list, so this is a sample of the "Trending" head, not the whole category.
  I did not re-sort by Newest or Most Liked.
- Two domains were blocked by the browser permission layer and could not be opened:
  `codeconneqt.nl`, and `didasko.domenicogriffo.com` intermittently.
- Framer sites hide almost everything behind scroll-triggered opacity animation that does **not**
  fire on programmatic scrolling. Anything captured with a JS scroll shows blank; all the
  screenshots above were taken after a real wheel event. Worth knowing for the mobile pass.
- No pricing page existed on the Slaten demo, and Nocean/Trowel Craft have no pricing at all, so the
  pricing evidence rests on Billow and Didasko.
