import Constants from "expo-constants";

export interface AppEnvironment {
  apiBaseUrl: string;
  organizationId: string;
  dashboardVersion: string;
  appVersion: string;
}

function readEnv(key: string, fallback = ""): string {
  const fromProcess = process.env[key];
  if (typeof fromProcess === "string" && fromProcess.length > 0) {
    return fromProcess;
  }

  const extra = Constants.expoConfig?.extra as Record<string, string> | undefined;
  if (extra?.[key]) {
    return extra[key];
  }

  return fallback;
}

export function getAppEnvironment(): AppEnvironment {
  return {
    apiBaseUrl: readEnv("EXPO_PUBLIC_API_BASE_URL", "http://localhost:3000"),
    organizationId: readEnv("EXPO_PUBLIC_ORGANIZATION_ID", "org-acme"),
    dashboardVersion: readEnv("EXPO_PUBLIC_DASHBOARD_VERSION", "1.0.0"),
    appVersion: Constants.expoConfig?.version ?? "1.0.0",
  };
}
