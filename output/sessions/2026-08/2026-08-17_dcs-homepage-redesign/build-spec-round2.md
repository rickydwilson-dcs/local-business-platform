# Round 2 — Elevated directions (20–25)

Addendum to `build-spec.md`. **Everything in that file still applies**: one self-contained
HTML file, full page, working header and mobile nav, responsive at 1440/1024/768/390,
semantic landmarks, AA body contrast, motion with `prefers-reduced-motion` handling, no
placeholders, roughly 600–1200+ lines.

**Read `content-brief.md` — it was rewritten as v2 and the changes are the whole point of
this round.**

---

## 1. Why this round exists

Round 1 produced nineteen directions. The client's response, verbatim in substance:

> Whilst trades are an essential part of what we do, we build websites for anybody. We need
> a more generic positioning. I also want the site to feel elevated like a design agency,
> not the black and yellow under-construction type feel.

Both halves matter and both are hard constraints here.

### 1a. Broader positioning

DCS builds websites for **small businesses of any kind** — retail and eCommerce, studios and
practitioners, professional and property services, creative and B2B, _and_ trades.

Round 1 briefs led with tradespeople and the directions followed: a plumber under the sink
in the hero, "who it's for" lists of trades, a scaffolder as the closing image. **Do not do
that.** Where you show sectors or clients, show the range — a fabric shop, a yoga studio and
a scaffolder together. Trades are one strong example among several, never the frame.

The three real testimonials are all non-trade businesses (fabrics, tuition, yoga). Let them
carry the width of the client base.

### 1b. Elevated register

Target: **an elevated design studio.** The page should look like it was made by someone
whose taste the reader would pay to borrow.

**Ruled out, explicitly:**

- Hi-vis yellow and black, hazard tape, chevrons, stencil type, any under-construction
  signalling.
- Site-notice, job-sheet, docket, work-order, invoice, scaffold-board, tool-case,
  merchant-counter and road-sign metaphors. Round 1 produced **six** of these and they are
  the specific thing being rejected.
- Anything that reads as a building site, a trade counter, or industrial safety signage.
- The opposite failure too: centred hero + subhead + two pill buttons + three equal icon
  cards, purple-to-blue gradient on white, Inter at default weights.

**Aim at:** restraint, generous space, real typographic craft, a confident and unusual
colour position, considered motion, detail that rewards a second look. Brand studio,
architecture practice, quiet luxury, editorial.

Bold and saturated colour is welcome — the objection is to _industrial safety_ palettes and
construction signifiers, not to colour or confidence. An elevated page can be dark, vivid or
dense. It just cannot look like a hoarding.

## 2. Do not rebuild an existing direction

Nineteen already exist in `prototype/`. Yours must not be a recolour of one. The strongest
survivors, which are therefore the ones to stay clear of:

| Existing            | Occupies                                                                     |
| ------------------- | ---------------------------------------------------------------------------- |
| 01 Studio Editorial | Warm paper, Fraunces, editorial-journal grid, portfolio as hairline index    |
| 02 Bento Signal     | Near-black bento grid, lime accent, miniature UI in tiles                    |
| 04 Quiet Confidence | Warm monochrome, completely flat, calm and conversational                    |
| 07 Glass Atelier    | Midnight aurora, frosted glass panels with real physics                      |
| 08 Ledger           | Proof-led, hand-authored SVG charts, financial-product restraint             |
| 11 One Person       | Letterpress paper, first-person letter, drawn ink signature                  |
| 12 Showroom         | Dark gallery, device frames, live trade selector                             |
| 18 Two Inks         | Two-ink ivy/cerise letterpress, Bodoni + Spectral, all-serif, no photography |

If you land near one of these, push elsewhere. You may read them to see what is taken —
`grep` the palettes and font links rather than reading them end to end.

## 3. Imagery

A **sector-spanning image set** was generated for this round, catalogued in
`assets/img/MANIFEST-round2.md`. Read it before writing markup.

- **Use the `web/` JPEGs** (`assets/img/web/<name>.jpg`, 1600px, 100–600KB). Never the root
  PNGs — they are 2048px and 3–7MB, and an SVG filter over one froze a renderer for 45
  seconds in round 1.
- Verify what exists with `ls assets/img/web/` before referencing anything.
- The round 1 trade images (`trade-electrician`, `trade-plumber`, `trade-scaffolder`,
  `trade-van`, `phone-on-site`, `tools-flatlay`) still exist and may be used — **but only as
  one sector among several**, never as the hero framing or the only sector shown.
- A direction that uses no photography at all is legitimate and may well be the strongest;
  Two Inks proved it. Say so if you choose it.

**Honesty rules, unchanged and non-negotiable:**

1. Never caption a generated image as a real named client's premises, shop, studio, van or
   team. That fabricates a record about a real business. Portfolio entries stay CSS-drawn
   site mocks, outcome text, or typography.
2. No image may be presented as Ricky Wilson, "our team", or "the person who builds your
   site". There is no photograph of him. This binds on any image containing a person.
3. Every `<img>` needs real `alt` text, `width`/`height` matching the actual file, and
   `loading="lazy"` below the fold.

## 4. The six directions

| #   | File                           | Skills                                            | Direction                                                                                                                                            |
| --- | ------------------------------ | ------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------- |
| 20  | `home-20-atelier.html`         | `impeccable`                                      | **Free choice.** Run impeccable's full process including the concept seed against the _revised_ PRODUCT.md, and build what it assigns. The wildcard. |
| 21  | `home-21-the-range.html`       | `ui-ux-pro-max`, `ui-styling`                     | **Range as the argument.** Breadth of client base is the pitch — a gallery where a fabric shop, a yoga studio and a contractor sit as equals.        |
| 22  | `home-22-quiet-authority.html` | `minimalist-ui`, `high-end-visual-design`         | **Assured restraint.** Spacious, exact, unhurried. More authoritative and less cosy than 04.                                                         |
| 23  | `home-23-colour-field.html`    | `ui-ux-pro-max`, `high-end-visual-design`         | **Elevated through colour.** Large saturated planes. Proves elevated does not mean beige.                                                            |
| 24  | `home-24-serif-modern.html`    | `high-end-visual-design`                          | **Contemporary luxury.** A fashion-house or brand-studio register — not 01's warm editorial journal.                                                 |
| 25  | `home-25-motion-studio.html`   | `design-taste-frontend`, `impeccable` (`animate`) | **Motion as craft.** Precise, restrained, expensive-feeling movement. Not spectacle.                                                                 |

Detail per direction comes in your individual brief.

## 5. Impeccable notes (directions 20 and 25)

- Invoke via the Skill tool. Load `reference/craft-floor.md` before editing UI.
- Run its scripts by real path: `node ~/.claude/skills/impeccable/scripts/…`. If you get
  silence and exit 0, something is wrong — report it.
- Its detector writes findings to **stderr**; `2>/dev/null` will show you a false zero. Its
  npm deps are now installed, so it evaluates computed contrast properly.
- `PRODUCT.md` exists in the session folder and **has been revised** for the broader
  positioning. `concept-seed.mjs` needs it and needs that directory as cwd.
- Do **not** write `DESIGN.md`, surface briefs, config or hooks. Do not modify `PRODUCT.md`.
  Do not run `impeccable hooks` or `impeccable doctor`.

## 6. Verify by rendering

Every round 1 direction that rendered its own file found 4–8 real bugs that reading missed —
a masked headline left permanently invisible, a page that rendered blank from a specificity
error, 1.26:1 contrast. Render yours.

Chrome headless on macOS clamps window width to ~500px, so a 390px screenshot is really a
clipped 500px render. Use a 390-wide iframe harness and measure `scrollWidth`.

**If you animate any number, author the true value in the markup and guarantee it lands
there.** Four directions in round 1 shipped counters that could display a false price or
stat — one published "0 Sites delivered", another froze at £60 instead of £995.

## 7. Report back

Filename · direction name · one-line pitch · palette hex · fonts · signature motion · which
images you used and why (or why none) · which playbooks or skill guidance actually changed a
decision, being honest where something changed nothing.
