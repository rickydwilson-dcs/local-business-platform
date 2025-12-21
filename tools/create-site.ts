#!/usr/bin/env npx ts-node

/**
 * Create New Site Script
 *
 * Creates a new site by copying from base-template and customizing:
 * - Site name and configuration
 * - Theme colors
 * - Business information
 *
 * Usage:
 *   npx ts-node tools/create-site.ts <site-name>
 *
 * Example:
 *   npx ts-node tools/create-site.ts joes-electrical-brighton
 */

import * as fs from "fs";
import * as path from "path";
import * as readline from "readline";

const MONOREPO_ROOT = path.resolve(__dirname, "..");
const SITES_DIR = path.join(MONOREPO_ROOT, "sites");
const BASE_TEMPLATE_DIR = path.join(SITES_DIR, "base-template");

// Files to copy from base-template
const FILES_TO_COPY = [
  "app",
  "components",
  "content",
  "lib",
  "public",
  "test",
  ".env.example",
  ".eslintrc.json",
  ".gitignore",
  ".prettierrc",
  "middleware.ts",
  "next.config.ts",
  "package.json",
  "postcss.config.js",
  "site.config.ts",
  "tailwind.config.ts",
  "theme.config.ts",
  "tsconfig.json",
  "vitest.config.ts",
];

// Files to exclude from copy
const EXCLUDE_PATTERNS = ["node_modules", ".next", "dist", ".turbo", ".env.local", "*.log"];

interface SiteConfig {
  siteName: string;
  businessName: string;
  businessPhone: string;
  businessEmail: string;
  primaryColor: string;
  primaryHoverColor: string;
  secondaryColor: string;
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function copyRecursive(src: string, dest: string): void {
  const stat = fs.statSync(src);

  if (stat.isDirectory()) {
    fs.mkdirSync(dest, { recursive: true });
    for (const item of fs.readdirSync(src)) {
      // Skip excluded patterns
      if (EXCLUDE_PATTERNS.some((pattern) => item.match(pattern.replace("*", ".*")))) {
        continue;
      }
      copyRecursive(path.join(src, item), path.join(dest, item));
    }
  } else {
    fs.copyFileSync(src, dest);
  }
}

function updatePackageJson(sitePath: string, siteName: string): void {
  const packageJsonPath = path.join(sitePath, "package.json");
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf-8"));

  packageJson.name = siteName;
  packageJson.version = "0.1.0";

  fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2) + "\n");
  console.log(`  ✓ Updated package.json with name: ${siteName}`);
}

function updateSiteConfig(sitePath: string, config: SiteConfig): void {
  const siteConfigPath = path.join(sitePath, "site.config.ts");
  let content = fs.readFileSync(siteConfigPath, "utf-8");

  // Replace placeholder values
  content = content.replace(/name: ["'].*["']/g, `name: "${config.businessName}"`);
  content = content.replace(/phone: ["'].*["']/g, `phone: "${config.businessPhone}"`);
  content = content.replace(/email: ["'].*["']/g, `email: "${config.businessEmail}"`);

  fs.writeFileSync(siteConfigPath, content);
  console.log(`  ✓ Updated site.config.ts with business information`);
}

function updateThemeConfig(sitePath: string, config: SiteConfig): void {
  const themeConfigPath = path.join(sitePath, "theme.config.ts");
  let content = fs.readFileSync(themeConfigPath, "utf-8");

  // Replace color values
  content = content.replace(
    /primary: ['"]#[0-9a-fA-F]{6}['"]/,
    `primary: '${config.primaryColor}'`
  );
  content = content.replace(
    /primaryHover: ['"]#[0-9a-fA-F]{6}['"]/,
    `primaryHover: '${config.primaryHoverColor}'`
  );
  content = content.replace(
    /secondary: ['"]#[0-9a-fA-F]{6}['"]/,
    `secondary: '${config.secondaryColor}'`
  );

  fs.writeFileSync(themeConfigPath, content);
  console.log(`  ✓ Updated theme.config.ts with brand colors`);
}

function createReadme(sitePath: string, siteName: string, businessName: string): void {
  const readmePath = path.join(sitePath, "README.md");
  const content = `# ${businessName}

Website for ${businessName}, built on the Local Business Platform.

## Getting Started

\`\`\`bash
# Install dependencies
pnpm install

# Start development server
pnpm dev

# Build for production
pnpm build
\`\`\`

## Configuration

- \`site.config.ts\` - Business information and settings
- \`theme.config.ts\` - Brand colors and styling
- \`content/\` - MDX content files

## Documentation

See the main [platform documentation](../../docs/) for more information.
`;

  fs.writeFileSync(readmePath, content);
  console.log(`  ✓ Created README.md`);
}

async function prompt(question: string, defaultValue?: string): Promise<string> {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise((resolve) => {
    const displayQuestion = defaultValue ? `${question} (${defaultValue}): ` : `${question}: `;
    rl.question(displayQuestion, (answer) => {
      rl.close();
      resolve(answer.trim() || defaultValue || "");
    });
  });
}

async function main() {
  const args = process.argv.slice(2);

  if (args.length === 0) {
    console.error("Usage: npx ts-node tools/create-site.ts <site-name>");
    console.error("Example: npx ts-node tools/create-site.ts joes-electrical-brighton");
    process.exit(1);
  }

  const siteName = slugify(args[0]);
  const siteDir = path.join(SITES_DIR, siteName);

  // Check if base-template exists
  if (!fs.existsSync(BASE_TEMPLATE_DIR)) {
    console.error("Error: base-template directory not found at", BASE_TEMPLATE_DIR);
    process.exit(1);
  }

  // Check if site already exists
  if (fs.existsSync(siteDir)) {
    console.error(`Error: Site '${siteName}' already exists at ${siteDir}`);
    process.exit(1);
  }

  console.log(`\n🚀 Creating new site: ${siteName}\n`);

  // Gather configuration
  console.log("Please provide the following information:\n");

  const businessName = await prompt(
    "Business name",
    siteName.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())
  );
  const businessPhone = await prompt("Phone number", "01234 567890");
  const businessEmail = await prompt("Email", `info@${siteName}.example.com`);
  const primaryColor = await prompt("Primary color (hex)", "#3b82f6");
  const primaryHoverColor = await prompt("Primary hover color (hex)", "#2563eb");
  const secondaryColor = await prompt("Secondary color (hex)", "#1e40af");

  const config: SiteConfig = {
    siteName,
    businessName,
    businessPhone,
    businessEmail,
    primaryColor,
    primaryHoverColor,
    secondaryColor,
  };

  console.log(`\n📁 Creating site directory: ${siteDir}\n`);

  // Create site directory
  fs.mkdirSync(siteDir, { recursive: true });

  // Copy files from base-template
  for (const item of FILES_TO_COPY) {
    const srcPath = path.join(BASE_TEMPLATE_DIR, item);
    const destPath = path.join(siteDir, item);

    if (fs.existsSync(srcPath)) {
      console.log(`  📄 Copying ${item}...`);
      copyRecursive(srcPath, destPath);
    }
  }

  console.log("\n⚙️  Customizing configuration...\n");

  // Update configuration files
  updatePackageJson(siteDir, siteName);
  updateSiteConfig(siteDir, config);
  updateThemeConfig(siteDir, config);
  createReadme(siteDir, siteName, businessName);

  console.log(`
✅ Site created successfully!

Next steps:
1. cd sites/${siteName}
2. pnpm install
3. pnpm dev

To customize further:
- Edit content in content/services/ and content/locations/
- Update site.config.ts with full business details
- Adjust theme.config.ts for brand-specific styling
`);
}

main().catch(console.error);
