# YOLO Implementation Brief: Castor Plumbing — Full Site Build

**Branch:** feature/castor-plumbing-build (created from develop)
**Session spec:** output/sessions/2026-04-11_castor-plumbing-build/yolo-brief.md
**Mode:** Autonomous execution — implement all phases, verify after each, STOP on error
**Orchestrator model:** sonnet

---

## Context

The site `sites/_castor-plumbing` was scaffolded on 2026-04-11 from base-template and wired to the `@platform/themes/castor` theme package. The wiring is correct, but every content file (`site.config.ts`, `content/services/*.mdx`, `content/locations/*.mdx`, `content/blog/*.mdx`, `content/projects/*.mdx`, `content/testimonials/*.mdx`) still contains base-template placeholder copy ("Primary Service", "123 Main Street", "info@example.com", "Main Area / North Region / South Region"). As a result the site renders as "base-template with a colour swap" instead of looking like a real plumbing business on the castor theme.

This brief populates `_castor-plumbing` with fully-realised fictional content for **Castor & Sons Plumbing**, a plausible family-run plumbing firm based in Lewes, East Sussex. The business details are pinned inside this brief so every service / location / testimonial references consistent facts. `sites/mad-graphics` is the reference implementation for what the finished content shape should look like.

The plan was discussed and approved interactively (see `~/.claude/plans/quizzical-mixing-pony.md`). Implement it exactly as specified below.

---

## Pinned Fictional Business Facts

**Every file written in this session MUST reference these facts. Do not invent alternatives mid-session.**

| Field            | Value                                                                                         |
| ---------------- | --------------------------------------------------------------------------------------------- |
| Trading name     | Castor & Sons Plumbing                                                                        |
| Legal name       | Castor & Sons Plumbing Ltd                                                                    |
| Tagline          | Family-run plumbing and heating — East Sussex since 1987                                      |
| Owner            | Marcus Castor (second generation; took over from father John Castor in 2009)                  |
| Year established | 1987                                                                                          |
| Address          | Unit 7, Cliffe Industrial Estate, South Downs Road, Lewes, East Sussex, BN7 2BH               |
| Phone            | 01273 488 900                                                                                 |
| Email            | office@castorandsons.co.uk                                                                    |
| Domain           | castorandsons.co.uk                                                                           |
| Geo              | latitude 50.8733, longitude 0.0097 (Lewes)                                                    |
| Hours            | Mon–Fri 8:00 AM – 5:30 PM, Sat 9:00 AM – 1:00 PM (emergency only), Sun 24/7 emergency callout |
| Gas Safe reg     | 512384 (fictional)                                                                            |
| CIPHE membership | Yes (Member of The Chartered Institute of Plumbing and Heating Engineering)                   |
| Insurance        | £5M public liability, £2M professional indemnity                                              |
| Staff            | 8 (Marcus + 6 engineers + 1 office)                                                           |

### Covered locations (Lewes + 7 surrounding towns)

Each gets its own `content/locations/*.mdx` file:

1. **Lewes** (base town) — slug `lewes`, coords [50.8733, 0.0097]
2. **Brighton** — slug `brighton`, coords [50.8225, -0.1372]
3. **Hove** — slug `hove`, coords [50.8272, -0.1687]
4. **Seaford** — slug `seaford`, coords [50.7720, 0.1031]
5. **Newhaven** — slug `newhaven`, coords [50.7921, 0.0567]
6. **Peacehaven** — slug `peacehaven`, coords [50.7936, -0.0028]
7. **Uckfield** — slug `uckfield`, coords [50.9675, 0.0872]
8. **Haywards Heath** — slug `haywards-heath`, coords [50.9966, -0.1078]

### Services (10 services)

Each gets its own `content/services/*.mdx` file:

1. **Boiler Installation** — slug `boiler-installation` — installation category
2. **Boiler Repair & Servicing** — slug `boiler-repair-servicing` — maintenance category
3. **Emergency Plumber (24/7)** — slug `emergency-plumber` — repair category
4. **Bathroom Installation** — slug `bathroom-installation` — installation category
5. **Central Heating Installation** — slug `central-heating-installation` — installation category
6. **Power Flushing** — slug `power-flushing` — maintenance category
7. **Leak Detection & Repair** — slug `leak-detection-repair` — repair category
8. **Blocked Drains** — slug `blocked-drains` — repair category
9. **Radiator Installation & Repair** — slug `radiator-installation-repair` — installation category
10. **Landlord Gas Safety Certificates** — slug `landlord-gas-safety` — maintenance category

### Projects (4 case studies)

Each gets its own `content/projects/*.mdx` file. Use `projectType` of "residential" or "commercial" and a `ProjectCategory` value valid for the current schema (the plumbing industry is not yet in the enum — use `"renovation"` or `"maintenance"` or `"emergency"` which ARE in the enum).

1. **Victorian Bathroom Renovation, Lewes** — renovation, residential
2. **Emergency Boiler Replacement, Brighton** — emergency, residential
3. **Full Central Heating Install, Hove New Build** — new-build, residential
4. **Commercial Boiler Contract, Seaford Hotel** — maintenance, commercial

### Blog posts (5 articles)

Each gets its own `content/blog/*.mdx` file:

1. **How to Spot a Hidden Water Leak** — how-to-guide category
2. **When Should You Replace Your Boiler? Five Warning Signs** — industry-tips
3. **Preparing Your Heating System for Winter: A Homeowner's Checklist** — seasonal
4. **Why Your Radiators Are Cold at the Top (And What to Do About It)** — how-to-guide
5. **The Real Cost of Delaying a Leak Repair: Case Study from Brighton** — case-study

### Testimonials (6 reviews)

Each gets its own `content/testimonials/*.mdx` file. Fictional customer names, 4-5 star ratings, dates in 2025–2026, linked to specific services and locations from the lists above.

---

## Model Tiers

| Tier   | Alias    | Cost (in/out per MTok) | Use for                                                                                             |
| ------ | -------- | ---------------------- | --------------------------------------------------------------------------------------------------- |
| Opus   | `opus`   | $15 / $75              | Phases with >5 interdependent files, architectural rewrites, judgment calls not covered by the spec |
| Sonnet | `sonnet` | $3 / $15               | Standard implementation — file edits, feature wiring, most phases                                   |
| Haiku  | `haiku`  | $0.80 / $4             | Mechanical tasks: find-replace, import additions, grep checks, content validation                   |

Default orchestrator: **sonnet**. Default sub-agent: **sonnet** unless the task is clearly mechanical (→ haiku) or requires deep cross-file reasoning (→ opus).

Content writing requires realistic copy that references Lewes-specific geography, coastal/chalk-soil plumbing concerns, period-property details, and consistent business facts. That is a judgment task, not mechanical — **use sonnet for all content generation phases**. Use haiku only for the placeholder-deletion step.

---

## Pre-flight

```bash
git checkout develop && git pull
git checkout -b feature/castor-plumbing-build
pnpm type-check   # must be clean before starting
ls sites/_castor-plumbing/site.config.ts  # confirm scaffold exists
```

If `pnpm type-check` fails on entry, STOP and report — do not attempt fixes unrelated to this brief.

---

## Phase 1 — Delete placeholder content files

**Goal:** Remove all base-template placeholder MDX from `sites/_castor-plumbing/content/` so the new content is written into a clean directory and doesn't collide with old filenames.

**Model:** haiku — pure file deletion, no judgment

### Files to delete

```
sites/_castor-plumbing/content/services/primary-service.mdx
sites/_castor-plumbing/content/services/secondary-service.mdx
sites/_castor-plumbing/content/services/service-three.mdx
sites/_castor-plumbing/content/services/service-four.mdx
sites/_castor-plumbing/content/services/service-five.mdx
sites/_castor-plumbing/content/locations/main-area.mdx
sites/_castor-plumbing/content/locations/north-region.mdx
sites/_castor-plumbing/content/locations/south-region.mdx
sites/_castor-plumbing/content/blog/example-how-to-guide.mdx
sites/_castor-plumbing/content/blog/example-industry-tips.mdx
sites/_castor-plumbing/content/projects/example-residential-project.mdx
sites/_castor-plumbing/content/testimonials/example-testimonial-1.mdx
sites/_castor-plumbing/content/testimonials/example-testimonial-2.mdx
sites/_castor-plumbing/content/testimonials/example-testimonial-3.mdx
```

Also check for any service/location/blog/project MDX files not in the list above (someone may have added more) and delete those too — the target state is **empty content/\*/ directories** ready for the new files.

Use `rm` via Bash for each file. Do NOT touch any other files in the site.

### Verification gate — STOP if this fails

```bash
# Verification gate — STOP if this fails
test -z "$(ls sites/_castor-plumbing/content/services/ 2>/dev/null)" && echo "services empty"
test -z "$(ls sites/_castor-plumbing/content/locations/ 2>/dev/null)" && echo "locations empty"
test -z "$(ls sites/_castor-plumbing/content/blog/ 2>/dev/null)" && echo "blog empty"
test -z "$(ls sites/_castor-plumbing/content/projects/ 2>/dev/null)" && echo "projects empty"
test -z "$(ls sites/_castor-plumbing/content/testimonials/ 2>/dev/null)" && echo "testimonials empty"
```

All five "empty" lines must print. If any directory still contains files, stop and report which.

### Commit

```bash
git add -A sites/_castor-plumbing/content/
git commit -m "$(cat <<'EOF'
chore(_castor-plumbing): delete base-template placeholder MDX

Clear all content/services, content/locations, content/blog,
content/projects, and content/testimonials before populating with
real Castor & Sons Plumbing content.

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>
EOF
)"
```

---

## Phase 2 — Replace site.config.ts with real Castor & Sons values

**Goal:** Rewrite `sites/_castor-plumbing/site.config.ts` in full so the `siteConfig` export reflects the pinned business facts above. Interface definitions at the top of the file stay unchanged — only the `export const siteConfig: SiteConfig = { ... }` object is replaced.

**Model:** sonnet — requires careful mapping from pinned facts to typed config fields, plus consistent language

### Required changes to the `siteConfig` export

- `slug`: `"castor-plumbing"` (keep as-is)
- `domain`: `"castorandsons.co.uk"` (replace `"localhost"`)
- `name`: `"Castor & Sons Plumbing"` (replace `"Castor Plumbing"`)
- `tagline`: `"Family-run plumbing and heating — East Sussex since 1987"`
- `url`: keep the env var fallback, default `"http://localhost:3000"`
- `business.name`: `"Castor & Sons Plumbing"`
- `business.legalName`: `"Castor & Sons Plumbing Ltd"`
- `business.type`: `"LocalBusiness"` (union type does not yet include `Plumber`; do NOT invent a new value)
- `business.phone`: `"+44 1273 488900"`
- `business.email`: `"office@castorandsons.co.uk"`
- `business.address`: `{ street: "Unit 7, Cliffe Industrial Estate, South Downs Road", city: "Lewes", region: "East Sussex", postalCode: "BN7 2BH", country: "United Kingdom" }`
- `business.hours`: Mon–Fri `"8:00 AM - 5:30 PM"`, Sat `"9:00 AM - 1:00 PM (Emergency only)"`, Sun `"24/7 Emergency Callout"`
- `business.socialMedia`: facebook `"https://facebook.com/castorandsonsplumbing"`, instagram `"https://instagram.com/castorandsons_plumbing"`, remove twitter
- `business.geo`: `{ latitude: 50.8733, longitude: 0.0097 }`

**Navigation** (replace the main array):

```
[
  { label: "Services", href: "/services" },
  { label: "Locations", href: "/locations", hasDropdown: true },
  { label: "Projects", href: "/projects" },
  { label: "Blog", href: "/blog" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
]
```

**CTA**: primary label `"Get a Free Quote"`, href `/contact`; phone.show `true`, phone.label `"Call 01273 488 900"`

**Footer**: maxServices `10`, maxLocations `8`, copyright `"2026 Castor & Sons Plumbing Ltd. All rights reserved."`, builtBy unchanged (DCS credit stays)

**Credentials**:

- `yearEstablished`: `"1987"`
- `stats`:
  1. `{ value: "37+", label: "Years Experience", description: "Family-run since 1987" }`
  2. `{ value: "12,000+", label: "Jobs Completed", description: "Across East Sussex" }`
  3. `{ value: "24/7", label: "Emergency Callout", description: "Sundays and bank holidays" }`
  4. `{ value: "Gas Safe", label: "Registered", description: "Reg. 512384" }`
- `certifications`:
  1. `{ name: "Gas Safe Registered", description: "Reg. 512384 — legally certified to work on gas appliances" }`
  2. `{ name: "CIPHE Member", description: "Chartered Institute of Plumbing and Heating Engineering" }`
  3. `{ name: "WaterSafe Approved", description: "Approved contractors scheme for water regulations" }`
  4. `{ name: "Fully Insured", description: "£5M public liability, £2M professional indemnity" }`
- `insurance`: `{ amount: "£5M", type: "Public Liability" }`

**serviceAreas** (flat array): `["Lewes", "Brighton", "Hove", "Seaford", "Newhaven", "Peacehaven", "Uckfield", "Haywards Heath"]`

**serviceAreaRegions** (grouped for the dropdown):

```
[
  {
    name: "East Sussex Coast",
    slug: "east-sussex-coast",
    towns: [
      { name: "Brighton", slug: "brighton" },
      { name: "Hove", slug: "hove" },
      { name: "Seaford", slug: "seaford" },
      { name: "Newhaven", slug: "newhaven" },
      { name: "Peacehaven", slug: "peacehaven" },
    ],
  },
  {
    name: "Mid Sussex & South Downs",
    slug: "mid-sussex",
    towns: [
      { name: "Lewes", slug: "lewes" },
      { name: "Uckfield", slug: "uckfield" },
      { name: "Haywards Heath", slug: "haywards-heath" },
    ],
  },
]
```

**services** (the featured services array — 10 entries, titles and slugs as listed in Pinned Facts). Descriptions should each be 80-160 characters of realistic plumbing copy.

**features**:

- `analytics: false`
- `consentBanner: false`
- `contactForm: true`
- `rateLimit: true`
- `testimonials: true`
- `blog: true` (this site publishes blog posts, unlike the base template)

**schema.businessConfig** — mirror the business info above. Full `BusinessConfig` object:

- `name`: "Castor & Sons Plumbing"
- `legalName`: "Castor & Sons Plumbing Ltd"
- `description`: ~150 chars describing the business
- `slogan`: `"Your trusted East Sussex plumbers — three generations of experience"`
- `foundingDate`: `"1987"`
- `numberOfEmployees`: `"8"`
- `priceRange`: `"££"`
- `email`, `telephone`, `address`, `geo`: mirror the business block above (watch string formatting for geo — these fields are strings here, not numbers)
- `openingHours`: Monday–Friday 08:00–17:30, Saturday 09:00–13:00, Sunday omitted or marked 24/7 — match whatever Schema.org accepts
- `areaServed`: the 8 towns from Pinned Facts
- `credentials`: Gas Safe, CIPHE, WaterSafe, Fully Insured (mirror certifications above, category `"certification"`)
- `socialProfiles`: facebook + instagram URLs from above
- `knowsAbout`: `["Boiler Installation", "Gas Safety", "Central Heating", "Bathroom Installation", "Emergency Plumbing", "Power Flushing", "Leak Detection", "Victorian Period Plumbing", "Listed Building Compliance", "East Sussex Hard Water Areas"]`
- `offerCatalog`: one entry per service from the 10-service list, each with `name`, `description` (~120 chars), and `url: "/services/[slug]"`

**schema.businessType**: `"LocalBusiness"` (same as business.type)

**about** block — replace in full:

- `heroBadges`: `["Est. 1987", "Family Business", "Gas Safe 512384", "CIPHE Member"]`
- `story` (3 paragraphs):
  1. Founding story — John Castor founded the company in Lewes in 1987 after 15 years as an apprentice plumber; started out of the family garage
  2. Transition — son Marcus took over as Managing Director in 2009 after completing his own City & Guilds apprenticeship; grew the team to 8 engineers by 2018
  3. Today — family values intact, every job completed by an employed engineer (no subcontractors), Gas Safe and CIPHE credentials carried by every member of the heating team
- `whyChooseUs` (8 bullets): Gas Safe registered engineers (reg 512384); CIPHE-accredited; no subcontractors — direct employees only; 24/7 emergency callout; free written quotes; transparent fixed pricing for standard jobs; 12-month workmanship guarantee; fully insured £5M public liability
- `values` (4 cards):
  1. **Craftsmanship over shortcuts** — ~100 chars
  2. **Honest pricing** — ~100 chars (mention no-call-out-fee policy)
  3. **Generational accountability** — ~100 chars (family name on the van = owner cares)
  4. **Gas Safe always** — ~100 chars (refuse to cut corners on safety regs)

### Verification gate — STOP if this fails

```bash
# Verification gate — STOP if this fails
pnpm --filter _castor-plumbing type-check
```

If TypeScript errors appear, they will be in `site.config.ts` itself — fix the types (likely places: missing optional fields, string-vs-number mismatches in `schema.businessConfig.geo`, invalid `business.type` value). Do not proceed until type-check is clean.

### Commit

```bash
git add sites/_castor-plumbing/site.config.ts
git commit -m "$(cat <<'EOF'
feat(_castor-plumbing): replace placeholder site.config with Castor & Sons Plumbing

Pins fictional business facts: Lewes, East Sussex family firm est. 1987,
Gas Safe reg 512384, 10 services, 8 service areas, 4 company values.
Enables blog feature flag, adds Projects to main navigation.

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>
EOF
)"
```

---

## Phase 3 — Write 10 service MDX files (parallel)

**Goal:** Create one MDX file per service in `sites/_castor-plumbing/content/services/`, each passing `ServiceFrontmatterSchema` (see `packages/core-components/src/lib/content-schemas.ts`).

**Model:** sonnet — realistic service copy, consistent business facts, unique details per service

### Shape requirements per file (from ServiceFrontmatterSchema)

Each service file must include:

- `title` (5–100 chars)
- `seoTitle` (10–60 chars) — pattern: `"[Service] in Lewes & East Sussex | Castor & Sons"`
- `description` (50–200 chars) — include location + business name for local SEO
- `keywords` (3–10 entries)
- `hero.image` — placeholder path, e.g. `"placeholder/hero-boiler-installation.webp"`
- `hero.heading`, `hero.subheading`, `hero.cta` (label `"Get a Free Quote"`, href `/contact`)
- `breadcrumbs` — Home → Services → [Service]
- `faqs` — **minimum 5**, maximum 10 per service. Each FAQ: question ≥10 chars, answer ≥20 chars. Must reference Castor & Sons, Lewes / East Sussex, Gas Safe reg where appropriate.
- `about.whatIs` (≥50 chars)
- `about.whenNeeded` (≥4 items, each ≥10 chars)
- `about.whatAchieve` (≥4 items, each ≥10 chars)
- `about.keyPoints` (≥3 items, each ≥10 chars — mention Gas Safe reg, 1987 heritage, East Sussex knowledge, CIPHE membership, etc.)
- `category` — `"installation"`, `"maintenance"`, or `"repair"` per the service list in Pinned Facts
- `localContact` — phone `01273 488 900`, email `office@castorandsons.co.uk`, address `Lewes, East Sussex`

### MDX body

Below the frontmatter, include a short (~100-200 word) intro paragraph using the site's shared MDX components. Reference `sites/mad-graphics/content/services/vehicle-graphics.mdx` for the exact shape (ServiceIntro, SidebarItem, ProcessStep, CoverageSection blocks). Do NOT invent new components — only use ones that already work in mad-graphics.

### Parallelism: spawn 10 agents in parallel (one per service)

Launch all 10 Task agents in **a single message**. Each agent writes one file and gets its title, slug, category, and a "uniqueness brief" so the files are not boilerplate.

Agent spec template:

```
Task: Write content/services/[slug].mdx for Castor & Sons Plumbing
model: sonnet
Prompt: Write the file sites/_castor-plumbing/content/services/[slug].mdx for a fictional Lewes, East Sussex plumbing firm called "Castor & Sons Plumbing" (est. 1987, owner Marcus Castor, Gas Safe reg 512384, CIPHE member, 8 engineers, phone 01273 488 900, email office@castorandsons.co.uk).

Service: [title]
Slug: [slug]
Category: [installation|maintenance|repair]
Uniqueness hook: [one-line distinguishing brief — see table below]

Frontmatter must satisfy ServiceFrontmatterSchema in packages/core-components/src/lib/content-schemas.ts. Include: title, seoTitle, description (50-200 chars), 5-10 keywords, hero (heading/subheading/image placeholder/cta), breadcrumbs, 5-8 FAQs (each question ≥10 chars, answer ≥20 chars), about (whatIs ≥50 chars, whenNeeded ≥4 items, whatAchieve ≥4 items, keyPoints ≥3 items), category, localContact.

Body (below frontmatter): Use the exact MDX component shape from sites/mad-graphics/content/services/vehicle-graphics.mdx — ServiceIntro + SidebarItem + ProcessStep blocks, optionally CoverageSection. Do not invent new components.

Reference Lewes/East Sussex specifics where relevant: chalk-soil limescale issues, Victorian/Georgian period properties in Lewes, coastal hard water in Brighton/Hove, the South Downs National Park service catchment. Reference Gas Safe reg 512384, CIPHE membership, and the 1987 founding date in the about and FAQs. Do NOT mention any other plumbing firm or city.

Read sites/mad-graphics/content/services/vehicle-graphics.mdx once as a shape reference before writing, then write the new file using Write tool. Do not read any other files.
```

### Service list with uniqueness hooks

| Slug                           | Title                            | Category     | Uniqueness hook                                                                                                                  |
| ------------------------------ | -------------------------------- | ------------ | -------------------------------------------------------------------------------------------------------------------------------- |
| `boiler-installation`          | Boiler Installation              | installation | Lead with 7-year manufacturer warranty + Gas Safe compliance; reference Worcester Bosch and Vaillant as premium brands installed |
| `boiler-repair-servicing`      | Boiler Repair & Servicing        | maintenance  | Annual service plans, landlord compliance mode, fixed callout fee                                                                |
| `emergency-plumber`            | Emergency Plumber (24/7)         | repair       | 24/7 callout line, 2-hour response target within 10 miles of Lewes, no weekend surcharge                                         |
| `bathroom-installation`        | Bathroom Installation            | installation | Full supply-and-fit projects, period-property specialists, 4-6 week typical timeline                                             |
| `central-heating-installation` | Central Heating Installation     | installation | New-build and upgrade projects, smart thermostat integration, zone heating for larger homes                                      |
| `power-flushing`               | Power Flushing                   | maintenance  | MagnaClean filter fitting, explicit benefit vs chemical flush, recommended every 5-7 years                                       |
| `leak-detection-repair`        | Leak Detection & Repair          | repair       | Thermal imaging + acoustic detection, minimal-disruption approach, insurance-ready reporting                                     |
| `blocked-drains`               | Blocked Drains                   | repair       | CCTV drain survey, high-pressure jetting, root intrusion handling (common in older Lewes gardens)                                |
| `radiator-installation-repair` | Radiator Installation & Repair   | installation | Vertical designer rads, towel rails for bathroom installs, cold-at-top troubleshooting                                           |
| `landlord-gas-safety`          | Landlord Gas Safety Certificates | maintenance  | CP12 certificate, same-day issue, appointment flexibility, bulk pricing for portfolios                                           |

### Verification gate — STOP if this fails

```bash
# Verification gate — STOP if this fails
ls sites/_castor-plumbing/content/services/*.mdx | wc -l   # must print 10
cd sites/_castor-plumbing && npm run validate:content -- services 2>&1
cd ../..
```

The `wc -l` check must show exactly 10. The validate:content call must report "all files valid" (or whatever the pass message is — the command exists, see `scripts/validate-content.ts`). If any file fails Zod validation, fix that file and re-run before continuing.

### Commit

```bash
git add sites/_castor-plumbing/content/services/
git commit -m "$(cat <<'EOF'
feat(_castor-plumbing): add 10 real service MDX files

Covers boiler install/repair, emergency callouts, bathrooms, central
heating, power flushing, leak detection, drains, radiators, and
landlord gas safety — all written as Castor & Sons Plumbing content
with Lewes/East Sussex specifics and Gas Safe reg 512384.

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>
EOF
)"
```

---

## Phase 4 — Write 8 location MDX files (parallel)

**Goal:** One MDX file per covered town in `sites/_castor-plumbing/content/locations/`, each passing `LocationFrontmatterSchema`.

**Model:** sonnet — local colour per town, consistent business facts

### Shape requirements per file

From `LocationFrontmatterSchema`:

- `title` (2–50 chars) — town name
- `seoTitle` (10–80 chars) — pattern: `"[Town] Plumbers | Gas Safe Heating | Castor & Sons"`
- `description` (50–200 chars)
- `keywords` (≥3)
- `county`: `"East Sussex"`
- `countySlug`: `"east-sussex"`
- `coords`: [latitude, longitude] from the Pinned Facts table
- `mapDescription` (<100 chars)
- `heroImage`: `"placeholder/locations/hero-[slug].webp"`
- `hero`: title, description (≥20 chars), `highlightItems` (≥1 — use 4: "Gas Safe 512384", "24/7 emergency", "Est. 1987", "CIPHE member"), `primaryActionLabel` = `"Get a Free Quote"`, `primaryActionHref` = `/contact`, optional `phone: "01273 488 900"` and `ctaText`/`ctaUrl`
- `specialists` (at least 1 card, 3 recommended): local-specific detail per town. Reference real streets/districts where sensible (e.g. Lewes: Cliffe, High Street, Southover; Brighton: North Laine, Hanover, Preston Park; Hove: Church Road, Brunswick). Don't invent fictional landmarks — stick to known areas.
- `services` (≥3 cards): pick 5-6 services from the 10-service list most relevant to that town's housing stock (e.g. Lewes period properties → boiler install, bathroom install, leak detection, radiator install). Each card gets title, description, `link: "/services/[slug]"`.
- `faqs` (≥5, ≤20): town-specific questions — "Do you service gas meters in [Town]?", "What's your callout fee for [Town]?", "Can you handle period properties on [street name]?"

### Parallelism: spawn 8 agents in parallel

Launch all 8 Task agents in **a single message**. Each writes one location file.

Agent spec template:

```
Task: Write content/locations/[slug].mdx for Castor & Sons Plumbing
model: sonnet
Prompt: Write the file sites/_castor-plumbing/content/locations/[slug].mdx for fictional Lewes, East Sussex plumbing firm "Castor & Sons Plumbing" (est. 1987, Gas Safe reg 512384, phone 01273 488 900, email office@castorandsons.co.uk).

Location: [town name]
Slug: [slug]
Coords: [lat, lng]
Local colour: [one-liner from table below]

Frontmatter must satisfy LocationFrontmatterSchema in packages/core-components/src/lib/content-schemas.ts. Include: title, seoTitle (10-80 chars), description (50-200 chars), 3-8 keywords, county "East Sussex", countySlug "east-sussex", coords, mapDescription (<100 chars), heroImage (placeholder path), hero block with highlightItems, specialists block with 3 cards, services block with at least 5 service cards linking to /services/[slug], and 6-8 town-specific faqs.

Reference sites/mad-graphics/content/locations/eastbourne.mdx for the exact frontmatter shape (do not add pricing block — that's optional and we're skipping it). Do not invent landmark names; use only genuinely-known streets/districts for the town.

Reference the 10 available services by slug: boiler-installation, boiler-repair-servicing, emergency-plumber, bathroom-installation, central-heating-installation, power-flushing, leak-detection-repair, blocked-drains, radiator-installation-repair, landlord-gas-safety.

Below the frontmatter, include a short intro paragraph. Do not add any MDX components — frontmatter-only content is enough for locations.

Use the Write tool to create the file.
```

### Location list with local colour hooks

| Slug             | Town           | Local colour                                                                                                                         |
| ---------------- | -------------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| `lewes`          | Lewes          | Home base — Cliffe, High Street, Southover, Wallands Park, Neville. Medieval + Georgian housing stock, chalk soil, listed buildings. |
| `brighton`       | Brighton       | North Laine, Kemptown, Hanover, Preston Park, Fiveways. Mix of Regency, Victorian, and 1930s stock.                                  |
| `hove`           | Hove           | Church Road, Brunswick, Poets Corner, Hove Park. Large Victorian houses with original plumbing.                                      |
| `seaford`        | Seaford        | Bay Vue, The Esplanade, Alfriston Road. Coastal corrosion concerns, 1960s-80s bungalows common.                                      |
| `newhaven`       | Newhaven       | Harbour area, Denton, South Heighton. Working-class terraces and newer riverside flats.                                              |
| `peacehaven`     | Peacehaven     | Big Park, Roderick Avenue. 1930s-1950s estate stock, cliff-top exposure.                                                             |
| `uckfield`       | Uckfield       | High Street, Ridgewood, Framfield. Mix of period cottages and 90s-2000s estates.                                                     |
| `haywards-heath` | Haywards Heath | Lindfield, Bolnore Village, Franklands Village. New-build estates and period Lindfield cottages.                                     |

### Verification gate — STOP if this fails

```bash
# Verification gate — STOP if this fails
ls sites/_castor-plumbing/content/locations/*.mdx | wc -l   # must print 8
cd sites/_castor-plumbing && npm run validate:content -- locations 2>&1
cd ../..
```

### Commit

```bash
git add sites/_castor-plumbing/content/locations/
git commit -m "$(cat <<'EOF'
feat(_castor-plumbing): add 8 location MDX files for East Sussex coverage

Lewes, Brighton, Hove, Seaford, Newhaven, Peacehaven, Uckfield, Haywards
Heath — each with genuine local street references, town-specific FAQs,
and the full 10-service grid linked.

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>
EOF
)"
```

---

## Phase 5 — Write 5 blog posts, 4 projects, 6 testimonials (parallel)

**Goal:** Populate `content/blog/`, `content/projects/`, `content/testimonials/` in one parallel burst.

**Model:** sonnet

### Blog posts (5 files)

Schema: `BlogFrontmatterSchema`. Each must include title (10-100 chars), date (YYYY-MM-DD, use dates between 2025-06 and 2026-03), author (`{ name: "Marcus Castor", role: "Managing Director" }`), description (50-200 chars), category (must be one of: `industry-tips`, `how-to-guide`, `case-study`, `seasonal`, `news`), tags (1-10), excerpt (50-300 chars), heroImage placeholder path, readingTime (optional int 4-10), and a body of ~600-1200 words of genuinely useful plumbing advice — not fluff.

| Filename                              | Title                                                             | Category      | Date       | Body focus                                                                                           |
| ------------------------------------- | ----------------------------------------------------------------- | ------------- | ---------- | ---------------------------------------------------------------------------------------------------- |
| `how-to-spot-a-hidden-water-leak.mdx` | How to Spot a Hidden Water Leak Before It Ruins Your Floor        | how-to-guide  | 2025-08-14 | Meter check method, listen test, visual signs (walls, skirtings, ceilings), when to call a pro       |
| `when-to-replace-your-boiler.mdx`     | When Should You Replace Your Boiler? Five Warning Signs           | industry-tips | 2025-10-22 | Age, efficiency ratings, yellow flame, constant repairs, rising bills; mention A-rated boiler grants |
| `prepare-heating-for-winter.mdx`      | Preparing Your Heating System for Winter: A Homeowner's Checklist | seasonal      | 2025-11-05 | Service timing, lagging pipes, bleeding radiators, setting the thermostat, what freezing pipes cost  |
| `cold-radiators-at-top.mdx`           | Why Your Radiators Are Cold at the Top (And What to Do About It)  | how-to-guide  | 2026-01-12 | Air in the system vs sludge at the bottom, how to bleed, when it's not bleeding that's needed        |
| `delayed-leak-repair-case-study.mdx`  | The Real Cost of Delaying a Leak Repair: A Brighton Case Study    | case-study    | 2026-02-28 | Fictional Brighton customer who ignored a slow drip for 6 months, ended up with £11k insurance claim |

### Projects (4 files)

Schema: `ProjectFrontmatterSchema`. Required: title (10-100), description (50-200), projectType (one of: `residential`, `commercial`, `industrial`, `heritage`), category (one of: `heritage`, `new-build`, `renovation`, `maintenance`, `emergency`, `vehicle-graphics`, `signs-signage`, `banners`, `large-format-print`, `marketing-print`, `stickers-labels`, `workwear-merchandise`, `graphic-design`), location (slug), locationName, completionDate (YYYY-MM-DD), year (int), services (array of service slugs), heroImage (placeholder path), and optional but recommended: duration, client (type + testimonial + rating), scope (buildingType + squareMetres + challenges), images (array), results (array), faqs.

**IMPORTANT:** The plumbing industry isn't in the `ProjectCategory` enum yet. Use these valid values as a close fit:

| File                                        | Title                                                 | projectType | category      | Location                |
| ------------------------------------------- | ----------------------------------------------------- | ----------- | ------------- | ----------------------- |
| `victorian-bathroom-renovation-lewes.mdx`   | Victorian Bathroom Restoration in Cliffe, Lewes       | residential | `renovation`  | `lewes` / "Lewes"       |
| `emergency-boiler-replacement-brighton.mdx` | Emergency Boiler Replacement in Hanover, Brighton     | residential | `emergency`   | `brighton` / "Brighton" |
| `new-build-heating-hove.mdx`                | New Build Central Heating Install, Hove Park          | residential | `new-build`   | `hove` / "Hove"         |
| `seaford-hotel-boiler-contract.mdx`         | Seaford Hotel: Commercial Boiler Maintenance Contract | commercial  | `maintenance` | `seaford` / "Seaford"   |

Each project body should be ~300-500 words covering the brief, the approach, challenges, and outcome.

### Testimonials (6 files)

Schema: `TestimonialFrontmatterSchema`. Required: customerName, rating (1-5), text (20-1000 chars), date (YYYY-MM-DD). Optional but recommended: customerRole, customerCompany, excerpt, service, serviceSlug, location, locationSlug, projectType, featured (bool), verified (true default), platform (default "internal" — use "google" for 2-3 of them to vary).

| Filename                          | Customer             | Rating | Linked service               | Linked location | Featured?    |
| --------------------------------- | -------------------- | ------ | ---------------------------- | --------------- | ------------ |
| `testimonial-sarah-brighton.mdx`  | Sarah Mitchell       | 5      | boiler-installation          | brighton        | featured     |
| `testimonial-david-lewes.mdx`     | David Holloway       | 5      | bathroom-installation        | lewes           | featured     |
| `testimonial-emma-hove.mdx`       | Emma Patel           | 5      | emergency-plumber            | hove            | not featured |
| `testimonial-james-seaford.mdx`   | James & Helen Clarke | 4      | central-heating-installation | seaford         | not featured |
| `testimonial-rachel-newhaven.mdx` | Rachel Turner        | 5      | leak-detection-repair        | newhaven        | featured     |
| `testimonial-graham-uckfield.mdx` | Graham Wells         | 5      | landlord-gas-safety          | uckfield        | not featured |

Each testimonial body: one paragraph (~40-60 words) expanding the review — use realistic language, not marketing speak.

### Parallelism: spawn 15 agents in parallel (5 blog + 4 projects + 6 testimonials)

Launch all 15 in **one Task-tool message**. They write to different files and share no dependencies.

### Verification gate — STOP if this fails

```bash
# Verification gate — STOP if this fails
ls sites/_castor-plumbing/content/blog/*.mdx | wc -l          # must print 5
ls sites/_castor-plumbing/content/projects/*.mdx | wc -l      # must print 4
ls sites/_castor-plumbing/content/testimonials/*.mdx | wc -l  # must print 6
cd sites/_castor-plumbing && npm run validate:content 2>&1
cd ../..
```

The final `validate:content` call runs against ALL content types — this is the full validation gate.

### Commit

```bash
git add sites/_castor-plumbing/content/blog/ sites/_castor-plumbing/content/projects/ sites/_castor-plumbing/content/testimonials/
git commit -m "$(cat <<'EOF'
feat(_castor-plumbing): add 5 blog posts, 4 projects, 6 testimonials

Real Castor & Sons Plumbing content: how-to guides, seasonal tips,
Brighton leak case study, Victorian bathroom and Hove new-build projects,
Seaford hotel maintenance contract, and six customer testimonials
linked to real service + location slugs.

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>
EOF
)"
```

---

## Phase 6 — Smoke build and visual sanity check

**Goal:** Prove the site builds end-to-end and renders the real content on the castor theme. This is the final quality gate before handing back to the user.

**Model:** sonnet — needs to interpret build errors and decide whether to fix or report

### Steps

1. `pnpm --filter _castor-plumbing type-check` — must be clean.
2. `pnpm --filter _castor-plumbing build` — must complete without errors. Fix any content validation issues that surface here (they should have been caught in earlier phases, but Zod errors from nested fields sometimes only appear at build time).
3. `pnpm type-check` (monorepo-wide) — must be clean. This catches any cross-package issues introduced by the new config.

**Do NOT run the pipeline smoke check** (`pnpm pipeline:smoke`) — that targets the theme-ingestion pipeline, not site content, and is irrelevant here.

**Do NOT run `pnpm --filter _castor-plumbing dev`** — dev server is interactive and blocks the terminal. Build-only is sufficient.

### Verification gate — STOP if this fails

```bash
# Verification gate — STOP if this fails
pnpm --filter _castor-plumbing type-check
pnpm --filter _castor-plumbing build
pnpm type-check
```

All three commands must exit zero. If `pnpm --filter _castor-plumbing build` fails with a content validation error, fix the offending MDX file (report which one and what the error was) and re-run. If it fails with an import or TypeScript error in `site.config.ts`, fix the config (do NOT fix by weakening the types). If it fails with an upstream error in the castor theme package or core-components, STOP and report — that's out of scope for this brief.

### Commit

No code commit in this phase unless a fix was needed. If a fix was applied, commit it as:

```bash
git add -A
git commit -m "$(cat <<'EOF'
fix(_castor-plumbing): resolve content validation and build errors

[one-line description of what broke]

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>
EOF
)"
```

---

## Parallel execution groups

This section lists work units that can run concurrently. Each group lists items that MUST be launched in a single Task-tool message. Items across groups run sequentially in the order listed. Groups are named `G1`, `G2`, … for reference.

### Intra-phase groups

| Group | Phase   | Items                                                                                                                                                                                                                                                                                        | File overlap | Model  | Rationale                                                                                            |
| ----- | ------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------ | ------ | ---------------------------------------------------------------------------------------------------- |
| G1    | Phase 1 | 14 `rm` commands for the placeholder MDX files                                                                                                                                                                                                                                               | none         | haiku  | Pure deletions, no file overlap — batch all 14 deletes in a single Bash call using `rm -f a b c …`   |
| G2    | Phase 2 | — no parallel work in this phase —                                                                                                                                                                                                                                                           | single file  | sonnet | `site.config.ts` is one file, serial rewrite                                                         |
| G3    | Phase 3 | 10 parallel Task agents, one per service: `boiler-installation`, `boiler-repair-servicing`, `emergency-plumber`, `bathroom-installation`, `central-heating-installation`, `power-flushing`, `leak-detection-repair`, `blocked-drains`, `radiator-installation-repair`, `landlord-gas-safety` | none         | sonnet | Each agent writes a distinct file in `content/services/` — zero overlap                              |
| G4    | Phase 4 | 8 parallel Task agents, one per location: `lewes`, `brighton`, `hove`, `seaford`, `newhaven`, `peacehaven`, `uckfield`, `haywards-heath`                                                                                                                                                     | none         | sonnet | Each agent writes a distinct file in `content/locations/` — zero overlap                             |
| G5    | Phase 5 | 15 parallel Task agents: 5 blog posts + 4 projects + 6 testimonials (all filenames listed in Phase 5 tables)                                                                                                                                                                                 | none         | sonnet | All 15 write distinct files in three sibling directories — zero overlap                              |
| G6    | Phase 6 | — no parallel work in this phase —                                                                                                                                                                                                                                                           | build output | sonnet | `type-check` → `build` → `type-check` must run serially; `pnpm build` writes to `.next/` exclusively |

### Cross-phase groups

| Group  | Phases | Items | Rationale                                                                                                                                                     |
| ------ | ------ | ----- | ------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| (none) |        |       | Every phase gates the next via a verification check (deletes before writes, config before content, content before build). No cross-phase parallelism is safe. |

### Sequential points — MUST NOT parallelise

| Item                                                                                    | Reason                                                                     |
| --------------------------------------------------------------------------------------- | -------------------------------------------------------------------------- |
| Verification gates (`pnpm type-check`, `pnpm build`, `validate:content`) between phases | Each phase's output gates the next. Gates are the synchronisation barrier. |
| Git commits                                                                             | One commit per phase, in order. Commits are never batched.                 |
| The `site.config.ts` rewrite (Phase 2)                                                  | Single file — no parallel strategy applies.                                |
| The Phase 6 build sequence                                                              | `type-check` → `build` → `monorepo type-check` must be strictly serial.    |

---

## Cost Estimate

| Phase                                                  | Model  | Est. input tokens | Est. output tokens | Est. cost  |
| ------------------------------------------------------ | ------ | ----------------- | ------------------ | ---------- |
| Phase 1: Delete placeholders                           | haiku  | ~3k               | ~0.5k              | $0.01      |
| Phase 2: Rewrite site.config.ts                        | sonnet | ~8k               | ~6k                | $0.11      |
| Phase 3: 10 service MDX files (10 parallel agents)     | sonnet | ~50k              | ~30k               | $0.60      |
| Phase 4: 8 location MDX files (8 parallel agents)      | sonnet | ~48k              | ~28k               | $0.56      |
| Phase 5: 5 blog + 4 projects + 6 testimonials (15 par) | sonnet | ~45k              | ~25k               | $0.51      |
| Phase 6: Smoke build + monorepo type-check             | sonnet | ~6k               | ~1k                | $0.03      |
| **Total**                                              |        | **~160k**         | **~90k**           | **~$1.82** |

Rates: Opus $15/$75, Sonnet $3/$15, Haiku $0.80/$4 per MTok.
Estimation: ~5 tokens per line of code/MDX; each parallel agent loads ~3k of brief context + reads 1-2 reference files (~2k) before writing a 200-400 line MDX file. Orchestrator overhead factored into Phases 2 and 6.

---

## Final Report

After all phases complete, output:

1. Phases completed — list each with commit SHA
2. Build status — confirm `pnpm --filter _castor-plumbing build` and monorepo `pnpm type-check` passed
3. Any exceptions or intentional deviations from the plan — e.g. services that got only 5 FAQs instead of 8 because the topic didn't need more, or pricing sections omitted because the schema allows
4. Token usage and cost estimate:

   | Model     | Est. input tokens     | Est. output tokens | Est. cost |
   | --------- | --------------------- | ------------------ | --------- |
   | sonnet    | [total across phases] |                    | $X.XX     |
   | haiku     | [if used]             |                    | $X.XX     |
   | opus      | [if used]             |                    | $X.XX     |
   | **Total** |                       |                    | **$X.XX** |

   Compare to the pre-flight Cost Estimate above. Note any large delta.
   For exact figures: check console.anthropic.com.

---

## Update Session File

After completing all phases, append to `output/sessions/2026-04-11_castor-plumbing-build/yolo-brief.md`:

```markdown
## Completed

**Date:** 2026-04-11
**Status:** All phases executed successfully

[1-paragraph summary: what was implemented, any surprises. E.g. "Replaced placeholder content across _castor-plumbing with 10 services, 8 locations, 5 blog posts, 4 projects, 6 testimonials for fictional Castor & Sons Plumbing of Lewes. Build + type-check clean. Surprise: the `ProjectCategory` enum doesn't include plumbing categories — fell back to renovation/emergency/new-build/maintenance as closest fits."]

### Commits

- [sha] — chore(\_castor-plumbing): delete base-template placeholder MDX
- [sha] — feat(\_castor-plumbing): replace placeholder site.config with Castor & Sons Plumbing
- [sha] — feat(\_castor-plumbing): add 10 real service MDX files
- [sha] — feat(\_castor-plumbing): add 8 location MDX files for East Sussex coverage
- [sha] — feat(\_castor-plumbing): add 5 blog posts, 4 projects, 6 testimonials
- [sha] — (optional) fix(\_castor-plumbing): resolve content validation and build errors
```

Confirm this was done in the final report.

---

## Run Wrap-Up

After completing all phases and updating the session file, run:

```
/wrap-up-session
```

This writes `session-wrap-up.md` to `output/sessions/2026-04-11_castor-plumbing-build/`. **This is a required final step — do not skip it.**

---

## Rules

- STOP on any failed verification gate — do not continue to next phase
- Read every file before editing it
- Never push — leave all changes on the feature branch
- **Consult the `## Parallel execution groups` section before launching any work.** Every item listed in a group MUST be launched in a single Task-tool message. Do not launch group items sequentially — that defeats the purpose of the block and doubles the wall-clock time.
- **Items NOT listed in any group run sequentially.** If the groups table has no row for a given work item, assume it is sequential.
- **Never parallelise across phase boundaries.** Verification gates are the synchronisation barrier between phases — respect them.
- **If the groups table and the phase prose disagree, the groups table wins.** The groups block is the authoritative execution plan.
- Minimal changes only — implement what the plan says, nothing more. Do NOT add theme.config.ts overrides, public/ images, e2e tests, or anything outside `sites/_castor-plumbing/content/` and `sites/_castor-plumbing/site.config.ts` unless a verification gate forces it.
- **Do NOT rename the `_castor-plumbing` folder.** The `_` prefix is intentional — the user explicitly chose to keep it. Renaming is a separate decision for a later session.
- Use `model: haiku` for Task agents doing mechanical work (file deletes only, in Phase 1); `model: sonnet` for all content generation
- The Co-Authored-By line in commits must reflect the orchestrator model used (e.g., `Claude Sonnet 4.6`)
- **Pinned business facts are immutable.** Do not invent alternative names, addresses, phone numbers, or service areas mid-session. If a field isn't specified above, it's allowed to be reasonable — but must stay consistent within the session.
- **Fictional does not mean sloppy.** Lewes street names must be real (Cliffe, High Street, Southover, etc.). Brighton/Hove districts must be real. Invent customer names and project details freely, but never invent town landmarks or streets that don't exist.
- **This brief does NOT need `--additionalDirectories`** — every write target is inside the primary repo (`sites/_castor-plumbing/` and `output/sessions/2026-04-11_castor-plumbing-build/`).
