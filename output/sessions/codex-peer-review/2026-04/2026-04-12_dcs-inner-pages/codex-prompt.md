# Codex Peer Review Prompt

Paste this entire file into Codex in VS Code.

---

## Your task

You are doing an independent architectural peer review. Read the brief below, then produce your own implementation plan.

Save your plan as `codex-plan.md` in this folder:
`output/sessions/codex-peer-review/2026-04-12_dcs-inner-pages/`

When done, output this exact command so the user can copy-paste it into Claude Code:

```
/plan.with.codex synthesise output/sessions/codex-peer-review/2026-04-12_dcs-inner-pages/
```

---

## Brief: DCS Inner Page HTML Prototypes

**Date:** 2026-04-12
**Project:** Local Business Platform monorepo — DCS website (digitalconsultingservices.co.uk)
**Note:** This brief is sent to both Claude and Codex independently. Your plans will be synthesised into a final implementation spec. Do not look at `claude-plan.md` before writing your own plan.

### Problem Statement

The DCS website has an approved homepage design — a self-contained HTML prototype at:
`output/sessions/2026-04-10_dcs-site-redesign/outputs/2026-04-10_204434/r2-f-bg-variants/bg-b-soft-blue-white.html`

The Solaris theme package and a first-pass YOLO brief have been built from this, but all 11 inner page templates were written as structural placeholders without reference designs. Before those templates are rebuilt properly, each inner page needs a design prototype in the same format (self-contained HTML, same visual identity, same skill and settings) as the homepage.

### Goals

- Produce one self-contained HTML design prototype per inner page (11 files total, plus Pricing = 12 total counting the Pricing page separately from the 11)
- Each prototype must faithfully extend the homepage visual identity: Space Grotesk/Inter fonts, sky blue #61A3BA primary, chartreuse #D2DE32 accent, sage #A2C579 support, #F0F7FA background, geometric shape language, hardware-accelerated animations, elevated card style
- Header and footer are shared across all pages — replicate exactly from the homepage prototype, do not redesign them
- Each file covers only the unique content sections for that page (hero banner + page body)
- The Pricing page gets the most design attention — it is the most commercially important page and must include the tier comparison table, payment toggle, and add-ons section
- Output files land in `output/sessions/2026-04-12_dcs-inner-pages/` so they can be fed directly into a subsequent Stitch/React conversion session

### Non-Goals

- No React/TypeScript conversion in this session — HTML prototypes only
- No new color palette or typeface choices — strictly extend the existing homepage design
- No redesign of the header, footer, or global nav
- No Stitch MCP calls — use the `design-taste-frontend` skill directly, generating raw HTML
- Do not design mobile-specific layouts separately — responsive CSS is expected but not the focus

### Pages to Design (12 files total)

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

### Reference Design

All designs must be derived from the homepage prototype. Key patterns to replicate:

- CSS custom properties: `--ease-out: cubic-bezier(0.16, 1, 0.3, 1)`, `--radius-card: 20px`, `--radius-btn: 10px`
- Animation keyframes: `fadeSlideUp`, `solarisFloatA/B/C/D`
- Scroll reveal: `.reveal` + Intersection Observer JavaScript
- Card style: white bg, 20px radius, `box-shadow: 0 4px 20px rgba(42,46,32,0.08)`, left accent bar scales in on hover
- Hero banner: `bg-brand-primary` (#61A3BA), white text, breadcrumb in muted white, `<h1>` in Space Grotesk 700
- Geometric shapes: `.solaris-geo-1` through `.solaris-geo-4` — only used on hero panels that need visual interest, not on every page

### Skill and Settings

Use the **`design-taste-frontend`** skill with:

- `DESIGN_VARIANCE: 8`
- `MOTION_INTENSITY: 6`
- `VISUAL_DENSITY: 5`

Each output file is self-contained HTML (no external deps except Google Fonts CDN link for Space Grotesk + Inter).

### Constraints

- Self-contained HTML only — no build tools, no npm, no imports
- Google Fonts CDN for Space Grotesk + Inter (same `@import` URL as the homepage)
- No external icon libraries — use Unicode or inline SVG for any icons needed
- Hardware-accelerated animations only (`transform` + `opacity`) — no `top`/`left`/`width` transitions
- The `design-taste-frontend` skill must be used
- The implementing agent must read the homepage prototype file in full before generating any output

### Pricing Data (for pricing.html)

From `tasks/gtm/strategy.md`:

#### Option A: Upfront + Monthly

| Tier         | Setup Fee | Monthly | Year 1 Total |
| ------------ | --------- | ------- | ------------ |
| Starter      | £995      | £15/mo  | £1,175       |
| Professional | £1,995    | £25/mo  | £2,295       |
| Growth       | £3,495    | £50/mo  | £4,095       |

#### Option B: Pay Monthly (no setup fee)

| Tier         | Monthly | Min Term  | Year 1 Total |
| ------------ | ------- | --------- | ------------ |
| Starter      | £45/mo  | 12 months | £540         |
| Professional | £75/mo  | 12 months | £900         |
| Growth       | £125/mo | 12 months | £1,500       |

#### What Every Site Gets (all tiers)

- Contact form with email notifications
- Mobile-responsive, fast-loading design
- Custom theme (colours, typography, layout)
- Full local SEO (Schema markup, meta tags, sitemap)
- Custom domain setup + management (included)
- Google Workspace email setup
- SSL certificate, hosting, security updates, uptime monitoring
- Unlimited revisions during build

#### Tier Differences

- **Starter**: up to 20 pages, 1 content update/month
- **Professional**: up to 50 pages, 2 updates/month + blog (1 post/month x3), portfolio, reviews, GMB guidance, GA
- **Growth**: up to 100 pages, 4 updates/month + 2 posts/month, monthly report, GMB setup + optimisation, quarterly SEO review, priority support

#### Selected Add-Ons to Feature (8-10 items)

- Extra pages beyond tier cap: £20/page
- Blog post writing: £75/post
- Review capture widget: £10/month
- Lead notification upgrade (SMS): £5/month
- Chatbot with AI FAQ: £20/month
- Booking calendar integration: £15/month
- Custom theme design: £350 one-off
- Logo design: £250 one-off
- Google My Business setup: £150 one-off
- Google Ads setup: £200/month + ad spend

### Portfolio Content (for projects pages)

The two reference projects are:

- **Colossus Scaffolding** — scaffolding company, platform build, trade: scaffolding
- **DJ Fox Electrical** — electrical contractor, platform build, trade: electrical

Plus a fictional example: **Painter & Decorator in Brighton** — new website from scratch, trade: painting & decorating

### Relevant Codebase Context

The DCS site uses the Solaris theme. The existing page templates (`packages/themes/solaris/pages/`) are structural placeholders that will be rebuilt after these HTML prototypes are approved. The DCS site has:

- 4 services: Web Design, Local SEO, Monthly Management, Google Workspace
- 8 locations: Brighton, Hove, Eastbourne, Lewes, Uckfield, Hailsham, Seaford, Polegate
- 3 projects, 20 blog posts, reviews page, about page, contact page, pricing page

The homepage prototype's header is: translucent #F0F7FA with blur, logo "DCS" in #4a8fa8 bold, desktop nav links, phone number, sky-blue CTA button.

The footer is: dark (#2a2e20) background with logo, tagline, 3 navigation columns, contact details, copyright.

### What a Good Plan Should Cover

1. **Generation order** — should pages be sequential or batched? What dependencies exist between pages (e.g., does the header/footer need to be extracted as a reusable snippet first)?
2. **Fidelity strategy** — how do you ensure each page's header/footer is byte-for-byte identical to the homepage? Copy-paste approach vs. reference approach vs. extraction approach?
3. **Pricing page complexity** — what's the right approach to the payment toggle (pure CSS, vanilla JS)? How should the comparison table be structured for visual clarity?
4. **Scroll reveal and animations** — should each HTML file have its own copy of the Intersection Observer JS, or a shared approach?
5. **Scope per page** — for a detail page (service-detail, blog-post, etc.), what content depth is appropriate for a design prototype? Full representative content or skeleton content?
6. **Output validation** — how should the plan ensure each file is complete and browser-testable? Any checks to build in?

---

## Deliverable

Produce a numbered implementation plan with:

- Clear phases/steps
- Which files are created or modified at each step
- Verification gates between steps (how to confirm each step succeeded before moving on)
- Any risks or trade-offs worth calling out

Save your response as `codex-plan.md` in `output/sessions/codex-peer-review/2026-04-12_dcs-inner-pages/`.

Then output this command for the user to copy-paste into Claude Code:
`/plan.with.codex synthesise output/sessions/codex-peer-review/2026-04-12_dcs-inner-pages/`
