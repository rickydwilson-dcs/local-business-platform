#!/usr/bin/env python3
"""
detect.py — propose number-plate regions in a folder of photographs.

Deliberately tuned to over-propose. A missed plate is a privacy failure; a spurious
box costs one keystroke in the review step. Recall beats precision here.

Handles both UK polarities:
  - dark characters on a light ground (modern white/yellow plates)  -> blackhat
  - light characters on a dark ground (period black/silver plates)  -> tophat

Usage:
  .venv/bin/python detect.py <image-dir> [--out proposals.json] [--max-per-image 6]

Writes proposals.json and review.html (the manifest is embedded, so the review page
works straight off file:// with no server).
"""
from __future__ import annotations
import argparse, json, base64, sys
from pathlib import Path

import cv2
import numpy as np

IMAGE_EXT = {".jpg", ".jpeg", ".png", ".heic", ".webp", ".tif", ".tiff"}
# UK oblong is ~4.6:1. Classic cars frequently wear square/two-line plates at ~1.3:1.
# Perspective squashes both, so the window is wide on purpose.
AR_MIN, AR_MAX = 1.15, 7.5


def candidates_for(gray: np.ndarray, polarity: str) -> list[tuple[int, int, int, int, float]]:
    """One pass of the classic ANPR morphology, for a single text polarity."""
    h, w = gray.shape
    # Kernel scales with image width so behaviour is resolution-independent.
    kx = max(9, int(w * 0.020) | 1)
    ky = max(3, int(w * 0.005) | 1)
    rect = cv2.getStructuringElement(cv2.MORPH_RECT, (kx, ky))

    op = cv2.MORPH_BLACKHAT if polarity == "dark_on_light" else cv2.MORPH_TOPHAT
    hat = cv2.morphologyEx(gray, op, rect)

    gx = cv2.Sobel(hat, cv2.CV_32F, 1, 0, ksize=3)
    gx = np.absolute(gx)
    mn, mx = float(gx.min()), float(gx.max())
    if mx - mn < 1e-6:
        return []
    gx = (255 * ((gx - mn) / (mx - mn))).astype("uint8")

    gx = cv2.GaussianBlur(gx, (5, 5), 0)
    gx = cv2.morphologyEx(gx, cv2.MORPH_CLOSE, rect)
    thresh = cv2.threshold(gx, 0, 255, cv2.THRESH_BINARY | cv2.THRESH_OTSU)[1]
    thresh = cv2.erode(thresh, None, iterations=2)
    thresh = cv2.dilate(thresh, None, iterations=2)

    cnts, _ = cv2.findContours(thresh, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
    out = []
    img_area = h * w
    for c in cnts:
        x, y, cw, ch = cv2.boundingRect(c)
        if ch < 8 or cw < 20:
            continue
        ar = cw / float(ch)
        if not (AR_MIN <= ar <= AR_MAX):
            continue
        area = cw * ch
        # A plate is a small but not vanishing part of the frame.
        if not (img_area * 0.00025 <= area <= img_area * 0.18):
            continue

        roi = gray[y:y + ch, x:x + cw]
        if roi.size == 0:
            continue
        # Character-bearing regions have high local contrast and a bimodal histogram.
        contrast = float(roi.std())
        if contrast < 18:
            continue
        _, otsu = cv2.threshold(roi, 0, 255, cv2.THRESH_BINARY | cv2.THRESH_OTSU)
        ink = float((otsu == 0).mean())
        if polarity == "light_on_dark":
            ink = 1.0 - ink
        # Plates run roughly 15-55% ink coverage. Outside that it is usually trim or shadow.
        if not (0.10 <= ink <= 0.62):
            continue

        ar_score = 1.0 - min(abs(ar - 4.6) / 4.6, 1.0)
        score = 0.45 * ar_score + 0.35 * min(contrast / 70.0, 1.0) + 0.20 * (1.0 - abs(ink - 0.33) / 0.33)
        out.append((x, y, cw, ch, round(float(score), 4)))
    return out


def nms(boxes: list[tuple], iou_thresh: float = 0.3) -> list[tuple]:
    if not boxes:
        return []
    boxes = sorted(boxes, key=lambda b: -b[4])
    keep = []
    for b in boxes:
        bx1, by1, bx2, by2 = b[0], b[1], b[0] + b[2], b[1] + b[3]
        drop = False
        for k in keep:
            kx1, ky1, kx2, ky2 = k[0], k[1], k[0] + k[2], k[1] + k[3]
            ix, iy = max(0, min(bx2, kx2) - max(bx1, kx1)), max(0, min(by2, ky2) - max(by1, ky1))
            inter = ix * iy
            union = b[2] * b[3] + k[2] * k[3] - inter
            if union > 0 and inter / union > iou_thresh:
                drop = True
                break
        if not drop:
            keep.append(b)
    return keep


def thumb_data_uri(img: np.ndarray, max_w: int = 900) -> str:
    h, w = img.shape[:2]
    if w > max_w:
        img = cv2.resize(img, (max_w, int(h * max_w / w)), interpolation=cv2.INTER_AREA)
    ok, buf = cv2.imencode(".jpg", img, [cv2.IMWRITE_JPEG_QUALITY, 72])
    return "data:image/jpeg;base64," + base64.b64encode(buf.tobytes()).decode() if ok else ""


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("image_dir")
    ap.add_argument("--out", default="proposals.json")
    ap.add_argument("--review", default="review.html")
    ap.add_argument("--max-per-image", type=int, default=6)
    ap.add_argument("--embed-thumbs", action="store_true",
                    help="Inline thumbnails into review.html so it is portable (bigger file).")
    args = ap.parse_args()

    root = Path(args.image_dir).resolve()
    files = sorted(p for p in root.rglob("*") if p.suffix.lower() in IMAGE_EXT and p.is_file())
    if not files:
        print(f"No images under {root}", file=sys.stderr)
        return 1

    records = []
    for i, f in enumerate(files, 1):
        img = cv2.imread(str(f))
        if img is None:
            print(f"  skip (unreadable): {f.name}")
            continue
        gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
        gray = cv2.bilateralFilter(gray, 9, 40, 40)
        boxes = candidates_for(gray, "dark_on_light") + candidates_for(gray, "light_on_dark")
        boxes = nms(boxes)[: args.max_per_image]
        h, w = img.shape[:2]
        rec = {
            "file": str(f.relative_to(root)),
            "w": w, "h": h,
            "candidates": [{"x": b[0], "y": b[1], "w": b[2], "h": b[3], "score": b[4]} for b in boxes],
            "boxes": [],          # filled in by the review step
            "reviewed": False,
        }
        if args.embed_thumbs:
            rec["thumb"] = thumb_data_uri(img)
        records.append(rec)
        if i % 25 == 0 or i == len(files):
            print(f"  {i}/{len(files)} scanned")

    manifest = {"root": str(root), "count": len(records), "images": records}
    Path(args.out).write_text(json.dumps(manifest, indent=1))

    tpl = Path(__file__).with_name("review.template.html")
    if tpl.exists():
        html = tpl.read_text().replace("/*__MANIFEST__*/", json.dumps(manifest))
        Path(args.review).write_text(html)
        print(f"\nreview page -> {Path(args.review).resolve()}")

    withc = sum(1 for r in records if r["candidates"])
    print(f"\n{len(records)} images, {withc} with at least one candidate "
          f"({len(records) - withc} with none — check those by eye, they are where misses hide).")
    print(f"proposals -> {Path(args.out).resolve()}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
