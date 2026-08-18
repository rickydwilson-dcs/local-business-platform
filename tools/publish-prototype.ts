#!/usr/bin/env tsx
/**
 * Deploy a prototype directory to Vercel as a static site.
 *
 * Prototypes are reviewed from a URL rather than a file:// path so they can be
 * opened on a phone or sent to a client. Assets are NOT part of the deployment —
 * they are served from R2 (run tools/upload-prototype-assets.ts first), so the
 * upload payload is just HTML.
 *
 * Usage:
 *   npx tsx tools/publish-prototype.ts <prototype-dir> [options]
 *
 * Options:
 *   --project <name>  Vercel project name (default: sanitised session slug)
 *   --no-deploy       Write the config and run the checks, but do not deploy
 */
import { execFileSync } from "child_process";
import * as fs from "fs";
import * as path from "path";

interface Options {
  project?: string;
  deploy: boolean;
}

/** ".../2026-08-17_dcs-homepage-redesign/prototype" -> "2026-08-17_dcs-homepage-redesign" */
function deriveSlug(prototypeDir: string): string {
  const resolved = path.resolve(prototypeDir);
  const base = path.basename(resolved);
  return base === "prototype" ? path.basename(path.dirname(resolved)) : base;
}

/** Vercel project names allow lowercase alphanumerics and hyphens only. */
function sanitiseProjectName(slug: string): string {
  return slug
    .toLowerCase()
    .replace(/[^a-z0-9-]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 100);
}

/**
 * Refuse to deploy prototypes whose assets are still relative. They would 404 on
 * Vercel, because assets are deliberately excluded from the upload.
 */
function preflight(prototypeDir: string): string[] {
  const problems: string[] = [];

  if (!fs.existsSync(path.join(prototypeDir, "assets-manifest.json"))) {
    problems.push(
      "No assets-manifest.json — run tools/upload-prototype-assets.ts first so assets are on R2."
    );
  }

  const htmlFiles = fs.readdirSync(prototypeDir).filter((f) => f.endsWith(".html"));
  if (htmlFiles.length === 0) {
    problems.push("No HTML files found in the prototype directory.");
  }

  const stillRelative = htmlFiles.filter((f) =>
    /(["'])assets\//.test(fs.readFileSync(path.join(prototypeDir, f), "utf-8"))
  );
  if (stillRelative.length) {
    problems.push(
      `${stillRelative.length} file(s) still reference relative assets/ paths, which will 404: ${stillRelative
        .slice(0, 3)
        .join(", ")}${stillRelative.length > 3 ? ", ..." : ""}`
    );
  }

  return problems;
}

/**
 * Minimal fallback index for sessions that have not hand-authored one. A session
 * with its own index.html keeps it — those are usually far better than a generated
 * list, and overwriting one would destroy real work.
 */
function writeFallbackIndex(prototypeDir: string, slug: string) {
  const entries = fs
    .readdirSync(prototypeDir)
    .filter((f) => f.endsWith(".html") && f !== "index.html")
    .sort()
    .map((file) => {
      const html = fs.readFileSync(path.join(prototypeDir, file), "utf-8");
      const title = html.match(/<title>([^<]*)<\/title>/)?.[1] ?? file;
      return `      <li><a href="${file.replace(/\.html$/, "")}">${file.replace(/\.html$/, "")}</a> <span>${title}</span></li>`;
    })
    .join("\n");

  const page = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="robots" content="noindex" />
    <title>${slug} — prototypes</title>
    <style>
      body { font: 16px/1.6 ui-sans-serif, system-ui, sans-serif; max-width: 46rem; margin: 4rem auto; padding: 0 1.5rem; }
      h1 { font-size: 1.25rem; letter-spacing: -0.01em; }
      ul { list-style: none; padding: 0; }
      li { padding: 0.5rem 0; border-bottom: 1px solid #e5e5e5; }
      span { color: #666; display: block; font-size: 0.875rem; }
    </style>
  </head>
  <body>
    <h1>${slug}</h1>
    <ul>
${entries}
    </ul>
  </body>
</html>
`;
  fs.writeFileSync(path.join(prototypeDir, "index.html"), page, "utf-8");
}

function main() {
  const args = process.argv.slice(2);
  const projectFlag = args.indexOf("--project");
  const options: Options = {
    project: projectFlag !== -1 ? args[projectFlag + 1] : undefined,
    deploy: !args.includes("--no-deploy"),
  };
  // Drop flags and any value consumed by --project, leaving the directory.
  const positional = args.filter(
    (a, i) => !a.startsWith("--") && !(projectFlag !== -1 && i === projectFlag + 1)
  );

  if (positional.length !== 1) {
    console.error(
      "Usage: npx tsx tools/publish-prototype.ts <prototype-dir> [--project <name>] [--no-deploy]"
    );
    process.exit(1);
  }

  const prototypeDir = path.resolve(positional[0]);
  if (!fs.existsSync(prototypeDir)) {
    console.error(`Prototype directory not found: ${prototypeDir}`);
    process.exit(1);
  }

  const slug = deriveSlug(prototypeDir);
  const project = options.project ?? sanitiseProjectName(slug);

  console.log(`\n🚀 Publish prototype\n`);
  console.log(`   Source:  ${prototypeDir}`);
  console.log(`   Slug:    ${slug}`);
  console.log(`   Project: ${project}\n`);

  const problems = preflight(prototypeDir);
  if (problems.length) {
    console.error("❌ Pre-flight failed:");
    problems.forEach((p) => console.error(`   ${p}`));
    process.exit(1);
  }
  console.log("✅ Pre-flight: assets are on R2, no relative references remain.");

  if (!fs.existsSync(path.join(prototypeDir, "index.html"))) {
    writeFallbackIndex(prototypeDir, slug);
    console.log("📄 Generated a fallback index.html (none existed).");
  } else {
    console.log("📄 Using the existing index.html.");
  }

  // Every build setting is pinned explicitly. Left to auto-detection, Vercel
  // resolves the output directory as "public if it exists, or ." and will happily
  // inherit a build command from a vercel.json further up the repo — which is how
  // the first deploy of this project ended up serving the root monorepo's
  // placeholder page instead of the prototypes.
  const vercelJson = path.join(prototypeDir, "vercel.json");
  const existing = fs.existsSync(vercelJson)
    ? JSON.parse(fs.readFileSync(vercelJson, "utf-8"))
    : {};
  fs.writeFileSync(
    vercelJson,
    JSON.stringify(
      {
        ...existing,
        $schema: "https://openapi.vercel.sh/vercel.json",
        framework: null,
        buildCommand: null,
        installCommand: null,
        outputDirectory: ".",
        cleanUrls: true,
        trailingSlash: false,
      },
      null,
      2
    ) + "\n",
    "utf-8"
  );
  console.log("⚙️  Wrote vercel.json (static, no build, cleanUrls).");

  // Assets live on R2; excluding them keeps the upload deterministic rather than
  // depending on .gitignore inference, and keeps the payload to HTML alone.
  fs.writeFileSync(
    path.join(prototypeDir, ".vercelignore"),
    ["assets/", "*.md", "assets-manifest.json", ".impeccable/", ""].join("\n"),
    "utf-8"
  );

  if (!options.deploy) {
    console.log("\n⏭️  --no-deploy: configuration written, nothing deployed.\n");
    return;
  }

  // Run with the process cwd set to the prototype directory rather than passing
  // --cwd. The CLI resolves vercel.json against the process cwd, so invoking it
  // from the repo root pulls in the monorepo's root config.
  const run = (cmd: string, cmdArgs: string[]) =>
    execFileSync(cmd, cmdArgs, {
      cwd: prototypeDir,
      encoding: "utf-8",
      stdio: ["inherit", "pipe", "inherit"],
    });

  console.log(`\n🔗 Linking to Vercel project "${project}"...`);
  run("vercel", ["link", "--project", project, "--yes"]);

  console.log("📤 Deploying...");
  const output = run("vercel", ["deploy", "--prod", "--yes"]);
  const deploymentUrl = output.trim().split("\n").filter(Boolean).pop() ?? "";

  console.log(`\n✅ Deployment:  ${deploymentUrl}`);
  console.log(`   Shareable:   https://${project}.vercel.app\n`);
  console.log("   Note: per-deployment URLs are gated by Vercel Authentication;");
  console.log("   the project alias above is public. Verify before sharing widely.\n");
}

main();
