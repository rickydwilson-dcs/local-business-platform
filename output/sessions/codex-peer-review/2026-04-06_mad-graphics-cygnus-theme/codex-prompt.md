# Codex Peer Review Prompt

Paste this entire file into Codex in VS Code.

---

## Your task

You are doing an independent architectural peer review. Read the brief below, then produce your own implementation plan.

Save your plan as `codex-plan.md` in this folder:
`output/sessions/codex-peer-review/2026-04-06_mad-graphics-cygnus-theme/`

When done, output this exact command so the user can copy-paste it into Claude Code:

```
/plan.with.codex synthesise
```

---

## Brief: Mad Graphics — Full Cygnus Theming + Theme-First Pipeline

**Date:** 2026-04-06
**Project:** Local Business Platform monorepo
**Note:** This brief is sent to both Claude and Codex independently. Your plans will be synthesised into a final implementation spec. Do not look at `claude-plan.md` before writing your own plan.

Note: no clarified brief.md was produced for this topic. Challenge assumptions accordingly and flag any scope gaps you identify.

---

### Problem Statement

Three related problems need solving:

**Problem 1 — Mad Graphics looks wrong on Vercel**

`sites/mad-graphics` was scaffolded from `sites/base-template` (a generic, platform-component-driven template). The correct starting point was `sites/cygnus-test`, which contains handcrafted Stitch-derived page implementations (homepage, services, about) that define the visual identity of the Cygnus theme.

The result: the live Vercel site at https://mad-graphics.vercel.app uses a generic layout (centered hero, platform ContentGrid for services, plain about page) while the local `cygnus-test` reference running on port 3002 shows the correct dark, bold, Stitch-designed cygnus aesthetic (full-screen image-overlay hero, 6-card services grid with image cards, testimonials, italic headings, custom CTA band).

The `locations/page.tsx` and `locations/[slug]/page.tsx` in both sites are identical platform-driven pages — these do NOT need replacing, but the locations listing page should match the cygnus visual design (image card grid style similar to services page, not the generic `ContentGrid` component).

**Problem 2 — Location nav dropdown shows full SEO titles**

The `SiteHeader` `LocationsDropdown` populates from `loc.title` fetched from MDX content. The Mad Graphics location MDX files use SEO titles as their `title` field:
- `title: "Vehicle Graphics & Signs in Eastbourne"` → shown in nav as "Vehicle Graphics & Signs in Eastbourne"

This is visual noise. The nav should show bare town names only: `"Eastbourne"`, `"Hastings"`, etc.

The MDX files have `seoTitle` for the full SEO string. The `title` field is being overloaded with SEO content. This needs decoupling.

**Problem 3 — Site creation pipeline is base-template-first, not theme-first**

`tools/create-site-from-project.ts` always copies `sites/base-template` and then patches `theme.config.ts`. The base-template pages are vega-style (light theme, centered layouts). No matter what theme is requested, the new site gets vega page implementations.

The correct model: the **capability infrastructure** (API routes, lib shims, config structure, content validation, analytics, consent, observability) should come from `base-template`. The **visual page implementations** (`app/page.tsx`, `app/services/page.tsx`, `app/about/page.tsx`, `app/locations/page.tsx`) should come from the named theme's reference site.

Currently available reference sites per theme:
- `cygnus` → `sites/cygnus-test`
- `orion` → `sites/dj-fox-electrical`
- `vega` → `sites/base-template` (unchanged)
- `lyra`, `nova`, `atlas`, `rigel` → no reference site yet (graceful fallback to base-template pages)

---

### Goals

1. `sites/mad-graphics` homepage, services page, about page, and locations listing page look identical to `sites/cygnus-test` equivalents, adapted for Mad Graphics' actual business data
2. No hardcoded hex colors in any ported pages — all colors use theme tokens (e.g. `text-brand-primary` not `text-[#f7941d]`)
3. No custom `<header>` or `<footer>` inside page files — `layout.tsx` handles these via `PageShell`
4. Location nav dropdown shows `"Eastbourne"`, `"Hastings"`, etc. — not `"Vehicle Graphics & Signs in Eastbourne"`
5. `create-site-from-project.ts` uses theme reference site pages when a reference exists; falls back to base-template pages when none exists
6. All 19 Mad Graphics location MDX files have a `locationName` field (bare town name); `title` and `seoTitle` remain unchanged
7. `pnpm type-check` and `pnpm build` pass across the monorepo after all changes

---

### Non-Goals

- Do NOT change `layout.tsx`, `theme.config.ts`, `globals.css`, `tailwind.config.ts` — these are already correct
- Do NOT change `[slug]/page.tsx` files for services, locations, blog, projects — only the listing/index pages
- Do NOT add new theme packages (lyra, nova, atlas, rigel reference sites are future work)
- Do NOT change cygnus-test pages — treat them as read-only reference source
- Do NOT migrate to `next/image` for hero images — out of scope
- Do NOT change shared platform components in `packages/core-components`
- Do NOT modify `sites/dj-fox-electrical` or `sites/colossus-scaffolding`

---

### Acceptance Criteria

1. Running `npm run dev` in `sites/mad-graphics` shows the cygnus visual design (dark background, orange accent, full-screen overlay hero, image card services grid)
2. The Locations nav dropdown shows `"Eastbourne"` not `"Vehicle Graphics & Signs in Eastbourne"` for all 19 locations
3. `sites/mad-graphics/content/locations/*.mdx` — each file has `locationName: "Eastbourne"` (bare town); `title` and `seoTitle` remain unchanged
4. `npm run type-check && npm run build` passes in `sites/mad-graphics`
5. `pnpm type-check` passes at monorepo root
6. Running `create-site-from-project.ts` with `theme: "cygnus"` in the project JSON produces a site whose `app/page.tsx` matches the cygnus-test visual structure (not base-template's centered hero)
7. Running `create-site-from-project.ts` with `theme: "lyra"` (no reference site) still works — falls back to base-template pages
8. `grep -r 'text-\[#' sites/mad-graphics/app/page.tsx` returns no matches (no hardcoded hex in pages)

---

### Constraints

- **MDX-only content** — all content in MDX files, no centralized TypeScript data files
- **Theme tokens only** — no hardcoded hex in component/page TSX files
- **Named exports only** — no default exports in any TSX files
- **No `<header>`/`<footer>` in page files** — layout.tsx provides these via PageShell
- **No vehicle wraps** — Mad Graphics does not offer full vehicle wraps; do not include "Vinyl Wrapping" in any Mad Graphics service cards
- **Geographic constraint** — Mad Graphics covers East Sussex only; no Brighton/towns west of Peacehaven
- **Stitch images** — `sites/cygnus-test/public/stitch-images/` contains 28 images (`img-001.jpg` through `img-026.jpg`). These need to be available in `sites/mad-graphics/public/stitch-images/` for the ported pages to render images
- **Git workflow** — all changes on `develop` branch; do not push to staging/main directly
- **pnpm workspaces** — run `pnpm install` after any package.json changes

---

### Relevant Architecture

**How the theme system works:**
- Each theme package (`packages/themes/cygnus/`) exports a `ComponentRegistry` and `DeepPartialThemeConfig`
- Sites import the registry into `theme.config.ts`, `layout.tsx` (ThemeProvider), and `tailwind.config.ts` (createThemePlugin)
- `createThemePlugin(themeConfig)` in Tailwind injects CSS custom properties (e.g. `--color-brand-primary`)
- Tailwind utility classes (`bg-brand-primary`, `text-surface-foreground`) reference these CSS variables
- The cygnus globals.css (`packages/themes/cygnus/globals.css`) defines utility classes like `btn-primary`, `btn-outline`, `.card`, `.section`

**How the locations dropdown works:**
- `layout.tsx` fetches all location content via `getContentItems('locations')`
- Maps to `{ name: loc.title, slug: loc.slug }` array
- Passes as `locations` prop to `SiteHeader`
- `SiteHeader` passes to `LocationsDropdown` component
- Dropdown renders `location.name` as the visible label
- **The bug:** `loc.title` = `"Vehicle Graphics & Signs in Eastbourne"` because the MDX `title` field is overloaded with SEO content
- **The fix (decided):** Add a new `locationName` frontmatter field (bare town name: `"Eastbourne"`) to each location MDX file. Keep `title` unchanged — it drives the page `<h1>` and breadcrumb text. Change `layout.tsx` location mapping from `name: loc.title` → `name: loc.locationName ?? loc.title`. The nav shows `"Eastbourne"`, the page heading stays `"Vehicle Graphics & Signs in Eastbourne"`. This is the cleanest decoupling — the `locationName` field is the canonical display name for nav/UI contexts; `title` and `seoTitle` remain SEO-optimised.

**How site creation works:**
- `tools/create-site-from-project.ts` (~1,117 lines) — reads project JSON, copies base-template, generates site.config.ts + theme.config.ts
- `project.theme.themeVariant` field selects between `vegaRegistry` and `orionRegistry` — cygnus is not yet handled
- The generated `theme.config.ts` is written from a template string, not copied from a theme reference
- Page files (`app/page.tsx` etc.) are always copied verbatim from `sites/base-template` — there is no theme-based page selection

**How MDX content drives pages:**
- All content in `content/services/`, `content/locations/`, `content/blog/`, `content/projects/`, `content/testimonials/`
- Dynamic routes (`[slug]/page.tsx`) call `generateStaticParams()` using `getServices()`, `getLocations()` etc.
- Frontmatter fields: `title`, `seoTitle`, `description`, `hero`, `breadcrumbs`, `faqs`

---

### Codebase Snapshot

**Key files:**

| File | What it contains |
|------|-----------------|
| `sites/cygnus-test/app/page.tsx` | Reference homepage — cygnus visual design (510 lines, fully hardcoded) |
| `sites/mad-graphics/app/page.tsx` | Current homepage — base-template style (275 lines, platform components) |
| `sites/cygnus-test/app/services/page.tsx` | Reference services page — image card grid |
| `sites/mad-graphics/app/services/page.tsx` | Current — platform ContentGrid |
| `sites/cygnus-test/app/about/page.tsx` | Reference about page — custom layout |
| `sites/mad-graphics/app/about/page.tsx` | Current — platform siteConfig-driven |
| `sites/cygnus-test/app/locations/page.tsx` | Platform ContentGrid (same as mad-graphics) |
| `sites/mad-graphics/app/locations/page.tsx` | Platform ContentGrid |
| `sites/mad-graphics/app/layout.tsx` | Root layout — ThemeProvider, SiteHeader, PageShell |
| `sites/mad-graphics/site.config.ts` | Business config — 8 services, 19 locations |
| `sites/mad-graphics/content/locations/eastbourne.mdx` | Example: title = "Vehicle Graphics & Signs in Eastbourne" |
| `packages/themes/cygnus/index.ts` | cygnusRegistry + cygnusDefaultConfig |
| `packages/themes/cygnus/globals.css` | btn-primary, btn-outline, .card, .section utilities |
| `tools/create-site-from-project.ts` | Site generation pipeline (~1,117 lines) |
| `docs/architecture/how-site-creation-works.md` | Architecture doc for site creation |

**Theme packages available:** `vega`, `cygnus`, `orion`, `nova`, `atlas`, `rigel` (in `packages/themes/`)

**Reference sites per theme:**
- `cygnus` → `sites/cygnus-test/`
- `orion` → `sites/dj-fox-electrical/`
- `vega` → `sites/base-template/`
- All others → no reference site yet

**Stitch images:** `sites/cygnus-test/public/stitch-images/img-001.jpg` through `img-026.jpg` (28 files, ~8.6 MB)

---

### What a Good Plan Should Cover

1. **Locations MDX `locationName` field** — a new `locationName` field (bare town name) is being added to each location MDX. The `layout.tsx` location mapping changes from `name: loc.title` → `name: loc.locationName ?? loc.title`. Consider: does the content schema (Zod) for locations need updating to recognise this field? Does the `getContentItems` return type expose frontmatter fields? What is the correct TypeScript type for the returned location object?

2. **Homepage porting** — how to strip the custom `<header>` and `<footer>` from `cygnus-test/app/page.tsx` without breaking the visual design. The cygnus-test page renders its own nav and footer inline (bypassing `layout.tsx`'s `PageShell`). Mad Graphics must NOT do this.

3. **Services page** — cygnus-test has 6 hardcoded service cards; Mad Graphics has 8 services. How are the 8 services wired in? Hardcoded cards (matching cygnus-test style) or driven from `siteConfig.services`? Trade-offs: hardcoded = visual fidelity but maintenance cost; config-driven = maintainable but may drift from cygnus design.

4. **About page** — cygnus-test hardcodes team members (Martin Adams, Sarah Jenkins, etc.) and a specific narrative. Mad Graphics has real `siteConfig.about` data (story, values, whyChooseUs, badges). How are these reconciled?

5. **Locations listing page** — should it use the same image card grid design as the services page, or a simpler layout? The cygnus-test `locations/page.tsx` is the same platform `ContentGrid` as mad-graphics — there is no custom cygnus locations page to copy from.

6. **Stitch images** — `mad-graphics/public/stitch-images/` doesn't exist. Plan must include copying or symlinking images. Are these appropriate permanent assets for mad-graphics or placeholder/temp assets?

7. **Pipeline fix** — where in `create-site-from-project.ts` does the theme-first page selection happen? How is the reference site lookup table defined and maintained? What happens when a new theme is added without a reference site?

8. **Hex color removal** — cygnus-test uses extensive hardcoded hex (`#f7941d`, `#131313`, `#dac2af`, `#0e0e0e`, `#613500`). When porting, these must become theme tokens. Provide the mapping and flag any token gaps (tokens that don't exist yet in the platform).

9. **Verification** — how to confirm that mad-graphics now looks correct without manually inspecting every page? What automated checks can verify no hex colors remain, types pass, build succeeds?

---

## Deliverable

Produce a numbered implementation plan with:
- Clear phases/steps
- Which files are created or modified at each step
- Verification gates between steps (how to confirm each step succeeded before moving on)
- Any risks or trade-offs worth calling out

Save your response as `codex-plan.md` in `output/sessions/codex-peer-review/2026-04-06_mad-graphics-cygnus-theme/`.

Then output this command for the user to copy-paste into Claude Code:
```
/plan.with.codex synthesise
```
