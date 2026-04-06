# YOLO Implementation Brief: Mad Graphics — Full Pipeline Rebuild from Cygnus-Test

**Branch:** feature/mad-graphics-pipeline-rebuild (created from develop)
**Session spec:** output/sessions/2026-04-06_mad-graphics-pipeline-rebuild/yolo-brief.md
**Mode:** Autonomous execution — implement all phases, verify after each, STOP on error
**Orchestrator model:** sonnet

---

## Context

Mad Graphics pages don't match cygnus-test visually because they were hand-written rather than pipeline-generated. The fix is to re-run the site creation pipeline with `--force`, which nukes and rebuilds `sites/mad-graphics/` from base-template + cygnus-test page overrides. MDX content (services, locations) will be regenerated from scratch via the content generation tools. No existing content needs preserving.

The pipeline's `applyThemePageOverrides('cygnus')` copies 4 pages directly from `sites/cygnus-test/` (homepage, services, about, locations) + all stitch images. This is the correct way to get mad-graphics looking like cygnus-test.

The synthesis was reviewed and approved. Implement it exactly as specified below.

---

## Model Tiers

| Tier | Alias | Cost (in/out per MTok) | Use for |
|------|-------|----------------------|---------|
| Opus | `opus` | $15 / $75 | Phases with >5 interdependent files, architectural rewrites, judgment calls not covered by the spec |
| Sonnet | `sonnet` | $3 / $15 | Standard implementation — file edits, feature wiring, most phases |
| Haiku | `haiku` | $0.80 / $4 | Mechanical tasks: find-replace, import additions, grep checks, content validation |

Default orchestrator: **sonnet**. Default sub-agent: **sonnet** unless the task is clearly mechanical (→ haiku) or requires deep cross-file reasoning (→ opus).

---

## Pre-flight

```bash
git checkout develop && git pull
git checkout -b feature/mad-graphics-pipeline-rebuild

# Confirm pipeline tooling exists
ls tools/create-site-from-project.ts
ls tools/generate-services.ts
ls tools/generate-locations.ts

# Confirm cygnus-test reference site exists with stitch images
ls sites/cygnus-test/public/stitch-images/ | wc -l
# Must be > 0

pnpm type-check   # must be clean before starting
```

---

## Phase 1: Create mad-graphics.json Project File

**Goal:** Write `tools/projects/mad-graphics.json` — the project file that drives the pipeline. All data comes from `sites/mad-graphics/site.config.ts` (which survives the wipe because it's read before `--force` runs) and `sites/mad-graphics/CLAUDE.md`.

**Model:** sonnet

Read these files in parallel before writing:
- `tools/projects/dj-fox-electrical.json` (full — schema reference)
- `sites/mad-graphics/site.config.ts` (full — business data source)
- `sites/mad-graphics/CLAUDE.md` (constraints + service/location lists)

Write `tools/projects/mad-graphics.json` with:

```json
{
  "metadata": {
    "projectId": "mad-graphics-001",
    "version": "1.0.0",
    "status": "approved",
    "intakeChannel": "manual_entry",
    "createdAt": "2026-04-06T00:00:00Z",
    "updatedAt": "2026-04-06T00:00:00Z"
  },
  "business": {
    "name": "Mad Graphics",
    "legalName": "Mad Graphics",
    "industry": "print_graphics",
    "type": "sole_trader",
    "phone": "01323 589 700",
    "email": "office@madgraphics.co.uk",
    "website": "https://madgraphics.co.uk",
    "address": {
      "line1": "Unit H2, Chaucer Business Park, Dittons Road",
      "city": "Polegate",
      "county": "East Sussex",
      "postcode": "BN26",
      "country": "United Kingdom"
    },
    "hours": {
      "regular": [
        { "day": "monday", "opens": "08:00", "closes": "17:30" },
        { "day": "tuesday", "opens": "08:00", "closes": "17:30" },
        { "day": "wednesday", "opens": "08:00", "closes": "17:30" },
        { "day": "thursday", "opens": "08:00", "closes": "17:30" },
        { "day": "friday", "opens": "08:00", "closes": "17:30" },
        { "day": "saturday", "status": "by_appointment" },
        { "day": "sunday", "status": "closed" }
      ],
      "emergency24h": false
    },
    "socialMedia": {
      "instagram": "https://instagram.com/mad_graphicssussex"
    },
    "geo": {
      "headquarters": { "latitude": 50.8161, "longitude": 0.2372 },
      "serviceRadiusMiles": 30
    }
  },
  "credentials": {
    "yearEstablished": 2004,
    "certifications": [
      { "name": "Est. 2004", "issuedBy": "Mad Graphics", "description": "Over 20 years of vehicle graphics and signage in East Sussex" },
      { "name": "In-House Design", "issuedBy": "Mad Graphics", "description": "Full artwork and pre-press service" }
    ],
    "teamQualifications": "20+ years specialist experience in vehicle graphics, signage, and wide-format print",
    "memberships": []
  },
  "services": [
    {
      "slug": "vehicle-graphics",
      "title": "Vehicle Graphics",
      "category": "core",
      "shortDescription": "Van lettering, car graphics, fleet branding and magnetic signs for East Sussex businesses.",
      "keyFeatures": ["Fleet branding", "Van lettering", "Magnetic signs", "Car graphics", "In-house design"],
      "relatedServices": ["signs-signage", "graphic-design"],
      "includeInGeneration": true
    },
    {
      "slug": "signs-signage",
      "title": "Signs & Signage",
      "category": "core",
      "shortDescription": "Shop signs, site boards, A-boards, hoardings and window graphics across East Sussex.",
      "keyFeatures": ["Shop signs", "Site boards", "A-boards", "Window graphics", "Hoardings"],
      "relatedServices": ["vehicle-graphics", "large-format-print"],
      "includeInGeneration": true
    },
    {
      "slug": "banners",
      "title": "Banners",
      "category": "core",
      "shortDescription": "PVC, roller, mesh, fabric banners and flags for events, promotions and businesses.",
      "keyFeatures": ["PVC banners", "Roller banners", "Mesh banners", "Fabric banners", "Flags"],
      "relatedServices": ["large-format-print", "marketing-print"],
      "includeInGeneration": true
    },
    {
      "slug": "large-format-print",
      "title": "Large Format Print",
      "category": "core",
      "shortDescription": "Posters, canvas prints, exhibition displays, foam board and Correx boards.",
      "keyFeatures": ["Posters", "Canvas prints", "Exhibition displays", "Foam board", "Correx boards"],
      "relatedServices": ["banners", "signs-signage"],
      "includeInGeneration": true
    },
    {
      "slug": "marketing-print",
      "title": "Marketing Print",
      "category": "core",
      "shortDescription": "Flyers, brochures, business cards and letterheads for East Sussex businesses.",
      "keyFeatures": ["Flyers", "Brochures", "Business cards", "Letterheads", "Leaflets"],
      "relatedServices": ["graphic-design", "stickers-labels"],
      "includeInGeneration": true
    },
    {
      "slug": "stickers-labels",
      "title": "Stickers & Wall Graphics",
      "category": "specialist",
      "shortDescription": "Custom stickers, wall graphics, floor graphics and window decals.",
      "keyFeatures": ["Custom stickers", "Wall graphics", "Floor graphics", "Window decals", "Cut vinyl"],
      "relatedServices": ["vehicle-graphics", "signs-signage"],
      "includeInGeneration": true
    },
    {
      "slug": "workwear-merchandise",
      "title": "Workwear & Merchandise",
      "category": "specialist",
      "shortDescription": "Printed and embroidered workwear, hi-vis clothing and branded merchandise.",
      "keyFeatures": ["Embroidered workwear", "Printed hi-vis", "Branded merchandise", "Polo shirts", "Jackets"],
      "relatedServices": ["graphic-design", "marketing-print"],
      "includeInGeneration": true
    },
    {
      "slug": "graphic-design",
      "title": "Graphic Design",
      "category": "specialist",
      "shortDescription": "Logo design, brand identity and print-ready artwork for East Sussex businesses.",
      "keyFeatures": ["Logo design", "Brand identity", "Print-ready artwork", "Vehicle livery design", "Signage artwork"],
      "relatedServices": ["vehicle-graphics", "signs-signage"],
      "includeInGeneration": true
    },
    { "slug": "van-graphics", "title": "Van Graphics", "category": "core", "shortDescription": "Custom van graphics and lettering for tradespeople and businesses across East Sussex.", "keyFeatures": ["Van lettering", "Full side graphics", "Cut vinyl", "Digital print", "In-house design"], "relatedServices": ["vehicle-graphics", "magnetic-signs"], "includeInGeneration": true },
    { "slug": "fleet-graphics", "title": "Fleet Graphics", "category": "core", "shortDescription": "Consistent fleet branding for vans and vehicles across East Sussex.", "keyFeatures": ["Fleet livery", "Consistent branding", "Multiple vehicles", "Design included", "Fast turnaround"], "relatedServices": ["vehicle-graphics", "van-graphics"], "includeInGeneration": true },
    { "slug": "car-graphics", "title": "Car Graphics", "category": "core", "shortDescription": "Branded car graphics and decals for businesses and individuals in East Sussex.", "keyFeatures": ["Car decals", "Bonnet graphics", "Roof graphics", "Cut vinyl", "Digital print"], "relatedServices": ["vehicle-graphics", "van-graphics"], "includeInGeneration": true },
    { "slug": "vehicle-livery", "title": "Vehicle Livery", "category": "core", "shortDescription": "Professional vehicle livery design and application across East Sussex.", "keyFeatures": ["Full livery design", "Partial livery", "Fleet consistency", "Design service", "Application included"], "relatedServices": ["vehicle-graphics", "fleet-graphics"], "includeInGeneration": true },
    { "slug": "magnetic-signs", "title": "Magnetic Signs", "category": "core", "shortDescription": "Removable magnetic vehicle signs for vans and cars in East Sussex.", "keyFeatures": ["Removable", "Reusable", "Custom sizes", "Full colour print", "Quick fit"], "relatedServices": ["vehicle-graphics", "van-graphics"], "includeInGeneration": true },
    { "slug": "shop-signs", "title": "Shop Signs", "category": "core", "shortDescription": "Fascia signs, projecting signs and shop-front graphics for East Sussex businesses.", "keyFeatures": ["Fascia signs", "Projecting signs", "Illuminated options", "Shop front graphics", "Design included"], "relatedServices": ["signs-signage", "window-graphics"], "includeInGeneration": true },
    { "slug": "site-boards", "title": "Site Boards", "category": "core", "shortDescription": "Construction site boards, hoarding graphics and project signage across East Sussex.", "keyFeatures": ["Site boards", "Hoarding graphics", "Project branding", "Weather resistant", "Large format"], "relatedServices": ["signs-signage", "hoarding-graphics"], "includeInGeneration": true },
    { "slug": "a-boards", "title": "A-Boards", "category": "core", "shortDescription": "Pavement A-boards and forecourt signs for shops and businesses in East Sussex.", "keyFeatures": ["Pavement signs", "Forecourt boards", "Snap frames", "Printed inserts", "Durable frames"], "relatedServices": ["signs-signage", "shop-signs"], "includeInGeneration": true },
    { "slug": "safety-signs", "title": "Safety Signs", "category": "core", "shortDescription": "Health and safety signage, fire exit signs and warning signs for East Sussex businesses.", "keyFeatures": ["Health and safety", "Fire exit signs", "Warning signs", "Compliant", "Custom wording"], "relatedServices": ["signs-signage", "site-boards"], "includeInGeneration": true },
    { "slug": "directional-signs", "title": "Directional Signs", "category": "core", "shortDescription": "Wayfinding and directional signage for buildings and sites across East Sussex.", "keyFeatures": ["Wayfinding", "Interior signs", "Exterior signs", "Branded design", "Custom sizes"], "relatedServices": ["signs-signage", "shop-signs"], "includeInGeneration": true },
    { "slug": "hoarding-graphics", "title": "Hoarding Graphics", "category": "specialist", "shortDescription": "Large-scale hoarding graphics and construction site branding in East Sussex.", "keyFeatures": ["Large format", "Full colour", "Weather resistant", "Site branding", "Fast install"], "relatedServices": ["signs-signage", "site-boards"], "includeInGeneration": true },
    { "slug": "window-graphics", "title": "Window Graphics", "category": "core", "shortDescription": "Frosted, printed and cut-vinyl window graphics for shops and offices in East Sussex.", "keyFeatures": ["Frosted vinyl", "Printed graphics", "Privacy film", "Branding", "Cut vinyl"], "relatedServices": ["signs-signage", "shop-signs"], "includeInGeneration": true },
    { "slug": "window-stickers", "title": "Window Stickers", "category": "core", "shortDescription": "Custom window stickers and decals for retail and commercial premises in East Sussex.", "keyFeatures": ["Static cling", "Adhesive vinyl", "Full colour", "Custom shapes", "Removable options"], "relatedServices": ["window-graphics", "stickers-labels"], "includeInGeneration": true },
    { "slug": "pvc-banners", "title": "PVC Banners", "category": "core", "shortDescription": "Heavy-duty PVC banners for outdoor events and advertising across East Sussex.", "keyFeatures": ["Weatherproof", "Eyelets included", "Full colour", "Custom sizes", "Fast turnaround"], "relatedServices": ["banners", "mesh-banners"], "includeInGeneration": true },
    { "slug": "roller-banners", "title": "Roller Banners", "category": "core", "shortDescription": "Pull-up roller banners and pop-up displays for exhibitions and events.", "keyFeatures": ["Pull-up stand", "Portable", "Full colour print", "Design service", "Carry case"], "relatedServices": ["banners", "exhibition-prints"], "includeInGeneration": true },
    { "slug": "mesh-banners", "title": "Mesh Banners", "category": "specialist", "shortDescription": "Wind-resistant mesh banners for scaffolding and outdoor sites in East Sussex.", "keyFeatures": ["Wind resistant", "Scaffolding banners", "Perforated mesh", "Lightweight", "Large format"], "relatedServices": ["banners", "site-boards"], "includeInGeneration": true },
    { "slug": "fabric-banners", "title": "Fabric Banners", "category": "specialist", "shortDescription": "Premium fabric banners and flags for events and indoor displays.", "keyFeatures": ["Premium finish", "Lightweight", "Indoor use", "Exhibition quality", "Full colour"], "relatedServices": ["banners", "roller-banners"], "includeInGeneration": true },
    { "slug": "poster-printing", "title": "Poster Printing", "category": "core", "shortDescription": "A0, A1, A2 and custom-size poster printing for East Sussex businesses.", "keyFeatures": ["A0 to A4", "Gloss or matt", "Same-day options", "Full colour", "Design service"], "relatedServices": ["large-format-print", "canvas-prints"], "includeInGeneration": true },
    { "slug": "canvas-prints", "title": "Canvas Prints", "category": "specialist", "shortDescription": "Custom canvas prints for offices, hospitality and retail spaces in East Sussex.", "keyFeatures": ["Stretched canvas", "Custom sizes", "Gallery wrap", "Full colour", "Wall ready"], "relatedServices": ["large-format-print", "poster-printing"], "includeInGeneration": true },
    { "slug": "foam-board-correx", "title": "Foam Board & Correx", "category": "core", "shortDescription": "Lightweight foam board and Correx boards for displays and site signs.", "keyFeatures": ["Foam board", "Correx boards", "Lightweight", "Full colour", "Custom sizes"], "relatedServices": ["large-format-print", "site-boards"], "includeInGeneration": true },
    { "slug": "exhibition-prints", "title": "Exhibition Prints", "category": "specialist", "shortDescription": "Exhibition display prints and pop-up systems for trade shows and events.", "keyFeatures": ["Exhibition quality", "Pop-up systems", "Banner stands", "Full colour", "Portable"], "relatedServices": ["large-format-print", "roller-banners"], "includeInGeneration": true },
    { "slug": "large-format", "title": "Large Format Printing", "category": "core", "shortDescription": "Wide-format printing for any size requirement across East Sussex businesses.", "keyFeatures": ["Any size", "Indoor and outdoor", "Fast turnaround", "Full colour", "Multiple substrates"], "relatedServices": ["large-format-print", "poster-printing"], "includeInGeneration": true },
    { "slug": "flyers-leaflets", "title": "Flyers & Leaflets", "category": "core", "shortDescription": "Full-colour flyers and leaflets for marketing campaigns in East Sussex.", "keyFeatures": ["A5 and A6", "Gloss or silk", "Double sided", "Design service", "Fast print"], "relatedServices": ["marketing-print", "brochures"], "includeInGeneration": true },
    { "slug": "brochures", "title": "Brochures", "category": "core", "shortDescription": "Professionally printed brochures and booklets for East Sussex businesses.", "keyFeatures": ["Saddle stitched", "Perfect bound", "Custom sizes", "Design service", "Full colour"], "relatedServices": ["marketing-print", "flyers-leaflets"], "includeInGeneration": true },
    { "slug": "business-cards", "title": "Business Cards", "category": "core", "shortDescription": "Premium business card printing for professionals and businesses in East Sussex.", "keyFeatures": ["400gsm card", "Gloss or matt", "Standard and custom sizes", "Design service", "Fast turnaround"], "relatedServices": ["marketing-print", "letterheads"], "includeInGeneration": true },
    { "slug": "letterheads", "title": "Letterheads", "category": "core", "shortDescription": "Branded letterheads and stationery for East Sussex businesses.", "keyFeatures": ["A4 letterheads", "Compliment slips", "Branded design", "Full colour", "Premium paper"], "relatedServices": ["marketing-print", "business-cards"], "includeInGeneration": true },
    { "slug": "folders", "title": "Presentation Folders", "category": "specialist", "shortDescription": "Custom printed presentation folders and document wallets for East Sussex businesses.", "keyFeatures": ["A4 folders", "Pocket inserts", "Custom print", "Gloss laminate", "Design service"], "relatedServices": ["marketing-print", "brochures"], "includeInGeneration": true },
    { "slug": "menus", "title": "Menu Printing", "category": "specialist", "shortDescription": "Restaurant and cafe menus, boards and printed materials for East Sussex hospitality.", "keyFeatures": ["Laminated menus", "Board menus", "Custom sizes", "Design service", "Fast reprint"], "relatedServices": ["marketing-print", "large-format-print"], "includeInGeneration": true },
    { "slug": "custom-stickers", "title": "Custom Stickers", "category": "core", "shortDescription": "Custom-shaped and printed stickers for branding and packaging in East Sussex.", "keyFeatures": ["Die cut shapes", "Sheet stickers", "Roll stickers", "Waterproof options", "Full colour"], "relatedServices": ["stickers-labels", "labels"], "includeInGeneration": true },
    { "slug": "labels", "title": "Labels", "category": "core", "shortDescription": "Printed labels for products, packaging and assets across East Sussex businesses.", "keyFeatures": ["Product labels", "Asset labels", "Roll labels", "Waterproof", "Custom sizes"], "relatedServices": ["stickers-labels", "custom-stickers"], "includeInGeneration": true },
    { "slug": "wall-graphics", "title": "Wall Graphics", "category": "specialist", "shortDescription": "Large-format wall graphics and murals for offices and retail spaces in East Sussex.", "keyFeatures": ["Full wall coverage", "Cut vinyl", "Printed graphics", "Office branding", "Removable options"], "relatedServices": ["stickers-labels", "window-graphics"], "includeInGeneration": true },
    { "slug": "floor-graphics", "title": "Floor Graphics", "category": "specialist", "shortDescription": "Non-slip floor graphics and vinyl for retail, events and wayfinding.", "keyFeatures": ["Non-slip laminate", "Anti-slip", "Full colour", "Custom shapes", "Indoor and outdoor"], "relatedServices": ["stickers-labels", "wall-graphics"], "includeInGeneration": true },
    { "slug": "printed-workwear", "title": "Printed Workwear", "category": "core", "shortDescription": "Screen printed and heat transfer workwear for East Sussex trade and business.", "keyFeatures": ["Screen print", "Heat transfer", "Hi-vis", "T-shirts", "Hoodies"], "relatedServices": ["workwear-merchandise", "embroidered-uniforms"], "includeInGeneration": true },
    { "slug": "embroidered-uniforms", "title": "Embroidered Uniforms", "category": "core", "shortDescription": "Embroidered polo shirts, jackets and uniforms for East Sussex businesses.", "keyFeatures": ["Embroidery", "Polo shirts", "Fleece jackets", "Caps", "Workwear"], "relatedServices": ["workwear-merchandise", "printed-workwear"], "includeInGeneration": true },
    { "slug": "hi-vis", "title": "Hi-Vis Clothing", "category": "core", "shortDescription": "Branded hi-vis vests, jackets and workwear for construction and trade in East Sussex.", "keyFeatures": ["Hi-vis vests", "EN ISO 20471", "Printed or embroidered", "Custom branding", "Bulk orders"], "relatedServices": ["workwear-merchandise", "printed-workwear"], "includeInGeneration": true },
    { "slug": "merchandise", "title": "Branded Merchandise", "category": "specialist", "shortDescription": "Promotional merchandise and branded gifts for East Sussex businesses.", "keyFeatures": ["Promotional items", "Branded gifts", "Mugs", "Pens", "Tote bags"], "relatedServices": ["workwear-merchandise", "printed-workwear"], "includeInGeneration": true },
    { "slug": "personalised-gifts", "title": "Personalised Gifts", "category": "specialist", "shortDescription": "Custom personalised gifts and keepsakes printed in East Sussex.", "keyFeatures": ["Photo gifts", "Custom print", "Corporate gifts", "Awards", "Keepsakes"], "relatedServices": ["workwear-merchandise", "merchandise"], "includeInGeneration": true },
    { "slug": "logo-design", "title": "Logo Design", "category": "core", "shortDescription": "Professional logo design and brand identity creation for East Sussex businesses.", "keyFeatures": ["Logo concepts", "Vector formats", "Brand guidelines", "Revisions included", "Print ready"], "relatedServices": ["graphic-design", "brand-identity"], "includeInGeneration": true },
    { "slug": "brand-identity", "title": "Brand Identity", "category": "specialist", "shortDescription": "Full brand identity packages including logo, colours, typography and assets.", "keyFeatures": ["Brand strategy", "Logo design", "Colour palette", "Typography", "Brand guidelines"], "relatedServices": ["graphic-design", "logo-design"], "includeInGeneration": true },
    { "slug": "print-design", "title": "Print Design", "category": "core", "shortDescription": "Print-ready artwork and layout design for all print products in East Sussex.", "keyFeatures": ["Print-ready files", "CMYK colour", "Bleed and crop marks", "Multiple formats", "Revisions included"], "relatedServices": ["graphic-design", "marketing-print"], "includeInGeneration": true },
    { "slug": "artwork-prepress", "title": "Artwork & Pre-Press", "category": "specialist", "shortDescription": "Artwork preparation, file checking and pre-press services for all print jobs.", "keyFeatures": ["File checking", "Colour correction", "Print optimisation", "Format conversion", "Proofing"], "relatedServices": ["graphic-design", "print-design"], "includeInGeneration": true }
  ],
  "regions": [
    {
      "name": "East Sussex",
      "slug": "east-sussex",
      "locations": [
        { "name": "Eastbourne", "slug": "eastbourne", "type": "urban", "localAuthority": "Eastbourne Borough Council", "includeInGeneration": true },
        { "name": "Hastings", "slug": "hastings", "type": "coastal", "localAuthority": "Hastings Borough Council", "includeInGeneration": true },
        { "name": "Lewes", "slug": "lewes", "type": "historic", "localAuthority": "Lewes District Council", "includeInGeneration": true },
        { "name": "Bexhill-on-Sea", "slug": "bexhill-on-sea", "type": "coastal", "localAuthority": "Rother District Council", "includeInGeneration": true },
        { "name": "Uckfield", "slug": "uckfield", "type": "rural", "localAuthority": "Wealden District Council", "includeInGeneration": true },
        { "name": "Crowborough", "slug": "crowborough", "type": "rural", "localAuthority": "Wealden District Council", "includeInGeneration": true },
        { "name": "Seaford", "slug": "seaford", "type": "coastal", "localAuthority": "Lewes District Council", "includeInGeneration": true },
        { "name": "Hailsham", "slug": "hailsham", "type": "rural", "localAuthority": "Wealden District Council", "includeInGeneration": true },
        { "name": "Newhaven", "slug": "newhaven", "type": "coastal", "localAuthority": "Lewes District Council", "includeInGeneration": true },
        { "name": "Polegate", "slug": "polegate", "type": "suburban", "localAuthority": "Wealden District Council", "includeInGeneration": true },
        { "name": "Peacehaven", "slug": "peacehaven", "type": "coastal", "localAuthority": "Lewes District Council", "includeInGeneration": true },
        { "name": "Battle", "slug": "battle", "type": "historic", "localAuthority": "Rother District Council", "includeInGeneration": true },
        { "name": "St Leonards-on-Sea", "slug": "st-leonards-on-sea", "type": "coastal", "localAuthority": "Hastings Borough Council", "includeInGeneration": true },
        { "name": "Heathfield", "slug": "heathfield", "type": "rural", "localAuthority": "Wealden District Council", "includeInGeneration": true },
        { "name": "Pevensey", "slug": "pevensey", "type": "historic", "localAuthority": "Wealden District Council", "includeInGeneration": true },
        { "name": "Ringmer", "slug": "ringmer", "type": "rural", "localAuthority": "Lewes District Council", "includeInGeneration": true },
        { "name": "Herstmonceux", "slug": "herstmonceux", "type": "rural", "localAuthority": "Wealden District Council", "includeInGeneration": true },
        { "name": "Wadhurst", "slug": "wadhurst", "type": "rural", "localAuthority": "Wealden District Council", "includeInGeneration": true },
        { "name": "Alfriston", "slug": "alfriston", "type": "historic", "localAuthority": "Lewes District Council", "includeInGeneration": true }
      ]
    }
  ],
  "brandVoice": {
    "tone": "Specialist, honest, local, professional — no-nonsense East Sussex trade voice",
    "preferredTerms": ["specialist", "graphics", "signwriting", "local", "East Sussex", "vehicle graphics", "livery"],
    "avoidWords": ["full wraps", "vehicle wraps", "full vehicle wrapping", "vinyl wrapping", "colour change wraps", "Brighton", "Hove", "Portslade"],
    "targetAudience": "East Sussex businesses — tradespeople, fleet operators, retailers, startups needing branding",
    "usps": [
      "Est. 2004 — 20+ years specialist experience",
      "Specialist focus — no full vehicle wraps",
      "In-house design and artwork",
      "Same-day quotes",
      "Local East Sussex knowledge"
    ],
    "tagline": "Vehicle graphics, signs, banners & print — East Sussex"
  },
  "theme": {
    "themeVariant": "cygnus",
    "colors": {
      "brand": {
        "primary": "#F47B20",
        "primaryHover": "#C96210",
        "secondary": "#7AC143",
        "accent": "#dec498",
        "onPrimary": "#2d1600"
      },
      "surface": {
        "background": "#131313",
        "foreground": "#e5e2e1",
        "muted": "#1c1b1b",
        "card": "#1c1b1b"
      }
    },
    "typography": {
      "fontFamily": "Work Sans",
      "headingFontFamily": "Newsreader",
      "baseFontSize": 16
    },
    "components": {
      "buttonRadius": "0.375rem",
      "cardRadius": "0.5rem",
      "useShadows": true
    }
  },
  "deployment": {
    "siteName": "mad-graphics",
    "domain": "madgraphics.co.uk",
    "features": {
      "contactForm": true,
      "quoteForm": true,
      "blog": true,
      "reviews": true,
      "liveChat": false,
      "booking": false,
      "gallery": true
    }
  }
}
```

**IMPORTANT:** Before writing the JSON, read `dj-fox-electrical.json` fully and match its exact top-level key structure. If the schema differs from the template above, adapt to match the actual schema — the template above is a guide, not guaranteed to be schema-valid.

```bash
# Verification gate — STOP if this fails
npx tsx tools/create-site-from-project.ts \
  --project tools/projects/mad-graphics.json \
  --dry-run
# Must complete without schema validation errors
# Must log: "[theme:cygnus] Copied app/page.tsx from cygnus-test"
```

**Commit:**
```bash
git add tools/projects/mad-graphics.json
git commit -m "$(cat <<'EOF'
feat(mad-graphics): add project JSON for pipeline rebuild

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>
EOF
)"
```

---

## Phase 2: Run Pipeline --force

**Goal:** Nuke and rebuild `sites/mad-graphics/` from base-template + cygnus-test page overrides.

**Model:** haiku — single command execution

```bash
npx tsx tools/create-site-from-project.ts \
  --project tools/projects/mad-graphics.json \
  --force \
  --skip-content
```

```bash
# Verification gate — STOP if this fails

# Pages copied from cygnus-test
ls sites/mad-graphics/app/page.tsx
ls sites/mad-graphics/app/services/page.tsx
ls sites/mad-graphics/app/about/page.tsx
ls sites/mad-graphics/app/locations/page.tsx

# Stitch images present
ls sites/mad-graphics/public/stitch-images/ | wc -l
# Must be > 0

# Mad Graphics brand colors in theme.config.ts
grep "F47B20" sites/mad-graphics/theme.config.ts
grep "cygnusRegistry" sites/mad-graphics/theme.config.ts

# Real business data in site.config.ts
grep "01323 589 700" sites/mad-graphics/site.config.ts
grep "Mad Graphics" sites/mad-graphics/site.config.ts

cd sites/mad-graphics && npm run type-check
```

**Commit:**
```bash
git add sites/mad-graphics/
git commit -m "$(cat <<'EOF'
feat(mad-graphics): rebuild site via pipeline from cygnus-test reference

Pages now copied directly from cygnus-test. Stitch images included.
site.config.ts and theme.config.ts generated from mad-graphics.json.

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>
EOF
)"
```

---

## Phase 3: Fix CSP for Google Fonts + Material Symbols

**Goal:** The CSP in `next.config.ts` blocks `fonts.googleapis.com` and `fonts.gstatic.com`, causing Newsreader, Work Sans, and Material Symbols to fail on Vercel. Fix in both mad-graphics AND base-template so future pipeline runs inherit the fix.

**Model:** haiku — string replacement in 2 files

Read both files before editing:
- `sites/mad-graphics/next.config.ts`
- `sites/base-template/next.config.ts`

In each file, find the CSP string and update:
- `style-src 'self' 'unsafe-inline'` → `style-src 'self' 'unsafe-inline' https://fonts.googleapis.com`
- `font-src 'self'` → `font-src 'self' https://fonts.gstatic.com`

```bash
# Verification gate — STOP if this fails
grep "fonts.googleapis.com" sites/mad-graphics/next.config.ts
grep "fonts.gstatic.com" sites/mad-graphics/next.config.ts
grep "fonts.googleapis.com" sites/base-template/next.config.ts
grep "fonts.gstatic.com" sites/base-template/next.config.ts
```

**Commit:**
```bash
git add sites/mad-graphics/next.config.ts sites/base-template/next.config.ts
git commit -m "$(cat <<'EOF'
fix(csp): allow Google Fonts and Material Symbols on Vercel

Adds fonts.googleapis.com to style-src and fonts.gstatic.com to font-src.
Applied to both mad-graphics and base-template so future pipeline runs inherit the fix.

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>
EOF
)"
```

---

## Phase 4: Generate MDX Content

**Goal:** Regenerate all service and location pages for Mad Graphics using the AI content generators.

**Model:** sonnet (orchestration only — generators are external processes)

First check that the generators work and what flags they require:
```bash
npx tsx tools/generate-services.ts --help 2>&1 | head -20
npx tsx tools/generate-locations.ts --help 2>&1 | head -20
```

Then run:
```bash
# Generate all 8 service hubs + sub-service leaf pages
npx tsx tools/generate-services.ts \
  --site mad-graphics \
  --context tools/projects/mad-graphics.json \
  --force

# Generate all 19 location pages
npx tsx tools/generate-locations.ts \
  --site mad-graphics \
  --context tools/projects/mad-graphics.json \
  --force
```

If the generators require a different flag format (e.g. `--project` instead of `--context`), adapt accordingly — read the help output first.

If generators require an API key and it's not set, STOP and report which env var is needed. Do NOT skip content generation silently.

```bash
# Verification gate — STOP if this fails
ls sites/mad-graphics/content/services/ | wc -l
# Must be 49 (8 hub pages + 41 sub-service leaf pages)

ls sites/mad-graphics/content/locations/ | wc -l
# Must be 19

# Hard constraints — no vehicle wraps, no out-of-area locations
grep -ri "full wrap\|vehicle wrap\|vinyl wrap\|colour change" sites/mad-graphics/content/
# 0 results

grep -ri "Brighton\|Hove\|Portslade\|Rottingdean\|Saltdean" sites/mad-graphics/content/
# 0 results

cd sites/mad-graphics && npm run validate:content
# Must pass
```

**Commit:**
```bash
git add sites/mad-graphics/content/
git commit -m "$(cat <<'EOF'
feat(mad-graphics): regenerate service and location MDX content

8 service hubs + sub-service pages and 19 East Sussex location pages
generated fresh from mad-graphics.json project file.

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>
EOF
)"
```

---

## Phase 5: Final Build Verification

**Goal:** Confirm the rebuilt site builds cleanly and is ready to deploy.

**Model:** haiku — verification only

```bash
cd sites/mad-graphics

npm run type-check
# 0 errors

npm run validate:content
# All MDX files pass

npm run build
# Build succeeds

# Check key routes were statically generated
ls .next/server/app/ | grep -E "services|locations|about|projects"
```

Also run monorepo checks:
```bash
cd ../..
pnpm type-check
pnpm lint
# Both pass (warnings OK, errors not OK)
```

**Commit:**
```bash
git add -A
git commit -m "$(cat <<'EOF'
chore(mad-graphics): final verification — pipeline rebuild complete

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>
EOF
)" --allow-empty
```

---

## Cost Estimate

| Phase | Model | Est. input tokens | Est. output tokens | Est. cost |
|-------|-------|------------------|--------------------|-----------|
| Phase 1: Write project JSON | sonnet | ~15k | ~3k | $0.09 |
| Phase 2: Run pipeline | haiku | ~5k | ~0.5k | $0.005 |
| Phase 3: Fix CSP (2 files) | haiku | ~8k | ~0.5k | $0.007 |
| Phase 4: Generate MDX | sonnet | ~20k | ~5k | $0.14 |
| Phase 5: Final verification | haiku | ~8k | ~0.5k | $0.006 |
| **Total** | | **~56k** | **~9.5k** | **~$0.25** |

Rates: Opus $15/$75, Sonnet $3/$15, Haiku $0.80/$4 per MTok.
Note: Content generation tools (Phase 4) may incur additional LLM costs via Claude API — separate from orchestrator cost.

---

## Final Report

After all phases complete, output:
1. Phases completed — list each with commit SHA
2. Build status — confirm `pnpm type-check && cd sites/mad-graphics && npm run build` passes
3. Service count and location count generated
4. Any exceptions or deviations (especially if content generators needed different flags or were skipped)
5. Token usage and cost estimate

---

## Update Session File

After completing all phases, append to `output/sessions/2026-04-06_mad-graphics-pipeline-rebuild/yolo-brief.md`:

```markdown
## Completed

**Date:** [today]
**Status:** All phases executed successfully

[1-paragraph summary]

### Commits
[list each commit SHA and message]
```

---

## Rules

- STOP on any failed verification gate — do not continue to next phase
- Read every file before editing it
- Never push — leave all changes on the feature branch
- Minimal changes only — implement what the plan says, nothing more
- If content generators fail due to missing API keys, STOP and report — do not skip
- `style={{ fontVariationSettings: ... }}` on Material Symbols is acceptable — not a color value
- The Co-Authored-By line must say `Claude Sonnet 4.6`
