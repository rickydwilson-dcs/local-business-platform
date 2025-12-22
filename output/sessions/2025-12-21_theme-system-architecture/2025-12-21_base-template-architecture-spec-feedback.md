# Feedback on Base Template & Theme System Spec (for Claude)

This note captures concerns and recommendations to adjust the spec before implementation.

## Major Gaps and Risks

- Dark mode not modeled: add mode-aware tokens (`:root` + `.theme-dark` or `prefers-color-scheme`), and ensure Tailwind plugin can emit per-mode vars. VRT should cover both modes.
- Token surface too narrow: no spacing scale, type scale, shadows, transitions, opacity, z-index, or motion tokens. Components will keep hardcoded values and block theming.
- Typography incomplete for self-hosted fonts: only family defined; missing weights, sizes, line heights, and letter spacing per text style. Need @font-face pipeline with preload and `font-display: swap`.
- Validation missing: no WCAG contrast checks or token validation CLI; no snapshot tests for CSS generation (light/dark). Lint rule to forbid raw hex in core components would prevent regressions.
- Overrides unclear: requirement says sites can override components, but no alias/shadowing pattern defined. Precedence rules and DX need documenting.
- Content/config drift: SEO fields live both in `site.config.ts` and MDX frontmatter. Ownership is undefined, inviting divergence. Same for block-based layout metadata.
- CI canary is build-only: no visual regression gate for base-template. No rollback/feature-flag plan for colossus-reference migration.
- Defaults/fallbacks: missing-token behavior unspecified; muted foreground var in types but not mapped in Tailwind table—risk of silent gaps.
- Security/consent: contact form defaults lack anti-spam/rate-limit/consent baseline; env var requirements not codified.

## Recommendations

- Theme modes: add a mode schema (`modes.light`, `modes.dark`) and plugin support to emit both; allow opt-out of multi-brand but document scope.
- Token set: introduce base scales for spacing, radii, shadows, transitions, opacity, z-index, and motion; extend typography with weights/sizes/line heights/letter spacing and map all into Tailwind.
- Font handling: define a self-hosted font manifest, generate @font-face with preload hints, and set `font-display: swap`; document privacy posture.
- Validation and tests: add a theme validation CLI (type + WCAG contrast for key pairs per mode), snapshot tests for CSS output, and lint to ban raw color literals in core components.
- Overrides: document component shadowing via per-site `components/` alias that resolves before core, with precedence rules and examples.
- Content ownership: decide block schema and which fields are sourced from `site.config` vs MDX; consider generating frontmatter from config to avoid drift.
- CI/CD: add base-template VRT (light/dark) before other site builds; cache `.next/cache` and deps to stay within time budget; add feature flag for colossus-reference rollout and rollback steps.
- Defaults and fallbacks: merge configs with defaults, warn on missing tokens, and ensure every token in `ThemeConfig` is mapped in CSS and Tailwind (including muted foreground).
- Security baseline: ship contact form with rate-limit/spam protection and consent banner defaults; list required env vars in checklist.

## Notes on Assumptions

- Multi-brand: out of scope for now; design schema to remain extendable.
- Layouts: block-based approach assumed; ensure block schema is expressed in config/content guidance.
