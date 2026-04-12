# Brief: DCS Inner Page Designs

**Date:** 2026-04-12
**Status:** Clarified — ready for dual-model peer review

---

## Problem Statement

The DCS website (digitalconsultingservices.co.uk) has an approved homepage design — a self-contained HTML prototype at `output/sessions/2026-04-10_dcs-site-redesign/outputs/2026-04-10_204434/r2-f-bg-variants/bg-b-soft-blue-white.html`. The Solaris theme package and a first-pass YOLO brief have been built from this, but all 11 inner page templates were written as structural placeholders without reference designs. Before those templates are rebuilt properly, each inner page needs a design prototype in the same format (self-contained HTML, same visual identity, same skill and settings) as the homepage.

## Goals

- Produce one self-contained HTML design prototype per inner page (11 files total)
- Each prototype must faithfully extend the homepage visual identity: Space Grotesk/Inter fonts, sky blue #61A3BA primary, chartreuse #D2DE32 accent, sage #A2C579 support, #F0F7FA background, geometric shape language, hardware-accelerated animations, elevated card style
- Header and footer are shared across all pages — replicate exactly from the homepage prototype, do not redesign them
- Each file covers only the unique content sections for that page (hero banner + page body)
- The Pricing page gets the most design attention — it is the most commercially important page and must include the tier comparison table, payment toggle, and add-ons section
- Output files land in a new session folder so they can be fed directly into a subsequent Stitch/React conversion session

## Non-Goals

- No React/TypeScript conversion in this session — HTML prototypes only
- No new color palette or typeface choices — strictly extend the existing homepage design
- No redesign of the header, footer, or global nav
- No Stitch MCP calls — use the `design-taste-frontend` skill directly, generating raw HTML
- Do not design mobile-specific layouts separately — responsive CSS is expected but not the focus

## Pages to Design (11 files)

| Page            | Slug                   | Key content sections                                                                                                               |
| --------------- | ---------------------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| Services index  | `services.html`        | Hero, services grid (4 cards), brief intro to each service                                                                         |
| Service detail  | `service-detail.html`  | Hero with breadcrumb, two-column (prose left, sticky CTA sidebar right)                                                            |
| Locations index | `locations.html`       | Hero, UK-wide message, East Sussex towns grid                                                                                      |
| Location detail | `location-detail.html` | Hero with breadcrumb, prose content, sidebar with CTA + nearby towns                                                               |
| Blog index      | `blog.html`            | Hero, post grid (6 cards with date/title/excerpt)                                                                                  |
| Blog post       | `blog-post.html`       | Hero with date/author, two-column (prose left, sidebar right with CTA + related posts)                                             |
| Projects index  | `projects.html`        | Hero, projects grid (3 cards with category badge, title, excerpt)                                                                  |
| Project detail  | `project-detail.html`  | Hero with breadcrumb, full-width prose content, bottom CTA banner                                                                  |
| Reviews         | `reviews.html`         | Hero, testimonials grid (6 cards with star ratings, quote, name, trade)                                                            |
| About           | `about.html`           | Hero, story section, stats/credentials bar, values grid (3 columns), CTA banner                                                    |
| Contact         | `contact.html`         | Hero, two-column (contact form left, details panel right: phone/email/address/hours)                                               |
| Pricing         | `pricing.html`         | Hero, payment toggle (upfront vs pay-monthly), 3-tier comparison table, what's included, extras/add-ons, FAQ accordion, CTA banner |

## Reference Design

All designs must be derived from:
`output/sessions/2026-04-10_dcs-site-redesign/outputs/2026-04-10_204434/r2-f-bg-variants/bg-b-soft-blue-white.html`

The implementing agent must read this file in full before generating any output. Key patterns to replicate:

- CSS custom properties: `--ease-out: cubic-bezier(0.16, 1, 0.3, 1)`, `--radius-card: 20px`, `--radius-btn: 10px`
- Animation keyframes: `fadeSlideUp`, `solarisFloatA/B/C/D`
- Scroll reveal: `.reveal` + Intersection Observer JavaScript
- Card style: white bg, 20px radius, `box-shadow: 0 4px 20px rgba(42,46,32,0.08)`, left accent bar scales in on hover
- Hero banner: `bg-brand-primary` (#61A3BA), white text, breadcrumb in muted white, `<h1>` in Space Grotesk 700
- Geometric shapes: `.solaris-geo-1` through `.solaris-geo-4` — only used on hero panels that need visual interest, not on every page

## Skill and Settings

Use the **`design-taste-frontend`** skill with these settings (same as the homepage run):

- `DESIGN_VARIANCE: 8`
- `MOTION_INTENSITY: 6`
- `VISUAL_DENSITY: 5`

Generate pages sequentially or in small parallel batches. Each output file is self-contained HTML (no external deps except Google Fonts CDN link).

## Output Location

Save all 11 HTML files to:
`output/sessions/2026-04-12_dcs-inner-pages/`

Filename convention: `[slug].html` (e.g. `pricing.html`, `service-detail.html`).

## Acceptance Criteria

- Given the homepage prototype is read in full, when a page is generated, then its header/footer markup is byte-for-byte identical in structure and class names to the homepage
- Given the Pricing page design, when reviewed, then it must contain a visible payment toggle, all three tier names (Starter/Professional/Growth), and an extras section with at least 5 add-on items listed without prices
- Given any inner page, when opened in a browser, then all animations and hover effects function without errors in the console
- Given all 11 files, when reviewed side by side with the homepage, then colour palette, card style, and typographic scale are visually consistent throughout

## Constraints

- Self-contained HTML only — no build tools, no npm, no imports
- Google Fonts CDN for Space Grotesk + Inter (same `@import` URL as the homepage)
- No external icon libraries — use Unicode or inline SVG for any icons needed
- Hardware-accelerated animations only (`transform` + `opacity`) — no `top`/`left`/`width` transitions
- The `design-taste-frontend` skill must be used — do not substitute another design skill

## Open Questions

- The Pricing page references specific tier prices (£995 setup, £15/mo upfront; £45/mo pay-monthly for Starter, etc.) from `tasks/GTM/strategy.md` — the implementing agent should read that file to get the exact numbers rather than inventing them
- The "Recent Work" section on the homepage shows Colossus Scaffolding and DJ Fox Electrical as portfolio items — the Projects index and Project detail pages should use these as the example content
