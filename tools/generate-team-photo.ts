#!/usr/bin/env tsx
/**
 * Generate placeholder team photo for Daniel Fox
 */
import { GoogleGenerativeAI } from "@google/generative-ai";
import * as fs from "fs";
import * as path from "path";
import * as dotenv from "dotenv";

dotenv.config({ path: path.join(process.cwd(), ".env.local") });

const GEMINI_API_KEY = process.env.GOOGLE_AI_API_KEY || "";
const GEMINI_MODEL = "gemini-3-pro-image-preview";
const OUTPUT_DIR = path.join(process.cwd(), "output/generated-images/djfoxelectrical/team");

const prompt = `Professional portrait of an experienced UK electrician in clean navy work uniform. Mid-30s to 40s, friendly and approachable expression, short professional haircut. Standing with arms crossed confidently, holding electrical testing equipment. Bright, professional studio-style lighting against a neutral grey background. Clean-shaven or neat beard, wearing high-quality work wear with subtle company branding. Photorealistic, commercial photography quality, 512x512 pixels, 1:1 aspect ratio suitable for circular crop, sharp focus on face, professional and trustworthy appearance. UK electrician, NICEIC certified contractor style.`;

async function generateImage() {
  console.log("🎨 Generating team photo placeholder for Daniel Fox...\n");
  console.log(
    "   Note: This is a temporary placeholder. Replace with actual photo when available.\n"
  );

  try {
    const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: GEMINI_MODEL });

    const result = await model.generateContent({
      contents: [
        {
          role: "user",
          parts: [{ text: prompt }],
        },
      ],
    });

    const response = result.response;
    const imageData = response.candidates?.[0]?.content?.parts?.[0];

    if (!imageData || !("inlineData" in imageData)) {
      throw new Error("No image data in response");
    }

    fs.mkdirSync(OUTPUT_DIR, { recursive: true });

    const outputPath = path.join(OUTPUT_DIR, "daniel-fox.jpg");
    const buffer = Buffer.from(imageData.inlineData.data, "base64");
    fs.writeFileSync(outputPath, buffer);

    console.log(`✅ Saved: ${outputPath}\n`);
    console.log("📝 Remember to replace this placeholder with actual team photo later.");
  } catch (error) {
    console.error("❌ Error:", error);
    process.exit(1);
  }
}

if (require.main === module) {
  generateImage();
}
