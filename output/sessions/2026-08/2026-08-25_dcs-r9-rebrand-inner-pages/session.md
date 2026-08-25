# DCS — rebuild the 14 inner routes + shared chrome in the r9 brand; reclassify the NP Racing post; add real blog/project hero images

**Status:** spec — not started
**Site:** `sites/dcs` only
**Written:** 2026-08-25

---

## Background (verified, not assumed)

- The DCS homepage (`/`) shipped on the new **r9** brand 2026-08-23 (`output/sessions/2026-08/2026-08-23_dcs-homepage-nextjs-port/`). That brief explicitly deferred the 14 inner routes: _"Restyling any inner page... keep the solaris look for now."_
- Those 14 routes (`about`, `blog`, `blog/[slug]`, `contact`, `cookie-policy`, `locations`, `locations/[slug]`, `pricing`, `privacy-policy`, `projects`, `projects/[slug]`, `reviews`, `services`, `services/[slug]`, `terms-and-conditions`) all share one layout — `app/(site)/layout.tsx` — which renders `SiteHeader`/`SiteFooter` from `components/site-header.tsx` / `components/site-footer.tsx` inside `PageShell`. They're still on the **solaris** theme: teal `#61A3BA` primary, lime `#D2DE32` accent, Inter/Space Grotesk (`theme.config.ts`).
- The r9 palette (ink `#0E0E12`, paper `#ECEBE9`, magenta `#D6006B`, aqua `#00D2D8`, navy `#17265E`, grey `#70707B`) already exists in `theme.config.ts` under `colors.custom.*` — emitted as `--color-ink` etc. — but is wired up **only** for the homepage's own bespoke, verbatim-ported stylesheet (`styles/home-r9.css` + `home-r9-reset.css`), not the platform's generic `colors.brand.*` / `colors.surface.*` tokens that `bg-brand-primary`, `text-surface-foreground` etc. resolve to. The Archivo/Poppins fonts are already loaded globally in `app/layout.tsx` (`next/font/google`), alongside the old Inter/Space Grotesk — this is a "point inner pages at the fonts that already exist," not a new font-loading job.
- `app/(site)/layout.tsx` sets `robots: { index: false, follow: false }` for all 14 routes. This is **not** an oversight — it's a deliberate hold from the separate SiteGround→Vercel cutover project (`output/sessions/2026-08/2026-08-23_dcs-site-cutover/cutover-plan.md`, status: plan, not started), whose own Phase 0 decision #2 ("ship, noindex, or drop each section") is what will eventually change it. **This spec does not touch that flag.**
- A same-day session (`output/sessions/2026-08-25_dcs-npracing-pagespeed-post/`) added `content/blog/a-fast-team-needs-a-fast-website.mdx` — a client case study (NP Racing's PageSpeed scores) — as a blog post. Reviewing all 21 blog posts confirmed it's the only one that's actually a project case study; the other 20 are genuine generic tradesperson-advice content, correctly categorized.
- Content audit findings (verified by reading files, not inferred):
  - **Images:** 15 of 21 blog posts set `heroImage: "placeholder/blog-*.webp"` — paths that don't exist anywhere (not in `public/`, not on R2). 6 posts, including the NP Racing one, have no `heroImage` key at all. **Zero of 13 existing `content/projects/*.mdx` files have any image field set.** Separately, neither `BlogPage.tsx`/`BlogPostPage.tsx` nor `ProjectsPage.tsx`/`ProjectDetailPage.tsx` (the DCS-local page components) actually render a hero image at all right now, even though the shared type (`packages/core-components/src/lib/page-template-types.ts`) already declares `heroImage?: string` on both `BlogPostPageTemplateProps.frontmatter` and `ProjectDetailPageTemplateProps.frontmatter`. So this is a rendering gap as well as a content gap.
  - **Schema drift:** `BlogFrontmatterSchema` in `packages/core-components/src/lib/content-schemas.ts` defines `category` as an enum of `industry-tips | how-to-guide | case-study | seasonal | news`. Every one of the 21 DCS posts uses a different, more specific freeform value (`local-seo`, `website-design`, `costs-and-value`, `getting-found-online`, `industry-guides`, `website-content`, `business-tools`). None of them would pass `BlogFrontmatterSchema.parse()`.
  - **No blog validation exists at all.** Both `scripts/validate-content.ts` (root) and `sites/dcs/scripts/validate-content.ts` only handle `service` and `location` content types. There is no `blog` case in either file — a prior session's claim that `validate-content.ts blog` "passes" was checked and is **not true**; that command doesn't do anything for blog content. Same story for `projects` — also unhandled.
  - **`content/projects/` uses a different, simpler shape than the shared `ProjectFrontmatterSchema`.** The shared schema (same file, `ProjectFrontmatterSchema`) requires `projectType`, `category` (a scaffolding/plumbing/graphics/garden enum), `location`, `locationName`, `completionDate` — built for physical trade projects. DCS's actual 13 project files use a much simpler local shape: `title, description, date, tags, outcomes` (+ unused `heroImage`), matching `ProjectDetailPageTemplateProps`, not the Zod schema. **The NP Racing project file must match this simpler DCS-local shape, not `ProjectFrontmatterSchema`.**
  - `components/pages/HomePage.tsx` (416 lines, solaris-styled) is dead code — `app/page.tsx` defines its own local `HomePage` function backed by `components/home/home-body.tsx`. Not in this spec's scope to delete; noted as a finding only.

## Decisions made (2026-08-25, Ricky)

1. **Rebuild**, not a token-only recolor — each inner page's components get rebuilt to the r9 visual language, not just repainted via a config swap.
2. **Promote r9 to real platform theme tokens.** Replace `theme.config.ts`'s `colors.brand.*` / `colors.surface.*` / `colors.semantic.*` (currently solaris teal/lime) with the r9 palette, and update `typography.fontFamily` to point at the Archivo/Poppins font variables already loaded in `app/layout.tsx`. This is the platform's own stated architecture (`CLAUDE.md`: "never hardcode hex colors... always use theme tokens") and keeps DCS re-themeable from one config file, the same as every other site. The homepage's own `home-r9.css`/`home-r9-reset.css` is **not** touched — it's already shipped and pixel-verified against the prototype; this only affects the 14 inner routes + shared chrome, which have no such reference to preserve. `colors.custom.*` can stay if anything homepage-specific still needs it directly, but the inner-page rebuild should consume the promoted `brand`/`surface`/`semantic` tokens, not `colors.custom.*`, so it behaves like every other themed page on the platform.
3. **NP Racing PSI post moves from blog to a project case study** — it's client-specific and outcome-driven like every other file in `content/projects/`, not generic advice.

## Scope

### In scope

**A. Token promotion (do first — everything else depends on it)**

1. In `sites/dcs/theme.config.ts`: replace `colors.brand.primary/primaryHover/secondary/accent/onPrimary`, `colors.surface.*`, and `colors.semantic.*` with r9-derived values (ink/paper/magenta/aqua/navy/grey), choosing sensible primary/accent/surface role mappings. Update `typography.fontFamily.sans`/`heading` to reference the Archivo/Poppins `next/font` CSS variables already declared in `app/layout.tsx`.
2. Run the theme system's WCAG contrast validator (`pnpm --filter @platform/theme-system validate --config ../../sites/dcs/theme.config.ts`) against the new values before building anything on top of them. Magenta/aqua on light or dark surfaces is not guaranteed AA — fix token values here, not by special-casing components later.
3. Check `sites/dcs/app/globals.css` for any hardcoded solaris-specific values (`btn-primary`, `section-dark-accent`, or similar classes inherited from the old Theme Component Contract era) that need updating to read from the new tokens — the CI validator for that contract was retired, so this has to be checked by hand.

**B. Shared chrome rebuild** 4. Rebuild `components/site-header.tsx` and `components/site-footer.tsx` in the r9 visual language (use the homepage's `components/home/site-bar.tsx` and `components/home/mobile-menu.tsx` as the _visual_ reference for nav treatment — not literal reuse, since those are homepage-specific single-page-scroll components with anchor-link behavior that doesn't apply to a multi-route header).

- **Known gotcha to carry forward** (already documented in this repo's `CLAUDE.md`): a `fixed inset-0` mobile-nav dialog must never nest inside a `backdrop-blur-*` or `transform` ancestor — render it as a sibling or portal to `document.body`.

5. `app/(site)/layout.tsx`: update `PageShell` usage as needed for the new header/footer; **do not touch the `robots` export.**

**C. Inner page rebuild (14 routes)** 6. Rebuild each of: `AboutPage.tsx`, `BlogPage.tsx`, `BlogPostPage.tsx`, `ContactPage.tsx`, `LocationsPage.tsx`, `LocationDetailPage.tsx`, `ProjectsPage.tsx`, `ProjectDetailPage.tsx`, `ReviewsPage.tsx`, `ServicesPage.tsx`, `ServiceDetailPage.tsx`, plus the inline `app/(site)/pricing/page.tsx` (no dedicated component today), all against the promoted tokens. 7. `components/legal/legal-hero.tsx` and `legal-toc.tsx` are shared by `privacy-policy`, `cookie-policy`, and `terms-and-conditions` — rebuild these two once; all three legal routes inherit it. 8. **Pricing page carries a known typographic trap** (already documented in `CLAUDE.md`): comma'd prices (£1,995-style, and this page has £750/£45/mo etc.) must never sit on `tabular-nums` or a monospace face — keep them on the Archivo/grotesk body face. `components/home/pricing.tsx` already carries a comment about this for the homepage; the rebuilt inner pricing page must honor the same rule. 9. While rebuilding `BlogPostPage.tsx` and `ProjectDetailPage.tsx`, add actual rendering for `frontmatter.heroImage` (the type already supports it, nothing renders it) — same for the `BlogPage.tsx`/`ProjectsPage.tsx` list views (thumbnail in the card). Use `next/image`, R2-hosted, per `docs/standards/images.md` (quality 58 for card/content images, explicit width/height, descriptive alt).

**D. Reclassify the NP Racing post** 10. Move `content/blog/a-fast-team-needs-a-fast-website.mdx` → `content/projects/npracing.mdx` (or equivalent slug), reshaping frontmatter to the **DCS-local project shape** (`title, description, date, tags, outcomes`, plus the new `heroImage` field from item 9) — **not** the shared `ProjectFrontmatterSchema`, which doesn't apply here (see Background). Keep the body content; the PSI graphic already produced this session becomes its `heroImage`. Remove it from the blog listing/sitemap; confirm it appears correctly in the projects listing/detail route.

**E. Blog/project image backfill** 11. Wire up real hero images for the remaining 20 blog posts (NP Racing's is handled by item 10). Proposed default approach, for review before it ships rather than a hard prerequisite: - **Screenshot-based** for the two posts that map to a real, topically-matching DCS client site: `best-websites-for-electricians` → DJ Fox Electrical, `best-websites-for-scaffolding-companies` → Colossus Scaffolding. - **A small set of reusable, r9-branded category graphics** (roughly one per `category` value, ~7 total) for the other 18 generic-advice posts, rather than 18 bespoke one-off images — proportionate to what these posts are (educational content, not case studies). - Upload to R2 under `dcs/blog/...` per the naming convention in `docs/standards/images.md`; update each post's `heroImage` frontmatter to the real path; delete the dead `placeholder/blog-*.webp` values. - **This ships as part of the session** (Ricky's decision, 2026-08-25) — generate, upload to real R2, update MDX frontmatter, and commit, rather than stopping at a proposal. R2 write credentials (`R2_ACCOUNT_ID`/`R2_ACCESS_KEY_ID`/`R2_SECRET_ACCESS_KEY`/`R2_BUCKET_NAME`) are confirmed present with real, non-empty values in the root `.env.local` (verified 2026-08-25, after correcting an earlier false negative in the same session) — the same config the live site already uses to serve R2 images. The YOLO brief still re-checks this live in whatever environment actually executes the phase, purely as a guard (a fresh checkout might not have `.env.local` copied over, since it's gitignored), not because credentials are expected to be missing. 12. Existing `content/projects/*.mdx` files (the other 12) have no images either — **out of scope for this session** (see below); note as backlog.

**F. Schema and validation fixes** 13. Resolve the `BlogCategory` enum mismatch in `packages/core-components/src/lib/content-schemas.ts` — expand the enum to include the values actually in use (`local-seo`, `website-design`, `costs-and-value`, `getting-found-online`, `industry-guides`, `website-content`, `business-tools`) rather than rewriting 21 files' content to fit a narrower enum that loses useful specificity. **Check for other sites' blog content before changing shared platform code** — a change here is global, not DCS-only. 14. Add a real `blog` case (and, if cheap to do at the same time, a `project` case matching the DCS-local shape) to `scripts/validate-content.ts` and/or `sites/dcs/scripts/validate-content.ts`, so this content is actually checked going forward instead of silently unvalidated.

### Out of scope — do not do these

- The homepage (`/`) — already on r9, not touched, and `home-r9.css`/`home-r9-reset.css` stay exactly as shipped.
- The `robots: { index: false, follow: false }` flag in `app/(site)/layout.tsx` — owned by the site-cutover project. Do not flip any route to indexable as a side effect of rebranding it.
- The DNS/domain cutover and its redirect map (`next.config.ts` `redirects()`, `cutover-plan.md`) — entirely separate project.
- Rewriting the prose/content of the 20 generic blog posts — only frontmatter (`category` normalization, `heroImage`) and rendering change, not the body copy, unless a fact is found to be wrong (flag, don't silently rewrite).
- Deleting `components/pages/HomePage.tsx` — flagged as dead code, not removed here; a deliberate cleanup pass is a separate job.
- Backfilling images for the other 12 pre-existing `content/projects/*.mdx` files — noted as backlog, not this session.
- Any site other than `sites/dcs`. Token/component changes stay inside `sites/dcs/theme.config.ts` and `sites/dcs/components/**` — dcs is self-contained (no `packages/themes/*` imports) per this repo's site self-containment migration, so this cannot leak to other sites. The one shared-code touch is item 13 (`BlogCategory` enum in `packages/core-components`), which must be checked against other sites' blog content before changing.
- Instagram/social publishing — unrelated to this spec.

## Acceptance criteria / gates

- `pnpm --filter @platform/theme-system validate --config ../../sites/dcs/theme.config.ts` passes (WCAG AA) on the new tokens.
- `pnpm --filter @platform/dcs run lint` and `npm run type-check` (from `sites/dcs/`) both pass.
- `npm run build` (webpack, per this repo's CI rule — no Turbopack for production builds) succeeds for `sites/dcs`.
- All 14 inner routes render correctly in a real browser at both mobile and desktop widths — visually verified (screenshot + read back), not just "it compiled." Check the mobile nav specifically against the `backdrop-blur`/`fixed inset-0` trap.
- The rebuilt pricing page's comma'd prices are visually confirmed _not_ to show the `£1 , 995`-style gap (check computed `font-variant-numeric` and `font-family` up the ancestor chain, not just the page's own CSS).
- `content/projects/npracing.mdx` renders correctly on `/projects` (listing) and `/projects/npracing` (detail), including its hero image.
- The moved post no longer appears under `/blog` or `/blog/a-fast-team-needs-a-fast-website` (confirm the route 404s or is genuinely gone, not orphaned).
- New/updated `scripts/validate-content.ts` blog (and project, if included) case runs clean against all current content.
- `robots` metadata in `app/(site)/layout.tsx` is byte-for-byte unchanged (diff it explicitly as a gate, given how easy it'd be to "helpfully" flip it while touching that file).
- Git workflow followed per root `CLAUDE.md`: branch off `develop`, commit, push, verify CI (`gh run watch`) — no direct pushes to `staging`/`main`.

## Files this touches (non-exhaustive but the core set)

```
sites/dcs/theme.config.ts
sites/dcs/app/globals.css
sites/dcs/app/(site)/layout.tsx
sites/dcs/components/site-header.tsx
sites/dcs/components/site-footer.tsx
sites/dcs/components/legal/legal-hero.tsx
sites/dcs/components/legal/legal-toc.tsx
sites/dcs/components/pages/AboutPage.tsx
sites/dcs/components/pages/BlogPage.tsx
sites/dcs/components/pages/BlogPostPage.tsx
sites/dcs/components/pages/ContactPage.tsx
sites/dcs/components/pages/LocationsPage.tsx
sites/dcs/components/pages/LocationDetailPage.tsx
sites/dcs/components/pages/ProjectsPage.tsx
sites/dcs/components/pages/ProjectDetailPage.tsx
sites/dcs/components/pages/ReviewsPage.tsx
sites/dcs/components/pages/ServicesPage.tsx
sites/dcs/components/pages/ServiceDetailPage.tsx
sites/dcs/app/(site)/pricing/page.tsx
sites/dcs/content/blog/a-fast-team-needs-a-fast-website.mdx  (moved out)
sites/dcs/content/projects/npracing.mdx  (new)
sites/dcs/content/blog/*.mdx  (20 remaining — heroImage + category frontmatter only)
packages/core-components/src/lib/content-schemas.ts  (BlogCategory enum)
scripts/validate-content.ts
sites/dcs/scripts/validate-content.ts
```

## Open questions for the YOLO brief to surface, not resolve unilaterally

1. Exact primary/accent/surface role mapping when promoting r9 tokens (e.g., is magenta the new `brand.primary` or `brand.accent`? does `surface.background` become paper or white?) — a reasonable default should be proposed and applied, but this is a visual-identity call worth a quick screenshot check-in rather than silent judgment.
2. The image-sourcing plan in item 11 ships automatically (screenshot the two matching client sites, category graphics for the rest) rather than pausing for review — reasonable defaults are applied directly. R2 credentials are confirmed present, so this is expected to complete; if the execution environment somehow lacks them, that's a hard stop rather than a silent partial ship (see item 11).
3. Whether `BlogCategory` enum expansion (item 13) has any effect on other sites currently — needs an explicit check, not an assumption, before merging.
