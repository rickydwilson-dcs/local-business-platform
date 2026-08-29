#!/usr/bin/env python3
"""
apply.py — apply confirmed plate redactions, and strip location metadata.

House treatment is a CLEAN BLANK PLATE, not a blur. A blur reads as damage and draws
the eye; a blank plate in the correct colour reads as deliberate, and is what auction
catalogues and dealer photography have always done. The plate's own background colour
is sampled from its border so the fill sits in the real light of the photograph.

Also strips ALL metadata by default. Phone images carry GPS — the workshop's, and
sometimes a customer's home.

Usage:
  .venv/bin/python apply.py redactions.json --in <src-dir> --out <dst-dir>
      [--style blank|blur|pixelate] [--keep-metadata] [--quality 92] [--contact-sheet]
"""
from __future__ import annotations
import argparse, json, shutil, sys
from pathlib import Path

import cv2
import numpy as np


def sample_plate_colour(img: np.ndarray, x: int, y: int, w: int, h: int) -> tuple[int, int, int]:
    """The plate's own ground colour.

    Sample the box INTERIOR, inset from the edges, not the border. A box drawn by hand
    is usually a little generous, so the border often contains whatever is behind the
    car — on the first test that was grass, and the fill came out green.

    Within the interior the plate ground is the light part and the characters are the
    dark part, so take the upper luminance band and median it. Then pull most of the
    saturation out: real plates are near-neutral, and any residual colour cast here is
    almost always bleed from the surroundings rather than the plate itself.
    """
    inset_x = max(1, int(w * 0.14))
    inset_y = max(1, int(h * 0.18))
    x0, y0 = max(0, x + inset_x), max(0, y + inset_y)
    x1 = min(img.shape[1], x + w - inset_x)
    y1 = min(img.shape[0], y + h - inset_y)
    if x1 <= x0 or y1 <= y0:
        x0, y0, x1, y1 = max(0, x), max(0, y), min(img.shape[1], x + w), min(img.shape[0], y + h)
    roi = img[y0:y1, x0:x1].reshape(-1, 3).astype(np.float32)
    if roi.size == 0:
        return (208, 208, 204)

    lum = roi @ np.array([0.114, 0.587, 0.299], dtype=np.float32)
    band = roi[lum >= np.percentile(lum, 62)] if len(roi) > 12 else roi
    b, g, r = (float(v) for v in np.median(band, axis=0))

    # Desaturate 70% toward the sample's own luminance.
    grey = 0.114 * b + 0.587 * g + 0.299 * r
    mix = 0.70
    b, g, r = (c * (1 - mix) + grey * mix for c in (b, g, r))
    return (int(np.clip(b, 0, 255)), int(np.clip(g, 0, 255)), int(np.clip(r, 0, 255)))


def fill_blank(img: np.ndarray, box: dict) -> None:
    """Paint a plausible blank plate: sampled ground, a soft vertical gradient so it
    isn't a dead flat rectangle, faint grain, and a slightly darker inner edge."""
    x, y, w, h = box["x"], box["y"], box["w"], box["h"]
    x0, y0 = max(0, x), max(0, y)
    x1, y1 = min(img.shape[1], x + w), min(img.shape[0], y + h)
    if x1 <= x0 or y1 <= y0:
        return
    bw, bh = x1 - x0, y1 - y0
    b, g, r = sample_plate_colour(img, x, y, w, h)

    patch = np.zeros((bh, bw, 3), dtype=np.float32)
    patch[:, :] = (b, g, r)

    # Vertical gradient: plates are usually lit slightly brighter at the top.
    grad = np.linspace(1.06, 0.94, bh, dtype=np.float32)[:, None, None]
    patch *= grad

    # Grain, so it doesn't read as a vector rectangle pasted over a photograph.
    rng = np.random.default_rng(0)
    patch += rng.normal(0.0, 2.4, patch.shape).astype(np.float32)

    patch = np.clip(patch, 0, 255).astype(np.uint8)
    patch = cv2.GaussianBlur(patch, (3, 3), 0)
    img[y0:y1, x0:x1] = patch

    # Inner edge, a touch darker — reads as the pressed rim of a real plate.
    cv2.rectangle(img, (x0, y0), (x1 - 1, y1 - 1),
                  tuple(int(c * 0.82) for c in (b, g, r)), 1, cv2.LINE_AA)


def fill_blur(img: np.ndarray, box: dict) -> None:
    x0, y0 = max(0, box["x"]), max(0, box["y"])
    x1, y1 = min(img.shape[1], box["x"] + box["w"]), min(img.shape[0], box["y"] + box["h"])
    if x1 <= x0 or y1 <= y0:
        return
    roi = img[y0:y1, x0:x1]
    k = max(9, (min(roi.shape[:2]) // 2) | 1)
    img[y0:y1, x0:x1] = cv2.GaussianBlur(roi, (k, k), 0)


def fill_pixelate(img: np.ndarray, box: dict) -> None:
    x0, y0 = max(0, box["x"]), max(0, box["y"])
    x1, y1 = min(img.shape[1], box["x"] + box["w"]), min(img.shape[0], box["y"] + box["h"])
    if x1 <= x0 or y1 <= y0:
        return
    roi = img[y0:y1, x0:x1]
    small = cv2.resize(roi, (max(2, roi.shape[1] // 14), max(2, roi.shape[0] // 8)),
                       interpolation=cv2.INTER_AREA)
    img[y0:y1, x0:x1] = cv2.resize(small, (roi.shape[1], roi.shape[0]),
                                   interpolation=cv2.INTER_NEAREST)


FILLERS = {"blank": fill_blank, "blur": fill_blur, "pixelate": fill_pixelate}


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("redactions")
    ap.add_argument("--in", dest="src", required=True)
    ap.add_argument("--out", dest="dst", required=True)
    ap.add_argument("--style", choices=list(FILLERS), default="blank")
    ap.add_argument("--quality", type=int, default=92)
    ap.add_argument("--keep-metadata", action="store_true",
                    help="Keep EXIF. Off by default — phone photos carry GPS.")
    ap.add_argument("--contact-sheet", action="store_true")
    args = ap.parse_args()

    data = json.loads(Path(args.redactions).read_text())
    src, dst = Path(args.src).resolve(), Path(args.dst).resolve()
    dst.mkdir(parents=True, exist_ok=True)

    unreviewed = [r["file"] for r in data["images"] if not r.get("reviewed")]
    if unreviewed:
        print(f"REFUSING: {len(unreviewed)} image(s) were never reviewed, e.g. {unreviewed[:3]}.\n"
              f"An unreviewed image is not the same as one with no plate. Finish the review first.",
              file=sys.stderr)
        return 2

    filler = FILLERS[args.style]
    redacted = untouched = missing = 0
    for rec in data["images"]:
        s = src / rec["file"]
        d = dst / rec["file"]
        d.parent.mkdir(parents=True, exist_ok=True)
        if not s.exists():
            print(f"  missing: {rec['file']}")
            missing += 1
            continue
        boxes = rec.get("boxes") or []
        if not boxes:
            shutil.copy2(s, d)
            untouched += 1
            continue
        img = cv2.imread(str(s))
        if img is None:
            print(f"  unreadable: {rec['file']}")
            missing += 1
            continue
        for b in boxes:
            filler(img, b)
        params = [cv2.IMWRITE_JPEG_QUALITY, args.quality] if d.suffix.lower() in {".jpg", ".jpeg"} else []
        cv2.imwrite(str(d), img, params)
        redacted += 1

    if not args.keep_metadata:
        # cv2.imwrite already drops EXIF on re-encode; copied files still carry theirs.
        import subprocess
        for rec in data["images"]:
            if not (rec.get("boxes")):
                f = dst / rec["file"]
                if f.exists():
                    subprocess.run(["magick", "mogrify", "-strip", str(f)],
                                   check=False, capture_output=True)

    print(f"\nredacted {redacted} · copied clean {untouched} · missing {missing}")
    print(f"output -> {dst}")
    if not args.keep_metadata:
        print("metadata stripped (GPS included)")

    if args.contact_sheet:
        import subprocess
        files = sorted(str(p) for p in dst.rglob("*") if p.suffix.lower() in {".jpg", ".jpeg", ".png"})
        if files:
            out = dst / "_contact-sheet.jpg"
            subprocess.run(["montage", *files, "-tile", "5x", "-geometry", "300x200+3+3",
                            "-background", "#222", str(out)], check=False)
            print(f"contact sheet -> {out}  (check every plate before publishing)")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
