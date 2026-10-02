# mollyxpaolo wedding gallery — handoff

> **Update 2026-10-02: Phase 2 is live.** https://mollyxpaolo.vercel.app (Vercel project
> `mollyxpaolo`, production from `main`, first deploy via PR #105, merge `25f49d4e`). The
> sections below this box are the 2026-10-01 pre-build handoff, kept for history. Where they
> say "not started", "not done" or "open question" about Phase 2, the build answered it, and
> `session.md` §2.8 is the current record.
>
> **Resolved since:**
>
> - The admin store is an R2 JSON object.
> - The production project name is `mollyxpaolo`.
> - CORS now covers production and both mollyxpaolo.com hosts.
> - No email on the domain is in use.
> - The three unpushed commits were pushed.
>
> **Verified live:** the gate, refusals, headers, no path-token leak, and CORS. See
> `session.md` §2.7 deploy.
>
> **Not verified live:** anything behind the gate. Claude holds none of the secrets (by
> decision). To get in, Ricky mints a link:
>
> ```
> MXP_LINK_SECRET='<secret>' MXP_LINK_VERSION=1 pnpm --filter mollyxpaolo mint-link --days 365 --origin https://mollyxpaolo.vercel.app
> ```
>
> **Next:**
>
> 1. Ricky checks the live gallery behind the gate:
>    - all three tones;
>    - the lightbox;
>    - 4K download, zip, Save to Photos;
>    - an admin change, then Reset.
> 2. Curation follow-up: `curation-spec.md`. Answer its six open questions first.
> 3. Phase 4: www.mollyxpaolo.com cutover from SiteGround (no email in use) and an R2 custom
>    media domain, which also changes the CSP's `*.r2.dev`.
> 4. Family approvals:
>    - chapter names;
>    - the mono versions of VK-343/347;
>    - the poster frame;
>    - the sepia focus ring at 2.9:1.
>
> **Traps learned in the build:**
>
> - `revalidateTag` needs a second argument in Next 16.1.5.
> - `proxy.ts` always runs on Node.
> - The Chrome automation window is hidden: lazy images, scroll events and `img.decode()`
>   never fire there. Test phone width through a header-stripping scratchpad proxy, because
>   the site sends `frame-ancestors 'none'`.
> - Photo IDs in the page's RSC payload are escaped (`\"vk-010\"`), so grep for the bare
>   id.
> - `main` needs a PR from `staging`; a direct push is blocked even for admins.

**Status (2026-10-01, superseded):** ready-to-resume. Phase 0 (asset pipeline + full R2 upload) and Phase 1 (HTML prototype, approved by the user) are done and verified. Phase 2, the real Next.js site `sites/mollyxpaolo`, has **not been started**: no directory, no Vercel project, no store, no auth.
**Branch:** `develop`, HEAD `e8b0600d` (2026-10-01T15:26 PDT). **Not pushed.** `develop` is 3 ahead of `origin/develop`: the two mollyxpaolo commits below, plus `d11990f4` (DCS wrap-up), which predates this session.
**Commits:** 2 from this session.
**Working tree:** clean apart from this `HANDOFF.md` (verified with `git status --porcelain` before writing it).

Session spec: `output/sessions/2026-10/2026-10-01_mollyxpaolo-gallery/session.md`. Read it first; it holds every agreed decision and the phase plan. This file covers what's true now and what comes next.

## What this is trying to resolve

The user (Ricky) wants a private website to share his daughter Molly's wedding to Paolo (Las Vegas, 22 September 2026). It uses this monorepo but is **not** a local-business site: no services, locations, opening hours, legal pages or contact form. Core ideas:

- **Three-way tone toggle:** colour, sepia and B&W. It switches the photos and also re-themes the whole site.
  - Colour = Strip at night, neon on dark.
  - B&W = Rat Pack era, Art Deco.
  - Sepia = Red Rock / Nevada desert.
- **Layout:**
  - A non-uniform editorial layout. **Not a product grid.**
  - Touch-first: a swipe lightbox on phones, click and keys on a laptop.
  - No image may ever be taller than the viewport, on the page or in the lightbox. The user asked for this explicitly.
- **Downloads:**
  - Per photo, at 4K or full resolution.
  - Download all, or a selection.
- **Admin:** Molly marks each photo hidden, featured or shown.
- **Privacy:** noindex everywhere, plus a shared passcode. The share link carries a signed token (HMAC, revocable by bumping a version) that sets a cookie and redirects to a clean URL.
- **Albums:** they may add holiday photos later, so the manifest has an `album` field (`wedding` for now).
- **Domain:** production is https://www.mollyxpaolo.com. It currently hosts their WordPress invitation site on SiteGround and will be redirected to Vercel.
- **Process:** prototype in HTML first, then build properly. **The prototype is approved ("that all works")**, so Phase 2 builds from it.

### Scope: what this site does NOT have (user instruction, restated 2026-10-01)

The user said it twice, so treat it as a hard rule. None of the platform's standard local-business features are built into this site, not even as stubs:

- **Not included:** legal pages (privacy policy, cookie policy, terms), cookie consent banner, consent manager.
- **Not included:** locations, services, projects, blog/news, team, about, contact page, contact form, Resend, spam tagging.
- **Not included:** opening hours, phone/CTA header, LocalBusiness/Service/FAQ JSON-LD, sitemaps for SEO (the site is noindex), Google Business data.
- **Not included:** GA4, Facebook pixel or Google Ads in `proxy.ts`; the analytics feature flags; New Relic.
- **Not included:** `site.config.ts` business schema and the MDX content collections (`content/services`, `content/locations`, …), with their validators.

The site is: the gallery page, the lightbox, the tone toggle, downloads, the passcode gate, `/admin`, and the photo/album data. Anything else needs asking about first.

User decisions (2026-10-01), already in `session.md`:

- Downloads in **both** 4K (3840px long edge) and full original.
- The 10 enhanced photos are the homepage favourites/hero, and we **generate** sepia and B&W versions of them.
- Hidden from search **and** behind a passcode, with a signed link.
- Video as **one compressed MP4**.

## Actions taken

1. **Inventoried the source** at `~/Downloads/mollyxpaolo` (5.3GB).
   - 340 photos × colour/sepia/B&W, with identical filenames across the three folders.
   - 10 enhanced photos (VK-341…350), which are distinct shots and colour only.
   - `Waiver.jpg`, the photographer's copyright release. Excluded from the gallery.
   - One 723MB MP4.
2. **Fitted the photographer's tone mapping** (`tools/mollyxpaolo/fit-tone-mapping.ts`, output `tone-mapping.json`).
   - Held-out mean error is 2.97 (B&W) and 3.43 (sepia) on a 0–255 scale, against 7.43 for a generic greyscale.
   - Used to render sepia/B&W versions of the enhanced 10.
3. **Built all derivatives and the manifest** (`tools/mollyxpaolo/build-assets.ts`) into `~/Downloads/mollyxpaolo-build/`, which is outside git.
   - Per photo × tone: WebP at 480/1080/2048, a 4K JPEG and the original.
   - Plus 16px blur placeholders inlined in `manifest.json`.
4. **Compressed the video** to 248MB (1080p H.264, CRF 22, faststart) and took a poster frame (the 2:00 frame).
5. **Uploaded everything** to the dedicated R2 bucket `mollyxpaolo` (`tools/mollyxpaolo/upload-assets.ts`): dry run first, then two test photos, then the full set (details below).
6. **Built and deployed the prototype** to the Vercel project `mollyxpaolo-proto`, iterating on bugs found in testing and two user requests about images fitting the viewport.
7. **`437f60e7` feat(tools): mollyxpaolo asset pipeline.** The four scripts in `tools/mollyxpaolo/`.
8. **`e8b0600d` docs(mollyxpaolo): session spec and approved HTML prototype.** Contents:
   - `session.md`
   - `prototype/`
   - `make-proto-data.py`
   - `phone-harness.html`
   - `tone-mapping.json`

## Current state — verified 2026-10-01

**R2 bucket `mollyxpaolo`**

- **Upload (verified):**
  - 5,252 objects in total, 0 failed. Final run: "Uploaded 3174 (4.42GB), skipped 2078 already present, failed 0". The skipped 2,078 were uploaded by earlier runs.
  - That's 350 photos × 3 tones × 5 variants, plus the video and poster.
- **Spot-checked with curl (verified):**
  - 6 keys across tones and variants, plus the video, all returned 200.
  - Video range requests return 206.
  - Download variants carry `Content-Disposition: attachment; filename="MollyxPaolo-NNN-<tone>-<4K|full>.jpg"`.
  - Cache-Control is `public, max-age=31536000, immutable`.
- **Public URL:** `https://pub-3029869edf074088a713eb0fbce05c35.r2.dev`.
  - Keys look like `oT7UZPabtKCVZkeK/<colour|sepia|bw>/<w480|w1080|w2048|4k|original>/vk-NNN.<webp|jpg>`.
  - The video is at `oT7UZPabtKCVZkeK/video/mollyxpaolo-wedding-1080p.mp4` and `…/video/poster.jpg`.
  - The random segment is the path token. It's stored in `~/Downloads/mollyxpaolo-build/path-token.txt`.
- **CORS (verified):** the user added this policy in the dashboard:

  ```json
  [
    {
      "AllowedOrigins": ["https://mollyxpaolo-proto.vercel.app", "http://127.0.0.1:5173"],
      "AllowedMethods": ["GET", "HEAD"],
      "AllowedHeaders": ["*"],
      "MaxAgeSeconds": 86400
    }
  ]
  ```

  - **It does apply on r2.dev.** The prototype origin gets `Access-Control-Allow-Origin`, the preflight returns 204, and an unlisted origin gets no header.
  - It took about 30s to propagate.
  - The live prototype built a valid 3-file zip in the browser (5.19MB, PK magic bytes).

- **Credentials:** the site has its own bucket-scoped token (Object Read & Write) in the **root** `.env.local` as `MXP_R2_BUCKET` / `MXP_R2_ACCESS_KEY_ID` / `MXP_R2_SECRET_ACCESS_KEY` / `MXP_R2_PUBLIC_URL`. `R2_ACCOUNT_ID` is shared. Access was verified with HeadBucket.

**Manifest**

- At `~/Downloads/mollyxpaolo-build/manifest.json`. **It is not in git and not in R2.**
- 350 photos (255 landscape, 95 portrait), 10 `featured: true` (the enhanced set).
- Sorted by capture time, with the photographer's number as tie-break.
- VK-349 (a collage) has no EXIF time and sorts last.

**Prototype**

- **https://mollyxpaolo-proto.vercel.app**, public alias.
- Prototype passcode `vegas`. A `?k=<8+ chars>` link bypasses the gate. Admin password `admin`.
- It's a static deploy, not git-linked. Source is in `prototype/` and is redeployed with `tools/publish-prototype.ts`.
- The user confirmed it works on their side.

**Chapters**

- These come from capture-time clusters (verified from EXIF):
  - 13:31–14:09 "The Vows" (136 photos)
  - 14:16–14:37 "Love in the Fast Lane" (67)
  - 15:13–15:36 "On the Strip" (97)
  - 15:41–15:51 "The Grand Staircase" (47)
- **The names are Claude's placeholders and haven't been confirmed by the family.**

**Contrast (WCAG, computed)**

| Tone   | Body | Secondary | Accent |
| ------ | ---- | --------- | ------ |
| Colour | 17.6 | 7.9       | 5.9    |
| B&W    | 15.7 | 7.2       | 15.7   |
| Sepia  | 12.6 | 5.7       | 5.0    |

- **The sepia focus ring (`--accent-2` `#b8742b`) is 2.9:1, below 3:1.** It was flagged to the user, who hasn't decided.
- The user is colourblind: give objective numbers and never silently recolour (see memory `user_colourblind.md`).

**Unverified**

- The prototype's touch interactions (swipe, double-tap zoom, swipe-down close, Web Share "Save to Photos") were only tested by the user on their device. The user reported "that all works", but Claude never observed it directly.

## What was NOT done

- **No `sites/mollyxpaolo` exists.** Phase 2 is entirely untouched: no package, no workspace entry, no lockfile change, no `vercel.json`, no tests.
- **No production Vercel project.** Only `mollyxpaolo-proto` exists. Nobody has checked whether the name `mollyxpaolo` is free on Vercel. A name collision fails silently (see root CLAUDE.md, Vercel section).
- **No real passcode, admin auth or HMAC link signing.** The prototype's gate and admin are client-side mocks (`sessionStorage`/`localStorage`). Nothing server-side exists.
- **No admin state store.** Upstash vs. a JSON object in R2 is **undecided**. In the prototype, admin choices live in one browser's `localStorage` and affect nothing anyone else sees.
- **The manifest isn't in the repo.** Phase 2 must decide how the site consumes it, e.g. a generated JSON committed in `sites/mollyxpaolo/content/` or similar. That's a deliberate, scoped exception to the MDX-only rule, already noted in `session.md`.
- **No production domain work.**
  - mollyxpaolo.com's DNS is on SiteGround nameservers (`ns1/ns2.siteground.net`) and **has MX records** (`mx10/20/30.antispam.mailspamprotection.com`). Nobody has asked whether email on that domain is in use.
  - r2.dev is rate-limited and "should only be used for development purposes" (Cloudflare docs, checked 2026-10-01). Production needs a custom media domain on the bucket, which needs the zone on Cloudflare.
  - Nothing has been decided or touched.
- **CORS only allows the prototype and localhost.** The production origins (`https://www.mollyxpaolo.com`, `https://mollyxpaolo.com`, the production Vercel URL and preview URLs) are **not** in the policy. Zip/share downloads will fail on the real site until they're added.
- **Video download:** the MP4 was uploaded **without** `Content-Disposition`, so the "Download the film" link just opens or plays it. Not addressed.
- **Pinch-to-zoom isn't implemented.** The lightbox has double-tap/double-click zoom with drag-pan only.
- **The lightbox isn't virtualised.** The prototype renders a slide per photo (66). With 350 photos the real build should window the slides.
- **Full-set behaviour is untested.** The prototype uses a 66-photo subset (`prototype/data.js`, generated by `make-proto-data.py`). Layout, performance and download-all have never run against all 350.
- **Not done, and not yet agreed with the user:**
  - Sepia focus-ring contrast.
  - Whether the mono versions of enhanced VK-343 and VK-347 are acceptable (the neon bokeh washes out).
  - Chapter names.
  - Choice of poster frame.
- **No `/update.docs`, CHANGELOG, `docs/project-history.md` or root CLAUDE.md "Live Sites" entry for this site.**
- **No `session-wrap-up.md`.** The session isn't finished; Phase 2 continues in this same folder.

## Live-data changes already applied

These are live and **must not be repeated wholesale**.

1. **R2 bucket `mollyxpaolo`: 5,252 objects uploaded** (2026-10-01, finished around 15:00 PDT).
   - `upload-assets.ts` is idempotent: it skips any key whose size already matches. Re-running `--execute` is safe but pointless, and will HEAD all 5,252 objects.
   - **Never overwrite a key with different bytes.** Everything is cached immutable for a year, and overwriting doesn't bust the CDN (see memory `feedback_r2_image_cache_busting.md`). If a derivative must change, generate a new path token and upload a new set.
2. **CORS policy on bucket `mollyxpaolo`.** The user added it via the dashboard. Content is as above.
3. **Vercel project `mollyxpaolo-proto` created and deployed** (static, not git-linked). Latest alias: https://mollyxpaolo-proto.vercel.app.
4. **The user created the bucket, its r2.dev public URL and the bucket-scoped API token.** These are in Cloudflare and the user owns them.

Nothing has been written to SiteGround, DNS, or any other Vercel project.

## Traps

- **`sites/base-template` has no `vercel.json`** (`git ls-files sites/*/vercel.json` lists 9 sites, not base-template). Copying base-template won't give you the mandatory `ignoreCommand`. Copy the shape from `sites/delta-t-racing-cc/vercel.json`, the most recent site:

  ```json
  {
    "buildCommand": "cd ../.. && pnpm turbo run build --filter=mollyxpaolo",
    "installCommand": "cd ../.. && pnpm install --frozen-lockfile",
    "ignoreCommand": "cd ../.. && npx turbo-ignore mollyxpaolo --fallback=HEAD^1",
    "framework": "nextjs"
  }
  ```

  The workspace name must match `package.json` `name`.

- **Don't `cp -R sites/base-template`.** It's a local-business site, and nearly everything in it is out of scope here (see "Scope" above). Copying it means stripping dozens of files and risks leaving consent banners, legal routes or analytics behind.
  - Start a lean site instead. Copy only the build plumbing from base-template / delta-t-racing-cc: `package.json` (pruned deps), `tsconfig.json`, `next.config.ts` (CSP and headers only), `postcss.config.js`, `tailwind.config.ts`, `eslint.config.mjs`, `vitest.config.ts`, `next-env.d.ts`.
  - Write `app/`, `components/` and `proxy.ts` fresh.
  - `proxy.ts` is Next 16's renamed middleware, and it's where the passcode gate goes. The gate is the **only** thing it does here, with no analytics.
  - Sites run Next 16.0.10, React 19.2.3, Tailwind 3.4 (from `delta-t-racing-cc/package.json`). next-mdx-remote probably isn't needed at all.
- **The base-template CSP has no `media-src`** and doesn't allow fetching R2. The `<video>` is silently blocked and zip downloads fail. Add `media-src` and `connect-src` for the media host alongside `img-src` (root CLAUDE.md, Build & CI). Also keep `'unsafe-eval'` gated to development.
- **`source .env.local` silently fails partway** through the root `.env.local`: an earlier line isn't shell-compatible, so the `MXP_*` vars never load. Use `npx tsx --env-file=.env.local …` instead.
- **Theme selectors must be `html[data-tone="…"]`, not bare `[data-tone="…"]`.** The tone-switch buttons carry `data-tone` attributes, so a bare selector re-themes each button with its own tone's fonts and colours. This was hit in the prototype.
- **Fitting images to the viewport:**
  - A percentage `height`/`max-height` inside a grid cell whose row is content-sized resolves to nothing. That made lightbox images overflow the screen.
  - Fix: `position:absolute; inset:0; width:100%; height:100%; object-fit:contain` on an element pinned to the viewport.
  - The page-level fix is a row-width cap: `max-width: calc(var(--cap) * var(--sum) + gaps)` with `--cap: 86svh`. See `prototype/styles.css` (`.rows`/`.row`) and `renderRows()` in `prototype/app.js`.
- **Claude's Chrome automation window is hidden** (`document.hidden === true`).
  - `requestAnimationFrame`, smooth scrolling and CSS transitions never run in it. Images that faded in stayed at opacity 0, and the lightbox didn't track scroll position, so it looked broken when it wasn't.
  - Inject `*{transition:none!important}` before screenshots, and don't use rAF for logic.
  - `resize_window` also doesn't work there. Test phone widths with an iframe harness (`phone-harness.html`; copy it into the served folder, since it points at `./prototype/`).
- **next/font:** the prototype uses Google Fonts `<link>`s for Yellowtail, Big Shoulders Display 800, Outfit, Limelight, Jost, Fraunces (italic, opsz axis), Spectral and Courier Prime.
  - Under `next/font/google`, `axes: ['opsz']` only works with `weight: 'variable'`, and that downloads the whole weight axis.
  - Prefer discrete weights (root CLAUDE.md, Fonts).
  - Eight families is heavy. Consider loading each tone's faces only when that tone is active.
- **Hero curation lives in code** (`hero()` in `prototype/app.js`).
  - The order is 343, 348, 345, 342.
  - **Excluded:** 341 and 347 (baked-in lettering that collides with the title) and 349/350 (collages).
  - Featured photos are otherwise data-driven. Keep the exclusion as data (e.g. a `heroOk` flag), not a hard-coded list, in the real build.
- **Download-all size:** full-size colour is about 1.6GB.
  - The prototype streams the zip to disk via `showSaveFilePicker` (Chromium only). Elsewhere it builds the zip in memory.
  - On phones it uses Web Share and caps at 40 files.
  - Pre-built zips were rejected because they go stale once Molly hides photos.
- **`output/sessions/.current-session` still points at the DCS session**, so `/handoff` and similar tools resolve to the wrong folder by default. Pass this folder explicitly, or update the pointer deliberately.
- **Prettier pre-commit** rewrites staged `.ts`, `.json` and `.md` files. Expect formatting diffs in the commit.

## Next step

1. **Confirm the open questions below with the user** before writing code. Several of them change the architecture.
2. **Plan Phase 2.** It introduces new patterns for this platform (server-side passcode, HMAC links, an admin with a writable store, a non-MDX data source), so per the project's working style it qualifies for dual-model planning:

   ```
   /plan.with.codex mollyxpaolo-site "Build sites/mollyxpaolo from the approved prototype in output/sessions/2026-10/2026-10-01_mollyxpaolo-gallery (read session.md + HANDOFF.md first). Lean site: gallery, lightbox, tone toggle, downloads, passcode gate, /admin only. No legal, locations, services, contact, consent or analytics."
   ```

   Or, if the user prefers to skip it, write the Phase 2 spec into this folder's `session.md` directly.

3. **Pre-flight checks before scaffolding:**

   ```bash
   cd ~/Sites/local-business-platform && git checkout develop && git pull --ff-only
   git log --oneline @{u}..        # expect the 3 unpushed commits unless the user has pushed them
   ls ~/Downloads/mollyxpaolo-build/manifest.json ~/Downloads/mollyxpaolo-build/path-token.txt
   npx tsx --env-file=.env.local tools/mollyxpaolo/upload-assets.ts --build ~/Downloads/mollyxpaolo-build   # dry run: expect 5252 objects, 6.71GB
   ```

4. **Scaffold** (after the plan is approved) on a branch off `develop`:
   - Create a **lean** `sites/mollyxpaolo`: build plumbing only, per the Traps entry. No base-template copy, and nothing from the "Scope" exclusion list.
   - `package.json` `name: "mollyxpaolo"`, `vercel.json` as above, then `pnpm install` and commit the lockfile (memory `feedback_site_rename_lockfile.md`).
   - Port `prototype/styles.css` tokens into `theme.config.ts` and Tailwind, and the prototype behaviour into components.
   - Gate the site in `proxy.ts`.
   - `noindex` via metadata, `X-Robots-Tag` and a `robots.ts` disallow.
5. **Verification gates:**
   - `pnpm --filter mollyxpaolo run lint`, `type-check`, `build`.
   - Measure that no tile or lightbox image exceeds `innerHeight`, at desktop and 390px, exactly as done for the prototype.

## Open questions

1. **Admin store:** Upstash (Vercel marketplace) or a JSON object in the `mollyxpaolo` R2 bucket? This affects env vars, cost and how saves revalidate the gallery.
2. **Passcode, admin password and who sets them.** These become env vars on the production Vercel project. The prototype's `vegas`/`admin` are placeholders and must not ship.
3. **Production Vercel project name:** `mollyxpaolo`? Check it's free before importing.
4. **Domain and email:**
   - Is any email address on mollyxpaolo.com in use? It has SiteGround MX records.
   - Will they move the zone to Cloudflare? That's needed for an R2 custom media domain, since r2.dev is dev-only and rate-limited.
   - Should the invitation site be archived?
5. **Content approvals from the family:**
   - Chapter names.
   - Whether the generated mono versions of VK-343/347 are acceptable.
   - The poster frame.
   - The sepia focus ring at 2.9:1: darken it?
6. **Video download:** upload a second copy of the MP4 with `Content-Disposition: attachment` so "Download the film" saves it?
7. **Push:** the 3 unpushed commits on `develop` (including the DCS wrap-up) haven't been pushed. Push before branching for Phase 2?
