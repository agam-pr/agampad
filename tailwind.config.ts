import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        "cyber-bg": "#050811",
        "cyber-dark": "#0a0d16",
        "cyber-purple": "#7c3aed",
        "cyber-purple-light": "#a78bfa",
        "cyber-teal": "#0d9488",
        "cyber-teal-light": "#2dd4bf",
        "cyber-rose": "#e11d48",
        "cyber-border": "rgba(255, 255, 255, 0.08)",
      },
      animation: {
        shake: "shake 0.25s ease-in-out double",
        "pulse-slow": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
      },
      keyframes: {
        shake: {
          "0%, 100%": { transform: "translateX(0)" },
          "20%, 60%": { transform: "translateX(-6px)" },
          "40%, 80%": { transform: "translateX(6px)" },
        },
      },
    },
  },
  plugins: [],
} satisfies Config;
