/**
 * Chat Intake Module
 *
 * Provides system prompts, tools, and utilities for Claude-based
 * conversational intake to collect business information and generate
 * ProjectFile JSON for site generation.
 *
 * @packageDocumentation
 */

// ============================================================================
// System Prompts
// ============================================================================

export {
  INTAKE_SYSTEM_PROMPT,
  INTAKE_SYSTEM_PROMPT_MINIMAL,
  INTAKE_SYSTEM_PROMPT_VOICE,
  INTAKE_SECTION_PROMPTS,
} from "./system-prompt";

// ============================================================================
// Tool Definitions
// ============================================================================

export {
  // Tool Definitions
  INTAKE_TOOLS,
  getIndustryTemplateTool,
  suggestNearbyLocationsTool,
  validateProjectSectionTool,
  generateProjectFileTool,
  formatServicesTool,
  formatLocationsTool,
  suggestBrandColorsTool,
  validatePhoneNumberTool,
  validatePostcodeTool,

  // Utility Functions
  getIntakeTool,
  getIntakeToolNames,

  // Types
  type ToolDefinition,
  type ToolHandler,
  type IntakeToolHandlers,
  type GetIndustryTemplateResponse,
  type SuggestNearbyLocationsResponse,
  type ValidateProjectSectionResponse,
  type GenerateProjectFileResponse,
  type FormatServicesResponse,
  type FormatLocationsResponse,
} from "./tools";
