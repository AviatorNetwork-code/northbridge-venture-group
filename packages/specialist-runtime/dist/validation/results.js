import { meetsMinimumConfidence } from "../types/confidence.js";
import { SpecialistRuntimeError } from "../runtime/errors.js";
export function validateExecutionOutput(output) {
    if (!output.summary.trim()) {
        throw new SpecialistRuntimeError("result_invalid", "Task execution output must include a non-empty summary");
    }
    if (!output.confidence) {
        throw new SpecialistRuntimeError("result_invalid", "Task execution output must include a confidence score");
    }
}
export function validateConfidenceAgainstPolicy(confidence, policy) {
    if (!meetsMinimumConfidence(confidence, policy.minimumConfidence)) {
        throw new SpecialistRuntimeError("confidence_too_low", `Confidence level '${confidence.level}' is below policy minimum '${policy.minimumConfidence}'`, { detail: { confidence, minimum: policy.minimumConfidence } });
    }
}
