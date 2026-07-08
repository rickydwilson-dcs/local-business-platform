# Session: 2026-07-07_dch-automotive-redesign

**Start Date:** 2026-07-07
**Status:** Active
**Objective:** Migrate DCH Automotive (dchautomotive.co.uk) from a standalone WordPress site onto LBP with a full visual redesign, and scope a new "Car Remaps" service line targeting corporate fleet customers (fuel efficiency and/or extra power) — explicitly not the performance-tuning/enthusiast market.

## Summary

Set up client tracking per platform convention (`tasks/clients/dch-automotive.md`), then ran parallel sub-agent research across 8 competitor/adjacent sites in two categories: direct vehicle-security/fleet-installer competitors, and fleet ECU-remapping providers (for the new Car Remaps service). Synthesized findings into `upgrade-brief.md`. Built an initial HTML mockup as a Claude Artifact, corrected it from light-mode-first to a committed dark identity per client feedback, then ran a real Stitch design exploration (Home + Car Remaps screens) and extracted the result into a new `lyra` theme package.

## Key Decisions

- Palette constraint carried through: orange, black, white must be retained; layout/typography/component design otherwise open.
- Car Remaps positioning locked to corporate fleet fuel efficiency/power — no enthusiast/performance-tuning language or imagery anywhere in that section's nav path.
- Competitor research run via 6 parallel general-purpose sub-agents (foreground, single batched message) across 8 sites.
- Brand identity corrected mid-session: black background + white text + orange pops is fixed, not a light/dark toggle — committed as a single theme, not two variants.
- Stitch design system configured with `colorMode: DARK`, `customColor: #F2730D`, `overrideNeutralColor: #0C0B09` — deliberately overriding the `/pipeline.stitch-design` skill's documented LIGHT default, since it has no `--color-mode` flag and this client's brand requires dark.
- Extracted the Stitch output into `packages/themes/lyra/` (design tokens + globals.css) as a reference/extraction record.
- Scaffolded `sites/lyra-test/` (copy of base-template, CI-inert, `.pipeline-test-site.json` marked) with real Home + Car Remaps pages hand-converted from the Stitch HTML — theme tokens inlined self-contained in `theme.config.ts` (confirmed via code inspection that base-template, dj-fox-electrical, and colossus-scaffolding are now ALL self-contained; no live site imports from `@platform/themes/*` anymore, correcting an earlier stale memory note). The Car Remaps fuel-savings calculator is a real interactive client component (`components/fuel-savings-calculator.tsx`), verified working via a production build after dev-mode's CSP (`unsafe-eval` deliberately removed) blocked webpack Fast Refresh from hydrating it.

## Files Modified

- `tasks/clients/dch-automotive.md` (new, updated with theme decision, then with real Car Remaps/Viezu/location facts)
- `tasks/clients/_pipeline.md` (added DCH Automotive row)
- `tasks/README.md` (added DCH Automotive to Client Pipeline table)
- `output/sessions/2026-07/2026-07-07_dch-automotive-redesign/upgrade-brief.md` (new)
- `output/ingestion/lyra-stitch/` (new, gitignored — Stitch HTML exports, 12 images, extracted design tokens, project/screens metadata)
- `packages/themes/lyra/index.ts`, `packages/themes/lyra/globals.css` (new theme package — extraction record, not imported by the test site)
- `packages/themes/package.json` (added `./lyra` export)
- `packages/theme-system/src/types.ts` (registered `lyra` in `THEME_NAMES`)
- `sites/lyra-test/` (scoped test site: real Home + Car Remaps pages, real business facts in `site.config.ts`, 3 real location MDX files, Viezu assets in `public/viezu/`)
- `pnpm-lock.yaml` (new site added to workspace)

## Second pass (2026-07-08): real Car Remaps catalogue, Viezu supplier, Eastbourne locations

Client supplied real facts superseding the earlier fleet-only assumption:

- **Real remap service catalogue** (6 services, supplier: Viezu, KESS3 hardware): Economy Tuning (BlueOptimize), Gearbox Tuning, Stage 1/2/3 Remap, Performance Tuning. Rebuilt `/car-remaps`'s "Our Remap Services" section around these, sourcing technical accuracy from `viezu.com`'s KESS3 product page. Positioning resolved: kept the page's primary marketing angle fleet/cost-focused, but listed the full real catalogue honestly rather than pretending Stage 2/3/Performance don't exist (flagged for client input in the brief — may want stricter separation later).
- **Real guarantee terms** (previously an open question): Viezu's own 30-Day Money-Back, Insurance-Backed, and Viezu Approved Dealer guarantees — real badge images pulled from the client's Dropbox ("VIEZU APPROVED DEALER MARKETING" — Viezu's generic dealer kit, not DCH's own photography) and added to `/car-remaps`.
- **Embedded Viezu vehicle-finder widget** (`https://viezu.com/dealer?id=...`) as a live iframe — confirmed no framing restrictions via `curl -I`, added `viezu.com` to `next.config.ts`'s CSP `frame-src` (a scoped, deliberate allowlist addition, unlike the earlier `unsafe-eval` situation which was a blanket removal not to be reversed).
- **Real location content**: replaced generic placeholder locations with Eastbourne (client-specified primary hub), Polegate (actual business base), and Hailsham — all pass `LocationFrontmatterSchema` validation.
- **Fixed two real bugs surfaced by browsing the locations page**: (1) `hero.image` frontmatter field expects an R2-hosted path, not a local `/public` path — local paths silently render an "R2 URL Not Configured" placeholder; dropped the field rather than solving R2 integration. (2) `site.config.ts` still had 100% generic placeholder business info (`+44 1234 567890` etc.) even though Home/Car Remaps were hardcoded around real facts — inherited pages (`/locations`, `/about`, `/contact`) were silently showing the wrong phone number. Updated `site.config.ts`'s business/credentials/schema blocks with DCH's real facts; left the `services` array and `content/services/*.mdx` as generic placeholders since that's a distinct, larger content-migration task already flagged separately.
- Verified via dev server + Chrome screenshots: all 6 services, all 3 guarantee badges, the real KESS3 tool photo, and the live Viezu iframe all render correctly; phone number bug confirmed fixed via `curl`.
- **Images (Stitch + Viezu) are intentionally NOT committed to git** — discovered the root `.gitignore` blanket-excludes `**/*.jpg`/`**/*.png` repo-wide, and `docs/standards/images.md` confirms this is deliberate platform policy ("NO images in Git repository (except placeholders)" — images belong in Cloudflare R2). This means `sites/lyra-test/public/stitch-images/` and `public/viezu/` exist locally for review right now but won't survive a fresh clone or CI. Not a bug — matches convention. If this direction is approved for a real build, images need proper R2 upload per that doc, not just local `/public` files.

## Next Steps

- [ ] Review the running test site with client stakeholder (`cd sites/lyra-test && npm run dev` → http://localhost:3000, `/car-remaps`, `/locations/eastbourne`)
- [ ] Confirm exact brand hex codes and missing business details (full street address, legal name — hours now set to a placeholder Mon-Sat 08:00-18:00)
- [ ] Ask client whether Stage 2/3/Performance Tuning should stay on the fleet-focused `/car-remaps` page or move to a separate page
- [ ] Replace Stitch's fabricated testimonial placeholders with real client quotes before any real build
- [ ] WCAG contrast check on white-on-orange buttons (`pnpm --filter @platform/theme-system validate`)
- [ ] Plan MDX content migration from WordPress + new Car Remaps content build (site.config.ts business facts are now real; the `services` array and `content/services/*.mdx` are still generic placeholders)
- [ ] Gather DCH's own brand assets (logo, real premises/team photos) into Google Drive — distinct from the generic Viezu dealer marketing kit already used
- [ ] When ready for a real build: decide whether to keep `sites/lyra-test`'s hardcoded Home/Car Remaps pages as a starting point or rebuild against the real MDX/siteConfig content system

## Notes

The current WordPress site and every competitor researched (both vehicle-security installers and fleet remap providers) share the same gap: no visible testimonials or case studies despite selling trust-dependent services. This is the clearest opportunity identified — DCH already has motor-trade relationships and a strong certification set (City & Guilds, IMI, Thatcham, Autowatch, Witter, Smartrack, Thinkware, and now Viezu Approved Dealer) to draw real social proof from. Full detail in `upgrade-brief.md`.
