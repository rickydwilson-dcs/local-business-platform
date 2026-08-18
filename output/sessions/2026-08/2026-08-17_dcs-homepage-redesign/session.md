# DCS Homepage Redesign — 45 HTML directions across five briefs

**Status:** Rounds 1–5 — Ultra (33) chosen, bar reworked to counterpoint in 3 variants
**Started:** 2026-08-17
**Branch:** `develop`
**Site:** `sites/dcs` (Digital Consulting Services — digitalconsultingservices.co.uk)

---

## Goal

Restart the DCS site redesign using the same process that worked for NP Racing: build and
iterate on **static HTML prototypes** until a direction is agreed, and only then rebuild it
properly in React inside `sites/dcs`.

Round 1 covers the **homepage only** — twelve directions, so the range is genuinely wide
rather than twelve variations on one idea.

## Why prototypes first

The April 2026 DCS attempts (`2026-04-08_dcs-redesign` → `2026-04-12_dcs-parity`) went
straight into React and produced a site that works but doesn't sell. Static HTML lets each
direction be pushed to an extreme cheaply, judged visually side by side, and thrown away
without cost. NP Racing proved the loop: four HTML homepage options → client picked one →
`sites/npracing-v1` built from it.

## Constraints given to every direction

Full detail in `build-spec.md`. Summary:

- One self-contained HTML file, opened from `file://`. Inline CSS and JS, no build step.
- **No photography.** There is no image library for DCS, so every visual is drawn in CSS,
  SVG or canvas. Mock browser frames containing miniature CSS-drawn websites are the main
  device for showing portfolio work.
- Google Fonts allowed. Motion libraries via CDN allowed only with graceful degradation.
- Full page: working header with mobile nav, every section written out, real footer.
- Responsive at 1440 / 1024 / 768 / 390. Semantic landmarks, AA body contrast, visible focus.
- Motion is part of the design, not a garnish — scroll reveals plus one signature moment per
  direction, all neutralised under `prefers-reduced-motion`. These directions get rebuilt
  with a real motion library later, so the motion intent needs to be visible now.
- Colour, type, layout, section order and section invention are entirely free. Platform theme
  tokens and the current DCS site are explicitly ignored.

## Content

`content-brief.md` holds the shared, accurate content every direction uses: positioning,
the seven differentiators, tone of voice (and banned phrases), six services, both pricing
options with real figures, nine real portfolio clients with real outcomes, three verbatim
testimonials, the four-step process, nav and CTAs.

The rule: design changes between directions, **facts do not**. Prices, client names and
testimonials must match the brief exactly.

## The twelve directions

| #   | Direction        | Skill(s) driving it                            | The idea                                                |
| --- | ---------------- | ---------------------------------------------- | ------------------------------------------------------- |
| 01  | Studio Editorial | `high-end-visual-design`, `ui-ux-pro-max`      | Paper ground, huge serif, editorial grid, restraint     |
| 02  | Bento Signal     | `ui-ux-pro-max`, `design-taste-frontend`       | Dark bento grid, miniature UI tiles, pointer glow       |
| 03  | Blueprint        | `industrial-brutalist-ui`                      | Swiss print × technical drawing, spec tables, rate card |
| 04  | Quiet Confidence | `minimalist-ui`, `high-end-visual-design`      | Warm monochrome, flat, calm, conversational             |
| 05  | Kinetic          | `design-taste-frontend`, `ui-ux-pro-max`       | Motion-led; scroll-pinned process, horizontal portfolio |
| 06  | Trade Ticket     | `ui-ux-pro-max`, `brand`                       | Hi-vis job sheet; work order, quotation docket          |
| 07  | Glass Atelier    | `ui-ux-pro-max`, `ui-styling`                  | Aurora + frosted glass with correct physics             |
| 08  | Ledger           | `dataviz`, `ui-ux-pro-max`                     | Proof-led; hand-authored SVG charts of real outcomes    |
| 09  | Nightshift       | `stitch-design-taste`, `design-taste-frontend` | Asymmetric near-black with perpetual micro-motion       |
| 10  | Workshop         | `ui-ux-pro-max`, `content-creator`             | Warm soft-depth; answers the real objections            |
| 11  | One Person       | `high-end-visual-design`, `ricky-voice`        | First-person letter; letterpress, drawn signature       |
| 12  | Showroom         | `ui-ux-pro-max`, `ui-styling`                  | Work-first; device frames + live trade selector         |

Each was built by a separate agent running its assigned skills, from the same two documents.

## The library page

`prototype/index.html` links all twelve. It renders **live scaled `<iframe>` previews**
rather than screenshots, so it never goes stale as prototypes are revised — no thumbnail
pipeline to re-run. It also carries filters (light / dark / bold / calm / motion-led),
palette swatches, and a short "how to review" note.

## How to view

```bash
open output/sessions/2026-08/2026-08-17_dcs-homepage-redesign/prototype/index.html
```

## Decisions

- **HTML prototypes before React**, mirroring NP Racing. Nothing in `sites/dcs` is touched
  in round 1.
- **Twelve, not four.** DCS is the agency's own shop window; the range matters more here
  than it did for a race team with a fixed brand.
- **No photography, everything drawn in code.** Turns the missing asset library from a
  blocker into a constraint, and everything produced translates directly to React.
- **Live iframe previews on the library page** instead of screenshots — self-updating.
- **Motion designed in now**, in CSS/vanilla JS with intent annotated, so the eventual
  Framer Motion / GSAP rebuild has something to translate rather than invent.

## Next

1. Review all twelve; shortlist two or three.
2. Round 2: push the shortlist further — deeper motion, mobile pass, inner-page treatments
   (Services, Pricing, Portfolio, About, Contact) for the leading direction.
3. Only then rebuild the winner in `sites/dcs` as React + theme tokens.

## Round 1b — the impeccable six (13–18)

Added 2026-08-17 after round 1. Ricky asked for the [`impeccable`](https://impeccable.style/)
skill ([pbakaus/impeccable](https://github.com/pbakaus/impeccable)) to be installed and six
more directions built with it.

**Install.** Used the repo's prebuilt `.claude/skills/impeccable/` (placeholders already
resolved) copied to `~/.agents/skills/impeccable` and symlinked from `~/.claude/skills/`,
matching how the other design skills on this machine are wired. v4.1.1, Apache-2.0, 148
files, 36 reference playbooks. Its four bundled agents were installed to `~/.claude/agents/`.

Deliberately **not** installed: impeccable's shipped `settings.json`, which registers
`PostToolUse` and `Stop` hooks running its detector after every Edit/Write. Enabling that
changes harness behaviour across all projects, which the global rules say not to do as a
side effect of another task. Available to turn on if wanted.

Chose the prebuilt folder over `npx impeccable install` because the installer auto-detects
and writes into several tool folders (`.claude`, `.cursor`, `.github`, `.grok`) and can
enable the hook.

**What differs from 01–12.** These six get an impeccable command emphasis and a strategic
angle but **no prescribed art direction** — the skill picks its own visual world. That makes
the round a test of the skill itself, comparable against twelve human-directed briefs.
Each brief also names which existing directions not to re-tread.

**Imagery.** Round 1b has real photography, unlike round 1. Twelve 2K images generated with
Higgsfield (GPT Image 2), 84 credits, catalogued in `prototype/assets/img/MANIFEST.md`:
four trade-context shots, two face-free craft frames, a phone-on-site, a tools flat-lay, the
South Downs coast, and three textures.

Two honesty constraints are written into the manifest and every brief, because generated
imagery on a real business's site can misrepresent:

1. No generated image may be captioned as a real named client's premises, van, job or team —
   that fabricates a record about a real business. Portfolio entries stay CSS-drawn mocks.
2. No image may be presented as Ricky, "our team", or "the person who builds your site".
   There is no photograph of him. This binds hardest on `workspace-desk.png`, which shows a
   long-haired woman from behind — face-free is not the same as safe to imply.

## Round 5 — Ultra + counterpoint bar (43–45)

Ricky's choice: _"I like ultra, the adaptive bar but I like how it works on Flare where it
adapts to a contrasting colour from the section."_

**The mechanical difference, established by reading both files rather than assuming.**
Direction 33 (Ultra) sets each section's `data-ground-src` to **its own ground** — paper
section, paper bar — so the bar camouflages into what it sits over. Direction 35 (Flare)
authors an explicit `data-nav` that **counterpoints** the section: chromatic bar over dark
sections, ink bar over light ones, paper bar over graphite. The bar is always a visible band.

Ultra already defines all seven ground tokens (paper, bone, ink, graphite, ultra, plum,
acid) with correct foreground, rule and accent for each, so the mechanism supports any
mapping. The change is purely which ground each section hands the bar — a surgical delta, so
the three variants are byte-identical to 33 apart from fourteen attribute values.

| #   | Rhythm            | Bar behaviour                                                                               |
| --- | ----------------- | ------------------------------------------------------------------------------------------- |
| 43  | Counterpoint      | Flare's rhythm transposed — ultra and plum over lights, paper over darks, ink over the hero |
| 44  | Acid counterpoint | Acid becomes the bar itself over light sections; purple carries the darks                   |
| 45  | Tonal flip        | No chromatics in the bar at all — ink over every light, paper over every dark               |

**Constraint respected:** Ultra's own rule is that acid never occupies a field larger than
~48px on a dark ground, which is what keeps it clear of hi-vis. A full-width acid bar over a
near-black section would be exactly that composition, so in 44 the acid bar only ever appears
over paper and bone.

### A methodology note worth keeping

Verifying the bar by `getComputedStyle` produced consistently wrong readings — the property
resolved correctly (`--bar-bg: #101014`) while `backgroundColor` reported the previous
colour, and `data-ground` appeared stuck. I spent a long chain of tool calls hunting a
non-existent CSS override before taking a screenshot, which showed the bar working correctly
in one step: ink over the paper hero, bright purple over the paper services section.

This is the second time in the project that computed-style probing produced a false alarm
(the first being the grayscale/luminosity "flat image" scare). **For anything that resolves
through transitions, custom properties or scroll-driven state, screenshot first and measure
second.**

### Revision 4 — accent placement and tertiary options

Ricky: _"the purple accent on poster is ok but are there other options? I dont like the light
pink in the Selected work. The cyan may work better there. I also think the cta in hero should
show the other accent colour on all designs too."_

**Hero CTA now carries the second accent, on all nine.** It was chalk. The plate word already
spends the primary (purple/magenta), so the button spends the other one — acid for Ultra,
cyan for Poster. Ink text on both (12.85:1 and 10.24:1).

**The light pink is out of Selected work.** `--lilac` was my own invention when mapping Ultra's
tokens onto Poster's chord, and it read weakly. Swapped for cyan — which also fixed a gap I
had not noticed: the section had **no cyan tile at all** (2 magenta, 2 violet, 2 pink, 2 paper,
1 ink), so the swap balances the palette rather than just replacing a colour. The sector frame
moved to magenta so two cyans do not sit adjacent.

**Three alternatives to the violet tertiary**, since `--plum` is a deep chromatic ground
carrying white text, each candidate had to hold white comfortably:

|                         | hex       | white on it | character                                                                           |
| ----------------------- | --------- | ----------- | ----------------------------------------------------------------------------------- |
| violet (current, 49-51) | `#5B21E0` | 7.67:1      | the original Poster tertiary                                                        |
| **52 indigo**           | `#2B1FA8` | **11.27:1** | cooler and deeper; most separation from magenta                                     |
| **53 oxblood**          | `#8E0F3C` | 9.20:1      | warms the grid, but shares a family with magenta so the two read close              |
| **54 deep teal**        | `#065E63` | 7.53:1      | most harmonious, but pulls toward cyan so the chord reads as two hues plus neutrals |

Fit re-verified after the changes at 1440x900, 1366x768 and 1920x720.

### Revision 3 — light heroes restored, Poster chord added

Ricky: _"Take round five. Add/restore the white heroes too to the gallery. And then create
versions using the original colours from Poster."_

Round 5 is now nine directions in three sets of the same three bar rhythms:

|                             | Counterpoint | Acid/cyan | Tonal flip |
| --------------------------- | ------------ | --------- | ---------- |
| **Ultra, dark hero**        | 43           | 44        | 45         |
| **Ultra, light hero**       | 46           | 47        | 48         |
| **Poster chord, dark hero** | 49           | 50        | 51         |

**Light heroes** were restored from the pre-dark snapshots, so they keep the breathing-room
pass but not the dark inversion. They also keep the acid price chip, which is legitimate on
a paper ground — it is only the black hero that makes an acid field a hi-vis pairing.

**Poster chord** is a pure token swap on the round 5 structure, so the comparison is exactly
the chord and nothing else:

| token     | Ultra                 | Poster               |
| --------- | --------------------- | -------------------- |
| `--ultra` | `#7A22FF` purple      | `#D6006B` magenta    |
| `--plum`  | `#3A0F8F` deep purple | `#5B21E0` violet     |
| `--acid`  | `#A8E80C` acid        | `#00D2D8` cyan       |
| `--lilac` | `#C9A6FF`             | `#FF9BC8` light pink |

Two things worth recording:

- The token comments described the _old_ colours ("bright purple", "acid yellow-green") and
  would have sat there lying next to magenta and cyan values. Corrected, along with the
  hi-vis note — **cyan is not hazard-coded the way acid-yellow-green is**, so the accent can
  go places acid could not, though the same discipline was kept.
- The light heroes initially overflowed 1920x720 by 42px, because they keep the larger 126px
  headline the dark versions had reduced to 101px. Fixed with the same short-window step-down,
  gated at 740px so the verified sizes cannot regress.

All nine verified fitting at 1440x900, 1366x768 and 1920x720.

### Revision 1 — breathing room

Ricky: _"I think the panels, like the Hero, need a little more space to breathe."_

Measuring natural content height (with the `min-height:100svh` pin released, or every panel
just reports the viewport height and tells you nothing) found the cause:

| section        | natural @1440x900 | spare   |
| -------------- | ----------------- | ------- |
| hero           | 835               | 65      |
| **pricing**    | **901**           | **-1**  |
| the other nine | 364-702           | 198-536 |

**Padding was uniform, so it was set by the densest section.** Pricing sat at exactly 100% of
the viewport, and every other panel inherited worst-case padding while carrying 200-500px of
unused height. The fix was to make air proportional to available room: generous default
padding, tighter on the two dense panels, paid for with a small step down in display and h2.

A first attempt applied it uniformly and overflowed 1366x768 by 48px — the measurement, not
the instinct, is what caught it.

Worth recording: impeccable's detector flagged `cramped-padding` dozens of times through
round 4 and **every agent, and I, dismissed it as a static-analysis artifact.** The client's
first reaction to the finished work was the same complaint. It was directionally right.

### Revision 2 — dark hero

Ricky: _"Change the hero so it's a black hero background and reverse the colours accordingly.
Also make the hero font smaller so that the space can be smaller and it does provide more
margin."_

Display type 126px -> 101px, and the freed space went back as padding: top air 36 -> 56px,
bottom 35 -> 52px. Hero headroom at 1440x900 went from +61 to **+96px** while gaining air.

Two consequences the instruction forced, neither of them optional:

1. **The acid price chip could not stay.** A large acid field directly on near-black is the
   hi-vis composition this chord was built to avoid — its own stated rule is that acid never
   occupies a field larger than ~48px on a dark ground. It became a chalk chip with a plum
   label, which also makes the price the brightest object in the hero.
2. **The hero's bar had to flip to paper.** It was `ink`, correct against a light hero; against
   a black one it would merge and destroy the counterpoint that was the whole point of round 5.

A specificity bug worth remembering: the new tint rule
`.js .hero .split.is-split .ch` (0,5,0) out-specified the resolved
`.split.is-split.is-in .ch{color:inherit}` (0,3,1), so the headline never resolved from lilac
to white and the plate word lost its white text. Invisible in source, obvious in a screenshot.

**Fit re-verified at 1440x900, 1366x768, 1440x800, 1600x800 and 1920x720 — no section
overflowing.** 1920x720 took three passes: the added padding broke it, then a `#pricing` ID
selector out-specified the recovery rule, then pricing needed a real trim at short heights.
The parent passed 1920x720, so leaving it broken would have been a regression introduced by
this pass.

## Round 4 — Poster variations (31–42)

Ricky chose direction 27 "Poster" to develop, with three changes: try both nav treatments,
make every section fit the viewport, add alternate colour chords, and furnish the rooms with
more imagery and video.

Twelve variations on one parent, holding Poster's DNA constant so the comparison is fair:
neutral shell with saturated colour only on objects, no gradients or shadows on structural
surfaces, 120–180px display type, one grotesk family, per-character hero reveal.

### The three variables

**Nav** — six colour-adaptive bars (Nav A), six floating glass islands (Nav B), paired on
identical chords so the nav can be judged independently. Direction 34 went further and
adopted its pair's exact hex values on the reasoning that differing chords would pollute the
A/B.

**Chords** — Solar (orange + violet), Ultra (purple + acid), Flare (orange + cobalt), Rose
(hot pink), Verdant (emerald + coral), Tide (teal + crimson). Ricky's stated favourites
appear in four; two deliberately avoid orange, purple and pink to test whether the instinct
holds against a properly-made alternative.

**Viewport fit** — every section fits one viewport at ≥1024px. Every direction solved it by
merging panels and restructuring, never by cutting: all nine clients, all prices, all
testimonials survive in all twelve. The universal move was **heading beside content rather
than above it**, worth 120–280px per section, plus a condensed single pricing table that
several called better than the parent regardless of the constraint.

**Media** — 4 silent 5s video loops and 6 new images (77 credits), on top of the existing
set: 29 images, 4 videos. All duotoned into each chord so generated media cannot drift
off-palette.

### The pink question, answered twice

Ricky: _"I find myself liking the pink but I am not a pink guy... I'm torn."_ Both Rose
directions reached the same conclusion independently and from opposite ends: **the answer is
not less pink, it is only pink, with black on it rather than white.** 38 made `#FF0F6B` the
single chromatic value in the file and enforced it with a contrast law — ink-on-pink and
pink-on-ink are both exactly 5.00:1. 37 put it as "Jamie Reid, acid house, Schiaparelli" and
made pink the page's joinery, then twice an entire room.

38's nav is the sharpest expression of the walls/furniture principle in the whole project: a
**deliberately neutral** smoked-glass island that blooms pink on its own via `saturate(1.8)`
when pink content passes beneath. Colour borrowed from content, never painted on furniture.

### The viewport-fit constraint was far more expensive than it looked

This dominated the round and produced the most reusable engineering.

**My brief was wrong twice.** First I specified only 1440×900 and 1280×800 — the two
_tallest_ common sizes — so 1366×768 went untested and three directions shipped broken there.
Then direction 35 identified the deeper error: **those are screen dimensions, not viewport
dimensions.** A real 1440×900 laptop yields ~810px of viewport after browser chrome, so the
sizes everything was optimised against are windows nobody actually has.

**Both reference sizes were exactly 16:10, which made an entire failure class invisible.**
Type sized off viewport _width_ happens to scale with the vertical budget at a fixed aspect
ratio. At 16:9 the window is short but wide, so 1440-class type lands in a 768px box. Every
direction that "didn't need" a height cap was reading an artifact of two test points sharing
an aspect ratio.

**The fix that works, found independently by two directions:** carve the short region out by
height _and aspect ratio_.

```css
@media (min-width:1024px) and (max-height:799px),
       (min-width:1024px) and (max-height:860px) and (min-aspect-ratio:41/25){ ... }
```

Both reference sizes are 1.600; 41/25 = 1.64 sits just above, so they are excluded **by
construction** rather than by tuning — regression becomes impossible instead of merely
tested-for. Direction 38 expressed the same insight as an identity: **at 16:10, `10vw ≡
16svh` exactly**, so an svh cap is provably neutral at the reference sizes and only bites on
wider aspect ratios.

**A single svh factor cannot solve it.** Holding both reference sizes forces the factor high
enough to give ~2px of relief where 25px is needed. Direction 32 proved this algebraically
before trying anything.

**Width-capped layouts need rhythm, not type.** With `--max:1440px`, a 1920-wide viewport
lays out identically to 1440 in a box 180px shorter, so every width-keyed clamp is already
pinned at its max term and returns nothing. Only section padding, seams and gaps help.

**Best diagnosis of the round:** direction 36 found its file _already had_ a short-viewport
trim block written by its author for exactly this case, with a comment naming "1440x800" —
gated at `max-height:799px`, one pixel short of the size it was written for.

### Final verification

Eleven of twelve fit every section at 1440×900, 1280×800, 1440×800, 1600×800, 1366×768 and
1920×720. Direction 34 is clean at all but heights ≤740px (+18px at 1440×740, +31px at
1920×720). Directions 36 and 38 document measured height floors below which they relax to
natural flow — evidenced with binary-search measurements rather than asserted.

Three of my own sweeps were needed, each wider than the last, and each found failures the
previous missed. **A layout rule verified at one aspect ratio is undertested.**

### Recurring defects

- **The tabular comma.** Four directions in this round rendered "£1,995" as "£1 , 995".
  Direction 41's check is the one to keep: resolve `font-variant-numeric` **up the ancestor
  chain**, since it inherits, and guard with a commented CSS rule.
- **Unbreakable email token.** `mail@digitalconsultingservices.co.uk` is a 37-character
  unbreakable string that pushed horizontal overflow at 1024 in at least four directions.
  Needs `overflow-wrap: anywhere`.
- **Collapse breakpoints must match the layout rule's boundary.** Grids collapsing at ~1180px
  while the viewport rule bound from 1024px ran stacked layouts inside fixed-height sections
  — measured at +321px on one pricing section.

### A false alarm I nearly propagated

One direction reported that `grayscale()` under `mix-blend-mode: luminosity` suppresses image
paint entirely, and warned it likely affected the parent and all twelve. I tested it in
isolation — grayscale+luminosity against luminosity-only against raw, same image, side by
side — and they render identically with full detail. The technique is redundant, not
destructive. Verified before broadcasting.

## Round 3 — assertive (26–30)

**The correction.** Ricky sent [kota.co.uk](https://kota.co.uk) with: _"This was more what I
was looking for. In your face; possibly overly animated and powerful use of colour and
typography."_ Round 2's register was right; its **volume was too low**.

The reference was measured directly rather than described from memory — see
`reference-kota.md`. What actually drives the effect: **152px display type**, one family at
one weight, per-character motion, copy resolving grey→black, stacking rounded panels, hard
light↔dark cuts, Lenis smooth scroll, persistent floating CTAs, and the confidence to leave
a viewport nearly empty. Notably it is **not** loud in colour — grey, black, white with soft
pastels.

### The governing principle

Ricky, clarifying mid-build: _"The colour is in the animations/content. The furnishings
rather than the walls, ceilings and floors."_

Walls, ceilings, floors — grounds, panels, section backgrounds — stay neutral. Colour is
furniture: blooms, work, moving elements, type fills, hover states. This is why the reference
reads expensive rather than garish, and it overrode my own round 3 spec, which had told
direction 27 to drench whole sections. **That correction was sent to all five agents
mid-flight** and demonstrably changed decisions — direction 30 cut its cobalt pricing wall in
response.

### The positioning, sharpened

Also Ricky, and stronger than v2 had it: _"We may be small but we can create incredible sites
that compete with London/NYC agencies for a fraction of the cost and a tiny fraction of the
client effort."_

Three parts, all landing: work that competes with big-city agencies · a fraction of the cost
· a tiny fraction of the client's effort. **The site is the proof of the first claim** —
which makes design ambition strategic rather than decorative. Written into `content-brief.md`
§3 and `PRODUCT.md`.

Two guardrails added with it: never invent a competitor's price to dramatise the comparison
(no sourced figure exists; a fabricated one is a false claim on a real business's site), and
never lead with the smallness — it is what makes the service personal and affordable, not an
excuse for the work.

### Not a clone

_"I totally don't want a clone of this. It's the creative direction; the ambition of design."_
The reference is a level of ambition, not a layout. It is itself a London/NYC agency, which
is why it was chosen — and why copying it would be self-defeating: **copying the benchmark is
the one move that proves you could not meet it.** Off limits: their asymmetric corner
signature, their palette, their copy phrasing, their logo lockup, and PP Neue Montreal (a
commercial licence we do not hold).

### The five

| #   | Direction | Shell                 | Furniture                                | Display @1440            |
| --- | --------- | --------------------- | ---------------------------------------- | ------------------------ |
| 26  | Spectrum  | ink `#0C0C0E` / bone  | violet→crimson→solar→amber blooms        | Geist, 166px             |
| 27  | Poster    | paper `#F3F3F1` / ink | riso magenta, cyan, violet as objects    | Schibsted Grotesk, 144px |
| 28  | Blackout  | `#08080A`             | voltage cyan `#22E4FF` in motion only    | Switzer, **196px**       |
| 29  | Chromatic | `#FBFBFC` / `#08080A` | colour inside the letterforms            | Archivo variable, 138px  |
| 30  | Momentum  | ink `#0B0B0C` / bone  | vermilion, acid, cobalt on moving things | Archivo, 160px           |

9,402 lines. All five: one family, no serif/sans pairing, phone and CTA in the first
viewport, real prices legible, no animated numbers.

### What rendering caught this round

The invisible-content class dominated, exactly as predicted at this motion volume:

- **29** — `background-image: inherit` on character spans resolved against the transform
  wrapper, not the gradient parent, leaving **all 197 characters transparent**. Also
  `box-decoration-break: slice` made every line after the first invisible without JS.
- **30** — hero glyphs depended on a CSS transition _completing_, frozen permanently under a
  stalled compositor; IntersectionObserver never fired for whole sections; `rAF` never fired
  either, so the first fix did not run.
- **26** — the floating CTA inversion never fired, because panels _stack_ and the section
  that intersects is not the section that visually covers the CTA. Rebuilt on a geometric
  hit-test, validated 14/14 against `elementFromPoint`.
- **28** — a chart bar with `class="m-bar c"` was caught by the per-character `.c` selector
  and hidden by the reveal system.
- **27** — the floating CTA was covering the £75 figure.

### Two cross-cutting findings

**`tabular-nums` widens punctuation.** Direction 22 hit it with Newsreader, direction 27 with
Schibsted Grotesk — commas and full stops render at figure width, producing "£1 , 995" and
"a brief , copy". Scope `tnum` to figures only, never to `body`. Two independent occurrences
makes this a rule for the React build.

**Skill guidance conflicts with this brief and was overridden consistently.**
`design-taste-frontend`'s "no oversized H1s" and "accent saturation < 80%" were overruled by
all five directions, each stating it explicitly. `ui-ux-pro-max`'s design-system search
returned Inter/Playfair on navy, or Neo Brutalism with hard offset shadows, and was rejected
by four of five — though its colour search did independently corroborate direction 27's riso
chord, the first time it has been useful rather than discarded in this project.

### Honesty audit

Zero images near a real client name, zero invented competitor prices, `sector-office` used
once and correctly (professional-services tile in a sector run, away from process and
first-person copy).

### An unresolved question

At two seconds after load, directions 26 and 29 still had heroes mid-reveal. I could not
measure time-to-readable reliably — offscreen iframes do not drive these reveals, and my
opacity probe sampled wrapper spans rather than the ones carrying text. Both pages render
correctly once settled. **Whether the delay is real for a user or an artefact of a throttled
tab is unverified** and worth checking by eye.

## Round 2 — the revised brief (20–25)

**The correction, 2026-08-17.** Ricky, on seeing rounds 1 and 1b:

> Whilst trades are an essential part of what we do, we build websites for anybody. We need
> a more generic positioning. I also want the site to feel elevated like a design agency,
> not the black and yellow under-construction type feel.

Both halves were real misses, and the second landed hardest on the newest work. The
impeccable round had the most creative freedom and converged hardest on the rejected
register — a hoarding, a job sheet, a road sign, a docket, a tool case, a merchant
catalogue. **Six directions became off-brief in one sentence.**

`content-brief.md` was rewritten as v2 and `PRODUCT.md` revised to match. The key changes:
positioning broadened to small businesses of any kind with trades as one sector among
several; an explicit ruled-out list covering hi-vis, hazard tape, and every site-notice,
docket, work-order and road-sign metaphor; and a note that bold saturated colour remains
welcome, so the round would not overcorrect into six beige pages.

**Why the impeccable round went where it did.** Its `new-work` procedure grounds a direction
in objects the audience already handles. With a trades-led PRODUCT.md, that reliably produced
trade objects. Direction 20's re-run against v2 confirms the mechanism was reading the
product truth, not expressing a taste of its own — see its seed comparison below.

### The six

| #   | Direction       | World                                  | Palette                                                   | Type                                          |
| --- | --------------- | -------------------------------------- | --------------------------------------------------------- | --------------------------------------------- |
| 20  | The Pattern     | Dressmaking pattern envelope, two inks | ultramarine `#1D2BA8` · vermilion `#D93A22` · cool tissue | Archivo variable, both axes, one family       |
| 21  | The Range       | Curated sector index, gallery-quiet    | bone `#E7E5DE` · petrol `#0D2B2F` · coral `#D4553C`       | Syne · Schibsted Grotesk · DM Mono            |
| 22  | Quiet Authority | Architecture monograph                 | cool grey `#E8EAED` · blue-black · ultramarine `#2C3E8C`  | Frank Ruhl Libre · Schibsted Grotesk          |
| 23  | Colour Field    | Seven saturated planes                 | ultramarine · pine `#0B4F3F` · vermilion `#C8331A`        | Archivo variable · Newsreader                 |
| 24  | Serif Modern    | Brand house, near-black                | ink `#14100F` · oxblood `#6B1226` · gilt                  | Playfair **variable** (opsz 5–1200) · Archivo |
| 25  | Motion Studio   | Precision instrument                   | limestone `#E7E8E3` · petrol · ruby `#A3203C`             | Familjen Grotesk · Schibsted Grotesk          |

10,498 lines. Detector contrast flags averaged **5.3 per file vs round 1's 9.1**, with three
directions at zero.

### Direction 20's seed comparison — the question answered

|                | Round 1b (16b)          | Round 2 (20)                 |
| -------------- | ----------------------- | ---------------------------- |
| Seed key       | `017e13c3`              | `26bcf012`                   |
| Assigned index | 4                       | 5                            |
| Own top pick   | Yellow Pages display ad | Record-label catalogue       |
| Overrode it?   | Yes                     | Yes                          |
| World built    | Moulded power-tool case | Dressmaking pattern envelope |

All seven of direction 20's candidates came from small-business commerce and practice —
record sleeves, swatch books, shop fascias, glaze test tiles, paper patterns, gallery hangs,
seed catalogues. **Not one hoarding, docket, hi-vis or merchant counter.** The seed's own
dealt challengers proved the constraint bites: a seven-segment price totem was disqualified
outright as forecourt-signage register.

So the revised product truth moved the derivation decisively. The trade metaphors came from
the brief, not the skill.

### Agents overriding their own skills

Notable across this round — every direction pushed back where skill guidance conflicted
with the brief, and reported it:

- **23** rejected `ui-ux-pro-max`'s colour DB (Tailwind pink in four of seven results, plus a
  Neo Brutalism recommendation of 4px black borders) as closer to a hoarding than a studio,
  and derived its palette by computation instead.
- **22** overrode `minimalist-ui`'s central warm-monochrome instruction because that is
  direction 04's exact territory, and took the only cool ground in the set.
- **24** rejected `high-end-visual-design`'s "Editorial Luxury / warm creams" archetype
  (direction 01's territory) and its glass pill navbar as reading SaaS.
- **25** declined `design-taste-frontend`'s "perpetual micro-interactions" mandate outright:
  continuous idle animation is the spectacle the direction was told not to build.
- **21** found `ui-styling` largely inapplicable to standalone HTML and said so — it changed
  exactly one thing, turning the sector filter into a real `role="tablist"`.

### Notable engineering

- **25 cut seven motion effects and reported them**, defending hardest the one where five
  real client names started invisible behind a callback.
- **24** caught that `.rv-mask` hiding by `clip-path` zeroes the element's own
  IntersectionObserver rect — so its hero image could never reveal itself.
- **22** caught `font-variant-numeric: tabular-nums` on `body` widening commas and full
  stops, putting visible gaps through all prose.
- **21** caught the h1 breaking mid-word — "busines/ses" — because `overflow-wrap` was
  hiding that the headline exceeded its column.
- **25** retracted its own wrong conclusion about IntersectionObserver after re-testing,
  rather than leaving a false claim in a rebuild spec.
- **No direction in round 2 animates a price.** The false-number class is now designed
  against rather than discovered.

### Imagery

11 new sector-spanning images (77 credits): boutique, textile studio, yoga studio, salon,
office, cafe, still life, laptop, interior light, linen, abstract wash. `laptop-store` failed
first pass and was recovered on retry. Total library now 23 web-optimised images, 6.5MB.

`sector-office` was tightened in the manifest after rendering: it shows two people at a table
from behind, and beside process step 1 ("A conversation") a reader would infer one is Ricky.
Marked safe as a professional-services sector image, unsafe for process or about sections.
Audited afterwards — all four directions that used it placed it correctly in a sector run.

### Environment

The machine slept twice mid-round, killing four agent runs. All were resumable from
transcript with no lost files. `caffeinate -i -m -s` now holds it awake; stop with
`pkill caffeinate`.

## Round 1b outcome

Six delivered, 9,247 lines. All eighteen load in the library page with no missing or blank
previews, 3/1 column split, no overflow or sub-40px targets at 1440 and 390.

| #   | Direction              | World                                                                  | Seed roll         |
| --- | ---------------------- | ---------------------------------------------------------------------- | ----------------- |
| 13  | The Merchant Catalogue | Builders' merchant catalogue — press blue + amber, Archivo width axis  | index 5           |
| 14  | Overdrive              | Live build demo on a monitor field — tally red, Archivo + Martian Mono | not run           |
| 15  | The Hoarding           | Scaffold hoarding — drenched netting green, Saira Condensed            | index 4           |
| 16  | Primary Route          | UK motorway signage — traffic green + works yellow, Overpass           | silent fail       |
| 17  | The Trade Counter      | Merchant counter dockets — spruce green + manila, Big Shoulders        | index 6           |
| 18  | Two Inks               | Two-ink letterpress — ivy + cerise, Bodoni + Spectral, all serif       | skipped by design |

**The headline result: every one of the six built its world out of something the customer
already handles** — a catalogue, a hoarding, a road sign, a docket, a print job. Not one
produced a generic agency page. In round 1 the metaphor came from the brief; here it came
from the skill.

Where the roll ran, it displaced the model's own first choice every time: 13 would have
built a quotation pad, 15 a Yellow-Pages directory, 17 a carbonless quote pad. The script's
own docstring claims the model "cannot roll its own dice" (30/35 identical concepts across
16 framings measured); this round is consistent with that.

Two of the three rolled directions (13, 17) landed in builders'-merchant territory, which
looked like convergence until 15 went somewhere unrelated. Two draws from a varied pool,
not a rut — but worth watching if more directions get rolled.

### Three defects in my own setup, found by the round

1. **The symlink install silently disabled the concept seed.** `~/.claude/skills/impeccable`
   was a symlink into `~/.agents/skills/`, matching this machine's convention for the other
   design skills. Impeccable's scripts run through that path **exit 0 with no output** — no
   error, no stderr. That is what degraded direction 16. Fixed by making
   `~/.claude/skills/impeccable` a real directory; verified the seed then deals. A duplicate
   remains at `~/.agents/skills/impeccable` and should be removed to avoid drift.
2. **The generated images were unusably heavy.** 2048px, 3–7MB PNGs. A `feComponentTransfer`
   duotone separation over one froze the renderer for 45 seconds, which is why direction 18
   shipped with no photography at all. Added `assets/img/web/` at 1600px JPEG — 56MB → 3.6MB
   — repointed directions 13–17 at it and corrected their intrinsic `width`/`height`.
3. **Launching agents before image generation finished cost real choice.** Direction 13 had
   three of twelve images available, 18 had four. Both worked around it; neither got the set
   they were promised.

### The false-number bug, a third and fourth time

Round 1 found two directions whose count-ups could freeze on a wrong price or stat. Round 1b
found it twice more: direction 14 published **"0 Sites delivered / 0 Years / 0% Managed"**
with JS disabled, and its fix was the right one — ship the true values in markup and let JS
zero them only to animate. Direction 17 avoided the class entirely by authoring both price
variants as real values in a clipped slot and translating between them, so no interpolation
exists to fail.

Four instances across eighteen builds makes this the single most reliable defect in the set.
See [[feedback_animated_counters_show_false_figures]].

### Honesty audit

All six checked programmatically: `workspace-desk.png` (which came back as a long-haired
woman at a laptop) was used by none of them; no generated image sits near a real client's
name; the one image within 400 characters of "Ricky" is a scaffolder with accurate alt text
in a separate block. Direction 14 removed a drawn signature scribble on its own initiative
because it imitated a real person's autograph.

### The A/B: 16 vs 16b

Direction 16 was re-run with the seed working, as `home-16b-impeccable-distill-rolled.html`
("Trade Grade"). Identical brief, emphasis and angle; the only variable changed is that the
concept seed ran. The control was left byte-identical and verified as such (md5
`6af3ec8a3055bd37ebc54fa95acf0a6e`).

|                      |                                                                |
| -------------------- | -------------------------------------------------------------- |
| Seed key             | `017e13c3` (persuade, source api, 306/564 human-approved pool) |
| Assigned index       | **4**                                                          |
| Agent's own top pick | #1 — Yellow Pages classified & boxed display ad                |
| Control's world      | UK motorway signage — which ranked **#5** on this run's list   |
| Built                | #4 — power-tool brand identity / the moulded tool case         |

**Both the model's instinct and the control's world were rejected by the dice.** That is the
cleanest evidence in the project that the mechanism does what it claims: the seeded run
explored territory neither the unseeded agent nor this agent's own taste function reached.
Full ordering was: Yellow Pages · van livery · written quotation · **tool case** · road
signage · merchant price list · consumer-unit schedule.

Caveat worth keeping: n=1. One roll landing well is not proof the catalog reliably beats a
good brief.

### The detector ran degraded all session

Discovered at the very end: `detect.mjs` needs `htmlparser2`, `css-select`, `css-tree` and
`domutils`, which a manual folder copy does not install (`npx impeccable install` would
have). Without them it falls back to regex and **does not evaluate computed contrast,
custom properties, or selector matching** — it says so plainly in its own output.

So every "detector clean" claim in this session was an undercount, not a pass. Dependencies
now installed at `~/.claude/skills/impeccable/node_modules/`; verified working.

At full strength across all nineteen files: **1,296 findings**. Largest categories are
`undersized-ui-text` (466), `cramped-padding` (279), `low-contrast` (148), `all-caps-body`
(80). Many are stylistic positions the directions took deliberately — Blueprint's numbered
sheets, the catalogue's side tabs, mono labels — and are not defects.

The objective subset is contrast: 148 `low-contrast` + 25 `gray-on-color`. Spot-checking
shows the raw number overstates it — 6 pairs are a colour against itself (impossible to
render), and others pair colours that never co-occur in the DOM. **142 plausible pairs
remain and need render-based triage** to separate real failures from selector-matching
artifacts. Not attempted; it is a real piece of work and the immediate goal is choosing a
direction.

Trust the agents that computed contrast directly (18 in OKLCH, 14's reviewer recomputing
every figure, 16b measuring 4.62:1) over the detector's static pairing.

### Also fixed

Direction 14's credential strip kept a 2-column rule after dropping to three cells,
orphaning the third at 1024 and 768 — caught by a finish-reviewer, fixed and re-verified
across all four widths.

## Round 1 outcome

All twelve delivered — 22,226 lines across the set, 1,493–2,140 lines each. Every file
verified: all twelve load in the library page, no horizontal overflow at 1440/1024/768/390,
one `h1` each, reduced-motion paths render content fully visible.

## What was learned

**Agents that rendered their own work found bugs that reading could not.** Every direction
was told to open its file in a browser and verify, and most found 4–8 real defects that
survived a careful read: a wrong class selector leaving a hero headline permanently masked,
CSS specificity making a page render largely blank, a rank bar shrink-wrapped to zero
width, a footer logo plate that never painted, text wrapping one word per line where a
description auto-placed into a 34px number column. None of these are visible in source.

**Two directions independently shipped a counter that could display a false price or
stat.** Kinetic froze at £60/£120/£211 instead of £995/£1,995/£3,495 under rAF throttling;
One Person could land on 2001/3+/11+/55% instead of the real credential stats. Both now
carry the true value in markup and snap to it. This is a fact-integrity bug wearing an
animation costume, and it will recur in the Framer Motion rebuild — `useMotionValue`
counters fail the same way. Recorded in memory as
`feedback_animated_counters_show_false_figures`.

**The missing photo library turned out to be a design asset.** With no images available,
every direction had to draw its own visuals, and the miniature CSS-drawn client site inside
a browser frame emerged independently as the house device — Studio Editorial hangs it off a
cursor, Bento Signal embeds a full one in a tile, Showroom made it the entire hero and
wired it to a live trade selector. It costs nothing to load and translates directly to
React components.

**Twelve was the right number.** The directions genuinely disagree — a two-ink drawing set,
a hi-vis job sheet, a signed letter, a chart-led ledger, an aurora glass atelier. Four
would have clustered.
