# Base Template - Deployment History

Template site used as the gold-standard starting point for new client sites. Changes here represent updates to the template that all future sites will inherit.

---

## 2026-08-03

### UI

- Redesigned the homepage "merch" CTA band (`components/sections/merch-cta.tsx`): the cap product photo is now cropped tight to its own bounding box (object-cover against a fixed aspect ratio) rather than the source photo's mostly-empty square frame, still composited onto the red band via `mix-blend-multiply` so the white background drops out. Shown before the heading on mobile (it's the actual subject of the CTA), and vertically centred on the right side of the band on desktop — inset from the edges rather than bleeding into the corner, which had been clipping the crown and brim against the card's rounded corners. Straightens and grows on hover as a deliberately obvious sign of life, skipped under `prefers-reduced-motion`.
- Added a favicon (`app/icon.png`, `app/apple-icon.png`): the joined "NP" cropped from the team's oval logo mark, since the full mark's fine detail doesn't survive down to 16–32px. Required a `.gitignore` exception since the platform's images-go-to-R2 rule doesn't cover Next.js's file-based favicon convention — see root [CHANGELOG.md](../../CHANGELOG.md) and [docs/standards/images.md](../../docs/standards/images.md).
- Added a sponsor strip above the gallery section: a single auto-scrolling marquee of 7 partner logos (`components/sections/sponsor-marquee.tsx`), each linking out to the sponsor's own site or social page. Logos sourced from each sponsor's own site and recoloured to solid white-on-transparent so the whole strip reads as one calm monochrome row rather than mismatched coloured logos on cards. Added the `.marquee`/`.marquee-track` CSS pattern to `app/globals.css` (mirroring `npracing-v1`) — seamless loop, animation gated behind `prefers-reduced-motion`, paused on hover/focus since these are real links.
- Matt's team bio updated: role changed to "No. 1 Mechanic" with a job description. `lib/schemas/team.ts` gained an optional `description` field; `TeamPage` renders it when present.

---

## 2026-08-02

### Content

- Added two original race-report news posts (Snetterton Round 4, Brands Hatch Round 5) in the team's own voice.
- `content/news/` frontmatter schema (`lib/schemas/news.ts`) now accepts original team posts as well as attributed third-party coverage: `sourceName`/`sourceUrl` are optional, but must both be set (external story) or both omitted (original post) — a `.refine()` enforces the pairing. Previously every article was required to credit an external source, which didn't fit team-authored content.
- `news-index-page.tsx` and `news-detail-page.tsx` fall back to the site name (from `site.config.ts`) when an article has no source, and hide the outbound "read the original report" link entirely for original posts.
- `scripts/validate-content.ts`'s `EXPECTED_COUNTS.news` bumped from 2 to 4 to match the new total.
- Added hero images to both new race-report posts, uploaded to R2 (`npracing-v3/news/<slug>.jpg`).
- Fixed hero images being badly cropped on the detail page: the container forced every image into a fixed `aspect-[16/7]` wide-banner ratio with `object-cover`, which is fine for a landscape photo but cropped out roughly half of the portrait paddock shot and the bottom half of the cornering action shot. Written speculatively before any article had a real hero image, so the crop went untested until these two posts shipped. Replaced with a bounded-height container (`h-[24rem] sm:h-[32rem]`) and `object-contain` on a `bg-surface-card` backdrop — the full image now always shows, letterboxed rather than cropped, regardless of orientation.

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
