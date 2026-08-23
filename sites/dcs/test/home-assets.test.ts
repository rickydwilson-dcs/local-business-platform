import { describe, expect, it } from 'vitest';
import * as fs from 'fs';
import * as path from 'path';

/**
 * Asserts against the REAL manifest produced by `tools/copy-dcs-home-assets.ts` —
 * every entry was captured from a live HTTP HEAD response against the public R2
 * URL at copy time (see the "generatedAt" field and
 * output/sessions/2026-08/2026-08-23_dcs-homepage-nextjs-port/assets-manifest.json).
 * This test is a golden-fixture check on that recorded data, not a live network
 * call, so it stays fast and offline. Re-run
 * `npx tsx tools/copy-dcs-home-assets.ts --verify` for a live re-check.
 */

interface ManifestEntry {
  logicalName: string;
  oldUrl: string;
  newUrl: string;
  contentType: string;
  contentLength: number;
}

interface Manifest {
  assets: ManifestEntry[];
}

const MANIFEST_PATH = path.resolve(
  __dirname,
  '../../../output/sessions/2026-08/2026-08-23_dcs-homepage-nextjs-port/assets-manifest.json'
);

function loadManifest(): Manifest {
  const raw = fs.readFileSync(MANIFEST_PATH, 'utf-8');
  return JSON.parse(raw) as Manifest;
}

function expectedContentType(url: string): string {
  const ext = path.extname(new URL(url).pathname).toLowerCase();
  if (ext === '.mp4') return 'video/mp4';
  if (ext === '.jpg' || ext === '.jpeg') return 'image/jpeg';
  throw new Error(`Unhandled extension "${ext}" in test fixture for ${url}`);
}

describe('dcs homepage assets manifest', () => {
  it('exists and is readable', () => {
    expect(fs.existsSync(MANIFEST_PATH)).toBe(true);
  });

  it('records exactly 18 assets', () => {
    const manifest = loadManifest();
    expect(manifest.assets).toHaveLength(18);
  });

  it("every asset's recorded content-type matches its URL extension", () => {
    const manifest = loadManifest();
    for (const asset of manifest.assets) {
      const expected = expectedContentType(asset.newUrl);
      expect(
        asset.contentType.startsWith(expected),
        `${asset.logicalName}: recorded content-type "${asset.contentType}" does not match expected "${expected}" for ${asset.newUrl}`
      ).toBe(true);
    }
  });

  it('no final URL points at the prototype-scoped prefix', () => {
    const manifest = loadManifest();
    for (const asset of manifest.assets) {
      expect(asset.newUrl.includes('prototypes/')).toBe(false);
    }
  });

  it('every asset has a positive recorded content-length', () => {
    const manifest = loadManifest();
    for (const asset of manifest.assets) {
      expect(asset.contentLength).toBeGreaterThan(0);
    }
  });

  it('logical names are unique', () => {
    const manifest = loadManifest();
    const names = manifest.assets.map((a) => a.logicalName);
    expect(new Set(names).size).toBe(names.length);
  });
});
