# CQ-007 Implementation Plan (Codex)

## 1. Confirm baseline and lock scope

1. Verify branch is `develop` and capture current violation counts in target files.
2. Confirm non-goals remain untouched: `sites/showcase/**`, star rating `text-gray-200` in `sites/*/app/projects/page.tsx`, and semantic callout box colors.
3. Record baseline lint status before edits.

Files: none modified.

Verification gate:

- `git branch --show-current` is `develop`.
- `grep -c 'text-gray-\|bg-gray-\|border-gray-' sites/colossus-scaffolding/app/privacy-policy/page.tsx`
- `grep -c 'text-gray-\|bg-gray-\|border-gray-' sites/colossus-scaffolding/app/cookie-policy/page.tsx`

## 2. Replace hardcoded neutral colors in colossus policy pages

1. Update both colossus policy pages to remove hardcoded neutral utilities and replace with theme tokens.
2. Keep semantic callout sections (`bg-blue-*`, `bg-green-*`, `bg-purple-*`, `bg-orange-*`, matching borders/text) unchanged for now.
3. Keep page structure/content unchanged; this is a styling-token migration only.

Files modified:

- `sites/colossus-scaffolding/app/privacy-policy/page.tsx`
- `sites/colossus-scaffolding/app/cookie-policy/page.tsx`

Token mapping to apply:

- `bg-white` -> `bg-surface-background`
- `text-gray-900` -> `text-surface-foreground`
- `text-gray-700` -> `text-surface-foreground`
- `text-gray-600` -> `text-surface-muted-foreground`
- `bg-gray-100` -> `bg-surface-muted`
- `bg-gray-50` -> `bg-surface-subtle`
- `border-gray-300` -> `border-surface-border`
- `border-gray-200` -> `border-surface-border`

Table styling rule:

- Table wrapper/border/header/cell neutrals all move to `border-surface-border` and `bg-surface-subtle` to preserve hierarchy and dark-mode compatibility.

Verification gate:

- `grep -c 'text-gray-\|bg-gray-\|border-gray-'` returns `0` for both target files.
- `rg -n 'text-gray-|bg-gray-|border-gray-' sites/colossus-scaffolding/app/{privacy-policy,cookie-policy}/page.tsx` returns no matches.

## 3. Add defensive ESLint rule for site code

1. Add a local custom ESLint rule (no new dependency) that inspects JSX `className` string literals/template chunks and flags forbidden Tailwind color-scale classes.
2. Wire this rule into site ESLint configs so it runs under existing `pnpm lint` (Turbo workspace lint).
3. Avoid `no-restricted-syntax` for this rule because colossus disables that rule for Next special files; use a separate rule key so policy pages are still checked.

Files created:

- `tools/eslint/rules/no-hardcoded-tailwind-colors.mjs`

Files modified:

- `sites/base-template/eslint.config.mjs`
- `sites/dj-fox-electrical/eslint.config.mjs`
- `sites/colossus-scaffolding/eslint.config.mjs`

Rule behavior:

- Scope: apply to `sites/*/app/**/*.tsx` (and optionally `components/**/*.tsx` under sites for future-proofing).
- Ban classes matching hardcoded Tailwind palette scales, at minimum neutral classes:
  - `text-gray-[0-9]+`, `bg-gray-[0-9]+`, `border-gray-[0-9]+`
- Expand to broader palette scales except approved cases (recommended):
  - ban `(text|bg|border)-(slate|zinc|neutral|stone|gray|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)-[0-9]+`
- Allowlist/exception handling:
  - Permit explicit semantic callout patterns in policy pages (blue/green/purple/orange blocks) via either:
    - narrow path-aware allowlist in rule for `app/privacy-policy/page.tsx` and `app/cookie-policy/page.tsx`, or
    - targeted `eslint-disable-next-line platform/no-hardcoded-tailwind-colors` above those specific callout lines.
  - Permit `text-gray-200` only in `sites/*/app/projects/page.tsx` (star-rating UI exception).
  - Keep default ESLint escape hatch available for legitimate one-offs.

Verification gate:

- `pnpm lint` passes after rule integration.
- Rule triggers in target scope on an injected violation.

## 4. Prove CI behavior and escape hatch

1. Add a temporary violation in `sites/base-template/app/privacy-policy/page.tsx` such as `text-gray-500`, run lint, verify failure message references new rule, then revert.
2. Add temporary `// eslint-disable-next-line platform/no-hardcoded-tailwind-colors` above the same line, verify lint passes, then revert both changes.
3. Confirm no unintended failures in non-goal paths.

Files modified temporarily, then reverted:

- `sites/base-template/app/privacy-policy/page.tsx` (or equivalent app TSX file)

Verification gate:

- `pnpm lint` fails without disable comment, passes with disable comment.
- `pnpm lint` final run passes with clean working changes.

## 5. Visual/regression verification

1. Run targeted build/lint and a quick runtime check for colossus pages.
2. Compare before/after structure and readability, especially in dark-surface contexts and table contrast.

Files: none required.

Verification gate:

- `pnpm --filter colossus-scaffolding build` succeeds (or equivalent app build check).
- Manual check of `/privacy-policy` and `/cookie-policy` confirms readable text, visible borders, and intact callout emphasis.

## 6. Risks and trade-offs

1. **Rule strictness vs false positives**: broad palette bans are safer long term but can catch intentional accents.
   - Mitigation: narrow allowlist + explicit inline escape hatch.
2. **Config drift across sites**: each site has its own ESLint config; inconsistent updates can weaken enforcement.
   - Mitigation: centralize rule implementation in one shared local file and import it in all site configs.
3. **`no-restricted-syntax` conflict in colossus**: existing override disables it for `app/**/page.tsx`.
   - Mitigation: custom namespaced rule (`platform/no-hardcoded-tailwind-colors`) independent of `no-restricted-syntax`.
4. **Visual regression risk in dense legal tables**: token swaps can subtly change contrast.
   - Mitigation: explicit table token mapping + manual page check after build.
