import { describe, expect, it } from "vitest";
import {
  detectLanguageFromText,
  extractBusinessSignals,
  resolvePersistedLanguage,
} from "../src/multilingual/index.js";

describe("multilingual understanding", () => {
  it("detects mixed Spanish-English scheduling messages as Spanish", () => {
    const result = detectLanguageFromText("Necesito help with scheduling.");
    expect(result.language).toBe("es");
    expect(result.mixedLanguage).toBe(true);
  });

  it("detects mixed English-Spanish customer messages as Spanish", () => {
    const result = detectLanguageFromText("My clientes always call me.");
    expect(result.language).toBe("es");
    expect(result.mixedLanguage).toBe(true);
  });

  it("extracts Spanish professional and operational phrases", () => {
    expect(extractBusinessSignals("Soy contador.").industry).toBe("professional-services");
    expect(extractBusinessSignals("Soy abogado.").industry).toBe("professional-services");
    expect(extractBusinessSignals("Soy contratista.").industry).toBe("general");
    expect(extractBusinessSignals("Trabajo solo.").employeeCount).toBe(1);
    expect(extractBusinessSignals("Atiendo por WhatsApp.").communicationChannels).toContain("WhatsApp");
    expect(extractBusinessSignals("Tengo dos oficinas.").locationCount).toBe(2);
    expect(extractBusinessSignals("Escuela de vuelo").industry).toBe("aviation");
    expect(extractBusinessSignals("Mis clientes llegan por recomendaciones.").referralMentioned).toBe(true);
    expect(extractBusinessSignals("Me cancelan las citas.").schedulingFrictionMentioned).toBe(true);
  });

  it("persists Spanish when opener confidence is sufficient", () => {
    expect(resolvePersistedLanguage(undefined, "Tengo un restaurante pequeño")).toBe("es");
    expect(resolvePersistedLanguage(undefined, "Tax business")).toBe("en");
  });
});
