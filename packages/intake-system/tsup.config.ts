import { defineConfig } from "tsup";

export default defineConfig({
  entry: {
    index: "src/index.ts",
    "schemas/index": "src/schemas/index.ts",
    "chat-intake/index": "src/chat-intake/index.ts",
    "theme-extraction/index": "src/theme-extraction/index.ts",
  },
  format: ["cjs", "esm"],
  dts: true,
  clean: true,
  sourcemap: true,
  splitting: false,
  external: ["sharp"], // sharp has native dependencies, keep external
});
