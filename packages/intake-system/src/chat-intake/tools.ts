/**
 * Claude Chat Intake Tools
 *
 * MCP-style tool definitions for Claude to use during the intake process.
 * These tools provide access to industry templates, location suggestions,
 * validation, and project file generation.
 */

import type { IndustryTemplate } from "../templates";
import type { ProjectFile, ServiceDefinition, LocationDefinition } from "../schemas";

// ============================================================================
// Tool Type Definitions
// ============================================================================

/**
 * MCP Tool Definition interface
 */
export interface ToolDefinition {
  name: string;
  description: string;
  input_schema: {
    type: "object";
    properties: Record<string, PropertySchema>;
    required?: string[];
  };
}

interface PropertySchema {
  type: "string" | "number" | "boolean" | "object" | "array";
  description?: string;
  enum?: string[];
  default?: unknown;
  items?: PropertySchema;
  properties?: Record<string, PropertySchema>;
  required?: string[];
}

// ============================================================================
// Tool Response Types
// ============================================================================

export interface GetIndustryTemplateResponse {
  success: boolean;
  template?: IndustryTemplate;
  error?: string;
}

export interface SuggestNearbyLocationsResponse {
  success: boolean;
  locations?: Array<{
    name: string;
    slug: string;
    distance_miles?: number;
    type?: string;
  }>;
  error?: string;
}

export interface ValidateProjectSectionResponse {
  success: boolean;
  valid: boolean;
  errors?: Array<{
    field: string;
    message: string;
  }>;
  warnings?: Array<{
    field: string;
    message: string;
  }>;
}

export interface GenerateProjectFileResponse {
  success: boolean;
  projectFile?: ProjectFile;
  error?: string;
}

export interface FormatServicesResponse {
  success: boolean;
  services?: ServiceDefinition[];
  error?: string;
}

export interface FormatLocationsResponse {
  success: boolean;
  locations?: LocationDefinition[];
  error?: string;
}

// ============================================================================
// Tool Definitions
// ============================================================================

/**
 * Tool to retrieve industry template with suggested services
 */
export const getIndustryTemplateTool: ToolDefinition = {
  name: "get_industry_template",
  description: `Retrieves the industry template for a specific trade/business type.
Returns suggested services organized by category (core, specialist, additional),
default brand voice, common certifications, pricing guidance, and SEO keywords.

Use this tool as soon as you identify the customer's industry to provide
relevant suggestions throughout the intake process.

Available industries: scaffolding, plumbing, electrical, cleaning, landscaping,
roofing, painting-decorating, carpentry, locksmith, hvac`,
  input_schema: {
    type: "object",
    properties: {
      industry_id: {
        type: "string",
        description: 'Industry identifier (e.g., "plumbing", "electrical", "scaffolding")',
      },
    },
    required: ["industry_id"],
  },
};

/**
 * Tool to suggest nearby locations based on primary location
 */
export const suggestNearbyLocationsTool: ToolDefinition = {
  name: "suggest_nearby_locations",
  description: `Suggests nearby towns and areas based on the customer's primary location.
Returns a list of locations within the specified radius that are commonly served
together with the primary location.

Use this to help customers identify all the areas they serve without having to
think of every town individually. They can confirm or remove suggestions.`,
  input_schema: {
    type: "object",
    properties: {
      primary_location: {
        type: "string",
        description:
          'The primary town/city where the business is based (e.g., "Brighton", "Manchester")',
      },
      county: {
        type: "string",
        description:
          'The county or region for more accurate suggestions (e.g., "East Sussex", "Greater Manchester")',
      },
      radius_miles: {
        type: "number",
        description: "Maximum distance from primary location in miles",
        default: 15,
      },
    },
    required: ["primary_location"],
  },
};

/**
 * Tool to validate a section of the collected project data
 */
export const validateProjectSectionTool: ToolDefinition = {
  name: "validate_project_section",
  description: `Validates a specific section of the project file data before final generation.
Checks for required fields, data format, and business rules.

Use this after collecting each major section to catch errors early and provide
feedback to the customer before moving on.

Sections: business, credentials, services, locations, pricing, theme, deployment`,
  input_schema: {
    type: "object",
    properties: {
      section: {
        type: "string",
        description: "The section to validate",
        enum: [
          "business",
          "credentials",
          "services",
          "locations",
          "pricing",
          "theme",
          "deployment",
        ],
      },
      data: {
        type: "object",
        description: "The section data to validate (structure depends on section type)",
      },
    },
    required: ["section", "data"],
  },
};

/**
 * Tool to generate the final ProjectFile JSON
 */
export const generateProjectFileTool: ToolDefinition = {
  name: "generate_project_file",
  description: `Generates the complete ProjectFile JSON from all collected intake data.
Validates all sections, generates UUIDs and timestamps, and returns the
ready-to-use project file.

Call this tool only after collecting and confirming all required information
with the customer. The output can be used directly with create-site-from-project.ts.`,
  input_schema: {
    type: "object",
    properties: {
      collected_data: {
        type: "object",
        description: "All collected business data organized by section",
        properties: {
          business: {
            type: "object",
            description: "Business name, contact info, address, hours",
          },
          credentials: {
            type: "object",
            description: "Year established, certifications, insurance",
          },
          services: {
            type: "array",
            description: "Array of service definitions",
          },
          regions: {
            type: "array",
            description: "Array of region definitions with locations",
          },
          pricing: {
            type: "object",
            description: "Pricing tiers (optional)",
          },
          theme: {
            type: "object",
            description: "Brand colors and visual preferences",
          },
          social_media: {
            type: "object",
            description: "Social media profile URLs",
          },
          intake_notes: {
            type: "string",
            description: "Any special notes from the intake conversation",
          },
        },
        required: ["business", "services", "regions"],
      },
    },
    required: ["collected_data"],
  },
};

/**
 * Tool to format service selections into proper ServiceDefinition objects
 */
export const formatServicesTool: ToolDefinition = {
  name: "format_services",
  description: `Converts selected services from the intake conversation into properly
formatted ServiceDefinition objects ready for the ProjectFile.

Use this when the customer has confirmed their services to ensure proper
slug formatting, categorization, and related service linking.`,
  input_schema: {
    type: "object",
    properties: {
      industry_id: {
        type: "string",
        description: "The industry template ID for service lookups",
      },
      selected_services: {
        type: "array",
        description: "Array of service slugs or names selected by the customer",
        items: {
          type: "string",
        },
      },
      custom_services: {
        type: "array",
        description: "Array of custom services not in the template",
        items: {
          type: "object",
          properties: {
            name: {
              type: "string",
              description: "Service name as provided by customer",
            },
            category: {
              type: "string",
              description: "Category: core, specialist, or additional",
              enum: ["core", "specialist", "additional"],
            },
          },
        },
      },
    },
    required: ["selected_services"],
  },
};

/**
 * Tool to format location selections into proper LocationDefinition objects
 */
export const formatLocationsTool: ToolDefinition = {
  name: "format_locations",
  description: `Converts selected locations from the intake conversation into properly
formatted LocationDefinition objects ready for the ProjectFile.

Generates appropriate slugs, identifies location types (coastal, urban, rural, etc.),
and groups locations by region.`,
  input_schema: {
    type: "object",
    properties: {
      primary_location: {
        type: "string",
        description: "The main location where the business is based",
      },
      additional_locations: {
        type: "array",
        description: "Array of additional location names served",
        items: {
          type: "string",
        },
      },
      region_name: {
        type: "string",
        description: 'The region or county name for grouping (e.g., "East Sussex")',
      },
    },
    required: ["primary_location"],
  },
};

/**
 * Tool to suggest brand colors based on industry
 */
export const suggestBrandColorsTool: ToolDefinition = {
  name: "suggest_brand_colors",
  description: `Suggests appropriate brand colors based on the business industry.
Returns hex color codes with explanations for why each color works for the industry.

Use this when the customer doesn't have existing brand colors and needs suggestions.`,
  input_schema: {
    type: "object",
    properties: {
      industry_id: {
        type: "string",
        description: "Industry identifier for color suggestions",
      },
      style_preference: {
        type: "string",
        description: "Customer style preference",
        enum: ["modern", "traditional", "bold", "minimal", "professional"],
      },
    },
    required: ["industry_id"],
  },
};

/**
 * Tool to validate UK phone number format
 */
export const validatePhoneNumberTool: ToolDefinition = {
  name: "validate_phone_number",
  description: `Validates and formats a UK phone number.
Checks for valid format and returns a standardized version.`,
  input_schema: {
    type: "object",
    properties: {
      phone_number: {
        type: "string",
        description: "Phone number to validate",
      },
    },
    required: ["phone_number"],
  },
};

/**
 * Tool to validate UK postcode format
 */
export const validatePostcodeTool: ToolDefinition = {
  name: "validate_postcode",
  description: `Validates a UK postcode format.
Returns whether valid and the properly formatted postcode.`,
  input_schema: {
    type: "object",
    properties: {
      postcode: {
        type: "string",
        description: "UK postcode to validate",
      },
    },
    required: ["postcode"],
  },
};

// ============================================================================
// Complete Tools Array
// ============================================================================

/**
 * All available tools for the chat intake process
 */
export const INTAKE_TOOLS: ToolDefinition[] = [
  getIndustryTemplateTool,
  suggestNearbyLocationsTool,
  validateProjectSectionTool,
  generateProjectFileTool,
  formatServicesTool,
  formatLocationsTool,
  suggestBrandColorsTool,
  validatePhoneNumberTool,
  validatePostcodeTool,
];

/**
 * Get a specific tool definition by name
 */
export function getIntakeTool(name: string): ToolDefinition | undefined {
  return INTAKE_TOOLS.find((tool) => tool.name === name);
}

/**
 * Get tool names as array for tool choice configuration
 */
export function getIntakeToolNames(): string[] {
  return INTAKE_TOOLS.map((tool) => tool.name);
}

// ============================================================================
// Tool Handler Types (for implementation)
// ============================================================================

/**
 * Tool handler function type
 */
export type ToolHandler<TInput, TOutput> = (input: TInput) => Promise<TOutput>;

/**
 * Tool handlers interface for implementing the tools
 */
export interface IntakeToolHandlers {
  get_industry_template: ToolHandler<{ industry_id: string }, GetIndustryTemplateResponse>;
  suggest_nearby_locations: ToolHandler<
    { primary_location: string; county?: string; radius_miles?: number },
    SuggestNearbyLocationsResponse
  >;
  validate_project_section: ToolHandler<
    { section: string; data: unknown },
    ValidateProjectSectionResponse
  >;
  generate_project_file: ToolHandler<
    { collected_data: Record<string, unknown> },
    GenerateProjectFileResponse
  >;
  format_services: ToolHandler<
    {
      industry_id?: string;
      selected_services: string[];
      custom_services?: Array<{ name: string; category: string }>;
    },
    FormatServicesResponse
  >;
  format_locations: ToolHandler<
    { primary_location: string; additional_locations?: string[]; region_name?: string },
    FormatLocationsResponse
  >;
  suggest_brand_colors: ToolHandler<
    { industry_id: string; style_preference?: string },
    {
      success: boolean;
      colors?: { primary: string; secondary?: string; accent?: string; reasoning: string };
    }
  >;
  validate_phone_number: ToolHandler<
    { phone_number: string },
    { valid: boolean; formatted?: string; error?: string }
  >;
  validate_postcode: ToolHandler<
    { postcode: string },
    { valid: boolean; formatted?: string; error?: string }
  >;
}
