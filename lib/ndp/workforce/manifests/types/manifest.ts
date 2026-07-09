import type { WorkforceFeatureFlags } from "@northbridge/workforce-contracts";
import type { SpecialistInventorySection } from "../catalog/specialists.js";
import type {
  ConfidencePolicy,
  EscalationPolicy,
  KpiDefinition,
  MemoryPolicy,
  PermissionPolicy,
  ToolCapabilityRequirement,
} from "./policies.js";

export type DigitalEmployeeRole = "specialist";

export type DigitalEmployeeLifecycleStatus =
  | "draft"
  | "active"
  | "deprecated"
  | "archived";

export interface DigitalEmployeeManifest {
  employeeId: string;
  displayName: string;
  role: DigitalEmployeeRole;
  category: SpecialistInventorySection;
  teamIds: string[];
  specialistId: string;
  capabilities: string[];
  connectorCapabilities: string[];
  permissions: PermissionPolicy;
  memoryPolicy: MemoryPolicy;
  kpis: KpiDefinition[];
  escalationPolicy: EscalationPolicy;
  confidencePolicy: ConfidencePolicy;
  toolRequirements: ToolCapabilityRequirement[];
  lifecycleStatus: DigitalEmployeeLifecycleStatus;
  launchVisible: boolean;
  featureFlags?: Partial<WorkforceFeatureFlags>;
  metadata?: Record<string, unknown>;
}

export interface ManifestValidationIssue {
  code: string;
  message: string;
  employeeId?: string;
  specialistId?: string;
  teamId?: string;
  capability?: string;
  connectorCapability?: string;
}

export interface SpecialistRuntimeConfigPreview {
  specialistDefinitionId: string;
  employeeId: string;
  displayName: string;
  teamIds: string[];
  routingCapabilities: string[];
  connectorCapabilityIds: string[];
  permissions: PermissionPolicy;
  memoryPolicy: MemoryPolicy;
  confidencePolicy: ConfidencePolicy;
  escalationPolicy: EscalationPolicy;
  requiredToolCapabilities: string[];
}
