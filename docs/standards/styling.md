# Styling Standards

**Version:** 1.0.0
**Last Updated:** 2025-12-05
**Scope:** All sites in local-business-platform

---

## Overview

All styling in the Local Business Platform uses Tailwind CSS with a maintainable class system. This ensures consistency across all sites and makes styling predictable and easy to maintain.

## Core Principles

### 1. Tailwind CSS Only

- ✅ ALL styling via Tailwind utility classes
- ❌ NO inline styles (`style={{}}` properties)
- ❌ NO styled-components or CSS-in-JS
- ❌ NO custom CSS files unless absolutely necessary

### 2. Maintainable Class System

Repeated styling patterns MUST be extracted to maintainable classes in `globals.css`:

```css
/* globals.css - Approved maintainable classes */
.btn-primary {
  @apply inline-flex items-center px-6 py-3 bg-[#005A9E] text-white font-semibold rounded-lg hover:bg-[#004a85] transition-colors;
}

.card-interactive {
  @apply group relative bg-white rounded-2xl shadow-sm border border-gray-200 p-8 hover:shadow-lg hover:-translate-y-1 transition-all duration-300;
}

.section-standard {
  @apply py-16 lg:py-20;
}
```

### 3. File Structure

```
/app/globals.css          - Maintainable classes with @apply
/components/ui/           - All reusable UI components
```

## Implementation

### Correct Usage

```tsx
// ✅ CORRECT - Maintainable classes
<button className="btn-primary">Click me</button>
<div className="card-interactive">Content</div>

// ✅ CORRECT - Tailwind utilities for unique styling
<div className="bg-blue-600 text-white p-4 rounded-lg">
```

### Wrong Usage

```tsx
// ❌ WRONG - Repeated custom patterns (should be a class)
<button className="inline-flex items-center px-6 py-3 bg-[#005A9E] text-white font-semibold rounded-lg hover:bg-[#004a85] transition-colors">
<button className="inline-flex items-center px-6 py-3 bg-[#005A9E] text-white font-semibold rounded-lg hover:bg-[#004a85] transition-colors">

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
| `style={{}}` inline styles     | Not maintainable, bypasses Tailwind | Use Tailwind utilities        |
| Duplicated utility strings     | Hard to maintain, inconsistent      | Extract to maintainable class |
| Custom CSS files per component | Fragmented styling                  | Use globals.css               |
| styled-components              | Different paradigm                  | Tailwind only                 |

## Verification Checklist

Before completing any styling work:

- [ ] No inline styles (`style={{}}`) anywhere
- [ ] No duplicated utility class strings (3+ uses = extract to class)
- [ ] New patterns added to globals.css with `@apply`
- [ ] All components in `/components/ui/`
- [ ] Responsive design works on mobile, tablet, desktop

## Related Standards

- [Components](./components.md) - Component structure and organization
- [Quality](./quality.md) - Quality gates including styling checks

---

**Maintained By:** Digital Consulting Services
