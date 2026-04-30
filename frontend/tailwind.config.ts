import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        background: "#f7f8fb",
        foreground: "#172026",
        muted: "#eef1f5",
        "muted-foreground": "#64707d",
        border: "#d9dee7",
        primary: "#176b5b",
        accent: "#d1843b"
      },
      boxShadow: {
        panel: "0 8px 30px rgba(23, 32, 38, 0.08)"
      }
    }
  },
  plugins: []
};

export default config;

