import type { LearningLevel } from "./types.js";

export const LEARNING_LEVELS: Record<
  LearningLevel,
  { label: string; description: string }
> = {
  1: { label: "Micro Change", description: "Tiny fix or clarification" },
  2: { label: "Small Improvement", description: "Incremental enhancement" },
  3: { label: "Standard Task", description: "Normal engineering task" },
  4: { label: "Major Feature", description: "Significant capability delivery" },
  5: { label: "Strategic Milestone", description: "Portfolio-level outcome" },
};

export function learningLevelLabel(level: LearningLevel): string {
  return LEARNING_LEVELS[level].label;
}

export function parseLearningLevel(value: string): LearningLevel | undefined {
  const parsed = Number.parseInt(value, 10);
  if (!Number.isInteger(parsed) || parsed < 1 || parsed > 5) {
    return undefined;
  }
  return parsed as LearningLevel;
}

export function formatLearningLevelMenu(): string {
  return Object.entries(LEARNING_LEVELS)
    .map(([n, { label, description }]) => `  ${n} — ${label} (${description})`)
    .join("\n");
}
