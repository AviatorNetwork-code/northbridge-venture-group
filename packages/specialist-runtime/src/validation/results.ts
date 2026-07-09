import type { TaskExecutionOutput } from "../types/execution.js";
import type { ConfidenceScore } from "../types/confidence.js";
import { meetsMinimumConfidence } from "../types/confidence.js";
import type { RuntimePolicy } from "../types/policy.js";
import { SpecialistRuntimeError } from "../runtime/errors.js";

export function validateExecutionOutput(
  output: TaskExecutionOutput,
): void {
  if (!output.summary.trim()) {
    throw new SpecialistRuntimeError(
      "result_invalid",
      "Task execution output must include a non-empty summary",
    );
  }
  if (!output.confidence) {
    throw new SpecialistRuntimeError(
      "result_invalid",
      "Task execution output must include a confidence score",
    );
  }
}

export function validateConfidenceAgainstPolicy(
  confidence: ConfidenceScore,
  policy: RuntimePolicy,
): void {
  if (!meetsMinimumConfidence(confidence, policy.minimumConfidence)) {
    throw new SpecialistRuntimeError(
      "confidence_too_low",
      `Confidence level '${confidence.level}' is below policy minimum '${policy.minimumConfidence}'`,
      { detail: { confidence, minimum: policy.minimumConfidence } },
    );
  }
}
