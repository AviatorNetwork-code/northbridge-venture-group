export function friendlyError(title: string, detail: string, nextSteps: string[]): string {
  const steps = nextSteps.map((step, index) => `  ${index + 1}. ${step}`).join("\n");
  return [
    "",
    `  ✗ ${title}`,
    "",
    `  ${detail}`,
    "",
    "  What to do next:",
    steps,
    "",
  ].join("\n");
}

export const CONFIG_RELATIVE_PATH = ".northbridge/neo-bridge.json";

export const NEO_PIPELINE_SCRIPT = "tools/neo-learning-pipeline.mjs";
