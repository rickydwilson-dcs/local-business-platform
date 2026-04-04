# CLAUDE.md - Mad Graphics

Guidance for Claude Code when working with the Mad Graphics site.

## Overview

**Client:** Mad Graphics (Martin Adams)
**Domain:** madgraphics.co.uk
**Theme:** Cygnus — dark mode, Press-Black (#131313), Signal Orange (#F47B20), Craft Green (#7AC143)
**Vercel:** https://mad-graphics.vercel.app

Mad Graphics is a vehicle graphics, signs, banners & print business based in Polegate, East Sussex. They have operated since 2004 and cover the East Sussex area only.

**Hard constraints (do not violate):**
- No full vehicle wraps — explicitly excluded from all content. FAQ on vehicle-graphics page must state this.
- Coverage stops at Peacehaven — no Brighton, Hove, Portslade, Rottingdean, Saltdean.

## Content Types

All content is MDX files in `content/`:

| Type         | Directory               | Count |
| ------------ | ----------------------- | ----- |
| Services     | `content/services/`     | 49 (8 hubs + 41 sub-service leaf pages) |
| Locations    | `content/locations/`    | 19 (9 Tier 1 + 10 Tier 2) |
| Blog         | `content/blog/`         | 2 |
| Projects     | `content/projects/`     | 1 |
| Testimonials | `content/testimonials/` | 3 |

### Service Hubs

| Slug | Topic |
|------|-------|
| `vehicle-graphics` | Van graphics, car lettering, fleet, magnetic signs |
| `signs-signage` | Shop signs, site boards, hoardings, A-boards, window graphics |
| `banners` | PVC, roller, mesh, fabric banners & flags |
| `large-format-print` | Posters, canvas, exhibition displays, foam board, Correx |
| `marketing-print` | Flyers, brochures, business cards, letterheads |
| `stickers-labels` | Custom stickers, wall graphics, floor graphics, window decals |
| `workwear-merchandise` | Printed & embroidered workwear, hi-vis, merchandise |
| `graphic-design` | Logo design, brand identity, print-ready artwork |

### Tier 1 Locations

Eastbourne, Hastings, Lewes, Bexhill-on-Sea, Uckfield, Crowborough, Seaford, Hailsham, Newhaven

### Tier 2 Locations

Polegate, Peacehaven, Battle, St Leonards-on-Sea, Heathfield, Pevensey, Ringmer, Herstmonceux, Wadhurst, Alfriston

## Essential Commands

```bash
# Development
npm run dev              # Start dev server (localhost:3000)
npm run build            # Production build

# Validation
npm run validate:content # Validate all MDX content
npm run type-check       # TypeScript type checking
npm run lint             # ESLint

# Testing
npm test                 # Unit tests
```

## Theme

- **Package:** `packages/themes/cygnus/`
- **globals.css import:** `@import "../../../packages/themes/cygnus/globals.css";`
- **Colors:** Press-Black (#131313) background, Signal Orange (#F47B20) primary, Craft Green (#7AC143) secondary
- **Fonts:** Newsreader (headings) + Work Sans (body)

Do NOT change the globals.css import to any other theme.

## Routes

| Route               | Description       |
| ------------------- | ----------------- |
| `/`                 | Homepage          |
| `/services`         | Services listing  |
| `/services/[slug]`  | Service detail    |
| `/locations`        | Locations listing |
| `/locations/[slug]` | Location detail   |
| `/blog`             | Blog listing      |
| `/blog/[slug]`      | Blog post         |
| `/projects`         | Projects listing  |
| `/projects/[slug]`  | Project detail    |
| `/reviews`          | Testimonials page |
| `/contact`          | Contact form      |
| `/about`            | About page        |

## Key Files

### Configuration

- `site.config.ts` - Business information (Mad Graphics)
- `theme.config.ts` - Cygnus theme with Mad Graphics color overrides
- `tailwind.config.ts` - Tailwind + theme integration
- `vercel.json` - Monorepo build config for Vercel

### Content Utilities

- `lib/content.ts` - Content loading (shim → core-components factory)
- `lib/schema.ts` - Schema.org generators (shim → core-components factory)

## Outstanding Tasks

- [ ] Custom domain: add `madgraphics.co.uk` in Vercel → DNS: A `@` → `76.76.21.21`, CNAME `www` → `cname.vercel-dns.com`
- [ ] Resend domain verification: verify `madgraphics.co.uk` as sending domain
- [ ] Image pipeline: run `pnpm images:pipeline --site mad-graphics` (requires `--site` flag to be added to `tools/generate-image-manifest.ts` first)
- [ ] Client review: founding year (2004 assumed), business hours, Instagram handle (@mad_graphicssussex assumed)
- [ ] GA4: create property, add `NEXT_PUBLIC_GA_MEASUREMENT_ID` + set `FEATURE_ANALYTICS_ENABLED=true`
- [ ] Google Search Console: add property, verify DNS TXT, submit sitemap

## Content Architecture Rules

1. **MDX Only** - All content in MDX files, no centralized data files
2. **Frontmatter Validation** - All content validated against Zod schemas
3. **No vehicle wraps** - Never add full wrap services to any content file
4. **Geographic constraint** - East Sussex only, no Brighton/towns west of Peacehaven
