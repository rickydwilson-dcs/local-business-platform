#!/usr/bin/env tsx
/**
 * Mad Graphics — Image Generation Script
 * Generates all hero images for services, locations, blog, and projects using Gemini API
 *
 * Usage:
 *   tsx tools/generate-mad-graphics-images.ts --type [all|services|locations|blog|projects] [--limit N] [--dry-run]
 *
 * Examples:
 *   tsx tools/generate-mad-graphics-images.ts --type all
 *   tsx tools/generate-mad-graphics-images.ts --type services --limit 5
 *   tsx tools/generate-mad-graphics-images.ts --type locations
 *   tsx tools/generate-mad-graphics-images.ts --type all --dry-run
 *
 * After generation:
 *   tsx tools/upload-mad-graphics-images.ts
 */

import * as fs from "fs";
import * as path from "path";
import * as dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";

dotenv.config({ path: path.join(process.cwd(), ".env.local") });

const OUTPUT_DIR = path.join(process.cwd(), "output/generated-images/mad-graphics");
const GEMINI_MODEL = "gemini-3-pro-image-preview";
const REQUEST_DELAY_MS = 4000;
const MAX_RETRIES = 3;
const BACKOFF_MS = 12000;

// Mad Graphics brand context — used in all prompts for consistency
const BRAND = {
  location: "East Sussex, UK",
  workshop: "Polegate, East Sussex",
  style:
    "photorealistic, professional commercial photography, natural daylight, sharp focus, high quality, vibrant colours",
  avoid:
    "No text overlays, no logos, no watermarks, no people's faces clearly visible",
};

interface ImageTask {
  id: string;
  type: "service" | "location" | "blog" | "project";
  filename: string; // e.g. hero-vehicle-graphics.webp
  title: string;
  prompt: string;
  outputPath: string;
  r2Key: string;
}

// ---------------------------------------------------------------------------
// Prompt generators
// ---------------------------------------------------------------------------

function servicePrompts(): Record<string, string> {
  return {
    // Vehicle Graphics category
    "hero-vehicle-graphics": `White transit van with bold orange and green vinyl lettering and graphics applied to the side and rear, parked on a light industrial estate in East Sussex. Fresh, professional vehicle signwriting. ${BRAND.style}. ${BRAND.avoid}.`,

    "hero-van-graphics": `Close-up of a tradesperson's van with bright orange vinyl graphics and a company name applied to the sliding door panel. Van is parked outside a commercial unit. Sharp detail on the vinyl lettering. ${BRAND.style}. ${BRAND.avoid}.`,

    "hero-car-graphics": `A small company car with a clean vinyl wrap stripe and logo area on the door panel, parked in a car park with a blurred UK town background. Professional car branding graphics. ${BRAND.style}. ${BRAND.avoid}.`,

    "hero-fleet-graphics": `Three matching white vans lined up outside a warehouse, each with identical orange and green branded vehicle graphics on their sides. Fleet branding, East Sussex industrial estate backdrop. ${BRAND.style}. ${BRAND.avoid}.`,

    "hero-vehicle-livery": `A commercial vehicle — large panel van — with full professional livery: bold side graphics, rear door graphics, and cab door branding in orange and green on white. Dynamic three-quarter angle view. ${BRAND.style}. ${BRAND.avoid}.`,

    "hero-magnetic-signs": `Two rectangular magnetic vehicle signs with orange and green branding and contact information, shown attached to the door of a white van. One sign slightly angled to show both surfaces. ${BRAND.style}. ${BRAND.avoid}.`,

    "hero-window-graphics": `A shop window with professionally applied frosted vinyl cut lettering showing business name and opening hours, with a central clear viewing area. UK high street retail setting, warm sunlight. ${BRAND.style}. ${BRAND.avoid}.`,

    "hero-hoarding-graphics": `Construction site hoarding covered with large-format printed graphics panels — orange and graphic design elements — around a building development site. Bright, professional site branding. ${BRAND.style}. ${BRAND.avoid}.`,

    // Signs & Signage category
    "hero-signs-signage": `A selection of professional outdoor signs displayed: illuminated fascia sign, projecting sign, and flat panel sign, all on a UK high street. Clean, impactful business signage. ${BRAND.style}. ${BRAND.avoid}.`,

    "hero-shop-signs": `Exterior of a UK retail unit with a professionally installed illuminated fascia sign above the shopfront, bold lettering on a dark background with orange highlights. Overcast daylight. ${BRAND.style}. ${BRAND.avoid}.`,

    "hero-directional-signs": `A set of powder-coated steel directional wayfinding signs on a post, pointing to different areas of a business park. Clean, professional UK signage. ${BRAND.style}. ${BRAND.avoid}.`,

    "hero-safety-signs": `A collection of health and safety signs mounted on a wall in a UK workplace — fire exit, no entry, PPE required — professional printed signs with standard UK symbols. ${BRAND.style}. ${BRAND.avoid}.`,

    "hero-site-boards": `Large printed construction site board on a hoarding fence, showing project details and branding graphics in orange and dark colours. UK building site, overcast sky. ${BRAND.style}. ${BRAND.avoid}.`,

    "hero-a-boards": `Two A-frame pavement signs outside a UK café or shop, with professionally printed inserts showing specials and directions. Cobblestone pavement, warm afternoon light. ${BRAND.style}. ${BRAND.avoid}.`,

    // Banners category
    "hero-banners": `A large PVC printed banner stretched between two posts outside a UK event venue, bright orange and white design, promoting a sale. Natural outdoor lighting. ${BRAND.style}. ${BRAND.avoid}.`,

    "hero-pvc-banners": `Close-up of a heavy-duty PVC banner being unrolled, showing the crisp full-colour print quality and eyeleted edges. Studio-style product shot on a light surface. ${BRAND.style}. ${BRAND.avoid}.`,

    "hero-roller-banners": `Two pull-up roller banner stands in an exhibition or conference setting, displaying bold graphic designs in orange and green. Neutral exhibition hall background. ${BRAND.style}. ${BRAND.avoid}.`,

    "hero-mesh-banners": `Mesh banner attached to scaffolding on a construction site, wind passing through the perforations slightly. Large format print visible, overcast UK sky. ${BRAND.style}. ${BRAND.avoid}.`,

    "hero-fabric-banners": `Fabric feather flags and a hanging fabric banner outside a UK trade stand or shop entrance. Bright, vibrant full-colour printing on fabric. Light breeze, natural daylight. ${BRAND.style}. ${BRAND.avoid}.`,

    // Large Format Print category
    "hero-large-format-print": `Wide-format inkjet printer in a print workshop, printing a large roll of vinyl graphics in vivid colours. Print head visible in motion, bright workshop lighting. ${BRAND.style}. ${BRAND.avoid}.`,

    "hero-large-format": `Large format printed graphics panel being prepared on a wide table, showing vibrant full-bleed landscape imagery. Professional print workshop environment. ${BRAND.style}. ${BRAND.avoid}.`,

    "hero-poster-printing": `A stack of A1 and A2 printed posters on a light table, showing vibrant event and promotional designs. Print studio with neutral background. ${BRAND.style}. ${BRAND.avoid}.`,

    "hero-canvas-prints": `Three stretched canvas prints hanging on a cream wall: a landscape, an abstract, and a photographic print. Gallery-style display, natural side lighting. ${BRAND.style}. ${BRAND.avoid}.`,

    "hero-exhibition-prints": `Exhibition display system with large printed graphics panels showing product images and brand messaging, set up in a trade show hall. Professional exhibition branding. ${BRAND.style}. ${BRAND.avoid}.`,

    "hero-foam-board-correx": `A collection of foam board and correx printed signs and display boards propped against a white wall in a print studio. Clean product shot showing various shapes and sizes. ${BRAND.style}. ${BRAND.avoid}.`,

    // Marketing Print category
    "hero-marketing-print": `A spread of branded marketing print materials on a white desk — flyers, brochures, business cards, and a folder — all in coordinated orange and green colours. Flat-lay photography. ${BRAND.style}. ${BRAND.avoid}.`,

    "hero-flyers-leaflets": `A neat fanned stack of printed A5 leaflets and DL flyers in bright orange and white, showing crisp full-colour print quality. Studio product shot, white background. ${BRAND.style}. ${BRAND.avoid}.`,

    "hero-brochures": `An open brochure and two closed booklets on a white surface, showing a professional B2B print catalogue with strong typography and imagery. High-quality litho print finish. ${BRAND.style}. ${BRAND.avoid}.`,

    "hero-business-cards": `A small pile of thick business cards with rounded corners and a spot UV finish, showing a bold orange logo area and clean white reverse. Close-up product shot, shallow depth of field. ${BRAND.style}. ${BRAND.avoid}.`,

    "hero-letterheads": `A printed company letterhead and matching compliment slip on a wooden desk, showing professional stationery with orange branding at the header. Natural desk lighting. ${BRAND.style}. ${BRAND.avoid}.`,

    "hero-folders": `Two presentation folders — one open showing interior pockets — in glossy orange and white, with a premium print finish. Studio product shot on white. ${BRAND.style}. ${BRAND.avoid}.`,

    "hero-menus": `A restaurant menu in a dark leather-effect cover and a printed card menu insert, shown on a café table setting. Clean, professional menu printing. Natural light. ${BRAND.style}. ${BRAND.avoid}.`,

    // Stickers & Wall Graphics category
    "hero-stickers-labels": `A sheet of custom die-cut stickers in various shapes — circles, ovals, and custom outlines — with full-colour printing on white vinyl. Studio product shot on white. ${BRAND.style}. ${BRAND.avoid}.`,

    "hero-custom-stickers": `Close-up of a roll of custom circular and rectangular stickers being peeled from a backing sheet, showing vibrant full-colour print quality. Studio detail shot. ${BRAND.style}. ${BRAND.avoid}.`,

    "hero-labels": `A collection of product labels in different shapes and finishes — clear, white, and silver foil — on backing rolls. Studio product shot showing label quality. ${BRAND.style}. ${BRAND.avoid}.`,

    "hero-wall-graphics": `Bold large-scale wall graphics applied to an office wall — an inspirational message in modern typography with orange graphic elements. Bright, contemporary office interior. ${BRAND.style}. ${BRAND.avoid}.`,

    "hero-floor-graphics": `Directional floor graphics applied to a polished concrete floor in a retail environment, showing a bright orange arrow and wayfinding text. Wide angle view. ${BRAND.style}. ${BRAND.avoid}.`,

    "hero-window-stickers": `Close-up of circular and square vinyl window stickers and decals applied to a glass window, showing bright colours and crisp printing. UK retail backdrop outside. ${BRAND.style}. ${BRAND.avoid}.`,

    // Workwear & Merchandise category
    "hero-workwear-merchandise": `A folded stack of branded polo shirts and a printed tote bag on a white surface, showing screen-printed and embroidered branding in orange. Clean studio product shot. ${BRAND.style}. ${BRAND.avoid}.`,

    "hero-printed-workwear": `Two printed hi-visibility polo shirts hung on hangers, showing a bold screen-printed company logo and text on the chest. Clean, well-lit product shot. ${BRAND.style}. ${BRAND.avoid}.`,

    "hero-embroidered-uniforms": `Close-up of an embroidered logo on the chest of a navy polo shirt — tight stitch detail showing professional embroidery quality. Studio macro photography. ${BRAND.style}. ${BRAND.avoid}.`,

    "hero-hi-vis": `A collection of hi-visibility safety vests and jackets in orange and yellow, with printed company branding on the back, laid flat on a white surface. ${BRAND.style}. ${BRAND.avoid}.`,

    "hero-merchandise": `A flat-lay of branded promotional merchandise items: printed mugs, pens, notebooks, and tote bags in coordinated orange and green branding. White background studio shot. ${BRAND.style}. ${BRAND.avoid}.`,

    "hero-personalised-gifts": `A selection of personalised gifts — engraved wooden plaque, printed cushion, photo mug, and keyring — arranged on a neutral surface. Warm, gift-shop style photography. ${BRAND.style}. ${BRAND.avoid}.`,

    // Graphic Design category
    "hero-graphic-design": `A designer's workstation showing two monitors with graphic design software (layouts and colour palettes visible), a graphics tablet, and printed proofs on the desk. Modern creative studio. ${BRAND.style}. ${BRAND.avoid}.`,

    "hero-logo-design": `A printed brand sheet showing logo variations — primary, reverse, and mono — laid out on a white desk alongside colour swatches and typography specimens. Studio flat-lay. ${BRAND.style}. ${BRAND.avoid}.`,

    "hero-brand-identity": `An open brand guidelines document showing colour palette, typography, and logo usage on a clean white desk. Brand identity design, professional studio context. ${BRAND.style}. ${BRAND.avoid}.`,

    "hero-print-design": `A collection of print design proofs — leaflets, a brochure, and a poster — spread on a light box, being reviewed. Print studio with professional overhead lighting. ${BRAND.style}. ${BRAND.avoid}.`,

    "hero-artwork-prepress": `A computer monitor showing a vector artwork file open in design software, with colour separations and bleed marks visible. Pre-press workflow, professional print studio. ${BRAND.style}. ${BRAND.avoid}.`,
  };
}

function locationPrompts(): Record<string, string> {
  return {
    "hero-eastbourne": `Eastbourne seafront promenade with Victorian hotels in the background and the pier visible in the distance. Clear day, blue sky with light clouds. East Sussex coastal town. ${BRAND.style}. ${BRAND.avoid}.`,

    "hero-hastings": `Hastings Old Town net huts (black weatherboarded tall fishermen's storage towers) on the Stade beach, with the East Hill cliff railway visible. Sunny East Sussex coastal scene. ${BRAND.style}. ${BRAND.avoid}.`,

    "hero-lewes": `Lewes High Street with independent shops and the distinctive chalk-flint castle on the hill in the background. East Sussex county town, overcast British daylight. ${BRAND.style}. ${BRAND.avoid}.`,

    "hero-bexhill-on-sea": `The De La Warr Pavilion arts centre in Bexhill-on-Sea — its white modernist curved facade facing the seafront. Blue sky, East Sussex coast. ${BRAND.style}. ${BRAND.avoid}.`,

    "hero-uckfield": `Uckfield High Street with a mix of independent shops and period buildings, gentle hills visible beyond the town. Quiet East Sussex market town, natural daylight. ${BRAND.style}. ${BRAND.avoid}.`,

    "hero-crowborough": `Crowborough town centre with small shops and the characteristic East Sussex High Weald landscape visible beyond the rooftops. Overcast British daylight. ${BRAND.style}. ${BRAND.avoid}.`,

    "hero-seaford": `Seaford seafront and esplanade with the distinctive chalk headland of Seaford Head visible in the background. Grey-blue sea, East Sussex coastal town, natural light. ${BRAND.style}. ${BRAND.avoid}.`,

    "hero-hailsham": `Hailsham town centre market street with traders and period shopfronts. Bustling East Sussex market town, natural British daylight. ${BRAND.style}. ${BRAND.avoid}.`,

    "hero-newhaven": `Newhaven harbour with the ferry terminal and lighthouse visible, industrial port setting with the chalk cliffs of the River Ouse beyond. East Sussex port town. ${BRAND.style}. ${BRAND.avoid}.`,

    "hero-polegate": `Polegate village high street with small shops and a quiet residential character. East Sussex village, natural daylight, Eastbourne visible on the horizon. ${BRAND.style}. ${BRAND.avoid}.`,

    "hero-peacehaven": `Peacehaven clifftop promenade looking along the white chalk cliffs of the South Downs coast towards Brighton. East Sussex coastal village, clear day. ${BRAND.style}. ${BRAND.avoid}.`,

    "hero-battle": `Battle Abbey gatehouse — the dramatic medieval stone gateway arch with the surrounding Abbey grounds visible in Battle High Street, East Sussex. Overcast British daylight. ${BRAND.style}. ${BRAND.avoid}.`,

    "hero-st-leonards-on-sea": `St Leonards-on-Sea seafront with the elegant Regency-era buildings facing the promenade, Hastings pier visible in the distance. East Sussex coastal town. ${BRAND.style}. ${BRAND.avoid}.`,

    "hero-heathfield": `Heathfield town centre with the church tower and High Weald countryside visible in the background. Small East Sussex market town, natural daylight. ${BRAND.style}. ${BRAND.avoid}.`,

    "hero-pevensey": `Pevensey Castle ruins — the Roman and medieval walls against a blue East Sussex sky, with the village beyond. Ancient stone fortifications, natural daylight. ${BRAND.style}. ${BRAND.avoid}.`,

    "hero-ringmer": `Ringmer village green with the cricket pitch and traditional English village scene, South Downs visible in the background. East Sussex village, sunny summer day. ${BRAND.style}. ${BRAND.avoid}.`,

    "hero-herstmonceux": `Herstmonceux Castle — the beautiful moated red-brick medieval castle in its green East Sussex parkland setting. Clear sky, late afternoon light. ${BRAND.style}. ${BRAND.avoid}.`,

    "hero-wadhurst": `Wadhurst High Street with its characteristic sandstone buildings and the church spire rising above the East Sussex village rooftops. Overcast British daylight. ${BRAND.style}. ${BRAND.avoid}.`,

    "hero-alfriston": `The picturesque village of Alfriston with the River Cuckmere winding through meadows, the church and thatched cottages visible. South Downs, East Sussex. ${BRAND.style}. ${BRAND.avoid}.`,
  };
}

function blogAndProjectPrompts(): Record<string, string> {
  return {
    "blog-vehicle-graphics-guide": `A white van with professional orange and green vinyl vehicle graphics and lettering parked in front of an East Sussex high street. Editorial photography style, used as article header image. ${BRAND.style}. ${BRAND.avoid}.`,

    "blog-shop-signs-guide": `A UK high street with a variety of shop fascia signs — illuminated boxes, flat cut letters, and projecting signs — on period and modern buildings. Editorial wide-angle photography. ${BRAND.style}. ${BRAND.avoid}.`,

    "project-fleet-eastbourne": `Four matching branded white vans for a trade business lined up in a car park, all with identical orange and green livery. Fleet branding project, Eastbourne commercial area in background. ${BRAND.style}. ${BRAND.avoid}.`,

    "project-fleet-eastbourne-1": `Close-up of the driver's door of a branded white transit van showing crisp orange and green vehicle graphics with a company name and phone number. Sharp detail shot. ${BRAND.style}. ${BRAND.avoid}.`,

    "project-fleet-eastbourne-2": `Rear three-quarter view of a branded white panel van with full rear door graphics and side panel lettering. The van is parked on a commercial estate in East Sussex. ${BRAND.style}. ${BRAND.avoid}.`,

    "project-fleet-eastbourne-3": `Two branded trade vans driving side by side on an East Sussex road, both showing matching orange and green vehicle livery. Dynamic editorial photography, motion blur on background. ${BRAND.style}. ${BRAND.avoid}.`,
  };
}

// ---------------------------------------------------------------------------
// Task builders
// ---------------------------------------------------------------------------

function buildServiceTasks(limit?: number): ImageTask[] {
  const prompts = servicePrompts();
  const tasks: ImageTask[] = Object.entries(prompts).map(([filename, prompt]) => {
    const id = `service-${filename}`;
    return {
      id,
      type: "service",
      filename: `${filename}.webp`,
      title: filename.replace(/^hero-/, "").replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase()),
      prompt,
      outputPath: path.join(OUTPUT_DIR, "services", `${filename}.jpg`),
      r2Key: `mad-graphics/services/${filename}.jpg`,
    };
  });
  return limit ? tasks.slice(0, limit) : tasks;
}

function buildLocationTasks(limit?: number): ImageTask[] {
  const prompts = locationPrompts();
  const tasks: ImageTask[] = Object.entries(prompts).map(([filename, prompt]) => {
    const id = `location-${filename}`;
    return {
      id,
      type: "location",
      filename: `${filename}.webp`,
      title: filename.replace(/^hero-/, "").replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase()),
      prompt,
      outputPath: path.join(OUTPUT_DIR, "locations", `${filename}.jpg`),
      r2Key: `mad-graphics/locations/${filename}.jpg`,
    };
  });
  return limit ? tasks.slice(0, limit) : tasks;
}

function buildBlogProjectTasks(): ImageTask[] {
  const prompts = blogAndProjectPrompts();
  return Object.entries(prompts).map(([filename, prompt]) => {
    const isBlog = filename.startsWith("blog-");
    const isProject = filename.startsWith("project-");
    const type = isBlog ? "blog" : "project";
    const folder = isBlog ? "blog" : "projects";
    return {
      id: `${type}-${filename}`,
      type: type as "blog" | "project",
      filename: `${filename}.webp`,
      title: filename.replace(/^(blog|project)-/, "").replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase()),
      prompt,
      outputPath: path.join(OUTPUT_DIR, folder, `${filename}.jpg`),
      r2Key: `mad-graphics/${folder}/${filename}.jpg`,
    };
  });
}

// ---------------------------------------------------------------------------
// Image generation
// ---------------------------------------------------------------------------

async function generateImage(
  task: ImageTask,
  genAI: GoogleGenerativeAI,
  retryCount = 0
): Promise<boolean> {
  console.log(`\n  Generating: ${task.title}`);
  console.log(`  Prompt: ${task.prompt.substring(0, 120)}...`);

  try {
    const model = genAI.getGenerativeModel({
      model: GEMINI_MODEL,
      generationConfig: {
        // @ts-expect-error - responseModalities not yet in TS types
        responseModalities: ["TEXT", "IMAGE"],
      },
    });

    const result = await model.generateContent(task.prompt);
    const parts = result.response.candidates?.[0]?.content?.parts;

    if (!parts?.length) throw new Error("No content parts in API response");

    let imageBuffer: Buffer | null = null;
    for (const part of parts) {
      if (part.inlineData?.data) {
        imageBuffer = Buffer.from(part.inlineData.data, "base64");
        break;
      }
    }

    if (!imageBuffer) throw new Error("No image data in response");

    const dir = path.dirname(task.outputPath);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

    fs.writeFileSync(task.outputPath, imageBuffer);
    console.log(`  Saved: ${task.outputPath}`);
    return true;
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);

    // Rate limit — retry with backoff
    if ((msg.includes("429") || msg.includes("quota") || msg.includes("rate")) && retryCount < MAX_RETRIES) {
      const wait = BACKOFF_MS * (retryCount + 1);
      console.warn(`  Rate limited. Waiting ${wait / 1000}s before retry ${retryCount + 1}/${MAX_RETRIES}...`);
      await new Promise((r) => setTimeout(r, wait));
      return generateImage(task, genAI, retryCount + 1);
    }

    console.error(`  Failed: ${msg}`);
    return false;
  }
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main(): Promise<void> {
  const args = process.argv.slice(2);

  const typeArg = args.find((a) => a.startsWith("--type="))?.split("=")[1]
    ?? (args.includes("--type") ? args[args.indexOf("--type") + 1] : "all");

  const limitArg = args.find((a) => a.startsWith("--limit="))?.split("=")[1]
    ?? (args.includes("--limit") ? args[args.indexOf("--limit") + 1] : undefined);

  const limit = limitArg ? parseInt(limitArg, 10) : undefined;
  const dryRun = args.includes("--dry-run");

  const apiKey = process.env.GOOGLE_AI_API_KEY;
  if (!apiKey && !dryRun) {
    console.error("\nError: GOOGLE_AI_API_KEY not set in .env.local");
    process.exit(1);
  }

  let tasks: ImageTask[] = [];

  if (typeArg === "all" || typeArg === "services") {
    tasks.push(...buildServiceTasks(typeArg === "services" ? limit : undefined));
  }
  if (typeArg === "all" || typeArg === "locations") {
    tasks.push(...buildLocationTasks(typeArg === "locations" ? limit : undefined));
  }
  if (typeArg === "all" || typeArg === "blog" || typeArg === "projects") {
    tasks.push(...buildBlogProjectTasks());
  }

  if (typeArg === "all" && limit) {
    tasks = tasks.slice(0, limit);
  }

  console.log(`\nMad Graphics — Image Generation`);
  console.log(`================================`);
  console.log(`Type: ${typeArg} | Total: ${tasks.length} images | Dry run: ${dryRun}`);
  console.log(`  Services:  ${tasks.filter((t) => t.type === "service").length}`);
  console.log(`  Locations: ${tasks.filter((t) => t.type === "location").length}`);
  console.log(`  Blog:      ${tasks.filter((t) => t.type === "blog").length}`);
  console.log(`  Projects:  ${tasks.filter((t) => t.type === "project").length}`);
  console.log(``);

  if (dryRun) {
    console.log("Dry run — tasks that would be generated:");
    tasks.forEach((t) => console.log(`  [${t.type}] ${t.filename} → ${t.r2Key}`));
    return;
  }

  const genAI = new GoogleGenerativeAI(apiKey!);
  let completed = 0;
  let failed = 0;

  for (let i = 0; i < tasks.length; i++) {
    const task = tasks[i];
    console.log(`\n[${i + 1}/${tasks.length}] ${task.type.toUpperCase()}: ${task.title}`);

    const success = await generateImage(task, genAI);
    if (success) completed++; else failed++;

    if (i < tasks.length - 1) {
      await new Promise((r) => setTimeout(r, REQUEST_DELAY_MS));
    }
  }

  console.log(`\n================================`);
  console.log(`Generation complete`);
  console.log(`  Completed: ${completed}`);
  console.log(`  Failed:    ${failed}`);
  console.log(`  Output:    ${OUTPUT_DIR}`);
  console.log(``);
  console.log(`Next steps:`);
  console.log(`  1. Review images in: ${OUTPUT_DIR}`);
  console.log(`  2. Upload to R2:     tsx tools/upload-mad-graphics-images.ts`);
  console.log(`  3. Update MDX refs:  tsx tools/update-mad-graphics-mdx.ts`);
}

main().catch((err) => {
  console.error("\nFatal:", err);
  process.exit(1);
});
