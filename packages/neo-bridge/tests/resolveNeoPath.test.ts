import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { resolveNeoPath } from "../src/resolveNeoPath.js";
import { createTempDir, writeNeoFixture } from "./fixtures.js";

describe("resolveNeoPath", () => {
  it("resolves relative neo path from product root", () => {
    const productRoot = createTempDir("neo-bridge-product-");
    const neoRoot = writeNeoFixture(path.join(productRoot, "neo"));
    const result = resolveNeoPath(productRoot, "neo");
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.neoRoot).toBe(neoRoot);
    }
  });

  it("fails when neo path does not exist", () => {
    const productRoot = createTempDir("neo-bridge-missing-neo-");
    const result = resolveNeoPath(productRoot, "../missing-neo");
    expect(result.ok).toBe(false);
  });

  it("fails when path is not a NEOS repository", () => {
    const productRoot = createTempDir("neo-bridge-bad-neo-");
    const badNeo = path.join(productRoot, "not-neo");
    fs.mkdirSync(badNeo);
    const result = resolveNeoPath(productRoot, "not-neo");
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error).toMatch(/package.json/);
    }
  });
});
