import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        bg: "var(--bg)",
        surface: "var(--surface)",
        signal: "var(--signal)",
        alert: "var(--alert)",
        text: "var(--text)",
        muted: "var(--muted)",
      },
      fontFamily: {
        mono: ["var(--font-plex-mono)", "monospace"],
        sans: ["var(--font-plex-sans)", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
