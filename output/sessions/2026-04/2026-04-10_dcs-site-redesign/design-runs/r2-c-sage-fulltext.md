# Run R2-C: Sage & Black — Full-Width Text Hero

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
@keyframes drawUnderline {
  from {
    width: 0;
  }
  to {
    width: 100%;
  }
}
```

All hero elements animate in with staggered delays using fadeSlideUp 0.6s var(--ease-out):

- Hero label: delay 0.15s
- H1 line 1: delay 0.3s
- H1 line 2: delay 0.45s
- Underline: delay 0.7s, uses drawUnderline 0.6s var(--ease-out)
- Subheading: delay 0.6s
- CTAs: delay 0.8s

### Section layout patterns (keep all of these)

- How It Works: 4-column grid, even cards offset down `transform: translateY(2rem)`
- What's Included: 3-column grid, cards 2 and 5 offset down `transform: translateY(1.5rem)`
- Work cards: card 2 offset down `transform: translateY(2rem)`, hover adds `rotate(-0.5deg)`
- Testimonials: card 1 `rotate(-1.5deg)`, card 2 `translateY(1.5rem) rotate(0.5deg)`, card 3 `rotate(1deg)`
- Examples: asymmetric grid `grid-template-columns: 1.2fr 0.8fr` with first tile spanning 2 rows

### Card styles (keep all of these)

- Border radius: 20px on step/included cards, 24px on pricing/work/testimonial cards
- Included cards: left accent bar (4px wide, height animates 0→100% on hover)
- Skewed section backgrounds: `skewY(-2deg)` pseudo-elements

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

---

## Hero — THIS RUN: Full-Width Typographic

Single-column centred layout. NO right-column visual. Maximum typographic impact.

```css
.hero {
  min-height: 90vh;
  padding: 12rem 0 8rem;
  display: flex;
  align-items: center;
  position: relative;
  overflow: hidden;
  text-align: center;
}
/* Large background colour block behind header+hero */
.hero::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 65%;
  background: var(--primary);
  z-index: 0;
  clip-path: polygon(0 0, 100% 0, 100% 85%, 0 100%);
}
.hero-inner {
  position: relative;
  z-index: 2;
  max-width: 960px;
  margin: 0 auto;
  padding: 0 1.5rem;
}
.hero-label {
  display: inline-block;
  font-size: 0.8rem;
  font-weight: 600;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: var(--support);
  margin-bottom: 2rem;
  opacity: 0;
  animation: fadeSlideUp 0.6s var(--ease-out) 0.15s forwards;
}
.hero h1 {
  font-size: clamp(3.5rem, 7vw, 6rem);
  font-weight: 700;
  letter-spacing: -0.04em;
  line-height: 1.05;
  color: var(--white);
  margin-bottom: 1.5rem;
}
.hero h1 .line1 {
  display: block;
  opacity: 0;
  animation: fadeSlideUp 0.6s var(--ease-out) 0.3s forwards;
}
.hero h1 .line2 {
  display: block;
  opacity: 0;
  animation: fadeSlideUp 0.6s var(--ease-out) 0.45s forwards;
}
/* Animated underline on "professional" */
.hero h1 em {
  font-style: normal;
  position: relative;
  display: inline-block;
  color: var(--white);
}
.hero h1 em::after {
  content: "";
  position: absolute;
  bottom: 4px;
  left: 0;
  height: 8px;
  width: 0;
  background: var(--accent);
  opacity: 0.7;
  z-index: -1;
  border-radius: 2px;
  animation: drawUnderline 0.6s var(--ease-out) 0.7s forwards;
}
.hero-sub {
  font-size: 1.2rem;
  color: rgba(255, 255, 255, 0.7);
  line-height: 1.7;
  max-width: 560px;
  margin: 0 auto 3rem;
  opacity: 0;
  animation: fadeSlideUp 0.6s var(--ease-out) 0.6s forwards;
}
.hero-actions {
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
  opacity: 0;
  animation: fadeSlideUp 0.6s var(--ease-out) 0.8s forwards;
}
/* Override button colours for white text on dark bg */
.hero .btn-cta {
  background: var(--accent);
  color: var(--white);
}
.hero .btn-cta:hover {
  background: var(--accent-hover);
}
.hero .btn-cta--outline {
  background: transparent;
  border-color: rgba(255, 255, 255, 0.5);
  color: var(--white);
}
.hero .btn-cta--outline:hover {
  background: rgba(255, 255, 255, 0.1);
  border-color: var(--white);
}
```

The headline text should read:
Line 1: "Websites as"
Line 2: "<em>professional</em> as you are"

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
- Header background should be transparent initially (sits over the dark hero block), then gains backdrop blur on scroll

### 2. Hero

Full-width typographic hero as described above.

- Headline: Websites as professional as you are
- Subheading: You tell us about your business. We handle design, copy, hosting, and everything else.
- Primary CTA: "See how it works"
- Secondary CTA: "View our work"

### 3. How It Works (4 steps)

- Tell us about your business — A short conversation. No briefs, no spec documents.
- We write and design it — Copy, images, layout — all handled.
- We build and launch it — Fast, secure, and found on Google from day one.
- We look after it — Hosting, updates, and support. Nothing for you to manage.

### 4. What's Included (feature grid, 6 items)

- Design, Copy, Build, Hosting, Security, Support

### 5. Pricing (3 tiers with toggle)

Starter / Professional / Growth — same prices as other runs.

### 6. Recent Work (3 cards)

Colossus Scaffolding / DJ Fox Electrical / Bexhill Removals

### 7. Testimonials (3)

Same quotes as other runs.

### 8. See What's Possible (3 tiles)

Plumbing / Electrical / Gardening

### 9. CTA Banner

Ready to get started? / 15 minutes / Get in touch

### 10. FAQ (4 questions)

Same questions as other runs.

### 11. Footer

Same as other runs.

---

## Design Constraints

- UK English throughout
- No stock photography — geometric shapes, bold typography, abstract visuals only
- No emojis
- Mobile responsive — must work at 375px width
- Pricing toggle: interactive JavaScript
- FAQ accordion: interactive JavaScript
- Accessible: sufficient colour contrast, semantic HTML, descriptive alt text

---

## Output

Single file: index.html
Save to the current working directory.
Do not create supporting files, do not use a build step.
