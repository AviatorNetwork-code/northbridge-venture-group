import { describe, expect, it } from "vitest";
import { northbridgeVentures } from "@/lib/nordi/ventures";

describe("northbridge ventures", () => {
  it("lists the core Northbridge ventures", () => {
    const names = northbridgeVentures.map((venture) => venture.name);
    expect(names).toContain("Northbridge Digital");
    expect(names).toContain("Aviator Network");
    expect(names).toContain("AirTax Financial");
  });

  it("marks future ventures as incubation", () => {
    const incubation = northbridgeVentures.filter((venture) => venture.status === "incubation");
    expect(incubation.length).toBeGreaterThan(0);
  });
});
