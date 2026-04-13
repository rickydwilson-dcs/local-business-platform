/**
 * Entry B: Stitch MCP
 *
 * Stub — full implementation deferred to a follow-up session.
 * The Stitch MCP pipeline generates designs via the Stitch AI tool,
 * then outputs HTML/screenshots into CPF format.
 *
 * To use this entry point today:
 *   1. Run /pipeline.stitch-design with --cpf-output flag
 *   2. The skill saves its output to output/clones/<name>/ in CPF format
 *   3. Proceed to Stage 2 (extract-theme) directly
 */

export function stitchMcpEntry(): never {
  console.log("\nStitch MCP entry (Entry B) is not yet implemented as a programmatic entry point.");
  console.log("Use /pipeline.stitch-design with --cpf-output flag instead.");
  console.log("The skill will output CPF-formatted files to output/clones/<name>/ automatically.");
  process.exit(1);
}
