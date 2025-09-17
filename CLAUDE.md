# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

<!-- Test comment: GitHub Actions workflow test -->

## Development Commands

- `npm run dev` - Start development server (Next.js 15 with hot reload)
- `npm run build` - Build for production (includes TypeScript compilation and MDX processing)
- `npm run start` - Start production server
- `npm run lint` - Run ESLint with Next.js TypeScript configuration

## Architecture Overview

This is a Next.js 15 scaffolding company website using:

- **App Router** with TypeScript and React 19
- **MDX Content Management** via `next-mdx-remote` and `@next/mdx`
- **Dynamic Route Structure** for services and locations
- **Schema.org SEO** integration for structured data

### Key Directories

- `app/` - Next.js App Router pages and layouts
  - Dynamic routes: `[slug]/page.tsx` for services and locations
  - Contact forms with service/location-specific variants
- `content/` - MDX content files organized by `services/` and `locations/`
- `components/` - Reusable React components (primarily `Schema.tsx` for SEO)
- `lib/` - Utility functions for MDX processing, site configuration, and services data

### Content Architecture

The site uses a content-driven architecture where:

1. MDX files in `content/services/` and `content/locations/` drive dynamic pages
2. Each MDX file includes frontmatter with title, description, and SEO metadata
3. The `Schema` component automatically generates structured data for services and FAQs
4. Dynamic imports discover and render content at build time

### Core Configuration Files

- `next.config.ts` - MDX integration with Rust compiler, security headers, image optimization
- `tailwind.config.ts` - Custom brand colors (blue: #4DB2E4, black: #000000) and typography
- `tsconfig.json` - Strict TypeScript with path aliases (`@/*` maps to root)
- `eslint.config.mjs` - Next.js recommended rules with TypeScript support

### SEO and Performance Features

- Automatic metadata generation from MDX frontmatter
- Schema.org markup via `components/Schema.tsx`
- Static generation with dynamic MDX content loading
- Security headers and image optimization configured in Next.js config
- Font optimization using `@fontsource` packages (Libre Caslon Display, Arial fallback)

### Brand Configuration

Colors defined in Tailwind config:

- Primary: `brand-blue` (#4DB2E4)
- Text/Headers: `brand-black` (#000000)
- Backgrounds: `brand-white` (#FFFFFF)

Typography: Libre Caslon Display for headings, Arial/Helvetica for body text.
