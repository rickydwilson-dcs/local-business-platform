# Mad Graphics

**Stage:** IN BUILD | **Trade:** Vehicle graphics, signs, banners & print | **Site:** `sites/mad-graphics`

---

## Business Details

| Field        | Value                                                                        |
| ------------ | ---------------------------------------------------------------------------- |
| Trading Name | Mad Graphics                                                                 |
| Owner        | Martin Adams                                                                 |
| Phone        | 01323 589 700                                                                |
| Email        | office@madgraphics.co.uk                                                     |
| Address      | Unit H2, Chaucer Business Park, Dittons Road, Polegate, East Sussex, BN26    |
| Hours        | Mon–Fri 8am–5:30pm, Sat by appointment, Sun closed                          |
| Established  | 2004                                                                         |
| Instagram    | @mad_graphicssussex                                                          |

## Domain & Hosting

| Field          | Value              |
| -------------- | ------------------ |
| Domain         | madgraphics.co.uk  |
| Status         | Not yet deployed   |
| Vercel Project | mad-graphics (TBC) |
| SSL            | Pending            |

## Theme

Cygnus — dark mode, Signal Orange `#F47B20`, Craft Green `#7AC143`, Press Black background.

## Service Areas

East Sussex: Eastbourne, Hastings, Lewes, Bexhill-on-Sea, Uckfield, Crowborough, Seaford, Hailsham, Newhaven, Polegate, Peacehaven, Battle, St Leonards-on-Sea, Heathfield, Pevensey, Ringmer, Herstmonceux, Wadhurst, Alfriston

**Out of scope:** Brighton, Hove, Portslade, Rottingdean, Saltdean (coverage stops before Brighton heading west)

## Content Plan

- 49 service pages (8 category hubs + 41 sub-service pages), all flat at `/services/[slug]`
- 19 location pages (9 Tier 1 + 10 Tier 2) at `/locations/[slug]`
- 2 blog posts
- 1 project case study
- 3 testimonials

## Key Constraints

- **No full vehicle wraps** — not offered. Must be stated explicitly in vehicle-graphics FAQ.
- **No sub-domain URL nesting** — all services flat at `/services/[slug]`, locations at `/locations/[slug]`

## Build Brief

Full W4 build brief: `output/sessions/2026-04-01_mad-graphics-build/session.md`

## Outstanding

- [ ] W4 build: trigger via Telegram referencing the session file above
- [ ] WCAG contrast check after build
- [ ] Create Vercel project (Root Directory: `sites/mad-graphics`)
- [ ] Set environment variables in Vercel
- [ ] Configure madgraphics.co.uk DNS
- [ ] Google Search Console — submit sitemap
- [ ] GA4 property (when client is ready)
- [ ] Populate real project photos when received from Martin

## Notes

Site spec provided by client (Mad Graphics Claude Code Spec). Domain corrected from `madgroup.info` to `madgraphics.co.uk`. Cygnus theme was built specifically for the design/print/signage trade type — good fit out of the box.
