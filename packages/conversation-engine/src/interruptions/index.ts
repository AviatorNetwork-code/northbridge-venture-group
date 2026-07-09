import { buildInterruptionAnswer } from "./knowledge.js";
import { buildInterruptionResumeLine } from "./resume.js";
import type { InterruptionHandleInput, InterruptionHandleResult } from "./types.js";

export function handleInterruption(input: InterruptionHandleInput): InterruptionHandleResult {
  const type = input.detection.type ?? "general_knowledge";
  const language = input.language ?? "en";
  const answer = buildInterruptionAnswer(type, language);
  const resumeLine = buildInterruptionResumeLine(input.resume);

  return {
    answer,
    resumeLine,
    fullReply: resumeLine ? `${answer}\n\n${resumeLine}` : answer,
  };
}

export { detectInterruption } from "./detectInterruption.js";
export { buildInterruptionAnswer } from "./knowledge.js";
export { buildInterruptionResumeLine } from "./resume.js";
export type {
  InterruptionDetection,
  InterruptionDetectionContext,
  InterruptionHandleInput,
  InterruptionHandleResult,
  InterruptionResumeContext,
  InterruptionType,
  SupportedLanguage,
} from "./types.js";
