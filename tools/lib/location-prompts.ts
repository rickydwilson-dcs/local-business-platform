/**
 * Location Page Generation Prompts
 *
 * Prompt templates for generating location-specific content using AI.
 * Each prompt is designed to produce structured output matching the
 * LocationFrontmatterSchema from content-schemas.ts.
 */

import type {
  BusinessContext,
  LocationDefinition,
  LocationHeroSection,
  SpecialistsSection,
  LocationServicesSection,
  FAQItem,
  LocationPricingSection,
} from "./content-generator-types";

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Build location context string for prompts
 *
 * @param location - Location definition
 * @returns Formatted context string
 */
function buildLocationContext(location: LocationDefinition): string {
  const parts: string[] = [];

  parts.push(`Location: ${location.name}`);

  if (location.localAuthority) {
    parts.push(`Local Authority: ${location.localAuthority}`);
  }

  if (location.type) {
    parts.push(`Location Type: ${location.type}`);
  }

  if (location.isCoastal) {
    parts.push(
      "This is a coastal location - consider sea air, coastal winds, and marine environments."
    );
  }

  if (location.hasHeritage) {
    parts.push(
      "This location has heritage/conservation areas - consider historic buildings and planning requirements."
    );
  }

  if (location.landmarks && location.landmarks.length > 0) {
    parts.push(`Notable Landmarks: ${location.landmarks.join(", ")}`);
  }

  if (location.buildingTypes && location.buildingTypes.length > 0) {
    parts.push(`Common Building Types: ${location.buildingTypes.join(", ")}`);
  }

  if (location.neighborhoods && location.neighborhoods.length > 0) {
    parts.push(`Neighborhoods/Districts: ${location.neighborhoods.join(", ")}`);
  }

  return parts.join("\n");
}

/**
 * Build business context string for prompts
 *
 * @param context - Business context
 * @returns Formatted business context string
 */
function buildBusinessContext(context: BusinessContext): string {
  const parts: string[] = [];

  parts.push(`Business: ${context.business.name}`);
  parts.push(`Industry: ${context.business.industry}`);
  parts.push(`Phone: ${context.business.phone}`);

  if (context.credentials) {
    parts.push(`Certifications: ${context.credentials.certifications.join(", ")}`);
    parts.push(`Insurance: ${context.credentials.insurance}`);
  }

  if (context.services && context.services.length > 0) {
    const serviceNames = context.services.map((s) => s.title).slice(0, 10);
    parts.push(`Services Offered: ${serviceNames.join(", ")}`);
  }

  if (context.brandVoice) {
    parts.push(`Brand Voice: ${context.brandVoice.tone}`);
  }

  return parts.join("\n");
}

// ============================================================================
// Hero Section Prompt
// ============================================================================

/**
 * Get prompt for generating hero section content
 *
 * @param context - Business context
 * @param location - Location definition
 * @returns Prompt string for hero section generation
 */
export function getLocationHeroPrompt(
  context: BusinessContext,
  location: LocationDefinition
): string {
  return `Generate hero section content for a ${context.business.industry} services page targeting ${location.name}.

BUSINESS CONTEXT:
${buildBusinessContext(context)}

LOCATION CONTEXT:
${buildLocationContext(location)}

REQUIREMENTS:
- title: Professional title for the page hero (e.g., "Professional Scaffolding Services in ${location.name}")
  - Should include the location name
  - Should be compelling and professional
  - 5-80 characters

- description: A compelling 1-2 sentence description highlighting:
  - Local expertise and knowledge of the area
  - Specific challenges or building types in ${location.name}
  - Professional service promise
  - 20-200 characters

- trustBadges: Array of 3-4 short trust indicators (e.g., "TG20:21 Compliant", "CHAS Accredited")
  - Include relevant certifications from business credentials
  - Keep each badge 3-25 characters

- ctaText: Call-to-action button text (e.g., "Get Your Free ${location.name} Quote")
  - Should include location name
  - Action-oriented language
  - 5-40 characters

- ctaUrl: Always "/contact"

IMPORTANT:
- Be specific to ${location.name} - mention local landmarks, building types, or area characteristics
- Avoid generic phrases that could apply to any location
- Use professional, confident tone
- Do not use emojis`;
}

/**
 * JSON Schema for hero section structured output
 */
export const HERO_SECTION_SCHEMA = {
  type: "object",
  properties: {
    title: {
      type: "string",
      description: "Hero title including location name (5-80 chars)",
    },
    description: {
      type: "string",
      description: "Compelling description highlighting local expertise (20-200 chars)",
    },
    trustBadges: {
      type: "array",
      items: { type: "string" },
      description: "3-4 short trust indicators",
    },
    ctaText: {
      type: "string",
      description: "Call-to-action button text (5-40 chars)",
    },
    ctaUrl: {
      type: "string",
      description: "CTA URL (always /contact)",
    },
  },
  required: ["title", "description", "trustBadges", "ctaText", "ctaUrl"],
};

// ============================================================================
// Specialists Section Prompt
// ============================================================================

/**
 * Get prompt for generating specialists section content
 *
 * @param context - Business context
 * @param location - Location definition
 * @returns Prompt string for specialists section generation
 */
export function getLocationSpecialistsPrompt(
  context: BusinessContext,
  location: LocationDefinition
): string {
  return `Generate a specialists section for a ${context.business.industry} services page in ${location.name}.

BUSINESS CONTEXT:
${buildBusinessContext(context)}

LOCATION CONTEXT:
${buildLocationContext(location)}

REQUIREMENTS:
- title: Section title (e.g., "${location.name} ${context.business.industry} Specialists")
  - Should include location name
  - 5-60 characters

- description: A detailed paragraph (200-500 characters) describing:
  - Years of local experience
  - Specific knowledge of ${location.name}'s challenges
  - Understanding of local building types, neighborhoods, and requirements
  - Personal, knowledgeable tone as if written by someone who genuinely knows the area
  - Reference specific areas, neighborhoods, or challenges unique to ${location.name}

- cards: Exactly 3 specialist cards, each representing a key area of expertise for ${location.name}:

  For each card:
  - title: Short expertise area title (3-40 chars)
  - description: Detailed description of this expertise (20-150 chars)
  - details: Array of 3-5 specific capabilities or features (each 5-50 chars)

CARD THEMES TO CONSIDER:
${location.isCoastal ? "- Coastal/marine expertise (wind resistance, salt corrosion)" : ""}
${location.hasHeritage ? "- Heritage/conservation expertise (listed buildings, planning)" : ""}
- Local building type expertise (based on common building types in the area)
- Special challenges unique to this location

IMPORTANT:
- Each card should be genuinely different and location-specific
- Reference actual characteristics of ${location.name}
- Use professional, confident language
- Avoid generic descriptions that could apply anywhere
- Do not use emojis`;
}

/**
 * JSON Schema for specialists section structured output
 */
export const SPECIALISTS_SECTION_SCHEMA = {
  type: "object",
  properties: {
    title: {
      type: "string",
      description: "Section title with location name (5-60 chars)",
    },
    description: {
      type: "string",
      description: "Detailed paragraph about local expertise (200-500 chars)",
    },
    cards: {
      type: "array",
      items: {
        type: "object",
        properties: {
          title: {
            type: "string",
            description: "Card title (3-40 chars)",
          },
          description: {
            type: "string",
            description: "Card description (20-150 chars)",
          },
          details: {
            type: "array",
            items: { type: "string" },
            description: "3-5 specific capabilities (each 5-50 chars)",
          },
        },
        required: ["title", "description", "details"],
      },
      minItems: 3,
      maxItems: 3,
      description: "Exactly 3 specialist cards",
    },
  },
  required: ["title", "description", "cards"],
};

// ============================================================================
// Services Section Prompt
// ============================================================================

/**
 * Get prompt for generating services section content
 *
 * @param context - Business context
 * @param location - Location definition
 * @returns Prompt string for services section generation
 */
export function getLocationServicesPrompt(
  context: BusinessContext,
  location: LocationDefinition
): string {
  const serviceList = context.services.map((s) => `- ${s.title} (slug: ${s.slug})`).join("\n");

  return `Generate a services section for a ${context.business.industry} page in ${location.name}.

BUSINESS CONTEXT:
${buildBusinessContext(context)}

AVAILABLE SERVICES:
${serviceList}

LOCATION CONTEXT:
${buildLocationContext(location)}

REQUIREMENTS:
- title: Section title (e.g., "Complete ${location.name} ${context.business.industry} Solutions")
  - 5-80 characters

- description: Brief section intro (50-150 chars) about comprehensive capabilities

- cards: Generate 6-9 service cards representing the most relevant services for ${location.name}

For each card:
- title: Service name (3-50 chars)
- subtitle: Array of 2 location-specific applications (e.g., ["Victorian Terraces", "Modern Homes"])
- description: Location-specific service description (20-150 chars)
  - MUST reference ${location.name} or its characteristics
  - Explain how this service applies to local needs
- features: Array of 5 specific features or capabilities (each 5-50 chars)
- href: Service page link - use format "/services/{service-slug}" for core services
        or "/contact" for specialist services
- ctaText: Short CTA like "Learn More" or "Get Quote" (5-20 chars)

SERVICE CARD CATEGORIES TO INCLUDE:
1. Core services (Commercial, Residential, Industrial) - link to /services/{slug}
2. Location-specific applications (heritage, coastal, etc.) - link to /contact
3. Specialist services relevant to ${location.name} - link to /contact
4. Emergency/support services - link to /contact

IMPORTANT:
- Each card description MUST mention ${location.name} or its specific characteristics
- Subtitles should reference actual areas, building types, or features in ${location.name}
- Features should be relevant to local needs
- Mix of service page links and contact page links
- Do not use emojis`;
}

/**
 * JSON Schema for services section structured output
 */
export const SERVICES_SECTION_SCHEMA = {
  type: "object",
  properties: {
    title: {
      type: "string",
      description: "Section title (5-80 chars)",
    },
    description: {
      type: "string",
      description: "Brief section intro (50-150 chars)",
    },
    cards: {
      type: "array",
      items: {
        type: "object",
        properties: {
          title: {
            type: "string",
            description: "Service name (3-50 chars)",
          },
          subtitle: {
            type: "array",
            items: { type: "string" },
            description: "2 location-specific applications",
          },
          description: {
            type: "string",
            description: "Location-specific description (20-150 chars)",
          },
          features: {
            type: "array",
            items: { type: "string" },
            description: "5 features (each 5-50 chars)",
          },
          href: {
            type: "string",
            description: "Service link (/services/slug or /contact)",
          },
          ctaText: {
            type: "string",
            description: "CTA text (5-20 chars)",
          },
        },
        required: ["title", "subtitle", "description", "features", "href", "ctaText"],
      },
      minItems: 6,
      maxItems: 9,
      description: "6-9 service cards",
    },
  },
  required: ["title", "description", "cards"],
};

// ============================================================================
// FAQs Prompt
// ============================================================================

/**
 * Get prompt for generating FAQ content
 *
 * @param context - Business context
 * @param location - Location definition
 * @returns Prompt string for FAQ generation
 */
export function getLocationFAQsPrompt(
  context: BusinessContext,
  location: LocationDefinition
): string {
  return `Generate location-specific FAQs for a ${context.business.industry} services page in ${location.name}.

BUSINESS CONTEXT:
${buildBusinessContext(context)}

LOCATION CONTEXT:
${buildLocationContext(location)}

REQUIREMENTS:
Generate 6-10 FAQs that are specifically relevant to ${location.name}.

For each FAQ:
- question: A genuine question a customer in ${location.name} might ask (10-150 chars)
  - Should reference ${location.name} or its characteristics when relevant
  - Cover practical concerns about services in this area

- answer: A helpful, professional answer (20-300 chars)
  - Should be specific and informative
  - Reference local knowledge when appropriate
  - Include relevant details about certifications, processes, or capabilities

FAQ TOPICS TO COVER:
1. Response time / availability in ${location.name}
2. Planning permissions and local authority processes${location.localAuthority ? ` (mention ${location.localAuthority})` : ""}
${location.isCoastal ? "3. Coastal/weather considerations" : ""}
${location.hasHeritage ? "3. Heritage building and conservation area expertise" : ""}
4. Pricing and quotes for ${location.name} projects
5. Insurance and safety certifications
6. Specific building type expertise (Victorian, modern, etc.)
7. Emergency services availability
8. Working in busy areas or around pedestrians

IMPORTANT:
- Questions should feel natural, like real customer inquiries
- Answers should be helpful and build trust
- Reference ${location.name} specifically where appropriate
- Include at least one FAQ about local authority/permits
- Include at least one FAQ about pricing
- Do not use emojis`;
}

/**
 * JSON Schema for FAQs structured output
 */
export const FAQS_SCHEMA = {
  type: "object",
  properties: {
    faqs: {
      type: "array",
      items: {
        type: "object",
        properties: {
          question: {
            type: "string",
            description: "FAQ question (10-150 chars)",
          },
          answer: {
            type: "string",
            description: "FAQ answer (20-300 chars)",
          },
        },
        required: ["question", "answer"],
      },
      minItems: 6,
      maxItems: 10,
      description: "6-10 location-specific FAQs",
    },
  },
  required: ["faqs"],
};

// ============================================================================
// Pricing Section Prompt
// ============================================================================

/**
 * Get prompt for generating pricing section content
 *
 * @param context - Business context
 * @param location - Location definition
 * @returns Prompt string for pricing section generation
 */
export function getLocationPricingPrompt(
  context: BusinessContext,
  location: LocationDefinition
): string {
  const pricingContext = context.pricing
    ? `
Default Pricing Ranges:
- Domestic: £${context.pricing.domestic.min} - £${context.pricing.domestic.max}
- Commercial: £${context.pricing.commercial.min} - £${context.pricing.commercial.max}
${context.pricing.specialist ? `- Specialist: £${context.pricing.specialist.min} - £${context.pricing.specialist.max}` : ""}`
    : "";

  return `Generate a pricing section for a ${context.business.industry} services page in ${location.name}.

BUSINESS CONTEXT:
${buildBusinessContext(context)}
${pricingContext}

LOCATION CONTEXT:
${buildLocationContext(location)}

REQUIREMENTS:
- title: Section title (e.g., "${location.name} ${context.business.industry} Costs & Estimates")
  - 5-60 characters

- description: Brief intro like "Typical ${location.name} Project Investment"
  - 10-60 characters

- packages: Generate exactly 3 pricing packages

For each package:
- name: Package name (e.g., "Domestic Projects", "Commercial Projects", "Heritage & Specialist")
  - 5-30 characters

- description: Brief description tailored to ${location.name} (50-150 chars)
  - Reference local building types or project types

- price: Price range as string (e.g., "£900 - £1,350")
  - Adjust based on location characteristics (coastal/heritage may be higher)

- duration: Typical duration (e.g., "6-8 weeks typical")
  - 5-30 characters

- popular: Set to true for the middle/commercial package only

- features: Array of 5 features with inclusion status
  Each feature has:
  - text: Feature description (5-40 chars)
  - included: boolean (always true for these packages)

- ctaText: "Get Free Quote" (fixed)
- ctaUrl: "/contact" (fixed)

PACKAGE STRUCTURE:
1. Domestic/Residential - lower price range, home-focused features
2. Commercial - mid-high range, business/complex project features (mark as popular)
3. Specialist/Heritage - variable range based on complexity, specialist features

IMPORTANT:
- Prices should feel realistic for ${location.name}
- Descriptions should reference local building types
- Features should be relevant to each package type
${location.hasHeritage ? "- Include heritage-specific features for specialist package" : ""}
${location.isCoastal ? "- Consider coastal factors in pricing and features" : ""}
- Do not use emojis`;
}

/**
 * JSON Schema for pricing section structured output
 */
export const PRICING_SECTION_SCHEMA = {
  type: "object",
  properties: {
    title: {
      type: "string",
      description: "Section title (5-60 chars)",
    },
    description: {
      type: "string",
      description: "Brief intro (10-60 chars)",
    },
    packages: {
      type: "array",
      items: {
        type: "object",
        properties: {
          name: {
            type: "string",
            description: "Package name (5-30 chars)",
          },
          description: {
            type: "string",
            description: "Package description (50-150 chars)",
          },
          price: {
            type: "string",
            description: "Price range (e.g., '£900 - £1,350')",
          },
          duration: {
            type: "string",
            description: "Typical duration (5-30 chars)",
          },
          popular: {
            type: "boolean",
            description: "Whether this is the featured package",
          },
          features: {
            type: "array",
            items: {
              type: "object",
              properties: {
                text: {
                  type: "string",
                  description: "Feature text (5-40 chars)",
                },
                included: {
                  type: "boolean",
                  description: "Whether feature is included",
                },
              },
              required: ["text", "included"],
            },
            description: "5 features with inclusion status",
          },
          ctaText: {
            type: "string",
            description: "CTA text (fixed: 'Get Free Quote')",
          },
          ctaUrl: {
            type: "string",
            description: "CTA URL (fixed: '/contact')",
          },
        },
        required: ["name", "description", "price", "duration", "features", "ctaText", "ctaUrl"],
      },
      minItems: 3,
      maxItems: 3,
      description: "Exactly 3 pricing packages",
    },
  },
  required: ["title", "description", "packages"],
};

// ============================================================================
// Complete Location Content Schema
// ============================================================================

/**
 * Get the complete JSON Schema for structured location content output
 *
 * This schema is used when generating all content in a single AI call.
 *
 * @returns Complete JSON Schema object
 */
export function getLocationSchemaForStructured(): object {
  return {
    type: "object",
    properties: {
      title: {
        type: "string",
        description: "Location name (2-50 chars)",
      },
      seoTitle: {
        type: "string",
        description: "SEO title (10-80 chars)",
      },
      description: {
        type: "string",
        description: "Meta description (50-200 chars)",
      },
      keywords: {
        type: "array",
        items: { type: "string" },
        description: "3-12 SEO keywords",
      },
      hero: HERO_SECTION_SCHEMA,
      specialists: SPECIALISTS_SECTION_SCHEMA,
      services: SERVICES_SECTION_SCHEMA,
      faqs: {
        type: "array",
        items: {
          type: "object",
          properties: {
            question: { type: "string" },
            answer: { type: "string" },
          },
          required: ["question", "answer"],
        },
        description: "6-10 FAQs",
      },
      pricing: PRICING_SECTION_SCHEMA,
    },
    required: [
      "title",
      "seoTitle",
      "description",
      "keywords",
      "hero",
      "specialists",
      "services",
      "faqs",
      "pricing",
    ],
  };
}

// ============================================================================
// System Prompts
// ============================================================================

/**
 * Get system prompt for location content generation
 *
 * @param context - Business context
 * @returns System prompt string
 */
export function getLocationSystemPrompt(context: BusinessContext): string {
  return `You are a professional content writer specializing in local service business websites.

Your task is to generate high-quality, location-specific content for ${context.business.industry} service pages.

WRITING GUIDELINES:
- Write in a professional, confident, and approachable tone
- Be specific to each location - avoid generic content that could apply anywhere
- Reference local landmarks, building types, neighborhoods, and challenges
- Use British English spelling and conventions
- Prices should be in GBP (£)
- Phone numbers should be in UK format
- Include relevant industry certifications and qualifications
- Focus on building trust and demonstrating local expertise

CONTENT REQUIREMENTS:
- All content must be unique and specifically tailored to the target location
- Descriptions should feel genuinely knowledgeable about the area
- FAQs should address real customer concerns
- Service descriptions should explain how services apply to local needs
- Pricing should feel realistic for the UK market

AVOID:
- Generic phrases that could apply to any location
- Emojis
- Excessive marketing language
- Claims that cannot be verified
- American English spellings

${context.brandVoice ? `BRAND VOICE: ${context.brandVoice.tone}` : ""}
${context.brandVoice?.avoidWords ? `WORDS TO AVOID: ${context.brandVoice.avoidWords.join(", ")}` : ""}`;
}
