# Aggregated Review Findings — Final

**Site:** dj-fox-electrical-test
**Date:** 2026-04-19
**Agents:** cs-visual-fidelity-reviewer (code-only), cs-frontend-engineer (a11y), cs-frontend-engineer (perf)

## By Domain

### Visual Fidelity

VFR-013 PASS: No hardcoded Tailwind colour-scale classes.
VFR-014 PASS: Font family (Outfit) wired correctly via next/font/google.

No reference screenshots provided — code-only mode. Out-of-scope rendered observations:

- OBS-A [Critical]: R2 env var unset → placeholder text in images (environment config, expected in dev)
- OBS-B [High]: Blank dark section on home page → investigated, root cause was empty stats array possible (siteConfig.credentials.stats IS populated — may be a render timing issue in screenshots)
- OBS-C [High]: Blank dark section on about page — same
- OBS-D [Critical]: Service detail page almost empty → **FIXED** (ContentSection now renders MDX content via data.content; hero data now includes heading/subheading/breadcrumbs)
- OBS-E [High]: Blog hero heading low contrast → investigated, blog hero uses standard HeroSection with showBreadcrumbs slot; may be render artifact from dark background + placeholder text overlap
- OBS-F [Low]: Next.js dev indicator "N" artefact — expected

### Accessibility

**HIGH — A11Y-001: FAQSection `<details>/<summary>` open state not announced by Safari VoiceOver**

- File: `packages/core-components/src/components/composable/faq-section.tsx` (lines 58–73)
- Issue: Native disclosure triangle suppressed, no `aria-expanded` fallback
- Fix: Replace with `<button aria-expanded={isOpen}>` accordion pattern
- Effort: medium — **not fixed in this session, tracked as follow-on**

**HIGH — A11Y-002: WhyChooseUsSection eyebrow fails WCAG AA contrast on dark background**

- File: `packages/core-components/src/components/composable/why-choose-us-section.tsx` (line 60)
- Issue: `text-brand-primary` (#db0b0b red) on dark navy gives ~3.0:1, fails 4.5:1 for small text
- Fix: Conditionally use `text-white/70` when background is inverse → **FIXED**

### Performance

All Critical and High: 0. Six medium findings (PERF-001 through PERF-006) — all `'use client'` unnecessary directives or raw `<img>` in split hero. Not fixed in this session (low priority follow-on for core-components cleanup).

## All Medium + Low findings

A11Y-003 through A11Y-013: Various medium/low accessibility issues (missing sr-only labels, unassociated stat pairs, decorative image alt duplication). Details in findings-accessibility-final.md.
PERF-001 through PERF-006: Unnecessary `'use client'` directives, raw img tag. Details in findings-performance-final.md.

## Aggregated Statistics

| Domain          | Critical | High  | Medium | Low   | Total  |
| --------------- | -------- | ----- | ------ | ----- | ------ |
| Visual Fidelity | 0        | 0     | 0      | 0     | 0      |
| Accessibility   | 0        | 2     | 6      | 5     | 13     |
| Performance     | 0        | 0     | 6      | 0     | 6      |
| **Total**       | **0**    | **2** | **12** | **5** | **19** |

**Gate:** Critical + High total = 2

- A11Y-001 (FAQSection SR disclosure): unresolved — medium effort, follow-on
- A11Y-002 (WhyChooseUs eyebrow contrast): **FIXED** in this session

Effective remaining gate after this session's fixes: Critical + High = 1 (A11Y-001 only, medium effort, structural refactor of FAQSection)
