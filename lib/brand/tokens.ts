/**
 * Northbridge Venture Group — public brand tokens (CSS variable contract).
 * Premium technology aesthetic: controlled illumination, not neon.
 */

export const brandTokens = {
  colors: {
    black: "#000000",
    charcoal: "#07090d",
    slate: "#0e1218",
    panel: "#121820",
    white: "#ffffff",
    silver: "#a3a3a3",
    stone: "#525252",
    mist: "#c8d0db",
    red: "#B11226",
    redHover: "#8B0E1D",
    glow: "rgba(177, 18, 38, 0.35)",
    edge: "rgba(255, 255, 255, 0.12)",
    cyanEdge: "rgba(120, 170, 210, 0.18)",
  },
  illumination: {
    0: "none",
    1: "ambient",
    2: "interactive",
    3: "primary",
  },
  motion: {
    borderSweepMs: 2400,
    cardElevateMs: 220,
    sectionRevealMs: 500,
  },
} as const;

export type IlluminationLevel = 0 | 1 | 2 | 3;
