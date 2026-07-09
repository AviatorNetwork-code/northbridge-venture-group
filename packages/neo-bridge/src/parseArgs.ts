import type { SendNeoArgs } from "./types.js";
import { parseLearningLevel } from "./learningLevels.js";

export function parseSendNeoArgs(argv: string[], cwd = process.cwd()): SendNeoArgs {
  const args: SendNeoArgs = {
    dryRun: false,
    productRoot: cwd,
    help: false,
  };

  for (let i = 0; i < argv.length; i++) {
    const token = argv[i];

    if (token === "--help" || token === "-h") {
      args.help = true;
      continue;
    }

    if (token === "--dry-run") {
      args.dryRun = true;
      continue;
    }

    if (token === "--level") {
      const value = argv[++i];
      if (!value) {
        throw new Error("Missing value for --level (use 1–5)");
      }
      const level = parseLearningLevel(value);
      if (!level) {
        throw new Error(`Invalid learning level '${value}'. Use 1–5.`);
      }
      args.level = level;
      continue;
    }

    if (token === "--report") {
      const value = argv[++i];
      if (!value) {
        throw new Error("Missing path for --report");
      }
      args.reportPath = value;
      continue;
    }

    if (token === "--root") {
      const value = argv[++i];
      if (!value) {
        throw new Error("Missing path for --root");
      }
      args.productRoot = value;
      continue;
    }

    if (token.startsWith("-")) {
      throw new Error(`Unknown option: ${token}`);
    }
  }

  return args;
}

export function printUsage(): void {
  console.log(`northbridge-send-neo — send a Session Report to NEO

Usage:
  northbridge-send-neo [options]

Options:
  --level <1-5>     Learning level (1=Micro … 5=Strategic)
  --report <path>   Session report file (default: latest in config path)
  --root <path>     Product repository root (default: cwd)
  --dry-run         Preview actions without running NEO pipeline
  -h, --help        Show this help

Learning levels:
  1 — Micro Change
  2 — Small Improvement
  3 — Standard Task
  4 — Major Feature
  5 — Strategic Milestone

Requires: .northbridge/neo-bridge.json in the product repository.
`);
}
