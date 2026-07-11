/**
 * MCP server endpoint for DCH Automotive.
 *
 * COMPATIBILITY DECISION (2026-07-11):
 * Uses Vercel's `mcp-handler` (`createMcpHandler`) — the ergonomic path — because
 * there is NO zod-version conflict to work around. This site is on `zod@^4.1.11`
 * (used elsewhere for MDX content-schema validation), and the live npm peer data
 * confirms the whole chain supports zod v4:
 *   - `mcp-handler@1.1.0` peer: `@modelcontextprotocol/sdk: 1.26.0`, `next: >=13`
 *   - `@modelcontextprotocol/sdk@1.26.0` peer: `zod: ^3.25 || ^4.0`  <-- v4 supported
 * So there was no reason to downgrade zod or hand-roll the lower-level Streamable
 * HTTP transport; `createMcpHandler` with a zod raw shape resolves the single
 * root-level zod v4 instance for both the SDK and our tool definitions.
 *
 * The dynamic `[transport]` segment lets `mcp-handler` serve both transports of
 * the current MCP spec from one route: Streamable HTTP at `/api/mcp` and the
 * legacy SSE pair at `/api/sse` + `/api/message` (basePath `/api`).
 *
 * `runtime = 'nodejs'` is required: the tool reads the synced Viezu catalogue
 * from the filesystem via `@/lib/car-remaps/repository` (`fs/promises`,
 * `process.cwd()`), which the edge runtime can't do.
 */

import { createMcpHandler } from 'mcp-handler';
import { registerCarRemapsTools } from '@/lib/car-remaps/mcp-tools';

export const runtime = 'nodejs';

// The MCP server holds no long-lived state (each tool call reads fresh from the
// catalogue), so Redis-backed SSE resumability is intentionally not configured.
const handler = createMcpHandler(
  (server) => {
    registerCarRemapsTools(server);
  },
  {
    // `McpServer` auto-registers the `tools` capability when `server.tool()`
    // is called, so we only set identifying server info here.
    serverInfo: {
      name: 'dch-automotive-car-remaps',
      version: '1.0.0',
    },
  },
  {
    basePath: '/api',
    // No `redisUrl` -> SSE resumability disabled; Streamable HTTP is stateless.
    maxDuration: 60,
    verboseLogs: false,
  }
);

export { handler as GET, handler as POST, handler as DELETE };
