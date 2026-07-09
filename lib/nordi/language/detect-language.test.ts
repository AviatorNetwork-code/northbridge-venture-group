import { describe, expect, it } from "vitest";
import { detectLanguageFromText, detectAndPersistLanguage } from "@/lib/nordi/language/detect-language";

describe("language detection", () => {
  it("detects Spanish from a tax business opener", () => {
    const result = detectLanguageFromText("Tengo un negocio de impuestos");
    expect(result.language).toBe("es");
    expect(result.confidence).toBeGreaterThan(0.4);
  });

  it("detects English from a tax business opener", () => {
    const result = detectLanguageFromText("Tax business");
    expect(result.language).toBe("en");
  });

  it("detects mixed Spanish-English scheduling messages as Spanish", () => {
    expect(detectLanguageFromText("Necesito help with scheduling.").language).toBe("es");
  });

  it("detects mixed English-Spanish customer messages as Spanish", () => {
    expect(detectLanguageFromText("My clientes always call me.").language).toBe("es");
  });

  it("defaults to English when confidence is low", () => {
    expect(detectAndPersistLanguage({}, "ok")).toBe("en");
  });

  it("persists Spanish when confidence is sufficient", () => {
    expect(detectAndPersistLanguage({}, "Tengo un negocio de impuestos")).toBe("es");
  });
});
