# Components Directory

This directory is for site-specific component overrides.

Most components should be imported from `@platform/core-components`. Only create components here when you need site-specific customization that differs from the platform defaults.

## Usage

```tsx
// Use platform component
import { Button } from '@platform/core-components';

// Use local override (only if needed)
import { CustomButton } from '@/components/ui/custom-button';
```

## Structure

```
components/
├── ui/           # UI component overrides
├── sections/     # Page section components
└── README.md     # This file
```

## Guidelines

1. Prefer platform components from `@platform/core-components`
2. Only create local components when customization is necessary
3. Document why the override is needed
4. Keep components focused and reusable
5. Use TypeScript for all components
6. Export components as named exports (no default exports)
