import { describe, expect, it, beforeEach, afterEach } from "vitest";
import {
  clearLearningEvidenceForTests,
  createNordyEngineState,
  emitNordyLearningEvidence,
  getLearningEvidenceForTests,
  getNordyGreeting,
  inspectNeoConnection,
  openNordyHref,
  parseNordyEntryPath,
  processNordyTurn,
  retrieveFromNeo,
  TRAINING_AUTHORIZED,
} from "@/lib/nordy";

describe("Nordy completion — entry paths & routing", () => {
  it.each([
    ["HOME", /home page/i],
    ["ENGINEERING_AI", /Engineering & AI/i],
    ["DIGITAL", /Digital/i],
    ["MOBILE_APPS", /Mobile App Launch/i],
    ["CAPABILITIES", /Capabilities/i],
    ["VENTURES", /Ventures/i],
    ["EXPLORE", /explore Northbridge/i],
  ] as const)("greets %s with branch context", (path, pattern) => {
    expect(getNordyGreeting(path)).toMatch(pattern);
    expect(openNordyHref(path)).toBe(`/?nordy=open&entry=${path}`);
    expect(parseNordyEntryPath(path)).toBe(path);
  });

  it("falls back unknown entry strings to GENERAL", () => {
    expect(parseNordyEntryPath("GOVCON")).toBe("GENERAL");
    expect(parseNordyEntryPath(null)).toBe("GENERAL");
  });
});

describe("Nordy completion — capability registry hop", () => {
  beforeEach(() => clearLearningEvidenceForTests());

  it("answers capability inquiries from the registry", async () => {
    const { result } = await processNordyTurn(
      createNordyEngineState("CAPABILITIES"),
      "What services do you offer for client portal work?",
    );
    expect(result.source).toBe("capability_registry");
    expect(result.reply.toLowerCase()).toContain("portal");
    expect(result.usedAi).toBe(false);
    expect(
      getLearningEvidenceForTests().some((e) => e.retrievalPath === "capability_registry"),
    ).toBe(true);
  });
});

describe("Nordy completion — NEO fallback & connection inspect", () => {
  const originalProvider = process.env.NEXT_PUBLIC_NEO_PROVIDER;
  const originalBase = process.env.NEXT_PUBLIC_NEO_BASE_URL;

  afterEach(() => {
    if (originalProvider === undefined) delete process.env.NEXT_PUBLIC_NEO_PROVIDER;
    else process.env.NEXT_PUBLIC_NEO_PROVIDER = originalProvider;
    if (originalBase === undefined) delete process.env.NEXT_PUBLIC_NEO_BASE_URL;
    else process.env.NEXT_PUBLIC_NEO_BASE_URL = originalBase;
  });

  it("reports EXTERNAL_CONFIGURATION when App secrets exist without retrieve URL", () => {
    const status = inspectNeoConnection({
      NEXT_PUBLIC_NEO_PROVIDER: "mock",
      NEO_GITHUB_APP_ID: "1",
      NEO_GITHUB_APP_PRIVATE_KEY: "x",
      NEO_GITHUB_APP_INSTALLATION_ID: "2",
    });
    expect(status.repositoryIdentity).toBe("northbridge-venture-group");
    expect(status.liveRetrieveReady).toBe(false);
    expect(status.classification).toBe("EXTERNAL_CONFIGURATION");
  });

  it("returns unavailable when NEO retrieve is not configured", async () => {
    delete process.env.NEXT_PUBLIC_NEO_BASE_URL;
    process.env.NEXT_PUBLIC_NEO_PROVIDER = "mock";
    const retrieval = await retrieveFromNeo("systems audit");
    expect(retrieval.status).toBe("unavailable");
  });

  it("escalates to AI fallback safely when NEO is unavailable", async () => {
    clearLearningEvidenceForTests();
    delete process.env.NEXT_PUBLIC_NEO_BASE_URL;
    process.env.NEXT_PUBLIC_NEO_PROVIDER = "mock";
    const { result } = await processNordyTurn(
      createNordyEngineState("GENERAL"),
      "Can you teleport my warehouse into a quantum ERP while rewriting our board bylaws in Klingon?",
    );
    expect(result.usedAi).toBe(true);
    expect(result.source).toBe("neo_ai");
    expect(result.reply.toLowerCase()).not.toMatch(/\$\d/);
  });
});

describe("Nordy completion — CAP-LEARN gating", () => {
  const originalEmit = process.env.NORDY_PRODUCTION_LEARNING_EMIT;

  beforeEach(() => clearLearningEvidenceForTests());

  afterEach(() => {
    if (originalEmit === undefined) delete process.env.NORDY_PRODUCTION_LEARNING_EMIT;
    else process.env.NORDY_PRODUCTION_LEARNING_EMIT = originalEmit;
  });

  it("keeps training disabled", () => {
    expect(TRAINING_AUTHORIZED).toBe(false);
  });

  it("blocks production emit when gate is off", () => {
    delete process.env.NORDY_PRODUCTION_LEARNING_EMIT;
    const evidence = emitNordyLearningEvidence({
      entryPath: "HOME",
      aiEscalated: false,
      gapClass: "NONE",
      retrievalPath: "none",
      result: "answered",
      reusableGap: false,
      environment: "PRODUCTION",
    });
    expect(evidence).toBeNull();
    expect(getLearningEvidenceForTests()).toHaveLength(0);
  });

  it("allows non-production emit without enabling training", () => {
    const evidence = emitNordyLearningEvidence({
      entryPath: "HOME",
      aiEscalated: false,
      gapClass: "NONE",
      retrievalPath: "none",
      result: "answered",
      reusableGap: true,
      environment: "TEST",
    });
    expect(evidence?.schema).toBe("CAP-LEARN-001");
    expect(evidence?.trainingCandidateEligible).toBe(false);
    expect(TRAINING_AUTHORIZED).toBe(false);
  });
});

describe("Nordy completion — mobile apps intake continuity", () => {
  it("keeps MOBILE_APPS entry context through turns", async () => {
    let state = createNordyEngineState("MOBILE_APPS");
    expect(getNordyGreeting(state.entryPath)).toMatch(/Mobile App Launch/i);
    ({ state } = await processNordyTurn(state, "Field service technicians."));
    const next = await processNordyTurn(state, "They need booking and payments.");
    expect(next.state.entryPath).toBe("MOBILE_APPS");
    expect(next.state.facts.needsBooking).toBe(true);
    expect(next.result.reply.length).toBeGreaterThan(10);
  });
});
