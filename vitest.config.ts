import path from "node:path";
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "node",
    include: ["lib/**/*.test.ts"],
    exclude: ["node_modules/**", "packages/**"],
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "."),
      "@northbridge/operations-intelligence": path.resolve(
        __dirname,
        "../../NEOS - Northbridge Engineering Operating System/packages/platform/operations-intelligence/src/index.ts",
      ),
    },
  },
});
