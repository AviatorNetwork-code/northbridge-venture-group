import path from "node:path";
import type { PipelinePlan } from "./types.js";
import { learningLevelLabel } from "./learningLevels.js";

export function formatDryRunSummary(plan: PipelinePlan): string {
  const lines = [
    "",
    "  NEO Bridge — dry run preview",
    "  ─────────────────────────────",
    "",
    `  Product:     ${plan.config.productName} (${plan.config.productCode})`,
    `  Repository:  ${plan.config.repositoryName}`,
    `  Report:      ${plan.report.fileName}`,
    `               ${plan.report.absolutePath}`,
    `  Level:       ${plan.level} — ${learningLevelLabel(plan.level)}`,
    `  NEO path:    ${plan.neoRoot}`,
    "",
    "  Would run:",
    `    node ${path.relative(plan.neoRoot, plan.pipelineScript)} \\`,
    `      --product-code ${plan.config.productCode} \\`,
    `      --product-name "${plan.config.productName}" \\`,
    `      --repository ${plan.config.repositoryName} \\`,
    `      --report "${plan.report.absolutePath}" \\`,
    `      --level ${plan.level}`,
    "",
    `  War Room:    ${plan.warRoomEnabled ? "enabled (config)" : "disabled (default)"}`,
    `  Learning:    ${plan.config.supportsLearning ? "yes" : "no"}`,
    "",
    "  No changes were made. Re-run without --dry-run to execute.",
    "",
  ];
  return lines.join("\n");
}

export function formatSuccessSummary(plan: PipelinePlan, pipelineOutput: string): string {
  const lines = [
    "",
    "  ✓ Session Report sent to NEO",
    "  ────────────────────────────",
    "",
    `  Product:  ${plan.config.productName} (${plan.config.productCode})`,
    `  Report:   ${plan.report.fileName}`,
    `  Level:    ${plan.level} — ${learningLevelLabel(plan.level)}`,
    "",
    "  NEO received your session report for organizational learning.",
    "  Product repositories report only — NEO writes institutional knowledge.",
    "",
  ];

  const trimmed = pipelineOutput.trim();
  if (trimmed) {
    lines.push("  Pipeline notes:", "", ...trimmed.split("\n").map((line) => `    ${line}`), "");
  }

  return lines.join("\n");
}

export function formatFailureSummary(title: string, detail: string): string {
  return ["", `  ✗ ${title}`, "", `  ${detail}`, ""].join("\n");
}
