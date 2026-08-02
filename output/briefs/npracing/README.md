# NPRacing — Briefing Folder

Raw content intake for the NPRacing site build. This is **not** an automated
ingest-pipeline output (there's no reference site to scrape) — it's a manual
drop point for the client's own text and images, which then feeds a bespoke
design pass using the platform's UX skills.

See `brief.md` for the requirements captured so far.

## How to use this folder

Drop raw material into the matching subfolder. Files can be rough — notes,
half-written bios, screenshots from WhatsApp, whatever exists. Nothing here
needs to be publish-ready; it just needs to be enough to design and write from.

### `content/`

One `.md` file per section. Paste in whatever text the client has provided —
bios, race history, sponsor blurbs, etc. Doesn't need to be formatted.

| File             | Section  | Notes                                                              |
| ---------------- | -------- | ------------------------------------------------------------------ |
| `brand.md`       | Landing  | Team story, tagline ideas, tone of voice, any existing brand notes |
| `contact.md`     | Contact  | Address/phone/email if any, and links to social profiles           |
| `sponsors.md`    | Sponsors | Sponsor names, logos needed, blurb per sponsor, tier if any        |
| `races.md`       | Races    | Calendar/results — season, rounds, standings, upcoming fixtures    |
| `news.md`        | News     | Any press releases, announcements, or story ideas                  |
| `merchandise.md` | Merch    | Link to the external store, plus any featured-product notes        |

### `images/`

Flat drop folder — no subfolders. Long-term image hosting is R2 (per
[Images standard](../../../docs/standards/images.md)), so this is just a
staging spot for the handful of images we have now before they're uploaded
to R2 and referenced from content.

## Site scope (confirmed 2026-08-01)

- **Core pages requested by client:** Landing, Gallery, Contact (with links out to socials)
- **Upsell pages we're prototyping alongside:** Sponsors, Races, News
- **Merchandise:** no on-site store — a Merchandise section/CTA linking out to
  their existing external store
- **Explicitly out of scope:** services/locations pages (not a local-service
  business site, this is brand-building for a race team)

## Status

Intake open — folders created, awaiting content and images. Once populated,
next step is a UX design pass (design system + mockups) before any site
scaffolding happens under `sites/`.
