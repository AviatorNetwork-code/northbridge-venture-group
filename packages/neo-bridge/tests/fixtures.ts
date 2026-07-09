import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import type { NeoBridgeConfig } from "../src/types.js";

export const SAMPLE_CONFIG: NeoBridgeConfig = {
  productCode: "AVN",
  productName: "Aviator Network",
  repositoryName: "aviator-network",
  sessionReportPath: ".northbridge/session-reports",
  neoPath: "../neo",
  supportsLearning: true,
  supportsStatus: true,
  supportsWarRoom: false,
};

export function createTempDir(prefix: string): string {
  return fs.mkdtempSync(path.join(os.tmpdir(), prefix));
}

export function writeProductFixture(root: string, config: NeoBridgeConfig = SAMPLE_CONFIG): void {
  fs.mkdirSync(path.join(root, ".northbridge", "session-reports"), { recursive: true });
  fs.writeFileSync(
    path.join(root, ".northbridge", "neo-bridge.json"),
    `${JSON.stringify(config, null, 2)}\n`,
  );
}

export function writeReport(
  root: string,
  fileName: string,
  content = "# Session Report\n",
  subdir = ".northbridge/session-reports",
): string {
  const dir = path.join(root, subdir);
  fs.mkdirSync(dir, { recursive: true });
  const filePath = path.join(dir, fileName);
  fs.writeFileSync(filePath, content);
  return filePath;
}

export function writeNeoFixture(root: string): string {
  fs.mkdirSync(path.join(root, "tools"), { recursive: true });
  fs.writeFileSync(
    path.join(root, "package.json"),
    JSON.stringify({ name: "@northbridge/neos" }),
  );
  fs.writeFileSync(
    path.join(root, "tools", "neo-learning-pipeline.mjs"),
    "console.log('pipeline ok');\n",
  );
  return root;
}
