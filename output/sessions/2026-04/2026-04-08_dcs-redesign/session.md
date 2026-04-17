# DCS Redesign: Digital Consulting Services on Local Business Platform

**Status:** In Progress
**Date:** 2026-04-08
**Branch:** feature/dcs-redesign (from develop)

## Objective

Rebuild digitalconsultingservices.co.uk on the local business platform with a fresh design direction. This is the platform owner's own agency site, not a client trade business.

## Key Decisions

- **Design direction:** Tactical Telemetry (Dark) archetype from industrial-brutalist-ui skill
- **Site slug:** `dcs`
- **Theme name:** `polaris` (new theme package)
- **Dual design generation:** Industrial-brutalist DESIGN.md + Stitch pipeline for comparison
- **Service pivot:** From WordPress services to Platform Websites + AI Automation
- **Portfolio:** Use monorepo test sites as live examples (replaces WordPress /examples/ page)

## Current Business Info (from existing WordPress site)

- **Domain:** digitalconsultingservices.co.uk
- **Services (old):** WordPress Dev, Web Design, eCommerce, Maintenance, Analytics, SEO
- **Services (new):** Platform Websites, AI Automation, eCommerce, Web Design, SEO & Analytics, Maintenance
- **Positioning (old):** "Websites as professional as you are" -- boutique family business
- **Pricing (old):** Start Up £500, Grow £750, eCommerce from £1750
- **Brand colors (old):** #446084 (blue-gray), #3e8371 (teal-green), #627D47 (sage green)

## Phase 1: Design Generation

- [ ] Run `/industrial-brutalist-ui` -- Tactical Telemetry archetype
- [ ] Run `/pipeline.stitch-design` -- agency-tuned dials (Creativity:7, Density:3, Variance:6, Motion:4)
- [ ] Write standalone Stitch prompt for manual use
- [ ] **Decision gate:** User reviews both outputs, picks direction

## Phase 2: Site Scaffolding

- [ ] Copy base-template to sites/dcs
- [ ] Create packages/themes/polaris/ (or refine Stitch-generated theme)
- [ ] Configure site.config.ts and theme.config.ts
- [ ] Write 6 service MDX files
- [ ] Create portfolio/examples project MDX files

## Phase 3: Verify & Deploy

- [ ] Content validation, type-check, build
- [ ] Local dev test
- [ ] Deploy via /deploy.changes

## Reference

- Plan file: `.claude/plans/swift-stirring-thunder.md`
- Current site: https://www.digitalconsultingservices.co.uk
- Examples page: https://www.digitalconsultingservices.co.uk/examples/
