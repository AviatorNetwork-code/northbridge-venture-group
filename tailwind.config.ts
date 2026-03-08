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
        charcoal: "#1a1a1a",
        slate: "#2d2d2d",
        stone: "#404040",
        silver: "#8a8a8a",
        cream: "#f5f3ef",
      },
    },
  },
  plugins: [],
};
export default config;
