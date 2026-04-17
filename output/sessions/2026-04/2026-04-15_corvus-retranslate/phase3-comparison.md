# Phase 3: Component Comparison — Generated vs Existing

## Line Count Comparison

| Component                  | Old Lines | New Lines | Status                              | Key Differences                                                         |
| -------------------------- | --------- | --------- | ----------------------------------- | ----------------------------------------------------------------------- |
| nav-dark-bar.tsx           | (new)     | 34        | placeholder — hex literal rejection | New file; previous theme had no nav-dark-bar                            |
| hero-headline-coloured.tsx | 59        | 56        | similar                             | Minor structural tweaks; both use brand tokens                          |
| hero-event-banner.tsx      | 91        | 89        | similar                             | Nearly identical; new has slightly tighter code                         |
| cta-yellow-band.tsx        | 59        | 53        | improved                            | Simpler — removes decorative arrow image with external URL              |
| cta-blue-band.tsx          | 97        | 47        | major reduction                     | Old had elaborate multi-row layout; new is cleaner flex-col             |
| cta-green-band.tsx         | 50        | 150       | WORSE — misassembled                | Old was a proper CTA band; new is a footer layout                       |
| blog-card-grid.tsx         | 99        | 94        | similar                             | Both have card grid; new has redundant flat props                       |
| content-split-about.tsx    | (new)     | 63        | misassembled                        | New file (old was about-split-dark.tsx); generated as newsletter signup |
| photo-gallery-strip.tsx    | (new)     | 44        | new                                 | New file (old was gallery-photo-strip.tsx); basic horizontal scroll     |
| newsletter-dark-band.tsx   | 36        | 78        | major expansion                     | Old was a stub (3 lines of JSX); new has full email form                |
| footer-multi-column.tsx    | 119       | 98        | broken typing                       | Old had proper column arrays; new has string-typed columns              |
| header.tsx                 | 14        | 12        | both shells                         | Both are minimal shells — expected for theme barrel header              |
| footer.tsx                 | 13        | 11        | both shells                         | Both are minimal shells — expected for theme barrel footer              |

## Safe to Replace?

| Component                  | Replace?    | Reason                                               |
| -------------------------- | ----------- | ---------------------------------------------------- |
| hero-event-banner.tsx      | **YES**     | Good quality, proper tokens, props wired             |
| cta-blue-band.tsx          | **YES**     | Cleaner than existing, good tokens                   |
| newsletter-dark-band.tsx   | **YES**     | Major improvement over 3-line stub                   |
| hero-headline-coloured.tsx | **PARTIAL** | Better than existing but left column empty           |
| cta-yellow-band.tsx        | **PARTIAL** | Structurally cleaner but bg-yellow-400 not tokenized |
| blog-card-grid.tsx         | **PARTIAL** | Works but has redundant flat props                   |
| photo-gallery-strip.tsx    | **COPY**    | New file, basic but functional                       |
| content-split-about.tsx    | **NO**      | Misassembled — is a newsletter form, not split-about |
| footer-multi-column.tsx    | **NO**      | Typing is broken (string vs array)                   |
| nav-dark-bar.tsx           | **NO**      | Placeholder — hex literal rejection                  |
| cta-green-band.tsx         | **NO**      | Completely wrong component (footer layout)           |
| header.tsx                 | **NO**      | Shell — no improvement over existing                 |
| footer.tsx                 | **NO**      | Shell — no improvement over existing                 |

## Gauntlet Failure Analysis

From translate log warnings:

| Component         | Warning Type              | Detail                                                                  |
| ----------------- | ------------------------- | ----------------------------------------------------------------------- |
| NavDarkBar        | hex literal → placeholder | `#1281c5, #f68720` — SVG fill colors not mappable to tokens             |
| NavDarkBar        | unknown colours           | `bg-yellow-400, bg-pink-600, bg-green-600` — event category colors      |
| CtaYellowBand     | unknown colours           | `bg-yellow-400, text-yellow-400` — yellow not in brand palette          |
| CtaGreenBand      | unknown colours           | `bg-brand-primary/80, text-on-inverse-muted` — opacity modifier unknown |
| BlogCardGrid      | unknown colours           | `text-on-inverse-muted` — not in token allowlist                        |
| ContentSplitAbout | unknown colours           | `placeholder:text-surface-foreground/60` — modifier unknown             |
| CtaBlueBand       | syntax errors             | Initial generation had 30+ syntax errors — retry fixed it               |
| All 11 components | TS2686 React UMD          | Every component needed semantic-fix retry for missing React import      |

## Root Causes

1. **TS2686 "React UMD global"** — universal across all components. The LLM generates JSX but omits `import React from 'react'`. The semantic-fix retry adds it, costing an extra LLM call per component. **Pipeline fix: add `import React from 'react'` to the system prompt's template.**

2. **Section correlation mismatch** — `cta-green-band` got matched to section index 6, which is a footer-like section in the HTML. The fallback-by-index strategy breaks when the vision blueprint names don't match the HTML section headings.

3. **Hex literal false positives** — NavDarkBar uses SVG fills with hex colors for decorative icons. These can't be tokenized. The gauntlet replaces the entire component with a placeholder.

4. **Missing token classes** — `text-on-inverse-muted`, `bg-brand-primary/80` are generated by the LLM but aren't in the token allowlist. They're valid Tailwind patterns but the gauntlet flags them.

## Overall Assessment

- **3/11 section components (27%) rated "good"** — safe to replace
- **4/11 section components (36%) rated "partial"** — usable with manual fixes
- **4/13 total files (31%) rated "fail"** — 2 are shells (expected), 2 are real failures

This falls in the **30-70% bracket** per the Phase 4 decision gate. The top failure causes are:

1. Section correlation mismatches (cta-green-band, content-split-about)
2. Hex literal false positives (nav-dark-bar)
3. React import missing (all components, but auto-fixed by retry)

The pipeline produces usable output for ~63% of components. The remaining ~37% need either pipeline fixes (correlation, hex allowlisting) or manual intervention.
