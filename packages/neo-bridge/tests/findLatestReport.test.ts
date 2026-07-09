import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { findLatestReport, resolveReportPath } from "../src/findLatestReport.js";
import {
  createTempDir,
  writeProductFixture,
  writeReport,
} from "./fixtures.js";

describe("findLatestReport", () => {
  it("returns undefined when directory is missing", () => {
    expect(findLatestReport("/tmp/does-not-exist-neo-bridge")).toBeUndefined();
  });

  it("returns undefined when no report files exist", () => {
    const root = createTempDir("neo-bridge-empty-");
    const dir = path.join(root, "reports");
    fs.mkdirSync(dir);
    fs.writeFileSync(path.join(dir, "notes.json"), "{}");
    expect(findLatestReport(dir)).toBeUndefined();
  });

  it("selects the newest report by modification time", () => {
    const root = createTempDir("neo-bridge-latest-");
    writeReport(root, "older.md", "# older\n");
    const newerPath = writeReport(root, "newer.md", "# newer\n");

    const past = new Date(Date.now() - 60_000);
    fs.utimesSync(path.join(root, ".northbridge/session-reports/older.md"), past, past);

    const latest = findLatestReport(path.join(root, ".northbridge/session-reports"));
    expect(latest?.absolutePath).toBe(newerPath);
    expect(latest?.fileName).toBe("newer.md");
  });

  it("resolves explicit report path", () => {
    const root = createTempDir("neo-bridge-explicit-");
    writeProductFixture(root);
    const reportPath = writeReport(root, "custom.md");

    const report = resolveReportPath(root, ".northbridge/session-reports", reportPath);
    expect(report?.fileName).toBe("custom.md");
  });
});
