import type { ConnectorRegistry } from "../types/registry.js";
import type {
  CapabilityResolutionRequest,
  CapabilityResolutionResult,
  OrganizationCapabilityAvailability,
  OrganizationCapabilityEntry,
} from "../types/resolution.js";
import type { WorkforceTelemetryEmitter } from "@northbridge/workforce-observability";
import {
  FallbackProviderResolver,
  PreferredProviderResolver,
} from "./provider-resolvers.js";
import { emitConnectorResolutionEvent } from "../observability/resolution-telemetry.js";
import { NDP_EXECUTION_CAPABILITIES } from "../catalog/capabilities.js";

export interface CapabilityResolverOptions {
  registry: ConnectorRegistry;
  telemetryEmitter?: WorkforceTelemetryEmitter;
  now?: () => string;
}

export class CapabilityResolver {
  private readonly registry: ConnectorRegistry;
  private readonly preferredResolver = new PreferredProviderResolver();
  private readonly fallbackResolver = new FallbackProviderResolver();
  private readonly telemetryEmitter?: WorkforceTelemetryEmitter;
  private readonly now: () => string;

  constructor(options: CapabilityResolverOptions) {
    this.registry = options.registry;
    this.telemetryEmitter = options.telemetryEmitter;
    this.now = options.now ?? (() => new Date().toISOString());
  }

  resolve(request: CapabilityResolutionRequest): CapabilityResolutionResult {
    const { orgId, capabilityId, region, correlationId } = request;
    const attemptedProviderIds: string[] = [];

    if (!this.registry.hasCapability(capabilityId)) {
      const result: CapabilityResolutionResult = {
        capabilityId,
        orgId,
        status: "not_found",
        selectionReason: "capability not registered",
        attemptedProviderIds,
        region,
      };
      this.emitResolutionTelemetry(result, correlationId);
      return result;
    }

    const policy = this.registry.getOrgPolicy(orgId, capabilityId);

    const preferred = this.preferredResolver.resolve({
      registry: this.registry,
      orgId,
      capabilityId,
      policy,
      region,
    });

    if (preferred) {
      attemptedProviderIds.push(preferred.providerId);
      if (!preferred.enabled) {
        const result: CapabilityResolutionResult = {
          capabilityId,
          orgId,
          status: "unavailable",
          providerId: preferred.providerId,
          connectorId: preferred.connectorId,
          selectionReason: "preferred provider connector disabled",
          attemptedProviderIds,
          region,
        };
        this.emitResolutionTelemetry(result, correlationId);
        return result;
      }
      if (!preferred.healthy) {
        const fallback = this.resolveFallback(
          orgId,
          capabilityId,
          policy,
          region,
          attemptedProviderIds,
          [preferred.providerId],
        );
        if (fallback) {
          this.emitResolutionTelemetry(fallback, correlationId);
          return fallback;
        }
      } else {
        const result: CapabilityResolutionResult = {
          capabilityId,
          orgId,
          status: "resolved",
          providerId: preferred.providerId,
          connectorId: preferred.connectorId,
          selectionReason: "preferred provider",
          attemptedProviderIds,
          region,
        };
        this.emitResolutionTelemetry(result, correlationId);
        return result;
      }
    }

    const fallback = this.resolveFallback(
      orgId,
      capabilityId,
      policy,
      region,
      attemptedProviderIds,
      attemptedProviderIds,
    );
    if (fallback) {
      this.emitResolutionTelemetry(fallback, correlationId);
      return fallback;
    }

    const result: CapabilityResolutionResult = {
      capabilityId,
      orgId,
      status: "unavailable",
      selectionReason: "no enabled connector available",
      attemptedProviderIds,
      region,
    };
    this.emitResolutionTelemetry(result, correlationId);
    return result;
  }

  resolveOrganizationAvailability(input: {
    orgId: string;
    region?: string;
    correlationId?: string;
    capabilityIds?: string[];
  }): OrganizationCapabilityAvailability {
    const capabilityIds =
      input.capabilityIds ??
      NDP_EXECUTION_CAPABILITIES.map((entry) => entry.id);

    const capabilities: OrganizationCapabilityEntry[] = capabilityIds.map(
      (capabilityId) => {
        const definition = this.registry.getCapability(capabilityId);
        const resolution = this.resolve({
          orgId: input.orgId,
          capabilityId,
          region: input.region,
          correlationId: input.correlationId,
        });

        return {
          capabilityId,
          label: definition?.label ?? capabilityId,
          category: definition?.category ?? "unknown",
          available:
            resolution.status === "resolved" || resolution.status === "fallback",
          status: resolution.status,
          providerId: resolution.providerId,
          connectorId: resolution.connectorId,
        };
      },
    );

    return {
      orgId: input.orgId,
      region: input.region,
      capabilities,
    };
  }

  private resolveFallback(
    orgId: string,
    capabilityId: string,
    policy: ReturnType<ConnectorRegistry["getOrgPolicy"]>,
    region: string | undefined,
    attemptedProviderIds: string[],
    excludeProviderIds: string[],
  ): CapabilityResolutionResult | undefined {
    const fallback = this.fallbackResolver.resolve({
      registry: this.registry,
      orgId,
      capabilityId,
      policy,
      region,
      excludeProviderIds,
    });

    if (!fallback) {
      return undefined;
    }

    attemptedProviderIds.push(fallback.providerId);

    if (!fallback.enabled) {
      return {
        capabilityId,
        orgId,
        status: "unavailable",
        providerId: fallback.providerId,
        connectorId: fallback.connectorId,
        selectionReason: "fallback provider connector disabled",
        attemptedProviderIds,
        region,
      };
    }

    const isFallback =
      policy?.fallbackProviderIds?.includes(fallback.providerId) ?? false;

    return {
      capabilityId,
      orgId,
      status: isFallback ? "fallback" : "resolved",
      providerId: fallback.providerId,
      connectorId: fallback.connectorId,
      selectionReason: isFallback ? "fallback provider" : "default provider",
      attemptedProviderIds,
      region,
    };
  }

  private emitResolutionTelemetry(
    result: CapabilityResolutionResult,
    correlationId?: string,
  ): void {
    if (!this.telemetryEmitter || !correlationId) {
      return;
    }

    void emitConnectorResolutionEvent({
      emitter: this.telemetryEmitter,
      correlationId,
      orgId: result.orgId,
      result,
      now: this.now,
    });
  }
}
