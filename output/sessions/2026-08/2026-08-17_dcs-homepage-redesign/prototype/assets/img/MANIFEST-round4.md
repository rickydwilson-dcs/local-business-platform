# Round 4 media — furnishing the rooms

Generated 2026-08-18 with Higgsfield for round 4, so the Poster variations can be seen
**furnished** rather than with empty content slots.

Illustrative media of the kinds of business DCS works with. **Not** photographs of DCS, of
Ricky Wilson, or of any named client.

## VERIFY BEFORE USE

`ls assets/img/web/ assets/video/` and use only what exists. Generation runs in batches and
any single item may have failed.

## New images (round 4) — `assets/img/web/<name>.jpg`

| File              | Sector / use                                            |
| ----------------- | ------------------------------------------------------- |
| `sector-florist`  | Florist — retail, no people                             |
| `sector-barber`   | Barbershop — personal services, no people               |
| `sector-bakery`   | Artisan bakery counter — food, no people                |
| `sector-garden`   | Designed urban garden — landscaping / outdoor trades    |
| `detail-swatches` | Colour swatch fan on a desk — craft/process texture     |
| `detail-parcel`   | Hands wrapping a parcel — eCommerce fulfilment, no face |

## Video — `assets/video/<name>.mp4`

Short silent 5s 720p loops, 16:9. These are the main new furniture.

| File            | Content                                                      | Good for                                  |
| --------------- | ------------------------------------------------------------ | ----------------------------------------- |
| `vid-fabric`    | Coloured fabric unrolling across a worktable in raking light | Makers / eCommerce slot, hero band        |
| `vid-pour`      | Milk poured into coffee, slow swirl                          | Hospitality slot                          |
| `vid-shopfront` | Small shop interior at opening, light moving, door swinging  | Retail slot, ambient hero                 |
| `vid-ink`       | Saturated coloured ink blooming through water                | Pure furniture — carries the chord itself |

### Video rules — these matter

1. `muted playsinline loop autoplay` plus a `poster` frame and `preload="metadata"`.
2. **Pause under `prefers-reduced-motion`.** Autoplaying video is a genuine accessibility
   failure; set `autoplay` only when motion is allowed, and expose a pause control if a video
   is prominent.
3. A text alternative nearby — a caption or adjacent copy describing what it shows.
4. If the file fails to load, the layout must not collapse. Give the container an
   `aspect-ratio` and a solid neutral fallback.
5. `vid-ink` is the one that carries colour directly — it suits a chord that wants its
   furniture to _move_.

### Serving video locally — read this before concluding a video is broken

1. **`python3 -m http.server` does not support HTTP Range requests.** Chrome requires them
   for media, so video will hang at `readyState 0` with no error and look broken. Use a
   range-capable server, or open the page over `file://`.
2. The four MP4s have been **remuxed to faststart** (`moov` before `mdat`), verified by atom
   order, so they begin playing without downloading the whole file. As generated they were
   not faststart — if you regenerate any video, remux it.
3. **Playwright's bundled Chromium cannot decode H.264** and sits at `readyState 0` with no
   error. **System Google Chrome plays them fine** — confirmed by four directions
   (`readyState 4`, 1280×720, no errors), driven via puppeteer-core or by pointing Playwright
   at the system channel. So a `readyState 0` is a harness limitation, never a bad asset. Do
   not delete or replace these files on the strength of it.
4. **Duotone photographic media through your chord.** `vid-ink.mp4` is natively warm pink and
   gold — dropped in ungated it will contradict any cool-chord page. `mix-blend-mode:
luminosity` over a tinted plate works; note a high-key clip under `luminosity` can wash a
   saturated plate pale, in which case `multiply` holds the field better.

## Everything else still available

Round 1 (trades-led): `trade-electrician`, `trade-plumber`, `trade-scaffolder`, `trade-van`,
`phone-on-site`, `tools-flatlay`, `locale-south-downs`, `texture-paper`, `texture-dark-grain`,
`abstract-mesh`, `workspace-desk`, `hands-sketching`.

Round 2 (sector-spanning): `sector-boutique`, `sector-maker`, `sector-studio`, `sector-salon`,
`sector-office`, `sector-cafe`, `still-products`, `laptop-store`, `interior-light`,
`texture-linen`, `abstract-wash`.

## Honesty rules — binding

1. **Never caption generated media as a real named client's premises, shop, van or team.**
   That fabricates a record about a real business. Portfolio entries stay CSS-drawn mocks,
   outcome text, or typography.
2. **No media may be presented as Ricky Wilson, "our team", or "the person who builds your
   site".** There is no photograph of him. `sector-office.jpg` (two people at a table, seen
   from behind) is safe as a professional-services sector tile and **unsafe** beside process
   step 1 "A conversation" or beside first-person copy — a reader will infer one of them is
   him and a disclaimer does not undo that.
3. **Show range.** Trades are one sector among many, never the frame.
4. Every `<img>` needs real `alt`, `width`/`height` matching the file (web variants are
   1600px wide), and `loading="lazy"` below the fold.
