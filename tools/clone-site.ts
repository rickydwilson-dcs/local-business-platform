#!/usr/bin/env tsx
/**
 * clone-site CLI
 *
 * Entry point for Entry A: ingest a live URL into CPF format.
 *
 * Usage:
 *   npx tsx tools/clone-site.ts --url https://colorcode.events --name corvus
 *   npx tsx tools/clone-site.ts --brief output/briefs/abc123.json
 */

import * as fs from "fs";
import * as path from "path";
import { randomUUID } from "crypto";

import { JobBriefSchema, type JobBrief } from "./lib/pipeline-brief-types";
import { ingestLiveSite } from "./lib/clone-entry/ingest-live-site";

function parseArgs(): { url?: string; name?: string; brief?: string } {
  const args = process.argv.slice(2);
  const result: { url?: string; name?: string; brief?: string } = {};
  for (let i = 0; i < args.length; i++) {
    if (args[i] === "--url" && args[i + 1]) result.url = args[++i];
    else if (args[i] === "--name" && args[i + 1]) result.name = args[++i];
    else if (args[i] === "--brief" && args[i + 1]) result.brief = args[++i];
  }
  return result;
}

function buildMinimalBrief(url: string, name: string): JobBrief {
  const parsed = new URL(url);
  const hostname = parsed.hostname.replace(/^www\./, "");

  return JobBriefSchema.parse({
    id: randomUUID(),
    createdAt: new Date().toISOString(),
    cpfVersion: "0.1",
    source: { type: "url", value: url },
    business: {
      name: hostname,
      trade: "general",
    },
    content: {
      services: ["General Service"],
    },
    theme: {
      name,
    },
    qa: {
      maxIterations: 3,
      thresholds: { home: 0.05, about: 0.05, default: 0.1 },
    },
    imageGen: {
      enabled: false,
      mode: "batch",
    },
    runMode: "autonomous",
  });
}

async function main() {
  const args = parseArgs();

  let brief: JobBrief;

  if (args.brief) {
    const rawPath = path.resolve(args.brief);
    if (!fs.existsSync(rawPath)) {
      console.error(`Brief file not found: ${rawPath}`);
      process.exit(1);
    }
    const raw = JSON.parse(fs.readFileSync(rawPath, "utf-8")) as unknown;
    const result = JobBriefSchema.safeParse(raw);
    if (!result.success) {
      console.error("Invalid brief:", result.error.format());
      process.exit(1);
    }
    brief = result.data;
  } else if (args.url) {
    const name = args.name ?? "clone-" + Date.now();
    brief = buildMinimalBrief(args.url, name);
  } else {
    console.error("Usage: clone-site.ts --url <url> [--name <name>] | --brief <path>");
    process.exit(1);
  }

  const themeName = brief.theme.name ?? brief.id;
  const outputDir = path.resolve(`output/clones/${themeName}`);

  console.log(`\nClone Pipeline — Entry A`);
  console.log(`  Source: ${brief.source.type === "url" ? brief.source.value : "non-url"}`);
  console.log(`  Output: ${outputDir}\n`);

  await ingestLiveSite(brief, outputDir);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
