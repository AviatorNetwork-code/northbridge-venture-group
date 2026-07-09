import { parseSendNeoArgs, printUsage } from "./parseArgs.js";
import { sendNeo } from "./sendNeo.js";
import { createInteractivePrompter } from "./promptLearningLevel.js";

export async function main(argv: string[]): Promise<number> {
  try {
    const args = parseSendNeoArgs(argv);

    if (args.help) {
      printUsage();
      return 0;
    }

    const interactive = Boolean(process.stdin.isTTY) && !args.level && !args.dryRun;
    const result = await sendNeo({
      args,
      interactive,
      prompter: interactive ? createInteractivePrompter() : undefined,
    });

    console.log(result.summary);
    return result.exitCode;
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error(`\n  ✗ ${message}\n`);
    printUsage();
    return 1;
  }
}
