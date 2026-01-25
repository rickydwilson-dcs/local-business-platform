/**
 * Gemini (Google AI) Client
 *
 * Implementation of AIClient interface for Google's Gemini API.
 * Wraps the existing @google/generative-ai package with retry logic
 * and structured output support.
 */

import { GoogleGenerativeAI, GenerateContentResult } from "@google/generative-ai";
import * as dotenv from "dotenv";
import type {
  AIClient,
  AIProviderConfig,
  GenerateOptions,
  GenerationResult,
  StructuredResult,
} from "./ai-provider";

// Load environment variables
dotenv.config({ path: ".env.local" });

// ============================================================================
// Constants
// ============================================================================

/** Default model for Gemini */
const DEFAULT_MODEL = "gemini-2.0-flash";

/** Default max tokens for response */
const DEFAULT_MAX_TOKENS = 4096;

/** Default temperature */
const DEFAULT_TEMPERATURE = 0.7;

/** Minimum delay between requests (rate limiting) */
const REQUEST_DELAY_MS = 1000;

/** Maximum retry attempts */
const MAX_RETRIES = 3;

/** Initial backoff delay for retries */
const INITIAL_BACKOFF_MS = 10000;

// ============================================================================
// Gemini Client Implementation
// ============================================================================

/**
 * Gemini AI Client
 *
 * Provides text generation and structured output capabilities
 * using the Google Gemini API.
 *
 * @example
 * ```typescript
 * const client = new GeminiClient();
 *
 * // Simple text generation
 * const result = await client.generate("Explain TypeScript generics");
 *
 * // Structured output
 * const schema = { type: "object", properties: { title: { type: "string" } } };
 * const structured = await client.generateStructured("Generate a blog title", schema);
 * ```
 */
export class GeminiClient implements AIClient {
  private genAI: GoogleGenerativeAI;
  private modelName: string;
  private defaultMaxTokens: number;
  private defaultTemperature: number;
  private lastRequestTime: number = 0;

  /**
   * Create a new Gemini client
   *
   * @param config - Optional configuration overrides
   * @throws Error if GOOGLE_AI_API_KEY is not set
   */
  constructor(config?: Partial<AIProviderConfig>) {
    const apiKey = config?.apiKey || process.env.GOOGLE_AI_API_KEY;

    if (!apiKey) {
      throw new Error(
        "GOOGLE_AI_API_KEY is required. Set it in .env.local or pass via config.apiKey"
      );
    }

    this.genAI = new GoogleGenerativeAI(apiKey);
    this.modelName = config?.model || DEFAULT_MODEL;
    this.defaultMaxTokens = config?.maxTokens || DEFAULT_MAX_TOKENS;
    this.defaultTemperature = config?.temperature || DEFAULT_TEMPERATURE;
  }

  /**
   * Generate text from a prompt
   *
   * @param prompt - Input prompt
   * @param options - Generation options
   * @returns Generation result with content
   */
  async generate(prompt: string, options?: GenerateOptions): Promise<GenerationResult> {
    try {
      await this.enforceRateLimit();

      const response = await this.executeWithRetry(async () => {
        const model = this.genAI.getGenerativeModel({
          model: this.modelName,
          generationConfig: {
            maxOutputTokens: options?.maxTokens || this.defaultMaxTokens,
            temperature: options?.temperature ?? this.defaultTemperature,
            stopSequences: options?.stopSequences,
          },
          systemInstruction: options?.systemPrompt,
        });

        return model.generateContent(prompt);
      });

      const result = response.response;
      const content = result.text();

      // Extract usage if available
      const usage = result.usageMetadata
        ? {
            inputTokens: result.usageMetadata.promptTokenCount || 0,
            outputTokens: result.usageMetadata.candidatesTokenCount || 0,
          }
        : undefined;

      return {
        success: true,
        content,
        usage,
      };
    } catch (error) {
      return {
        success: false,
        content: "",
        error: this.formatError(error),
      };
    }
  }

  /**
   * Generate structured output matching a schema
   *
   * Uses Gemini's JSON mode with schema enforcement.
   *
   * @param prompt - Input prompt
   * @param schema - JSON Schema for output structure
   * @param options - Generation options
   * @returns Structured result with parsed data
   */
  async generateStructured<T>(
    prompt: string,
    schema: object,
    options?: GenerateOptions
  ): Promise<StructuredResult<T>> {
    try {
      await this.enforceRateLimit();

      const response = await this.executeWithRetry(async () => {
        const model = this.genAI.getGenerativeModel({
          model: this.modelName,
          generationConfig: {
            maxOutputTokens: options?.maxTokens || this.defaultMaxTokens,
            temperature: options?.temperature ?? this.defaultTemperature,
            stopSequences: options?.stopSequences,
            responseMimeType: "application/json",
            responseSchema: schema as Parameters<
              typeof this.genAI.getGenerativeModel
            >[0]["generationConfig"] extends { responseSchema?: infer S }
              ? S
              : never,
          },
          systemInstruction: options?.systemPrompt,
        });

        // Enhance prompt to request JSON output matching schema
        const enhancedPrompt = `${prompt}

You must respond with valid JSON that matches the following schema:
${JSON.stringify(schema, null, 2)}

Respond ONLY with the JSON object, no additional text.`;

        return model.generateContent(enhancedPrompt);
      });

      const result = response.response;
      const rawContent = result.text();

      // Extract usage if available
      const usage = result.usageMetadata
        ? {
            inputTokens: result.usageMetadata.promptTokenCount || 0,
            outputTokens: result.usageMetadata.candidatesTokenCount || 0,
          }
        : undefined;

      // Parse JSON response
      let data: T;
      try {
        // Clean the response - remove markdown code blocks if present
        let cleanedContent = rawContent.trim();
        if (cleanedContent.startsWith("```json")) {
          cleanedContent = cleanedContent.slice(7);
        } else if (cleanedContent.startsWith("```")) {
          cleanedContent = cleanedContent.slice(3);
        }
        if (cleanedContent.endsWith("```")) {
          cleanedContent = cleanedContent.slice(0, -3);
        }
        cleanedContent = cleanedContent.trim();

        data = JSON.parse(cleanedContent);
      } catch (parseError) {
        return {
          success: false,
          rawContent,
          usage,
          error: `Failed to parse JSON response: ${parseError instanceof Error ? parseError.message : String(parseError)}`,
        };
      }

      return {
        success: true,
        data,
        rawContent,
        usage,
      };
    } catch (error) {
      return {
        success: false,
        error: this.formatError(error),
      };
    }
  }

  /**
   * Enforce rate limiting between requests
   */
  private async enforceRateLimit(): Promise<void> {
    const now = Date.now();
    const timeSinceLastRequest = now - this.lastRequestTime;

    if (timeSinceLastRequest < REQUEST_DELAY_MS) {
      const waitTime = REQUEST_DELAY_MS - timeSinceLastRequest;
      console.log(`  [Gemini] Rate limiting: waiting ${waitTime}ms`);
      await this.sleep(waitTime);
    }

    this.lastRequestTime = Date.now();
  }

  /**
   * Execute a function with retry logic and exponential backoff
   */
  private async executeWithRetry<T>(fn: () => Promise<T>): Promise<T> {
    let lastError: Error | undefined;

    for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
      try {
        return await fn();
      } catch (error) {
        lastError = error instanceof Error ? error : new Error(String(error));

        // Check if error is retryable
        if (!this.isRetryableError(error) || attempt === MAX_RETRIES) {
          throw error;
        }

        // Calculate backoff with exponential increase: 10s, 20s, 40s
        const backoffMs = INITIAL_BACKOFF_MS * Math.pow(2, attempt);
        console.log(
          `  [Gemini] Retryable error (attempt ${attempt + 1}/${MAX_RETRIES}): ${lastError.message}`
        );
        console.log(`  [Gemini] Retrying in ${Math.round(backoffMs / 1000)}s...`);

        await this.sleep(backoffMs);
      }
    }

    throw lastError;
  }

  /**
   * Check if an error is retryable
   */
  private isRetryableError(error: unknown): boolean {
    if (error instanceof Error) {
      const message = error.message.toLowerCase();
      return (
        message.includes("429") ||
        message.includes("rate limit") ||
        message.includes("resource_exhausted") ||
        message.includes("quota") ||
        message.includes("overloaded") ||
        message.includes("timeout") ||
        message.includes("econnreset") ||
        message.includes("econnrefused") ||
        message.includes("500") ||
        message.includes("502") ||
        message.includes("503") ||
        message.includes("504")
      );
    }

    return false;
  }

  /**
   * Format error for consistent error messages
   */
  private formatError(error: unknown): string {
    if (error instanceof Error) {
      // Check for common Gemini error patterns
      const message = error.message;

      if (message.includes("not found") || message.includes("404")) {
        return `Gemini model "${this.modelName}" not found. Check available models at https://ai.google.dev/gemini-api/docs/models`;
      }

      if (message.includes("quota") || message.includes("RESOURCE_EXHAUSTED")) {
        return `Gemini API quota exceeded. Wait and retry, or enable billing for higher quotas.`;
      }

      return `Gemini API error: ${message}`;
    }

    return String(error);
  }

  /**
   * Sleep for specified milliseconds
   */
  private sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  /**
   * Get the current model name
   */
  getModel(): string {
    return this.modelName;
  }
}

// ============================================================================
// Singleton Instance
// ============================================================================

let geminiClientInstance: GeminiClient | null = null;

/**
 * Get a singleton Gemini client instance
 *
 * @param config - Optional configuration overrides
 * @returns Gemini client instance
 *
 * @example
 * ```typescript
 * const client = getGeminiClient();
 * const result = await client.generate("Hello, Gemini!");
 * ```
 */
export function getGeminiClient(config?: Partial<AIProviderConfig>): GeminiClient {
  if (!geminiClientInstance) {
    geminiClientInstance = new GeminiClient(config);
  }
  return geminiClientInstance;
}

/**
 * Reset the singleton instance (useful for testing)
 */
export function resetGeminiClient(): void {
  geminiClientInstance = null;
}
