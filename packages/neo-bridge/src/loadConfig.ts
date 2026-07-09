import fs from "node:fs";
import path from "node:path";
import type { NeoBridgeConfig } from "./types.js";
import { CONFIG_RELATIVE_PATH } from "./errors.js";

export interface ConfigLoadResult {
  ok: true;
  config: NeoBridgeConfig;
  configPath: string;
}

export interface ConfigLoadFailure {
  ok: false;
  error: string;
}

export type LoadConfigOutcome = ConfigLoadResult | ConfigLoadFailure;

export function loadConfig(productRoot: string): LoadConfigOutcome {
  const configPath = path.join(productRoot, CONFIG_RELATIVE_PATH);

  if (!fs.existsSync(configPath)) {
    return {
      ok: false,
      error: `Missing bridge config at ${CONFIG_RELATIVE_PATH}`,
    };
  }

  let raw: unknown;
  try {
    raw = JSON.parse(fs.readFileSync(configPath, "utf8"));
  } catch {
    return {
      ok: false,
      error: `Bridge config is not valid JSON: ${CONFIG_RELATIVE_PATH}`,
    };
  }

  return {
    ok: true,
    config: raw as NeoBridgeConfig,
    configPath,
  };
}
