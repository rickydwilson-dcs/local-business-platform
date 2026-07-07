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

- `tasks/clients/dch-automotive.md` (new, updated with theme decision)
- `tasks/clients/_pipeline.md` (added DCH Automotive row)
- `tasks/README.md` (added DCH Automotive to Client Pipeline table)
- `output/sessions/2026-07/2026-07-07_dch-automotive-redesign/upgrade-brief.md` (new)
- `output/ingestion/lyra-stitch/` (new, gitignored — Stitch HTML exports, 12 images, extracted design tokens, project/screens metadata)
- `packages/themes/lyra/index.ts`, `packages/themes/lyra/globals.css` (new theme package — extraction record, not imported by the test site)
- `packages/themes/package.json` (added `./lyra` export)
- `packages/theme-system/src/types.ts` (registered `lyra` in `THEME_NAMES`)
- `sites/lyra-test/` (new — scoped test site: real Home + Car Remaps pages, 12 Stitch images in `public/stitch-images/`, self-contained `theme.config.ts`, CI-inert `package.json`; other inherited base-template routes present but not restyled/wired to shared header-footer)
- `pnpm-lock.yaml` (new site added to workspace)

## Next Steps

- [ ] Review the running test site with client stakeholder (`cd sites/lyra-test && npm run dev` → http://localhost:3000 and `/car-remaps`)
- [ ] Confirm exact brand hex codes and missing business details (hours, address, legal name) — current extraction used `#0C0B09`/`#F2730D` from the Stitch output, not client-confirmed values
- [ ] Replace Stitch's fabricated testimonial placeholders with real client quotes before any real build
- [ ] WCAG contrast check on white-on-orange buttons (`pnpm --filter @platform/theme-system validate`)
- [ ] Plan MDX content migration from WordPress + new Car Remaps content build
- [ ] Gather brand assets (logo, photos) into Google Drive
- [ ] When ready for a real build: decide whether to keep `sites/lyra-test`'s hardcoded pages as a starting point or rebuild against the real MDX/siteConfig content system (this test site intentionally bypasses both, per the platform's disposable-test-site convention)

## Notes

The current WordPress site and every competitor researched (both vehicle-security installers and fleet remap providers) share the same gap: no visible testimonials or case studies despite selling trust-dependent services. This is the clearest opportunity identified — DCH already has motor-trade relationships and a strong certification set (City & Guilds, IMI, Thatcham, Autowatch, Witter, Smartrack, Thinkware) to draw real social proof from. Full detail in `upgrade-brief.md`.
