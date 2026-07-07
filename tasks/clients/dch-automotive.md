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

Entire South East of England. Serves both the general public and the motor trade.

## Current Services (from existing WordPress site)

- Vehicle Security (Vehicle Trackers, Plant Machinery, Alarms, Immobiliser)
- Bike/Motorbike Security
- Tow Bars
- Parking Aids (flush-fit parking sensors)
- Fleet Solutions
- Accessories

## New Service Launching

**Car Remaps** — ECU remapping focused on **fuel efficiency and/or extra power for corporate fleet customers**. Positioning must stay professional/corporate — explicitly **not** a performance-tuning "boy racer" angle. This is a natural upsell to the existing fleet solutions customer base.

## Content Plan

TBD — pending competitor research brief and content mapping from the existing WordPress site. Existing service pages need rewriting (not just copied) as part of the redesign; new Car Remaps section needs content built from scratch.

## Key Constraints

- **Palette lock:** orange, black, white must be retained across the redesign
- **Car Remaps tone:** corporate fleet fuel efficiency/power — never performance/boy-racer marketing language
- **Migration, not new build:** existing service content, certifications, and trade credibility (City & Guilds, IMI, Thatcham, etc.) must carry over and be strengthened, not lost

## Build Brief

Redesign/upgrade brief: `output/sessions/2026-07/2026-07-07_dch-automotive-redesign/upgrade-brief.md`

## Outstanding

- [ ] Confirm precise brand colours (hex codes) with client — current site reads dark/professional but exact orange/black/white usage needs verifying against brand assets
- [ ] Confirm missing business details: opening hours, full street address, legal entity name
- [ ] Gather brand assets (logo, photos, any brand guidelines) into Google Drive: `My Drive/Clients/dch-automotive/`
- [x] Review competitor research / upgrade brief with client stakeholder
- [x] Run UX-UI-Max skill to generate page design options against the brief
- [x] Decide theme approach — `lyra` theme package created from Stitch exploration (Home + Car Remaps only; not yet built out into full components/pages)
- [x] Test site scaffolded — `sites/lyra-test/` (CI-inert, `.pipeline-test-site.json` marked). Run `cd sites/lyra-test && npm run dev` → http://localhost:3000 and `/car-remaps`. Fuel savings calculator is genuinely interactive.
- [ ] Confirm real testimonials/case studies to replace Stitch's fabricated placeholder quotes (Home page — flagged, must not ship as-is)
- [ ] Scope Car Remaps content (service description, fleet case studies/testimonials, pricing approach, FAQ)
- [ ] Plan MDX content migration from existing WordPress service pages
- [ ] Build out `lyra` theme's `components/` and `pages/` (currently only `index.ts` + `globals.css`) before wiring a test site
- [ ] WCAG contrast check on white-on-orange buttons before shipping
- [ ] Create site via `tools/create-site-from-project.ts` once brief is approved

## Notes

Based in Polegate, East Sussex — same town as the Mad Graphics client. Existing WordPress site is informational but thin: minimal testimonials, no case studies, no fleet-specific trust content despite fleet being a named service line. Redesign is an opportunity to build out fleet/corporate credibility ahead of the Car Remaps launch.
