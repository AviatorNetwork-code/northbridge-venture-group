import { describe, expect, it } from "vitest";
import {
  linkResearchToAdr,
  parseResearchDocument,
  parseResearchMetadata,
  researchCategorySchema,
  researchTrustLevelSchema,
} from "../src/index.js";

const NOW = "2026-07-09T20:00:00.000Z";

describe("@northbridge/research-governance", () => {
  it("defines trust levels and research categories", () => {
    expect(researchTrustLevelSchema.options).toContain("reference_only");
    expect(researchTrustLevelSchema.options).toContain("avoid");
    expect(researchCategorySchema.options).toContain("external_patterns");
  });

  it("validates research metadata", () => {
    const metadata = parseResearchMetadata({
      id: "research-external-patterns-v1",
      title: "External Patterns Research",
      version: "1.0",
      summary: "Knowledge extraction from public MCP and orchestration references.",
      trustLevel: "reference_only",
      category: "external_patterns",
      sources: [
        {
          label: "modelcontextprotocol/servers",
          url: "https://github.com/modelcontextprotocol/servers",
        },
      ],
      relatedAdrs: [],
      createdAt: NOW,
      updatedAt: NOW,
      tags: ["mcp", "orchestration"],
    });

    expect(metadata.id).toBe("research-external-patterns-v1");
  });

  it("links research metadata to ADRs", () => {
    const metadata = parseResearchMetadata({
      id: "research-external-patterns-v1",
      title: "External Patterns Research",
      version: "1.0",
      summary: "Knowledge extraction.",
      trustLevel: "adopt_concepts",
      category: "connectors",
      sources: [{ label: "MCP spec" }],
      relatedAdrs: [],
      createdAt: NOW,
      updatedAt: NOW,
    });

    const linked = linkResearchToAdr(metadata, {
      adrId: "W12",
      title: "Workforce Connectors Boundaries",
      packageScope: "@northbridge/workforce-connectors",
      status: "accepted",
    });

    expect(linked.relatedAdrs).toHaveLength(1);
    expect(linked.relatedAdrs[0]?.adrId).toBe("W12");
  });

  it("validates research document schema", () => {
    const document = parseResearchDocument({
      metadata: {
        id: "research-external-patterns-v1",
        title: "External Patterns Research",
        version: "1.0",
        summary: "Knowledge extraction.",
        trustLevel: "reference_only",
        category: "external_patterns",
        sources: [{ label: "MCP spec" }],
        relatedAdrs: [],
        createdAt: NOW,
        updatedAt: NOW,
      },
      sections: [
        { heading: "Findings", body: "Supervisor pattern aligns with team-orchestrator." },
      ],
    });

    expect(document.sections).toHaveLength(1);
  });
});
