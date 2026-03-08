import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        black: "#000000",
        white: "#ffffff",
        red: "#B11226",
        "red-hover": "#8B0E1D",
        charcoal: "#0a0a0a",
        slate: "#141414",
        stone: "#525252",
        silver: "#a3a3a3",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
      },
      backgroundImage: {
        "grid-pattern":
          "linear-gradient(rgb(255 255 255 / 0.02) 1px, transparent 1px), linear-gradient(90deg, rgb(255 255 255 / 0.02) 1px, transparent 1px)",
      },
      backgroundSize: {
        grid: "64px 64px",
      },
    },
  },
  plugins: [],
};
export default config;
