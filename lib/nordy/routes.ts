import type { NordyEntryPath } from "@/lib/nordy/types";

export function openNordyHref(entryPath: NordyEntryPath = "GENERAL"): string {
  return `/?nordy=open&entry=${entryPath}`;
}
