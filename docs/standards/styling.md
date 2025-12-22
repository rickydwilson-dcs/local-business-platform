# Styling Standards

**Version:** 1.1.0
**Last Updated:** 2025-12-21
**Scope:** All sites in local-business-platform

---

## Overview

All styling in the Local Business Platform uses Tailwind CSS with a centralized theme system (`@platform/theme-system`). This ensures consistency across all sites while allowing per-site brand customization through CSS variables.

## Core Principles

### 1. Tailwind CSS Only

- ✅ ALL styling via Tailwind utility classes
- ❌ NO inline styles (`style={{}}` properties)
- ❌ NO styled-components or CSS-in-JS
- ❌ NO custom CSS files unless absolutely necessary

### 2. Theme System Integration

Use theme tokens instead of hardcoded colors:

```css
/* ✅ CORRECT - Using theme tokens */
.btn-primary {
  @apply inline-flex items-center px-6 py-3 bg-brand-primary text-white font-semibold rounded-lg hover:bg-brand-primary-hover transition-colors;
}

/* ❌ WRONG - Hardcoded hex colors */
.btn-primary {
  @apply inline-flex items-center px-6 py-3 bg-[#005A9E] text-white font-semibold rounded-lg hover:bg-[#004a85] transition-colors;
}
```

### 3. Maintainable Class System

Repeated styling patterns MUST be extracted to maintainable classes in `globals.css`:

```css
/* globals.css - Approved maintainable classes */
.btn-primary {
  @apply inline-flex items-center px-6 py-3 bg-brand-primary text-white font-semibold rounded-lg hover:bg-brand-primary-hover transition-colors;
}

.card-interactive {
  @apply group relative bg-surface-card rounded-2xl shadow-sm border border-surface-card-border p-8 hover:shadow-lg hover:-translate-y-1 transition-all duration-300;
}

.section-standard {
  @apply py-16 lg:py-20;
}
```

### 4. File Structure

```
/app/globals.css          - Maintainable classes with @apply
/theme.config.ts          - Site-specific theme configuration
/tailwind.config.ts       - Uses createThemePlugin(themeConfig)
/components/ui/           - All reusable UI components
```

## Implementation

### Correct Usage

```tsx
// ✅ CORRECT - Theme tokens
<button className="bg-brand-primary hover:bg-brand-primary-hover text-white">Click me</button>
<div className="bg-surface-background text-surface-foreground">Content</div>

// ✅ CORRECT - Maintainable classes
<button className="btn-primary">Click me</button>
<div className="card-interactive">Content</div>

// ✅ CORRECT - Tailwind utilities for unique styling
<div className="p-4 rounded-lg shadow-md">
```

### Wrong Usage

```tsx
// ❌ WRONG - Hardcoded hex colors (use theme tokens)
<button className="bg-[#005A9E] hover:bg-[#004a85]">

// ❌ WRONG - Repeated custom patterns (should be a class)
<button className="inline-flex items-center px-6 py-3 bg-brand-primary text-white font-semibold rounded-lg hover:bg-brand-primary-hover transition-colors">
<button className="inline-flex items-center px-6 py-3 bg-brand-primary text-white font-semibold rounded-lg hover:bg-brand-primary-hover transition-colors">

// ❌ WRONG - Inline styles
<div style={{ backgroundColor: '#005A9E', color: 'white', padding: '16px' }}>

// ❌ WRONG - CSS-in-JS
const StyledDiv = styled.div`background: blue;`
```

## Styling Workflow

When adding new styling:

1. **Check existing classes** - Search `globals.css` for similar patterns
2. **Propose new class** - If pattern will be reused, propose maintainable class name
3. **Add to globals.css** - Create the class with `@apply` Tailwind utilities
4. **Use consistently** - Apply the class across all relevant components
5. **Document** - Add to this standards document if it establishes a new pattern

## What NOT to Do

| Anti-Pattern                   | Why It's Wrong                      | Correct Approach              |
| ------------------------------ | ----------------------------------- | ----------------------------- |
| Hardcoded hex colors           | Not themeable, breaks white-label   | Use theme tokens              |
| `style={{}}` inline styles     | Not maintainable, bypasses Tailwind | Use Tailwind utilities        |
| Duplicated utility strings     | Hard to maintain, inconsistent      | Extract to maintainable class |
| Custom CSS files per component | Fragmented styling                  | Use globals.css               |
| styled-components              | Different paradigm                  | Tailwind only                 |

## Verification Checklist

Before completing any styling work:

- [ ] No hardcoded hex colors (use `bg-brand-primary`, etc.)
- [ ] No inline styles (`style={{}}`) anywhere
- [ ] No duplicated utility class strings (3+ uses = extract to class)
- [ ] New patterns added to globals.css with `@apply`
- [ ] All components in `/components/ui/`
- [ ] Responsive design works on mobile, tablet, desktop

## Available Theme Tokens

| Category | Tokens                                                                      |
| -------- | --------------------------------------------------------------------------- |
| Brand    | `brand-primary`, `brand-primary-hover`, `brand-secondary`, `brand-accent`   |
| Surface  | `surface-background`, `surface-foreground`, `surface-muted`, `surface-card` |
| Semantic | `semantic-success`, `semantic-warning`, `semantic-error`, `semantic-info`   |

See [Theming Guide](../guides/theming.md) for full token reference.

## Related Standards

- [Theming Guide](../guides/theming.md) - Theme system configuration
- [Components](./components.md) - Component structure and organization
- [Quality](./quality.md) - Quality gates including styling checks

---

**Maintained By:** Digital Consulting Services
