# Run R2-D: Warm Teal & Coral — Geometric Hero

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

This is a T3 DNA clone. Every design decision below must be followed precisely. Only the hero and colour palette differ.

### Fonts

```
https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=Inter:wght@400;500;600&display=swap
--font-display: 'Space Grotesk', sans-serif;
--font-body: 'Inter', sans-serif;
```

### Easing + animation

```css
--ease-out: cubic-bezier(0.16, 1, 0.3, 1);

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

Staggered hero delays: label 0.2s, h1 0.35s, sub 0.5s, CTAs 0.65s, visual elements 0.6s/0.75s/0.9s/1.05s.

### Section layout patterns (preserve)

- How It Works: 4-col grid, even cards `translateY(2rem)`
- What's Included: 3-col grid, cards 2+5 `translateY(1.5rem)`
- Work card 2: `translateY(2rem)`, hover `rotate(-0.5deg)`
- Testimonials: rotated/offset as per T3
- Examples: `1.2fr 0.8fr` asymmetric grid, first tile spans 2 rows
- Skewed section `::before` backgrounds: `skewY(-2deg)`

### Card styles (preserve)

- Border radius: 20px step/included, 24px pricing/work/testimonial
- Included card left accent bar: 4px, height 0→100% on hover
- All hover transitions: 0.3–0.4s var(--ease-out)

---

## Colour Palette — THIS RUN: Warm Teal & Coral

```css
:root {
  --primary: #537d96; /* Dusk blue — main brand */
  --primary-deep: #3d6070;
  --primary-light: #6b9ab5;
  --accent: #ec8f8d; /* Soft coral */
  --accent-hover: #d97a78;
  --support: #44a194; /* Teal */
  --support-dark: #349587;
  --bg: #f4f0e4; /* Warm ivory */
  --white: #ffffff;
  --gray-100: #f0ece0;
  --gray-200: #e4dfd0;
  --gray-400: #9a9590;
  --gray-600: #6b6560;
  --gray-800: #2c2820;

  --font-display: "Space Grotesk", sans-serif;
  --font-body: "Inter", sans-serif;
  --ease-out: cubic-bezier(0.16, 1, 0.3, 1);
}
body {
  background: var(--bg);
}
```

Wherever T3 used `var(--indigo)`, use `var(--primary)`.
Wherever T3 used orange accent, use `var(--accent)` (coral).
Wherever T3 used teal, use `var(--support)`.
Wherever T3 used cream, use `var(--bg)`.

Pricing section background: `var(--primary)`.
CTA banner inner: `var(--primary)`.
Featured testimonial card: `var(--primary)`.

---

## Hero — THIS RUN: Geometric Blocks

Two-column grid (text left, visual right). Keep the `::before` diagonal skew in `var(--primary)`.

### Hero geometric composition (right column)

```css
.hero-geometric {
  width: 100%;
  max-width: 460px;
  aspect-ratio: 4/3;
  position: relative;
}
```

4 shapes, each animates in with fadeSlideUp:

```
Shape 1: 260px × 260px, background var(--primary) opacity 0.85, top 8% left 5%, border-radius 6px, delay 0.6s
Shape 2: 160px × 160px, background var(--accent), top 0 right 8%, border-radius 6px, transform rotate(15deg), delay 0.75s
Shape 3: 120px × 120px, background var(--support) opacity 0.7, bottom 12% left 25%, border-radius 6px, transform rotate(-10deg), delay 0.9s
Shape 4: 70px × 70px, border 3px solid var(--support), bottom 28% right 5%, border-radius 6px, transform rotate(25deg), background transparent, delay 1.05s
```

All shapes: `position: absolute; transition: transform 0.6s var(--ease-out);`

On mobile: hide hero visual.

---

## Page Sections

### 1. Header / Navigation

Logo "DCS", nav: Services, Our Work, Examples, About, Blog, CTA "Get in touch". Sticky + hamburger.

### 2. Hero

Headline: Websites as professional as you are
Subheading: You tell us about your business. We handle design, copy, hosting, and everything else.
CTAs: "See how it works" + "View our work"
Visual: geometric blocks as above.

### 3. How It Works (4 steps)

Tell us about your business / We write and design it / We build and launch it / We look after it

### 4. What's Included (6 items)

Design / Copy / Build / Hosting / Security / Support

### 5. Pricing (3 tiers, toggle)

Starter: £995 + £29/mo upfront | £59/mo monthly
Professional: £1,995 + £39/mo | £99/mo
Growth: £3,495 + £59/mo | £149/mo
Small print: local SEO, custom domain, SSL, hosting included. No CMS.

### 6. Recent Work

Colossus Scaffolding / DJ Fox Electrical / Bexhill Removals. Link: "See all our work →"

### 7. Testimonials (3)

Paul (Scaffolding) / Sarah (Fabric Retailer) / Mark (Electrician)

### 8. See What's Possible (3 tiles)

Plumbing / Electrical / Gardening. Link: "Browse all examples →"

### 9. CTA Banner

Ready to get started? / 15 minutes. CTA: "Get in touch"

### 10. FAQ (4)

How long / Need to provide anything / Changes after live / Cancel

### 11. Footer

Logo + strapline, nav, contact, legal, copyright © 2025 Digital Consulting Services.

---

## Design Constraints

- UK English throughout
- No stock photography
- No emojis
- Mobile responsive — 375px minimum
- Pricing toggle: interactive JavaScript
- FAQ accordion: interactive JavaScript
- Accessible: sufficient contrast, semantic HTML, alt text

---

## Output

Single file: index.html. Save to current working directory.
