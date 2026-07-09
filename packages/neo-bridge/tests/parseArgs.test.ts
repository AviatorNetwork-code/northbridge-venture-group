import { describe, expect, it } from "vitest";
import { parseLearningLevel } from "../src/learningLevels.js";
import { parseSendNeoArgs } from "../src/parseArgs.js";

describe("parseSendNeoArgs", () => {
  it("parses level and dry-run flags", () => {
    const args = parseSendNeoArgs(["--level", "3", "--dry-run"], "/tmp/product");
    expect(args.level).toBe(3);
    expect(args.dryRun).toBe(true);
    expect(args.productRoot).toBe("/tmp/product");
  });

  it("parses explicit report path", () => {
    const args = parseSendNeoArgs(["--report", ".northbridge/session-reports/a.md", "--level", "2"]);
    expect(args.reportPath).toBe(".northbridge/session-reports/a.md");
    expect(args.level).toBe(2);
  });

  it("throws on invalid level", () => {
    expect(() => parseSendNeoArgs(["--level", "9"])).toThrow(/Invalid learning level/);
  });

  it("throws on unknown option", () => {
    expect(() => parseSendNeoArgs(["--unknown"])).toThrow(/Unknown option/);
  });
});

describe("parseLearningLevel", () => {
  it("accepts levels 1 through 5", () => {
    expect(parseLearningLevel("1")).toBe(1);
    expect(parseLearningLevel("5")).toBe(5);
  });

  it("rejects out-of-range values", () => {
    expect(parseLearningLevel("0")).toBeUndefined();
    expect(parseLearningLevel("6")).toBeUndefined();
    expect(parseLearningLevel("x")).toBeUndefined();
  });
});
