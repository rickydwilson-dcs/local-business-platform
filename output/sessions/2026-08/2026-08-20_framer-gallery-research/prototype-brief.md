# DCS homepage — prototype brief

**Purpose.** This is the **combined** distilled output of both research sweeps — round one across the
Framer community gallery (real published sites: agency, business, SaaS/AI, landing page, portfolio,
featured) and round two across the agency templates marketplace. It exists to be **fed to a UX/design
skill as a brief**, not to be read as a survey. Nothing here says "copy site X" — every entry is an
abstracted pattern with the job it does, how to build it, and how it behaves on a phone.

The two rounds answer different halves of the original complaint. Round one was aimed at **"the
components weren't making it look elevated"** and produced the component vocabulary in Part 2. Round
two was aimed at **"engaging yet functional animation"** and produced the motion policy in Part 1.
The mobile rules in Part 3 come from round one's measured pass; round two was desktop-only.

**A connection worth naming:** round two found that the dominant defect in this whole design
world — content held at `opacity: 0` until an IntersectionObserver fires — is very likely a
contributor to our own prototypes' "dreadful mobile". It is not a mobile-layout bug; it is a
content-visibility bug that shows up worst on slow connections and small screens. Part 1 exists to
stop us inheriting it.

**No template is being purchased.** These are principles and component specs for prototyping our own.

**Stack:** Next.js 15 + Tailwind, MDX content, theme tokens (never hardcoded hex). Motion via CSS
transitions, IntersectionObserver, or small Framer Motion components. Nothing here requires a
proprietary scroll engine.

---

## PART 1 — Motion policy (non-negotiable)

The single most common defect across both sweeps: pages that render **blank** because content
visibility is gated on JavaScript. Nine of twenty-seven demos in one batch showed the visitor an
empty screen on arrival. Paid templates at $49–$129 render nothing at all.

### The rules

1. **Content renders at full opacity by default.** Never author `opacity: 0` as the resting state.
   Animate `transform` from a _visible_ state instead (e.g. `translateY(12px) → 0` with opacity
   already at 1, or opacity `0.6 → 1` so the intermediate state is legible).
2. **Never gate anything above the fold.** The hero must be complete at first paint.
3. **Arm hidden states from JS only after support is confirmed.** If the script dies, the page must
   be fully readable. (Already a rule in our CLAUDE.md — this research is the evidence for it.)
4. **Latch reveals.** One-shot, then `unobserve`. One template blanks its About section when you
   scroll back _up_, because the reveal reverses instead of latching.
5. **Gate motion behind `@media (prefers-reduced-motion: no-preference)`** with the un-animated state
   being the complete one.
6. **The acceptance test: screenshot the page with JavaScript disabled.** That is what a visitor on a
   bad connection gets. If it isn't a complete page, the build is wrong.

### Banned outright

| Banned                                              | Why — observed, not theoretical                                                                                                                                                                                                             |
| --------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Count-up numbers**                                | Ricky's explicit instruction. Twelve caught mid-flight showing false figures: `0+ years of experience`, `10+ / 10% / 10 / 10%`, `Awards 0`. One frozen permanently at `01+ projects delivered`. The seed reference rendered `0% / 0% / $0`. |
| **Preloaders / splash screens**                     | Three demos never finished loading at all (16+ seconds). One used a percentage counter _as_ the preloader.                                                                                                                                  |
| **Welcome gates / interstitials**                   | A full-screen "welcome, scroll to explore" panel between the visitor and the homepage. A scroll-triggered modal before you've read anything.                                                                                                |
| **Scroll-jacking**                                  | Vertical wheel remapped to a horizontal filmstrip; a hero that refuses to scroll; a carousel that captures the wheel and never releases.                                                                                                    |
| **Per-character scroll-fill that doesn't complete** | Three templates leave the tail of every headline permanently ghosted at rest — `Virtual Reality Encounte`. Motion that makes content _less_ readable when it stops.                                                                         |
| **Fake live data**                                  | One nav clock ran **backwards** (`06:45 → 06:41 → 06:43`) — an animation dressed as a clock. Another hardcodes "Available — EARLY FEB 2025", stale for 18 months. Live data is wired to a real source or it is static text.                 |
| **Typewriter effects on the proposition**           | The value proposition types itself out while the visitor waits.                                                                                                                                                                             |

### Allowed, and why

Motion earns its place when it **carries information**. The test: if you removed it, would the
visitor lose something they need? Ten effects that pass, with mechanism:

| Effect                                                                                                                        | Job it does                                                                               | Mechanism                                                                            |
| ----------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------ |
| **Reading-position list** — item nearest viewport centre goes full contrast, rest stay pale                                   | Tells you where you are in a list                                                         | IO with centred `rootMargin` + class toggle. Degrades to "all grey" — still legible. |
| **Scroll-spy index rail** — sticky list, marker moves to the in-view section                                                  | Table of contents that tracks you; orientation without a sidebar                          | IO + class toggle                                                                    |
| **Nav collapse with built-in progress** — shrinks on scroll-down, restores on scroll-up, collapsed pill _is_ the progress bar | Reclaims viewport while reading; shows how much page is left                              | scroll-direction hook + CSS custom property                                          |
| **Sticky section-label pill on a hairline** — swaps as you cross section boundaries                                           | Constant "where am I"                                                                     | `position: sticky` + IO                                                              |
| **Accordion services**                                                                                                        | The motion _is_ the information architecture; closed state still shows every service name | `grid-template-rows: 0fr → 1fr`, or `<details>`                                      |
| **Self-drawing rule** — hairline draws left-to-right connecting index to label as a row arrives                               | Physically connects the number to the name; progress signals arrival                      | IO + `transform: scaleX()` on a pseudo-element                                       |
| **Flow diagram with travelling dashes**                                                                                       | Draws the process the copy is describing                                                  | inline SVG + `stroke-dashoffset` keyframe                                            |
| **Hover rail** — hovering a thumbnail prints title / discipline / year beside it                                              | Reveals detail without navigation                                                         | state + CSS transition. **Needs a tap-to-expand fallback on mobile.**                |
| **Section watermark that tracks** — rotated margin label swaps `/about → /services → /work`                                   | Orientation with no sticky nav                                                            | sticky + IO                                                                          |
| **Labelled marquee** — a fixed opaque panel over the strip's left end names what's scrolling                                  | The static label explains the moving thing                                                | CSS keyframe + overlay                                                               |

---

## PART 2 — Component patterns

Each is abstracted. Build any of these fresh; do not clone a source.

### 2.1 The in-card mock — solves "cards look flat and generic"

Three agents independently reverse-engineered the same recipe:

> A flat **tinted** canvas (never white, never a real screenshot), grey **skeleton bars** standing in
> for text that doesn't matter, and **exactly one element in full colour and full fidelity** — the
> thing the caption is about.

- ~20 lines of CSS. Never dates the way a product screenshot does.
- **Real screenshots are reserved for full-bleed slabs, never inside a card.** Verified at 390px: the
  abstract mock stays legible while a real screenshot shrinks to a grey smudge. This is a _mobile_
  technique, not just an aesthetic one.
- The "not done yet" row — a greyed line with a hollow radio dot — is the cheapest way to make a
  static mock look live.
- DCS content for the single full-colour element: an `Enquiry received` toast, a `Site live` badge,
  a `£0 due today` chip, a `Renewed automatically` row.

### 2.2 Services — four alternatives to the card grid

Four agents independently landed on the same conclusion: **a flat card is often worse than no card.**
"Elevated" may mean removing container chrome, not decorating it.

| Variant                                  | Construction                                                                                                                         | Best when                                                                                                       |
| ---------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------- |
| **Typographic table**                    | Service names left at full contrast, descriptions right in grey, hairline between rows. No cards, no icons, no boxes.                | Default recommendation. Most information per pixel.                                                             |
| **Vertical hairlines**                   | Columns separated by 1px rules instead of card borders.                                                                              | Three to four services of equal weight.                                                                         |
| **Canvas + caption below**               | Tinted panel holds a mock; heading and copy sit _outside and below_ it on the page ground.                                           | When each service needs a visual.                                                                               |
| **Flat colour blocks with per-card CTA** | Zero radius, flat brand colour, title top, copy bottom, then a rule and a **full-width `Enquire now` bar as the card's own footer**. | Trades and local services — every service becomes its own conversion point. Verified to stack cleanly at 390px. |

Also: pair each service name with a **right-aligned stack of deliverables** (`Design / Build / Hosting
/ Support`) rather than a paragraph. Carries more information, needs no motion.

### 2.2b Audience segmentation — the component DCS most obviously needs

DCS sells the same thing to trades, salons, garages and small professional firms. Two independent
patterns for that:

- **Persona tab switcher** — outlined pills or plain text tabs (`Trades · Salons · Garages ·
Professional`) swapping the content block below. Active tab takes the accent; no pill, no underline
  is the quieter version.
- **Sector card grid** — 4–6 cards, each a two-tone line illustration + sector name + `Learn more ›`,
  linking to a sector page. This is the structure our MDX location/service routes already support.
- **Sticky audience rail** — left column pins `For trades / For salons / For offices` and the right
  column swaps as you scroll. Two-column by construction; needs the mobile chip-scroller treatment.

### 2.3 Process / how it works

- **Numbered rows** — giant numeral col 1, one-word label col 2, body col 3, thumbnail col 4,
  hairline between. Reads as one table, not four cards.
- **Two-tile stacks** — a tall tile carrying only the numeral at ~200px, a second tile beneath with
  name and copy; steps assemble diagonally, each offset down-right, colour-coded per step.
- **Sticky index rail** — pinned list of steps on the left, panels scrolling on the right, active row
  highlighting. Constructionally two-column: **needs an explicit mobile design** (rail becomes a
  horizontal chip scroller above stacked panels), not a reflow.
- Put the index numeral **inline on the title's baseline**, not floating above it, and keep it small —
  a giant ghost numeral is the generic choice.
- **Duotone-treated photography inside a numbered step card.** The highest-leverage fix for the fact
  that we don't control our clients' photography — a duotone in the brand palette makes a mediocre
  phone snap look deliberate, and makes mismatched sources look like one set. Use it anywhere real
  photos have to appear (process steps, sector cards, team).
- **Copy matters more than layout here.** The best example ran: _We Talk → You Decide → I Build → You
  Own It_, with "It starts with a conversation, not a contract" and "everything documented, nothing
  locked in". Write DCS's four steps to that standard before styling anything.

### 2.4 Pricing

- **Vertical selector list, not columns.** A list of plan rows driving one detail panel. Active row
  tinted with a filled tick; inactive rows carry an outlined circular arrow; "Most popular" inline as
  a small pill. **This is the only pricing construction verified intact at 390px** — it was never
  columns, so there is nothing to squeeze.
- **Retainer + project shape** (matches DCS's PAYG-plus-project offer): one retainer card with a
  reassurance micro-line (`24-month minimum · everything documented`), then reassurance strips
  _outside_ the cards, then a separate horizontal project card at a "from" price.
- **Objection-led tiers** — open each tier with the customer's own objection in quotes rather than a
  feature blurb.
- **Non-repeating tiers** — "Everything in X, plus:" so features never repeat.
- **Bespoke work** — no price, CTA is "Book a call"; a raised 1.5px border marks the recommended plan
  rather than inverting it to dark.
- Price typography: small superscript `$`/`£` raised above the cap-height of a large numeral, unit in
  small roman beside it. **Never `font-variant-numeric: tabular-nums` on a figure with a thousands
  comma** — see CLAUDE.md; it renders `£1,995` as `£1 , 995`.
- **One loud button only.** Filled accent on a single tier; tinted on the rest.
- **Make the price the button** — on a service card, set the from-price as the full-width pill CTA
  itself (`From £95/month →`) rather than a price above a separate "Learn more". Pre-qualifies the
  click and removes a step.
- Feature rows: give each line its **own icon** rather than a repeated tick — the cheapest way to kill
  the templated-checklist feel. Or mark bullets with a short vertical bar instead of a dot.

### 2.5 Proof and trust — replacing the stats bar

Since count-ups are banned and a static KPI band is the weakest version of this:

- **Awards / accreditation rows** — logo chip + name + discipline tags + year + `↗`, on hairlines.
  For DCS: Gas Safe, NICEIC, Checkatrade, Google Partner, ICO registration.
- **Credential cards built around the real seal artwork** rather than a generic badge.
- **Stats as a two-column table** on hairlines (`New clients ——— 15`) — because it reads as a table,
  there's no temptation to animate it.
- **Marquee of authored literals** — `15+ Years / 140+ Projects / 97%` separated by slashes, drifting.
  Motion, but every figure is DOM text, so it is always correct.
- **Testimonial carrying the client's own logo** instead of a stock headshot; **town and year** on the
  attribution (`— Sarah, Hailsham, 2025`) for local proof.
- **Spec table** — "who you're actually hiring": mono label left, value right, hairline between rows.
  Company number, registered office, years trading, coverage area, response time. Reads as a spec
  sheet, not an About paragraph.

### 2.6 Navigation and status

- **Superscript numerals that are real counts** — `Projects⁰⁷`, `Selected Works⁽¹²⁾`. Looks like the
  decorative index device, but tells you something before you click. Populate from MDX frontmatter.
- **Avatar in the CTA** — a real photograph set into the left edge of the "Book a call" control, with
  a `+` badge. Highest-leverage single component for making a small firm look staffed and reachable.
- **Status cluster** — pulsing dot + `Based in Eastbourne, UK` + local time + availability state.
  Wire the clock to `Intl.DateTimeFormat`; wire availability to a real source or make it static text.
- **Bottom-pinned floating pill nav** — thumb-reachable by construction rather than by media query.
  ⚠ **Trap:** a centred floating dock built with `transform: translateX(-50%)` and/or
  `backdrop-filter` becomes the containing block for any `position: fixed` mobile dialog nested inside
  it. Centre with `left`/`right`/`margin-inline` and portal the dialog to `document.body`. Already in
  CLAUDE.md — this pattern is exactly where it bites.
- **Persistent bottom utility bar** — `↓ See the work` / one action / `≡`. Better than a floating chat
  bubble; reusable as a seasonal offer bar.
- **Announcement strip** above the nav — one line, dismissible.

### 2.7 Section furniture — the "elevated" vocabulary

Cheap, static, and responsible for most of the perceived craft:

- **Section header bar on a hairline**: index left · label centre · meta right —
  `[01]` · `// WHAT WE DO` · `© 2026`. Repeats down the page and gives it rhythm.
- Or the two-slot version: `/ About us` hard left, `(01)` hard right, same baseline.
- **Corner metadata framing the hero** — `(©2018 – ©2026)` left, `Based in East Sussex` right. Fill
  the slot with proof copy rather than decoration.
- **Two-tone headings** — line 1 near-black, line 2 at 40% grey. Free hierarchy with no extra type
  sizes. Use the _static_ version, not the scroll-driven word-by-word fill.
- **Mono uppercase eyebrow chips** with a leading glyph. Square/bordered reads "spec sheet"; pill
  reads "product".
- **Corner-bracket / crop-mark ticks** framing a block — four absolutely-positioned pseudo-elements.
- **Diagonal-hatch placeholder tiles** for images that haven't loaded — degrades to a designed box
  rather than white space.
- Superscript ® / ™ on the wordmark, set as a real glyph at cap-height.
- **Hand-drawn marker device** — a rough ellipse or lasso scribbled around one phrase in a headline,
  or a hand-drawn badge over a photograph. Found independently on two unrelated sites in round one, so
  it is a live trend rather than one designer's tic. Cheapest high-impact device in either sweep, and
  it warms up an otherwise cold grid — but strictly once or twice per page.
- **Two dots + first-word-black section headings** (`.. what we do`) as a lighter alternative to the
  full header bar, when a section needs less ceremony.

### 2.8 Contact and lead capture

- **Photo-upload dropzone** — "send us a picture of the job". For a trade, worth more than any amount
  of form styling. For DCS: "send us your current site or a screenshot of the problem".
- **Channel tiles instead of a form** — four tiles, each icon + label + real value (phone, email,
  WhatsApp, book a call).
- **Pre-qualifying select** in the form, plus a reassurance line under the button:
  _"Free and without obligation · reply within one working day."_
- **The raw email where the CTA button usually goes** — a strong, low-cost move for a small firm.
- **Symptom checklist** — one-line pill cards each naming a problem the visitor recognises _in
  themselves_ ("your site looks fine on your laptop and broken on a phone"), not a feature you sell.

---

## PART 3 — Mobile rules

Half the original complaint. Only four sites were measured at a true 390px viewport, so treat the
rest as construction-based inference.

1. **Pricing is a vertical selector, never columns.** Verified.
2. **Per-card CTA survives stacking** — flat colour service blocks each keeping their own full-width
   `Enquire now` footer bar were verified to stack cleanly, and every service stays thumb-reachable.
3. **Abstract mocks survive; screenshots don't.** Verified side by side at 390px.
4. **Anything hover-only needs a designed tap equivalent**, authored — not a reflow.
5. **Anything constructionally two-column** (sticky rails, split screens) needs an explicit mobile
   design, not a stack.
6. **Never put display type at low opacity over a photograph** — a hero headline at ~35% white over a
   busy image was illegible at 390px, worse than on desktop.
7. Watch the `transform` / `backdrop-filter` containing-block trap on any floating nav (§2.6).

**Testing note for whoever builds this:** `resize_window` does not work in our Chrome tooling — the
screenshot tool pins a fixed viewport override and reports success while `innerWidth` stays at
desktop. To get a true 390px render, inject the page into a same-origin `<iframe width="390">` and
screenshot that. Framer-style scroll reveals do not fire on programmatic scroll, so drive motion with
real wheel events.

---

## PART 4 — Paste-ready briefs for the UX skills

Three directions worth prototyping. Each is deliberately different so the comparison is informative.
Run each through a design skill and produce a homepage prototype.

### Direction A — "Spec sheet"

> Design a homepage for DCS, a small East Sussex firm that builds and maintains websites for local
> businesses (trades, salons, garages, small professional firms). Aesthetic: engineering/blueprint
> restraint. Off-white ground, near-black type, one accent used no more than four times on the page.
> A repeating section-header bar on a hairline — index left, mono uppercase label centre, year right.
> Services as a typographic table: name at full contrast left, right-aligned stack of deliverables.
> Process as numbered rows in a four-column grid with hairlines between. Proof as an accreditation
> table, not a stats bar. A spec table giving company number, years trading, coverage area and
> response time. No cards, no shadows, no rounded corners. Motion limited to a reading-position
> highlight on the services list and a sticky section label. Content renders complete with JS
> disabled. No count-ups, no preloader.

### Direction B — "Poster"

> Design a homepage for DCS (as above). Aesthetic: agency poster. Near-black ground, heavy condensed
> grotesk display type at viewport scale, two flat accent colours plus bone. Hero is a statement line
> with project imagery interleaved in z — some cards passing in front of the letterforms, some behind
> — drifting at different scroll rates. Process as four two-tile stacks: a tall tile carrying only the
> numeral at ~200px, a second tile beneath with a plain-spoken step name and one paragraph; the four
> assemble diagonally, each offset down-right, colour-coded per step. Services as flat zero-radius
> colour blocks, each with a full-width "Enquire now" bar as its own footer. Proof as a testimonial
> with the client's own logo, town and year. No count-ups, no stats bar, no preloader. Hero must be
> complete at first paint.

### Direction C — "Quiet"

> Design a homepage for DCS (as above). Aesthetic: expensive without loud. Greyscale plus a single
> desaturated accent, enormous white space, one strong photograph doing all the visual work. Services
> as a two-column typographic table, no cards or icons. Feature panels use a tinted canvas holding an
> abstract UI mock — flat tint, grey skeleton bars, exactly one element in full colour — with the
> heading and copy sitting outside and below the panel on the page ground, no container. Pricing as a
> vertical selector list driving one detail panel. A status cluster in the nav: location, real local
> time, availability. Motion limited to an accordion for services and a scroll-spy rail for the
> process. No count-ups, no preloader, no scroll-jacking.

### Constraints to append to every direction

> Build in Next.js + Tailwind using theme tokens only — no hardcoded hex. All content renders at full
> opacity by default; animate transform from a visible state, never gate opacity above the fold, latch
> reveals with unobserve, and wrap motion in `prefers-reduced-motion: no-preference`. Ship no
> count-up animations — author every figure statically. Design the 390px layout explicitly rather than
> reflowing the desktop one; pricing must be a vertical selector, not columns. The page must be a
> complete, readable document with JavaScript disabled.

---

## Provenance

- Round 1 — Framer community **gallery**: 6 agents, ~450 tiles skimmed, 78 sites opened, 18
  shortlisted, 4 measured at 390px. Files: `findings-agency.md`, `findings-business.md`,
  `findings-saas-ai.md`, `findings-landing-page.md`, `findings-featured.md`, `findings-portfolio.md`.
- Round 2 — Framer **templates** marketplace, agency category: 5 agents, 159 templates listed, 85
  demos opened, 27 shortlisted, 12 count-ups caught on camera. Files: `findings-tpl-batch-a.md`
  through `findings-tpl-batch-e.md`.
- Known gaps: ~60 Featured-shelf templates never opened; no mobile pass in round 2; no hover/mobile-menu
  pass in either round; `findings-landing-page.md` is a summary only (its detail was lost to a blocked
  write).
