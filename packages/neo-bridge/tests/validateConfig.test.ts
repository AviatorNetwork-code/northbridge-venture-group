import { describe, expect, it } from "vitest";
import { validateConfig } from "../src/validateConfig.js";
import { SAMPLE_CONFIG } from "./fixtures.js";

describe("validateConfig", () => {
  it("accepts a valid config", () => {
    expect(validateConfig(SAMPLE_CONFIG)).toEqual([]);
  });

  it("reports missing required fields", () => {
    const issues = validateConfig({ productCode: "AVN" });
    expect(issues.some((i) => i.field === "productName")).toBe(true);
    expect(issues.some((i) => i.field === "neoPath")).toBe(true);
  });

  it("rejects invalid product code", () => {
    const issues = validateConfig({ ...SAMPLE_CONFIG, productCode: "avn" });
    expect(issues.some((i) => i.field === "productCode")).toBe(true);
  });

  it("rejects unknown fields", () => {
    const issues = validateConfig({ ...SAMPLE_CONFIG, extra: true });
    expect(issues.some((i) => i.field === "extra")).toBe(true);
  });

  it("rejects non-boolean feature flags", () => {
    const issues = validateConfig({ ...SAMPLE_CONFIG, supportsLearning: "yes" });
    expect(issues.some((i) => i.field === "supportsLearning")).toBe(true);
  });
});
