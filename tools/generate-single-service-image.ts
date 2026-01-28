#!/usr/bin/env tsx
/**
 * Single Service Image Generator
 * Generates a single hero image for a service page using Gemini API
 *
 * Usage:
 *   tsx tools/generate-single-service-image.ts <service-name>
 *   Example: tsx tools/generate-single-service-image.ts commercial-scaffolding
 */

import * as fs from "fs";
import * as path from "path";
import * as dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";

// Load environment variables
dotenv.config({ path: path.join(process.cwd(), ".env.local") });

const OUTPUT_DIR = path.join(process.cwd(), "output/generated-images");
const GEMINI_MODEL = "gemini-3-pro-image-preview";

interface ServicePrompts {
  [key: string]: string;
}

// Predefined prompts for service images - South Coast UK focused
const SERVICE_PROMPTS: ServicePrompts = {
  "commercial-scaffolding": `Professional commercial scaffolding installation on a modern office building in Brighton, UK. The scene shows a multi-story commercial property with scaffolding covering the facade, featuring metal scaffolding tubes and boards in a professional grid pattern. Construction workers in high-visibility yellow vests and white hard hats are visible on the scaffolding platforms. The architecture is typical South Coast UK style - modern glass and brick. Background shows the Brighton/Sussex area with characteristic British buildings, no palm trees. Overcast British sky with soft natural daylight. Professional construction photography, photorealistic, sharp focus, commercial quality, 800x600 landscape format.`,
};

async function generateServiceImage(serviceName: string): Promise<void> {
  console.log(`\n🎨 Generating image for: ${serviceName}\n`);

  // Check if we have a prompt for this service
  const prompt = SERVICE_PROMPTS[serviceName];
  if (!prompt) {
    throw new Error(
      `No prompt defined for service: ${serviceName}\n` +
        `Available services: ${Object.keys(SERVICE_PROMPTS).join(", ")}`
    );
  }

  // Validate API key
  const apiKey = process.env.GOOGLE_AI_API_KEY;
  if (!apiKey) {
    throw new Error("GOOGLE_AI_API_KEY environment variable is required");
  }

  console.log("📝 Prompt:");
  console.log(`   ${prompt.substring(0, 100)}...`);
  console.log("");

  // Initialize Gemini
  const genAI = new GoogleGenerativeAI(apiKey);

  try {
    // Configure model for image generation
    const model = genAI.getGenerativeModel({
      model: GEMINI_MODEL,
      generationConfig: {
        // @ts-expect-error - responseModalities is available but not in types yet
        responseModalities: ["TEXT", "IMAGE"],
      },
    });

    console.log("📤 Calling Gemini API...");
    const result = await model.generateContent(prompt);
    const response = result.response;

    // Extract image data from response
    const candidates = response.candidates;
    if (!candidates || candidates.length === 0) {
      throw new Error("No candidates in API response");
    }

    const parts = candidates[0].content?.parts;
    if (!parts || parts.length === 0) {
      throw new Error("No content parts in API response");
    }

    // Look for image data
    let imageBuffer: Buffer | null = null;
    for (const part of parts) {
      if (part.inlineData && part.inlineData.data) {
        console.log(`📥 Received image data (${part.inlineData.mimeType || "image/png"})`);
        imageBuffer = Buffer.from(part.inlineData.data, "base64");
        break;
      }
    }

    if (!imageBuffer) {
      throw new Error("No image data found in API response");
    }

    // Ensure output directory exists
    const serviceDir = path.join(OUTPUT_DIR, "colossus-reference/hero/service");
    if (!fs.existsSync(serviceDir)) {
      fs.mkdirSync(serviceDir, { recursive: true });
    }

    // Save the image with Brighton location context
    const filename = `${serviceName}_brighton.webp`;
    const outputPath = path.join(serviceDir, filename);

    fs.writeFileSync(outputPath, imageBuffer);

    console.log(`✅ Image generated successfully!`);
    console.log(`📁 Saved to: ${outputPath}`);
    console.log(``);
    console.log(`📝 Next steps:`);
    console.log(`   1. Review the generated image to ensure it's appropriate`);
    console.log(`   2. Upload to R2: tsx tools/upload-single-image.ts "${outputPath}"`);
    console.log(
      `   3. The MDX file already references: colossus-reference/hero/service/${filename}`
    );
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to generate image: ${error.message}`);
    }
    throw error;
  }
}

// Main entry point
async function main(): Promise<void> {
  try {
    const serviceName = process.argv[2];

    if (!serviceName) {
      console.log(`
Usage: tsx tools/generate-single-service-image.ts <service-name>

Available services:
  ${Object.keys(SERVICE_PROMPTS).join("\n  ")}

Example:
  tsx tools/generate-single-service-image.ts commercial-scaffolding
      `);
      process.exit(1);
    }

    await generateServiceImage(serviceName);
  } catch (error) {
    console.error("\n❌ Error:", error instanceof Error ? error.message : error);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}
