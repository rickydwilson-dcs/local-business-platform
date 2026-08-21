# Round 7 — 12 prototypes, `home-57` … `home-68`

Derived from `../2026-08-20_framer-gallery-research/prototype-brief.md`. Read that first — it is the
research brief. This file is the build contract.

## Why this round exists

Rounds 1–6 produced ~56 prototypes and Ricky rejected all of them:

> "whilst I liked the colours and fonts, the actual components weren't making it look elevated and
> the mobile responsiveness was dreadful."

Two research sweeps of the Framer ecosystem produced the brief. This round applies it.

## THE HARD RULE

**No prototype may be text and colour alone.** Ricky, verbatim: _"dont allow ay to just be text and
colour."_

Every section of every prototype must carry a **visual element**. Placeholder and wireframe imagery is
explicitly fine. Acceptable forms, in rough order of preference:

1. **Abstract UI mock built from divs** — the recipe from the brief §2.1: a flat _tinted_ canvas
   (never white), grey skeleton bars standing in for text that doesn't matter, and **exactly one
   element in full colour and full fidelity** — the thing the caption is about. Add a greyed row with
   a hollow radio dot to make it read as live.
2. **Inline SVG line illustration or diagram** — flow diagrams, node graphs, isometric tiles.
3. **Wireframe placeholder blocks** — a bordered box with a diagonal-hatch fill and a label. These
   degrade to a _designed_ box rather than white space.
4. **Duotone-treatable photo placeholder** — a flat two-tone block standing in for photography, so the
   layout is honest about where a real photo goes.

A section containing only a headline, body copy and a coloured background **fails this round**.

## Non-negotiables (all 12)

- **Self-contained single HTML file.** No build step, no external JS, no CDN scripts. Fonts via the
  existing Google Fonts `<link>` only (see below).
- **No count-up numbers.** Standing rule. Every figure is authored static text. This applies to
  prices, stats, ratings, everything.
- **Content renders at full opacity by default.** Never author `opacity: 0` as a resting state. Animate
  `transform` from a visible state, or opacity `0.6 → 1`. **Acceptance test: the page must be a
  complete, readable document with JavaScript disabled.**
- **Latch reveals** — one-shot, then `unobserve`. Never reverse on scroll-up.
- Wrap motion in `@media (prefers-reduced-motion: no-preference)`.
- **No preloaders, no welcome gates, no scroll-jacking, no interstitial modals.**
- **Design 390px explicitly** — do not reflow the desktop layout. **Pricing must be a vertical
  selector list, never columns.**
- Never `font-variant-numeric: tabular-nums` on a price with a thousands comma (`£1,995` →
  `£1 , 995`).
- A centred floating nav must be centred with `left`/`right`/`margin-inline`, **not**
  `transform: translateX(-50%)`, and any fixed mobile dialog must not be nested inside a
  `backdrop-filter` ancestor.

## Inherited style — a starting point, not a lock

Ricky has confirmed these are **a starting point**. Directions may move off them entirely where the
direction calls for it; say so in the prototype's header comment when you do.

```
--ink   #101014   --graphite #1B1B20   --paper/--chalk #F3F3F1   --bone #E3E3E0
--ash   #55555E   --smoke    #A6A6B0
--acid  #00D2D8   --ultra    #D6006B   --lilac #FF9BC8   --plum #17265E
```

Fonts (keep this exact `<link>` unless the direction genuinely needs otherwise):

```html
<link
  href="https://fonts.googleapis.com/css2?family=Schibsted+Grotesk:wght@400;500;700;800;900&family=Poppins:wght@300;400&family=DM+Mono:wght@400;500&display=swap"
  rel="stylesheet"
/>
```

Schibsted Grotesk = headings (Ricky said he is happy with them). DM Mono = body/labels. Poppins 300 =
lowercase two-line logotype.

## Content

Use the **real** DCS copy — `content-brief.md` and `PRODUCT.md` in this folder. Key facts:

- Website design and build studio in **Polegate, East Sussex**, working UK-wide.
- From **£995 + £15/mo**, or **£45/mo with nothing upfront**, **24-month minimum** on PAYG.
- Three core offerings plus three support services (see `content-brief.md`).
- **Do not name Google Workspace on the homepage.**
- Detailed pricing mechanics belong on inner pages, not here.
- No invented client names or fake testimonials — use placeholder attribution that is obviously
  placeholder (`[Client name], Hailsham, 2025`).

## The 12 directions

Each is traceable to the research. Keep them genuinely divergent — the point of 12 is comparison.

| #   | File                        | Direction              | Thesis                                                                                                                                                      | Research lineage                        |
| --- | --------------------------- | ---------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------- |
| 57  | `home-57-spec-sheet.html`   | **Spec sheet**         | Engineering restraint. Hairline section bars (`[01]` · `// WHAT WE DO` · `© 2026`), services as a typographic table, accreditation table instead of stats. | Oberon, Lurais, Composio                |
| 58  | `home-58-poster.html`       | **Poster**             | Near-black, condensed grotesk at viewport scale, imagery interleaved in z with the letterforms, process as four two-tile stacks assembling diagonally.      | Bold Design / "Boldness"                |
| 59  | `home-59-quiet.html`        | **Quiet**              | Greyscale + one desaturated accent, huge whitespace, abstract in-card mocks, vertical pricing selector.                                                     | Lumenary, Mimo                          |
| 60  | `home-60-trade-blocks.html` | **Trade blocks**       | Zero radius, flat colour service blocks, each with its own full-width `Enquire now` footer bar. Every service its own conversion point.                     | Trowel Craft                            |
| 61  | `home-61-masthead.html`     | **Editorial masthead** | Justified full-width nav row, running-paragraph hero with client names as inline links, comma-delimited nav items.                                          | Manner, Baseform, Constantine           |
| 62  | `home-62-workbench.html`    | **Workbench**          | The in-card UI mock is the whole page. Bento of tinted canvases, each holding one full-colour element.                                                      | Billow, Planhat, Mimo                   |
| 63  | `home-63-index-rail.html`   | **Index rail**         | Sticky numbered rail down the left; sections read as one table, not cards. Section watermark tracks position.                                               | Composio, Nexsign, MATTTER              |
| 64  | `home-64-swiss-grid.html`   | **Swiss grid**         | Strict 4-column with visible full-height hairlines, half-bleed image, reading-position service list.                                                        | SwissBrut                               |
| 65  | `home-65-warm-local.html`   | **Warm local**         | Cream/warm ground, duotone photography, town+year testimonials, channel-tile contact block, accreditation seals.                                            | Reiseservice Jeremias, Rise from Within |
| 66  | `home-66-chamfer.html`      | **Chamfer**            | 45° chamfered corners, three-cell spec strip (what / how long / how much), pricing as full-bleed solid colour tiles.                                        | Huehaus                                 |
| 67  | `home-67-dock.html`         | **Dock**               | Mobile-first thesis. Bottom-pinned floating dock nav, persistent CTA, thumb-reach as the organising principle. Design 390 first, then scale up.             | Magnetto, Karolina Hess                 |
| 68  | `home-68-selector.html`     | **Selector**           | Conversion thesis. Persona tabs (trades / salons / garages / professional), symptom checklist, pricing as a vertical selector driving one detail panel.     | Onmoon, Billow, Rise from Within        |

## Per-file header comment

Every prototype opens with a comment block stating: the direction name and number, the thesis in one
sentence, what it takes from the research, **what visual device satisfies the hard rule in each
section**, and any deliberate departure from the inherited palette/type.

## Registering in `index.html`

**Do not edit `index.html`** — the orchestrator does that once, at the end, to avoid concurrent
edits clobbering each other. Instead, each agent returns its 12-field entry object in its final
response:

```js
{ n:"57", file:"home-57-spec-sheet.html", name:"Spec Sheet",
  kicker:"round 7 · research-led",
  desc:"…",
  fonts:"Schibsted Grotesk · DM Mono · <size>px display at 1440",
  moment:"…",
  tags:["Round 7","…"], tone:["light"|"dark","bold"|"quiet","motion"|"still"],
  sw:["#…","#…","#…","#…"] }
```

## Definition of done, per prototype

1. File exists at the stated path and opens without console errors.
2. **Every section carries a visual element.** Check it section by section.
3. No count-ups anywhere.
4. Renders complete with JS disabled.
5. 390px layout is explicitly designed; pricing is a vertical selector.
6. Header comment present and honest about departures.
