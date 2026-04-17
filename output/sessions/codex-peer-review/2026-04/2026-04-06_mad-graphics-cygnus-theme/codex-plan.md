# Codex Implementation Plan: Mad Graphics Cygnus Theme + Theme-First Pipeline

## 0. Scope Validation and Guardrails (before code changes)

1. Confirm baseline assumptions and identify mismatches in brief vs repo.

- Files to inspect:
  - `sites/mad-graphics/app/{page.tsx,services/page.tsx,about/page.tsx,locations/page.tsx,layout.tsx}`
  - `sites/cygnus-test/app/{page.tsx,services/page.tsx,about/page.tsx,locations/page.tsx}`
  - `tools/create-site-from-project.ts`
  - `sites/mad-graphics/content/locations/*.mdx`
- Verification gate:
  - Confirm we are on `develop`.
  - Confirm `sites/mad-graphics` has 19 location MDX files.
  - Confirm stitch image count discrepancy: repo currently has 26 files in `sites/cygnus-test/public/stitch-images` (brief says 28).

2. Record constraints that conflict with framework reality.

- Risk note to carry through implementation:
  - Brief says “named exports only (no default exports in TSX files)”, but Next.js App Router requires default exports for `app/**/page.tsx` and `layout.tsx`.
  - Plan: keep required default exports in route files and enforce named exports everywhere else.

---

## 1. Fix location title/SEO decoupling (Problem 2)

3. Update all Mad Graphics location frontmatter titles to bare town names while preserving SEO strings in `seoTitle`.

- Files modified:
  - `sites/mad-graphics/content/locations/alfriston.mdx`
  - `sites/mad-graphics/content/locations/battle.mdx`
  - `sites/mad-graphics/content/locations/bexhill-on-sea.mdx`
  - `sites/mad-graphics/content/locations/crowborough.mdx`
  - `sites/mad-graphics/content/locations/eastbourne.mdx`
  - `sites/mad-graphics/content/locations/hailsham.mdx`
  - `sites/mad-graphics/content/locations/hastings.mdx`
  - `sites/mad-graphics/content/locations/heathfield.mdx`
  - `sites/mad-graphics/content/locations/herstmonceux.mdx`
  - `sites/mad-graphics/content/locations/lewes.mdx`
  - `sites/mad-graphics/content/locations/newhaven.mdx`
  - `sites/mad-graphics/content/locations/peacehaven.mdx`
  - `sites/mad-graphics/content/locations/pevensey.mdx`
  - `sites/mad-graphics/content/locations/polegate.mdx`
  - `sites/mad-graphics/content/locations/ringmer.mdx`
  - `sites/mad-graphics/content/locations/seaford.mdx`
  - `sites/mad-graphics/content/locations/st-leonards-on-sea.mdx`
  - `sites/mad-graphics/content/locations/uckfield.mdx`
  - `sites/mad-graphics/content/locations/wadhurst.mdx`
- Transformation rule:
  - `title: "Vehicle Graphics & Signs in <Town>"` -> `title: "<Town>"`
  - Keep `seoTitle` unchanged.
- Why this is safe:
  - `layout.tsx` dropdown uses `loc.title`; this now becomes town-only labels.
  - Location detail metadata already prefers `seoTitle` for page `<title>` (`generateMetadata` in `app/locations/[slug]/page.tsx`), so SEO remains intact.

4. Validate downstream semantics after title change.

- Files to verify (read-only check unless needed):
  - `sites/mad-graphics/app/locations/[slug]/page.tsx`
  - `sites/mad-graphics/app/layout.tsx`
- Verification gate:
  - `rg -n '^title:' sites/mad-graphics/content/locations/*.mdx` shows only bare town names.
  - `rg -n '^seoTitle:' sites/mad-graphics/content/locations/*.mdx` still contains full SEO strings.
  - Manual check in dev: header Locations dropdown shows `Eastbourne`, `Hastings`, etc.

---

## 2. Port Cygnus visual page implementations into Mad Graphics (Problem 1)

5. Rebuild `mad-graphics` homepage from cygnus-test visual structure, but remove in-page nav/footer and route all styling through theme tokens.

- File modified:
  - `sites/mad-graphics/app/page.tsx`
- Implementation requirements:
  - Keep `layout.tsx`-provided `SiteHeader` + `Footer` only (no page-level `<header>`/`<footer>`).
  - Preserve cygnus aesthetic: image-overlay hero, dark sections, strong typography, testimonials/CTA band style.
  - Replace any hardcoded hex utilities in page TSX (`text-[#...]`, `bg-[#...]`, shadow rgba literals) with token-based classes (`text-brand-primary`, `bg-surface-background`, `border-surface-border`, etc.).
  - Ensure content reflects Mad Graphics business data (copy, CTAs, stats) and East Sussex-only coverage.

6. Rebuild `mad-graphics` services listing page to cygnus grid style with 8 services from site data.

- File modified:
  - `sites/mad-graphics/app/services/page.tsx`
- Decision/trade-off:
  - Use config/content-driven cards (from `getServices()` / `siteConfig.services`) rendered in cygnus visual layout rather than 6 hardcoded stitch cards.
  - Reason: preserves theme look while scaling to 8 real services and avoids content drift.
- Constraint handling:
  - Exclude/avoid “Vinyl Wrapping” (non-offer for Mad Graphics).
  - No hardcoded hex in TSX.

7. Rebuild `mad-graphics` about page with cygnus visual language but siteConfig-driven narrative.

- File modified:
  - `sites/mad-graphics/app/about/page.tsx`
- Decision/trade-off:
  - Keep cygnus composition motifs (dark hero, strong section contrasts, values/trust band/CTA treatment) but map content to `siteConfig.about`, `siteConfig.credentials`, and business details.
  - Do not port cygnus-test fake team identities (Martin/Sarah/etc.).
- Constraint handling:
  - Remove in-page nav/footer from imported design.
  - Replace inline style gradients/hex with tokenized classes.

8. Redesign `mad-graphics` locations listing page to match cygnus card aesthetic (not `ContentGrid`).

- File modified:
  - `sites/mad-graphics/app/locations/page.tsx`
- Implementation shape:
  - Keep existing metadata + schema patterns.
  - Replace generic `ContentGrid` with image-forward card grid style aligned with services page.
  - Cards should link to `/locations/[slug]`, display bare `location.title`, and short description.

9. Verify hardcoded color removal in listing/index pages.

- Verification gate:
  - `grep -r 'text-\[#' sites/mad-graphics/app/page.tsx sites/mad-graphics/app/services/page.tsx sites/mad-graphics/app/about/page.tsx sites/mad-graphics/app/locations/page.tsx`
  - `grep -r 'bg-\[#\|border-\[#\|from-\[#\|to-\[#\|style={{' sites/mad-graphics/app/page.tsx sites/mad-graphics/app/services/page.tsx sites/mad-graphics/app/about/page.tsx sites/mad-graphics/app/locations/page.tsx`
  - Both should return no matches (or only approved exceptions explicitly documented).

---

## 3. Provide stitch image assets for Mad Graphics pages

10. Add cygnus stitch image assets under Mad Graphics public directory.

- Files created:
  - `sites/mad-graphics/public/stitch-images/*` (copied from `sites/cygnus-test/public/stitch-images/*`)
- Decision:
  - Copy assets, not symlink. This avoids deployment portability issues on Vercel and keeps site self-contained.
- Scope gap callout:
  - Current source has 26 files, not 28. Proceed with available 26 and flag discrepancy.

11. Verify image availability for referenced routes.

- Verification gate:
  - `find sites/mad-graphics/public/stitch-images -type f | wc -l` equals source count.
  - `rg -n '/stitch-images/' sites/mad-graphics/app/{page.tsx,services/page.tsx,about/page.tsx,locations/page.tsx}` references only existing files.

---

## 4. Refactor site creation to theme-first visual pipeline (Problem 3)

12. Extend theme support in generator from `{vega, orion}` to all installed theme variants, including `cygnus`.

- File modified:
  - `tools/create-site-from-project.ts`
- Change details:
  - Replace binary `themeVariant === 'orion' ? ... : vega` logic in `generateThemeConfig()` with a typed map/switch supporting: `vega`, `orion`, `cygnus`, `lyra`, `nova`, `atlas`, `rigel`.
  - Registry import/ref should derive from map:
    - e.g. `cygnus -> import { cygnusRegistry } from '@platform/themes/cygnus'`.

13. Add theme-to-reference-site mapping and page override copy phase.

- File modified:
  - `tools/create-site-from-project.ts`
- New constants/functions:
  - `THEME_REFERENCE_SITE_MAP`:
    - `cygnus: 'cygnus-test'`
    - `orion: 'dj-fox-electrical'`
    - `vega: 'base-template'`
  - Themes without entry (`lyra`, `nova`, `atlas`, `rigel`) implicitly fallback to base-template.
  - `THEMED_PAGE_PATHS`:
    - `app/page.tsx`
    - `app/services/page.tsx`
    - `app/about/page.tsx`
    - `app/locations/page.tsx`
  - `applyThemePageOverrides(themeVariant, siteDir, options)` to copy these page files from reference site after base-template copy.
- Pipeline order:
  - Keep base-template full copy first (capability infrastructure source of truth).
  - Apply themed page overrides immediately afterward.
  - Then generate `site.config.ts`, `theme.config.ts`, `README`, manifest.

14. Update architecture docs to reflect new theme-first visual behavior.

- File modified:
  - `docs/architecture/how-site-creation-works.md`
- Doc updates:
  - Clarify “base-template provides capability infrastructure” vs “theme reference site provides visual index/listing pages when available”.
  - Document fallback behavior for themes with no reference site.

15. Verify generator behavior for cygnus and fallback themes.

- Verification gate:
  - Run dry-run generation with a project JSON using `themeVariant: 'cygnus'`; verify logs indicate cygnus registry and themed page override source `sites/cygnus-test`.
  - Run dry-run generation with `themeVariant: 'lyra'`; verify fallback log to base-template pages, no failure.
  - Optionally compare generated `app/page.tsx` structure for cygnus scaffold vs base-template scaffold to confirm non-generic hero layout.

---

## 5. Cross-repo validation gates

16. Validate Mad Graphics workspace first (fast feedback).

- Commands:
  - `cd sites/mad-graphics && npm run type-check && npm run build`
- Gate:
  - Both succeed.

17. Validate monorepo correctness.

- Commands:
  - `pnpm type-check`
  - `pnpm build`
- Gate:
  - Root type-check passes; build passes without regressions in unaffected sites.

18. UX verification sweep (manual, targeted).

- Pages to spot-check in dev:
  - `/`
  - `/services`
  - `/about`
  - `/locations`
- Checks:
  - No duplicate header/footer (layout-only chrome).
  - Dark cygnus aesthetic is present on all four pages.
  - Locations nav dropdown labels are town-only.
  - No Brighton / west-of-Peacehaven references in new copy.

---

## Risks and Trade-offs

1. Visual fidelity vs maintainability on cygnus ports.

- Risk: strict hand-port from cygnus-test can reintroduce hardcoded values and brittle content.
- Mitigation: use cygnus layout language, but drive repeated content from site config/content collections.

2. Theme token coverage gaps.

- Risk: some stitch visuals may rely on shades not represented by current tokens.
- Mitigation: first attempt composition with existing tokens/utilities (`surface`, `brand`, opacity variants). Only propose token expansion if a specific visual requirement cannot be achieved.

3. Generator complexity creep.

- Risk: adding many ad hoc conditionals in `create-site-from-project.ts` (~1,100 lines) increases maintenance cost.
- Mitigation: introduce explicit maps and small helper functions (`resolveThemeRegistry`, `resolveReferenceSite`, `applyThemePageOverrides`) with structured logs.

4. Asset licensing/provenance ambiguity.

- Risk: stitch images are currently “reference” assets; ownership/use for production should be explicit.
- Mitigation: treat copied images as temporary approved placeholders unless content/design owner confirms permanent usage; record in PR notes.

5. Brief mismatch on stitch image count.

- Risk: acceptance may assume 28 assets when repository currently has 26.
- Mitigation: log exact observed count during implementation and proceed with available assets; avoid blocking functional delivery.
