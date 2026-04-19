# Design Brief Summary

Generated: 2026-04-17T19:22:50.636Z | Pipeline: v1.0.0
Source: https://navagarden.hu/

## Color Palette

| Token                   | Value                   | Role                |
| ----------------------- | ----------------------- | ------------------- |
| brand.primary           | `#DBA746`               | Primary brand color |
| brand.primaryHover      | `#DBA746`               | Hover state         |
| brand.secondary         | `#1E2F4B`               | Secondary color     |
| brand.accent            | `#DBA746`               | Accent color        |
| brand.onPrimary         | `#1E2F4B`               | Text on primary     |
| surface.background      | `#F9FAFB`               | Page background     |
| surface.foreground      | `#333333`               | Body text           |
| surface.muted           | `#ECE3DC`               | Muted background    |
| surface.mutedForeground | `#595959`               | Secondary text      |
| surface.card            | `#FFFFFF`               | Card background     |
| surface.cardBorder      | `#E5E7EB`               | Card border         |
| surface.inverse         | `#000000`               | Inverse (dark) bg   |
| overlay.dark            | `rgba(51,51,51,0.7)`    | Dark image overlay  |
| overlay.light           | `rgba(255,255,255,0.8)` | Light overlay       |
| overlay.primary         | `rgba(219,167,70,0.8)`  | Brand overlay       |
| semantic.success        | `#10b981`               | Success states      |
| semantic.warning        | `#f59e0b`               | Warning states      |
| semantic.error          | `#ef4444`               | Error states        |
| semantic.info           | `#3b82f6`               | Info states         |

## Typography

**Sans:** Work Sans, system-ui, sans-serif
**Heading:** Audrey, system-ui, sans-serif
**Heading style:** serif | **Heading weight:** bold | **Body weight:** normal
**Inline color highlights:** false

**Type Scale:**

| Level | Size      | Line Height | Weight |
| ----- | --------- | ----------- | ------ |
| hero  | 160px     | 134px       | 400    |
| h1    | 160px     | 134px       | 400    |
| h2    | 39.0625px | 46.875px    | 500    |
| h3    | 31.25px   | 37.5px      | 500    |
| h4    | 25px      | 30px        | 500    |
| body  | 16px      | 22.4px      | 300    |

## Layout

**Hero type:** split | **Background image:** true | **Dark header:** false
**Spacing density:** standard
**Container width:** `max-w-7xl`
**Section padding:** `py-16 md:py-24`

## Component Variants

| Variant        | Value      |
| -------------- | ---------- |
| heroVariant    | split      |
| headerVariant  | light      |
| headerStyle    | solid      |
| cardVariant    | standard   |
| sectionVariant | standard   |
| buttonRadius   | rounded    |
| cardRadius     | rounded-xl |

## Page Blueprints

### home

1. **navigation-logo-links** (Navigation) — Primary site navigation with logo, nav links and CTA booking button appearing on every page
2. **hero-split-image-text** (Hero) — Main hero introducing the property with headline, description text, CTA link and a large property photo
3. **cards-three-column-features** (Cards) — Three feature highlights showcasing exterior, interior and sports/activity amenities
4. **content-gallery-heading** (Content) — Photo gallery section showcasing the property in images
5. **social-proof-provider-card** (Social Proof) — Highlights an on-site service provider with quote, role and website link
6. **footer-contact-info** (Footer) — Site footer with logo, tagline, owner names, contact details, address, social icon and legal links

### custom

1. **navigation-logo-links** (Navigation) — Primary site navigation with logo, nav links and CTA booking button appearing on every page
2. **content-text-block** (Content) — Introduces gift voucher offering with pricing details and peak period information
3. **cta-form-split** (CTA) — Gift voucher order form section allowing users to request or purchase vouchers
4. **footer-brand-contact** (Footer) — Site footer with logo, tagline, owner names, contact details, address, social media icon and legal links appearing on every page

### custom

1. **navigation-logo-links-cta** (Navigation) — Top navigation bar with logo, nav links and a highlighted CTA button for pricing/booking
2. **content-two-column-text-image** (Content) — Flexible two-column content section displaying rich text, pricing tiers, lists and a CTA alongside a large property photo; reused for pricing and gift voucher pages
3. **footer-brand-contact** (Footer) — Site footer with logo, tagline, owner names, contact details, address, social media icon and legal links appearing on every page
4. **footer-legal-bar** (Footer) — Bottom legal strip with copyright notice, made-with credit and legal document links

## Visual Tone

**Description:** Bold, professional split layout with standard spacing and high-contrast warm #DBA746 accents

**Design Skill Dials:**

- Variance: 8/10
- Density: 5/10
- Motion: 7/10

**Anti-patterns to avoid:**

- avoid cool blue or green accents

**Reference:** https://navagarden.hu/ — vega pattern site, 3 pages analysed, 12 sections identified, split hero with standard density
