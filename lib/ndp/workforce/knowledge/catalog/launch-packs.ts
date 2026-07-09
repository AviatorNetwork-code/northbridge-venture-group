import type { KnowledgePack } from "../types/pack.js";
import {
  defaultLayerForCategory,
  KNOWLEDGE_LAYER_ORDER,
} from "../types/category.js";

function pack(input: {
  knowledgePackId: string;
  displayName: string;
  category: KnowledgePack["category"];
  description: string;
  tags: string[];
  dependencies?: string[];
  trustLevel?: KnowledgePack["trustLevel"];
  owner?: string;
  applicableTeams?: string[];
  applicableEmployees?: string[];
  layer?: KnowledgePack["layer"];
  metadata?: Record<string, unknown>;
}): KnowledgePack {
  const layer = input.layer ?? defaultLayerForCategory(input.category);

  return {
    knowledgePackId: input.knowledgePackId,
    displayName: input.displayName,
    category: input.category,
    version: "1.0.0",
    description: input.description,
    tags: input.tags,
    dependencies: input.dependencies ?? [],
    trustLevel: input.trustLevel ?? "canonical",
    owner: input.owner ?? "northbridge-digital",
    layer,
    layerOrder: KNOWLEDGE_LAYER_ORDER[layer],
    applicableTeams: input.applicableTeams ?? [],
    applicableEmployees: input.applicableEmployees ?? [],
    lifecycleStatus: "active",
    launchVisible: true,
    metadata: input.metadata,
  };
}

/**
 * Launch knowledge pack metadata catalog.
 * No knowledge content, prompts, or embeddings.
 */
export const NDP_LAUNCH_KNOWLEDGE_PACKS: KnowledgePack[] = [
  // Universal
  pack({
    knowledgePackId: "knowledge-pack-professional-communication",
    displayName: "Professional Communication",
    category: "universal",
    description: "Foundational professional communication standards for Digital Employees",
    tags: ["communication", "universal"],
  }),
  pack({
    knowledgePackId: "knowledge-pack-customer-service-fundamentals",
    displayName: "Customer Service Fundamentals",
    category: "universal",
    description: "Core customer service principles and response patterns",
    tags: ["customer-service", "universal"],
    dependencies: ["knowledge-pack-professional-communication"],
    applicableTeams: ["team-customer-service", "team-general-service"],
  }),
  pack({
    knowledgePackId: "knowledge-pack-business-writing",
    displayName: "Business Writing",
    category: "universal",
    description: "Business writing conventions for customer-facing outputs",
    tags: ["writing", "universal"],
    dependencies: ["knowledge-pack-professional-communication"],
  }),

  // Business
  pack({
    knowledgePackId: "knowledge-pack-business-operations-fundamentals",
    displayName: "Business Operations Fundamentals",
    category: "business",
    description: "Cross-functional business operations context",
    tags: ["operations", "business"],
    dependencies: ["knowledge-pack-business-writing"],
  }),
  pack({
    knowledgePackId: "knowledge-pack-scheduling-fundamentals",
    displayName: "Scheduling Fundamentals",
    category: "scheduling",
    description: "Appointment and calendar coordination fundamentals",
    tags: ["scheduling", "operations"],
    dependencies: ["knowledge-pack-business-operations-fundamentals"],
    applicableEmployees: [
      "employee-appointment",
      "employee-reminder",
    ],
  }),
  pack({
    knowledgePackId: "knowledge-pack-sales-fundamentals",
    displayName: "Sales Fundamentals",
    category: "sales",
    description: "Sales pipeline and opportunity management fundamentals",
    tags: ["sales", "pipeline"],
    dependencies: ["knowledge-pack-business-operations-fundamentals"],
    applicableTeams: ["team-sales"],
  }),
  pack({
    knowledgePackId: "knowledge-pack-marketing-fundamentals",
    displayName: "Marketing Fundamentals",
    category: "marketing",
    description: "Campaign planning and marketing operations fundamentals",
    tags: ["marketing", "campaigns"],
    dependencies: [
      "knowledge-pack-business-operations-fundamentals",
      "knowledge-pack-business-writing",
    ],
    applicableTeams: ["team-marketing"],
  }),
  pack({
    knowledgePackId: "knowledge-pack-financial-fundamentals",
    displayName: "Financial Fundamentals",
    category: "finance",
    description: "Billing, receivables, and financial reporting fundamentals",
    tags: ["finance", "billing"],
    dependencies: ["knowledge-pack-business-operations-fundamentals"],
    applicableTeams: ["team-financial"],
  }),

  // Industry
  pack({
    knowledgePackId: "knowledge-pack-aviation-fundamentals",
    displayName: "Aviation Fundamentals",
    category: "aviation",
    description: "Flight training and aviation operations context",
    tags: ["aviation", "industry"],
    dependencies: [
      "knowledge-pack-scheduling-fundamentals",
      "knowledge-pack-business-operations-fundamentals",
    ],
    applicableTeams: ["team-flight-school"],
  }),
  pack({
    knowledgePackId: "knowledge-pack-dental-fundamentals",
    displayName: "Dental Fundamentals",
    category: "dental",
    description: "Dental practice operations and patient coordination context",
    tags: ["dental", "industry"],
    dependencies: [
      "knowledge-pack-scheduling-fundamentals",
      "knowledge-pack-customer-service-fundamentals",
    ],
    applicableTeams: ["team-dental-office"],
  }),
  pack({
    knowledgePackId: "knowledge-pack-legal-fundamentals",
    displayName: "Legal Fundamentals",
    category: "legal",
    description: "Law firm operations and client coordination context",
    tags: ["legal", "industry"],
    dependencies: [
      "knowledge-pack-business-operations-fundamentals",
      "knowledge-pack-business-writing",
    ],
    applicableTeams: ["team-law-firm"],
  }),
  pack({
    knowledgePackId: "knowledge-pack-hvac-fundamentals",
    displayName: "HVAC Fundamentals",
    category: "hvac",
    description: "HVAC service business dispatch and maintenance context",
    tags: ["hvac", "industry"],
    dependencies: [
      "knowledge-pack-scheduling-fundamentals",
      "knowledge-pack-sales-fundamentals",
    ],
    applicableTeams: ["team-hvac"],
  }),

  // Organization
  pack({
    knowledgePackId: "knowledge-pack-northbridge-customer-success-doctrine",
    displayName: "Northbridge Customer Success Doctrine",
    category: "organization",
    description: "Northbridge Digital customer success operating doctrine",
    tags: ["northbridge", "customer-success", "organization"],
    dependencies: ["knowledge-pack-customer-service-fundamentals"],
    applicableEmployees: [
      "employee-customer-service",
      "employee-customer-success",
      "employee-reception",
    ],
  }),
  pack({
    knowledgePackId: "knowledge-pack-northbridge-communication-standards",
    displayName: "Northbridge Communication Standards",
    category: "organization",
    description: "Northbridge Digital communication standards for customer-facing work",
    tags: ["northbridge", "communication", "organization"],
    dependencies: ["knowledge-pack-professional-communication"],
  }),
];

export const NDP_LAUNCH_KNOWLEDGE_PACK_ID_SET = new Set(
  NDP_LAUNCH_KNOWLEDGE_PACKS.map((entry) => entry.knowledgePackId),
);

export function getKnowledgePack(
  knowledgePackId: string,
): KnowledgePack | undefined {
  return NDP_LAUNCH_KNOWLEDGE_PACKS.find(
    (entry) => entry.knowledgePackId === knowledgePackId,
  );
}

export function listLaunchVisibleKnowledgePacks(): KnowledgePack[] {
  return NDP_LAUNCH_KNOWLEDGE_PACKS.filter((entry) => entry.launchVisible);
}
