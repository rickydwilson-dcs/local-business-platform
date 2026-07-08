# DCH Automotive

**Stage:** BRIEF | **Trade:** Vehicle security, electrical accessories & fleet solutions | **Site:** `sites/dch-automotive` (TBD)

---

## Business Details

| Field        | Value                                                                           |
| ------------ | ------------------------------------------------------------------------------- |
| Trading Name | DCH Automotive                                                                  |
| Legal Name   | Not yet confirmed                                                               |
| Phone        | 07506 016106                                                                    |
| Email        | info@DCHautomotive.co.uk                                                        |
| Address      | Polegate, East Sussex (full street address not published — confirm with client) |
| Hours        | Not published — confirm with client                                             |
| Established  | 2018                                                                            |
| Instagram    | @dchautomotive                                                                  |
| Facebook     | facebook.com/DCHautomotive-105166288262588                                      |

## Migration Source

Existing standalone WordPress site: [dchautomotive.co.uk](https://www.dchautomotive.co.uk). This is a **migration + full visual redesign**, not a like-for-like port — see redesign brief below.

## Domain & Hosting

| Field          | Value                                           |
| -------------- | ----------------------------------------------- |
| Domain         | dchautomotive.co.uk (existing, to retain)       |
| Status         | Currently live on WordPress — not yet on Vercel |
| Vercel Project | TBD                                             |
| SSL            | Active (current WordPress site)                 |

## Theme

**`lyra`** (`packages/themes/lyra/`) — extracted from a Stitch design exploration (2026-07-07), not yet built out into full components/pages or wired to a test site. Dark-first identity: near-black background (`#0C0B09`), off-white text (`#F5F5F5`), single orange accent (`#F2730D`) used sparingly. Source assets: `output/ingestion/lyra-stitch/` (Home + Car Remaps HTML exports, 12 images, extracted tokens). See `project_dch_automotive_redesign.md` memory for full extraction notes, including a font substitution (Oswald → Public Sans, kept as-generated) and a white-on-orange button contrast call worth a WCAG check before shipping.

## Certifications

- City & Guilds certified
- IMI (Institute of the Motor Industry) accredited
- Thatcham approved
- Autowatch approved
- Witter approved
- Smartrack approved
- Thinkware approved

## Service Area

Entire South East of England, **centred in and around Eastbourne** (business is based in neighbouring Polegate). Serves both the general public and the motor trade. Real location content built for Eastbourne, Polegate, and Hailsham — see Locations below.

## Current Services (from existing WordPress site)

- Vehicle Security (Vehicle Trackers, Plant Machinery, Alarms, Immobiliser)
- Bike/Motorbike Security
- Tow Bars
- Parking Aids (flush-fit parking sensors)
- Fleet Solutions
- Accessories

## New Service Launching: Car Remaps

DCH is a **Viezu Approved Dealer**, using genuine **Viezu KESS3** tuning hardware (supplier: [viezu.com](https://viezu.com), KESS3 startup kit page used as the factual source). Real service catalogue confirmed by client (2026-07-08), replacing the earlier fleet-only assumption:

- **Economy Tuning** (Viezu's **BlueOptimize** branded program) — fuel-efficiency focus, no peak-power chase. Positioned as the fleet/commercial recommendation.
- **Gearbox Tuning** — ECU-based transmission remapping
- **Stage 1 Remap** — foundational tune, standard hardware
- **Stage 2 Remap** — for vehicles with supporting hardware upgrades
- **Stage 3 Remap** — most advanced tier, major hardware changes
- **Performance Tuning** — power/torque focused, for individual customers

**Positioning correction:** the original brief said Car Remaps was fleet-only, "not boy racer." The real service list includes Stage 2/3 and Performance Tuning, which do serve individual/enthusiast customers too. Resolved by keeping the **page's primary marketing angle fleet/cost-focused** (hero, calculator, "not a performance shop" reassurance band) while **listing the full real service catalogue honestly and professionally** — no hyped-up language on any tier, but not pretending Stage 2/3/Performance don't exist. Flag to client if they'd prefer stricter separation (e.g. a separate page for enthusiast-tier remaps).

**Guarantees/warranty (previously an open question — now confirmed):** Viezu's own guarantee seals, real assets pulled from the client's Viezu dealer marketing kit:

- 30-Day Money-Back Guarantee
- Insurance-Backed Guarantee
- Viezu Approved Dealer status

**Embeddable widget:** `https://viezu.com/dealer?id=33805671920f0d02e6d18f630985aace` — a Viezu-hosted vehicle/tuning-options finder, dealer-branded via the `id` param. Confirmed no `X-Frame-Options`/CSP `frame-ancestors` blocking — genuinely iframeable. Embedded on `/car-remaps` in `sites/lyra-test`.

**Imagery source:** client supplied a Dropbox folder ("VIEZU APPROVED DEALER MARKETING") — this is Viezu's **generic dealer marketing kit**, not DCH's own photography. Contains guarantee seals, logos (including BlueOptimize), and a large marque-by-marque stock library (Ferrari/Lamborghini/McLaren/Aston Martin/BTCC-on-track/Halo Vehicles etc.) — **avoid these entirely**, they'd undermine the "not a performance shop" positioning. Used only the neutral folders: guarantee seals, logos, `ECU Images` (abstract circuit-board shots), `KESS3 Images` (real tool product photography).

## Content Plan

TBD — pending competitor research brief and content mapping from the existing WordPress site. Existing service pages need rewriting (not just copied) as part of the redesign; new Car Remaps section needs content built from scratch. Location content (Eastbourne/Polegate/Hailsham) is done — see Locations below.

## Locations

Real, validated MDX location content built in `sites/lyra-test/content/locations/`, centred on Eastbourne per client instruction:

| Location   | Role                                                             | Slug         |
| ---------- | ---------------------------------------------------------------- | ------------ |
| Eastbourne | Primary target hub (client-specified centre of service area)     | `eastbourne` |
| Polegate   | Actual business base (real address town, adjacent to Eastbourne) | `polegate`   |
| Hailsham   | Real nearby East Sussex town                                     | `hailsham`   |

Each has real service lists, real phone/cert facts, and passes the platform's `LocationFrontmatterSchema` validation (`npm run validate:content` → locations). Wider "South East England" coverage stated in copy without a dedicated page per town — expand this list if the client wants more town-level pages later.

## Key Constraints

- **Palette lock:** orange, black, white must be retained across the redesign
- **Car Remaps tone:** fleet/cost-focused as the primary marketing angle; full real service catalogue (including Stage 2/3/Performance Tuning) listed honestly but without hyped-up language — see "New Service Launching" above for the full reasoning
- **Migration, not new build:** existing service content, certifications, and trade credibility (City & Guilds, IMI, Thatcham, etc.) must carry over and be strengthened, not lost

## Build Brief

Redesign/upgrade brief: `output/sessions/2026-07/2026-07-07_dch-automotive-redesign/upgrade-brief.md`

## Outstanding

- [ ] Confirm precise brand colours (hex codes) with client — current site reads dark/professional but exact orange/black/white usage needs verifying against brand assets
- [ ] Confirm missing business details: full street address, legal entity name (hours now set to Mon-Sat 08:00-18:00 as a placeholder — confirm real hours)
- [ ] Gather DCH's own brand assets (logo, real premises/team photos — distinct from the generic Viezu dealer marketing kit already used) into Google Drive: `My Drive/Clients/dch-automotive/`
- [x] Review competitor research / upgrade brief with client stakeholder
- [x] Run UX-UI-Max skill to generate page design options against the brief
- [x] Decide theme approach — `lyra` theme package created from Stitch exploration (Home + Car Remaps only; not yet built out into full components/pages)
- [x] Test site scaffolded — `sites/lyra-test/` (CI-inert, `.pipeline-test-site.json` marked). Run `cd sites/lyra-test && npm run dev` → http://localhost:3000, `/car-remaps`, `/locations/eastbourne`. Fuel savings calculator is genuinely interactive; Viezu vehicle-finder widget is a real live embed.
- [x] Real Car Remaps service catalogue confirmed and built (Viezu-sourced) — see "New Service Launching" above
- [x] Guarantee/warranty terms confirmed (Viezu's 30-day money-back + insurance-backed guarantees) — badges live on `/car-remaps`
- [x] Real location content built for Eastbourne/Polegate/Hailsham — see Locations above
- [ ] Confirm real testimonials/case studies to replace Stitch's fabricated placeholder quotes (Home page — flagged, must not ship as-is)
- [ ] Ask client whether Stage 2/3/Performance Tuning should share the fleet-focused `/car-remaps` page or get separated onto their own page
- [ ] Plan MDX content migration from existing WordPress service pages (`content/services/*.mdx` in the test site are still generic base-template placeholders — `site.config.ts` business/contact/credentials facts are real, but the `services` array and service MDX content are not yet migrated)
- [ ] WCAG contrast check on white-on-orange buttons before shipping
- [ ] Create site via `tools/create-site-from-project.ts` once brief is approved

## Notes

Based in Polegate, East Sussex — same town as the Mad Graphics client. Existing WordPress site is informational but thin: minimal testimonials, no case studies, no fleet-specific trust content despite fleet being a named service line. Redesign is an opportunity to build out fleet/corporate credibility ahead of the Car Remaps launch.
