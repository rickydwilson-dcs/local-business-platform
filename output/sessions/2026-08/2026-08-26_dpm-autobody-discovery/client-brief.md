# DPM Autobody — Client Brief

**Status:** Discovery
**Opened:** 2026-08-26
**Client contact:** David Pearce-Martin, Director
**Company:** DPM Autobody, Berwick, East Sussex
**Phone:** 01323 552827
**Email:** info@dpmautobody.co.uk
**Current site:** https://www.dpmautobody.co.uk (Wix)
**Socials:** Facebook `/dpmautobody`, Instagram (handle to confirm), YouTube

---

## The email, verbatim

> Hi Ricky
>
> Good to chat earlier and looking forward to seeing what you put together!
> Like discussed we are a classic car restoration shop specialising in high end concours restorations. Everything hand crafted in house (minus engine building and trimming)
> Here are some other websites of some of the top guys (we actually do the paintwork for Halycon cars)
>
> https://www.eaglegb.com
>
> https://www.thorntonrestorations.com
>
> https://www.halcyon.works
>
> Even though myself I am not the most elegant man id like our website to have that appearance to match the level of works we do!
>
> Kind regards
> David

---

## What the brief actually asks for

1. **Positioning is "high end concours restoration"** — not bodyshop, not accident repair. The current
   site leads with "Body Shop | Car Repairs" and gives insurance/accident work equal billing with
   restoration. That is the single biggest gap between what David says the business is and what the
   website says it is.
2. **"Everything hand crafted in house (minus engine building and trimming)"** — in-house capability is
   a differentiator and should be stated explicitly rather than implied. Engine building and trim are
   subcontracted; do not claim them.
3. **"I'd like our website to have that appearance to match the level of works we do"** — the design
   bar is set by the three reference sites, all of which are considerably more restrained and more
   photographic than the current Wix site. Read this as: quiet, dark, typographic, image-led. Not busy.
4. **Halcyon relationship** — DPM does the paintwork for Halcyon cars. That is a strong credential and
   worth a named client/partner mention, **but confirm with David that Halcyon are happy to be named
   publicly** before it goes in a prototype that gets shared.

## Assets

| Asset                 | State                                      | Action                                                                                                                |
| --------------------- | ------------------------------------------ | --------------------------------------------------------------------------------------------------------------------- |
| Instagram photography | Client says there's a lot of good material | Need handle + permission to pull; Instagram is not publicly fetchable, so ask David for a shared album / drive folder |
| Hero video            | Being produced by the client               | Design hero to work **without** it first (poster-only fallback), slot video in later                                  |
| Logo                  | Unknown format                             | Ask for vector (AI/EPS/SVG). See the DCS logo trap: rasters wrapped in an SVG are not vectors                         |
| Existing site copy    | Live on Wix                                | Usable as a starting point; needs a rewrite for the concours positioning                                              |

## Constraints and platform notes

- Build target is the LBP monorepo — a new self-contained site under `sites/dpm-autobody`,
  copied from `sites/base-template`. No `@platform/themes/*` imports.
- Video hero means `media-src` must be added to the CSP (base-template ships without it — the first
  `<video>` anyone adds is silently blocked). Below-the-fold video must be `IntersectionObserver`-gated.
- `vercel.json` must carry the `ignoreCommand` turbo-ignore line.
