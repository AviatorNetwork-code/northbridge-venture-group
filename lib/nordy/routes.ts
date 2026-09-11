import type { NordyEntryPath } from "@/lib/nordy/types";

const ENTRY_PATHS: readonly NordyEntryPath[] = [
  "HOME",
  "EXPLORE",
  "ENGINEERING_AI",
  "DIGITAL",
  "MOBILE_APPS",
  "CAPABILITIES",
  "VENTURES",
  "GENERAL",
] as const;

export function parseNordyEntryPath(value: string | null | undefined): NordyEntryPath {
  if (!value) return "GENERAL";
  const normalized = value.trim().toUpperCase();
  return (ENTRY_PATHS.find((path) => path === normalized) ?? "GENERAL") as NordyEntryPath;
}

/** Deep-link that opens Nordy on the homepage host with the given entry path. */
export function openNordyHref(entryPath: NordyEntryPath = "GENERAL"): string {
  return `/?nordy=open&entry=${entryPath}`;
}
