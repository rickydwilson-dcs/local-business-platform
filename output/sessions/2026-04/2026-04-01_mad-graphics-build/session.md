# Session: Mad Graphics — Full Site Build Brief

**Date:** 2026-04-01
**Status:** Ready to build
**Client:** Mad Graphics (Martin Adams)
**Site slug:** `mad-graphics`
**Domain:** madgraphics.co.uk
**Full path:** `/Users/rickywilson/Sites/local-business-platform/output/sessions/2026-04-01_mad-graphics-build/session.md`
**Project:** `local-business-platform` (see `projects.json`)

---

## Brief for W4

Build a new client site `sites/mad-graphics` in the local-business-platform monorepo.

**Business:** Mad Graphics — vehicle graphics, signs, banners, and print. Based at Unit H2, Chaucer Business Park, Dittons Road, Polegate, East Sussex BN26. Est. 2004. Owner: Martin Adams.

**Contact:**

- Phone: 01323 589 700
- Email: office@madgraphics.co.uk
- Instagram: @mad_graphicssussex

**Theme:** Cygnus (already exists in `packages/themes/cygnus/`). Override colors to spec-exact: primary `#F47B20`, hover `#C96210`, secondary `#7AC143`. Fonts stay as Newsreader + Work Sans.

---

## Step 1 — Scaffold

Copy `sites/cygnus-test` to `sites/mad-graphics`:

```bash
cp -r sites/cygnus-test sites/mad-graphics
rm -rf sites/mad-graphics/app/services/vehicle-graphics/
rm sites/mad-graphics/.pipeline-test-site.json
```

Remove `"pipelineTestSite": true` from `package.json` and set `"name": "mad-graphics"`.

---

## Step 2 — `site.config.ts`

Replace the entire file with Mad Graphics config:

- `slug`: `mad-graphics`
- `domain`: `madgraphics.co.uk`
- `name`: `Mad Graphics`
- `tagline`: `Vehicle graphics, signs, banners & print — East Sussex`
- Phone: `01323 589 700`
- Email: `office@madgraphics.co.uk`
- Address: `Unit H2, Chaucer Business Park, Dittons Road, Polegate, East Sussex, BN26`
- Hours: Mon–Fri 8:00 AM – 5:30 PM, Sat by appointment, Sun closed
- Geo: `{ latitude: 50.8161, longitude: 0.2372 }` (Polegate)
- Instagram: `https://instagram.com/mad_graphicssussex`
- `yearEstablished`: `2004`

**Navigation:** Services, Portfolio (`/projects`), Locations (dropdown), Blog, About, Contact

**CTA:** primary = "Get a Free Quote" → /contact | phone shown as "Call 01323 589 700"

**Stats:**

- 20+ Years Experience
- 5,000+ Projects Completed
- Same Day Quotes
- No Wraps — Honest Service

**8 featured services** (top-level category slugs for the services grid — link to category hub pages):

| Title                    | Slug                   |
| ------------------------ | ---------------------- |
| Vehicle Graphics         | `vehicle-graphics`     |
| Signs & Signage          | `signs-signage`        |
| Banners                  | `banners`              |
| Large Format Print       | `large-format-print`   |
| Marketing Print          | `marketing-print`      |
| Stickers & Wall Graphics | `stickers-labels`      |
| Workwear & Merchandise   | `workwear-merchandise` |
| Graphic Design           | `graphic-design`       |

**Service areas (19 towns):**
Eastbourne, Hastings, Lewes, Bexhill-on-Sea, Uckfield, Crowborough, Seaford, Hailsham, Newhaven, Polegate, Peacehaven, Battle, St Leonards-on-Sea, Heathfield, Pevensey, Ringmer, Herstmonceux, Wadhurst, Alfriston

**Features:** analytics off, consentBanner on, contactForm on, rateLimit on, testimonials on, blog on

**About section:**

- Badges: `['Est. 2004', 'Polegate, East Sussex', 'No Vehicle Wraps']`
- Story: Founded 2004, Polegate-based, East Sussex coverage, honest about what they don't do (no full wraps)
- Why choose us: No wraps specialist focus, same-day quotes, local knowledge, in-house design, fleet discounts, UV-rated materials, free artwork check
- Values: Specialist Focus, Honest Pricing, Fast Turnaround, Local Knowledge

**Schema:** `businessType: 'LocalBusiness'`, areaServed = all 19 towns, offerCatalog = 8 category services, knowsAbout includes vehicle graphics, van signwriting, fleet branding, shop signs, banners, large format print, workwear embroidery, graphic design

---

## Step 3 — `theme.config.ts`

```typescript
import type { DeepPartialThemeConfig } from "@platform/theme-system";
import { cygnusRegistry, cygnusDefaultConfig } from "@platform/themes/cygnus";

export const themeConfig: DeepPartialThemeConfig = {
  componentRegistry: cygnusRegistry,
  ...cygnusDefaultConfig,
  colors: {
    ...cygnusDefaultConfig.colors,
    brand: {
      primary: "#F47B20",
      primaryHover: "#C96210",
      secondary: "#7AC143",
      accent: "#dec498",
      onPrimary: "#2d1600",
    },
  },
};
```

---

## Step 4 — `app/layout.tsx`

Keep Newsreader + Work Sans fonts. Update metadata:

- `title.default`: `'Mad Graphics'`
- `description`: use siteConfig.tagline

---

## Step 5 — `.env.example`

```
NEXT_PUBLIC_SITE_URL=https://madgraphics.co.uk
BUSINESS_EMAIL=office@madgraphics.co.uk
```

---

## Step 6 — MDX Content

### Architecture note

All service pages sit flat at `/services/[slug]` — the platform uses a single `[slug]` dynamic route. There are no nested sub-routes. The 49 service pages are:

- 8 category hub pages (overview + sub-service links)
- 41 sub-service leaf pages (full detail, own SEO, own FAQs)

All 49 live in `content/services/`.

**Contact form fields** (update the contact page form to include):
Name, Business name, Service needed (dropdown), Town, Brief description, Contact preference (phone/email)

---

### Services — 8 category hub pages

Each hub page:

- `seoTitle`: `[Category] | Mad Graphics, East Sussex`
- `description`: 150–200 chars
- Hero with heading, subheading, CTA → /contact
- Body: ~150 words intro + sub-services listed as links
- 3–5 FAQs
- Breadcrumbs: Home → Services → [Category]

| Slug                   | Sub-service pages it links to                                                                          |
| ---------------------- | ------------------------------------------------------------------------------------------------------ |
| `vehicle-graphics`     | van-graphics, car-graphics, fleet-graphics, magnetic-signs, vehicle-livery                             |
| `signs-signage`        | shop-signs, site-boards, hoarding-graphics, a-boards, window-graphics, safety-signs, directional-signs |
| `banners`              | pvc-banners, roller-banners, mesh-banners, fabric-banners                                              |
| `large-format-print`   | poster-printing, large-format, canvas-prints, exhibition-prints, foam-board-correx                     |
| `marketing-print`      | flyers-leaflets, brochures, business-cards, letterheads, folders, menus                                |
| `stickers-labels`      | custom-stickers, labels, wall-graphics, floor-graphics, window-stickers                                |
| `workwear-merchandise` | printed-workwear, embroidered-uniforms, hi-vis, merchandise, personalised-gifts                        |
| `graphic-design`       | logo-design, brand-identity, print-design, artwork-prepress                                            |

**CRITICAL on `vehicle-graphics` hub:** Must include a FAQ explicitly stating Mad Graphics does NOT offer full vehicle wraps, with a brief explanation (specialist focus on graphics and signwriting).

---

### Services — 41 sub-service leaf pages

Each leaf page:

- `seoTitle`: `[Sub-service] | Mad Graphics, East Sussex`
- `description`: 150–200 chars
- Hero with heading, subheading, CTA → /contact
- Body: ~300 words (full SEO-optimised service description)
- Process section: 3–4 steps (how it works)
- 3–5 FAQs
- Breadcrumbs: Home → Services → [Category] → [Sub-service]

#### Vehicle Graphics (5 pages)

| Slug             | Title                          |
| ---------------- | ------------------------------ |
| `van-graphics`   | Van Graphics & Van Signwriting |
| `car-graphics`   | Car Graphics & Lettering       |
| `fleet-graphics` | Fleet Graphics & Branding      |
| `magnetic-signs` | Magnetic Vehicle Signs         |
| `vehicle-livery` | Vehicle Livery Design          |

#### Signs & Signage (7 pages)

| Slug                | Title                               |
| ------------------- | ----------------------------------- |
| `shop-signs`        | Shop Signs & Fascia Signs           |
| `site-boards`       | Site Boards                         |
| `hoarding-graphics` | Hoarding Graphics & Hoarding Panels |
| `a-boards`          | A-Boards & Pavement Signs           |
| `window-graphics`   | Window Graphics & Frosted Vinyl     |
| `safety-signs`      | Safety Signs & Compliance Signage   |
| `directional-signs` | Directional & Wayfinding Signs      |

#### Banners (4 pages)

| Slug             | Title                            |
| ---------------- | -------------------------------- |
| `pvc-banners`    | PVC Banners                      |
| `roller-banners` | Roller Banners & Pull-Up Banners |
| `mesh-banners`   | Mesh Banners                     |
| `fabric-banners` | Fabric Banners & Flags           |

#### Large Format Print (5 pages)

| Slug                | Title                        |
| ------------------- | ---------------------------- |
| `poster-printing`   | Poster Printing              |
| `large-format`      | Large Format Printing        |
| `canvas-prints`     | Canvas Prints                |
| `exhibition-prints` | Exhibition & Display Prints  |
| `foam-board-correx` | Foam Board & Correx Printing |

#### Marketing Print (6 pages)

| Slug              | Title                          |
| ----------------- | ------------------------------ |
| `flyers-leaflets` | Flyers & Leaflets              |
| `brochures`       | Brochures & Booklets           |
| `business-cards`  | Business Cards                 |
| `letterheads`     | Letterheads & Compliment Slips |
| `folders`         | Folders & Presentation Packs   |
| `menus`           | Menus & Price Lists            |

#### Stickers, Labels & Wall Graphics (5 pages)

| Slug              | Title                    |
| ----------------- | ------------------------ |
| `custom-stickers` | Custom Stickers          |
| `labels`          | Labels & Product Labels  |
| `wall-graphics`   | Wall Graphics & Wall Art |
| `floor-graphics`  | Floor Graphics           |
| `window-stickers` | Window Stickers & Decals |

#### Workwear & Merchandise (5 pages)

| Slug                   | Title                                        |
| ---------------------- | -------------------------------------------- |
| `printed-workwear`     | Printed Workwear                             |
| `embroidered-uniforms` | Embroidered Uniforms & Polos                 |
| `hi-vis`               | Hi-Vis & Safety Workwear                     |
| `merchandise`          | Personalised Merchandise & Promotional Items |
| `personalised-gifts`   | Personalised Gifts                           |

#### Graphic Design (4 pages)

| Slug               | Title                        |
| ------------------ | ---------------------------- |
| `logo-design`      | Logo Design                  |
| `brand-identity`   | Brand Identity & Guidelines  |
| `print-design`     | Graphic Design for Print     |
| `artwork-prepress` | Artwork & Pre-Press Services |

---

### Locations — Tier 1 (9 files in `content/locations/`)

URL pattern: `/locations/[slug]` (platform standard).

`seoTitle` pattern: `Vehicle Graphics & Signs in [Town] | Mad Graphics East Sussex`

Each file: hero, description (150–200 chars), 4–5 FAQs, body ~200 words with local context.
Breadcrumbs: Home → Locations → [Town].

| Slug             | Town           | Local context                                           |
| ---------------- | -------------- | ------------------------------------------------------- |
| `eastbourne`     | Eastbourne     | Arndale area, Sovereign Harbour, town centre businesses |
| `hastings`       | Hastings       | Old Town, retail corridor, fishing industry             |
| `lewes`          | Lewes          | High Street independents, county town                   |
| `bexhill-on-sea` | Bexhill-on-Sea | De La Warr area, seafront businesses                    |
| `uckfield`       | Uckfield       | High Street, light industrial area                      |
| `crowborough`    | Crowborough    | Town centre, local trade                                |
| `seaford`        | Seaford        | Esplanade, town centre                                  |
| `hailsham`       | Hailsham       | Market town, local businesses                           |
| `newhaven`       | Newhaven       | Port area, industrial estate                            |

---

### Locations — Tier 2 (10 files in `content/locations/`)

Same frontmatter structure as Tier 1, slightly shorter body (~150 words).

Slugs: `polegate`, `peacehaven`, `battle`, `st-leonards-on-sea`, `heathfield`, `pevensey`, `ringmer`, `herstmonceux`, `wadhurst`, `alfriston`

---

### Blog (2 files in `content/blog/`)

#### `choosing-vehicle-graphics-east-sussex.mdx`

- title: "How to Choose the Right Vehicle Graphics for Your East Sussex Business"
- slug: `choosing-vehicle-graphics-east-sussex`
- category: `how-to-guide`
- date: `2026-01-15`
- readingTime: 6
- tags: vehicle graphics, East Sussex, van signwriting, fleet branding

#### `shop-signs-guide-small-business.mdx`

- title: "The Small Business Guide to Shop Signs in East Sussex"
- slug: `shop-signs-guide-small-business`
- category: `industry-tips`
- date: `2026-02-10`
- readingTime: 5
- tags: shop signs, signage, East Sussex, small business

---

### Projects (1 file in `content/projects/`)

#### `fleet-graphics-eastbourne-trade.mdx`

- title: "Fleet Vehicle Graphics — Eastbourne Trade Business"
- slug: `fleet-graphics-eastbourne-trade`
- projectType: `commercial`
- category: `vehicle-graphics`
- status: `completed`
- location: `eastbourne`
- services: `['vehicle-graphics']`
- client.type: "Trade business, Eastbourne"
- client.rating: 5

---

### Testimonials (3 files in `content/testimonials/`)

1. Van graphics client, Hailsham — service: `vehicle-graphics`, rating: 5, featured: true
2. Shop sign client, Eastbourne — service: `signs-signage`, rating: 5, featured: true
3. Banner client, Hastings — service: `banners`, rating: 5, featured: false

---

## Step 7 — Validate & Build

```bash
# From repo root
pnpm install

# From sites/mad-graphics
npm run validate:content
npm run type-check
npm run build
```

Total MDX files: 49 services + 19 locations + 2 blog + 1 project + 3 testimonials = **74 files**.
All must pass validation. Zero TypeScript errors. Build must succeed.

---

## Step 8 — Verification Checks

```bash
# No vehicle wrap copy (FAQ dismissal is OK — must say "we don't offer")
grep -r "vehicle wrap\|full wrap" sites/mad-graphics/content/ | grep -v "do not\|don't\|We don\|not offer"

# No out-of-scope towns
grep -ri "Brighton\|Hove\|Portslade\|Rottingdean\|Saltdean" sites/mad-graphics/content/
```

Both must return zero results.

---

## Step 9 — Commit

```bash
git add sites/mad-graphics/
git commit -m "feat(site): add mad-graphics — cygnus theme, 49 service pages, 19 locations"
git push origin develop
```

Then run `/deploy.changes` to promote develop → staging → main.

---

## Hard Constraints (do not violate)

- **No full vehicle wraps** — not offered. Must be explicitly addressed in vehicle-graphics hub FAQ.
- **No Brighton or towns west of Peacehaven** — out of service area.
- **MDX-only content** — no static page files, no hardcoded data arrays.
- **Flat `/services/[slug]`** — all 49 service pages at this level. No nested routes.
- **`/locations/[slug]`** — platform standard URL pattern. Not `/[town]/[service]`.
- **Theme tokens only** — no hardcoded hex colors in components.
- **Named exports only** — no default exports in components.
- **Working directory** — all file operations must use absolute paths rooted at `/Users/rickywilson/Sites/local-business-platform`. The process may start in a different directory.

---

## Manual Steps After Build (for Ricky — not for W4)

1. **WCAG contrast check:** `pnpm --filter @platform/theme-system validate --config ../../sites/mad-graphics/theme.config.ts`
2. **Vercel project:** Create at vercel.com → Root Directory: `sites/mad-graphics`
3. **Environment variables in Vercel:**
   - `NEXT_PUBLIC_SITE_URL` = `https://madgraphics.co.uk`
   - `RESEND_API_KEY` = from resend.com
   - `BUSINESS_EMAIL` = `office@madgraphics.co.uk`
   - `CSRF_SECRET` = `openssl rand -base64 32`
   - `SUPABASE_URL` + `SUPABASE_SERVICE_KEY` = copy from another site
   - `FEATURE_CONSENT_BANNER` = `true`
   - `FEATURE_ANALYTICS_ENABLED` = `false`
4. **Custom domain:** Add `madgraphics.co.uk` in Vercel → update DNS at registrar (A record `@` → `76.76.21.21`, CNAME `www` → `cname.vercel-dns.com`)
5. **Google Search Console:** Add property, verify via DNS TXT, submit `https://madgraphics.co.uk/sitemap-index.xml`
