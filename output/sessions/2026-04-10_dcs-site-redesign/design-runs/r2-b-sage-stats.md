# Run R2-B: Sage & Black — Stats Hero

**Skill:** /design-taste-frontend
**Configuration:** DESIGN_VARIANCE: 8, MOTION_INTENSITY: 6, VISUAL_DENSITY: 5
**Output file:** index.html

---

/design-taste-frontend

DESIGN_VARIANCE: 8, MOTION_INTENSITY: 6, VISUAL_DENSITY: 5

## What to Build

Generate a complete, self-contained homepage for Digital Consulting Services as a single HTML file with embedded CSS and JavaScript. No external dependencies except Google Fonts (loaded via link tag). No frameworks, no build step — it must open directly in a browser.

Output: one file named index.html.

---

## Design DNA — PRESERVE EXACTLY

This is a T3 DNA clone. Every design decision below must be followed precisely. Only the hero and colour palette differ from the T3 baseline.

### Fonts

```
https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=Inter:wght@400;500;600&display=swap
--font-display: 'Space Grotesk', sans-serif;
--font-body: 'Inter', sans-serif;
```

### Easing

```css
--ease-out: cubic-bezier(0.16, 1, 0.3, 1);
```

### Animation keyframes

```css
@keyframes fadeSlideUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
```

All hero elements animate in with staggered delays using fadeSlideUp 0.6s var(--ease-out):

- Hero label: delay 0.2s
- H1: delay 0.35s
- Subheading: delay 0.5s
- CTAs: delay 0.65s
- Stats: delay 0.6s, 0.75s, 0.9s (staggered per stat)

### Section layout patterns (keep all of these)

- How It Works: 4-column grid, even cards offset down `transform: translateY(2rem)`
- What's Included: 3-column grid, cards 2 and 5 offset down `transform: translateY(1.5rem)`
- Work cards: card 2 offset down `transform: translateY(2rem)`, hover adds `rotate(-0.5deg)`
- Testimonials: card 1 `rotate(-1.5deg)`, card 2 `translateY(1.5rem) rotate(0.5deg)`, card 3 `rotate(1deg)`
- Examples: asymmetric grid `grid-template-columns: 1.2fr 0.8fr` with first tile spanning 2 rows

### Card styles (keep all of these)

- Border radius: 20px on step/included cards, 24px on pricing/work/testimonial cards
- Included cards: left accent bar (4px wide, height animates 0→100% on hover)
- Step cards: soft shadow on hover `0 20px 50px rgba(0,0,0,0.08)`
- Work card hover: `translateY(-8px) rotate(-0.5deg)`
- Skewed section backgrounds: `skewY(-2deg)` pseudo-elements

### Hover interactions (keep all)

- Nav links: underline draws in from left
- Step cards: translateY(-6px) + shadow
- Included cards: translateY(-4px) + left accent bar animates to full height
- Work cards: translateY(-8px) + rotate(-0.5deg)
- All transitions: 0.3–0.4s var(--ease-out)

---

## Colour Palette — THIS RUN: Sage & Black

```css
:root {
  --primary: #1b1b1b;
  --primary-deep: #0a0a0a;
  --primary-light: #2d2d2d;
  --accent: #595f39;
  --accent-hover: #4a5030;
  --support: #c4c5ba;
  --support-dark: #b0b1a6;
  --bg: #e4e4de;
  --white: #ffffff;
  --gray-100: #ededea;
  --gray-200: #dededb;
  --gray-400: #9a9a95;
  --gray-600: #5a5a54;
  --gray-800: #2a2a25;

  --font-display: "Space Grotesk", sans-serif;
  --font-body: "Inter", sans-serif;
  --ease-out: cubic-bezier(0.16, 1, 0.3, 1);
}
body {
  background: var(--bg);
}
```

Wherever T3 used `var(--indigo)`, use `var(--primary)`.
Wherever T3 used `var(--accent)` (orange), use `var(--accent)` (moss).
Wherever T3 used `var(--teal)`, use `var(--support)`.
Wherever T3 used `var(--cream)`, use `var(--bg)`.

The pricing section background: `var(--primary)`.
The CTA banner inner: `var(--primary)`.
The featured testimonial card: `var(--primary)`.

---

## Hero — THIS RUN: Stats Column

The hero uses a two-column grid (text left, visual right). The `::before` diagonal skew background shape fills the right side in `var(--primary)`.

### Hero visual (right column) — bold stat stack

Replace floating cards with a single column of 3 large stats, vertically centred in the right column, displayed on top of the dark skew background (white text).

```html
<div class="hero-stats">
  <div class="hero-stat">
    <span class="stat-number">47</span>
    <span class="stat-label">Sites live</span>
  </div>
  <hr class="stat-divider" />
  <div class="hero-stat">
    <span class="stat-number">11 days</span>
    <span class="stat-label">Average setup</span>
  </div>
  <hr class="stat-divider" />
  <div class="hero-stat">
    <span class="stat-number">94%</span>
    <span class="stat-label">Client retention</span>
  </div>
</div>
```

Styles:

```css
.hero-stats {
  position: relative;
  z-index: 3;
  display: flex;
  flex-direction: column;
  gap: 0;
  padding: 2rem;
}
.hero-stat {
  padding: 1.5rem 0;
  opacity: 0;
}
.hero-stat:nth-child(1) {
  animation: fadeSlideUp 0.6s var(--ease-out) 0.6s forwards;
}
.hero-stat:nth-child(3) {
  animation: fadeSlideUp 0.6s var(--ease-out) 0.75s forwards;
}
.hero-stat:nth-child(5) {
  animation: fadeSlideUp 0.6s var(--ease-out) 0.9s forwards;
}
.stat-number {
  display: block;
  font-family: var(--font-display);
  font-size: 3.5rem;
  font-weight: 700;
  color: var(--white);
  line-height: 1;
  letter-spacing: -0.03em;
}
.stat-label {
  display: block;
  font-family: var(--font-display);
  font-size: 0.8rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.12em;
  color: var(--support);
  margin-top: 0.4rem;
}
.stat-divider {
  border: none;
  border-top: 1px solid rgba(255, 255, 255, 0.15);
  margin: 0;
  opacity: 0;
}
.stat-divider:nth-child(2) {
  animation: fadeSlideUp 0.3s ease 0.65s forwards;
}
.stat-divider:nth-child(4) {
  animation: fadeSlideUp 0.3s ease 0.8s forwards;
}
```

On mobile: hide hero stats, make hero single column.

---

## Business Context

Company: Digital Consulting Services
Owner: Ricky Wilson
Tagline: Websites as professional as you are
URL: www.digitalconsultingservices.co.uk

Digital Consulting Services gets small businesses and tradespeople online. Ricky does all the work personally — nothing is outsourced. The result is agency-quality output with personal service. Clients do as little as possible; Ricky handles design, copy, hosting, and everything else.

---

## Target Audience

UK tradespeople and local service businesses: plumbers, electricians, builders, scaffolders, gardeners, decorators. Time-poor, not technical, have a real business but no website or an embarrassing outdated one. Price-conscious but will pay for something professional that is looked after long-term.

---

## Page Sections (in order)

### 1. Header / Navigation

- Logo: "DCS" wordmark
- Nav links: Services, Our Work, Examples, About, Blog
- Primary CTA button: "Get in touch"
- Sticky on scroll, mobile hamburger

### 2. Hero

- Headline: Websites as professional as you are
- Subheading: You tell us about your business. We handle design, copy, hosting, and everything else.
- Primary CTA: "See how it works"
- Secondary CTA: "View our work"
- Supporting visual: stats column as described above

### 3. How It Works (4 steps)

- Tell us about your business — A short conversation. No briefs, no spec documents.
- We write and design it — Copy, images, layout — all handled.
- We build and launch it — Fast, secure, and found on Google from day one.
- We look after it — Hosting, updates, and support. Nothing for you to manage.

### 4. What's Included (feature grid, 6 items)

- Design — A site that looks the part, built around your brand.
- Copy — We write every word. You just check it reads like you.
- Build — Fast, mobile-friendly, and secure as standard.
- Hosting — We manage it. No control panels, no technical decisions.
- Security — Backups, SSL, and updates handled automatically.
- Support — Something needs changing? Just ask.

### 5. Pricing (3 tiers with payment toggle: Upfront vs Monthly)

Starter: Upfront £995 + £29/mo | Monthly £59/mo (12-month min)
Professional: Upfront £1,995 + £39/mo | Monthly £99/mo (12-month min)
Growth: Upfront £3,495 + £59/mo | Monthly £149/mo (12-month min)

Small print: All sites include full service and location pages, local SEO, custom domain, SSL, and hosting. No CMS — content updates go through us.

### 6. Recent Work (3 portfolio cards)

- Colossus Scaffolding — Professional site with full service and location coverage.
- DJ Fox Electrical — Bold design with clear contact CTAs and service area pages.
- Bexhill Removals — Simple, clean, and effective.
- Link: "See all our work →"

### 7. Testimonials (3)

- "Ricky handled everything. I didn't have to think about it — the site just appeared and it was exactly right." — Paul, Scaffolding Contractor
- "I've had my site with Ricky for five years. Any time I need a change, it's done the same day." — Sarah, Fabric Retailer
- "I was embarrassed by my old website. Now I'm proud to hand my card out." — Mark, Electrician

### 8. See What's Possible (examples preview, 3 tiles)

- Plumbing site example | Electrical site example | Gardening site example
- Link: "Browse all examples →"

### 9. CTA Banner

- Heading: Ready to get started?
- Subtext: It takes about 15 minutes to tell us what you need. We handle everything from there.
- CTA: "Get in touch"

### 10. FAQ (4 questions)

- How long does it take? — Most sites are live within 2 weeks of our first conversation.
- Do I need to provide anything? — Just answer our questions. We write the copy, sort the images, and make all the design decisions.
- What if I want changes after it's live? — Content updates are included in your monthly fee. Just send us a message.
- What happens if I want to cancel? — Upfront clients own the relationship with no lock-in. Pay-monthly clients have a 12-month minimum, then 30 days notice to cancel.

### 11. Footer

- Logo + strapline: "Professional websites for UK tradespeople and small businesses."
- Nav: Services, Our Work, Examples, About, Blog, Contact, FAQ
- Contact: mail@digitalconsultingservices.co.uk | 07395 063764
- Legal: Privacy Policy, Terms, Cookies
- Copyright: © 2025 Digital Consulting Services

---

## Design Constraints

- UK English throughout
- No stock photography — geometric shapes, bold typography, abstract visuals only
- No emojis
- Mobile responsive — must work at 375px width
- Pricing toggle (upfront vs monthly): interactive JavaScript
- FAQ accordion: interactive JavaScript
- Accessible: sufficient colour contrast, semantic HTML, descriptive alt text

---

## Output

Single file: index.html
Save to the current working directory.
Do not create supporting files, do not use a build step.
