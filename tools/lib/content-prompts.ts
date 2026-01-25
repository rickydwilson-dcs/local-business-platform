/**
 * Content Prompt Templates
 *
 * AI prompt templates for generating service and location page content.
 * These prompts are designed for use with Claude and Gemini structured output.
 */

import type {
  BusinessContext,
  ServiceDefinition,
  FAQItem,
  AboutSection,
} from "./content-generator-types";
import { formatPricing } from "./business-context";

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Build business context summary for prompts
 */
function buildContextSummary(context: BusinessContext): string {
  const credsList = context.credentials.certifications.join(", ");
  const regionsList = context.regions.map((r) => r.name).join(", ");

  return `
Business: ${context.business.name}
Industry: ${context.business.industry}
Coverage: ${regionsList}
Certifications: ${credsList}
Insurance: ${context.credentials.insurance}
Team: ${context.credentials.teamQualifications}
Domestic pricing: ${formatPricing(context.pricing.domestic)}
Commercial pricing: ${formatPricing(context.pricing.commercial)}
${context.brandVoice ? `Brand voice: ${context.brandVoice.tone}` : ""}
${context.brandVoice?.avoidWords ? `Avoid words: ${context.brandVoice.avoidWords.join(", ")}` : ""}
`.trim();
}

/**
 * Build service context for prompts
 */
function buildServiceContext(service: ServiceDefinition): string {
  return `
Service: ${service.title}
Slug: ${service.slug}
Category: ${service.category}
Key Features:
${service.keyFeatures.map((f) => `- ${f}`).join("\n")}
Related Services: ${service.relatedServices.join(", ") || "none"}
`.trim();
}

// ============================================================================
// Prompt Templates
// ============================================================================

/**
 * Get prompt for generating SEO meta description
 *
 * @param context - Business context
 * @param service - Service to generate description for
 * @returns Prompt string for AI generation
 *
 * Requirements:
 * - 50-200 characters (target 160 for optimal SEO)
 * - Include primary keyword
 * - Include call to action or USP
 * - Professional, engaging tone
 */
export function getServiceDescriptionPrompt(
  context: BusinessContext,
  service: ServiceDefinition
): string {
  return `You are an SEO copywriter creating a meta description for a service page.

BUSINESS CONTEXT:
${buildContextSummary(context)}

SERVICE:
${buildServiceContext(service)}

REQUIREMENTS:
- Length: 120-160 characters (STRICTLY enforced - count carefully)
- Include the service name naturally
- Include a credibility marker (certification or experience)
- Include a call to action ("Free quotes", "Contact us today")
- Make it compelling for search users to click
- Do NOT use emojis
- Professional UK English spelling

EXAMPLES OF GOOD DESCRIPTIONS:
- "Professional residential scaffolding from £800. TG20:21 compliant, CISRS teams, fully insured. Home extensions, roofing, and repairs. Free quotes."
- "Expert access scaffolding across the South East. TG20:21 compliant, fully insured, CHAS-accredited. Free quotes for residential and commercial projects."

Generate a meta description for ${service.title}.`;
}

/**
 * Get prompt for generating service about section
 *
 * @param context - Business context
 * @param service - Service to generate about for
 * @returns Prompt string for AI generation
 *
 * Requirements:
 * - whatIs: 50+ characters, clear explanation
 * - whenNeeded: 4+ scenarios (each 10+ chars)
 * - whatAchieve: 4+ benefits (each 10+ chars)
 * - keyPoints: 3+ highlights (each 10+ chars)
 */
export function getServiceAboutPrompt(
  context: BusinessContext,
  service: ServiceDefinition
): string {
  return `You are a technical copywriter creating the "About" section for a service page.

BUSINESS CONTEXT:
${buildContextSummary(context)}

SERVICE:
${buildServiceContext(service)}

REQUIREMENTS:
1. whatIs (string, min 50 chars):
   - Clear, professional explanation of what this service is
   - Reference relevant industry standards/compliance where applicable
   - Mention target customers (residential/commercial/industrial as appropriate)

2. whenNeeded (array of 6-8 strings, each min 10 chars):
   - Specific scenarios when customers need this service
   - Be concrete and practical
   - Mix of residential and commercial use cases if applicable

3. whatAchieve (array of 6-8 strings, each min 10 chars):
   - Outcomes and benefits customers get
   - Focus on safety, quality, compliance, and convenience
   - Include practical benefits like "Protection for your property"

4. keyPoints (array of 3-4 strings, each min 10 chars):
   - Top highlights that differentiate this service
   - Include certifications/compliance where relevant
   - Include customer-friendly benefits

TONE: Professional, knowledgeable, reassuring
DO NOT use emojis or marketing hyperbole
Use UK English spelling

Generate the about section for ${service.title}.`;
}

/**
 * Get prompt for generating service FAQs
 *
 * @param context - Business context
 * @param service - Service to generate FAQs for
 * @returns Prompt string for AI generation
 *
 * Requirements:
 * - 8-12 FAQs (min 3, max 15)
 * - Questions: min 10 chars, clear user intent
 * - Answers: min 20 chars, informative and helpful
 */
export function getServiceFAQsPrompt(context: BusinessContext, service: ServiceDefinition): string {
  const pricingExample =
    service.category === "specialist"
      ? formatPricing(context.pricing.specialist || context.pricing.commercial)
      : service.category === "core"
        ? formatPricing(context.pricing.domestic)
        : formatPricing(context.pricing.commercial);

  return `You are a customer service expert creating FAQs for a service page.

BUSINESS CONTEXT:
${buildContextSummary(context)}

SERVICE:
${buildServiceContext(service)}

PRICING GUIDANCE:
- Typical ${service.category} project range: ${pricingExample}

REQUIREMENTS:
1. Generate 10-12 unique FAQs
2. Each question must be:
   - At least 10 characters
   - Written from the customer's perspective
   - Use "you/your" language (e.g., "How quickly can you install...")

3. Each answer must be:
   - At least 50 characters (be informative!)
   - Helpful, specific, and accurate
   - Include specific details where possible (timeframes, processes, certifications)
   - Reference ${context.business.name}'s credentials when relevant

4. Required FAQ topics (include at least one of each):
   - Pricing/cost expectations
   - Installation timeline/process
   - Safety and compliance (TG20:21, CISRS, etc.)
   - Insurance and documentation
   - What's included in the service
   - How to get started/book

5. Additional topics to consider:
   - Property/garden protection
   - Weather considerations
   - Neighbor considerations
   - Adaptations/modifications
   - Technical specifications

TONE: Helpful, professional, reassuring
DO NOT use emojis
Use UK English spelling
Be specific - avoid generic answers

Generate FAQs for ${service.title}.`;
}

/**
 * Get the full prompt for generating complete service frontmatter
 *
 * @param context - Business context
 * @param service - Service to generate frontmatter for
 * @returns Prompt string for AI generation
 */
export function getServiceFrontmatterPrompt(
  context: BusinessContext,
  service: ServiceDefinition
): string {
  return `You are a professional content writer creating frontmatter for a service page.

BUSINESS CONTEXT:
${buildContextSummary(context)}

SERVICE:
${buildServiceContext(service)}

Generate complete frontmatter for this service page with the following sections:

1. DESCRIPTION (string, 120-160 characters):
   - SEO meta description
   - Include service name, credibility marker, call to action
   - Example: "Professional residential scaffolding from £800. TG20:21 compliant, CISRS teams. Free quotes."

2. ABOUT SECTION:
   - whatIs: Clear explanation (min 50 chars) of what this service is
   - whenNeeded: 6-8 specific scenarios when customers need this (each min 10 chars)
   - whatAchieve: 6-8 customer outcomes/benefits (each min 10 chars)
   - keyPoints: 3-4 differentiating highlights (each min 10 chars)

3. FAQS (array of 10-12 question/answer pairs):
   - Questions from customer perspective (min 10 chars each)
   - Answers that are helpful and specific (min 50 chars each)
   - Cover: pricing, timeline, safety, insurance, process, booking

REQUIREMENTS:
- Professional UK English
- No emojis
- Be specific and informative
- Reference certifications (TG20:21, CISRS, CHAS) naturally
- Include pricing guidance where relevant
- Focus on customer value

Generate the frontmatter for ${service.title}.`;
}

// ============================================================================
// JSON Schema Definitions
// ============================================================================

/**
 * Get JSON schema for service description (meta description)
 */
export function getDescriptionSchema(): object {
  return {
    type: "object",
    properties: {
      description: {
        type: "string",
        description: "SEO meta description, 120-160 characters",
        minLength: 50,
        maxLength: 200,
      },
    },
    required: ["description"],
  };
}

/**
 * Get JSON schema for service about section
 */
export function getAboutSchema(): object {
  return {
    type: "object",
    properties: {
      whatIs: {
        type: "string",
        description: "Explanation of what this service is",
        minLength: 50,
      },
      whenNeeded: {
        type: "array",
        description: "Scenarios when customers need this service",
        items: {
          type: "string",
          minLength: 10,
        },
        minItems: 4,
        maxItems: 10,
      },
      whatAchieve: {
        type: "array",
        description: "Outcomes and benefits customers get",
        items: {
          type: "string",
          minLength: 10,
        },
        minItems: 4,
        maxItems: 10,
      },
      keyPoints: {
        type: "array",
        description: "Top highlights that differentiate this service",
        items: {
          type: "string",
          minLength: 10,
        },
        minItems: 3,
        maxItems: 5,
      },
    },
    required: ["whatIs", "whenNeeded", "whatAchieve", "keyPoints"],
  };
}

/**
 * Get JSON schema for service FAQs
 */
export function getFAQsSchema(): object {
  return {
    type: "object",
    properties: {
      faqs: {
        type: "array",
        description: "Frequently asked questions and answers",
        items: {
          type: "object",
          properties: {
            question: {
              type: "string",
              description: "FAQ question from customer perspective",
              minLength: 10,
            },
            answer: {
              type: "string",
              description: "Helpful, specific answer",
              minLength: 20,
            },
          },
          required: ["question", "answer"],
        },
        minItems: 3,
        maxItems: 15,
      },
    },
    required: ["faqs"],
  };
}

/**
 * Get JSON schema for complete service frontmatter
 * Used with generateStructured() for reliable output
 */
export function getServiceFrontmatterSchema(): object {
  return {
    type: "object",
    properties: {
      description: {
        type: "string",
        description: "SEO meta description, 120-160 characters",
        minLength: 50,
        maxLength: 200,
      },
      about: {
        type: "object",
        properties: {
          whatIs: {
            type: "string",
            description: "Explanation of what this service is",
            minLength: 50,
          },
          whenNeeded: {
            type: "array",
            description: "Scenarios when customers need this service",
            items: {
              type: "string",
              minLength: 10,
            },
            minItems: 4,
            maxItems: 10,
          },
          whatAchieve: {
            type: "array",
            description: "Outcomes and benefits customers get",
            items: {
              type: "string",
              minLength: 10,
            },
            minItems: 4,
            maxItems: 10,
          },
          keyPoints: {
            type: "array",
            description: "Top highlights that differentiate this service",
            items: {
              type: "string",
              minLength: 10,
            },
            minItems: 3,
            maxItems: 5,
          },
        },
        required: ["whatIs", "whenNeeded", "whatAchieve", "keyPoints"],
      },
      faqs: {
        type: "array",
        description: "Frequently asked questions and answers",
        items: {
          type: "object",
          properties: {
            question: {
              type: "string",
              description: "FAQ question from customer perspective",
              minLength: 10,
            },
            answer: {
              type: "string",
              description: "Helpful, specific answer",
              minLength: 20,
            },
          },
          required: ["question", "answer"],
        },
        minItems: 8,
        maxItems: 15,
      },
    },
    required: ["description", "about", "faqs"],
  };
}

// ============================================================================
// Response Type Definitions
// ============================================================================

/**
 * Expected response structure from getServiceFrontmatterPrompt
 */
export interface GeneratedServiceContent {
  description: string;
  about: AboutSection;
  faqs: FAQItem[];
}
