# SaaS + AI sweep

Harvested **68 SaaS + 176 AI tiles** (title + live domain) from the virtualised grid; opened **14
live sites**; 6 shortlisted.

The brief's target pattern — an abstract UI mock inside a feature card — is the house style of this
whole segment, so the useful question became "who does it in a way a plumber's site could survive".

**One transferable recipe from all of them at once.** Every good example builds the in-card mock
identically: a flat _tinted_ canvas (not white, not a screenshot), skeleton grey bars standing in for
text that doesn't matter, and **exactly one element in full colour and full fidelity** — the thing
the caption is about. ~20 lines of CSS, never dates. Nobody puts a real product screenshot in a card;
screenshots are reserved for full-bleed slabs.

## Shortlist

### 1. Delphi — https://www.delphi.ai/

**Why:** Best component set for DCS's actual problem, and warm rather than cold — off-white/blush
ground, display serif, one orange accent, five genuinely different card shapes that still read as one
system. Also the best pricing component in the segment.

**Components:**

- **Pricing cards on a staircase** — four tiers, each top edge ~30px lower than the one left of it.
  Small superscript `$` + ~56px numeral + "per month" in 13px grey on the same baseline. **Full-width
  pill CTA sits under the price, above the feature list**; filled orange on one tier only, tinted
  beige on the rest, so there's exactly one loud button.
- **Feature rows with a bespoke icon each, not repeated ticks** — every line ("Analytics Dashboard",
  "Slack Integration") gets its own 16px outline icon. Removes the templated checklist feel entirely.
  Above the list: a grey rule + "Includes everything in Free, plus:".
- **Tinted bento with a portrait in the middle** — four flat blush cards (heading top, body bottom,
  deliberate empty middle) with a full-bleed photo card spanning both rows in the centre column,
  name+role in white at top, faint mono characters bleeding at the bottom edge.
- **Persona tab switcher** — plain text tabs, active one orange, no pill/underline; swaps the card
  pair below. Directly "Plumbers · Salons · Garages · Accountants".
- **Split card**: photo left, checklist right, rows on 1px rules with a _circled outline_ tick (not a
  filled green one).
- **Numbered step cards** — `01` in orange sitting _inline on the same baseline_ as the title, not
  above it.
- **Gradient CTA slab** — full-width rounded rect, soft diagonal orange gradient, logo mark,
  headline, one white pill. No image, no border.

**Reservations:** the display serif reads "wellness brand" unless paired with much plainer body copy.
The two-clause headline mannerism ("Your mind / is _Yours._", second clause italic + greyed) is used
in every section and gets tiring.

Screenshots: `shots/screenshot-1787252654946-102.jpg` (bento), `shots/screenshot-1787252654944-101.jpg`
(steps+CTA), `shots/screenshot-1787252674712-108.jpg` (pricing)

### 2. Mimo — https://mimohq.com/

**Why:** Closest thing to a working template for DCS — sells software to **UK professional-services
firms**, roughly Ricky's buyer, and solves the "card that isn't icon+heading+paragraph" problem with
the least engineering of anything I saw.

**Components:**

- **Service card = tinted canvas + one floating white fragment + caption below.** ~320px panel in a
  per-card pastel tint (pale blue / sage / lavender) with a faint dotted grid; one white rounded
  fragment floating with a soft shadow. Heading, one-line description and a green `Explore →` sit
  **outside and below** the panel on the page ground — no bordered card at all.
- **The fragments are all just lists**: (a) task checklist, completed rows solid green tick,
  in-progress row a green quarter-circle spinner with a smaller grey sub-line ("Identified 12
  prepayments and 5 accruals"); (b) category list, last two rows greyed with hollow radio dots; (c)
  three `£20,147.00` rows each with a small dark action button (`Send for review`/`Approve`/`Pay`), a
  green role chip (`Jr. Accountant`, `Client`) and a tiny cursor arrow. Each maps straight onto a DCS
  story.
- **Announcement bar** as a dark-green full-bleed strip above the nav, one line, dismissible ×.
- **Full-bleed dark-green CTA slab**, two-line centred headline, single _tonal_ (not white) button — a
  quieter CTA band than black-on-white.

**Reservations:** hero lifestyle photo does no work; lots of dead vertical space under the captions at
1440px; cookie card overlaps content until dismissed.

Screenshot: `shots/screenshot-1787252789491-131.jpg`

### 3. Ballpark — https://ballparkhq.com/

**Why:** Most complete _set_ of components on one page in the sweep.

**Components:**

- **Pricing cards that overlap** — two cards at different vertical offsets, left one z-above so its
  rounded corner physically covers the right card's edge. Each: 48px rounded-square icon tile
  top-left, plan name ~24px, one-line grey qualifier, **full-width near-black CTA with ↗**, then a
  feature list of small round bullets on 1px rules with one row bolded. No prices — CTA is "Book a
  demo", exactly the DCS bespoke-work situation.
- **3×3 capability tile grid** — nine white cards each holding a mini-UI (star-rating widget, audio
  waveform, phone frame with heatmap overlay, packaging A/B chooser with radio dots and a
  green-outlined selection, a `● REC` badge). Caption is a single plain sentence bottom-left — no
  heading weight, no paragraph. The restraint is what makes it look expensive.
- **Pinned announcement bar as a separate floating rounded bar above the nav**, containing a mono
  uppercase chip (`AI INTERVIEWS`) + sentence + ↗. Very close to the Default Studio eyebrow chip,
  promoted to a site-wide component.
- Hero headline **word-by-word scroll reveal** 15%-grey → black over a dotted grid.
- **Full-bleed crimson dotted band** with a white app window overlapping its bottom edge into the
  white section below.

**Reservations:** tiles are dense enough that several need a simpler phone variant rather than
scaling. Hero reveal means the headline is near-invisible above the fold on a slow connection.

Screenshots: `shots/screenshot-1787252827673-140.jpg` (tiles),
`shots/screenshot-1787252846815-143.jpg` (pricing)

### 4. Billow — https://www.billow.so/

**Why:** Clearest single example of the target pattern, and it's a **service-business** product
(invoicing/CRM for freelancers and small studios).

**Components:**

- **Three "getting started" cards** — white, ~24px radius, thin border, top panel with a soft blue
  radial wash. Inside: grey skeleton bars with exactly one bar tinted blue, plus one full-colour
  element floating over it — a blue `AI Import` pill, a `2 min` circular badge, an
  `Unpaid Invoices £14,000` blue tooltip pinned to a line chart. The recipe in its cleanest form.
- **The count-up.** Middle card animates `$0K → $19K` on scroll-in. ⚠️ This is precisely the
  `feedback_animated_counters_show_false_figures` trap — if DCS copies it, the true figure must be
  the authored markup value and the animation decorative.
- **Persona pill tabs** (Freelancers / Studios / Agencies / Creators / Consultants) — outlined pills,
  active gets blue border + blue text.
- **Eyebrow chips with a leading icon** used to label _every_ section (`✦ Before & After`, `? FAQs`,
  `🚀 Getting started`) — white pill, thin border, tiny blue icon, ~13px label. Gives the page rhythm.

**Reservations:** heavy display serif everywhere + soft-blue gradient blobs — a _look_, not a neutral
system, and the blobs will cost paint performance on cheap Android. Nearly every section is centred,
which flattens hierarchy.

Screenshot: `shots/screenshot-1787252353897-44.jpg`

### 5. Composio — https://composio.dev/

**Why:** One component, and it's the best "how it works / our services" component I saw.

**Components:**

- **Sticky numbered index rail** — left column pins a bordered four-row list (`01 SMART TOOLS` …
  `04 DYNAMIC SANDBOX`), mono uppercase, hairline dividers. As the right-hand panels scroll, the
  matching row gets a highlighted border and its number chip flips to a filled blue square. Panels
  are edge-to-edge pairs (visual left, copy right) separated by 1px rules with no gutter, so the
  block reads as one table, not four cards.
- **`01` in a small grey rounded square** above each panel heading — far quieter than the usual giant
  ghost numeral.
- **Mono eyebrow in a bordered box with a leading filled square** (`▪ WHY COMPOSIO`) — square, not a
  pill; reads "spec sheet".
- **Feature bullets marked with a short vertical bar**, not a dot or tick. Tiny, noticeably less
  generic.

**Reservations:** the aesthetic (all monospace, code blocks) is wrong for a trades site — only the
mechanics transfer. The rail is constructionally two-column and needs an explicit mobile design (rail
→ horizontal chip scroller above stacked panels), not a reflow.

Screenshot: `shots/screenshot-1787252716868-114.jpg`

### 6. Planhat — https://www.planhat.com/

**Why:** The most technically accomplished in-card mocks, and worth studying for _how little_ is in
each.

**Components:**

- **Mock-on-canvas, caption below, no card** — three ~400px flat `#F2F2F0` panels each holding 3–6
  floating white elements with 1px border + small shadow. Panel 1: five app icon tiles on a loose grid
  plus two orange labelled cursors (`Nadine`, `Agent`) — a shared-workspace metaphor from six divs.
  Panel 2: a dotted connector `Handover → Sonnet 4.6 →` a three-row checklist with the third greyed on
  a hollow radio. Panel 3: one chat card, `Agent` + one sentence. Heading/body sit on the page ground
  below.
- **The greyed hollow-radio "not done yet" row** appears in Planhat, Mimo _and_ Billow — cheapest way
  to make a static mock look live.
- **Sticky lime event bar pinned to the viewport bottom** — name, one-line description, date, city,
  `GET TICKETS`, ↗. Far better than a floating chat bubble; reusable as a DCS "free site audit this
  month" bar.
- **Two-tone section headings** (line 1 near-black, line 2 40% grey) — free hierarchy with no extra
  type sizes.

**Reservations:** heaviest scroll-reveal offender — several sections rendered as blank white viewports
until scrolled into range. Copy the layout, not the animation policy. Cookie consent required opening
"Manage Preferences" and toggling three categories off individually — do not copy that.

Screenshot: `shots/screenshot-1787252594651-86.jpg`

## Also-rans

- **Amplify IT — https://amplifyit.eu/** — closest _sector_ analogue in the segment: a small European
  IT-services firm (not a product company) using in-card UI mocks to sell consulting. Dark ground,
  magenta accent; cards hold a glowing search field with an action dropdown, and a node diagram of
  glowing pill nodes. Proves the pattern works for a services business. Held back by extreme
  scroll-reveal (four sections blank at capture), dead space, and a hero shield graphic that's an
  image, not a component. Screenshot `shots/screenshot-1787252470536-63.jpg`
- **Rox — https://www.rox.com/** — editorial serif/sans mix, blueprint grid with tick-marks at
  intersections, research index as hairline-divided rows with small blue `NEW` tags. Two-tone heading
  is the takeaway; testimonial carousel is video cards with arrows top-right.
- **Klyro — https://www.klyro.security/** — technical-manual art direction: hairline rules with square
  nodes, tiny mono `01` indices, circular blueprint glyphs, floating dark square nav trigger centred
  at top, `TALK TO AN EXPERT` pill + chat icon top-right. Excellent numbered-process section; far too
  art-directed otherwise.
- **Qvery — https://qvery.ai/** — 5-across "Industries" card grid (Travel, Finance, Healthcare,
  Automotive, Legal…), each a white card with a two-tone line illustration + `Learn More ›`. Exactly
  the structure DCS needs for sector pages; illustrations are bespoke and the hero headline is clipped
  mid-word ("Everywhe") — a live bug.
- **LinkPreview — https://www.linkpreview.app/** — not a marketing site, but a good sticky split-panel:
  left column pinned, right column scrolls through platform-specific preview cards. Reusable as
  "here's the same thing on every channel".
- **Litefirm — https://litefirm.com/** — cautionary. Nice CTA detail (blue pill with an inset white
  circular ↗ at its right end), but the entire page is blank white until each block scrolls in. This
  is what "dreadful on mobile" looks like before you even open a phone.
- **Fixaplan — https://fixaplan.com/** — whole homepage is a scroll-driven word-by-word reveal of one
  sentence. Zero components; listed so nobody re-spends the time.
- **Taxo — https://taxo.ai/** — dark, Vimeo-led, giant ghost-serif section words. Only reusable bit is
  a floating white pill nav pair with a subtle blue glow.

## What I did not cover

- **Mobile.** Could not resize (shared browser), so all judgements are desktop + structural inference.
  Mobile-risk flags are because a component is _constructionally_ two-column or absolutely positioned
  (Composio's rail, Klyro's rule system, Planhat's canvas mocks), not because I saw it break.
  **Delphi, Mimo and Ballpark are the three to send to the mobile pass first** — their
  caption-below-panel and flat-card-stack construction should stack cleanly.
- **Blocked domains:** `gradient.ai` and `joinvalley.co` returned permission-denied from the extension.
- **Not opened** (~230 harvested, 14 opened). Promising unopened names: `flighty.com` (phone-led —
  likely the best mobile craft in SaaS), `akiflow.com`, `moonvalley.com`, `helsing.ai`, `lunon.ai`,
  `vector-agents.com`, `trajectory.ai`, `esplora.ai`, `entropik.io`, `unizenlabs.com`, `wisk.aero`,
  `cypher.build`, `metasense.dev`, `nolana.com`, `contralabs.com`, `prewen.ai`.
- **Interaction detail:** no hover-tests of nav dropdowns, no mobile menus opened, no accordions
  exercised. None of the six had a notable FAQ/accordion treatment.
- **Footers:** not one of the fourteen had a footer worth stealing. If a good footer is wanted it must
  come from another agent's segment.
