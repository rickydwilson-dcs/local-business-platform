# plate-redact

Number-plate redaction for DPM Autobody photography. Built 2026-08-28.

David confirmed the car owners are happy for their cars to appear **on the basis that plates are
redacted**, so this is a condition of use, not a nicety. It runs at portfolio scale — the P1800 alone
is claimed to have "over 2000 photos".

## The shape of it

**Propose → confirm → apply.** Detection is automatic, but a human confirms every image before
anything is written. That is deliberate: a spurious box costs one keystroke, **a missed plate is a
privacy failure**, and no detector is good enough to be trusted unsupervised with someone else's
registration. `apply.py` refuses to run on any image that was never reviewed.

## Use

```bash
cd tools/plate-redact

# 1. Propose. Over-proposes on purpose — recall beats precision here.
./.venv/bin/python detect.py /path/to/photos \
    --out work/proposals.json --review work/review.html --embed-thumbs

# 2. Confirm. Opens straight from file:// — the manifest is embedded, no server needed.
open work/review.html
#    drag = draw a box · click a dashed suggestion = accept it · × = remove
#    → / space = next · n = no plate here · a = accept all · u = undo · e = export
#    Export writes redactions.json to ~/Downloads.

# 3. Apply.
./.venv/bin/python apply.py ~/Downloads/redactions.json \
    --in /path/to/photos --out /path/to/redacted --style blank --contact-sheet

# 4. Check the contact sheet by eye before anything is published.
```

`--embed-thumbs` inlines the images so `review.html` is portable and works regardless of where it
sits. Drop it for large batches and the page will read the originals from disk instead.

## The house treatment: a blank plate, not a blur

`--style blank` is the default and the one to use. It paints the plate's **own sampled ground colour**,
with a soft vertical gradient, faint grain and a slightly darker inner edge.

A blur or a pixelation says _something has been hidden here_ and drags the eye straight to it. A clean
blank plate reads as deliberate — it is what auction catalogues and dealer photography have always
done, and on a concours car it looks like a car photographed before registration. `--style blur` and
`--style pixelate` exist for cases where a blank would look wrong, but they are not the house look.

On the P1800 whole-car shot this is a straight upgrade: the existing image has the registration
scribbled out in white by hand, which looks like damage to the photograph. The blank replaces it.

## Metadata

**All metadata is stripped by default**, including GPS. Phone photographs carry the workshop's
coordinates and, if a car was photographed at a customer's house, theirs. Pass `--keep-metadata` only
if you have a specific reason and have thought about it.

## How the detector works, and where it fails

Classic ANPR morphology — blackhat/tophat to isolate character strokes, Sobel on the horizontal
gradient, close, Otsu, then contours filtered on aspect ratio, area, local contrast and ink coverage.
It runs **both polarities**, because classic cars wear period black-with-silver plates as often as
modern white and yellow ones, and a detector tuned only for dark-on-light misses half of them. The
aspect window is 1.15–7.5, wide enough for square two-line plates and for perspective squash.

**Verified on the real library (2026-08-28):** on the P1800 whole-car shot the plate came back as the
**rank-1 candidate at 0.87**, above five false positives (bare branches, chrome trim, a reflection).
That is the intended behaviour — the plate surfaces at the top, the noise is dismissed in a second.

Where it will struggle, and why the confirm step is not optional:

- plates at a steep angle, heavily foreshortened, or partly hidden by a bumper overrider;
- very small plates in wide establishing shots;
- reflections of a plate in chrome or in another panel — easily missed by eye too, so look for them;
- dark plates on a dark car in low light, where contrast falls under threshold.

The detector draws axis-aligned rectangles. An angled plate needs a box generous enough to cover it,
which is fine — the fill samples from the box interior precisely so a generous box still picks up the
plate's colour rather than the background.

## A bug worth not reintroducing

The first version sampled the plate colour from a thin frame just **inside the box border**, assuming
the box tightly bounds the plate. Hand-drawn boxes are usually a little generous, so that frame
contained the grass behind the car and the "plate" came out **green**. It now samples the box
_interior_, inset, takes the upper luminance band (plate ground is light, characters are dark), and
desaturates 70% toward neutral. Real plates are near-neutral; a colour cast at this stage is almost
always bleed from the surroundings.

## Files

| File                   | Purpose                                                                       |
| ---------------------- | ----------------------------------------------------------------------------- |
| `detect.py`            | Proposes candidate plate regions; writes `proposals.json` and the review page |
| `review.template.html` | The review UI; `detect.py` embeds the manifest into it                        |
| `apply.py`             | Applies confirmed boxes, strips metadata, optional contact sheet              |
| `.venv/`               | Contained venv (OpenCV 5.0, numpy, pillow). Not committed                     |

Also needs ImageMagick (`magick`) on PATH for metadata stripping and contact sheets — already present
on this machine.
