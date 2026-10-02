# mollyxpaolo — curation (favourites & hidden) spec

**Status:** spec. To build **after** the main Phase 2 site lands.
**Written:** 2026-10-01, from the user's brief plus a read-only look at the in-progress build on `feat/mollyxpaolo-site`.
**Depends on:** `sites/mollyxpaolo` as built in Phase 2 (see `HANDOFF.md`).

## What the user asked for

> An admin screen where we can choose which photos should be featured or not shown at all. The
> featured ones get more visibility on the site — potentially a bigger image, potentially at the
> beginning of the section, potentially one on its own row in a viewport. It sits behind a
> password, and I send the URL to the happy couple so they can select the photos. If they don't
> make a photo featured or remove it, it's just a regular photo on the site.

Every photo is in exactly one of three states:

| State                      | Meaning                         | Where it shows                                                                                |
| -------------------------- | ------------------------------- | --------------------------------------------------------------------------------------------- |
| **Regular** (`shown`)      | The default.                    | In its chapter, in the normal mixed layout.                                                   |
| **Favourite** (`featured`) | Molly & Paolo love it.          | Bigger, on its own row, can open its chapter, in the favourites strip, eligible for the hero. |
| **Hidden** (`hidden`)      | They don't want it on the site. | Nowhere on the site.                                                                          |

## What already exists (do not rebuild)

These were read on 2026-10-01 in uncommitted work on `feat/mollyxpaolo-site`, so they may have changed since. **Re-read them before starting.**

- **`/admin` behind a password.**
  - `MXP_ADMIN_PASSWORD` is posted to `/api/admin/login`, which sets a signed `mxp_admin` cookie (30 days).
  - Login is throttled per IP (in-memory, so per function instance).
  - The admin cookie also grants guest access.
- **Store.**
  - One JSON object in the `mollyxpaolo` R2 bucket at `state/<MXP_STATE_KEY>/curation.json`, read and written over the S3 API (`lib/curation.ts`).
  - Shape: `{ version, updatedAt, photos: { "vk-NNN": "shown" | "featured" | "hidden" } }`. Only **departures from the seed** are stored. The seed is the enhanced 10 as favourites.
- **Save.**
  - `PUT /api/admin/curation` with `{ baseVersion, photos }`, i.e. the whole map.
  - The server refuses a stale `baseVersion` with 409.
  - On success it calls `revalidateTag('curation', { expire: 0 })`, so the gallery updates straight away.
- **Hidden photos are dropped server-side** (`lib/gallery.ts`), so a visitor's page never contains a hidden photo's id.
- **Favourites already:**
  - get their own row (`lib/rows.ts`): full width if landscape or on a phone, inset at 58% if portrait on desktop;
  - appear in the favourites strip;
  - feed the hero (only those with `heroOk: true` in `content/photos.json`).
- **Admin UI** (`components/curate.tsx`):
  - a grid where tapping cycles shown → favourite → hidden;
  - filters (All / Favourites / Hidden), counts, a save-status bar, and "Reset to the photographer's selection".

## Gaps this spec closes

1. **Favourites aren't reliably bigger.** A portrait favourite inset on desktop can come out _smaller_ than a regular pair of portraits, because both are capped at the same height (86svh).
2. **Favourites never open their chapter.** They stay in time order.
3. **Two curators conflict.** The couple are two people. If Molly and Paolo curate at the same time, whole-document versioning makes the second save fail with "Changed somewhere else. Reload the page", and that change is lost.
4. **Tap-to-cycle is error-prone on a phone.**
   - Two taps hides a photo, and there's no undo.
   - You can't see a photo bigger than a thumbnail before deciding.
   - The grid has no chapter grouping.
5. **Newly favourited photos never reach the hero.** `heroOk` is only set on the enhanced 10. A regular photo the couple promote has `heroOk` undefined, so it's never eligible.
6. **Sending the couple a link** works today as "URL + password". There's no one-tap admin link (the token code already has an `admin` scope, but nothing mints one).

## Requirements

### A. How favourites are shown on the gallery

| #   | Rule                                                                                                                                                                                                                                                                                                                                                        |
| --- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| A1  | **Own row, always.** A favourite never shares a row (already true; keep it).                                                                                                                                                                                                                                                                                |
| A2  | **Visibly bigger than any regular photo.** Two height caps. Regular rows are capped at **`--cap-regular: 70svh`**; favourite rows at **`--cap-featured: 86svh`**. Desktop portrait favourites use `width: min(70%, var(--cap-featured) * ar)` instead of 58%. Keep the existing rule that **no image is ever taller than the viewport** (user requirement). |
| A3  | **Chapter cover.** In each chapter, the earliest favourite (by capture time) is the chapter's **cover**. It renders directly under the chapter header, full width on every screen size (capped by `--cap-featured`), and is removed from its time-ordered slot, so it isn't shown twice. A chapter with no favourites has no cover.                         |
| A4  | **Other favourites stay in time order**, each on its own row (A1, A2).                                                                                                                                                                                                                                                                                      |
| A5  | **Lightbox order matches page order.** The cover comes first within its chapter.                                                                                                                                                                                                                                                                            |
| A6  | **The favourites strip** (after the intro) shows every favourite in time order (already true).                                                                                                                                                                                                                                                              |
| A7  | **Hero eligibility.** `heroOk` defaults to **true** for any photo not explicitly flagged `false`. Only the enhanced photos with baked-in lettering or collage layouts (341, 347, 349, 350) stay `false`. Change `buildGallery` to treat `heroOk !== false` as eligible. Existing landscape/portrait screen matching still applies.                          |
| A8  | **Favourite label.** The small "Favourite" badge on the tile stays.                                                                                                                                                                                                                                                                                         |
| A9  | **Hidden means gone everywhere.** Page payload, chapters, strip, hero, lightbox, Select, Download all, zip and share. Chapter counts and time ranges are recomputed. A chapter with every photo hidden is omitted (already true for chapters).                                                                                                              |

### B. The curation screen

| #   | Requirement                                                                                                                                                                                                                                                                                                                                                                                                                     |
| --- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| B1  | **Phone first.** Most likely used on the couple's phones. At 390px the grid is 3 columns of square thumbnails (w480).                                                                                                                                                                                                                                                                                                           |
| B2  | **Grouped by chapter**, in the same order and with the same headers as the gallery, each with its own counts (e.g. "The Vows · 136 · 4 favourites · 2 hidden"). Chapter jump links at the top.                                                                                                                                                                                                                                  |
| B3  | **Clear state on every thumbnail.** Favourite: gold or accent outline plus a ★ badge. Hidden: dimmed and greyscale plus a "Hidden" badge. Regular: no decoration. Colour must not be the only cue (the user is colourblind), so badges always carry text or an icon.                                                                                                                                                            |
| B4  | **Tapping a thumbnail opens a review viewer, not a blind cycle.** It's full-screen, uses the same swipe, keyboard and fit-to-viewport behaviour as the gallery lightbox, and has a fixed bottom bar with three explicit buttons: **★ Favourite · Regular · Hide**, with the current one highlighted. Choosing one saves immediately. Swiping to the next photo keeps the bar, so the couple can go through all 350 in one pass. |
| B5  | **Quick actions on desktop.** Hovering a thumbnail shows ★ and hide buttons for single-click changes without opening the viewer.                                                                                                                                                                                                                                                                                                |
| B6  | **Undo.** Every change shows a toast ("Photo 123 hidden · Undo") for 8s. Undo reverts that one photo.                                                                                                                                                                                                                                                                                                                           |
| B7  | **Filters:** All / Favourites / Regular / Hidden, plus totals.                                                                                                                                                                                                                                                                                                                                                                  |
| B8  | **Gentle guidance, no hard limit.** A chapter's header shows a soft note if favourites exceed about 1 in 6 photos ("Lots of favourites here, so they'll stand out less"). Never block.                                                                                                                                                                                                                                          |
| B9  | **Reset** to the photographer's selection is a two-step button: a first tap shows "Tap again to reset everything", which cancels after 5s. No browser `confirm()`.                                                                                                                                                                                                                                                              |
| B10 | **Save state.** Each changed photo shows a small pending indicator until the server confirms. On failure the photo reverts, with "Not saved: tap to retry".                                                                                                                                                                                                                                                                     |
| B11 | **See it live.** "View the gallery" opens the site in a new tab. Changes are live within seconds (revalidation already in place).                                                                                                                                                                                                                                                                                               |
| B12 | **Partner's changes appear without a reload.** On window focus, and every 30s while visible, re-read the state and merge it into the screen (see C).                                                                                                                                                                                                                                                                            |

### C. Saving: safe for two people at once

| #   | Requirement                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   |
| --- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| C1  | **Per-photo patches instead of the whole map.** `PATCH /api/admin/curation` with body `{ changes: { "vk-123": "featured" \| "hidden" \| "shown" } }`, one or a few photos.                                                                                                                                                                                                                                                                                                                                                                                    |
| C2  | **The server merges.** It reads the current state, applies the patch, and writes with a conditional put on the object's ETag. If the precondition fails, it re-reads, re-applies and retries (up to 3 times). Two people changing **different** photos never conflict. On the **same** photo, the last write wins. **Assumption to verify:** R2's S3 API honours `If-Match` on `PutObject`. Check Cloudflare's R2 S3-compatibility docs before relying on it; if it doesn't, fall back to version-compare plus retry loop on the server, never on the client. |
| C3  | **The response returns the full current state.** The client replaces its view with it, which also brings in the partner's changes (B12).                                                                                                                                                                                                                                                                                                                                                                                                                      |
| C4  | **Seed semantics unchanged.** Store only departures from the seed. Setting a seeded favourite to `shown` stores `shown` explicitly; setting a photo back to its seed deletes its key.                                                                                                                                                                                                                                                                                                                                                                         |
| C5  | **Change log.** Append `{ at, id, from, to, by }` to a `log` array in the same object, keeping the last 500 entries. `by` is optional (see D3). It lets Ricky see what changed and undo a mistake by hand.                                                                                                                                                                                                                                                                                                                                                    |
| C6  | **The old `PUT` whole-map endpoint stays only for Reset** (B9), and is still version-checked.                                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
| C7  | **Every write revalidates** the `curation` tag (already done; keep `expire: 0`).                                                                                                                                                                                                                                                                                                                                                                                                                                                                              |

### D. Access and sharing the link

| #   | Requirement                                                                                                                                                                                                                                                                                   |
| --- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| D1  | **The default stays URL plus password:** `https://www.mollyxpaolo.com/admin` and `MXP_ADMIN_PASSWORD`, sent separately (e.g. URL by message, password by phone). This already works.                                                                                                          |
| D2  | **Optional one-tap link** (open question 2). Extend `scripts/mint-link.ts` with `--scope admin --days 30` to mint `/s/<token>` admin links. The `/s/[token]` route must accept `scope: 'admin'` and set **both** the admin and guest cookies. The admin link expires; the guest link doesn't. |
| D3  | **Optional "who's curating"** (open question 4). After login, two buttons, "I'm Molly" and "I'm Paolo", stored in the admin cookie payload. Used only for C5's `by`. No accounts.                                                                                                             |
| D4  | **Admin revocation independent of guests.** Add `MXP_ADMIN_VERSION` (default 1) for admin tokens, so revoking admin access doesn't log out every guest. Today a single `MXP_LINK_VERSION` covers both.                                                                                        |
| D5  | **The API re-checks the admin cookie** on every write (already done), and also rejects a cross-origin `Origin` header on PATCH and PUT.                                                                                                                                                       |
| D6  | **Admin pages are noindex**, as already applies site-wide.                                                                                                                                                                                                                                    |

### E. What hiding does **not** do

- Hiding removes a photo from the site. It does **not** delete the files from R2: the public `r2.dev` URLs still work for anyone who already has one.
- If the couple want hidden photos truly gone, that's a separate, explicitly requested step: a dry-run-first `tools/mollyxpaolo/purge-hidden.ts` that lists the keys (15 per photo: 3 tones × 5 sizes), then deletes them on confirmation. Deleted photos then need removing from `content/photos.json`. **Not part of this build.**

## Acceptance criteria

1. With no curation saved, the site looks like the photographer's selection: the enhanced 10 are favourites.
2. Marking a regular photo as a favourite on a phone puts it on the live gallery within 10s of saving. It's on its own row and visibly taller than the regular rows next to it (measured: `featured.height > max(regular row height in that chapter)`), and still no taller than the viewport.
3. In a chapter with favourites, the earliest one appears directly under the chapter header and nowhere else in that chapter. Lightbox order agrees.
4. A newly favourited landscape photo can appear in the hero rotation on a landscape screen. 341, 347, 349 and 350 never do.
5. Hiding a photo removes it from the page HTML and JSON payload (search the served HTML for its `vk-NNN` id: no match), from the lightbox, from the favourites strip, and from "Download all" (the zip's file count drops by one).
6. Two browsers signed in as admin change different photos within the same second. Both changes persist and both screens show both after the next focus or poll. Neither shows an error.
7. Undo within 8s restores the previous state, and the live gallery follows.
8. Reset needs two taps, and returns to the photographer's selection.
9. Every photo state is identifiable without relying on colour (B3).
10. Usable at 390px: review viewer images fit the viewport, the three buttons are at least 44px tall, and there's no sideways scroll.

## Tests

**Unit (vitest)**

- `buildRows` / `buildGallery`:
  - the cover is taken from its time slot and placed first;
  - chapters without favourites have no cover;
  - two-cap sizing data;
  - `heroOk !== false` eligibility;
  - hidden excluded everywhere, including counts.
- Curation merge:
  - patch application;
  - seed-delete semantics;
  - log cap at 500;
  - retry on precondition failure, with a mocked S3 client returning 412 once.
- API:
  - 401 without the admin cookie;
  - 400 for an unknown id;
  - 403 for a cross-origin `Origin`;
  - PATCH merges rather than replaces.

**E2E (Playwright, 390×844 and desktop)**

- Log in, favourite a photo, and check the gallery shows it as the chapter cover.
- Hide a photo, and check it's absent from the page and from the zip count.
- Undo.
- Two-context concurrent edit (acceptance 6).
- Measure every gallery tile and review-viewer image against `innerHeight`, as the prototype verification did.

## Out of scope

- Reordering photos, captions, or editing chapter names. Chapter names live in `content/chapters.json`, edited by Ricky.
- Curation per tone. A photo's state applies to all three tones.
- Admin for future albums (holiday photos). The state map is keyed by photo id, so it extends naturally; an album filter can come later.
- Deleting files from R2 (section E).
- User accounts.

## Open questions for the user

1. **Starting point:** do the couple start from the photographer's enhanced 10 as favourites (current behaviour), or from a clean slate with no favourites?
2. **One-tap admin link (D2),** or keep URL plus password only?
3. **Chapter cover (A3):** automatic (earliest favourite), or should the couple be able to pin which favourite opens each chapter? Pinning adds a "Make chapter cover" button and a `covers` map to the state.
4. **"I'm Molly / I'm Paolo" (D3)** for the change log, or not needed?
5. **Soft guidance threshold (B8):** is about 1 favourite in 6 photos right, or drop the hint altogether?
6. **Hidden photos:** is "removed from the site" enough, or do they want them deleted from storage once they've finished (section E)?

## Answers (Ricky, 2026-10-02)

1. **Starting point:** the enhanced 10 stay as favourites (current seed).
2. **Admin access:** URL plus password only. D2 and D4 are **dropped** from this build.
3. **Chapter cover:** automatic, the earliest favourite. No pinning.
4. **Who's curating:** not needed. D3 is **dropped**; log entries have no `by`.
5. **Guidance:** keep the soft note at about 1 favourite in 6 photos.
6. **Hidden:** removed from the site is enough. No purge tool.

## Added scope: gallery lightbox on touch (Ricky, 2026-10-02)

- **L1 Pinch to zoom** in the swipe viewer, with two-finger pan while pinching. One finger pans once zoomed. Zoom back to 1× resumes swiping. Double-tap zoom stays.
- **L2 Clearer exit.** A distinct, higher-contrast X in the top-right corner that stays visible when a single tap hides the other controls.
- The curation review viewer (B4) gets the same gestures.
