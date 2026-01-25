#!/usr/bin/env tsx
/**
 * AI Connection Test Script
 *
 * Tests connectivity and basic functionality for AI providers (Claude and Gemini).
 * Validates API keys, runs text generation, and tests structured output.
 *
 * Usage:
 *   pnpm test:ai                    # Test default provider (Claude)
 *   pnpm test:ai:claude             # Test Claude specifically
 *   pnpm test:ai:gemini             # Test Gemini specifically
 *   tsx tools/test-ai-connection.ts --provider=claude
 *   tsx tools/test-ai-connection.ts --provider=gemini
 */

import * as path from "path";
import * as dotenv from "dotenv";

// Load environment variables
dotenv.config({ path: path.join(process.cwd(), ".env.local") });

import {
  getAIClient,
  hasAPIKey,
  getAPIKeyEnvVar,
  type AIProvider,
  type GenerationResult,
  type StructuredResult,
} from "./lib/ai-provider";

// ============================================================================
// Types
// ============================================================================

interface TestOptions {
  provider: AIProvider;
}

interface TestSummary {
  provider: AIProvider;
  apiKeyConfigured: boolean;
  textGeneration: {
    success: boolean;
    responseLength?: number;
    usage?: { inputTokens: number; outputTokens: number };
    error?: string;
  };
  structuredOutput: {
    success: boolean;
    dataValid?: boolean;
    usage?: { inputTokens: number; outputTokens: number };
    error?: string;
  };
}

// ============================================================================
// Test Schema for Structured Output
// ============================================================================

/**
 * Schema for testing structured output generation
 */
const TEST_SCHEMA = {
  type: "object",
  properties: {
    title: {
      type: "string",
      description: "A creative title for a blog post",
    },
    summary: {
      type: "string",
      description: "A brief 1-2 sentence summary",
    },
    tags: {
      type: "array",
      items: { type: "string" },
      description: "3-5 relevant tags",
    },
    wordCount: {
      type: "number",
      description: "Estimated word count for the post (between 500 and 2000)",
    },
  },
  required: ["title", "summary", "tags", "wordCount"],
};

interface BlogPostMetadata {
  title: string;
  summary: string;
  tags: string[];
  wordCount: number;
}

// ============================================================================
// Test Functions
// ============================================================================

/**
 * Test basic text generation
 */
async function testTextGeneration(provider: AIProvider): Promise<TestSummary["textGeneration"]> {
  console.log("\n  Testing text generation...");

  try {
    const client = getAIClient({ provider });
    const prompt = "In exactly one sentence, explain what makes a good API design. Be concise.";

    const result = await client.generate(prompt, {
      systemPrompt: "You are a helpful assistant. Keep responses brief and technical.",
      maxTokens: 150,
      temperature: 0.5,
    });

    if (!result.success) {
      return {
        success: false,
        error: result.error,
      };
    }

    console.log(`    Response: "${result.content.substring(0, 100)}..."`);
    console.log(`    Tokens: ${result.usage?.inputTokens} in / ${result.usage?.outputTokens} out`);

    return {
      success: true,
      responseLength: result.content.length,
      usage: result.usage,
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    return {
      success: false,
      error: errorMessage,
    };
  }
}

/**
 * Test structured output generation
 */
async function testStructuredOutput(
  provider: AIProvider
): Promise<TestSummary["structuredOutput"]> {
  console.log("\n  Testing structured output...");

  try {
    const client = getAIClient({ provider });
    const prompt =
      "Generate metadata for a blog post about best practices in backend API development.";

    const result = await client.generateStructured<BlogPostMetadata>(prompt, TEST_SCHEMA, {
      systemPrompt: "You are a technical content strategist.",
      maxTokens: 500,
      temperature: 0.7,
    });

    if (!result.success) {
      return {
        success: false,
        error: result.error,
      };
    }

    // Validate the structure
    const data = result.data!;
    const isValid =
      typeof data.title === "string" &&
      typeof data.summary === "string" &&
      Array.isArray(data.tags) &&
      typeof data.wordCount === "number";

    console.log(`    Title: "${data.title}"`);
    console.log(`    Summary: "${data.summary.substring(0, 80)}..."`);
    console.log(`    Tags: [${data.tags.join(", ")}]`);
    console.log(`    Word Count: ${data.wordCount}`);
    console.log(`    Tokens: ${result.usage?.inputTokens} in / ${result.usage?.outputTokens} out`);
    console.log(`    Data Valid: ${isValid ? "Yes" : "No"}`);

    return {
      success: true,
      dataValid: isValid,
      usage: result.usage,
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    return {
      success: false,
      error: errorMessage,
    };
  }
}

/**
 * Run all tests for a provider
 */
async function runTests(options: TestOptions): Promise<TestSummary> {
  const { provider } = options;
  const summary: TestSummary = {
    provider,
    apiKeyConfigured: hasAPIKey(provider),
    textGeneration: { success: false },
    structuredOutput: { success: false },
  };

  console.log(`\n${"=".repeat(60)}`);
  console.log(`Testing ${provider.toUpperCase()} AI Provider`);
  console.log("=".repeat(60));

  // Check API key
  const envVar = getAPIKeyEnvVar(provider);
  console.log(
    `\n  API Key (${envVar}): ${summary.apiKeyConfigured ? "Configured" : "NOT CONFIGURED"}`
  );

  if (!summary.apiKeyConfigured) {
    console.log(`\n  ERROR: ${envVar} is not set in .env.local`);
    console.log(`  Please add your API key to continue.\n`);
    return summary;
  }

  // Run text generation test
  summary.textGeneration = await testTextGeneration(provider);

  // Run structured output test
  summary.structuredOutput = await testStructuredOutput(provider);

  return summary;
}

/**
 * Print test summary
 */
function printSummary(summary: TestSummary): void {
  console.log(`\n${"=".repeat(60)}`);
  console.log(`TEST SUMMARY: ${summary.provider.toUpperCase()}`);
  console.log("=".repeat(60));

  console.log(`\n  API Key Configured: ${summary.apiKeyConfigured ? "Yes" : "No"}`);

  console.log(`\n  Text Generation:`);
  console.log(`    Status: ${summary.textGeneration.success ? "PASS" : "FAIL"}`);
  if (summary.textGeneration.success) {
    console.log(`    Response Length: ${summary.textGeneration.responseLength} chars`);
    if (summary.textGeneration.usage) {
      console.log(
        `    Tokens Used: ${summary.textGeneration.usage.inputTokens + summary.textGeneration.usage.outputTokens}`
      );
    }
  } else if (summary.textGeneration.error) {
    console.log(`    Error: ${summary.textGeneration.error}`);
  }

  console.log(`\n  Structured Output:`);
  console.log(`    Status: ${summary.structuredOutput.success ? "PASS" : "FAIL"}`);
  if (summary.structuredOutput.success) {
    console.log(`    Data Valid: ${summary.structuredOutput.dataValid ? "Yes" : "No"}`);
    if (summary.structuredOutput.usage) {
      console.log(
        `    Tokens Used: ${summary.structuredOutput.usage.inputTokens + summary.structuredOutput.usage.outputTokens}`
      );
    }
  } else if (summary.structuredOutput.error) {
    console.log(`    Error: ${summary.structuredOutput.error}`);
  }

  // Overall status
  const allPassed =
    summary.apiKeyConfigured && summary.textGeneration.success && summary.structuredOutput.success;

  console.log(`\n  Overall: ${allPassed ? "ALL TESTS PASSED" : "SOME TESTS FAILED"}`);
  console.log("");
}

// ============================================================================
// CLI
// ============================================================================

/**
 * Parse command line arguments
 */
function parseArgs(): TestOptions {
  const args = process.argv.slice(2);
  let provider: AIProvider = "claude"; // Default

  for (const arg of args) {
    if (arg.startsWith("--provider=")) {
      const value = arg.split("=")[1];
      if (value === "claude" || value === "gemini") {
        provider = value;
      } else {
        console.error(`Invalid provider: ${value}. Use 'claude' or 'gemini'.`);
        process.exit(1);
      }
    } else if (arg === "--help" || arg === "-h") {
      console.log(`
AI Connection Test Script

Usage:
  tsx tools/test-ai-connection.ts [options]

Options:
  --provider=<provider>  AI provider to test: claude (default) or gemini
  --help, -h            Show this help message

Examples:
  tsx tools/test-ai-connection.ts                    # Test Claude
  tsx tools/test-ai-connection.ts --provider=claude  # Test Claude explicitly
  tsx tools/test-ai-connection.ts --provider=gemini  # Test Gemini

Environment Variables:
  ANTHROPIC_API_KEY   Required for Claude
  GOOGLE_AI_API_KEY   Required for Gemini

NPM Scripts:
  pnpm test:ai         Test default provider (Claude)
  pnpm test:ai:claude  Test Claude
  pnpm test:ai:gemini  Test Gemini
      `);
      process.exit(0);
    }
  }

  return { provider };
}

/**
 * Main entry point
 */
async function main(): Promise<void> {
  console.log("\nAI Provider Connection Test");
  console.log("============================\n");

  try {
    const options = parseArgs();
    const summary = await runTests(options);
    printSummary(summary);

    // Exit with error code if tests failed
    const allPassed =
      summary.apiKeyConfigured &&
      summary.textGeneration.success &&
      summary.structuredOutput.success;

    if (!allPassed) {
      process.exit(1);
    }
  } catch (error) {
    console.error("\nFatal error:", error instanceof Error ? error.message : error);
    process.exit(1);
  }
}

// Run if executed directly
if (require.main === module) {
  main();
}
