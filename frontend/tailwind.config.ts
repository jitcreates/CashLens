import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#09090b",
        foreground: "#fafafa",
        card: "#141417",
        border: "#27272a",
        accent: {
          emerald: "#10b981",
          rose: "#f43f5e",
          violet: "#8b5cf6",
          blue: "#3b82f6"
        }
      },
    },
  },
  plugins: [],
};
export default config;