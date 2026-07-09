import type { ConnectorCapabilityDefinition } from "./capability.js";
import type { ConnectorConfiguration } from "./configuration.js";
import type { ConnectorHealth } from "./health.js";
import type { ConnectorPermissionEnvelope, ConnectorPermissionResult } from "./permissions.js";
import type { CapabilityRequest, ConnectorExecutionResult } from "./request.js";
export type ConnectorRegistrationStatus = "registered" | "active" | "disabled";
/**
 * Connector metadata visible to registry consumers.
 * `connectorKind` is an internal implementation label — not a vendor SDK name exposed to specialists.
 */
export interface ConnectorDefinition {
    id: string;
    connectorKind: string;
    displayName: string;
    capabilityIds: string[];
    status: ConnectorRegistrationStatus;
    orgScope: "platform" | "organization";
}
export interface ConnectorDiscoveryQuery {
    orgId?: string;
    capabilityId?: string;
    status?: ConnectorRegistrationStatus;
}
/**
 * Executable connector — products implement; platform routes by capability only.
 */
export interface Connector {
    readonly definition: ConnectorDefinition;
    health(orgId: string): Promise<ConnectorHealth>;
    checkPermission(request: CapabilityRequest, envelope: ConnectorPermissionEnvelope): ConnectorPermissionResult;
    execute(request: CapabilityRequest, config?: ConnectorConfiguration): Promise<ConnectorExecutionResult>;
}
export interface ConnectorFactory {
    create(definition: ConnectorDefinition): Connector;
}
export type { ConnectorCapabilityDefinition };
