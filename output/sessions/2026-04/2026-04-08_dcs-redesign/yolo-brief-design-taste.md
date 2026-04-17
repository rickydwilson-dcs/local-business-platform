# YOLO Brief: DCS — design-taste-frontend (Theme: Sirius)

**Skill:** design-taste-frontend (DESIGN_VARIANCE: 8, MOTION_INTENSITY: 6, VISUAL_DENSITY: 4)
**Theme name:** `sirius` (next after polaris in constellation namespace)
**Site slug:** `dcs-design-taste`
**Branch:** Must be on `develop`
**Session:** `output/sessions/2026-04-08_dcs-redesign/`

---

## Context

Digital Consulting Services (digitalconsultingservices.co.uk) — the platform owner's own agency website. Pivoting from WordPress services to platform websites + AI automation.

**Business info:**

- Company: Digital Consulting Services
- Tagline: Websites as intelligent as your business
- Services: Platform Websites, AI Automation, eCommerce Solutions, Web Design, SEO & Analytics, Maintenance & Support
- Location: United Kingdom
- Est: 2015

**What already exists in the repo:**

- `sites/dcs-industrial-brutalist/` — the dark CRT terminal version (Polaris theme)
- `packages/themes/polaris/` — the brutalist dark theme
- `output/sessions/2026-04-08_dcs-redesign/DESIGN.md` — the brutalist design spec (for reference only — do NOT copy it)

**Your job:** Build a completely different design direction using the `design-taste-frontend` skill rules. This should feel like a premium tech agency, not a terminal. Think high variance (8), fluid motion (6), editorial breathing room (4). The design-taste-frontend skill IS your design spec — apply its rules directly.

---

## Skill Rules (Apply These Throughout)

You are operating as a senior UI/UX engineer with these active settings:

- **DESIGN_VARIANCE: 8** — asymmetric masonry CSS Grid, fractional units, massive empty zones
- **MOTION_INTENSITY: 6** — fluid CSS transitions (`cubic-bezier(0.16, 1, 0.3, 1)`), `animation-delay` cascades, `transform`/`opacity` only
- **VISUAL_DENSITY: 4** — normal spacing, cards used purposefully, generous section gaps

**Non-negotiable rules from the skill:**

- NO Inter font. Use `Space Grotesk` (headings) + `Geist` (body) — both already in scope for DCS
- NO 3-column equal card layouts — use 2-column zig-zag or asymmetric grid
- NO centered hero — force left-aligned or split-screen layout (DESIGN_VARIANCE > 4)
- NO `h-screen` — use `min-h-[100dvh]`
- NO pure black — use off-black (`#0D0D0D`, `zinc-950`)
- NO neon/outer glows — inner borders and tinted shadows only
- NO fake numbers — use organic data (e.g. "47 sites deployed", not "50+")
- Anti-emoji policy: ZERO emojis anywhere
- Forms: label sits above input, `gap-2` blocks, inline error states
- Cards: only when elevation communicates hierarchy, tint shadow to bg hue
- Tactile feedback: `:active` uses `scale-[0.98]` or `-translate-y-[1px]`
- Mobile: all asymmetric layouts collapse to single-column `w-full px-4` below `768px`
- `min-h-[100dvh]` not `h-screen` on hero sections

---

## Step 1: Preflight

```bash
git branch --show-current  # Must be: develop
git status --porcelain     # Warn if dirty, continue anyway
```

---

## Step 2: Create `packages/themes/sirius/`

### 2a — Design decisions for Sirius theme

Sirius is the "premium tech agency" counterpoint to Polaris's brutalist terminal. Apply these tokens — derived from the design-taste-frontend skill's anti-slop palette rules:

```
Surface: Off-white (#FAFAFA) or very light zinc (#F4F4F5) — NOT pure white
Foreground: Off-black (#0D0D0D) — NOT pure black
Brand primary: Deep Indigo or Electric Teal — one saturated accent, <80% saturation
  Suggestion: #2563EB (electric blue) or #0D9488 (teal) — pick whichever feels sharper
Muted: zinc-100 (#F4F4F5) for elevated surfaces
Muted foreground: zinc-500 (#71717A)
Card: white (#FFFFFF) with zinc-200/50 border and tinted diffusion shadow
```

**Typography:**

- Heading: `Space Grotesk` Bold — `tracking-tighter leading-none` at display scale
- Body: `Geist` — `leading-relaxed max-w-[65ch]`
- Mono: `Geist Mono` — for data readouts and code

**Component registry:**

```typescript
export const siriusRegistry: ComponentRegistry = {
  theme: "sirius",
  heroVariant: "split", // asymmetric split — left content, right visual
  headerVariant: "light",
  cardVariant: "standard",
  sectionVariant: "standard",
};
```

### 2b — Write `packages/themes/sirius/index.ts`

Follow orion/vega/polaris pattern. Read `packages/themes/polaris/index.ts` first to match structure.

### 2c — Write `packages/themes/sirius/globals.css`

Copy `packages/themes/vega/globals.css` verbatim, update the header comment to identify sirius. No CRT effects — this is a clean light theme.

### 2d — Add "sirius" to THEME_NAMES

Edit `packages/theme-system/src/types.ts`:

```typescript
// Add "sirius" alphabetically:
export const THEME_NAMES = [
  "atlas",
  "cygnus",
  "lyra",
  "nova",
  "orion",
  "polaris",
  "rigel",
  "sirius",
  "vega",
] as const;
```

### 2e — Register in showcase

Edit `sites/showcase/lib/register-all-themes.ts` — add:

```typescript
import "@platform/themes/sirius";
```

---

## Step 3: Scaffold `sites/dcs-design-taste`

```bash
cp -r sites/base-template sites/dcs-design-taste
rm -rf sites/dcs-design-taste/node_modules sites/dcs-design-taste/.next sites/dcs-design-taste/.turbo
```

Update `sites/dcs-design-taste/package.json` — change `name` to `"dcs-design-taste"`.

---

## Step 4: Wire Theme

**`sites/dcs-design-taste/theme.config.ts`** — replace entirely:

```typescript
import type { DeepPartialThemeConfig } from "@platform/theme-system";
import { siriusRegistry, siriusDefaultConfig } from "@platform/themes/sirius";

export const themeConfig: DeepPartialThemeConfig = {
  componentRegistry: siriusRegistry,
  ...siriusDefaultConfig,
};
```

---

## Step 5: Configure `sites/dcs-design-taste/site.config.ts`

Read the file first, then update key values:

- `slug`: `'dcs-design-taste'`
- `domain`: `'digitalconsultingservices.co.uk'`
- `name`: `'Digital Consulting Services'`
- `tagline`: `'Websites as intelligent as your business'`
- `business.type`: `'ProfessionalService'`
- Navigation: Services, Portfolio (`/projects`), About, Contact — no Locations
- `features.blog`: `true`
- Remove/empty: `serviceAreas`, `serviceAreaRegions`, `credentials.insurance`

---

## Step 6: Rewrite `globals.css`

```css
@import "../../../packages/themes/sirius/globals.css";

@tailwind base;
@tailwind components;
@tailwind utilities;

/**
 * DCS — Sirius Theme (design-taste-frontend)
 */

@layer base {
  html {
    scroll-behavior: smooth;
  }
  body {
    font-family: var(--font-geist), system-ui, sans-serif;
    @apply bg-surface-background text-surface-foreground;
    font-feature-settings:
      "rlig" 1,
      "calt" 1;
    -webkit-font-smoothing: antialiased;
  }
  h1,
  h2,
  h3,
  h4 {
    font-family: var(--font-space-grotesk), system-ui, sans-serif;
  }
  .font-mono,
  code,
  samp {
    font-family: var(--font-geist-mono), monospace;
  }
}
```

---

## Step 7: Rewrite `layout.tsx`

Use `next/font/google` for Space Grotesk, Geist, Geist Mono:

```tsx
import type { Metadata, Viewport } from "next";
import { Space_Grotesk, Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { siteConfig } from "@/site.config";
import { ThemeProvider } from "@platform/core-components";
import { siriusRegistry } from "@platform/themes/sirius";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  display: "swap",
  weight: ["400", "500", "600", "700"],
});
const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist",
  display: "swap",
  weight: ["400", "500"],
});
const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
  display: "swap",
  weight: ["400"],
});

export const metadata: Metadata = {
  title: { default: siteConfig.name, template: `%s | ${siteConfig.name}` },
  description: siteConfig.tagline,
};
export const viewport: Viewport = { width: "device-width", initialScale: 1, maximumScale: 5 };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en-GB"
      className={`${spaceGrotesk.variable} ${geist.variable} ${geistMono.variable}`}
    >
      <body className="min-h-screen flex flex-col bg-[#FAFAFA]">
        <ThemeProvider theme="sirius" registry={siriusRegistry}>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
```

---

## Step 8: Build the 5 TSX Pages

Apply ALL design-taste-frontend rules. Light theme. No CRT effects.

**Nav pattern (inline on every page):**

- Floating pill nav: `fixed top-6 left-1/2 -translate-x-1/2 z-50`
- Background: `bg-white/80 backdrop-blur-md` with `ring-1 ring-black/5`
- Logo: "DCS" in Space Grotesk bold, left of nav links
- Links: Geist, small, `text-zinc-600 hover:text-zinc-900`
- CTA button: brand primary bg, white text, `rounded-full px-5 py-2`, button-in-button trailing icon
- Mobile: hamburger that morphs to X, full-screen overlay with staggered link reveals

**Footer pattern (inline on every page):**

- Clean 3-column grid on `bg-[#0D0D0D]` (dark footer, light site)
- Column 1: DCS wordmark + tagline in zinc-400
- Column 2: Service links in zinc-400
- Column 3: Contact data + status in zinc-400
- Bottom bar: copyright in zinc-600, `text-xs`

### Page 1: `app/page.tsx` (Home)

**Apply DESIGN_VARIANCE: 8 — asymmetric layout.**

Sections:

1. **Nav** (floating pill)
2. **Hero** — `min-h-[100dvh]` asymmetric split:
   - Left 60%: H1 `text-4xl md:text-7xl tracking-tighter leading-none font-bold`, left-aligned
   - H1 text: "We build the platform.\nYou build the\nbusiness."
   - Subtitle below in Geist `text-zinc-600 leading-relaxed max-w-[45ch]`
   - CTA: primary button + ghost secondary button, left-aligned, `gap-4`
   - Eyebrow tag above H1: `"EST. 2015 · UNITED KINGDOM"` as pill badge
   - Right 40%: asymmetric grid of 3 small stat cards stacked/offset — organic data:
     - `47 sites deployed`
     - `99.3% uptime`
     - `23 active clients`
   - Each stat card: white bg, `ring-1 ring-zinc-200/50`, diffusion shadow, `rounded-2xl`, generous padding
   - Staggered entrance: cards reveal with `animation-delay` cascade (0ms, 150ms, 300ms)
3. **Divider**
4. **Services section** — `/// SERVICES` eyebrow, H2, then asymmetric 2-column zig-zag grid:
   - Odd services: content left, visual right
   - Even services: visual left, content right
   - Each service: title (H3), description (Geist body), action link with trailing arrow icon
   - NO 3-column equal grid
5. **Divider**
6. **About strip** — horizontal strip: left large H2, right body text + link — asymmetric whitespace
7. **CTA section** — full-width `bg-[#0D0D0D]`, white text, H2 + body + pill button, `py-32`
8. **Footer**

### Page 2: `app/services/page.tsx` (Services)

Sections:

1. Nav
2. Breadcrumb: `Home / Services` — Geist small, `text-zinc-400`
3. Page hero — left-aligned H1 "Services", subtitle, eyebrow tag with service count
4. Services as zig-zag alternating layout (same as homepage services but with more detail per card)
   - Each: eyebrow with service number, H2 title, description paragraph, 3 benefits as `divide-y` list (no card boxes — pure negative space), action link
5. CTA band
6. Footer

### Page 3: `app/about/page.tsx` (About)

Sections:

1. Nav
2. Left-aligned page hero — H1 "About DCS", eyebrow "EST. 2015"
3. Asymmetric 2-column story section:
   - Left (wide): 3 prose paragraphs about DCS — platform-first approach, AI automation focus
   - Right (narrow): 4 data stats as stacked `divide-y` rows (no cards) — `47 sites`, `9 years`, `23 clients`, `v2.6 platform`. Monospace numbers, Geist labels.
4. Values — 3 items as horizontal `divide-x` strip (NOT cards): `PRECISION`, `VELOCITY`, `INTELLIGENCE` — each with a one-line description
5. CTA band
6. Footer

### Page 4: `app/contact/page.tsx` (Contact)

Sections:

1. Nav
2. Left-aligned H1 "Get in touch", eyebrow "OPEN TO NEW PROJECTS"
3. 2-column layout:
   - Left: contact form — label above input, `gap-2` blocks, `ring-1 ring-zinc-200` inputs on white bg, focus `ring-brand-primary`, brand primary submit button `rounded-full`, full-width on mobile
   - Right: contact metadata as `divide-y` list rows — email, phone, location, hours, status
4. Footer

### Page 5: `app/services/[slug]/page.tsx` (Service Detail)

Dynamic `[slug]` route — read `sites/base-template/app/services/[slug]/page.tsx` first and adapt:

- Left-aligned page hero with service title H1, system badge (service number), breadcrumb
- Prose content area for MDX — `max-w-[65ch]` body text
- Benefits as `divide-y` list (no cards)
- FAQ: `<details>`/`<summary>` pattern, numbered in `font-mono`
- CTA band
- Footer

---

## Step 9: Create Service MDX Files

Create 6 files in `sites/dcs-design-taste/content/services/`. Read `packages/core-components/src/lib/content-schemas.ts` for required frontmatter fields. 50-200 char descriptions, 3-15 FAQs.

Files: `platform-websites.mdx`, `ai-automation.mdx`, `ecommerce.mdx`, `web-design.mdx`, `seo-analytics.mdx`, `maintenance.mdx`

Tone: authoritative, concrete verbs. No "seamless", "elevate", "unleash", "next-gen".

---

## Step 10: Lockfile + Type-check

```bash
pnpm install --lockfile-only
cd sites/dcs-design-taste && npx tsc --noEmit
# Report errors, fix what you can, note what needs manual attention
```

---

## Step 11: Stage

```bash
git add packages/themes/sirius/ \
        packages/theme-system/src/types.ts \
        sites/showcase/lib/register-all-themes.ts \
        sites/dcs-design-taste/ \
        pnpm-lock.yaml
```

Do NOT commit.

---

## Step 12: Report

```
✓ Theme package:   packages/themes/sirius/
✓ THEME_NAMES:     sirius added
✓ Site:            sites/dcs-design-taste/
✓ Pages:           app/page.tsx, app/services/page.tsx, app/about/page.tsx,
                   app/contact/page.tsx, app/services/[slug]/page.tsx
✓ MDX content:     6 service files
✓ TypeScript:      [errors or "clean"]

Dev server:  cd sites/dcs-design-taste && npm run dev
```

---

## Rules

- design-taste-frontend skill rules are LAW — re-read them if unsure
- DESIGN_VARIANCE: 8 means asymmetric grids, not centered symmetry
- NO 3-column equal card grids anywhere
- NO Inter, no pure black, no neon glows
- `min-h-[100dvh]` not `h-screen`
- All motion via `transform`/`opacity` only
- Don't commit — stage only
