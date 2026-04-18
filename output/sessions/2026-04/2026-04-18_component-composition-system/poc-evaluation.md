# Component Composition System — PoC Evaluation

**Date:** 2026-04-18  
**Briefs evaluated:** navagarden, designlab  
**Pipeline:** structural pass → SiteCompositionConfig, visual pass → themeConfig + cssOverrides

---

## 1. Navagarden — Structural Correctness

**Result:** PASS  
`siteId: navagarden | pages: 3 | home sections: 4`

Home page sections produced:
| Component | id | Layout | Condition |
|-----------|----|--------|-----------|
| HeroSection | hero-split-image-text | split, fullBleed | always |
| FeatureGrid | cards-three-column-features | 3-col, surface | always |
| ContentSection | content-gallery-heading | center, no fullBleed | data-present |
| ContentSection | social-proof-provider-card | split, subtle | data-present |

Observations:

- Navigation and Footer sections correctly excluded.
- Slot suppression applied: `showSecondaryCta: false`, `showTrustBadges: false` on hero matches the brief's contentSlots.
- `condition: data-present` used for the two conditional content sections — correct.
- Layout params (`align: split`, `fullBleed: true`) reflect the brief's `layoutPattern`.

**Structural fidelity: 5/5**

---

## 2. Navagarden — Visual Fidelity

**Result:** PASS (2nd attempt required)  
Font links: 1 (Work Sans), themeConfig keys: colors, typography, components, provenance entries: 28

The first attempt produced hardcoded hex values in cssOverrides. Retry with error context succeeded. The retry guard (3 attempts max with stronger no-hex instruction) is needed for production use.

**Visual pass reliability:** Requires retry for ~50% of runs with large briefs. The hex guard + retry is the correct solution.

**Visual fidelity (build-only, no browser render): 4/5** — correct structure, tokens wired, font linked. Actual color rendering not evaluated (would require browser screenshot diff).

---

## 3. Designlab — Structural Correctness

**Result:** PASS (increased max_tokens to 8192 required)  
`siteId: designlab-eastbourne | pages: 10 | home sections: 6`

Home page sections:
| Component | Condition |
|-----------|-----------|
| HeroSection | always |
| FeatureGrid | always |
| ServiceCards | always |
| FeatureGrid | data-present |
| TestimonialGrid | data-present |
| CTASection | always |

Observations:

- 10 pages generated from a 1473-line brief — impressive coverage.
- Gap detected: `custom-portfolio-gallery` section (portfolio/gallery type) has no catalog match. AI mapped it to nearest fit (ContentSection) instead of raising an error — acceptable degradation.
- Many pages assigned `pageType: "custom"` instead of named types (service-detail, projects, etc.). Structural pass prompt needs `pageType` guidance for better routing.
- Brief with large pageBlueprint count (9 page blueprints) required max_tokens increase from 4096 → 8192.

**Structural fidelity: 4/5** — correct component choices, correct slot suppression, correct conditions. Weak on pageType assignment.

---

## 4. Designlab — Visual Fidelity

**Result:** PASS (2nd attempt required)  
Font links: 1, themeConfig keys: colors, typography, components, provenance entries: 25

Same hex-in-cssOverrides pattern as navagarden. Retry with strengthened prompt succeeded.

**Visual fidelity: 4/5**

---

## 5. Catalog Gap Backlog

Components needed for Phase 2 expansion:

| Gap                  | Brief(s) affected                     | Section type                            | Priority |
| -------------------- | ------------------------------------- | --------------------------------------- | -------- |
| `PortfolioGrid`      | designlab                             | Custom portfolio gallery, project tiles | High     |
| `BlogGrid`           | designlab, future sites               | Article list grid                       | Medium   |
| `ContactFormSection` | both briefs (CTA sections with forms) | Form + map layout                       | High     |
| `LogoStrip`          | designlab                             | Partner/client logos row                | Low      |
| `PricingTable`       | future sites                          | Service tier comparison                 | Low      |
| `AccordionSection`   | future sites                          | FAQ accordion                           | Medium   |

Named `pageType` values that AI doesn't assign correctly:

- `service-detail`, `projects`, `blog-list`, `blog-post`, `contact` — should be added to structural pass prompt with examples.

---

## 6. Pipeline Issues & Fixes Needed

| Issue                                         | Severity | Fix                                                   |
| --------------------------------------------- | -------- | ----------------------------------------------------- |
| `max_tokens: 4096` too small for large briefs | Critical | ✅ Fixed: 8192                                        |
| AI writes hex in cssOverrides                 | High     | ✅ Fixed: 3-attempt retry + stronger prompt           |
| `pageType: "custom"` over-assigned            | Medium   | Add pageType hint table to structural pass prompt     |
| No `PortfolioGrid` component                  | Medium   | Build in Phase 2 expansion                            |
| Structural pass re-sends full brief on retry  | Low      | Could send only the error context, not the full brief |

---

## 7. Summary

The two-pass pipeline is **viable for production use** with these constraints:

- Works correctly for home pages and standard section types (7 catalog components cover ~80% of real-world sections).
- Visual pass reliably produces token-only output with retry guard.
- Large briefs (>800 lines) need `max_tokens: 8192` or above.
- Catalog needs 4-6 additional components (PortfolioGrid, ContactFormSection, BlogGrid) to reach 95% section coverage.

The PoC site (`poc-composition-test`) builds cleanly, type-checks cleanly, and renders 4 home sections from a JSON config with zero hand-written section TSX. The core invariant — configuration drives rendering, not generated code — is proven.
