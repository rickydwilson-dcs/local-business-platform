# Update Documentation

Verify and update documentation to accurately reflect how the codebase actually works. This is about instructional accuracy, not counting files.

## What to Check

### 1. Architecture Docs Match Reality

Read the "How It Works" docs and verify they describe current patterns:

- [docs/architecture/how-dynamic-routing-works.md](docs/architecture/how-dynamic-routing-works.md) — Does the described routing pattern match the actual `[slug]/page.tsx` files? Check `sites/base-template/app/` for any new dynamic routes not documented.
- [docs/architecture/how-theme-system-works.md](docs/architecture/how-theme-system-works.md) — Does the pipeline description match `packages/theme-system/src/`? Check for new tokens, changed defaults, or modified plugin behavior.
- [docs/architecture/how-build-pipeline-works.md](docs/architecture/how-build-pipeline-works.md) — Does the build order match `turbo.json`? Check for new packages, changed dependencies, or modified scripts.
- [docs/architecture/how-site-creation-works.md](docs/architecture/how-site-creation-works.md) — Does the site creation flow match `tools/create-site-from-project.ts`? Check for new steps or changed behavior.

### 2. CLAUDE.md is Instructionally Accurate

- Does the "How This Platform Works" section describe the current architecture?
- Are the essential commands still correct?
- Do all linked docs exist?

### 3. Package Docs Match Exports

- [packages/core-components/CLAUDE.md](packages/core-components/CLAUDE.md) — Does the component list match actual exports in `src/index.ts`?
- [packages/intake-system/README.md](packages/intake-system/README.md) — Does the API description match actual exports?

### 4. Cross-References Resolve

Check that all markdown links in these files point to real files:

- `CLAUDE.md`
- `docs/architecture/architecture.md`
- `README.md`

### 5. Repository Structure is Current

- Does `architecture.md`'s repository structure tree match the actual `sites/` directory?
- Are all packages listed?

## How to Fix Issues

1. Read the actual source code to understand current behavior
2. Update the documentation to match reality
3. Keep the instructional tone — explain HOW and WHY, not just WHAT
4. Do NOT add hardcoded numbers (file counts, test counts, version numbers) — these go stale immediately
5. Commit documentation fixes alongside any code changes

## Report

After checking, report:

- Which docs were verified as accurate
- Which docs were updated (and what changed)
- Any broken links found and fixed
- Any new systems or patterns that need documentation
