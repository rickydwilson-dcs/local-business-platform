# DESIGN.md -- Digital Consulting Services

## Archetype: Tactical Telemetry (Dark)

**Project:** digitalconsultingservices.co.uk
**Classification:** Digital consulting agency -- web platform development, AI automation services
**Substrate:** Dark CRT Terminal -- no light mode, no mixed substrates

---

## 1. Visual Theme & Atmosphere

A deactivated command terminal reactivating. The interface projects the feeling of a classified systems console -- high-density data readouts, monospaced telemetry, and vast negative space framing massive structural typography. The agency doesn't sell "websites" -- it deploys systems. Every element reinforces mechanical precision and operational authority.

**Density:** 4/10 -- editorial breathing room, not cockpit-dense. This is an agency site, not a dashboard.
**Variance:** 5/10 -- asymmetric grid breaks and unexpected scale shifts, but predictable navigation.
**Motion Intent:** 3/10 -- cursor blink, subtle phosphor glow on hover, staggered text reveal on scroll. No cinematic transitions.

---

## 2. Color Palette

### Substrate

| Token                     | Hex       | Usage                                            |
| ------------------------- | --------- | ------------------------------------------------ |
| `surface.background`      | `#0A0A0A` | CRT black. Primary canvas. Never pure `#000000`. |
| `surface.foreground`      | `#EAEAEA` | White phosphor. All body text.                   |
| `surface.muted`           | `#161616` | Elevated panels, card backgrounds, input fields. |
| `surface.mutedForeground` | `#777777` | Secondary text, metadata, timestamps.            |
| `surface.card`            | `#111111` | Card/module backgrounds.                         |
| `surface.cardBorder`      | `#2A2A2A` | 1px solid borders for compartmentalization.      |

### Brand

| Token                | Hex       | Usage                                                                                                 |
| -------------------- | --------- | ----------------------------------------------------------------------------------------------------- |
| `brand.primary`      | `#FF2A2A` | Aviation Red. CTAs, active states, vital data highlights, structural dividing lines. The ONLY accent. |
| `brand.primaryHover` | `#CC2222` | Darkened red for hover/active states.                                                                 |
| `brand.secondary`    | `#EAEAEA` | White phosphor doubles as secondary brand.                                                            |
| `brand.accent`       | `#FF2A2A` | Alias to primary. No second accent color.                                                             |

### Semantic

| Token              | Hex       | Usage                                                                                                            |
| ------------------ | --------- | ---------------------------------------------------------------------------------------------------------------- |
| `semantic.success` | `#4AF626` | Terminal green. Used ONLY for status indicators (e.g., "SYSTEM ONLINE", deployment status). Never as text color. |
| `semantic.warning` | `#FF2A2A` | Red serves double duty.                                                                                          |
| `semantic.error`   | `#FF2A2A` | Same red.                                                                                                        |
| `semantic.info`    | `#EAEAEA` | White phosphor.                                                                                                  |

### Overlay

| Token             | Value                       | Usage                         |
| ----------------- | --------------------------- | ----------------------------- |
| `overlay.dark`    | `rgba(10, 10, 10, 0.9)`     | Modal backdrops.              |
| `overlay.light`   | `rgba(234, 234, 234, 0.05)` | Subtle hover states on cards. |
| `overlay.primary` | `rgba(255, 42, 42, 0.15)`   | Red glow for focus states.    |

---

## 3. Typography

### Heading (Macro-Typography)

- **Font:** `Space Grotesk` (weight 700)
- **Fallback:** `'Space Grotesk', system-ui, -apple-system, sans-serif`
- **H1 scale:** `clamp(3rem, 8vw, 8rem)` -- viewport-bleeding structural blocks
- **H2 scale:** `clamp(2rem, 5vw, 4rem)`
- **H3 scale:** `clamp(1.25rem, 3vw, 2rem)`
- **Tracking:** `-0.04em` (H1), `-0.02em` (H2-H3)
- **Leading:** `0.9` (H1), `1.0` (H2), `1.1` (H3)
- **Casing:** Uppercase for H1 only. Sentence case for H2/H3.
- **Color:** `#EAEAEA` (white phosphor)

### Body

- **Font:** `Geist` (weight 400, 500 for emphasis)
- **Fallback:** `'Geist', system-ui, -apple-system, sans-serif`
- **Scale:** `1rem` (16px base)
- **Leading:** `1.6`
- **Tracking:** `0`
- **Color:** `#EAEAEA` at 85% opacity for body, full opacity for emphasis

### Data / Telemetry (Micro-Typography)

- **Font:** `Geist Mono` (weight 400)
- **Fallback:** `'Geist Mono', 'JetBrains Mono', 'Courier New', monospace`
- **Scale:** `0.75rem` to `0.875rem` (12-14px)
- **Tracking:** `0.08em` -- generous mechanical spacing
- **Leading:** `1.3`
- **Casing:** Uppercase exclusively
- **Color:** `#777777` (muted foreground)
- **Usage:** Navigation labels, metadata, service IDs, footer data, breadcrumbs, timestamps

### Banned Fonts

Inter, Roboto, Arial, Open Sans, Helvetica, Comic Sans, Papyrus.

---

## 4. Layout & Spatial Engineering

### Grid System

- **Primary:** CSS Grid, 12-column, `gap: 1px` with `#2A2A2A` parent background to create razor-thin dividing lines
- **Max width:** `1400px` centered
- **Section padding:** `py-24` to `py-32` (6rem-8rem) -- generous vertical rhythm
- **Container padding:** `px-6` (mobile), `px-8` (tablet), `px-12` (desktop)

### Compartmentalization

- All content zones bounded by `1px solid #2A2A2A` borders
- Horizontal rules span full container width between major sections
- Cards have zero border-radius, 1px borders, no shadows
- Data clusters use `gap: 1px` grid technique for internal dividers

### Bimodal Density

- **Hero/headings:** Vast negative space. H1 occupies 60-80% of viewport height.
- **Service grid / data sections:** Tight monospace clusters with minimal padding (`p-4` to `p-6`)
- No middle ground. Either breathing room or packed data.

### Geometry

- `border-radius: 0` on everything. Buttons, cards, inputs, images. No exceptions.
- 90-degree corners enforce mechanical rigidity throughout.

### Responsive

- Mobile-first collapse to single column
- Typography scales via `clamp()` -- no breakpoint font-size jumps
- Touch targets: minimum 44px
- Test at 375px, 768px, 1440px

---

## 5. Component Patterns

### Navigation (Header)

```
[ DCS ]  SYS.001 SERVICES  SYS.002 PORTFOLIO  SYS.003 ABOUT  SYS.004 CONTACT    [ INITIATE CONTACT ]
```

- Dark header, full-width, 1px bottom border
- Logo: "DCS" in Space Grotesk Bold, bracketed `[ DCS ]`
- Nav items: Geist Mono uppercase, 0.75rem, generous tracking
- Prefixed with system IDs: `SYS.001`, `SYS.002` etc. in muted foreground
- CTA button: red background, white text, zero radius, uppercase mono
- Mobile: full-screen overlay, staggered reveal, monospaced menu items

### Hero Section

```
DIGITAL_
CONSULTING_
SERVICES > _

We build the platform. You build the business.

SYS.STATUS: ONLINE          EST. 2015          UNIT: UK-001
< INITIATE CONTACT >                                v2.6
```

- H1: massive `clamp(3rem, 8vw, 8rem)`, uppercase, tight tracking
- Cursor blink animation on trailing underscore (`_`)
- Subtitle: Geist, normal case, 1.25rem, muted white
- Status bar: monospace data strip at bottom of hero with metadata
- CTA: Aviation Red background, ASCII-bracketed label
- No hero image. Typography IS the hero.

### Service Cards

```
+------------------------------------------+
| SYS.001                         ACTIVE   |
|                                          |
| PLATFORM                                 |
| WEBSITES                                 |
|                                          |
| Custom sites deployed on our             |
| proprietary platform. Fast, themed,      |
| SEO-optimized.                           |
|                                          |
| > DEPLOY                        REV 2.6 |
+------------------------------------------+
```

- Grid: 2-column (desktop), 1-column (mobile)
- Zero radius, 1px `#2A2A2A` border
- Service ID in Geist Mono muted (`SYS.001`)
- Status indicator: `ACTIVE` with terminal green dot
- Title: Space Grotesk, H3 scale, sentence case
- Body: Geist, normal, muted white
- Footer: action link + revision marker in monospace
- Hover: border transitions to `#FF2A2A`, subtle red glow

### CTA Sections

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
READY TO DEPLOY?
< INITIATE CONTACT >
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

- Full-width band, `#111111` background
- Heavy horizontal rules (2px `#FF2A2A`) top and bottom
- Centered H2 in Space Grotesk
- Single CTA button, ASCII-bracketed

### Buttons

- **Primary:** `bg-[#FF2A2A] text-white` zero radius, uppercase Geist Mono, `px-6 py-3`
- **Secondary:** `border-1 border-[#2A2A2A] text-[#EAEAEA]` zero radius, uppercase Geist Mono
- **Ghost:** text only, underline on hover, monospace
- All buttons use ASCII brackets in label: `[ ENQUIRE ]`, `< DEPLOY >`
- Hover: slight brightness shift, no transform/scale effects

### Footer

```
+------------------+------------------+------------------+
| [ DCS ]          | SYS.001 PLATFORM | COORDINATES      |
| Digital          | SYS.002 AI AUTO  | UK-001           |
| Consulting       | SYS.003 eCOMM    | digitalconsulting |
| Services         | SYS.004 DESIGN   | services.co.uk   |
|                  | SYS.005 SEO      |                  |
| EST. 2015        | SYS.006 SUPPORT  | STATUS: ONLINE   |
+------------------+------------------+------------------+
| (C) 2026 DIGITAL CONSULTING SERVICES    REV 2.6       |
+---------------------------------------------------------+
```

- 3-column grid with visible 1px dividers
- All text in Geist Mono, uppercase, small scale
- System IDs for services
- Coordinates section with location data
- Bottom bar: copyright with revision marker

### Contact Form

- Inputs: zero radius, 1px `#2A2A2A` border, `#111111` background
- Labels: Geist Mono uppercase, above input (never floating/inside)
- Focus state: border transitions to `#FF2A2A`
- Submit button: Aviation Red, full-width on mobile
- Form wrapped in compartmentalized grid section

### Portfolio/Examples Cards

```
+------------------------------------------+
| DEPLOYMENT: DJ-FOX-ELECTRICAL            |
| THEME: ORION          STATUS: LIVE       |
|                                          |
| [screenshot area -- 16:9]               |
|                                          |
| Electrical contractor. 46 service pages, |
| full SEO, dark theme with red accents.   |
|                                          |
| > VIEW DEPLOYMENT              UNIT.001 |
+------------------------------------------+
```

- Similar structure to service cards
- Screenshot/preview image area (zero radius)
- Deployment metadata in monospace header
- Theme name and status as data fields

---

## 6. Textural Effects (CSS)

### CRT Scanlines (global)

```css
body::after {
  content: "";
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: 9999;
  background: repeating-linear-gradient(
    0deg,
    transparent,
    transparent 2px,
    rgba(0, 0, 0, 0.08) 2px,
    rgba(0, 0, 0, 0.08) 4px
  );
}
```

### Phosphor Glow (hover effect on interactive elements)

```css
.phosphor-glow:hover {
  text-shadow: 0 0 8px rgba(234, 234, 234, 0.3);
}
```

### Red Alert Glow (CTA focus)

```css
.red-alert:focus {
  box-shadow:
    0 0 0 1px #ff2a2a,
    0 0 12px rgba(255, 42, 42, 0.2);
}
```

### Cursor Blink (hero underscore)

```css
@keyframes cursor-blink {
  0%,
  50% {
    opacity: 1;
  }
  51%,
  100% {
    opacity: 0;
  }
}
.cursor-blink {
  animation: cursor-blink 1s step-end infinite;
}
```

### Mechanical Noise (optional -- subtle grain)

```css
body::before {
  content: "";
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: 9998;
  opacity: 0.03;
  background-image: url("data:image/svg+xml,..."); /* SVG noise pattern */
}
```

---

## 7. Symbology & Decoration

### ASCII Framing

- Navigation items: `SYS.001 SERVICES`
- CTA buttons: `[ ENQUIRE ]` or `< INITIATE CONTACT >`
- Section headers: `/// SERVICES` or `[ PORTFOLIO ]`

### Industrial Markers

- Revision markers: `REV 2.6` in footer/card corners
- Unit IDs: `UNIT / UK-001`, `UNIT.001`
- Status indicators: `STATUS: ONLINE` with green dot
- Copyright as structural element: `(C) 2026 DIGITAL CONSULTING SERVICES`

### Data Readouts

- Stats displayed as monospace data: `SITES DEPLOYED: 047`, `UPTIME: 99.9%`
- Timestamps: `2026.04.08` format (not "April 8th, 2026")

---

## 8. Motion & Interaction

### Permitted

- Cursor blink on hero underscore (CSS `step-end` animation)
- Phosphor glow on text hover (`text-shadow` transition, 200ms)
- Border color transition on card hover (to `#FF2A2A`, 150ms)
- Staggered text reveal on scroll (opacity + translateY, 50ms stagger per line)
- Status indicator pulse (terminal green, subtle `scale` oscillation)

### Prohibited

- No parallax scrolling
- No 3D transforms or perspective
- No spring physics or elastic easing
- No page transitions or route animations
- No auto-playing video or animated backgrounds
- No hover scale/lift effects on cards
- All transitions: `ease-out` or `linear` only. No `ease-in-out`.

### Timing

- Hover transitions: `150ms ease-out`
- Scroll reveals: `300ms ease-out`, 50ms stagger
- Focus rings: `100ms ease-out`

---

## 9. Anti-Patterns (Banned)

- Border-radius on anything (zero everywhere)
- Gradients (linear, radial, conic -- all banned)
- Box shadows (use borders instead)
- Translucent/glassmorphism panels
- Image-overlay heroes (typography IS the hero)
- Centered symmetrical 3-column equal grids
- Rounded pill buttons
- Emoji in any context
- Stock photography (use screenshots of deployed sites only)
- Decorative illustrations or icons
- Soft/warm color palettes
- Light mode or mixed-mode sections
- Inter, Roboto, or any banned font
- Inline styles or CSS-in-JS
- `border-radius` values greater than `0`
