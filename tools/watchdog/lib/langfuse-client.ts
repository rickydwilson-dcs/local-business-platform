import * as dotenv from "dotenv";
import * as path from "path";
import type { LangfuseAnomaly } from "./types";

dotenv.config({ path: path.resolve(__dirname, "../../../.env.local") });

interface LangfuseTrace {
  id: string;
  name: string;
  createdAt: string;
  totalCost?: number;
  level?: string;
  status?: string;
}

interface LangfuseTracesResponse {
  data: LangfuseTrace[];
  meta: { totalCount: number };
}

async function fetchLangfuse(endpoint: string): Promise<Response> {
  const secretKey = process.env.LANGFUSE_SECRET_KEY;
  const publicKey = process.env.LANGFUSE_PUBLIC_KEY;
  const host = process.env.LANGFUSE_HOST ?? "https://cloud.langfuse.com";

  const credentials = Buffer.from(`${publicKey}:${secretKey}`).toString("base64");
  return fetch(`${host}${endpoint}`, {
    headers: { Authorization: `Basic ${credentials}` },
  });
}

export async function queryAnomalies(windowMs = 3_600_000): Promise<LangfuseAnomaly[]> {
  const secretKey = process.env.LANGFUSE_SECRET_KEY;
  const publicKey = process.env.LANGFUSE_PUBLIC_KEY;
  if (!secretKey || !publicKey) return [];

  try {
    const fromTimestamp = new Date(Date.now() - windowMs).toISOString();
    const url = `/api/public/traces?limit=100&fromTimestamp=${encodeURIComponent(fromTimestamp)}`;
    const res = await fetchLangfuse(url);
    if (!res.ok) return [];

    const body = (await res.json()) as LangfuseTracesResponse;
    const traces = body.data ?? [];
    const anomalies: LangfuseAnomaly[] = [];

    // Error-rate check: > 20% traces with error/warning level
    const errorTraces = traces.filter((t) => t.level === "ERROR" || t.status === "ERROR");
    if (traces.length > 0 && errorTraces.length / traces.length > 0.2) {
      anomalies.push({
        type: "error-rate",
        description: `${errorTraces.length}/${traces.length} traces in the last window had errors (>${Math.round((errorTraces.length / traces.length) * 100)}%)`,
        traceIds: errorTraces.slice(0, 5).map((t) => t.id),
      });
    }

    // Cost-spike check: any trace with cost > 10× average
    const tracesWithCost = traces.filter((t) => typeof t.totalCost === "number" && t.totalCost > 0);
    if (tracesWithCost.length > 2) {
      const avgCost =
        tracesWithCost.reduce((sum, t) => sum + (t.totalCost ?? 0), 0) / tracesWithCost.length;
      const spikes = tracesWithCost.filter((t) => (t.totalCost ?? 0) > avgCost * 10);
      if (spikes.length > 0) {
        anomalies.push({
          type: "cost-spike",
          description: `${spikes.length} trace(s) with cost > 10× rolling average ($${avgCost.toFixed(4)} avg)`,
          traceIds: spikes.map((t) => t.id),
        });
      }
    }

    return anomalies;
  } catch {
    return [];
  }
}
