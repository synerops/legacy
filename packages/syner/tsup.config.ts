// TODO: tsup cannot be dropped in favor of Bun.build yet:
// https://github.com/oven-sh/bun/issues/5141
import { defineConfig } from "tsup"

export default defineConfig({
  entry: {
    index: "src/index.ts",
  },
  format: ["cjs", "esm"],
  dts: true,
  clean: true,
  sourcemap: true,
  target: "es2020",

  external: ["ai", "zod", "bun", /^node:/, "@syner/sdk"],

  splitting: false,
  treeshake: true,

  loader: {
    ".md": "text",
  },
})
