import fs from "node:fs";
import path from "node:path";
import type { SessionReport } from "./types.js";

const REPORT_EXTENSIONS = new Set([".md", ".markdown", ".txt"]);

export function isReportFile(fileName: string): boolean {
  const ext = path.extname(fileName).toLowerCase();
  return REPORT_EXTENSIONS.has(ext);
}

export function findLatestReport(reportDir: string): SessionReport | undefined {
  if (!fs.existsSync(reportDir)) {
    return undefined;
  }

  const entries = fs.readdirSync(reportDir, { withFileTypes: true });
  let latest: SessionReport | undefined;

  for (const entry of entries) {
    if (!entry.isFile() || !isReportFile(entry.name)) {
      continue;
    }

    const absolutePath = path.join(reportDir, entry.name);
    const stat = fs.statSync(absolutePath);
    if (!latest || stat.mtimeMs > latest.modifiedAt.getTime()) {
      latest = {
        absolutePath,
        fileName: entry.name,
        modifiedAt: stat.mtime,
      };
    }
  }

  return latest;
}

export function resolveReportPath(
  productRoot: string,
  sessionReportPath: string,
  explicitReport?: string,
): SessionReport | undefined {
  if (explicitReport) {
    const absolutePath = path.isAbsolute(explicitReport)
      ? explicitReport
      : path.resolve(productRoot, explicitReport);

    if (!fs.existsSync(absolutePath)) {
      return undefined;
    }

    const stat = fs.statSync(absolutePath);
    return {
      absolutePath,
      fileName: path.basename(absolutePath),
      modifiedAt: stat.mtime,
    };
  }

  const reportDir = path.resolve(productRoot, sessionReportPath);
  return findLatestReport(reportDir);
}
