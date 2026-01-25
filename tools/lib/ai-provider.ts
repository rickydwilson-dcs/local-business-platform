/**
 * AI Provider Abstraction Layer
 *
 * Unified interface for AI providers (Claude and Gemini).
 * Provides a consistent API for text generation and structured output
 * across different AI backends.
 */

import * as dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

// ============================================================================
// Types and Interfaces
// ============================================================================

/**
 * Supported AI providers
 */
export type AIProvider = "claude" | "gemini";

/**
 * Configuration for AI provider initialization
 */
export interface AIProviderConfig {
  /** AI provider to use */
  provider: AIProvider;
  /** API key (loaded from env if not provided) */
  apiKey?: string;
  /** Model name/identifier */
  model?: string;
  /** Maximum tokens in response */
  maxTokens?: number;
  /** Temperature for randomness (0-1) */
  temperature?: number;
}

/**
 * Options for text generation requests
 */
export interface GenerateOptions {
  /** System prompt/instructions */
  systemPrompt?: string;
  /** Maximum tokens in response */
  maxTokens?: number;
  /** Temperature for randomness (0-1) */
  temperature?: number;
  /** Stop sequences to end generation */
  stopSequences?: string[];
}

/**
 * Result from a text generation request
 */
export interface GenerationResult {
  /** Whether the request succeeded */
  success: boolean;
  /** Generated text content */
  content: string;
  /** Token usage statistics */
  usage?: {
    inputTokens: number;
    outputTokens: number;
  };
  /** Error message if request failed */
  error?: string;
}

/**
 * Result from a structured output request
 */
export interface StructuredResult<T> {
  /** Whether the request succeeded */
  success: boolean;
  /** Parsed structured data */
  data?: T;
  /** Raw content before parsing */
  rawContent?: string;
  /** Token usage statistics */
  usage?: {
    inputTokens: number;
    outputTokens: number;
  };
  /** Error message if request failed */
  error?: string;
}

/**
 * AI Client interface for all providers
 */
export interface AIClient {
  /**
   * Generate text from a prompt
   * @param prompt - Input prompt
   * @param options - Generation options
   * @returns Generation result with content
   */
  generate(prompt: string, options?: GenerateOptions): Promise<GenerationResult>;

  /**
   * Generate structured output matching a schema
   * @param prompt - Input prompt
   * @param schema - JSON Schema for output structure
   * @param options - Generation options
   * @returns Structured result with parsed data
   */
  generateStructured<T>(
    prompt: string,
    schema: object,
    options?: GenerateOptions
  ): Promise<StructuredResult<T>>;
}

// ============================================================================
// Default Configuration
// ============================================================================

/**
 * Default configuration values
 */
export const DEFAULT_CONFIG = {
  claude: {
    model: "claude-sonnet-4-20250514",
    maxTokens: 4096,
    temperature: 0.7,
  },
  gemini: {
    model: "gemini-2.0-flash",
    maxTokens: 4096,
    temperature: 0.7,
  },
};

// ============================================================================
// Provider Factory
// ============================================================================

/**
 * Get an AI client instance
 *
 * Returns a singleton client for the specified provider. Defaults to Claude
 * if no provider is specified.
 *
 * @param config - Optional configuration overrides
 * @returns AI client instance
 *
 * @example
 * ```typescript
 * // Get default Claude client
 * const client = getAIClient();
 *
 * // Get Gemini client
 * const geminiClient = getAIClient({ provider: 'gemini' });
 *
 * // Custom configuration
 * const customClient = getAIClient({
 *   provider: 'claude',
 *   model: 'claude-opus-4-20250514',
 *   temperature: 0.5
 * });
 * ```
 */
export function getAIClient(config?: Partial<AIProviderConfig>): AIClient {
  const provider = config?.provider || "claude";

  if (provider === "claude") {
    // Dynamic import to avoid loading unused dependencies
    const { getClaudeClient } = require("./claude-client");
    return getClaudeClient(config);
  } else if (provider === "gemini") {
    const { getGeminiClient } = require("./gemini-client");
    return getGeminiClient(config);
  } else {
    throw new Error(`Unsupported AI provider: ${provider}`);
  }
}

/**
 * Check if an API key is configured for a provider
 *
 * @param provider - Provider to check
 * @returns true if API key is available
 */
export function hasAPIKey(provider: AIProvider): boolean {
  if (provider === "claude") {
    return !!process.env.ANTHROPIC_API_KEY;
  } else if (provider === "gemini") {
    return !!process.env.GOOGLE_AI_API_KEY;
  }
  return false;
}

/**
 * Get the environment variable name for a provider's API key
 *
 * @param provider - Provider name
 * @returns Environment variable name
 */
export function getAPIKeyEnvVar(provider: AIProvider): string {
  if (provider === "claude") {
    return "ANTHROPIC_API_KEY";
  } else if (provider === "gemini") {
    return "GOOGLE_AI_API_KEY";
  }
  throw new Error(`Unknown provider: ${provider}`);
}
