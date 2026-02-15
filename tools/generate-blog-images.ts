#!/usr/bin/env tsx
/**
 * Generate blog hero images for DJ Fox Electrical using Google Gemini
 *
 * Usage: tsx tools/generate-blog-images.ts
 */

import { GoogleGenerativeAI } from "@google/generative-ai";
import * as fs from "fs";
import * as path from "path";
import * as dotenv from "dotenv";

// Load environment variables
dotenv.config({ path: path.join(process.cwd(), ".env.local") });

const GEMINI_API_KEY = process.env.GOOGLE_AI_API_KEY || "";
const GEMINI_MODEL = "gemini-3-pro-image-preview";
const OUTPUT_DIR = path.join(process.cwd(), "output/generated-images/djfoxelectrical/blog");
const DELAY_MS = 3000; // 3 second delay between generations

interface BlogImage {
  slug: string;
  filename: string;
  title: string;
  prompt: string;
}

const BLOG_IMAGES: BlogImage[] = [
  // Batch 1
  {
    slug: "eicr-testing-eastbourne",
    filename: "eicr-testing-eastbourne.jpg",
    title: "EICR Testing in Eastbourne",
    prompt:
      "Professional electrician conducting EICR electrical safety inspection in a UK home. Electrician using testing equipment at a consumer unit, checking circuits and wiring. Modern residential setting in Eastbourne, UK. NICEIC approved contractor performing official electrical installation condition report. High-quality professional photograph, bright natural lighting, safety-focused, trustworthy atmosphere. 16:9 aspect ratio, photorealistic.",
  },
  {
    slug: "ev-charger-installation-brighton-eastbourne",
    filename: "ev-charger-installation-brighton-eastbourne.jpg",
    title: "EV Charger Installation Brighton & Eastbourne",
    prompt:
      "Professional electrician installing electric vehicle home charging point on UK driveway. Modern white EV charger unit being mounted on exterior wall, Type 2 connector visible. Electric car parked in driveway of Brighton/Eastbourne suburban home. Clean installation with cable management. Bright daylight, professional trade photography, emphasis on clean modern technology and sustainability. 16:9 aspect ratio, photorealistic.",
  },
  {
    slug: "niceic-vs-napit-guide-east-sussex",
    filename: "niceic-vs-napit-guide-east-sussex.jpg",
    title: "NICEIC vs NAPIT Guide",
    prompt:
      "Professional UK electrician holding NICEIC certification badge and electrical testing equipment. Close-up of electrician's hands showing approved contractor ID card and qualifications. Modern electrical tools in background - voltage testers, certification documents visible. Professional trust and credibility theme. Bright clean lighting, sharp focus on credentials, reassuring professional atmosphere. 16:9 aspect ratio, photorealistic.",
  },
  {
    slug: "electrician-prices-eastbourne-2026",
    filename: "electrician-prices-eastbourne-2026.jpg",
    title: "Electrician Prices Eastbourne 2026",
    prompt:
      "Professional electrician working in UK home showing transparent pricing and quoting. Electrician with clipboard and tablet calculating costs, electrical tools visible in background. Modern UK residential interior - consumer unit, cables, switches visible. Professional consultation atmosphere, trustworthy tradesperson providing clear quote. Natural lighting, emphasis on transparency and professionalism. 16:9 aspect ratio, photorealistic.",
  },
  // Batch 2
  {
    slug: "consumer-unit-replacement-hailsham",
    filename: "consumer-unit-replacement-hailsham.jpg",
    title: "Consumer Unit Replacement Hailsham",
    prompt:
      "Professional electrician installing new modern metal consumer unit (fuse box) in UK home. Side-by-side comparison showing old rewireable fuse box being replaced with new RCD-protected consumer unit. Electrician working with hand on unit, proper safety equipment. UK residential setting, emphasis on safety upgrade and modern protection. Clean professional installation photography, bright lighting. 16:9 aspect ratio, photorealistic.",
  },
  {
    slug: "emergency-electrician-eastbourne",
    filename: "emergency-electrician-eastbourne.jpg",
    title: "Emergency Electrician Eastbourne",
    prompt:
      '24/7 emergency electrician responding to urgent call at UK home at night. Professional electrician with torch and testing equipment at consumer unit, wearing high-vis vest. Emergency service van visible through window with "24/7" signage. Dramatic but reassuring atmosphere - help arriving when needed. Professional emergency response photography, some darkness with focused work lighting on electrician. 16:9 aspect ratio, photorealistic.',
  },
  {
    slug: "landlord-electrical-certificates-lewes",
    filename: "landlord-electrical-certificates-lewes.jpg",
    title: "Landlord Electrical Certificates Lewes",
    prompt:
      "Professional electrician conducting landlord EICR inspection in UK rental property. Electrician testing sockets and examining consumer unit with clipboard for certification. Modern rental property interior with visible electrical installations. Official certification documents and NICEIC ID visible. Professional, thorough inspection atmosphere for landlord compliance. Bright natural lighting, emphasis on official compliance and safety. 16:9 aspect ratio, photorealistic.",
  },
  {
    slug: "smart-home-installation-crowborough",
    filename: "smart-home-installation-crowborough.jpg",
    title: "Smart Home Installation Crowborough",
    prompt:
      "Professional electrician installing smart home devices in modern UK home. Electrician setting up smart light switches, Nest thermostat, and smart hub in contemporary living room. Smartphone showing smart home control app in foreground. Modern, tech-savvy UK home interior in Crowborough area. Warm, inviting atmosphere with modern technology integration. Natural daylight through windows, emphasis on lifestyle upgrade and automation. 16:9 aspect ratio, photorealistic.",
  },
  // Batch 3
  {
    slug: "18th-edition-wiring-regulations-guide",
    filename: "18th-edition-wiring-regulations-guide.jpg",
    title: "18th Edition Wiring Regulations Guide",
    prompt:
      "Professional UK electrician reviewing BS 7671:2018 18th Edition Wiring Regulations book at modern consumer unit installation. Electrician with regulation manual open, checking compliance during installation. Modern metal consumer unit with RCD protection and surge protection device visible. Clean UK home interior, emphasis on regulatory compliance and professional standards. NICEIC certification visible. Bright professional lighting, technical but accessible atmosphere. 16:9 aspect ratio, photorealistic.",
  },
  {
    slug: "electrical-fire-safety-prevention",
    filename: "electrical-fire-safety-prevention.jpg",
    title: "Electrical Fire Safety Prevention",
    prompt:
      "Professional electrician inspecting overloaded electrical socket showing warning signs of fire risk in UK home. Close-up of damaged socket with discoloration and scorch marks, electrician using thermal imaging camera to detect hot spots. Warning/safety theme. Consumer unit with RCD protection in background. Serious but educational atmosphere about fire prevention. Professional safety inspection photography, clear lighting to show detail. 16:9 aspect ratio, photorealistic.",
  },
  {
    slug: "electric-vs-gas-heating-2026",
    filename: "electric-vs-gas-heating-2026.jpg",
    title: "Electric vs Gas Heating 2026",
    prompt:
      "Side-by-side comparison of air source heat pump and traditional gas boiler in UK home. Left side: modern air source heat pump outdoor unit on patio with indoor controls. Right side: old gas boiler in cupboard. Split-screen composition showing future vs traditional heating. Professional electrician installing heat pump electrical connections. UK suburban home setting. Clean comparison photography, bright natural lighting. Energy efficiency and modernization theme. 16:9 aspect ratio, photorealistic.",
  },
  {
    slug: "commercial-electrical-maintenance",
    filename: "commercial-electrical-maintenance.jpg",
    title: "Commercial Electrical Maintenance",
    prompt:
      "Professional electrician conducting commercial electrical maintenance in UK office building. Electrician performing EICR testing on commercial distribution board with professional testing equipment and laptop. Business office environment with server room in background. Clipboard with maintenance schedule visible. Professional B2B atmosphere, emphasis on preventative maintenance and compliance. Bright office lighting, business-focused, trustworthy professional service. 16:9 aspect ratio, photorealistic.",
  },
  // Batch 4
  {
    slug: "rewiring-services-seaford-newhaven",
    filename: "rewiring-services-seaford-newhaven.jpg",
    title: "Rewiring Services Seaford & Newhaven",
    prompt:
      "Professional electrician performing full house rewiring in older UK property. Shows first fix stage with new cable runs in walls and ceiling, blue/brown wires visible. Electrician installing new back boxes and running cables. 1930s-60s era house interior typical of Seaford/Newhaven coastal areas. Dust sheets protecting floor. Working process photography showing skilled electrical work. UK residential rewiring project. Professional craftsmanship, clear bright lighting. 16:9 aspect ratio, photorealistic.",
  },
  {
    slug: "pat-testing-hastings-bexhill",
    filename: "pat-testing-hastings-bexhill.jpg",
    title: "PAT Testing Hastings & Bexhill",
    prompt:
      "Professional electrician performing PAT testing in UK commercial office. Close-up of PAT testing equipment being used on office computer equipment and appliances. Electrician applying pass/fail label to tested item. Modern office environment in Hastings/Bexhill area. Multiple office appliances visible awaiting testing. Commercial electrical compliance theme. Professional B2B atmosphere, organized and systematic testing process. Bright office lighting. 16:9 aspect ratio, photorealistic.",
  },
  {
    slug: "solar-panel-electrical-requirements",
    filename: "solar-panel-electrical-requirements.jpg",
    title: "Solar Panel Electrical Requirements",
    prompt:
      "Professional electrician installing solar panel electrical connections in UK home. Shows inverter installation and AC/DC isolators being fitted. Modern solar PV inverter on wall with generation meter and consumer unit modifications visible. Wiring from rooftop panels entering building. Clean professional solar installation in East Sussex coastal property. Technical but accessible photography showing electrical work, emphasis on proper installation and grid connection. Bright natural lighting. 16:9 aspect ratio, photorealistic.",
  },
  {
    slug: "eicr-cost-breakdown-2026",
    filename: "eicr-cost-breakdown-2026.jpg",
    title: "EICR Cost Breakdown 2026",
    prompt:
      "Professional electrician conducting EICR testing with cost breakdown paperwork visible. Electrician using professional testing equipment on consumer unit, EICR certificate and quote visible on clipboard. Modern UK home interior. Transparent pricing document showing itemized EICR costs. Professional consultation atmosphere, trust and transparency theme. Testing equipment, NICEIC certification visible. Clean bright lighting emphasizing professionalism and fair pricing. 16:9 aspect ratio, photorealistic.",
  },
  // Batch 5
  {
    slug: "ev-charger-installation-cost-2026",
    filename: "ev-charger-installation-cost-2026.jpg",
    title: "EV Charger Installation Cost 2026",
    prompt:
      "Professional electrician installing EV charger on UK driveway with pricing information visible. Shows cost breakdown: charger unit, installation work, wiring from consumer unit. Electric vehicle charging from newly installed white 7kW charger unit. Modern UK suburban home, tidy professional installation. Cost transparency theme with quote paperwork visible. OZEV grant approved installer badge visible. Bright daylight, professional trade photography emphasizing value and quality. 16:9 aspect ratio, photorealistic.",
  },
  {
    slug: "rewiring-cost-guide-2026",
    filename: "rewiring-cost-guide-2026.jpg",
    title: "Rewiring Cost Guide 2026",
    prompt:
      "Professional electrician showing rewiring cost breakdown in UK home renovation. Split composition showing different stages of rewire project with cost information overlay. First fix cabling, consumer unit upgrade, second fix accessories. Electrician with cost guide document and calculator. 3-bedroom house rewiring in progress. Transparent pricing theme, professional quote and planning. Clean organized work site, emphasis on value and quality workmanship. Bright professional lighting. 16:9 aspect ratio, photorealistic.",
  },
  {
    slug: "winter-electrical-safety-storm-prep",
    filename: "winter-electrical-safety-storm-prep.jpg",
    title: "Winter Electrical Safety Storm Prep",
    prompt:
      "Professional electrician conducting pre-winter electrical safety inspection on coastal UK property. Checking outdoor electrical installations, weatherproof sockets, and RCD protection during winter preparation. Dramatic coastal East Sussex setting with stormy weather visible in background. Electrician with torch and testing equipment checking outdoor fittings for storm readiness. Winter preparedness theme, emphasis on safety and prevention. Overcast weather, professional safety-focused photography. 16:9 aspect ratio, photorealistic.",
  },
  {
    slug: "future-home-electrics-2026",
    filename: "future-home-electrics-2026.jpg",
    title: "Future of Home Electrics 2026",
    prompt:
      "Futuristic UK smart home with all-electric systems integration. Shows modern home with EV charging, solar panels, smart home controls, heat pump, and battery storage all integrated. Professional electrician working on advanced home electrical system with digital controls and monitoring. Clean modern UK home interior with visible smart technology, electric heating, EV charger, and renewable energy. Forward-looking, innovation theme. Bright aspirational photography emphasizing sustainable electric future. 16:9 aspect ratio, photorealistic.",
  },
];

async function generateImage(image: BlogImage, index: number, total: number): Promise<boolean> {
  console.log(`\n🎨 Generating (${index + 1}/${total}): ${image.title}`);
  console.log(`   Slug: ${image.slug}`);
  console.log(`   Prompt: ${image.prompt.substring(0, 80)}...`);

  try {
    const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: GEMINI_MODEL });

    const result = await model.generateContent({
      contents: [
        {
          role: "user",
          parts: [{ text: image.prompt }],
        },
      ],
    });

    const response = result.response;

    // Extract image data from response
    const imageData = response.candidates?.[0]?.content?.parts?.[0];

    if (!imageData || !("inlineData" in imageData)) {
      throw new Error("No image data in response");
    }

    // Ensure output directory exists
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });

    // Save image
    const outputPath = path.join(OUTPUT_DIR, image.filename);
    const buffer = Buffer.from(imageData.inlineData.data, "base64");
    fs.writeFileSync(outputPath, buffer);

    console.log(`   ✅ Saved: ${outputPath}`);
    return true;
  } catch (error) {
    console.error(`   ❌ Error generating ${image.filename}:`, error);
    return false;
  }
}

async function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function main() {
  console.log("🖼️  DJ Fox Electrical - Blog Hero Image Generator");
  console.log(`📊 Total images: ${BLOG_IMAGES.length}`);
  console.log(`🤖 Model: ${GEMINI_MODEL}`);
  console.log(`📁 Output: ${OUTPUT_DIR}`);
  console.log(`⏱️  Delay: ${DELAY_MS / 1000} seconds between images\n`);

  if (!GEMINI_API_KEY) {
    console.error("❌ Error: GOOGLE_AI_API_KEY not found in .env.local");
    process.exit(1);
  }

  const results = {
    success: 0,
    failed: 0,
  };

  for (let i = 0; i < BLOG_IMAGES.length; i++) {
    const image = BLOG_IMAGES[i];
    const success = await generateImage(image, i, BLOG_IMAGES.length);

    if (success) {
      results.success++;
    } else {
      results.failed++;
    }

    // Delay between generations (except after last image)
    if (i < BLOG_IMAGES.length - 1) {
      console.log(`   ⏳ Waiting ${DELAY_MS / 1000} seconds before next image...`);
      await delay(DELAY_MS);
    }
  }

  console.log("\n📊 Generation Summary:");
  console.log(`   ✅ Success: ${results.success}`);
  console.log(`   ❌ Failed: ${results.failed}`);
  console.log(`   📁 Output directory: ${OUTPUT_DIR}`);

  if (results.success > 0) {
    console.log("\n✅ Blog images generated successfully!");
    console.log("\nNext steps:");
    console.log("1. Review images in output/generated-images/djfoxelectrical/blog/");
    console.log("2. Upload to R2: local-business-platform/djfoxelectrical/blog/");
    console.log("3. Images will load automatically on blog posts");
  }
}

if (require.main === module) {
  main().catch(console.error);
}
