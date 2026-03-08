/**
 * Generates a CI-inert package.json for pipeline test sites.
 *
 * Test sites are preview artefacts — they need dev/start/clean but must NOT
 * participate in Turborepo CI tasks (build, type-check, lint, test).
 */
const ALLOWED_SCRIPTS = ['dev', 'start', 'clean'];

export function generateTestSitePackageJson(
  name: string,
  basePackageJson: Record<string, unknown>
): Record<string, unknown> {
  const scripts = (basePackageJson.scripts as Record<string, string>) ?? {};
  const filtered = Object.fromEntries(
    Object.entries(scripts).filter(([key]) => ALLOWED_SCRIPTS.includes(key))
  );
  return {
    ...basePackageJson,
    name,
    scripts: filtered,
    pipelineTestSite: true,
  };
}
