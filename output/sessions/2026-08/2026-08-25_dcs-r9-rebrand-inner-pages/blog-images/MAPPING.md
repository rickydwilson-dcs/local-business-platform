# Blog hero image mapping — Phase 7

Shipped 2026-08-25 as part of the DCS r9 inner-pages rebrand. All 20 remaining blog posts
(the NP Racing PageSpeed post was reclassified as a project case study in Phase 4 and is
not covered here) now have a real, verified R2-hosted `heroImage`. The 15 posts that
previously carried a dead `placeholder/blog-*.webp` value, and the 5 that had no
`heroImage` field at all, are both covered.

Frontmatter stores the **relative R2 key** (e.g. `dcs/blog/blog-electrician-website.webp`),
per this repo's `ImagePathSchema`/`getImageUrl()` convention — not the full URL. The
rendering components (`BlogPage.tsx`, `BlogPostPage.tsx`) resolve it to a full URL via
`getImageUrl()` at render time, guarded by `isValidImagePath()`.

All R2 objects live under `dcs/blog/` with 1-year immutable cache headers
(`public, max-age=31536000, immutable`), uploaded via a one-off script using
`tools/lib/r2-client.ts`.

## Real screenshots (2)

| Post                                          | Source                                                           | R2 key                                   |
| --------------------------------------------- | ---------------------------------------------------------------- | ---------------------------------------- |
| `best-websites-for-electricians.mdx`          | Live screenshot of djfoxelectrical.com (hero section)            | `dcs/blog/blog-electrician-website.webp` |
| `best-websites-for-scaffolding-companies.mdx` | Live screenshot of www.colossus-scaffolding.co.uk (hero section) | `dcs/blog/blog-scaffolding-website.webp` |

Both are real client sites built on this platform — URLs confirmed from
`content/projects/dj-fox-electrical.mdx` and live-resolved (colossus-scaffolding.vercel.app
404s; the real production domain is www.colossus-scaffolding.co.uk).

## Category graphics (7)

Reusable r9-branded graphics (ink/navy gradient, magenta accent bar, aqua eyebrow label,
Archivo Black display type) — one per distinct `category` value among the 18 generic-advice
posts, generated via a local HTML template rendered in-browser and screenshotted.

| Category               | R2 key                                        | Posts using it                                                                                                                                                                                                                                        |
| ---------------------- | --------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `industry-guides`      | `dcs/blog/blog-cat-industry-guides.webp`      | `best-websites-for-plumbers.mdx`                                                                                                                                                                                                                      |
| `website-content`      | `dcs/blog/blog-cat-website-content.webp`      | `before-and-after-project-pages.mdx`, `how-to-write-a-good-testimonials-page.mdx`, `what-to-put-on-your-tradesperson-website.mdx`                                                                                                                     |
| `costs-and-value`      | `dcs/blog/blog-cat-costs-and-value.webp`      | `how-much-does-a-tradesperson-website-cost.mdx`, `is-it-worth-paying-for-seo.mdx`, `pay-monthly-vs-upfront-website.mdx`                                                                                                                               |
| `local-seo`            | `dcs/blog/blog-cat-local-seo.webp`            | `how-to-get-google-reviews-as-a-tradesperson.mdx`, `how-to-rank-on-google-maps.mdx`, `local-seo-for-tradespeople.mdx`, `schema-markup-for-tradespeople.mdx`, `service-pages-vs-location-pages-explained.mdx`, `what-is-a-google-business-profile.mdx` |
| `getting-found-online` | `dcs/blog/blog-cat-getting-found-online.webp` | `how-to-get-more-leads-from-your-website.mdx`, `website-vs-facebook-page-for-tradespeople.mdx`, `why-tradespeople-need-a-website.mdx`                                                                                                                 |
| `website-design`       | `dcs/blog/blog-cat-website-design.webp`       | `mobile-friendly-websites-for-tradespeople.mdx`                                                                                                                                                                                                       |
| `business-tools`       | `dcs/blog/blog-cat-business-tools.webp`       | `setting-up-google-workspace-for-small-business.mdx`                                                                                                                                                                                                  |

## Verification

All 9 R2 objects confirmed resolving with `curl -o /dev/null -w "%{http_code}"` → `200`
before any MDX frontmatter was written. All 20 posts' list-view thumbnails and detail-view
hero images visually confirmed rendering in a local dev server (Chrome screenshot) after
fixing a frontmatter/rendering convention mismatch (see below). `scripts/validate-content.ts blog`
passes 20/20 after the frontmatter update.

## Bug found and fixed during this phase

The Phase 3 heroImage rendering (in `BlogPage.tsx`/`BlogPostPage.tsx`/`ProjectsPage.tsx`/
`ProjectDetailPage.tsx`) originally guarded on `heroImage` being an absolute URL or a
`/`-prefixed local path, and passed it straight to `next/image`'s `src`. That's the
opposite of this repo's actual convention: `BlogFrontmatterSchema`'s `ImagePathSchema`
requires a **relative** R2 key (`site-name/...`), and `getImageUrl()` is what turns that
into a full URL at render time — full URLs were never meant to be stored in frontmatter.
The mismatch would have made every future correctly-authored `heroImage` value fail content
validation. Fixed by switching the four page components to `isValidImagePath()` +
`getImageUrl()` (both already exported from `@platform/core-components/lib/image` and
re-exported via `sites/dcs/lib/image.ts`) and storing relative keys in all 20 posts'
frontmatter.
