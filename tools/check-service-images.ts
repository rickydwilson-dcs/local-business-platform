#!/usr/bin/env tsx
import { R2Client } from "./lib/r2-client";
import * as dotenv from "dotenv";
import * as path from "path";

dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });

const services = [
  "commercial-scaffolding_01",
  "residential-scaffolding_01",
  "industrial-scaffolding_01",
  "access-scaffolding_01",
  "facade-scaffolding_01",
  "edge-protection_01",
  "temporary-roof-systems_01",
  "birdcage-scaffolds_01",
  "scaffold-towers-mast-systems_02",
  "crash-decks-crane-decks_02",
  "pavement-gantries-loading-bays_01",
  "public-access-staircases_01",
  "scaffold-alarms_01",
  "scaffolding-design-drawings_01",
  "scaffolding-inspections-maintenance_02",
  "sheeting-netting-encapsulation_01",
  "staircase-towers_01",
  "suspended-scaffolding_01",
];

async function check() {
  const r2 = new R2Client({
    accountId: process.env.R2_ACCOUNT_ID,
    accessKeyId: process.env.R2_ACCESS_KEY_ID,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
    bucketName: process.env.R2_BUCKET_NAME,
  });

  console.log("Checking service images in R2:\n");

  for (const service of services) {
    const imagePath = `colossus-reference/hero/service/${service}.webp`;
    const imageExists = await r2.fileExists(imagePath);
    console.log(`${imageExists ? "✅" : "❌"} ${service}`);
  }
}

check();
