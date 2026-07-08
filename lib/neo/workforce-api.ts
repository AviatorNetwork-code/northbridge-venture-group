import type { HireSelection } from "@/lib/workforce/types";
import type { BusinessProfile } from "@/lib/cat/types";
import { getHireRecommendations } from "@/lib/workforce/recommendations";

export type WorkforceDeployRequest = {
  selection: HireSelection;
  businessProfile: BusinessProfile;
};

export type WorkforceDeployResponse = {
  deploymentId: string;
  status: "queued" | "ready";
  onboardingPath: string;
  estimatedReadiness: number;
};

export interface NeoWorkforceApi {
  getRecommendations(profile: BusinessProfile): Promise<ReturnType<typeof getHireRecommendations>>;
  deployWorkforce(request: WorkforceDeployRequest): Promise<WorkforceDeployResponse>;
}

export class MockNeoWorkforceApi implements NeoWorkforceApi {
  async getRecommendations(profile: BusinessProfile) {
    return getHireRecommendations(profile);
  }

  async deployWorkforce(request: WorkforceDeployRequest): Promise<WorkforceDeployResponse> {
    const specialistBonus = request.selection.specialists.length * 8;
    const connectorBonus = request.selection.connectors.length * 5;

    return {
      deploymentId: `deploy-${Date.now()}`,
      status: "queued",
      onboardingPath: "/operations/onboarding",
      estimatedReadiness: Math.min(95, 30 + specialistBonus + connectorBonus),
    };
  }
}

export const mockNeoWorkforceApi = new MockNeoWorkforceApi();
