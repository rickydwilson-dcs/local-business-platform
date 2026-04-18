async function main() {
  const m = await import("../packages/component-composition/src/schemas.js");
  console.log("keys:", Object.keys(m));
  console.log("SiteCompositionConfigSchema:", typeof m.SiteCompositionConfigSchema);
}
main().catch((e: Error) => console.error("FAIL:", e.message));
