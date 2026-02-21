# Example Pages — Lyra Theme

These example pages were auto-generated from the site analysis blueprints.
They demonstrate how to compose theme components into full pages.

## How to Use

1. Copy the desired page files into your site's `app/` directory
2. Adjust imports to match your project structure
3. Replace placeholder content with real data
4. Add metadata exports (`export const metadata: Metadata = { ... }`)

## Generated Pages

| Page Type | File Path |
|-----------|-----------|
| home | `app/page.tsx` |
| about | `app/about/page.tsx` |
| blog-list | `app/blog/page.tsx` |
| custom | `app/attendee-registration/page.tsx` |
| custom | `app/buffalo-2025/page.tsx` |
| custom | `app/privacy-policy/page.tsx` |
| custom | `app/tickets-checkout/page.tsx` |
| custom | `app/tickets-order/page.tsx` |

## Notes

- All components use theme token classes only (no hardcoded hex colors)
- Pages use Server Component pattern unless stateful interaction is needed
- Placeholder content is marked with comments
- `service-detail`, `blog-post`, and `location-detail` pages are NOT generated
  — they use dynamic `[slug]/page.tsx` routes from the base template
