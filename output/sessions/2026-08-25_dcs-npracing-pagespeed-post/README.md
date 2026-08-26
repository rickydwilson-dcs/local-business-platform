# DCS x NP Racing — PageSpeed content

Blog post + Instagram post using NP Racing's real Google PageSpeed Insights scores
(npracingbsb.co.uk, captured 2026-08-25) as proof of DCS's engineering quality.

## Deliverables

- **Blog post:** `sites/dcs/content/blog/a-fast-team-needs-a-fast-website.mdx` — added directly
  to DCS's existing blog (DCS already had a full blog layout; no new template needed). Passes
  `validate-content.ts blog`.
- **Instagram caption:** `instagram-caption.txt`
- **Instagram graphic (final):** `dcs-npracing-pagespeed-instagram.png` — 1080x1350 (4:5 feed).
  Built as `graphic.html` (self-contained, animated — rings draw in, numbers count up on load)
  and captured via browser screenshot since it needed exact real numbers, not an AI-generated
  image. `graphic-full-raw.png` is the pre-resize stitched intermediate.
- **Source:** `graphic.html` — open it in a browser to see the animation play (or screen-record
  it directly for a Reels/Story cut; that'll look cleaner than a screenshot-stitched GIF).

## Brand note

First pass used DCS's current _live_ theme tokens (teal `#61A3BA` / lime `#D2DE32`, from
`sites/dcs/theme.config.ts`). Ricky corrected this mid-session: the graphic should use the
**new** DCS brand — the r9 redesign already live on the DCS homepage (`fuchsia + black`, not
the old Instagram-page look). Rebuilt against the actual tokens in
`sites/dcs/styles/home-r9.css` / `theme.config.ts` `colors.custom`: ink `#0E0E12`, paper
`#ECEBE9`, magenta `#D6006B`, aqua `#00D2D8`, navy `#17265E`, grey `#70707B`, Archivo
(400–900) + Poppins 300 for the logotype.

**The blog post page itself is still old-branded, and that's bigger than a quick reskin.**
Confirmed by reading `app/(site)/layout.tsx`: only the homepage (`app/page.tsx`, outside the
`(site)` route group) has been cut over to r9. All 14 other routes — blog, about, contact,
services, locations, pricing, everything — share one `SiteHeader`/`SiteFooter`/`PageShell`
still on the old teal/lime brand, and are deliberately `robots: noindex` because they aren't
finished. This is the in-progress site-cutover project tracked in
`output/sessions/2026-08/2026-08-23_dcs-homepage-nextjs-port/` — reskinning
`BlogPage.tsx`/`BlogPostPage.tsx` alone would strand new-brand content inside old-brand
header/footer chrome shared by all 14 routes, which reads worse than leaving it alone.
Ricky's call (25 Aug 2026): leave it — this is the real site cutover's job, not a side effect
of a blog post. Revisit when that project resumes.

## Real PageSpeed data used (verified via pagespeed.web.dev)

Superseded twice same day as Ricky shipped fixes — history kept for context:

1. **First pass (25 Aug, ~6:41am):** Mobile 99/96/100/100, Desktop 100/96/100/100. LCP 2.2s/0.5s, TBT 40ms/10ms.
2. **After an accessibility fix (25 Aug, ~9:30pm):** Accessibility hit 100 both devices, but mobile Performance dipped 99→96 and mobile Speed Index regressed 1.8s→3.9s (flagged to Ricky before updating).
3. **Final, current numbers (25 Aug, ~9:36pm) — what's in the post/graphic now:**

|                | Mobile | Desktop |
| -------------- | ------ | ------- |
| Performance    | 100    | 100     |
| Accessibility  | 100    | 100     |
| Best Practices | 100    | 100     |
| SEO            | 100    | 100     |
| LCP            | 1.8s   | 0.4s    |
| TBT            | 0ms    | 0ms     |
| CLS            | 0      | 0       |
