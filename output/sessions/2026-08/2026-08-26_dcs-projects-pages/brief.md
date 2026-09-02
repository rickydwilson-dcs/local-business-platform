# DCS projects list + case-study page — HTML prototype round 1

## Why this session exists

The 2026-08-25 attempt at rebranding all 14 DCS inner routes to r9 was rejected —
sub-agents given only a prose description of the tokens matched colours and missed
the entire design language (see `feedback_visual_rebuild_needs_visual_reference.md`
in auto-memory). This session designs just two of those routes — `/projects` (list)
and `/projects/[slug]` (case study) — as static HTML first, iterated with Ricky
before any React work, the same way the r9 homepage itself was designed
(`2026-08-17_dcs-homepage-redesign`).

**Ground rule:** every CSS value below is copied from the real, shipped
`sites/dcs/styles/home-r9.css` and `theme.config.ts` — not redescribed from memory.
Where a pattern already exists in that stylesheet but isn't currently used on the
homepage (`.cards--2`, `.slot`, `.detail__l`, `.paytoggle`), it's reused as-is rather
than invented fresh, since it was clearly designed for exactly this kind of content.

## Real material this uses

**Content — 13 real case studies**, `sites/dcs/content/projects/*.mdx` (unchanged,
on `develop`): title, description, tags, 4–5 outcome bullets, and a full
Challenge/Solution/Results narrative body per project.

**Sector taxonomy** — not present in the MDX frontmatter, assigned here from each
project's real service description, per `content-brief.md`'s "mix the sectors, don't
lead with trades" instruction:

| Sector                  | Projects                                                                                                                                            |
| ----------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------- |
| Retail & eCommerce      | The Clothing Kings, Cuddle Plush Fabrics, Luna Landings                                                                                             |
| Trades & Contractors    | Colossus Scaffolding, DCH Automotive, DJ Fox Electrical, Bexhill Removals, New Website (Brighton decorator), WordPress Rebuild (Eastbourne plumber) |
| Studios & Practitioners | Sanctuary Ida, Nicola Noble Tuition                                                                                                                 |
| Professional & Property | Silvero Homes                                                                                                                                       |
| Creative & B2B          | Mad Graphics                                                                                                                                        |

**Real media** — 3 of the 13 have real R2-hosted screen-recording video + poster,
from `sites/dcs/lib/home-assets.ts` (`HOME_ASSETS`, already live, verified via that
file's own re-verify script): The Clothing Kings, Cuddle Plush Fabrics, Colossus
Scaffolding. The other 10 use the CSS's own `.slot` "awaiting footage" placeholder
(diagonal stripe + play glyph) — a pattern already designed in `home-r9.css` for
exactly this situation, not a new invention. No project is shown with a fabricated
or stand-in screenshot of a real client's site — see the honesty rule in
`project_dcs_homepage_redesign.md`.

**Case-study demo** — Colossus Scaffolding, chosen because it has both a full
narrative body and a real video asset, and its own outcome bullets already read as
strong, specific proof (first Google enquiry inside 3 weeks, 30 pages, ranking in
Maps).

## Tokens (copied, not re-derived)

```
--ink:    #0E0E12
--paper:  #ECEBE9
--white:  #ffffff
--magenta:#D6006B
--aqua:   #00D2D8
--navy:   #17265E
--grey:   #70707B
font: Archivo (400–900), Poppins 300 (logo only) — next/font/google in app/layout.tsx
easing: cubic-bezier(.16,1,.3,1) everywhere
--pad: clamp(20px,4.4vw,76px)   --r: clamp(20px,3vw,44px)
```

## New patterns this session had to design (not already in home-r9.css)

- **Sector filter chips** — reused `.paytoggle`'s existing pill-group toggle
  (currently the monthly/upfront pricing switch) rather than inventing new chip
  styling, since it's already the site's one "selectable pill group" pattern.
- **Outcomes checklist on the case-study page** — reused `.detail__l`'s existing
  aqua-check icon list (currently the pricing tier's "what's included" list).
- Everything else (`.cards--2` grid, `.slot`, `.bar`, `.panel`/`.p--*`, `.end`,
  `.quote`) is used exactly as already defined.

## What this round is

Two static HTML files, served locally, no React. Ricky reviews and iterates before
any port to `sites/dcs/components/pages/ProjectsPage.tsx` /
`ProjectDetailPage.tsx`. Filtering is real (vanilla JS, client-side) so the
interaction can actually be evaluated, not just described.
