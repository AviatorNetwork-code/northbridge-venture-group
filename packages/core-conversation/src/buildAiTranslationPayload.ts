import type { AiTranslationPayload, AiTranslationPayloadInput } from "./types.js";

const DEFAULT_TRANSLATION_SYSTEM_PROMPT = `You are a product assistant — translate deterministic tool summaries for the user.

Rules:
- Output a single JSON object: { "answer": string }
- Base the answer ONLY on the provided compact tool summary and the user's message.
- Do NOT invent data not present in the summary.
- If data is missing or the tool failed, say so plainly.
- Keep answers concise and helpful.`;

export function buildAiTranslationPayload(
  input: AiTranslationPayloadInput,
  systemPrompt = DEFAULT_TRANSLATION_SYSTEM_PROMPT,
): AiTranslationPayload {
  const user = [
    "User message:",
    input.message,
    "",
    `Tool invoked: ${input.tool}`,
    "",
    "Compact tool summary (read-only, redacted):",
    JSON.stringify(input.compactSummary, null, 2),
    "",
    'Respond with JSON only: { "answer": "..." }',
  ].join("\n");

  return { system: systemPrompt, user };
}
