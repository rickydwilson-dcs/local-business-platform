import { readdirSync, existsSync, readFileSync } from 'fs';
import { join } from 'path';
import { describe, test, expect } from 'vitest';

const SITES_DIR = join(__dirname, '../../sites');
const BLOCKED_SCRIPTS = [
  'build', 'type-check', 'lint', 'test', 'test:watch',
  'test:e2e', 'test:e2e:smoke', 'test:e2e:chromium', 'test:e2e:full',
  'validate:content', 'validate:quality', 'validate:all',
];

describe('test site package policy', () => {
  const testSiteDirs = existsSync(SITES_DIR)
    ? readdirSync(SITES_DIR, { withFileTypes: true })
        .filter(d => d.isDirectory() && d.name.startsWith('test-'))
        .map(d => d.name)
    : [];

  if (testSiteDirs.length === 0) {
    test.skip('no test sites present', () => {});
    return;
  }

  test.each(testSiteDirs)('%s has no CI-participating scripts', (site) => {
    const pkgPath = join(SITES_DIR, site, 'package.json');
    expect(existsSync(pkgPath)).toBe(true);
    const pkg = JSON.parse(readFileSync(pkgPath, 'utf-8'));
    const scripts = Object.keys(pkg.scripts ?? {});
    const violations = scripts.filter(s => BLOCKED_SCRIPTS.includes(s));
    expect(violations).toEqual([]);
  });

  test.each(testSiteDirs)('%s has pipelineTestSite marker', (site) => {
    const pkgPath = join(SITES_DIR, site, 'package.json');
    const pkg = JSON.parse(readFileSync(pkgPath, 'utf-8'));
    expect(pkg.pipelineTestSite).toBe(true);
  });
});
