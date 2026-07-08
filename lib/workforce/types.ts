export type WorkforceTier = "essential" | "pro" | "elite";

export type SpecialistCatalogItem = {
  id: string;
  name: string;
  responsibilities: string[];
  canDo: string[];
  cannotDo: string[];
  essentialPrice: number;
  proPrice: number;
  elitePrice: number;
  essentialTasks: number;
  proTasks: number;
  eliteTasks: number;
  industries: string[];
  catIds: string[];
};

export type TeamCatalogItem = {
  id: string;
  name: string;
  includedSpecialists: string[];
  teamLeader: string;
  responsibilities: string[];
  industries: string[];
  estimatedRoi: string;
  monthlyPrice: number;
  teamTasks: number;
};

export type ManagerCatalogItem = {
  id: string;
  name: string;
  responsibilities: string[];
  supervises: string;
  reportsGenerated: string[];
  dailyBriefings: string;
  escalationAuthority: string;
  monthlyPrice: number;
  teamTasks: number;
  minSpecialists: number;
};

export type SelectedSpecialist = {
  catalogId: string;
  tier: WorkforceTier;
};

export type HireSelection = {
  specialists: SelectedSpecialist[];
  teams: string[];
  managers: string[];
  connectors: string[];
  businessProfile: Record<string, unknown>;
  estimatedMonthly: number;
  totalTeamTasks: number;
  createdAt: string;
};

export type HirePricingSummary = {
  monthlySubscription: number;
  includedTeamTasks: number;
  additionalTaskPrice: number;
  estimatedHoursSaved: number;
  estimatedRoi: string;
  recommendedNextHire: string;
};

export type GrowthStage =
  | "start"
  | "specialists"
  | "team"
  | "manager"
  | "regional-manager"
  | "executive";

export const HIRE_STORAGE_KEY = "northbridge-hire-selection";

export const TIER_LABELS: Record<WorkforceTier, string> = {
  essential: "Essential",
  pro: "Pro",
  elite: "Elite",
};

export const TIER_ORDER: WorkforceTier[] = ["essential", "pro", "elite"];
