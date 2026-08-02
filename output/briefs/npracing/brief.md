# Brief: NPRacing

**Date:** 2026-08-01
**Status:** Homepage design options (round 1) delivered — see
`output/sessions/2026-08/2026-08-01_npracing-homepage-options/`

## What this is

A simple brand-building website for NPRacing, a British Superbikes racing
team. Not a local-service business — no services or locations content types.
The platform's usual services/locations MDX model does not apply here.

## Assets available

- **Logo** (`images/logo.png`) — black background, red oval outline badge,
  bold italic "NP RACING" lockup (red "NP" / white "RACING") with a red
  motorbike-silhouette flourish, red "BRITISH SUPERBIKE TEAM" tagline
  underneath. Strong red/black/white palette, motorsport-stencil type style.
- **3 photos** (`images/`) — two on-track action shots of rider #51 on the
  team's white/red/black Honda Fireblade (visible "LOWE" sponsor branding),
  one paddock/grid team photo (crew in black team t-shirts, branded pit
  umbrella, orange KLS tyre warmers). Good material for hero/gallery use.
- **Instagram approved as an image source:**
  [instagram.com/npracingbsb](https://www.instagram.com/npracingbsb/) — client
  has given the go-ahead to pull whatever images are needed from this account
  for the site (gallery, hero, team, sponsors, news, etc.). Not treated as a
  design-source URL for the ingest pipeline — just a supplementary photo
  library alongside the 3 images already staged in `images/`.
- Simplified team brief in `content/brand.md` — base, manufacturer,
  championship, 2026 season (Brayden Elliott joined from Knockhill, June
  2026), reputation, and owner Neil Pearson / NP Motorcycles. Expected to be
  extended (fuller roster, season history) as more detail comes in.
- Images are staged locally in `images/` as a handoff point; long-term
  hosting is R2 per the [Images standard](../../../docs/standards/images.md).

## Design approach

Greenfield — no existing NPRacing website or social presence to use as a
design reference. A bespoke design system will be built from scratch using
the platform's UX skills once enough content/images are in this folder.

## Page scope

### Requested by client

- **Landing** — brand-building home page
- **Gallery** — photo/video showcase
- **Contact** — contact details + links out to social profiles

### Proposed upsell (client hasn't asked, but worth prototyping to pitch)

- **Races** — calendar/results

**Dropped:** Sponsors page/nav — no sponsor content to show yet, cut from
nav and homepage on 2026-08-01. Re-add once real sponsor logos/deals exist.

**Added:** News page — real BSB press coverage of the team/riders (not
client-authored content), built 2026-08-01.

### Merchandise

On-site Merchandise page with a card per product, each deep-linking to that
product's page on the external store — not on-site checkout. Store confirmed:
[The Clothing Kings](https://www.theclothingkings.co.uk/category/partnerships/npracing/)
(8 products live as of 2026-08-01: T-shirt, beanie, two cap styles, three
hoodie tiers, all-weather robe).

## Non-Goals

- No services or locations pages
- No on-site checkout/store (external link only)
- No site scaffolding yet — this phase is content intake + design mockups only

## Next Steps

- [x] Client drops team/brand text into `content/`
- [x] Client drops logo + images into `images/`
- [x] Get the external merchandise store URL — The Clothing Kings (confirmed 2026-08-01)
- [ ] Pull further images from Instagram (@npracingbsb) as needed during
      design/build — client has approved use of the account as an image source
- [ ] Get the team's Facebook profile URL — requested from client 2026-08-01,
      not yet received (needed for Facebook link + as an image source)
- [x] Round 1: 4 homepage design options built as static HTML mockups
      (`output/sessions/2026-08/2026-08-01_npracing-homepage-options/prototype/index.html`)
- [x] Ricky picked options 1 (Grid Box) and 3 (Number 51) to iterate on
- [x] Homepage iteration round 2: viewport-fit hero, bigger logo, gallery
      layout fix, sponsors removed, v3 team-section/creds-bar fixes (2026-08-01)
- [x] Merchandise, News and Contact pages built for v1 + v3
      (`merch-01-gridbox.html` / `merch-03-number51.html`,
      `news-01-gridbox.html` / `news-03-number51.html`,
      `contact-01-gridbox.html` / `contact-03-number51.html`) — all published
      as Claude Artifacts and cross-linked
- [ ] Wire the Contact page form to Resend once the site is scaffolded for real
      (currently a static mockup form; email npracingbsb@hotmail.com is live)
- [ ] Client/Ricky picks a final direction (or combination) between v1 and v3
- [ ] Once design is approved, scaffold the actual site under `sites/`
