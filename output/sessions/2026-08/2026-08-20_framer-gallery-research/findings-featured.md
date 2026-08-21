# Curated-top sweep (Featured / Awards / Trending)

**Segment:** the editorially-picked top of the Framer gallery, regardless of category.
**Date swept:** 2026-08-20.

## What the segment actually is (read this first — it changes the plan)

Three things I found out that affect how much weight to give this segment:

1. **The Awards tab is not live.** At `https://www.framer.com/community/gallery/` the top tab
   reads `Awards (Coming soon)` and is a disabled `<button>`, not a link. `/community/gallery/awards/`
   is not a route — it 404s to the generic Marketplace templates page. **There is nothing to sweep
   there.** No other agent should burn time on it.
2. **The only sort options are `Trending` and `Newest`.** There is no most-liked / popular sort.
   I used **Trending** (the default) for `/gallery/all/`, and I pulled the Featured gallery under
   _both_ sorts to widen the pool. So "trending" here is Framer's own recency-weighted engagement
   score, not an all-time like ranking.
3. **Featured is capped at 12 tiles per sort.** `/gallery/featured/?sort=newest` works as a URL
   param and returns a _different_ 12. `/gallery/all/` under Trending stopped loading at 23. So the
   entire curated top is ~35 unique sites, not hundreds. I looked at all of them and opened 10 live
   at depth, which is the right ratio for a segment this small.

**Headline finding on the segment as a whole:** the Featured gallery is overwhelmingly **personal
portfolios and art-direction spectacle** (sandracreates, xhulia, kargo-studio, teonak, karolortyl,
yanxinzhang, adamjakubowski, marysiaszczypkowska, bohdan.design, figurefilm, rabenrifaie,
kubafidler…). Beautiful, but structurally useless to DCS — they have no pricing, no services grid,
no FAQ, no contact treatment. The genuinely useful work for a services business was in the
_Trending_ tail, not in Featured. My shortlist reflects that.

---

## Shortlist (strongest first)

### 1. Midu Studio — https://midu.design/

**Why it's here:** It is the closest structural twin to DCS on the whole curated list — a small
studio selling productised web design _and_ build, with a real pricing model, a services grid, and
a 10-item FAQ. Almost every component DCS needs exists here and none of them are the flat
icon + heading + paragraph card. It also built Fixa (below), so the two share a component DNA.

**Components worth taking:**

- **Nav as a live status bar.** A single dark floating pill, centred and pinned, ~300x54px, split
  into two halves by nothing more than spacing: left is a 6-dot grid glyph + the word `Menu`, right
  is `1/5 slots for July` in ~13px grey. That is the default-studio eyebrow chip ("BOOKING FOR Q3")
  _moved into the nav_, so the scarcity signal is on screen at every scroll position instead of only
  in the hero. Logo and a white `Get in touch` pill sit separately in the top corners, so the
  centre pill can stay tiny — which is exactly why it survives to mobile unchanged.
- **Local-time chip.** `08:06 PM / London, UK` as a two-line micro-block. Cheap, and it makes a
  one-person operation read as a staffed studio.
- **Services cards, deliberately unaligned.** Four white cards in two columns where the left column
  is offset ~90px _lower_ than the right, so the eye zig-zags instead of scanning a grid. Each card:
  big 28px title -> 1px full-width rule -> a 12px grey micro-label reading `Info` -> body copy ->
  a 40px circular ghost-arrow button pinned bottom-right. The `Info` micro-label above the paragraph
  is the whole trick — it turns a paragraph into a labelled data field.
- **Work cards with the object breaking the frame.** Full-bleed coloured card, a 3D-tilted phone
  mock sitting _half outside_ the card's top edge, project name at ~34px bottom-left with the
  category beneath it in grey, `View Case` as a text link. Plus a filter-chip row
  (`Web design` / `No-code development` / `App concepts`) above the grid.
- **The pricing composition — this is the single best thing on the site.** Three tiers of component,
  not three plan cards:
  1. Two dark plan cards side by side. Plan name sits in a small grey pill at the top-left of the
     card; a 3D-rendered keycap object (orange on one, gold on the other) floats half outside the
     card's top-right corner; `$3000` at ~56px with `/ per month` as a small grey suffix on the
     baseline; a `Standard includes:` label; then a tick list (real check glyphs, not bullets).
  2. **Below the plans, two full-width reassurance strips**: a 40px rounded-square icon tile
     (pause glyph / shield glyph) + bold title + one line of copy — `Take a break — pause anytime`
     and `One test week — if we don't deliver, you get the rest of the month refunded`.
     These are the objection-handlers, deliberately _outside_ the plan cards so they apply to both.
  3. **Then a separate horizontal card for project work**: keycap on the left, `$3500+ / per project`
     centre, and the terms on the right (`Clear timeline with fixed milestones` /
     `Unlimited revisions within the agreed scope` / `50% to start, 50% on delivery`).
     DCS sells PAYG-with-a-24-month-minimum _plus_ project work — this exact retainer + reassurance +
     project-alternative stack is the shape DCS's pricing section wants.
- **Testimonial marquee** — five quotes cycling horizontally, each just quote -> name -> `Company,
Sector`. No cards, no avatars, no stars. Reads as confident rather than needy.
- **Tool wall split by a sentence** — the logo strip is interrupted mid-sentence: `Our tools &` …
  logos … `your brand.` Turns a boring logo row into a piece of copy.
- **A 10-question FAQ that actually answers commercial objections** (what counts as one task, can I
  pause, what does a project cost, do you build it too). Worth copying as _content strategy_, not
  just as a component.

**Reservations:** it's dark, it's aimed at startups, and the 3D keycap renders are a bespoke asset
DCS doesn't have (a plumber-facing site would need photography or a simpler object). The cookie
banner offers only `Customize` / `Accept All` — no one-click reject, which is a GDPR smell DCS
should not copy. Copy tone ("scaleups", "ambitious ideas") would need rewriting for trades.

**Screenshots:**

- Pricing plans + reassurance strips — `/var/folders/0q/45_vy13x57731v52n3nc56100000gn/T/claude-chrome-screenshots-Qrhs3g/screenshot-1787252809521-137.jpg`
- Project-based card + FAQ — `/var/folders/0q/45_vy13x57731v52n3nc56100000gn/T/claude-chrome-screenshots-Qrhs3g/screenshot-1787252809522-138.jpg`
- Offset services cards — `/var/folders/0q/45_vy13x57731v52n3nc56100000gn/T/claude-chrome-screenshots-Qrhs3g/screenshot-1787252809522-139.jpg`

---

### 2. Reiseservice Jeremias — https://www.hochzeitsreisen-hannover.de/

**Why it's here:** A one-woman local service business in Hannover (honeymoon travel planning) that
is doing everything DCS's clients need doing, at a level of craft well above what a plumber's site
normally gets. If you want proof that this component vocabulary survives contact with a small local
trade, this is it. It is also the **warm, light, serif** counterpoint to Midu's dark tech look —
worth putting in front of Ricky precisely because it isn't a tech site.

**Components worth taking:**

- **CTA pill with an inset arrow badge.** The nav CTA is a solid wine-coloured pill,
  `Unverbindlich anfragen` at ~17px, and at the right end a **white circle** containing a thin
  arrow glyph, inset ~6px from the pill edge so the pill visibly wraps it. Much more considered
  than a text-plus-chevron button, and it costs nothing.
- **Destination/service cards where hover reveals the sell.** ~290x465 image card, 16px radius.
  At rest: a frosted-glass pill top-left (map-pin icon + category, e.g. `Ruhe & Luxus`), and at the
  bottom the destination name at ~30px with a one-line subtitle under it. On hover: a dark scrim
  fades up, a 4-line description crossfades in over the middle of the card, and a **price chip**
  appears at the bottom — a wine-tinted pill reading `10 Naechte - Ab 3.490 EUR`. This is the direct
  answer to "cards that contain something other than an icon + heading + paragraph": the card holds
  an image, a taxonomy, a description _and_ a price, and only ever shows two of them at once.
  Maps straight onto DCS service cards with a "from £X/month" chip.
- **The trust composition.** Left column: `Ueber mich` eyebrow -> serif headline -> two paragraphs ->
  a row of three stat blocks (`800+`, `20+`, `40+` in serif, label beneath). Right column: a
  portrait photo in a rounded rectangle, with a **floating white testimonial card overlapping its
  bottom-left corner** — 5 star glyphs, a one-line quote, `— Anna & Jonas, 2024`. The overlap is
  what makes it feel designed rather than assembled.
- **Testimonial cards done properly.** Cream card on cream ground, 5 stars at the top in the accent
  colour, the quote in _italic serif_ (not sans), then a **1px rule**, then name on line one and
  `City - Year` on line two in small bold sans. The italic-serif-quote / bold-sans-attribution
  contrast does all the work.
- **Contact section split.** Left: `Kontakt` eyebrow -> big two-line serif headline -> italic
  supporting line -> contact rows where each row is a 40px circular tinted icon chip (phone glyph,
  WhatsApp glyph) + a grey micro-label above the actual number. Right: the form in a raised
  rounded card with above-field labels, placeholder examples that are real (`Anna & Jonas`,
  `eure@mail.de`) and a native select for the service.
- **Palette worth stealing regardless of the rest:** warm cream ground ~`#F7F1EC`, near-black
  serif display, a single deep wine accent used _only_ for CTAs, eyebrows, stat figures and icon
  chips. Nothing else is coloured. It reads expensive and it is trivially re-skinnable per client.

**Reservations:** the "Mein Versprechen" service trio _is_ the flat icon + heading + paragraph card
DCS is trying to escape — don't take that one. Heavy reliance on beautiful stock photography, which
a plumber won't have (though the card pattern still works with a job photo). Cookie banner is
non-blocking but its `Ablehnen` is the low-contrast option — don't copy that dark pattern.

**Screenshots:**

- Service trio (the _weak_ component, for contrast) — `/var/folders/0q/45_vy13x57731v52n3nc56100000gn/T/claude-chrome-screenshots-Qrhs3g/screenshot-1787252651862-92.jpg`
- About + stats + overlapping testimonial card — `/var/folders/0q/45_vy13x57731v52n3nc56100000gn/T/claude-chrome-screenshots-Qrhs3g/screenshot-1787252651863-93.jpg`
- Destination cards (rest + hover state both forced visible) — `/var/folders/0q/45_vy13x57731v52n3nc56100000gn/T/claude-chrome-screenshots-Qrhs3g/screenshot-1787252651864-94.jpg`

---

### 3. CrazyUi — https://crazyui.com/

**Why it's here:** It contains the _literal_ thing the brief says the DCS prototypes are missing —
an abstract UI-mock illustration that is also a working component. And its pricing card has two
details worth lifting wholesale.

**Components worth taking:**

- **The fake-browser component switcher.** A large rounded card styled as a macOS window: three
  traffic-light dots top-left, a grey URL pill centred reading `https://crazyui.com`, and beneath
  the chrome a **tab row** — `Navigation - Contact Us - Herosection - Footer - Pricing - Team -
Services - Testimonial - Features - FAQ` — where the active tab is a light pill and clicking one
  swaps the screenshot grid inside the window. A second floating **segmented toggle** (`Figma` /
  `Framer`, the active one a black pill) is pinned to the bottom edge of the same window, half
  overlapping it. This is default-studio's "fake browser chrome" idea taken one step further into
  something interactive, and it is a very natural fit for DCS showing _what a client's site could
  contain_ without needing 10 real client sites.
- **Pricing card, two specific details.** (a) The `Most Popular` badge is a **black pill that
  overlaps the card's top edge**, sitting roughly half outside it, rather than a ribbon inside the
  card. (b) The price is `$39` at ~48px with the **old price `$69` struck through immediately to its
  right in grey at ~28px**, on the same baseline — anchoring, done in one line. Feature rows use a
  **circular grey chip containing an arrow** instead of a tick, which reads as "and you also get"
  rather than a checklist. Full-width black pill CTA at the card foot.
- **Avatar-stack social proof pill** — three overlapping circular avatars (~34px, 2px white ring,
  ~12px overlap) + `Trusted by 100+ creators`, all inside one light grey pill. Small, and far better
  than a bare "trusted by" line.
- **Component gallery tile** — flat grey rounded tile, a white screenshot inset with generous
  padding so it floats, and the label _below the tile_ on the left with a `Pro` badge on the right.
  Labels outside the tile keeps the grid quiet.
- **Footer wordmark** — the entire brand name set as a giant white lockup across a black band at the
  very bottom, letters clipped by the viewport edges. Cheap, and it makes the page feel finished.

**Reservations:** it's a designer-to-designer marketplace, so the tone (serif display + "Made in
mumbai, india") and the promotional strike-through pricing would look wrong on a DCS page selling
long-term care plans. The sticky top-of-page discount ticker (`CrazyUi 2.0 Launch Offer - 30% OFF`)
is a conversion tactic DCS shouldn't need. It also has _two_ stacked fixed bars (offer ticker + nav)
which is exactly the kind of thing that eats a phone screen.

**Screenshots:**

- Pricing pair — `/var/folders/0q/45_vy13x57731v52n3nc56100000gn/T/claude-chrome-screenshots-Qrhs3g/screenshot-1787252718649-122.jpg`
- Fake-browser window + component grid — `/var/folders/0q/45_vy13x57731v52n3nc56100000gn/T/claude-chrome-screenshots-Qrhs3g/screenshot-1787252718650-123.jpg`
- Oversized footer wordmark — `/var/folders/0q/45_vy13x57731v52n3nc56100000gn/T/claude-chrome-screenshots-Qrhs3g/screenshot-1787252718650-124.jpg`

---

### 4. Fixa Planner — https://fixaplan.com/

**Why it's here:** Same studio as Midu, but the _light_ expression of the same system, and it solves
the "how do I show a service without a product screenshot" problem with a sticky feature switcher
that would work just as well for DCS's service lines. Its nav is the most mobile-honest thing I saw
all day.

**Components worth taking:**

- **A nav that is genuinely one component at every width.** A small white floating pill (~155x48px),
  centred, containing only the wordmark `Fixa.` and a two-bar hamburger. There is no desktop link
  row to collapse, so there is nothing to reflow — the desktop nav _is_ the mobile nav. Given that
  "mobile was dreadful" is half the brief, this is the cheapest structural fix available: stop
  building two navs.
- **Sticky feature switcher (vertical pill tabs).** A left rail of stacked pill labels
  (`Designed for calm, not chaos` / `The effortless way to begin` / `Stay fully focused` /
  `Small steps. Zero guilt`) where the active pill is dark and the inactive ones drop to ~40%
  opacity; the right side holds a large visual that swaps as you scroll. It's a scroll-linked tab
  set that costs one section of page height and shows four things. Direct substitute for four flat
  feature cards.
- **Accordion + device pairing.** Further down, a left-hand accordion (`Talk like a human` /
  `Always one step ahead` / `Control tasks without stress`, chevron on the right, open row expands
  in place) paired with phone mocks on the right that change per row. Same idea, denser.
- **FAQ rows as full-width pills.** Light grey rounded-rectangle rows, question at ~18px on the
  left, and a **circular chevron button** on the right; the open row expands _inside the same pill_
  with the answer below the question rather than pushing a separate panel. Cleaner than a rule-
  separated list because the pill is the hit target.
- **Stat pair with direction glyphs** — `Anxiety 80% down` / `Productivity 21% up` presented as a
  small paired block rather than a stat row. Honest scale, two numbers, done.
- Dark rounded CTA band across the full width just above the footer, with the newsletter capture
  inside the footer rather than as its own section.

**Reservations:** the whole page is gated behind a scroll-locked intro animation, and it leans on
real app screenshots throughout — DCS has neither. **Note for the DCS build:** its intro overlay
never completes when the tab is backgrounded, which is a real accessibility/perf smell, not just an
automation annoyance. Also a waitlist site, so there is no pricing, no testimonials and no contact
form to learn from.

---

### 5. Taxo — https://taxo.ai/

**Why it's here:** Not for its structure — it barely has any — but because two of its components are
the best-executed versions of those components in the segment, and because it demonstrates a
"premium" feel achieved entirely with type and one grainy gradient, no illustration budget.

**Components worth taking:**

- **FAQ as an asymmetric split.** Left column holds only the section title, set in an enormous
  low-contrast serif (`Frequently Asked Questions` at ~64px, almost tonal against the background)
  and it stays put; the right column is the list. Each row is `01` in the accent blue at ~14px,
  the question in serif at ~24px, a chevron pushed hard right, and a 1px rule beneath. Numbering
  the questions makes a long FAQ feel finite.
- **Stat trio with ghost numerals.** Three columns divided by 1px vertical rules. The figure sits
  _above_ the label as a huge outlined/ghosted numeral bleeding off the top of the section, then a
  serif label, then a 4-line explanation. Most stat rows give you a number and two words; this one
  earns its space by explaining each figure.
- Grainy blue radial-gradient full-bleed sections with a fine noise overlay, white serif headlines,
  and a single white pill CTA. Cheap to produce, reads expensive.

**Reservations:** **the stat figures are animated count-ups** (`0 -> 31%`), which is precisely the
trap already documented in the DCS memory — a frozen or throttled count-up publishes a wrong number.
If any of this is taken, author the true value in markup. Beyond the FAQ and stats it's a spectacle
page (a full-viewport Vimeo embed, huge gradient slabs) with very little reusable componentry, and
its cookie banner defaults `Accept` to the emphasised button.

---

### 6. ZapConnect 2026 — https://zapier.com/zapconnect

**Why it's here:** The one big-budget site in the segment. Two of its patterns are portable even
though its illustration style is not.

**Components worth taking:**

- **The "two doors" CTA pair.** Where most sites put one CTA band, this puts two large side-by-side
  image cards — `Meet our speakers` and `Explore the agenda` — each with the headline set large in
  white serif top-left over the image and a **thin circular arrow bottom-right**. Giving the visitor
  a choice of two next steps instead of one converts better for a services site where "see prices"
  and "see our work" are both valid.
- **Mono ticker bar above the nav** — `VIRTUAL EVENT - SEPT 23 2026 - 9AM PT` in uppercase mono,
  scrolling slowly. Same job as default-studio's mono eyebrow chip but as a page-wide element.
- **Speaker/team cards with no cards.** Four columns separated only by **1px vertical orange rules**:
  photo, name in serif at ~22px, role in grey, then a short bio. No boxes, no shadows — the rules do
  all the containment. Much lighter than four boxed team cards.
- **Floating white stat card** dropped over the illustration (`77 speakers in 2025 / from companies
like Anthropic, Meta, Okta & more!`) — a small hard-edged white rectangle, no radius, deliberately
  overlapping the artwork.
- **FAQ with the `+` on the left.** 1px rules, no boxes, and the plus glyph leads the question
  instead of trailing it. Reads as a list rather than a set of buttons.
- Registration form as a white card floating over a full-bleed illustration.

**Reservations:** the entire look rests on commissioned isometric cityscape illustration. Strip that
out and you have a fairly ordinary page. Not applicable to a trades site without an art budget.

---

## Also-rans (worth a second opinion)

- **Paul Hahn** — https://paul-hahn.com/ — A Munich web designer, so a direct DCS analogue, and the
  most _mobile-honest_ layout in the segment: the entire page is a single ~577px centred column at
  every breakpoint, so desktop and mobile are the same design. Mono eyebrows (`// PROJEKTE`,
  `// SERVICES`), numbered FAQ (`01.` … `06.`), tilted 3D device mockups on the work cards. **But**
  its service cards are exactly the flat icon + heading + paragraph pattern DCS is trying to escape
  — only the middle one is inverted to solid periwinkle. Take the single-column strategy, not the cards.
- **Heretic** — https://heretic.wtf/ — Blackletter gold-on-black, 3D rally car render. Its
  testimonial marquee (dark cards with thin borders, gold body copy, no attribution clutter, scrolling
  horizontally) and its logo wall are good. Everything else is art direction, not components.
- **Bureau Dimanche** — https://www.bureaudimanche.com/ — French branding studio, 225 likes, high in
  Trending. Another agent had it open so I didn't duplicate; worth someone's look for a services-studio
  structure.
- **Poch Studio** — https://poch.studio/ — 174 likes, featured. Studio site, likely similar structural
  value to Midu; not opened at depth.
- **SubOne Studio** — https://www.subone.studio/ — branding studio for the creator economy, in the
  Featured _Newest_ set. Services-business shape.
- **Karolina Hess** — https://karolinahess.com/ — Framer freelancer selling websites, so on paper a
  perfect analogue. In practice it's a scroll-hijacked horizontal experience with a rotated
  `Quick info` pull-tab pinned to the right viewport edge (that tab is the one nice detail). Mobile
  prospects poor. Deep-green + lime palette is striking.
- **Luxury Clone** — https://luxurycloneaustralia.com/ — a real local retail business; minimal
  three-part nav with a centre `::` grid toggle, dark e-comm grid, giant ghosted wordmark behind a
  smoke plate in the footer. Thin on components and it sells replica goods, so a poor reference to
  hand a client.
- **Umanmade** — https://umanmade.com/ — a curated masonry gallery of human-made design. Good
  `@handle` overlay treatment on tiles and a nicely restrained beta announcement card, but it's a
  directory, not a business site.
- **Nrthview** — https://nrthview.com/ — the current hero pick on the gallery landing page. A
  desktop-OS metaphor (a field of draggable file icons over a photographic background). Spectacular
  and completely inapplicable to a plumber; flagging it so nobody wastes a slot on it.
- **Xhulia** — https://www.xhulia.com/ — top-3 Featured. Serif/italic mixed headline over a bed of
  small coloured "sticker" pills (`MOVING RECTANGLES`, `THINKING SYSTEMS`). The sticker-pill
  keyword bed is a nice cheap hero device if DCS wants personality without illustration.

---

## What I did not cover

- **The Awards tab** — it does not exist yet (`Coming soon`, disabled). Nothing to sweep.
- **A most-liked / all-time-popular sort** — Framer does not offer one. Trending and Newest only.
  If Ricky wants "the best ever" rather than "the best this week", that has to come from the
  category agents' deeper scrolls, not from here.
- **Mobile rendering.** Per the brief I never resized the shared window, so every judgement above is
  from a 1512px viewport plus reading the layout structure. The orchestrator's separate mobile pass
  should prioritise, in order: Fixa's nav pill, Midu's nav pill and pricing stack, Reiseservice
  Jeremias's destination cards (do they keep the hover content on touch?), and CrazyUi's fake-browser
  tab row (10 tabs at 390px is a real risk).
- **Interior pages.** Everything above is homepage-only. Midu has `/pricing` and `/how-we-work`
  routes that almost certainly hold more pricing componentry than the homepage section I captured.
- **~20 portfolio sites in Featured** that I triaged out on the thumbnail and the first screen
  (sandracreates, kargo-studio, teonak, karolortyl, yanxinzhang, adamjakubowski,
  marysiaszczypkowska, bohdan.design, figurefilm, rabenrifaie, kubafidler, sarahzaheer,
  tadaimacph, flerdesign, paysages.studio, jeremiebouchard, richard-payne, taliahhh, janissne,
  i-D Spotlight/Telfar). All craft, no structure — deliberately skipped per the brief's
  "spectacle vs structure" note.
- **Flighty** (flighty.com) and **Framer's own Performance page** (framer.com, 64 likes) — both were
  on my list as high-probability component-craft wins and I ran out of budget before opening them.
  Recommend someone picks these two up.

## Method note

Framer's gallery grid is virtualised _and_ its tiles render as empty skeletons while the tab is
backgrounded — with six agents sharing one window, my tab was backgrounded most of the time. I
collected tiles by polling the DOM through `javascript_tool` and accumulating into a Map across
scroll steps, and on the live sites I neutralised scroll-triggered reveals (forcing computed
`opacity: 0` elements to 1 and hiding full-viewport fixed preloaders) before screenshotting.
That means a few screenshots show a component's rest state and hover state simultaneously —
the Reiseservice Jeremias destination cards especially. Cookie banners were rejected where a
reject control existed (Taxo, ZapConnect, Reiseservice Jeremias); Midu offers no one-click reject
so I left it untouched rather than accept.
