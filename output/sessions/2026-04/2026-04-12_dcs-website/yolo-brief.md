# YOLO Implementation Brief: DCS Website — Solaris Theme Build

**Branch:** feature/dcs-website (created from develop)
**Session spec:** output/sessions/2026-04-12_dcs-website/yolo-brief.md
**Mode:** Autonomous execution — implement all phases, verify after each, STOP on error
**Orchestrator model:** sonnet

---

## Context

Digital Consulting Services (DCS) needs its own lead-gen website at digitalconsultingservices.co.uk, built on the Local Business Platform. The Solaris theme (sky blue #61A3BA, chartreuse #D2DE32, geometric floating shapes, Space Grotesk headlines) was designed specifically for this site and is already built — header, footer, globals.css, and theme registry all exist. What's missing: Solaris has zero page templates, and `sites/dcs/` is an empty directory.

This brief builds everything needed to take the DCS website from empty shell to deployable site: 12 Solaris page templates, full site scaffolding wired to Solaris, DCS-specific content (4 service pages, 8 location pages, 3 project case studies, 20+ blog posts, a pricing page), and Vercel config.

> **IMPORTANT PRE-FLIGHT CHECK:** Before starting, verify that `feature/stitch-html-to-react` has been merged into develop. If it has not, STOP and report: "Blocked — stitch-html-to-react not yet merged." Once confirmed merged, proceed.

The plan was reviewed and approved. Implement it exactly as specified below.

---

## Model Tiers

| Tier   | Alias    | Cost (in/out per MTok) | Use for                                                                                             |
| ------ | -------- | ---------------------- | --------------------------------------------------------------------------------------------------- |
| Opus   | `opus`   | $15 / $75              | Phases with >5 interdependent files, architectural rewrites, judgment calls not covered by the spec |
| Sonnet | `sonnet` | $3 / $15               | Standard implementation — file edits, feature wiring, most phases                                   |
| Haiku  | `haiku`  | $0.25 / $1.25          | Mechanical tasks: find-replace, import additions, grep checks, content validation                   |

Default orchestrator: **sonnet**. Default sub-agent: **sonnet** unless the task is clearly mechanical (→ haiku) or requires deep cross-file reasoning (→ opus).

---

## Pre-flight

```bash
git checkout develop && git pull
# Confirm stitch-html-to-react is merged:
git log --oneline | grep -i stitch
git checkout -b feature/dcs-website
pnpm type-check   # must be clean before starting
```

---

## Phase 0: Read Reference Files

**Goal:** Understand all patterns before writing any code.
**Model:** haiku — read-only exploration

Read all of these in a single parallel batch (one message, all reads at once):

- `packages/themes/solaris/index.ts`
- `packages/themes/solaris/components/header.tsx`
- `packages/themes/solaris/components/footer.tsx`
- `packages/themes/solaris/components/index.ts`
- `packages/themes/solaris/globals.css`
- `packages/core-components/src/lib/page-template-types.ts`
- `packages/themes/castor/pages/index.ts`
- `packages/themes/castor/pages/home.tsx`
- `packages/themes/castor/pages/services.tsx`
- `packages/themes/castor/pages/service-detail.tsx`
- `packages/themes/castor/pages/locations.tsx`
- `packages/themes/castor/pages/location-detail.tsx`
- `packages/themes/castor/pages/blog.tsx`
- `packages/themes/castor/pages/blog-post.tsx`
- `packages/themes/castor/pages/projects.tsx`
- `packages/themes/castor/pages/project-detail.tsx`
- `packages/themes/castor/pages/reviews.tsx`
- `packages/themes/castor/pages/about.tsx`
- `packages/themes/castor/pages/contact.tsx`
- `sites/_castor-plumbing/app/layout.tsx`
- `sites/_castor-plumbing/app/page.tsx`
- `sites/_castor-plumbing/site.config.ts`
- `sites/base-template/app/layout.tsx`
- `sites/base-template/app/page.tsx`
- `sites/base-template/site.config.ts`
- `sites/base-template/theme.config.ts`
- `sites/base-template/package.json`
- `sites/base-template/vercel.json` (if it exists)
- `sites/base-template/next.config.ts` (or next.config.js)
- `sites/base-template/tailwind.config.ts`
- `sites/_castor-plumbing/package.json`
- `sites/_castor-plumbing/vercel.json`

Also list the full file tree of `sites/base-template/` to know every file to copy:

```bash
find sites/base-template -type f | grep -v node_modules | grep -v .next | sort
```

No commit for this phase — read only.

---

## Phase 1: Solaris Page Templates

**Goal:** Create all 12 page templates in `packages/themes/solaris/pages/` plus barrel export.
**Model:** sonnet

### Visual identity rules for ALL templates

- **Hero style:** `split-geometric` — left side has headline/subheading/CTA, right side has geometric panel using `.solaris-geo-1` through `.solaris-geo-4` shape divs
- **Color:** use Tailwind theme tokens only — `bg-brand-primary`, `bg-brand-accent`, `text-brand-primary`, `bg-surface-background`, `text-surface-foreground`, `text-surface-muted-foreground`, `bg-surface-card`, `border-surface-card-border`. NEVER hardcode hex values in templates.
- **Exception:** The right-hand geometric hero panel can use `bg-brand-primary/10` or similar opacity variants for the background tint.
- **Animation classes from globals.css:** Apply `solaris-reveal solaris-stagger-N` to section headings and grid items for scroll-in effects.
- **Cards:** elevated style — `bg-surface-card rounded-[20px] shadow-md` with `solaris-card-hover solaris-card-accent` classes for hover lift and accent bar.
- **Typography:** `font-headline` for headings (Space Grotesk), `font-body` for body text (Inter). These resolve via Tailwind from theme config.
- **Server Components:** No `'use client'` directive on any template file.

### 1a. `packages/themes/solaris/pages/home.tsx`

```typescript
interface SolarisHomePageProps extends HomePageTemplateProps {
  testimonials?: TestimonialSummary[];
}
export function SolarisHomePage({
  siteConfig,
  services,
  locations,
  heroHeadline,
  heroSubheading,
  testimonials,
  schemaNodes,
}: SolarisHomePageProps);
```

Sections in order:

1. **Hero** — split-geometric layout. Left: `<h1>` with heroHeadline, `<p>` with heroSubheading or siteConfig.tagline, two CTA buttons (primary from siteConfig.cta.primary, secondary linking to `/services`). Right: geo shapes panel with absolute-positioned `.solaris-geo-1` through `.solaris-geo-4` divs inside a relative container.
2. **Stats bar** — 3-column strip using `siteConfig.stats` (value + label + Material Symbol icon). Background: `bg-brand-primary` with white text.
3. **Services grid** — "What We Do" heading, 6-card grid (2 rows × 3 cols on desktop). Each card: icon, title, description, "Learn more →" link. Apply `solaris-card-hover solaris-card-accent`.
4. **Why DCS section** — 3 feature columns with icons: "No DIY hassle", "Built for Google", "Fixed pricing". Background `bg-surface-background`.
5. **Testimonials** — conditional on `testimonials` prop. 3 quote cards in a row.
6. **CTA banner** — `bg-brand-accent` strip. Headline "Ready to get more enquiries?" + CTA button linking to `/contact`.

### 1b. `packages/themes/solaris/pages/services.tsx`

```typescript
export function SolarisServicesPage({
  siteConfig,
  services,
  schemaNodes,
}: ServicesPageTemplateProps);
```

Sections:

1. **Hero** — full-width, `bg-brand-primary` background. Breadcrumb + `<h1>` + subheading.
2. **Services grid** — 3-col elevated card grid. Each card: service title, description, "Find out more →" link to `/services/[slug]`.

### 1c. `packages/themes/solaris/pages/service-detail.tsx`

```typescript
export function SolarisServiceDetailPage({
  siteConfig,
  service,
  content,
  schemaNodes,
}: ServiceDetailPageTemplateProps);
```

Sections:

1. **Hero** — `bg-brand-primary`, breadcrumb, `<h1>` from service.title.
2. **Two-column layout** — left: MDX content prose (`prose` class), right: sticky sidebar with CTA card (phone + link to `/contact`).

### 1d. `packages/themes/solaris/pages/locations.tsx`

```typescript
export function SolarisLocationsPage({
  siteConfig,
  locations,
  schemaNodes,
}: LocationsPageTemplateProps);
```

Sections:

1. **Hero** — `bg-brand-primary`, `<h1>` "Areas We Serve".
2. **Locations grid** — 3-col cards. Each: town name, short description, "Learn more →" link.

### 1e. `packages/themes/solaris/pages/location-detail.tsx`

```typescript
export function SolarisLocationDetailPage({
  siteConfig,
  location,
  content,
  nearbyLocations,
  schemaNodes,
}: LocationDetailPageTemplateProps);
```

Sections:

1. **Hero** — `bg-brand-primary`, breadcrumb, `<h1>` from location.title.
2. **Two-column layout** — prose left, sidebar right with CTA + nearby locations list.

### 1f. `packages/themes/solaris/pages/blog.tsx`

```typescript
export function SolarisBlogPage({ siteConfig, posts, schemaNodes }: BlogPageTemplateProps);
```

Sections:

1. **Hero** — `bg-brand-primary`, `<h1>` "Blog & Guides".
2. **Posts grid** — 3-col cards. Each: date, title, excerpt, "Read more →". Apply `solaris-card-hover`.

### 1g. `packages/themes/solaris/pages/blog-post.tsx`

```typescript
export function SolarisBlogPostPage({
  siteConfig,
  post,
  content,
  relatedPosts,
  schemaNodes,
}: BlogPostPageTemplateProps);
```

Sections:

1. **Hero** — `bg-brand-primary`, breadcrumb, `<h1>` from post.title, date + author.
2. **Two-column layout** — prose left, sidebar right with CTA card + related posts list.

### 1h. `packages/themes/solaris/pages/projects.tsx`

```typescript
export function SolarisProjectsPage({
  siteConfig,
  projects,
  schemaNodes,
}: ProjectsPageTemplateProps);
```

Sections:

1. **Hero** — `bg-brand-primary`, `<h1>` "Our Work".
2. **Projects grid** — 3-col elevated cards. Each: project title, category badge, excerpt, "View project →".

### 1i. `packages/themes/solaris/pages/project-detail.tsx`

```typescript
export function SolarisProjectDetailPage({
  siteConfig,
  project,
  content,
  schemaNodes,
}: ProjectDetailPageTemplateProps);
```

Sections:

1. **Hero** — `bg-brand-primary`, breadcrumb, `<h1>` from project.title.
2. **Content area** — full-width prose with MDX content.
3. **CTA banner** — `bg-brand-accent`, "Like what you see? Let's talk." + button.

### 1j. `packages/themes/solaris/pages/reviews.tsx`

```typescript
export function SolarisReviewsPage({
  siteConfig,
  testimonials,
  schemaNodes,
}: ReviewsPageTemplateProps);
```

Sections:

1. **Hero** — `bg-brand-primary`, `<h1>` "Client Reviews".
2. **Testimonials grid** — 3-col quote cards. Each: quote text, name, trade/business. Star rating icons (Material Symbols `star` with `FILL=1`).

### 1k. `packages/themes/solaris/pages/about.tsx`

```typescript
export function SolarisAboutPage({ siteConfig, schemaNodes }: AboutPageTemplateProps);
```

Sections:

1. **Hero** — `bg-brand-primary`, `<h1>` "About Digital Consulting Services".
2. **Story** — `siteConfig.about?.story` prose. Two-column on desktop (text left, placeholder image right).
3. **Credentials** — 3-col stats from `siteConfig.stats`.
4. **Values** — 3 value cards: "We care about your results", "No jargon, no hassle", "Always reachable".
5. **CTA** — `bg-brand-accent` strip.

### 1l. `packages/themes/solaris/pages/contact.tsx`

```typescript
export function SolarisContactPage({ siteConfig, schemaNodes }: ContactPageTemplateProps);
```

Sections:

1. **Hero** — `bg-brand-primary`, `<h1>` "Get In Touch".
2. **Two-column layout:**
   - Left: contact form (name, email, phone, message, submit — plain HTML form with `action="/api/contact"` method `POST`)
   - Right: contact details panel — phone, email, address, hours from `siteConfig`.

### 1m. `packages/themes/solaris/pages/index.ts`

Barrel export of all 12 components and their prop types:

```typescript
export { SolarisHomePage } from "./home";
export type { SolarisHomePageProps } from "./home";
export { SolarisServicesPage } from "./services";
export { SolarisServiceDetailPage } from "./service-detail";
export { SolarisLocationsPage } from "./locations";
export { SolarisLocationDetailPage } from "./location-detail";
export { SolarisBlogPage } from "./blog";
export { SolarisBlogPostPage } from "./blog-post";
export { SolarisProjectsPage } from "./projects";
export { SolarisProjectDetailPage } from "./project-detail";
export { SolarisReviewsPage } from "./reviews";
export { SolarisAboutPage } from "./about";
export { SolarisContactPage } from "./contact";
```

### Parallelism within Phase 1

The 12 template files do NOT share state — write them in parallel batches. Use Task agents:

**Batch A (launch together):** home.tsx, services.tsx, service-detail.tsx, locations.tsx, location-detail.tsx, blog.tsx
**Batch B (launch together after Batch A is done):** blog-post.tsx, projects.tsx, project-detail.tsx, reviews.tsx, about.tsx, contact.tsx
**Then:** write index.ts

Each Task agent: model: sonnet. Prompt includes the spec for that file only, plus a reminder of visual identity rules and the prop types from `page-template-types.ts`.

```bash
# Verification gate — STOP if this fails
pnpm type-check
```

```bash
git add packages/themes/solaris/pages/
git commit -m "$(cat <<'EOF'
feat(solaris): add 12 page templates for Solaris theme

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>
EOF
)"
```

---

## Phase 2: Scaffold sites/dcs/

**Goal:** Copy base-template structure into `sites/dcs/` and wire to Solaris theme.
**Model:** sonnet

Copy every file from `sites/base-template/` to `sites/dcs/`, then update each config file. Do NOT copy `node_modules/`, `.next/`, or any build artifacts.

### `sites/dcs/package.json`

Base on `sites/_castor-plumbing/package.json`. Set:

- `"name": "@platform/dcs"`
- Keep the same dependencies (Next.js, Tailwind, etc.)
- Build script MUST be: `"build": "next build --webpack"` (no turbopack in CI)
- Dev script: `"dev": "next dev --turbopack"` (turbopack only for local dev)

### `sites/dcs/vercel.json`

```json
{
  "framework": "nextjs",
  "installCommand": "cd ../.. && pnpm install --filter @platform/dcs...",
  "buildCommand": "cd ../.. && pnpm build --filter @platform/dcs"
}
```

**Do NOT set `outputDirectory`** — Vercel resolves `.next` relative to `rootDirectory` automatically.

### `sites/dcs/site.config.ts`

Model on `sites/_castor-plumbing/site.config.ts`. DCS-specific values:

```
name: "Digital Consulting Services"
shortName: "DCS"
tagline: "Websites that get local tradespeople more jobs"
domain: "digitalconsultingservices.co.uk"
phone: "07395 063764"
email: "mail@digitalconsultingservices.co.uk"
address:
  street: "Unit H3, Chaucer Business Park, Dittons Road"
  city: "Polegate"
  county: "East Sussex"
  postcode: "BN26 6QH"
  country: "GB"
geo: { latitude: 50.8233, longitude: 0.2557 }
yearEstablished: 2019
businessType: "ProfessionalService"
nav: [
  { label: "Services", href: "/services" },
  { label: "Pricing", href: "/pricing" },
  { label: "Portfolio", href: "/projects" },
  { label: "Blog", href: "/blog" },
  { label: "About", href: "/about" },
]
cta:
  primary: { label: "Get a free quote", href: "/contact" }
  phone: { show: true }
stats: [
  { value: "5+", label: "Years Building Local Websites", icon: "schedule" },
  { value: "20+", label: "Sites Delivered", icon: "language" },
  { value: "100%", label: "Managed — We Handle Everything", icon: "support_agent" },
]
services: [
  { slug: "web-design", title: "Website Design", description: "Bespoke websites built for local tradespeople. No templates, no DIY." },
  { slug: "local-seo", title: "Local SEO", description: "Built-in local SEO: service pages, location pages, Schema markup, Google ranking." },
  { slug: "monthly-management", title: "Ongoing Management", description: "We look after your site so you can focus on your trade." },
  { slug: "google-workspace", title: "Google Workspace Email", description: "Professional business email setup via Google Workspace." },
]
testimonials: [
  { name: "Mark H.", trade: "Electrician, Brighton", quote: "My phone started ringing within two weeks of the site going live. Ricky handled everything — I didn't have to do a thing." },
  { name: "Sarah T.", trade: "Plumber, Eastbourne", quote: "I was spending £80 a month on a website that wasn't getting me anything. Now I pay less and actually get enquiries." },
  { name: "Dave C.", trade: "Scaffolding Contractor, Lewes", quote: "The site looks exactly how I wanted. Professional, clear, and it shows up on Google when people search for scaffolding near me." },
]
footer:
  showServices: true
  showLocations: true
  maxServices: 4
  maxLocations: 6
  copyright: "© 2026 Digital Consulting Services. All rights reserved."
  builtBy: null  # DCS built their own site — no "built by" attribution
hours:
  weekdays: "Mon–Fri: 9:00 AM – 5:30 PM"
  saturday: "Sat: By appointment"
  sunday: "Sun: Closed"
```

### `sites/dcs/theme.config.ts`

```typescript
import { solarisRegistry, solarisDefaultConfig } from "@platform/themes/solaris";
import type { ComponentRegistry, DeepPartialThemeConfig } from "@platform/theme-system";

export const registry: ComponentRegistry = solarisRegistry;
export const themeConfig: DeepPartialThemeConfig = solarisDefaultConfig;
```

### `sites/dcs/app/layout.tsx`

Model closely on `sites/_castor-plumbing/app/layout.tsx`. Key differences:

- Font imports: `Space_Grotesk` (weights 400, 500, 600, 700) and `Inter` (weights 400, 500, 600) via `next/font/google`
- Apply both font variables to `<html>` element
- `<ThemeProvider theme="solaris" registry={solarisRegistry}>`
- Header: `<SolarisHeader>` with nav from `siteConfig.nav`, cta from `siteConfig.cta`, phone from `siteConfig.phone`
- Footer: `<SolarisFooter>` with columns:
  - "Services": web-design, local-seo, monthly-management, google-workspace
  - "Locations": Polegate, Eastbourne, Brighton, Hove, Lewes, Seaford
  - "Company": About, Portfolio, Pricing, Blog, Contact
  - "Contact": phone, email, address

### `sites/dcs/app/page.tsx`

Follow `sites/_castor-plumbing/app/page.tsx` pattern exactly. Render `<SolarisHomePage>` with:

- `siteConfig` summary mapped from site.config.ts
- `services` from `siteConfig.services`
- `locations` from `getLocations()`
- `testimonials` from `siteConfig.testimonials`
- `schemaNodes` — generate LocalBusiness, WebSite, and BreadcrumbList JSON-LD

### All other route files

Create `app/services/`, `app/services/[slug]/`, `app/locations/`, `app/locations/[slug]/`, `app/blog/`, `app/blog/[slug]/`, `app/projects/`, `app/projects/[slug]/`, `app/reviews/`, `app/about/`, `app/contact/` following the castor-plumbing pattern for each. Each `page.tsx` renders the corresponding `Solaris*Page` component.

Also create `app/pricing/page.tsx` — this is a custom page not backed by a Solaris template. Write it directly as a Next.js Server Component. See the Pricing Page spec in Phase 3.

### `sites/dcs/tailwind.config.ts`

Copy from `sites/_castor-plumbing/tailwind.config.ts`. Update content globs to reference `dcs` paths. Ensure content includes:

- `packages/themes/solaris/*.{ts,tsx,css}`
- `packages/themes/solaris/components/**/*.{ts,tsx}`
- `packages/themes/solaris/pages/**/*.{ts,tsx}`
- Use `packages/themes/solaris/*` pattern — NEVER `packages/themes/**` (descends into node_modules).

### `sites/dcs/lib/` shim files

Copy all `lib/` shim files from `sites/_castor-plumbing/lib/` and update the factory configs with DCS values. These thin shims call the core-components factory functions.

```bash
# Verification gate — STOP if this fails
pnpm type-check
```

```bash
git add sites/dcs/
git commit -m "$(cat <<'EOF'
feat(dcs): scaffold DCS site wired to Solaris theme

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>
EOF
)"
```

---

## Phase 3: DCS Content

**Goal:** Populate all content files — services, locations, projects, blog posts, and the pricing page.
**Model:** sonnet for prose-heavy files; haiku for mechanical MDX file generation

### Important framing rules for ALL content

- DCS is a **web agency**, not a tradesperson. All copy talks to tradespeople as the audience.
- Tone: plain, direct, no jargon. "We build websites that get you more jobs" — not "We leverage cutting-edge technology".
- Location framing: DCS is **UK-wide**, based in East Sussex. Never imply DCS can only serve local clients.
- Pricing: Service pages focus on VALUE. Never list specific prices on service pages — those live only on `/pricing`.
- Do NOT include the logo/branding service (DCS does not offer this).

### 3a. Service MDX files (4 files in `content/services/`)

Model on `sites/_castor-plumbing/content/services/` MDX shape. Each file needs: title, description, heroHeadline, intro, FAQs (5–8), coverage area blurb.

**Spawn 4 Task agents in parallel (model: sonnet each):**

**Agent 1 — `web-design.mdx`:**

- Title: "Website Design for Tradespeople"
- Lead angle: "from £59/month" pay-monthly option prominently mentioned in intro; upfront from £995 also noted as an option. Emphasise: bespoke design (not a template they fiddle with), mobile-first, fast, managed — they never log into a CMS.
- 6 FAQs: what's included, how long to build, what if I want changes, do I need a domain, is it mobile-friendly, will it work on Google
- Coverage: "We build websites for tradespeople across the UK."

**Agent 2 — `local-seo.mdx`:**

- Title: "Local SEO for Tradespeople"
- Angle: local SEO is built into every DCS site, not an add-on. Service pages, location pages, Schema markup (structured data), Google Business Profile guidance, sitemap submission.
- 6 FAQs: what is local SEO, how long until I rank, do I need to do anything, what are location pages, what is schema markup, can you guarantee rankings (answer: no, but here's what we do)
- No pricing on this page.

**Agent 3 — `monthly-management.mdx`:**

- Title: "Ongoing Website Management"
- Angle: frame entirely around the RELATIONSHIP and VALUE — DCS cares about your site's performance, you focus on your trade. Hosting, SSL, domain, security updates, content updates, and support are all included in the package clients already pay for. This page is about WHAT THAT MEANS for them, not the price.
- Key messages: you'll never get a surprise bill, your site stays fast and secure, if something breaks we fix it, we monitor it so you don't have to.
- 6 FAQs: what's included in management, how do I request a content change, what if my site breaks, do I own my domain, what happens if I want to cancel, how quickly do you respond

**Agent 4 — `google-workspace.mdx`:**

- Title: "Google Workspace Business Email"
- Angle: professional email (you@yourbusiness.co.uk) via Google Workspace. DCS handles the setup and DNS; Google bills the client directly.
- Clearly explain the pass-through cost structure: DCS setup fee is one-off, then Google charges ~£5.50/user/month (Business Starter). Contrast with what they're probably using (Gmail personal, or BT email).
- Show what the 3 Google Workspace tiers allow: Business Starter (30GB, video calls, basic), Business Standard (2TB, recording, 150 participant Meet), Business Plus (5TB, eDiscovery, 500 participant Meet). Most tradespeople need Business Starter.
- 5 FAQs: what email address will I get, who pays Google, can I have multiple accounts, what if I already have a Gmail, is it hard to set up

### 3b. Location MDX files (8 files in `content/locations/`)

**Spawn all 8 as a single parallel batch (model: haiku — mechanical generation).**

Each location file: slug, title ("Website Design for [Trade] in [Town]" — but this is the DCS site so framing is "We Build Websites for Tradespeople in [Town]"), coords, description (120–160 chars), hero description (3–4 sentences), coverage blurb.

For every location, the copy must:

1. Make clear DCS serves the whole UK — [Town] is one of many areas
2. Mention DCS's East Sussex base for credibility
3. Focus on tradespeople in that area as the audience

Towns: Polegate (home base — mention the office address), Eastbourne, Hailsham, Lewes, Seaford, Brighton, Hove, Uckfield.

| Slug         | Town       | Coords             |
| ------------ | ---------- | ------------------ |
| `polegate`   | Polegate   | [50.8233, 0.2557]  |
| `eastbourne` | Eastbourne | [50.7687, 0.2904]  |
| `hailsham`   | Hailsham   | [50.8621, 0.2590]  |
| `lewes`      | Lewes      | [50.8733, 0.0097]  |
| `seaford`    | Seaford    | [50.7720, 0.1031]  |
| `brighton`   | Brighton   | [50.8225, -0.1372] |
| `hove`       | Hove       | [50.8272, -0.1687] |
| `uckfield`   | Uckfield   | [50.9675, 0.0872]  |

### 3c. Project case studies (3 files in `content/projects/`)

**Spawn 3 Task agents in parallel (model: sonnet):**

**Agent 1 — `colossus-scaffolding.mdx`:**

- Real client. Colossus Scaffolding, East Sussex. Platform build (Vega theme, navy).
- Story: they had no website, needed to look professional for larger contracts, we built them a 30-page site with full local SEO, it went live and they started getting enquiries from Google within weeks.
- Category: website-build
- Include: challenge, solution, result format.

**Agent 2 — `wordpress-to-platform-rebuild.mdx`:**

- Fictional but plausible. A plumber in Eastbourne with an outdated WordPress site, paying £80/month for hosting + maintenance. We rebuilt their site on the platform — faster, cheaper, better SEO.
- Challenge: slow site, high hosting costs, no local SEO.
- Result: faster load times, rank on page 1 for "plumber Eastbourne".

**Agent 3 — `new-website-from-scratch.mdx`:**

- Fictional sole trader (painter & decorator, Brighton) who had no website, was relying entirely on word of mouth, wanted to expand. Built a 20-page site, set up Google Workspace, submitted to Google Search Console.
- Result: first enquiry from Google within 3 weeks, now gets 2–3 leads per month from the website.

### 3d. Blog posts (20 posts in `content/blog/`)

**Generate all 20 in parallel — spawn 4 Task agents (model: sonnet), each writing 5 posts.**

All posts: 600–900 words, genuine useful content targeting keywords tradespeople or their potential employers would search. Each needs: title, slug, date (stagger across 2025–2026), excerpt (150–180 chars), body.

**Agent 1 — Getting found online (5 posts):**

1. `why-tradespeople-need-a-website.mdx` — "Your customers Google you before they call. Here's what they find."
2. `local-seo-for-tradespeople.mdx` — What local SEO actually is, why it matters, what we do
3. `how-to-rank-on-google-maps.mdx` — Google Business Profile, reviews, local citations
4. `what-is-a-google-business-profile.mdx` — Step-by-step explainer
5. `schema-markup-for-tradespeople.mdx` — Plain-English explanation of structured data

**Agent 2 — Costs and value (5 posts):**

1. `how-much-does-a-tradesperson-website-cost.mdx` — Range breakdown (DIY vs freelancer vs agency vs DCS). Honest comparison.
2. `website-vs-facebook-page-for-tradespeople.mdx` — Why you need both, why Facebook alone isn't enough
3. `pay-monthly-vs-upfront-website.mdx` — Pros and cons of both models; when each makes sense
4. `is-it-worth-paying-for-seo.mdx` — Realistic expectations; what good looks like
5. `how-to-get-more-leads-from-your-website.mdx` — CTAs, phone number visibility, contact forms, page speed

**Agent 3 — Content and copy (5 posts):**

1. `what-to-put-on-your-tradesperson-website.mdx` — The 7 things every tradesperson website needs
2. `service-pages-vs-location-pages-explained.mdx` — Why both matter for SEO
3. `how-to-write-a-good-testimonials-page.mdx` — Real vs generic reviews
4. `before-and-after-project-pages.mdx` — Why case studies convert better than service descriptions
5. `mobile-friendly-websites-for-tradespeople.mdx` — Why 70%+ of searches are mobile; what mobile-first means

**Agent 4 — Practical and industry-specific (5 posts):**

1. `how-to-get-google-reviews-as-a-tradesperson.mdx` — The review request process
2. `setting-up-google-workspace-for-small-business.mdx` — What you need, what it costs, how it works
3. `best-websites-for-electricians.mdx` — What makes a good electrician website; real examples
4. `best-websites-for-plumbers.mdx` — Same for plumbers
5. `best-websites-for-scaffolding-companies.mdx` — Same for scaffolders; reference Colossus

### 3e. Pricing page (`app/pricing/page.tsx`)

This is a custom Next.js Server Component — NOT backed by a Solaris template. Write it directly.

Structure:

1. **Hero** — `bg-brand-primary`, `<h1>` "Simple, Transparent Pricing"
2. **Payment toggle explainer** — two options side by side: "Upfront + Monthly" vs "Pay Monthly (no setup fee)". Brief explanation of each.
3. **Tier comparison table** (Starter / Professional / Growth):

   |                        | Starter   | Professional | Growth    |
   | ---------------------- | --------- | ------------ | --------- |
   | Pages                  | Up to 20  | Up to 50     | Up to 100 |
   | Upfront                | £995      | £1,995       | £3,495    |
   | Monthly (upfront)      | £15/mo    | £25/mo       | £50/mo    |
   | Pay-monthly            | £45/mo    | £75/mo       | £125/mo   |
   | Min term (pay-monthly) | 12 months | 12 months    | 12 months |

4. **What's included on every tier** — bullet list: custom design, local SEO built-in, mobile responsive, contact form, hosting + SSL + domain, ongoing support, unlimited revision rounds during build.
5. **What differs between tiers** — page count, monthly service level (content updates per month: 1/2/4).
6. **Extras & Add-ons section** — heading "We can also add…". List each add-on with a 1-sentence description, NO prices. End with: "Prices vary — get in touch to discuss what you need." Add-ons to list: review capture widget, SMS lead notification, call tracking number, AI chatbot FAQ, booking calendar integration, Google My Business setup, Google Ads management.
7. **FAQ** — 5 questions: "Do I own my website?", "What happens if I want to cancel?", "Can I upgrade my tier later?", "Is there a contract?", "What's included in 'managed hosting'?"
8. **CTA** — `bg-brand-accent` strip. "Not sure which tier is right for you? Let's talk." + button to `/contact`.

```bash
# Verification gate — STOP if this fails
pnpm type-check
```

```bash
git add sites/dcs/content/ sites/dcs/app/pricing/
git commit -m "$(cat <<'EOF'
feat(dcs): add DCS site content — services, locations, blog, projects, pricing

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>
EOF
)"
```

---

## Phase 4: Build Verification

**Goal:** Confirm the DCS site builds successfully.
**Model:** haiku — verification only

```bash
# Verification gate — STOP if this fails
cd /Users/rickywilson/Sites/local-business-platform
pnpm type-check
```

```bash
# Full site build
cd /Users/rickywilson/Sites/local-business-platform/sites/dcs
npm run build
```

If the build fails, diagnose and fix the error before continuing. Common issues:

- Missing `generateStaticParams` on dynamic routes — copy pattern from castor-plumbing
- Import path errors — check that `@platform/themes/solaris/pages` subpath exists in `packages/themes/solaris/package.json`
- CSS token not found — ensure `tailwind.config.ts` content globs include solaris pages directory
- `outputDirectory` set in vercel.json — remove it

If `packages/themes/solaris/package.json` doesn't have a `pages` subpath export, add it:

```json
"./pages": {
  "types": "./pages/index.ts",
  "import": "./pages/index.ts"
}
```

No commit for this phase unless fixes were required. If fixes needed: commit with `fix(dcs): resolve build errors`.

---

## Parallel execution groups

This section is the authoritative execution plan. Items in a group MUST be launched in a single Task-tool message. Groups run sequentially in the order listed.

### Intra-phase groups

| Group | Phase   | Items                                                                                                                                                                                              | File overlap      | Model  | Rationale                                                                           |
| ----- | ------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------- | ------ | ----------------------------------------------------------------------------------- |
| G1    | Phase 0 | Read all 30 reference files listed in Phase 0                                                                                                                                                      | none (reads only) | n/a    | All independent reads — batch in one message                                        |
| G2    | Phase 1 | Write home.tsx, services.tsx, service-detail.tsx, locations.tsx, location-detail.tsx, blog.tsx                                                                                                     | none              | sonnet | Independent files in new directory — no overlap                                     |
| G3    | Phase 1 | Write blog-post.tsx, projects.tsx, project-detail.tsx, reviews.tsx, about.tsx, contact.tsx                                                                                                         | none              | sonnet | Second batch of independent template files                                          |
| G4    | Phase 1 | Write pages/index.ts                                                                                                                                                                               | none              | haiku  | Barrel export only — depends on G2+G3 being done                                    |
| G5    | Phase 2 | Write package.json, vercel.json, theme.config.ts, tailwind.config.ts                                                                                                                               | none              | haiku  | Mechanical config files — no overlap                                                |
| G6    | Phase 2 | Write site.config.ts, app/layout.tsx                                                                                                                                                               | none              | sonnet | Config-heavy files — independent                                                    |
| G7    | Phase 2 | Write app/page.tsx + all route page.tsx files (services index, service [slug], locations index, location [slug], blog index, blog [slug], projects index, project [slug], reviews, about, contact) | none              | sonnet | Route files follow a clear pattern — can parallelize with one agent per route group |
| G8    | Phase 3 | Write web-design.mdx, local-seo.mdx, monthly-management.mdx, google-workspace.mdx (service content)                                                                                                | none              | sonnet | 4 independent MDX content files                                                     |
| G9    | Phase 3 | Write all 8 location MDX files                                                                                                                                                                     | none              | haiku  | Mechanical location file generation                                                 |
| G10   | Phase 3 | Write 3 project case study MDX files                                                                                                                                                               | none              | sonnet | Independent case study files                                                        |
| G11   | Phase 3 | Write blog posts batch 1 (5 posts: getting-found-online group)                                                                                                                                     | none              | sonnet | First batch of blog content                                                         |
| G12   | Phase 3 | Write blog posts batch 2 (5 posts: costs-and-value group)                                                                                                                                          | none              | sonnet | Second batch — independent of G11                                                   |
| G13   | Phase 3 | Write blog posts batch 3 (5 posts: content-and-copy group)                                                                                                                                         | none              | sonnet | Third batch — independent of G11, G12                                               |
| G14   | Phase 3 | Write blog posts batch 4 (5 posts: practical-and-industry group)                                                                                                                                   | none              | sonnet | Fourth batch — independent of others                                                |
| G15   | Phase 3 | Write app/pricing/page.tsx                                                                                                                                                                         | none              | sonnet | Custom pricing page — independent                                                   |

Note: G11–G15 can all run simultaneously (launch in one message) since they write to different files.

### Cross-phase groups

| Group | Phases            | Items                                            | Rationale                                                                                                                                                                                                                              |
| ----- | ----------------- | ------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| CG1   | Phase 2 + Phase 3 | Phase 2 lib/ shims and Phase 3 content MDX files | No file overlap — lib/ and content/ are separate directories. Only safe to parallelise if Phase 2 site.config.ts is already committed (content generators may import from site.config). **Default: run Phase 2 fully before Phase 3.** |

### Sequential points — MUST NOT parallelise

| Item                                        | Reason                                                                                                 |
| ------------------------------------------- | ------------------------------------------------------------------------------------------------------ |
| Phase 0 reads before Phase 1 writes         | Must understand prop types and castor patterns before writing solaris templates                        |
| `pnpm type-check` gates between phases      | Each phase's output gates the next                                                                     |
| G3 depends on G2 being done                 | blog-post.tsx through contact.tsx — write after first 6 to avoid any accidental index.ts partial state |
| Git commits                                 | One commit per phase, in order                                                                         |
| Phase 2 site.config.ts before lib/ shims    | Shims import from site.config                                                                          |
| Phase 4 build after Phase 3 fully committed | Build must see all content files                                                                       |

---

## Cost Estimate

| Phase                                    | Model  | Est. input tokens | Est. output tokens | Est. cost  |
| ---------------------------------------- | ------ | ----------------- | ------------------ | ---------- |
| Phase 0: Read 30 reference files         | haiku  | ~50k              | ~0                 | ~$0.013    |
| Phase 1: 12 page templates + barrel      | sonnet | ~35k              | ~15k               | ~$0.33     |
| Phase 2: Site scaffold (config + routes) | sonnet | ~25k              | ~12k               | ~$0.255    |
| Phase 3a: Service MDX (4 files)          | sonnet | ~12k              | ~6k                | ~$0.126    |
| Phase 3b: Location MDX (8 files)         | haiku  | ~10k              | ~4k                | ~$0.008    |
| Phase 3c: Project MDX (3 files)          | sonnet | ~10k              | ~4k                | ~$0.087    |
| Phase 3d: Blog (20 posts)                | sonnet | ~30k              | ~25k               | ~$0.465    |
| Phase 3e: Pricing page                   | sonnet | ~8k               | ~3k                | ~$0.069    |
| Phase 4: Verification + fixes            | haiku  | ~8k               | ~2k                | ~$0.005    |
| **Total**                                |        | **~188k**         | **~71k**           | **~$1.36** |

Rates: Sonnet $3/$15 per MTok, Haiku $0.25/$1.25 per MTok.

---

## Final Report

After all phases complete, output:

1. Phases completed — list each with commit SHA
2. Build status — confirm `pnpm type-check` and `npm run build` (in sites/dcs) both pass
3. Files created — counts: templates, routes, MDX files, config files
4. Any exceptions or intentional deviations from the plan
5. Token usage and cost estimate:

   | Model     | Est. input tokens | Est. output tokens | Est. cost |
   | --------- | ----------------- | ------------------ | --------- |
   | sonnet    | [total]           |                    | $X.XX     |
   | haiku     | [total]           |                    | $X.XX     |
   | **Total** |                   |                    | **$X.XX** |

---

## Update Session File

After completing all phases, append to `output/sessions/2026-04-12_dcs-website/yolo-brief.md`:

```markdown
## Completed

**Date:** [today]
**Status:** All phases executed successfully

[1-paragraph summary: what was implemented, any surprises]

### Commits

[list each commit SHA and message]
```

Confirm this was done in the final report.

---

## Run Wrap-Up

After completing all phases and updating the session file, run:

/wrap-up-session

This writes `session-wrap-up.md` to the session folder. **This is a required final step — do not skip it.**

---

## Rules

- STOP on any failed verification gate — do not continue to next phase
- **STOP at pre-flight if `feature/stitch-html-to-react` is not yet merged into develop** — report the blocker and exit
- Read every file before editing it
- Never push — leave all changes on the feature branch
- **Consult the `## Parallel execution groups` section before launching any work.** Every item listed in a group MUST be launched in a single Task-tool message.
- **Items NOT listed in any group run sequentially.**
- **Never parallelise across phase boundaries unless the Cross-phase groups table explicitly lists the phases.**
- **If the groups table and the phase prose disagree, the groups table wins.**
- Minimal changes only — implement what the plan says, nothing more
- NEVER hardcode hex colors in page templates — always use Tailwind theme tokens (`bg-brand-primary`, `text-surface-foreground`, etc.)
- Page templates are Server Components — no `'use client'` directive
- DCS is a web agency targeting tradespeople — copy must reflect this at all times
- `sites/dcs/vercel.json` must NOT set `outputDirectory`
- Build script must use `next build --webpack`, dev script uses `next dev --turbopack`
- Use `model: haiku` for Task agents doing mechanical work; `model: sonnet` for standard edits; `model: opus` only for deep multi-file reasoning
- The Co-Authored-By line in commits must be `Claude Sonnet 4.6 <noreply@anthropic.com>`
