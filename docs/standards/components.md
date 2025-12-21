# Component Standards

**Version:** 1.1.0
**Last Updated:** 2025-12-21
**Scope:** All sites in local-business-platform

---

## Overview

All UI components in the Local Business Platform follow consistent patterns for organization, typing, and exports. This ensures components are reusable, maintainable, and type-safe across all sites.

## Core Principles

### 1. Organization

- ✅ All reusable components in `/components/ui/`
- ✅ Accept props for customization
- ✅ Use TypeScript interfaces for all props
- ✅ Export as named exports, not default

### 2. Directory Structure

```
/components/
├── ui/                    # All reusable UI components
│   ├── Button.tsx
│   ├── Card.tsx
│   ├── Hero.tsx
│   └── ...
├── analytics/             # Analytics-specific components
└── layout/                # Layout components (Header, Footer)
```

## Implementation

### Component Props Pattern

```tsx
// ✅ CORRECT - Typed props interface with theme tokens
interface ButtonProps {
  variant: "primary" | "secondary";
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

export const Button = ({ variant, children, className, onClick }: ButtonProps) => {
  return (
    <button
      onClick={onClick}
      className={`base-classes ${variant === "primary" ? "bg-brand-primary hover:bg-brand-primary-hover" : "bg-surface-muted"} ${className}`}
    >
      {children}
    </button>
  );
};
```

**Important:** Use theme tokens (`bg-brand-primary`) instead of hardcoded hex colors (`bg-[#005A9E]`) for white-label compatibility.

### Named Exports

```tsx
// ✅ CORRECT - Named export
export const ServiceCard = ({ ... }) => { ... };
export const LocationCard = ({ ... }) => { ... };

// ❌ WRONG - Default export for UI components
export default function ServiceCard() { ... }
```

### Props Interface Requirements

All component props MUST include TypeScript interfaces:

```tsx
// ✅ REQUIRED - Interface for all props
interface CardProps {
  title: string;
  description: string;
  href: string;
  image?: string;
  variant?: "default" | "featured";
}

// ❌ WRONG - No type definition
const Card = ({ title, description, href }) => { ... }
```

## Component Categories

### UI Components (`/components/ui/`)

Generic, reusable components:

- Button, Card, Badge
- Hero variants (HeroV1, HeroV2, HeroV3)
- Form elements
- Navigation components

### Layout Components (`/components/layout/`)

Site structure components:

- Header
- Footer
- Navigation

### Feature Components

Page-specific compositions:

- ServiceCard
- LocationCard
- ContactForm
- FAQSection

## What NOT to Do

| Anti-Pattern                      | Why It's Wrong             | Correct Approach          |
| --------------------------------- | -------------------------- | ------------------------- |
| Components outside `/components/` | Fragmented organization    | Move to `/components/ui/` |
| Default exports                   | Harder to refactor         | Named exports only        |
| Missing TypeScript props          | No type safety             | Always define interface   |
| Hardcoded content                 | Not reusable               | Accept content via props  |
| Inline styles                     | Bypasses Tailwind          | Use className prop        |
| Hardcoded hex colors              | Breaks white-label theming | Use theme tokens          |

## React Patterns

### Clean Component Structure

```tsx
// ✅ CORRECT - Clean, typed, reusable
interface ComponentProps {
  title: string;
  items: Array<{ name: string; value: string }>;
}

export const ComponentName = ({ title, items }: ComponentProps) => {
  return (
    <div className="container mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">{title}</h2>
      {items.map((item) => (
        <div key={item.name} className="mb-2">
          {item.name}: {item.value}
        </div>
      ))}
    </div>
  );
};
```

### Component with Optional Props

```tsx
interface FeatureProps {
  title: string;
  description: string;
  icon?: React.ReactNode; // Optional
  className?: string; // Optional, for styling overrides
}

export const Feature = ({ title, description, icon, className = "" }: FeatureProps) => {
  return (
    <div className={`feature-card ${className}`}>
      {icon && <div className="feature-icon">{icon}</div>}
      <h3>{title}</h3>
      <p>{description}</p>
    </div>
  );
};
```

## Verification Checklist

Before completing any component work:

- [ ] Component located in `/components/ui/` or appropriate subdirectory
- [ ] TypeScript interface defined for all props
- [ ] Named export used (not default)
- [ ] No hardcoded content (passed via props)
- [ ] Styling uses Tailwind classes only
- [ ] Component is reusable across sites
- [ ] Optional className prop for styling overrides

## Related Standards

- [Styling](./styling.md) - Tailwind CSS and maintainable classes
- [Content](./content.md) - MDX content that components render
- [Quality](./quality.md) - Type checking requirements

---

**Maintained By:** Digital Consulting Services
