# Component Quality Assessment

Pipeline run: `extract-theme.ts --clone corvus --pass translate --out /tmp/corvus-test`
Date: 2026-04-16

## Section Components

| Component                  | AI/Placeholder       | Lines | Has Layout                                        | Uses Tokens                                                           | Props Wired                                                                        | Quality     |
| -------------------------- | -------------------- | ----- | ------------------------------------------------- | --------------------------------------------------------------------- | ---------------------------------------------------------------------------------- | ----------- |
| nav-dark-bar.tsx           | placeholder          | 34    | no — centered section, no nav structure           | partial (text-surface-\*)                                             | no — props ignored                                                                 | **fail**    |
| hero-headline-coloured.tsx | AI                   | 57    | yes — flex col/row, two columns, bg-cover         | yes (bg-brand-primary, text-brand-secondary)                          | partial — headingParts/subheading render; left col empty                           | **partial** |
| hero-event-banner.tsx      | AI                   | 90    | yes — absolute bg, flex column, min-h-[600px]     | yes (bg-brand-primary, text-on-brand-primary, bg-brand-secondary)     | good — all 5 props consumed conditionally                                          | **good**    |
| cta-yellow-band.tsx        | AI                   | 53    | yes — flex col/row, heading + body + CTA          | partial — bg-yellow-400 is hardcoded Tailwind, not token              | good — all 3 props consumed                                                        | **partial** |
| cta-blue-band.tsx          | AI                   | 47    | yes — flex col, right-aligned, bg-brand-secondary | yes (bg-brand-secondary, text-on-brand-primary, btn-primary)          | good — all 3 props consumed conditionally                                          | **good**    |
| cta-green-band.tsx         | AI (wrong component) | 150   | yes — flex row + grid, but it's a footer layout   | yes (bg-brand-primary, text-on-brand-primary)                         | broken — hardcoded footer nav, ignores heading/bodyText/ctaButton                  | **fail**    |
| blog-card-grid.tsx         | AI                   | 94    | yes — flex col + 2-col grid, card structure       | yes (text-brand-primary, text-brand-secondary, border-surface-border) | partial — blogCards array works; flat cardThumbnail/cardTitle props redundant      | **partial** |
| content-split-about.tsx    | AI (misassembled)    | 63    | yes — flex col, centered, form row                | yes (bg-brand-primary, text-on-brand-primary, btn-primary)            | partial — heading/bodyText render; component is newsletter signup, not split-about | **partial** |
| photo-gallery-strip.tsx    | AI                   | 44    | yes — flex-row overflow-x-auto, equal tiles       | no — bare CSS only                                                    | good — photos array iterated with image/title                                      | **partial** |
| newsletter-dark-band.tsx   | AI                   | 78    | yes — flex col, email input + button row          | yes (bg-brand-primary, text-on-brand-primary, btn-\*)                 | good — all props consumed; hardcoded inline links in subheading                    | **good**    |
| footer-multi-column.tsx    | AI                   | 98    | yes — grid 4-col, flex bottom bar                 | yes (bg-surface-muted, text-surface-foreground, text-brand-primary)   | broken — columnHeadings typed as string but indexed as array                       | **partial** |

## Shell Components (header.tsx, footer.tsx)

| Component  | AI/Placeholder | Lines | Has Layout                      | Uses Tokens | Props Wired                      | Quality  |
| ---------- | -------------- | ----- | ------------------------------- | ----------- | -------------------------------- | -------- |
| header.tsx | placeholder    | 12    | minimal — header/nav shell only | none        | broken — Record<string, unknown> | **fail** |
| footer.tsx | placeholder    | 12    | none — single p                 | none        | broken — Record<string, unknown> | **fail** |

## Quality Summary

| Rating      | Count | Components                                                                                                             |
| ----------- | ----- | ---------------------------------------------------------------------------------------------------------------------- |
| **good**    | 3     | hero-event-banner, cta-blue-band, newsletter-dark-band                                                                 |
| **partial** | 6     | hero-headline-coloured, cta-yellow-band, blog-card-grid, content-split-about, photo-gallery-strip, footer-multi-column |
| **fail**    | 4     | nav-dark-bar, cta-green-band, header, footer                                                                           |

**Good rate: 3/13 (23%) for all files, 3/11 (27%) for section components only.**

## CtaYellowBand Comparison (existing vs generated)

The existing and generated versions are structurally very similar:

- Both use `bg-yellow-400` (hardcoded, not a token) as the band background
- Both have heading with `text-brand-primary uppercase tracking-widest`
- Both have body text + CTA button layout

Key differences:

- **Existing**: includes a decorative arrow image (from external colorcode.events URL), button text `text-on-brand-primary`
- **Generated**: no decorative image (simpler layout), button text `text-yellow-400` (inverts the brand color on button)
- Generated is slightly cleaner structurally but both have the `bg-yellow-400` token gap

## HomePage Prop Wiring

`HomePage.tsx` renders all 11 content components with zero props — every component is `<ComponentName />` with no data passed. The `CorvusHomePageProps` interface is `[key: string]: unknown`. All components use optional props with fallback defaults, so the page won't crash, but will show only empty/default content. This is the known zero-prop wiring gap.

## Key Issues Identified

1. **NavDarkBar hex literals** → gauntlet replaced with placeholder (hex in SVG fills)
2. **cta-green-band misassembled** → LLM generated a footer layout instead of a CTA band (section correlation gave it a footer-like HTML fragment)
3. **content-split-about misassembled** → LLM generated a newsletter signup form instead of a split content+image layout
4. **bg-yellow-400 not tokenized** → yellow is not in the brand token palette; should map to a theme token
5. **header/footer placeholders** → these are always generated as shells; real header/footer come from the theme barrel
6. **HomePage zero-prop wiring** → known pipeline gap
