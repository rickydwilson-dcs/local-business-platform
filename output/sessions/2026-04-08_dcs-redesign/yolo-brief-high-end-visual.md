# YOLO Brief: DCS — high-end-visual-design (Theme: Vega Minor / Altair)

**Skill:** high-end-visual-design (Vanguard_UI_Architect — $150k agency tier)
**Theme name:** `altair` (next constellation name after sirius)
**Site slug:** `dcs-high-end`
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

**What already exists:**

- `sites/dcs-industrial-brutalist/` — dark CRT terminal version
- `sites/dcs-design-taste/` — premium tech agency, light theme, asymmetric
- `packages/themes/polaris/` — brutalist dark
- `packages/themes/sirius/` — design-taste light

**Your job:** Build a third, distinctly different design direction as a `$150k agency-level` digital experience. The high-end-visual-design skill IS your design spec. Apply its Variance Engine — pick ONE Vibe Archetype and ONE Layout Archetype and commit to them fully.

---

## Skill Rules (Apply These Throughout)

You are operating as `Vanguard_UI_Architect`. Apply these rules without exception:

### Absolute Zero — Banned:

- Fonts: Inter, Roboto, Arial, Open Sans, Helvetica
- Icons: thick-stroked Lucide/FontAwesome/Material — use Phosphor Light or Remix Line only (check package.json first; install if missing)
- Borders: generic 1px solid gray
- Shadows: harsh dark drop shadows (`shadow-md`, `rgba(0,0,0,0.3)`)
- Layouts: edge-to-edge sticky nav, symmetrical 3-column Bootstrap grids
- Motion: `linear` or `ease-in-out` — use custom cubic-bezier curves only

### Creative Variance Engine — PICK ONE of each:

**Vibe Archetypes (choose based on what's most distinctive from the other two DCS sites):**

1. **Ethereal Glass** — OLED black (`#050505`), radial mesh gradient orbs, Vantablack cards, `backdrop-blur-2xl`, white/10 hairlines, wide geometric Grotesk
2. **Editorial Luxury** — Warm creams (`#FDFBF7`), muted sage/espresso tones, high-contrast variable Serif for massive headings, CSS film-grain overlay (`opacity-[0.03]`)
3. **Soft Structuralism** — Silver-grey or white bg, massive bold Grotesk, airy floating components, unbelievably soft diffused ambient shadows

**Recommendation:** Choose **Editorial Luxury** — the brutalist version is dark/mechanical, design-taste is clean/techy. Editorial Luxury gives a premium human feel that's completely different from both.

**Layout Archetypes:**

1. **Asymmetrical Bento** — masonry CSS Grid, `col-span-8 row-span-2` next to stacked `col-span-4`
2. **Z-Axis Cascade** — stacked overlapping cards, subtle rotations (`-2deg`, `3deg`), varying depths
3. **Editorial Split** — massive typography left half, interactive scrollable image pills right

**Recommendation:** Choose **Editorial Split** — pairs perfectly with Editorial Luxury. Left: massive serif headings. Right: interactive service/portfolio preview cards.

### Component rules:

- **Double-Bezel (Doppelrand)** on every card — outer shell (`ring-1 ring-black/5`, `p-1.5`, `rounded-[2rem]`) wrapping inner core (own bg, `shadow-[inset_0_1px_1px_rgba(255,255,255,0.15)]`, `rounded-[calc(2rem-0.375rem)]`)
- **Button-in-Button** on CTAs — trailing icon in its own `w-8 h-8 rounded-full bg-black/5` wrapper
- **Eyebrow tags** before every H1/H2: `rounded-full px-3 py-1 text-[10px] uppercase tracking-[0.2em]`
- Section padding minimum `py-24`, target `py-32`–`py-40`
- `min-h-[100dvh]` never `h-screen`

### Motion rules:

- Custom cubic-bezier on all transitions: `cubic-bezier(0.32, 0.72, 0, 1)` or `cubic-bezier(0.16, 1, 0.3, 1)`
- Scroll entry: elements enter as `translate-y-16 blur-md opacity-0` → `translate-y-0 blur-0 opacity-100` over 800ms
- Button hover: `active:scale-[0.98]`, inner icon `group-hover:translate-x-1 group-hover:-translate-y-[1px]`
- NO `linear`, NO `ease-in-out`
- Animate only `transform` and `opacity`
- `backdrop-blur` only on fixed/sticky elements

---

## Step 1: Preflight

```bash
git branch --show-current  # Must be: develop
git status --porcelain     # Warn if dirty, continue
```

---

## Step 2: Create `packages/themes/altair/`

### Design tokens for Altair (Editorial Luxury):

```
Surface background:  #FDFBF7  (warm cream)
Surface foreground:  #1A1A18  (warm near-black)
Surface muted:       #F5F2EC  (slightly darker cream for elevated surfaces)
Muted foreground:    #6B6860  (warm gray)
Card:                #FFFFFF
Card border:         rgba(26, 26, 24, 0.08)  (warm hairline)

Brand primary:       #1A1A18  (near-black — editorial primary)
Brand primaryHover:  #2D2D2B
Brand secondary:     #8B7355  (warm bronze — subtle accent)
Brand accent:        #8B7355

Semantic success:    #2D6A4F
Semantic warning:    #B45309
Semantic error:      #C0392B
Semantic info:       #1A1A18
```

**Typography:**

- Heading: `Playfair Display` (variable serif) — high-contrast editorial, weight 700-900
- Body: `Geist` — clean contrast against the warm serif
- Mono: `Geist Mono` — for data/metadata
- Note: Playfair Display is available via `next/font/google`

**Component registry:**

```typescript
export const altairRegistry: ComponentRegistry = {
  theme: "altair",
  heroVariant: "split",
  headerVariant: "light",
  cardVariant: "standard",
  sectionVariant: "standard",
};
```

### 2a — Write `packages/themes/altair/index.ts`

Follow polaris/sirius pattern. Read one first.

### 2b — Write `packages/themes/altair/globals.css`

Copy vega/globals.css verbatim, update header comment.

### 2c — Add "altair" to THEME_NAMES

```typescript
export const THEME_NAMES = [
  "altair",
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

### 2d — Register in showcase

```typescript
import "@platform/themes/altair";
```

---

## Step 3: Scaffold `sites/dcs-high-end`

```bash
cp -r sites/base-template sites/dcs-high-end
rm -rf sites/dcs-high-end/node_modules sites/dcs-high-end/.next sites/dcs-high-end/.turbo
```

Update `package.json` name to `"dcs-high-end"`.

---

## Step 4: Wire Theme

**`sites/dcs-high-end/theme.config.ts`:**

```typescript
import type { DeepPartialThemeConfig } from "@platform/theme-system";
import { altairRegistry, altairDefaultConfig } from "@platform/themes/altair";

export const themeConfig: DeepPartialThemeConfig = {
  componentRegistry: altairRegistry,
  ...altairDefaultConfig,
};
```

---

## Step 5: Configure `sites/dcs-high-end/site.config.ts`

Same business info as other DCS variants:

- `slug`: `'dcs-high-end'`
- `domain`: `'digitalconsultingservices.co.uk'`
- `name`: `'Digital Consulting Services'`
- `tagline`: `'Websites as intelligent as your business'`
- `business.type`: `'ProfessionalService'`
- Navigation: Services, Portfolio (`/projects`), About, Contact
- `features.blog`: `true`
- Remove: `serviceAreas`, `serviceAreaRegions`, `credentials.insurance`

---

## Step 6: Rewrite `globals.css`

```css
@import "../../../packages/themes/altair/globals.css";

@tailwind base;
@tailwind components;
@tailwind utilities;

/**
 * DCS — Altair Theme (high-end-visual-design / Editorial Luxury)
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
    font-family: var(--font-playfair), Georgia, serif;
  }
  .font-mono,
  code,
  samp {
    font-family: var(--font-geist-mono), monospace;
  }
}

/* Film grain overlay — Editorial Luxury signature */
body::before {
  content: "";
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: 9999;
  opacity: 0.03;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E");
  background-repeat: repeat;
  background-size: 128px 128px;
}
```

---

## Step 7: Rewrite `layout.tsx`

```tsx
import type { Metadata, Viewport } from "next";
import { Playfair_Display, Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { siteConfig } from "@/site.config";
import { ThemeProvider } from "@platform/core-components";
import { altairRegistry } from "@platform/themes/altair";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
  weight: ["400", "500", "600", "700", "800", "900"],
  style: ["normal", "italic"],
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
    <html lang="en-GB" className={`${playfair.variable} ${geist.variable} ${geistMono.variable}`}>
      <body className="min-h-screen flex flex-col bg-[#FDFBF7]">
        <ThemeProvider theme="altair" registry={altairRegistry}>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
```

---

## Step 8: Build the 5 TSX Pages

Apply ALL high-end-visual-design rules. Editorial Luxury vibe + Editorial Split layout.
Double-Bezel on every card. Custom cubic-bezier on all motion. `min-h-[100dvh]`.

**Nav pattern (floating glass pill):**

- `fixed top-6 left-1/2 -translate-x-1/2 z-50 w-max`
- `bg-[#FDFBF7]/80 backdrop-blur-md rounded-full px-6 py-3`
- `ring-1 ring-[#1A1A18]/8` (warm hairline border)
- Logo: "Digital Consulting Services" in Playfair Display italic, small
- Nav links: Geist small, `text-[#6B6860] hover:text-[#1A1A18]`, transition `cubic-bezier(0.32,0.72,0,1)`
- CTA: warm near-black bg `rounded-full px-5 py-2`, button-in-button trailing icon
- Mobile: hamburger → X morph, full-screen `bg-[#FDFBF7]/95 backdrop-blur-3xl` overlay, staggered link reveals

**Footer pattern:**

- `bg-[#1A1A18]` dark footer
- 3-column grid, `py-16`
- Col 1: company name in Playfair italic, tagline in warm gray
- Col 2: service links in warm gray
- Col 3: contact + status
- Bottom: copyright small, warm gray

### Page 1: `app/page.tsx` (Home) — Editorial Split

**Hero (Editorial Split layout):**

- `min-h-[100dvh]` two-column: left 50% content, right 50% visual
- Left:
  - Eyebrow tag: `"DIGITAL CONSULTING · EST. 2015"` — `rounded-full px-3 py-1 text-[10px] uppercase tracking-[0.2em] bg-[#1A1A18]/5`
  - H1: `text-5xl md:text-8xl` Playfair Display, tight tracking, warm near-black
  - H1 text: "We build the platform." with second line "You build the business." in Playfair italic
  - Body text below: Geist, `text-[#6B6860] leading-relaxed max-w-[45ch]`
  - Two CTAs: primary button-in-button + ghost text link with arrow
  - All enter with scroll fade-up `translate-y-16 → translate-y-0` over 800ms
- Right:
  - Stacked interactive service preview cards (3 cards, slightly offset in Z-axis)
  - Each card: Double-Bezel — outer shell `rounded-[2rem] ring-1 ring-[#1A1A18]/8 p-1.5 bg-[#1A1A18]/3`, inner core `rounded-[calc(2rem-0.375rem)] bg-white shadow-[inset_0_1px_1px_rgba(255,255,255,0.15)] p-6`
  - Card content: service name (Playfair italic), one-line description (Geist small), action link
  - Middle card slightly rotated `rotate-1`, bottom card `-rotate-1` for Z-axis cascade feel
  - Hover: transition `cubic-bezier(0.32,0.72,0,1)`, border brightens, inner glow

Remaining sections:

1. **Services** — horizontal scroll of service feature rows (NOT cards). Each row: `divide-y border-[#1A1A18]/10`, service number (Playfair italic, large), name (Playfair bold H3), description (Geist), arrow link. This is the zig-zag alternative.
2. **About strip** — full-width `bg-[#1A1A18]` dark section, warm cream text, H2 in Playfair italic, short prose, stat data in `font-mono text-[#8B7355]`
3. **CTA** — `py-40`, centered (variance allows centering for full-bleed CTA bands), massive Playfair H2, two buttons
4. **Footer**

### Page 2: `app/services/page.tsx`

- Left-aligned page hero with Playfair H1 "Our services", eyebrow tag
- Services as horizontal `divide-y` feature list (same pattern as homepage services — no cards)
- Each service: large Playfair service number in `text-[#8B7355]`, H2 title, body description, 3 benefit lines, action link
- CTA band + Footer

### Page 3: `app/about/page.tsx`

- Hero: massive Playfair italic H1 "About us" left-aligned, eyebrow, warm body text
- 2-column editorial: left (wide) prose story, right (narrow) stat column — stats as `divide-y` list, numbers in Playfair, labels in Geist Mono small
- Values as 3-column divide-x strip (NOT cards)
- Dark `bg-[#1A1A18]` quote band: pull-quote in Playfair italic, attribution in Geist small
- CTA + Footer

### Page 4: `app/contact/page.tsx`

- Massive Playfair H1 "Get in touch", eyebrow "OPEN TO PROJECTS"
- 2-column: form left, contact data right
- Form: Double-Bezel on the form container itself (outer shell wrapping all inputs), warm cream inputs with `ring-1 ring-[#1A1A18]/10`, Playfair italic labels, Geist input text, rounded-full submit button
- Contact data: `divide-y` list rows, Geist Mono metadata
- Footer

### Page 5: `app/services/[slug]/page.tsx`

Dynamic `[slug]` route — read base-template version first, adapt:

- Playfair H1, eyebrow with service number, breadcrumb
- Prose content for MDX, `max-w-[65ch]`
- Benefits as `divide-y` rows (no boxes)
- FAQ: `<details>`/`<summary>` with Playfair italic question, Geist answer
- CTA + Footer

---

## Step 9: Service MDX Files

6 files in `sites/dcs-high-end/content/services/`. Same slugs as other DCS variants. Read content-schemas.ts for fields.

Tone: human and authoritative — the warm editorial voice contrasts with the mechanical brutalist version. Concrete, specific, no clichés.

---

## Step 10: Lockfile + Type-check

```bash
pnpm install --lockfile-only
cd sites/dcs-high-end && npx tsc --noEmit
```

---

## Step 11: Stage

```bash
git add packages/themes/altair/ \
        packages/theme-system/src/types.ts \
        sites/showcase/lib/register-all-themes.ts \
        sites/dcs-high-end/ \
        pnpm-lock.yaml
```

Do NOT commit.

---

## Step 12: Report

```
✓ Theme package:   packages/themes/altair/
✓ THEME_NAMES:     altair added
✓ Site:            sites/dcs-high-end/
✓ Vibe archetype:  Editorial Luxury
✓ Layout archetype: Editorial Split
✓ Pages:           app/page.tsx, app/services/page.tsx, app/about/page.tsx,
                   app/contact/page.tsx, app/services/[slug]/page.tsx
✓ MDX content:     6 service files
✓ TypeScript:      [errors or "clean"]

Dev server:  cd sites/dcs-high-end && npm run dev
```

---

## Rules

- high-end-visual-design skill rules are LAW — Double-Bezel on every card, no exceptions
- Editorial Luxury vibe throughout — warm cream, Playfair Display, film grain
- Editorial Split layout — asymmetric left/right, NOT centered symmetry
- Custom cubic-bezier on ALL transitions — no linear, no ease-in-out
- Button-in-Button on every CTA
- Eyebrow tags before every H1/H2
- Section padding minimum `py-24`
- `min-h-[100dvh]` not `h-screen`
- No Phosphor icons unless `@phosphor-icons/react` is in package.json — check first
- Don't commit — stage only
