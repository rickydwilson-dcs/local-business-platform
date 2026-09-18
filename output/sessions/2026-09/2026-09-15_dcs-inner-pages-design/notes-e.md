# Phase 3 / Agent E — `/about`

**Deliverables:** `prototype/about.html`, `kit-additions-e.css` (3 declarations,
all bug fixes), this file. Plus `prototype/_harness-e.html`, the two-iframe rig
the 390px render was done in — kept because it is how the mobile result is
reproducible, and named with the `_` prefix `_chrome.html` established.

**Date:** 2026-09-17. **Nothing under `sites/dcs/` was touched.**

---

## 1. The argument the page makes, and how the structure serves it

The page has one job: make _one person_ read as the reason to hire, not the
reason to hesitate. So it never argues that a small studio is good enough. It
argues that the thing an agency cannot sell you is the thing on offer here —
**the person who answers your first email is the person who builds the site**
— and it says so in a voice that is itself the proof, because the page is
written in the first person singular by the person doing the work.

Six blocks, and each one is a move in that argument rather than a topic:

| #   | Ground  | Block                   | The move                                                                                                                                                                                                                                                                |
| --- | ------- | ----------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | ink     | breadcrumb + `.mast`    | **The claim, flat out.** h1 "You're hiring a person, not a company." The lead is the effort promise. Four static credential facts sit under it so the claim arrives already carrying evidence.                                                                          |
| 2   | white   | `.prose` in `.measure`  | **The studio, the standard, and the missing photograph.** Who/where/since. Then the London–New York claim, made qualitatively, closing on "there's exactly one honest way to check it: the page you're reading." Then the no-photograph section. Ends with a signature. |
| 3   | ink     | `.detail__l` check list | **What one person actually means**, as seven standing guarantees. This is the section that converts the risk into the offer.                                                                                                                                            |
| 4   | magenta | `.svcs` / `.svc`        | **The range.** Five sectors with real named clients, so "small businesses of any kind" is demonstrated rather than asserted. Closes on "Trades are a large and valued part of that. They are not the definition of it."                                                 |
| 5   | aqua    | `.quote--hero`          | **One client, five years in.** The longest-standing relationship is the single strongest piece of evidence that one person can carry the whole of it over time — which is exactly the doubt section 3 raises.                                                           |
| 6   | navy    | `.pagefoot`             | The close, identical to the reference page.                                                                                                                                                                                                                             |

**Ground sequence** — ink → white → ink → magenta → aqua → navy. No two
adjacent sections share a ground, the sequence alternates dark and light, aqua
appears exactly once and late, navy closes. That is design-kit.md §1.2's rule,
and the ink→magenta adjacency is the homepage's own magenta→ink boundary read
the other way round. The masthead and breadcrumb are both ink and adjacent,
exactly as `service-detail.html` composes them.

**The order is load-bearing.** The doubt ("can one person really do all of
it?") is raised by section 2's own copy, answered structurally in 3, widened in
4 so the answer isn't just true for trades, and then witnessed in 5 by someone
who has had the answer tested for five years. Moving the testimonial earlier
would make it decoration; moving the sector list later would leave the page
reading as trades-only for its first two thirds.

---

## 2. How I handled having no photograph

**By putting the absence in the page as a heading, not by filling the slot.**

Section 2 carries an h2 that says _"There's no photograph of me here."_ and one
paragraph explaining why that is the right answer rather than a gap: a headshot
tells you what I look like, which is not what you are trying to find out. That
turns the hard constraint into a line that does work for the argument, and it
is the most first-person thing on the page.

Three things I deliberately did **not** do:

- **No generated portrait, no illustrated avatar, no silhouette, no initial
  monogram standing in for a person.** Nothing anywhere on the page is
  presented as Ricky or as "our team".
- **No `.slot` "awaiting footage" box where a photo would go.** `.slot` is the
  right honesty mechanism for a project that has real footage coming; a portrait
  slot reading "no photograph" would have made the page apologise, which is the
  precise failure mode the brief warns about.
- **No client photography borrowed to fill the hole.** The reference page uses
  a real R2 photograph of Colossus's scaffolding; I could have done the same
  and did not, because on this page it would have been decoration rather than
  evidence, and Agent A owns the case-study imagery.

What sits there instead is **one `.mock`** — the design's drawn-browser device,
which exists precisely because the homepage had the same imagery problem — with
a caption that states what it is: _"A drawing, not a screenshot. Every graphic
on this page is drawn in the browser — there is no photograph anywhere on it,
of me or of anything else."_

**That caption is a verifiable claim and I verified it rather than assuming
it.** Measured in the rendered page at both widths: `img` elements **0**,
`video` elements **0**. The only graphics are the inline SVG logo, the inline
SVG arrow/check icons, and the CSS-drawn `.mock`.

---

## 3. Where I drew the line against the homepage's steps section

`steps-section.tsx` / `.steps` owns **the sequence of a project**: a
conversation, then it gets written and designed, then you review, then it goes
live and is kept running. Four numbered stages, in time order.

`/about` never restates that, and specifically:

- **Nothing on this page is numbered, and nothing is in time order.** Section
  3's seven items are a _check list_, not a _step list_ — `.detail__l`, the
  design's "included / confirmed" idiom, not `.step`/`.step__k`. That choice is
  the line, made visible: a reader who has seen the homepage recognises the
  ticks as "what you get" and the numerals as "what happens when".
- **Two of the seven items are adjacent to steps and are phrased as standing
  conditions rather than stages.** "You don't need a brief. It gets drawn out of
  a conversation instead" is about _what is never asked of you_ (content-brief
  `:95`), not about stage one. "The words are handled" (`:96`) is the same move.
  Both are answers to "what will this cost me in effort", which is the page's
  question; neither tells you what happens first.
- **No timeline, no "how it works", no duration.** The page carries no build
  time, no stage count and no "within 2–3 weeks" — all of which belong to the
  service pages and the homepage.

The division I worked to: **the homepage steps answer _what happens_; `/about`
answers _who it happens with, and why that is the good version_.**

---

## 4. Every factual claim, with its source line

`content-brief.md` = `output/sessions/2026-08/2026-08-17_dcs-homepage-redesign/content-brief.md`.

| Claim on the page                                                                                                                                                                                                       | Source                                                                                                               |
| ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------- |
| "Digital Consulting Services is a website design and build studio in Polegate, East Sussex"                                                                                                                             | `:16`                                                                                                                |
| "I started it in 2019 and I still run it"                                                                                                                                                                               | `:17` (founded 2019, run by Ricky Wilson)                                                                            |
| "The address is local; the client list isn't — the work goes out across the UK"                                                                                                                                         | `:16` (working UK-wide) + `:205-207` (local presence as reassurance, not a limit; the client base is national)       |
| The masthead lead — no brief, no copy, no images; I ask the questions, write the content, make the design decisions, build, host, keep running                                                                          | `:87-89`, converted plural→singular per `session.md:222`                                                             |
| "meant to stand next to what comes out of a London or New York studio — not 'good for a small studio', genuinely comparable — for a fraction of the cost and a tiny fraction of your effort"                            | `:59-67`, all three parts                                                                                            |
| "there's exactly one honest way to check it: the page you're reading"                                                                                                                                                   | `:69-72` ("the site is the proof of the first claim")                                                                |
| "Nothing is outsourced and nothing is offshored"                                                                                                                                                                        | `:93`                                                                                                                |
| "still the one who picks up when you want a service page added two years later"                                                                                                                                         | `:100` (an ongoing relationship — a managed service, not a hand-off)                                                 |
| "**2019** / Studio founded", "**20+** / Sites delivered", "**5+ years** / With the longest-standing client", "**In-house** / Design, build, hosting, support"                                                           | `:202-203`, the credentials line, in substance verbatim                                                              |
| "If the site you have makes you wince slightly… you've been meaning to sort it out for about two years"                                                                                                                 | `:49-50` ("either has no site, or one they are quietly embarrassed by"; "has been putting it off — often for years") |
| Check item 1 — hiring a person, not a company                                                                                                                                                                           | `:93`                                                                                                                |
| Check item 2 — agency standard: considered design, copy that reads well, fast and secure builds                                                                                                                         | `:94`                                                                                                                |
| Check item 3 — no brief; drawn out of a conversation                                                                                                                                                                    | `:95`                                                                                                                |
| Check item 4 — the words are handled                                                                                                                                                                                    | `:96`                                                                                                                |
| Check item 5 — no CMS, no dashboard, no login                                                                                                                                                                           | `:97`                                                                                                                |
| Check item 6 — setup plus a low monthly covering hosting, security, updates, support                                                                                                                                    | `:98-99`                                                                                                             |
| Check item 7 — a managed service, not a hand-off                                                                                                                                                                        | `:100`                                                                                                               |
| "Owner-run, usually somewhere between one and twenty people, where the person making the decision is the person paying the invoice"                                                                                     | `:29-30`                                                                                                             |
| "Time-poor. Not technical, and with no wish to become technical. Willing to pay properly… wanting to look as credible online as they already are in person"                                                             | `:47-53`                                                                                                             |
| The five sector rows and their descriptors                                                                                                                                                                              | `:34-38`                                                                                                             |
| Named clients: Cuddle Plush Fabrics, Luna Landings, Sanctuary Ida, Nicola Noble Tuition, Colossus Scaffolding, DJ Fox Electrical, DCH Automotive, Bexhill Removals, Mad Graphics ("signage and print… rebuilt in full") | `:190-200`, the portfolio table — **only** clients named there are named here                                        |
| "Trades are a large and valued part of that. They are not the definition of it."                                                                                                                                        | `:5-6`                                                                                                               |
| The testimonial and its attribution                                                                                                                                                                                     | `:211-212`, verbatim                                                                                                 |
| Service areas in the footer link map                                                                                                                                                                                    | `:205`                                                                                                               |
| Email address                                                                                                                                                                                                           | `:20`                                                                                                                |

### What I deliberately did NOT claim

- **No competitor figure of any kind.** `:74-78` forbids inventing one, and
  there is no sourced number. The London/New York comparison is made
  qualitatively and the only numbers on the page are DCS's own.
- **No "we may be small" opening, and no small-and-proud framing anywhere.**
  `:80-83` makes that context for Ricky, not a line for the page.
- **No tech stack named.** `:116`. Nothing on the page mentions a framework, a
  platform or a CMS by name — "No CMS, no dashboard" is a promise about the
  client's experience, not a product reference.
- **No prices.** There is not a single currency figure on the page, so the
  comma trap (design-kit.md §9.1) has no surface here at all. Verified anyway:
  **0 comma'd figures and 0 elements resolving to `tabular-nums` or a
  monospaced family** in the rendered page, at both widths.
- **No count-ups.** Every figure is authored static in the markup. There is no
  animation JS on this page beyond the three chrome behaviours copied from the
  reference page.
- **No sector attributed to a client that content-brief doesn't name.** The
  "Professional and property" row is described (`:36`) and left unattributed,
  even though `sites/dcs/content/projects/silvero-homes.mdx` would have
  supported it — content-brief is the source of truth I was given, and it does
  not name that client.

### One factual conflict I found and did NOT resolve myself

**The phone number.** `content-brief.md:19` says `07395 063764`.
`sites/dcs/site.config.ts:171` says `+44 7748 148082`, and the approved Phase 2
chrome (`service-detail.html:71,296,346`) uses `07748 148082`. I used the
chrome's number so that five pages built in parallel do not disagree with each
other, and I am flagging it rather than picking a winner: **one of these is
wrong on a real business's live site, and it is not a design decision.** Needs
Ricky, before Phase 5.

---

## 5. Reuse versus invention

### Invented: nothing in the design

Every component, every type size, every colour, every spacing value on this
page comes from `kit.css`. The page uses: `.bar` + `.mark` + `.burger` + `.hire`

- `.bar nav` + `[aria-current]`, `.menu` / `.menu__nav` / `.menu__foot`,
  `.crumb`, `.mast` / `.mast__meta`, `.plate`, `.eyeless`, `h1`, `h2`, `.lead`,
  `.hero__act`, `.btn`, `.btn--ghost`, `.res`, `.sec`, `.measure`, `.prose`
  (paragraphs, h2, inline links, figure, figcaption), `.slot__well`, `.mock` and
  its parts, `.detail__l`, `.svcs` / `.svc` / `.svc__n` / `.svc__d`,
  `.quote--hero`, `.quote__a`, `.pagefoot`, `.end__main`, `.end__foot`, `.big`,
  `.footmap`.

The only page-local CSS is **two inline `margin-top:clamp(28px,4vh,44px)`
declarations** on closing paragraphs. That clamp is `kit.css:860`'s own
`.filterbar` value — the design's standard "distance to a following block" —
not a new number, and `service-detail.html:222` set the same kind of inline
margin from an existing clamp, so the precedent is the reference page's.

### Three CSS declarations added, and all three are bug fixes

They are in `kit-additions-e.css`, not `kit.css`, and all three repair `.mock`,
which **has zero instances on the live homepage** (design-kit.md §6.2 measures
it) — so `/about` is the first page anywhere to render it, and rendering it is
what found them. They belong in `kit.css` §11 at reconciliation. Details and
measurements are in §6 below and in the file's own comments.

### One composition decided by rendering, because there was nothing to copy

design-kit.md §6.1 describes `.mock` as _"skeleton bars at 45/60/70/80% width,
a 3×3 cell grid, and exactly one live element"_. That arrangement **cannot
fit**: every `.mock` part is sized in percent of the canvas except
`.mock__cell`, which is `aspect-ratio:1`, so a 3×3 grid inside a 678px-wide
well is 555px tall on its own while a 16/10 well is 424px. Measured: the
canonical composition overflowed by ~93px at 1440 and `.slot__well`'s
`overflow:hidden` clipped the live pill away entirely.

What I used instead: browser dots, two skeleton bars, the live pill, then **one**
grid row — with the pill placed _above_ the row so that anything cut is the
bottom of a content band, which reads as a page continuing below the browser
fold rather than as a clipped element. Measured fitting at both widths.

### Coordination with the other agents

- **Testimonials.** Per D3, Agent A places the three in
  `sites/dcs/content/testimonials/`. I used **none of them**. The quote here is
  `content-brief.md:211-212` — Sarah, Cuddle Plush Fabrics — which is not in
  that folder, so nothing is duplicated. It is also the only one of the four
  that speaks to _longevity under one person_, which is this page's argument.
- **Quote size.** I took `.quote--hero`, not `.quote`. The two sizes exist for
  exactly this split (design-kit.md §11.2): `.quote` for a testimonial sitting
  inside another page's content, which is Agent A's case; `.quote--hero` for a
  panel of its own, which is this one.
- **`.mock`.** If any other agent renders it, they will hit the same two bugs.
  The fixes are in my additions file.
- **The footer's Services column** is the chrome's list verbatim (matching
  `site.config.ts`), which does **not** match `content-brief.md:118-135`'s
  restructured six. I did not diverge, because the footer is shared across five
  pages. Phase 4/5 issue, flagged not fixed.

---

## 6. Bugs found by rendering

Five. Three are in the kit and would have shipped; two are mine.

1. **`.mock__bar` renders at ZERO HEIGHT — kit bug.** `home-r9.css:238` sets
   `height:5.5%` and `.mock` is `display:grid`. A percentage block-size on a
   grid item resolves against its grid area, and an implicit auto row is
   indefinite, so the percentage is treated as auto and an empty `<div>`
   computes to **0px**. Measured before the fix: both bars `height: 0px` at
   1440 and at 390. Half the drawing was simply absent, with no error and
   nothing in the console. Fixed by `container-type:size` on `.mock` (safe: it
   is `position:absolute;inset:0`, so its size never depended on its contents)
   plus `height:5.5cqh` — the stylesheet's own number, resolved against the
   thing it was always meant to resolve against. Measured after: **15px** in a
   424px well, **8px** in a 213px one.
2. **`.mock__live` stretches to full canvas width — kit bug.**
   `home-r9.css:240-242` describes a pill (`inline-flex`, `border-radius:100px`,
   `white-space:nowrap`) and sets `align-self:start` — but `align-self` is the
   _block_ axis in grid; the inline axis is `justify-self`, unset and therefore
   `stretch`. Measured before: the pill rendered **523px wide** inside a 556px
   canvas at 1440, and 263px at 390 — a band, not a badge. Fixed with
   `justify-self:start`. The source rule reads as if it were written against a
   flex column.
3. **The canonical `.mock` composition does not fit any wide well — kit bug.**
   §5 above. Not fixed in CSS (the cell grid's square aspect ratio is the
   design, and it is right); recorded so the next page to use `.mock` doesn't
   rediscover it.
4. **`.plate` detaches following punctuation — mine.** `.plate` carries
   `margin-right:.06em` (`home-r9.css:118`) for breathing room after the block,
   so `<span class="plate">a person</span>,` rendered as **"a person , not a
   company"** at both widths. The homepage never hits it because its plated word
   ends a phrase. Fixed by taking the comma inside the plate. Worth knowing for
   any page that plates a word mid-sentence.
5. **The closing line in the ink section ragged badly — mine.** `.lead`'s 56ch
   measure inside a 74ch column broke "nobody to be passed / to." across lines.
   Rewritten rather than restyled.

### Two pre-existing findings that are not mine to fix

- **`.menu__nav` links are 34px tall at 390px, under the mobile layer's own
  44px touch floor.** `clamp(2.1rem,7vw,5.4rem)` floors at 33.6px font-size and
  `line-height:1.02` gives a 34px box; the gap between links is
  `clamp(2px,.6vh,8px)`, so the effective target does not reach 44. This is the
  approved chrome and is identical on all five wave-1 pages, so fixing it
  unilaterally would put my page out of step. **Phase 4 decision.**
- **`document.hidden` is `true` for the whole of any automated interaction**,
  so `requestAnimationFrame` and `IntersectionObserver` are throttled while the
  tools run — the same limit Phase 2 recorded. Screenshots taken immediately
  after a scroll therefore show the `.bar` mid-crossfade (0.55s) and `.res`
  mid-resolve (1s), which reads as "the behaviour is broken" and is not.
  Verified by reading state instead of looking: after a real scroll into the
  white section the bar reported `data-ground="white"` with the active-nav
  underline swapped to magenta, the first `.sec` carried `.in`, and the prose
  h2 computed to `rgb(14,14,18)` — resolved.

---

## 7. What I rendered, at what width, and how

`resize_window` is a no-op in this browser, as Phases 1 and 2 both found. So
`prototype/_harness-e.html` holds two iframes — one 1440 × 900 (scaled 0.46 for
capture only; a CSS transform on the iframe _element_ does not affect
coordinates inside the iframe _document_, so every measurement below is a true
1440px value) and one 390 × 844. **Width media queries respond to the iframe's
own width**, so both layouts were genuinely exercised. The page was also opened
at the top level and scrolled with real scroll events, which is the only place
the rAF/IO behaviour can be confirmed.

| Width                       | What was checked                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         |
| --------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **1440 × 900**              | `matchMedia('(max-height:1040px)')` **matches** — so the compressed scale is what I designed against, confirmed by measurement, not assumed: prose h2 **38.4px**, `.svc__n` under the compressed clamp, `.cards`-family rhythm collapsed. h1 **100.8px** / ls −3.83 / two lines / 210px tall. Bar **75px**. `.measure` **678px**. Every section rendered and read: masthead + meta row, prose, the `.mock` figure, the ink check list, the magenta sector list, the aqua quote panel, the navy footer with its four-column link map. `.sec` corner reveal correct at all five boundaries. `documentElement.scrollWidth` **1431** against 1440 — no overflow, **0** overflowing elements. |
| **390 × 844**               | The whole authored mobile layer. `.bar nav` hidden, `.burger` shown, `.mark__type` hidden, bar **65px**. Breadcrumb padding-top **84px**. h1 **36.8px**. Prose **16.5px**, `.lead` **16px**, `.detail__l` **16px** — all above the 16px prose floor. `.svc` one column with `.svc__d` left-aligned. `.footmap` two columns. `.big` as full-width rows with chevrons. `scrollWidth` **381** against 390 — **0** overflowing elements, so the footer-email overflow Phase 2 fixed has not come back.                                                                                                                                                                                       |
| **390 × 844, overlay open** | The `fixed inset-0` containing-block trap, tested by measurement per design-kit.md §9.5 rather than by reading: the opened `.menu` reports **390 × 844**, the full viewport, not the bar's box. Walked the bar's ancestor chain in the live DOM: **zero** elements carrying `backdrop-filter` or `transform`. The current-page link resolves to `rgb(0,210,216)` — aqua.                                                                                                                                                                                                                                                                                                                 |
| **1680 × 714, top level**   | Real scroll events. The `.bar` ground probe fires and swaps ink → white with the active-nav underline going magenta; `.in` latches; `.res` resolves to full `currentColor`.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              |

Content audits run against the rendered DOM at both widths: **0 `img`, 0
`video`** (the no-photograph claim, verified rather than asserted); **0 comma'd
figures**; **0 elements resolving to `tabular-nums` or a mono family**; heading
order h1 → h2 × 5 with no skipped level; `lang="en-GB"`; four `[aria-current]`
(bar nav, menu nav, breadcrumb, footer map). The only first-person-plural token
anywhere in the page text is "our", inside the client's own quoted words —
which is correct, because Sarah is speaking there, not DCS.

---

## 8. What I could NOT verify

- **`lvh` vs `svh`.** All four viewport units resolve identically in a desktop
  browser and in an iframe. **Nothing on this page sets a viewport height at
  all** — no `100lvh`, no `100svh`, no `vh`-only height — so there is nothing
  here to get wrong, but I cannot demonstrate that. Construction rule, applied.
- **`@media (hover:none)`.** Not exercised. I added no new hover effect, so
  `kit.css` §24 and §35 already cover every hover on the page — but that is by
  reading, not by tapping.
- **`prefers-reduced-motion`.** Not exercised.
- **`env(safe-area-inset-*)`.** Resolves to `0px` in this environment. Notch
  behaviour is unverifiable without a real device.
- **`.res` rest-colour contrast was read, not measured with a contrast tool.**
  This page puts `.res` on white (`--grey` `#70707B`, ≈4.9:1 by calculation),
  on ink (`rgba(255,255,255,.72)`), on magenta (same), on aqua
  (`rgba(14,14,18,.66)`) and on navy (same white). design-kit.md §9.12 makes the
  unaided rest colour an accessibility obligation because a headless render
  catches the heading before the observer fires — so somebody should put a real
  contrast tool on the aqua and magenta cases before port. All are kit values,
  unchanged by me.
- **`container-type:size` browser support was not surveyed.** It rendered
  correctly in the Chrome used here; it is widely supported, but I did not check
  a support table, and if Phase 4 wants a fallback the honest one is a fixed
  `min-height` on `.mock__bar`.
- **The `.mock` figure was not reviewed by Ricky.** It is the one element on the
  page that is a judgement call rather than a derivation, and it is the easiest
  thing to cut: deleting the `<figure>` leaves the page intact.
- **Nothing was built or type-checked.** Static prototype; `sites/dcs/` is
  untouched.

---

## 9. For Phase 4

1. **Fold `kit-additions-e.css`'s three declarations into `kit.css` §11.** They
   are fixes to `.mock`, not page styling, and any other page that uses the
   device needs them.
2. **The phone-number conflict** (§4) needs Ricky, not a merge decision.
3. **The `.menu__nav` 34px touch target at 390px** (§6) is chrome-wide.
4. **The footer Services column** does not match `content-brief.md:118-135`'s
   restructured six services; it matches `site.config.ts`. One of them has to
   move, and it affects every page.
5. **Phase 2's masthead-is-loud flag still stands and is worse here**: at
   1440 × 900 the breadcrumb plus masthead measures **732px of a 900px
   viewport**. I did not act on it because it is chrome and would desynchronise
   the five pages — but `/about`'s masthead is the one with the shortest lead
   and the most meta items, so if a `max-height:1040px` compression for
   `.mast h1` is ever added, this is the page to check it against.
