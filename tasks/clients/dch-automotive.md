# DCH Automotive

**Stage:** BUILD | **Trade:** Vehicle security, electrical accessories & fleet solutions | **Site:** `sites/dch-automotive`

---

## Business Details

| Field        | Value                                                          |
| ------------ | -------------------------------------------------------------- |
| Trading Name | DCH Automotive                                                 |
| Legal Name   | Not yet confirmed                                              |
| Phone        | 07506 016106                                                   |
| Email        | info@DCHautomotive.co.uk                                       |
| Address      | Unit H2 Chaucer Business Park, Polegate, East Sussex, BN26 6QH |
| Hours        | By appointment — usually Mon-Fri 8:30am-5pm                    |
| Established  | 2018                                                           |
| Instagram    | @dchautomotive                                                 |
| Facebook     | facebook.com/DCHautomotive-105166288262588                     |

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

Dark-first identity built directly into `sites/dch-automotive/theme.config.ts` (self-contained, no `@platform/themes/*` import — see root `CLAUDE.md` self-containment note): near-black background (`#0C0B09`), off-white text (`#F5F5F5`), single orange accent (`#F2730D`) used sparingly. Originally extracted from a Stitch design exploration (2026-07-07) into `packages/themes/lyra/` (tokens/globals.css only — that package remains a reference/extraction record, not consumed at runtime). Source assets: `output/ingestion/lyra-stitch/` (Home + Car Remaps HTML exports, 12 images, extracted tokens). See `project_dch_automotive_redesign.md` memory for full extraction notes, including a font substitution (Oswald → Public Sans, kept as-generated) and a white-on-orange button contrast call worth a WCAG check before shipping.

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

## Current Services — rebuilt structure (client migration email, 2026-07-08/09)

Client sent a category-by-category keep/delete/restructure list for the migration. Final resolved structure, built into `sites/dch-automotive/content/services/`:

| Service page     | Slug               | What changed from the old WordPress site                                                                                                                                                                                                                                                                                                                                                                                                                                                             |
| ---------------- | ------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Vehicle Security | `vehicle-security` | Kept: Vehicle Trackers, Plant Machinery, Immobiliser (Autowatch Ghost 2). **Alarms deleted.** **Bike/Motorbike Security merged in** as a subsection — removed Datatag, Datatool Stealth S5, M1 Sports Cam, Meta Trak (all confirmed for removal by client); kept BikeTrac (+LITE), SmarTrack Reco/Protector Pro Global/MotoTrak, BikeTrac Grab Bag & Chain, BikeTrac Ground Anchor                                                                                                                   |
| Parking Aids     | `parking-aids`     | Unchanged                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            |
| Fleet Solutions  | `fleet-solutions`  | **Full rebuild.** The old 10-item camera/ADAS list was stale — client confirmed Fleet Solutions should mirror his other business, [ViewMeLive](https://www.viewmelive.co.uk) (not managed by us). Rebuilt around ViewMeLive's 4 real current categories: Fleet Tracking & Reporting, MDVR & Dashcam Solutions, Asset Tracking, DVS Progressive Safe System (5 real sub-components sourced from viewmelive.co.uk/dvs-progressive-safe-system). Cross-promoted as a sister company per client decision |
| Accessories      | `accessories`      | Kept LED Auto Lamps + Audio. **Removed** Phone Accessories, Hands-Free Devices                                                                                                                                                                                                                                                                                                                                                                                                                       |
| Dash Cameras     | `dash-cameras`     | **New category.** Real IROAD product range sourced from iroaduk.com: FX1 PRO (from £185), FX2 PRO (from £215), X10 PRO 4K (from £299.99), FHD Rear Channel-only (£74.99)                                                                                                                                                                                                                                                                                                                             |
| Tow Bars         | —                  | **Deleted entirely**, no replacement                                                                                                                                                                                                                                                                                                                                                                                                                                                                 |

**Pricing:** client is sending an updated price list separately — none of the rebuilt pages include final prices beyond the IROAD dash camera RRPs (which are public retail prices from iroaduk.com, not DCH's own pricing).

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

**Embeddable widget:** `https://viezu.com/dealer?id=33805671920f0d02e6d18f630985aace` — a Viezu-hosted vehicle/tuning-options finder, dealer-branded via the `id` param. Confirmed no `X-Frame-Options`/CSP `frame-ancestors` blocking — genuinely iframeable. Embedded on `/car-remaps` in `sites/dch-automotive`.

**Imagery source:** client supplied a Dropbox folder ("VIEZU APPROVED DEALER MARKETING") — this is Viezu's **generic dealer marketing kit**, not DCH's own photography. Contains guarantee seals, logos (including BlueOptimize), and a large marque-by-marque stock library (Ferrari/Lamborghini/McLaren/Aston Martin/BTCC-on-track/Halo Vehicles etc.) — **avoid these entirely**, they'd undermine the "not a performance shop" positioning. Used only the neutral folders: guarantee seals, logos, `ECU Images` (abstract circuit-board shots), `KESS3 Images` (real tool product photography).

## Content Plan

Done — see "Current Services — rebuilt structure" above for the full service category migration, and "New Service Launching: Car Remaps" above for the remap service catalogue.

## Locations

Real, validated MDX location content built in `sites/dch-automotive/content/locations/`, centred on Eastbourne per client instruction:

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
- [ ] Gather DCH's own brand assets (logo, real premises/team photos — distinct from the generic Viezu dealer marketing kit already used) into Google Drive: `My Drive/Clients/dch-automotive/`
- [ ] Confirm real testimonials/case studies to replace Stitch's fabricated placeholder quotes (Home page — flagged, must not ship as-is)
- [ ] Ask client whether Stage 2/3/Performance Tuning should share the fleet-focused `/car-remaps` page or get separated onto their own page
- [ ] Get updated pricing from client for all rebuilt service categories (client said they'll send a list separately — none of the rebuilt pages carry final DCH pricing beyond public IROAD dash cam RRPs)
- [ ] Real DCH-specific photography still wanted eventually for all service/location pages — currently all hero and body images site-wide are the Stitch-generated stock set (never client photography), now served from R2 rather than local `/public`. **Correction (2026-07-09):** an earlier note here claimed the 5 service pages "ship with no hero images" due to the `hero.image` local-path R2-placeholder bug — that was wrong on inspection; all 5 already had `heroImage` set and rendering (via a raw `<img src>` that bypassed `getImageUrl()`, same mechanism as the location template). Not a missing-image bug, just non-R2-hosted stock imagery — now resolved by the R2 migration below.
- [ ] WCAG contrast check on white-on-orange buttons before shipping
- [x] All site images migrated to Cloudflare R2 (2026-07-09) — uploaded via `tools/upload-dch-automotive-to-r2.ts` to the shared platform bucket under the `dch-automotive/` key prefix (35 files: stitch-images stock photography, Viezu marketing assets, site logo); `public/stitch-images/`, `public/viezu/`, `public/logo/` deleted from the repo. `components/pages/location-detail-page.tsx`, `service-detail-page.tsx`, `blog-post-page.tsx`, `site-header.tsx`, and the bespoke `app/page.tsx`/`app/car-remaps/page.tsx` now resolve images via `getImageUrl()` instead of raw local paths. See `sites/dch-automotive/CLAUDE.md` "Images" section.
- [x] Location page hero images added (2026-07-09) — Eastbourne/Polegate/Hailsham now use the Stitch stock photography set instead of the placeholder icon; not town-specific photography, just a legibility/completeness fix
- [x] Tow Bars and Alarms content cleanup (2026-07-09) — both services were confirmed deleted during the WordPress migration (see "Current Services" table above) but stale references survived into the homepage credentials strip, `site.config.ts` certifications, and all three location pages' hero/FAQ/body copy; removed throughout, trade-certification count corrected 7 → 6
- [x] Review competitor research / upgrade brief with client stakeholder
- [x] Run UX-UI-Max skill to generate page design options against the brief
- [x] Decide theme approach — dark, near-black/orange identity, self-contained in `theme.config.ts`
- [x] Confirm business details: full street address (Unit H2 Chaucer Business Park, Polegate, BN26 6QH) and hours (by appointment, usually Mon-Fri 8:30am-5pm)
- [x] Real Car Remaps service catalogue confirmed and built (Viezu-sourced) — see "New Service Launching" above
- [x] Guarantee/warranty terms confirmed (Viezu's 30-day money-back + insurance-backed guarantees) — badges live on `/car-remaps`
- [x] Real location content built for Eastbourne/Polegate/Hailsham — see Locations above
- [x] Site created — `sites/dch-automotive` (renamed from the `lyra-test` scaffold rather than run through `tools/create-site-from-project.ts`, since that tool's theme schema only supports orion/vega/cygnus and still generates the pre-self-containment `@platform/themes/*` import pattern; renaming reused the already-real Home/Car Remaps/locations work directly)
- [x] Full service category migration from client's keep/delete instructions — see "Current Services — rebuilt structure" above

## Notes

Based in Polegate, East Sussex — same town as the Mad Graphics client. Existing WordPress site is informational but thin: minimal testimonials, no case studies, no fleet-specific trust content despite fleet being a named service line. Redesign is an opportunity to build out fleet/corporate credibility ahead of the Car Remaps launch.
