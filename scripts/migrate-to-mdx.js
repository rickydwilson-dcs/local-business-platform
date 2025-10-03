#!/usr/bin/env node
/**
 * Migrate services from baseline.json to MDX files
 *
 * This script generates complete MDX files with frontmatter
 * from the extracted baseline serviceDataMap
 */

const fs = require("fs");
const path = require("path");

const BASELINE_PATH = path.join(__dirname, "migration-snapshots", "baseline.json");
const CONTENT_DIR = path.join(process.cwd(), "content", "services");
const BACKUP_DIR = path.join(
  __dirname,
  "migration-backups",
  new Date().toISOString().split("T")[0]
);

console.log("🚀 MDX Migration Script\n");
console.log("This will migrate all services from baseline.json to MDX files\n");

// Load baseline
let baseline;
try {
  baseline = JSON.parse(fs.readFileSync(BASELINE_PATH, "utf-8"));
  console.log(`✅ Loaded baseline: ${Object.keys(baseline).length} services\n`);
} catch (error) {
  console.error("❌ Error loading baseline.json:", error.message);
  process.exit(1);
}

// Backup existing MDX files
function backupExistingFiles() {
  if (!fs.existsSync(BACKUP_DIR)) {
    fs.mkdirSync(BACKUP_DIR, { recursive: true });
  }

  const existingFiles = fs.readdirSync(CONTENT_DIR).filter((f) => f.endsWith(".mdx"));

  console.log(`📦 Backing up ${existingFiles.length} existing MDX files...`);

  existingFiles.forEach((file) => {
    const sourcePath = path.join(CONTENT_DIR, file);
    const backupPath = path.join(BACKUP_DIR, file);
    fs.copyFileSync(sourcePath, backupPath);
  });

  console.log(`✅ Backup complete: ${BACKUP_DIR}\n`);
}

// Generate YAML frontmatter from service data
function generateFrontmatter(slug, data) {
  const lines = ["---"];

  // Basic fields
  lines.push(`title: "${data.title}"`);
  lines.push(`seoTitle: "${data.title} | Colossus Scaffolding"`);
  lines.push(`description: "${data.description}"`);

  // Badge (optional)
  if (data.badge) {
    lines.push(`badge: "${data.badge}"`);
  }

  // Hero image
  if (data.heroImage) {
    lines.push(`heroImage: "${data.heroImage}"`);
  }

  // Keywords (generate from title)
  const serviceType = data.title
    .toLowerCase()
    .replace(" services", "")
    .replace(" solutions", "")
    .replace(" systems", "");
  lines.push("keywords:");
  lines.push(`  - "${serviceType}"`);
  lines.push(`  - "${serviceType} hire"`);
  lines.push(`  - "professional scaffolding"`);
  lines.push(`  - "TG20:21 compliant"`);

  // Benefits
  lines.push("benefits:");
  data.benefits.forEach((benefit) => {
    lines.push(`  - "${benefit.replace(/"/g, '\\"')}"`);
  });

  // FAQs
  lines.push("faqs:");
  data.faqs.forEach((faq) => {
    lines.push('  - question: "' + faq.question.replace(/"/g, '\\"') + '"');
    lines.push('    answer: "' + faq.answer.replace(/"/g, '\\"') + '"');
  });

  // Business hours (location-specific)
  if (data.businessHours) {
    lines.push("businessHours:");
    Object.entries(data.businessHours).forEach(([day, hours]) => {
      lines.push(`  ${day}: "${hours}"`);
    });
  }

  // Local contact (location-specific)
  if (data.localContact) {
    lines.push("localContact:");
    lines.push(`  phone: "${data.localContact.phone}"`);
    lines.push(`  email: "${data.localContact.email}"`);
    if (data.localContact.address) {
      lines.push(`  address: "${data.localContact.address}"`);
    }
  }

  lines.push("---");

  return lines.join("\n");
}

// Generate markdown content
function generateMarkdownContent(slug, data) {
  const serviceName = data.title
    .replace(" Services", "")
    .replace(" Solutions", "")
    .replace(" Systems", "");

  let content = `\n## Professional ${serviceName}\n\n`;
  content += `${data.description}\n\n`;
  content += `### Why Choose Our ${serviceName}?\n\n`;
  content += `We provide professional, compliant scaffolding services with full safety certification and expert installation teams.\n\n`;
  content += `### Get Your Free Quote\n\n`;
  content += `Contact us today for a free, no-obligation site survey and quotation. Our expert team is ready to help with your project.\n`;

  return content;
}

// Create MDX file for a service
function createMDXFile(slug, data) {
  const frontmatter = generateFrontmatter(slug, data);
  const content = generateMarkdownContent(slug, data);
  const mdxContent = frontmatter + content;

  const filePath = path.join(CONTENT_DIR, `${slug}.mdx`);
  fs.writeFileSync(filePath, mdxContent);

  return filePath;
}

// Main migration
function migrate() {
  console.log("📝 Creating MDX files...\n");

  let created = 0;
  let updated = 0;

  for (const [slug, data] of Object.entries(baseline)) {
    const filePath = path.join(CONTENT_DIR, `${slug}.mdx`);
    const exists = fs.existsSync(filePath);

    createMDXFile(slug, data);

    if (exists) {
      console.log(`✏️  Updated: ${slug}.mdx`);
      updated++;
    } else {
      console.log(`✨ Created: ${slug}.mdx`);
      created++;
    }
  }

  console.log("\n" + "=".repeat(60));
  console.log("✅ Migration Complete!");
  console.log("=".repeat(60));
  console.log(`Created: ${created} files`);
  console.log(`Updated: ${updated} files`);
  console.log(`Total: ${created + updated} services\n`);
}

// Validate MDX files can be parsed
function validateMDXFiles() {
  console.log("🔍 Validating MDX files...\n");

  const matter = require("gray-matter");
  let errors = 0;

  for (const slug of Object.keys(baseline)) {
    const filePath = path.join(CONTENT_DIR, `${slug}.mdx`);

    try {
      const fileContent = fs.readFileSync(filePath, "utf-8");
      const { data: frontmatter, content } = matter(fileContent);

      // Check required fields
      if (!frontmatter.title) throw new Error("Missing title");
      if (!frontmatter.description) throw new Error("Missing description");
      if (!frontmatter.benefits || !Array.isArray(frontmatter.benefits)) {
        throw new Error("Missing or invalid benefits");
      }
      if (!frontmatter.faqs || !Array.isArray(frontmatter.faqs)) {
        throw new Error("Missing or invalid faqs");
      }

      console.log(`✅ ${slug}.mdx - Valid`);
    } catch (error) {
      console.error(`❌ ${slug}.mdx - Error: ${error.message}`);
      errors++;
    }
  }

  if (errors === 0) {
    console.log("\n✅ All MDX files are valid!\n");
  } else {
    console.error(`\n❌ ${errors} files have validation errors\n`);
    process.exit(1);
  }
}

// Run migration
try {
  // Check if gray-matter is available
  try {
    require.resolve("gray-matter");
  } catch (e) {
    console.log("⚠️  gray-matter not found, skipping validation step");
    console.log("   (Validation will happen when Next.js builds)\n");
  }

  backupExistingFiles();
  migrate();

  // Try to validate if gray-matter is available
  try {
    require.resolve("gray-matter");
    validateMDXFiles();
  } catch (e) {
    console.log("⚠️  Skipping validation (gray-matter not available)\n");
  }

  console.log("📋 Next Steps:");
  console.log("1. Review the generated MDX files in content/services/");
  console.log("2. Run: npm run build (to test)");
  console.log("3. Refactor app/services/[slug]/page.tsx to read MDX");
  console.log("4. Run comparison tests\n");
} catch (error) {
  console.error("❌ Migration failed:", error.message);
  console.error(error.stack);
  process.exit(1);
}
