# Implementation Plan: DCS Inner Page HTML Prototypes

**Date:** 2026-04-12
**Status:** Ready for implementation -- approved by dual-model peer review
**Source:** Synthesised from Claude and Codex independent plans

---

## Key Differences Between Plans

| Aspect               | Claude                                        | Codex                                                                                       | Synthesised Decision                                                                                                                                                                                                                                                                                                                                              |
| -------------------- | --------------------------------------------- | ------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Generation order     | Simple pages first (momentum)                 | Risk-first: pricing, then details, then grids                                               | **Risk-first (Codex).** Pricing is the highest-stakes page and hardest to get right. Building it first surfaces CSS/JS patterns that flow into simpler pages. If pricing works, everything else is easier.                                                                                                                                                        |
| FAQ accordion        | Pure CSS `<details>/<summary>`                | Vanilla JS (accessible)                                                                     | **Pure CSS `<details>/<summary>` (Claude).** Native HTML5 elements are keyboard-accessible by default, require zero JS, and work in all modern browsers. The `<summary>` element is focusable and togglable via Enter/Space out of the box. Adding JS for this is unnecessary complexity. Style with CSS `details[open] summary::after` for the chevron rotation. |
| Working artifacts    | Mental extraction, no files                   | Physical `_shared-header.html`, `_shared-footer.html` snippet files                         | **Physical snippet files (Codex).** With a 1155-line source file and 12 pages to generate, having frozen snippets on disk eliminates drift risk. The `_` prefix convention keeps them visually separate from deliverables. Delete them at the end.                                                                                                                |
| Archetype definition | Implicit (pages grouped by layout similarity) | Explicit pre-generation step with 6 named archetypes                                        | **Explicit archetypes (Codex).** Defining the 6 archetypes before writing any code creates a contract that prevents visual drift between pages of the same type. Low cost, high consistency payoff.                                                                                                                                                               |
| Quality gates        | Manual checklist                              | Automated grep + manual spot-checks                                                         | **Both (combined).** Run automated grep checks after each wave, plus manual browser inspection. The grep catches structural omissions; the browser catches visual bugs.                                                                                                                                                                                           |
| Skill settings       | Not mentioned                                 | Explicitly enforce `design-taste-frontend` + variance/motion/density settings on every page | **Explicit enforcement (Codex).** If the implementing agent is running `design-taste-frontend`, the settings must be stated in the brief. Otherwise they drift.                                                                                                                                                                                                   |

## Blind Spots Caught

**Codex caught that Claude missed:**

- Archetype pre-definition step -- without this, pages of the same type (e.g., 5 index grids) risk inconsistent section ordering and hero treatment
- Explicit skill settings enforcement (`DESIGN_VARIANCE:8`, `MOTION_INTENSITY:6`, `VISUAL_DENSITY:5`) -- Claude assumed these would carry over implicitly
- Hash/diff verification of shared shell against homepage source -- Claude said "copy verbatim" but didn't specify how to verify it was actually verbatim
- Selective geometric shape usage -- Codex explicitly called out that `.solaris-geo-*` shapes should only appear on heroes that need visual interest, not every page

**Claude caught that Codex missed:**

- Detailed per-page content specifications -- Claude specified exactly what goes in every section of every page (e.g., 8 specific location names, 6 specific blog post titles, exact testimonial card structure). Codex stayed at archetype level without this granularity.
- Pricing page section-by-section breakdown with CSS implementation details (CSS Grid `repeat(3, 1fr)`, `data-upfront`/`data-monthly` attribute swap pattern, chartreuse accent on Professional card)
- Sidebar sticky implementation detail (`position: sticky; top: 120px`) -- pure CSS, no JS needed
- Contact form honeypot field for spam prevention
- Specific responsive breakpoints (768px for 2-col, 1024px for 3/4-col)
- Card hover pattern details (left accent bar `scaleY(0)` to `scaleY(1)`, card lifts `translateY(-4px)`)

---

## Implementation Plan

### Phase 0: Foundation (must complete before any page generation)

**Step 0.1 -- Read the homepage prototype in full**

File: `output/sessions/2026-04-10_dcs-site-redesign/outputs/2026-04-10_204434/r2-f-bg-variants/bg-b-soft-blue-white.html` (1155 lines)

Read the entire file. Do not skim. Identify and understand:

- All CSS custom properties in `:root`
- All animation keyframes (`fadeSlideUp`, `solarisFloatA/B/C/D`)
- The `.reveal` class and its Intersection Observer JS
- The card hover pattern (left accent bar)
- The header HTML structure (`<header id="solaris-header">` + mobile menu overlay)
- The footer HTML structure
- The Google Fonts `@import` URL (exact, not reconstructed)

**Step 0.2 -- Read the pricing data**

File: `tasks/gtm/strategy.md`

Extract exact pricing numbers for the 3 tiers (Starter/Professional/Growth), both payment options (Upfront and Pay Monthly), all add-on items with prices, and the "What Every Site Gets" list. The pricing page must use real numbers, not invented ones.

**Step 0.3 -- Create frozen working artifacts**

Save to `output/sessions/2026-04-12_dcs-inner-pages/`:

| File                       | Contents                                                                                                                                                              |
| -------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `_reference-homepage.html` | Verbatim copy of the homepage prototype (for local diffing)                                                                                                           |
| `_shared-header.html`      | Exact header HTML snippet (from `<header>` through closing `</header>` plus mobile menu overlay)                                                                      |
| `_shared-footer.html`      | Exact footer HTML snippet                                                                                                                                             |
| `_shared-styles.css`       | All CSS from the homepage `<style>` block (custom properties, reset, typography, animations, keyframes, reveal, header, footer, card, button, geometric shape styles) |
| `_shared-scripts.js`       | Header hamburger toggle + scroll shadow + Intersection Observer reveal JS                                                                                             |

These are working aids, not deliverables. They will be deleted at the end.

**Verification gate:** Diff `_shared-header.html` against the corresponding lines in `_reference-homepage.html`. They must be identical. Same for footer. If they differ, re-extract.

### Phase 1: Define Page Archetypes

Before writing any page, define the 6 archetypes. This is a mental/planning exercise, not code.

| Archetype              | Pages                                        | Hero                                              | Body Layout                                              | Geo Shapes                        |
| ---------------------- | -------------------------------------------- | ------------------------------------------------- | -------------------------------------------------------- | --------------------------------- |
| **Index grid**         | services, locations, blog, projects, reviews | Full-width banner, `<h1>`, subheading, breadcrumb | Card grid (responsive columns) + CTA banner              | Selective (services yes, blog no) |
| **Detail + sidebar**   | service-detail, location-detail, blog-post   | Full-width banner with breadcrumb, badge/metadata | Two-column: 65% prose left, 35% sticky sidebar right     | No                                |
| **Detail full-width**  | project-detail                               | Full-width banner with breadcrumb, tags, date     | Single-column prose + results list + CTA banner          | No                                |
| **Narrative**          | about                                        | Full-width banner                                 | Story section (2-col) + stats bar + values grid + CTA    | Selective on hero                 |
| **Form + info panel**  | contact                                      | Full-width banner                                 | Two-column: 55% form left, 45% info card right           | No                                |
| **Commercial pricing** | pricing                                      | Full-width banner, no decoration                  | Toggle + 3-tier cards + inclusions + add-ons + FAQ + CTA | No (clarity over decoration)      |

**Rules for all archetypes:**

- Header and footer: verbatim from frozen snippets, zero modifications
- `.reveal` class on all major sections
- Responsive: mobile-first, 768px breakpoint for 2-col, 1024px for 3-4 col
- Hardware-accelerated animations only (`transform` + `opacity`)
- No external icon libraries -- Unicode or inline SVG only

### Phase 2: Wave 1 -- Pricing Page (highest complexity)

Generate `pricing.html` first. This is the most commercially important page and the most technically complex.

**Sections in order:**

1. **Hero**: "Simple, Transparent Pricing" / "No hidden costs. No scope creep. A professional website that works for your trade." Breadcrumb: Home > Pricing. No geometric shapes -- pricing pages need clarity.

2. **Payment toggle**: Two buttons ("Pay Upfront" / "Pay Monthly"). Active button gets sky-blue background; inactive is outlined. Vanilla JS (~15 lines): on click, toggle `data-active` attribute on a container, use CSS `[data-active="upfront"]` / `[data-active="monthly"]` selectors to show/hide the correct price spans. Each price cell contains two `<span>` elements with `data-upfront` and `data-monthly` classes; CSS hides the inactive one. Instant swap, no animation.

3. **Three-tier cards** (CSS Grid `repeat(3, 1fr)`, collapses to single column on mobile):
   - **Starter**: up to 20 pages. Upfront: £995 setup + £15/mo. Monthly: £45/mo.
   - **Professional** (elevated): up to 50 pages. Upfront: £1,995 + £25/mo. Monthly: £75/mo. Chartreuse accent header, "Most Popular" badge, elevated shadow.
   - **Growth**: up to 100 pages. Upfront: £3,495 + £50/mo. Monthly: £125/mo.
   - Each card: tier name (Space Grotesk 700), price headline, pages included badge, feature bullet list with checkmarks, CTA button.

4. **"What every site gets"**: 3-column grid (desktop) of 9 items from strategy.md: Contact form, Mobile-responsive design, Custom theme, Full local SEO, Custom domain, Google Workspace email setup, SSL certificate, Hosting + security + uptime, Unlimited revisions during build. Each item: inline SVG icon + text.

5. **Add-ons section**: "Extend Your Package" headline. 2-column responsive grid. Items grouped by category:
   - **Content & SEO**: Extra pages (£20/page), Blog post writing (£75/post), Quarterly SEO review (£50/quarter), FAQ expansion pack (£100)
   - **Growth Tools**: Review capture widget (£10/mo), Lead notification upgrade (£5/mo), Call tracking (£15/mo), AI chatbot (£20/mo), Booking calendar (£15/mo)
   - **One-Off Extras**: Custom theme design (£350), Logo design (£250), Branded stationery (£150), Google My Business setup (£150), Multi-location expansion (£200/area)

6. **FAQ accordion**: Pure CSS `<details>/<summary>` elements. 5-6 questions:
   - "Do I own my website?" (Upfront: yes. Pay Monthly: service model, site comes down if you stop paying.)
   - "What happens if I want to cancel?"
   - "Can I upgrade my plan?"
   - "Are there any hidden fees?"
   - "What's included in a content update?"
   - "What's the difference between upfront and pay monthly?"
     Style: `summary` has `cursor: pointer`, padding, border-bottom. `summary::after` has a chevron that rotates on `details[open]`. Transition on the `::after` pseudo-element only.

7. **CTA banner**: Chartreuse (#D2DE32) background, dark text. "Ready to get started?" Two buttons: "Get a free quote" (primary) + "Call us" (outline).

**Verification gate:**

- Open in browser. Toggle switches all displayed prices correctly.
- Professional card is visually elevated with chartreuse accent.
- FAQ accordion opens/closes via click and keyboard (Enter/Space).
- All three tiers visible on desktop, stacked on mobile.
- Year 1 totals: Starter upfront £1,175, Professional upfront £2,295, Growth upfront £4,095.

### Phase 3: Wave 2 -- Detail/Sidebar Pages (4 files)

Generate in order: `service-detail.html`, `location-detail.html`, `blog-post.html`, `project-detail.html`.

**Shared sidebar CSS pattern** (for the first three):

```css
.content-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem;
}
@media (min-width: 768px) {
  .content-grid {
    grid-template-columns: 65% 35%;
  }
}
.sidebar {
  position: sticky;
  top: 120px;
  align-self: start;
}
```

#### 3.1 -- `service-detail.html`

- Breadcrumb: Home > Services > Web Design
- Hero: "Web Design" badge, `<h1>` "Website Design for Tradespeople", description
- Left column: "About this service" prose (2-3 paragraphs), benefits list with green checkmark SVGs, FAQ accordion (3-4 questions, same `<details>/<summary>` pattern)
- Right sidebar: sticky CTA card -- sky-blue header "Get a Free Quote", phone `tel:` link, chartreuse CTA button, "No obligation, free consultation" note

#### 3.2 -- `location-detail.html`

- Breadcrumb: Home > Areas We Serve > Brighton
- Hero: "Website Design for Tradespeople in Brighton", description about Brighton market
- Left column: prose about Brighton market, local competition, why DCS
- Right sidebar: sticky CTA card (Brighton-specific), nearby towns list (Hove, Lewes, Worthing, Shoreham, Portslade)

#### 3.3 -- `blog-post.html`

- Breadcrumb: Home > Blog > Why Tradespeople Need a Website
- Hero: `<h1>` title, date/author/reading-time metadata row (Inter 14px, muted colour)
- Left column: well-typeset prose article (3-4 paragraphs, `h2`/`h3` subheadings in Space Grotesk, `line-height: 1.75`, `max-width: 65ch`), tags at bottom
- Right sidebar: sticky CTA card ("Ready to get found online?"), related posts list (3 titles with dates)

#### 3.4 -- `project-detail.html` (full-width, no sidebar)

- Breadcrumb: Home > Our Work > Colossus Scaffolding
- Hero: tags "Scaffolding | Platform Build", `<h1>` "Colossus Scaffolding -- New Website", date
- Full-width content: prose about the project (2-3 paragraphs), "The Results" section with green checkmark list (5-6 outcomes)
- Bottom CTA banner: "Need a website for your trade?" with two buttons

**Verification gate after Wave 2:**

- All 4 files open in browser without console errors
- Sidebar pages: sidebar stays visible while scrolling long content on wide viewport
- Sidebar pages: sidebar stacks below content on mobile (<768px)
- Header/footer identical to frozen snippets (diff check)

### Phase 4: Wave 3 -- Index Grids + Narrative + Form (7 files)

Generate in order: `services.html`, `locations.html`, `blog.html`, `projects.html`, `reviews.html`, `about.html`, `contact.html`.

#### 4.1 -- `services.html`

- Hero: full-width sky-blue banner, `<h1>` "Our Services", subheading about digital marketing for tradespeople, breadcrumb (Home > Services), `.solaris-geo-1/.solaris-geo-2` geometric shapes
- Services grid: 4 cards (Web Design, Local SEO, Monthly Management, Google Workspace). Each card: inline SVG icon in chartreuse, title (Space Grotesk 700), 2-line description, "Find out more -->" link in brand primary. Card style: white bg, 20px radius, standard shadow, hover: left accent bar `scaleY(0)` to `scaleY(1)` + card lifts `translateY(-4px)`
- CTA banner: chartreuse background, dark text, headline + two buttons

#### 4.2 -- `locations.html`

- Hero: "Areas We Serve", subheading about East Sussex coverage, no geo shapes
- Coverage intro: short prose paragraph about UK-wide capability, East Sussex base
- Locations grid: 8 cards (Brighton, Hove, Eastbourne, Lewes, Uckfield, Hailsham, Seaford, Polegate). Each: map pin inline SVG, town name, brief tagline, "Learn more -->" link
- CTA banner

#### 4.3 -- `blog.html`

- Hero: "Our Blog", subheading about tips and advice for tradespeople
- Post grid: 6 cards using real DCS blog titles: "Why Tradespeople Need a Website", "Local SEO for Tradespeople", "How Much Does a Tradesperson Website Cost?", "Mobile-Friendly Websites for Tradespeople", "Pay Monthly vs Upfront Website", "What to Put on Your Tradesperson Website". Each card: date badge top-left, title (Space Grotesk), 2-line excerpt (Inter), category tag, "Read more -->" link

#### 4.4 -- `projects.html`

- Hero: "Our Work", subheading "Real websites for real tradespeople"
- Projects grid: 3 cards (Colossus Scaffolding, DJ Fox Electrical, Brighton Painter & Decorator). Each: category badge in chartreuse, title, 2-line description, date, "View project -->" link. Header area uses a coloured geometric placeholder (brand palette), no actual images.

#### 4.5 -- `reviews.html`

- Hero: "What Our Clients Say", subheading about social proof
- Testimonials grid: 6 cards. Each: 5 gold Unicode stars, block quote, client name + trade + location, platform badge (Google / Facebook). Card style: white bg, permanent left blue border bar (not hover-only -- signals endorsement). Write 6 fictional but plausible testimonials for UK tradespeople.

#### 4.6 -- `about.html`

- Hero: "About Digital Consulting Services", breadcrumb (Home > About)
- Story section: 2-column -- left: prose about DCS founding, why tradespeople, East Sussex base; right: decorative element (stacked stat cards or abstract geometry)
- Stats bar: 3 figures ("50+ sites built", "3 years experience", "UK-wide coverage") in horizontal band with sky-blue background
- Values grid: 3 cards (Results-first / No jargon / Always reachable), each with SVG icon, title, short description
- CTA banner

#### 4.7 -- `contact.html`

- Hero: "Get In Touch", subheading, no geometric shapes
- Two-column (55% / 45%):
  - Left: contact form -- name, email, phone (optional), message textarea, honeypot `<input type="text" name="website" style="display:none" tabindex="-1" autocomplete="off">`, submit button. Focus state: `outline: 2px solid var(--color-brand-primary)`.
  - Right: contact details card -- sky-blue header, phone (`tel:` link), email, East Sussex address, opening hours table (Mon-Fri 9am-6pm, Sat 10am-4pm, Sun closed)

**Verification gate after Wave 3:**

- All 7 files open in browser without console errors
- Card grids responsive: 1-col mobile, 2-col at 768px, 3-4 col at 1024px (varies by page)
- Header/footer identical to frozen snippets
- `.reveal` animations fire on scroll in every file

### Phase 5: Quality Gates (after all 12 files generated)

**Automated checks (run from session folder):**

```bash
# Verify all 12 deliverable files exist
ls -1 output/sessions/2026-04-12_dcs-inner-pages/*.html | grep -v '^_' | wc -l
# Expected: 12

# Every file must contain Google Fonts import
grep -L "fonts.googleapis.com" output/sessions/2026-04-12_dcs-inner-pages/[a-z]*.html

# Every file must contain the header landmark
grep -L 'id="solaris-header"' output/sessions/2026-04-12_dcs-inner-pages/[a-z]*.html

# Every file must contain the reveal observer
grep -L "IntersectionObserver" output/sessions/2026-04-12_dcs-inner-pages/[a-z]*.html

# No external icon libraries
grep -l "font-awesome\|ionicons\|material-icons\|feather" output/sessions/2026-04-12_dcs-inner-pages/[a-z]*.html

# No layout-triggering transitions
grep -n "transition.*\(top\|left\|width\|height\)" output/sessions/2026-04-12_dcs-inner-pages/[a-z]*.html
```

All `grep -L` commands should return no output (all files match). The last two `grep -l`/`grep -n` commands should also return no output (no forbidden patterns).

**Manual checks:**

- Open each file in a browser at 1440px, 768px, and 375px widths
- Confirm palette consistency (sky blue primary, chartreuse accent, sage support) across all pages
- Confirm card hover effects work (left accent bar + lift)
- Confirm pricing toggle switches all prices
- Confirm all `<details>` accordions open/close

### Phase 6: Cleanup

Delete the working artifacts:

```bash
rm output/sessions/2026-04-12_dcs-inner-pages/_reference-homepage.html
rm output/sessions/2026-04-12_dcs-inner-pages/_shared-header.html
rm output/sessions/2026-04-12_dcs-inner-pages/_shared-footer.html
rm output/sessions/2026-04-12_dcs-inner-pages/_shared-styles.css
rm output/sessions/2026-04-12_dcs-inner-pages/_shared-scripts.js
```

Final deliverable: 12 HTML files in `output/sessions/2026-04-12_dcs-inner-pages/`.

---

## CSS Architecture per File

Each HTML file's `<style>` block contains (in order):

1. CSS custom properties (verbatim from homepage: `--color-brand-primary: #61A3BA`, etc.)
2. CSS reset (`box-sizing`, margin, padding)
3. Typography (font-family vars, heading sizes in Space Grotesk, body in Inter)
4. Reusable component classes: `.btn-primary`, `.btn-outline`, `.card`, `.section`, `.container`
5. Animation keyframes: `fadeSlideUp`, `solarisFloatA/B/C/D`
6. `.reveal` class + transition
7. Header-specific styles
8. Footer-specific styles
9. Geometric shape styles (`.solaris-geo-*`)
10. **Page-specific styles** (hero variant, grid, sidebar, form, pricing toggle, etc.)

Total CSS will be substantial (~800+ lines per file). This is correct for self-contained HTML.

## JavaScript per File

Each file gets two script blocks (from homepage, verbatim):

1. Header hamburger toggle + scroll shadow
2. Intersection Observer for `.reveal` elements

`pricing.html` additionally gets a payment toggle block (~15 lines of vanilla JS).

No other JS is needed. The FAQ accordion uses `<details>/<summary>` (zero JS).

---

## Risks and Mitigations

| Risk                                     | Likelihood                    | Mitigation                                                                                                       |
| ---------------------------------------- | ----------------------------- | ---------------------------------------------------------------------------------------------------------------- |
| Header/footer drift from homepage        | High if generated from memory | Frozen snippet files + diff verification after each wave                                                         |
| Visual drift between index grid pages    | Medium                        | Archetype definition in Phase 1 constrains layout decisions                                                      |
| Pricing toggle JS bugs                   | Medium                        | Simple `data-*` attribute pattern; test toggle immediately after generation                                      |
| Token limit on long pages (pricing.html) | Medium                        | If the implementing agent hits limits, generate pricing in two passes: sections 1-4 first, then 5-7 appended     |
| Sidebar overflow on narrow content       | Low                           | `min-height: 0` on flex/grid children, `align-self: start` on sticky sidebar                                     |
| Skill settings drift across 12 pages     | Medium                        | Explicit enforcement of `DESIGN_VARIANCE:8`, `MOTION_INTENSITY:6`, `VISUAL_DENSITY:5` in every generation prompt |

---

## Output Checklist

| File                   | Key verification                                                                              |
| ---------------------- | --------------------------------------------------------------------------------------------- |
| `pricing.html`         | Toggle works, 3 tiers with real prices, Professional elevated, add-ons section, FAQ accordion |
| `service-detail.html`  | Two-column, sticky sidebar, FAQ accordion, CTA card                                           |
| `location-detail.html` | Two-column, sticky sidebar, nearby towns list                                                 |
| `blog-post.html`       | Two-column, readable prose typography, related posts in sidebar                               |
| `project-detail.html`  | Full-width prose, results checklist, bottom CTA                                               |
| `services.html`        | 4 service cards with hover effects, geo shapes on hero                                        |
| `locations.html`       | 8 location cards, no geo shapes                                                               |
| `blog.html`            | 6 post cards with dates and excerpts                                                          |
| `projects.html`        | 3 project cards with geometric placeholder headers                                            |
| `reviews.html`         | 6 testimonial cards with stars and permanent left border                                      |
| `about.html`           | Story section, stats bar, values grid, CTA                                                    |
| `contact.html`         | Form with honeypot, contact details card with hours table                                     |
