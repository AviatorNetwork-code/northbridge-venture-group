export type LearningLevel = 1 | 2 | 3 | 4 | 5;

export interface NeoBridgeConfig {
  productCode: string;
  productName: string;
  repositoryName: string;
  sessionReportPath: string;
  neoPath: string;
  supportsLearning: boolean;
  supportsStatus: boolean;
  supportsWarRoom: boolean;
}

export interface SendNeoArgs {
  dryRun: boolean;
  level?: LearningLevel;
  reportPath?: string;
  productRoot: string;
  help: boolean;
}

export interface SessionReport {
  absolutePath: string;
  fileName: string;
  modifiedAt: Date;
}

export interface PipelinePlan {
  productRoot: string;
  config: NeoBridgeConfig;
  report: SessionReport;
  level: LearningLevel;
  levelLabel: string;
  neoRoot: string;
  pipelineScript: string;
  pipelineArgv: string[];
  warRoomEnabled: boolean;
}

export interface SendNeoResult {
  ok: boolean;
  exitCode: number;
  summary: string;
  plan?: PipelinePlan;
  error?: string;
}

export type LearningLevelPrompter = () => Promise<LearningLevel>;

export interface PipelineRunner {
  (plan: PipelinePlan): Promise<{ ok: boolean; stdout: string; stderr: string }>;
}
