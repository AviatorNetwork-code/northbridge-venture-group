import readline from "node:readline/promises";
import { stdin as input, stdout as output } from "node:process";
import type { LearningLevel, LearningLevelPrompter } from "./types.js";
import { formatLearningLevelMenu, parseLearningLevel } from "./learningLevels.js";

export function createInteractivePrompter(): LearningLevelPrompter {
  return async () => {
    const rl = readline.createInterface({ input, output });
    try {
      console.log("\nSelect learning level:\n");
      console.log(formatLearningLevelMenu());
      console.log("");

      while (true) {
        const answer = await rl.question("Level (1–5): ");
        const level = parseLearningLevel(answer.trim());
        if (level) {
          return level;
        }
        console.log("  Please enter a number from 1 to 5.\n");
      }
    } finally {
      rl.close();
    }
  };
}

export async function resolveLearningLevel(
  provided: LearningLevel | undefined,
  prompter: LearningLevelPrompter | undefined,
  interactive: boolean,
): Promise<LearningLevel | undefined> {
  if (provided) {
    return provided;
  }

  if (interactive && prompter) {
    return prompter();
  }

  return undefined;
}
