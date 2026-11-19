# The Graphic Kings — prototype session

**Status:** In progress (started 2026-11-08)
**Goal:** Iterate a new look and feel for Mad Graphics' rebrand to **The Graphic Kings** as an HTML prototype, reusing the Mad Graphics services and locations as content. Build comes later, once a direction is approved.

## Decisions

- **Name:** "The Graphic Kings" (singular "Graphic", per the logo). Not "Graphics Kings".
- **Site folder (at build):** `sites/tgk`. Sister brands: `tck` (The Clothing Kings), `ttk` (The Tape Kings).
- **Prototype Vercel project:** `graphic-kings-proto` (the `-proto` suffix is mandatory, see root CLAUDE.md).
- **Prototype lives here**, in plain HTML. No `sites/tgk` until a direction is approved.
- **`sites/mad-graphics` stays frozen** as the content source and reference. Never deployed, so no redirects needed.
- **Mad Graphics MDX is a first pass.** Ricky is happy for the copy to be rewritten and renewed when forked into `sites/tgk`, not just find-and-replaced.

## Brand family

Three sister companies with near-identical sticker-style logos (white script, heavy black outline, white halo, crown) differing only in crown colour: Tape Kings blue, **Graphic Kings red**, Clothing Kings yellow. Long term, all three sites should share a strong familial resemblance, whether shop or brochure.

- **TTK** (`~/Sites/ttk`, WooCommerce, approved tokens in `design/tokens.json`): near-black `#0b0d10`, paper `#f5f6f7`, accent blue `#1990da`, Barlow Condensed display + Barlow body, 1240px wrap, 6px radius. Best visual reference for the family skeleton.
- **TCK:** live site is old WordPress. `~/Sites/tck` is a 3D custom-clothing render experiment only.
- **Approach:** shared skeleton, per-brand accent. TGK tokens use the same group/variable structure with a `--tgk-` prefix.

## Logo

`logo/tgk-logo.svg` — traced from the supplied photo (`~/Downloads/tgk logo.jpg`, 690x679). Four layers: white sticker silhouette, black outlines, red crown. Sampled colours: white `#FBFAF6` (set to `#FFFFFF`), black `#160E0B`, red `#DD201B`. The red is sampled from a photograph under uneven light, so confirm against the client's original artwork. First-pass trace: some thin inner crown hairlines and a small artefact near the "i" in Kings. Replace with the client's vector if one exists.

## Content scope: 40 services (from 49)

**Dropped:** Workwear & Merchandise hub, Printed Workwear, Hi-Vis Clothing, Embroidered Uniforms, Branded Merchandise, Personalised Gifts (all go to The Clothing Kings, link to TCK); Canvas Prints (not offered). **Merged:** Large Format Printing into Large Format Print; Vehicle Livery into Fleet Graphics.

- **Vehicle graphics** (no full wraps, state in FAQ): Vehicle Graphics (hub), Car, Van, Fleet (absorbs Livery), Magnetic Signs
- **Signs & signage:** Signs & Signage (hub), Shop Signs, A-Boards, Directional Signs, Safety Signs, Site Boards, Foam Board & Correx, Hoarding Graphics
- **Banners:** Banners (hub), PVC, Mesh, Fabric, Roller
- **Large format, window, wall:** Large Format Print (hub), Poster Printing, Exhibition Prints, Window Graphics, Window Stickers, Wall Graphics, Floor Graphics
- **Stickers & labels:** Stickers & Wall Graphics (hub), Custom Stickers, Labels
- **Print & stationery:** Marketing Print (hub), Business Cards, Flyers & Leaflets, Brochures, Letterheads, Presentation Folders, Menu Printing
- **Design:** Graphic Design (hub), Logo Design, Brand Identity, Print Design, Artwork & Pre-Press

Locations: 19 East Sussex pages carry over (Brighton/Hove coverage stays out of scope). Service range confirmed by the client.

## Brand-touchpoints inventory (read-only grep of `sites/mad-graphics`)

- "Mad Graphics" appears 43 times in prose across 49 service + 20 location files; `mad-graphics/...` R2 image keys: 98 hero, 49 services, 19 locations
- Config: `site.config.ts`, `theme.config.ts`, `vercel.json`, `package.json`, `README.md`, `generation-manifest.json`
- App: `app/about`, `app/services`
- Contact: `office@madgraphics.co.uk`, `madgraphics.co.uk`, Instagram `@mad_graphicssussex` (see Contact details below for what changes)

## Contact details (confirmed by Ricky, 2026-11-08)

| Field   | Value                                                                                                  |
| ------- | ------------------------------------------------------------------------------------------------------ |
| Phone   | 01323 589 700 (unchanged)                                                                              |
| Email   | office@thegraphickings.co.uk (new)                                                                     |
| Hours   | Mon–Fri 8am–5pm, Sat by appointment, Sun closed                                                        |
| Address | Unit H2, Chaucer Business Park, Dittons Road, Polegate, East Sussex, BN26 (assumed unchanged, confirm) |

Hours were 8am–5:30pm Mon–Fri in the Mad Graphics tracker; Ricky said "typically 8 to 5", so the closing time moved to 5pm. Domain is presumably thegraphickings.co.uk, inferred from the email address, not yet confirmed. Instagram handle still unknown.

## Design directions

Ricky's starting brief: black ground with red accents, not far from the Mad Graphics look, and a common look for graphics companies. Iterate on that, plus one closer to the sister sites, plus whatever the design skills suggest.

- **A: Black and red.** Black background, red accent. Iterates on the Mad Graphics (Cygnus) look.
- **B: Kings family.** Black header, white main body, black footer, red accent. Matches TTK (and the intended TCK).
- **C: Skill-led wildcard.** Direction proposed from the design skills (impeccable, ui-ux-pro-max, design-taste-frontend) that is neither of the above. To be decided.

## Content clean-up needed at build

- 15 of 19 location pages link to or mention dropped services (canvas, workwear, hi-vis, embroidery, merchandise, gifts; 77 lines in all)
- `poster-printing.mdx` links to a dropped slug
- `large-format-print.mdx` description mentions canvas prints
- Add a "Clothing & workwear → The Clothing Kings" link (placement to be decided; TCK is still old WordPress)

## Open items

1. Client's original logo artwork (vector if possible), and confirmation of the red
2. New domain (assumed thegraphickings.co.uk), and whether madgraphics.co.uk redirects (affects build and 301 plan)
3. Instagram handle under the new brand; confirm the address is unchanged
4. Visual references the client likes or dislikes
5. Launch timing

## Plan

1. Brand tokens: derive `--tgk-*` from the TTK skeleton plus the red accent
2. Three homepage directions, using real services as content
3. Pick one, carry it through: service hub, service detail, location, contact
4. Upload assets to R2 (`tools/upload-prototype-assets.ts`), publish (`tools/publish-prototype.ts`) to `graphic-kings-proto`
5. Client review, then build: fork `sites/mad-graphics` to `sites/tgk`, rewrite copy, self-contained theme

---

## Progress (updated 2026-11-23)

**Direction chosen: A (black + red).** B, C1, C2, C3 homepages stay in `prototype/` as the record of what was explored (all fit-to-viewport and image-led after round 2); not being carried forward.

**Direction A prototype, `prototype/a-black-red/` (7 pages + a comparison page):**
`index.html`, `services.html` (hub), `service-vehicle-graphics.html` (detail template, "Van graphics"), `location-eastbourne.html`, `locations.html` (areas index), `about.html`, `contact.html` (form sends nothing), and `use-cases-options.html` (the three alternatives considered for the homepage "One job, whole kit" section; option 1, the selector, was chosen). Inner pages are generated by `build_inner.py` from the homepage header/footer: edit `index.html` or the script, then `python3 build_inner.py`.

**Decisions made this round**

- Homepage: removed "Why people ring us", empty "Recent work" and the reviews placeholder (an "Est. 2004" claim is not a reason to choose them). New section "One job, whole kit": a fixed-height selector of four occasions (trade shows and events, building sites, opening a new unit, inside the workplace), each with a photo and the products it needs. Distinct from the service categories by design.
- One image system: 8px red stripe on the edge facing the text + "Illustrative mock-up" tag; heroes are copy left, image right.
- Header nav wired on all pages. Footer: contact / hours / areas columns, then "The Kings family" logo row (dark tiles, links to thetapekings.co.uk and theclothingkings.co.uk, both returned 200), then "Website by Digital Consulting Services Limited" (name assumed from a garbled "Digital Cattle Scaffolding Services Limited"; link https://www.digitalconsultingservices.co.uk. Confirm).
- Every desktop section fits its viewport at 1440x900, 1280x720 and 1366x640; mobile stacks. Not tested: Safari, keyboard/tab arrow keys on the selector, mobile menu.

**Copy still unverified (confirm with the client before anything is public):** material wording (laminate, one-way film, mesh, eyelets), "same workshop, same number" on About, the occasion product lists, sister-company descriptions, generic process steps and FAQs. Dropped on purpose: prices, durations, "20+ years", "Est. 2004", insurance claim, testimonials.

**Not in git (local only, gitignored):** `_shared/tgk-logo.svg` (traced logo), `_shared/img/` (14 Higgsfield mock-ups, web/ + raw/), `_shared/ttk-logo.png`, `_shared/tck-logo.png`. `_shared/img/jobs/*.out` job logs were deliberately not committed. These must exist on disk, then go to R2 via `tools/upload-prototype-assets.ts`, before the prototype can be published.

**Local server:** `~/…/scratchpad/serve.py` (no-store headers, dual-stack, port 8800) was started this session; the old plain `http.server` caused stale CSS across browsers. CSS links carry `?v=`; bump it when CSS changes.

**Next session: publish the prototype.** Upload assets to R2, publish to Vercel as `graphic-kings-proto` (never the bare name), per `docs/guides/prototype-hosting.md`. Then client review. Open client items are in "Open items" above (original logo vector, domain, Instagram, address, launch timing, real project photos), plus a proper vector for the Tape Kings and Clothing Kings logos.
