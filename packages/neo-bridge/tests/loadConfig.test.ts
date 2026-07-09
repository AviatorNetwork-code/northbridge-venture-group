import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { loadConfig } from "../src/loadConfig.js";
import { createTempDir, writeProductFixture } from "./fixtures.js";

describe("loadConfig", () => {
  it("loads config from .northbridge/neo-bridge.json", () => {
    const root = createTempDir("neo-bridge-load-");
    writeProductFixture(root);

    const loaded = loadConfig(root);
    expect(loaded.ok).toBe(true);
    if (loaded.ok) {
      expect(loaded.config.productCode).toBe("AVN");
    }
  });

  it("fails on invalid JSON", () => {
    const root = createTempDir("neo-bridge-bad-json-");
    fs.mkdirSync(path.join(root, ".northbridge"), { recursive: true });
    fs.writeFileSync(path.join(root, ".northbridge/neo-bridge.json"), "{ bad");

    const loaded = loadConfig(root);
    expect(loaded.ok).toBe(false);
    if (!loaded.ok) {
      expect(loaded.error).toMatch(/not valid JSON/);
    }
  });
});
