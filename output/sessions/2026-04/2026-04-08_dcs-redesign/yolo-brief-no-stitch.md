# YOLO Brief: DCS Site — Polaris Theme + TSX Pages (No Stitch)

**Mode:** Stitch MCP unavailable. Build theme package and 5 TSX pages from DESIGN.md directly.
**Branch:** Must be on `develop`
**Session:** `output/sessions/2026-04-08_dcs-redesign/`

---

## Your Mission

Build the `polaris` theme package and scaffold `sites/dcs` — a new site for Digital Consulting Services (digitalconsultingservices.co.uk). The visual design is fully specified in `output/sessions/2026-04-08_dcs-redesign/DESIGN.md`. Read it in full before writing any code. Every design decision you need is in that file.

**Do NOT deviate from DESIGN.md.** It defines: color tokens, typography (Space Grotesk / Geist / Geist Mono), layout rules, component patterns, CRT effects, and the full anti-pattern list.

---

## Step 1: Preflight

```bash
git branch --show-current
# Must output: develop
git status --porcelain
# Warn if non-empty but continue
```

---

## Step 2: Create `packages/themes/polaris/`

### 2a — `packages/themes/polaris/index.ts`

Follow the orion/vega export pattern exactly. Read `packages/themes/orion/index.ts` first to match structure.

```typescript
/**
 * Polaris Theme
 *
 * Tactical Telemetry (Dark) — Industrial Brutalist
 * Built for Digital Consulting Services (digitalconsultingservices.co.uk)
 * Design spec: output/sessions/2026-04-08_dcs-redesign/DESIGN.md
 *
 * Sites using Polaris: dcs
 */
import type { ComponentRegistry, DeepPartialThemeConfig } from "@platform/theme-system";
import { registerTheme } from "@platform/theme-system";

export const polarisRegistry: ComponentRegistry = {
  theme: "polaris",
  heroVariant: "minimal",
  headerVariant: "dark",
  cardVariant: "standard",
  sectionVariant: "dark-accent",
};

export const polarisDefaultConfig: DeepPartialThemeConfig = {
  colors: {
    brand: {
      primary: "#FF2A2A", // Aviation Red — the ONLY accent
      primaryHover: "#CC2222",
      secondary: "#EAEAEA", // White phosphor doubles as secondary
      accent: "#FF2A2A",
      onPrimary: "#FFFFFF",
    },
    surface: {
      background: "#0A0A0A", // CRT black
      foreground: "#EAEAEA", // White phosphor
      card: "#111111",
      cardBorder: "#2A2A2A",
      muted: "#161616",
      mutedForeground: "#777777",
    },
    semantic: {
      success: "#4AF626", // Terminal green — status indicators only
      warning: "#FF2A2A",
      error: "#FF2A2A",
      info: "#EAEAEA",
    },
    overlay: {
      dark: "rgba(10, 10, 10, 0.9)",
      light: "rgba(234, 234, 234, 0.05)",
      primary: "rgba(255, 42, 42, 0.15)",
    },
  },
  typography: {
    fontFamily: {
      sans: ["Space Grotesk", "system-ui", "-apple-system", "sans-serif"],
      heading: ["Space Grotesk", "system-ui", "-apple-system", "sans-serif"],
    },
  },
  components: {
    button: { borderRadius: "0" },
    card: { borderRadius: "0", shadow: "none" },
    hero: { variant: "minimal" },
    navigation: { style: "solid" },
  },
};

registerTheme({ name: "polaris", label: "Polaris", config: polarisDefaultConfig });
```

### 2b — `packages/themes/polaris/globals.css`

Copy `packages/themes/vega/globals.css` verbatim, then replace the file header comment to identify polaris, and **add the CRT/brutalist utilities** at the end (before any closing comments):

```css
/* CRT Scanlines — applied globally via body::after in sites using polaris */
.crt-scanlines::after {
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

/* Phosphor glow — hover effect on interactive text elements */
.phosphor-glow:hover {
  text-shadow: 0 0 8px rgba(234, 234, 234, 0.3);
  transition: text-shadow 200ms ease-out;
}

/* Red alert — focus ring for CTAs */
.red-alert:focus {
  box-shadow:
    0 0 0 1px #ff2a2a,
    0 0 12px rgba(255, 42, 42, 0.2);
  outline: none;
}

/* Cursor blink — for hero terminal underscore */
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

/* Grid divider — use gap:px with this as parent bg for razor-thin lines */
.grid-divider {
  background-color: #2a2a2a;
}
```

### 2c — Add "polaris" to THEME_NAMES

Edit `packages/theme-system/src/types.ts` line 272:

```typescript
// Before:
export const THEME_NAMES = ["atlas", "cygnus", "lyra", "nova", "orion", "rigel", "vega"] as const;

// After:
export const THEME_NAMES = [
  "atlas",
  "cygnus",
  "lyra",
  "nova",
  "orion",
  "polaris",
  "rigel",
  "vega",
] as const;
```

### 2d — Register polaris in showcase

Edit `sites/showcase/lib/register-all-themes.ts` — add:

```typescript
import "@platform/themes/polaris";
```

---

## Step 3: Scaffold `sites/dcs`

```bash
cp -r sites/base-template sites/dcs
rm -rf sites/dcs/node_modules sites/dcs/.next sites/dcs/.turbo
```

Update `sites/dcs/package.json` — change the `name` field to `"dcs"`.

---

## Step 4: Wire Theme — `sites/dcs/theme.config.ts`

Replace the entire file:

```typescript
import type { DeepPartialThemeConfig } from "@platform/theme-system";
import { polarisRegistry, polarisDefaultConfig } from "@platform/themes/polaris";

export const themeConfig: DeepPartialThemeConfig = {
  componentRegistry: polarisRegistry,
  ...polarisDefaultConfig,
};
```

---

## Step 5: Configure `sites/dcs/site.config.ts`

Read the full existing file first, then replace the placeholder values with DCS business info. Key changes:

```typescript
slug: 'dcs',
domain: 'digitalconsultingservices.co.uk',
name: 'Digital Consulting Services',
tagline: 'Websites as intelligent as your business',
url: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',

business: {
  name: 'Digital Consulting Services',
  legalName: 'Digital Consulting Services',
  type: 'ProfessionalService',
  phone: '0800 XXX XXXX',       // placeholder — user will fill in
  email: 'hello@digitalconsultingservices.co.uk',  // placeholder
  address: {
    street: '',
    city: 'United Kingdom',
    region: '',
    postalCode: '',
    country: 'GB',
  },
  geo: { latitude: 51.5074, longitude: -0.1278 },
},

navigation: {
  main: [
    { label: 'Services', href: '/services' },
    { label: 'Portfolio', href: '/projects' },
    { label: 'About', href: '/about' },
    { label: 'Contact', href: '/contact' },
  ],
},

cta: {
  primary: { label: '[ INITIATE CONTACT ]', href: '/contact' },
  phone: { show: false },
},

features: {
  analytics: false,
  consentBanner: false,
  contactForm: true,
  rateLimit: true,
  testimonials: false,
  blog: true,
},

// Remove or empty: serviceAreas, serviceAreaRegions (not relevant for digital agency)
// Remove: credentials.insurance
```

---

## Step 6: Rewrite `sites/dcs/app/globals.css`

```css
@import "../../../packages/themes/polaris/globals.css";

@tailwind base;
@tailwind components;
@tailwind utilities;

/**
 * DCS — Polaris Theme (Tactical Telemetry / Industrial Brutalist)
 * Design spec: output/sessions/2026-04-08_dcs-redesign/DESIGN.md
 */

@layer base {
  html {
    scroll-behavior: smooth;
  }
  body {
    font-family:
      "Geist",
      system-ui,
      -apple-system,
      sans-serif;
    @apply bg-surface-background text-surface-foreground;
    font-feature-settings:
      "rlig" 1,
      "calt" 1;
  }
  h1,
  h2,
  h3,
  h4 {
    font-family:
      "Space Grotesk",
      system-ui,
      -apple-system,
      sans-serif;
  }
  * {
    border-radius: 0 !important; /* Polaris: no rounded corners anywhere */
  }
}

/* CRT scanlines overlay — global */
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
    rgba(0, 0, 0, 0.06) 2px,
    rgba(0, 0, 0, 0.06) 4px
  );
}
```

---

## Step 7: Rewrite `sites/dcs/app/layout.tsx`

Use `next/font/google` for Space Grotesk and Geist. No `<head>` font tags needed.

```tsx
import type { Metadata, Viewport } from "next";
import { Space_Grotesk, Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { siteConfig } from "@/site.config";
import { ThemeProvider } from "@platform/core-components";
import { polarisRegistry } from "@platform/themes/polaris";

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

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en-GB"
      className={`${spaceGrotesk.variable} ${geist.variable} ${geistMono.variable}`}
    >
      <body className="min-h-screen flex flex-col crt-scanlines">
        <ThemeProvider theme="polaris" registry={polarisRegistry}>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
```

Update `globals.css` to use CSS variables from next/font:

```css
body {
  font-family: var(--font-geist), system-ui, sans-serif;
}
h1,
h2,
h3,
h4 {
  font-family: var(--font-space-grotesk), system-ui, sans-serif;
}
.font-mono,
code,
samp,
kbd {
  font-family: var(--font-geist-mono), monospace;
}
```

---

## Step 8: Build the 5 TSX Pages

**Read DESIGN.md in full before writing any page.** Every section below maps directly to the component patterns described there. All pages:

- Are Next.js Server Components (no `'use client'`)
- Use no Stitch HTML (we're designing from DESIGN.md directly)
- Use theme token classes: `bg-surface-background`, `text-brand-primary`, `border-surface-card-border` etc.
- **NO border-radius anywhere** — enforced by globals.css but don't add it in JSX either
- All hardcoded hex colors use arbitrary Tailwind: `bg-[#FF2A2A]`, `border-[#2A2A2A]`
- Nav and footer are inlined on every page (no shared import — keep it self-contained for now)
- Opacity on CSS custom property tokens doesn't work in Tailwind (`bg-surface-background/80` renders transparent) — use hardcoded hex with opacity instead: `bg-[#0A0A0A]/80`

**Shared nav/footer pattern** to inline on every page:

```tsx
{
  /* NAV */
}
<header className="fixed top-0 left-0 right-0 z-50 bg-[#0A0A0A] border-b border-[#2A2A2A]">
  <div className="max-w-[1400px] mx-auto px-6 md:px-12 flex items-center justify-between h-14">
    <a href="/" className="font-space-grotesk font-bold text-[#EAEAEA] tracking-tight">
      [ DCS ]
    </a>
    <nav className="hidden md:flex items-center gap-8">
      {[
        ["SYS.001", "SERVICES", "/services"],
        ["SYS.002", "PORTFOLIO", "/projects"],
        ["SYS.003", "ABOUT", "/about"],
        ["SYS.004", "CONTACT", "/contact"],
      ].map(([id, label, href]) => (
        <a
          key={href}
          href={href}
          className="flex items-center gap-2 text-[0.75rem] tracking-[0.08em] font-mono text-[#EAEAEA] hover:text-[#FF2A2A] transition-colors duration-150"
        >
          <span className="text-[#777777]">{id}</span>
          {label}
        </a>
      ))}
    </nav>
    <a
      href="/contact"
      className="bg-[#FF2A2A] text-white font-mono text-[0.75rem] tracking-[0.08em] uppercase px-4 py-2 hover:bg-[#CC2222] transition-colors duration-150"
    >
      [ INITIATE CONTACT ]
    </a>
  </div>
</header>;

{
  /* FOOTER */
}
<footer className="mt-auto border-t border-[#2A2A2A] bg-[#0A0A0A]">
  <div className="max-w-[1400px] mx-auto px-6 md:px-12">
    {/* 3-column grid with 1px dividers */}
    <div className="grid grid-cols-1 md:grid-cols-3 bg-[#2A2A2A] gap-px">
      <div className="bg-[#0A0A0A] p-8">
        <p className="font-space-grotesk font-bold text-[#EAEAEA] text-lg mb-2">[ DCS ]</p>
        <p className="font-mono text-[0.75rem] text-[#777777] uppercase tracking-[0.08em] leading-relaxed">
          Digital Consulting
          <br />
          Services
          <br />
          <br />
          EST. 2015
        </p>
      </div>
      <div className="bg-[#0A0A0A] p-8">
        <p className="font-mono text-[0.75rem] text-[#777777] uppercase tracking-[0.08em] mb-4">
          Systems
        </p>
        {[
          ["SYS.001", "PLATFORM WEBSITES", "/services/platform-websites"],
          ["SYS.002", "AI AUTOMATION", "/services/ai-automation"],
          ["SYS.003", "ECOMMERCE", "/services/ecommerce"],
          ["SYS.004", "WEB DESIGN", "/services/web-design"],
          ["SYS.005", "SEO & ANALYTICS", "/services/seo-analytics"],
          ["SYS.006", "MAINTENANCE", "/services/maintenance"],
        ].map(([id, label, href]) => (
          <a
            key={href}
            href={href}
            className="flex items-center gap-2 font-mono text-[0.75rem] tracking-[0.08em] text-[#EAEAEA] hover:text-[#FF2A2A] transition-colors duration-150 mb-2"
          >
            <span className="text-[#777777]">{id}</span>
            {label}
          </a>
        ))}
      </div>
      <div className="bg-[#0A0A0A] p-8">
        <p className="font-mono text-[0.75rem] text-[#777777] uppercase tracking-[0.08em] mb-4">
          Coordinates
        </p>
        <p className="font-mono text-[0.75rem] text-[#EAEAEA] tracking-[0.08em] leading-relaxed uppercase">
          UK-001
          <br />
          digitalconsultingservices.co.uk
          <br />
          <br />
          <span className="flex items-center gap-2">
            <span className="inline-block w-2 h-2 bg-[#4AF626]" />
            STATUS: ONLINE
          </span>
        </p>
      </div>
    </div>
    <div className="py-4 flex items-center justify-between">
      <p className="font-mono text-[0.7rem] text-[#777777] uppercase tracking-[0.08em]">
        (C) 2026 DIGITAL CONSULTING SERVICES
      </p>
      <p className="font-mono text-[0.7rem] text-[#777777] uppercase tracking-[0.08em]">REV 2.6</p>
    </div>
  </div>
</footer>;
```

### Page 1: `sites/dcs/app/page.tsx` (Home)

Sections (in order):

1. **Nav** (inlined above)
2. **Hero** — full viewport height, vast negative space
   - `pt-14` to clear fixed nav
   - H1: `DIGITAL_ / CONSULTING_ / SERVICES > _` — each word on its own line
   - Trailing `_` on last line has `cursor-blink` class
   - `clamp(3rem, 8vw, 8rem)`, uppercase, tracking `-0.04em`, leading `0.9`, `font-space-grotesk font-bold`
   - Subtitle below: "We build the platform. You build the business." — Geist, 1.25rem, `text-[#EAEAEA]/85`
   - Status data bar at bottom of hero section: monospace strip `SYS.STATUS: ONLINE | EST. 2015 | UNIT: UK-001` in `text-[#777777]`
   - CTA: `< INITIATE CONTACT >` in red button
3. **HR divider** — `border-[#2A2A2A]`
4. **Services grid** — `/// SERVICES` section header, 2x3 grid of service cards per DESIGN.md Service Cards pattern. Services:
   - SYS.001 PLATFORM WEBSITES — Custom sites deployed on our proprietary platform
   - SYS.002 AI AUTOMATION — AI-powered workflows, chatbots, business automation
   - SYS.003 ECOMMERCE SOLUTIONS — Online shops with payment processing
   - SYS.004 WEB DESIGN — Brand identity, UI/UX, responsive layouts
   - SYS.005 SEO & ANALYTICS — Search optimization, GA4, performance tracking
   - SYS.006 MAINTENANCE & SUPPORT — Ongoing updates, monitoring, security
5. **HR divider**
6. **Stats bar** — monospace data readouts: `SITES DEPLOYED: 047 | UPTIME: 99.9% | CLIENTS SERVED: 023`
7. **HR divider**
8. **CTA band** — per DESIGN.md: `#111111` bg, 2px red rules top/bottom, "READY TO DEPLOY?" H2, `< INITIATE CONTACT >` button
9. **Footer** (inlined above)

### Page 2: `sites/dcs/app/services/page.tsx` (Services)

Sections:

1. Nav
2. `pt-14` spacer
3. Breadcrumb: `HOME > SERVICES` — monospace, muted
4. Page title: `/// SERVICES` marker + H1 "Services" (sentence case H1 is fine here, not uppercase — this is interior page)
5. 6-card service grid (same cards as homepage but larger, with more description text)
6. CTA band
7. Footer

### Page 3: `sites/dcs/app/about/page.tsx` (About)

Sections:

1. Nav
2. `pt-14` spacer
3. Hero: "ABOUT* / DCS > *" with cursor blink — same H1 pattern as homepage
4. **Asymmetric 2-column layout** — wide left (prose story), narrow right (data sidebar):
   - Left: 3 paragraphs about DCS — boutique agency, platform-first approach, AI automation focus, founded 2015
   - Right: monospace data readouts — `FOUNDED: 2015`, `PLATFORM: v2.6`, `SITES DEPLOYED: 047`, `LOCATION: UK-001`
5. HR divider
6. Values grid — 3 compartmentalized cards:
   - `PRECISION` — We build to spec. No templates, no guesswork.
   - `VELOCITY` — Our platform deploys sites in days, not months.
   - `INTELLIGENCE` — AI automation built into every workflow.
7. CTA band
8. Footer

### Page 4: `sites/dcs/app/contact/page.tsx` (Contact)

Sections:

1. Nav
2. `pt-14` spacer
3. Hero: "INITIATE* / CONTACT > *" with cursor blink
4. **2-column layout** — form left, contact data right:
   - Left: contact form per DESIGN.md (dark inputs, monospace labels, red submit)
     - Fields: NAME, EMAIL, PHONE (optional), MESSAGE, SERVICE (select)
     - `<form>` with `readOnly` inputs (static demo — no POST action yet)
   - Right: contact data as monospace data fields:
     - `EMAIL: hello@digitalconsultingservices.co.uk`
     - `PHONE: 0800 XXX XXXX`
     - `LOCATION: UK-001`
     - `HOURS: MON-FRI 09:00-17:30`
     - `STATUS: ACCEPTING PROJECTS`
5. Footer

### Page 5: `sites/dcs/app/services/[slug]/page.tsx` (Service Detail — dynamic)

This is a **dynamic route** that reads from MDX. For now, make it a proper dynamic `[slug]` route that renders placeholder content. The MDX files will be written separately.

Read `sites/base-template/app/services/[slug]/page.tsx` first and adapt — keep the `generateStaticParams` and MDX loading logic from base-template. Apply the Polaris visual style:

- Breadcrumb: `HOME > SERVICES > [SERVICE NAME]`
- Hero: service title in H1, system ID (derive from slug index), status `ACTIVE`
- Content area: prose with Polaris styling (`text-[#EAEAEA]/85`, generous line-height)
- Features/benefits section: compartmentalized grid
- FAQ: `<details>`/`<summary>` accordion pattern, monospace numbering
- CTA band
- Footer

---

## Step 9: Create Service MDX Files

Create these 6 files in `sites/dcs/content/services/`. Use the base-template MDX frontmatter schema (read `packages/core-components/src/lib/content-schemas.ts` to confirm required fields). Keep descriptions 50-200 chars, 3-15 FAQs.

Files to create:

- `platform-websites.mdx`
- `ai-automation.mdx`
- `ecommerce.mdx`
- `web-design.mdx`
- `seo-analytics.mdx`
- `maintenance.mdx`

Content tone: authoritative tech agency, not "your friendly local web designer". Present tense. No AI copywriting clichés ("seamless", "elevate", "unleash", "next-gen").

---

## Step 10: Update Lockfile and Type-check

```bash
# From repo root:
pnpm install --lockfile-only

# Type-check dcs site:
cd sites/dcs && npx tsc --noEmit
# Report errors but don't block — fix TypeScript errors you can fix, note any that need manual attention
```

---

## Step 11: Stage Changes

```bash
git add packages/themes/polaris/ \
        packages/theme-system/src/types.ts \
        sites/showcase/lib/register-all-themes.ts \
        sites/dcs/ \
        pnpm-lock.yaml
```

Do NOT commit — leave that for the user.

---

## Step 12: Final Report

Output:

```
✓ Theme package:   packages/themes/polaris/
✓ THEME_NAMES:     updated — polaris added
✓ Test site:       sites/dcs/
✓ Pages created:   app/page.tsx, app/services/page.tsx, app/about/page.tsx,
                   app/contact/page.tsx, app/services/[slug]/page.tsx
✓ MDX content:     6 service files in content/services/
✓ Type errors:     [list any unfixed errors, or "none"]

Dev server:        cd sites/dcs && npm run dev
                   Visit http://localhost:3000

Remaining tasks:
- Fill in real phone/email/address in site.config.ts
- Add logo (or keep [ DCS ] text logo)
- Review and iterate on MDX service content
- Screenshot deployed sites for portfolio page
- Add portfolio MDX files to content/projects/
- When ready: /deploy.changes
```

---

## Rules

- Read DESIGN.md completely before writing any TSX
- No border-radius anywhere — use `!important` override in globals.css already handles this but don't add radius in JSX
- No gradients, no box shadows, no glassmorphism
- No hero images — typography IS the hero on home and interior pages
- No emoji
- Hardcoded hex for opacity overlays (not Tailwind opacity modifiers on CSS vars)
- Nav and footer inlined per page for now (no shared imports)
- Service detail page uses dynamic `[slug]` route and MDX — read base-template's version first
- Don't commit — stage only
