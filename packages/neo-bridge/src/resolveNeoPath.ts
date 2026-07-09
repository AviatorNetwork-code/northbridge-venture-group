import fs from "node:fs";
import path from "node:path";

export interface NeoPathResolution {
  ok: true;
  neoRoot: string;
}

export interface NeoPathFailure {
  ok: false;
  error: string;
}

export type ResolveNeoPathOutcome = NeoPathResolution | NeoPathFailure;

export function resolveNeoPath(productRoot: string, neoPath: string): ResolveNeoPathOutcome {
  const candidate = path.isAbsolute(neoPath)
    ? neoPath
    : path.resolve(productRoot, neoPath);

  if (!fs.existsSync(candidate)) {
    return {
      ok: false,
      error: `NEO repository not found at ${candidate}`,
    };
  }

  const packageJson = path.join(candidate, "package.json");
  if (!fs.existsSync(packageJson)) {
    return {
      ok: false,
      error: `Path exists but does not look like NEOS (missing package.json): ${candidate}`,
    };
  }

  return { ok: true, neoRoot: candidate };
}
