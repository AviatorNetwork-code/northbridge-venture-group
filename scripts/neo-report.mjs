#!/usr/bin/env node
/**
 * NEO client adapter — local JSON reports only.
 * No live API calls. No secrets. No customer data. No production writes.
 *
 * Usage:
 *   node scripts/neo-report.mjs --summary "Fixed CAT memory build" --area lib/cat
 *   node scripts/neo-report.mjs --repo-status
 *   node scripts/neo-report.mjs --summary "..." --pr 42 --pr-url https://github.com/.../pull/42 --pr-comment
 */

import { spawnSync } from "node:child_process";
import { randomUUID } from "node:crypto";
import {
  existsSync,
  mkdirSync,
  readFileSync,
  writeFileSync,
} from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(__dirname, "..");
const CONFIG_PATH = path.join(REPO_ROOT, ".northbridge", "neo.config.json");

function printHelp() {
  console.log(`NEO client report (local JSON only)

Usage:
  node scripts/neo-report.mjs [options]

Session report (default):
  --summary <text>          Prompt / session summary (required for session report)
  --area <path>             Primary package or area changed (e.g. lib/cat)
  --learning <text>         Learning note (repeatable)
  --pr <number>             Pull request number
  --pr-url <url>            Pull request URL
  --pr-title <text>         Pull request title
  --approval <decision>     approved | rejected | pending | not_applicable
  --reviewer <name>         Human reviewer label (no email)
  --review-notes <text>     Human review notes
  --governance-flag <tag>   Governance flag (repeatable)

Repo status report:
  --repo-status             Emit repo-status snapshot instead of session report

Validation:
  --skip-validation         Do not run lint/test/typecheck commands
  --lint-cmd <command>      Override lint command
  --test-cmd <command>      Override test command
  --typecheck-cmd <command> Override typecheck command

Output:
  --output <path>           Write JSON to custom path
  --dry-run                 Print JSON to stdout; do not write file
  --pr-comment              Also print GitHub PR comment markdown to stdout
  --help                    Show this help
`);
}

function parseArgs(argv) {
  const options = {
    summary: "",
    area: "",
    learning: [],
    pr: null,
    prUrl: "",
    prTitle: "",
    approval: "",
    reviewer: "",
    reviewNotes: "",
    governanceFlags: [],
    repoStatus: false,
    skipValidation: false,
    lintCmd: "",
    testCmd: "",
    typecheckCmd: "",
    output: "",
    dryRun: false,
    prComment: false,
    help: false,
  };

  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    switch (arg) {
      case "--help":
      case "-h":
        options.help = true;
        break;
      case "--summary":
        options.summary = argv[++i] ?? "";
        break;
      case "--area":
        options.area = argv[++i] ?? "";
        break;
      case "--learning":
        options.learning.push(argv[++i] ?? "");
        break;
      case "--pr":
        options.pr = Number.parseInt(argv[++i] ?? "", 10);
        break;
      case "--pr-url":
        options.prUrl = argv[++i] ?? "";
        break;
      case "--pr-title":
        options.prTitle = argv[++i] ?? "";
        break;
      case "--approval":
        options.approval = argv[++i] ?? "";
        break;
      case "--reviewer":
        options.reviewer = argv[++i] ?? "";
        break;
      case "--review-notes":
        options.reviewNotes = argv[++i] ?? "";
        break;
      case "--governance-flag":
        options.governanceFlags.push(argv[++i] ?? "");
        break;
      case "--repo-status":
        options.repoStatus = true;
        break;
      case "--skip-validation":
        options.skipValidation = true;
        break;
      case "--lint-cmd":
        options.lintCmd = argv[++i] ?? "";
        break;
      case "--test-cmd":
        options.testCmd = argv[++i] ?? "";
        break;
      case "--typecheck-cmd":
        options.typecheckCmd = argv[++i] ?? "";
        break;
      case "--output":
        options.output = argv[++i] ?? "";
        break;
      case "--dry-run":
        options.dryRun = true;
        break;
      case "--pr-comment":
        options.prComment = true;
        break;
      default:
        throw new Error(`Unknown argument: ${arg}`);
    }
  }

  return options;
}

function loadConfig() {
  if (!existsSync(CONFIG_PATH)) {
    throw new Error(`Missing config: ${CONFIG_PATH}`);
  }
  return JSON.parse(readFileSync(CONFIG_PATH, "utf8"));
}

function runGit(args) {
  const result = spawnSync("git", args, {
    cwd: REPO_ROOT,
    encoding: "utf8",
  });
  if (result.status !== 0) {
    throw new Error(result.stderr.trim() || `git ${args.join(" ")} failed`);
  }
  return result.stdout.trim();
}

function tryGit(args, fallback = "") {
  const result = spawnSync("git", args, {
    cwd: REPO_ROOT,
    encoding: "utf8",
  });
  if (result.status !== 0) {
    return fallback;
  }
  return result.stdout.trim();
}

function runShellCommand(command) {
  if (!command) {
    return {
      status: "not_run",
      command: "",
    };
  }

  const started = Date.now();
  const result = spawnSync(command, {
    cwd: REPO_ROOT,
    encoding: "utf8",
    shell: true,
    stdio: "pipe",
  });
  const durationMs = Date.now() - started;

  return {
    status: result.status === 0 ? "passed" : "failed",
    command,
    exitCode: result.status ?? 1,
    durationMs,
  };
}

function inferPackagesFromFiles(files) {
  const packages = new Set();
  for (const file of files) {
    const top = file.split("/")[0];
    if (top) {
      packages.add(top);
    }
    if (file.startsWith("lib/")) {
      const second = file.split("/")[1];
      if (second) {
        packages.add(`lib/${second}`);
      }
    }
    if (file.startsWith("app/")) {
      const second = file.split("/")[1];
      if (second) {
        packages.add(`app/${second}`);
      }
    }
  }
  return [...packages].sort();
}

function collectChangedFiles(config) {
  const includeUntracked = config.reporting?.includeUntrackedFiles === true;
  const args = includeUntracked
    ? ["status", "--porcelain"]
    : ["diff", "--name-only", "HEAD"];

  const raw = tryGit(args, "");
  const files = [];

  if (includeUntracked) {
    for (const line of raw.split("\n")) {
      if (!line.trim()) continue;
      const file = line.slice(3).trim();
      if (file) files.push(file);
    }
  } else {
    for (const line of raw.split("\n")) {
      const file = line.trim();
      if (file) files.push(file);
    }
  }

  const staged = tryGit(["diff", "--name-only", "--cached"], "")
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
  for (const file of staged) {
    if (!files.includes(file)) files.push(file);
  }

  const maxFiles = config.reporting?.maxFilesChanged ?? 500;
  const truncated = files.length > maxFiles;
  return {
    files: files.slice(0, maxFiles),
    truncated,
  };
}

function collectWorkingTreeCounts() {
  const porcelain = tryGit(["status", "--porcelain"], "");
  let modifiedCount = 0;
  let untrackedCount = 0;
  let stagedCount = 0;

  for (const line of porcelain.split("\n")) {
    if (!line.trim()) continue;
    const index = line[0];
    const worktree = line[1];
    if (index === "?") {
      untrackedCount += 1;
      continue;
    }
    if (index !== " ") stagedCount += 1;
    if (worktree !== " ") modifiedCount += 1;
  }

  return {
    clean: porcelain.trim().length === 0,
    modifiedCount,
    untrackedCount,
    stagedCount,
  };
}

function collectRepository(config) {
  const branch = runGit(["rev-parse", "--abbrev-ref", "HEAD"]);
  const commit = runGit(["rev-parse", "HEAD"]);
  const commitShort = runGit(["rev-parse", "--short", "HEAD"]);
  const defaultBranch = config.repository?.defaultBranch ?? "main";
  const remoteUrl = tryGit(["remote", "get-url", "origin"], "");
  const aheadBehind = tryGit(
    ["rev-list", "--left-right", "--count", `origin/${defaultBranch}...HEAD`],
    "",
  );
  let aheadOfRemote = 0;
  let behindRemote = 0;
  if (aheadBehind) {
    const [behind, ahead] = aheadBehind.split("\t").map((value) => Number.parseInt(value, 10));
    aheadOfRemote = Number.isFinite(ahead) ? ahead : 0;
    behindRemote = Number.isFinite(behind) ? behind : 0;
  }

  return {
    name: config.repository?.name ?? path.basename(REPO_ROOT),
    branch,
    commit,
    commitShort,
    defaultBranch,
    remoteUrl,
    isDefaultBranch: branch === defaultBranch,
    aheadOfRemote,
    behindRemote,
  };
}

function buildValidation(config, options) {
  if (options.skipValidation) {
    return {
      lint: { status: "skipped" },
      test: { status: "skipped" },
      typecheck: { status: "skipped" },
      skipped: true,
    };
  }

  const lintCmd = options.lintCmd || config.validation?.lintCommand || "";
  const testCmd = options.testCmd || config.validation?.testCommand || "";
  const typecheckCmd = options.typecheckCmd || config.validation?.typecheckCommand || "";

  return {
    lint: runShellCommand(lintCmd),
    test: runShellCommand(testCmd),
    typecheck: runShellCommand(typecheckCmd),
    skipped: false,
  };
}

function buildGovernance(config, flags) {
  return {
    liveApiEnabled: false,
    containsSecrets: false,
    containsCustomerData: false,
    productionWrites: false,
    flags,
    documentRefs: config.governance?.documentRefs ?? [],
  };
}

function buildIngest(config) {
  return {
    mode: "local-only",
    apiEndpointPlaceholder: config.ingest?.apiEndpointPlaceholder ?? "",
    apiEndpointNote: config.ingest?.apiEndpointNote ?? "",
  };
}

function buildSessionReport(config, options) {
  if (!options.summary.trim()) {
    throw new Error("--summary is required for session reports (or pass --repo-status).");
  }

  const repository = collectRepository(config);
  const { files, truncated } = collectChangedFiles(config);
  const packagesChanged = inferPackagesFromFiles(files);
  const area = options.area || packagesChanged[0] || "unknown";

  const report = {
    schemaVersion: "1.0.0",
    reportKind: "session-report",
    reportId: randomUUID(),
    generatedAt: new Date().toISOString(),
    client: {
      id: config.client?.id ?? "unknown-client",
      displayName: config.client?.displayName ?? "Unknown Client",
      adapterVersion: config.adapter?.version ?? "1.0.0",
    },
    repository: {
      name: repository.name,
      branch: repository.branch,
      commit: repository.commit,
      commitShort: repository.commitShort,
      remoteUrl: repository.remoteUrl,
    },
    session: {
      summary: options.summary.trim(),
      area,
      packagesChanged,
      learningNotes: options.learning.filter(Boolean),
    },
    changes: {
      filesChanged: files,
      filesChangedCount: files.length,
      truncated,
    },
    validation: buildValidation(config, options),
    governance: buildGovernance(config, options.governanceFlags.filter(Boolean)),
    ingest: buildIngest(config),
  };

  if (options.pr || options.prUrl || options.prTitle) {
    report.pullRequest = {
      ...(Number.isFinite(options.pr) ? { number: options.pr } : {}),
      ...(options.prUrl ? { url: options.prUrl } : {}),
      ...(options.prTitle ? { title: options.prTitle } : {}),
    };
  }

  if (options.approval) {
    report.humanReview = {
      decision: options.approval,
      ...(options.reviewer ? { reviewer: options.reviewer } : {}),
      ...(options.reviewNotes ? { notes: options.reviewNotes } : {}),
      recordedAt: new Date().toISOString(),
    };
  }

  return report;
}

function buildRepoStatusReport(config, options) {
  const repository = collectRepository(config);

  return {
    schemaVersion: "1.0.0",
    reportKind: "repo-status",
    reportId: randomUUID(),
    generatedAt: new Date().toISOString(),
    client: {
      id: config.client?.id ?? "unknown-client",
      displayName: config.client?.displayName ?? "Unknown Client",
      adapterVersion: config.adapter?.version ?? "1.0.0",
    },
    repository,
    workingTree: collectWorkingTreeCounts(),
    validation: buildValidation(config, options),
    governance: buildGovernance(config, options.governanceFlags.filter(Boolean)),
    ingest: buildIngest(config),
  };
}

function defaultOutputPath(report) {
  const dir = path.join(REPO_ROOT, ".northbridge", "reports");
  mkdirSync(dir, { recursive: true });
  const stamp = report.generatedAt.replace(/[:.]/g, "-");
  return path.join(dir, `${report.reportKind}-${stamp}-${report.reportId.slice(0, 8)}.json`);
}

function formatPrComment(report) {
  if (report.reportKind !== "session-report") {
    return [
      "## NEO repo status",
      "",
      `- Branch: \`${report.repository.branch}\` @ \`${report.repository.commitShort}\``,
      `- Working tree clean: ${report.workingTree.clean ? "yes" : "no"}`,
      `- Lint: ${report.validation.lint.status}`,
      `- Test: ${report.validation.test.status}`,
      `- Typecheck: ${report.validation.typecheck.status}`,
    ].join("\n");
  }

  const lines = [
    "## NEO session report",
    "",
    report.session.summary,
    "",
    `- Area: \`${report.session.area}\``,
    `- Branch: \`${report.repository.branch}\` @ \`${report.repository.commitShort}\``,
    `- Files changed: ${report.changes.filesChangedCount}${report.changes.truncated ? " (truncated)" : ""}`,
    `- Lint: ${report.validation.lint.status}`,
    `- Test: ${report.validation.test.status}`,
    `- Typecheck: ${report.validation.typecheck.status}`,
  ];

  if (report.pullRequest?.number || report.pullRequest?.url) {
    lines.push(
      `- PR: ${report.pullRequest.url ?? `#${report.pullRequest.number}`}`,
    );
  }

  if (report.humanReview?.decision) {
    lines.push(`- Human review: ${report.humanReview.decision}`);
  }

  if (report.session.learningNotes.length > 0) {
    lines.push("", "### Learning notes");
    for (const note of report.session.learningNotes) {
      lines.push(`- ${note}`);
    }
  }

  if (report.governance.flags.length > 0) {
    lines.push("", "### Governance flags");
    for (const flag of report.governance.flags) {
      lines.push(`- ${flag}`);
    }
  }

  lines.push("", "_Local NEO client adapter report — no live API call._");
  return lines.join("\n");
}

function main() {
  const options = parseArgs(process.argv.slice(2));
  if (options.help) {
    printHelp();
    return;
  }

  const config = loadConfig();
  const report = options.repoStatus
    ? buildRepoStatusReport(config, options)
    : buildSessionReport(config, options);

  const json = `${JSON.stringify(report, null, 2)}\n`;

  if (options.dryRun) {
    process.stdout.write(json);
  } else {
    const outputPath = options.output
      ? path.resolve(REPO_ROOT, options.output)
      : defaultOutputPath(report);
    mkdirSync(path.dirname(outputPath), { recursive: true });
    writeFileSync(outputPath, json, "utf8");
    console.log(`NEO report written: ${path.relative(REPO_ROOT, outputPath)}`);
  }

  if (options.prComment) {
    console.log("\n--- GitHub PR comment ---\n");
    console.log(formatPrComment(report));
  }
}

try {
  main();
} catch (error) {
  console.error(`neo-report: ${error instanceof Error ? error.message : String(error)}`);
  process.exit(1);
}
