import type { LaunchState } from "@/lib/launch/launch-types";
import { LAUNCH_STORAGE_KEY } from "@/lib/launch/launch-types";

const defaultState: LaunchState = {
  launched: false,
  launchedAt: null,
  savedAt: null,
};

export function loadLaunchState(): LaunchState {
  if (typeof window === "undefined") return defaultState;

  try {
    const raw = window.localStorage.getItem(LAUNCH_STORAGE_KEY);
    if (!raw) return defaultState;
    return { ...defaultState, ...JSON.parse(raw) };
  } catch {
    return defaultState;
  }
}

export function saveLaunchState(updates: Partial<LaunchState>): LaunchState {
  const current = loadLaunchState();
  const next: LaunchState = {
    ...current,
    ...updates,
    savedAt: new Date().toISOString(),
  };

  if (typeof window !== "undefined") {
    window.localStorage.setItem(LAUNCH_STORAGE_KEY, JSON.stringify(next));
  }

  return next;
}

export function markWorkforceLaunched(): LaunchState {
  return saveLaunchState({
    launched: true,
    launchedAt: new Date().toISOString(),
  });
}

export function saveLaunchProgress(): LaunchState {
  return saveLaunchState({});
}

export function clearLaunchState() {
  if (typeof window !== "undefined") {
    window.localStorage.removeItem(LAUNCH_STORAGE_KEY);
  }
}
