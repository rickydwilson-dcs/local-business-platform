I’ll draft the plan and save it to the requested `codex-plan.md` path now.

Implemented plan content for `output/sessions/codex-peer-review/2026-04-05_bug-3/codex-plan.md`:

```md
# Codex Peer Review Plan — Cygnus Hero Variant Runtime Selection

## 1) Architectural decisions (lock before coding)

1. **Variant selection location: Server `page.tsx` (static imports + registry constant)**
   - Do **not** use `useTheme()` for hero selection (client-only hook; page is Server Component).
   - In each target site homepage, use the already-imported registry constant (e.g., `cygnusRegistry.heroVariant`) to branch between:
     - new `ImageOverlayHero` for `"image-overlay"`
     - existing centered inline hero markup as fallback.
   - This satisfies the “static selection at page level” architecture note in theme context.

2. **Component placement: shared component in `core-components`**
   - Add `ImageOverlayHero` in `packages/core-components/src/components/hero/`.
   - Rationale: same hero is required by **both** cygnus sites; avoids duplication and preserves a reusable API.
   - Keep existing `HeroV1/V2/V3` untouched for now (non-goal to refactor all hero variants).

3. **Scope guardrail**
   - Update only:
     - `sites/cygnus-test/app/page.tsx`
     - `sites/mad-graphics/app/page.tsx`
   - Leave `sites/base-template` and `sites/dj-fox-electrical` unchanged to satisfy acceptance criteria for unaffected sites.
   - Note: this intentionally avoids global rollout of `heroVariant` semantics in all sites during this bug fix.

**Verification gate A**

- Confirm no files outside intended scope are modified except the shared hero component + exports.
- Confirm no changes to `ThemeProvider`, `ComponentRegistry` types, header/footer components.

---

## 2) Build `ImageOverlayHero` shared component

### Files

- **Create:** `packages/core-components/src/components/hero/ImageOverlayHero.tsx`
- **Modify:** `packages/core-components/src/components/hero/index.ts` (named export)

### Component API (typed, named export only)

Define explicit interfaces, e.g.:

- `ImageOverlayHeroStat`
  - `value: string`
  - `label: string`

- `ImageOverlayHeroCta`
  - `label: string`
  - `href: string`

- `ImageOverlayHeroProps`
  - `statusBadge?: string` (e.g., `"847 projects completed"`)
  - `headline: string`
  - `headlineAccent?: string` (accent span segment)
  - `subheadline: string`
  - `primaryCta: ImageOverlayHeroCta`
  - `secondaryCta?: ImageOverlayHeroCta`
  - `backgroundImage?: string`
  - `backgroundImageAlt?: string`
  - `stats?: ImageOverlayHeroStat[]` (optional bar below main content)

### Layout implementation (Stitch-aligned)

1. **Outer hero section**
   - `relative min-h-screen flex items-center pt-20 overflow-hidden`
   - tokenized surface/text classes (no hex).
2. **Background image layer**
   - absolutely positioned full bleed image (`absolute inset-0 w-full h-full object-cover`)
   - treatment: opacity + grayscale utility classes.
3. **Gradient overlay**
   - absolute overlay with tokenized gradient (`from-surface-background via-surface-background/60 to-transparent` style).
4. **Foreground content**
   - left aligned container (`container`, inner `max-w-3xl`).
   - status badge pill.
   - headline (`text-7xl md:text-8xl font-headline font-bold italic`) + accent span tokenized with brand color.
   - subheadline muted text (`text-surface-foreground/80`, `max-w-xl`).
   - primary + secondary CTAs.
5. **Optional stats row**
   - Render only when `stats?.length`.
   - 3-column responsive bar style using tokenized text/border/background utilities only.

### Token discipline

- Use design tokens/utilities only (`bg-brand-primary`, `text-surface-foreground`, `border-border`, etc.).
- No inline styles, no hardcoded hex/rgb, no CSS-in-JS.

### Accessibility/robustness

- If image is decorative, use empty alt and `aria-hidden`; if meaningful, use provided alt.
- Buttons/links use clear labels.
- Ensure section remains readable if `backgroundImage` absent (overlay + background token still produce usable hero).

**Verification gate B**

- `ImageOverlayHero` compiles in TS strict mode.
- Export appears in `hero/index.ts`.
- Grep confirms no hardcoded hex colors in new file.

---

## 3) Wire hero selection in cygnus site homepages

### Files

- **Modify:** `sites/cygnus-test/app/page.tsx`
- **Modify:** `sites/mad-graphics/app/page.tsx`

### Change pattern

1. Import `ImageOverlayHero` from core-components hero exports.
2. Keep existing centered hero JSX as fallback block (or extract to local `LegacyCenteredHero` function within same file).
3. Replace hardcoded hero section with conditional render:
   - `if (cygnusRegistry.heroVariant === "image-overlay")` → `ImageOverlayHero`
   - else fallback to existing centered hero block.
4. Thread existing page data into props:
   - headline/subheadline using current site/business config fields.
   - CTA labels/URLs from existing link destinations currently used in hero.
   - `backgroundImage` from site config if available; otherwise pass a safe placeholder path already valid for the site.
   - `statusBadge` + optional `stats` from local constants (no new MDX fields).

### Why this is correct

- Uses registry at server render level without client context.
- Creates runtime-visible effect specifically where cygnus registry is used.
- Avoids breaking non-cygnus sites by not changing their pages.

**Verification gate C**

- Run each target site and visually confirm:
  - cygnus-test: full-screen image-overlay hero appears (left-aligned, badge, two CTAs).
  - mad-graphics: same image-overlay structure appears.
- Confirm base-template page still shows old centered hero.
- Confirm dj-fox-electrical remains unchanged.

---

## 4) Regression protection + quality checks

### Commands

1. `npm run type-check`
2. `npm run build`

(If workspace-specific scripts exist, additionally run builds for the two changed sites explicitly.)

### Manual checks against acceptance criteria

- [ ] Cygnus test homepage is full-screen overlay hero (not centered gradient).
- [ ] Mad graphics homepage is full-screen overlay hero.
- [ ] Base template unchanged.
- [ ] Dj-fox-electrical unchanged.
- [ ] No hex colors in `ImageOverlayHero`; token classes only.
- [ ] TS strict passes.
- [ ] Build passes.

**Verification gate D (final)**

- Capture quick before/after screenshots for cygnus-test and mad-graphics hero area for reviewer confidence.
- Ensure diff is focused and minimal.

---

## 5) Risks and trade-offs

1. **Registry semantics inconsistency across themes**
   - Risk: only cygnus pages honor `heroVariant`, while other sites still hardcode hero.
   - Trade-off accepted for scoped bug fix; document follow-up task for global homepage variant resolver.

2. **Background image source stability**
   - Risk: remote Stitch URL can be brittle.
   - Mitigation: pass configurable `backgroundImage`; keep graceful no-image readability fallback.

3. **Design-token parity vs Stitch pixel-perfect**
   - Risk: exact visual match may differ when replacing Stitch hex values with theme tokens.
   - Mitigation: prioritize token-compliant mapping while keeping structure/spacing/typography faithful.

4. **Future duplication in page conditionals**
   - Risk: repeated conditional logic across sites.
   - Mitigation: acceptable now; possible later extraction to shared server-safe helper (`renderHeroByVariant`) without client context.
```

/plan.with.codex synthesise output/sessions/codex-peer-review/2026-04-05_bug-3/
