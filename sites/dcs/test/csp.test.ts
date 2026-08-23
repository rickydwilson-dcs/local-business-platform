import { afterEach, describe, expect, it, vi } from 'vitest';
// Import the REAL exported Next.js config (already wrapped by withMDX) so
// this test exercises the actual emitted header, not a hand-written copy
// of the CSP string.
import nextConfig from '../next.config';

interface HeaderEntry {
  key: string;
  value: string;
}

interface HeaderGroup {
  source: string;
  headers: HeaderEntry[];
}

async function getCspHeaderValue(): Promise<string> {
  const config = nextConfig as unknown as {
    headers: () => Promise<HeaderGroup[]>;
  };
  const groups = await config.headers();
  const catchAll = groups.find((g) => g.source === '/(.*)');
  if (!catchAll) {
    throw new Error('No catch-all header group found in next.config.ts headers()');
  }
  const csp = catchAll.headers.find((h) => h.key === 'Content-Security-Policy');
  if (!csp) {
    throw new Error('No Content-Security-Policy header found in the catch-all header group');
  }
  return csp.value;
}

describe('dcs CSP — media-src and unsafe-eval gating', () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it('emits a media-src directive covering *.r2.dev in development', async () => {
    vi.stubEnv('NODE_ENV', 'development');
    const csp = await getCspHeaderValue();
    expect(csp).toMatch(/media-src [^;]*\*\.r2\.dev/);
  });

  it('emits a media-src directive covering *.r2.dev in production', async () => {
    vi.stubEnv('NODE_ENV', 'production');
    const csp = await getCspHeaderValue();
    expect(csp).toMatch(/media-src [^;]*\*\.r2\.dev/);
  });

  it('leaves img-src untouched (still covers *.r2.dev and placehold.co)', async () => {
    vi.stubEnv('NODE_ENV', 'production');
    const csp = await getCspHeaderValue();
    expect(csp).toMatch(/img-src 'self' data: \*\.r2\.dev placehold\.co/);
  });

  it("includes 'unsafe-eval' in script-src only when NODE_ENV=development", async () => {
    vi.stubEnv('NODE_ENV', 'development');
    const devCsp = await getCspHeaderValue();
    expect(devCsp).toContain("'unsafe-eval'");
  });

  it("never includes 'unsafe-eval' in script-src when NODE_ENV=production", async () => {
    vi.stubEnv('NODE_ENV', 'production');
    const prodCsp = await getCspHeaderValue();
    expect(prodCsp).not.toContain("'unsafe-eval'");
  });
});
