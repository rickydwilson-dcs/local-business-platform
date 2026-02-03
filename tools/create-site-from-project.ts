#!/usr/bin/env npx tsx
/**
 * Create Site from Project File
 *
 * Generates a complete site from a standardized project file.
 * Uses the ProjectFile schema from @platform/intake-system for validation.
 *
 * Usage:
 *   npx tsx tools/create-site-from-project.ts --project ./project.json
 *   npx tsx tools/create-site-from-project.ts --project ./project.json --dry-run
 *   npx tsx tools/create-site-from-project.ts --project ./project.json --skip-content
 *   npx tsx tools/create-site-from-project.ts --project ./project.json --force
 */

import * as fs from "fs";
import * as path from "path";

// Import directly from source to ensure compatibility without building the package
import {
  safeValidateProjectFile,
  type ProjectFile,
} from "../packages/intake-system/src/schemas/project-file.schema";

// ============================================================================
// Constants
// ============================================================================

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
  "mdx-components.tsx",
  "middleware.ts",
  "next.config.ts",
  "package.json",
  "postcss.config.js",
  "tailwind.config.ts",
  "tsconfig.json",
  "vitest.config.ts",
];

// Files to exclude from copy (exact match or glob patterns)
const EXCLUDE_PATTERNS = ["node_modules", ".next", "dist", ".turbo", ".env.local"];
const EXCLUDE_EXTENSIONS = [".log"];

// ============================================================================
// Types
// ============================================================================

interface CLIOptions {
  project: string;
  dryRun: boolean;
  skipContent: boolean;
  force: boolean;
}

interface GenerationManifest {
  generatedAt: string;
  projectId: string;
  siteName: string;
  version: string;
  source: {
    projectFile: string;
    baseTemplate: string;
  };
  files: {
    created: string[];
    modified: string[];
  };
  config: {
    siteConfig: boolean;
    themeConfig: boolean;
    packageJson: boolean;
  };
  content: {
    skipped: boolean;
    servicesCount: number;
    locationsCount: number;
    regionsCount: number;
  };
}

// ============================================================================
// Utility Functions
// ============================================================================

function parseArgs(): CLIOptions {
  const args = process.argv.slice(2);
  const options: CLIOptions = {
    project: "",
    dryRun: false,
    skipContent: false,
    force: false,
  };

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    switch (arg) {
      case "--project":
      case "-p":
        options.project = args[++i] || "";
        break;
      case "--dry-run":
      case "-n":
        options.dryRun = true;
        break;
      case "--skip-content":
      case "-s":
        options.skipContent = true;
        break;
      case "--force":
      case "-f":
        options.force = true;
        break;
      case "--help":
      case "-h":
        printUsage();
        process.exit(0);
      default:
        if (arg.startsWith("-")) {
          console.error(`Unknown option: ${arg}`);
          printUsage();
          process.exit(1);
        }
    }
  }

  return options;
}

function printUsage(): void {
  console.log(`
Create Site from Project File

Usage:
  npx tsx tools/create-site-from-project.ts --project <path> [options]

Options:
  --project, -p <path>  Path to project file JSON (required)
  --dry-run, -n         Preview without writing files
  --skip-content, -s    Skip MDX content generation (just configs)
  --force, -f           Overwrite existing site directory
  --help, -h            Show this help message

Examples:
  npx tsx tools/create-site-from-project.ts --project ./my-project.json
  npx tsx tools/create-site-from-project.ts --project ./project.json --dry-run
  npx tsx tools/create-site-from-project.ts -p ./project.json -f -s
`);
}

function copyRecursive(src: string, dest: string): string[] {
  const copiedFiles: string[] = [];
  const stat = fs.statSync(src);

  if (stat.isDirectory()) {
    fs.mkdirSync(dest, { recursive: true });
    for (const item of fs.readdirSync(src)) {
      // Skip excluded directories/files (exact match)
      if (EXCLUDE_PATTERNS.includes(item)) {
        continue;
      }
      // Skip excluded extensions
      if (EXCLUDE_EXTENSIONS.some((ext) => item.endsWith(ext))) {
        continue;
      }
      const subFiles = copyRecursive(path.join(src, item), path.join(dest, item));
      copiedFiles.push(...subFiles);
    }
  } else {
    fs.copyFileSync(src, dest);
    copiedFiles.push(dest);
  }

  return copiedFiles;
}

function formatHours(project: ProjectFile): Record<string, string> {
  const defaultHours: Record<string, string> = {
    monday: "9:00 AM - 5:00 PM",
    tuesday: "9:00 AM - 5:00 PM",
    wednesday: "9:00 AM - 5:00 PM",
    thursday: "9:00 AM - 5:00 PM",
    friday: "9:00 AM - 5:00 PM",
    saturday: "Closed",
    sunday: "Closed",
  };

  if (!project.business.hours?.regular) {
    return defaultHours;
  }

  const hours: Record<string, string> = {};
  for (const dayHours of project.business.hours.regular) {
    const day = dayHours.day.toLowerCase();
    if (!dayHours.isOpen) {
      hours[day] = "Closed";
    } else if (dayHours.displayText) {
      hours[day] = dayHours.displayText;
    } else if (dayHours.slots && dayHours.slots.length > 0) {
      // Format time slots
      const formattedSlots = dayHours.slots.map((slot) => {
        const open = formatTime(slot.open);
        const close = formatTime(slot.close);
        return `${open} - ${close}`;
      });
      hours[day] = formattedSlots.join(", ");
    } else {
      hours[day] = "Open";
    }
  }

  // Fill in missing days with default
  for (const day of Object.keys(defaultHours)) {
    if (!hours[day]) {
      hours[day] = defaultHours[day];
    }
  }

  return hours;
}

function formatTime(time: string): string {
  // Convert HH:MM to 12-hour format
  const [hours, minutes] = time.split(":").map(Number);
  const period = hours >= 12 ? "PM" : "AM";
  const displayHours = hours % 12 || 12;
  return `${displayHours}:${minutes.toString().padStart(2, "0")} ${period}`;
}

function formatInsurance(project: ProjectFile): { amount: string; type: string } | undefined {
  if (!project.credentials?.insurance || project.credentials.insurance.length === 0) {
    return undefined;
  }

  const primaryInsurance = project.credentials.insurance[0];
  const amount = formatCurrency(primaryInsurance.coverageAmount, primaryInsurance.currency);
  return {
    amount,
    type: primaryInsurance.type,
  };
}

function formatCurrency(amount: number, currency: string = "GBP"): string {
  const symbol = currency === "GBP" ? "£" : currency === "USD" ? "$" : currency;
  if (amount >= 1000000) {
    return `${symbol}${(amount / 1000000).toFixed(0)}M`;
  } else if (amount >= 1000) {
    return `${symbol}${(amount / 1000).toFixed(0)}K`;
  }
  return `${symbol}${amount}`;
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function escapeForSingleQuote(text: string): string {
  return text.replace(/'/g, "\\'");
}

// ============================================================================
// Site Config Generation
// ============================================================================

function generateSiteConfig(project: ProjectFile): string {
  const hours = formatHours(project);
  const insurance = formatInsurance(project);

  // Build service areas from regions
  const serviceAreas = project.regions.map((r) => r.name);

  // Build service area regions with locations
  const serviceAreaRegions = project.regions.map((region) => ({
    name: region.name,
    slug: region.slug || slugify(region.name),
    towns: region.locations.map((loc) => ({
      name: loc.name,
      slug: loc.slug,
    })),
  }));

  // Build services list
  const services = project.services
    .filter((s) => s.includeInGeneration !== false)
    .map((s) => ({
      title: s.title,
      slug: s.slug,
      description: s.shortDescription || `Professional ${s.title.toLowerCase()} services.`,
    }));

  // Build certifications
  const certifications = (project.credentials?.certifications || []).map((cert) => ({
    name: cert.name,
    description: cert.issuedBy || "Industry certification",
  }));

  // Build stats
  const yearEstablished = project.credentials?.yearEstablished?.toString() || "2020";
  const yearsExperience = new Date().getFullYear() - (project.credentials?.yearEstablished || 2020);

  const stats = [
    {
      value: `${yearsExperience}+`,
      label: "Years Experience",
      description: "Serving local customers",
    },
    { value: "500+", label: "Projects Completed", description: "Satisfied clients" },
    { value: "100%", label: "Satisfaction", description: "Customer focused" },
    {
      value: project.business.hours?.emergency24h ? "24/7" : "Fast",
      label: project.business.hours?.emergency24h ? "Emergency Service" : "Response",
      description: project.business.hours?.emergency24h ? "Always available" : "Quick turnaround",
    },
  ];

  // Build features from deployment config
  const features = {
    analytics: !!project.deployment?.gaId || !!project.deployment?.gtmId,
    consentBanner: !!project.deployment?.gaId || !!project.deployment?.gtmId,
    contactForm: project.deployment?.features?.contactForm ?? true,
    rateLimit: true,
    testimonials: project.deployment?.features?.reviews ?? true,
    blog: project.deployment?.features?.blog ?? false,
  };

  // Determine business type for schema.org
  const businessType = determineBusinessType(project.business.industry);

  const config = `/**
 * ${project.business.name} - Site Configuration
 *
 * Generated from project file: ${project.metadata.projectId}
 * Generated at: ${new Date().toISOString()}
 */

export interface NavItem {
  label: string;
  href: string;
  hasDropdown?: boolean;
}

export interface CTAConfig {
  primary: {
    label: string;
    href: string;
  };
  phone: {
    show: boolean;
    label?: string;
  };
}

export interface FooterConfig {
  showServices: boolean;
  showLocations: boolean;
  maxServices: number;
  maxLocations: number;
  copyright: string;
  builtBy?: {
    name: string;
    url: string;
  };
}

export interface CredentialStat {
  value: string;
  label: string;
  description?: string;
}

export interface Certification {
  name: string;
  description: string;
  icon?: string;
}

export interface CredentialsConfig {
  yearEstablished: string;
  stats: CredentialStat[];
  certifications: Certification[];
  insurance?: {
    amount: string;
    type: string;
  };
}

export interface ServiceAreaRegion {
  name: string;
  slug: string;
  towns: Array<{ name: string; slug: string }>;
}

export interface SiteConfig {
  /** Site name and branding */
  name: string;
  tagline: string;
  url: string;

  /** Business information */
  business: {
    name: string;
    legalName: string;
    type: 'LocalBusiness' | 'ProfessionalService' | 'HomeAndConstructionBusiness';
    phone: string;
    email: string;
    address: {
      street: string;
      city: string;
      region: string;
      postalCode: string;
      country: string;
    };
    hours: {
      monday: string;
      tuesday: string;
      wednesday: string;
      thursday: string;
      friday: string;
      saturday: string;
      sunday: string;
    };
    socialMedia: {
      facebook?: string;
      twitter?: string;
      instagram?: string;
      linkedin?: string;
    };
    geo?: {
      latitude: number;
      longitude: number;
    };
  };

  /** Navigation configuration */
  navigation: {
    main: NavItem[];
  };

  /** Call-to-action configuration */
  cta: CTAConfig;

  /** Footer configuration */
  footer: FooterConfig;

  /** Credentials and accreditations */
  credentials: CredentialsConfig;

  /** Service areas */
  serviceAreas: string[];

  /** Service area regions for dropdown navigation (optional) */
  serviceAreaRegions?: ServiceAreaRegion[];

  /** Featured services */
  services: {
    title: string;
    slug: string;
    description: string;
  }[];

  /** Feature flags */
  features: {
    analytics: boolean;
    consentBanner: boolean;
    contactForm: boolean;
    rateLimit: boolean;
    testimonials: boolean;
    blog: boolean;
  };
}

export const siteConfig: SiteConfig = {
  name: ${JSON.stringify(project.business.name)},
  tagline: ${JSON.stringify(project.brandVoice?.tagline || `Professional ${project.business.industry} services`)},
  url: process.env.NEXT_PUBLIC_SITE_URL || ${JSON.stringify(project.deployment?.domain ? `https://${project.deployment.domain}` : "http://localhost:3000")},

  business: {
    name: ${JSON.stringify(project.business.name)},
    legalName: ${JSON.stringify(project.business.legalName || project.business.name)},
    type: ${JSON.stringify(businessType)},
    phone: ${JSON.stringify(project.business.phone)},
    email: ${JSON.stringify(project.business.email)},
    address: {
      street: ${JSON.stringify(project.business.address?.line1 || "123 Main Street")},
      city: ${JSON.stringify(project.business.address?.city || "City Name")},
      region: ${JSON.stringify(project.business.address?.county || "County")},
      postalCode: ${JSON.stringify(project.business.address?.postcode || "AB12 3CD")},
      country: ${JSON.stringify(project.business.address?.country || "United Kingdom")},
    },
    hours: {
      monday: ${JSON.stringify(hours.monday)},
      tuesday: ${JSON.stringify(hours.tuesday)},
      wednesday: ${JSON.stringify(hours.wednesday)},
      thursday: ${JSON.stringify(hours.thursday)},
      friday: ${JSON.stringify(hours.friday)},
      saturday: ${JSON.stringify(hours.saturday)},
      sunday: ${JSON.stringify(hours.sunday)},
    },
    socialMedia: {
      ${project.business.socialMedia?.facebook ? `facebook: ${JSON.stringify(project.business.socialMedia.facebook)},` : ""}
      ${project.business.socialMedia?.twitter ? `twitter: ${JSON.stringify(project.business.socialMedia.twitter)},` : ""}
      ${project.business.socialMedia?.instagram ? `instagram: ${JSON.stringify(project.business.socialMedia.instagram)},` : ""}
      ${project.business.socialMedia?.linkedin ? `linkedin: ${JSON.stringify(project.business.socialMedia.linkedin)},` : ""}
    },
    ${
      project.business.geo?.headquarters
        ? `geo: {
      latitude: ${project.business.geo.headquarters.latitude},
      longitude: ${project.business.geo.headquarters.longitude},
    },`
        : ""
    }
  },

  navigation: {
    main: [
      { label: 'Services', href: '/services' },
      { label: 'Locations', href: '/locations', hasDropdown: true },
      { label: 'About', href: '/about' },
      { label: 'Contact', href: '/contact' },
    ],
  },

  cta: {
    primary: {
      label: ${JSON.stringify(project.pricing?.freeQuote !== false ? "Get Free Quote" : "Contact Us")},
      href: '/contact',
    },
    phone: {
      show: true,
      label: 'Call Us',
    },
  },

  footer: {
    showServices: true,
    showLocations: true,
    maxServices: 10,
    maxLocations: 12,
    copyright: '${new Date().getFullYear()} ${escapeForSingleQuote(project.business.name)}. All rights reserved.',
    builtBy: {
      name: 'Digital Consulting Services',
      url: 'https://www.digitalconsultingservices.co.uk',
    },
  },

  credentials: {
    yearEstablished: ${JSON.stringify(yearEstablished)},
    stats: ${JSON.stringify(stats, null, 6).replace(/\n/g, "\n    ")},
    certifications: ${JSON.stringify(certifications, null, 6).replace(/\n/g, "\n    ")},
    ${insurance ? `insurance: ${JSON.stringify(insurance)},` : ""}
  },

  serviceAreas: ${JSON.stringify(serviceAreas)},

  ${serviceAreaRegions.length > 0 ? `serviceAreaRegions: ${JSON.stringify(serviceAreaRegions, null, 4).replace(/\n/g, "\n  ")},` : ""}

  services: ${JSON.stringify(services, null, 4).replace(/\n/g, "\n  ")},

  features: ${JSON.stringify(features, null, 4).replace(/\n/g, "\n  ")},
};
`;

  return config;
}

function determineBusinessType(
  industry: string
): "LocalBusiness" | "ProfessionalService" | "HomeAndConstructionBusiness" {
  const constructionIndustries = [
    "scaffolding",
    "construction",
    "roofing",
    "plumbing",
    "electrical",
    "hvac",
    "building",
    "renovation",
    "remodeling",
  ];

  const professionalServices = [
    "consulting",
    "accounting",
    "legal",
    "financial",
    "marketing",
    "design",
  ];

  const lowerIndustry = industry.toLowerCase();

  if (constructionIndustries.some((ci) => lowerIndustry.includes(ci))) {
    return "HomeAndConstructionBusiness";
  }

  if (professionalServices.some((ps) => lowerIndustry.includes(ps))) {
    return "ProfessionalService";
  }

  return "LocalBusiness";
}

// ============================================================================
// Theme Config Generation
// ============================================================================

function generateThemeConfig(project: ProjectFile): string {
  const theme = project.theme;

  // Default theme values
  const defaultColors = {
    brand: {
      primary: "#3b82f6",
      primaryHover: "#2563eb",
      secondary: "#1e40af",
      accent: "#f59e0b",
    },
    surface: {
      background: "#ffffff",
      foreground: "#1f2937",
      muted: "#f3f4f6",
      mutedForeground: "#6b7280",
      card: "#ffffff",
      cardBorder: "#e5e7eb",
    },
    semantic: {
      success: "#10b981",
      warning: "#f59e0b",
      error: "#ef4444",
      info: "#3b82f6",
    },
  };

  // Merge with project theme
  const colors = {
    brand: {
      primary: theme?.colors?.brand?.primary || defaultColors.brand.primary,
      primaryHover: deriveHoverColor(theme?.colors?.brand?.primary || defaultColors.brand.primary),
      secondary: theme?.colors?.brand?.secondary || defaultColors.brand.secondary,
      accent: theme?.colors?.brand?.accent || defaultColors.brand.accent,
    },
    surface: {
      background: theme?.colors?.surface?.background || defaultColors.surface.background,
      foreground: theme?.colors?.surface?.foreground || defaultColors.surface.foreground,
      muted: theme?.colors?.surface?.muted || defaultColors.surface.muted,
      mutedForeground: defaultColors.surface.mutedForeground,
      card: theme?.colors?.surface?.card || defaultColors.surface.card,
      cardBorder: defaultColors.surface.cardBorder,
    },
    semantic: defaultColors.semantic,
  };

  // Typography
  const fontFamily = theme?.typography?.fontFamily
    ? [theme.typography.fontFamily, "system-ui", "-apple-system", "sans-serif"]
    : ["Inter", "system-ui", "-apple-system", "sans-serif"];

  const headingFontFamily = theme?.typography?.headingFontFamily
    ? [theme.typography.headingFontFamily, "system-ui", "-apple-system", "sans-serif"]
    : fontFamily;

  // Component styles
  const buttonRadius = theme?.components?.buttonRadius || "0.5rem";
  const cardRadius = theme?.components?.cardRadius || "1rem";

  const config = `import type { DeepPartialThemeConfig } from '@platform/theme-system';

/**
 * ${project.business.name} - Theme Configuration
 *
 * Generated from project file: ${project.metadata.projectId}
 * Generated at: ${new Date().toISOString()}
 */
export const themeConfig: DeepPartialThemeConfig = {
  colors: {
    brand: {
      primary: '${colors.brand.primary}',
      primaryHover: '${colors.brand.primaryHover}',
      secondary: '${colors.brand.secondary}',
      accent: '${colors.brand.accent}',
    },
    surface: {
      background: '${colors.surface.background}',
      foreground: '${colors.surface.foreground}',
      muted: '${colors.surface.muted}',
      mutedForeground: '${colors.surface.mutedForeground}',
      card: '${colors.surface.card}',
      cardBorder: '${colors.surface.cardBorder}',
    },
    semantic: {
      success: '${colors.semantic.success}',
      warning: '${colors.semantic.warning}',
      error: '${colors.semantic.error}',
      info: '${colors.semantic.info}',
    },
  },

  typography: {
    fontFamily: {
      sans: ${JSON.stringify(fontFamily)},
      heading: ${JSON.stringify(headingFontFamily)},
    },
    // Typography scale uses defaults from theme-system
  },

  components: {
    button: {
      borderRadius: '${buttonRadius}',
      fontWeight: 600,
    },
    card: {
      borderRadius: '${cardRadius}',
      shadow: '${theme?.components?.useShadows !== false ? "sm" : "none"}',
    },
    hero: {
      variant: 'centered',
    },
    navigation: {
      style: 'solid',
    },
  },
};
`;

  return config;
}

function deriveHoverColor(hexColor: string): string {
  // Convert hex to RGB, darken by 15%, convert back to hex
  const hex = hexColor.replace("#", "");
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);

  const darkenFactor = 0.85;
  const newR = Math.round(r * darkenFactor);
  const newG = Math.round(g * darkenFactor);
  const newB = Math.round(b * darkenFactor);

  return `#${newR.toString(16).padStart(2, "0")}${newG.toString(16).padStart(2, "0")}${newB.toString(16).padStart(2, "0")}`;
}

// ============================================================================
// Package.json Generation
// ============================================================================

function updatePackageJson(sitePath: string, siteName: string, dryRun: boolean): void {
  const packageJsonPath = path.join(sitePath, "package.json");

  if (dryRun) {
    console.log(`  [DRY RUN] Would update package.json with name: ${siteName}`);
    return;
  }

  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf-8"));
  packageJson.name = siteName;
  packageJson.version = "0.1.0";

  fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2) + "\n");
  console.log(`  Updated package.json with name: ${siteName}`);
}

// ============================================================================
// README Generation
// ============================================================================

function createReadme(sitePath: string, project: ProjectFile, dryRun: boolean): void {
  const readmePath = path.join(sitePath, "README.md");
  const siteName = project.deployment?.siteName || slugify(project.business.name);

  const content = `# ${project.business.name}

Website for ${project.business.name}, built on the Local Business Platform.

## Project Information

- **Project ID:** ${project.metadata.projectId}
- **Industry:** ${project.business.industry}
- **Status:** ${project.metadata.status}
- **Generated:** ${new Date().toISOString()}

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

## Content

- **Services:** ${project.services.length} defined
- **Regions:** ${project.regions.length} coverage areas
- **Locations:** ${project.regions.reduce((acc, r) => acc + r.locations.length, 0)} total locations

## Documentation

See the main [platform documentation](../../docs/) for more information.
`;

  if (dryRun) {
    console.log(`  [DRY RUN] Would create README.md`);
    return;
  }

  fs.writeFileSync(readmePath, content);
  console.log(`  Created README.md`);
}

// ============================================================================
// Manifest Generation
// ============================================================================

function createManifest(
  sitePath: string,
  project: ProjectFile,
  options: CLIOptions,
  createdFiles: string[],
  modifiedFiles: string[]
): GenerationManifest {
  const siteName = project.deployment?.siteName || slugify(project.business.name);

  const manifest: GenerationManifest = {
    generatedAt: new Date().toISOString(),
    projectId: project.metadata.projectId,
    siteName,
    version: project.metadata.version,
    source: {
      projectFile: path.resolve(options.project),
      baseTemplate: BASE_TEMPLATE_DIR,
    },
    files: {
      created: createdFiles.map((f) => path.relative(sitePath, f)),
      modified: modifiedFiles,
    },
    config: {
      siteConfig: true,
      themeConfig: true,
      packageJson: true,
    },
    content: {
      skipped: options.skipContent,
      servicesCount: project.services.filter((s) => s.includeInGeneration !== false).length,
      locationsCount: project.regions.reduce(
        (acc, r) => acc + r.locations.filter((l) => l.includeInGeneration !== false).length,
        0
      ),
      regionsCount: project.regions.length,
    },
  };

  return manifest;
}

// ============================================================================
// Main Function
// ============================================================================

async function main(): Promise<void> {
  const options = parseArgs();

  // Validate required arguments
  if (!options.project) {
    console.error("Error: --project argument is required");
    printUsage();
    process.exit(1);
  }

  console.log("\n========================================");
  console.log("  Create Site from Project File");
  console.log("========================================\n");

  if (options.dryRun) {
    console.log("[DRY RUN MODE - No files will be written]\n");
  }

  // ----------------------------------------
  // Step 1: Load and validate project file
  // ----------------------------------------
  console.log("Step 1: Loading project file...");

  const projectPath = path.resolve(options.project);
  if (!fs.existsSync(projectPath)) {
    console.error(`Error: Project file not found: ${projectPath}`);
    process.exit(1);
  }

  let projectData: unknown;
  try {
    const content = fs.readFileSync(projectPath, "utf-8");
    projectData = JSON.parse(content);
  } catch (error) {
    console.error(`Error: Failed to parse project file as JSON`);
    console.error((error as Error).message);
    process.exit(1);
  }

  // Validate against schema
  console.log("  Validating against ProjectFile schema...");
  const validationResult = safeValidateProjectFile(projectData);

  if (!validationResult.success) {
    console.error("\nValidation failed:");
    for (const issue of validationResult.error.issues) {
      console.error(`  - ${issue.path.join(".")}: ${issue.message}`);
    }
    process.exit(1);
  }

  const project = validationResult.data;
  console.log(`  Project validated: ${project.business.name}`);
  console.log(`  Project ID: ${project.metadata.projectId}`);

  // ----------------------------------------
  // Step 2: Determine site name and directory
  // ----------------------------------------
  const siteName = project.deployment?.siteName || slugify(project.business.name);
  const siteDir = path.join(SITES_DIR, siteName);

  console.log(`\nStep 2: Site configuration`);
  console.log(`  Site name: ${siteName}`);
  console.log(`  Site directory: ${siteDir}`);

  // Check if base-template exists
  if (!fs.existsSync(BASE_TEMPLATE_DIR)) {
    console.error(`Error: base-template directory not found at ${BASE_TEMPLATE_DIR}`);
    process.exit(1);
  }

  // Check if site already exists
  if (fs.existsSync(siteDir)) {
    if (options.force) {
      console.log(`  Site exists - will overwrite (--force specified)`);
      if (!options.dryRun) {
        fs.rmSync(siteDir, { recursive: true, force: true });
      }
    } else {
      console.error(`Error: Site '${siteName}' already exists at ${siteDir}`);
      console.error("Use --force to overwrite");
      process.exit(1);
    }
  }

  // ----------------------------------------
  // Step 3: Copy base template
  // ----------------------------------------
  console.log("\nStep 3: Copying base template...");

  const createdFiles: string[] = [];

  if (!options.dryRun) {
    fs.mkdirSync(siteDir, { recursive: true });

    for (const item of FILES_TO_COPY) {
      const srcPath = path.join(BASE_TEMPLATE_DIR, item);
      const destPath = path.join(siteDir, item);

      if (fs.existsSync(srcPath)) {
        console.log(`  Copying ${item}...`);
        const copied = copyRecursive(srcPath, destPath);
        createdFiles.push(...copied);
      }
    }
  } else {
    for (const item of FILES_TO_COPY) {
      const srcPath = path.join(BASE_TEMPLATE_DIR, item);
      if (fs.existsSync(srcPath)) {
        console.log(`  [DRY RUN] Would copy ${item}`);
      }
    }
  }

  // ----------------------------------------
  // Step 4: Generate site.config.ts
  // ----------------------------------------
  console.log("\nStep 4: Generating site.config.ts...");

  const siteConfigContent = generateSiteConfig(project);
  const siteConfigPath = path.join(siteDir, "site.config.ts");

  if (!options.dryRun) {
    fs.writeFileSync(siteConfigPath, siteConfigContent);
    console.log(`  Generated site.config.ts`);
  } else {
    console.log(`  [DRY RUN] Would generate site.config.ts`);
  }

  // ----------------------------------------
  // Step 5: Generate theme.config.ts
  // ----------------------------------------
  console.log("\nStep 5: Generating theme.config.ts...");

  const themeConfigContent = generateThemeConfig(project);
  const themeConfigPath = path.join(siteDir, "theme.config.ts");

  if (!options.dryRun) {
    fs.writeFileSync(themeConfigPath, themeConfigContent);
    console.log(`  Generated theme.config.ts`);
  } else {
    console.log(`  [DRY RUN] Would generate theme.config.ts`);
  }

  // ----------------------------------------
  // Step 6: Update package.json
  // ----------------------------------------
  console.log("\nStep 6: Updating package.json...");
  updatePackageJson(siteDir, siteName, options.dryRun);

  // ----------------------------------------
  // Step 7: Create README.md
  // ----------------------------------------
  console.log("\nStep 7: Creating README.md...");
  createReadme(siteDir, project, options.dryRun);

  // ----------------------------------------
  // Step 8: Generate manifest
  // ----------------------------------------
  console.log("\nStep 8: Generating manifest...");

  const modifiedFiles = ["site.config.ts", "theme.config.ts", "package.json", "README.md"];
  const manifest = createManifest(siteDir, project, options, createdFiles, modifiedFiles);
  const manifestPath = path.join(siteDir, "generation-manifest.json");

  if (!options.dryRun) {
    fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));
    console.log(`  Saved generation-manifest.json`);
  } else {
    console.log(`  [DRY RUN] Would save generation-manifest.json`);
  }

  // ----------------------------------------
  // Summary
  // ----------------------------------------
  console.log("\n========================================");
  console.log("  Generation Complete");
  console.log("========================================\n");

  console.log(`Site: ${siteName}`);
  console.log(`Directory: ${siteDir}`);
  console.log(`Project ID: ${project.metadata.projectId}`);
  console.log(`Business: ${project.business.name}`);
  console.log(`Industry: ${project.business.industry}`);
  console.log("");
  console.log(`Services: ${manifest.content.servicesCount}`);
  console.log(`Locations: ${manifest.content.locationsCount}`);
  console.log(`Regions: ${manifest.content.regionsCount}`);
  console.log("");

  if (options.skipContent) {
    console.log("Content generation was skipped (--skip-content)");
    console.log("");
  }

  if (options.dryRun) {
    console.log("This was a dry run - no files were written.");
    console.log("Remove --dry-run to create the site.\n");
  } else {
    console.log("Next steps:");
    console.log(`  1. cd sites/${siteName}`);
    console.log("  2. pnpm install");
    console.log("  3. pnpm dev");
    console.log("");
    console.log("To generate MDX content, use:");
    console.log(
      `  npx tsx tools/generate-services.ts --site ${siteName} --context ${options.project}`
    );
    console.log(
      `  npx tsx tools/generate-locations.ts --site ${siteName} --context ${options.project}`
    );
    console.log("");
  }
}

main().catch((error) => {
  console.error("Unexpected error:", error);
  process.exit(1);
});
