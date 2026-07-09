import fs from "node:fs";
import path from "node:path";
import { spawn } from "node:child_process";
import type { LearningLevel, NeoBridgeConfig, PipelinePlan, PipelineRunner, SessionReport } from "./types.js";
import { NEO_PIPELINE_SCRIPT } from "./errors.js";
import { learningLevelLabel } from "./learningLevels.js";

export function buildPipelinePlan(
  productRoot: string,
  config: NeoBridgeConfig,
  report: SessionReport,
  level: LearningLevel,
  neoRoot: string,
): PipelinePlan {
  const pipelineScript = path.join(neoRoot, NEO_PIPELINE_SCRIPT);

  return {
    productRoot,
    config,
    report,
    level,
    levelLabel: learningLevelLabel(level),
    neoRoot,
    pipelineScript,
    pipelineArgv: [
      pipelineScript,
      "--product-code",
      config.productCode,
      "--product-name",
      config.productName,
      "--repository",
      config.repositoryName,
      "--report",
      report.absolutePath,
      "--level",
      String(level),
    ],
    warRoomEnabled: config.supportsWarRoom,
  };
}

export function pipelineScriptExists(plan: PipelinePlan): boolean {
  return fs.existsSync(plan.pipelineScript);
}

export const defaultPipelineRunner: PipelineRunner = (plan) =>
  new Promise((resolve) => {
    const child = spawn(process.execPath, plan.pipelineArgv, {
      cwd: plan.neoRoot,
      stdio: ["ignore", "pipe", "pipe"],
      env: { ...process.env },
    });

    let stdout = "";
    let stderr = "";

    child.stdout?.on("data", (chunk: Buffer) => {
      stdout += chunk.toString();
    });
    child.stderr?.on("data", (chunk: Buffer) => {
      stderr += chunk.toString();
    });

    child.on("close", (code) => {
      resolve({ ok: code === 0, stdout, stderr });
    });
  });

export async function runLearningPipeline(
  plan: PipelinePlan,
  runner: PipelineRunner = defaultPipelineRunner,
): Promise<{ ok: boolean; stdout: string; stderr: string }> {
  if (!pipelineScriptExists(plan)) {
    return {
      ok: false,
      stdout: "",
      stderr: `NEO Learning Pipeline not found at ${plan.pipelineScript}`,
    };
  }

  return runner(plan);
}
