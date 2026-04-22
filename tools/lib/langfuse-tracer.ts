import * as dotenv from "dotenv";
import * as path from "path";

dotenv.config({ path: path.resolve(__dirname, "../../.env.local") });

type LangfuseInstance = {
  trace: (params: {
    name: string;
    metadata?: Record<string, unknown>;
    sessionId?: string;
  }) => LangfuseTrace;
  flushAsync: () => Promise<void>;
};

type LangfuseTrace = {
  id: string;
  update: (params: { output?: unknown; metadata?: Record<string, unknown> }) => void;
  generation: (params: {
    name: string;
    model: string;
    input?: unknown;
    output?: unknown;
    usage?: { input: number; output: number };
    level?: "DEFAULT" | "ERROR";
    statusMessage?: string;
  }) => void;
};

export type TraceContext = {
  traceId: string;
  end: (output?: unknown, error?: Error) => void;
  logGeneration: (params: {
    name: string;
    model: string;
    input?: unknown;
    output?: unknown;
    inputTokens?: number;
    outputTokens?: number;
    error?: string;
  }) => void;
};

let _langfuse: LangfuseInstance | null = null;
let _available: boolean | null = null;

function getLangfuse(): LangfuseInstance | null {
  if (_available === false) return null;
  if (_langfuse) return _langfuse;

  const secretKey = process.env.LANGFUSE_SECRET_KEY;
  const publicKey = process.env.LANGFUSE_PUBLIC_KEY;
  if (!secretKey || !publicKey) {
    _available = false;
    return null;
  }

  try {
    // Dynamic require so missing package doesn't crash when keys are absent
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { Langfuse } = require("langfuse") as { Langfuse: new (cfg: object) => LangfuseInstance };
    _langfuse = new Langfuse({
      secretKey,
      publicKey,
      baseUrl: process.env.LANGFUSE_HOST ?? "https://cloud.langfuse.com",
      flushAt: 10,
      flushInterval: 5000,
    });
    _available = true;
    return _langfuse;
  } catch {
    _available = false;
    return null;
  }
}

const NOOP_TRACE: TraceContext = {
  traceId: "",
  end: () => undefined,
  logGeneration: () => undefined,
};

export function createTrace(name: string, metadata?: Record<string, unknown>): TraceContext {
  const lf = getLangfuse();
  if (!lf) return { ...NOOP_TRACE, traceId: `local-${Date.now()}` };

  const trace = lf.trace({ name, metadata, sessionId: `session-${Date.now()}` });

  return {
    traceId: trace.id,
    end(output, error) {
      if (error) {
        trace.update({ metadata: { ...metadata, error: error.message } });
      } else {
        trace.update({ output });
      }
    },
    logGeneration({ name: genName, model, input, output, inputTokens, outputTokens, error }) {
      trace.generation({
        name: genName,
        model,
        input,
        output,
        usage:
          inputTokens !== undefined && outputTokens !== undefined
            ? { input: inputTokens, output: outputTokens }
            : undefined,
        level: error ? "ERROR" : "DEFAULT",
        statusMessage: error,
      });
    },
  };
}

export async function flushLangfuse(): Promise<void> {
  if (_langfuse) {
    await _langfuse.flushAsync();
  }
}
