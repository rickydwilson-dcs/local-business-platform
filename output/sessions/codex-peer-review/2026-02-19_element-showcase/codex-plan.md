# Codex Implementation Plan — Element Showcase Site (2026-02-19)

1) Baseline + constraints check
- Confirm current theme plugin API: skim `packages/theme-system/src/tailwind-plugin.ts` and `generate-css.ts` to understand how CSS variables are injected (selector, :root assumption).
- Quick sanity: `pnpm lint` at root to ensure a clean starting point before edits.

2) Decide and wire CSS isolation mechanism
- Approach: make `createThemePlugin` accept an optional `selector` (default `:root`) for where it injects CSS variables. This allows emitting variables for multiple themes in one build without collisions.
- Plan to register the plugin twice in the showcase Tailwind config: once with selector `:where([data-theme="orion"])`, once with selector `:where([data-theme="vega"])`, each fed their respective theme configs.
- Benefit: no runtime CSS-in-JS, no iframes; shared utilities remain global, but variables are scoped per container.
- Files to change: `packages/theme-system/src/tailwind-plugin.ts` (add selector option), maybe `packages/theme-system/src/types.ts` (extend options typing), adjust existing site configs to keep default behaviour (selector omitted ⇒ :root).
- Verification: run `pnpm lint` to ensure plugin types OK; ensure existing sites still build because selector default preserves :root.

3) Scaffold `sites/showcase`
- Add folder `sites/showcase` modelled after `sites/base-template` minimal Next.js 15 app router with Turborepo plumbing.
- Files: `app/layout.tsx`, `app/page.tsx`, `app/elements/[slug]/page.tsx`, `app/compare/page.tsx`, `app/globals.css`, `tailwind.config.ts`, `tsconfig.json`, `theme.config.ts` (may reuse vega defaults for placeholder).
- Update workspace config: ensure `pnpm-workspace.yaml` already includes `sites/*`; add pipeline entries in `turbo.json` for build/lint/type-check pointing at showcase.
- Verification: `pnpm --filter showcase lint` and `pnpm --filter showcase type-check` succeed (with stub content).

4) Showcase-tailwind setup for dual themes
- `tailwind.config.ts`: register plugin twice using new selector option: `createThemePlugin(orionConfig, { selector: ':where([data-theme=\"orion\"])' })` and similarly for vega. Include content globs covering showcase app and `packages/core-components`.
- Import both `packages/themes/orion/globals.css` and `packages/themes/vega/globals.css` in `app/globals.css`. Because utility class names collide, ensure they rely on CSS variables; with selector-scoped vars in containers, styles remain per-frame.
- Verification: build CSS once and inspect (or `pnpm --filter showcase lint`); ensure emitted CSS contains two variable blocks under data-theme selectors.

5) ThemeFrame component for isolation
- Create `sites/showcase/components/theme-frame.tsx` (Server Component) wrapping children in `<div data-theme="orion|vega" className="theme-frame">…` with optional label header. No runtime theme toggle; the data attribute selects the scoped CSS vars.
- Add small CSS in `app/globals.css` for layout (split view, grid) without hardcoded colours (use neutral Tailwind utilities).
- Verification: temporary test route rendering a coloured token sample in two frames shows distinct brand colours (red vs blue) on the same page.

6) Component registry + fixtures
- Create `sites/showcase/lib/registry.ts`: export a typed array of showcase entries `{ slug, title, category, component: React.FC<Props>, fixtures: Fixture[] }`.
- Use lightweight inline fixtures (objects) collocated in the registry file to avoid 55 separate files. Keep props minimal but representative; use existing prop TypeScript interfaces from `@platform/core-components`.
- Categories: e.g., “Hero”, “Cards”, “Content Sections”, “CTA”, “Navigation”, “Forms”, “Feedback”.
- Verification: `pnpm --filter showcase type-check` to ensure fixture props align with component types.

7) Pages
- `/` (catalog): server-rendered grid/list of components with category filter (URL search params). Each item links to `/elements/[slug]`.
- `/elements/[slug]`: renders the chosen component twice, once in `<ThemeFrame theme=\"orion\">`, once in `<ThemeFrame theme=\"vega\">`, using the first (or selected) fixture.
- `/compare`: side-by-side vertical stack showing a subset (or all) components in both themes for quick visual sweep.
- All pages are Server Components; no runtime theme switching; minimal client components only for simple interactivity (filters) if needed.
- Verification: run `pnpm --filter showcase dev` and manually spot-check a few routes; ensure no hydration warnings.

8) Early visual sanity gate
- Add a “token probe” component that renders brand primary/background/text tokens inside each `ThemeFrame`. Include on `/compare` to visually confirm no CSS variable bleed.
- Verification: colours differ correctly (red vs blue) when both frames are on the same page.

9) CI/commands integration
- Update `turbo.json` pipelines to include showcase for `build`, `lint`, `type-check` (reuse patterns from other sites).
- Optionally add `pnpm --filter showcase build` to root docs/README for internal discoverability.
- Verification: `pnpm build` at root still passes (or at least `pnpm --filter showcase build`).

10) Risks & mitigations
- Risk: globals.css class collisions if theme files contain non-variable-based styles. Mitigation: quick scan for hardcoded colours; if present, wrap those rules in `[data-theme=<name>]` via small post-edit during implementation.
- Risk: plugin selector change could affect other sites if mis-typed; default selector preserves behaviour, and regression caught by `pnpm lint` + `pnpm build` on an existing site.
- Risk: fixture drift with component prop changes; mitigate by keeping fixtures typed and colocated in one registry for easy updates.

Hand-off
- Save this plan (done). Next step: run `/plan.with.codex synthesise` in Claude Code once reviewed.
