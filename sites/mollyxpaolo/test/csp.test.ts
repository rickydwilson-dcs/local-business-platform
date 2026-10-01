import { describe, expect, it } from 'vitest';
import { securityHeaders } from '../next.config';

const csp = (env: string) =>
  securityHeaders(env).find((h) => h.key === 'Content-Security-Policy')!.value;

describe('emitted security headers', () => {
  it('allows the media host for images, the film and zip fetches', () => {
    const v = csp('production');
    expect(v).toContain("img-src 'self' data: blob: *.r2.dev");
    expect(v).toContain("media-src 'self' *.r2.dev");
    expect(v).toContain("connect-src 'self' *.r2.dev");
  });

  it("gates 'unsafe-eval' to development only", () => {
    expect(csp('production')).not.toContain('unsafe-eval');
    expect(csp('development')).toContain("'unsafe-eval'");
  });

  it('loads no third-party scripts or fonts', () => {
    const v = csp('production');
    expect(v).not.toMatch(/googletagmanager|google-analytics|facebook|fonts\.g/);
    expect(v).toContain("frame-ancestors 'none'");
  });

  it('marks every response noindex', () => {
    const robots = securityHeaders('production').find((h) => h.key === 'X-Robots-Tag')!.value;
    expect(robots).toContain('noindex');
    expect(robots).toContain('noimageindex');
  });
});
