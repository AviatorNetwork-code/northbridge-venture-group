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
        background: "var(--background)",
        foreground: "var(--foreground)",
        muted: "var(--muted)",
        northbridge: {
          black: "#000000",
          charcoal: "#141414",
          surface: "#1a1a1a",
          white: "#ffffff",
          red: "#B11226",
          "red-dark": "#8e0e1e",
          muted: "#a3a3a3",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
      },
      boxShadow: {
        card: "0 4px 24px rgba(0, 0, 0, 0.4)",
        "card-hover": "0 8px 32px rgba(177, 18, 38, 0.12)",
      },
    },
  },
  plugins: [],
};
export default config;
