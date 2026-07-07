#!/usr/bin/env node
/**
 * NEO consumer bootstrap for the Northbridge product repo.
 *
 * Goal: let an operator consume NEO (Northbridge Engineering Operating System)
 * WITHOUT knowing NEO internals. This script only orchestrates the operator
 * experience and reports status. It never runs a real install — every NEO
 * manifest install is executed with --dry-run.
 *
 * What it does:
 *   1. Reads .northbridge/neo.config.json
 *   2. Resolves the NEO repo path from config
 *   3. Clones NEO if the repo is missing (using config.neo.repoUrl)
 *   4. In the NEO repo: installs deps, builds the CLI, verifies `neo`
 *   5. From THIS product repo, runs dry-run validation:
 *        neo manifest validate <platform>
 *        neo manifest plan <platform> --org <org> --dry-run
 *        neo install manifest <platform> --org <org> --dry-run
 *   6. Prints a human-readable status report + the next command to run
 *
 * Usage:
 *   npm run neo:bootstrap
 *   node scripts/bootstrap-neo.mjs [--skip-clone] [--skip-build] [--json] [--help]
 *
 * This script is safe to run repeatedly (idempotent) and never exposes secrets:
 * it only reports whether each connector credential env var is present.
 */

import { spawnSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(__dirname, "..");
const CONFIG_PATH = path.join(REPO_ROOT, ".northbridge", "neo.config.json");
const ENV_PATH = path.join(REPO_ROOT, ".env");

const TIMEOUTS = {
  clone: 180_000,
  build: 900_000,
  verify: 60_000,
  dryRun: 120_000,
};

const SYMBOLS = { ok: "✓", warn: "!", fail: "✗", info: "•" };

function parseArgs(argv) {
  const options = { skipClone: false, skipBuild: false, json: false, help: false };
  for (const arg of argv) {
    switch (arg) {
      case "--skip-clone":
        options.skipClone = true;
        break;
      case "--skip-build":
        options.skipBuild = true;
        break;
      case "--json":
        options.json = true;
        break;
      case "--help":
      case "-h":
        options.help = true;
        break;
      default:
        throw new Error(`Unknown argument: ${arg}`);
    }
  }
  return options;
}

function printHelp() {
  console.log(`NEO consumer bootstrap (dry-run only)

Usage:
  npm run neo:bootstrap
  node scripts/bootstrap-neo.mjs [options]

Options:
  --skip-clone   Do not clone NEO even if it is missing
  --skip-build   Do not install/build the NEO CLI (use an existing build)
  --json         Also print the machine-readable status report as JSON
  --help, -h     Show this help

Notes:
  - Never runs a real install: NEO manifest installs always use --dry-run.
  - Never prints secret values; only reports whether each credential is set.
`);
}

function loadConfig() {
  if (!existsSync(CONFIG_PATH)) {
    return { error: `Missing config: ${path.relative(REPO_ROOT, CONFIG_PATH)}` };
  }
  try {
    return { config: JSON.parse(readFileSync(CONFIG_PATH, "utf8")) };
  } catch (error) {
    return { error: `Invalid JSON in ${path.relative(REPO_ROOT, CONFIG_PATH)}: ${error.message}` };
  }
}

/** Minimal .env loader (no dependency). Does not override real process.env. */
function loadDotEnv() {
  if (!existsSync(ENV_PATH)) return {};
  const values = {};
  for (const rawLine of readFileSync(ENV_PATH, "utf8").split("\n")) {
    const line = rawLine.trim();
    if (!line || line.startsWith("#")) continue;
    const eq = line.indexOf("=");
    if (eq === -1) continue;
    const key = line.slice(0, eq).trim();
    let value = line.slice(eq + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    if (key) values[key] = value;
  }
  return values;
}

function run(command, args, { cwd = REPO_ROOT, timeout } = {}) {
  const result = spawnSync(command, args, {
    cwd,
    timeout,
    encoding: "utf8",
    shell: false,
  });
  const stdout = result.stdout ?? "";
  const stderr = result.stderr ?? "";
  return {
    ok: result.status === 0,
    status: result.status,
    signal: result.signal,
    stdout,
    stderr,
    // Common shell "not found" signals.
    notFound:
      result.error?.code === "ENOENT" ||
      /command not found|not recognized/i.test(stderr),
    timedOut: result.signal === "SIGTERM" && result.error?.code === "ETIMEDOUT",
    errorMessage: result.error?.message ?? "",
  };
}

function firstLine(text, max = 240) {
  const line = (text || "").split("\n").map((l) => l.trim()).find(Boolean) || "";
  return line.length > max ? `${line.slice(0, max)}…` : line;
}

/** Pick the most meaningful error line (fatal/error/…), else the last line. */
function errorLine(text, max = 240) {
  const lines = (text || "").split("\n").map((l) => l.trim()).filter(Boolean);
  if (lines.length === 0) return "";
  const meaningful =
    lines.find((l) => /fatal|error|denied|not found|could not|cannot|refus/i.test(l)) ||
    lines[lines.length - 1];
  return meaningful.length > max ? `${meaningful.slice(0, max)}…` : meaningful;
}

function isNeoRepoPresent(neoPath) {
  return (
    existsSync(neoPath) &&
    (existsSync(path.join(neoPath, ".git")) || existsSync(path.join(neoPath, "package.json")))
  );
}

/** Resolve a usable `neo` executable, preferring the freshly built NEO repo. */
function resolveNeoBin(neoPath, cliBin) {
  const candidates = [];
  if (cliBin && cliBin !== "neo") {
    candidates.push(path.isAbsolute(cliBin) ? cliBin : path.join(neoPath, cliBin));
  }
  candidates.push(path.join(neoPath, "node_modules", ".bin", "neo"));
  candidates.push(path.join(neoPath, "bin", "neo"));
  for (const candidate of candidates) {
    if (existsSync(candidate)) return { bin: candidate, source: "neo-repo" };
  }
  // Fall back to a `neo` on PATH.
  const probe = run(process.platform === "win32" ? "where" : "command", ["-v", "neo"]);
  if (probe.ok && firstLine(probe.stdout)) {
    return { bin: "neo", source: "PATH" };
  }
  return { bin: null, source: null };
}

function main() {
  const options = parseArgs(process.argv.slice(2));
  if (options.help) {
    printHelp();
    return 0;
  }

  const report = {
    generatedAt: new Date().toISOString(),
    repoRoot: REPO_ROOT,
    config: { loaded: false, path: path.relative(REPO_ROOT, CONFIG_PATH) },
    neo: {
      repoUrl: "",
      localPath: "",
      repoState: "missing",
      cloneStatus: "not attempted",
      installStatus: "not attempted",
      buildStatus: "not attempted",
      cliStatus: "unavailable",
      cliSource: null,
    },
    manifest: { platform: "", org: "", validate: "unknown", plan: "unknown", installDryRun: "unknown" },
    credentials: { required: [], present: [], missing: [] },
    installBlocked: true,
    blockedReasons: [],
    nextCommand: "",
    notes: [],
  };

  // Step 1: config
  const { config, error: configError } = loadConfig();
  if (configError) {
    report.config.error = configError;
    report.blockedReasons.push(configError);
    report.nextCommand = "Create .northbridge/neo.config.json, then re-run: npm run neo:bootstrap";
    finish(report, options);
    return 1;
  }
  report.config.loaded = true;

  const neoCfg = config.neo ?? {};
  const manifestCfg = config.manifest ?? {};
  const platform = manifestCfg.platform || "platform-northbridge-digital";
  const org = manifestCfg.org || "org-northbridge-digital";
  report.manifest.platform = platform;
  report.manifest.org = org;

  const repoUrl = neoCfg.repoUrl || "";
  const localPath = neoCfg.localPath || ".neo/neo";
  const neoPath = path.resolve(REPO_ROOT, localPath);
  const cliCfg = neoCfg.cli ?? {};
  report.neo.repoUrl = repoUrl;
  report.neo.localPath = localPath;

  // Step 2/3: resolve NEO path, clone if missing
  if (isNeoRepoPresent(neoPath)) {
    report.neo.repoState = "found";
    report.neo.cloneStatus = "not needed (already present)";
  } else if (options.skipClone) {
    report.neo.cloneStatus = "skipped (--skip-clone)";
  } else if (!repoUrl) {
    report.neo.cloneStatus = "cannot clone (neo.repoUrl not set in config)";
    report.notes.push("Set neo.repoUrl in .northbridge/neo.config.json to enable cloning.");
  } else {
    const branch = neoCfg.defaultBranch || "main";
    const clone = run(
      "git",
      ["clone", "--depth", "1", "--branch", branch, repoUrl, neoPath],
      { timeout: TIMEOUTS.clone },
    );
    if (clone.ok && isNeoRepoPresent(neoPath)) {
      report.neo.repoState = "found";
      report.neo.cloneStatus = "cloned";
    } else {
      report.neo.repoState = "missing";
      report.neo.cloneStatus = `failed: ${errorLine(clone.stderr) || clone.errorMessage || "unknown error"}`;
    }
  }

  // Step 4: install + build + verify CLI (only if repo present)
  if (report.neo.repoState === "found" && !options.skipBuild) {
    const installCmd = cliCfg.installCommand || "npm install";
    const buildCmd = cliCfg.buildCommand || "npm run build";
    const install = run("sh", ["-c", installCmd], { cwd: neoPath, timeout: TIMEOUTS.build });
    report.neo.installStatus = install.ok
      ? "installed"
      : `failed: ${errorLine(install.stderr) || "see NEO output"}`;
    if (install.ok) {
      const build = run("sh", ["-c", buildCmd], { cwd: neoPath, timeout: TIMEOUTS.build });
      report.neo.buildStatus = build.ok
        ? "built"
        : `failed: ${errorLine(build.stderr) || "see NEO output"}`;
    } else {
      report.neo.buildStatus = "skipped (install failed)";
    }
  } else if (report.neo.repoState === "found" && options.skipBuild) {
    report.neo.installStatus = "skipped (--skip-build)";
    report.neo.buildStatus = "skipped (--skip-build)";
  } else {
    report.neo.installStatus = "skipped (NEO repo missing)";
    report.neo.buildStatus = "skipped (NEO repo missing)";
  }

  // Verify the CLI works.
  const resolved = resolveNeoBin(neoPath, cliCfg.bin || "neo");
  if (resolved.bin) {
    const verify = run(resolved.bin, ["--version"], { timeout: TIMEOUTS.verify });
    if (verify.ok || firstLine(verify.stdout)) {
      report.neo.cliStatus = `available (${firstLine(verify.stdout) || "version unknown"})`;
      report.neo.cliSource = resolved.source;
      report.neo.cliBin = resolved.bin;
    } else {
      report.neo.cliStatus = "unavailable (binary found but not runnable)";
    }
  } else {
    report.neo.cliStatus = "unavailable (no `neo` binary found)";
  }
  const cliAvailable = report.neo.cliStatus.startsWith("available");

  // Step 5: dry-run validation from THIS product repo (only if CLI available)
  if (cliAvailable) {
    const bin = report.neo.cliBin;
    const validate = run(bin, ["manifest", "validate", platform], { timeout: TIMEOUTS.dryRun });
    report.manifest.validate = validate.ok ? "valid" : "invalid";
    if (!validate.ok) report.notes.push(`manifest validate: ${firstLine(validate.stderr || validate.stdout)}`);

    const plan = run(bin, ["manifest", "plan", platform, "--org", org, "--dry-run"], { timeout: TIMEOUTS.dryRun });
    report.manifest.plan = plan.ok ? "generated" : "not generated";
    if (!plan.ok) report.notes.push(`manifest plan: ${firstLine(plan.stderr || plan.stdout)}`);

    const installDry = run(bin, ["install", "manifest", platform, "--org", org, "--dry-run"], { timeout: TIMEOUTS.dryRun });
    report.manifest.installDryRun = installDry.ok ? "ok (dry-run)" : "blocked";
    if (!installDry.ok) report.notes.push(`install dry-run: ${firstLine(installDry.stderr || installDry.stdout)}`);
  } else {
    report.manifest.validate = "unknown (CLI unavailable)";
    report.manifest.plan = "unknown (CLI unavailable)";
    report.manifest.installDryRun = "unknown (CLI unavailable)";
  }

  // Credentials (names come from config; values never printed)
  const dotEnv = loadDotEnv();
  const required = (config.connectors?.requiredCredentials ?? []).map((c) =>
    typeof c === "string" ? { name: c, env: c } : c,
  );
  report.credentials.required = required.map((c) => c.env);
  for (const cred of required) {
    const present = Boolean(process.env[cred.env] || dotEnv[cred.env]);
    (present ? report.credentials.present : report.credentials.missing).push(cred.env);
  }

  // Derive blocked status + next command
  const reasons = [];
  if (!cliAvailable) reasons.push("NEO CLI is unavailable");
  if (report.manifest.validate === "invalid") reasons.push("manifest failed validation");
  if (report.credentials.missing.length > 0)
    reasons.push(`${report.credentials.missing.length} connector credential(s) missing`);
  if (report.manifest.installDryRun === "blocked") reasons.push("install dry-run reported blockers");
  report.blockedReasons = reasons;
  report.installBlocked = reasons.length > 0;

  report.nextCommand = computeNextCommand(report, cliAvailable);

  finish(report, options);
  return 0;
}

function computeNextCommand(report, cliAvailable) {
  if (cliAvailable && !report.installBlocked) {
    return "All dry-run checks passed. A NEO maintainer can perform the real install (omit --dry-run) once credentials are approved.";
  }
  if (report.neo.repoState !== "found") {
    if (report.neo.cloneStatus.startsWith("failed")) {
      return `Confirm you have access to ${report.neo.repoUrl || "the NEO repo"} (git credentials / repo visibility), then re-run: npm run neo:bootstrap`;
    }
    if (report.neo.cloneStatus.startsWith("skipped")) {
      return "Re-run without --skip-clone to fetch NEO: npm run neo:bootstrap";
    }
    return "Set neo.repoUrl in .northbridge/neo.config.json, then re-run: npm run neo:bootstrap";
  }
  if (!cliAvailable) {
    return "Review the NEO install/build output above (or run inside the NEO repo), then re-run: npm run neo:bootstrap";
  }
  if (report.credentials.missing.length > 0) {
    return "Copy .env.example to .env, fill in the missing connector credentials, then re-run: npm run neo:bootstrap";
  }
  if (report.installBlocked) {
    return "Resolve the blockers listed above, then re-run: npm run neo:bootstrap";
  }
  return "All dry-run checks passed. A NEO maintainer can perform the real install (omit --dry-run) once credentials are approved.";
}

function line(symbol, label, value) {
  return `  ${symbol} ${label.padEnd(28)} ${value}`;
}

function finish(report, options) {
  const n = report.neo;
  const m = report.manifest;
  const cliAvailable = n.cliStatus.startsWith("available");

  const out = [];
  out.push("");
  out.push("═══════════════════════════════════════════════════════════════");
  out.push("  NEO Consumer Bootstrap — status report (dry-run only)");
  out.push("═══════════════════════════════════════════════════════════════");

  if (!report.config.loaded) {
    out.push(line(SYMBOLS.fail, "Config", report.config.error || "not loaded"));
    out.push("");
    out.push(`  Next: ${report.nextCommand}`);
    out.push("═══════════════════════════════════════════════════════════════");
    console.log(out.join("\n"));
    if (options.json) console.log(`\n${JSON.stringify(report, null, 2)}`);
    return;
  }

  out.push(line(SYMBOLS.info, "Product repo", report.repoRoot));
  out.push(line(SYMBOLS.info, "NEO repo URL", n.repoUrl || "(not set)"));
  out.push(line(SYMBOLS.info, "NEO local path", n.localPath));
  out.push("");
  out.push("  NEO availability");
  out.push(line(n.repoState === "found" ? SYMBOLS.ok : SYMBOLS.fail, "NEO repo", n.repoState));
  out.push(line(n.cloneStatus.startsWith("failed") ? SYMBOLS.fail : SYMBOLS.info, "Clone status", n.cloneStatus));
  out.push(line(n.installStatus.startsWith("failed") ? SYMBOLS.fail : SYMBOLS.info, "Install status", n.installStatus));
  out.push(line(n.buildStatus.startsWith("failed") ? SYMBOLS.fail : SYMBOLS.info, "Build status", n.buildStatus));
  out.push(line(cliAvailable ? SYMBOLS.ok : SYMBOLS.fail, "CLI status", n.cliStatus));
  out.push("");
  out.push(`  Dry-run validation (${m.platform}, org ${m.org})`);
  out.push(line(m.validate === "valid" ? SYMBOLS.ok : (cliAvailable ? SYMBOLS.fail : SYMBOLS.warn), "manifest validate", m.validate));
  out.push(line(m.plan === "generated" ? SYMBOLS.ok : (cliAvailable ? SYMBOLS.fail : SYMBOLS.warn), "manifest plan --dry-run", m.plan));
  out.push(line(m.installDryRun.startsWith("ok") ? SYMBOLS.ok : (cliAvailable ? SYMBOLS.fail : SYMBOLS.warn), "install --dry-run", m.installDryRun));
  out.push("");
  out.push("  Connector credentials");
  if (report.credentials.required.length === 0) {
    out.push(line(SYMBOLS.info, "required", "(none declared in config)"));
  } else {
    for (const env of report.credentials.required) {
      const present = report.credentials.present.includes(env);
      out.push(line(present ? SYMBOLS.ok : SYMBOLS.fail, present ? "present" : "MISSING", env));
    }
  }
  out.push("");
  out.push(line(report.installBlocked ? SYMBOLS.fail : SYMBOLS.ok, "Install blocked", report.installBlocked ? "yes" : "no"));
  if (report.blockedReasons.length > 0) {
    for (const reason of report.blockedReasons) out.push(`      - ${reason}`);
  }
  if (report.notes.length > 0) {
    out.push("");
    out.push("  Notes");
    for (const note of report.notes) out.push(`      - ${note}`);
  }
  out.push("");
  out.push("  Next command");
  out.push(`      ${report.nextCommand}`);
  out.push("═══════════════════════════════════════════════════════════════");
  out.push("  Reminder: this bootstrap is dry-run only; no real install is performed.");
  out.push("");

  console.log(out.join("\n"));
  if (options.json) console.log(`${JSON.stringify(report, null, 2)}`);
}

try {
  process.exit(main());
} catch (error) {
  console.error(`bootstrap-neo: ${error instanceof Error ? error.message : String(error)}`);
  process.exit(1);
}
