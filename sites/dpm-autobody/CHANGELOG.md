# DPM Autobody - Deployment History

High-end concours classic car restoration workshop, Berwick, East Sussex. Scaffolded from
`sites/base-template` — nothing deployed yet.

---

## 2026-09-11

### Scaffold

- Copied from `sites/base-template`. Stripped services/locations/blog/projects/reviews/about
  routes, content directories, and page components — DPM's approved design has no use for them
  (single workshop, no service-list page; see site-level `CLAUDE.md`).
- `site.config.ts` filled with real DPM business facts from the discovery-phase client brief;
  unconfirmed facts (address, hours, etc.) marked `TBC` rather than guessed.
- `theme.config.ts` colors/fonts sourced from the approved static prototype's CSS custom
  properties.
- Added `vercel.json` (`ignoreCommand`/turbo-ignore guard) and `media-src` to the CSP for the
  planned video hero.
- Not yet done: real page components (home/workshop/library/build pages), Vercel project
  creation, first deploy.
