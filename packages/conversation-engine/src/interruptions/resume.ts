import type { InterruptionResumeContext } from "./types.js";

export function buildInterruptionResumeLine(context: InterruptionResumeContext): string | undefined {
  if (!context.questionStillPending) return undefined;
  if (!context.pendingQuestionPrompt) return undefined;

  const prefix =
    context.language === "es" ? "Volvamos a su negocio — " : "Now, back to your business — ";

  return `${prefix}${context.pendingQuestionPrompt}`;
}
