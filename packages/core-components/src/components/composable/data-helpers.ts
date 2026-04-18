export function str(v: unknown): string | undefined {
  return v != null && v !== "" ? String(v) : undefined;
}

export function bool(v: unknown): boolean {
  return Boolean(v);
}
