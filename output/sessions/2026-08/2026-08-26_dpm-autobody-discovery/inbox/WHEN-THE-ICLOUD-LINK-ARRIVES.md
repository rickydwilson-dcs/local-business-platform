# When David's iCloud link arrives

**Expected:** project photography — some camera files, majority phone images. Confirmed by David
2026-08-28. Possibly including the P1800's "over 2000 photos" portfolio.

Do these in order. Steps 1–3 decide what the site can actually be.

## 1. Triage before anything else

```bash
# What are we actually looking at? Dimensions and camera, per file.
mdls -name kMDItemPixelWidth -name kMDItemPixelHeight -name kMDItemAcquisitionModel <file>
# Or in bulk:
find <dir> -type f \( -iname '*.jpg' -o -iname '*.heic' -o -iname '*.png' \) -print0 \
  | xargs -0 sips -g pixelWidth -g pixelHeight -g format
```

Record and report: **total count · resolution distribution · HEIC vs JPEG · how many are ≥3000px on
the long edge · date range · how many distinct cars.**

The single number that matters: **how many are above 1280px.** Everything reachable so far was capped
at Instagram's 1080–1280px, and that ceiling is what forced AI plates into the prototypes. If the
originals are 12MP, most of those placeholders can be replaced with real DPM work.

## 2. Check the thing resolution does not fix

Sort a sample by _light_, not by pixels. Count how many are:

- a **finished car**, in **daylight**, **away from the workshop** — the shot every reference site
  leads with, and the one the audit could find exactly one of;
- **paint under raking or directional light**, where reflection and depth actually read;
- **matched before/after from a fixed mark** — DPM currently have none.

A 12MP phone photograph under flat workshop fluorescent is still a flat photograph. **Report these
three counts honestly**, because they, not the file sizes, determine whether the commissioned shoot
is still needed. Current expectation: it is.

## 3. Update the record, don't paper over it

- `research/asset-audit-dpm.md` — append a dated correction with the real numbers. That file already
  carries one correction; a second is fine. Wrong findings left standing cost more than they save.
- `prototype/assets/art-direction/MANIFEST.md` — mark every AI plate that a real photograph now
  replaces, and swap it in the prototype.
- `synthesis.md` §3 and §8 — the asset-reality section and the ordered ask list both change if the
  library is bigger than we thought.

## 4. Handling

- **Never commit the images.** `output/.gitignore` denies binaries across `sessions/**` by design.
  Work from `inbox/`, publish through R2 — `tools/upload-prototype-assets.ts`, then
  `tools/publish-prototype.ts`. See `docs/guides/prototype-hosting.md`.
- **Convert HEIC** before use: `sips -s format jpeg in.heic --out out.jpg`. iPhone photos are HEIC by
  default and will not render in a browser.
- **Strip EXIF GPS** before anything is published. Phone images carry the workshop's — and possibly a
  customer's home — coordinates. `exiftool -gps:all= -o cleaned/ <files>`.
- **Redact number plates properly.** Owners have agreed to their cars appearing (David, 2026-08-28)
  on the basis that plates are redacted. A clean blank reads as deliberate; the white scribble on the
  existing whole-car shot reads as damage. Pick one house treatment and apply it to every car.

## 5. Also chase — David's brother

He was the production firm on the P1800 film and _"has quite a lot of other footage we could probably
use"_. Ask for an inventory and the **graded masters, not YouTube rips**. If there is usable silent
b-roll in there — slow moves across panels, anything exterior in daylight — part of the planned video
commission may already be in the can, and the hero problem is solved without a shoot.
