import { describe, expect, it } from "vitest";
import {
  assertEmployeeReadiness,
  validateEmployeeReadiness,
} from "./employee-readiness.js";

describe("Digital Employee Development Kit — readiness validation", () => {
  it("validates Marketing Campaign Specialist as ready", () => {
    const report = validateEmployeeReadiness({
      employeeId: "employee-marketing-campaign",
    });

    expect(report.employeeId).toBe("employee-marketing-campaign");
    expect(report.specialistId).toBe("marketing-campaign-specialist");
    expect(report.ready).toBe(true);
    expect(report.checks.every((check) => check.passed)).toBe(true);
    expect(report.suggestedPromptTemplateId).toBe(
      "prompt-template-marketing-specialist",
    );
    expect(report.resolvedKnowledgePackCount).toBeGreaterThan(0);
    expect(report.connectorCapabilityCount).toBeGreaterThan(0);
  });

  it("resolves manifest by specialist id", () => {
    const report = validateEmployeeReadiness({
      specialistId: "marketing-campaign-specialist",
    });

    expect(report.ready).toBe(true);
    expect(report.displayName).toBe("Marketing Campaign Specialist");
  });

  it("assertEmployeeReadiness throws when checks fail", () => {
    expect(() =>
      assertEmployeeReadiness({
        manifest: {
          employeeId: "employee-invalid-draft",
          displayName: "Invalid Draft",
          role: "specialist",
          category: "marketing",
          teamIds: [],
          specialistId: "unknown-specialist",
          capabilities: [],
          connectorCapabilities: [],
          knowledgePackIds: [],
          permissions: { canDo: [], cannotDo: [] },
          memoryPolicy: {
            scope: "thread",
            retention: "standard",
            loadConversationContext: true,
            loadOrgContext: false,
            loadCustomerProfile: true,
          },
          kpis: [],
          escalationPolicy: {
            escalateOnConflict: true,
            escalateOnLowConfidence: true,
            escalateOnPermissionDenied: true,
            target: "team_lead",
            maxRetriesBeforeEscalation: 1,
          },
          confidencePolicy: {
            minimumConfidence: "medium",
            requireHighForCustomerFacing: false,
            allowPartialResults: true,
          },
          toolRequirements: [],
          lifecycleStatus: "draft",
          launchVisible: false,
        },
      }),
    ).toThrow(/readiness check failed/);
  });
});
