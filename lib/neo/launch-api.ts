import type { LaunchAssessment } from "@/lib/launch/launch-types";
import type { LaunchState } from "@/lib/launch/launch-types";
import { buildLaunchAssessment, type LaunchEngineInput } from "@/lib/launch/launch-engine";
import { markWorkforceLaunched, saveLaunchProgress } from "@/lib/launch/launch-storage";

export type LaunchWorkforceRequest = LaunchEngineInput;

export type LaunchWorkforceResponse = {
  success: boolean;
  message: string;
  state: LaunchState;
  assessment: LaunchAssessment;
};

export interface NeoLaunchApi {
  assess(input: LaunchEngineInput): Promise<LaunchAssessment>;
  launchWorkforce(input: LaunchEngineInput): Promise<LaunchWorkforceResponse>;
  saveProgress(): Promise<LaunchState>;
}

export class MockNeoLaunchApi implements NeoLaunchApi {
  async assess(input: LaunchEngineInput): Promise<LaunchAssessment> {
    return buildLaunchAssessment(input);
  }

  async launchWorkforce(input: LaunchEngineInput): Promise<LaunchWorkforceResponse> {
    const assessment = buildLaunchAssessment(input);
    const state = markWorkforceLaunched();

    return {
      success: true,
      message: "Your AI Workforce is now active.",
      state,
      assessment,
    };
  }

  async saveProgress(): Promise<LaunchState> {
    return saveLaunchProgress();
  }
}

export const mockNeoLaunchApi = new MockNeoLaunchApi();
