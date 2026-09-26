# CLAUDE.md - Delta T Racing

Guidance for Claude Code when working on `sites/delta-t-racing`.

## Overview

Website for **Delta T Racing**, a UK club motorcycle racing team (four riders, Bemsee / BMCRC
championship) and the sister team of NPRacing. Client contact is **Gene Goodrum** — team
principal and rider #679, who also commissioned Autcobel.

The site is a direct copy of `sites/npracing-v1`'s "Grid Box" design re-keyed from NPRacing red
to the blue in the Delta T logo (`#113A93`). See `theme.config.ts` for the palette and why text
accents use a derived tint (`#7089BE`) instead of the logo blue.

## Content (MDX frontmatter is the data)

| Folder              | What                                     | Loader            |
| ------------------- | ---------------------------------------- | ----------------- |
| `content/brand/`    | Singleton: team identity, classes, email | `lib/brand.ts`    |
| `content/team/`     | One file per rider (race number, bike)   | `lib/team.ts`     |
| `content/races/`    | One file per championship round          | `lib/races.ts`    |
| `content/news/`     | Race reports (MDX body)                  | `lib/news.ts`     |
| `content/sponsors/` | Sponsors (logo, bio, optional website)   | `lib/sponsors.ts` |

`scripts/validate-content.ts` pins exact record counts — update `EXPECTED_COUNTS` when adding a
rider, sponsor, round or report. Link a round to its report with `report: <news-slug>` in the
round's frontmatter (a test enforces the slug exists).

## Differences from npracing-v1 worth knowing

- **No merch.** The route, content type and loader were removed.
- **Socials are optional** everywhere (header, footer, mobile nav, contact) — the team has no
  confirmed accounts yet; riders' own Instagram lives on their `content/team` record.
- **JSON-LD is a local `SportsTeam` node** (`lib/schema.ts`), not the shared LocalBusiness
  generator, which requires geo coordinates the team doesn't have.
- **Contact form is off** (`siteConfig.features.contactForm = false`) until `RESEND_API_KEY`,
  `RESEND_FROM_EMAIL` and `CSRF_SECRET` are set on the Vercel project; the contact page leads with
  the team email instead.
- **Season calendar status** (complete / next up) is computed in the browser, so it stays correct
  without a rebuild.
- Images live on R2 under `delta-t-racing/`, uploaded with `tools/upload-delta-t-racing-to-r2.ts`
  (never overwrite an existing key — rename instead; the CDN caches for a year).
