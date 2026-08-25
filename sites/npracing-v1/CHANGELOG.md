# NPRacing (v1) - Deployment History

British Superbike (BSB) race team site, self-contained per the platform's site self-containment migration. The client's chosen design ("Grid Box") — see root `MEMORY.md` for the split with the frozen `npracing-v3` reference build.

---

## 2026-08-25

### Bugs

- Actually fixed the CSP `eval`-blocked console warning noted as harmless on 2026-08-24 — it was harmless (Zod's `allowsEval` probe was always caught internally), but it also shouldn't have been happening at all: `components/ui/gallery-lightbox.tsx` imported `useFocusTrap` from the bare `@platform/core-components` barrel instead of a subpath, which dragged the entire shared package — including Zod-dependent content-schema code — into this site's client bundle for no reason. Switched to `@platform/core-components/hooks/useFocusTrap` (a new subpath added to the package). Verified by rebuilding and confirming Zod no longer appears anywhere in `.next/static/chunks`. See `packages/core-components/CHANGELOG.md`.

### Accessibility

- Fixed a Lighthouse low-contrast failure that hit every "faint eyebrow label" on the site — the marquee ticker, the footer's TEAM/MORE/GET IN TOUCH headings, the footer copyright and "Digital Consulting Services" credit link, stat-strip labels, and contact-page labels. All of them share one token, `surface.tertiaryForeground` (`theme.config.ts`), which at `#676765` only reached 3.49:1 against the `#0A0A0A` body background — below WCAG AA's 4.5:1 minimum for normal-size text (12–14px, bold/uppercase doesn't qualify as WCAG "large text"). Brightened it to `#8A8985`, which clears 4.5:1 against every surface shade the token appears on (worst case 4.92:1 against the `#1B1B1B` muted panel background), while staying visibly a step darker than `secondaryForeground` so the label hierarchy is unchanged.

## 2026-08-24

### Bugs

- Fixed a missing `favicon.ico`. `app/icon.png`/`app/apple-icon.png` (Next's metadata-icon files) were already present, but Chrome always requests `/favicon.ico` directly regardless of the generated `<link>` tags, so that request 404'd on every load. Added `app/favicon.ico` (16/32/48/64px, generated from `icon.png`).

### Performance

- Audited every `<Image>` on the site against a Lighthouse pass that flagged two homepage images for insufficient compression, and applied an explicit `quality` prop by role across all pages: `65` for photographic content (hero, team/rider/product photos, gallery tiles, article hero images) and `50` for the small repeating sponsor-marquee logos. Brand-logo assets (header/footer/mobile-nav, the single-logo sponsor showcase page) and the gallery lightbox's full-screen view were left at the default so text/edges and zoomed detail stay sharp. A CSP console warning reported alongside these (`script-src` blocking `eval`) is harmless — traced to Zod 4.1.12's `allowsEval` feature probe, which the site's CSP correctly leaves blocked in production; no code change needed.

---

## 2026-08-15

### Content

- Milo's team bio: role changed from "Technician" to "Data Engineer" (matching Jack's existing title — both now credited with that role).

---

## 2026-08-14

### Bugs

- Fixed the homepage sponsor ticker's The Clothing Kings logo, which had degraded into an illegible white blob. The original `sponsors/the-clothing-kings-white.png` had been flattened by an alpha-only recolour that couldn't distinguish the logo's black outline strokes from its white fill, so both collapsed into one solid shape and the letterforms disappeared. Rebuilt from the clean full-colour source already used on `/sponsors` (`the-clothing-kings-full.png`): thresholded on luminance so the black outline becomes transparent (revealing the ticker's dark background as the letter-separating gaps) while the white fill and gold crown both resolve to solid white — incidentally also satisfying the ticker's existing "recoloured to solid white-on-transparent" convention. Uploaded as a new R2 key (`sponsors/the-clothing-kings-white-v2.png`) rather than overwritten in place, since overwriting an R2 key doesn't bust the CDN's 1-year immutable cache — `components/sections/sponsor-marquee.tsx` updated to reference the new key and its actual (490×492) dimensions.

---

## 2026-08-13

### Content

- Added two Elliott 51 partnership products to `/merch`: a hoodie (£35.00) and t-shirt (£30.00), both printed front/back/sleeves. Sourced from The Clothing Kings' product pages and follows the existing merch pattern — new `content/merch/*.mdx` entries (schema-validated against `lib/schemas/merch.ts`), product photos downsized to the site's standard 700×700 and uploaded to R2 at `npracing-v1/merch/`.

### Features

- Added a dedicated `/sponsors` page and nav item, giving each partner real room instead of only a logo in the homepage ticker. New self-contained `sponsors` content type (`content/sponsors/*.mdx`, `lib/schemas/sponsors.ts`, a loader mirroring the existing `team`/`merch` pattern) and a `SponsorsPage` component that lays sponsors out as alternating logo/bio spotlight sections — each with a tagline, full bio, and a "Visit website" link out. This is a separate, richer surface from the homepage's `SponsorMarquee` (the quiet monochrome auto-scrolling strip), which is unchanged.
- Populated with six sponsors, bios and taglines supplied by the client: The Clothing Kings, GPS Photography, GB Racing, HEL Performance, MHP Exhausts, and The Race Shop. Three sponsors already in the homepage ticker (Berkshire Cycles, Emerson Cranes, Lowe Rental) don't have bios yet and aren't on the new page — pending client copy.
- Logo sourcing varied per sponsor and is worth noting for future upkeep: The Clothing Kings' full-colour logo was pulled from their own site (the site previously only had the ticker's recoloured white variant) and uploaded to R2. MHP Exhausts' logo was extracted from their site and hand-converted to a genuine two-tone black-and-white (white shield, black lettering, transparent background) rather than a simple grayscale desaturation — the source badge's near-black navy fill would otherwise have all but disappeared against the site's own near-black card background. The Race Shop's logo is hosted as the original SVG for crisp scaling, matching how HEL Performance's logo is already handled. All new assets live under the same `npracing-v1/sponsors/` R2 prefix as the existing ticker logos.
- The client's supplied bio text named this sponsor "MPH Exhausts", but the sponsor's own domain (`mhpexhaust.com`), Instagram handle (`mhp_exhausts`), and logo artwork all read "MHP Exhausts" — used the verified name rather than the bio text's spelling.
- `app/sitemap.ts` gained a `/sponsors` entry (same priority/frequency as `/team`).

---

## 2026-08-06

### Content

- Martin's team bio: added a job description for his existing "Clothing & Helper" role (bike/team graphics, keeping the team looking professional, general help on and off the grid).
- Ted's team bio: role changed from "Team Helper" to "Rider Mentor" with a description (mentoring Brayden since he arrived in the UK, encouraging him to reach his full potential).
- Neil's team bio: role changed from "Team Boss" to "The Boss" with a description (runs everything from finance to rebuilding the bike, keeps the team together).

---

## 2026-08-05

### Content

- Removed the two externally-sourced news posts (`brayden-elliott-knockhill-return`, `connor-thomson-rookie-signing` — both credited to BritishSuperbike.com) — the news section is now team-written original posts only, going forward. `scripts/validate-content.ts`'s `EXPECTED_COUNTS.news` dropped from 4 to 2 to match.
- Gary's team bio updated: role changed from "Photography" to "Photographer" with a job description (circuit photography/GoPro filming, garage and pit-lane behind-the-scenes coverage).
- Aimee's team bio: added a job description for her existing "PR" role (grid umbrella duties, keeping riders hydrated).
- Lee's team bio: added a job description for his existing "Tyres" role (race tyre fitting/strip/clean, wheel and disc checks after a crash, control stickers, tyre data logging).

### Features

- Home page rider spotlight now shows a looping background video (Brayden Elliott, extracted from the team's Facebook reel) in place of the static action photo, uploaded to R2 at `npracing-v1/videos/rider-spotlight-2026-08.mp4`. Capped to the same 4:3 aspect ratio the section was designed around — left unconstrained, the video's native portrait aspect ratio (it's a vertical reel) blew the section height out.
- `next.config.ts`'s CSP gained a `media-src 'self' *.r2.dev` directive — previously missing entirely, so it fell back to `default-src 'self'` and would have silently blocked the video (no console-visible CSP error, it just never loads). See root `docs/standards/security.md`'s CSP Notes for the general pattern.

---

## 2026-08-04

### Bugs

- Fixed the mobile burger menu rendering broken in a resized desktop browser (worked fine on an actual phone). The header's `backdrop-blur-md` (a `backdrop-filter`) establishes a containing block for `position: fixed` descendants per spec — the mobile nav dialog was a `fixed inset-0` child of that header, so instead of covering the viewport it was confined to the header's small pill box, spilling its own content over the page underneath. `components/site-nav-mobile.tsx` now portals the open dialog to `document.body` via `createPortal`, so it's never a descendant of the blurred header.
- Fixed the burger menu being unclickable in local dev (`next dev`): `next.config.ts`'s CSP dropped `unsafe-eval` in every environment, but dev mode's webpack HMR/React Refresh runtime needs it, so it threw an `EvalError` on load and silently broke all client-side interactivity site-wide, not just the menu. Now gated behind `process.env.NODE_ENV === 'development'` — see root `CHANGELOG.md` for the same fix applied across every site.

### UI

- Mobile nav overlay now shows the team logo (top-left, same asset as the desktop pill nav) instead of the "NPRACING" text wordmark, matching the close button's position on the right.

### Features

- Wired up the contact form: it now actually submits (CSRF-protected POST to `/api/contact`) instead of intercepting the submission and displaying a "not sent" message. Enquiries route to `team@npracingbsb.co.uk`; the publicly displayed `npracingbsb@hotmail.com` address is unchanged, per the client's request to keep it as the visible contact point.
- Found and fixed a delivery gap while testing the above live: `npracingbsb.co.uk` was already verified in Resend, but nothing set `RESEND_FROM_EMAIL` for this site, so outbound mail fell back to Resend's sandbox domain (`noreply@resend.dev`) — which silently restricts delivery to the Resend account's own email regardless of recipient, even though the domain itself was verified. Set `RESEND_FROM_EMAIL=noreply@npracingbsb.co.uk` locally and in Vercel (Production + Preview). Same root cause likely affects other sites on the platform that never set this var — see root `docs/guides/adding-new-site.md`, now updated to require it.

---

## 2026-08-03

### UI

- Redesigned the homepage "merch" CTA band: the cap product photo is now cropped tight to its own bounding box (object-cover against a fixed aspect ratio) rather than the source photo's mostly-empty square frame, still composited onto the red band via `mix-blend-multiply` so the white background drops out. Shown before the heading on mobile (it's the actual subject of the CTA), and vertically centred on the right side of the band on desktop — inset from the edges rather than bleeding into the corner, which had been clipping the crown and brim against the card's rounded corners. Straightens and grows on hover as a deliberately obvious sign of life, skipped under `prefers-reduced-motion`.
- Added a favicon (`app/icon.png`, `app/apple-icon.png`): the joined "NP" cropped from the team's oval logo mark, since the full mark's fine detail doesn't survive down to 16–32px. Required a `.gitignore` exception since the platform's images-go-to-R2 rule doesn't cover Next.js's file-based favicon convention — see root [CHANGELOG.md](../../CHANGELOG.md) and [docs/standards/images.md](../../docs/standards/images.md).
- Added a sponsor strip above the gallery section: a single auto-scrolling marquee of 7 partner logos (`components/sections/sponsor-marquee.tsx`), each linking out to the sponsor's own site or social page. Logos sourced from each sponsor's own site and recoloured to solid white-on-transparent so the whole strip reads as one calm monochrome row rather than mismatched coloured logos on cards. Reuses the `.marquee`/`.marquee-track` CSS already in `app/globals.css` (previously only used by the text ticker) — seamless loop, animation gated behind `prefers-reduced-motion`, paused on hover/focus since these are real links.
- Matt's team bio updated: role changed to "No. 1 Mechanic" with a job description. `lib/schemas/team.ts` gained an optional `description` field; `TeamPage` renders it when present.
- Jack's team bio updated: role changed from "Technician" to "Data Engineer" with a job description (uses rider feedback and data to optimise chassis and bike performance).

---

## 2026-08-02

### Content

- Added two original race-report news posts (Snetterton Round 4, Brands Hatch Round 5) in the team's own voice.
- `content/news/` frontmatter schema (`lib/schemas/news.ts`) now accepts original team posts as well as attributed third-party coverage: `sourceName`/`sourceUrl` are optional, but must both be set (external story) or both omitted (original post) — a `.refine()` enforces the pairing. Previously every article was required to credit an external source, which didn't fit team-authored content.
- `news-index-page.tsx` and `news-detail-page.tsx` fall back to the site name (from `site.config.ts`) when an article has no source, and hide the outbound "read the original report" link entirely for original posts.
- `scripts/validate-content.ts`'s `EXPECTED_COUNTS.news` bumped from 2 to 4 to match the new total.
- Added hero images to both new race-report posts, uploaded to R2 (`npracing-v1/news/<slug>.jpg`). Fixed a pre-existing bug in `news-detail-page.tsx` where `heroImage.src` was passed straight to `next/image` without going through `getImageUrl()` — unlike every other image reference in this site (merch, the news sitemap, and v3's equivalent detail page) — so it would have rendered a broken image the first time any news article set a hero image, which is exactly what these two did.

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
