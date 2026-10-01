# mollyxpaolo — wedding gallery

**Status:** In progress — Phase 0 done, Phase 1 prototype live and approved (https://mollyxpaolo-proto.vercel.app)
**Started:** 2026-10-01
**Site:** `sites/mollyxpaolo` (not yet created) · prototype Vercel project `mollyxpaolo-proto`
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

Gallery, tone toggle (in the URL and remembered per viewer), lightbox, downloads, passcode
middleware, admin (password + session) with shown / featured / hidden state in a small store
(Upstash or an R2 JSON object — decide in Phase 2), and on-demand revalidation when admin saves.
Standard platform hygiene: `vercel.json` `ignoreCommand`, CSP `img-src` / `media-src` /
`connect-src` for the media host, `next build --webpack`.

### Phase 3 — full upload, then Molly curates on the preview deployment

### Phase 4 — production

Dedicated bucket + custom media domain, Cloudflare zone decision, mail records preserved, apex
and www pointed at Vercel, optional archive of the invitation site.

## What was learned

(to fill in on completion)
