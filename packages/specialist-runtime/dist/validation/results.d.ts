import type { TaskExecutionOutput } from "../types/execution.js";
import type { ConfidenceScore } from "../types/confidence.js";
import type { RuntimePolicy } from "../types/policy.js";
export declare function validateExecutionOutput(output: TaskExecutionOutput): void;
export declare function validateConfidenceAgainstPolicy(confidence: ConfidenceScore, policy: RuntimePolicy): void;
