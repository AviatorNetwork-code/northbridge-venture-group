import type { OperationsSnapshot } from "@/lib/cat/operations-context";

export function adaptOperationsSnapshot(payload: unknown): OperationsSnapshot | null {
  if (!payload || typeof payload !== "object") return null;

  const data = payload as Record<string, unknown>;

  if (typeof data.currentModule !== "string" || !data.onboarding || !data.workforce) {
    return null;
  }

  return data as unknown as OperationsSnapshot;
}
