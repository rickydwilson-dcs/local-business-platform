# DCH Automotive - Deployment History

Vehicle security, fleet electrics and ECU remapping installer serving the South East (Polegate/Eastbourne/Hailsham), migrated from a standalone WordPress site. Scaffolded from `sites/base-template` — entries before 2026-07 describe that shared template history, inherited at the time of copy.

---

## 2026-07-09

### Redesign & Launch

- Full visual redesign into a bespoke dark/orange, self-contained theme (no `@platform/themes/*` import) — see `theme.config.ts`
- Bespoke `ContactForm` (last generic UI component on the site) replacing the shared `@platform/core-components` version
- Real Car Remaps catalogue (Stage 1-3, Economy Tuning/BlueOptimize, Performance Tuning, Gearbox Tuning) as a Viezu Approved Dealer, with the embedded Viezu dealer-finder widget
- Real location content for Eastbourne, Polegate and Hailsham, replacing base-template placeholder locations
- Migrated the WordPress service catalogue per the client's keep/delete list: Vehicle Security (Bike Security merged in, Alarms removed), Parking Aids, Fleet Solutions (rebuilt around ViewMeLive's real categories), Accessories, and a new Dash Cameras category; **Tow Bars deleted entirely** per client instruction
- Site-specific `vercel.json` and `.env.example` prepared for first Vercel deployment, targeting the Vercel-assigned URL pending `dchautomotive.co.uk` domain cutover

### Fixes

- `-webkit-autofill` CSS override so browser-autofilled contact form fields (name/email/phone) keep white text legible against the dark theme
- Real hero imagery added to all three location pages (previously a placeholder icon)
- Dead `<button>` elements on the homepage and Car Remaps hero wired to real destinations
- Homepage hero heading/subtext/buttons resized down from an oversized all-caps treatment
- Removed lingering Tow Bars and Alarms references that survived into location-page copy and the homepage credentials strip after those services were deleted from the service catalogue during migration; trade-certification count corrected 7 → 6
- `CLAUDE.md` rewritten to describe this site's actual architecture (bespoke homepage/Car Remaps pages, dark theme, bespoke ContactForm) — was still the unmodified `base-template` guide
- All images (35 files: stock photography, Viezu marketing assets, site logo) migrated from local `public/` to the shared platform R2 bucket under the `dch-automotive/` key prefix, via new `tools/upload-dch-automotive-to-r2.ts`; every render call site now resolves through `getImageUrl()`

### Content

- `/car-remaps` expanded with a "What Is ECU Remapping?" explainer, a benefits section, and a 12-question FAQ covering legality, insurance, warranty, reversibility, Stage 1-3 differences and emissions/MOT compliance — with `FAQPage` JSON-LD

### Known Gaps

- `/reviews` still serves generic base-template placeholder testimonials; homepage testimonials are explicitly marked as samples pending real client quotes
- All imagery site-wide is still the Stitch-generated stock set, not real DCH photography — R2-hosted now, but not yet client-specific

---

## 2026-02-08

### Content

- Content schemas now imported from @platform/core-components (deduplication completed)
- Location MDX frontmatter aligned to canonical schema (heading→title, subheading→description, cta→ctaText/ctaUrl)

---

## 2026-02-07

### Features

- Supabase rate limiter integration (centralised from core-components)
- Focus trap for mobile menu and consent manager
- brand-primary theme tokens (replacing brand-blue)

### Content

- Location data moved to MDX frontmatter (coordinates, region, isCounty)

---

## 2025-12-21

### Launch

- Base template created as copy-and-customise foundation for new sites
- Theme system integration with `theme.config.ts`
- Complete site structure: app routes, components, content directory, lib utilities
- Example content: services, locations, blog posts, projects, testimonials
- Content validation system with Zod schemas
- Schema.org JSON-LD generators
