import path from "node:path";
import { describe, expect, it } from "vitest";
import { sendNeo } from "../src/sendNeo.js";
import {
  createTempDir,
  SAMPLE_CONFIG,
  writeNeoFixture,
  writeProductFixture,
  writeReport,
} from "./fixtures.js";

describe("sendNeo", () => {
  it("returns friendly error when config is missing", async () => {
    const root = createTempDir("neo-bridge-no-config-");
    const result = await sendNeo({
      args: { dryRun: true, productRoot: root, help: false, level: 3 },
    });

    expect(result.ok).toBe(false);
    expect(result.summary).toMatch(/Bridge config not found/);
    expect(result.summary).toMatch(/What to do next/);
  });

  it("returns friendly error for invalid config", async () => {
    const root = createTempDir("neo-bridge-invalid-");
    writeProductFixture(root, { ...SAMPLE_CONFIG, productCode: "bad" });

    const result = await sendNeo({
      args: { dryRun: true, productRoot: root, help: false, level: 3 },
    });

    expect(result.ok).toBe(false);
    expect(result.summary).toMatch(/Invalid bridge config/);
  });

  it("returns friendly error when reports are missing", async () => {
    const root = createTempDir("neo-bridge-no-report-");
    writeProductFixture(root);

    const result = await sendNeo({
      args: { dryRun: true, productRoot: root, help: false, level: 3 },
    });

    expect(result.ok).toBe(false);
    expect(result.summary).toMatch(/Session Report not found/);
  });

  it("returns friendly error when level is missing in non-interactive mode", async () => {
    const root = createTempDir("neo-bridge-no-level-");
    writeProductFixture(root);
    writeReport(root, "session.md");

    const result = await sendNeo({
      args: { dryRun: true, productRoot: root, help: false },
      interactive: false,
    });

    expect(result.ok).toBe(false);
    expect(result.summary).toMatch(/Learning level required/);
  });

  it("dry-run previews pipeline without executing", async () => {
    const root = createTempDir("neo-bridge-dry-");
    writeProductFixture(root);
    writeReport(root, "session.md", "# Session\n");
    writeNeoFixture(path.resolve(root, "../neo"));

    const result = await sendNeo({
      args: { dryRun: true, productRoot: root, help: false, level: 4 },
      interactive: false,
    });

    expect(result.ok).toBe(true);
    expect(result.summary).toMatch(/dry run preview/);
    expect(result.summary).toMatch(/Major Feature/);
    expect(result.summary).toMatch(/No changes were made/);
    expect(result.plan?.level).toBe(4);
  });

  it("executes pipeline via injected runner", async () => {
    const root = createTempDir("neo-bridge-run-");
    writeProductFixture(root);
    writeReport(root, "session.md");
    writeNeoFixture(path.resolve(root, "../neo"));

    const result = await sendNeo({
      args: { dryRun: false, productRoot: root, help: false, level: 2 },
      interactive: false,
      runner: async () => ({ ok: true, stdout: "ingested", stderr: "" }),
    });

    expect(result.ok).toBe(true);
    expect(result.summary).toMatch(/Session Report sent to NEO/);
    expect(result.summary).toMatch(/Small Improvement/);
  });

  it("reports pipeline failure with friendly output", async () => {
    const root = createTempDir("neo-bridge-fail-");
    writeProductFixture(root);
    writeReport(root, "session.md");
    writeNeoFixture(path.resolve(root, "../neo"));

    const result = await sendNeo({
      args: { dryRun: false, productRoot: root, help: false, level: 1 },
      interactive: false,
      runner: async () => ({ ok: false, stdout: "", stderr: "validation failed" }),
    });

    expect(result.ok).toBe(false);
    expect(result.summary).toMatch(/NEO Learning Pipeline failed/);
    expect(result.summary).toMatch(/validation failed/);
  });
});
