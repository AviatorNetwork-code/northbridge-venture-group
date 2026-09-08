import type { DeploymentEnvironment } from "@/lib/nordy/types";

/**
 * Resolve deployment environment without relying on NODE_ENV alone.
 * Prefer explicit Vercel / Northbridge deployment metadata when present.
 */
export function resolveDeploymentEnvironment(
  env: NodeJS.ProcessEnv = process.env,
): DeploymentEnvironment {
  const explicit =
    env.NEXT_PUBLIC_NORTHBRIDGE_ENV ??
    env.NORTHBRIDGE_ENV ??
    env.NEXT_PUBLIC_DEPLOYMENT_ENV;

  if (explicit) {
    const normalized = explicit.trim().toUpperCase();
    if (
      normalized === "LOCAL" ||
      normalized === "TEST" ||
      normalized === "DEVELOPMENT" ||
      normalized === "PREVIEW" ||
      normalized === "STAGING" ||
      normalized === "PRODUCTION"
    ) {
      return normalized;
    }
  }

  if (env.VERCEL_ENV === "production") return "PRODUCTION";
  if (env.VERCEL_ENV === "preview") return "PREVIEW";
  if (env.VERCEL_ENV === "development") return "DEVELOPMENT";

  if (env.NODE_ENV === "test") return "TEST";
  if (env.NODE_ENV === "development") return "LOCAL";
  if (env.NODE_ENV === "production") return "PRODUCTION";

  return "UNKNOWN";
}

export function isProductionCustomerEvidenceEnv(
  environment: DeploymentEnvironment = resolveDeploymentEnvironment(),
): boolean {
  return environment === "PRODUCTION";
}

/**
 * Production CAP-LEARN emit is gated OFF by default.
 * Set NORDY_PRODUCTION_LEARNING_EMIT=true only after founder authorization.
 */
export function isProductionLearningEmitEnabled(
  env: NodeJS.ProcessEnv = process.env,
): boolean {
  return env.NORDY_PRODUCTION_LEARNING_EMIT === "true";
}
