# Remaining Manual Changes for ESLint and Theme Tests

**Date:** 2025-12-21
**Status:** Manual application required

## Files Successfully Created

1. `/packages/theme-system/src/__tests__/validate.test.ts` - Theme validation tests
2. `/packages/theme-system/src/__tests__/generate-css.test.ts` - CSS generation tests
3. `/packages/theme-system/src/__tests__/utils.test.ts` - Utility function tests
4. `/packages/theme-system/vitest.config.ts` - Vitest configuration

## Files Requiring Manual Updates

### 1. `/packages/core-components/eslint.config.mjs`

Add the `no-restricted-syntax` rule to the rules section:

```javascript
rules: {
  "react-hooks/rules-of-hooks": "error",
  "react-hooks/exhaustive-deps": "warn",
  "@typescript-eslint/no-unused-vars": [
    "warn",
    { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
  ],
  "@typescript-eslint/no-explicit-any": "warn",
  "react/jsx-key": "error",
  // ADD THIS NEW RULE:
  "no-restricted-syntax": [
    "error",
    {
      selector: "Literal[value=/^#[0-9a-fA-F]{3,8}$/]",
      message: "Raw hex colors are forbidden. Use CSS variables via Tailwind classes (e.g., bg-brand-primary) or theme tokens.",
    },
    {
      selector: "TemplateElement[value.raw=/^#[0-9a-fA-F]{3,8}$/]",
      message: "Raw hex colors are forbidden in template literals. Use CSS variables via Tailwind classes (e.g., bg-brand-primary) or theme tokens.",
    },
  ],
},
```

### 2. `/packages/theme-system/package.json`

Add test scripts and dependencies:

**Add to "scripts" section:**

```json
"test": "vitest run",
"test:watch": "vitest",
"test:coverage": "vitest run --coverage"
```

**Add to "devDependencies" section:**

```json
"@vitest/coverage-v8": "^1.0.0",
"vitest": "^1.0.0"
```

Complete updated package.json:

```json
{
  "name": "@platform/theme-system",
  "version": "1.0.0",
  "description": "Comprehensive theming system with design tokens and Tailwind integration",
  "main": "dist/index.js",
  "types": "dist/index.d.ts",
  "exports": {
    ".": {
      "types": "./dist/index.d.ts",
      "default": "./dist/index.js"
    },
    "./plugin": {
      "types": "./dist/tailwind-plugin.d.ts",
      "default": "./dist/tailwind-plugin.js"
    }
  },
  "scripts": {
    "build": "tsc",
    "validate": "ts-node src/cli/validate.ts",
    "type-check": "tsc --noEmit",
    "clean": "rm -rf dist",
    "test": "vitest run",
    "test:watch": "vitest",
    "test:coverage": "vitest run --coverage"
  },
  "dependencies": {
    "zod": "^3.22.0"
  },
  "peerDependencies": {
    "tailwindcss": "^3.4.0"
  },
  "devDependencies": {
    "@types/node": "^20.0.0",
    "@vitest/coverage-v8": "^1.0.0",
    "typescript": "^5.0.0",
    "ts-node": "^10.9.0",
    "vitest": "^1.0.0"
  },
  "keywords": ["theme", "design-tokens", "tailwind", "css-variables", "theming"],
  "license": "MIT"
}
```

## Installation and Testing Steps

After applying the manual changes above:

```bash
# Navigate to theme-system package
cd /Users/rickywilson/Library/CloudStorage/GoogleDrive-rickydwilson@gmail.com/My\ Drive/Websites/GitHub/local-business-platform/packages/theme-system

# Install new dependencies
pnpm install

# Run tests
pnpm test

# Run tests with coverage
pnpm test:coverage

# Run tests in watch mode (for development)
pnpm test:watch
```

## Verify ESLint Rule

```bash
# Navigate to core-components
cd /Users/rickywilson/Library/CloudStorage/GoogleDrive-rickydwilson@gmail.com/My\ Drive/Websites/GitHub/local-business-platform/packages/core-components

# Run linter to verify rule is active
pnpm lint

# Test the rule by creating a file with a hex color (should error)
echo "const color = '#ff0000';" > test-hex.ts
pnpm lint test-hex.ts
# Should show: "Raw hex colors are forbidden..."
rm test-hex.ts
```

## Expected Test Results

When you run `pnpm test` in theme-system, you should see:

```
 ✓ src/__tests__/validate.test.ts (6 tests)
 ✓ src/__tests__/generate-css.test.ts (9 tests)
 ✓ src/__tests__/utils.test.ts (20 tests)

Test Files  3 passed (3)
Tests  35 passed (35)
```

## Expected Coverage

Running `pnpm test:coverage` should show:

- `src/cli/validate.ts`: 90-100%
- `src/generate-css.ts`: 90-100%
- `src/utils.ts`: 100%
- Overall: >90%

## Next Steps

1. Apply manual changes to:
   - `packages/core-components/eslint.config.mjs`
   - `packages/theme-system/package.json`

2. Run installation:

   ```bash
   cd packages/theme-system
   pnpm install
   ```

3. Run tests:

   ```bash
   pnpm test
   pnpm test:coverage
   ```

4. Verify ESLint rule:

   ```bash
   cd packages/core-components
   pnpm lint
   ```

5. Update CHANGELOG.md with these changes

6. Commit following git workflow (develop branch)

---

**Status:** 4 test files created, 2 configuration files need manual updates
**Test Coverage Target:** >90%
**Expected Test Count:** 35 tests
