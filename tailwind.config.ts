import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        void: "var(--void)",
        nebula: {
          start: "var(--nebula-start)",
          end: "var(--nebula-end)",
        },
        ice: "var(--ice)",
        text: "var(--text)",
        muted: "var(--muted)",
      },
      fontFamily: {
        display: ["var(--font-display)", "system-ui", "sans-serif"],
        sans: ["var(--font-body)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "monospace"],
      },
      backgroundImage: {
        nebula:
          "linear-gradient(100deg, var(--nebula-start), var(--nebula-end))",
      },
    },
  },
  plugins: [],
};

export default config;
