/**
 * Claude (Anthropic) AI Client
 *
 * Implementation of AIClient interface for Claude/Anthropic API.
 * Includes rate limiting, retry logic with exponential backoff,
 * and support for structured output via tool calls.
 */

import Anthropic from "@anthropic-ai/sdk";
import * as dotenv from "dotenv";
import type {
  AIClient,
  AIProviderConfig,
  GenerateOptions,
  GenerationResult,
  StructuredResult,
  DEFAULT_CONFIG,
} from "./ai-provider";

// Load environment variables
dotenv.config({ path: ".env.local" });

// ============================================================================
// Constants
// ============================================================================

/** Default model for Claude */
const DEFAULT_MODEL = "claude-sonnet-4-20250514";

/** Default max tokens for response */
const DEFAULT_MAX_TOKENS = 4096;

/** Default temperature */
const DEFAULT_TEMPERATURE = 0.7;

/** Minimum delay between requests (rate limiting) */
const REQUEST_DELAY_MS = 1000;

/** Maximum retry attempts */
const MAX_RETRIES = 3;

/** Initial backoff delay for retries */
const INITIAL_BACKOFF_MS = 5000;

/** Retryable HTTP status codes */
const RETRYABLE_STATUS_CODES = [429, 529, 500, 502, 503, 504];

// ============================================================================
// Claude Client Implementation
// ============================================================================

/**
 * Claude AI Client
 *
 * Provides text generation and structured output capabilities
 * using the Anthropic Claude API.
 *
 * @example
 * ```typescript
 * const client = new ClaudeClient();
 *
 * // Simple text generation
 * const result = await client.generate("Explain TypeScript generics");
 *
 * // Structured output
 * const schema = { type: "object", properties: { title: { type: "string" } } };
 * const structured = await client.generateStructured("Generate a blog title", schema);
 * ```
 */
export class ClaudeClient implements AIClient {
  private client: Anthropic;
  private model: string;
  private defaultMaxTokens: number;
  private defaultTemperature: number;
  private lastRequestTime: number = 0;

  /**
   * Create a new Claude client
   *
   * @param config - Optional configuration overrides
   * @throws Error if ANTHROPIC_API_KEY is not set
   */
  constructor(config?: Partial<AIProviderConfig>) {
    const apiKey = config?.apiKey || process.env.ANTHROPIC_API_KEY;

    if (!apiKey) {
      throw new Error(
        "ANTHROPIC_API_KEY is required. Set it in .env.local or pass via config.apiKey"
      );
    }

    this.client = new Anthropic({ apiKey });
    this.model = config?.model || DEFAULT_MODEL;
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
        const messages: Anthropic.MessageParam[] = [
          {
            role: "user",
            content: prompt,
          },
        ];

        return this.client.messages.create({
          model: this.model,
          max_tokens: options?.maxTokens || this.defaultMaxTokens,
          temperature: options?.temperature ?? this.defaultTemperature,
          system: options?.systemPrompt,
          messages,
          stop_sequences: options?.stopSequences,
        });
      });

      // Extract text content from response
      const textContent = response.content.find((block) => block.type === "text");
      const content = textContent?.type === "text" ? textContent.text : "";

      return {
        success: true,
        content,
        usage: {
          inputTokens: response.usage.input_tokens,
          outputTokens: response.usage.output_tokens,
        },
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
   * Uses Claude's tool calling feature to ensure output matches
   * the provided JSON Schema.
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

      // Define a tool that accepts the schema structure
      const tool: Anthropic.Tool = {
        name: "output_structured_data",
        description:
          "Output the generated data in the specified structured format. Always use this tool to provide your response.",
        input_schema: schema as Anthropic.Tool.InputSchema,
      };

      const response = await this.executeWithRetry(async () => {
        const messages: Anthropic.MessageParam[] = [
          {
            role: "user",
            content: `${prompt}\n\nYou MUST use the output_structured_data tool to provide your response.`,
          },
        ];

        return this.client.messages.create({
          model: this.model,
          max_tokens: options?.maxTokens || this.defaultMaxTokens,
          temperature: options?.temperature ?? this.defaultTemperature,
          system: options?.systemPrompt,
          messages,
          tools: [tool],
          tool_choice: { type: "tool", name: "output_structured_data" },
        });
      });

      // Extract tool use from response
      const toolUse = response.content.find((block) => block.type === "tool_use");

      if (!toolUse || toolUse.type !== "tool_use") {
        return {
          success: false,
          error: "Model did not use the structured output tool",
          usage: {
            inputTokens: response.usage.input_tokens,
            outputTokens: response.usage.output_tokens,
          },
        };
      }

      const data = toolUse.input as T;
      const rawContent = JSON.stringify(data, null, 2);

      return {
        success: true,
        data,
        rawContent,
        usage: {
          inputTokens: response.usage.input_tokens,
          outputTokens: response.usage.output_tokens,
        },
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
      console.log(`  [Claude] Rate limiting: waiting ${waitTime}ms`);
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

        // Calculate backoff with exponential increase: 5s, 10s, 20s
        const backoffMs = INITIAL_BACKOFF_MS * Math.pow(2, attempt);
        console.log(
          `  [Claude] Retryable error (attempt ${attempt + 1}/${MAX_RETRIES}): ${lastError.message}`
        );
        console.log(`  [Claude] Retrying in ${Math.round(backoffMs / 1000)}s...`);

        await this.sleep(backoffMs);
      }
    }

    throw lastError;
  }

  /**
   * Check if an error is retryable
   */
  private isRetryableError(error: unknown): boolean {
    if (error instanceof Anthropic.APIError) {
      return RETRYABLE_STATUS_CODES.includes(error.status);
    }

    if (error instanceof Error) {
      const message = error.message.toLowerCase();
      return (
        message.includes("rate limit") ||
        message.includes("overloaded") ||
        message.includes("timeout") ||
        message.includes("econnreset") ||
        message.includes("econnrefused")
      );
    }

    return false;
  }

  /**
   * Format error for consistent error messages
   */
  private formatError(error: unknown): string {
    if (error instanceof Anthropic.APIError) {
      return `Claude API error (${error.status}): ${error.message}`;
    }

    if (error instanceof Error) {
      return error.message;
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
    return this.model;
  }
}

// ============================================================================
// Singleton Instance
// ============================================================================

let claudeClientInstance: ClaudeClient | null = null;

/**
 * Get a singleton Claude client instance
 *
 * @param config - Optional configuration overrides
 * @returns Claude client instance
 *
 * @example
 * ```typescript
 * const client = getClaudeClient();
 * const result = await client.generate("Hello, Claude!");
 * ```
 */
export function getClaudeClient(config?: Partial<AIProviderConfig>): ClaudeClient {
  if (!claudeClientInstance) {
    claudeClientInstance = new ClaudeClient(config);
  }
  return claudeClientInstance;
}

/**
 * Reset the singleton instance (useful for testing)
 */
export function resetClaudeClient(): void {
  claudeClientInstance = null;
}
