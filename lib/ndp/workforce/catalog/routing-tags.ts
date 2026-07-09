/**
 * Routing tags consumed by NDP Communication Router and Workforce Router.
 * Metadata only — no routing behavior in this module.
 */
export interface RoutingTagDefinition {
  tag: string;
  kind: "intent" | "capability";
  description: string;
}

export const NDP_ROUTING_TAG_DEFINITIONS: RoutingTagDefinition[] = [
  {
    tag: "intent:operational",
    kind: "intent",
    description: "Operational work routed to a hired team",
  },
  {
    tag: "intent:platform",
    kind: "intent",
    description: "Platform questions — Nordi path (not team catalog)",
  },
  {
    tag: "intent:billing",
    kind: "intent",
    description: "Billing questions — Nordi path (not team catalog)",
  },
  {
    tag: "capability:customer_acquisition",
    kind: "capability",
    description: "Route to marketing-capable teams",
  },
  {
    tag: "capability:content_marketing",
    kind: "capability",
    description: "Route to content and brand teams",
  },
  {
    tag: "capability:sales_pipeline",
    kind: "capability",
    description: "Route to sales-capable teams",
  },
  {
    tag: "capability:customer_service",
    kind: "capability",
    description: "Route to customer service teams",
  },
  {
    tag: "capability:scheduling",
    kind: "capability",
    description: "Route to scheduling-capable teams",
  },
  {
    tag: "capability:finance",
    kind: "capability",
    description: "Route to financial teams",
  },
  {
    tag: "capability:aviation_operations",
    kind: "capability",
    description: "Route to flight school teams",
  },
  {
    tag: "capability:dental_operations",
    kind: "capability",
    description: "Route to dental office teams",
  },
  {
    tag: "capability:legal_operations",
    kind: "capability",
    description: "Route to law firm teams",
  },
  {
    tag: "capability:hvac_operations",
    kind: "capability",
    description: "Route to HVAC teams",
  },
  {
    tag: "capability:general_operations",
    kind: "capability",
    description: "Route to general service business teams",
  },
];

export const NDP_ROUTING_TAG_SET = new Set(
  NDP_ROUTING_TAG_DEFINITIONS.map((entry) => entry.tag),
);

export function isKnownRoutingTag(tag: string): boolean {
  return NDP_ROUTING_TAG_SET.has(tag);
}
