import Anthropic from "@anthropic-ai/sdk";
import * as fs from "fs";
import * as path from "path";
import * as dotenv from "dotenv";
import type { PatternMatch, LangfuseAnomaly, TriageResult } from "./types";

dotenv.config({ path: path.resolve(__dirname, "../../../.env.local") });

const SYSTEM_PROMPT = `You are a senior engineer performing automated triage of a failing smoke test on a production website.

You will receive:
- The failing test name and error output
- Recent git commits
- Any matched known-issue patterns
- Langfuse anomalies from the AI pipeline (if available)
- Contents of relevant files (when a known pattern provides file globs)

Your job is to call the submit_triage_result tool with:
- A clear, specific root-cause hypothesis (not vague — name the file and mechanism)
- A confidence level: "high" if you can pinpoint the exact change and fix, "medium" if you have a strong hypothesis but can't confirm, "low" if unclear
- For HIGH confidence only: the specific file path, old_string, and new_string for a minimal targeted fix
- A PR title and body (always required)

Be conservative: prefer "medium" over "high" unless you can definitively trace the failure to a specific line.
Do not invent fixes. If you cannot identify the root cause, say so honestly in the hypothesis.`;

function buildTriagePrompt(params: {
  testName: string;
  siteUrl: string;
  failureOutput: string;
  recentCommits: string;
  matchedPatterns: PatternMatch[];
  langfuseAnomalies: LangfuseAnomaly[];
  fileContents: Record<string, string>;
}): string {
  const {
    testName,
    siteUrl,
    failureOutput,
    recentCommits,
    matchedPatterns,
    langfuseAnomalies,
    fileContents,
  } = params;

  const parts = [
    `## Failing Test\n**Name:** ${testName}\n**Site:** ${siteUrl}`,
    `## Error Output\n\`\`\`\n${failureOutput.slice(0, 3000)}\n\`\`\``,
    `## Recent Commits\n\`\`\`\n${recentCommits}\n\`\`\``,
  ];

  if (matchedPatterns.length > 0) {
    const patternSummary = matchedPatterns
      .map(
        (m) =>
          `### Pattern: ${m.pattern.name} (${m.hitCount} symptom matches)\n` +
          `Root cause: ${m.pattern.root_cause}\n` +
          `Fix strategy: ${m.pattern.fix_strategy}\n` +
          `Matched symptoms: ${m.matchedSymptoms.join(", ")}`
      )
      .join("\n\n");
    parts.push(`## Matched Known Patterns\n${patternSummary}`);
  } else {
    parts.push("## Matched Known Patterns\nNone — no known pattern matched this failure.");
  }

  if (langfuseAnomalies.length > 0) {
    const anomalySummary = langfuseAnomalies
      .map((a) => `- **${a.type}**: ${a.description}`)
      .join("\n");
    parts.push(`## Langfuse Anomalies\n${anomalySummary}`);
  }

  if (Object.keys(fileContents).length > 0) {
    const fileSection = Object.entries(fileContents)
      .map(([fp, content]) => `### ${fp}\n\`\`\`\n${content.slice(0, 2000)}\n\`\`\``)
      .join("\n\n");
    parts.push(`## Relevant File Contents\n${fileSection}`);
  }

  return parts.join("\n\n");
}

function readRelevantFiles(patterns: PatternMatch[]): Record<string, string> {
  const contents: Record<string, string> = {};
  const { globSync } = require("glob") as {
    globSync: (pattern: string, opts?: object) => string[];
  };

  for (const match of patterns.slice(0, 2)) {
    for (const globPattern of match.pattern.relevant_file_globs.slice(0, 2)) {
      const files = globSync(globPattern, { cwd: process.cwd() });
      for (const f of files.slice(0, 3)) {
        try {
          contents[f] = fs.readFileSync(path.resolve(process.cwd(), f), "utf8");
        } catch {
          // ignore unreadable files
        }
      }
    }
  }

  return contents;
}

export async function runAutoTriage(params: {
  testName: string;
  siteUrl: string;
  failureOutput: string;
  recentCommits: string;
  matchedPatterns: PatternMatch[];
  langfuseAnomalies: LangfuseAnomaly[];
}): Promise<TriageResult> {
  const client = new Anthropic();
  const fileContents = readRelevantFiles(params.matchedPatterns);
  const userPrompt = buildTriagePrompt({ ...params, fileContents });

  const triageTool: Anthropic.Tool = {
    name: "submit_triage_result",
    description: "Submit the root-cause hypothesis and proposed fix for this smoke test failure.",
    input_schema: {
      type: "object" as const,
      properties: {
        hypothesis: {
          type: "string",
          description: "Clear, specific root-cause hypothesis naming the file and mechanism.",
        },
        confidence: {
          type: "string",
          enum: ["high", "medium", "low"],
          description:
            "Confidence level. Only use 'high' when you can provide an exact file + string fix.",
        },
        affected_file: {
          type: "string",
          description: "Relative file path to change (only for high confidence).",
        },
        old_string: {
          type: "string",
          description:
            "Exact string to replace (only for high confidence — must be unique in the file).",
        },
        new_string: {
          type: "string",
          description: "Replacement string (only for high confidence).",
        },
        pr_title: {
          type: "string",
          description: "Short PR/issue title (< 70 chars), imperative, prefixed with 'fix:'.",
        },
        pr_body: {
          type: "string",
          description:
            "Markdown body with: hypothesis, evidence, suggested fix steps, and relevant commit SHAs.",
        },
      },
      required: ["hypothesis", "confidence", "pr_title", "pr_body"],
    },
  };

  const response = await client.messages.create({
    model: "claude-sonnet-4-6",
    max_tokens: 2048,
    system: SYSTEM_PROMPT,
    tools: [triageTool],
    tool_choice: { type: "any" },
    messages: [{ role: "user", content: userPrompt }],
  });

  const toolUse = response.content.find((b) => b.type === "tool_use");
  if (!toolUse || toolUse.type !== "tool_use") {
    return {
      hypothesis: "Auto-triage agent did not return a structured result.",
      confidence: "low",
      pr_title: `fix: smoke failure on ${params.siteUrl} — manual investigation required`,
      pr_body: `## Smoke Test Failure\n\n**Test:** ${params.testName}\n**Site:** ${params.siteUrl}\n\n**Error:**\n\`\`\`\n${params.failureOutput.slice(0, 1000)}\n\`\`\`\n\n*Auto-triage was unable to produce a structured diagnosis.*`,
    };
  }

  const input = toolUse.input as TriageResult & { matched_pattern?: string };
  if (params.matchedPatterns.length > 0) {
    input.matched_pattern = params.matchedPatterns[0].pattern.id;
  }
  return input;
}
