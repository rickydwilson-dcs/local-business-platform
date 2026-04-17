# Run R2-G: Citrus — Geometric Hero

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

T3 DNA clone. Preserve everything — only hero and palette change.

### Fonts + easing

```
Space Grotesk (display) + Inter (body)
--ease-out: cubic-bezier(0.16, 1, 0.3, 1);
@keyframes fadeSlideUp { from { opacity:0; transform:translateY(30px); } to { opacity:1; transform:translateY(0); } }
```

Staggered hero delays: label 0.2s, h1 0.35s, sub 0.5s, CTAs 0.65s, visual 0.6s/0.75s/0.9s/1.05s.

### Preserve all section layouts

- How It Works: 4-col grid, even cards translateY(2rem)
- What's Included: 3-col grid, cards 2+5 translateY(1.5rem)
- Work: card 2 translateY(2rem), hover rotate(-0.5deg)
- Testimonials: rotated/offset cards
- Examples: 1.2fr/0.8fr asymmetric, first tile spans 2 rows
- Section skew backgrounds: skewY(-2deg)

### Preserve all card styles

- 20px radius step/included, 24px pricing/work/testimonials
- Included: left accent bar 0→100% height on hover
- Hover: 0.3–0.4s var(--ease-out)

---

## Colour Palette — THIS RUN: Citrus

Pale grapefruit background, near-black primary, tangerine accent, lime support. Fresh, high-energy, approachable.

```css
:root {
  --primary: #1a1a1a; /* Near-black */
  --primary-deep: #0a0a0a;
  --primary-light: #2d2d2d;
  --accent: #ff6b00; /* Tangerine */
  --accent-hover: #e05f00;
  --support: #7cb518; /* Lime green */
  --support-dark: #6ba015;
  --bg: #fdf0e8; /* Pale grapefruit */
  --white: #ffffff;
  --gray-100: #f8ebe0;
  --gray-200: #f0ddd0;
  --gray-400: #9a9590;
  --gray-600: #5a5450;
  --gray-800: #2a2420;

  --font-display: "Space Grotesk", sans-serif;
  --font-body: "Inter", sans-serif;
  --ease-out: cubic-bezier(0.16, 1, 0.3, 1);
}
body {
  background: var(--bg);
}
```

Map: indigo→primary (near-black), orange→accent (tangerine), teal→support (lime).
Pricing section bg: `var(--primary)`.
CTA banner inner: `var(--primary)`.
Featured testimonial card: `var(--primary)`.

On dark (near-black) backgrounds: white text, use `var(--accent)` for highlights, `var(--support)` for labels.

---

## Hero — THIS RUN: Geometric Blocks

Two-column grid. `::before` diagonal skew in `var(--primary)` (near-black). Geometric block composition right.

4 shapes — vibrant citrus on dark:

```
Shape 1: 260px × 260px, background var(--primary) opacity 0.92, top 8% left 5%, border-radius 4px, delay 0.6s
Shape 2: 165px × 165px, background var(--accent) (tangerine), top 0 right 8%, border-radius 4px, rotate(13deg), delay 0.75s
Shape 3: 125px × 125px, background var(--support) (lime) opacity 0.85, bottom 12% left 23%, border-radius 4px, rotate(-8deg), delay 0.9s
Shape 4: 72px × 72px, border 3px solid var(--accent), bottom 27% right 6%, border-radius 4px, rotate(21deg), background transparent, delay 1.05s
```

All: `position: absolute; opacity: 0; animation: fadeSlideUp 0.6s var(--ease-out) [delay] forwards;`

On mobile: hide visual, single column.

### Hero text on this palette

- H1: `var(--primary)` (near-black) for strong contrast on pale grapefruit bg
- Hero label: `var(--accent)` (tangerine)
- em underline: `var(--accent)` at 0.3 opacity
- Primary CTA: `var(--primary)`
- Outline CTA: border + text `var(--primary)`
- On mobile (dark skew covers text): h1 white, sub rgba(255,255,255,0.85)

---

## Page Sections

### 1. Header: DCS, nav, CTA. Sticky + hamburger.

### 2. Hero: Geometric blocks. "Websites as professional as you are". CTAs: "See how it works" + "View our work"

### 3. How It Works: Tell us / Write and design / Build and launch / Look after it

### 4. What's Included: Design / Copy / Build / Hosting / Security / Support

### 5. Pricing (toggle): Starter £995+£29/£59mo | Professional £1,995+£39/£99mo | Growth £3,495+£59/£149mo. No CMS note.

### 6. Recent Work: Colossus Scaffolding / DJ Fox Electrical / Bexhill Removals

### 7. Testimonials: Paul / Sarah / Mark

### 8. Examples: Plumbing / Electrical / Gardening

### 9. CTA Banner: Ready to get started? / 15 minutes / Get in touch

### 10. FAQ: How long / Need to provide / Changes / Cancel

### 11. Footer: full nav, mail@digitalconsultingservices.co.uk | 07395 063764, Privacy/Terms/Cookies, © 2025

---

## Design Constraints

UK English. No photography. No emojis. Responsive 375px+. Pricing toggle JS. FAQ accordion JS. Accessible contrast.

## Output

Single file: index.html. Save to current working directory.
