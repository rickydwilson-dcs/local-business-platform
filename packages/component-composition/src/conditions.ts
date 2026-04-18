import type { ConditionConfig } from "./types";

export function evaluateCondition(
  condition: ConditionConfig | undefined,
  ctx: { flags?: Record<string, unknown>; data?: Record<string, unknown> }
): boolean {
  if (!condition || condition.type === "always") return true;

  const flags = ctx.flags ?? {};
  const data = ctx.data ?? {};

  if (condition.type === "flag") {
    if (!condition.key) return true;
    const val = flags[condition.key];
    if (condition.equals !== undefined) return val === condition.equals;
    return Boolean(val);
  }

  if (condition.type === "data-present") {
    if (!condition.key) return true;
    const val = data[condition.key];
    if (val == null) return false;
    if (Array.isArray(val)) return val.length > 0;
    return Boolean(val);
  }

  return true;
}
