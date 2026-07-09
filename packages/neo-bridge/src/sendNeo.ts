import path from "node:path";
import type {
  LearningLevelPrompter,
  PipelineRunner,
  SendNeoArgs,
  SendNeoResult,
} from "./types.js";
import { friendlyError, CONFIG_RELATIVE_PATH } from "./errors.js";
import { loadConfig } from "./loadConfig.js";
import { validateConfig } from "./validateConfig.js";
import { resolveReportPath } from "./findLatestReport.js";
import { resolveNeoPath } from "./resolveNeoPath.js";
import { resolveLearningLevel } from "./promptLearningLevel.js";
import {
  buildPipelinePlan,
  pipelineScriptExists,
  runLearningPipeline,
} from "./runLearningPipeline.js";
import {
  formatDryRunSummary,
  formatFailureSummary,
  formatSuccessSummary,
} from "./summary.js";

export interface SendNeoOptions {
  args: SendNeoArgs;
  interactive?: boolean;
  prompter?: LearningLevelPrompter;
  runner?: PipelineRunner;
}

export async function sendNeo(options: SendNeoOptions): Promise<SendNeoResult> {
  const { args, interactive = false, prompter, runner } = options;
  const productRoot = path.resolve(args.productRoot);

  const loaded = loadConfig(productRoot);
  if (!loaded.ok) {
    return fail(
      "Bridge config not found",
      loaded.error,
      [
        `Create ${CONFIG_RELATIVE_PATH} in your product repository`,
        "See docs/platform/NEO-BRIDGE-INSTALLABLE-PACKAGE.md in NEOS",
      ],
    );
  }

  const issues = validateConfig(loaded.config);
  if (issues.length > 0) {
    const detail = issues.map((i) => `${i.field}: ${i.message}`).join("\n           ");
    return fail("Invalid bridge config", detail, [
      `Fix ${CONFIG_RELATIVE_PATH}`,
      "Validate productCode, paths, and boolean flags",
    ]);
  }

  const config = loaded.config;

  if (!config.supportsLearning) {
    return fail(
      "Learning not enabled",
      `${config.productName} has supportsLearning: false`,
      ["Set supportsLearning to true when ready", "Or use status-only reporting (future)"],
    );
  }

  const report = resolveReportPath(productRoot, config.sessionReportPath, args.reportPath);
  if (!report) {
    const target = args.reportPath
      ? path.resolve(productRoot, args.reportPath)
      : path.resolve(productRoot, config.sessionReportPath);
    return fail(
      "Session Report not found",
      args.reportPath
        ? `No report at ${target}`
        : `No reports in ${config.sessionReportPath}`,
      [
        "Add a Session Report (.md) to the configured directory",
        "Or pass --report <path> to specify a file",
      ],
    );
  }

  const level = await resolveLearningLevel(args.level, prompter, interactive);
  if (!level) {
    return fail(
      "Learning level required",
      "No --level provided and interactive prompt is unavailable",
      ["Run with --level 1 through --level 5", "Or run in a terminal to select interactively"],
    );
  }

  const neo = resolveNeoPath(productRoot, config.neoPath);
  if (!neo.ok) {
    return fail("NEO path resolution failed", neo.error, [
      "Check neoPath in neo-bridge.json",
      "Use a relative path from the product repo or an absolute path",
      "Ensure the NEOS repository is cloned locally",
    ]);
  }

  const plan = buildPipelinePlan(productRoot, config, report, level, neo.neoRoot);

  if (args.dryRun) {
    const scriptNote = pipelineScriptExists(plan)
      ? ""
      : "\n  Note: NEO Learning Pipeline script is not installed yet in NEOS.\n";
    return {
      ok: true,
      exitCode: 0,
      summary: formatDryRunSummary(plan) + scriptNote,
      plan,
    };
  }

  if (!pipelineScriptExists(plan)) {
    return fail(
      "NEO Learning Pipeline not available",
      `Expected script at tools/neo-learning-pipeline.mjs in ${neo.neoRoot}`,
      [
        "Update your local NEOS repository",
        "Use --dry-run to preview until the pipeline ships",
      ],
    );
  }

  const result = await runLearningPipeline(plan, runner);
  if (!result.ok) {
    const detail = result.stderr.trim() || result.stdout.trim() || "Pipeline exited with an error";
    return {
      ok: false,
      exitCode: 1,
      summary: formatFailureSummary("NEO Learning Pipeline failed", detail),
      plan,
      error: detail,
    };
  }

  return {
    ok: true,
    exitCode: 0,
    summary: formatSuccessSummary(plan, result.stdout),
    plan,
  };
}

function fail(title: string, detail: string, nextSteps: string[]): SendNeoResult {
  return {
    ok: false,
    exitCode: 1,
    summary: friendlyError(title, detail, nextSteps),
    error: detail,
  };
}
