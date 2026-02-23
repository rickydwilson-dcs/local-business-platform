/**
 * Pipeline Visual Comparison
 *
 * Compares test site screenshots against reference site screenshots
 * using sharp for pixel-level comparison. Used by the visual-compare
 * Playwright spec generated for each pipeline test site.
 */

import sharp from 'sharp';
import * as fs from 'fs';
import * as path from 'path';

export interface ComparisonResult {
  page: string;
  route: string;
  referenceFile: string;
  testScreenshot: string;
  diffImage: string;
  totalPixels: number;
  diffPixels: number;
  diffPercent: number;
  pass: boolean;
}

/** Per-page diff thresholds (ratio 0-1). Structural pages are stricter. */
export const THRESHOLDS: Record<string, number> = {
  'home.png': 0.05,
  'about.png': 0.05,
  'blog-list.png': 0.08,
};
export const DEFAULT_THRESHOLD = 0.10;

/** Map reference screenshot filenames to test site routes. */
export const PAGE_MAP: Record<string, string> = {
  'home.png': '/',
  'about.png': '/about',
  'blog-list.png': '/blog',
};

/** Per-pixel sensitivity: sum of absolute RGB channel diffs must exceed this. */
const PIXEL_DIFF_THRESHOLD = 30;

/**
 * Compare a test screenshot buffer against a reference PNG file.
 * Returns the diff percentage and optionally writes a diff image.
 */
export async function compareImages(
  referenceImagePath: string,
  testImageBuffer: Buffer,
  diffOutputPath?: string,
): Promise<{ totalPixels: number; diffPixels: number; diffPercent: number }> {
  const refImage = sharp(referenceImagePath);
  const refMeta = await refImage.metadata();
  const refRaw = await refImage.raw().toBuffer();

  const testRaw = await sharp(testImageBuffer)
    .resize(refMeta.width, refMeta.height, { fit: 'fill' })
    .raw()
    .toBuffer();

  const totalPixels = refMeta.width! * refMeta.height!;
  let diffPixels = 0;

  // First pass: count diffs
  for (let i = 0; i < refRaw.length; i += 3) {
    const dr = Math.abs(refRaw[i] - testRaw[i]);
    const dg = Math.abs(refRaw[i + 1] - testRaw[i + 1]);
    const db = Math.abs(refRaw[i + 2] - testRaw[i + 2]);
    if (dr + dg + db > PIXEL_DIFF_THRESHOLD) diffPixels++;
  }

  const diffPercent = diffPixels / totalPixels;

  // Generate diff image if path provided
  if (diffOutputPath) {
    const diffData = Buffer.alloc(refRaw.length);
    for (let i = 0; i < refRaw.length; i += 3) {
      const dr = Math.abs(refRaw[i] - testRaw[i]);
      const dg = Math.abs(refRaw[i + 1] - testRaw[i + 1]);
      const db = Math.abs(refRaw[i + 2] - testRaw[i + 2]);
      if (dr + dg + db > PIXEL_DIFF_THRESHOLD) {
        diffData[i] = 255;
        diffData[i + 1] = 0;
        diffData[i + 2] = 0;
      } else {
        diffData[i] = refRaw[i];
        diffData[i + 1] = refRaw[i + 1];
        diffData[i + 2] = refRaw[i + 2];
      }
    }
    fs.mkdirSync(path.dirname(diffOutputPath), { recursive: true });
    await sharp(diffData, {
      raw: { width: refMeta.width!, height: refMeta.height!, channels: 3 },
    }).png().toFile(diffOutputPath);
  }

  return { totalPixels, diffPixels, diffPercent };
}
