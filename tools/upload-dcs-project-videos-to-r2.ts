#!/usr/bin/env tsx
/**
 * Upload the 8 AI-generated (Higgsfield seedance_2_0_mini) project-card
 * background videos + poster frames to R2, under `dcs/projects/video/`.
 *
 * These are generic sector b-roll clips (no site capture, no faces, no
 * readable text/logos) generated to fill the "Awaiting footage" placeholder
 * on the 8 /projects cards that had no `media` entry in
 * `sites/dcs/lib/project-cards.ts`. See that file's header comment and
 * `sites/dcs/lib/project-video-assets.ts` for full provenance.
 *
 * Usage: npx tsx tools/upload-dcs-project-videos-to-r2.ts <source-dir>
 */
import * as path from "path";
import { R2Client } from "./lib/r2-client";

const PREFIX = "dcs/projects/video/";

const SLUGS = [
  "sanctuary-ida",
  "dj-fox-electrical",
  "mad-graphics",
  "nicola-noble-tuition",
  "silvero-homes",
  "dch-automotive",
  "luna-landings",
  "bexhill-removals",
];

async function main() {
  const sourceDir = process.argv[2];
  if (!sourceDir) {
    console.error("Usage: npx tsx tools/upload-dcs-project-videos-to-r2.ts <source-dir>");
    process.exit(1);
  }

  const r2 = new R2Client();

  for (const slug of SLUGS) {
    const videoPath = path.join(sourceDir, `${slug}.mp4`);
    const posterPath = path.join(sourceDir, `${slug}.jpg`);

    const videoResult = await r2.uploadFile(videoPath, `${PREFIX}${slug}.mp4`, {
      contentType: "video/mp4",
    });
    const posterResult = await r2.uploadFile(posterPath, `${PREFIX}${slug}.jpg`, {
      contentType: "image/jpeg",
    });

    if (!videoResult.success || !posterResult.success) {
      console.error(`FAILED ${slug}:`, videoResult.error, posterResult.error);
      process.exit(1);
    }

    console.log(`${slug}:`);
    console.log(`  video:  ${videoResult.url}`);
    console.log(`  poster: ${posterResult.url}`);
  }
}

main();
