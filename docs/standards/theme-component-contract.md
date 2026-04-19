# Theme Component Contract

## Why This Exists

Composable section components in `packages/core-components/src/components/composable/` use CSS utility classes for buttons, dark sections, overlays, and interactive elements. These classes are defined in each theme's `globals.css` — not in a shared stylesheet. Without enforcement, a theme can silently omit a class, causing broken CTAs, missing textures, or unstyled interactive elements on any site using that theme with composition.

The Theme Component Contract is the canonical list of CSS class names every theme must define. A CI-enforced validator (`tools/validate-theme-globals.ts`) blocks builds and PRs if any theme is missing a contract class. Each theme implements the classes with its own visual identity — the contract constrains names, not appearance.

---

## Contract Classes

| Class Name                     | Group   | Purpose                                                                  | Consumers                                                                   |
| ------------------------------ | ------- | ------------------------------------------------------------------------ | --------------------------------------------------------------------------- |
| `btn-primary`                  | button  | Primary action button on any section background                          | hero-section, cta-section                                                   |
| `btn-secondary`                | button  | Secondary action button on any section background                        | hero-section, cta-section, service-list-section, location-pills-section     |
| `btn-tertiary`                 | button  | Action button on a dark `section-dark-accent` section                    | cta-section                                                                 |
| `btn-on-brand-primary`         | button  | Primary action button on a `bg-brand-primary` section                    | cta-section                                                                 |
| `btn-on-brand-primary-outline` | button  | Outline action button on a `bg-brand-primary` section                    | cta-section                                                                 |
| `section-dark-accent`          | section | Theme's dark CTA/callout background with auto-styled h2/h3/p descendants | cta-section                                                                 |
| `noise-overlay`                | overlay | Subtle grain texture overlay for depth on flat sections                  | cta-section, hero-section, feature-grid, stats-strip, why-choose-us-section |
| `stat-value`                   | utility | Stat number typography with tabular-nums                                 | stats-strip, why-choose-us-section                                          |
| `location-pill`                | utility | Interactive pill-style link in location lists                            | location-pills-section                                                      |
| `location-pill-arrow`          | utility | Arrow icon inside location-pill; animates on hover                       | location-pills-section                                                      |

The source of truth is `packages/theme-system/src/component-contract.ts` — exported as `THEME_COMPONENT_CONTRACT` from `@platform/theme-system`.

---

## Per-Theme Implementations

| Theme          | Visual Intent                                            | Key Differences                                                                                         |
| -------------- | -------------------------------------------------------- | ------------------------------------------------------------------------------------------------------- |
| **Orion**      | Dark header, red brand accent, black CTA sections        | Reference implementation; `section-dark-accent` uses press-black                                        |
| **Vega**       | Light header, navy-on-white, clean typography            | `section-dark-accent` uses navy; buttons have no shadow                                                 |
| **Cygnus**     | Industrial, Signal Orange + Press-Black, italic headings | `location-pill` uses `rounded-none`; noise overlay at 0.06 opacity                                      |
| **Solaris**    | Pastel sky-blue, geometric shapes, bouncy animations     | Buttons use `--solaris-radius-btn`; `location-pill` uses `--solaris-radius-pill`; noise at 0.02 opacity |
| **Designlab**  | Clean professional, neutral palette                      | Standard rounded-lg buttons; matches Vega structure                                                     |
| **Navagarden** | Green/earthy, garden services                            | Standard rounded-lg buttons; matches Vega structure                                                     |

---

## Validating Locally

```bash
# Validate all themes
pnpm validate:theme-contract

# Validate a single theme
pnpm validate:theme-contract --theme orion

# Machine-readable output
pnpm validate:theme-contract --json

# Non-blocking mode (exit 0 even on failure)
pnpm validate:theme-contract --warn-only
```

---

## CI Enforcement

The validator runs in the GitHub Actions Quality Checks job after `type-check` and before tests. It also gates builds via `turbo.json` — the `validate:theme-contract` task must pass before any `build` task runs.

A PR that removes or renames a contract class from any theme's `globals.css` will fail CI.

---

## Implementing for a New Theme

When creating a new theme, every class in the contract must be defined in `packages/themes/<name>/globals.css`. Use `@apply` with theme tokens — never hardcode hex values.

### Template for each class

```css
/* Buttons — use your theme's radius convention */
.btn-primary {
  @apply inline-flex items-center justify-center px-6 py-3 rounded-lg;
  @apply bg-brand-primary text-on-brand-primary font-semibold;
  @apply hover:bg-brand-primary-hover transition-all duration-200;
  @apply focus:ring-2 focus:ring-brand-primary focus:ring-offset-2;
}

.btn-secondary {
  @apply inline-flex items-center justify-center px-6 py-3 rounded-lg;
  @apply bg-surface-card text-brand-primary border border-brand-primary font-semibold;
  @apply hover:bg-surface-subtle transition-all duration-200;
  @apply focus:ring-2 focus:ring-brand-primary focus:ring-offset-2;
}

.btn-tertiary {
  @apply inline-flex items-center justify-center px-6 py-3 rounded-lg;
  @apply bg-transparent text-white border-2 border-white font-semibold;
  @apply hover:bg-white/10 transition-all duration-200;
  @apply focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-surface-inverse;
}

.btn-on-brand-primary {
  @apply inline-flex items-center justify-center px-8 py-3 rounded-lg;
  @apply bg-white text-brand-primary font-semibold;
  @apply hover:bg-surface-muted transition-colors duration-200;
  @apply focus:ring-2 focus:ring-white focus:ring-offset-2;
  @apply whitespace-nowrap;
}

.btn-on-brand-primary-outline {
  @apply inline-flex items-center justify-center px-8 py-3 rounded-lg;
  @apply border-2 border-white text-white font-semibold;
  @apply hover:bg-white/10 transition-colors duration-200;
  @apply focus:ring-2 focus:ring-white focus:ring-offset-2;
  @apply whitespace-nowrap;
}

/* Dark section */
.section-dark-accent {
  @apply bg-surface-inverse text-white py-20 md:py-28;
}
.section-dark-accent h1,
.section-dark-accent h2,
.section-dark-accent h3 {
  @apply text-white;
}

/* Noise overlay */
.noise-overlay {
  position: relative;
}
.noise-overlay::before {
  content: "";
  position: absolute;
  inset: 0;
  background-image: url("data:image/svg+xml,..."); /* SVG fractal noise */
  background-size: 200px 200px;
  pointer-events: none;
  z-index: 0;
}
.noise-overlay > * {
  position: relative;
  z-index: 1;
}

/* Utilities */
.stat-value {
  font-variant-numeric: tabular-nums;
  font-feature-settings: "tnum" 1;
}

.location-pill {
  @apply flex items-center justify-between px-5 py-4 rounded-xl border border-surface-card-border;
  @apply hover:border-brand-primary transition-all duration-200;
  background-color: transparent;
}
.location-pill:hover {
  background-color: color-mix(in srgb, var(--color-brand-primary) 5%, transparent);
}
.location-pill:hover .location-pill-arrow {
  transform: translateX(4px);
  color: var(--color-brand-primary);
}
.location-pill-arrow {
  transition:
    transform 0.2s ease,
    color 0.2s ease;
  color: var(--color-surface-muted-foreground);
}
```

Run `pnpm validate:theme-contract --theme <your-theme>` before opening a PR. The CI Quality Checks job enforces this — PRs with failing validation will be blocked.

---

## Related

- [How the Theme System Works](../architecture/how-theme-system-works.md)
- [Creating a New Theme](../guides/creating-new-theme.md)
- Source: `packages/theme-system/src/component-contract.ts`
- Validator: `tools/validate-theme-globals.ts`
