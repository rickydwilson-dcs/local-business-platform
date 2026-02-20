import nextPlugin from "@next/eslint-plugin-next";
import tsPlugin from "@typescript-eslint/eslint-plugin";
import tsParser from "@typescript-eslint/parser";
import reactPlugin from "eslint-plugin-react";
import reactHooksPlugin from "eslint-plugin-react-hooks";

export default [
  {
    ignores: [
      "node_modules/**",
      ".next/**",
      "out/**",
      "build/**",
      "next-env.d.ts",
      "scripts/**",
      "**/*.d.ts",
    ],
  },
  {
    files: ["**/*.{js,jsx,ts,tsx}"],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    plugins: {
      "@next/next": nextPlugin,
      "@typescript-eslint": tsPlugin,
      react: reactPlugin,
      "react-hooks": reactHooksPlugin,
    },
    rules: {
      ...nextPlugin.configs.recommended.rules,
      ...nextPlugin.configs["core-web-vitals"].rules,
      "react-hooks/rules-of-hooks": "error",
      "react-hooks/exhaustive-deps": "warn",
      "@typescript-eslint/no-unused-vars": [
        "warn",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
      ],
      "@typescript-eslint/no-explicit-any": "warn",
      // Enforce named exports - codebase standard
      "no-restricted-syntax": [
        "error",
        {
          selector: "ExportDefaultDeclaration",
          message:
            "Default exports are not allowed. Use named exports instead (e.g., 'export function ComponentName' or 'export { ComponentName }').",
        },
      ],
    },
    settings: {
      react: {
        version: "detect",
      },
    },
  },
  // Override for Next.js special files that REQUIRE default exports
  {
    files: [
      "app/**/page.tsx",
      "app/**/page-old.tsx", // Backup files with page structure
      "app/**/layout.tsx",
      "app/**/loading.tsx",
      "app/**/error.tsx",
      "app/**/not-found.tsx",
      "app/**/template.tsx",
      "app/**/default.tsx",
      "app/sitemap.ts",
      "app/**/sitemap.ts",
      "app/robots.ts",
      "app/manifest.ts",
      "middleware.ts",
      "next.config.ts",
      "next.config.mjs",
      "next.config.js",
      "tailwind.config.ts",
      "tailwind.config.js",
      "postcss.config.mjs",
      "postcss.config.js",
      "vitest.config.ts",
      "playwright.config.ts",
      "mdx-components.tsx",
    ],
    rules: {
      "no-restricted-syntax": "off",
    },
  },
];
