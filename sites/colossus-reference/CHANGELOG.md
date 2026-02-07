# Colossus Scaffolding - Deployment History

Reference implementation site for the platform. Serves as the working proof-of-concept and testing ground for all platform capabilities.

---

## 2026-02-07

### Design

- Migrated brand-blue to brand-primary theme tokens
- Skip navigation link for keyboard accessibility
- SVG elements marked aria-hidden where decorative

### Features

- Supabase rate limiter for contact form API
- CSRF hardening with timing-safe single-use tokens
- Focus trap on mobile menu and consent manager

### Content

- Location data moved to MDX frontmatter (no more hardcoded TS files)
- Content schemas now imported from @platform/core-components

---

## 2026-01-27

### Features

- Site registry tracking via Supabase backend
- Management CLI integration for status monitoring

---

## 2026-01-25

### Content

- Blog system launched with initial posts
- Projects portfolio with case study pages
- Testimonials and reviews system with aggregate ratings

---

## 2025-12-21

### Design

- Theme system integration — all components use CSS variables
- Viewport meta tag optimisation for mobile

### Content

- 25 service pages live
- 37 location pages covering South East England
- AI-generated card images for all location pages (444 images via Gemini)

### Features

- Contact form with Resend email integration
- GDPR-compliant analytics with consent management
- Schema.org structured data across all pages
- XML sitemap and RSS feed
- Performance tracking with degradation alerts
