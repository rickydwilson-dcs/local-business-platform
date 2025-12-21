# Base Template Site

The base template site provides a neutral starting point for creating new white-label websites in the local business platform. It includes generic placeholder content and integrates the `@platform/theme-system` for easy customization.

## Purpose

This template serves as the foundation for all new sites in the platform. Copy this directory structure and customize the configuration files and content to match your specific business requirements.

## What's Included

### Configuration Files

- **`site.config.ts`** - Business information, contact details, service areas, feature flags
- **`theme.config.ts`** - Theme customization (colors, typography, components)
- **`tailwind.config.ts`** - Tailwind CSS configuration with theme system integration
- **`next.config.ts`** - Next.js configuration
- **`tsconfig.json`** - TypeScript configuration
- **`package.json`** - Dependencies and scripts

### Generic Content

**Services** (`content/services/`):

- `primary-service.mdx`
- `secondary-service.mdx`
- `service-three.mdx`
- `service-four.mdx`
- `service-five.mdx`

**Locations** (`content/locations/`):

- `main-area.mdx`
- `north-region.mdx`
- `south-region.mdx`

All content files use generic placeholder text that should be replaced with actual business content.

## Creating a New Site

### 1. Copy the Template

```bash
cp -r sites/base-template sites/your-new-site
cd sites/your-new-site
```

### 2. Update Configuration

Edit `site.config.ts` with your business information:

- Business name, tagline, contact details
- Address and operating hours
- Service areas
- Social media links
- Feature flags

### 3. Customize Theme

Edit `theme.config.ts` to match your brand:

- Primary, secondary, and accent colors
- Typography (fonts)
- Component styles (buttons, cards, navigation)

### 4. Update Content

Replace generic MDX content with actual business content:

- Service descriptions and details
- Location-specific information
- FAQ answers
- Hero images and CTAs

### 5. Install Dependencies

```bash
pnpm install
```

### 6. Test Locally

```bash
npm run dev
```

Visit `http://localhost:3000` to preview your site.

### 7. Update Package.json

Edit `package.json` to change:

- `name` field to your site name
- `description` field

## Theme System Integration

The base template uses `@platform/theme-system` for centralized theming:

### Theme Configuration

The `theme.config.ts` file defines your site's visual identity:

```typescript
export const themeConfig: Partial<ThemeConfig> = {
  colors: {
    brand: {
      primary: '#3b82f6', // Main brand color
      primaryHover: '#2563eb', // Hover state
      secondary: '#1e40af', // Secondary elements
      accent: '#f59e0b', // Highlights
    },
    // ... more colors
  },
  typography: {
    fontFamily: {
      sans: ['Inter', 'system-ui', 'sans-serif'],
      heading: ['Inter', 'system-ui', 'sans-serif'],
    },
  },
  components: {
    button: { borderRadius: '0.5rem' },
    card: { borderRadius: '1rem', shadow: 'sm' },
    hero: { variant: 'centered' },
    navigation: { style: 'solid' },
  },
};
```

### Tailwind Integration

The theme is automatically applied via the Tailwind plugin in `tailwind.config.ts`:

```typescript
import { createThemePlugin } from '@platform/theme-system/plugin';
import { themeConfig } from './theme.config';

const config: Config = {
  // ... content paths
  plugins: [typography, createThemePlugin(themeConfig)],
};
```

This generates CSS variables and Tailwind utilities based on your theme configuration.

## Directory Structure

```
sites/base-template/
├── app/                      # Next.js app directory (pages)
├── components/               # Local component overrides
├── content/                  # MDX content files
│   ├── services/            # Service pages
│   └── locations/           # Location pages
├── lib/                      # Utility functions
├── public/                   # Static assets
├── site.config.ts           # Business configuration
├── theme.config.ts          # Theme configuration
├── tailwind.config.ts       # Tailwind + theme system
├── next.config.ts           # Next.js configuration
├── tsconfig.json            # TypeScript configuration
├── package.json             # Dependencies and scripts
└── README.md                # This file
```

## Content Guidelines

### Service Pages

Each service MDX file should include:

- Title, SEO title, description
- Keywords for SEO
- Hero section with heading, subheading, image, CTA
- Breadcrumbs for navigation
- FAQs (minimum 3, recommended 8-12)
- Main content with proper headings and structure

### Location Pages

Each location MDX file should include:

- Location-specific title and description
- Local keywords
- Hero with location name
- Information about service areas covered
- Local contact information
- Location-specific FAQs

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run type-check` - Type check with TypeScript
- `npm test` - Run unit tests
- `npm run test:e2e` - Run E2E tests
- `npm run validate:content` - Validate MDX content

## Next Steps

1. Review the colossus-reference site for a complete example
2. Check platform documentation in `/docs`
3. Read theme system documentation in `/packages/theme-system`
4. Review content standards in `/docs/standards`

## Support

For questions or issues:

- Check `/docs/guides` for how-to guides
- Review `/docs/architecture` for architecture details
- See `/docs/standards` for coding standards

---

**Template Version:** 1.0.0
**Created:** December 2025
**Platform:** Local Business Platform v1.0
