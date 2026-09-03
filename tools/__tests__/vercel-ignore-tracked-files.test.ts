import { describe, it, expect } from "vitest";
import { execSync } from "child_process";
import { readFileSync, readdirSync, existsSync } from "fs";
import { join } from "path";

/**
 * Regression test for: ".vercelignore deletes git-tracked files, so turbo-ignore
 * sees every site as affected on every push."
 *
 * WHY THIS NEEDS A STANDING TEST RATHER THAN VIGILANCE
 *
 * Vercel applies .vercelignore to the build working tree BEFORE each site's
 * ignoreCommand (`npx turbo-ignore <pkg> --fallback=HEAD^1`) runs. turbo-ignore's
 * filter `<pkg>...[<sha>]` sets include_uncommitted, so turbo additionally runs
 * `git ls-files --others --modified`. A tracked file deleted from disk but still
 * in git's index reports as modified — so a .vercelignore pattern matching a
 * tracked file inside a package directory marks that package changed on EVERY
 * build, forever.
 *
 * Nothing errors and nothing goes red: every project just rebuilds on every push,
 * silently burning build minutes, and it also strips those files out of the
 * production build (the 2026-09-03 incident shipped a 404'ing og:image on DCS and
 * removed the npracing sites' icon.png/apple-icon.png). That is exactly the shape
 * of bug a cheap always-on invariant should catch.
 *
 * SCOPE — deliberately narrow, and this matters.
 * The invariant covers workspace package directories (sites/, packages/, tools/),
 * NOT the whole repo. Reproduction showed deleting root-level tracked paths
 * (output/, .claude/, .agents/, tasks/) changes nothing: they sit outside every
 * pnpm-workspace glob and are not in turbo.json globalDependencies, so turbo has
 * no package to attribute them to. A repo-wide assertion would fail on ~1,227
 * files (almost all harmless) and could only be satisfied by untracking
 * output/sessions/**, which is tracked on purpose.
 *
 * MATCHING: delegates to git's own gitignore engine rather than hand-rolling a
 * glob matcher —
 *   git ls-files -ci --exclude-from=.vercelignore -- sites packages tools
 *   -c cached (tracked only) | -i ignored (matching the exclude patterns)
 * Patterns are read from the real .vercelignore, never a hand-copied list.
 *
 * UNVERIFIED ASSUMPTION: that Vercel's own .vercelignore parser matches git's
 * gitignore engine. Vercel documents .vercelignore as gitignore-style but ships
 * its own parser. For the patterns actually in the file (bare names and simple
 * *.ext globs — no negation, globstars, anchors or character classes) divergence
 * is very unlikely, but it is an assumption, not a checked fact.
 *
 * See docs/rca/vercel-turbo-ignore-always-affected.md for the full RCA.
 */

const REPO_ROOT = join(__dirname, "..", "..");
const WORKSPACE_DIRS = ["sites", "packages", "tools"];

describe(".vercelignore vs git-tracked files inside workspace packages", () => {
  it("has patterns to check against (fixture sanity)", () => {
    const patterns = readFileSync(join(REPO_ROOT, ".vercelignore"), "utf8")
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line.length > 0 && !line.startsWith("#"));
    expect(patterns.length).toBeGreaterThan(0);
  });

  it("is running against a real checkout (fixture sanity)", () => {
    // Without this, the assertion below could pass vacuously outside a git tree.
    const tracked = execSync("git ls-files", { cwd: REPO_ROOT, encoding: "utf8" })
      .split("\n")
      .filter(Boolean).length;
    expect(tracked).toBeGreaterThan(100);
  });

  it("matches no git-tracked file inside any workspace package", () => {
    const matches = execSync(
      `git ls-files -ci --exclude-from=.vercelignore -- ${WORKSPACE_DIRS.join(" ")}`,
      { cwd: REPO_ROOT, encoding: "utf8" }
    )
      .split("\n")
      .filter(Boolean);

    if (matches.length > 0) {
      const sample = matches.slice(0, 25);
      const more =
        matches.length > sample.length ? `\n...and ${matches.length - sample.length} more` : "";
      throw new Error(
        `${matches.length} git-tracked file(s) inside a workspace package match a ` +
          `pattern in the root .vercelignore.\n\n` +
          `Vercel deletes these from the build working tree before turbo-ignore runs. ` +
          `turbo then sees them as uncommitted deletions and marks their package ` +
          `"affected" on every single push — and the files are also missing from the ` +
          `production build output.\n\n` +
          `Fix by narrowing the .vercelignore pattern (anchor it with a leading "/", ` +
          `or scope it to an untracked path) — not by untracking the asset.\n\n` +
          sample.join("\n") +
          more
      );
    }
  });
});

describe("every deployed site declares a turbo-ignore ignoreCommand", () => {
  const sitesDir = join(REPO_ROOT, "sites");
  // Only sites deployed as their own Vercel project carry a vercel.json —
  // base-template and showcase intentionally do not (no Vercel project exists
  // for either).
  const deployed = readdirSync(sitesDir, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .filter((name) => existsSync(join(sitesDir, name, "vercel.json")));

  it("found deployed sites to check (fixture sanity)", () => {
    expect(deployed.length).toBeGreaterThan(0);
  });

  it.each(deployed)(
    "sites/%s/vercel.json has a turbo-ignore ignoreCommand with --fallback=HEAD^1",
    (site) => {
      const config = JSON.parse(readFileSync(join(sitesDir, site, "vercel.json"), "utf8")) as {
        ignoreCommand?: string;
      };
      const pkg = JSON.parse(readFileSync(join(sitesDir, site, "package.json"), "utf8")) as {
        name: string;
      };

      expect(
        config.ignoreCommand,
        `sites/${site}/vercel.json is missing "ignoreCommand" — without it Vercel ` +
          `builds this project unconditionally on every push; there is no automatic ` +
          `skip-if-unaffected behaviour for monorepo rootDirectory projects.`
      ).toBeDefined();

      const escaped = pkg.name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      expect(
        config.ignoreCommand,
        `sites/${site}/vercel.json's ignoreCommand does not match the expected ` +
          `"cd ../.. && npx turbo-ignore ${pkg.name} --fallback=HEAD^1". The ` +
          `--fallback flag is load-bearing: without it turbo-ignore fails open once ` +
          `its diff target SHA falls outside Vercel's shallow clone.`
      ).toMatch(new RegExp(`cd \\.\\./\\.\\. && npx turbo-ignore ${escaped} --fallback=HEAD\\^1`));
    }
  );
});
