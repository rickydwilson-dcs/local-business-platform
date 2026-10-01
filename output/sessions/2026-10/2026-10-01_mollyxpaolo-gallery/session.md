# mollyxpaolo — wedding gallery

**Status:** In progress — Phase 0 done, Phase 1 prototype live and approved (https://mollyxpaolo-proto.vercel.app). Phase 2 approved and built on `feat/mollyxpaolo-site` (committed, not pushed or deployed); see 2.8.
**Started:** 2026-10-01
**Site:** `sites/mollyxpaolo` (built, not deployed) · prototype Vercel project `mollyxpaolo-proto`
**Production domain:** https://www.mollyxpaolo.com (currently WordPress invitation site on SiteGround)

## Goal

A private gallery for Molly & Paolo's wedding (Las Vegas, 22 September 2026). Photos and the video
are shown in a mixed editorial layout. A three-way tone toggle (colour / sepia / black & white)
switches both the photos and the site's whole look. Visitors can download one photo or many, at
4K or full resolution. Molly gets an admin page to hide photos and mark favourites as featured.

This is not a local-business site: no services, locations, opening hours, legal pages or contact
form.

## Source material (inventoried 2026-10-01)

`~/Downloads/mollyxpaolo/` — 5.3GB

| Set                           | Files                     | Notes                                             |
| ----------------------------- | ------------------------- | ------------------------------------------------- |
| `341_files_…_color_251764`    | 340 photos + `Waiver.jpg` | 6720×4480, Canon EOS R, EXIF capture time present |
| `341_files_…_sepia_251764`    | same 341 names            | filenames match colour exactly                    |
| `341_files_…_B_W_251764`      | same 341 names            | filenames match colour exactly                    |
| `11_files_…_enhanced_251764`  | VK-341…350 + `Waiver.jpg` | **distinct shots**, colour only                   |
| `Wilson Palma 9-22-26 RS.mp4` | 1                         | 8m43s, 1920×1080 H.264/AAC, 723MB                 |

- Orientation (main 340): 248 landscape, 93 portrait (count includes Waiver).
- `Waiver.jpg` is Vegas Weddings' copyright release ("may be copied and duplicated in any
  manner"). It is not shown in the gallery. A footer credit line is optional.

## Decisions (agreed 2026-10-01)

1. **Downloads in two sizes:** full-resolution original (6720px) and a true 4K (3840px on the
   long edge).
2. **Enhanced 10:** these are the homepage featured / hero set. We generate our own sepia and
   B&W versions of them, so every tone has a complete set. The conversion is fitted to the
   photographer's own colour→sepia and colour→B&W mapping, measured on the 340 matched pairs,
   so ours match theirs instead of using a generic filter.
3. **Privacy:** `noindex` everywhere (meta + `X-Robots-Tag` + `robots.txt` disallow), plus a
   shared passcode. The share link carries a signed token (HMAC of an expiry and a version,
   keyed by a server secret). The link sets an httpOnly cookie, then redirects to a clean URL so
   the token isn't left in history or screenshots. Bumping the version revokes every link
   already shared. Typing the passcode is the fallback. "Encrypted link" = signed, not
   encrypted: there's nothing secret in the token itself, it only proves someone was given it.
4. **Video:** one compressed MP4 on R2 (H.264, faststart, target ~150–250MB), plus a poster
   frame. The tone toggle applies a CSS `grayscale()` / `sepia()` filter to it.

Further decisions (agreed 2026-10-01, Phase 2 kickoff):

5. **Admin store:** one JSON object in the `mollyxpaolo` R2 bucket, written with the existing
   bucket-scoped token. No Upstash.
6. **Planning:** Phase 2 spec written directly here; `/plan.with.codex` skipped.
7. **Secrets:** Claude wires the env var names only. Ricky sets the passcode, admin password
   and link-signing secret himself in the Vercel dashboard. No secret values pass through Claude.
8. **Domain email:** no email on mollyxpaolo.com is in use, so preserving MX records isn't
   needed when the zone moves. The domain is still a separate step (Phase 4), not part of
   Phase 2.
9. **Production Vercel project name:** `mollyxpaolo` was free in the team on 2026-10-01
   (Vercel connector project search found only `mollyxpaolo-proto`).

## Constraints and open infrastructure items

- **r2.dev is not fit for production.** Cloudflare docs (checked 2026-10-01): "Public access
  through `r2.dev` subdomains is rate-limited and should only be used for development
  purposes." It's fine for the prototype. Production needs an R2 custom domain (e.g.
  `media.mollyxpaolo.com`), and that requires mollyxpaolo.com to be a zone in the same
  Cloudflare account. **Open decision for Phase 4.**
- **Dedicated bucket recommended** (`mollyxpaolo`) instead of a prefix in
  `local-business-platform`. A custom domain attaches to a whole bucket, so putting it on the
  shared bucket would serve every client's assets under the wedding domain.
- **Passcode protects pages, not image bytes.** Images on a public bucket can be opened by
  anyone who has the exact URL. To limit that, keys include a random path segment. Public
  buckets don't allow listing (Cloudflare docs, checked 2026-10-01). Photos Molly hides are
  left out of the public manifest. If she wants a photo truly gone, it gets deleted from R2.
- **DNS:** mollyxpaolo.com is on SiteGround nameservers and **has MX records**
  (`mx10/20/30.antispam.mailspamprotection.com`, i.e. SiteGround mail). Before any nameserver
  change, confirm whether mail on that domain is used and copy every record across.
- **Platform rule exception:** a manifest of ~1,050 images with admin-edited state is data, not
  MDX content. This site uses a generated JSON manifest plus a small state store. This is a
  deliberate, scoped exception to the MDX-only rule.

## Phases

### Phase 0 — asset pipeline (local, nothing live without sign-off)

- [x] Fit the photographer's tone mapping on the matched pairs (B&W: channel weights + curve;
      sepia: per-channel LUT from luminance), check it on held-out pairs, apply it to the
      enhanced 10. Held-out MAE 2.97 (B&W) / 3.43 (sepia) on a 0–255 scale vs 7.43 for a
      generic Rec.601 greyscale (`tone-mapping.json`). Bright neon shots (343, 347) wash out
      somewhat in mono; flagged for Molly.
- [x] Generate per image × tone: display WebP at 480 / 1080 / 2048 wide, a 4K JPEG (3840 long
      edge, q90), the original JPEG as-is, and a tiny blur placeholder (inlined in the manifest).
      Built to `~/Downloads/mollyxpaolo-build` (outside git).
- [x] Manifest JSON: id, album (`wedding` now, room for later albums), capture time, w/h,
      orientation, tones available, key per variant, placeholder, `featured` seed (enhanced 10).
- [x] Compress the video and take a poster frame (723MB → 248MB, 1080p H.264 CRF 22, faststart).
- [x] **Dry-run upload report** (object counts, bytes, sample keys). Get sign-off, then upload.
      Upload sets `Content-Disposition: attachment; filename=…` on download variants.
      5,252 objects / 6.71GB in the dedicated `mollyxpaolo` bucket, 0 failed. Own bucket-scoped
      token (`MXP_R2_*` in root `.env.local`; load with `tsx --env-file`, not `source`).
      CORS added for the prototype origin and confirmed to apply on r2.dev.

### Phase 1 — HTML prototype (`mollyxpaolo-proto`) — live, approved 2026-10-01

Around 50 photos, all tones. Prove the three tone themes, mixed layout with chapters by capture
time, swipe/keyboard lightbox with zoom and download, select-and-download tray, the video
section, the passcode gate and an admin mock. Hosted via `tools/upload-prototype-assets.ts`
→ `tools/publish-prototype.ts`.

Bulk download approach to be proven here: a zip built in the browser (streamed where the browser
supports it), which always reflects the current curation, versus pre-built per-tone zips (stale
once Molly hides anything). On phones, test the Web Share API "save to Photos" path for a
selection.

### Phase 2 — `sites/mollyxpaolo` (Next.js, self-contained)

**Spec — approved 2026-10-01.** Builds from the approved prototype. The site is the gallery page,
lightbox, tone toggle, downloads, passcode gate, `/admin` and the photo data. Nothing from
HANDOFF.md's "Scope: what this site does NOT have" list is built, not even as a stub.

#### 2.1 Branch and scaffold (lean, no base-template copy)

- Branch `feat/mollyxpaolo-site` off `develop`.
- `sites/mollyxpaolo/`, workspace name `mollyxpaolo`. Copy only the plumbing from
  `delta-t-racing-cc`: `tsconfig.json`, `postcss.config.js`, `eslint.config.mjs`,
  `vitest.config.ts`, `next-env.d.ts`. Write `package.json`, `next.config.ts` and
  `tailwind.config.ts` fresh and pruned.
- Deps: `next` 16.0.10, `react`/`react-dom` 19.2.3, `@aws-sdk/client-s3` (already used by
  `tools/mollyxpaolo/upload-assets.ts`), `client-zip` (the prototype dynamic-imports
  `client-zip@2.5.1` from jsDelivr; the site installs it as a dependency and lazy-imports it
  instead, so the CSP needs no CDN), `zod`. **Not included:** MDX, next-mdx-remote, Resend, Leaflet,
  New Relic, `@platform/core-components` analytics/consent.
- `vercel.json`: the exact shape in HANDOFF.md Traps (`ignoreCommand` with
  `turbo-ignore mollyxpaolo --fallback=HEAD^1`, no `outputDirectory`).
- `pnpm install`, then commit the lockfile in the same commit as `package.json`.
- Confirm no tracked file in `sites/mollyxpaolo` matches `.vercelignore`
  (`git ls-files -ci --exclude-from=.vercelignore -- sites/mollyxpaolo` must be empty).

#### 2.2 Data

- **`tools/mollyxpaolo/export-site-manifest.ts`** reads `~/Downloads/mollyxpaolo-build/manifest.json`
  and writes a **slim** `sites/mollyxpaolo/content/photos.json`, which is committed.
  - Per photo: `id`, `n`, `album`, `w`, `h`, `takenAt`, `featured` (seed), `heroOk`,
    `placeholder` per tone.
  - Variant keys are dropped because they're derivable from
    `pathToken/<tone>/<variant>/<id>.<ext>`. `pathToken` and the media base URL come from env
    (`NEXT_PUBLIC_MXP_MEDIA_BASE`), not the repo, so the Phase 4 custom domain is a config change.
  - `heroOk: false` for 341, 347 (lettering), 349 and 350 (collages). This replaces the
    prototype's hard-coded `hero()` list. Hero order (343, 348, 345, 342) becomes a `heroOrder`
    field.
  - This is the scoped exception to the MDX-only rule recorded above.
- **`sites/mollyxpaolo/content/chapters.json`**: name plus a start/end capture-time window for
  each of the four chapters. The names are still placeholders until the family confirms them,
  so changing them is a one-line edit.
- **Admin state** is one R2 object at `state/<random>/curation.json` with shape
  `{ version, updatedAt, photos: { [id]: "hidden" | "featured" | "shown" } }`.
  - The random segment is a **second** secret, separate from the image path token, in env
    `MXP_STATE_KEY`. The bucket is public, so an unguessable key is the only thing keeping the
    hidden list off r2.dev.
  - The server reads and writes it through the S3 API with the `MXP_R2_*` credentials, never
    the public URL.
- **`lib/gallery.ts`** merges `photos.json` + curation state, drops hidden photos **on the
  server**, and assigns chapters.
  - The client payload never contains a hidden photo's id or placeholder.
  - The page is static/ISR. The state read is cached with tag `curation`; an admin save calls
    `revalidateTag('curation')`.
  - Limitation (already accepted in Constraints): a hidden photo's image URL is still
    guessable by anyone who has the path token. A photo that must be truly gone gets deleted
    from R2.

#### 2.3 Access: passcode gate, signed links, admin

All of it lives in route handlers plus `proxy.ts`. The token code is a small dependency-free
`lib/token.ts` using Web Crypto (`crypto.subtle` HMAC-SHA256), so it works in whichever runtime
the proxy runs in. (Assumption to verify against the Next 16 docs at build time: whether
`proxy.ts` runs on Node or Edge. Web Crypto covers both.)

- **Token format:** `base64url(payload).base64url(hmac)`, where the payload is
  `{ s: "guest" | "admin", v, exp }`. `v` must equal env `MXP_LINK_VERSION`; bumping it revokes
  every cookie and link. Comparisons are constant-time.
- **`proxy.ts`** is the gate and nothing else, with no analytics.
  - Everything except `/unlock`, `/s/*`, `/api/unlock`, static assets and `robots.txt` needs a
    valid `mxp` cookie, otherwise it redirects to `/unlock`.
  - `/admin` and `/api/admin/*` need an `mxp_admin` cookie with `s: "admin"`.
- **`/s/[token]`** (signed share link): verifies the token, sets the httpOnly
  `Secure; SameSite=Lax` cookie, and 303-redirects to `/` so the token never stays in history.
  An invalid or expired token redirects to `/unlock`.
- **`/unlock`** is the passcode page, ported from the prototype gate. `POST /api/unlock`
  compares the code to `MXP_PASSCODE` in constant time and sets the cookie.
  - Throttling is a small in-memory per-IP delay, enough to stop casual guessing on a family
    site without adding a store. Say so honestly in docs: on serverless it's per instance, not
    global.
- **`/admin`** has its own password (`MXP_ADMIN_PASSWORD`) and cookie, and the guest passcode
  doesn't grant it.
  - Admin UI ports `prototype/admin.html`: a grid of every photo, including hidden ones, with a
    three-state control.
  - `PUT /api/admin/curation` validates with zod, writes the R2 object, and revalidates.
  - Concurrent saves are last-write-wins. That's acceptable with one curator; a `version`
    check rejects a stale save with a clear message rather than silently overwriting.
- **Link minting:** `tools/mollyxpaolo/mint-link.ts` prints a `/s/<token>` URL for a given
  expiry. It runs locally with `MXP_LINK_SECRET` from env.
- **Env vars** (Ricky sets the values in Vercel; Claude never handles them): `MXP_PASSCODE`,
  `MXP_ADMIN_PASSWORD`, `MXP_LINK_SECRET`, `MXP_LINK_VERSION`, `MXP_STATE_KEY`,
  `MXP_R2_BUCKET`, `MXP_R2_ACCESS_KEY_ID`, `MXP_R2_SECRET_ACCESS_KEY`, `R2_ACCOUNT_ID`,
  `NEXT_PUBLIC_MXP_MEDIA_BASE`.
  - Only `NEXT_PUBLIC_MXP_MEDIA_BASE` affects build output, so it goes in `turbo.json` `env`.
    The rest are runtime-only.
  - A `.env.example` lists the names with no values.

#### 2.4 Privacy and headers

- `noindex, nofollow, noimageindex` in the root `metadata.robots`, plus `X-Robots-Tag` on every
  response via `next.config.ts` headers, plus `app/robots.ts` → `Disallow: /`. No sitemap.
- CSP built from the media host:
  - `img-src 'self' data: <media>`, `media-src 'self' <media>`, and
    `connect-src 'self' <media>` (needed for the zip download).
  - Fonts: `next/font`, so self-hosted, with no Google Fonts origins.
  - `'unsafe-eval'` only when `NODE_ENV === 'development'`.
  - `frame-ancestors 'none'`.
- A `test/csp.test.ts` imports the real `headers()` and asserts the emitted CSP in dev and
  prod, as DCS does.

#### 2.5 UI (port of the prototype; behaviour unchanged unless listed)

- **Styling:** tone tokens are CSS custom properties in `app/globals.css`, under
  `html[data-tone="colour|sepia|bw"]` (never bare `[data-tone]`, see Traps).
  `tailwind.config.ts` maps colour/font utilities to those variables.
  - Deviation from the usual `theme.config.ts` → plugin pipeline: that pipeline emits a single
    `:root` palette, and this site switches palettes at runtime. So tokens live in CSS directly,
    and there's no `theme.config.ts` / `@platform/theme-system` dependency.
  - The prototype's bespoke rules (rows, lightbox, tray) move into `globals.css` as named
    classes. No inline styles, except the per-row `--sum` aspect-ratio variable, which is data
    and must be computed. That one is set as a CSS variable via `style`, as the prototype does.
- **Tone:** the pre-paint inline script from the prototype goes in the layout `<head>`
  (`?tone=` → `localStorage` → default colour). `ToneSwitch` is a client component updating
  `html.dataset.tone`, the URL (`replaceState`) and storage.
- **Fonts:** `next/font/google` for all eight families with **discrete** weights.
  - Fraunces: italic 800, which means dropping the `opsz` axis (root CLAUDE.md, Fonts). Needs a
    visual check against the prototype.
  - Only the colour-tone faces get `preload: true`. Sepia/B&W faces are declared with
    `preload: false`, so the browser fetches them only when that tone's text renders.
- **Components (client unless noted):**
  - `Hero`, `ChapterNav` and `Chapter` are server components.
  - `JustifiedRows` ports `buildRows`/`renderRows`, with the `86svh` row-width cap.
  - `Favourites` (ribbon), `Lightbox`, `SelectionTray`, `ToneSwitch`, `Film`.
- **Lightbox changes from the prototype:**
  - **Windowed:** only the current slide and ±2 are mounted, because there are 350 photos.
  - Pinch-to-zoom is **not** added (still double-tap/double-click + drag-pan). It's a
    follow-up if wanted.
  - Image fit uses the absolute/inset/contain pattern from Traps.
- **Downloads:** port `zipDownload`/`prepareShare` as is:
  - `showSaveFilePicker` streaming on Chromium, otherwise in memory.
  - Web Share with a 40-file cap on phones.
  - Filenames `MollyxPaolo-NNN-<tone>-<4K|full>.jpg`.
- **Film:** unchanged. The "Download the film" behaviour (open vs. save) stays an open item;
  see below.

#### 2.6 Verification gates (all must pass before the Vercel project is created)

- `pnpm --filter mollyxpaolo run lint`, `type-check`, `test`, `build`.
- **Unit tests:**
  - `token.ts`: sign/verify, tamper, expiry, version bump revokes.
  - `gallery.ts`: hidden photos absent from the payload; featured override; chapter
    assignment of all 350.
  - CSP test.
  - Unlock route: wrong code rejected, right code sets an httpOnly cookie.
- **Against `next start`, not dev** (check the listening PID changed after any restart):
  - Unauthenticated `/` → 307 to `/unlock`.
  - `/s/<valid>` → cookie + 303 to `/`, and the URL is clean afterwards.
  - Tampered token → `/unlock`.
  - `/admin` with only the guest cookie → denied.
  - Every response carries `X-Robots-Tag`.
- **Full set, all 350:** measure that no tile and no lightbox image exceeds `innerHeight` at
  desktop and at 390px (iframe harness), and that the lightbox mounts ≤5 slides.
  - The Chrome automation window is hidden: inject `*{transition:none!important}` before
    screenshots.
- **Admin round trip on a preview deploy:**
  - Hide a photo, and its id is gone from the gallery HTML after revalidation.
  - Restore it.
  - That write goes to the live R2 object, so it's done with Ricky's go-ahead and reverted
    afterwards.

#### 2.7 Deploy (each step confirmed before it runs)

1. Push `feat/mollyxpaolo-site`, merge to `develop` per the git workflow.
2. **Ricky:** add the production origins to the bucket's CORS policy, i.e.
   `https://mollyxpaolo.vercel.app`, `https://www.mollyxpaolo.com`, `https://mollyxpaolo.com`.
   Whether R2 CORS accepts a wildcard origin for preview URLs is **unverified**; check
   Cloudflare's docs before relying on it.
3. Create the Vercel project `mollyxpaolo` (rootDirectory `sites/mollyxpaolo`) via
   `vercel project add` + REST (the Vercel MCP can't create projects; see memory). Re-check
   that the name is free first, since a collision is a silent no-op.
4. **Ricky** sets the env values in the dashboard.
5. Deploy, run the gates against the deployed URL, and hand Molly the `/admin` link.

#### 2.8 Progress (2026-10-01, branch `feat/mollyxpaolo-site`)

Built: 2.1–2.6. Not started: 2.7.

- [x] Lean scaffold, `vercel.json`, lockfile (adds only the `sites/mollyxpaolo` importer plus
      `client-zip` and `server-only`). No `.vercelignore` matches.
- [x] `tools/mollyxpaolo/export-site-manifest.ts` → `content/photos.json` (350 photos, 275KB, no
      path token), `content/chapters.json`.
- [x] Proxy gate, `/unlock`, `/s/[token]`, admin login, `PUT /api/admin/curation`,
      `scripts/mint-link.ts`.
- [x] Gallery, hero, lightbox, tray, tone switch and `/admin` ported.
- [x] Gates: lint, type-check, 33 unit tests, `next build --webpack`.
- [x] **Against `next start`** (local env with throwaway passcode/secret and a never-written
      `local-test-*` state key; R2 read only):
  - Unauthenticated `/` → 307 `/unlock`, and `/admin` → 307 `/admin/login`.
  - Wrong code → 303 `?e=wrong`. Right code (different case) → cookie + 303 `/`.
  - A minted `/s/<token>` → cookie + 303 to a clean `/`; a tampered token → `/unlock?e=link`.
  - A guest cookie on `/admin` → login, and on `PUT /api/admin/curation` → 401.
  - `X-Robots-Tag` and the CSP are on every response; `robots.txt` is `Disallow: /`.
  - The path token appears neither in the public `/unlock` HTML nor in any `.next/static`
    chunk.
- [x] **Browser, all 350:**
  - Desktop 1382×757: 0 of 360 tiles exceed `innerHeight` (max 651 = the 86svh cap), with no
    horizontal page scroll.
  - 390×844 (iframe harness, via a scratchpad proxy that strips the anti-framing headers for
    the test only): 0 of 360 tiles exceed (max 585), with no horizontal scroll.
  - Lightbox: the image box equals the viewport at both sizes; 5 slide images mounted of 350
    slides.
  - Tone switch: the theme, the URL and storage all update; switching tone inside the viewer
    works.
  - Esc closes and refocuses the tile. Select / size / download-all / clear behave as in the
    prototype.
- [x] Admin round trip (Ricky approved, 2026-10-01). Run against `next start` with a throwaway
      `local-test-*` state key, never the real curation file. Results:
  - Hiding vk-010 removed it from the gallery on the next request, and featuring vk-020 set
    `featured: true`. Restoring brought both back, so `revalidateTag(…, { expire: 0 })` is
    immediate.
  - A stale `baseVersion` → 409, and an unknown id → 400.
  - The test object was deleted afterwards (HEAD now 404).
- [ ] Zip / Web Share download: **not tested locally**, because the bucket CORS doesn't list
      `localhost:3100`. Test it on the deployed URL once its origin is in the CORS policy.
- [ ] Visual check, side by side with the prototype, of the two font substitutions (Big
      Shoulders for Big Shoulders Display, Fraunces without opsz).

Deviations from the spec above, decided while building:

- **`MXP_MEDIA_BASE` is server-only** (not `NEXT_PUBLIC_`), passed to the client only in the
  gated page payload.
  - A `NEXT_PUBLIC_` value is inlined into JS chunks under `/_next/static`, which the gate must
    leave public, so it would publish the path token.
  - Pages are `force-dynamic`, so the var is runtime-only, and **`turbo.json` is untouched**.
- **CSP uses `*.r2.dev`** (as the other sites do) rather than a host derived from env: it's read
  at build time, and a site-specific build env var would mean a `turbo.json` change that
  rebuilds every site once. Phase 4 adds the custom media domain here.
- **The `/unlock` backdrop is the inline 16px placeholder**, not a real image as in the
  prototype. A real URL on a public page would leak the path token.
- **Photos picked inside the lightbox open the tray when it closes.** In the prototype they
  silently waited until "Select" was pressed.
- **Lightbox windowing** keeps all 350 slides as empty snap points and mounts images only for
  the current slide ±2.
- **Tone swaps have a 1.5s fallback.** `img.decode()` can stay pending in a background tab,
  which would otherwise leave the old tone up.
- **Tiles already in the image cache are marked loaded after render.** Favourites preloaded by
  the hero were otherwise left at opacity 0, because `onLoad` never reached React.
- **Chapter counts are 137 / 67 / 97 / 49**, from the windows in `chapters.json` (the same
  windows as the prototype). HANDOFF's 136/67/97/47 doesn't sum to 350 and came from an
  earlier count.
- **The curation file stores only departures from the seed** (as the prototype admin did), so
  "Reset" is an empty object.

**Out of Phase 2 (still open, needs the family or Ricky):**

- Chapter names.
- Mono VK-343/347 acceptability.
- Poster frame.
- Sepia focus ring at 2.9:1 (`#b8742b`): the ported CSS keeps the prototype value until Ricky
  decides.
- Film download as a save (needs a second MP4 with `Content-Disposition`, uploaded under a
  **new** key, never overwriting).
- Domain cutover and custom media domain (Phase 4).

### Phase 3 — full upload, then Molly curates on the preview deployment

### Phase 4 — production

Dedicated bucket + custom media domain, Cloudflare zone decision, mail records preserved, apex
and www pointed at Vercel, optional archive of the invitation site.

## What was learned

(to fill in on completion)
