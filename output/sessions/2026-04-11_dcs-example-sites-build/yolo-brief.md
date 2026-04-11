# YOLO Implementation Brief: DCS Example Sites — Full Content Build (4 sites)

**Branch:** feature/dcs-example-sites-build (created from develop)
**Session spec:** output/sessions/2026-04-11_dcs-example-sites-build/yolo-brief.md
**Mode:** Autonomous execution — implement all phases, verify after each, STOP on error
**Orchestrator model:** sonnet

---

## Context

Four underscore-prefixed sites (`_castor-plumbing`, `_cygnus-graphics`, `_lyra-garden`, `_nova-print`) were scaffolded on 2026-04-11 from `base-template` and correctly wired to their named theme packages (castor, cygnus, lyra, nova). The wiring works. What's wrong is **content**: every site still contains base-template placeholder copy ("Primary Service", "123 Main Street", "info@example.com", "Main Area / North Region / South Region"). They render as "base-template with a colour swap" instead of looking like each theme's intended business type.

This brief populates all 4 sites with fully-realised content presented as **DCS sub-brand example sites** — DCS Plumbing, DCS Graphics, DCS Garden, DCS Print. Each is positioned as a Digital Consulting Services example site for the Local Business Platform, linked from a forthcoming DCS examples page. All four share the same real Polegate address and DCS mobile number because they are all operated by DCS; a clear demo disclaimer on every footer and About page prevents any ambiguity.

Rigel Events (`_rigel-events`) is **deferred to a separate follow-up session** because upstream TypeScript errors in `packages/themes/rigel/components/` block the site from building. Fixing that upstream debt is a different problem from content population and will be handled in its own session.

**Schema evolution in this brief:** The `ProjectCategory` Zod enum in `packages/core-components/src/lib/content-schemas.ts` currently has no plumbing or garden categories, and one of the per-site `business.type` unions (`_castor-plumbing`) lacks a schema.org-valid trade type. Both are our own code, not external constraints. Phase 2a extends both the enum and the union BEFORE any content is written, so Phase 5 can use real category values (`plumbing-install`, `garden-design`, etc.) and Phase 2 can set `business.type: "Plumber"` on DCS Plumbing. Eight `categoryLabels` maps across the 4 sites' project pages are also updated to render the new values with human labels. This is a small, contained schema change that unblocks the content build without compromise.

The plan was discussed and approved interactively (see `~/.claude/plans/quizzical-mixing-pony.md`). Implement it exactly as specified below.

---

## Pinned Shared Business Facts

**Every file written in this session MUST reference these facts. They are shared across all 4 sites. Do not invent alternatives mid-session.**

| Field                | Value                                                                         |
| -------------------- | ----------------------------------------------------------------------------- |
| Parent company       | Digital Consulting Services                                                   |
| Address              | Unit H3, Chaucer Business Park, Dittons Road, Polegate, East Sussex, BN26 6QH |
| Phone                | 07395 063764                                                                  |
| Email                | mail@digitalconsultingservices.co.uk                                          |
| Year established     | 2019                                                                          |
| Geo                  | latitude 50.8233, longitude 0.2557 (Polegate)                                 |
| Hours                | Mon–Fri 9:00 AM – 5:30 PM, Sat by appointment, Sun closed                     |
| Region               | East Sussex                                                                   |
| Shared service areas | Polegate, Eastbourne, Hailsham, Lewes, Seaford, Brighton, Hove, Uckfield      |

**Demo disclaimer text (exact wording, use verbatim):**

> Example site by Digital Consulting Services — demonstrating the Local Business Platform. Not a live trading business.

The disclaimer must appear in:

1. Each site's `about.story` block (as the final paragraph — mark it so readers know it's a disclaimer)
2. Each service MDX file's first FAQ or intro paragraph (concise version: `"This is an example site by Digital Consulting Services — not a live trading business."`)
3. Each location MDX file's hero description (subtle — embed the phrase `"example site by Digital Consulting Services"` somewhere in the description)
4. Each blog post excerpt (append `" (Example site content.)"`)

Do NOT add the disclaimer to: testimonials (they're customer voices, keep them natural), projects (case study narrative, add a single disclaimer line at the end of the body instead), or the `site.config.ts` top-level fields.

### Shared service areas (same 8 towns per site)

Each site writes the SAME 8 location MDX files. The filenames and coords are identical across sites — only the service-lens copy differs per trade.

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

All sites treat `polegate` as the home-base location (since the Polegate unit is the real address).

### Per-site business identities

#### 1. DCS Plumbing (`sites/_castor-plumbing`, castor theme)

- **Trading name:** DCS Plumbing
- **Legal name:** Digital Consulting Services Ltd
- **Tagline:** Family-run plumbing and heating example site — East Sussex
- **Trade:** Plumbing & heating
- **Credentials (fictional for demo):** Gas Safe Registered (reg. TBC), CIPHE-equivalent member, WaterSafe, £5M public liability
- **Category keywords:** boiler, heating, plumbing, gas safe, central heating, bathrooms, leak, drains
- **Reference MDX shape:** `sites/dj-fox-electrical/content/services/primary-service.mdx` (orion/tradesperson style) OR `sites/mad-graphics/content/services/vehicle-graphics.mdx` (cygnus style). **Use mad-graphics as the shape reference for all 4 sites** — it's the most complete template with ServiceIntro, SidebarItem, ProcessStep, and CoverageSection components.

#### 2. DCS Graphics (`sites/_cygnus-graphics`, cygnus theme)

- **Trading name:** DCS Graphics
- **Legal name:** Digital Consulting Services Ltd
- **Tagline:** Creative design, signage and print example site — East Sussex
- **Trade:** Graphic design, brand identity, signage, print
- **Positioning reference:** Design Lab Eastbourne (`https://www.designlab-eastbourne.co.uk`) — a full-service design + signage + print studio. Positioning: **"Art and Science"** — creative and consultative, not a production print shop. Emphasises effective communication, brand strategy, and considered design. This deliberately differentiates DCS Graphics from `sites/mad-graphics` (same cygnus theme) which is positioned as a production vehicle-graphics + banners shop.
- **Tone:** consultative, creative, educational — "design that captivates an audience", not "cheap prints next day"
- **Credentials (fictional for demo):** Member of trade associations for design, print-ready artwork specialists, in-house designers, full colour matching
- **Category keywords:** brand identity, logo design, signage, print, packaging, creative, design studio, vehicle graphics

#### 3. DCS Garden (`sites/_lyra-garden`, lyra theme)

- **Trading name:** DCS Garden
- **Legal name:** Digital Consulting Services Ltd
- **Tagline:** Garden design and maintenance example site — East Sussex
- **Trade:** Landscaping, garden design, maintenance, tree surgery
- **Credentials (fictional for demo):** RHS-aligned practices, BALI-equivalent membership, NPTC chainsaw qualifications for tree surgery, fully insured, waste carriers licence
- **Category keywords:** garden design, landscaping, lawn care, hedges, tree surgery, fencing, planting, maintenance
- **Positioning:** established local garden firm, values-driven, sustainable planting, chalk-soil and South Downs specialist

#### 4. DCS Print (`sites/_nova-print`, nova theme)

- **Trading name:** DCS Print
- **Legal name:** Digital Consulting Services Ltd
- **Tagline:** Commercial print and large format example site — East Sussex
- **Trade:** Commercial print, flyers, brochures, business cards, large format
- **Credentials (fictional for demo):** BPIF-equivalent membership, FSC-certified paper stocks, in-house production, colour-matched proofs
- **Category keywords:** print, flyers, brochures, business cards, posters, banners, large format, commercial print
- **Positioning:** production-first print shop — fast turnaround, bulk pricing, print-ready artwork help, works direct with small businesses

### Per-site service lists (10 each = 40 service files total)

#### DCS Plumbing (`_castor-plumbing`)

| Slug                           | Title                            | Category     |
| ------------------------------ | -------------------------------- | ------------ |
| `boiler-installation`          | Boiler Installation              | installation |
| `boiler-repair-servicing`      | Boiler Repair & Servicing        | maintenance  |
| `emergency-plumber`            | Emergency Plumber (24/7)         | repair       |
| `bathroom-installation`        | Bathroom Installation            | installation |
| `central-heating-installation` | Central Heating Installation     | installation |
| `power-flushing`               | Power Flushing                   | maintenance  |
| `leak-detection-repair`        | Leak Detection & Repair          | repair       |
| `blocked-drains`               | Blocked Drains                   | repair       |
| `radiator-installation-repair` | Radiator Installation & Repair   | installation |
| `landlord-gas-safety`          | Landlord Gas Safety Certificates | maintenance  |

#### DCS Graphics (`_cygnus-graphics`)

| Slug                             | Title                            | Category            |
| -------------------------------- | -------------------------------- | ------------------- |
| `brand-identity-logo-design`     | Brand Identity & Logo Design     | _(omit — see note)_ |
| `graphic-design-for-print`       | Graphic Design for Print         | _(omit)_            |
| `vehicle-graphics-livery`        | Vehicle Graphics & Livery        | _(omit)_            |
| `shop-signs-signage`             | Shop Signs & Signage             | _(omit)_            |
| `business-stationery`            | Business Stationery              | _(omit)_            |
| `brochures-marketing-print`      | Brochures & Marketing Print      | _(omit)_            |
| `exhibition-event-graphics`      | Exhibition & Event Graphics      | _(omit)_            |
| `workwear-branded-clothing`      | Workwear & Branded Clothing      | _(omit)_            |
| `window-graphics-retail-display` | Window Graphics & Retail Display | _(omit)_            |
| `packaging-label-design`         | Packaging & Label Design         | _(omit)_            |

**Important:** `ServiceFrontmatterSchema.category` is already `.optional()` and is only consumed by `sites/dj-fox-electrical/app/services/page.tsx` (which tabs services into Installation / Maintenance / Repair groups, with a fallback for uncategorised). **Omit the `category` field entirely from every DCS Graphics service MDX file.** Design work doesn't fit installation/maintenance/repair semantics, and the underscore sites don't render these tabs anyway. Zero code change, zero rendering impact.

#### DCS Garden (`_lyra-garden`)

| Slug                          | Title                        | Category     |
| ----------------------------- | ---------------------------- | ------------ |
| `garden-design-landscaping`   | Garden Design & Landscaping  | installation |
| `lawn-care-mowing`            | Lawn Care & Mowing           | maintenance  |
| `hedge-trimming-pruning`      | Hedge Trimming & Pruning     | maintenance  |
| `tree-surgery`                | Tree Surgery                 | maintenance  |
| `patio-decking-installation`  | Patio & Decking Installation | installation |
| `fencing-gates`               | Fencing & Gates              | installation |
| `garden-clearance`            | Garden Clearance             | maintenance  |
| `planting-borders`            | Planting & Borders           | installation |
| `turf-laying`                 | Turf Laying                  | installation |
| `seasonal-garden-maintenance` | Seasonal Garden Maintenance  | maintenance  |

#### DCS Print (`_nova-print`)

| Slug                           | Title                          | Category |
| ------------------------------ | ------------------------------ | -------- |
| `business-cards`               | Business Cards                 | _(omit)_ |
| `flyers-leaflets`              | Flyers & Leaflets              | _(omit)_ |
| `brochures-catalogues`         | Brochures & Catalogues         | _(omit)_ |
| `banners-display-print`        | Banners & Display Print        | _(omit)_ |
| `large-format-print`           | Large Format Print             | _(omit)_ |
| `poster-printing`              | Poster Printing                | _(omit)_ |
| `letterheads-compliment-slips` | Letterheads & Compliment Slips | _(omit)_ |
| `folders-presentation-print`   | Folders & Presentation Print   | _(omit)_ |
| `stickers-labels`              | Stickers & Labels              | _(omit)_ |
| `book-booklet-printing`        | Book & Booklet Printing        | _(omit)_ |

**Important:** Same rule as DCS Graphics — `category` is optional and print work doesn't fit install/maintain/repair semantics. **Omit `category` from every DCS Print service MDX file.**

### Per-site blog lists (5 each = 20 blog files total)

All dates should be between `2025-06-01` and `2026-03-31`. Author for all posts: `{ name: "The DCS Team", role: "Digital Consulting Services" }`. Each post body ~600-1200 words.

**DCS Plumbing:**

1. `how-to-spot-a-hidden-water-leak.mdx` — "How to Spot a Hidden Water Leak Before It Ruins Your Floor" — how-to-guide
2. `when-to-replace-your-boiler.mdx` — "When Should You Replace Your Boiler? Five Warning Signs" — industry-tips
3. `prepare-heating-for-winter.mdx` — "Preparing Your Heating System for Winter: A Homeowner's Checklist" — seasonal
4. `cold-radiators-at-top.mdx` — "Why Your Radiators Are Cold at the Top (And What to Do About It)" — how-to-guide
5. `delayed-leak-repair-case-study.mdx` — "The Real Cost of Delaying a Leak Repair: A Brighton Case Study" — case-study

**DCS Graphics:**

1. `choosing-the-right-logo-style.mdx` — "Choosing the Right Logo Style for Your Small Business" — how-to-guide
2. `print-vs-digital-design.mdx` — "Print vs Digital: Why Great Businesses Still Use Both" — industry-tips
3. `brand-refresh-vs-full-rebrand.mdx` — "Brand Refresh vs Full Rebrand: A Cost and Benefit Case Study" — case-study
4. `typography-for-small-business.mdx` — "Typography Basics Every Small Business Owner Should Know" — how-to-guide
5. `vehicle-graphics-lifespan.mdx` — "How Long Should Vehicle Graphics Actually Last?" — industry-tips

**DCS Garden:**

1. `preparing-garden-for-spring.mdx` — "Preparing Your East Sussex Garden for Spring" — seasonal
2. `plants-for-chalk-soil.mdx` — "The Best Plants for Chalk Soil Gardens" — how-to-guide
3. `maintaining-a-lawn-in-east-sussex.mdx` — "Maintaining a Healthy Lawn in East Sussex: Year-Round Tips" — industry-tips
4. `hedge-trimming-timing.mdx` — "When to Trim Your Hedges (and Why Timing Matters)" — how-to-guide
5. `garden-transformation-case-study.mdx` — "From Overgrown to Oasis: A Hailsham Garden Transformation" — case-study

**DCS Print:**

1. `business-card-paper-weights.mdx` — "Business Card Paper Weights Explained" — how-to-guide
2. `how-to-prepare-print-ready-artwork.mdx` — "How to Prepare Print-Ready Artwork Without a Designer" — how-to-guide
3. `bulk-print-vs-on-demand.mdx` — "Bulk Print vs On-Demand: Which Is Right for Your Business?" — industry-tips
4. `brochure-binding-options.mdx` — "Saddle-Stitched, Perfect Bound, or Wire-O: A Guide to Brochure Binding" — how-to-guide
5. `rush-print-case-study.mdx` — "Rush Print Done Right: A 48-Hour Event Print Case Study" — case-study

### Per-site project lists (4 each = 16 project files total)

**ProjectCategory enum — extended in Phase 2.** The current enum in `packages/core-components/src/lib/content-schemas.ts` lacks plumbing and garden categories. Phase 2 extends the enum with 4 new values:

- `plumbing-install` — boiler installs, bathroom fit-outs, central heating installs
- `plumbing-emergency` — emergency callouts, leak repairs (note: kept separate from the existing generic `emergency` for trade clarity)
- `garden-design` — garden redesigns, landscaping, patio/decking installs
- `garden-maintenance` — grounds care contracts, seasonal maintenance

After Phase 2 extends the enum, these new values are usable in the project MDX files. `categoryLabels` maps in each affected site's `app/projects/page.tsx` and `app/projects/[slug]/page.tsx` are also updated in Phase 2 so rendered labels display correctly. See "Phase 2 — Schema extensions" below for exact code.

**DCS Plumbing projects:**

| Filename                                    | Title                                                 | projectType | category             | location slug |
| ------------------------------------------- | ----------------------------------------------------- | ----------- | -------------------- | ------------- |
| `victorian-bathroom-renovation-lewes.mdx`   | Victorian Bathroom Restoration in Cliffe, Lewes       | residential | `plumbing-install`   | `lewes`       |
| `emergency-boiler-replacement-brighton.mdx` | Emergency Boiler Replacement in Hanover, Brighton     | residential | `plumbing-emergency` | `brighton`    |
| `new-build-heating-hove.mdx`                | New Build Central Heating Install, Hove Park          | residential | `plumbing-install`   | `hove`        |
| `seaford-hotel-boiler-contract.mdx`         | Seaford Hotel: Commercial Boiler Maintenance Contract | commercial  | `maintenance`        | `seaford`     |

**DCS Graphics projects** (all categories already in the existing enum — no change needed):

| Filename                                 | Title                                               | projectType | category           | location     |
| ---------------------------------------- | --------------------------------------------------- | ----------- | ------------------ | ------------ |
| `brighton-cafe-brand-identity.mdx`       | Independent Café Brand Identity Refresh, Brighton   | commercial  | `graphic-design`   | `brighton`   |
| `eastbourne-retail-shop-signage.mdx`     | Full Shop Signage Refit for Eastbourne Retailer     | commercial  | `signs-signage`    | `eastbourne` |
| `hailsham-contractor-fleet-livery.mdx`   | Fleet Livery Refresh for Hailsham Contractor        | commercial  | `vehicle-graphics` | `hailsham`   |
| `uckfield-exhibition-stand-graphics.mdx` | Exhibition Stand Graphics for Uckfield Manufacturer | commercial  | `banners`          | `uckfield`   |

**DCS Garden projects** (uses new `garden-design` and `garden-maintenance` enum values):

| Filename                                        | Title                                               | projectType | category             | location     |
| ----------------------------------------------- | --------------------------------------------------- | ----------- | -------------------- | ------------ |
| `hailsham-complete-garden-redesign.mdx`         | Complete Garden Redesign, Hailsham Family Home      | residential | `garden-design`      | `hailsham`   |
| `lewes-listed-garden-restoration.mdx`           | Listed Building Garden Restoration, Lewes           | heritage    | `heritage`           | `lewes`      |
| `eastbourne-commercial-grounds-maintenance.mdx` | Commercial Grounds Maintenance Contract, Eastbourne | commercial  | `garden-maintenance` | `eastbourne` |
| `seaford-coastal-garden-overhaul.mdx`           | Coastal Garden Overhaul, Seaford Clifftop Property  | residential | `garden-design`      | `seaford`    |

**DCS Print projects** (all categories already in the existing enum — no change needed):

| Filename                                    | Title                                                  | projectType | category             | location     |
| ------------------------------------------- | ------------------------------------------------------ | ----------- | -------------------- | ------------ |
| `brighton-restaurant-menu-print.mdx`        | Full Menu and Marketing Print Run, Brighton Restaurant | commercial  | `marketing-print`    | `brighton`   |
| `eastbourne-charity-fundraiser-banners.mdx` | Event Banners for Eastbourne Charity Fundraiser        | commercial  | `banners`            | `eastbourne` |
| `hove-estate-agent-window-displays.mdx`     | Large Format Window Displays, Hove Estate Agent        | commercial  | `large-format-print` | `hove`       |
| `uckfield-product-label-print.mdx`          | Product Label Print Run for Uckfield Food Producer     | commercial  | `stickers-labels`    | `uckfield`   |

### Per-site testimonial lists (6 each = 24 testimonial files total)

Each site's 6 testimonials should reference services and locations from that site's lists (use valid slugs). Mix 4-star and 5-star ratings. Dates between `2025-06-01` and `2026-03-15`. Vary `platform` field between `"internal"`, `"google"`, `"reviews.io"` to look realistic. Customer names should be fictional and varied (different first-name initials). Testimonial body (below frontmatter) should be one short paragraph (~40-60 words) expanding the customer experience.

Each site gets 6 files named `testimonial-[firstname-initial-firstname]-[town].mdx`, e.g. `testimonial-sarah-brighton.mdx`, `testimonial-david-lewes.mdx`, etc.

---

## Model Tiers

| Tier   | Alias    | Cost (in/out per MTok) | Use for                                                                                             |
| ------ | -------- | ---------------------- | --------------------------------------------------------------------------------------------------- |
| Opus   | `opus`   | $15 / $75              | Phases with >5 interdependent files, architectural rewrites, judgment calls not covered by the spec |
| Sonnet | `sonnet` | $3 / $15               | Standard implementation — file edits, feature wiring, most phases                                   |
| Haiku  | `haiku`  | $0.80 / $4             | Mechanical tasks: find-replace, import additions, grep checks, content validation                   |

Default orchestrator: **sonnet**. Default sub-agent: **sonnet** unless the task is clearly mechanical (→ haiku) or requires deep cross-file reasoning (→ opus).

Content writing requires realistic copy that references East Sussex geography, trade-specific credentials, and consistent DCS business facts across 4 sites. That is a judgment task, not mechanical — **use sonnet for all content generation phases**. Use haiku only for the placeholder-deletion step.

---

## Pre-flight

```bash
git checkout develop && git pull
git checkout -b feature/dcs-example-sites-build
pnpm type-check   # must be clean before starting
ls sites/_castor-plumbing/site.config.ts sites/_cygnus-graphics/site.config.ts sites/_lyra-garden/site.config.ts sites/_nova-print/site.config.ts  # confirm all 4 scaffolds exist
```

If `pnpm type-check` fails on entry, STOP and report — do not attempt fixes unrelated to this brief.

---

## Phase 1 — Delete placeholder content across 4 sites

**Goal:** Remove all base-template placeholder MDX from `content/` folders in all 4 sites so new content is written into clean directories.

**Model:** haiku — pure file deletion, no judgment

### Files to delete (56 files total across 4 sites)

Per site, delete:

```
content/services/primary-service.mdx
content/services/secondary-service.mdx
content/services/service-three.mdx
content/services/service-four.mdx
content/services/service-five.mdx
content/locations/main-area.mdx
content/locations/north-region.mdx
content/locations/south-region.mdx
content/blog/example-how-to-guide.mdx
content/blog/example-industry-tips.mdx
content/projects/example-residential-project.mdx
content/testimonials/example-testimonial-1.mdx
content/testimonials/example-testimonial-2.mdx
content/testimonials/example-testimonial-3.mdx
```

Do this for: `_castor-plumbing`, `_cygnus-graphics`, `_lyra-garden`, `_nova-print`.

**Do NOT touch `_rigel-events/content/`** — rigel is deferred.

Use a single Bash call with `rm -f` listing all 56 paths. Target state: all five subdirectories (`services`, `locations`, `blog`, `projects`, `testimonials`) empty in all 4 sites.

### Verification gate — STOP if this fails

```bash
# Verification gate — STOP if this fails
for site in _castor-plumbing _cygnus-graphics _lyra-garden _nova-print; do
  for dir in services locations blog projects testimonials; do
    count=$(ls sites/$site/content/$dir/*.mdx 2>/dev/null | wc -l | tr -d ' ')
    echo "$site/$dir: $count"
  done
done
```

Every line must print `: 0`. If any directory still has files, STOP and report which.

### Commit

```bash
git add -A sites/_castor-plumbing/content/ sites/_cygnus-graphics/content/ sites/_lyra-garden/content/ sites/_nova-print/content/
git commit -m "$(cat <<'EOF'
chore(dcs-sites): delete base-template placeholder MDX from 4 sites

Clear all content/{services,locations,blog,projects,testimonials}
directories in _castor-plumbing, _cygnus-graphics, _lyra-garden, and
_nova-print before populating with real DCS example-site content.
_rigel-events is deferred due to upstream TypeScript errors.

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>
EOF
)"
```

---

## Phase 2a — Schema extensions and type widening (prerequisite)

**Goal:** Extend `ProjectCategory` enum and widen per-site `business.type` unions so Phase 2 and Phase 5 have all the enum values and TypeScript types they need. Also update the `categoryLabels` maps in the four underscore sites' projects pages so rendered labels are correct.

**Model:** sonnet — small multi-file edit, mixes schema change with per-site config updates, needs to keep both in sync

**Why this is Phase 2a not Phase 2b:** Phase 2 (site.config.ts rewrites) needs the widened `business.type` unions already in place before any agent writes `business.type: "Plumber"` into a site config. And Phase 5 (project MDX writes) needs the extended `ProjectCategory` enum already in place before any agent writes `category: "plumbing-install"`. So this phase runs **before** Phase 2.

### Step 2a.1 — Extend `ProjectCategory` enum

Edit `packages/core-components/src/lib/content-schemas.ts`. Locate the `ProjectCategory` `z.enum([...])` block (currently line ~354-370) and add four new values to the enum, grouped with a new comment block:

Current state (for reference — do not match literally, use the line block as a guide):

```typescript
export const ProjectCategory = z.enum([
  // Scaffolding / construction categories (existing sites)
  "heritage",
  "new-build",
  "renovation",
  "maintenance",
  "emergency",
  // Graphics / print / signage categories (Mad Graphics)
  "vehicle-graphics",
  "signs-signage",
  "banners",
  "large-format-print",
  "marketing-print",
  "stickers-labels",
  "workwear-merchandise",
  "graphic-design",
]);
```

Target state — add the four new entries at the end, preserving existing entries exactly:

```typescript
export const ProjectCategory = z.enum([
  // Scaffolding / construction categories (existing sites)
  "heritage",
  "new-build",
  "renovation",
  "maintenance",
  "emergency",
  // Graphics / print / signage categories (Mad Graphics)
  "vehicle-graphics",
  "signs-signage",
  "banners",
  "large-format-print",
  "marketing-print",
  "stickers-labels",
  "workwear-merchandise",
  "graphic-design",
  // Plumbing + garden categories (DCS example sites — added 2026-04-11)
  "plumbing-install",
  "plumbing-emergency",
  "garden-design",
  "garden-maintenance",
]);
```

Use the Edit tool with `old_string` matching from `// Graphics / print / signage categories (Mad Graphics)` through `"graphic-design",` and `new_string` replacing it to include the new block. **Read the file first** to get the exact current formatting.

### Step 2a.2 — Widen `business.type` unions in 4 site.config.ts files

Each of the 4 underscore sites has a `business.type` union declaration on its `SiteConfig` interface. Currently it's:

```typescript
type: "LocalBusiness" | "ProfessionalService" | "HomeAndConstructionBusiness";
```

For each site, replace that line with a widened union that includes the schema.org trade type for that site's trade. **This is a type declaration edit — the interface widens by adding one more string literal.**

**DCS Plumbing** (`sites/_castor-plumbing/site.config.ts`, ~line 79):

```typescript
type: "LocalBusiness" | "ProfessionalService" | "HomeAndConstructionBusiness" | "Plumber";
```

**DCS Graphics** (`sites/_cygnus-graphics/site.config.ts`, ~line 79):
The current union already includes `"ProfessionalService"` — this is sufficient for DCS Graphics, but do NOT edit unless the existing union lacks it. If present, skip this file.

**DCS Garden** (`sites/_lyra-garden/site.config.ts`, ~line 79):
The current union already includes `"HomeAndConstructionBusiness"` — this is sufficient for DCS Garden. If present, skip this file.

**DCS Print** (`sites/_nova-print/site.config.ts`, ~line 79):
The current union already includes `"LocalBusiness"` — this is sufficient for DCS Print. If present, skip this file.

So in practice: **only `_castor-plumbing/site.config.ts` needs the union widened** (to add `"Plumber"`). The other three sites' existing unions already contain the type each one will use. This is the minimum-edit path.

### Step 2a.3 — Update `categoryLabels` maps in 4 underscore sites' project pages

The new project enum values (`plumbing-install`, `plumbing-emergency`, `garden-design`, `garden-maintenance`) need display labels. Each site has two project-page files with a `categoryLabels: Record<string, string>` map. Add the 4 new keys to each of the 8 files.

**Files to edit (8 total):**

1. `sites/_castor-plumbing/app/projects/page.tsx`
2. `sites/_castor-plumbing/app/projects/[slug]/page.tsx`
3. `sites/_cygnus-graphics/app/projects/page.tsx`
4. `sites/_cygnus-graphics/app/projects/[slug]/page.tsx`
5. `sites/_lyra-garden/app/projects/page.tsx`
6. `sites/_lyra-garden/app/projects/[slug]/page.tsx`
7. `sites/_nova-print/app/projects/page.tsx`
8. `sites/_nova-print/app/projects/[slug]/page.tsx`

In each file, find the `const categoryLabels: Record<string, string> = {` block and add these 4 keys (alongside the existing keys — don't remove any):

```typescript
  'plumbing-install': 'Plumbing Installation',
  'plumbing-emergency': 'Emergency Plumbing',
  'garden-design': 'Garden Design',
  'garden-maintenance': 'Garden Maintenance',
```

Spawn 8 parallel haiku Task agents (one per file) — this is pure find-and-add work, no reasoning needed. Agent prompt template:

```
Task: Add 4 new categoryLabels to [file]
model: haiku
Prompt: Read sites/[site]/app/projects/[file].tsx. Find the `const categoryLabels: Record<string, string> = {` block and add these 4 key-value entries to it (alongside the existing keys, do not remove anything):

  'plumbing-install': 'Plumbing Installation',
  'plumbing-emergency': 'Emergency Plumbing',
  'garden-design': 'Garden Design',
  'garden-maintenance': 'Garden Maintenance',

Use the Edit tool. Preserve existing formatting and indentation exactly.
```

### Verification gate — STOP if this fails

```bash
# Verification gate — STOP if this fails
pnpm --filter @platform/core-components type-check 2>&1 || pnpm type-check
grep -n "plumbing-install\|garden-design" packages/core-components/src/lib/content-schemas.ts   # must print 4+ lines
grep -n '"Plumber"' sites/_castor-plumbing/site.config.ts   # must print 1 line
for site in _castor-plumbing _cygnus-graphics _lyra-garden _nova-print; do
  count=$(grep -c "plumbing-install" sites/$site/app/projects/page.tsx sites/$site/app/projects/[slug]/page.tsx 2>/dev/null | awk -F: '{sum+=$2} END {print sum}')
  echo "$site categoryLabels plumbing-install: $count"   # must be 2 (one per file)
done
```

All three grep checks must show the expected new content. Monorepo type-check must pass.

If the monorepo type-check fails because a site's `business.type` is set to a value not in its union, that's Phase 2's problem — not this phase's — so ignore errors that name `_castor-plumbing/site.config.ts` siteConfig object literals (those are fixed later). Only fix type errors that relate to the schema edits or `categoryLabels` maps themselves.

### Commit

```bash
git add packages/core-components/src/lib/content-schemas.ts \
        sites/_castor-plumbing/site.config.ts \
        sites/_castor-plumbing/app/projects/page.tsx sites/_castor-plumbing/app/projects/[slug]/page.tsx \
        sites/_cygnus-graphics/app/projects/page.tsx sites/_cygnus-graphics/app/projects/[slug]/page.tsx \
        sites/_lyra-garden/app/projects/page.tsx sites/_lyra-garden/app/projects/[slug]/page.tsx \
        sites/_nova-print/app/projects/page.tsx sites/_nova-print/app/projects/[slug]/page.tsx
git commit -m "$(cat <<'EOF'
feat(schema): extend ProjectCategory enum and widen business.type unions

Adds four new ProjectCategory enum values for the DCS example sites:
plumbing-install, plumbing-emergency, garden-design, garden-maintenance.

Widens _castor-plumbing site.config.ts business.type union to include
"Plumber" (a schema.org-valid LocalBusiness subtype already supported
by LocalBusinessSchemaOptions).

Updates categoryLabels maps in all 4 underscore sites' project pages
to render the new enum values with human labels.

Prerequisite for Phase 2 (site.config.ts rewrites) and Phase 5
(project MDX writes).

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>
EOF
)"
```

---

## Phase 2 — Rewrite 4 site.config.ts files (parallel)

**Goal:** Replace the `siteConfig` export in each of the 4 sites with real DCS business data. Interface definitions at the top of each file stay unchanged — only the `export const siteConfig: SiteConfig = { ... }` object is replaced. **Prerequisite: Phase 2a must be complete (enum extended, business.type union widened for \_castor-plumbing).**

**Model:** sonnet — careful mapping from pinned facts to typed config fields per trade

### Spawn 4 parallel Task agents, one per site

Each agent gets the Shared Business Facts block, its site's trading name, tagline, trade, credentials, and service list. Agent prompts below.

**Common config fields (same across all 4 sites):**

- `domain`: use trade-appropriate demo subdomain e.g. `"dcs-plumbing.example.com"`, `"dcs-graphics.example.com"`, etc. (these are example sites, domains are placeholders)
- `business.legalName`: `"Digital Consulting Services Ltd"` (same for all 4)
- `business.type`: **per-site** — see Phase 2a below. Each site's `business.type` union is widened to include a schema.org-valid trade type, then the `type` field is set to that type. DCS Plumbing → `"Plumber"`, DCS Graphics → `"ProfessionalService"`, DCS Garden → `"HomeAndConstructionBusiness"`, DCS Print → `"LocalBusiness"`.
- `business.phone`: `"+44 7395 063764"`
- `business.email`: `"mail@digitalconsultingservices.co.uk"`
- `business.address`: `{ street: "Unit H3, Chaucer Business Park, Dittons Road", city: "Polegate", region: "East Sussex", postalCode: "BN26 6QH", country: "United Kingdom" }`
- `business.hours`: Mon–Fri `"9:00 AM - 5:30 PM"`, Sat `"By Appointment"`, Sun `"Closed"`
- `business.socialMedia`: `{ facebook: "https://facebook.com/digitalconsultingservices", linkedin: "https://linkedin.com/company/digital-consulting-services" }` (no twitter/instagram — DCS doesn't need them on demo sites)
- `business.geo`: `{ latitude: 50.8233, longitude: 0.2557 }`
- `navigation.main`: `[ { label: "Services", href: "/services" }, { label: "Locations", href: "/locations", hasDropdown: true }, { label: "Projects", href: "/projects" }, { label: "Blog", href: "/blog" }, { label: "About", href: "/about" }, { label: "Contact", href: "/contact" } ]`
- `cta`: `{ primary: { label: "Get a Free Quote", href: "/contact" }, phone: { show: true, label: "Call 07395 063764" } }`
- `footer.copyright`: `"2026 Digital Consulting Services Ltd. Example site."`
- `footer.builtBy`: `{ name: "Digital Consulting Services", url: "https://www.digitalconsultingservices.co.uk" }`
- `serviceAreas`: `["Polegate", "Eastbourne", "Hailsham", "Lewes", "Seaford", "Brighton", "Hove", "Uckfield"]`
- `serviceAreaRegions`: two groups — "South Coast" (Polegate, Eastbourne, Hailsham, Seaford, Brighton, Hove) and "Mid Sussex" (Lewes, Uckfield)
- `features`: `{ analytics: false, consentBanner: false, contactForm: true, rateLimit: true, testimonials: true, blog: true }`

**Per-site variance:**

Each agent receives its site-specific name, tagline, trade description, credentials, services list, and about story. The about.story must include the demo disclaimer as the final paragraph.

### Agent spec template

```
Task: Rewrite site.config.ts for [site folder]
model: sonnet
Prompt: Rewrite sites/[site-folder]/site.config.ts so the `export const siteConfig: SiteConfig = { ... }` object reflects the DCS example site for [trade]. Leave all interface definitions at the top of the file unchanged — only replace the siteConfig export object.

Trading name: [name]
Tagline: [tagline]
Trade: [trade description]
Credentials list: [credentials]
Services: [10 services with slugs from the service list]
Category keywords: [keywords]

Use these exact shared values (DO NOT change them):
- business.phone: "+44 7395 063764"
- business.email: "mail@digitalconsultingservices.co.uk"
- business.address: { street: "Unit H3, Chaucer Business Park, Dittons Road", city: "Polegate", region: "East Sussex", postalCode: "BN26 6QH", country: "United Kingdom" }
- business.legalName: "Digital Consulting Services Ltd"
- business.type: **per-site, see per-agent specifics below** — DCS Plumbing: "Plumber", DCS Graphics: "ProfessionalService", DCS Garden: "HomeAndConstructionBusiness", DCS Print: "LocalBusiness"
- schema.businessType: mirror business.type (same value)
- business.geo: { latitude: 50.8233, longitude: 0.2557 }
- business.hours: Mon-Fri 9:00 AM - 5:30 PM, Sat By Appointment, Sun Closed
- serviceAreas: ["Polegate", "Eastbourne", "Hailsham", "Lewes", "Seaford", "Brighton", "Hove", "Uckfield"]
- credentials.yearEstablished: "2019"
- cta.primary: { label: "Get a Free Quote", href: "/contact" }
- cta.phone: { show: true, label: "Call 07395 063764" }
- footer.copyright: "2026 Digital Consulting Services Ltd. Example site."
- features.blog: true
- features.testimonials: true

credentials.stats: 4 trade-appropriate stats. First stat must be "Est. 2019". Include one stat referencing experience (e.g. "20+ Years Combined Experience"), one referencing jobs/projects (e.g. "500+ Projects"), and one referencing a trade credential (e.g. "Gas Safe Registered" for plumbing).

credentials.certifications: 4 trade-specific certifications.

schema.businessConfig: mirror the business block. Fill knowsAbout with trade keywords. offerCatalog: one entry per service with name, description (~120 chars), url: "/services/[slug]".

about.heroBadges: ["Est. 2019", "East Sussex", "Example Site", "By DCS"]

about.story (3 paragraphs):
1. Founding narrative for the fictional [trade] business
2. What they do and who they serve
3. REQUIRED FINAL PARAGRAPH — use this exact text:
   "This is an example site by Digital Consulting Services, demonstrating the Local Business Platform. It is not a live trading business — all services, customer reviews, and case studies shown are illustrative only. For the real platform and real client sites, visit digitalconsultingservices.co.uk."

about.whyChooseUs: 8 trade-specific bullets
about.values: 4 cards with title + description

Reference sites/mad-graphics/site.config.ts for the overall shape of the siteConfig export. Do NOT copy Mad Graphics services or credentials — use the per-site specifics above.

Use the Edit tool (reading the file first) to replace the `export const siteConfig: SiteConfig = { ... }` block. Do not touch interface definitions above it.
```

### Per-agent specifics

**Agent 1 — `_castor-plumbing` → DCS Plumbing:**

- name: "DCS Plumbing"
- tagline: "Family-run plumbing and heating example site — East Sussex"
- trade: "Plumbing & heating example site operated by Digital Consulting Services. Demonstrates the Local Business Platform for plumbing and heating trades."
- **business.type: `"Plumber"`** (schema.org-valid LocalBusiness subtype; Phase 2a widens the union to include this value)
- **schema.businessType: `"Plumber"`** (same value)
- credentials: Gas Safe Registered, CIPHE Member, WaterSafe Approved, £5M Public Liability
- services: 10 from DCS Plumbing table above
- keywords: boiler, heating, plumbing, gas safe, central heating, bathrooms, emergency plumber, leak detection

**Agent 2 — `_cygnus-graphics` → DCS Graphics:**

- name: "DCS Graphics"
- tagline: "Creative design, signage and print example site — East Sussex"
- trade: "Graphic design, brand identity, signage and print example site operated by Digital Consulting Services. Positioned as a creative studio (design + signage + print), consultative in tone."
- **business.type: `"ProfessionalService"`** (already in the existing union — no widening needed)
- **schema.businessType: `"ProfessionalService"`**
- credentials: In-House Designers, Brand Strategy Specialists, Colour-Matched Print, Trade Association Member
- services: 10 from DCS Graphics table above
- keywords: brand identity, logo design, graphic design, signage, print, packaging, creative studio
- POSITIONING NOTE: write copy as a creative-agency studio — consultative, educational, "art and science", emphasis on effective communication. Distinct from Mad Graphics (same cygnus theme, but positioned as a production print shop). Reference https://www.designlab-eastbourne.co.uk in spirit — DO NOT copy their text.

**Agent 3 — `_lyra-garden` → DCS Garden:**

- name: "DCS Garden"
- tagline: "Garden design and maintenance example site — East Sussex"
- trade: "Garden design, landscaping and maintenance example site operated by Digital Consulting Services. Covers domestic and commercial gardens across East Sussex and the South Downs."
- **business.type: `"HomeAndConstructionBusiness"`** (already in the existing union; this is the closest schema.org parent type for landscaping services — there's no dedicated `Gardener` type on schema.org)
- **schema.businessType: `"HomeAndConstructionBusiness"`**
- credentials: RHS-Aligned Practices, BALI-Equivalent Member, NPTC Chainsaw Qualified, Waste Carriers Licence
- services: 10 from DCS Garden table above
- keywords: garden design, landscaping, lawn care, hedge trimming, tree surgery, fencing, planting, maintenance

**Agent 4 — `_nova-print` → DCS Print:**

- name: "DCS Print"
- tagline: "Commercial print and large format example site — East Sussex"
- trade: "Commercial print, flyers, business cards, brochures and large format example site operated by Digital Consulting Services. Production-first print shop with fast turnaround."
- **business.type: `"LocalBusiness"`** (schema.org has no dedicated `Printer` type; generic `LocalBusiness` is the correct choice)
- **schema.businessType: `"LocalBusiness"`**
- credentials: BPIF-Equivalent Member, FSC-Certified Paper, In-House Production, Colour-Matched Proofs
- services: 10 from DCS Print table above
- keywords: print, flyers, brochures, business cards, posters, banners, large format, commercial print

### Verification gate — STOP if this fails

```bash
# Verification gate — STOP if this fails
pnpm --filter _castor-plumbing type-check
pnpm --filter _cygnus-graphics type-check
pnpm --filter _lyra-garden type-check
pnpm --filter _nova-print type-check
grep -l "Unit H3, Chaucer Business Park" sites/_castor-plumbing/site.config.ts sites/_cygnus-graphics/site.config.ts sites/_lyra-garden/site.config.ts sites/_nova-print/site.config.ts
grep -l "example site by Digital Consulting Services\|Example site by Digital Consulting Services\|example site, demonstrating the Local Business Platform" sites/_castor-plumbing/site.config.ts sites/_cygnus-graphics/site.config.ts sites/_lyra-garden/site.config.ts sites/_nova-print/site.config.ts
```

All 4 type-checks must pass. All 4 grep calls must return all 4 filenames (confirming the Polegate address AND the demo disclaimer are present in every config).

If type-check fails: the error will be in `site.config.ts` itself. Likely places: missing optional fields, string-vs-number mismatches in `schema.businessConfig.geo`, invalid `business.type` value, missing navigation item. Fix the config, do NOT weaken the types.

### Commit

```bash
git add sites/_castor-plumbing/site.config.ts sites/_cygnus-graphics/site.config.ts sites/_lyra-garden/site.config.ts sites/_nova-print/site.config.ts
git commit -m "$(cat <<'EOF'
feat(dcs-sites): replace site.config.ts for 4 DCS example sites

Populates _castor-plumbing, _cygnus-graphics, _lyra-garden, and
_nova-print with DCS business data: Polegate address, DCS mobile,
trade-specific services and credentials, demo disclaimer in about
block. DCS Graphics deliberately positioned as a creative studio to
differentiate from the production-shop tone of sites/mad-graphics.

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>
EOF
)"
```

---

## Phase 3 — Write 40 service MDX files (40 parallel agents)

**Goal:** Create 10 MDX files per site in each site's `content/services/` directory. Total: 40 files.

**Model:** sonnet — realistic trade-specific service copy

### Shape requirements (from ServiceFrontmatterSchema)

Every service file must include:

- `title` (5-100 chars)
- `seoTitle` (10-60 chars) — pattern: `"[Service] | DCS [Trade] | East Sussex"`
- `description` (50-200 chars) — include "example site by Digital Consulting Services" fragment
- `keywords` (3-10 entries)
- `hero.image` — placeholder path like `"placeholder/hero-[slug].webp"`
- `hero.heading`, `hero.subheading`, `hero.cta` (label `"Get a Free Quote"`, href `/contact`)
- `breadcrumbs` — Home → Services → [Service]
- `faqs` — **minimum 5, maximum 10**. First FAQ's answer MUST include: `"This is an example site by Digital Consulting Services — not a live trading business."` Subsequent FAQs should be realistic trade questions with trade-specific answers.
- `about.whatIs` (≥50 chars)
- `about.whenNeeded` (≥4 items, each ≥10 chars)
- `about.whatAchieve` (≥4 items, each ≥10 chars)
- `about.keyPoints` (≥3 items, each ≥10 chars) — reference DCS, Polegate base, 2019 founding, trade credentials
- `category` — **DCS Plumbing and DCS Garden:** use the value from the per-site service tables above. **DCS Graphics and DCS Print:** OMIT this field entirely — design and print work does not fit installation/maintenance/repair semantics, and the field is already `.optional()` in the schema. Do not set it to an empty string or a made-up value.
- `localContact` — phone `07395 063764`, email `mail@digitalconsultingservices.co.uk`, address `Polegate, East Sussex`

### MDX body

Below the frontmatter, include a short (~150-250 word) intro using these MDX components (all from mad-graphics reference): `ServiceIntro`, `SidebarItem`, `ProcessStep`, optionally `CoverageSection`. Reference `sites/mad-graphics/content/services/vehicle-graphics.mdx` for the exact shape. Do NOT invent new components.

### Parallelism: spawn 40 Task agents in parallel

Launch all 40 in **a single Task-tool message**. Each agent writes one file.

Agent spec template:

```
Task: Write content/services/[slug].mdx for [site folder] ([DCS trade name])
model: sonnet
Prompt: Write the file sites/[site-folder]/content/services/[slug].mdx for [DCS trading name] — a DCS example site for the [trade] trade, operated by Digital Consulting Services from Unit H3, Chaucer Business Park, Dittons Road, Polegate, East Sussex, BN26 6QH. Phone 07395 063764, email mail@digitalconsultingservices.co.uk.

IMPORTANT: This is an EXAMPLE SITE, not a real trading business. The demo disclaimer MUST appear as the answer to the first FAQ, exact wording:
"This is an example site by Digital Consulting Services — not a live trading business. The content shown here demonstrates how the Local Business Platform renders a real [trade] site. For DCS services, visit digitalconsultingservices.co.uk."

Service details:
- Title: [title]
- Slug: [slug]
- Category: [installation|maintenance|repair|OMIT] — OMIT entirely for DCS Graphics and DCS Print services; use the real value for DCS Plumbing and DCS Garden
- Trade: [trade description]
- Uniqueness hook: [one-line distinguishing brief — see per-service hook below]

Frontmatter must satisfy ServiceFrontmatterSchema in packages/core-components/src/lib/content-schemas.ts. Include: title, seoTitle, description (50-200 chars, MUST mention "East Sussex" and contain the phrase "example site"), 5-10 keywords, hero (heading, subheading, image placeholder, cta), breadcrumbs (Home → Services → [Service]), 5-8 FAQs where FAQ #1 is the demo disclaimer (shown above), 4-7 realistic trade FAQs following it, about block (whatIs 50+ chars, whenNeeded 4+ items, whatAchieve 4+ items, keyPoints 3+ items referencing DCS/Polegate/2019), category (OMIT for DCS Graphics and DCS Print — the field is `.optional()` and design/print doesn't fit the enum), localContact (phone 07395 063764, email mail@digitalconsultingservices.co.uk).

Body (below frontmatter): Use EXACTLY the MDX component shape from sites/mad-graphics/content/services/vehicle-graphics.mdx — ServiceIntro + SidebarItem + ProcessStep blocks. Do not invent new components.

Read sites/mad-graphics/content/services/vehicle-graphics.mdx once as a shape reference before writing, then use the Write tool to create the file. Do not read any other files.
```

Agents need the uniqueness hook for their specific service. The hooks are below.

### Uniqueness hooks

**DCS Plumbing:**

- `boiler-installation`: Lead with Gas Safe compliance, 7-10 year warranties, Worcester Bosch / Vaillant premium brands, £1,800-£3,500 price range
- `boiler-repair-servicing`: Annual service plans, fixed £89 callout, landlord compliance mode
- `emergency-plumber`: 24/7 callout, 2-hour response within 10 miles of Polegate, no weekend surcharge
- `bathroom-installation`: Full supply-and-fit, period-property specialists, 4-6 week typical timeline
- `central-heating-installation`: New-build and upgrade, smart thermostat, zone heating for larger homes
- `power-flushing`: MagnaClean filter fit, benefit vs chemical flush, every 5-7 years
- `leak-detection-repair`: Thermal imaging + acoustic, minimal disruption, insurance-ready reporting
- `blocked-drains`: CCTV drain survey, high-pressure jetting, root intrusion in older gardens
- `radiator-installation-repair`: Vertical designer rads, towel rails, cold-at-top troubleshooting
- `landlord-gas-safety`: CP12 same-day issue, portfolio pricing, appointment flexibility

**DCS Graphics:**

- `brand-identity-logo-design`: Strategy-first approach, moodboards, 3 concepts, 2 revision rounds, brand guidelines PDF included
- `graphic-design-for-print`: Print-ready artwork from rough brief, Pantone matching, proofing process
- `vehicle-graphics-livery`: UV-rated 7-year vinyl, in-house design, fleet consistency, installation in Polegate workshop
- `shop-signs-signage`: Planning permission guidance, illuminated options, heritage-area compliance
- `business-stationery`: Business cards + letterhead + compliment slips + email signature as matched sets
- `brochures-marketing-print`: Saddle-stitched, perfect bound, 150gsm to 400gsm stock options, eco paper available
- `exhibition-event-graphics`: Pop-up banners, pull-up stands, lightweight tension fabric, travel cases
- `workwear-branded-clothing`: Embroidery + heat transfer, polos, hoodies, hi-vis, bulk pricing
- `window-graphics-retail-display`: One-way vision film, cut vinyl, seasonal campaign swaps, easy removal
- `packaging-label-design`: Die-line artwork, small-batch label runs, waterproof + UV-rated options

**DCS Garden:**

- `garden-design-landscaping`: Full design service, CAD plans, phased installation, planting schedules
- `lawn-care-mowing`: Weekly/fortnightly contracts, scarifying, feeding, moss treatment
- `hedge-trimming-pruning`: Correct timing by species, up to 12m with MEWP access, waste removal included
- `tree-surgery`: NPTC qualified, dismantling, crown reduction, stump grinding, full insurance
- `patio-decking-installation`: Natural stone, porcelain, composite decking, proper drainage, drainage compliance
- `fencing-gates`: Closeboard, lap panel, post-and-rail, auto gates, trellis
- `garden-clearance`: Full clearance with licensed waste removal, overgrown gardens a specialty
- `planting-borders`: Chalk-soil planting schemes, year-round interest, pollinator-friendly
- `turf-laying`: Ground prep, topsoil, Rolawn-grade turf, laid and watered, ready for use
- `seasonal-garden-maintenance`: Spring prep, summer mowing, autumn leaf clear, winter pruning — quarterly contracts

**DCS Print:**

- `business-cards`: 350gsm silk, matt lam, spot UV, foil, 100-5000 print runs, next-day turnaround
- `flyers-leaflets`: A7 to A3, 130-300gsm, folded options (tri-fold, gate, cross), bulk pricing
- `brochures-catalogues`: 8-64 page options, saddle or perfect binding, 150-200gsm text stocks
- `banners-display-print`: PVC, mesh, fabric, eyelet or hem finishing, up to 3m wide
- `large-format-print`: Up to 1600mm wide, photo paper, canvas, vinyl, posters, wall graphics
- `poster-printing`: A4 to A0, matt or gloss finish, 170-250gsm, same-day rush available
- `letterheads-compliment-slips`: 100gsm or 120gsm, full colour or 1-colour, conqueror stock available
- `folders-presentation-print`: Pocket folders, interlocking, foiled, embossed, business card slots
- `stickers-labels`: Die-cut, kiss-cut, waterproof, UV-rated, clear vinyl, product labels
- `book-booklet-printing`: Short-run 50+ copies, perfect or saddle bound, cover lamination

### Verification gate — STOP if this fails

```bash
# Verification gate — STOP if this fails
for site in _castor-plumbing _cygnus-graphics _lyra-garden _nova-print; do
  count=$(ls sites/$site/content/services/*.mdx 2>/dev/null | wc -l | tr -d ' ')
  echo "$site services: $count"   # must be 10
done
cd sites/_castor-plumbing && npm run validate:content -- services 2>&1 && cd ../..
cd sites/_cygnus-graphics && npm run validate:content -- services 2>&1 && cd ../..
cd sites/_lyra-garden && npm run validate:content -- services 2>&1 && cd ../..
cd sites/_nova-print && npm run validate:content -- services 2>&1 && cd ../..
```

Each count must be exactly 10. Each validate:content call must pass. If any file fails Zod validation, fix it and re-run before continuing.

### Commit

```bash
git add sites/_castor-plumbing/content/services/ sites/_cygnus-graphics/content/services/ sites/_lyra-garden/content/services/ sites/_nova-print/content/services/
git commit -m "$(cat <<'EOF'
feat(dcs-sites): add 40 real service MDX files across 4 example sites

10 services per site for DCS Plumbing (boiler/heating/bathroom/drains),
DCS Graphics (brand identity/signage/vehicle livery/workwear), DCS
Garden (design/lawn/hedge/tree surgery/fencing), and DCS Print (cards/
flyers/brochures/banners/large format). Each service FAQ #1 contains
the demo disclaimer.

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>
EOF
)"
```

---

## Phase 4 — Write 32 location MDX files (32 parallel agents)

**Goal:** Create 8 location MDX files per site in each site's `content/locations/` directory. All 4 sites share the same 8 towns (Polegate, Eastbourne, Hailsham, Lewes, Seaford, Brighton, Hove, Uckfield).

**Model:** sonnet — local colour per town framed through each trade's lens

### Shape requirements (from LocationFrontmatterSchema)

- `title` (2-50 chars) — town name
- `seoTitle` (10-80 chars) — pattern: `"[Town] [Trade] | DCS [Trade] | East Sussex Example Site"`
- `description` (50-200 chars) — must embed the phrase `"example site by Digital Consulting Services"`
- `keywords` (≥3)
- `county`: `"East Sussex"`
- `countySlug`: `"east-sussex"`
- `coords`: [latitude, longitude] from the Shared Service Areas table above
- `mapDescription` (<100 chars)
- `heroImage`: `"placeholder/locations/hero-[slug].webp"`
- `hero`: title, description (≥20 chars), `highlightItems` (≥1 — use 4: "Est. 2019", "East Sussex", trade credential, "By DCS"), `primaryActionLabel` = `"Get a Free Quote"`, `primaryActionHref` = `/contact`, `phone: "07395 063764"`, `ctaText: "Get Your Free Quote"`, `ctaUrl: "/contact"`
- `specialists` (3 cards): trade-specific local detail per town. Reference REAL streets/districts (listed below) — do NOT invent fictional landmarks.
- `services` (5-6 cards): pick the most relevant services for that town's profile, each with title, description, `link: "/services/[slug]"`. Use service slugs from that SITE's service list (not from a different site's list).
- `faqs` (≥5, ≤10): town-specific trade questions, including one that mentions the demo nature

### Real streets/districts per town (use ONLY these or similar well-known areas)

- **Polegate** — Dittons Road, Wannock, High Street, Polegate Railway Station, Chaucer Business Park (home!)
- **Eastbourne** — Terminus Road, Meads, Old Town, Sovereign Harbour, Devonshire Park, Hampden Park
- **Hailsham** — High Street, Diplocks Way, Summerheath, Hellingly
- **Lewes** — Cliffe, High Street, Southover, Wallands Park, Neville, Landport
- **Seaford** — Bay Vue, The Esplanade, Alfriston Road, Sutton Park
- **Brighton** — North Laine, Kemptown, Hanover, Preston Park, Fiveways, Montpelier
- **Hove** — Church Road, Brunswick, Poets Corner, Hove Park, Palmeira Square
- **Uckfield** — High Street, Ridgewood, Framfield, Bellbrook Industrial Estate

### Parallelism: spawn 32 Task agents in parallel (one per site × town combination)

Launch all 32 in **a single Task-tool message**.

Agent spec template:

```
Task: Write content/locations/[slug].mdx for [site folder] — [Town]
model: sonnet
Prompt: Write the file sites/[site-folder]/content/locations/[slug].mdx for [DCS trading name] — a DCS example site for [trade] operated by Digital Consulting Services from Polegate, East Sussex. Phone 07395 063764, email mail@digitalconsultingservices.co.uk.

IMPORTANT: This is an EXAMPLE SITE. The description field MUST embed the phrase "example site by Digital Consulting Services" somewhere in the text (keep it natural — e.g. "Serving [Town] from our Polegate workshop, DCS [Trade] is an example site by Digital Consulting Services demonstrating the Local Business Platform.").

Location: [town name]
Slug: [slug]
Coords: [lat, lng]
Trade lens for this town: [trade-specific local colour — see per-location hook below]
Real streets/districts you may reference (do NOT invent others): [list]

Frontmatter must satisfy LocationFrontmatterSchema in packages/core-components/src/lib/content-schemas.ts. Include: title, seoTitle (10-80 chars), description (50-200 chars, MUST contain "example site by Digital Consulting Services"), 3-8 keywords, county "East Sussex", countySlug "east-sussex", coords, mapDescription (<100 chars), heroImage (placeholder path), hero block with highlightItems ["Est. 2019", "East Sussex", "[trade credential]", "By DCS"], specialists block with 3 cards referencing the trade lens, services block with 5-6 service cards linking to /services/[slug] (use service slugs from the DCS [Trade] services list: [list of 10 service slugs for this site]), and 5-8 town-specific faqs.

Reference sites/mad-graphics/content/locations/eastbourne.mdx for the exact frontmatter shape. Do NOT copy Mad Graphics copy. Do NOT add the pricing block (optional, skip it).

Below the frontmatter, include one short intro paragraph (~60-100 words) embedding both the trade lens and a mention that this is an example site.

Use the Write tool to create the file.
```

### Trade lens per (site × town)

**DCS Plumbing lens:**

- Polegate: home workshop, 1960s-80s estate housing, rural Wannock
- Eastbourne: Victorian stock, coastal hard water, retired-population emergency callouts common
- Hailsham: new-build estates, rural outlying properties, commercial boiler work at Diplocks Way
- Lewes: Georgian and Victorian period properties, chalk-soil limescale, listed-building work
- Seaford: coastal corrosion on copper pipework, 1960s bungalows common
- Brighton: North Laine Regency terraces, Hanover hillside narrow properties, HMO landlord work
- Hove: large Victorian houses with cast-iron radiators, period plumbing upgrades
- Uckfield: mix of period cottages and 1990s estates, commercial work at Bellbrook Industrial Estate

**DCS Graphics lens:**

- Polegate: Chaucer Business Park workshop, local independent retailer signage
- Eastbourne: Terminus Road shop fronts, Sovereign Harbour marina boat liveries, Devonshire Park event graphics
- Hailsham: market town independents, Diplocks Way light industrial signage
- Lewes: Cliffe independent retailer signage, listed-building compliance, tourism-focused shops
- Seaford: seaside cafe signage, coastal UV-resistant specifications
- Brighton: North Laine creative quarter, Kemptown independents, hotel/hospitality branding
- Hove: Church Road boutique retailers, Regency-area signage sensitivity
- Uckfield: High Street independents, Bellbrook Industrial Estate fleet livery

**DCS Garden lens:**

- Polegate: Downs-edge gardens, Wannock rural plots, large suburban gardens
- Eastbourne: seafront-facing gardens with salt tolerance, Meads retirement gardens, Hampden Park family gardens
- Hailsham: rural plots, outlying smallholdings, new-build estate landscaping
- Lewes: listed-building gardens, chalk-grassland planting, Southover cottage gardens
- Seaford: coastal exposed gardens, salt-tolerant planting schemes
- Brighton: small urban courtyards, North Laine roof terraces, Preston Park family gardens
- Hove: Regency terrace front gardens, Hove Park large-lawn properties
- Uckfield: rural Ridgewood gardens, Weald smallholdings, cottage gardens

**DCS Print lens:**

- Polegate: base workshop serving local small businesses
- Eastbourne: conference and event print (Devonshire Park, hotel sector), Terminus Road retail point-of-sale
- Hailsham: local event programme print, independent retailer POS
- Lewes: bonfire night event print, Cliffe tourist leaflets, independent publishing
- Seaford: seaside promotional print, event flyers
- Brighton: hospitality menu print, festival print runs, creative sector collateral
- Hove: boutique retailer POS, estate-agent window displays
- Uckfield: industrial estate catalogues, local business cards, event programmes

### Verification gate — STOP if this fails

```bash
# Verification gate — STOP if this fails
for site in _castor-plumbing _cygnus-graphics _lyra-garden _nova-print; do
  count=$(ls sites/$site/content/locations/*.mdx 2>/dev/null | wc -l | tr -d ' ')
  echo "$site locations: $count"   # must be 8
done
cd sites/_castor-plumbing && npm run validate:content -- locations 2>&1 && cd ../..
cd sites/_cygnus-graphics && npm run validate:content -- locations 2>&1 && cd ../..
cd sites/_lyra-garden && npm run validate:content -- locations 2>&1 && cd ../..
cd sites/_nova-print && npm run validate:content -- locations 2>&1 && cd ../..
```

Every count must equal 8. Every validate:content call must pass.

### Commit

```bash
git add sites/_castor-plumbing/content/locations/ sites/_cygnus-graphics/content/locations/ sites/_lyra-garden/content/locations/ sites/_nova-print/content/locations/
git commit -m "$(cat <<'EOF'
feat(dcs-sites): add 32 location MDX files across 4 example sites

8 East Sussex locations per site (Polegate, Eastbourne, Hailsham,
Lewes, Seaford, Brighton, Hove, Uckfield). Each location framed
through the site's trade lens — coastal corrosion for plumbing,
salt-tolerant planting for garden, independent retailer signage
for graphics, hospitality print for print. All use real streets
and districts.

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>
EOF
)"
```

---

## Phase 5 — Write 20 blog posts + 16 projects + 24 testimonials (60 parallel agents)

**Goal:** Populate `content/blog/`, `content/projects/`, `content/testimonials/` across all 4 sites in one parallel burst.

**Model:** sonnet — topic-specific copy per trade

### Blog posts (20 files, 5 per site)

Schema: `BlogFrontmatterSchema`. Each must include:

- `title` (10-100 chars)
- `date` (YYYY-MM-DD, between 2025-06-01 and 2026-03-31)
- `author`: `{ name: "The DCS Team", role: "Digital Consulting Services" }`
- `description` (50-200 chars)
- `category` (must be one of: `industry-tips`, `how-to-guide`, `case-study`, `seasonal`, `news`)
- `tags` (1-10)
- `excerpt` (50-300 chars — append `" (Example site content.)"` at end)
- `heroImage` placeholder path
- Body of ~600-1200 words

Use the per-site blog list tables from the Pinned Facts section above.

### Projects (16 files, 4 per site)

Schema: `ProjectFrontmatterSchema`. Required: title, description, projectType (residential/commercial/industrial/heritage), category (from ProjectCategory enum — see tables above for valid mappings), location (slug), locationName, completionDate, year (int 2023-2026), services (array of service slugs from that site), heroImage placeholder.

Recommended: duration, client (type + testimonial + rating), scope (buildingType + squareMetres + challenges), images (array of 3-5), results (array), faqs (optional 2-3).

Each project body: ~300-500 words covering brief, approach, challenges, outcome. **Append a single-line disclaimer at the end of the body:** `"*This case study is illustrative content from an example site by Digital Consulting Services.*"`

Use the per-site project tables from the Pinned Facts section above.

### Testimonials (24 files, 6 per site)

Schema: `TestimonialFrontmatterSchema`. Required: customerName (fictional), rating (mix 4 and 5), text (20-1000 chars — **do NOT add demo disclaimer here**, keep natural), date (2025-06 to 2026-03).

Recommended: customerRole, customerCompany, excerpt, service (link to real service title), serviceSlug (matching the site's service slugs), location, locationSlug, projectType, featured (bool), verified (true), platform (mix internal/google/reviews.io).

Body below frontmatter: one paragraph (~40-60 words) expanding the review in realistic language. No marketing speak.

6 testimonials per site, each linking to different service + location combinations from that site's lists.

### Parallelism: spawn 60 Task agents in parallel

Launch all 60 in **one Task-tool message**. They write to 12 different directories (4 sites × 3 content types) and share no dependencies.

Per-content-type agent spec templates:

**Blog agent template:**

```
Task: Write content/blog/[filename].mdx for [site] ([DCS trade name])
model: sonnet
Prompt: Write sites/[site-folder]/content/blog/[filename] for [DCS trading name] operated by Digital Consulting Services (Polegate, East Sussex, 07395 063764).

Post: [title]
Category: [category]
Date: [date]
Focus: [body focus from table]

Frontmatter must satisfy BlogFrontmatterSchema. Include title, date, author ({ name: "The DCS Team", role: "Digital Consulting Services" }), description (50-200 chars), category, 3-6 tags, heroImage "placeholder/blog/[filename slug without .mdx].webp", readingTime (4-10), excerpt (50-300 chars — MUST end with " (Example site content.)"), featured false.

Body: ~600-1200 words of genuinely useful [trade] advice — concrete tips not fluff. Use H2 and H3 headings, bullet lists where appropriate. Reference East Sussex context where relevant (chalk soil, coastal conditions, Lewes period stock, etc.).

Use the Write tool.
```

**Project agent template:**

```
Task: Write content/projects/[filename].mdx for [site]
model: sonnet
Prompt: Write sites/[site-folder]/content/projects/[filename] for [DCS trading name] — operated by Digital Consulting Services, Polegate, East Sussex.

Project: [title]
projectType: [type]
category: [category — must be from ProjectCategory enum]
Location slug: [slug]
Location name: [town]

Frontmatter must satisfy ProjectFrontmatterSchema. Include title (10-100 chars), description (50-200 chars), projectType, category (must be valid enum value), location (slug), locationName, completionDate (YYYY-MM-DD in 2024-2026), year (int), services (1+ service slugs from [this site's service list]), heroImage placeholder, duration, client ({ type: one of [Private Homeowner, Property Developer, Local Authority, Business], testimonial ≥20 chars, rating 4-5 }), scope ({ buildingType, squareMetres?, challenges: 2-4 items }), images (3 entries each with path + caption + order), results (3-5 items ≥10 chars each).

Body: ~300-500 words in Markdown — brief, approach, challenges, outcome. Last line of body MUST be exactly:
"*This case study is illustrative content from an example site by Digital Consulting Services.*"

Use the Write tool.
```

**Testimonial agent template:**

```
Task: Write content/testimonials/[filename].mdx for [site]
model: sonnet
Prompt: Write sites/[site-folder]/content/testimonials/[filename] for [DCS trading name].

Customer: [fictional name]
Linked service: [service title + slug from this site's list]
Linked location: [town + slug from coverage list]
Rating: [4 or 5]
Featured: [true or false]
Platform: [internal|google|reviews.io]
Date: [YYYY-MM-DD between 2025-06 and 2026-03]

Frontmatter must satisfy TestimonialFrontmatterSchema. Required: customerName, rating, text (20-1000 chars — realistic customer voice, NOT marketing copy, NO disclaimer), date. Also include: customerRole (e.g. "Homeowner", "Property Manager", "Café Owner"), excerpt (shorter version, max 200 chars), service (title), serviceSlug, location (town name), locationSlug, projectType (residential/commercial), featured, verified: true, platform.

Body (below frontmatter): ONE paragraph ~40-60 words expanding the experience in natural language. No marketing speak. No disclaimer — testimonials stay natural.

Use the Write tool.
```

### Verification gate — STOP if this fails

```bash
# Verification gate — STOP if this fails
for site in _castor-plumbing _cygnus-graphics _lyra-garden _nova-print; do
  blog=$(ls sites/$site/content/blog/*.mdx 2>/dev/null | wc -l | tr -d ' ')
  projects=$(ls sites/$site/content/projects/*.mdx 2>/dev/null | wc -l | tr -d ' ')
  test=$(ls sites/$site/content/testimonials/*.mdx 2>/dev/null | wc -l | tr -d ' ')
  echo "$site: blog=$blog projects=$projects testimonials=$test"
done
# Expected output (all must match):
# _castor-plumbing: blog=5 projects=4 testimonials=6
# _cygnus-graphics: blog=5 projects=4 testimonials=6
# _lyra-garden: blog=5 projects=4 testimonials=6
# _nova-print: blog=5 projects=4 testimonials=6
cd sites/_castor-plumbing && npm run validate:content 2>&1 && cd ../..
cd sites/_cygnus-graphics && npm run validate:content 2>&1 && cd ../..
cd sites/_lyra-garden && npm run validate:content 2>&1 && cd ../..
cd sites/_nova-print && npm run validate:content 2>&1 && cd ../..
```

Every count must match. Every `validate:content` call validates ALL content types (services + locations + blog + projects + testimonials) for its site — this is the full validation gate.

### Commit

```bash
git add sites/_castor-plumbing/content/blog/ sites/_castor-plumbing/content/projects/ sites/_castor-plumbing/content/testimonials/ \
        sites/_cygnus-graphics/content/blog/ sites/_cygnus-graphics/content/projects/ sites/_cygnus-graphics/content/testimonials/ \
        sites/_lyra-garden/content/blog/ sites/_lyra-garden/content/projects/ sites/_lyra-garden/content/testimonials/ \
        sites/_nova-print/content/blog/ sites/_nova-print/content/projects/ sites/_nova-print/content/testimonials/
git commit -m "$(cat <<'EOF'
feat(dcs-sites): add 20 blog posts + 16 projects + 24 testimonials

5 blog + 4 projects + 6 testimonials per site across 4 DCS example
sites. Blog excerpts carry the "(Example site content.)" tag.
Project bodies end with a demo disclaimer line. Testimonials stay
natural to feel like real customer voices.

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>
EOF
)"
```

---

## Phase 6 — Smoke build all 4 sites and monorepo type-check

**Goal:** Prove all 4 sites build end-to-end and render the real content on their named themes. This is the final quality gate.

**Model:** sonnet — interprets build errors and decides whether to fix or report

### Steps — run SEQUENTIALLY (not parallel)

`pnpm build` writes to each site's `.next/` directory. Running them in parallel would cause resource contention and unclear error output. Serial is correct here.

```bash
pnpm --filter _castor-plumbing type-check
pnpm --filter _castor-plumbing build
pnpm --filter _cygnus-graphics type-check
pnpm --filter _cygnus-graphics build
pnpm --filter _lyra-garden type-check
pnpm --filter _lyra-garden build
pnpm --filter _nova-print type-check
pnpm --filter _nova-print build
pnpm type-check   # monorepo-wide, catches any cross-package issues
```

Do NOT run `pnpm pipeline:smoke` — that targets the theme-ingestion pipeline, not site content.
Do NOT run dev servers — they're interactive and block the terminal. Build-only is sufficient.

### Verification gate — STOP if this fails

```bash
# Verification gate — STOP if this fails
pnpm --filter _castor-plumbing type-check && pnpm --filter _castor-plumbing build
pnpm --filter _cygnus-graphics type-check && pnpm --filter _cygnus-graphics build
pnpm --filter _lyra-garden type-check && pnpm --filter _lyra-garden build
pnpm --filter _nova-print type-check && pnpm --filter _nova-print build
pnpm type-check
```

All 9 commands must exit zero. If any site build fails with a content validation error, fix the offending MDX file (report which file and what the error was) and re-run from that site. If it fails with a TypeScript error in `site.config.ts`, fix the config — do NOT weaken the types. If it fails with an upstream error in a theme package or core-components, STOP and report — that's out of scope for this brief.

### Commit (only if a fix was needed)

```bash
git add -A
git commit -m "$(cat <<'EOF'
fix(dcs-sites): resolve content validation and build errors

[one-line description of what broke and how it was fixed]

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>
EOF
)"
```

---

## Parallel execution groups

This section lists work units that can run concurrently. Each group lists items that MUST be launched in a single Task-tool message. Items across groups run sequentially in the order listed. Groups are named `G1`, `G2`, … for reference.

### Intra-phase groups

| Group | Phase    | Items                                                                                                                                                                                         | File overlap                                                                                                                                                                                                                 | Model  | Rationale                                                                                                    |
| ----- | -------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------ | ------------------------------------------------------------------------------------------------------------ |
| G1    | Phase 1  | Single batched `rm -f` call listing all 56 placeholder MDX paths across 4 sites                                                                                                               | none                                                                                                                                                                                                                         | haiku  | Pure deletions across disjoint paths — one Bash call is faster than 56 individual calls                      |
| G2a.1 | Phase 2a | Sequential: Edit `packages/core-components/src/lib/content-schemas.ts` (extend ProjectCategory enum), then Edit `sites/_castor-plumbing/site.config.ts` (widen business.type union)           | sequential — 2 distinct files, no overlap but do them in order to keep commits clean                                                                                                                                         | sonnet | Schema change first, then the one site config union widening. Can't parallelise meaningfully — only 2 files. |
| G2a.2 | Phase 2a | 8 parallel haiku Task agents: add 4 new categoryLabels entries to each of the 8 project page files (2 per site × 4 sites)                                                                     | none                                                                                                                                                                                                                         | haiku  | Each agent edits a distinct file with the same 4-line add                                                    |
| G2    | Phase 2  | 4 parallel Task agents: edit `_castor-plumbing/site.config.ts`, `_cygnus-graphics/site.config.ts`, `_lyra-garden/site.config.ts`, `_nova-print/site.config.ts` (siteConfig export rewrite)    | `_castor-plumbing/site.config.ts` is also touched in Phase 2a — but Phase 2a edits the interface (top of file), Phase 2 edits the siteConfig export (bottom). They're serialised by the phase gate, so file overlap is safe. | sonnet | Each agent edits a different site's config — zero overlap within the group                                   |
| G3    | Phase 3  | 40 parallel Task agents: 10 service MDX writes per site × 4 sites. Every agent writes a distinct `sites/[site]/content/services/[slug].mdx` file.                                             | none                                                                                                                                                                                                                         | sonnet | Each file path is unique across all 40 agents                                                                |
| G4    | Phase 4  | 32 parallel Task agents: 8 location MDX writes per site × 4 sites. Every agent writes a distinct `sites/[site]/content/locations/[slug].mdx` file.                                            | none                                                                                                                                                                                                                         | sonnet | Each file path is unique across all 32 agents                                                                |
| G5    | Phase 5  | 60 parallel Task agents: (5 blog + 4 projects + 6 testimonials) × 4 sites. Each agent writes a distinct file across 12 directories (`content/blog/`, `projects/`, `testimonials/` × 4 sites). | none                                                                                                                                                                                                                         | sonnet | Each file path is unique across all 60 agents                                                                |
| G6    | Phase 6  | — no parallel work in this phase —                                                                                                                                                            | `.next/` per site                                                                                                                                                                                                            | sonnet | Build commands must run serially — each `pnpm build` writes to a shared build cache and resource pool        |

### Cross-phase groups

| Group  | Phases | Items | Rationale                                                                                                                                                                                                                                                                             |
| ------ | ------ | ----- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| (none) |        |       | Every phase gates the next via a verification check. No cross-phase parallelism is safe. Phase 2 needs Phase 1 clean; Phases 3/4/5 need Phase 2's configs in place (because content references service and location slugs from `site.config.ts`); Phase 6 needs all content complete. |

### Sequential points — MUST NOT parallelise

| Item                                                                                    | Reason                                                                                                     |
| --------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------- |
| Verification gates (`pnpm type-check`, `pnpm build`, `validate:content`) between phases | Each phase's output gates the next. Gates are the synchronisation barrier.                                 |
| Git commits                                                                             | One commit per phase, in order. Commits are never batched.                                                 |
| Phase 6 build sequence                                                                  | `pnpm build` writes to `.next/` — running 4 builds in parallel causes contention and unclear error output. |
| Within Phase 2: agents editing the SAME file                                            | Not applicable here — each agent edits a different site's config — but stated for completeness.            |

---

## Cost Estimate

| Phase                                                            | Model          | Est. input tokens | Est. output tokens | Est. cost  |
| ---------------------------------------------------------------- | -------------- | ----------------- | ------------------ | ---------- |
| Phase 1: Delete 56 placeholders                                  | haiku          | ~4k               | ~0.5k              | $0.01      |
| Phase 2a: Extend schema + widen union + update 8 categoryLabels  | sonnet + haiku | ~18k              | ~4k                | $0.10      |
| Phase 2: Rewrite 4 site.config.ts files (4 parallel agents)      | sonnet         | ~32k              | ~24k               | $0.46      |
| Phase 3: 40 service MDX files (40 parallel agents)               | sonnet         | ~200k             | ~120k              | $2.40      |
| Phase 4: 32 location MDX files (32 parallel agents)              | sonnet         | ~192k             | ~112k              | $2.26      |
| Phase 5: 20 blog + 16 projects + 24 testimonials (60 par agents) | sonnet         | ~180k             | ~100k              | $2.04      |
| Phase 6: Smoke builds across 4 sites + monorepo type-check       | sonnet         | ~12k              | ~2k                | $0.06      |
| **Total**                                                        |                | **~638k**         | **~362k**          | **~$7.33** |

Rates: Opus $15/$75, Sonnet $3/$15, Haiku $0.80/$4 per MTok.

Estimation notes:

- Each parallel agent loads ~3k of brief context + reads 1-2 reference files (~2k) before writing a 200-400 line MDX file
- Content phases dominate cost because they run many parallel agents that each re-read reference files
- Orchestrator overhead factored into Phases 2 and 6
- Estimate is conservative (rounded up); actual could be 10-20% lower
- Budget ceiling recommendation: `--max-budget-usd 12` provides ~65% headroom

---

## Final Report

After all phases complete, output:

1. Phases completed — list each with commit SHA (including Phase 2a schema extension commit)
2. Build status — confirm all 4 sites built and monorepo `pnpm type-check` passed
3. Per-site file counts confirmation (10/8/5/4/6 for services/locations/blog/projects/testimonials)
4. Any exceptions or intentional deviations — e.g. Graphics/Print services correctly omitting `category`, enum extensions working as expected
5. Token usage and cost estimate:

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

After completing all phases, append to `output/sessions/2026-04-11_dcs-example-sites-build/yolo-brief.md`:

```markdown
## Completed

**Date:** 2026-04-11
**Status:** All phases executed successfully

[1-paragraph summary: what was implemented, any surprises. E.g. "Populated 4 underscore sites (_castor-plumbing, _cygnus-graphics, _lyra-garden, _nova-print) with full DCS example-site content: 40 services, 32 locations, 20 blog posts, 16 projects, 24 testimonials. Extended ProjectCategory enum with 4 new values (plumbing-install, plumbing-emergency, garden-design, garden-maintenance), widened _castor-plumbing business.type union to include 'Plumber' (schema.org-valid), and updated 8 categoryLabels maps to render the new enum values. Graphics and Print services correctly omit the optional `category` field since the installation/maintenance/repair semantics don't fit design/print work. All sites built and monorepo type-check clean. Rigel Events deferred to a separate session."]

### Commits

- [sha] — chore(dcs-sites): delete base-template placeholder MDX from 4 sites
- [sha] — feat(schema): extend ProjectCategory enum and widen business.type unions
- [sha] — feat(dcs-sites): replace site.config.ts for 4 DCS example sites
- [sha] — feat(dcs-sites): add 40 real service MDX files across 4 example sites
- [sha] — feat(dcs-sites): add 32 location MDX files across 4 example sites
- [sha] — feat(dcs-sites): add 20 blog posts + 16 projects + 24 testimonials
- [sha] — (optional) fix(dcs-sites): resolve content validation and build errors
```

Confirm this was done in the final report.

---

## Run Wrap-Up

After completing all phases and updating the session file, run:

```
/wrap-up-session
```

This writes `session-wrap-up.md` to `output/sessions/2026-04-11_dcs-example-sites-build/`. **This is a required final step — do not skip it.**

---

## Rules

- STOP on any failed verification gate — do not continue to next phase
- Read every file before editing it
- Never push — leave all changes on the feature branch
- **Consult the `## Parallel execution groups` section before launching any work.** Every item listed in a group MUST be launched in a single Task-tool message. Do not launch group items sequentially — that defeats the purpose of the block and doubles the wall-clock time.
- **Items NOT listed in any group run sequentially.** If the groups table has no row for a given work item, assume it is sequential.
- **Never parallelise across phase boundaries.** Verification gates are the synchronisation barrier between phases — respect them.
- **If the groups table and the phase prose disagree, the groups table wins.**
- Minimal changes only — implement what the plan says, nothing more. Do NOT add `theme.config.ts` overrides, public/ images, e2e tests, or anything outside the approved file set. **Approved file set:** (a) `sites/_{castor-plumbing,cygnus-graphics,lyra-garden,nova-print}/content/**`, (b) `sites/_{castor-plumbing,cygnus-graphics,lyra-garden,nova-print}/site.config.ts`, (c) `sites/_{castor-plumbing,cygnus-graphics,lyra-garden,nova-print}/app/projects/{page.tsx,[slug]/page.tsx}` (Phase 2a only — adding categoryLabels entries), (d) `packages/core-components/src/lib/content-schemas.ts` (Phase 2a only — extending ProjectCategory enum). Do NOT touch `_rigel-events` under any circumstances.
- **Do NOT rename the `_` prefix folders.** The `_` is intentional — the user explicitly chose to keep it. Renaming is a separate decision for a later session.
- Use `model: haiku` for Task agents doing mechanical work (Phase 1 deletes; Phase 2a.2 categoryLabels additions); `model: sonnet` for all content generation and the Phase 2a schema extension
- The Co-Authored-By line in commits must reflect the orchestrator model used (e.g., `Claude Sonnet 4.6`)
- **Pinned shared facts are immutable.** Do not invent alternative addresses, phone numbers, emails, or service areas mid-session. The Polegate address, 07395 063764 phone, and mail@digitalconsultingservices.co.uk email appear on EVERY site. If a field isn't specified above, it's allowed to be reasonable — but must stay consistent within the session.
- **Demo disclaimer is mandatory.** Every site must render the disclaimer in: (1) about.story final paragraph in site.config.ts, (2) service FAQ #1, (3) location description field (natural embedding), (4) blog excerpt trailing tag, (5) project body final line. Testimonials stay clean (customer voices).
- **DCS Graphics vs Mad Graphics positioning is non-negotiable.** DCS Graphics is a creative-agency studio (design + signage + print, consultative tone). Mad Graphics is a production print shop (vehicle graphics + banners, high-volume tone). If agents drift into production-shop copy for DCS Graphics, flag it.
- **Fictional does not mean sloppy.** Real town streets and districts only (listed in Phase 4). No invented landmarks. Customer names and project specifics can be invented but must stay plausible.
- **This brief does NOT need `--additionalDirectories`** — every write target is inside the primary repo (`sites/_*/` and `output/sessions/2026-04-11_dcs-example-sites-build/`).
